'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

// Lifted from Figma 'Air frayer' / 'Oven' / 'Cooker' component sets:
// surface card with centered title/description and an optional "New" pill.
export interface ProductCardData {
  id: string
  name: string
  description?: string
  imageUrl?: string
  href: string
  isNew?: boolean
}

// `featured` — Frame 55 grid card (4-up under the category hero)
// `popular`  — Frame 48 popular card (3-up centered, taller image)
// `compact`  — kept for back-compat with any older callers
// `default`  — used by the catalog/listing page
export type ProductCardVariant = 'default' | 'featured' | 'popular' | 'compact'

export function ProductCard({
  product,
  variant = 'default',
  className,
}: {
  product: ProductCardData
  variant?: ProductCardVariant
  className?: string
}) {
  const [imgErrored, setImgErrored] = useState(false)
  const isPopular = variant === 'popular'
  const isFeatured = variant === 'featured'
  const isCompact = variant === 'compact'

  return (
    <article
      className={cn(
        'group flex flex-col rounded-2xl bg-surface transition-colors hover:bg-surface-alt',
        isPopular ? 'p-6 gap-3 text-center items-stretch' : 'p-5 gap-3 text-center items-stretch',
        className
      )}
    >
      <Link href={product.href} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl">
          {product.imageUrl && !imgErrored ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 50vw, 100vw"
              className={cn(
                'object-contain transition-transform group-hover:scale-105',
                isPopular ? 'p-8' : 'p-6'
              )}
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-placeholder">
              <Icon icon="material-symbols:image-outline" width={isPopular ? 48 : 36} />
            </div>
          )}
          {product.isNew && (
            <span
              className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-white"
              style={{ fontSize: 11, lineHeight: '16px', fontWeight: 600 }}
            >
              New
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col gap-1.5 px-2 pt-2">
        <Link href={product.href}>
          <h3
            className="font-heading text-foreground hover:text-primary transition-colors"
            style={
              isPopular
                ? { fontSize: 20, lineHeight: '26px', fontWeight: 700 }
                : { fontSize: 18, lineHeight: '24px', fontWeight: 700 }
            }
          >
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p
            className={cn(
              'text-foreground/60 line-clamp-2',
              (isFeatured || isCompact) && 'text-balance'
            )}
            style={{ fontSize: 13, lineHeight: '20px', fontWeight: 400 }}
          >
            {product.description}
          </p>
        )}
      </div>
    </article>
  )
}
