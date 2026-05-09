import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Resolves the current tenant from the request Host header and stamps it onto
// `x-tenant-slug` so server components (`getTenantConfig`) can read it.
//
// Replace this static map with a backend lookup once the tenant-resolver service
// is live. The signature stays the same — only the body changes.
const DOMAIN_TO_SLUG: Record<string, string> = {
  'mruk.co.tz': 'mruk',
  'www.mruk.co.tz': 'mruk',
  localhost: 'mruk',
}

export function proxy(req: NextRequest) {
  const host = (req.headers.get('host') ?? '').split(':')[0]
  const fallback = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG ?? 'mruk'
  const slug = DOMAIN_TO_SLUG[host] ?? fallback

  const headers = new Headers(req.headers)
  headers.set('x-tenant-slug', slug)

  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
