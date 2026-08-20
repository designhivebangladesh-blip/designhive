# Designhive — Digital Agency Frontend

A premium, minimalist studio site: dark hero with a spinning 3D hexagon
core, a hexagon service grid, a portfolio grid, and a two-step "Get Quote"
wizard backed by a validated, rate-limited API route.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom gold / ink / parchment theme)
- lucide-react icons
- jose for JWT verification (scaffolded for future protected routes)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in real values
npm run dev
```

Visit `http://localhost:3000` for the marketing site and
`http://localhost:3000/quote` for the quote wizard.

## Structure

```
app/
  layout.tsx            Root layout, fonts, metadata
  page.tsx               Home page (composes sections below)
  globals.css            Design tokens, hexagon utilities, 3D stage, motion
  quote/page.tsx          Quote wizard page
  api/quote/route.ts      POST /api/quote — validated lead intake
components/
  Header.tsx              Nav, dropdown, mobile menu
  Hero.tsx                Hero copy + CTAs
  Hexagon3D.tsx           Signature 3D spinning hexagon (CSS 3D transforms)
  Services.tsx            Hexagon service cards
  Portfolio.tsx           Project grid
  CtaBand.tsx             Closing CTA
  Footer.tsx              Footer
  QuoteForm.tsx           Two-step wizard (client component)
lib/
  types.ts                Shared domain interfaces
  env.ts                  Fail-fast environment schema
  api/
    errors.ts             ApiError + centralized error responses
    validate-quote.ts      Pure validation logic (no transport concerns)
    rate-limit.ts          In-memory per-IP rate limiter
    auth.ts                JWT verification helper for future protected routes
```

## Backend conventions used here

- **Semantic HTTP**: `POST /api/quote` returns `201 Created` on success,
  `422 Unprocessable Entity` with field-level errors on invalid input,
  `429 Too Many Requests` when rate-limited, `401`/`403` reserved for
  authenticated routes, and `405` for disallowed methods on the route.
- **Middleware isolation**: route guards (`applyRouteGuards`, `requireAuth`,
  `assertWithinRateLimit`) are separate functions from business logic
  (`createQuoteRequest`), composed inside the route handler rather than
  interleaved with it.
- **Global error handling**: every route wraps its body in `try/catch` and
  funnels errors through `toErrorResponse`, so the client always gets a
  consistent `{ error: { code, message, details? } }` shape and internals
  never leak.
- **Config isolation**: all secrets/URIs are read once through `lib/env.ts`
  and documented in `.env.example` — nothing reads `process.env` directly
  elsewhere.
- **Swapping in a real database**: replace the `createQuoteRequest` stub in
  `app/api/quote/route.ts` with a pooled client (Prisma + PgBouncer, or a
  serverless-friendly driver like Neon's) — the function signature and the
  rest of the request pipeline don't need to change.

## Design notes

- Color system: `ink` (near-black), `gold` 100–700 (brand gradient), and
  `parchment` (warm cream for light sections) — defined in
  `tailwind.config.ts`.
- Type system: Fraunces (display serif) for headlines, Inter for body,
  IBM Plex Mono for eyebrows/labels/stats — loaded via `next/font/google`
  in `app/layout.tsx`.
- Every interactive element (nav links, buttons, cards, badges) uses the
  `.hover-zoom` / `.hover-zoom-sm` utilities in `globals.css` for a
  consistent hover-scale interaction, and `prefers-reduced-motion` is
  respected globally.


## Studio-style portfolio flood upgrade

The homepage has been redesigned around a centered, editorial hero and a dense visual portfolio wall inspired by the visual rhythm of designhive.studio. The portfolio remains CMS-driven: project cover images, titles, categories, case-study content, and live URLs still come from Sanity/Cloudinary.

Key UI changes:
- Centered, high-impact hero with cleaner CTA hierarchy.
- Portfolio moved directly below the hero to create an image-first first impression.
- Responsive 4/3/2-column visual wall with varied card sizes for the “portfolio flood” effect.
- Hover overlays reveal project category, title, and subtitle without hiding the image.
- Existing category filtering and case-study modal are preserved.
- Mobile layout intentionally uses two columns and compact cards to match the supplied reference screenshot.
- No portfolio data is hard-coded when CMS data exists; fallback projects remain only for empty CMS states.
