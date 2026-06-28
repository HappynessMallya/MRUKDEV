# MRUK CMS Content Model — what the dashboard must edit to drive the public site

**To:** Fanisi Studio backend / CMS team
**From:** MRUK storefront team
**Re:** The exact, field-level content the storefront renders, per section and per page, so the dashboard/CMS can manage 100% of the site.
**API:** `https://fs-backend-tvk8.onrender.com` · tenant slug **`mr-uk`**

> **How to read this.** Everything the storefront shows comes from **two CMS surfaces**:
> 1. **`site-config`** — global, always-on: branding, navbar, footer, contact, commerce, features. (One document per tenant.)
> 2. **`pages[]`** — per-page content. The home page is special: it's an **ordered array of typed _sections_** (`pages.home.sections[]`). Other pages are mostly a `texts` blob + SEO.
>
> `{en, sw}` = **localized** (Swahili optional, falls back to `en`). Every user-visible string is localized unless noted. IDs are stable strings the CMS owns (used as React keys + reorder handles).

---

## 0. Your four direct asks — answered first

### A. Home-page section list & the 8 editable blocks

Live home page, **in render order** (`pages.home.sections[]`, sorted by `order`, filtered by `enabled` + `featureFlag`):

| # | Section `type` | Maps to your block | Status |
|---|---|---|---|
| 1 | `hero_carousel` | **Hero carousel** ✅ | Exact fit — but slides carry per-slide `gradient` + `textColor` + multi-line `subtitle` (see §1.1) |
| 2 | `featured_products` | **Featured products** ✅ (extended) | It's a **tabbed** variant: N category tabs, each with its own **category-hero card** + a product grid filtered by category. Needs the tab/hero sub-schema (see §1.2) |
| 3 | `best_quality_showcase` | ⚠️ **NOT one of the 8** | Custom "lifestyle / brand-quality showcase": large image cards (title + subtitle + CTA). **New block type needed** (see §1.3) |
| 4 | `popular_products` | **Product carousel** ✅ | Driven by `source: "tag"` + `sourceValue: "popular"` (see §1.4) |
| 5 | `blog_preview` | **Story / blog grid** ✅ | `source: "latest"`, with a "view all" CTA (see §1.5) |

**Global blocks** (not in `pages.home` — they live in `site-config`, render on every page):
- **Navbar** ✅ → `global.navbar` (§2.1)
- **Footer** ✅ → `global.footer` (§2.2)
- **WhatsApp widget** ✅ → driven by `global.contact.whatsapp` (§2.3)

**Of your 8 blocks, one is defined but UNUSED on the home page today:**
- **Promo banner** — not currently placed. Keep the block type available; we may add it between sections later. Suggested fields in §1.6.

**Net new block types you need to add to the CMS so the dashboard edits 100% of home:**
1. **`best_quality_showcase`** (§1.3) — the only home section with no equivalent in your 8.
2. The **tab + category-hero** extension to `featured_products` (§1.2).

### B. Inquiry handoff (store in `site-config.contact`)

| Field | Value today | Note |
|---|---|---|
| **Business WhatsApp** | `+255741737373` | E.164, no spaces — storefront builds `https://wa.me/255741737373?text=…`. Source of truth: `contact.whatsapp` |
| **Display phone** | `+255 741 737 373` | `contact.phones[0].value` (formatted for display) |
| **Inquiry / general email** | `info@mruk.co.tz` | `contact.emails[0].value` — storefront builds `mailto:` from this |

⚠️ **There is no dedicated sales/inquiry inbox today** — only `info@mruk.co.tz`. If inquiries should route to a separate address (e.g. `sales@mruk.co.tz`), add it as a second `contact.emails[]` entry with a `label` of "Sales/Inquiries" and tell us which one the inquiry form should use. **Also:** every inquiry submitted on the storefront should be **logged to the dashboard** (inquiries module already exists) in addition to the wa.me/mailto handoff — confirm the storefront should `POST` inquiries to an endpoint (we need the route + payload shape).

### C. CORS — origins to allow-list

Add these to the backend allow-list (alongside the prod domains already allowed), with headers `Content-Type, Authorization, x-tenant-slug`:

