'use client'

import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'

import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { Lang } from '@/types/tenant'

const LABEL: Record<Lang, string> = { en: 'EN', sw: 'SW' }
// Stable fallback — defined at module scope so the selector always returns
// the same reference when the store config is null (otherwise React's
// useSyncExternalStore detects a "new" snapshot every render and bails out
// with the "getServerSnapshot should be cached" error).
const DEFAULT_LANGS: Lang[] = ['en']

export function LanguageSwitcher({ className }: { className?: string }) {
  // Individual selectors — returning an object literal from a Zustand selector
  // would create a new reference each render and force re-renders on every
  // store update.
  const lang = useTenantStore((s) => s.lang)
  const setLang = useTenantStore((s) => s.setLang)
  const configLangs = useTenantStore((s) => s.config?.lang)
  const langs = (configLangs ?? DEFAULT_LANGS) as Lang[]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  if (langs.length <= 1) return null

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1 px-2 py-1.5 text-foreground hover:text-primary transition-colors"
        style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
      >
        <Icon icon="material-symbols:language" width={20} />
        {LABEL[lang]}
        <Icon
          icon="material-symbols:expand-more"
          width={16}
          className={cn('transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[100px] rounded-lg border border-border-subtle bg-background py-1 shadow-lg"
        >
          {langs.map((l) => (
            <li key={l}>
              <button
                role="option"
                aria-selected={l === lang}
                onClick={() => {
                  setLang(l)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-surface',
                  l === lang ? 'text-primary' : 'text-foreground'
                )}
                style={{ fontSize: 14, lineHeight: '21px', fontWeight: 600 }}
              >
                {LABEL[l]}
                {l === lang && <Icon icon="material-symbols:check" width={16} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
