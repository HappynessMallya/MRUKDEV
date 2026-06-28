# Fanisi Studio API — Full Integration Plan (MRUK & Skywood)

> **AUTHORITATIVE CONTRACT (2026-06-28).** Every endpoint below was tested live on
> production before writing. This document is the source of truth and **supersedes**
> `BACKEND-HANDOFF.md`, `BACKEND-QUESTIONS-ROUND2.md`, and `BACKEND-REPLY-ROUND2.md`
> (kept only for history). For the CMS/pages content model see `CMS-CONTENT-MODEL.md`.

**Base URL (prod):** `https://fs-backend-tvk8.onrender.com` · **no `/api` prefix, no `:4000`** — routes are at the root.
**API docs (Swagger):** `https://fs-backend-tvk8.onrender.com/docs`

This one document serves both storefronts and both admin dashboards. Only the per-tenant values differ:

| | MRUK | Skywood |
|---|---|---|
| Tenant slug | `mr-uk` | `skywood` |
| Public host | `mruk.co.tz` (+ `www.`) | `skywood.co.tz` (+ `www.`) |
| R2 image host | `pub-1c80634c6ca74f99a1583b3d9b57f3de.r2.dev` | `pub-1f283a715c3b4cc2bad484c7713f03f0.r2.dev` |
| Seeded admin | `admin@mruk.com` / `Admin@12345` | `admin@skywood.com` / `Admin@12345` |
| Catalog | 7 categories / 51 products | 6 categories (3-level) / 119 products |

> Architecture: one backend, **separate MongoDB database per tenant**. Every tenant-scoped request carries `x-tenant-slug`; that header selects the database. The two storefronts and the (per-site) admin are independent apps talking to this shared API over HTTP only — no shared code, no DB access.

---

## 0. Conventions
- All tenant-scoped calls send header **`x-tenant-slug: <slug>`**.
- Protected calls also send **`Authorization: Bearer <accessToken>`**.
- **List envelope**: `{ "data": [...], "meta": { "total", "page", "limit", "totalPages" } }`.
- **Localized fields** are `{ "en": "...", "sw": "..." }` — frontend picks the language.
- **Error envelope**: `{ "statusCode", "message", "error?" }`. Validation 400s put field errors in `message` (array). `409` conflict, `404` not-found, `401` auth, `403` forbidden, `429` rate-limit.

---

## 1. Bootstrap — resolve tenant (once per site)
```
GET /tenant/resolve?host=mruk.co.tz
→ 200 { "slug": "mr-uk", "name": "Mr UK", "host": "mruk.co.tz" }
```
Public, **no** `x-tenant-slug`. Normalized (uppercase/`www`/full URL all work). Cache the slug; send as `x-tenant-slug` on every other call.

---

## 2. Authentication

### Login
```
POST /auth/login            (+ x-tenant-slug)
body:  { "email": "admin@mruk.com", "password": "Admin@12345" }   // or { "phone", "password" }
→ 200 { "accessToken", "refreshToken", "user": { "id","name","email","phone","roleSlug" } }
→ 401 { "statusCode":401, "message":"Invalid credentials" }
→ 401 "Account is deactivated"   // e.g. a distributor still pending approval
```
- `accessToken` 7d, `refreshToken` 30d. Send `Authorization: Bearer <accessToken>` on protected calls.
- Roles (`roleSlug`): `admin`, `staff`, `distributor`, `customer`.

### Refresh (silent re-auth on 401)
```
POST /auth/refresh          (+ x-tenant-slug)
body:  { "refreshToken" }
→ 200 { "accessToken", "refreshToken", "user" }   // rotated
→ 401 if expired/invalid
```
(A refresh token used as a Bearer access token is rejected.)

### Profile
```
GET /auth/profile           (Bearer) → 200 { "user": { ...full user, role, loyaltyAccount } }
```

---

## 3. Distributors — self-register → admin approval

**Customers** are active immediately. **Distributors register and stay PENDING until an admin approves** — cannot log in until then.