| Origin | What it is |
|---|---|
| `http://localhost:3000` | Storefront dev server |
| `http://localhost:3001` | Dashboard dev server (multi-zone) |
| `https://mruk.co.tz` | Prod storefront (already allowed) |
| `https://www.mruk.co.tz` | Prod storefront www (already allowed) |
| `https://*.vercel.app` | **Vercel preview/staging deploys** — confirm whether your CORS layer accepts wildcards; if not, we'll send you the **exact** preview project subdomains (e.g. `mruk-storefront-<hash>.vercel.app`, `mruk-dashboard-<hash>.vercel.app`) once the Vercel projects are linked |

> ⚠️ **We owe you the concrete preview URLs.** The wildcard above is the pattern; the exact preview/staging hostnames come from the Vercel projects. We'll confirm them when the projects are provisioned. `credentials:true` is **not** required — the storefront uses Bearer headers, **no cookies**.

### D. Media host — confirmed allow-listed

✅ **Yes.** `next.config.ts → images.remotePatterns` already allow-lists the R2 host and the brand bucket:

```
bucket.mruk.co.tz
*.mruk.co.tz
pub-1c80634c6ca74f99a1583b3d9b57f3de.r2.dev   ← the R2 bucket (mruk-product-images)
images.unsplash.com                            ← TEMPORARY placeholder (music + agriculture mocks); remove once real photos land
```

**Requirement back at you:** every image URL the API returns (`product.media[].url`, `variant.imageUrl`, `category.image/icon`, section image fields, blog `coverImage`) must be an **absolute, publicly reachable HTTPS URL** on one of the hosts above. If you serve from a different R2 public domain, send it and we'll add it.

---

# Part 1 — Home page section blocks (`pages.home.sections[]`)

Every section object has this **envelope**, then a `type`-specific `props`:

```jsonc
{
  "id": "home-001",          // stable, CMS-owned
  "type": "hero_carousel",   // selects the renderer
  "enabled": true,           // hidden when false
  "order": 1,                // ascending sort
  "featureFlag": "blogEnabled", // optional — section hidden if features[flag] is false
  "props": { /* type-specific, below */ }
}
```

## 1.1 `hero_carousel` — Hero carousel
Full-bleed auto-rotating hero. `props`:

| Field | Type | Req | Notes |
|---|---|---|---|
| `autoPlay` | boolean | – | default `true` |
| `autoPlayInterval` | number (ms) | – | default `5500` |
| `slides[]` | array | ✅ | one per slide, below |

**`slides[]` item:**

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | ✅ | |
| `imageUrl` | string (URL) | ✅ | product/hero PNG/SVG, rendered `object-contain` |
| `title` | `{en,sw}` | ✅ | large heading |
| `subtitle` | `{en,sw}` | ✅ | **multi-line** — `\n` splits into primary + secondary lines |
| `cta` | `{ label:{en,sw}, href }` | ✅ | button |
| `gradient` | string (CSS) | ✅ | per-slide background gradient |
| `textColor` | string (hex) | – | default `#FFFFFF`; set dark for light slides |

## 1.2 `featured_products` — Featured products (tabbed, with category heroes)
Tabbed grid: each tab = a category, shows a hero card + a product grid for that category. `props`:

| Field | Type | Req | Notes |
|---|---|---|---|
| `heading` | `{en,sw}` | ✅ | section heading |
| `limit` | number | – | products per tab, default `4` |
| `tabs.enabled` | boolean | ✅ | render the tab row |
| `tabs.items[]` | array | ✅ | one per category tab, below |

**`tabs.items[]` item:**

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | ✅ | |
| `label` | `{en,sw}` | ✅ | tab button text |
| `category` | string | ✅ | **category slug to fetch products by** (`kitchen`, `music`, `refrigerator`, `agriculture`) — this is the query the storefront runs against `/products?category=` |
| `hero` | object | – | category-hero card, below |

**`hero` object:** `{ imageUrl, title:{en,sw}, subtitle:{en,sw}, cta:{ label:{en,sw}, href } }`

> ⚠️ Today the product grid pulls from **mock data keyed by `category`**. Live, it must call the catalog by category slug + `limit`. Confirm `/products?category=<slug>&limit=<n>` (or by `categoryId`) is the call — see open Q3 in BACKEND-HANDOFF.

