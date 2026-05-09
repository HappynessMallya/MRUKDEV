'use client'

import Link from 'next/link'
import { Icon } from '@iconify/react'

import { Button, Heading, Text } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { Product } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 204 right column — name, model code, bullet features, primary CTAs,
// and the wishlist/share affordances. Labels read from
// tenant.pages.product_detail.texts so they stay localised.
export function ProductInfo({ product }: { product: Product }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)

  const texts = (config?.pages.product_detail?.texts ?? {}) as Record<string, BilingualText | undefined>
  const settings = (config?.pages.product_detail?.settings ?? {}) as Record<string, unknown>
  const showWishlist = settings.showWishlist !== false
  const showCompare = settings.showComparison !== false

  const addToCart = texts.addToCart ?? { en: 'Add to Cart' }
  const getQuote = texts.getQuote ?? { en: 'Get a Quote' }
  const wishlistLabel = texts.wishlistLabel ?? { en: 'Add to Wishlist' }
  const compareLabel = texts.compareLabel ?? { en: 'Add to Compare' }
  const modelLabel = texts.modelLabel ?? { en: 'Model' }
  const outOfStock = texts.outOfStock ?? { en: 'Out of Stock' }

  return (
    <div className="flex flex-col gap-5">
      <Link
        href={`/products?category=${product.category}`}
        className="text-muted hover:text-primary transition-colors"
        style={{ fontSize: 12, lineHeight: '18px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
      >
        ← {product.category.replace(/-/g, ' ')}
      </Link>

      <Heading size="h1" as="h1">
        {t(product.name)}
      </Heading>

      {product.model && (
        <Text size="bodyEmph" className="text-muted">
          {t(modelLabel)}: <span className="text-foreground">{product.model}</span>
        </Text>
      )}

      {product.featureBullets && product.featureBullets.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {product.featureBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon icon="material-symbols:check-circle-rounded" width={20} className="mt-0.5 shrink-0 text-primary" />
              <span className="text-foreground" style={{ fontSize: 16, lineHeight: '24px' }}>
                {t(b)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {product.isAvailable === false ? (
          <Button variant="solid" size="md" disabled>
            {t(outOfStock)}
          </Button>
        ) : (
          <>
            <Button variant="solid" size="md" leftIcon={<Icon icon="tdesign:cart" width={18} />}>
              {t(addToCart)}
            </Button>
            <Link href="/inquiry">
              <Button variant="outline" size="md">
                {t(getQuote)}
              </Button>
            </Link>
          </>
        )}
      </div>

      <div className="flex items-center gap-4 mt-2 text-muted">
        {showWishlist && (
          <button
            type="button"
            aria-label={t(wishlistLabel)}
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}
          >
            <Icon icon="material-symbols:favorite-outline" width={18} />
            {t(wishlistLabel)}
          </button>
        )}
        {showCompare && (
          <button
            type="button"
            aria-label={t(compareLabel)}
            className="inline-flex items-center gap-1.5 hover:text-primary transition-colors"
            style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}
          >
            <Icon icon="material-symbols:compare-arrows-rounded" width={18} />
            {t(compareLabel)}
          </button>
        )}
      </div>
    </div>
  )
}
