# Designhive Admin CMS Upgrade — Deliverables Summary

## What this adds

A custom `/admin` interface for business operations and site settings, sitting
alongside Sanity Studio at `/studio`. Sanity Studio is now the editorial content
workspace only; `/admin` owns pricing, clients, team, orders, messages, contact,
and site settings. Orders and Messages
get bespoke workflow pages; everything else runs through one config-driven
engine (`lib/admin/collections.ts`) so adding a field or a whole new
collection later is a config change, not a new set of pages.

Nothing about the public site, existing auth, existing Sanity schemas
(field names/types), or the Studio Cloudinary upload flow was changed.

## How to review this

1. `npm install`
2. `npx tsc --noEmit` — **this has not been run** (no network access in the
   environment that built this, so `node_modules` was never installed).
   Do this before deploying. I checked every cross-file import/export by
   hand and every field name against your actual schema files, but a real
   type-check is still the right final gate, especially around the
   `useActionState`/`.bind()` server-action typing.
3. `npm run dev`, log into `/admin`, click through a couple of collections.

## Created files

**Engine** (`lib/admin/`): `types.ts`, `collections.ts` (the 14-collection
registry), `serialize.ts` (form ⇄ document), `portable-text.ts`,
`actions.ts` (create/update/delete/singleton Server Actions),
`workflow-actions.ts` (Orders/Messages actions), `require-session.ts`,
`cloudinary-client.ts` (browser upload helper).

**Data access**: `sanity/lib/adminCrud.ts` (generic list/get/create/patch/
delete + reference-option lookups).

**New API route**: `app/api/admin/cloudinary-sign/route.ts` — a second,
admin-session-gated Cloudinary signing endpoint for the custom uploader
(kept separate from `/api/cloudinary/sign`, which Studio still uses
untouched).

**UI** (`components/admin/`): `ui.tsx`, `AdminSidebar.tsx`, `record-form.tsx`,
`data-table.tsx`, `media-fields.tsx`, `social-links-field.tsx`,
`delete-button.tsx`, `collection-list-page.tsx`, `collection-form-page.tsx`,
`orders-table.tsx`, `messages-inbox.tsx`, `order-detail-form.tsx`,
`mark-as-read-on-view.tsx`.

**Routes**: 38 files under `app/admin/(dashboard)/` — list/new/edit for
services (+categories), projects (+categories), blog (+categories),
authors, team, testimonials, clients, pricing, faq; singleton edit for
contact and settings; orders and messages list/detail.

## Modified files

- `app/admin/(dashboard)/layout.tsx` — added the sidebar; auth check
  untouched.
- `app/admin/(dashboard)/page.tsx` — rewritten for Phase 6 metrics
  (services/projects/posts/orders/new-orders/unread-messages/team/
  testimonials counts), keeps the pipeline + recent orders/messages,
  now links through to the new detail pages.
- `components/admin/AdminNav.tsx` — one-line subtitle change.
- `sanity/lib/adminQueries.ts` — added `allOrdersQuery`, `allMessagesQuery`,
  `dashboardCountsQuery`, `ORDER_STATUSES`; added the missing `archived`
  count to `orderStatusCountsQuery` (see note below). No existing export
  was removed or renamed.

## Decisions worth knowing about

- **`archived`, not `cancelled`.** The upgrade brief's hard-coded status
  list said `cancelled`; your live schema (`order.status`) already ships
  `archived`. I kept `archived` rather than silently renaming a production
  enum — happy to add a real `cancelled` value instead/as well if that's
  actually what you want, but that's a schema decision for you to make,
  not one I should make silently.
- **Media stays on `sanity-plugin-cloudinary`.** The custom admin's image
  fields upload through a *new*, admin-session-gated signing route
  (`/api/admin/cloudinary-sign`) and write the identical `cloudinary.asset`
  shape Studio uses — so a document edited in `/admin` today is still
  fully editable in Studio tomorrow, and vice versa.
- **`serviceCategory`/`portfolioCategory` got small admin routes**
  (`/admin/services/categories`, `/admin/projects/categories`) that weren't
  in the original route list — without them, the Category dropdown on
  every Service/Project form would have nothing to select.
- **Richtext is deliberately simple.** `body`/`answer` fields render as a
  plain textarea (blank line = new paragraph), reading and writing real
  Portable Text so Studio stays fully compatible — but no bold/links/
  embedded images through this editor. For `blogPost.body` specifically
  (which allows embedded `cloudinary.asset` items inline), saving from
  `/admin` preserves any embedded images already in the post rather than
  dropping them, but it can't let you add or reposition one — use Studio
  for that.
- **Client-side "required" checks are best-effort.** The Sanity schema is
  still the real source of truth; the admin form just gives faster
  feedback before the round-trip.
- Every Server Action re-checks the admin session itself (not just the
  page layout), since a Server Action is directly callable even when the
  page that renders its form is auth-gated.

## Environment variables

**None are new.** Everything reuses what's already in `.env.example`
(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET`, `SANITY_API_WRITE_TOKEN`, `JWT_SECRET`,
`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, the Sanity project vars).

## Sanity migration steps

None required. No schema field was renamed, removed, or restructured — the
admin engine was built to match your existing schemas exactly, not the
other way around. Existing documents work as-is.

## Vercel deployment

No changes to your existing deployment process — same env vars, same
build command. If you haven't already, double check `SANITY_API_WRITE_TOKEN`
and `CLOUDINARY_API_SECRET` are set in the Vercel project (not just
locally), since both are required server-side for the new admin routes to
function.


## Editorial ownership boundary

- **Sanity Studio `/studio`**: Homepage, Services, Service Categories, Portfolio Projects, Portfolio Categories, Blog Posts, Blog Categories, Authors, Testimonials, and FAQs.
- **Custom Admin `/admin`**: Pricing Plans, Clients & Brands, Team Members, Orders, Messages, Contact Information, and Site Settings.
- Business/settings document types remain registered in the Studio schema only because some editorial documents reference them. They are read-only there, and the Studio navigation does not expose them.
- The Sanity Vision/GROQ playground was removed from this production Studio build so the editorial workspace does not provide an extra query surface for non-editorial data.
- The custom admin's content CRUD routes are also guarded server-side; hiding them from the sidebar alone is not the security boundary.
