> ⚠️ **SUPERSEDED by `INTEGRATION-PLAN.md` (2026-06-28).** Kept for history only.

# MRUK Frontend → Backend: Full Integration Handoff

**To:** Fanisi Studio backend team
**From:** MRUK storefront + admin-dashboard (Next.js) team
**Re:** Everything needed to take the MRUK site fully live against the backend
**API:** `https://fs-backend-tvk8.onrender.com` · tenant slug **`mr-uk`**

> **TL;DR.** The frontend (storefront **and** admin dashboard) is fully built and
> wired to the API — it's waiting on **one thing: the `mr-uk` tenant + catalog
> seeded on the *live* database.** Today every call returns `404 "Unknown tenant
> slug"` because the seeds haven't run on prod. Once seeded with data that
> mirrors our current hardcoded content, we flip a flag and the site is live with
> **no visible change**. Details, the seed spec, confirmations, and a few backend
> fixes/endpoints below, in priority order.

---

## 1. Current state — what's already done on our side

- **Storefront** (public site): typed API client (sends `x-tenant-slug: mr-uk`,
  Bearer where needed, **no cookies** — your CORS is wildcard+credentials-off),
  response types, product/category fetchers, and a mock→API mapper. Live behind a
  flag (`NEXT_PUBLIC_USE_API`) so nothing breaks until you're ready.
- **Admin dashboard**: integrated at **`/dashboard`** (Next.js multi-zone),
  rebranded MRUK. Auth is wired to `POST /auth/login` with `x-tenant-slug: mr-uk`;
  we map your `roleSlug` → dashboard roles. Its **data layer is still mock**
  pending the items in §4–§5.
- **Confirmed from your earlier answers** (thank you) and now relied upon: slug
  `mr-uk`; header-only tenant resolution; list envelope `{ data, meta:{ total,
  page, limit, totalPages } }`; localized fields `{ en, sw }`; public reads need
  only the tenant header; login returns `{ accessToken, user:{…, roleSlug} }`,
  7-day token, no refresh.

**Net:** we are blocked only on data + a few confirmations/fixes — not on contract
discovery.

---

## 2. ⛔ P0 — The one blocker: seed `mr-uk` on the LIVE database

Every route 404s because the live DB has no `mr-uk` tenant. You already have the
scripts and an admin (`admin@mruk.com`). **Please run, against the prod DB the
Render app uses:**

1. `yarn seed:platform`
2. `yarn seed:cms` (registry CMS catalog + `STANDARD_ECOMMERCE` layout)
3. `yarn seed:tenant` (creates tenant `mr-uk`, roles, admin)
4. **Catalog seed** — see §3 (we propose a richer one so PDPs match today).
5. Apply the layout + seed the tenant **site-config** so `/site-config` and
   `/pages` return MRUK branding/nav/footer/contact.

**Acceptance check:** `GET /products?limit=1` with `x-tenant-slug: mr-uk` returns
a product (200), and `GET /site-config` returns MRUK config.

---

## 3. P0 — Catalog seed: make live == today's hardcoded site

Our current site renders from hardcoded data. To avoid any visible change, the
seed must **mirror that data**. Your existing `seed-from-r2.ts` creates **minimal**
products (image + name only) → PDPs would look stripped. 

**Proposal:** we will write a **rich-mirror seed** (`seed-mruk-catalog.ts`) that
logs in as `admin@mruk.com` and `POST`s **full** products via the admin API
(reusing your seed-from-r2 auth/api helpers). You run it on prod. It seeds:

**Categories (4):** kitchen, music, refrigerator-ac, agriculture (each `name
{en,sw}`).
**Subcategories (leaf, products attach here):** kitchen → microwaves, blender,
air-fryer, cookers, kettles, gas-stove · music → music-systems · refrigerator-ac
→ refrigerator, air-conditioning · agriculture → water-pumps, generators,
pvc-hoses, garden-hoses.
**Products (~22):** full data — `name{en,sw}`, `slug`, `sku`/`modelNumber`,
`media[]`, `highlights[]`, `characteristics[]` (icon+title), `specs[]`,
`options[]`+`variants[]`, price/currency, attached to the leaf `categoryId`.

### Image requirement (hosting is YOUR choice)
> Every `product.media[].url`, `variant.imageUrl`, and `category.image/icon`
> the API returns **must be a working, publicly-reachable absolute URL** whose
> host we can allow-list in our `next.config`. **Where** the bytes live — R2
> (`mruk-product-images`), any CDN, or even our storefront `/public` — is up to
> you. The current image paths can be reused as long as the host serves them at
> those paths.

