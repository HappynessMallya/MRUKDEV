'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { MegaMenu as MegaMenuType } from '@/types/tenant'

// Renders the mega-menu panel below the navbar when a link with `megaMenu`
// is open. Three column types — categories grid, featured-products list,
// promo banner — driven by the JSON config.
export function MegaMenu({ data }: { data: MegaMenuType }) {
  const t = useTenantStore((s) => s.t)

  return (
    <div
      className="absolute left-0 right-0 top-full bg-background border-t border-border-subtle shadow-lg"
      // Stop propagation so the parent's onMouseLeave doesn't fire when the
      // pointer enters the panel from the trigger.
      onMouseEnter={(e) => e.stopPropagation()}
    >
      <Container className="py-8">
        <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${data.columns.length}, minmax(0, 1fr))` }}>
          {data.columns.map((col) => {
            if (col.type === 'categories') {
              return (
                <div key={col.id} className="space-y-4">
                  <h3
                    className="text-muted uppercase tracking-widest"
                    style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600 }}
                  >
                    {t(col.title)}
                  </h3>
                  <ul className="space-y-3">
                    {col.items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="group flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-surface"
                        >
                          <CategoryIcon iconUrl={item.iconUrl} />
                          <span className="flex flex-col">
                            <span
                              className="text-foreground group-hover:text-primary transition-colors"
                              style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
                            >
                              {t(item.label)}
                            </span>
                            {item.subtitle && (
                              <span className="text-muted" style={{ fontSize: 14, lineHeight: '21px' }}>
                                {t(item.subtitle)}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            }
            if (col.type === 'featured_products') {
              return (
                <div key={col.id} className="space-y-4">
                  <h3
                    className="text-muted uppercase tracking-widest"
                    style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600 }}
                  >
                    {t(col.title)}
                  </h3>
                  <p className="text-muted" style={{ fontSize: 14, lineHeight: '21px' }}>
                    Loading {col.limit} featured products…
                  </p>
                  {/* Wired to useProducts() once backend is live. */}
                </div>
              )
            }
            if (col.type === 'promo_banner') {
              return <PromoBannerColumn key={col.id} banner={col.banner} t={t} />
            }
            return null
          })}
        </div>
      </Container>
    </div>
  )
}

function CategoryIcon({ iconUrl }: { iconUrl: string }) {
  const [errored, setErrored] = useState(false)
  if (!iconUrl || errored) {
    return (
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface text-primary">
        <Icon icon="material-symbols:category" width={20} />
      </span>
    )
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface">
      <Image src={iconUrl} alt="" width={24} height={24} onError={() => setErrored(true)} />
    </span>
  )
}

function PromoBannerColumn({
  banner,
  t,
}: {
  banner: NonNullable<Extract<MegaMenuType['columns'][number], { type: 'promo_banner' }>['banner']>
  t: (f: { en: string; sw?: string }) => string
}) {
  const [errored, setErrored] = useState(false)
  return (
    <Link
      href={banner.cta.href}
      className="group relative block overflow-hidden rounded-lg bg-primary text-white"
    >
      {banner.imageUrl && !errored ? (
        <Image
          src={banner.imageUrl}
          alt={t(banner.title)}
          fill
          className="object-cover opacity-50 transition-opacity group-hover:opacity-60"
          onError={() => setErrored(true)}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #25396F 0%, #1B2A55 100%)' }}
        />
      )}
      <div className="relative z-10 flex h-full min-h-[180px] flex-col justify-end gap-2 p-6">
        <span
          className="inline-block w-fit rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm"
          style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600 }}
        >
          {t(banner.tag)}
        </span>
        <span style={{ fontSize: 24, lineHeight: '29px', fontWeight: 700 }}>
          {t(banner.title)}
        </span>
        <span
          className="inline-flex items-center gap-1.5"
          style={{ fontSize: 14, lineHeight: '21px', fontWeight: 600 }}
        >
          {t(banner.cta.label)}
          <Icon icon="grommet-icons:next" width={14} />
        </span>
      </div>
    </Link>
  )
}
