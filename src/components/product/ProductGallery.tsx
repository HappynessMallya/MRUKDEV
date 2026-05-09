'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

// Frame 204 left column — main product image with hover prev/next chevrons
// pinned to the vertical center, plus a thumbnail strip below for direct
// jumps. Click a thumbnail or arrow to swap the active image.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  if (!images.length) return null

  const fail = (i: number) => setErrored((s) => new Set(s).add(i))
  const goPrev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActive((i) => (i + 1) % images.length)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-surface">
        {!errored.has(active) ? (
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            unoptimized
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-contain p-8"
            onError={() => fail(active)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-placeholder">
            <Icon icon="material-symbols:image-outline" width={64} />
          </div>
        )}

        {images.length > 1 && (
          <>
            <ArrowButton direction="prev" onClick={goPrev} />
            <ArrowButton direction="next" onClick={goNext} />
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg bg-surface transition',
                i === active ? 'ring-2 ring-primary' : 'ring-1 ring-transparent hover:ring-primary/40'
              )}
            >
              {!errored.has(i) ? (
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
                  unoptimized
                  sizes="120px"
                  className="object-contain p-2"
                  onError={() => fail(i)}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-placeholder">
                  <Icon icon="material-symbols:image-outline" width={24} />
                </span>
              )}
            </button>
          ))}
        </div>
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
      aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
      className={cn(
        'absolute top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground/70 shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-colors hover:text-foreground',
        direction === 'prev' ? 'left-4' : 'right-4'
      )}
    >
      <Icon
        icon={direction === 'prev' ? 'material-symbols:chevron-left' : 'material-symbols:chevron-right'}
        width={22}
      />
    </button>
  )
}
