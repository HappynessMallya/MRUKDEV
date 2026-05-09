'use client'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { SpecRow } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 194 — centered heading + key/value table that spans the full content
// column. Alternating gray/white rows for scannability; spec label on the
// left at 60% opacity, value on the right.
export function ProductSpecs({ specs }: { specs: SpecRow[] }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const headingLabel = (config?.pages.product_detail?.texts as { tabs?: Record<string, BilingualText> } | undefined)?.tabs
    ?.specifications ?? { en: 'Specifications' }

  if (!specs.length) return null

  return (
    <section id="specifications" className="bg-background py-14 md:py-20">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          {t(headingLabel)}
        </h2>

        <div className="mt-10 overflow-hidden rounded-lg">
          <dl>
            {specs.map((row, i) => (
              <div
                key={row.id}
                className={`grid grid-cols-2 items-center gap-6 px-6 py-4 ${
                  i % 2 === 0 ? 'bg-surface' : 'bg-background'
                }`}
              >
                <dt
                  className="text-foreground"
                  style={{ fontSize: 15, lineHeight: '22px', fontWeight: 600 }}
                >
                  {t(row.label)}
                </dt>
                <dd
                  className="text-foreground/55"
                  style={{ fontSize: 15, lineHeight: '22px' }}
                >
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
