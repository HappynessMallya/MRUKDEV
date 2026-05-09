'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { BilingualText } from '@/types/tenant'

interface Slide {
  id: string
  imageUrl: string
  title: BilingualText
  subtitle: BilingualText
  cta: { label: BilingualText; href: string }
  gradient: string
  // Optional per-slide foreground colour. Defaults to white. Slides with light
  // gradients (e.g. the AC slide on a soft cool gray) need a dark foreground.
  textColor?: string
}

export interface HeroCarouselProps {
  autoPlay?: boolean
  autoPlayInterval?: number
  slides: Slide[]
}

// Frame 47 in Figma — full-bleed hero. The gradient/texture spans the entire
// viewport width; only the inner copy + product image are constrained to the
// 1440px content column. Arrows sit on the far left/right of the band.
export function HeroCarousel({ autoPlay = true, autoPlayInterval = 5500, slides }: HeroCarouselProps) {
  const t = useTenantStore((s) => s.t)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!autoPlay || paused || slides.length <= 1) return
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), autoPlayInterval)
    return () => clearInterval(id)
  }, [autoPlay, autoPlayInterval, paused, slides.length])

  if (!slides.length) return null

  const goTo = (i: number) => setActive(((i % slides.length) + slides.length) % slides.length)

  return (
    <section
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative h-[480px] sm:h-[600px] md:h-[660px] lg:h-[720px] w-full">
        {slides.map((slide, i) => (
          <SlideContent key={slide.id} slide={slide} active={i === active} t={t} />
        ))}

        {slides.length > 1 && (
          <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-12">
            <ArrowButton direction="prev" onClick={() => goTo(active - 1)} />
            <ArrowButton direction="next" onClick={() => goTo(active + 1)} />
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'h-1 w-14 rounded-sm transition-colors',
                i === active ? 'bg-primary' : 'bg-primary/30 hover:bg-primary/50'
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function SlideContent({
  slide,
  active,
  t,
}: {
  slide: Slide
  active: boolean
  t: (f: BilingualText) => string
}) {
  const fg = slide.textColor ?? '#FFFFFF'

  return (
    <div
      className={cn(
        'absolute inset-0 transition-opacity duration-700',
        active ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      style={{ background: slide.gradient }}
      aria-hidden={!active}
    >
      {/*
        Mobile (< md): vertical stack — image on top, then short title, then
        a small CTA. We need extra horizontal padding so the prev/next arrows
        sitting at px-6 don't overlap the image. Title + button live below
        the image in the lower third.

        Desktop (md+): unchanged 50/50 split with copy on the left, full
        product photo on the right.
      */}
      <div className="mx-auto h-full w-full max-w-[1440px] px-16 sm:px-20 md:px-32 lg:px-40">
        {/* Mobile-only stacked layout. Extra bottom padding (pb-14) keeps
            the Learn more button clear of the absolutely-positioned slide
            indicator strip that sits at bottom-6 of the hero band. */}
        <div className="flex h-full flex-col items-center justify-center gap-5 pt-6 pb-14 md:hidden">
          <div className="relative w-full flex-1 min-h-0">
            <Image
              src={slide.imageUrl}
              alt={t(slide.title)}
              fill
              priority={active}
              sizes="(max-width: 640px) 70vw, 60vw"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <h2
              className="font-heading"
              style={{
                color: fg,
                fontSize: 'clamp(20px, 5vw, 26px)',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '-0.01em',
              }}
            >
              {t(slide.title)}
            </h2>
            <Link href={slide.cta.href}>
              <Button variant="solid" size="sm">
                {t(slide.cta.label)}
              </Button>
            </Link>
          </div>
        </div>

        {/* Desktop two-column layout */}
        <div className="hidden h-full md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-14">
          <div className="flex flex-col justify-center max-w-[520px]">
            <h2
              className="font-heading"
              style={{
                color: fg,
                fontSize: 'clamp(32px, 4.4vw, 60px)',
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: '-0.015em',
              }}
            >
              {t(slide.title)}
            </h2>
            <SlideSubtitle text={t(slide.subtitle)} fg={fg} />
            <div className="mt-8 lg:mt-10">
              <Link href={slide.cta.href}>
                <Button variant="solid" size="md">
                  {t(slide.cta.label)}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-[80%] w-full">
                <Image
                  src={slide.imageUrl}
                  alt={t(slide.title)}
                  fill
                  priority={active}
                  sizes="(min-width: 1024px) 720px, 50vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlideSubtitle({ text, fg }: { text: string; fg: string }) {
  // Figma slides give the first line (model code | tagline) more weight, then
  // any extra newline-separated lines drop in size and opacity. We split on
  // \n so the JSON keeps writing one `subtitle` string per slide.
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return null
  const [primary, ...rest] = lines

  return (
    <div className="mt-5 flex flex-col gap-2">
      <p
        className="max-w-md"
        style={{
          color: fg,
          opacity: 0.92,
          fontSize: 'clamp(15px, 1.25vw, 18px)',
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        {primary}
      </p>
      {rest.length > 0 && (
        <p
          className="max-w-md"
          style={{
            color: fg,
            opacity: 0.6,
            fontSize: 'clamp(13px, 1vw, 15px)',
            lineHeight: 1.55,
            fontWeight: 400,
            whiteSpace: 'pre-line',
          }}
        >
          {rest.join('\n')}
        </p>
      )}
    </div>
  )
}

function ArrowButton({
  direction,
  onClick,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Previous slide' : 'Next slide'}
      className="pointer-events-auto flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full bg-[#E8EAEC] shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#DDDFE2]"
    >
      <Image
        src="/icons/arrow.svg"
        alt=""
        width={10}
        height={18}
        className={cn('h-3.5 w-auto md:h-4', direction === 'prev' && 'rotate-180')}
      />
    </button>
  )
}
