// Single base fetcher for the Fanisi Studio API.
//
// Tenancy: every tenant-scoped route needs the `x-tenant-slug` header — the
// backend resolves the slug → tenant DB from it. There is NO Host/Origin
// fallback on the backend, so we stamp the header on every request.
//
// Auth: protected routes take a Bearer JWT in the `Authorization` header.
// Public storefront reads (products, categories, pages, site-config) need only
// the tenant header — no token.
//
// CORS: the backend currently runs `app.enableCors()` with the wildcard origin
// and credentials DISABLED. Sending `credentials: 'include'` would make the
// browser block the response, so we deliberately do NOT set it. Auth therefore
// travels in the Authorization header, never in a cookie.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://fs-backend-tvk8.onrender.com'

// The slug registered on the backend for this storefront. Note it is
// `mr-uk` (hyphenated) — distinct from the local tenant-config slug `mruk`.
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? 'mr-uk'

export interface ApiError extends Error {
  status: number
  // Parsed error body when the backend returned JSON. The API uses two shapes:
  //   { statusCode, message, error }      (Nest HttpException / validation)
  //   { statusCode, message }             (Prisma filter — no `error` field)
  // `message` may be a string OR a string[] (field-level validation errors).
  payload?: { statusCode?: number; message?: string | string[]; error?: string }
}

export interface ApiFetchOptions extends RequestInit {
  // Bearer token for protected routes. Omit for public reads.
  token?: string
  // Override the tenant slug for this call (rarely needed).
  tenantSlug?: string
  // Next.js fetch cache controls (ISR). Passed straight through to fetch.
  next?: { revalidate?: number | false; tags?: string[] }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { token, tenantSlug, headers, ...rest } = options

  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      'x-tenant-slug': tenantSlug ?? TENANT_SLUG,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  if (!res.ok) {
    let payload: ApiError['payload']
    try {
      payload = await res.json()
    } catch {
      payload = undefined
    }
    const raw = payload?.message ?? res.statusText
    const message = Array.isArray(raw) ? raw.join('; ') : raw
    const err = new Error(`API ${res.status} ${path}: ${message}`) as ApiError
    err.status = res.status
    err.payload = payload
    throw err
  }

  // 204 No Content (e.g. DELETE) has no body to parse.
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}
