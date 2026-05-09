import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import { ProfileGate } from '@/components/account/ProfileGate'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `My profile — ${tenant.identity.companyName}`,
    description: 'Manage your account, view orders, and update your contact details.',
  }
}

export default function ProfilePage() {
  return (
    <Container className="py-12 md:py-16">
      <ProfileGate />
    </Container>
  )
}
