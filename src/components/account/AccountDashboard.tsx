'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import { Button } from '@/components/atoms'
import { cn } from '@/lib/cn'
import { useAuthStore } from '@/stores/authStore'
import { useTenantStore } from '@/stores/tenantStore'
import type { Lang } from '@/types/tenant'
import type { Localized } from '@/types/api'
import {
  getCart,
  getProfile,
  getWishlist,
  listCreditOrders,
  listInquiries,
  listInvoices,
  listProformas,
  removeCartItem,
  removeWishlistProduct,
  type AccountDocument,
  type AccountProduct,
  type CartItem,
  type WishlistItem,
} from '@/lib/api/account'

// Signed-in account dashboard for customers & distributors. Each panel fetches
// its own slice client-side with the auth-store token (own-scoped, never
// cached) and renders loading / empty / error states independently, so a slow
// or 404-ing endpoint never blocks the rest of the page.

// ── small data hook ──────────────────────────────────────────────────────────
interface Resource<T> {
  loading: boolean
  data?: T
  error?: boolean
}

function useResource<T>(
  fetcher: (token: string) => Promise<T>,
  token: string | null
): Resource<T> {
  const [state, setState] = useState<Resource<T>>({ loading: true })
  useEffect(() => {
    if (!token) {
      setState({ loading: false })
      return
    }
    let alive = true
    setState({ loading: true })
    fetcher(token)
      .then((data) => alive && setState({ loading: false, data }))
      .catch(() => alive && setState({ loading: false, error: true }))
    return () => {
      alive = false
    }
  }, [fetcher, token])
  return state
}

// Proformas + invoices share one panel; fetch both in parallel. Module-level so
// the reference is stable across renders (safe as a useResource fetcher).
async function listDocuments(
  token: string
): Promise<{ proformas: AccountDocument[]; invoices: AccountDocument[] }> {
  const [pro, inv] = await Promise.all([listProformas(token), listInvoices(token)])
  return { proformas: pro.data, invoices: inv.data }
}

// ── helpers ──────────────────────────────────────────────────────────────────
function localize(name: Localized | string | undefined, lang: Lang): string {
  if (!name) return ''
  if (typeof name === 'string') return name
  return name[lang] ?? name.en ?? ''
}

function fmtDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function fmtMoney(n?: number): string | null {
  if (!n || n <= 0) return null
  return `${n.toLocaleString()} TZS`
}

function productImage(p: AccountProduct): string | undefined {
  return p.media?.find((m) => m.isPrimary)?.url ?? p.media?.[0]?.url
}

// Status → token color. Unknown statuses fall back to neutral.
const STATUS_TONE: Record<string, string> = {
  open: 'bg-blue-50 text-blue-700',
  in_review: 'bg-amber-50 text-amber-700',
  quoted: 'bg-violet-50 text-violet-700',
  submitted: 'bg-blue-50 text-blue-700',
  approved: 'bg-green-50 text-green-700',
  fulfilling: 'bg-amber-50 text-amber-700',
  delivered: 'bg-green-50 text-green-700',
  paid: 'bg-green-50 text-green-700',
  closed: 'bg-foreground/10 text-foreground/70',
  cancelled: 'bg-red-50 text-red-700',
  rejected: 'bg-red-50 text-red-700',
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null
  const tone = STATUS_TONE[status] ?? 'bg-foreground/10 text-foreground/70'
  return (
    <span
      className={cn('inline-block rounded-full px-2.5 py-1 capitalize', tone)}
      style={{ fontSize: 11, lineHeight: '14px', fontWeight: 600 }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

// ── reusable panel card ──────────────────────────────────────────────────────
function Panel({
  icon,
  title,
  resourceLoading,
  resourceError,
  isEmpty,
  emptyText,
  children,
}: {
  icon: string
  title: string
  resourceLoading: boolean
  resourceError?: boolean
  isEmpty: boolean
  emptyText: string
  children?: React.ReactNode
}) {
  return (
    <section className="rounded-2xl bg-surface p-5 md:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon icon={icon} width={18} />
        </span>
        <h2 className="font-heading text-foreground" style={{ fontSize: 17, lineHeight: '22px', fontWeight: 700 }}>
          {title}
        </h2>
      </header>
      {resourceLoading ? (
        <PanelSkeleton />
      ) : resourceError ? (
        <p className="text-foreground/55" style={{ fontSize: 14, lineHeight: '20px' }}>
          Couldn&apos;t load this right now.
        </p>
      ) : isEmpty ? (
        <p className="text-foreground/55" style={{ fontSize: 14, lineHeight: '20px' }}>
          {emptyText}
        </p>
      ) : (
        children
      )}
    </section>
  )
}

function PanelSkeleton() {
  return (
    <div className="space-y-2">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-10 animate-pulse rounded-lg bg-background" />
      ))}
    </div>
  )
}

// A simple two-line row used by the list-style panels.
function Row({
  primary,
  secondary,
  trailing,
}: {
  primary: string
  secondary?: string
  trailing?: React.ReactNode
}) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-border-subtle py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-foreground" style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>
          {primary}
        </p>
        {secondary && (
          <p className="truncate text-foreground/55" style={{ fontSize: 12, lineHeight: '16px' }}>
            {secondary}
          </p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </li>
  )
}

