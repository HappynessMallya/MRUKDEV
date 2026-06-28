import 'server-only'
import { headers } from 'next/headers'
import { cache } from 'react'

import mrukConfig from '@/data/tenants/mruk.json'
import type { TenantConfig } from '@/types/tenant'
import { applySiteConfig, getSiteConfig } from '@/lib/api/site-config'

// When live, the CMS-owned `GET /site-config` overlays the static config's
// `contact` (WhatsApp/email the inquiry handoff needs) and `features` toggles.
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

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

  // Overlay the live, dashboard-managed site-config when the API is on. The
  // fetch is ISR-cached and returns null on any failure, so this never blocks a
  // render or regresses to a broken state — it just falls back to the static config.
  if (!USE_API) return config
  return applySiteConfig(config, await getSiteConfig())
})
