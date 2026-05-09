import type { Metadata } from 'next'
import Link from 'next/link'

import { Button, Container } from '@/components/atoms'
import { getTenantConfig } from '@/lib/tenant'

interface FaqEntry {
  question: string
  answer: string
}

// Eight common pre-sales / delivery questions, rendered as a 2-up grid in the
// order shown in Figma. Move into tenant.pages.faq.texts when copy needs to
// vary per tenant or be translated.
const FAQS: FaqEntry[] = [
  {
    question: 'How long does delivery take?',
    answer:
      "Most orders arrive within two to four hours. Delivery times depend on your location and market availability. You'll see the estimated time before you confirm your order.",
  },
  {
    question: 'What markets can I order from?',
    answer:
      "We work with trusted local markets across Dar es Salaam and surrounding areas. Browse our Markets page to see what's available in your neighborhood right now.",
  },
  {
    question: 'Can I track my order?',
    answer:
      "Yes. Once your order ships, you'll receive real-time updates on your delivery status. Track your rider's location and get notified when they're nearby.",
  },
  {
    question: 'What if something is damaged?',
    answer:
      "We stand behind every delivery. If produce arrives damaged or spoiled, contact us within two hours and we'll make it right with a replacement or refund.",
  },
  {
    question: 'Do you deliver on weekends?',
    answer:
      "We deliver seven days a week, including weekends and holidays. Check your market's hours to confirm availability for the day you want to order.",
  },
  {
    question: 'How do I pay for my order?',
    answer:
      'We accept mobile money, bank transfers, and card payments. Your payment is secure and processed before your order reaches the market.',
  },
  {
    question: 'Can I change my order after placing it?',
    answer:
      "Changes are possible if your order hasn't been picked yet. Contact us right away with your order number and we'll help if we can.",
  },
  {
    question: 'What about produce quality and freshness?',
    answer:
      'Our markets hand-select produce daily. You see real photos and prices before ordering, and our riders handle everything with care to keep it fresh.',
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `FAQ — ${tenant.identity.companyName}`,
    description: 'Answers to the most common questions about ordering, delivery, payment and quality.',
  }
}

export default function FaqPage() {
  return (
    <Container className="py-14 md:py-20">
      <header className="max-w-2xl">
        <h1
          className="font-heading text-foreground"
          style={{ fontSize: 'clamp(32px, 4vw, 52px)', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          Questions
        </h1>
        <p className="mt-4 text-foreground/65" style={{ fontSize: 16, lineHeight: '24px' }}>
          Find answers to what matters most
        </p>
      </header>

      <div className="mt-12 md:mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {FAQS.map((faq) => (
          <FaqItem key={faq.question} entry={faq} />
        ))}
      </div>

      <div className="mt-16 md:mt-20 max-w-md">
        <h2
          className="font-heading text-foreground"
          style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          Need more help?
        </h2>
        <p className="mt-3 text-foreground/65" style={{ fontSize: 15, lineHeight: '22px' }}>
          Reach out to our support team below
        </p>
        <Link href="/contact" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Contact us
          </Button>
        </Link>
      </div>
    </Container>
  )
}

function FaqItem({ entry }: { entry: FaqEntry }) {
  return (
    <div>
      <h3
        className="font-heading text-foreground"
        style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
      >
        {entry.question}
      </h3>
      <p
        className="mt-3 text-foreground/75"
        style={{ fontSize: 15, lineHeight: '24px', fontWeight: 400 }}
      >
        {entry.answer}
      </p>
    </div>
  )
}
