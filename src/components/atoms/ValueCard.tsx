import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Container 1-4 in Figma — value-prop card used in "Why MR UK" section.
//   bg:     #F5F5F7 (surface)
//   radius: 8px
//   pad:    32px (uniform)
//   border: 1px black (default) → 2px navy (active/hover)
//   gap:    8px vertical
//   icon:   navy, ~24-33px square
//   title:  Inter 700 24/28 black
//   body:   Inter 400 16/20 foreground @ 70%
export function ValueCard({
  icon,
  title,
  body,
  active,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  body: ReactNode
  active?: boolean
  className?: string
}) {
  return (
    <article
      className={cn(
        'flex flex-col gap-2 rounded-lg bg-surface p-8 transition-[border-color,border-width]',
        active
          ? 'border-2 border-primary'
          : 'border border-foreground hover:border-primary',
        className
      )}
    >
      {icon && <div className="text-primary">{icon}</div>}
      <h3
        className="font-heading text-foreground pt-2"
        style={{ fontSize: 24, lineHeight: '28px', fontWeight: 700 }}
      >
        {title}
      </h3>
      <p
        className="font-body text-foreground/70"
        style={{ fontSize: 16, lineHeight: '20px', fontWeight: 400 }}
      >
        {body}
      </p>
    </article>
  )
}
