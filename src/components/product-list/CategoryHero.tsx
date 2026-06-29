'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { SubcategoryEntry } from '@/data/products'
import type { BilingualText } from '@/types/tenant'

// Neutral fallback for subcategories whose image hasn't been set in the
// dashboard yet (the backend returns an empty image) — shown instead of a
// broken-image icon. Admin-set images always take precedence.
const TILE_FALLBACK = '/placeholder.svg'

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
                <TileImage src={sub.imageUrl} alt={t(sub.label)} />
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

// Subcategory thumbnail. A real (admin-set) image is blended onto the gray
// banner via `mix-blend-multiply` to drop its white backdrop; when the image is
// missing or fails to load we render a neutral placeholder instead (no blend,
// so it reads as an intentional placeholder rather than a broken tile).
function TileImage({ src, alt }: { src?: string; alt: string }) {
  const [errored, setErrored] = useState(false)
  const hasImage = Boolean(src) && !errored
  return (
    <div className="relative aspect-square w-full">
      {hasImage ? (
        <Image
          src={src as string}
          alt={alt}
          fill
          sizes="140px"
          className="object-contain p-2 mix-blend-multiply transition-transform group-hover:scale-105"
          onError={() => setErrored(true)}
        />
      ) : (
        <Image
          src={TILE_FALLBACK}
          alt={alt}
          fill
          sizes="140px"
          className="object-contain p-3 opacity-80"
          unoptimized
        />
      )}
    </div>
  )
}
