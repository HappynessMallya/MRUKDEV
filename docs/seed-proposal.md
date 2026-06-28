# End-to-End Seed Proposal — "live CMS == today's hardcoded site"

**Goal:** after flipping the storefront to the API, the site looks and behaves
**exactly as it does now**. To get there, the backend's `mr-uk` database must be
**seeded with the data that is currently hardcoded** in the frontend
(`src/data/products.ts`, `src/data/tenants/mruk.json`, `src/data/blog.ts`).
This is a CMS, so once seeded, admins edit it via the dashboard — the seed is
just the starting snapshot.

This document is a **proposal/spec**, not a run. It states the requirements and
the exact data + mapping to seed. Nothing here changes frontend behavior until
`NEXT_PUBLIC_USE_API=true`.

---

## 0. The one hard blocker

The `mr-uk` tenant is **not seeded on the live database** → every request 404s
"Unknown tenant slug". The backend already has the scripts
(`seed:platform`, `seed:cms`, `seed:tenant`, `seed-from-r2.ts`) and an admin
(`admin@mruk.com`). **They just need to be run against the live DB.** Everything
below assumes that has happened.

---

## 1. Requirements for full end-to-end (what must be true)

| # | Requirement | Source today | Backend target |
|---|---|---|---|
| R1 | Tenant `mr-uk` resolves | — | `seed:tenant` (exists) |
| R2 | Category tree (4 categories + their subcategories) | `CATEGORIES` + `SUBCATEGORIES` in products.ts | `ProductCategory` (2-level) |
| R3 | Full product catalog with rich PDP data | `PRODUCTS` map in products.ts | `Product` (+ embedded media/specs/highlights/…) |
| R4 | Site config: branding, navbar, footer, contact, commerce, features | `mruk.json` | `SiteConfig` |
| R5 | Pages (home sections, legal, faq, etc.) | `mruk.json.pages` | `Page` + applied layout |
| R6 | **Product/category images resolve** | `/public/products/**`, `/categories/**` | see Image Requirement below |
| R7 | Admin login works | — | `admin@mruk.com`, role confirmed |
| R8 | Blog/articles | `blog.ts` | ⚠️ **no backend endpoint** — out of scope until backend adds one |