### One fidelity gap to decide (§ needs your call — Q7)
Our richest PDP has long **feature blocks** (title + subtitle + description +
image + layout). Your `Product.characteristics` is only **icon + title**, so
there's no field for these blocks. Only **one** product (`p605tmswd`) uses them.
- **Recommended:** accept the loss for that one product (smallest change).
- **Alternative:** add a richer embedded "feature block" type to `Product` if you
  want these to be CMS-editable.

---

## 4. P1 — Confirmations we need (small, unblock correct wiring)

- **Q1. Admin role slug.** What `roleSlug` does `admin@mruk.com` have — `admin`,
  `super_admin`, other? Any `editor`/staff roles? (Drives dashboard permissions.)
- **Q2. Admin login path.** Confirm tenant admins use `POST /auth/login` +
  `x-tenant-slug: mr-uk` (our wiring), **not** `/platform/auth/login`.
- **Q3. Category filter.** `GET /products` filters by `categoryId` (leaf ObjectId)
  only — confirm no slug filter, and that `GET /categories` returns the leaf ids
  we pass.
- **Q4. Media host.** The concrete domain(s) product/category images will be
  served from (so we set `next.config images.remotePatterns`).
- **Q5. Login response.** Confirm `email` may be absent (phone-only accounts) and
  the exact `user` fields beyond `id/name/email/phone/roleSlug`.

---

## 5. P1/P2 — Backend fixes & missing endpoints

### Already acknowledged — please confirm status
- **CASL own-data bug:** `GET /invoices`, `/proformas`, `/inquiries` 403 for
  distributor/customer roles (conditional `read:own_*` evaluated without a record)
  + no server-side `userId` scoping. Blocks distributor "my orders" screens.
- **`GET /health` returns 401** — add `@Public()` (breaks Render's own health check).
- **CORS:** replace wildcard `enableCors()` with an explicit allow-list incl.
  `http://localhost:3000`, our preview domains, `https://mruk.co.tz`,
  `https://www.mruk.co.tz`; allow headers `Content-Type, Authorization,
  x-tenant-slug`; `credentials:true` only if you adopt cookie auth.
- **Token refresh:** add `/auth/refresh` or confirm 7-day token + re-login.
- **Swagger response DTOs** (`@ApiResponse`) + per-operation `security` tags —
  the spec has request DTOs but **zero response schemas**; we're working from
  inferred shapes.
- **Warm prod instance:** free-tier Render cold-starts (~30–60s) will break our
  SSR timeouts — please provision a warm/paid instance.

### Missing endpoints the admin dashboard needs (P2)
The dashboard was built against an assumed API; these resources **don't exist**:
- **Q6a. Distributor management** — admin endpoints to **list / view / approve /
  reject** distributor applications. Today only self-register + admin-provision is
  mentioned, with no admin-facing endpoint. What approves a pending distributor?
- **Q6b. Blog / articles** — no `/articles` or `/blog` endpoints at all. The
  storefront blog **and** dashboard article manager have no backend. In scope?
- **Q6c. Dashboard overview/KPIs** — no aggregation endpoint. Can you expose
  `/dashboard/overview` (revenue, distributor counts, inventory alerts, inquiry
  funnel), or should we compute it client-side from multiple calls?

### Shape note (FE will adapt, just confirming)
Our dashboard's internal list schema expected `{ data, total, page, pageSize }`;
your real envelope is `{ data, meta:{ total, page, limit, totalPages } }`. We'll
align our side — just confirming `meta` is consistent across **all** paginated
endpoints.

---

## 6. What the frontend does once the above lands

1. One real call to verify response shapes; minor mapper tweaks (category slug
   alignment, compareSpecs).
2. Add the media host to `next.config`.
3. Set `NEXT_PUBLIC_USE_API=true` → storefront live, **no component changes**.
4. Dashboard: `DEV_AUTH_BYPASS=false` (real login), align pagination schema, wire
   the cleanly-mapping sections (Products, Inquiries/Quotes, Notifications, CMS).

---

## 7. Priority summary

| Priority | Item | Owner |
|---|---|---|
| **P0** | Run platform/cms/tenant seeds on live DB (§2) | Backend |
| **P0** | Rich-mirror catalog + site-config seed (§3) | FE writes, Backend runs |
| **P0** | Images reachable via absolute URLs (§3) | Backend/ops |
| **P1** | Confirm Q1–Q5 (§4) | Backend |
| **P1** | CASL fix, `/health` public, CORS, refresh, Swagger DTOs, warm instance (§5) | Backend |
| **P2** | Distributor mgmt / blog / dashboard-KPI endpoints (Q6a–c) | Backend |

**Single most important action:** run the seeds on the live DB (P0). That alone
turns the storefront on. Everything else refines fidelity and unlocks the
dashboard's data screens.