### 3.1 Self-registration (storefront, public)
```
POST /auth/register         (+ x-tenant-slug)
body: { "name","email","password","role":"distributor","company","region","country" }
→ 201 { "message":"Registration received — your distributor account is pending admin approval.",
        "pendingApproval": true, "user": {...,"roleSlug":"distributor"} }
```
- `role` ∈ {`customer`,`distributor`}. `email` OR `phone` required.
- Pending distributor login → `401 "Account is deactivated"` → show a "pending approval" screen.

### 3.2 Admin reviews & approves (dashboard, admin)
```
GET  /distributors?status=pending|approved|rejected|all&page&limit   (Bearer admin)
→ 200 { data:[ { id,name,email,phone,company,region,country,isActive,status,
                 distributorProfile,createdAt } ], meta }
GET  /distributors/:id                  (Bearer admin) → single
POST /distributors/:id/approve          → 200 { ...,"isActive":true,"status":"approved",
        "distributorProfile":{ "status":"approved","isVerified":true,"verifiedById","verifiedAt" } }
POST /distributors/:id/reject           body: { "reason":"..." }   // optional
→ 200 { ...,"isActive":false,"status":"rejected",
        "distributorProfile":{ "status":"rejected","rejectionReason","rejectedById","rejectedAt" } }
```
After approval the distributor logs in normally. Flow: **list pending → review → approve/reject**.

---

## 4. Products

### 4.1 Public reads (only `x-tenant-slug`)
```
GET /products?page&limit&search&categoryId&brand&isPublished&isFeatured&inStock
→ 200 { data:[Product], meta }
GET /products/slug/{slug}   → 200 Product (404 if missing)
GET /products/{id}          → 200 Product
```
```jsonc
{
  "id","categoryId":"<leaf category id>",
  "name":{"en","sw"},"slug","sku","brand",
  "description":{"en","sw"},"shortDescription":{...},
  "media":[ {"url":"https://pub-….r2.dev/…","type":"image","isPrimary":true} ],
  "variants":[ {"id","title":"Default","price":null,"salePrice":null,"stock":0,"inStock":false,"imageUrl":null} ],
  "specs":[ {"name":{"en","sw"},"value":"200"} ],
  "characteristics":[…], "highlights":[…],
  "documents":[ {"id","url","name","sortOrder"} ],   // §13 downloadable PDFs
  "inStockOverride": null,        // admin flag (4.3)
  "inStock": true,                // COMPUTED — use this for the stock badge
  "priceRange": {"min","max"} | null,
  "isPublished": true,
  "category": { …included ProductCategory… }
}
```
- `search` → matches `name.en`/`name.sw` (case-insensitive). `categoryId` → a **leaf** id from the tree (§5). `price:null` = quote-only (current catalog is quote-based).

### 4.2 Admin write (Bearer admin/staff)
```
POST  /products      CreateProduct (categoryId, name{en,sw}, slug, sku required; rest optional)
PATCH /products/:id  any subset (embedded arrays sent fully REPLACE the stored array)
DELETE /products/:id
```

### 4.3 Stock badge (manual flag — no inventory system)
```
PATCH /products/:id { "inStockOverride": true }    // force In Stock
PATCH /products/:id { "inStockOverride": false }   // force Out of Stock
PATCH /products/:id { "inStockOverride": null }    // auto-derive from variants
```
**Storefront:** read computed boolean **`product.inStock`**. Override wins when set; else derives from variant stock. `GET /products?inStock=true` respects it.

---

## 5. Categories
```
GET /categories   (public)
→ 200 [ { id,name:{en,sw},slug,parentId:null,image,icon,
          children:[ { …subcategory, children:[ …sub-subcategory ] } ] } ]
```
- Bare array (not paginated). Root categories with up to two nested levels (MRUK 2-level, Skywood 3-level).
- Products attach to the **deepest (leaf)** category — pass that leaf `id` to `GET /products?categoryId=`.
- Admin: `POST /categories` (`parentId` omitted → root; set → child), `PATCH`/`DELETE /categories/:id`.

---

## 6. Inquiries — web form + WhatsApp + email

