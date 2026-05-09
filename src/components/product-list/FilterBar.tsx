'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'

// Frame 24 in Figma — full-width white bar under the category band.
// Coral filter icon, results count, and chips for any currently-applied
// Type filter. Each chip's × removes that filter via the URL query.
export function FilterBar({
  resultsCount,
  className,
}: {
  resultsCount: number
  className?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // `type` may be a comma-separated list (?type=convection,grill) so multiple
  // chips can be active at once and removed individually.
  const typeParam = searchParams.get('type') ?? ''
  const activeTypes = typeParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const removeType = (typeToRemove: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const remaining = activeTypes.filter((t) => t !== typeToRemove)
    if (remaining.length === 0) params.delete('type')
    else params.set('type', remaining.join(','))
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3 py-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-[#FF7A6C] transition-opacity hover:opacity-80"
          style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}
        >
          <Icon icon="material-symbols:filter-alt-outline" width={18} />
          Filter
        </button>

        <span className="h-5 w-px bg-border-subtle" aria-hidden />

        <span className="text-foreground/70" style={{ fontSize: 14, lineHeight: '20px' }}>
          {resultsCount} {resultsCount === 1 ? 'result' : 'results'}
        </span>

        {activeTypes.length > 0 && <span className="h-5 w-px bg-border-subtle" aria-hidden />}

        <ul className="flex flex-wrap items-center gap-2">
          {activeTypes.map((type) => (
            <li key={type}>
              <button
                type="button"
                onClick={() => removeType(type)}
                className="inline-flex items-center gap-1.5 rounded-full text-foreground transition-colors hover:text-primary"
                style={{ fontSize: 14, lineHeight: '20px', fontWeight: 500 }}
              >
                <span className="capitalize">{type}</span>
                <Icon icon="material-symbols:cancel-outline" width={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
