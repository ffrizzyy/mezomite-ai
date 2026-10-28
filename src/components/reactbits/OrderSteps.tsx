import { useEffect, useId, useRef, useState } from 'react';
import type { Canvas as FabricCanvas, FabricText, Group as FabricGroup, Rect as FabricRect } from 'fabric';

/**
 * The method page's order diagram, drawn on a fabric canvas so a visitor can
 * pick a step up and drop it somewhere else.
 *
 * The method is a chain: every step consumes the previous step's output. So a
 * drop that changes the order cannot run, and the diagram says why instead of
 * quietly letting the visitor rearrange a promise. Nothing is invented: the
 * five names come from `src/data/method.ts`.
 *
 * Progressive enhancement, in this order:
 * 1. The server renders a real <ol> of the five steps. That is what a reader
 *    without JavaScript, on a phone, or with a screen reader gets.
 * 2. Only a wide screen with a real pointer imports fabric at all. When it has
 *    mounted, the host flips to data-canvas="ready", CSS hides the list and
 *    shows the canvas, and the list stays in the DOM for assistive tech.
 * 3. A drag surface in the middle of a phone page costs more than it gives, so
 *    phones keep the list and never download the library.
 *
 * Colours come from the design tokens at paint time; a canvas cannot read
 * `var()`. The palette is re-read when `data-theme` flips.
 */

type Step = { number: string; title: string };

type Props = {
  steps: Step[];
  title: string;
  hint: string;
  valid: string;
  invalid: string;
  className?: string;
};

const TOKEN_MAP = {
  accent: '--accent',
  border: '--border',
  borderStrong: '--border-strong',
  surface: '--surface',
  surfaceRaised: '--surface-raised',
  text: '--text',
  muted: '--text-muted',
  danger: '--danger',
  body: '--font-body',
  mono: '--font-mono',
} as const;

type Palette = Record<keyof typeof TOKEN_MAP, string>;

const FALLBACK: Palette = {
  accent: '#0b64bd',
  border: '#e9e9ee',
  borderStrong: '#d6d6de',
  surface: '#ffffff',
  surfaceRaised: '#ffffff',
  text: '#0b0b0f',
  muted: '#5e5e6b',
  danger: '#c0362c',
  body: 'Inter Variable',
  mono: 'IBM Plex Mono',
};

function readPalette(): Palette {
  const palette = { ...FALLBACK };
  if (typeof window === 'undefined') return palette;
  const style = getComputedStyle(document.documentElement);
  for (const key of Object.keys(TOKEN_MAP) as (keyof Palette)[]) {
    const value = style.getPropertyValue(TOKEN_MAP[key]).trim();
    if (value) palette[key] = value;
  }
  return palette;
}

const CHIP_HEIGHT = 64;
const GAP = 16;
const PADDING = 24;
const STAGE_HEIGHT = 104;
const REORDER_MS = 190;

