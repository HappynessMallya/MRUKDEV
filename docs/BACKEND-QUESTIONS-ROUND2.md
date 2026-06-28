> ⚠️ **SUPERSEDED by `INTEGRATION-PLAN.md` (2026-06-28)** — all questions here were answered. Kept for history only.

# MRUK Frontend → Backend: Round-2 questions (post-UPDATE)

**To:** Fanisi Studio backend team
**From:** MRUK storefront + admin-dashboard (Next.js) team
**Re:** Wiring the new auth/refresh, distributor-approval, and Q6a–c endpoints you shipped
**API:** `https://fs-backend-tvk8.onrender.com` · tenant slug **`mr-uk`**

> Thanks for the seeds + the UPDATE batch (refresh tokens, own-data scoping,
> distributor approval, articles, dashboard KPIs). Re-verified: `mr-uk` is live,
> 51 products, R2 images 200. We're wiring the new contracts now. A few exact
> shapes/behaviours we need pinned so we don't guess — grouped by area, **bold =
> blocking us right now.**

---

## A. Auth & refresh tokens (login shape changed under us)

1. **Where does the refresh token live?** Login now returns it in the body
   (`{ accessToken, refreshToken, user }`). Since CORS is now allow-list +
   `credentials:true`, do you *also* set an httpOnly cookie, or is it **body-only
   and the client stores it**? (We'd prefer body-only + we hold it; just confirm
   so we don't double-handle.)
2. **Access-token lifetime now?** Was 7-day. With refresh in place, is the
   *access* token now shorter (so silent-refresh-on-401 actually fires)? Give us
   the access TTL and the refresh TTL (you said ~30d refresh).
3. **Rotation semantics:** is a refresh token **one-time-use** (old one
   invalidated the moment `/auth/refresh` returns a new pair)? If two tabs race a
   refresh, does the second get a 401? We'll serialize refreshes if so.
4. **Failure signal:** what status + body does `/auth/refresh` return when the
   refresh token is **expired/revoked/invalid**? A distinct status (401 vs 403)
   or an error code lets us cleanly force re-login instead of looping.
5. Does `/auth/refresh` need the `x-tenant-slug` header too, or is the tenant
   derived from the token?

## B. Distributor self-registration → PENDING

6. **Exact `POST /auth/register` success body** for a distributor. You quoted
   `{ pendingApproval: true, ... }` — what's in `...`? (a `user` object? an `id`?
   a message?) And the **HTTP status** (201?).
7. **Login attempt by a not-yet-approved distributor** — what status + body?
   (We need to distinguish "pending approval" from "wrong credentials" to show
   the right message. Is there a stable `code`/`message` string we can match?)
8. Same question for a **rejected** distributor logging in — distinguishable
   from pending?

## C. Distributor management (Q6a, admin)

9. **`GET /distributors` response shape** — paginated `{ data, meta }` like the
   rest, or a bare array? What fields per distributor (id, name, email, phone,
   status, createdAt, …)?
10. `status` enum — exactly `pending | approved`, or is there also `rejected`
    (and `suspended`)? What does `GET /distributors` (no `?status`) return —
    all, or only pending?
11. **`POST /distributors/:id/reject`** — does it take a body (e.g.
    `{ reason }`)? Does reject **delete** the user or just mark it? Can a
    rejected distributor be re-approved later?
12. Do approve/reject trigger an **email** to the distributor, or is
    notification on us?

## D. Blog / articles (Q6b)

13. **`GET /articles` envelope** — `{ data, meta }` paginated? Confirm
    localized fields are `{ en, sw }` for `title/excerpt/body`.
14. **`coverImage`** — is it a plain URL string (R2), or a media object? Do
    article images use the **same presign flow** as products
    (`POST /media/presign` → PUT → save publicUrl)?
15. Is there a **`publishedAt`/date** field for ordering the feed, and what's
    the default sort? Is `author` a string or an object (`{ id, name }`)?
16. `?tag=` — exact-match on a tag string in `tags[]`? Case-sensitive?

## E. Dashboard KPIs (Q6c)

17. **`GET /dashboard/overview` auth** — admin Bearer required (yes?). Confirm
    the exact shape you listed is current.
18. `invoices.revenue` — what **units & currency**? Integer minor units
    (cents) or major? TZS? Gross or net?
19. Any **date-range params** (e.g. `?from&to`), or all-time totals only?

## F. Catalog enrichment (the §3 A/B/C decision — leaning C: idempotent upsert)

20. **Is `POST /products` upsert-by-`slug` idempotent**, or do we need `PATCH
    /products/:id` for existing ones? We want a re-runnable `seed-mruk-catalog.ts`
    that enriches the ~22 rich PDPs and leaves the other ~29 seeded products
    intact.
21. Please send / point us at the **current `CreateProductDto` (and the embedded
    `highlights` / `characteristics` / `specs` / `options` / `variants` /
    price shapes)** so our seed validates first try. Is the integration guide's
    contract still accurate post-UPDATE?
22. **Pricing shape:** products are quote-only today. Where does price live
    (variant-level?), what's the field/units/currency, and is a product allowed to
    stay quote-only (no price)?
23. We will confirm the A/B/C choice separately; if we go A (exact parity, you
    clear the 51 first) we'll signal before sending the seed.

## G. CORS origins to allow-list (`CORS_EXTRA_ORIGINS`) — our side of the action item

Please add:
- `http://localhost:3000` (storefront dev)
- `http://localhost:3001` (dashboard dev)
- our Vercel preview + production domains: **<FILL: prod + preview URLs>**

If wildcard preview domains are painful, tell us and we'll pin exact preview URLs.

## H. Categories (minor)

24. `/categories` items now carry `icon`, `image`, `sortOrder`, `isActive`
    (we added these to our types). Confirm `image`/`icon` are R2 URLs and
    `isActive:false` categories are **already filtered out** of public
    `/categories`, or whether we should filter client-side.

---

### Still-open from §5 (no action needed, just tracking)
- Swagger response DTOs — we're using `docs/frontend-integration-guide.md` as the
  contract; flag if it's stale.
- Warm prod instance — still free-tier cold starts; we're designing SSR with
  generous timeouts / ISR meanwhile.
