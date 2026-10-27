import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: 'id' | 'en';
  /** Milliseconds for the full count. Long counts steal attention from the page. */
  duration?: number;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * React Bits "CountUp", tuned for a page that must not shift.
 *
 * The server renders the final number. On hydration the component only resets
 * to zero if the element is still below the fold, so a number that is already
 * on screen never flashes. A visually hidden final value is always in the DOM
 * for screen readers, which means the animation is decoration, not content.
 */
export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  locale = 'id',
  duration = 900,
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const formatter = new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    maximumFractionDigits: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || typeof IntersectionObserver === 'undefined') return;

    // Already visible at hydration: leave the server value alone.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.95) return;

    setDisplay(0);

    let frame = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const tick = (now: number) => {
          if (start === 0) start = now;
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(value * easeOutExpo(progress));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={['counter', className].filter(Boolean).join(' ')}>
      <span aria-hidden="true">
        {prefix}
        {formatter.format(Math.round(display))}
        {suffix}
      </span>
      <span className="visually-hidden">
        {prefix}
        {formatter.format(value)}
        {suffix}
      </span>
    </span>
  );
}