Inquiries are how customers/distributors request products/quotes. The **dashboard is the system of record** — every inquiry is stored via `POST /inquiries`, tagged with its `source`. WhatsApp/email are **click-to-chat handoffs** (no Meta API).

### 6.1 Submit (storefront, public — token attached if logged in)
```
POST /inquiries   (+ x-tenant-slug; Bearer optional → links inquiry to that user)
body: { "contactName","contactEmail","contactPhone","company","message",
        "source":"web",                       // "web" | "whatsapp" | "email" (default web)
        "items":[ {"productId","productName","sku","quantity","notes"} ] }
→ 201 { "id","inquiryNumber":"INQ-20260627-0001","status":"open","source":"web","items":[...] }
```

### 6.2 WhatsApp / email handoff (frontend pattern)
Fetch business contact from **`GET /site-config`** (`contact` block) and on submit do **both**:
1. `POST /inquiries` with matching `source` → dashboard receives it.
2. Open the handoff: **WhatsApp** `https://wa.me/<num>?text=<encoded summary>` (`source:"whatsapp"`) or **Email** `mailto:<email>?subject=…&body=…` (`source:"email"`).

So a "WhatsApp" inquiry still lands in the dashboard (tagged) **and** pings the admin's WhatsApp. No backend WhatsApp/email integration needed.

### 6.3 Admin manages (dashboard, admin/staff)
```
GET    /inquiries?status&page&limit   → { data:[Inquiry], meta }
GET    /inquiries/:id                 → single (with user + linked proformas)
PATCH  /inquiries/:id  { "status":"in_review"|"quoted"|"closed"|"cancelled","assignedToId","internalNotes" }
DELETE /inquiries/:id
```
Lifecycle `open → in_review → quoted → closed` (or `cancelled`). Quoting continues via proformas/invoices (§9). Distributors/customers see only **their own**; admin/staff see all.

---

## 7. Site config
```
GET   /site-config    (public) → { identity,branding,commerce,features,lang,defaultLang,navbar,footer,contact }
PATCH /site-config    (Bearer admin)
```
Business **WhatsApp number** + **email** live in `contact` (storefront reads them for the §6.2 handoff). `features.*` are UI toggles.

---

## 8. Media upload (admin → Cloudflare R2)
```
POST /media/presign   (Bearer admin/staff)  body: { "filename","contentType" }
→ 201 { "uploadUrl","publicUrl","key","expiresIn":300 }
```
1. Presign. 2. `PUT` bytes directly to `uploadUrl` (browser → R2; `Content-Type` matches). 3. Save `publicUrl` via `PATCH /products/:id` (`media:[{ "url":publicUrl,"isPrimary":true }]`). Bytes never pass through the backend; correct per-tenant bucket auto-selected. **Reads:** image URLs are public — allowlist the R2 host in `next.config` `images.remotePatterns`.

---

## 9. Other endpoints
- **Articles / blog** (public read, admin CRUD): `GET /articles?page&limit&tag`, `GET /articles/:slug`; admin `GET /articles/all`, `POST/PATCH/DELETE /articles`. Fields: `title{en,sw}`, `slug`, `excerpt{en,sw}?`, `body{en,sw}`, `coverImage?`, `tags[]`, `author?`, `isPublished`.
- **Proformas / invoices** (admin create from inquiries; own-scoped reads): `GET/POST /proformas`, `POST /proformas/:id/convert` → invoice; `GET/POST /invoices`, `POST /invoices/:id/payment`. Loyalty-tier discounts auto-apply.
- **Dashboard KPIs** (admin/staff): `GET /dashboard/overview?from&to` → `{ products:{total,published}, categories, inquiries:{total}, proformas:{total}, invoices:{total,revenue,grossBilled}, distributors:{total,pending}, customers:{total} }`.
- **Service locations** (public read): `GET /service-locations` → `{ data, meta }`.
- **Notifications / cart / loyalty**: `GET /notifications`, `/cart` (auth), `GET /loyalty/levels|badges` (public), `/loyalty/account` (auth).
- **Pages (CMS)**: `GET /pages`, `GET /pages/{key}` (public), `PATCH /pages/{key}` (admin). See §12 + `CMS-CONTENT-MODEL.md`.

