# Admin Dashboard ↔ Fanisi Backend: Data-Layer Gap Analysis

**Status:** The dashboard's UI and auth are integrated (see
[dashboard-integration.md](./dashboard-integration.md)). Its **data layer is
still 100% mock** — every `dashboard/src/lib/data/*` function returns in-memory
data; only `lib/auth.ts` calls the real backend. Wiring the data layer to the
Fanisi API is the remaining work, and the dashboard was built against its **own
assumed API**, which differs from the real backend in several places.

This document is the punch-list for that wiring + the questions the backend team
needs to answer. **None of this is blocking the dashboard from rendering today
(mock + dev-bypass login); it blocks real data.**

## Cross-cutting mismatches (fix once, affects everything)

1. **Pagination envelope.** The dashboard's `paginatedSchema` expects
   `{ data, total, page, pageSize }`. The backend returns
   `{ data, meta: { total, page, limit, totalPages } }`. The dashboard's Zod
   validation will **reject** every real list response until adapted. → Frontend
   fix: align `paginatedSchema` to the `meta` envelope.
2. **Tenant header.** Already added (`x-tenant-slug: mr-uk` on every call). ✅
3. **Role model.** Dashboard uses `VIEWER/EDITOR/ADMIN/SUPER_ADMIN`; backend
   sends `roleSlug` (lowercase). Mapped via `roleFromSlug()` — **needs the real
   admin slug(s) confirmed** (Q1).
4. **Localized fields.** Backend stores `{ en, sw }` objects; the dashboard's
   product/article forms use flat strings. Forms need en/sw inputs (or a
   default-lang convention) on create/edit.

## Per-section coverage

| Dashboard section | Needs | Backend reality | Gap |
|---|---|---|---|
| **Products** (list/create/edit/bulk stock) | product CRUD | `/products` GET/POST/PATCH/DELETE ✅ | Shape mapping: backend `CreateProductDto` (LocalizedDto name, `categoryId`, `media[]`, `variants[].options`, `specs/highlights/characteristics`) ≠ dashboard `productInputSchema` (flat name/model/category/subcategory/variants). Needs a mapper. |
| **Inquiries** (list/detail) | `/inquiries` | `/inquiries` ✅ | List/detail reads currently **403 for non-admin** (CASL bug). Confirm admin role reads fine. |
| **Quotes** (inquiry → quote) | quote builder | `/proformas` (+ `/proformas/{id}/convert`) ✅ | "Quote" = proforma. Map quote builder → CreateProformaDto. |
| **Distributors** (list/detail/approve) | a distributors resource | **No `/distributors` endpoint.** Distributors are `/users` with role `distributor`. | Gap (Q3). Need either a `/distributors` endpoint or `/users?role=distributor` + an approve/verify action. The distributor *provisioning/verification* flow (admin approves a self-registered distributor) has **no documented endpoint**. |
| **Articles / Blog** (list/create/edit) | `/articles` | **No blog/article endpoints exist at all.** | Hard gap (Q4). The whole article-management section has no backend. |
| **Home-page / Landing editor** | landing config | `/site-config`, `/pages`, `/pages/apply-layout`, `/layouts` ✅ | Maps to CMS endpoints; needs shape mapping (landingConfigSchema → site-config/pages). |
| **Notifications** | `/notifications` | `/notifications` ✅ | Maps cleanly. |
| **Dashboard home** (KPIs, quote/orders chart, activity, action items) | `/dashboard/overview` | **No aggregation/overview endpoint.** | Gap (Q5). Either add a backend `/dashboard/overview`, or compute KPIs client-side from several endpoints (more calls, slower). |
| **Auth / profile** | `/auth/login`, `/auth/profile` | ✅ wired | Confirm admin login path (Q2). |

## Questions for the backend team

- **Q1. Admin role slug(s).** What `roleSlug` does the seeded tenant admin
  (`admin@mruk.com`) have — `admin`, `super_admin`, something else? Any `editor`/
  staff roles? (Drives `roleFromSlug()` → dashboard permissions.)
- **Q2. Admin login path.** Do tenant admins log in via `POST /auth/login` with
  `x-tenant-slug: mr-uk` (current wiring), or via `/platform/auth/login`? The
  dashboard manages one tenant (`mr-uk`), so we assume tenant-scoped `/auth/login`.
- **Q3. Distributors management.** Is there (or can there be) a distributors
  endpoint for the admin to **list / view / approve / reject** distributor
  applications? Today only self-registration + admin-provisioning is mentioned,
  with no admin-facing endpoint. What endpoint approves a pending distributor?
- **Q4. Blog / articles.** Is article/blog content in scope for this backend? If
  so, what endpoints? If not, where should the storefront blog + dashboard
  article manager get content? (Currently both are mock.)
- **Q5. Dashboard overview/KPIs.** Can the backend expose an aggregated
  `/dashboard/overview` (revenue, distributor counts, inventory alerts, inquiry
  funnel)? Otherwise we compute it client-side from multiple endpoints.
- **Q6. Product write shape.** Confirm `CreateProductDto`/`UpdateProductDto` is
  the exact admin write contract, incl. how variants/options/media/localized
  fields are submitted, and the response on create (the spec says "the created
  product with its variants" but has no schema).

## Recommended sequencing (once `mr-uk` is seeded)

1. Align `paginatedSchema` to the `meta` envelope + confirm Q1/Q2; get real
   admin login working (turn off dev bypass).
2. Wire the sections that **map cleanly** first: Notifications, Products
   (read), Inquiries/Quotes, Landing/CMS.
3. Resolve the **structural gaps** (Distributors mgmt, Articles, Dashboard
   KPIs) with the backend per Q3–Q5 before wiring those screens.
