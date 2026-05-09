import type { CSSProperties, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Body / inline text scale. ~90% of Figma values; subhead and bodyLg also
// clamp() responsively so they read well on mobile.
export type TextSize =
  | 'subhead'  // 24/29 400 → clamp 18..22
  | 'bodyLg'   // 20/24 600 → clamp 16..18
  | 'cta'      // 20/24 500 → clamp 16..18
  | 'bodyEmph' // 16/19 600
  | 'body'     // 16/24 400
  | 'caption'  // 14/21 400
  | 'small'    // 12/18 400

const STYLES: Record<TextSize, CSSProperties> = {
  subhead:  { fontSize: 'clamp(18px, 2vw, 22px)',     lineHeight: 1.4,   fontWeight: 400 },
  bodyLg:   { fontSize: 'clamp(16px, 1.4vw, 18px)',   lineHeight: 1.4,   fontWeight: 600 },
  cta:      { fontSize: 'clamp(16px, 1.4vw, 18px)',   lineHeight: 1.4,   fontWeight: 500 },
  bodyEmph: { fontSize: 16, lineHeight: '19px', fontWeight: 600 },
  body:     { fontSize: 16, lineHeight: '24px', fontWeight: 400 },
  caption:  { fontSize: 14, lineHeight: '21px', fontWeight: 400 },
  small:    { fontSize: 12, lineHeight: '18px', fontWeight: 400 },
}

export function Text({
  size = 'body',
  as: As = 'p',
  children,
  className,
  style,
}: {
  size?: TextSize
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <As
      className={cn('font-body text-foreground', className)}
      style={{ ...STYLES[size], ...style }}
    >
      {children}
    </As>
  )
}
