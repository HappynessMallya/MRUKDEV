'use client'

import { useEffect, useState } from 'react'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { BilingualText } from '@/types/tenant'

// Frame 154 — three text tabs centered (Features / Specifications / Discover).
// Clicking a tab smooth-scrolls to that section. As the user scrolls, the tab
// tracking the section in view becomes active (IntersectionObserver). Sticky
// just below the navbar so it stays reachable through the long page.
const TABS: { id: string; key: 'features' | 'specifications' | 'discover'; href: string; fallback: string }[] = [
  { id: 'characteristics', key: 'features', href: '#characteristics', fallback: 'Features' },
  { id: 'specifications', key: 'specifications', href: '#specifications', fallback: 'Specifications' },
  { id: 'discover', key: 'discover', href: '#discover', fallback: 'Discover' },
]

export function ProductTabs() {
  const t = useTenantStore((s) => s.t)
  const config = useTenantStore((s) => s.config)
  const tabsCopy = (config?.pages.product_detail?.texts as { tabs?: Record<string, BilingualText> } | undefined)?.tabs ?? {}

  const [active, setActive] = useState<string>('characteristics')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    TABS.forEach((tab) => {
      const el = document.getElementById(tab.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-16 z-30 bg-surface">
      <Container>
        <nav
          role="tablist"
          aria-label="Product sections"
          className="flex items-center justify-start gap-10"
        >
          {TABS.map((tab) => {
            const label = tabsCopy[tab.key] ?? { en: tab.fallback }
            const isActive = tab.id === active
            return (
              <a
                key={tab.id}
                href={tab.href}
                role="tab"
                aria-selected={isActive}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={cn(
                  'relative py-4 transition-colors',
                  isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                )}
                style={{ fontSize: 15, lineHeight: '20px', fontWeight: 600 }}
              >
                <span className="relative inline-block">
                  {t(label)}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute -bottom-2 left-0 right-0 h-0.5 rounded-full bg-primary"
                    />
                  )}
                </span>
              </a>
            )
          })}
        </nav>
      </Container>
    </div>
  )
}
