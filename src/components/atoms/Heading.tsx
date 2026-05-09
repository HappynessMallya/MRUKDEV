import type { CSSProperties, ElementType, ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Type scale derived from Figma but ~90% of source sizes, with `clamp()` so
// display sizes shrink on narrower viewports without a media query. Keeps the
// hierarchy intact across desktop / tablet / mobile and avoids the original
// 64px display feeling oversized on a real screen.
//
// Figma → here:
//   displayXl  64 → clamp 36..58   (was 64/77)
//   displayL   48 → clamp 32..44   (was 48/58)
//   section    48 → clamp 28..44   (was 48/58)
//   h1         40 → clamp 26..36   (was 40/48)
//   h2         36 → clamp 24..32   (was 36/44)
//   h3         32 → clamp 22..28   (was 32/39)
//   h4         24 → 22             (fixed, no clamp — already small)
export type HeadingSize =
  | 'displayXl'
  | 'displayL'
  | 'section'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'

const STYLES: Record<HeadingSize, CSSProperties> = {
  displayXl: { fontSize: 'clamp(28px, 4vw, 44px)',   lineHeight: 1.2,   fontWeight: 700, letterSpacing: 0 },
  displayL:  { fontSize: 'clamp(26px, 3.4vw, 38px)', lineHeight: 1.2,   fontWeight: 700, letterSpacing: 0 },
  section:   { fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1.2,   fontWeight: 700, letterSpacing: 0 },
  h1:        { fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2,   fontWeight: 700, letterSpacing: 0 },
  h2:        { fontSize: 'clamp(20px, 2.1vw, 26px)', lineHeight: 1.25,  fontWeight: 700, letterSpacing: 0 },
  h3:        { fontSize: 'clamp(18px, 1.8vw, 22px)', lineHeight: 1.25,  fontWeight: 700, letterSpacing: 0 },
  h4:        { fontSize: 18,                          lineHeight: '24px', fontWeight: 600, letterSpacing: 0 },
}

export function Heading({
  size,
  as,
  children,
  className,
  style,
}: {
  size: HeadingSize
  as?: ElementType
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const Tag = as ?? defaultTag(size)
  return (
    <Tag
      className={cn('font-heading text-foreground', className)}
      style={{ ...STYLES[size], ...style }}
    >
      {children}
    </Tag>
  )
}

function defaultTag(size: HeadingSize): ElementType {
  switch (size) {
    case 'displayXl':
    case 'displayL':
      return 'h1'
    case 'section':
    case 'h1':
      return 'h2'
    case 'h2':
      return 'h3'
    case 'h3':
      return 'h4'
    case 'h4':
      return 'h5'
  }
}
