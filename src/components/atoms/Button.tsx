import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

// Variants and sizes extracted from Figma component sets:
//   Button         (lg solid)        — bg #25396F  → hover #2C4895
//   Button 2       (lg solid wide)   — bg #25396F  → hover #2D4C9E
//   button 3       (md outline-light)— transparent → 1px white border, white text
//   Compare button (sm ghost)        — bg #25396F @ 20%  → solid on hover
//   Learrn more    (sm solid + sm secondary) — solid navy / white-bg + navy border
export type ButtonVariant =
  | 'solid'         // primary CTA — navy bg, white text
  | 'secondary'     // white bg, navy border, black text
  | 'outline'       // transparent, navy border + text (use on light surfaces)
  | 'outlineLight'  // transparent, white border + text (use on dark surfaces)
  | 'ghost'         // navy/20 bg, white text — used for chips like "Compare"
  | 'soft'          // soft gray bg, no border, dark text — for secondary actions on PDPs

export type ButtonSize = 'sm' | 'md' | 'lg'

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid:
    'bg-primary text-white hover:bg-[#2C4895] active:bg-[#2D4C9E] disabled:bg-primary/50',
  secondary:
    'bg-background text-foreground border border-primary hover:bg-surface',
  outline:
    'bg-transparent text-primary border border-primary hover:bg-primary/5',
  outlineLight:
    'bg-transparent text-white border border-white hover:bg-white/10',
  ghost:
    'bg-primary/20 text-white hover:bg-primary/30',
  soft:
    'bg-surface text-foreground hover:bg-surface-alt',
}

// Heights tightened from the original Figma extract (51/56/61) so CTAs read
// at parity with the Figma screens — buttons there sit ~36/44/52px tall.
const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'py-2 px-4 text-sm font-medium leading-[20px]',       // ~36px
  md: 'py-2.5 px-6 text-[15px] font-medium leading-[20px]', // ~40px
  lg: 'py-3 px-7 text-base font-medium leading-[24px]',     // ~48px
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export function Button({
  variant = 'solid',
  size = 'lg',
  leftIcon,
  rightIcon,
  fullWidth,
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-body transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
