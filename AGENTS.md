# Agent instructions

This repository is the Mezomite.ai marketing site. `docs/PRD.md` is the source of truth; `docs/DESIGN.md` explains how the design intent maps to code. Read both before changing a component.

## Non-negotiables

- **Tokens only.** Every colour, spacing, radius, shadow, and easing value comes from `src/styles/tokens.css`. A raw hex value in a component is a review failure.
- **No scroll reveals.** Never add an IntersectionObserver that fades content in on scroll. Content must be readable at first paint.
- **Transform and opacity only.** Never animate layout properties. Every animation respects `prefers-reduced-motion`.
- **Two locales or none.** Every route under `src/pages/` needs its counterpart under `src/pages/en/` and an entry in `src/lib/i18n.ts`. Every UI string lives in both copy dictionaries.
- **No secrets.** `.env` and `.dev.vars` are gitignored. Only `PUBLIC_*` values may reach the browser.
- **No client dependency without a reason.** The only runtime dependencies are Astro, `@astrojs/react`, React, and the font packages. Effects are hand-built.

## Commands

```bash
npm run check            # Astro + TypeScript, must be zero errors
npm run check:functions  # Pages Functions against Workers types
npm run build            # static build in dist/
```

Run all three before opening a pull request.

## Where things live

- `src/content/copy/{id,en}.ts` — UI copy. Both files declare `satisfies Copy`, so a missing key fails `npm run check`.
- `src/content/legal/` — legal documents, rendered with a visible draft note until reviewed.
- `src/content/glossary/` — one Markdown file per term, validated by a Zod schema in `src/content.config.ts`.
- `src/data/` — structured content: services, packages, method steps, proof points, schedule, holidays.
- `src/components/sections/` — page sections. The three React islands are `ContactForm.tsx`, `BookingForm.tsx`, and `ConsentBanner.tsx`; everything else is Astro and ships no JavaScript.
- `src/lib/i18n.ts` — the route table. `route()` and `alternateLinks()` are the only places paths should be assembled.
- `functions/api/` — Cloudflare Pages Functions. Shared logic lives in `functions/_shared/`; files and folders beginning with `_` are not routed.
- `db/migrations/` — D1 schema. Migrations are additive and backward compatible for one release.

## Copy rules

- Write each language natively. Indonesian is not a translation of the English draft, and English is not a translation of the Indonesian one.
- No superlatives without evidence, no invented client names, no stock photography.
- A number on the page must be tagged with its source. Placeholder proof points are flagged in `src/data/proof.ts` and must stay flagged until measured.
- Errors say what happened and how to fix it, in that order.

## Backend rules

- Turnstile is verified before validation. Missing configuration fails closed (`503`), never open.
- Every endpoint has a D1-backed rate limit. The limit is per IP and per bucket.
- Write to D1 before sending email. A mail failure marks the row, it does not fail the visitor's request.
- Never log a message body, an email address, or a token.
- Cancellation links carry an HMAC token scoped to one reference and slot.
