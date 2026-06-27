# Frontend → Backend: Integration Questions & Recommendations

**From:** MRUK public storefront (Next.js) team
**Re:** Integrating the Fanisi Studio API (`https://fs-backend-tvk8.onrender.com`)
**Goal:** Replace local mock JSON with live API data for the public website, safely, without breaking either side.

We pulled the OpenAPI spec from `/docs` and started wiring. A few things block us or are ambiguous. Grouped by priority below. **Section A blocks all work; B is needed for typed integration; C–D before we ship.** Section E is recommendations (small backend fixes that save us both time).

---

## A. Blocking — we can't fetch any live data until these are answered

### A1. What is our tenant slug?
Every tenant-scoped route needs the `x-tenant-slug` header. We tried `mruk` (and several guesses) and all return:

```
GET /products   (x-tenant-slug: mruk)
→ 404 { "message": "Unknown tenant slug: mruk", "error": "Not Found", "statusCode": 404 }
```

- **What is the exact registered slug** for the MRUK storefront on this backend?
- Is the slug **stable across environments** (staging vs prod), or different per environment?

### A2. How is the tenant resolved — header or Host?
Our app currently resolves the tenant from the **Host header** (e.g. `mruk.co.tz`) and stamps `x-tenant-slug` internally.
- Should the frontend **send `x-tenant-slug` explicitly** on every request (our current plan), **or** does the backend resolve the tenant from the request **Host/Origin** automatically?
- If header-based: must it be sent on **every** request, including public reads? (Our probe suggests yes.)

### A3. Is this URL prod or staging?
`fs-backend-tvk8.onrender.com` is on Render. 
- Is this the **production** base URL, or staging? What's the **canonical prod URL** we should ship with?
- Render free tier **cold-starts** (~30–60s after idle). Is there a warm/paid instance for prod? Cold starts will time out our SSR.

---

## B. Response contracts — needed before we can type the integration

> **Biggest gap:** the OpenAPI spec defines **request DTOs but ZERO response schemas.** All 106 responses are prose only (e.g. `201: "The created product with its variants"`). We cannot generate typed models or know what fields the frontend receives.

### B1. Provide response shapes (any one of these works)
In order of preference:
1. **Add response DTOs to Swagger** (`@ApiResponse({ type: XxxDto })` on each handler) — best, lets us auto-generate types.
2. A **JSON sample of a real response** for each storefront endpoint below.
3. A shared Postman/Insomnia collection with saved example responses.

Endpoints we need response shapes for (public read path, priority order):
- `GET /products` (list)
- `GET /products/slug/{slug}` (PDP)
- `GET /products/{id}`
- `GET /categories`
- `GET /tenant/context`
- `GET /site-config`
- `GET /pages` and `GET /pages/{key}`
- `GET /layouts`, `GET /section-catalog`
- `GET /service-locations`

### B2. What is the list/pagination envelope?
`GET /products` accepts `page` + `limit`. Does it return:
- a **bare array** `[ {...} ]`, or
- an **envelope** `{ data: [...], total, page, limit, totalPages }`?

Same question for `/categories`, `/inquiries`, `/invoices`, etc. — is the envelope **consistent across all list endpoints**?

### B3. Localization in responses
DTOs use `LocalizedDto { en, sw }`. In responses:
- Are localized fields **always returned as `{ en, sw }` objects**, or resolved to a single string based on a lang param/header?
- If object: is `sw` always present, or optional?

### B4. Product media — URL format & host
- Are product image URLs **absolute** (`https://bucket.mruk.co.tz/...`) or **relative paths** we must prefix?
- What is the **canonical media host**? (We allowlist image hosts in Next.js config and need the exact domain(s).)

### B5. Category / product relationship
- `GET /products?categoryId=` filters by "subcategory (leaf) ObjectId". Can we also filter by **category slug**, or only ObjectId?
- Does `GET /categories` return a **nested tree** (parent → children) or a **flat list**? Does it include the leaf IDs we'd pass to `categoryId`?

---

## C. Authentication & Distributors

Context: this is a **public storefront**. The admin dashboard is a **separate site** with its own auth. On our side we only need:
- **Public browsing** — no login (catalog, pages, categories). _Please confirm this needs only `x-tenant-slug` and no JWT._
- **Distributor accounts** — distributors will onboard and log in **on this public site**. This is the auth flow we need to build.

