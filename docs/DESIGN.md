# Design notes

The visual direction is a working document: paper, ruler, and ink. It should feel like an audit report that happens to be a website, not a SaaS landing page. These notes explain how that intent becomes code.

## Tokens only

`src/styles/tokens.css` owns every colour, type size, spacing step, radius, shadow, and easing curve. A component with a raw hex value or a pixel spacing value is a defect, with two narrow exceptions:

- a one-off optical adjustment inside a diagram, written as a comment;
- a `clamp()` whose bounds are expressed with tokens.

Light and dark themes both come from the same token names. The theme is applied before first paint by `public/init.js` and stored in `localStorage` under `mz-theme`.

## Type

- **Fraunces** for display: section titles and the home hero. One weight, tight leading, slightly negative tracking.
- **Public Sans** for body and UI. 400, 600, 700.
- **IBM Plex Mono** for labels, figures, references, and slot times. Uppercase labels use `letter-spacing` rather than a smaller size.

Line length stays under 72 characters for body copy and under 24 for display headings. Numbers that a reader might compare (prices, durations, reference numbers) are tabular and mono.

## Layout

- `--container: 72rem`, with a single container component and consistent gutters.
- Sections use `--section-y` so vertical rhythm is a token, not a per-page guess.
- Rules and borders are one pixel, low contrast. The grid is visible in the blueprint tone on the home page, method page, and CTA band.
- Mobile first: the base layout is a single column; the grid appears at `768px` and `1024px`. Nothing hides on mobile that carries meaning; only decorative diagrams collapse.

## Motion

The rules come from Emil Kowalski's writing on interface animation, adapted to a static marketing site:

1. **No scroll reveals.** Content is present and readable immediately. Intersection observers are reserved for the glossary filter and the navigation state, never for opacity-on-scroll.
2. **Transform and opacity only.** No animated `height`, `width`, `top`, or `margin`.
3. **Short and purposeful.** Hover and press feedback run at `120–180ms`. Entrances run at `240–420ms` and only on elements that appear after an interaction (form success, mobile menu, consent panel).
4. **One thing moves.** A button press scales the button; it does not also move its label, icon, and shadow in different directions.
5. **Easing is asymmetric.** Enter with `--ease-out`, exit with `--ease-in`. Springs are not used for UI chrome.
6. **Reduced motion is a supported state.** `prefers-reduced-motion: reduce` removes transforms, parallax, and the spotlight, and leaves opacity changes at `1ms`.

## React Bits effects, hand-built

No animation package is installed. Four effects from the React Bits catalogue are reimplemented in the site's own idiom:

| Effect | Where | Implementation |
|---|---|---|
| SplitText | Home hero | `Hero.astro` splits the display line into word spans; CSS staggers `translateY` and opacity once on load. Screen readers get the intact sentence from the heading. |
| CountUp | Proof strip | `ProofStrip.astro` renders the final number in HTML; a tiny script counts from zero only when the strip is visible and motion is allowed. With JS off, the number is already correct. |
| ShinyText | Accent phrase in the CTA band | A masked gradient sweeps once every eight seconds, paused on hover and disabled for reduced motion. |
| MethodFlow | Method diagram | `MethodDiagram.astro` is inline SVG. The connector path draws with `stroke-dashoffset` on load; nodes fade in sequence. |

The spotlight hover on cards and service rows is vanilla JS (`Base.astro`), not an island: a `pointermove` listener writes `--mx` and `--my`, and CSS paints a low-opacity radial gradient. It is disabled for touch and reduced motion.

## Components

- **Buttons** have four variants (`primary`, `secondary`, `ghost`, `quiet`) and two sizes. The primary variant is the only filled dark surface on a page.
- **Badges** are mono, uppercase, and used for status, not decoration.
- **Section headers** carry an eyebrow, a title, an optional lead, and an optional action. One per section, never nested.
- **Forms** put labels above inputs, errors below, and a summary at the top with links to each field. The submit button announces pending state with a spinner and a text change.
- **Consent** is a bottom panel, not a modal. Rejecting is as easy as accepting, and preferences can be reopened from the footer.

## Accessibility baseline

- WCAG 2.2 AA contrast in both themes.
- One `h1` per page; landmarks for header, main, footer, and the consent dialog.
- Visible focus rings on every interactive element, including inside the dark CTA band.
- Touch targets at least 44 by 44 pixels.
- Form errors are announced with `role="alert"` and connected with `aria-describedby`.
- The language switch is a link with `hreflang`, not a JavaScript toggle that rewrites the page in place.

## When changing the direction

Edit the direction statement, the token values, and the component exceptions in one pass. Then rebuild and compare screenshots at 375, 768, 1280, and 1920 pixels. A visual change that only looks right at one width is not finished.
