'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { useCartStore } from '@/stores/cartStore'
import { cn } from '@/lib/cn'
import type { Product } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 204 right column — name, model code, bullet features, an optional
// color picker, and three CTAs: Get Quotation (outline), Add to Cart (solid),
// and a full-width WhatsApp-to-order pill underneath.
export function ProductInfo({ product }: { product: Product }) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)

  const texts = (config?.pages.product_detail?.texts ?? {}) as Record<string, BilingualText | undefined>

  const colors = product.colors ?? []
  const [activeColor, setActiveColor] = useState(colors[0]?.id)
  const [justAdded, setJustAdded] = useState(false)
  const router = useRouter()
  const addToCartStore = useCartStore((s) => s.add)

  const addToCart = texts.addToCart ?? { en: 'Add to cart' }
  const getQuote = texts.getQuote ?? { en: 'Get a quotation' }
  const outOfStock = texts.outOfStock ?? { en: 'Out of stock' }
  const whatsapp = config?.global.contact.whatsapp

  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I'd like to order: ${t(product.name)}`)}`
    : undefined

  return (
    <div className="flex flex-col gap-5">
      <h1
        className="font-heading text-foreground"
        style={{ fontSize: 'clamp(24px, 2.6vw, 34px)', lineHeight: 1.15, fontWeight: 700 }}
      >
        {t(product.name)}
      </h1>

      {product.model && (
        <p
          className="text-gray-300"
          style={{ fontSize: 16, lineHeight: '22px', fontWeight: 500 }}
        >
          {product.model}
        </p>
      )}

      {product.featureBullets && product.featureBullets.length > 0 && (
        <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-foreground">
          {product.featureBullets.map((b, i) => (
            <li
              key={i}
              className="text-foreground/80 pl-1"
              style={{ fontSize: 15, lineHeight: '22px' }}
            >
              {t(b)}
            </li>
          ))}
        </ul>
      )}

      {colors.length > 0 && (
        <div className="mt-3 space-y-3">
          <p
            className="text-foreground"
            style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700 }}
          >
            Choose your model
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {colors.map((c) => {
              const isActive = c.id === activeColor
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveColor(c.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'rounded-md border bg-background px-5 py-2 text-foreground transition-colors',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-gray-200 hover:border-foreground/30'
                  )}
                  style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}
                >
                  {t(c.label)}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {product.isAvailable === false ? (
          <Button variant="solid" size="md" disabled fullWidth className="sm:col-span-2">
            {t(outOfStock)}
          </Button>
        ) : (
          <>
            <Button
              variant="soft"
              size="md"
              fullWidth
              leftIcon={<Icon icon="material-symbols:request-quote-outline" width={16} />}
              onClick={() => {
                const params = new URLSearchParams({
                  product: product.slug,
                  subject: `Quotation request: ${t(product.name)}`,
                })
                router.push(`/contact?${params.toString()}`)
              }}
            >
              {t(getQuote)}
            </Button>
            <Button
              variant="soft"
              size="md"
              fullWidth
              leftIcon={<Icon icon={justAdded ? 'material-symbols:check-rounded' : 'tdesign:cart'} width={16} />}
              onClick={() => {
                addToCartStore({
                  id: product.id,
                  slug: product.slug,
                  name: t(product.name),
                  imageUrl: product.listImage ?? product.images[0] ?? '',
                  model: product.model,
                })
                setJustAdded(true)
                setTimeout(() => setJustAdded(false), 1500)
              }}
            >
              {justAdded ? 'Added' : t(addToCart)}
            </Button>
          </>
        )}
      </div>

      {whatsappHref && product.isAvailable !== false && (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
          <Button
            variant="solid"
            size="md"
            fullWidth
            leftIcon={<Icon icon="ic:baseline-whatsapp" width={18} />}
          >
            WhatsApp to order
          </Button>
        </a>
      )}
    </div>
  )
}
