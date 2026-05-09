'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

// Frame 204 left column — main product image in a surface card with a row of
// thumbnail picks below. Click a thumbnail to swap the main image.
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0)
  const [errored, setErrored] = useState<Set<number>>(new Set())

  if (!images.length) return null

  const fail = (i: number) => setErrored((s) => new Set(s).add(i))

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface">
        {!errored.has(active) ? (
          <Image
            src={images[active]}
            alt={alt}
            fill
            priority
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-contain p-8"
            onError={() => fail(active)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-placeholder">
            <Icon icon="material-symbols:image-outline" width={64} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                'relative aspect-square overflow-hidden rounded-lg bg-surface transition',
                i === active ? 'ring-2 ring-primary' : 'ring-1 ring-border-subtle hover:ring-primary/50'
              )}
            >
              {!errored.has(i) ? (
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${i + 1}`}
                  fill
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
