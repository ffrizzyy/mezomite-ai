# Design notes

The visual direction is a neutral instrument, not a brochure: white or near-black canvas, hairlines instead of heavy rules, one blue signal, and near-black ink for the action that matters. It should feel like a well-built tool that happens to sell an audit, not a SaaS landing page. These notes explain how that intent becomes code.

## Tokens only

`src/styles/tokens.css` owns every colour, type size, spacing step, radius, shadow, and easing curve. A component with a raw hex value or a pixel spacing value is a defect, with two narrow exceptions:

- a one-off optical adjustment inside a diagram, written as a comment;
- a `clamp()` whose bounds are expressed with tokens.

Light and dark themes both come from the same token names. The theme is applied before first paint by `public/init.js` and stored in `localStorage` under `mz-theme`.

Colour is state and emphasis, never decoration:

| Token | Light | Dark | Job |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#0a0a0b` | Page canvas |
| `--surface` | `#ffffff` | `#121214` | Cards and panels that sit on the canvas |
| `--surface-sunken` | `#fafafa` | `#060607` | Footer, inset rows |
| `--border` | `#e9e9ee` | `#26262c` | Every hairline |
| `--text` | `#0b0b0f` | `#f7f7f8` | Body and headings |
| `--text-muted` | `#5e5e6b` | `#a3a3ad` | Leads, labels, secondary rows |
| `--accent` | `#0b64bd` | `#6fb6f5` | One signal: links, marks, active state |
| `--solid` | `#0f0f12` | `#fafafa` | Primary action, which inverts per theme |

`--panel-bg` and `--panel-fg` drive `.panel--ink`, the one inverted section on a page. Buttons inside it read the panel, never the page, so contrast holds in both themes.

## Type

- **Inter Variable** for everything a reader reads: display, headings, body, labels, buttons. Display sizes carry tight tracking (`--tracking-display`), body copy sits at `1.62` leading.
- **IBM Plex Mono** survives in a narrow role: reference codes, the language switch, day and slot times inside the booking island, diagram indices, and inline `code`. It is never used for headings or marketing labels.
- Uppercase labels are `0.6875rem` with `0.07em` tracking; they lead with a 4px dot (`.label--ticked`), not a rule.
- Line length stays under 72 characters for body copy and under 24 for display headings.
- Numbers a reader might compare (prices, durations, counters) are tabular. Prices use `--font-body`, not mono: the figure should look like type, not a terminal.

## Layout

- `--container: 74rem`, with a single `.container` and consistent gutters.
- Sections are separated by air and one hairline: `.section` draws `border-top`, `.section--flush` removes it on the first section after the header.
- The home hero and page headers carry `.wash`: two soft radial gradients in `--accent` at 4–7% that separate the first screen from the rest. No grid, no texture, no corner ticks.
- Cards use `--radius-l`, buttons `--radius-s`, pills `--radius-pill`, and the CTA panel `--radius-xl`. Elevation is layered and low contrast (`--shadow-1` to `--shadow-pop`); a card sits a millimetre off the page, not a centimetre.
- Mobile first: the base layout is a single column; the grid appears at `768px` and `1024px`. Nothing hides on mobile that carries meaning; only decorative diagrams collapse.

## Motion

The rules come from Emil Kowalski's writing on interface animation, adapted to a static marketing site:

1. **No scroll reveals.** Content is present and readable immediately. Intersection observers are reserved for the counter and the navigation state, never for opacity-on-scroll.
2. **Transform and opacity only.** No animated `height`, `width`, `top`, or `margin`.
3. **Short and purposeful.** Hover and press feedback run at `140ms`; entrances run at `200–320ms` and only on elements that appear after an interaction (form success, mobile menu, consent panel).
4. **One thing moves.** A button press scales to `0.97`; it does not also move its label, icon, and shadow in different directions.
5. **Easing is asymmetric.** Enter with `--ease-enter`, move with `--ease-standard`, exit with `--ease-exit`. `--ease-spring` is reserved for the checkbox mark, the one place a small overshoot reads as mechanical rather than playful.
6. **Reduced motion is a supported state.** `prefers-reduced-motion: reduce` removes transforms, the spotlight, and the counter, and leaves transitions at `0.01ms`.

## React Bits effects, hand-built

No animation package is installed. Four effects from the React Bits catalogue are reimplemented in the site's own idiom:

| Effect | Where | Implementation |
|---|---|---|
| SplitText | Home hero | `Hero.astro` splits the display line into word spans; CSS staggers `translateY` and opacity once on load. Screen readers get the intact sentence from the heading. |
| CountUp | Proof strip | `ProofStrip.astro` renders the final number in HTML; a tiny script counts from zero only when the strip is visible and motion is allowed. With JS off, the number is already correct. |
| ShinyText | Entry-package badge | A repeating masked gradient sweeps every 4.5s. The gradient's outer stops are `currentColor`, so the label is fully painted on every frame, and reduced motion drops the gradient entirely. |
| MethodFlow | Method diagram | `MethodDiagram.astro` and `MethodFlow.tsx` draw an inline SVG timeline; the connector draws with `stroke-dashoffset` on load and the nodes follow in sequence. |

The spotlight hover on cards and service rows is vanilla JS (`Base.astro`), not an island: a `pointermove` listener writes `--mx` and `--my`, and CSS paints a 7% accent wash. It is disabled for touch and reduced motion.

## Scoped styles and child components

Astro scoped CSS does not reach markup rendered by another component, including `<Icon>`. A rule like `.ticks svg` silently does nothing. Write `.ticks :global(svg)` when a parent needs to size, colour, or position an icon it did not render itself.

## Components

- **Buttons** have four variants (`primary`, `secondary`, `ghost`, `quiet`) and two sizes. Primary is the only solid ink surface in a section, and it inverts with the theme; inside `.panel--ink` it flips back to light-on-dark.
- **Badges** are pills: `--accent` soft for the entry package, `--solid` for emphasis, hairline for neutral status. Uppercase, 11px, never decorative.
- **Section headers** carry an eyebrow, a title, an optional lead, and an optional action. One per section, never nested.
- **Forms** put labels above inputs, errors below, and a summary at the top with links to each field. The submit button announces pending state with a spinner and a text change. The Turnstile slot collapses when no widget mounts.
- **Consent** is a bottom sheet with rounded top corners, not a modal. Rejecting is as easy as accepting, and preferences can be reopened from the footer.

## Accessibility baseline

- WCAG 2.2 AA contrast in both themes, including inside the ink panel and the accent badge.
- One `h1` per page; landmarks for header, main, footer, and the consent dialog.
- Visible focus rings on every interactive element, including inside the dark CTA band.
- Touch targets at least 44 by 44 pixels.
- Form errors are announced with `role="alert"` and connected with `aria-describedby`.
- The language switch is a link with `hreflang`, not a JavaScript toggle that rewrites the page in place.
- Decorative diagrams are `aria-hidden`; the same information is always present as text.

## When changing the direction

Edit the direction statement, the token values, and the component exceptions in one pass. Then run `npm run check`, `npm run check:functions`, and `npm run build`, and compare screenshots at 375, 768, 1280, and 1920 pixels in both themes. A visual change that only looks right at one width or one theme is not finished.
