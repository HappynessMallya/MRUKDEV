'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/atoms'
import { SocialIcons } from './SocialIcons'
import { useTenantStore } from '@/stores/tenantStore'
import type { TenantConfig } from '@/types/tenant'

// Frame 54 in Figma — bg primary navy. Logo on the far left, three thin link
// columns next, and a "Stay in the loop" newsletter block on the right with
// the social row stacked above an inline email + Subscribe field. A divider
// line separates the column block from the copyright + legal links row.
export function Footer({ config }: { config: TenantConfig }) {
  const t = useTenantStore((s) => s.t)

  const footer = config.global.footer
  const features = config.features

  // Filter feature-flagged-off links so we don't show dead nav items.
  const visibleColumns = footer.columns.map((col) => ({
    ...col,
    links: col.links.filter(
      (l) => !l.featureFlag || features[l.featureFlag as keyof typeof features]
    ),
  }))

  return (
    <footer className="bg-primary text-white">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[auto_1fr_auto] lg:gap-16">
          <div className="flex items-start lg:pt-1">
            <FooterLogo logoUrl={config.branding.logos.navbar.dark} name={config.identity.companyName} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {visibleColumns.slice(0, 3).map((col) => (
              <div key={col.id} className="space-y-3">
                <h4
                  className="font-heading text-white"
                  style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700 }}
                >
                  {t(col.title)}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-white/75 transition-colors hover:text-white"
                        style={{ fontSize: 14, lineHeight: '20px', fontWeight: 400 }}
                      >
                        {t(link.label)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <NewsletterBlock socials={footer.brand.socials} />
        </div>

        <div className="mt-12 border-t border-white/15 pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-white/60" style={{ fontSize: 13, lineHeight: '20px' }}>
              {t(footer.bottomBar.copyright)}
            </p>
            <ul className="flex flex-wrap items-center gap-6">
              {footer.bottomBar.legalLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
                    style={{ fontSize: 13, lineHeight: '20px' }}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}

function FooterLogo({ logoUrl, name }: { logoUrl?: string; name: string }) {
  if (logoUrl) {
    return (
      <Link href="/" className="inline-flex items-center">
        <Image src={logoUrl} alt={name} width={120} height={80} className="h-14 w-auto object-contain" />
      </Link>
    )
  }
  return (
    <Link
      href="/"
      className="font-heading text-white"
      style={{ fontSize: 22, lineHeight: '28px', fontWeight: 700 }}
    >
      {name}
    </Link>
  )
}

function NewsletterBlock({ socials }: { socials: Record<string, string> }) {
  return (
    <div className="lg:max-w-[360px] space-y-4">
      <div>
        <h4 className="font-heading text-white" style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700 }}>
          Stay in the loop
        </h4>
        <p className="text-white/75 mt-1" style={{ fontSize: 14, lineHeight: '20px' }}>
          Get fresh market updates and exclusive offers
        </p>
      </div>

      <SocialIcons socials={socials} iconSize={18} className="gap-2" />

      <form
        className="flex items-stretch gap-0 rounded-lg border border-white/25"
        onSubmit={(e) => {
          e.preventDefault()
          // Hook up to /api/subscribe once backend is live.
        }}
      >
        <input
          type="email"
          required
          aria-label="Email address"
          placeholder="Your email"
          className="flex-1 bg-transparent px-4 py-2.5 text-white placeholder:text-white/45 outline-none"
          style={{ fontSize: 14, lineHeight: '20px' }}
        />
        <button
          type="submit"
          className="rounded-md bg-white/10 px-5 py-2 text-white transition-colors hover:bg-white/20"
          style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
        >
          Subscribe
        </button>
      </form>

      <p className="text-white/45" style={{ fontSize: 12, lineHeight: '18px' }}>
        By subscribing you agree to our{' '}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-white">
          Privacy Policy
        </Link>
      </p>
    </div>
  )
}
