'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/atoms'

// Frame 80 in Figma — "Get in touch" form lives inside a large soft-gray
// rounded card. White inputs, label above each field, and a full-width
// solid Send CTA at the bottom. Submission is a stub until /api/contact ships.
//
// When the user lands here from a product PDP via "Get a quotation", we
// pre-fill the Subject + Message from `?subject=` and `?product=` so they
// don't have to retype the SKU.
export function ContactForm() {
  const [submitting, setSubmitting] = useState(false)
  const searchParams = useSearchParams()
  const subjectParam = searchParams.get('subject') ?? ''
  const productParam = searchParams.get('product') ?? ''
  const messagePrefill = productParam
    ? `Hi MR UK,\n\nI'd like a quotation for the product ${productParam}. Please share pricing and availability.`
    : ''

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
          setSubmitting(true)
          setTimeout(() => setSubmitting(false), 800)
        }}
      >
        <Field id="contact-name" label="Your name" required />
        <Field id="contact-email" type="email" label="Email" required />
        <Field id="contact-subject" label="Subject" placeholder="Title" defaultValue={subjectParam} />
        <Field
          id="contact-message"
          label="Message"
          placeholder="Tell us more..."
          multiline
          defaultValue={messagePrefill}
        />

        <div className="mt-2">
          <Button type="submit" variant="solid" size="md" fullWidth disabled={submitting}>
            {submitting ? 'Sending…' : 'Send'}
          </Button>
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
  defaultValue,
}: {
  id: string
  label: string
  placeholder?: string
  type?: string
  required?: boolean
  multiline?: boolean
  defaultValue?: string
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
          defaultValue={defaultValue}
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
          defaultValue={defaultValue}
          className="rounded-lg bg-background px-4 py-3 text-foreground placeholder:text-foreground/35 outline-none ring-1 ring-transparent transition-colors focus:ring-primary"
          style={{ fontSize: 14, lineHeight: '20px' }}
        />
      )}
    </label>
  )
}
