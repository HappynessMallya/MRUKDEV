// Live site-config read (Fanisi `GET /site-config`) + overlay onto the static
// tenant config.
//
// `GET /site-config` is the CMS-owned, live version of most of our static
// `mruk.json`: identity, branding, commerce, features, navbar, footer, contact.
// We don't swap the whole config wholesale — some blocks don't map cleanly
// (live `branding.colors` uses a different palette shape than our design tokens,
// and live `navbar`/`footer` are `null` because that chrome is authored through
// the CMS `global` page, §12). So we overlay only the blocks that map 1:1 and
// that the dashboard is meant to own at runtime: `contact` (the WhatsApp/email
// the inquiry handoff needs, §6.2) and `features` (UI toggles). Everything else
// stays on the static config, which is also the fallback when the API is off or
// unreachable — the storefront never hard-fails on a site-config hiccup.

import { apiFetch } from '@/lib/apiClient'
import type { Localized } from '@/types/api'
import type { TenantConfig } from '@/types/tenant'

const SITE_CONFIG_REVALIDATE = 300

// Only the blocks we consume are typed; the live payload carries more
// (identity, branding, commerce, cms, …) that we deliberately don't overlay.
export interface ApiSiteConfigContact {
  whatsapp?: string | null
  email?: string | null
  phones?: { value: string; label?: Localized }[] | null
}

export interface ApiSiteConfig {
  features?: Record<string, boolean> | null
  contact?: ApiSiteConfigContact | null
}

// GET /site-config — public read (only the tenant header). ISR-cached and tagged
// so a dashboard edit can be revalidated on demand. Returns null on any failure
// so callers fall back to the static config.
export async function getSiteConfig(): Promise<ApiSiteConfig | null> {
  try {
    return await apiFetch<ApiSiteConfig>('/site-config', {
      next: { revalidate: SITE_CONFIG_REVALIDATE, tags: ['site-config'] },
    })
  } catch {
    return null
  }
}

// Overlay the live site-config's `contact` + `features` onto the static tenant
// config. Pure (no I/O) so it's trivially testable; a null `live` is a no-op.
export function applySiteConfig(
  config: TenantConfig,
  live: ApiSiteConfig | null
): TenantConfig {
  if (!live) return config

  const liveContact = live.contact ?? {}
  const contact = config.global.contact

  // WhatsApp: the inquiry handoff (§6.2) reads this; prefer the live number.
  const whatsapp = liveContact.whatsapp ?? contact.whatsapp

  // Email: prepend the live business email if it isn't already listed, so the
  // mailto handoff and any contact display pick it up without dropping the
  // richer static entries (which carry localized labels).
  let emails = contact.emails
  const liveEmail = liveContact.email?.trim()
  if (liveEmail && !emails.some((e) => e.value.toLowerCase() === liveEmail.toLowerCase())) {
    emails = [
      { id: 'site-config-email', value: liveEmail, label: { en: 'Email', sw: 'Barua pepe' } },
      ...emails,
    ]
  }

  return {
    ...config,
    // Live feature toggles win over the static defaults (same shape, both boolean
    // maps); unknown static keys are preserved.
    features: { ...config.features, ...(live.features ?? {}) },
    global: {
      ...config.global,
      contact: { ...contact, whatsapp, emails },
    },
  }
}
