// Own-scoped account reads for the signed-in customer/distributor dashboard.
//
// Unlike the catalog/CMS reads (public, server-side, ISR-cached), these are
// PER-USER and live: they require the caller's Bearer token and must never be
// cached, so every call passes `cache: 'no-store'` and the token from the
// client auth store. The backend scopes each list to the caller (a customer
// sees only their own inquiries/orders/etc.; admin/staff see all).
//
// Shapes here were verified against the live API. Collections that were empty
// at probe time (proformas/invoices/credit-orders) are typed permissively from
// the integration-plan contract and rendered defensively.

import { apiFetch } from '@/lib/apiClient'
import type { Localized, Paginated } from '@/types/api'

const NO_STORE = { cache: 'no-store' as const }

// ── Profile (+ embedded loyalty) ─────────────────────────────────────────────
export interface AccountRole {
  slug: string
  name?: string
}

// Loyalty is embedded on /auth/profile (`loyaltyAccount`), so the dashboard
// reads it from there rather than the separate /loyalty/account route (which
// 404s for accounts with no loyalty record). Fields are optional — loyalty is
// sparsely populated today.
export interface LoyaltyAccountSummary {
  points?: number
  balance?: number
  lifetimePoints?: number
  tier?: string | null
  level?: { name?: string; slug?: string } | null
}

export interface AccountProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  company?: string | null
  region?: string | null
  country?: string | null
  avatar?: string | null
  createdAt?: string
  role?: AccountRole | null
  loyaltyAccount?: LoyaltyAccountSummary | null
}

export async function getProfile(token: string): Promise<AccountProfile> {
  const res = await apiFetch<{ user: AccountProfile }>('/auth/profile', {
    token,
    ...NO_STORE,
  })
  return res.user
}

// ── Inquiries (their quote requests) ─────────────────────────────────────────
export interface AccountInquiry {
  id: string
  inquiryNumber: string
  message: string
  source: string
  status: string
  createdAt: string
  items?: { productName?: string; sku?: string; quantity?: number }[]
}

export function listInquiries(token: string): Promise<Paginated<AccountInquiry>> {
  return apiFetch<Paginated<AccountInquiry>>('/inquiries?limit=20', { token, ...NO_STORE })
}

// ── Credit orders (tracking) ─────────────────────────────────────────────────
export interface AccountOrder {
  id: string
  orderNumber: string
  status: string
  total?: number
  bankName?: string | null
  bankReference?: string | null
  createdAt: string
  items?: { productName?: Localized | string; quantity?: number }[]
}

export function listCreditOrders(token: string): Promise<Paginated<AccountOrder>> {
  return apiFetch<Paginated<AccountOrder>>('/credit-orders?limit=20', { token, ...NO_STORE })
}

// ── Proformas (quotes) & invoices ────────────────────────────────────────────
// Both share a number/status/total/date surface; the number field differs
// (`proformaNumber` vs `invoiceNumber`), so callers pass a label resolver.
export interface AccountDocument {
  id: string
  proformaNumber?: string
  invoiceNumber?: string
  number?: string
  status?: string
  total?: number
  grandTotal?: number
  amountPaid?: number
  createdAt: string
}

export function listProformas(token: string): Promise<Paginated<AccountDocument>> {
  return apiFetch<Paginated<AccountDocument>>('/proformas?limit=20', { token, ...NO_STORE })
}

export function listInvoices(token: string): Promise<Paginated<AccountDocument>> {
  return apiFetch<Paginated<AccountDocument>>('/invoices?limit=20', { token, ...NO_STORE })
}

// ── Wishlist & cart (both embed the full product) ────────────────────────────
export interface AccountProduct {
  id: string
  name: Localized
  slug: string
  sku?: string
  brand?: string
  media?: { url: string; isPrimary?: boolean }[]
}

export interface WishlistItem {
  id: string
  productId: string
  addedAt?: string
  product: AccountProduct
}

export interface Wishlist {
  id: string
  items: WishlistItem[]
}

export function getWishlist(token: string): Promise<Wishlist> {
  return apiFetch<Wishlist>('/wishlist', { token, ...NO_STORE })
}

// Wishlist removal is keyed by productId (not item id) per the API.
export function removeWishlistProduct(token: string, productId: string): Promise<unknown> {
  return apiFetch<unknown>(`/wishlist/products/${encodeURIComponent(productId)}`, {
    method: 'DELETE',
    token,
  })
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  unitPrice?: number
  totalPrice?: number
  product: AccountProduct
}

export interface Cart {
  id: string
  items: CartItem[]
}

export function getCart(token: string): Promise<Cart> {
  return apiFetch<Cart>('/cart', { token, ...NO_STORE })
}

// Cart removal is keyed by the cart-item id.
export function removeCartItem(token: string, itemId: string): Promise<unknown> {
  return apiFetch<unknown>(`/cart/items/${encodeURIComponent(itemId)}`, {
    method: 'DELETE',
    token,
  })
}
