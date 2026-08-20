# DesignHive Homepage — Audit & Rebuild Report

## 1. Audit (before changes)

**Homepage file:** `app/[locale]/page.tsx` (Next.js App Router, locale-prefixed, Sanity-backed).

**Original section order:**
Header → Hero → ClientLogos → Metrics → About → Services → Portfolio → Process →
WhyChooseUs → Testimonials → Pricing → Blog → FaqContact (FAQ + contact form) →
CtaBand → Footer.

### Broken CTA links / missing anchors (confirmed)
- **`#contact` resolved to nothing.** Every CTA across the site (Header, Hero, About,
  Services, Pricing, Portfolio) pointed to `href="#contact"`, but the actual contact
  block's id was `contact-form`, not `contact`. Result: the live URL
  `https://designhive-lac.vercel.app/en#contact` scrolled to nowhere. This was the
  root cause of the reported "contact/contract button is broken" bug.
- **Portfolio CTA was mislabeled and dead-ended.** The only portfolio-section CTA
  defaulted to label "Request Custom Case Study" pointing at the same broken
  `#contact` anchor — there was no "View All Projects" button and **no `/portfolio`
  route existed anywhere in the app** (only `/blog` and `/quote` were real routes).
  This was the root cause of the "portfolio button does not work" bug.
- **`sitemap.ts` listed a route that never existed.** It generated
  `/{locale}/work/{slug}` for every project, but no `app/[locale]/work/[slug]`
  page was ever implemented — a guaranteed soft-404 source for search engines.

### Duplicate / overlapping sections
- None duplicated outright, but `WhyChooseUs` and the founder-credibility block
  inside `Testimonials` covered similar "why trust us" territory. Both were kept
  (per "preserve all content") and repositioned to read as complementary rather
  than redundant.

### SEO issues
- `<title>`, meta description, OG/Twitter tags, canonical URLs, and
  `Organization` + `FAQPage` JSON-LD were already implemented — a good baseline.
- No `WebSite`, `Service`, or `BreadcrumbList` structured data.
- Keyword list was generic/local-only and didn't reflect the target keyword set.
- `sitemap.ts` referenced the nonexistent `/work/[slug]` route (see above).

### Accessibility
- Heading hierarchy was already clean (single `<h1>` in Hero, `<h2>` per
  section). Focus states, `aria-*` attributes, keyboard handling (mobile drawer
  focus trap, FAQ accordion `aria-expanded`/`aria-controls`) were already solid.
- No missing `alt` text found on content images.
- Global `scroll-padding-top` was already set to offset the fixed header, so
  the only real anchor-scrolling defect was the missing `#contact` target above.

### "No blank section" fallback coverage
Already strong across the codebase — nearly every component ships a
`FALLBACK_*` constant so it never renders empty even with zero Sanity data
(Hero, About, Services, Portfolio, Pricing, Testimonials, FaqContact all had
this). Gaps that existed:
- No "Engagement Models" content (Fixed Scope / Retainer / Dedicated Team).
- No dedicated "Founder's Note" voice in the About section (founder data
  existed but only surfaced inside Testimonials as credibility stats).
- Final CTA band had no secondary CTA or direct email link.

## 2. Changes made

### Bug fixes
1. **Contact anchor fixed** — `FaqContact.tsx`: renamed the contact block's id
   from `contact-form` to `contact` (`components/FaqContact.tsx`). Every
   existing `#contact` link across the site now resolves and smooth-scrolls
   correctly, with the header's fixed height already accounted for via global
   `scroll-padding-top`.
2. **Portfolio "View All Projects" fixed** — created a new locale-aware route
   `app/[locale]/portfolio/page.tsx` (own metadata, canonical/alternate tags,
   `BreadcrumbList` JSON-LD, reuses the `Portfolio` component in `showAll`
   mode). Added `allProjectsQuery` to `sanity/lib/queries.ts`. Updated
   `Portfolio.tsx`'s CTA to say "View All Projects" and link to `/portfolio`,
   localized via the existing `localizeHref` helper (so it resolves to
   `/en/portfolio`, `/bn/portfolio`, etc.), using `next/link` instead of a raw
   `<a>`.
3. **Sitemap fixed** — removed the nonexistent `/work/[slug]` entries, added
   real `/portfolio` and `/blog` entries.

### Homepage rebuilt to the mandated flow
`Header → Hero (+ ClientLogos + Metrics as trust signals) → Portfolio →
Services (+ WhyChooseUs) → Process → Pricing (+ Engagement Models) →
Testimonials (+ founder credibility metric) (+ Blog) → About / Founder's Note
→ FAQ + Contact (`FaqContact`) → Final CTA (`CtaBand`) → Footer`.

