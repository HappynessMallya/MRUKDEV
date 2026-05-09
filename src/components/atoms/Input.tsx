'use client'

import { forwardRef, useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  error?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

// Form input — Inter 16/24 body, 1px border-subtle, 8px radius (matches the
// 8px ValueCard radius), navy focus ring. Placeholder color #AEAEB2 matches
// the Figma `placeholder` token.
export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, leftIcon, rightIcon, className, id, ...props },
  ref
) {
  const reactId = useId()
  const inputId = id ?? reactId

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-foreground"
          style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-background px-4 py-3 transition-colors',
          'border-border-subtle focus-within:border-primary',
          error && 'border-red-500 focus-within:border-red-500'
        )}
      >
        {leftIcon && <span className="shrink-0 text-muted">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full bg-transparent text-foreground placeholder:text-placeholder outline-none',
            className
          )}
          style={{ fontSize: 16, lineHeight: '24px', fontWeight: 400 }}
          {...props}
        />
        {rightIcon && <span className="shrink-0 text-muted">{rightIcon}</span>}
      </div>
      {error && (
        <p className="text-red-500" style={{ fontSize: 14, lineHeight: '21px' }}>
          {error}
        </p>
      )}
    </div>
  )
})
