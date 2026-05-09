'use client'

import Image from 'next/image'
import { Icon } from '@iconify/react'

import { Button, Container } from '@/components/atoms'
import { useCompareStore, COMPARE_LIMIT } from '@/stores/compareStore'
import { cn } from '@/lib/cn'

// Frame 28 in Figma — top compare strip on the products list page. Renders
// up to COMPARE_LIMIT slots: filled tiles (with a × badge to remove) followed
// by empty dashed slots. Compare CTA solid-active once 2+ products are
// selected; the dismiss × clears the entire selection.
export function CompareStrip() {
  const items = useCompareStore((s) => s.items)
  const remove = useCompareStore((s) => s.remove)
  const clear = useCompareStore((s) => s.clear)

  if (items.length === 0) return null

  const emptySlots = Math.max(0, COMPARE_LIMIT - items.length)
  const canCompare = items.length >= 2

  return (
    <div className="bg-surface">
      <Container>
        <div className="flex items-center gap-4 py-5 md:py-6">
          <div className="flex flex-1 flex-wrap items-center justify-center gap-3 md:gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative h-20 w-20 rounded-xl bg-background md:h-24 md:w-24">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name} from compare`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/70 text-white transition-colors hover:bg-foreground"
                >
                  <Icon icon="material-symbols:close-rounded" width={14} />
                </button>
              </div>
            ))}

            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed border-border text-foreground/30 md:h-24 md:w-24"
                aria-hidden
              >
                <Icon icon="material-symbols:add-rounded" width={28} />
              </div>
            ))}
          </div>

          <Button
            variant={canCompare ? 'solid' : 'ghost'}
            size="sm"
            disabled={!canCompare}
            className={cn(!canCompare && 'pointer-events-none opacity-60')}
          >
            Compare
          </Button>

          <button
            type="button"
            onClick={clear}
            aria-label="Clear comparison"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-background hover:text-foreground"
          >
            <Icon icon="material-symbols:close-rounded" width={22} />
          </button>
        </div>
      </Container>
    </div>
  )
}
