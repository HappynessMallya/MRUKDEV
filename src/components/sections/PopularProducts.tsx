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

// Three popular picks across distinct sub-categories — one each from
// Kitchen, Refrigerator & AC, and Agriculture — so the row is visually varied.
const MOCK_POPULAR: ProductCardData[] = [
  {
    id: 'pop-microwave',
    name: 'P605TMSWD Microwave',
    description: 'Total no frost, electronic control, LED light and 32L oven capacity',
    href: '/products/p605tmswd',
    imageUrl: '/categories/categories%3Akitchen/microwave.png',
  },
  {
    id: 'pop-fridge',
    name: 'Two-Door Refrigerator',
    description: '420L capacity, freshness starts here, sleek black inox finish',
    href: '/products/rf4200',
    imageUrl: '/categories/categories%3Arefrigirator/two-door-refrigirator.png',
  },
  {
    id: 'pop-pump',
    name: 'Water Pump 1.5HP',
    description: 'High flow rate, low noise — built for farms and homesteads',
    href: '/products/water-pump',
    imageUrl: '/categories/categories%3Aagriculture/water-pump.png',
  },
]
