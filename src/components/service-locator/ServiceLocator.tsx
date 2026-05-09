'use client'

import { Icon } from '@iconify/react'

import { useTenantStore } from '@/stores/tenantStore'
import type { Office } from '@/types/tenant'

// Renders the office list as a 2-up grid of cards. Each card opens the
// location in Google Maps via lat/lng — no embedded map needed (keeps the
// page light and lets the user use the directions feature in their own
// preferred maps app).
export function ServiceLocator({ offices }: { offices: Office[] }) {
  const t = useTenantStore((s) => s.t)

  if (offices.length === 0) {
    return (
      <div className="mt-10 rounded-2xl bg-surface px-6 py-16 text-center">
        <Icon
          icon="material-symbols:storefront-outline"
          width={48}
          className="mx-auto text-foreground/30"
        />
        <p
          className="mt-4 text-foreground"
          style={{ fontSize: 16, lineHeight: '22px', fontWeight: 600 }}
        >
          No retailers listed yet
        </p>
        <p
          className="mt-2 text-foreground/65"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          We&apos;re onboarding new retail partners. Please check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      {offices.map((office) => {
        const phone = office.phones[0]
        const cleanPhone = phone?.replace(/\s/g, '') ?? ''
        return (
          <article
            key={office.id}
            className="flex flex-col gap-4 rounded-2xl bg-surface p-6"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background text-primary">
                <Icon icon="material-symbols:location-on-outline" width={20} />
              </span>
              <div className="flex flex-col gap-1">
                <h3
                  className="font-heading text-foreground"
                  style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
                >
                  {t(office.name)}
                  {office.isHQ && (
                    <span
                      className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-primary align-middle"
                      style={{ fontSize: 11, lineHeight: '16px', fontWeight: 700 }}
                    >
                      HQ
                    </span>
                  )}
                </h3>
                <p className="text-foreground/65" style={{ fontSize: 14, lineHeight: '20px' }}>
                  {t(office.address)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {phone && (
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 text-foreground transition-colors hover:text-primary"
                  style={{ fontSize: 13, lineHeight: '18px', fontWeight: 500 }}
                >
                  <Icon icon="ic:outline-phone" width={15} />
                  {phone}
                </a>
              )}
              <a
                href={`https://maps.google.com/?q=${office.lat},${office.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary underline underline-offset-4 transition-opacity hover:opacity-75"
                style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600 }}
              >
                Get directions
                <Icon icon="material-symbols:chevron-right" width={14} />
              </a>
            </div>
          </article>
        )
      })}
    </div>
  )
}
