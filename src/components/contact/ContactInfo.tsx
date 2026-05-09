'use client'

import { Icon } from '@iconify/react'

import { useTenantStore } from '@/stores/tenantStore'
import type { TenantConfig } from '@/types/tenant'

// Frame 80 — right-hand contact info on the /contact page. Four centered
// tiles in a 2x2 grid: Phone, Email, WhatsApp, Office. Each tile has a
// minimal icon, a label, a one-line description, and a clickable value/link
// at the bottom. No surrounding card chrome — just the icon and stacked text.
export function ContactInfo({ contact }: { contact: TenantConfig['global']['contact'] }) {
  const t = useTenantStore((s) => s.t)

  const phone = contact.phones[0]?.value
  const email = contact.emails[0]?.value
  const whatsapp = contact.whatsapp
  const hq = contact.offices.find((o) => o.isHQ) ?? contact.offices[0]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
      {phone && (
        <Tile
          icon="ic:outline-phone"
          label="Phone"
          description="Call during business hours"
          value={phone}
          href={`tel:${phone.replace(/\s/g, '')}`}
        />
      )}
      {email && (
        <Tile
          icon="ic:outline-email"
          label="Email"
          description="Send us a message anytime"
          value={email}
          href={`mailto:${email}`}
        />
      )}
      {whatsapp && (
        <Tile
          icon="ic:baseline-whatsapp"
          label="Whatsapp"
          description="Send us a message anytime"
          value="Send message"
          href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
          external
        />
      )}
      {hq && (
        <Tile
          icon="material-symbols:location-on-outline"
          label="Office"
          description={t(hq.address)}
          value="Get directions"
          valueIcon="material-symbols:chevron-right"
          href={`https://maps.google.com/?q=${hq.lat},${hq.lng}`}
          external
        />
      )}
    </div>
  )
}

function Tile({
  icon,
  label,
  description,
  value,
  valueIcon,
  href,
  external,
}: {
  icon: string
  label: string
  description: string
  value: string
  valueIcon?: string
  href: string
  external?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <Icon icon={icon} width={36} className="text-foreground" />
      <p
        className="mt-3 text-foreground"
        style={{ fontSize: 17, lineHeight: '22px', fontWeight: 700 }}
      >
        {label}
      </p>
      <p
        className="mt-2 text-foreground/65"
        style={{ fontSize: 13, lineHeight: '18px' }}
      >
        {description}
      </p>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="mt-2 inline-flex items-center gap-1 text-foreground underline underline-offset-4 transition-opacity hover:opacity-75"
        style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}
      >
        {value}
        {valueIcon && <Icon icon={valueIcon} width={16} />}
      </a>
    </div>
  )
}
