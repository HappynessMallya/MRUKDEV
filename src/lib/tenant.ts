import 'server-only'
import { headers } from 'next/headers'
import { cache } from 'react'

import mrukConfig from '@/data/tenants/mruk.json'
import type { TenantConfig } from '@/types/tenant'

// Local registry — to be replaced with a fetch to the backend (`/api/tenants/:slug`)
// once the backend is live. Keep the function signature stable so the swap is one line.
const TENANTS: Record<string, TenantConfig> = {
  mruk: mrukConfig as unknown as TenantConfig,
}

const DOMAIN_TO_SLUG: Record<string, string> = {
  'mruk.co.tz': 'mruk',
  'www.mruk.co.tz': 'mruk',
  localhost: 'mruk',
}

/**
 * Server-only. Returns the tenant config for the current request.
 * The Host header (set by middleware as `x-tenant-slug`) is the tenant identifier —
 * no tenant ID is passed in URLs or props. React.cache memoises within a single render.
 */
export const getTenantConfig = cache(async (): Promise<TenantConfig> => {
  const h = await headers()
  const slugHeader = h.get('x-tenant-slug')
  const host = (h.get('host') ?? '').split(':')[0]

  const fallback = process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG ?? 'mruk'
  const resolved = slugHeader ?? DOMAIN_TO_SLUG[host] ?? fallback

  const config = TENANTS[resolved]
  if (!config) throw new Error(`Tenant not found for slug "${resolved}" (host: ${host})`)
  return config
})
