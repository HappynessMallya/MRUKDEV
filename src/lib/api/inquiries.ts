// Inquiry submission (lead capture). The dashboard is the system of record:
// every inquiry — whether the visitor used the web form, WhatsApp, or email —
// is POSTed here and tagged with its `source`. For WhatsApp/email the storefront
// ALSO opens a click-to-chat handoff (wa.me / mailto) so the business is pinged
// on that channel; see `whatsappHandoffHref` / `mailtoHandoffHref` below.

import { apiFetch } from '@/lib/apiClient'
import type { ApiInquiry, InquiryInput } from '@/types/api'

// POST /inquiries — public; pass `token` to link the inquiry to a logged-in user.
// The backend validates `items` as a required array (rejects 400 "items must be
// an array" when omitted), so we always send it — defaulting to `[]` here so no
// caller can trip that validation.
export function createInquiry(
  input: InquiryInput,
  token?: string
): Promise<ApiInquiry> {
  const body: InquiryInput = { ...input, items: input.items ?? [] }
  return apiFetch<ApiInquiry>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(body),
    token,
  })
}

// Plain-text summary of an inquiry for the WhatsApp/email handoff body.
export function inquirySummary(input: InquiryInput): string {
  const lines = [
    `Name: ${input.contactName}`,
    input.contactEmail ? `Email: ${input.contactEmail}` : null,
    input.contactPhone ? `Phone: ${input.contactPhone}` : null,
    input.company ? `Company: ${input.company}` : null,
    '',
    input.message,
  ].filter((l): l is string => l !== null)
  return lines.join('\n')
}

// https://wa.me/<digits>?text=<summary> — opens the business WhatsApp chat.
export function whatsappHandoffHref(
  whatsapp: string | undefined,
  input: InquiryInput
): string | undefined {
  if (!whatsapp) return undefined
  const digits = whatsapp.replace(/[^0-9]/g, '')
  if (!digits) return undefined
  return `https://wa.me/${digits}?text=${encodeURIComponent(inquirySummary(input))}`
}

// mailto:<email>?subject=&body= — opens the visitor's mail client to the business.
export function mailtoHandoffHref(
  email: string | undefined,
  subject: string,
  input: InquiryInput
): string | undefined {
  if (!email) return undefined
  const params = new URLSearchParams({
    subject,
    body: inquirySummary(input),
  })
  return `mailto:${email}?${params.toString()}`
}
