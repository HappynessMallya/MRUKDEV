'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'

// Stub track-order form. Submission is currently a noop that flips to a
// "we couldn't find that order" empty state — when /api/orders/track is
// live, replace the timeout with a real fetch + status renderer.
type Status = 'idle' | 'searching' | 'not-found'

export function TrackOrderForm() {
  const [status, setStatus] = useState<Status>('idle')

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <form
        className="flex flex-col gap-5 rounded-2xl bg-surface p-6 md:p-8"
        onSubmit={(e) => {
          e.preventDefault()
          setStatus('searching')
          setTimeout(() => setStatus('not-found'), 800)
        }}
      >
        <Field id="order-number" label="Order number" placeholder="MRUK-00001234" required />
        <Field id="order-email" type="email" label="Email" placeholder="you@example.com" required />

        <div>
          <Button
            type="submit"
            variant="solid"
            size="md"
            disabled={status === 'searching'}
          >
            {status === 'searching' ? 'Looking up…' : 'Track order'}
          </Button>
        </div>

        {status === 'not-found' && (
          <div
            className="flex items-start gap-3 rounded-lg bg-background p-4"
            style={{ fontSize: 13, lineHeight: '20px' }}
          >
            <Icon icon="material-symbols:error-outline" width={20} className="mt-0.5 text-foreground/60" />
            <p className="text-foreground/75">
              We couldn&apos;t find an order matching those details. Double-check your order
              number, or{' '}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact support
              </Link>{' '}
              and we&apos;ll look it up for you.
            </p>
          </div>
        )}
      </form>

      <aside className="flex flex-col gap-4">
        <h2
          className="font-heading text-foreground"
          style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
        >
          Need help?
        </h2>
        <ul className="space-y-3">
          <Tip
            icon="material-symbols:mail-outline"
            text="Your order number is in the confirmation email we sent at checkout — search your inbox for “MR UK order”."
          />
          <Tip
            icon="ic:baseline-whatsapp"
            text="Already have an order on WhatsApp? Reply to the same conversation and our team will share an update."
          />
          <Tip
            icon="material-symbols:headset-mic-outline"
            text="Still stuck? Our support team replies in under 2 hours during business hours."
          />
        </ul>
        <Link href="/contact" className="inline-flex w-fit">
          <Button variant="outline" size="sm">
            Contact support
          </Button>
        </Link>
      </aside>
    </div>
  )
}

function Field({
  id,
  label,
  placeholder,
  type = 'text',
  required,
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span
        className="text-foreground"
        style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}
      >
        {label}
      </span>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-foreground/35 outline-none ring-1 ring-transparent transition-colors focus:ring-primary"
        style={{ fontSize: 14, lineHeight: '20px' }}
      />
    </label>
  )
}

function Tip({ icon, text }: { icon: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon icon={icon} width={18} className="mt-0.5 shrink-0 text-foreground/60" />
      <span className="text-foreground/75" style={{ fontSize: 13, lineHeight: '20px' }}>
        {text}
      </span>
    </li>
  )
}
