# MRUK Frontend → Backend: status + 3 blockers (2026-06-28)

**From:** MRUK storefront team
**To:** Fanisi Studio backend / CMS team
**API:** `https://fs-backend-tvk8.onrender.com` · tenant slug **`mr-uk`**
**Re:** CMS cutover is live for the home page — here's what's done on our side, the
one API quirk we worked around, and the 3 things on your side that unblock the rest.

> **TL;DR.** The storefront home page now renders from the CMS (`GET /pages/home`)
> with real catalog data, and inquiries + auth are wired and verified live. We're
> blocked on **(1)** `/site-config` being mostly empty + shape-divergent, **(2)** a
> `POST /inquiries` validation quirk (worked around, flagging for the contract),
> and **(3)** zero blog articles seeded. Details below, in priority order.

---

## 1. ✅ What's done on our side (verified live)

- **Home is CMS-driven.** `GET /pages/home` → mapped to our section renderer
  (`content`→props, `sortOrder`→order). We populated the empty CMS `content` from
  our existing config via a one-time `PATCH /pages/*` script. Verified: 5 sections
  render (hero, featured, bestQuality, popular, blog).
- **Real catalog data on the home page.** Featured tabs + Popular pull live
  products; we reconciled the home content's **stale demo category slugs** to your
  live taxonomy (see §1.1). Hero CTAs repointed off dead demo product slugs.
- **Inquiries** wired (`POST /inquiries`, source `web`/`whatsapp` + wa.me handoff)
  — verified `201 INQ-…`.
- **Auth** wired (`/auth/login` + `/auth/register` + `/auth/refresh`, tokens in
  localStorage, distributor `pendingApproval` + "Account is deactivated" handling)
  — verified login/refresh/profile 200/201, bad-login 401.

### 1.1 FYI — we mapped these demo→live category slugs (no action needed)
Our home content was authored against the old 4-category demo. We remapped to your
live slugs from `GET /categories`:

| home content (old) | live slug |
|---|---|
| `kitchen` | `kitchen-appliances` |
| `music` | `music-tv` |
| `refrigerator` / `refrigerator-ac` | `refrigerators-freezers` |
| `agriculture` | `agriculture` (already matched) |

Your live catalog is **51 products / 7 categories** (kitchen-appliances 9,
music-tv 10, refrigerators-freezers 14, agriculture 9, generators 6,
washing-machine 2, solar-energy 1). Note there is **no air-conditioning category**,
so the hero "AC" slide CTA now points at `/products` (all) rather than a category.

---

## 2. ⛔ Blocker 1 (P0) — `/site-config` is mostly empty + shape-divergent

We still read branding / navbar / footer / contact from our local static config
because **`GET /site-config` can't replace it yet**. Today it returns:

- **`navbar: {}`** — empty. No links, auth labels, CTA, support link.
- **`footer: {}`** — empty. No columns, legal links, socials, tagline.
- **`contact`** — only `whatsapp`, `email`, `phones[1]`. **Missing `offices[]`,
  `hours`, `visibility`** that our Contact + Service-Locator pages need.
- **`branding.colors`** — keys are **`primary, secondary, accent, background,
  surface, text`**, but our theme tokens are **`primary, background, surface,
  surfaceAlt, border, borderSubtle, foreground, foregroundStrong, muted,
  placeholder`**. The two don't line up, so applying your colors would break the
  theme.
- No `global` wrapper and no `pages` block (we get pages from `/pages` — that's
  fine and expected).

**What we need to switch the storefront to `/site-config`:**

1. **Populate** `site-config.navbar` and `site-config.footer` with the same content
   we already PATCHed into the `global` page's `navbar`/`footer` sections (they're
   currently two separate representations — please confirm which is the source of
   truth, ideally `/site-config`).
2. **Add to `site-config.contact`:** `offices[]` (`{name, address, city, lat, lng,
   phones[]}` localized), `hours` (`{timezone, schedule[]}`), and either keep
   `email` as a single value or give us `emails[]` — tell us which is canonical.
   (Or confirm offices should come from `GET /service-locations` instead, in which
   case we'll read them there.)
3. **Reconcile `branding.colors`** to the full token set above (or tell us the
   intended mapping, e.g. `accent`→which token?). Without the full set we can't
   drive theming from the API.

Until then the storefront keeps using its static config for chrome/branding — no
regression, but the CMS doesn't own those yet.

---

## 3. ⚠️ Blocker 2 (P1) — `POST /inquiries` validation quirk (contract)

Two things differ from what the integration doc implied (we've worked around both,
flagging so the contract/Swagger matches reality):

- **`items` is required to be an array.** Omitting it returns
  `400 {"message":["items must be an array"]}`. The doc shows `items` as optional.
  We now always send `items: []`. → Please mark `items` optional **or** document it
  as required-array.
- **When an item is present, `items[].productId` AND `items[].sku` are required**
  (non-empty strings): sending `{productName}` alone returns
  `400 ["items.0.productId must be a string", "items.0.sku must be a string", …]`.
  The doc lists these as optional. Because our web contact form only has a product
  *slug* (not id+sku), we currently keep the product reference in the `message` and
  send `items: []`. → If you want product-linked inquiries from the storefront,
  either relax the item validation (allow `productName`/`sku`-only) or confirm we
  should fetch id+sku before submitting.

(Not blocking — inquiries work. Just aligning the contract.)

---

## 4. ⚠️ Blocker 3 (P1) — no blog articles seeded

`GET /articles` returns **`total: 0`**. The storefront blog preview + `/blog` index
are wired to `/articles` and fall back to placeholder posts while empty. Please seed
the MRUK articles (same presign flow as product images for `coverImage`). Fields we
read: `title{en,sw}`, `slug`, `excerpt{en,sw}`, `coverImage`, `publishedAt`,
`tags[]`, `author`. Once seeded, the blog goes live with no frontend change.

---

## 5. Smaller / later

- **CMS text pages empty.** `about`, `faq`, `contact`, `service_locator`, `blog`,
  `privacy`, `terms`, `cookies` exist in `/pages` but their `content` is `{}`. Our
  copy for these still lives in components; we'll extract + PATCH it (our side) —
  no action needed from you, just noting they're not CMS-owned yet.
- **`whatsappWidget` content.phone** was empty; we set it to `+255741737373`. It
  duplicates `site-config.contact.whatsapp` — pick one source of truth.
- **Featured tab labels** (e.g. "Refrigerator & AC") still reflect the old taxonomy
  — a copy decision for whoever owns MRUK marketing, editable in the dashboard.

---

## 6. Priority summary

| Priority | Item | Owner |
|---|---|---|
| **P0** | Populate `site-config.navbar`/`footer`; add `contact.offices`/`hours`; reconcile `branding.colors` token set (§2) | Backend |
| **P1** | Align `POST /inquiries` `items` validation/contract (§3) | Backend |
| **P1** | Seed blog articles (§4) | Backend / content |
| — | Confirm source of truth: `site-config.*` vs `pages.global.*` for navbar/footer/whatsapp (§2, §5) | Backend |

**Single most useful action:** populate + shape-align `/site-config` (§2) — that's
the last thing standing between the storefront and a fully CMS-driven site.
