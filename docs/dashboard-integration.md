# Admin Dashboard Integration (Multi-Zone)

The MRUK admin dashboard lives at **`/dashboard`** on the storefront domain. It
is a separate Next.js app in [`/dashboard`](../dashboard) wired to the storefront
via the Next.js **Multi-Zones** pattern: the storefront proxies every
`/dashboard/*` request to the dashboard app, which runs with
`basePath: '/dashboard'`.

This keeps the two apps fully isolated — separate CSS/theme, `next-auth`,
middleware, and dependencies — so the dashboard looks and behaves exactly as
built, with zero risk to the storefront.

## Architecture

```
                        ┌────────────────────────────┐
  Browser ── /          │  Storefront (this repo root)│  Next 16, port 3000
           ── /products │  next.config.ts: rewrites   │
           ── /dashboard┼──► proxied to dashboard zone │
                        └──────────────┬──────────────┘
                                       │ rewrite /dashboard/:path*
                                       ▼
                        ┌────────────────────────────┐
                        │  Dashboard (./dashboard)     │  Next 16, port 3001
                        │  basePath: '/dashboard'      │  next-auth v5, shadcn
                        │  → /dashboard/api/auth/*      │
                        └──────────────┬──────────────┘
                                       │ Bearer JWT + x-tenant-slug: mr-uk
                                       ▼
                          Fanisi Studio API (fs-backend)
```

- **Storefront** ([next.config.ts](../next.config.ts)) rewrites `/dashboard` and
  `/dashboard/:path*` to `DASHBOARD_URL` (defaults to `http://localhost:3001`).
- **Dashboard** ([dashboard/next.config.ts](../dashboard/next.config.ts)) sets
  `basePath: '/dashboard'` (prefixes routes AND `_next` assets) and allow-lists
  the storefront origin for Server Actions.
- Both excluded from each other's tooling: MRUK `tsconfig.json` excludes
  `dashboard/`; the dashboard is its own package with its own `node_modules`.

## Running locally (two servers)

```bash
# terminal 1 — dashboard zone on :3001
cd dashboard && npm run dev -- -p 3001

# terminal 2 — storefront on :3000
npm run dev
```

Then open **http://localhost:3000/dashboard**. Requests proxy to the dashboard
zone. (Opening `:3001/dashboard` directly also works but isn't the canonical
path — auth redirects assume the storefront origin via `AUTH_URL`.)

## Authentication

- `next-auth` v5 (JWT, 24h) with a Credentials provider that calls the Fanisi
  backend `POST /auth/login` with `x-tenant-slug: mr-uk`.
- The backend returns `{ accessToken, user: { …, roleSlug } }`; `roleSlug`
  (lowercase) is mapped to the dashboard's `Role` via `roleFromSlug()` in
  [dashboard/src/types/auth.ts](../dashboard/src/types/auth.ts). **Confirm the
  admin role slug the backend seeds and extend that map.**
- The backend access token is kept in the encrypted session JWT (never exposed
  to the client) and attached as `Authorization: Bearer` by the dashboard's
  server-side API client.

### Dev bypass
`DEV_AUTH_BYPASS="true"` (in `dashboard/.env.local`) enables a one-click mock
admin so you can click through the UI before the backend tenant is seeded. It is
**hard-disabled when `NODE_ENV=production`** (guarded in `lib/auth.ts`), so it is
safe to leave on for local dev. Set it `"false"` once a real admin account
exists.

> ⚠️ The `mr-uk` tenant is **not seeded on the live backend yet** (login returns
> "Unknown tenant slug" / 404). Real backend login will start working once the
> backend seeds the tenant and provisions an admin account. Until then, use the
> dev bypass locally.

## Deploying (Vercel)

Deploy as **two projects**, both from this repo:

1. **Dashboard project** — root directory `dashboard/`. Env: `AUTH_SECRET`,
   `AUTH_URL=https://mruk.co.tz` (the storefront origin, no `/dashboard`),
   `BACKEND_API_URL=https://fs-backend-tvk8.onrender.com`,
   `BACKEND_TENANT_SLUG=mr-uk`, `DEV_AUTH_BYPASS=false`. Note its deployment URL.
2. **Storefront project** — repo root. Set `DASHBOARD_URL` to the dashboard
   project's deployment URL so the rewrite targets it.

Both serve under the single `mruk.co.tz` domain (storefront owns the domain; the
rewrite forwards `/dashboard/*`). Update the `serverActions.allowedOrigins` and
storefront `AUTH_URL`/CORS lists with the final production domain(s).

## Cross-zone links
Links from the storefront to `/dashboard` (or vice-versa) must use a plain
`<a>` tag, not `<Link>` — soft navigation doesn't work across zones.
