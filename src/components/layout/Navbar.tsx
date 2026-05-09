'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { Button, Container, Logo } from '@/components/atoms'
import { LanguageSwitcher } from './LanguageSwitcher'
import { MegaMenu } from './MegaMenu'
import { useTenantStore } from '@/stores/tenantStore'
import { cn } from '@/lib/cn'
import type { TenantConfig } from '@/types/tenant'

// Frame 15 in Figma — sticky white bar with logo, nav links (Inter 600 16),
// right-side icon cluster, and the brand CTA. Mega menu opens below the bar
// on hover for any link with a `megaMenu` payload in the tenant config.
//
// Config is passed as a prop (not pulled from Zustand) so the navbar is
// fully populated on the first server render. Zustand still drives the
// reactive bits — language, cart count.
export function Navbar({ config }: { config: TenantConfig }) {
  const t = useTenantStore((s) => s.t)
  const cartCount = useTenantStore((s) => s.cartCount)
  const features = config.features

  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const nav = config.global.navbar

  // Filter out feature-flagged-off links so we don't render dead nav items.
  const links = nav.links.filter(
    (l) => !l.featureFlag || features[l.featureFlag as keyof typeof features]
  )

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-background',
        nav.variant === 'sticky_solid' && 'bg-background',
        nav.variant === 'sticky_transparent' && 'bg-background/80 backdrop-blur'
      )}
      onMouseLeave={() => setOpenMenu(null)}
    >
      <Container className="relative">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo variant="light" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {links.map((link) => {
              const hasMega = Boolean(link.megaMenu?.enabled)
              return (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => hasMega && setOpenMenu(link.id)}
                >
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-foreground transition-colors hover:text-primary"
                    style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
                  >
                    {t(link.label)}
                    {hasMega && (
                      <Icon
                        icon="material-symbols:expand-more"
                        width={16}
                        className={cn('transition-transform', openMenu === link.id && 'rotate-180')}
                      />
                    )}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Right cluster — desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {nav.showSearch && <IconButton icon="material-symbols:search" label="Search" />}
            {nav.supportLink && (
              <Link
                href={nav.supportLink.href}
                className="px-2 py-1.5 text-foreground hover:text-primary transition-colors"
                style={{ fontSize: 16, lineHeight: '19px', fontWeight: 600 }}
              >
                {t(nav.supportLink.label)}
              </Link>
            )}
            {nav.showWishlist && features.wishlist && (
              <IconButton icon="material-symbols:favorite-outline" label="Wishlist" href="/account/wishlist" />
            )}
            {nav.showCart && (
              <IconButton
                icon="tdesign:cart"
                label="Cart"
                href="/cart"
                badge={cartCount > 0 ? cartCount : undefined}
              />
            )}
            <IconButton icon="iconoir:profile-circle" label="Account" href="/account/profile" />
            {nav.showLanguageSwitcher && <LanguageSwitcher />}
            {nav.cta.enabled && (
              <Link href={nav.cta.href} className="ml-2">
                <Button variant="solid" size="sm">
                  {t(nav.cta.label)}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 text-foreground"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <Icon icon={mobileOpen ? 'material-symbols:close' : 'material-symbols:menu'} width={24} />
          </button>
        </div>

        {/* Mega menu panel — single instance, content swapped by openMenu */}
        {openMenu &&
          (() => {
            const link = links.find((l) => l.id === openMenu)
            if (!link?.megaMenu?.enabled) return null
            return <MegaMenu data={link.megaMenu} />
          })()}
      </Container>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-background">
          <Container className="py-4">
            <ul className="flex flex-col gap-1">
              {links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-3 text-foreground hover:bg-surface"
                    style={{ fontSize: 16, lineHeight: '24px', fontWeight: 600 }}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
            {nav.supportLink && (
              <Link
                href={nav.supportLink.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-3 text-foreground hover:bg-surface border-t border-border-subtle mt-2"
                style={{ fontSize: 16, lineHeight: '24px', fontWeight: 600 }}
              >
                {t(nav.supportLink.label)}
              </Link>
            )}
            <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-4">
              {nav.showLanguageSwitcher && <LanguageSwitcher />}
              {nav.cta.enabled && (
                <Link href={nav.cta.href} className="ml-auto" onClick={() => setMobileOpen(false)}>
                  <Button variant="solid" size="sm">
                    {t(nav.cta.label)}
                  </Button>
                </Link>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

function IconButton({
  icon,
  label,
  href,
  badge,
}: {
  icon: string
  label: string
  href?: string
  badge?: number
}) {
  const inner = (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-surface hover:text-primary">
      <Icon icon={icon} width={22} />
      {badge !== undefined && (
        <span
          className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-white"
          style={{ fontSize: 11, lineHeight: '14px', fontWeight: 700 }}
        >
          {badge}
        </span>
      )}
    </span>
  )
  if (href) {
    return (
      <Link href={href} aria-label={label}>
        {inner}
      </Link>
    )
  }
  return (
    <button type="button" aria-label={label}>
      {inner}
    </button>
  )
}
