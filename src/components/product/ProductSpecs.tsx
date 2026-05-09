'use client'

import { Container, Heading } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { SpecRow } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 194 — centered heading + key/value table on a surface card.
// Zebra rows for scannability; left column is muted, right column is foreground.
export function ProductSpecs({ specs }: { specs: SpecRow[] }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const headingLabel = (config?.pages.product_detail?.texts as { tabs?: Record<string, BilingualText> } | undefined)?.tabs
    ?.specifications ?? { en: 'Specifications' }

  if (!specs.length) return null

  return (
    <section id="specifications" className="bg-surface py-16 md:py-20">
      <Container>
        <Heading size="section" as="h2" className="text-center">
          {t(headingLabel)}
        </Heading>

        <div className="mt-10 mx-auto max-w-3xl overflow-hidden rounded-xl border border-border-subtle bg-background">
          <dl>
            {specs.map((row, i) => (
              <div
                key={row.id}
                className={`grid grid-cols-1 gap-1 px-6 py-4 sm:grid-cols-[1fr_1.5fr] sm:items-center sm:gap-6 ${
                  i % 2 === 1 ? 'bg-surface' : 'bg-background'
                } ${i !== specs.length - 1 ? 'border-b border-border-subtle' : ''}`}
              >
                <dt className="text-muted" style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}>
                  {t(row.label)}
                </dt>
                <dd className="text-foreground" style={{ fontSize: 16, lineHeight: '24px', fontWeight: 500 }}>
                  {t(row.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
