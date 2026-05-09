'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { CharacteristicBlock, HighlightIcon } from '@/types/product'
import type { BilingualText } from '@/types/tenant'

// Frame 205 — "Characteristic" section. Centered heading, 4 highlight tiles
// in a row, then a vertical stack of feature blocks. Each block has a bold
// title, a smaller bold subtitle, and a description paragraph. Layouts cycle
// between `stacked` (text centered above a full-width image) and side-by-side
// `image-left` / `image-right` for visual rhythm.
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
    ?.characteristics ?? { en: 'Characteristic' }

  return (
    <section id="characteristics" className="bg-background py-14 md:py-20">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.15, fontWeight: 700 }}
        >
          {t(headingLabel)}
        </h2>

        {highlightIcons.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
            {highlightIcons.map((h) => (
              <div
                key={h.id}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-surface px-4 py-10 text-center"
              >
                {h.iconName.startsWith('/') ? (
                  <Image
                    src={h.iconName}
                    alt=""
                    width={42}
                    height={42}
                    className="h-10 w-auto"
                  />
                ) : (
                  <Icon icon={h.iconName} width={42} className="text-foreground" />
                )}
                <span
                  className="text-foreground"
                  style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}
                >
                  {t(h.label)}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-14 flex flex-col gap-14 md:gap-20">
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
    <div className="flex flex-col gap-3">
      <h3
        className="font-heading text-foreground"
        style={{ fontSize: 'clamp(22px, 2.4vw, 28px)', lineHeight: 1.2, fontWeight: 700 }}
      >
        {t(block.title)}
      </h3>
      {block.subtitle && (
        <p
          className="text-foreground"
          style={{ fontSize: 'clamp(16px, 1.6vw, 18px)', lineHeight: 1.35, fontWeight: 600 }}
        >
          {t(block.subtitle)}
        </p>
      )}
      {block.description && (
        <p
          className="text-foreground/70 max-w-prose"
          style={{ fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.55 }}
        >
          {t(block.description)}
        </p>
      )}
    </div>
  )

  const image = block.imageUrl && !errored ? (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-surface">
      <Image
        src={block.imageUrl}
        alt={t(block.title)}
        fill
        sizes="(min-width: 1024px) 1200px, 100vw"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  ) : (
    <div
      className="relative aspect-[16/9] w-full rounded-2xl"
      style={{ background: 'linear-gradient(135deg, #25396F 0%, #1B2A55 100%)' }}
    />
  )

  if (layout === 'stacked') {
    return (
      <div className="flex flex-col gap-8 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          {text}
        </div>
        {image}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center',
        layout === 'image-left' && 'lg:[&>div:first-child]:order-2'
      )}
    >
      <div>{text}</div>
      <div>{image}</div>
    </div>
  )
}