## 1.3 `best_quality_showcase` — ⚠️ NEW BLOCK TYPE
Brand/lifestyle showcase: a heading + large image cards. **No equivalent in your 8 blocks — please add this type.** `props`:

| Field | Type | Req | Notes |
|---|---|---|---|
| `heading` | `{en,sw}` | ✅ | section heading (e.g. "HOME OF THE BEST QUALITY") |
| `items[]` | array | ✅ | image cards, below |

**`items[]` item:**

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string | ✅ | |
| `imageUrl` | string (URL) | – | full-bleed lifestyle image; gradient fallback if absent |
| `title` | `{en,sw}` | ✅ | card heading |
| `subtitle` | `{en,sw}` | ✅ | card subheading |
| `cta` | `{ label:{en,sw}, href }` | ✅ | link with arrow |

## 1.4 `popular_products` — Product carousel
Heading + a row of products selected by rule. `props`:

| Field | Type | Req | Notes |
|---|---|---|---|
| `heading` | `{en,sw}` | ✅ | |
| `source` | string | – | selection mode — today `"tag"` |
| `sourceValue` | string | – | today `"popular"` → fetch products tagged `popular` |
| `limit` | number | – | default `3` |

> Live, this needs the catalog to support **fetch products by tag** (`tags` contains `sourceValue`). Confirm `/products?tag=popular&limit=3` (or equivalent). Currently mock.

## 1.5 `blog_preview` — Story / blog grid
Latest posts + a "view all" CTA. Gated by `featureFlag: "blogEnabled"`. `props`:

| Field | Type | Req | Notes |
|---|---|---|---|
| `heading` | `{en,sw}` | ✅ | |
| `subtitle` | `{en,sw}` | – | |
| `source` | string | – | today `"latest"` |
| `limit` | number | – | default `2` |
| `cta` | `{ label:{en,sw}, href }` | – | "View all posts" |

> Needs a **blog/articles endpoint** (latest N). Flagged as Q6b in BACKEND-HANDOFF — no backend today.

## 1.6 `promo_banner` — Promo banner (defined, UNUSED on home)
Not placed currently. Suggested `props` for when we add it: `{ heading:{en,sw}, subheading:{en,sw}, imageUrl, background (hex|gradient), cta:{ label:{en,sw}, href }, layout: "left"|"center"|"right" }`.

---

# Part 2 — Global blocks (`site-config` / `global`)

These render on every page and are **already structured** in `mruk.json` — the CMS just needs to expose them. `cms.propagation` says branding/navbar/footer/contact publish **immediately**; pages use **draft→publish**.

## 2.1 `global.navbar` — Navbar
| Field | Type | Notes |
|---|---|---|
| `variant` | string | e.g. `sticky_solid` |
| `showSearch` / `showCart` / `showWishlist` / `showLanguageSwitcher` | boolean | toggles |
| `supportLink` | `{ label:{en,sw}, href }` | |
| `cta` | `{ enabled, label:{en,sw}, href, style }` | header CTA (e.g. "Get a Quote") |
| `auth.signIn` / `auth.signUp` | `{en,sw}` | |
| `auth.userMenu[]` | `{ id, label:{en,sw}, href?, action?, featureFlag? }` | account dropdown; `action:"signout"`; items can be feature-gated (`loyalty`, `wishlist`) |
| `links[]` | `{ id, label:{en,sw}, href, megaMenu }` | primary nav; `megaMenu` is null today (mega-menu data would attach here) |

## 2.2 `global.footer` — Footer
| Field | Type | Notes |
|---|---|---|
| `variant` | string | `dark_columnar` |
| `brand.tagline` | `{en,sw}` | |
| `brand.socials` | `{ instagram, tiktok, … }` | URL per network |
| `brand.contactDisplay` | string[] | which contact fields to show (`phones`, `emails`) |
| `columns[]` | `{ id, title:{en,sw}, links[]:{ id, label:{en,sw}, href, featureFlag? } }` | link columns |
| `bottomBar.copyright` | `{en,sw}` | |
| `bottomBar.legalLinks[]` | `{ id, label:{en,sw}, href }` | privacy/terms/cookies |