export default function OrderSteps({ steps, title, hint, valid, invalid, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleId = useId();
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState<{ tone: 'hint' | 'valid' | 'invalid'; text: string }>({
    tone: 'hint',
    text: hint,
  });

  useEffect(() => {
    const host = hostRef.current;
    const element = canvasRef.current;
    if (!host || !element) return;
    if (!window.matchMedia('(min-width: 640px) and (hover: hover) and (pointer: fine)').matches) return;

    let cancelled = false;
    let cleanup = () => {};

    void (async () => {
      let fabric: typeof import('fabric');
      try {
        fabric = await import('fabric');
      } catch {
        return;
      }
      if (cancelled) return;

      // Fabric measures text with the real font, so wait for it before building
      // chips. A swap afterwards would leave the boxes mis-sized.
      try {
        await document.fonts.ready;
      } catch {
        /* Font Loading API unavailable: fall back to whatever is loaded. */
      }
      if (cancelled) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canvas: FabricCanvas = new fabric.Canvas(element, {
        selection: false,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
      });

      let palette = readPalette();
      let chips: FabricGroup[] = [];
      let frames: { rect: FabricRect; label: FabricText; index: FabricText }[] = [];
      let slots: number[] = [];
      let settleFrame = 0;
      const timers = new Set<ReturnType<typeof setTimeout>>();

      const layout = () => {
        const width = canvas.getWidth();
        const usable = width - PADDING * 2 - GAP * (steps.length - 1);
        const chipWidth = Math.max(usable / steps.length, 72);
        slots = steps.map((_, index) => PADDING + chipWidth / 2 + index * (chipWidth + GAP));

        chips.forEach((chip, index) => {
          chip.set({
            left: slots[index] ?? 0,
            top: STAGE_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
          });
          chip.setCoords();
          const frame = frames[index];
          if (!frame) return;
          frame.rect.set({ width: chipWidth, height: CHIP_HEIGHT });
          frame.index.set({ top: -CHIP_HEIGHT / 2 + 12 });
          frame.label.set({ top: -CHIP_HEIGHT / 2 + 34, width: chipWidth - 20 });
        });

        canvas.requestRenderAll();
      };

      const settle = (chip: FabricGroup, target: number) => {
        cancelAnimationFrame(settleFrame);
        const from = chip.left ?? target;
        if (reduced || Math.abs(from - target) < 0.5) {
          chip.set({ left: target });
          chip.setCoords();
          canvas.requestRenderAll();
          return;
        }
        const started = performance.now();
        const step = (now: number) => {
          const progress = Math.min((now - started) / REORDER_MS, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          chip.set({ left: from + (target - from) * eased });
          chip.setCoords();
          canvas.requestRenderAll();
          if (progress < 1) settleFrame = requestAnimationFrame(step);
        };
        settleFrame = requestAnimationFrame(step);
      };

      const flash = (rect: FabricRect, color: string) => {
        rect.set({ stroke: color, strokeWidth: 1.5 });
        canvas.requestRenderAll();
        const timer = setTimeout(() => {
          rect.set({ stroke: palette.borderStrong, strokeWidth: 1 });
          canvas.requestRenderAll();
          timers.delete(timer);
        }, 1100);
        timers.add(timer);
      };

      const onModified = () => {
        const chip = canvas.getActiveObject() as FabricGroup | null;
        if (!chip) return;
        const index = chips.indexOf(chip);
        if (index < 0) return;

        // The drag state was drawn in accent; the outcome flash paints over it.
        const frame = frames[index];
        if (frame) frame.rect.set({ stroke: palette.borderStrong, strokeWidth: 1 });

        const dropped = chip.left ?? 0;
        let nearest = 0;
        slots.forEach((slot, slotIndex) => {
          if (Math.abs(slot - dropped) < Math.abs((slots[nearest] ?? 0) - dropped)) nearest = slotIndex;
        });

        if (nearest === index) {
          setMessage({ tone: 'valid', text: valid });
          if (frame) flash(frame.rect, palette.accent);
        } else {
          setMessage({ tone: 'invalid', text: invalid });
          if (frame) flash(frame.rect, palette.danger);
        }

        // Either way the drawing returns to the order that can actually run. A
        // second attempt is one drag away, so this is not a dead end.
        settle(chip, slots[index] ?? 0);
      };

      const onMoving = () => {
        const chip = canvas.getActiveObject() as FabricGroup | null;
        if (!chip) return;
        const index = chips.indexOf(chip);
        const frame = frames[index];
        if (frame) frame.rect.set({ stroke: palette.accent, strokeWidth: 1.5 });

        const width = canvas.getWidth();
        const half = (chip.getScaledWidth() || 0) / 2;
        const left = Math.min(Math.max(chip.left ?? 0, half + 12), width - half - 12);
        chip.set({ top: STAGE_HEIGHT / 2, left });
        chip.setCoords();
      };

      const rebuild = () => {
        if (cancelled) return;
        const width = host.clientWidth;
        if (!width) return;
        palette = readPalette();

        cancelAnimationFrame(settleFrame);
        canvas.clear();
        chips = [];
        frames = [];
        slots = [];

        const usable = width - PADDING * 2 - GAP * (steps.length - 1);
        const chipWidth = Math.max(usable / steps.length, 72);

        chips = steps.map((step) => {
          const rect = new fabric.Rect({
            width: chipWidth,
            height: CHIP_HEIGHT,
            rx: 10,
            ry: 10,
            fill: palette.surfaceRaised,
            stroke: palette.borderStrong,
            strokeWidth: 1,
            originX: 'center',
            originY: 'center',
          });
          const indexLabel = new fabric.FabricText(step.number, {
            fontFamily: palette.mono,
            fontSize: 10,
            fill: palette.muted,
            originX: 'center',
            originY: 'center',
            top: -CHIP_HEIGHT / 2 + 12,
            charSpacing: 80,
          });
          const label = new fabric.FabricText(step.title, {
            fontFamily: palette.body,
            fontSize: 13,
            fontWeight: 600,
            fill: palette.text,
            originX: 'center',
            originY: 'center',
            top: -CHIP_HEIGHT / 2 + 34,
            width: chipWidth - 20,
            textAlign: 'center',
            lineHeight: 1.15,
          });

          const group = new fabric.Group([rect, indexLabel, label], {
            left: 0,
            top: STAGE_HEIGHT / 2,
            originX: 'center',
            originY: 'center',
            hasControls: false,
            hasBorders: false,
            lockRotation: true,
            hoverCursor: 'grab',
            objectCaching: false,
            subTargetCheck: false,
          });
          canvas.add(group);
          frames.push({ rect, label, index: indexLabel });
          return group;
        });

        canvas.setDimensions({ width, height: STAGE_HEIGHT });
        layout();
        canvas.requestRenderAll();
        setReady(true);
      };

      const onResize = () => {
        if (!host.clientWidth) return;
        rebuild();
      };

      canvas.on('object:moving', onMoving);
      canvas.on('object:modified', onModified);

      const resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(host);

      const themeObserver = new MutationObserver(() => rebuild());
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      rebuild();

      cleanup = () => {
        cancelAnimationFrame(settleFrame);
        timers.forEach((timer) => clearTimeout(timer));
        timers.clear();
        resizeObserver.disconnect();
        themeObserver.disconnect();
        canvas.off('object:moving', onMoving);
        canvas.off('object:modified', onModified);
        void canvas.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [steps, hint, valid, invalid]);

  return (
    <div
      ref={hostRef}
      className={['order-steps', className].filter(Boolean).join(' ')}
      data-canvas={ready ? 'ready' : 'pending'}
    >
      <p className="label label--ticked" id={titleId}>
        {title}
      </p>

      <ol className="order-steps__fallback" aria-labelledby={titleId}>
        {steps.map((step) => (
          <li key={step.number}>
            <span className="order-steps__fallback-index">{step.number}</span>
            <span className="order-steps__fallback-title">{step.title}</span>
          </li>
        ))}
      </ol>

      <div className="order-steps__stage" aria-hidden="true">
        <canvas ref={canvasRef} />
      </div>

      <p className="order-steps__status" data-tone={message.tone} role="status">
        {message.text}
      </p>
    </div>
  );
}