// ── panels ───────────────────────────────────────────────────────────────────
function InquiriesPanel({ token }: { token: string | null }) {
  const { loading, data, error } = useResource(listInquiries, token)
  const items = data?.data ?? []
  return (
    <Panel
      icon="material-symbols:request-quote-outline"
      title="My quote requests"
      resourceLoading={loading}
      resourceError={error}
      isEmpty={items.length === 0}
      emptyText="You haven't sent any quote requests yet."
    >
      <ul>
        {items.slice(0, 5).map((q) => (
          <Row
            key={q.id}
            primary={q.inquiryNumber}
            secondary={`${fmtDate(q.createdAt)}${q.items?.length ? ` · ${q.items.length} item(s)` : ''}`}
            trailing={<StatusBadge status={q.status} />}
          />
        ))}
      </ul>
    </Panel>
  )
}

function OrdersPanel({ token, lang }: { token: string | null; lang: Lang }) {
  const { loading, data, error } = useResource(listCreditOrders, token)
  const items = data?.data ?? []
  return (
    <Panel
      icon="material-symbols:local-shipping-outline"
      title="My orders"
      resourceLoading={loading}
      resourceError={error}
      isEmpty={items.length === 0}
      emptyText="No orders yet. Orders placed on credit will appear here."
    >
      <ul>
        {items.slice(0, 5).map((o) => {
          const total = fmtMoney(o.total)
          const ref = o.bankReference ? `Ref ${o.bankReference}` : o.bankName ?? localize(o.items?.[0]?.productName, lang)
          return (
            <Row
              key={o.id}
              primary={o.orderNumber}
              secondary={[fmtDate(o.createdAt), total, ref].filter(Boolean).join(' · ')}
              trailing={<StatusBadge status={o.status} />}
            />
          )
        })}
      </ul>
    </Panel>
  )
}

function DocumentsPanel({ token }: { token: string | null }) {
  const { loading, data, error } = useResource(listDocuments, token)
  const rows = [
    ...(data?.proformas ?? []).map((d) => ({ kind: 'Quote', d })),
    ...(data?.invoices ?? []).map((d) => ({ kind: 'Invoice', d })),
  ]
  return (
    <Panel
      icon="material-symbols:receipt-long-outline"
      title="Quotes & invoices"
      resourceLoading={loading}
      resourceError={error}
      isEmpty={rows.length === 0}
      emptyText="Quotes and invoices issued to you will appear here."
    >
      <ul>
        {rows.slice(0, 6).map(({ kind, d }) => {
          const num = d.proformaNumber ?? d.invoiceNumber ?? d.number ?? d.id.slice(-6)
          const total = fmtMoney(d.grandTotal ?? d.total)
          return (
            <Row
              key={d.id}
              primary={`${kind} ${num}`}
              secondary={[fmtDate(d.createdAt), total].filter(Boolean).join(' · ')}
              trailing={<StatusBadge status={d.status} />}
            />
          )
        })}
      </ul>
    </Panel>
  )
}

function WishlistPanel({ token, lang }: { token: string | null; lang: Lang }) {
  const { loading, data, error } = useResource(getWishlist, token)
  const [items, setItems] = useState<WishlistItem[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => {
    if (data) setItems(data.items)
  }, [data])

  const remove = useCallback(
    async (productId: string) => {
      if (!token) return
      setBusy(productId)
      try {
        await removeWishlistProduct(token, productId)
        setItems((cur) => cur.filter((i) => i.productId !== productId))
      } catch {
        /* leave the item in place on failure */
      } finally {
        setBusy(null)
      }
    },
    [token]
  )

  return (
    <Panel
      icon="material-symbols:favorite-outline"
      title="Wishlist"
      resourceLoading={loading}
      resourceError={error}
      isEmpty={items.length === 0}
      emptyText="Your wishlist is empty. Save products to find them here later."
    >
      <ul className="space-y-3">
        {items.slice(0, 5).map((it) => (
          <ProductRow
            key={it.id}
            product={it.product}
            lang={lang}
            busy={busy === it.productId}
            onRemove={() => remove(it.productId)}
          />
        ))}
      </ul>
    </Panel>
  )
}

function CartPanel({ token, lang }: { token: string | null; lang: Lang }) {
  const { loading, data, error } = useResource(getCart, token)
  const [items, setItems] = useState<CartItem[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => {
    if (data) setItems(data.items)
  }, [data])

  const remove = useCallback(
    async (itemId: string) => {
      if (!token) return
      setBusy(itemId)
      try {
        await removeCartItem(token, itemId)
        setItems((cur) => cur.filter((i) => i.id !== itemId))
      } catch {
        /* keep on failure */
      } finally {
        setBusy(null)
      }
    },
    [token]
  )

  return (
    <Panel
      icon="material-symbols:shopping-cart-outline"
      title="Cart"
      resourceLoading={loading}
      resourceError={error}
      isEmpty={items.length === 0}
      emptyText="Your cart is empty."
    >
      <ul className="space-y-3">
        {items.slice(0, 5).map((it) => (
          <ProductRow
            key={it.id}
            product={it.product}
            lang={lang}
            meta={[it.quantity ? `Qty ${it.quantity}` : null, fmtMoney(it.totalPrice)].filter(Boolean).join(' · ')}
            busy={busy === it.id}
            onRemove={() => remove(it.id)}
          />
        ))}
      </ul>
    </Panel>
  )
}

