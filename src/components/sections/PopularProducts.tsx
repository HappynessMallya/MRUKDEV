'use client'

import { Container } from '@/components/atoms'
import { ProductCard, type ProductCardData } from '@/components/molecules'
import { useTenantStore } from '@/stores/tenantStore'
import type { BilingualText } from '@/types/tenant'

export interface PopularProductsProps {
  heading: BilingualText
  source?: string
  sourceValue?: string
  limit?: number
}

// Frame 48 in Figma — centered heading + a 3-card row. Cards share the same
// surface treatment as the featured grid but use the larger `popular` variant
// so the product image reads cleaner at three-up.
export function PopularProducts({ heading, limit = 3 }: PopularProductsProps) {
  const t = useTenantStore((s) => s.t)
  const products = MOCK_POPULAR.slice(0, limit)

  return (
    <section className="bg-background py-14 md:py-16">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {t(heading)}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant="popular" />
          ))}
        </div>
      </Container>
    </section>
  )
}

const img = (n: number) => `/products/product-${String(n).padStart(2, '0')}.png`

const MOCK_POPULAR: ProductCardData[] = [
  { id: 'pop-1', name: 'Air fryer', description: 'Smart control, 4kg capacity, Dual cooking, 360 heat circulation', href: '/products/oven', imageUrl: img(3) },
  { id: 'pop-2', name: 'Air fryer', description: 'Smart control, 4kg capacity, Dual cooking, 360 heat circulation', href: '/products/water-pump', imageUrl: img(14) },
  { id: 'pop-3', name: 'Air fryer', description: 'Smart control, 4kg capacity, Dual cooking, 360 heat circulation', href: '/products/microwave', imageUrl: img(2) },
]
