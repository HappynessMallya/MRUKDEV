'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Container, Heading } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { CharacteristicBlock, HighlightIcon } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 205 — heading + 4 highlight icons in a row + N feature blocks
// (image-with-text). Each block can be `stacked` (image full-width below
// text) or `image-left` / `image-right` for alternating side-by-side layouts.
export function ProductCharacteristics({
  highlightIcons = [],
  blocks = [],
}: {
  highlightIcons?: HighlightIcon[]
  blocks?: CharacteristicBlock[]
}) {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const headingLabel = (config?.pages.product_detail?.texts as { tabs?: Record<string, BilingualText> } | undefined)?.tabs
    ?.characteristics ?? { en: 'Characteristics' }

  return (
    <section id="characteristics" className="bg-background py-16 md:py-20">
      <Container>
        <Heading size="section" as="h2" className="text-center">
          {t(headingLabel)}
        </Heading>

        {highlightIcons.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {highlightIcons.map((h) => (
              <div key={h.id} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-primary">
                  <Icon icon={h.iconName} width={28} />
                </span>
                <span
                  className="text-foreground/80"
                  style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}
                >
                  {t(h.label)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-col gap-12 md:gap-16">
          {blocks.map((b) => (
            <CharacteristicBlockView key={b.id} block={b} t={t} />
          ))}
        </div>
      </Container>
    </section>
  )
}

function CharacteristicBlockView({
  block,
  t,
}: {
  block: CharacteristicBlock
  t: (f: BilingualText) => string
}) {
  const [errored, setErrored] = useState(false)
  const layout = block.layout ?? 'stacked'

  const text = (
    <div className="flex flex-col gap-2">
      <h3
        className="font-heading text-foreground"
        style={{ fontSize: 'clamp(20px, 2.4vw, 28px)', lineHeight: 1.2, fontWeight: 700 }}
      >
        {t(block.title)}
      </h3>
      {block.subtitle && (
        <p
          className="text-foreground/70 max-w-prose"
          style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.5 }}
        >
          {t(block.subtitle)}
        </p>
      )}
    </div>
  )

  const image = block.imageUrl && !errored ? (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface">
      <Image
        src={block.imageUrl}
        alt={t(block.title)}
        fill
        sizes="(min-width: 1024px) 700px, 100vw"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  ) : (
    <div
      className="relative aspect-[16/10] w-full rounded-xl"
      style={{ background: 'linear-gradient(135deg, #25396F 0%, #1B2A55 100%)' }}
    />
  )

  if (layout === 'stacked') {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto max-w-3xl">{text}</div>
        {image}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center',
        layout === 'image-right' && 'lg:[&>div:first-child]:order-1'
      )}
    >
      {layout === 'image-left' ? (
        <>
          <div>{image}</div>
          <div>{text}</div>
        </>
      ) : (
        <>
          <div>{image}</div>
          <div>{text}</div>
        </>
      )}
    </div>
  )
}
