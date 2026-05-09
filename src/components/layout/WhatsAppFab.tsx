'use client'

import Image from 'next/image'

import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'

// Floating WhatsApp pill — image asset shipped from Figma (Frame 222).
// Pinned bottom-right, visible on every page. Opens wa.me with the tenant's
// WhatsApp number from contact config.
export function WhatsAppFab({ className }: { className?: string }) {
  const config = useTenantStore((s) => s.config)
  const number = config?.global.contact.whatsapp
  if (!number) return null

  const href = `https://wa.me/${number.replace(/[^0-9]/g, '')}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-transform hover:scale-105 active:scale-95',
        'drop-shadow-md',
        className
      )}
    >
      <Image
        src="/ui/whatsapp-chat.png"
        alt="Chat with us on WhatsApp"
        width={252}
        height={73}
        className="h-12 w-auto md:h-14"
        priority={false}
      />
    </a>
  )
}
