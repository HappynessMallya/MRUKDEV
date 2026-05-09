import type { ReactNode } from 'react'

import { Navbar, Footer, WhatsAppFab } from '@/components/layout'
import type { TenantConfig } from '@/types/tenant'

// Cinematic shell — sticky navbar, full-bleed sections, dark navy footer,
// and a WhatsApp FAB pinned bottom-right that's reachable from every page.
export function CinematicShell({
  children,
  config,
}: {
  children: ReactNode
  config: TenantConfig
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar config={config} />
      <main className="flex-1">{children}</main>
      <Footer config={config} />
      <WhatsAppFab />
    </div>
  )
}
