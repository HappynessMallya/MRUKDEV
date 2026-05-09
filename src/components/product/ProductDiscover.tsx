'use client'

import { Container, Heading, Text } from '@/components/atoms'
import { ProductCard } from '@/components/molecules'
import { useTenantStore } from '@/stores/tenantStore'
import type { Product } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 195 — heading + 4 related products grid. Slugs are resolved to
// full Product objects by the parent so this component stays presentational.
export function ProductDiscover({ related }: { related: Product[] }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const texts = (config?.pages.product_detail?.texts ?? {}) as Record<string, BilingualText | undefined>
  const heading = texts.discoverHeading ?? { en: 'Discover' }
  const subtitle = texts.discoverSubtitle ?? { en: 'You may also like' }

  if (!related.length) return null

  return (
    <section id="discover" className="bg-background py-16 md:py-20">
      <Container>
        <div className="text-center space-y-2">
          <Heading size="section" as="h2">
            {t(heading)}
          </Heading>
          <Text size="subhead" className="text-muted">
            {t(subtitle)}
          </Text>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {related.map((p) => (
            <ProductCard
              key={p.id}
              variant="featured"
              product={{
                id: p.id,
                name: t(p.name),
                description: p.shortDescription ? t(p.shortDescription) : undefined,
                imageUrl: p.images[0],
                href: `/products/${p.slug}`,
              }}
            />
          ))}
        </div>
      </Container>
    </section>
  )
}
