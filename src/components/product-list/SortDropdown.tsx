'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

const OPTIONS: { value: string; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest first' },
]

// Updates the `?sort=` query param on selection. Server-rendered list page
// reads it back and reorders products. Closing on outside-click and on Esc.
export function SortDropdown() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get('sort') ?? 'featured'

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'featured') params.delete('sort')
    else params.set('sort', value)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    setOpen(false)
  }

  const activeLabel = OPTIONS.find((o) => o.value === current)?.label ?? 'Featured'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-background px-4 py-2 text-foreground hover:border-primary transition-colors"
        style={{ fontSize: 14, lineHeight: '21px', fontWeight: 500 }}
      >
        <span className="text-muted">Sort by:</span>
        <span>{activeLabel}</span>
        <Icon
          icon="material-symbols:expand-more"
          width={16}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-20 mt-1 min-w-[220px] rounded-lg border border-border-subtle bg-background py-1 shadow-lg"
        >
          {OPTIONS.map((opt) => (
            <li key={opt.value}>
              <button
                role="option"
                aria-selected={opt.value === current}
                onClick={() => select(opt.value)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2 text-left transition-colors hover:bg-surface',
                  opt.value === current ? 'text-primary font-semibold' : 'text-foreground'
                )}
                style={{ fontSize: 14, lineHeight: '21px' }}
              >
                {opt.label}
                {opt.value === current && <Icon icon="material-symbols:check" width={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
