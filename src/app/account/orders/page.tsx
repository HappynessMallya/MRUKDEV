import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import { TrackOrderForm } from '@/components/account/TrackOrderForm'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Track your order — ${tenant.identity.companyName}`,
    description:
      'Enter your order number and email to view its status. Tracking updates are emailed to you when there is a change.',
  }
}

export default function TrackOrdersPage() {
  return (
    <Container className="py-12 md:py-16">
      <header className="max-w-2xl">
        <p
          className="text-foreground/60"
          style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          Account
        </p>
        <h1
          className="mt-2 font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          Track your order
        </h1>
        <p className="mt-4 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
          Enter your order number and the email address you used at checkout. We&apos;ll show
          the latest status, delivery ETA, and a copy of your receipt.
        </p>
      </header>

      <TrackOrderForm />
    </Container>
  )
}
