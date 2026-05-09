import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Page content wrapper. Figma reference width is 1512px (MacBook Pro 14");
// we cap at 1440px and add gutters so content breathes on wider screens.
// Full-bleed sections (hero, partnership banner) live outside this wrapper.
export function Container({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'main' | 'header' | 'footer'
}) {
  return (
    <As className={cn('mx-auto w-full max-w-[1440px] px-6 md:px-12', className)}>
      {children}
    </As>
  )
}
