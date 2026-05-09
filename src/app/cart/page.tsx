'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import { Button, Container } from '@/components/atoms'
import { useCartStore } from '@/stores/cartStore'
import { useTenantStore } from '@/stores/tenantStore'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const remove = useCartStore((s) => s.remove)
  const setQty = useCartStore((s) => s.setQty)
  const clear = useCartStore((s) => s.clear)
  const config = useTenantStore((s) => s.config)
  const whatsapp = config?.global.contact.whatsapp

  if (items.length === 0) {
    return (
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-md text-center">
          <Icon
            icon="material-symbols:shopping-cart-outline"
            width={56}
            className="mx-auto text-foreground/30"
          />
          <h1
            className="mt-4 font-heading text-foreground"
            style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
          >
            Your cart is empty
          </h1>
          <p className="mt-3 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
            Browse the catalog and tap <strong>Add to cart</strong> on any product to start a quote.
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

  // Build a WhatsApp message that itemises the cart so the team gets full
  // context the instant the customer taps "Order via WhatsApp".
  const message = [
    'Hi MR UK, I would like to order the following:',
    ...items.map((i, idx) => `${idx + 1}. ${i.name}${i.model ? ` (${i.model})` : ''} × ${i.qty}`),
  ].join('\n')
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    : undefined

  return (
    <Container className="py-12 md:py-16">
      <header className="flex items-end justify-between">
        <h1
          className="font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          Your cart
        </h1>
        <button
          type="button"
          onClick={clear}
          className="text-foreground/55 underline underline-offset-4 hover:text-foreground"
          style={{ fontSize: 14, lineHeight: '20px' }}
        >
          Clear cart
        </button>
      </header>

      <ul className="mt-8 divide-y divide-gray-200 rounded-2xl bg-background">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-4 px-4 py-5 md:gap-6 md:px-6"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface md:h-24 md:w-24">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-contain p-2"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-placeholder">
                  <Icon icon="material-symbols:image-outline" width={32} />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Link
                href={`/products/${item.slug}`}
                className="font-heading text-foreground hover:text-primary transition-colors"
                style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
              >
                {item.name}
              </Link>
              {item.model && (
                <p
                  className="text-foreground/45"
                  style={{ fontSize: 13, lineHeight: '18px' }}
                >
                  {item.model}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-lg border border-gray-200 px-1 py-1">
              <button
                type="button"
                onClick={() => setQty(item.id, item.qty - 1)}
                aria-label="Decrease quantity"
                className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
              >
                <Icon icon="material-symbols:remove" width={16} />
              </button>
              <span
                className="min-w-6 text-center text-foreground"
                style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
              >
                {item.qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(item.id, item.qty + 1)}
                aria-label="Increase quantity"
                className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
              >
                <Icon icon="material-symbols:add" width={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => remove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/55 transition-colors hover:bg-surface hover:text-foreground"
            >
              <Icon icon="material-symbols:close-rounded" width={20} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <Link href="/products">
          <Button variant="outline" size="sm">
            Continue shopping
          </Button>
        </Link>
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button
              variant="solid"
              size="sm"
              leftIcon={<Icon icon="ic:baseline-whatsapp" width={18} />}
            >
              Order via WhatsApp
            </Button>
          </a>
        )}
      </div>

      <p
        className="mt-6 text-foreground/55"
        style={{ fontSize: 13, lineHeight: '20px' }}
      >
        Pricing and delivery are confirmed by our team after you send the order. You can also{' '}
        <Link
          href="/contact"
          className="text-foreground underline underline-offset-2 hover:opacity-75"
        >
          request a quotation
        </Link>{' '}
        if you prefer email.
      </p>
    </Container>
  )
}
