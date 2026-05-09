'use client'

import { useEffect, useState } from 'react'

import { Container } from '@/components/atoms'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { BilingualText } from '@/types/tenant'

// Frame 154 — three text tabs centered. Clicking a tab smooth-scrolls to that
// section. As the user scrolls, the tab tracking the section in view becomes
// active (IntersectionObserver). Sticky just below the navbar so it stays
// reachable through the long page.
const TABS: { id: string; key: 'characteristics' | 'specifications' | 'discover'; href: string }[] = [
  { id: 'characteristics', key: 'characteristics', href: '#characteristics' },
  { id: 'specifications', key: 'specifications', href: '#specifications' },
  { id: 'discover', key: 'discover', href: '#discover' },
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
    <div className="sticky top-16 z-30 bg-background border-b border-border-subtle">
      <Container>
        <nav
          role="tablist"
          aria-label="Product sections"
          className="flex items-center justify-center gap-8"
        >
          {TABS.map((tab) => {
            const label = tabsCopy[tab.key] ?? { en: tab.key }
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
                  'relative -mb-px py-4 transition-colors',
                  isActive ? 'text-primary' : 'text-muted hover:text-foreground'
                )}
                style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
              >
                {t(label)}
                {isActive && <span aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
              </a>
            )
          })}
        </nav>
      </Container>
    </div>
  )
}