## 2.3 `global.contact` — Contact + WhatsApp widget source
| Field | Type | Notes |
|---|---|---|
| `phones[]` | `{ id, value, label:{en,sw} }` | |
| `emails[]` | `{ id, value, label:{en,sw} }` | inquiry/mailto source |
| `whatsapp` | string (E.164) | **drives the floating WhatsApp widget + all wa.me links** |
| `offices[]` | `{ id, isHQ, name:{en,sw}, address:{en,sw}, city:{en,sw}, lat, lng, phones[] }` | feeds Contact + Service Locator pages |
| `hours` | `{ timezone, schedule[]:{ id, days:{en,sw}, open, close, closed } }` | |
| `visibility` | `{ footer[], navbar[], homepage[], contact[] }` | which contact fields show where |

## 2.4 Other `site-config` blocks (already structured)
- **`identity`** — companyName, legalName, domain, slug, tinNumber, poweredBy.
- **`branding`** — `logos{navbar{light,dark},footer,favicon,og}`, `colors{…11 tokens}`, `gradients{…}`, `fonts{heading,body}`. Colors inject as CSS variables at `:root`.
- **`commerce`** — defaultCurrency, supportedCurrencies, taxRate (0.18), taxLabel{en,sw}, paymentMethods[], invoice/proforma/receipt prefixes, loyaltyPointsRate, loyaltyPointsPerAmount.
- **`features`** — booleans: loyalty, chatbot, whatsapp, distributorPortal, serviceLocator, productComparison, wishlist, reviews, multiCurrency, blogEnabled, careersEnabled. **These gate sections, nav items, and routes** — the CMS must expose them (some are in `cms.lockedFields`).
- **`lang` / `defaultLang`** — `["en","sw"]`, default `en`.

---

# Part 3 — Other pages (`pages[]`)

Each non-home page is SEO + a `texts` blob + `settings`. Below: what content each page shows and where it lives today. **"migrate"** = currently hardcoded in the page component and must move into `pages.<key>.texts` for the CMS to edit it.

| Page (route) | `pages` key | Content source today | What the CMS must hold |
|---|---|---|---|
| **Home** `/` | `home` | ✅ config (`sections[]`) | covered in Part 1 |
| **Product detail** `/products/[slug]` | `product_detail` | ✅ config `texts` + product entity | SEO templates (`titleTemplate` with `{productName}`/`{shortDescription}`), all button/tab labels, `settings{ showRelatedProducts, relatedProductsLimit, showWishlist, showComparison, galleryStyle }` |
| **Product listing** `/products` | `products` | product entity + category meta | mostly functional; category hero text could be CMS (currently thin) |
| **Contact** `/contact` | `contact` | ✅ `global.contact` | uses global contact; map embed currently hardcoded → make `mapEmbedUrl` a field |
| **Service locator** `/service-locator` | `service_locator` | `global.contact.offices` + ⚠️ hardcoded heading | **migrate**: eyebrow, heading ("Find a retailer"), description |
| **About** `/about` | _none yet_ ⚠️ | ⚠️ fully hardcoded | **add `pages.about`**: hero title+subtitle, "Who we are" heading + 2 paragraphs, 4 value-props `{icon,title,description}`, 5 category tiles `{label,imageUrl,href}`, "Our Promise" heading + 2 paragraphs |
| **FAQ** `/faq` | `faq` | ⚠️ hardcoded | **migrate**: heading, subtitle, `items[]:{ id, question:{en,sw}, answer:{en,sw} }` (8 today), "need more help" block |
| **Blog list** `/blog` | `blog` | ⚠️ mock `blog.ts` | **migrate**: heading, subtitle; posts from blog entity (Part 4) |
| **Blog post** `/blog/[slug]` | `blog` | ⚠️ mock `blog.ts` | blog entity (Part 4) |
| **Cart** `/cart` | _none_ | ⚠️ hardcoded UI text | optional: empty-state heading/desc, button labels, post-checkout note |
| **Compare** `/compare` | `comparison` | ⚠️ hardcoded | heading, empty-state, `ATTRIBUTES[]` labels (netTotal, dimension, color, energyClass, type) |
| **Privacy** `/privacy` | `legal.privacy` | ⚠️ hardcoded JSX | **migrate**: title, lastUpdated, `sections[]:{ heading, body[] }` |
| **Terms** `/terms` | `legal.terms` | ⚠️ hardcoded JSX | **migrate**: same shape as privacy |
| **Cookies** `/cookies` | `legal` | ⚠️ hardcoded | heading, description, cookie-category copy |
| **Account** `/account/*` | – | user/auth | functional, no CMS content |

