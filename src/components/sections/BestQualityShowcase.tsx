'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Container, Heading } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import type { BilingualText } from '@/types/tenant'

interface ShowcaseItem {
  id: string
  imageUrl?: string
  title: BilingualText
  subtitle: BilingualText
  cta: { label: BilingualText; href: string }
}

export interface BestQualityShowcaseProps {
  heading: BilingualText
  items: ShowcaseItem[]
}

// Frame 39 + 56 + 57 in Figma. Section heading on top; items rendered as
// full-bleed images with a soft top gradient overlay so the white title +
// subtitle + "Learn more" link stay legible against any backdrop.
export function BestQualityShowcase({ heading, items }: BestQualityShowcaseProps) {
  const t = useTenantStore((s) => s.t)

  return (
    <section className="bg-background py-16 md:py-20">
      <Container>
        <Heading size="section" as="h2" className="text-center">
          {t(heading)}
        </Heading>
      </Container>

      <div className="mt-10 flex flex-col gap-6 md:gap-8">
        {items.map((item) => (
          <ShowcaseItemCard key={item.id} item={item} t={t} />
        ))}
      </div>
    </section>
  )
}

function ShowcaseItemCard({
  item,
  t,
}: {
  item: ShowcaseItem
  t: (f: BilingualText) => string
}) {
  const [imgErrored, setImgErrored] = useState(false)
  return (
    <Container>
      <Link
        href={item.cta.href}
        className="group relative block overflow-hidden rounded-xl"
      >
        <div className="relative aspect-[21/9] w-full">
          {item.imageUrl && !imgErrored ? (
            <Image
              src={item.imageUrl}
              alt={t(item.title)}
              fill
              unoptimized
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              onError={() => setImgErrored(true)}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(135deg, #25396F 0%, #1B2A55 100%)',
              }}
            />
          )}
          {/* Soft top-down dark gradient so white text on top stays legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 100%)',
            }}
          />
          <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-2 px-6 pt-8 text-center text-white md:pt-12">
            <h3
              className="font-heading"
              style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
            >
              {t(item.title)}
            </h3>
            <p
              className="text-white/85"
              style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.4, fontWeight: 400 }}
            >
              {t(item.subtitle)}
            </p>
            <span
              className="mt-1 inline-flex items-center gap-1.5 text-white/95 transition-colors group-hover:text-white"
              style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}
            >
              {t(item.cta.label)}
              <Icon icon="grommet-icons:next" width={14} />
            </span>
          </div>
        </div>
      </Link>
    </Container>
  )
}

