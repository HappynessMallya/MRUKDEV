'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import { Button, Container } from '@/components/atoms'
import { useCompareStore } from '@/stores/compareStore'
import { useTenantStore } from '@/stores/tenantStore'
import { getProduct } from '@/data/products'
import type { Product } from '@/types/product'

interface CompareAttribute {
  key: string
  label: string
}

// Fixed list of attributes shown in the comparison table. Keys must match the
// `compareSpecs` keys defined on each Product. Add new rows here to surface
// more attributes — the table auto-renders blanks for products that don't
// supply that key.
const ATTRIBUTES: CompareAttribute[] = [
  { key: 'netTotal', label: 'Net total' },
  { key: 'dimension', label: 'Product dimension' },
  { key: 'color', label: 'Color' },
  { key: 'energyClass', label: 'Energy class' },
  { key: 'type', label: 'Type' },
]

export default function ComparePage() {
  const items = useCompareStore((s) => s.items)
  const t = useTenantStore((s) => s.t)

  // Resolve store items → full Product entries for spec data. Filter out any
  // slugs that no longer exist in the catalog (e.g. removed SKUs).
  const products = items
    .map((item) => getProduct(item.slug))
    .filter((p): p is Product => p !== null)

  if (products.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          <h1
            className="font-heading text-foreground"
            style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
          >
            No products selected
          </h1>
          <p className="mt-3 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
            Tick the Compare checkbox on at least two products from a catalog page to see them
            side by side.
          </p>
          <Link href="/products" className="mt-6 inline-block">
            <Button variant="solid" size="sm">
              Browse products
            </Button>
          </Link>
        </div>
      </Container>
    )
  }

  return (
    <div className="bg-background pb-16 md:pb-20">
      <Container className="pt-10 md:pt-14">
        <h1
          className="font-heading text-foreground"
          style={{
            fontSize: 'clamp(28px, 3.4vw, 44px)',
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          Compare models
        </h1>

        <div
          className={`mt-10 grid gap-8 ${
            products.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {products.map((p) => (
            <ProductColumn key={p.id} product={p} t={t} />
          ))}
        </div>
      </Container>

      <div className="mt-12">
        {ATTRIBUTES.map((attr, i) => (
          <AttributeRow
            key={attr.key}
            attr={attr}
            products={products}
            zebra={i % 2 === 0}
          />
        ))}
      </div>
    </div>
  )
}

function ProductColumn({ product, t }: { product: Product; t: (f: { en: string; sw?: string }) => string }) {
  const cardImage = product.listImage ?? product.images[0] ?? ''

  return (
    <div className="flex flex-col">
      <h2
        className="font-heading text-foreground"
        style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
      >
        {t(product.name)}
      </h2>
      {product.model && (
        <p className="mt-1 text-foreground/45" style={{ fontSize: 14, lineHeight: '20px' }}>
          {product.model}
        </p>
      )}
      <hr className="mt-4 border-gray-200" />

      <div className="mt-6 relative aspect-square w-full">
        {cardImage ? (
          <Image
            src={cardImage}
            alt={t(product.name)}
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-placeholder">
            <Icon icon="material-symbols:image-outline" width={56} />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-foreground">
        <button
          type="button"
          aria-label="Previous"
          className="p-1 opacity-50 cursor-default"
          disabled
        >
          <Icon icon="material-symbols:chevron-left" width={20} />
        </button>
        <button
          type="button"
          aria-label="Next"
          className="p-1 opacity-50 cursor-default"
          disabled
        >
          <Icon icon="material-symbols:chevron-right" width={20} />
        </button>
      </div>

      <Link href={`/products/${product.slug}`} className="mt-4 block">
        <Button variant="solid" size="sm" fullWidth>
          Learn More
        </Button>
      </Link>
    </div>
  )
}

function AttributeRow({
  attr,
  products,
  zebra,
}: {
  attr: CompareAttribute
  products: Product[]
  zebra: boolean
}) {
  return (
    <div className={zebra ? 'bg-surface' : 'bg-background'}>
      <Container>
        <div className="flex flex-col gap-3 px-0 py-5 md:flex-row md:items-start md:gap-12">
          <div className="flex items-center gap-2 md:w-56 md:shrink-0">
            <span
              className="font-heading text-foreground"
              style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
            >
              {attr.label}
            </span>
            <Icon
              icon="material-symbols:info-outline"
              width={16}
              className="text-foreground/40"
              aria-hidden
            />
          </div>
          <div
            className={`grid flex-1 gap-4 ${
              products.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="text-foreground"
                style={{ fontSize: 14, lineHeight: '20px' }}
              >
                {p.compareSpecs?.[attr.key] ?? '—'}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