### C1. Confirm the public/protected split
Please confirm which of these need a JWT vs only `x-tenant-slug`:
- Public (no JWT?): `GET /products`, `/products/slug/{slug}`, `/categories`, `/pages`, `/site-config`, `/layouts`, `/service-locations`, `/section-catalog`, `/tenant/context`
- Protected (JWT): `/cart`, `/auth/profile`, `/inquiries`, `/invoices`, `/proformas`, `/loyalty/*`, `/notifications`

> The OpenAPI `securitySchemes` only declares a global `bearer` scheme; **individual operations aren't tagged** with `security`, so we can't tell which routes are protected. Please either tag them in Swagger or give us the definitive list.

### C2. Distributor auth flow
- Do distributors register via **`POST /auth/register`** (self-serve), or are they **provisioned by admin** and just log in?
- Is there a **distributor role**? (`/roles` exists, and the tenant config has a `distributorPortal` feature flag.) What role name / permission gates distributor-only data?
- After `POST /auth/login`, what exactly is returned? We need the **token field name(s)** and shape:
  - Access token only, or **access + refresh**?
  - Token **lifetime** (access + refresh expiry)?
  - Any user/role object in the login response?

### C3. Token transport & storage
- Should the token go in the **`Authorization: Bearer <token>` header** (our assumption), or does the backend set/expect an **httpOnly cookie**?
  - For a web app, **httpOnly cookie is safer** (immune to XSS token theft). If you support that, we'd prefer it. Otherwise we'll use the header + careful storage.
- Is there a **refresh endpoint**? We didn't see one in the spec — how should we handle access-token expiry without forcing re-login?

### C4. Distributor-scoped endpoints
- Are there distributor-specific endpoints (pricing tiers, distributor orders, portal data) **not yet in the spec**, or do distributors use the same `/products`, `/invoices`, `/proformas` with role-based filtering?

---

## D. CORS & Infra (before browser calls work)

### D1. CORS allowlist
Browser requests from our origins must be allowed. Please confirm CORS `Access-Control-Allow-Origin` includes:
- `http://localhost:3000` (local dev)
- our **preview/staging** domain(s)
- `https://mruk.co.tz`, `https://www.mruk.co.tz` (prod)

And that **`x-tenant-slug` and `Authorization`** are in `Access-Control-Allow-Headers`, with credentials allowed if cookie-based auth is used.

### D2. Rate limiting / API key
- Beyond `x-tenant-slug`, is any **public API key** required for storefront reads?
- Any **rate limits** we should design around (so SSR/ISR doesn't get throttled)?

### D3. Error format
We observe `{ message, error, statusCode }`. Is this the **consistent error envelope** for all 4xx/5xx? Are validation errors returned with field-level detail?

---

## E. Recommendations (small backend fixes that unblock/help)

1. **Add response DTOs to Swagger** (`@ApiResponse`). This is the single highest-leverage fix — it lets us auto-generate a typed client and removes guesswork (Section B). _Without this, every response field is a guess._
2. **Tag each operation's `security`** in Swagger so public vs protected is explicit (Section C1).
3. **Make `GET /health` public** — it currently returns 401, which breaks uptime monitoring and load-balancer health checks.
4. **Seed a demo tenant + sample products** and share its slug, so frontend dev/CI can run against live data without admin setup.
5. **Document the list/pagination envelope** once and keep it consistent across all list endpoints (Section B2).
6. **Provide a stable, warm prod base URL** (Render free-tier cold starts will break SSR timeouts).
7. **Confirm CORS** for our dev + prod origins now, so we don't hit it late (Section D1).
8. **Add a token-refresh endpoint** (or confirm long-lived tokens) for the distributor flow.

---

## Appendix — what we already have

- **Spec source:** extracted from `https://fs-backend-tvk8.onrender.com/docs` (Swagger UI loads it via JS).
- **Title/version:** Fanisi Studio API v1.0 — "Multi-tenant storefront backend. Tenant-scoped routes require the `x-tenant-slug` header; protected routes require a Bearer JWT."
- **63 paths, 52 request DTOs** documented; **0 response schemas.**
- Full request-side reference generated at `docs/api-reference.md`.
- **Probe evidence:**
  - `GET /health` → `401 Unauthorized`
  - `GET /products` (x-tenant-slug: mruk) → `404 Unknown tenant slug` (i.e. passed auth, failed on slug → suggests public reads need only a valid slug, no JWT).
