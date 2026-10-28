# Brand assets

The mark is client-supplied: `logo-source.jfif` is the original file, a folded-paper
"M" with a square counter on a cream background with a soft drop shadow. It is
versioned here untouched so the derivatives can be rebuilt or re-keyed.

`public/brand/logo-mark.png` is keyed from that source: saturation-based alpha,
un-premultiplied against the sampled background, cropped to the mark, and padded
to a square. Nothing else is stored, because the mark is only ever shown at small
sizes and a 478px source is enough for a 26px header and a 180px touch icon.

| File | Use |
| --- | --- |
| `public/brand/logo-mark.png` | Header and footer wordmark, 24px |
| `public/favicon.png`, `public/favicon-32.png` | Browser tab |
| `public/apple-touch-icon.png` | iOS home screen, opaque cream tile |
| `public/og.png` | Social card, rendered from `scripts/og/og.html` |

The mark's blue and `--accent` (`#0b64bd` light, `#6fb6f5` dark) come from the
same family, so the logo needs no recolouring per theme. Do not tint the mark
with `currentColor`: the two-tone fold is the whole point of the shape.

The wordmark next to the mark is set in Inter at 600, with `.ai` at 500 in
`--text-faint`. It is type, not an image, so it stays crisp at any size and
inherits the theme.

Regenerate the social card after changing the headline, pricing, or mark:

```bash
npm run og
```
