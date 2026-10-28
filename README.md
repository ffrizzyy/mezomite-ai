# Mezomite.ai

Bilingual marketing site for **Mezomite.ai**, an audit and digitisation practice in Jakarta. Indonesian is the default language at the domain root, English lives under `/en/`.

The site is built from [`docs/PRD.md`](docs/PRD.md), which is the source of truth for scope, copy rules, design tokens, data model, and acceptance criteria.

- **Framework:** Astro 7, static output, React 19 islands only where a form needs state.
- **Hosting:** Cloudflare Pages, with Pages Functions for the two form endpoints.
- **Data:** Cloudflare D1 (submissions, bookings, consent records, rate limits).
- **Email:** Resend.
- **Bot protection:** Cloudflare Turnstile.
- **Analytics:** Cloudflare Web Analytics, loaded only after consent.

## Quick start

```bash
npm install
cp .env.example .env      # optional; forms mock success locally without it
npm run dev               # http://localhost:4321
```

`npm run dev` does not run Pages Functions. The contact and booking islands detect the resulting 404 in development and show the success state with a mock reference. The server endpoints are exercised with `wrangler pages dev` instead:

```bash
npm run db:local
npx wrangler pages dev ./dist --d1 DB=mezomite-db
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Astro dev server |
| `npm run build` | Static build into `dist/` |
| `npm run preview` | Serve the built site |
| `npm run check` | Astro + TypeScript diagnostics |
| `npm run check:functions` | Type-check the Pages Functions against Workers types |
| `npm run og` | Re-render `public/og.png` from `scripts/og/og.html` |
| `npm run db:local` | Apply `db/migrations/0001_init.sql` to a local D1 database |
| `npm run db:remote` | Apply the migration to the production D1 database |

## Environment

Secrets are set in the Cloudflare Pages dashboard (or `.dev.vars` for Wrangler). Only `PUBLIC_*` values reach the browser.

| Name | Used by | Secret |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile widget | No |
| `TURNSTILE_SECRET_KEY` | `/api/contact`, `/api/booking` | Yes |
| `PUBLIC_CF_ANALYTICS_TOKEN` | Consent-gated analytics beacon | No |
| `PUBLIC_CONTACT_EMAIL` | Copy and mailto links | No |
| `PUBLIC_WHATSAPP_NUMBER` | `wa.me` deep links | No |
| `PUBLIC_WHATSAPP_DISPLAY` | Human-readable phone number | No |
| `RESEND_API_KEY` | Transactional email | Yes |
| `MAIL_FROM` | Sender, verified in Resend | No |
| `MAIL_TO` | Where enquiries land | No |
| `SITE_ORIGIN` | Absolute links in email | No |
| `CANCEL_SECRET` | Signs booking cancellation links | Yes |

Without `TURNSTILE_SECRET_KEY` the endpoints fail closed with `503` rather than accepting unverified submissions.

## API

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/contact` | Validate, verify Turnstile, write a submission, email the firm |
| `GET` | `/api/booking` | Taken slots for the next 14 weekdays |
| `GET` | `/api/booking/slots` | Same data on the documented path, with `?timezone=` |
| `POST` | `/api/booking` | Create a booking, email the visitor and the firm |
| `POST` | `/api/booking/cancel` | Release a slot using the signed link from the confirmation email |

Validation errors return `{ ok: false, field, message, fields }`. The form islands render `fields` per input. A taken slot returns `409`, Turnstile `403`, rate limiting `429`.

`company_size` is a code, not a sentence: one of `1-10`, `11-30`, `31-100`, `101-300`, `300+` (`src/data/company-sizes.ts`). The labels in the select are localised copy; the value posted is the code, and the server rejects anything else. Anything reading D1 should expect the code.

Rate limits live in D1 (`rate_limits` table): 10 per minute per IP for the two forms, 30 per minute for availability, 10 per minute for cancellation.

Email failures do not fail the request: the row is already stored and the visitor keeps a reference. The submission is marked `failed` so it can be resent from the dashboard.

`MAIL_FROM` must be an address on a domain verified in Resend. `onboarding@resend.dev` is the shared test sender: it works without DNS work, but Resend only delivers it to the address on the Resend account. Verify a domain before writing to anyone else.

