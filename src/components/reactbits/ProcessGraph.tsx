import { useEffect, useRef, useState } from 'react';
import type { BufferGeometry, Material, Mesh as ThreeMesh, MeshBasicMaterial as ThreeMeshBasicMaterial } from 'three';

/**
 * The hero's process graph: four stages on one line, with a short pulse
 * travelling along the links so the order reads as a pipeline rather than a
 * list.
 *
 * Decisions that matter:
 * - three is imported dynamically, and only on a screen that can make use of
 *   it. A phone draws the SVG below instead of downloading 150 KB of WebGL for
 *   a decorative strip.
 * - The canvas is decoration. The four stage names are real text underneath, so
 *   the graph is legible without WebGL, without JavaScript, and to a screen
 *   reader. The server-rendered SVG is the same drawing, so nothing jumps when
 *   the canvas takes over.
 * - Canvas cannot read `var(--accent)`, so the palette is read from the tokens
 *   once and re-read when `data-theme` changes. Without that, toggling the
 *   theme would leave a stale blue behind.
 * - prefers-reduced-motion paints one still frame and never starts a loop.
 * - The loop stops when the graph leaves the viewport or the tab is hidden.
 */

type Props = {
  /** Four stage names, locale specific, in pipeline order. */
  labels: string[];
  className?: string;
};

const NODE_X = [-1.02, -0.34, 0.34, 1.02];
const PULSE_PERIOD = 2.8;
const HALF_WIDTH = 1.28;
const FALLBACK_ACCENT = '#0b64bd';
const FALLBACK_EDGE = '#d6d6de';

function readTokens() {
  if (typeof window === 'undefined') return { accent: FALLBACK_ACCENT, edge: FALLBACK_EDGE };
  const style = getComputedStyle(document.documentElement);
  return {
    accent: style.getPropertyValue('--accent').trim() || FALLBACK_ACCENT,
    edge: style.getPropertyValue('--border-strong').trim() || FALLBACK_EDGE,
  };
}

