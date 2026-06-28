'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { createInquiry, whatsappHandoffHref } from '@/lib/api/inquiries'
import type { InquiryInput, InquirySource } from '@/types/api'

// Reads at build time — when false the form simulates a send (mock mode).
const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

type Status = 'idle' | 'submitting' | 'success' | 'error'

// Frame 80 — "Get in touch" form. Submitting POSTs to /inquiries (source "web",
// the dashboard is the system of record). A second action sends the same inquiry
// via WhatsApp: it POSTs (source "whatsapp") AND opens the business chat.
//
// When the visitor arrives from a product PDP via "Get a quotation", Subject +
// Message are pre-filled from `?subject=` / `?product=`.
export function ContactForm() {
  const config = useTenantStore((s) => s.config)
  const whatsapp = config?.global.contact.whatsapp

  const searchParams = useSearchParams()
  const productParam = searchParams.get('product') ?? ''

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState(searchParams.get('subject') ?? '')
  const [message, setMessage] = useState(
    productParam
      ? `Hi MR UK,\n\nI'd like a quotation for the product ${productParam}. Please share pricing and availability.`
      : ''
  )

  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string>()
  const [inquiryNumber, setInquiryNumber] = useState<string>()

  function buildInput(source: InquirySource): InquiryInput {
    // Subject isn't a backend field — fold it into the message.
    const body = subject.trim() ? `${subject.trim()}\n\n${message}` : message
    return {
      contactName: name.trim(),
      contactEmail: email.trim() || undefined,
      contactPhone: phone.trim() || undefined,
      message: body,
      source,
      // Backend requires `items` to be an array. We send it empty: a line item
      // requires `productId` + `sku` (both validated non-empty), which the
      // contact form doesn't have — the product reference (from a PDP "Get a
      // quotation" link) is carried in the prefilled message instead.
      items: [],
    }
  }

  async function submit(source: InquirySource): Promise<boolean> {
    setStatus('submitting')
    setError(undefined)
    try {
      if (USE_API) {
        const res = await createInquiry(buildInput(source))
        setInquiryNumber(res.inquiryNumber)
      } else {
        await new Promise((r) => setTimeout(r, 600))
      }
      setStatus('success')
      return true
    } catch {
      setStatus('error')
      setError('Something went wrong sending your message. Please try again or reach us on WhatsApp.')
      return false
    }
  }

  async function handleWhatsApp() {
    const href = whatsappHandoffHref(whatsapp, buildInput('whatsapp'))
    // Best-effort record in the dashboard, then hand off to the chat.
    await submit('whatsapp')
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl bg-surface p-8 md:p-10">
        <div className="flex flex-col items-start gap-4">
          <span className="inline-flex items-center justify-center rounded-full bg-green-50 p-3 text-green-700">
            <Icon icon="material-symbols:check-circle-outline" width={28} />
          </span>
          <h2
            className="font-heading text-foreground"
            style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.15, fontWeight: 700 }}
          >
            Thank you — we&apos;ve received your message
          </h2>
          <p className="text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
            Our team will get back to you shortly.
            {inquiryNumber ? ` Your reference is ${inquiryNumber}.` : ''}
          </p>
        </div>
      </div>
    )
  }

  const submitting = status === 'submitting'

  return (
    <div className="rounded-3xl bg-surface p-8 md:p-10">
      <h2
        className="font-heading text-foreground"
        style={{ fontSize: 'clamp(26px, 3vw, 36px)', lineHeight: 1.15, fontWeight: 700 }}
      >
        Get in touch
      </h2>
      <p className="mt-2 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
        We answer quickly and listen well
      </p>

      <form
        className="mt-8 flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          void submit('web')
        }}
      >
        <Field id="contact-name" label="Your name" required value={name} onChange={setName} />
        <Field id="contact-email" type="email" label="Email" required value={email} onChange={setEmail} />
        <Field id="contact-phone" type="tel" label="Phone" placeholder="+255…" value={phone} onChange={setPhone} />
        <Field id="contact-subject" label="Subject" placeholder="Title" value={subject} onChange={setSubject} />
        <Field
          id="contact-message"
          label="Message"
          placeholder="Tell us more..."
          required
          multiline
          value={message}
          onChange={setMessage}
        />

        {error && (
          <p className="text-red-600" style={{ fontSize: 14, lineHeight: '20px' }}>
            {error}
          </p>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <Button type="submit" variant="solid" size="md" fullWidth disabled={submitting}>
            {submitting ? 'Sending…' : 'Send'}
          </Button>
          {whatsapp && (
            <Button
              type="button"
              variant="soft"
              size="md"
              fullWidth
              disabled={submitting}
              leftIcon={<Icon icon="ic:baseline-whatsapp" width={18} />}
              onClick={() => void handleWhatsApp()}
            >
              Send via WhatsApp
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({
  id,
  label,
  placeholder,
  type = 'text',
  required,
  multiline,
  value,
  onChange,
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  multiline?: boolean
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span
        className="text-foreground"
        style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          className="rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-foreground/35 outline-none ring-1 ring-transparent transition-colors focus:ring-primary"
          style={{ fontSize: 14, lineHeight: '22px' }}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-foreground/35 outline-none ring-1 ring-transparent transition-colors focus:ring-primary"
          style={{ fontSize: 14, lineHeight: '20px' }}
        />
      )}
    </label>
  )
}