No existing component was deleted — `ClientLogos`, `Metrics`, `WhyChooseUs`,
and `Blog` (not part of the mandatory 10-section list) were kept and folded
into the closest logically-related mandated section rather than removed, per
"preserve all existing content."

### No-blank-section additions
- `Pricing.tsx`: added an "Engagement Models" strip (Fixed Scope Project /
  Monthly Design Retainer / Dedicated Product Team), each with its own CTA.
- `About.tsx`: added a "Founder's Note" block — eyebrow label, personal
  mission-statement quote, and a signature-style footer (name + role), sitting
  alongside the existing agency-level About content and feature cards.
- `CtaBand.tsx`: rebuilt as the "Final high-conversion CTA" — headline,
  supporting text, primary CTA, **new secondary CTA** ("View Selected
  Projects"), and a **new direct email link**, all locale-aware.
- `Hero.tsx`: fallback H1/CTA copy updated to match the target headline and
  CTA labels ("Book a Free Strategy Call" / "View Selected Projects").

### SEO
- Added `WebSite`, `Service` (with an offer catalog built from live service
  data), and `BreadcrumbList` JSON-LD alongside the existing `Organization`
  and `FAQPage` schema on the homepage; `BreadcrumbList` also added to the new
  `/portfolio` page.
- Expanded the keyword list in `app/[locale]/layout.tsx` to the requested set
  (UI UX agency, web design agency, web development agency, branding agency,
  SEO agency, product design agency, Bangladesh web agency, global digital
  agency, Sanity CMS) alongside the existing local-market keywords.
- `sitemap.ts` now reflects only routes that actually exist.

### Accessibility / performance
- No regressions introduced; all new markup follows the existing patterns
  (semantic sections, `aria-label`s, focus-visible rings, `next/image` with
  explicit `sizes`, lazy-loading below the fold by default).
- Single `<h1>` per route verified (Hero on the homepage; each new/other route
  has exactly one own `<h1>`).

## 3. Files modified / added

**Added**
- `app/[locale]/portfolio/page.tsx`

**Modified**
- `app/[locale]/page.tsx` — section reorder, `locale` passed to `Portfolio`,
  additional JSON-LD, `email` passed to `CtaBand`.
- `app/[locale]/layout.tsx` — expanded SEO keywords.
- `app/sitemap.ts` — removed dead `/work/[slug]` routes, added `/portfolio`
  and `/blog`.
- `sanity/lib/queries.ts` — added `allProjectsQuery`.
- `components/FaqContact.tsx` — fixed contact anchor id (`contact-form` →
  `contact`).
- `components/Portfolio.tsx` — "View All Projects" CTA, locale-aware routing,
  `showAll` mode for the standalone portfolio page.
- `components/CtaBand.tsx` — secondary CTA + email link, locale-aware.
- `components/Hero.tsx` — fallback H1/CTA copy.
- `components/Header.tsx` — nav link order updated to match new section flow.
- `components/About.tsx` — Founder's Note block added.
- `components/Pricing.tsx` — Engagement Models strip added.

## 4. Verification performed in this environment

- `npx tsc --noEmit` — **0 errors**.
- `next build` — **compiles and generates all routes successfully**
  (`/[locale]`, `/[locale]/portfolio`, `/[locale]/blog`, `/[locale]/quote`,
  admin & API routes), including both `bn` and `en` locales, verified with the
  real Sanity project unreachable (sandboxed network) — every data-fetching
  function degraded to its fallback content exactly as designed, with zero
  crashes. The only build failures actually encountered in this sandbox were
  caused by the offline environment itself (no access to Google Fonts or to
  the real Sanity API host) — not by any code defect — and both were confirmed
  resolved by mocking those two external calls for verification purposes only
  (this zip is unmodified by that mocking).
- Manual grep pass confirmed: no remaining `href="#"` dead links anywhere in
  `components/` or `app/`; every `#contact` reference now has a matching
  `id="contact"` target; exactly one `<h1>` per route.

## 5. What to do on your end after deploying

- Set the real environment variables in Vercel (Sanity project id/dataset,
  Cloudinary keys, `SANITY_API_WRITE_TOKEN`, `JWT_SECRET`,
  `ADMIN_PASSWORD_HASH`, `NEXT_PUBLIC_SITE_URL`) — these were intentionally
  blank in the uploaded zip's `.env.local` and are required for the Studio,
  admin dashboard, and quote-form API routes to function.
- Everything else (homepage, portfolio page, blog, quote form marketing
  pages) renders correctly with zero Sanity data thanks to the existing/added
  fallback content, so the site is safe to deploy even before CMS content is
  populated.
