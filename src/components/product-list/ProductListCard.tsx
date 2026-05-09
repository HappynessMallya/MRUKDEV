'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { Product } from '@/types/product'

// Frame 27 in Figma — list-page product card. White surface, rounded corners,
// product image at the top with prev/next arrows under it that cycle through
// the product's image array, then title/model, a thin pale-gray-bordered band
// of bullet features, and a full-width Learn More CTA at the bottom.
export function ProductListCard({ product }: { product: Product }) {
  const t = useTenantStore((s) => s.t)
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  // Cards prefer `listImage` (a single category-root thumbnail). When it's
  // absent, fall back to the first PDP gallery image so older mocks still
  // render. Keeps the catalog card visually aligned with the SVGs the
  // marketing team curates per category folder.
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

      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-between px-6 text-foreground/70">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="rounded-full p-1 transition-colors hover:text-foreground"
          >
            <Icon icon="material-symbols:chevron-left" width={20} />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="rounded-full p-1 transition-colors hover:text-foreground"
          >
            <Icon icon="material-symbols:chevron-right" width={20} />
          </button>
        </div>
      )}

      <div className="px-6 pt-2 pb-3">
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

      {bullets.length > 0 && (
        <div className="mx-6 border-y border-gray-200 py-5">
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
