'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { useCompareStore } from '@/stores/compareStore'
import { cn } from '@/lib/cn'
import type { Product } from '@/types/product'

// Frame 27 in Figma — list-page product card. White surface, rounded corners,
// product image at the top with prev/next arrows under it that cycle through
// the gallery, then title/model, a thin pale-gray-bordered band of bullet
// features and the Compare checkbox, and a full-width Learn More CTA.
//
// `showCompare` lets callers (e.g. the Discover row on the PDP) hide the
// Compare checkbox while keeping the same overall card layout for visual
// consistency.
export function ProductListCard({
  product,
  showCompare = true,
}: {
  product: Product
  showCompare?: boolean
}) {
  const t = useTenantStore((s) => s.t)
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  const compared = useCompareStore((s) => s.items.some((i) => i.id === product.id))
  const toggleCompare = useCompareStore((s) => s.toggle)

  // Cards prefer `listImage` (a single category-root thumbnail). When it's
  // absent, fall back to the PDP gallery so older mocks still render.
  const images = product.listImage
    ? [product.listImage]
    : product.images.length > 0
      ? product.images
      : ['']
  const fail = (i: number) => setErrored((s) => new Set(s).add(i))

  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActive((i) => (i + 1) % images.length)

  const bullets = (product.featureBullets ?? []).slice(0, 3)
  const href = `/products/${product.slug}`
  const hasMultipleImages = images.length > 1

  return (
    <article className="flex flex-col rounded-2xl bg-background shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <Link href={href} className="block px-6 pt-6">
        <div className="relative aspect-[4/3] w-full">
          {!errored.has(active) && images[active] ? (
            <Image
              src={images[active]}
              alt={t(product.name)}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain"
              onError={() => fail(active)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-placeholder">
              <Icon icon="material-symbols:image-outline" width={56} />
            </div>
          )}
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between px-6 text-foreground">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          disabled={!hasMultipleImages}
          className={cn(
            'p-1 transition-opacity',
            hasMultipleImages ? 'hover:opacity-70' : 'cursor-default opacity-50'
          )}
        >
          <Icon icon="material-symbols:chevron-left" width={22} />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          disabled={!hasMultipleImages}
          className={cn(
            'p-1 transition-opacity',
            hasMultipleImages ? 'hover:opacity-70' : 'cursor-default opacity-50'
          )}
        >
          <Icon icon="material-symbols:chevron-right" width={22} />
        </button>
      </div>

      <div className="px-6 pt-3 pb-4">
        <Link href={href}>
          <h3
            className="font-heading text-foreground hover:text-primary transition-colors"
            style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
          >
            {t(product.name)}
          </h3>
        </Link>
        {product.model && (
          <p
            className="mt-1 text-foreground/45"
            style={{ fontSize: 14, lineHeight: '20px', fontWeight: 400 }}
          >
            {product.model}
          </p>
        )}
      </div>

      {(bullets.length > 0 || showCompare) && (
        <div className="mx-6 border-y border-gray-200 py-5">
          {bullets.length > 0 && (
            <ul className="list-disc space-y-2 pl-5 marker:text-foreground">
              {bullets.map((b, i) => (
                <li
                  key={i}
                  className="text-foreground/80 pl-1"
                  style={{ fontSize: 14, lineHeight: '20px' }}
                >
                  {t(b)}
                </li>
              ))}
            </ul>
          )}
          {showCompare && (
            <label
              className={cn(
                'inline-flex cursor-pointer items-center gap-2.5 text-foreground/80',
                bullets.length > 0 && 'mt-5'
              )}
            >
              <input
                type="checkbox"
                checked={compared}
                onChange={() => {
                  const wasCompared = compared
                  toggleCompare({
                    id: product.id,
                    slug: product.slug,
                    name: t(product.name),
                    imageUrl: product.listImage ?? product.images[0] ?? '',
                  })
                  // When the user is *adding* a product (was not yet in the
                  // strip) and they're scrolled down the catalog, jump them
                  // back to the top so the Compare strip is visible and they
                  // can keep picking more products to compare.
                  if (!wasCompared && typeof window !== 'undefined') {
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className={cn(
                  'h-[18px] w-[18px] cursor-pointer appearance-none rounded-[4px] border border-border bg-background transition-colors',
                  'checked:border-primary checked:bg-primary',
                  'relative checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2.5 checked:after:w-1.5 checked:after:-translate-x-1/2 checked:after:-translate-y-[60%] checked:after:rotate-45 checked:after:border-b-2 checked:after:border-r-2 checked:after:border-white'
                )}
              />
              <span style={{ fontSize: 14, lineHeight: '20px' }}>Compare</span>
            </label>
          )}
        </div>
      )}

      <div className="px-6 py-5">
        <Link href={href} className="block">
          <Button variant="solid" size="sm" fullWidth>
            Learn More
          </Button>
        </Link>
      </div>
    </article>
  )
}
