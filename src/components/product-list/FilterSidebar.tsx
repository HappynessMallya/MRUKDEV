'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useState } from 'react'

import { cn } from '@/lib/cn'

const TYPE_OPTIONS = ['convection', 'grill', 'grill-2', 'solo']

// Frame 26 in Figma — soft surface card on the left with a single collapsible
// "Type" filter group. Selections live on the URL (?type=convection,grill) so
// they survive reload and can be cleared by the chip in the FilterBar.
export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(true)

  const typeParam = searchParams.get('type') ?? ''
  const active = new Set(
    typeParam
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )

  const toggle = (value: string) => {
    const next = new Set(active)
    if (next.has(value)) next.delete(value)
    else next.add(value)

    const params = new URLSearchParams(searchParams.toString())
    if (next.size === 0) params.delete('type')
    else params.set('type', Array.from(next).join(','))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <aside className="lg:sticky lg:top-32 lg:self-start">
      <div className="rounded-2xl bg-background p-6">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between"
          aria-expanded={open}
        >
          <span
            className="font-heading text-foreground"
            style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
          >
            Type
          </span>
          <Icon
            icon={open ? 'material-symbols:remove' : 'material-symbols:add'}
            width={18}
            className="text-foreground/70"
          />
        </button>

        {open && (
          <ul className="mt-5 space-y-3">
            {TYPE_OPTIONS.map((value) => {
              const checked = active.has(value)
              return (
                <li key={value}>
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(value)}
                      className={cn(
                        'h-[18px] w-[18px] cursor-pointer appearance-none rounded-[4px] border border-border bg-background transition-colors',
                        'checked:border-primary checked:bg-primary',
                        'relative checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2.5 checked:after:w-1.5 checked:after:-translate-x-1/2 checked:after:-translate-y-[60%] checked:after:rotate-45 checked:after:border-b-2 checked:after:border-r-2 checked:after:border-white'
                      )}
                    />
                    <span
                      className="capitalize text-foreground/80"
                      style={{ fontSize: 14, lineHeight: '20px' }}
                    >
                      {value.replace('-', ' ')}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
