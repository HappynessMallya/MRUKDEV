'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
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

  const addToCart = texts.addToCart ?? { en: 'Add to cart' }
  const getQuote = texts.getQuote ?? { en: 'Get a quotation' }
  const modelLabel = texts.modelLabel ?? { en: 'Model' }
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
          className="text-foreground/45"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          {t(modelLabel)}: <span className="text-foreground/70">{product.model}</span>
        </p>
      )}

      {product.featureBullets && product.featureBullets.length > 0 && (
        <ul className="flex flex-col gap-2 mt-2">
          {product.featureBullets.map((b, i) => (
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
                    'rounded-md border px-5 py-2 text-foreground transition-colors',
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border-subtle hover:border-foreground/30'
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

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {product.isAvailable === false ? (
          <Button variant="solid" size="md" disabled fullWidth>
            {t(outOfStock)}
          </Button>
        ) : (
          <>
            <Link href="/inquiry">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Icon icon="material-symbols:request-quote-outline" width={16} />}
              >
                {t(getQuote)}
              </Button>
            </Link>
            <Button
              variant="solid"
              size="sm"
              leftIcon={<Icon icon="tdesign:cart" width={16} />}
            >
              {t(addToCart)}
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