---

## 10. Cross-cutting
- **CORS:** allowlist = tenant public domains + `CORS_EXTRA_ORIGINS` (incl. `localhost:3000/3001` and a Vercel preview wildcard). Headers: `Content-Type, Authorization, x-tenant-slug`; credentials enabled.
- **Rate limiting:** ~120 req/min per IP → `429`. Design SSR/ISR accordingly.
- **Errors:** `409` duplicate slug/sku/email, `404`, `401`, `403` (wrong role / not your record), `400` validation (field array in `message`).
- **Localization:** pick `.en`/`.sw` client-side. **Images:** absolute public R2 URLs.
- **Infra:** Render free tier → cold start (~30–60s after idle); use generous timeouts / ISR until a warm instance is provisioned.

---

## 11. Suggested integration order (lowest risk)
1. Resolve tenant + set `x-tenant-slug`; wire the API client (add `Authorization` for protected calls).
2. **Storefront reads**: products (list/detail/search), categories, site-config, articles → behind the API flag; add R2 host to `next.config`.
3. **Stock badge** from `product.inStock`.
4. **Inquiries**: form → `POST /inquiries` (+ WhatsApp/email handoff from site-config contact).
5. **Auth**: login + silent refresh; distributor self-register → "pending" screen.
6. **Dashboard**: admin login → products/categories/site-config CRUD, media presign upload, inquiries mgmt, distributor approval, KPIs.

Open items (not blocking): Swagger response DTOs (this doc is the contract) and a warm prod instance.

---

## 12. CMS — the dashboard owns the public content (activated)

The public site is content-managed: the dashboard edits the pages, the storefront renders from the API. **Activated on both tenants** (standard ecommerce layout applied).

**Model:** `section-catalog` (editable block types + field contracts) → `layout` (composes blocks) → per-tenant `pages`, each with `sections` whose `content` the admin edits.

**Pages live per tenant** (`GET /pages`): `global` (navbar/whatsappWidget/footer); `home` (hero/promoTech/promoDurable/featured/popular/stories); system pages `productList`/`productDetail`/`cart`/`inquiry`/`comparison` (light `config`).

```
GET   /section-catalog  (public) → { sections:[{type,name,kind,dataSource,fields:FieldDef[]}], systemPages:[{key,configFields}] }
GET   /pages            (public) → [ { key,name,class,path,isPublished, sections:[{key,type,kind,fields,content,enabled,sortOrder}], config } ]
GET   /pages/{key}      (public)
PATCH /pages/{key}      (Bearer admin)
   marketing: { "sections":[ {"key":"hero","content":{…}}, {"key":"stories","enabled":false} ] }
   system:    { "config": { "perPage":12, "showCompare":true } }
   toggle:    { "isPublished": false }
```
- Render the editor form from each section's **`fields`** contract (`localized|string|number|boolean|image|link|array|object`); `content` validated against it (400 on mismatch). Required sections can't be disabled; optional toggle via `enabled`.
- **Storefront** renders Home/pages from `GET /pages` + global chrome/branding from `GET /site-config`.
- Bespoke blocks not in the catalog become CMS-editable only after the **section type is added** to the catalog (small backend change). Reconcile a storefront's real page structure against the catalog to guarantee 100% editability.

---

## 13. Per-product downloadable catalogue (PDF)

Each product can carry files in **`product.documents[]`** — `{ id,url,name?,sortOrder }`. PDP renders a **Download** button per entry (`href=url`, label=`name`).

**Admin upload:** 1. `POST /media/presign { "filename","contentType":"application/pdf","folder":"documents" }` → `{ uploadUrl,publicUrl,key,expiresIn }` (presign now accepts `application/pdf`). 2. `PUT` bytes to `uploadUrl` (`Content-Type: application/pdf`). 3. `PATCH /products/:id { "documents":[{ "url":publicUrl,"name":"Product Catalogue" }] }`. Files live at `documents/<uuid>.pdf` in the tenant bucket.
