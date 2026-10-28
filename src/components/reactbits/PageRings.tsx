import { useEffect, useState } from 'react';
import MagicRings from './MagicRings';

/**
 * The page background: the vendored MagicRings component, sized to the viewport
 * and pinned behind everything.
 *
 * It exists as a wrapper because MagicRings takes `theme` as a prop and the
 * site's theme is a `data-theme` attribute that can change at any moment. This
 * component reads the attribute, follows it with a MutationObserver, and hands
 * the component the value it needs to pick the right shader path. Without it,
 * a visitor who toggled to light would keep the dark compositing mode and see
 * washed-out rings on white.
 *
 * The colours are the logo's blues, not `--accent`: this is a backdrop, and the
 * mark is the only thing on the page that gets to set the ambient palette.
 */

type Props = {
  className?: string;
};

function currentTheme(): 'dark' | 'light' {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export default function PageRings({ className }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>(currentTheme);
  const light = theme === 'light';

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <MagicRings
      className={className}
      color="#3E8CC0"
      colorTwo="#1B5F8F"
      motion="breathe"
      ringCount={6}
      speed={0.3}
      // The light-mode shader composites ink at a third of the glow and is far
      // quieter than the additive dark path. These values are what makes the two
      // themes read at the same weight rather than the light page looking empty.
      lineThickness={light ? 1.15 : 1}
      glow={light ? 2.6 : 1.6}
      baseRadius={0.42}
      radiusStep={0.13}
      expansion={0.08}
      taper={1.3}
      spin={0.02}
      opacity={light ? 0.8 : 0.55}
      hoverScale={1.02}
      hoverIntensity={0.35}
      parallax={0.015}
      clickBurst={false}
      maxDevicePixelRatio={1.5}
      theme={theme}
    />
  );
}
