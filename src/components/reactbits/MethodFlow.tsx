import { useEffect, useId, useRef, useState } from 'react';

type Props = {
  /** Accessible name for the diagram. Locale specific, passed from Astro. */
  label: string;
  steps?: string[];
  className?: string;
};

const DEFAULT_STEPS = ['01', '02', '03', '04', '05'];

/**
 * The signature moment on the method page: a blueprint spine that draws once
 * when it enters view, then stops. Nothing loops, nothing follows the scroll.
 *
 * Without JavaScript the diagram is a static drawing, because the visible
 * state is the default and the animation is only attached once the observer
 * fires. That fallback matters: the method page has to read on a printed page.
 */
export default function MethodFlow({ label, steps = DEFAULT_STEPS, className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  const uid = useId().replace(/:/g, '');

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDrawn(true);
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setDrawn(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const x = (index: number) => 40 + index * 140;

  return (
    <svg
      ref={ref}
      className={['flow', drawn ? 'flow--drawn' : '', className].filter(Boolean).join(' ')}
      viewBox="0 0 640 100"
      role="img"
      aria-label={label}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Ruler ticks: the blueprint flavour, drawn as content, not texture. */}
      <g className="flow__ticks" aria-hidden="true">
        {[0, 2, 4].map((row) => (
          <line key={row} x1="20" y1={14 + row * 12} x2="620" y2={14 + row * 12} />
        ))}
      </g>

      <line className="flow__spine" x1="20" y1="52" x2="620" y2="52" aria-hidden="true" />

      <g className="flow__beam" aria-hidden="true">
        <rect x="-28" y="51" width="56" height="2" rx="1" fill={`url(#beam-${uid})`} />
      </g>

      {steps.map((step, index) => (
        <g
          key={step}
          className="flow__node"
          style={{ animationDelay: `${120 + index * 70}ms` }}
          aria-hidden="true"
        >
          <circle className="flow__ring" cx={x(index)} cy="52" r="9" />
          <circle className="flow__dot" cx={x(index)} cy="52" r="3.5" />
          <text className="flow__index" x={x(index)} y="82" textAnchor="middle">
            {step}
          </text>
        </g>
      ))}
    </svg>
  );
}
