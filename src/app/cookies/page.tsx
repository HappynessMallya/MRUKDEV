import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import { CookieSettings } from '@/components/cookies/CookieSettings'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Cookie settings — ${tenant.identity.companyName}`,
    description:
      'Choose which cookies MR UK can use during your visit. Your preferences are saved on this device only.',
  }
}

export default function CookieSettingsPage() {
  return (
    <Container className="py-12 md:py-16">
      <header className="max-w-2xl">
        <p
          className="text-foreground/60"
          style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
        >
          Legal
        </p>
        <h1
          className="mt-2 font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          Cookie settings
        </h1>
        <p className="mt-4 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
          We use cookies to keep the site working and to learn how it&apos;s used. Choose
          which categories you&apos;re happy to allow. You can change your mind at any time
          — your preferences are stored on this device only.
        </p>
      </header>

      <CookieSettings />
    </Container>
  )
}
