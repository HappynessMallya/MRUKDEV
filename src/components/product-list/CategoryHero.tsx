'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { SubcategoryEntry } from '@/data/products'
import type { BilingualText } from '@/types/tenant'

// Frame 25 in Figma — light gray banner with the centered "Explore X" heading
// and a horizontal row of subcategory tiles. Active subcategory gets a thin
// rounded primary border around its tile. Tiles are real Links so reads of the
// `?sub=` query param come from the URL, no client state.
export function CategoryHero({
  heading,
  subcategories,
  category,
}: {
  heading: BilingualText
  subcategories: SubcategoryEntry[]
  category: string
}) {
  const t = useTenantStore((s) => s.t)
  const searchParams = useSearchParams()
  const activeSub = searchParams.get('sub')

  if (subcategories.length === 0) return null

  return (
    <section className="bg-surface py-10 md:py-12">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {t(heading)}
        </h2>

        <div className="mt-8 flex flex-wrap items-start justify-center gap-x-2 gap-y-6 md:gap-x-4">
          {subcategories.map((sub) => {
            const isActive = activeSub === sub.slug
            const href = `/products?category=${category}&sub=${sub.slug}`
            return (
              <Link
                key={sub.slug}
                href={href}
                className={cn(
                  'group flex w-[120px] flex-col items-center gap-2 rounded-2xl p-2 transition-colors md:w-[140px]',
                  isActive ? 'border border-primary' : 'border border-transparent'
                )}
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={sub.imageUrl}
                    alt={t(sub.label)}
                    fill
                    sizes="120px"
                    unoptimized
                    className="object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-105"
                  />
                </div>
                <span
                  className={cn(
                    'text-center transition-colors',
                    isActive ? 'text-primary' : 'text-foreground/80 group-hover:text-foreground'
                  )}
                  style={{ fontSize: 13, lineHeight: '18px', fontWeight: 600 }}
                >
                  {t(sub.label)}
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
