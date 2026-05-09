'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'

// Reads the tenant's navbar logo (light / dark variant) from the live config.
// Gracefully degrades to the company name as a wordmark if the remote logo
// asset is unreachable — common during local dev when bucket URLs 404.
export function Logo({
  variant = 'light',
  href = '/',
  className,
  // The MR UK logo is ~3:2 (shield mark with wordmark beneath). Intrinsic
  // dimensions here are hints for next/image so it can avoid layout shift;
  // actual render size is controlled by Tailwind classes below.
  width = 180,
  height = 120,
}: {
  variant?: 'light' | 'dark'
  href?: string | null
  className?: string
  width?: number
  height?: number
}) {
  const config = useTenantStore((s) => s.config)
  const [errored, setErrored] = useState(false)

  const src = config?.branding.logos.navbar[variant]
  const name = config?.identity.companyName ?? ''

  const inner =
    src && !errored ? (
      <Image
        src={src}
        alt={name}
        width={width}
        height={height}
        priority
        onError={() => setErrored(true)}
        className="h-10 w-auto object-contain"
      />
    ) : (
      <span
        className={cn(
          'font-heading',
          variant === 'dark' ? 'text-white' : 'text-primary'
        )}
        style={{ fontSize: 24, lineHeight: '29px', fontWeight: 700, letterSpacing: 0.5 }}
      >
        {name || 'MR UK'}
      </span>
    )

  if (href === null) return <span className={className}>{inner}</span>
  return (
    <Link href={href} className={cn('inline-flex items-center', className)}>
      {inner}
    </Link>
  )
}
