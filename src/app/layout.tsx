import type { Metadata } from 'next'

import { getTenantConfig } from '@/lib/tenant'
import { getShell } from '@/layouts'
import { TenantProvider } from '@/providers/TenantProvider'
import { inter } from '@/lib/fonts'

import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  const seo = tenant.pages.home?.seo
  const lang = tenant.defaultLang

  return {
    title: seo?.title?.[lang] ?? tenant.identity.companyName,
    description: seo?.description?.[lang],
    icons: { icon: tenant.branding.logos.favicon },
    openGraph: {
      title: seo?.title?.[lang],
      description: seo?.description?.[lang],
      images: seo?.ogImage ? [seo.ogImage] : undefined,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenantConfig()
  const Shell = getShell(tenant.layout)
  const c = tenant.branding.colors

  // Inject tenant brand tokens as CSS variables on :root so Tailwind utilities
  // (bg-primary, text-foreground, bg-surface, border-border-subtle, …) resolve
  // to the right values per tenant. Names mirror src/design-tokens.json.
  const cssVars = `:root{
    --brand-primary:${c.primary};
    --brand-background:${c.background};
    --brand-surface:${c.surface};
    --brand-surface-alt:${c.surfaceAlt ?? c.surface};
    --brand-border:${c.border};
    --brand-border-subtle:${c.borderSubtle ?? c.border};
    --brand-foreground:${c.foreground};
    --brand-foreground-strong:${c.foregroundStrong ?? c.foreground};
    --brand-muted:${c.muted ?? c.foreground};
    --brand-placeholder:${c.placeholder ?? c.muted ?? c.foreground};
  }`

  return (
    <html
      lang={tenant.defaultLang}
      className={inter.variable}
      // Browser extensions (Grammarly, password managers, CRX launchers, etc.)
      // commonly inject attributes onto <html> before React hydrates. We only
      // suppress on this single element — not its descendants — so genuine
      // hydration mismatches inside the app still surface.
      suppressHydrationWarning
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body>
        <TenantProvider config={tenant}>
          <Shell config={tenant}>{children}</Shell>
        </TenantProvider>
      </body>
    </html>
  )
}
