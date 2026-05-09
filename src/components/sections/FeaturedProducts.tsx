'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { Button, Container } from '@/components/atoms'
import { ProductCard, type ProductCardData } from '@/components/molecules'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { BilingualText } from '@/types/tenant'

interface CategoryHero {
  imageUrl?: string
  title: BilingualText
  subtitle: BilingualText
  cta: { label: BilingualText; href: string }
}

interface TabItem {
  id: string
  label: BilingualText
  category: string
  hero?: CategoryHero
}

export interface FeaturedProductsProps {
  heading: BilingualText
  tabs?: { enabled: boolean; items?: TabItem[] }
  limit?: number
}

// Frame 55 in Figma — section heading + text-only tab row, a category hero
// card (lifestyle image left, copy + CTA right), and a 4-up product grid.
export function FeaturedProducts({ heading, tabs, limit = 4 }: FeaturedProductsProps) {
  const t = useTenantStore((s) => s.t)
  const tabItems = tabs?.items ?? []
  const [activeId, setActiveId] = useState(tabItems[0]?.id ?? '')

  const activeTab = tabItems.find((tt) => tt.id === activeId) ?? tabItems[0]
  const products = (activeTab && MOCK_PRODUCTS[activeTab.category]) ?? []

  return (
    <section className="bg-background py-14 md:py-16">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {t(heading)}
        </h2>

        {tabs?.enabled && tabItems.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
            {tabItems.map((tab) => {
              const isActive = tab.id === activeId
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    'relative py-3 transition-colors',
                    isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                  )}
                  style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}
                >
                  {t(tab.label)}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-1 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {activeTab?.hero && <CategoryHeroCard hero={activeTab.hero} t={t} className="mt-8" />}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.slice(0, limit).map((p) => (
            <ProductCard key={p.id} product={p} variant="featured" />
          ))}
        </div>
      </Container>
    </section>
  )
}

function CategoryHeroCard({
  hero,
  t,
  className,
}: {
  hero: CategoryHero
  t: (f: BilingualText) => string
  className?: string
}) {
  const [imgErrored, setImgErrored] = useState(false)
  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-2xl bg-surface',
        className
      )}
    >
      <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:min-h-[420px] p-3 lg:p-4">
        <div className="relative h-full w-full overflow-hidden rounded-xl">
          {hero.imageUrl && !imgErrored ? (
            <Image
              src={hero.imageUrl}
              alt={t(hero.title)}
              fill
              unoptimized
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-placeholder"
              style={{ background: 'linear-gradient(180deg, #F5F5F7 0%, #FFFFFF 100%)' }}
            >
              <span style={{ fontSize: 14 }}>category lifestyle image</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col items-start justify-center gap-3 px-8 py-10 lg:px-12">
        <h3
          className="font-heading text-foreground"
          style={{ fontSize: 'clamp(22px, 2.2vw, 28px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {t(hero.title)}
        </h3>
        <p
          className="text-foreground/70 max-w-md"
          style={{ fontSize: 15, lineHeight: '22px' }}
        >
          {t(hero.subtitle)}
        </p>
        <Link href={hero.cta.href} className="mt-3">
          <Button variant="solid" size="sm">
            {t(hero.cta.label)}
          </Button>
        </Link>
      </div>
    </div>
  )
}

// Mock products keyed by category — featured-grid SVGs live in
// /public/categories/categories:<category>/. The folder name uses a literal
// colon so the URL has to be `%3A` encoded.
const MOCK_PRODUCTS: Record<string, ProductCardData[]> = {
  kitchen: [
    { id: 'p1', name: 'Air fryer', description: '4kg capacity, Dual cooking, 360 heat circulation', href: '/products/air-fryer', imageUrl: '/categories/categories%3Akitchen/air-frier.svg', isNew: true },
    { id: 'p2', name: 'French Microwave', description: 'Mordenize your kitchen', href: '/products/p605tmswd', imageUrl: '/categories/categories%3Akitchen/microwave.svg' },
    { id: 'p3', name: 'MR-UK Dual cooking f...', description: 'Four cooks with oven', href: '/products/mr-uk-dual-cooker', imageUrl: '/categories/categories%3Akitchen/dual-cooking.svg' },
    { id: 'p4', name: 'UK- 45 Blender', description: 'Smart control, 360 heat circulation', href: '/products/uk-45-blender', imageUrl: '/categories/categories%3Akitchen/blender.svg' },
  ],
  music: [
    { id: 'm1', name: 'Soundbar', description: 'Dolby Atmos, wireless subwoofer', href: '/products/soundbar', imageUrl: '/categories/categories%3Amusics/soundbar.svg' },
    { id: 'm2', name: 'Mini Soundbar', description: 'Compact, room-filling sound', href: '/products/mini-soundbar', imageUrl: '/categories/categories%3Amusics/minisoundbar.svg' },
    { id: 'm3', name: 'Subwoofer', description: 'Deep bass, wireless pairing', href: '/products/subwoofer', imageUrl: '/categories/categories%3Amusics/subwoofer.svg' },
    { id: 'm4', name: 'Super Bass', description: 'Floor-shaking bass, 12-hour battery', href: '/products/super-bass', imageUrl: '/categories/categories%3Amusics/super-base.svg' },
  ],
  refrigerator: [
    { id: 'r1', name: 'Two Door Refrigerator', description: 'Freshness starts here, 420L', href: '/products/rf4200', imageUrl: '/categories/categories%3Arefrigirator/two-door-refrigirator.svg', isNew: true },
    { id: 'r2', name: 'Inverter Split AC', description: 'Whisper-quiet, energy efficient', href: '/products/inverter-split-ac', imageUrl: '/categories/categories%3Arefrigirator/ac.svg' },
    { id: 'r3', name: 'Metal Fan', description: 'Quiet motor, three-speed', href: '/products/metal-fan', imageUrl: '/categories/categories%3Arefrigirator/metal-fan.svg' },
    { id: 'r4', name: 'Black Inox Freezer', description: '180L, fast-freeze technology', href: '/products/black-inox-freezer', imageUrl: '/categories/categories%3Arefrigirator/blank-inox.svg' },
  ],
  agriculture: [
    { id: 'a1', name: 'Water Pump 1.5HP', description: 'High flow, low noise', href: '/products/water-pump', imageUrl: '/categories/categories%3Aagriculture/water-pump.svg' },
    { id: 'a2', name: 'Diesel Generator', description: '5kVA, fuel efficient', href: '/products/diesel-generator', imageUrl: '/categories/categories%3Aagriculture/generator.svg' },
  ],
}