**Recommended generic legal/page-content shape** (reuse for privacy, terms, refund, warranty, about):
```jsonc
{ "seo": { "title": {en,sw}, "description": {en,sw}, "ogImage": "url" },
  "texts": {
    "eyebrow": {en,sw}, "title": {en,sw}, "lastUpdated": "May 2026",
    "sections": [ { "id": "s1", "heading": {en,sw},
                    "body": [ { "type": "paragraph"|"bullets", "text": {en,sw} } ] } ] } }
```

---

# Part 4 — Core content entities (recap)

Full field maps live in [seed-proposal.md](seed-proposal.md) and `src/types/api.ts`; condensed here so the CMS has the shape.

### Category / Subcategory (2-level)
- **Category**: `{ id, slug, name:{en,sw}, sortOrder, image?, icon?, isActive }` — 4 today: `kitchen`, `music`, `refrigerator-ac`, `agriculture`.
- **Subcategory** (leaf, products attach here): same + `parentId`. e.g. kitchen → microwaves, blender, air-fryer, cookers, kettles, gas-stove.

### Product (API shape — what the backend returns)
`id, slug, sku, modelNumber?, brand?, categoryId (leaf), name{en,sw}, description{en,sw}?, shortDescription{en,sw}?, currency?, price?, salePrice?, quantity?, isPublished?, isFeatured?, featuredPriority?, isNewArrival?, tags[]?, warranty{en,sw}?, weight?, dimensions?, loyaltyPointsEarned?,`
`media[]{ url, type, altText?, isPrimary?, sortOrder? }, options[]{ name, values[] }, variants[]{ sku?, options[]{name,value}, price?, stock?, imageUrl?, isActive? }, characteristics[]{ icon, title{en,sw} }, highlights[]{ text{en,sw} }, specs[]{ name{en,sw}, value }, documents[]{ url, name }`.

⚠️ **One fidelity gap (decide):** the storefront's richest PDP uses **long feature blocks** (`characteristics[]` with title + subtitle + description + image + layout). Your `Product.characteristics` is only `icon + title`. Only **one** product (`p605tmswd`) uses the rich form. Recommend: accept the loss for that one, or add a richer "feature block" embedded type. (See seed-proposal §2.)

### BlogPost
`{ id, slug, title, excerpt, coverImage, publishedAt (ISO), minRead (number), tags[], author{ name, role?, avatarUrl? }, breadcrumb?{ section, category }, body[] }`
**`body[]` is typed blocks (no HTML):** `{type:"heading",text}`, `{type:"paragraph",text,emphasized?}`, `{type:"image",src,caption?}`, `{type:"quote",text}`. **Recommend localizing `title/excerpt/body.text` as `{en,sw}`** (mock is en-only). ⚠️ No blog endpoint exists yet (Q6b).

---

# Part 5 — Action summary for the backend

| Priority | Item |
|---|---|
| **P0** | Add CMS block type **`best_quality_showcase`** (§1.3) + the **tab/category-hero** extension to `featured_products` (§1.2) so the dashboard edits 100% of the home page |
| **P0** | Store **WhatsApp `+255741737373`** + **inquiry email** in `site-config.contact`; confirm whether inquiries also `POST` to a dashboard endpoint (and give us the route + payload) |
| **P0** | CORS allow-list: `localhost:3000`, `localhost:3001`, prod domains, Vercel preview (wildcard or exact — we'll send exact once linked) |
| **P0** | Confirm catalog supports **fetch-by-category** (`featured_products`) and **fetch-by-tag** (`popular_products`) with `limit` |
| **P1** | Add `pages.about` and migrate FAQ / legal / service-locator / compare hardcoded copy into `pages.<key>.texts` |
| **P1** | Stand up **blog/articles** endpoints (needed by `blog_preview` + `/blog`) |
| **P1** | Decide the **rich feature-block** fidelity gap for `p605tmswd` |
| ✅ | Media host already allow-listed in `next.config` — just return absolute HTTPS URLs on those hosts |
```