### Image Requirement (hosting is the backend's choice)
> Every `product.media[].url`, `productVariant.imageUrl`, `category.image/icon`,
> and any CMS image URL returned by the API **must be a working, publicly
> reachable absolute URL**. *Where* the bytes live (R2 bucket, CDN, or the
> storefront's own `/public`) is the backend/ops decision — the frontend only
> requires that (a) the URL resolves and (b) its host is allow-listed in
> `next.config.ts → images.remotePatterns`. The current hardcoded image paths
> (`/products/kitchen/microwave/1.png`, …) can be reused verbatim as long as the
> chosen host serves them at the same relative paths.

---

## 2. Catalog to seed (mirrors the hardcoded data exactly)

**Categories (4)** — `name {en,sw}`, `slug`, `sortOrder`:
`kitchen` (Kitchen Appliances / Vifaa vya Jikoni), `music` (Music Systems /
Mifumo ya Muziki), `refrigerator-ac` (Refrigerators & AC / Friji na Viyoyozi),
`agriculture` (Agricultural Appliances / Vifaa vya Kilimo).

**Subcategories (leaf — products attach here)** — `parentId` → category:
- kitchen → microwaves, blender, air-fryer, cookers, kettles, gas-stove
- music → music-systems
- refrigerator-ac → refrigerator, air-conditioning
- agriculture → water-pumps, generators, pvc-hoses, garden-hoses

**Products (~22)** — the exact SKUs from `products.ts` (p605tmswd, mw-32l-black-2/3,
kt-32l-black/white, sky-43-9wd, sky-50-5bi, sky-32-black-inox, combi-style-no-frost,
sky-10-8i(-2), sky-13-8i(-2), sky-17-3bg, sb-q65c, sp-bookshelf, hp-overear,
ht-surround, ag-water-pump-1-5hp, ag-generator-5kva, ag-solar-3kw, ag-maize-mill).

### Field mapping: hardcoded `Product` → backend `Product`
| Frontend (products.ts) | Backend `Product` | Notes |
|---|---|---|
| `slug` | `slug` (unique) | as-is |
| `id` / `model` | `sku` / `modelNumber` | sku unique; default `MRUK-<slug>` if none |
| `name {en}` | `name {en,sw}` | sw = en when missing (backend wants both) |
| `category` (top) + `sub` (leaf) | `categoryId` = **leaf** subcategory id | product attaches to leaf; parent inferred |
| `images[]` + `listImage` | `media[]` | `listImage` → `isPrimary:true, sortOrder:0`; rest follow; `type:"image"` |
| `featureBullets[]` | `highlights[]` | `text {en,sw}` |
| `highlightIcons[]` (icon+label) | `characteristics[]` | `icon` + `title {en,sw}` ✅ exact fit |
| `specifications[]` (label/value) | `specs[]` | `name {en,sw}`, `value` (string = value.en) |
| `compareSpecs {…}` | `specs[]` rows (keyed) | seed as specs so the compare table reconstructs; OR add `dimensions`/`weight` |
| `colors[]` | `options[] {name:"Color", values}` + `variants[]` | at least one variant required |
| `price {amount,currency}` | `price` + `currency` | omit → quote-only |
| `isAvailable` | `isPublished` / variant stock | |

### ⚠️ One fidelity gap to decide
The rich PDP **characteristic blocks** (`characteristics[]` in products.ts:
title + subtitle + description + image + layout — the long image-with-text
feature sections) have **no matching backend field** (backend `characteristics`
is only icon + title). Options:
- **(a)** Backend adds a richer "feature block" embedded type → full fidelity.
- **(b)** Store each block's copy in `specs`/`description` → data preserved, PDP
  layout simplifies.
- **(c)** Accept that only the hero product (p605tmswd) loses its long feature
  blocks; everything else is unaffected (only it uses them).

Recommend **(c)** for now (smallest change; only one product affected), revisit
(a) if the CMS needs editable feature blocks.

---

## 3. Site config + pages (R4/R5)

Map `mruk.json` → `SiteConfig`: `identity`, `branding` (logos/colors/fonts),
`commerce` (currency/tax/prefixes), `features` (loyalty/whatsapp/serviceLocator…),
`lang`/`defaultLang`, and `navbar`/`footer`/`contact` (stored as JSON — already
the same shape the frontend renders). The `STANDARD_ECOMMERCE` layout in
`seed-cms.ts` already models the MR-UK homepage; apply it to the tenant and fill
page content from `mruk.json.pages` (home sections, legal, faq, contact).

> Until the storefront's `getTenantConfig()` is switched from `mruk.json` to
> `/site-config`, R4/R5 don't affect the live site — so site-config seeding can
> follow the catalog. (That switch is a separate, later frontend task.)

---

## 4. How to seed (proposed mechanics)

Reuse the **admin-API write path** (same as `seed-from-r2.ts`): log in as
`admin@mruk.com`, then `POST /categories` and `POST /products`. Two source
options:

- **Minimal (exists):** `seed-from-r2 mr-uk --commit` — derives products from R2
  image filenames. Fast, but products are image+name only → **PDPs look stripped
  vs today.** Not "no changes."
- **Rich mirror (recommended):** a new `seed-mruk-catalog.ts` that reads the
  hardcoded `products.ts` data and POSTs **full** products (specs, highlights,
  characteristics, options, prices) — each `media.url` set per the Image
  Requirement. This is the one that yields "no visible change." I can write it;
  it's ~one script reusing the seed-from-r2 auth/api helpers.

---

## 5. Cutover checklist (once seeded)

1. Backend: run platform/cms/tenant seeds + the rich catalog seed on the **live**
   DB; confirm `GET /products?limit=1` (x-tenant-slug: mr-uk) returns data.
2. Frontend: one real call to verify shapes; tweak `mappers.ts` if needed
   (esp. category slug alignment, compareSpecs).
3. Add the image host to `next.config.ts → images.remotePatterns`.
4. Set `NEXT_PUBLIC_USE_API=true`. Storefront now live, no component changes.
5. Dashboard: `DEV_AUTH_BYPASS=false`, align its `paginatedSchema` to `{data,meta}`.

---

## 6. What I need to proceed building the rich-mirror seed
- **Go-ahead** to write `seed-mruk-catalog.ts` from the hardcoded data (I can do
  this now; it runs later once the tenant is seeded).
- **A decision on the fidelity gap** (§2 — recommend option c).
- From backend/ops (not blocking my writing it): the live DB seeded with the
  tenant + admin, and the agreed image host serving the product images.