## Structure

```
src/
  components/
    sections/     Page sections and the three React islands (contact, booking, consent)
    ui/           Button, Badge, Icon, SectionHead
  content/
    copy/         Typed ID/EN dictionaries; structural parity is a type error
    legal/        Privacy, terms, cookie copy
    glossary/     10 terms as a validated content collection
  data/           Services, packages, method, proof points, schedule, holidays
  layouts/        Base.astro: head, JSON-LD, header, footer, consent, spotlight
  lib/            i18n routes, contact links, analytics, Turnstile loader
  pages/          Indonesian routes; pages/en mirrors them
  styles/         tokens, base, components, motion, islands
functions/
  api/            contact, booking, booking/slots, booking/cancel
  _shared/        validation, Turnstile, Resend, availability, rate limiting
db/migrations/    D1 schema
public/           favicon, brand mark, OG image, apple-touch-icon, init.js, _headers
scripts/og/       Social card source and its Chrome renderer
docs/             PRD, design notes, brand notes, decision records
```

## Content

UI strings live in `src/content/copy/id.ts` and `src/content/copy/en.ts`, both declared `satisfies Copy`. Adding a key to one locale without the other fails `npm run check`. Write copy directly in each language; do not translate word for word.

Each glossary entry is Markdown with a Zod schema. A new term appears on both glossary pages automatically.

## Placeholders before launch

These are deliberately visible in the repo and must be resolved by the firm:

- `src/data/proof.ts` sets `PROOF_IS_PLACEHOLDER`. The numbers on the home page are illustrative and must be replaced with measured results or removed.
- `src/content/legal/*` render a visible draft note until a lawyer reviews them.
- `wrangler.toml` carries the id of the live `mezomite-db` D1 database. A fresh environment needs its own database and id.
- `src/data/holidays.json` is conservative. Check it against the official SKB for each year.
- `docs/PRD.md` still carries the original product assumptions. Operational items not yet wired: the weekly retention cron, and the Lighthouse and axe suites. Playwright is wired (`npm run test:e2e`), ESLint/Prettier are not.

## Deploy

The project is already live at <https://mezomite-ai.pages.dev> (project `mezomite-ai`, production branch `main`). To ship a build:

```bash
npm run check && npm run check:functions && npm run build
npx wrangler pages deploy dist --project-name=mezomite-ai --branch=main
```

First-time setup, for a new account or a fork:

1. `npx wrangler pages project create mezomite-ai --production-branch=main`
2. `npx wrangler d1 create mezomite-db`, copy the id into `wrangler.toml`, then `npm run db:remote`.
3. Add the Turnstile, Resend, and `CANCEL_SECRET` values as encrypted variables. Until `TURNSTILE_SECRET_KEY` exists the form endpoints answer `503` by design.
4. Verify the sending domain in Resend and set `MAIL_FROM` to an address on it.

Preview branches serve `Disallow: /` in `robots.txt`; `main` allows crawling and points at the generated sitemap.

The canonical URL is the working deployment, `https://mezomite-ai.pages.dev`, in three places: `site` in `astro.config.mjs`, `SITE_ORIGIN` in `src/lib/contact.ts`, and `SITE_ORIGIN` in `wrangler.toml`. That keeps canonicals, the sitemap, WhatsApp deep links, and the cancellation links in outgoing email pointing at a host that answers. Move all three to `https://mezomite.ai` in the same commit that attaches the domain.

CSP note: `script-src` and `style-src` are emitted by Astro into a per-page `<meta http-equiv="content-security-policy">`, because the island bootstrap is inline and its hash differs per page. Do not add them back to `public/_headers`; a header cannot carry those hashes and the result is a page that renders but never hydrates. Only `frame-ancestors` lives in the header, since meta cannot express it.

## Design and motion

See [`docs/DESIGN.md`](docs/DESIGN.md). Two rules matter more than the rest: every visual value comes from `src/styles/tokens.css`, and nothing animates on scroll. Motion is transform and opacity only, and every animation respects `prefers-reduced-motion`.

## License

Code is MIT (see [`LICENSE`](LICENSE)). Copy, brand assets, and the contents of `docs/` remain the property of Mezomite.ai.
