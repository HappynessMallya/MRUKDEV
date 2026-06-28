> ⚠️ **SUPERSEDED by `INTEGRATION-PLAN.md` (2026-06-28).** Most asks here were
> answered/built (distributor `status`+reason, KPI `from&to`+`grossBilled`, CORS
> preview wildcard). Kept for history only.

# MRUK Frontend → Backend: Round-2 reply (decisions + small-add requests)

**To:** Fanisi Studio backend team
**From:** MRUK storefront + admin-dashboard (Next.js) team
**Re:** Our decisions on your round-2 answers + the handful of small adds we'd like
**API:** `https://fs-backend-tvk8.onrender.com` · tenant slug **`mr-uk`**

> Thanks — answers were exactly what we needed. Below: what we'll do on our side,
> what we'd like you to add (small, prioritized), and the inputs you asked us for.
> **P1 = please do for launch; P2 = nice-to-have, after.**

---

## What we're handling client-side (no backend change needed)
- **Refresh:** storing both tokens (body-only, confirmed), sending `x-tenant-slug`
  on `/auth/refresh`, treating any 401 there as force-re-login. See the access-TTL
  ask below before we wire the *silent*-refresh trigger.
- **Distributor login states:** matching the message strings —
  `"Account is deactivated"` → "pending / not yet approved",
  `"Invalid credentials"` → wrong login. Surfacing the `pendingApproval` message
  after register.
- **Distributor status chip:** deriving from `isActive` + `distributorProfile.isVerified`
  (since there's no status field) for launch.
- **Categories:** filtering `isActive:false` client-side, consuming the tree shape.
- **KPIs:** rendering `invoices.revenue` as TZS major units (sum of `amountPaid`),
  all-time.
- **Articles:** consuming `{data,meta}`, `coverImage` URL string, `publishedAt`
  desc, single exact `?tag`.

## Small adds we'd like (prioritized)

**P1 — please do for launch:**
1. **`JWT_EXPIRES_IN` decision.** As-is (7d access) silent-refresh never fires, so
   refresh is effectively dead. **→ DECISION (MRUK): _<FILL: set 15m access + we
   wire silent-refresh, OR keep 7d and we skip silent-refresh for launch>_.** If
   15m, just set the env value + restart; no code change your side.
2. **Server-side `categories` `isActive:true` filter** (incl. nested children).
   Cheap, and avoids every client filtering a tree. We'll keep our client filter
   until it lands.
3. **CORS wildcard/suffix support** — we use Vercel per-PR preview URLs
   (`*-git-*.vercel.app`, hash-based) which exact-match can't cover. If you add
   suffix matching we're done; otherwise we'll pin a single stable preview alias
   (see origins below).

**P2 — after launch, only if we hit the need:**
4. `PUT` upsert-by-slug for products (turns our re-runnable seed from
   GET→PATCH/POST-per-product into one call). Not blocking — we'll do
   GET-then-PATCH/POST for now (see catalog below).
5. Distributor `status` field + reject `reason` (so we can show "declined" vs
   "awaiting approval" — today they're identical). Launch can live without it.
6. Approve/reject **email** notifications, KPI **date-range** params, a stable
   machine-readable **error `code`** on auth 401s, true rotating/one-time refresh.
   All deferrable.

## Catalog — §3 decision
**→ DECISION (MRUK): _<FILL: A / B / C>_.** Leaning **C (hybrid, idempotent)**:
keep all 51, our `seed-mruk-catalog.ts` does `GET /products/slug/:slug` → PATCH
if found else POST, enriching the ~22 rich PDPs and adding none/duplicating none.
We'll send complete embedded arrays (we noted PATCH replaces them wholesale) and
keep within the strict DTO. **If we switch to A**, we'll signal first so you clear
the 51. Either way we'll quote-only any product without confirmed pricing
(variant `price` omitted).

## CORS origins for `CORS_EXTRA_ORIGINS`
Please add (and restart so the boot-time allowlist picks them up):
- `http://localhost:3000` (storefront dev)
- `http://localhost:3001` (dashboard dev)
- **Prod:** `https://mruk.co.tz`, `https://www.mruk.co.tz` (you said these are
  auto-included — confirm, else add)
- **Storefront prod (Vercel):** _<FILL: e.g. https://mruk.vercel.app>_
- **Dashboard prod (Vercel):** _<FILL: e.g. https://mruk-dashboard.vercel.app>_
- **Stable preview alias(es):** _<FILL, only if you do NOT add wildcard support>_

---

### Tracking (your side, no action from us)
- Warm prod instance — understood, we're on ISR + generous SSR timeouts.
- Swagger DTOs — we're treating the DTOs/services as source of truth over the
  integration guide; will flag specific drift as we hit it.