// Shared product row for wishlist & cart (thumbnail + name + remove).
function ProductRow({
  product,
  lang,
  meta,
  busy,
  onRemove,
}: {
  product: AccountProduct
  lang: Lang
  meta?: string
  busy: boolean
  onRemove: () => void
}) {
  const img = productImage(product)
  const name = localize(product.name, lang) || product.slug
  return (
    <li className="flex items-center gap-3">
      <Link
        href={`/products/${product.slug}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-background">
          {img ? (
            <Image src={img} alt={name} fill sizes="48px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-foreground/30">
              <Icon icon="material-symbols:image-outline" width={20} />
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-foreground" style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>
            {name}
          </span>
          {meta && (
            <span className="block truncate text-foreground/55" style={{ fontSize: 12, lineHeight: '16px' }}>
              {meta}
            </span>
          )}
        </span>
      </Link>
      <button
        type="button"
        onClick={onRemove}
        disabled={busy}
        aria-label={`Remove ${name}`}
        className="shrink-0 rounded-lg p-2 text-foreground/40 transition-colors hover:bg-background hover:text-foreground disabled:opacity-50"
      >
        <Icon icon={busy ? 'svg-spinners:180-ring' : 'material-symbols:close'} width={16} />
      </button>
    </li>
  )
}

// ── orchestrator ─────────────────────────────────────────────────────────────
const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  staff: 'Staff',
  distributor: 'Distributor',
  customer: 'Customer',
}

export function AccountDashboard() {
  const storeUser = useAuthStore((s) => s.currentUser)
  const token = useAuthStore((s) => s.accessToken)
  const signOut = useAuthStore((s) => s.signOut)
  const lang = useTenantStore((s) => s.lang)

  const profile = useResource(getProfile, token)
  const user = profile.data

  // Prefer the live profile, fall back to the persisted store user so the
  // header paints instantly while the profile request is in flight.
  const name = user?.name ?? storeUser?.name ?? 'Your account'
  const email = user?.email ?? storeUser?.email ?? ''
  const roleSlug = user?.role?.slug ?? storeUser?.roleSlug
  const roleLabel = roleSlug ? ROLE_LABEL[roleSlug] ?? roleSlug : undefined
  const loyalty = user?.loyaltyAccount

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <header className="rounded-2xl bg-surface p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon icon="iconoir:profile-circle" width={32} />
            </span>
            <div>
              <p
                className="text-foreground/60"
                style={{ fontSize: 13, lineHeight: '20px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
              >
                My account
              </p>
              <h1
                className="mt-1 font-heading text-foreground"
                style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.15, fontWeight: 700 }}
              >
                {name}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {email && (
                  <span className="text-foreground/65" style={{ fontSize: 14, lineHeight: '20px' }}>
                    {email}
                  </span>
                )}
                {roleLabel && (
                  <span
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary"
                    style={{ fontSize: 11, lineHeight: '16px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                  >
                    {roleLabel}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button variant="soft" size="sm" onClick={signOut} leftIcon={<Icon icon="material-symbols:logout" width={16} />}>
            Sign out
          </Button>
        </div>

        {/* Loyalty strip — only when the account actually has loyalty data */}
        {loyalty && (loyalty.points != null || loyalty.balance != null || loyalty.tier || loyalty.level) && (
          <div className="mt-6 flex flex-wrap gap-3 border-t border-border-subtle pt-5">
            <LoyaltyStat label="Points" value={(loyalty.points ?? loyalty.balance ?? 0).toLocaleString()} />
            {(loyalty.tier || loyalty.level?.name) && (
              <LoyaltyStat label="Tier" value={loyalty.tier ?? loyalty.level?.name ?? ''} />
            )}
            {loyalty.lifetimePoints != null && (
              <LoyaltyStat label="Lifetime" value={loyalty.lifetimePoints.toLocaleString()} />
            )}
          </div>
        )}
      </header>

      {/* Panels */}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <InquiriesPanel token={token} />
        <OrdersPanel token={token} lang={lang} />
        <DocumentsPanel token={token} />
        <WishlistPanel token={token} lang={lang} />
        <CartPanel token={token} lang={lang} />
      </div>
    </div>
  )
}

function LoyaltyStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background px-4 py-3">
      <p
        className="text-foreground/55"
        style={{ fontSize: 11, lineHeight: '14px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}
      >
        {label}
      </p>
      <p className="mt-0.5 font-heading text-foreground capitalize" style={{ fontSize: 20, lineHeight: '26px', fontWeight: 700 }}>
        {value}
      </p>
    </div>
  )
}
