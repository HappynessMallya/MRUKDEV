import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import { ServiceLocator } from '@/components/service-locator'
import { getTenantConfig } from '@/lib/tenant'

// Used by both "Service centers" and "Find a retailer" footer links.
// Both flows boil down to the same question: "where can I get help in
// person?" — so we render one page driven by `tenant.global.contact.offices`.
export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Find a retailer — ${tenant.identity.companyName}`,
    description:
      'Locate the nearest MR UK branch — find addresses, phone numbers and directions for every office.',
  }
}

export default async function ServiceLocatorPage() {
  const tenant = await getTenantConfig()
  const offices = tenant.global.contact.offices ?? []

  return (
    <Container className="py-12 md:py-16">
      <header className="max-w-2xl">
        <p
          className="text-foreground/60"
          style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          Support
        </p>
        <h1
          className="mt-2 font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          Find a retailer
        </h1>
        <p className="mt-4 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
          Visit one of our branches for product demonstrations, after-sales service, and
          warranty support. Click <strong>Get directions</strong> to open the location in your
          maps app.
        </p>
      </header>

      <ServiceLocator offices={offices} />
    </Container>
  )
}