export default function ProcessGraph({ labels, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<(index: number) => void>(() => {});
  const activeRef = useRef(-1);
  const [active, setActiveState] = useState(-1);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = host?.querySelector('canvas');
    if (!host || !canvas) return;
    if (!window.matchMedia('(min-width: 640px)').matches) return;

    let cancelled = false;
    let cleanup = () => {};

    void (async () => {
      let three: typeof import('three');
      try {
        three = await import('three');
      } catch {
        return;
      }
      if (cancelled) return;

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new three.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        return;
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const scene = new three.Scene();
      const camera = new three.OrthographicCamera(-HALF_WIDTH, HALF_WIDTH, 1, -1, 0.1, 10);
      camera.position.z = 5;

      const palette = readTokens();
      const accent = new three.Color(palette.accent);
      const edge = new three.Color(palette.edge);

      const group = new three.Group();
      scene.add(group);

      const disposables: (BufferGeometry | Material)[] = [];
      const rings: ThreeMesh[] = [];
      const cores: ThreeMesh[] = [];
      const hits: ThreeMesh[] = [];

      const points = NODE_X.map((x, index) => new three.Vector3(x, index === NODE_X.length - 1 ? 0.07 : 0, 0));

      const ringMaterial = new three.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.5 });
      const coreMaterial = new three.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.95 });
      const hitMaterial = new three.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const ringGeometry = new three.RingGeometry(0.052, 0.068, 48);
      const coreGeometry = new three.CircleGeometry(0.019, 24);
      const hitGeometry = new three.CircleGeometry(0.11, 16);
      disposables.push(ringGeometry, coreGeometry, hitGeometry, ringMaterial, coreMaterial, hitMaterial);

      points.forEach((point, index) => {
        const ring = new three.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(point);
        group.add(ring);
        rings.push(ring);

        const core = new three.Mesh(coreGeometry, coreMaterial);
        core.position.copy(point);
        group.add(core);
        cores.push(core);

        const hit = new three.Mesh(hitGeometry, hitMaterial);
        hit.position.copy(point);
        hit.userData.index = index;
        group.add(hit);
        hits.push(hit);
      });

      const edgeMaterials: ThreeMeshBasicMaterial[] = [];
      for (let index = 0; index < points.length - 1; index += 1) {
        const from = points[index];
        const to = points[index + 1];
        if (!from || !to) continue;
        const dashed = index === points.length - 2;
        const material = dashed
          ? new three.LineDashedMaterial({ color: edge, transparent: true, opacity: 0.6, dashSize: 0.04, gapSize: 0.035 })
          : new three.LineBasicMaterial({ color: edge, transparent: true, opacity: 0.9 });
        const geometry = new three.BufferGeometry().setFromPoints([from, to]);
        const line = new three.Line(geometry, material);
        if (dashed) line.computeLineDistances();
        group.add(line);
        disposables.push(material, geometry);
        edgeMaterials.push(material as unknown as ThreeMeshBasicMaterial);
      }

      const pulseGeometry = new three.CircleGeometry(0.014, 16);
      disposables.push(pulseGeometry);
      const pulses = points.slice(0, -1).flatMap((from, index) => {
        const to = points[index + 1];
        if (!to) return [];
        const material = new three.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0 });
        disposables.push(material);
        const mesh = new three.Mesh(pulseGeometry, material);
        group.add(mesh);
        return [{ mesh, material, from, to, offset: index / Math.max(1, points.length - 1) }];
      });

      const sway = new three.Vector2();
      const target = new three.Vector2();
      const raycaster = new three.Raycaster();
      const ndc = new three.Vector2();

      const resize = () => {
        // Measure the canvas, not the host: the host also contains the label
        // row, and sizing the drawing to that height stretched the graph over
        // its own labels.
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        const halfHeight = HALF_WIDTH / (width / height);
        camera.left = -HALF_WIDTH;
        camera.right = HALF_WIDTH;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
        camera.updateProjectionMatrix();
      };

      const applyPalette = () => {
        const next = readTokens();
        const nextAccent = new three.Color(next.accent);
        const nextEdge = new three.Color(next.edge);
        ringMaterial.color.copy(nextAccent);
        coreMaterial.color.copy(nextAccent);
        pulses.forEach((pulse) => pulse.material.color.copy(nextAccent));
        edgeMaterials.forEach((material) => material.color.copy(nextEdge));
      };

      const draw = (elapsed: number) => {
        const hover = activeRef.current;
        rings.forEach((ring, index) => ring.scale.setScalar(index === hover ? 1.45 : 1));
        cores.forEach((core, index) => core.scale.setScalar(index === hover ? 1.8 : 1));

        const phase = reduced ? 0.45 : (elapsed / PULSE_PERIOD) % 1;
        pulses.forEach((pulse) => {
          const position = Math.min(Math.max((phase + pulse.offset) % 1, 0.001), 0.999);
          pulse.mesh.position.lerpVectors(pulse.from, pulse.to, position);
          pulse.material.opacity = (reduced ? 0.25 : 0.6) * Math.sin(position * Math.PI);
        });

        group.rotation.y = sway.x * 0.22;
        group.rotation.x = sway.y * 0.15;

        renderer.render(scene, camera);
      };

      let raf = 0;
      let last = 0;
      let elapsed = 0;
      let visible = true;
      let pageVisible = document.visibilityState !== 'hidden';

      const tick = (now: number) => {
        raf = 0;
        const delta = Math.min((now - last) / 1000 || 0, 0.05);
        last = now;
        elapsed += delta;
        sway.lerp(target, 0.07);
        draw(elapsed);
        if (visible && pageVisible && !reduced) raf = requestAnimationFrame(tick);
      };

      const wake = () => {
        if (raf || !visible || !pageVisible) return;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };

      const setActive = (index: number) => {
        if (activeRef.current === index) return;
        activeRef.current = index;
        setActiveState(index);
        if (reduced) draw(elapsed);
        wake();
      };

      const onPointerMove = (event: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        const inside = Math.abs(x) <= 1.1 && Math.abs(y) <= 1.4;
        target.set(inside ? x : 0, inside ? y : 0);

        ndc.set(x, y);
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(hits, false)[0];
        setActive(hit ? Number(hit.object.userData.index ?? -1) : -1);
        wake();
      };

      const onPointerLeave = () => {
        target.set(0, 0);
        setActive(-1);
        wake();
      };

      // The HTML labels under the canvas drive the same highlight, so pointing
      // at a word lights its node.
      hoverRef.current = (index: number) => setActive(index);

      const stage = canvas.parentElement ?? host;
      const resizeObserver = new ResizeObserver(() => {
        resize();
        draw(elapsed);
        wake();
      });
      resizeObserver.observe(stage);

      const intersection = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        if (visible) wake();
      });
      intersection.observe(host);

      const themeObserver = new MutationObserver(() => {
        applyPalette();
        draw(elapsed);
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      const onVisibility = () => {
        pageVisible = document.visibilityState !== 'hidden';
        if (pageVisible) wake();
      };

      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);

      resize();
      draw(elapsed);
      if (!reduced) wake();
      setLive(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersection.disconnect();
        themeObserver.disconnect();
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibility);
        disposables.forEach((item) => item.dispose());
        renderer.dispose();
        hoverRef.current = () => {};
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={['process-graph', className].filter(Boolean).join(' ')}
      data-canvas={live ? 'ready' : 'pending'}
    >
      <div className="process-graph__stage">
        <svg className="process-graph__fallback" viewBox="0 0 320 64" aria-hidden="true" focusable="false">
          <line x1="22" y1="36" x2="116" y2="36" />
          <line x1="116" y1="36" x2="210" y2="36" />
          <line x1="210" y1="36" x2="298" y2="28" className="process-graph__fallback-dash" />
          <circle cx="22" cy="36" r="4.5" />
          <circle cx="116" cy="36" r="4.5" />
          <circle cx="210" cy="36" r="4.5" />
          <circle cx="298" cy="28" r="4.5" className="process-graph__fallback-end" />
        </svg>
        <canvas className="process-graph__canvas" aria-hidden="true" />
      </div>

      <ol className="process-graph__labels">
        {labels.map((label, index) => (
          <li
            key={label}
            data-active={index === active ? 'true' : 'false'}
            onPointerEnter={() => hoverRef.current(index)}
            onPointerLeave={() => hoverRef.current(-1)}
          >
            <span className="process-graph__index">{String(index + 1).padStart(2, '0')}</span>
            <span className="process-graph__label">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
