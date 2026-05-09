import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Frame 58 in Figma — category filter chip / tab.
//   default:  1px navy border, text #AEAEB2 (placeholder grey)
//   active:   1px navy border, text #25396F (primary)
// Inter 600 24/29, padding 10×10, square corners (per Figma).
export function Tab({
  active,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      {...props}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center justify-center gap-2 border border-primary px-2.5 py-2.5 transition-colors',
        active ? 'text-primary' : 'text-placeholder hover:text-primary',
        className
      )}
      style={{ fontSize: 24, lineHeight: '29px', fontWeight: 600 }}
    >
      {children}
    </button>
  )
}
