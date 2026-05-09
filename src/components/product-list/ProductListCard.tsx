'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { Product } from '@/types/product'

// Frame 27 in Figma — list-page product card. White surface, rounded corners,
// product image at the top with prev/next arrows under it that cycle through
// the product's image array, then title/model, bullet features, a Compare
// checkbox, and a full-width Learn More CTA at the bottom.
export function ProductListCard({ product }: { product: Product }) {
  const t = useTenantStore((s) => s.t)
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())
  const [compared, setCompared] = useState(false)

  const images = product.images.length > 0 ? product.images : ['']
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

      <div className="border-t border-border-subtle px-6 pt-4 pb-4">
        {bullets.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-foreground/80"
                style={{ fontSize: 14, lineHeight: '20px' }}
              >
                <span aria-hidden className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-foreground/60" />
                <span>{t(b)}</span>
              </li>
            ))}
          </ul>
        )}

        <label className="inline-flex cursor-pointer items-center gap-2 text-foreground/80">
          <input
            type="checkbox"
            checked={compared}
            onChange={() => setCompared((c) => !c)}
            className={cn(
              'h-[18px] w-[18px] cursor-pointer appearance-none rounded-[4px] border border-border bg-background transition-colors',
              'checked:border-primary checked:bg-primary',
              'relative checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2.5 checked:after:w-1.5 checked:after:-translate-x-1/2 checked:after:-translate-y-[60%] checked:after:rotate-45 checked:after:border-b-2 checked:after:border-r-2 checked:after:border-white'
            )}
          />
          <span style={{ fontSize: 14, lineHeight: '20px' }}>Compare</span>
        </label>
      </div>

      <div className="px-6 pb-6">
        <Link href={href} className="block">
          <Button variant="solid" size="sm" fullWidth>
            Learn More
          </Button>
        </Link>
      </div>
    </article>
  )
}
