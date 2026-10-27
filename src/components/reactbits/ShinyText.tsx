import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Sweep period in seconds. Slow enough to read as material, not a beacon. */
  period?: number;
};

/**
 * React Bits "ShinyText" for the entry-package marker.
 *
 * This is the one paint animation on the site: a background-position sweep on
 * a single 11px label. It is confined to the one element that has to attract a
 * glance, and it is disabled outright under reduced motion. Everything else
 * moves with transform and opacity only.
 */
export default function ShinyText({ children, className, period = 6 }: Props) {
  return (
    <span
      className={['shiny-text', className].filter(Boolean).join(' ')}
      style={{ animationDuration: `${period}s` }}
    >
      {children}
    </span>
  );
}
