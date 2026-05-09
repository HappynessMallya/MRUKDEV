import Link from 'next/link'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

// Maps the JSON `socials` object keys to Iconify icon names.
const ICON_MAP: Record<string, string> = {
  facebook: 'mdi:facebook',
  instagram: 'mdi:instagram',
  linkedin: 'mdi:linkedin',
  youtube: 'mdi:youtube',
  twitter: 'mdi:twitter',
  x: 'mdi:twitter',
  tiktok: 'ic:baseline-tiktok',
  whatsapp: 'ic:baseline-whatsapp',
}

export function SocialIcons({
  socials,
  className,
  iconSize = 20,
}: {
  socials: Record<string, string>
  className?: string
  iconSize?: number
}) {
  const entries = Object.entries(socials).filter(([, url]) => Boolean(url))
  if (entries.length === 0) return null

  return (
    <ul className={cn('flex items-center gap-3', className)}>
      {entries.map(([key, url]) => {
        const iconName = ICON_MAP[key] ?? 'material-symbols:link'
        return (
          <li key={key}>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={key}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon icon={iconName} width={iconSize} />
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
