'use client'

import { Container } from '@/components/atoms'
import { ProductListCard } from '@/components/product-list'
import { useTenantStore } from '@/stores/tenantStore'
import type { Product } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 195 — gray surface section, "Discover" heading, then 4 list-style
// product cards in a row. Slugs are resolved to full Product objects by the
// parent so this component stays presentational.
export function ProductDiscover({ related }: { related: Product[] }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const texts = (config?.pages.product_detail?.texts ?? {}) as Record<string, BilingualText | undefined>
  const heading = texts.discoverHeading ?? { en: 'Discover' }

  if (!related.length) return null

  return (
    <section id="discover" className="bg-surface py-14 md:py-20">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          {t(heading)}
        </h2>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((p) => (
            <ProductListCard key={p.id} product={p} />
          ))}
        </div>
      </Container>
    </section>
  )
}
