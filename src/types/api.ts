// Backend response types for the Fanisi Studio API.
//
// IMPORTANT: the OpenAPI spec documents request DTOs but NOT response schemas.
// These types are derived from the backend team's authoritative answer
// (docs/backend-questions.md → "B. Response contracts") and the request DTOs.
// Responses are raw Prisma documents with `_id` surfaced as `id`, localized
// fields as `{ en, sw }`, and a few read-time computed fields noted below.
// They should be re-verified against a live response once the `mr-uk` tenant
// is seeded on the deployed instance (currently returns "Unknown tenant slug").

export interface Localized {
  en: string
  sw?: string
}

// Standard envelope for every PAGINATED list endpoint (products,
// service-locations, inquiries, invoices, ...). Note: fields live under `meta`,
// not at the top level. `/categories` and `/pages` are deliberately bare arrays.
export interface Paginated<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiProductMedia {
  id?: string
  url: string
  type?: string
  altText?: string
  isPrimary?: boolean
  sortOrder?: number
}

export interface ApiVariantOption {
  name: string
  value: string
}

export interface ApiProductVariant {
  id?: string
  title?: string
  sku?: string
  options?: ApiVariantOption[]
  price?: number
  salePrice?: number
  stock?: number
  isInStock?: boolean
  // Read-time computed per-variant availability.
  inStock?: boolean
  imageUrl?: string
  isActive?: boolean
  sortOrder?: number
}

export interface ApiProductOption {
  id?: string
  name: string
  values: string[]
  sortOrder?: number
}

export interface ApiProductCharacteristic {
  id?: string
  icon?: string
  title: Localized
  sortOrder?: number
}

export interface ApiProductHighlight {
  id?: string
  text: Localized
  sortOrder?: number
}

export interface ApiProductSpec {
  id?: string
  name: Localized
  value: string
  sortOrder?: number
}

export interface ApiProductDocument {
  id?: string
  url: string
  name?: string
  sortOrder?: number
}

// Category as embedded on a product, and as returned by /categories.
export interface ApiCategory {
  id: string
  slug: string
  name: Localized
  parentId?: string | null
  icon?: string | null
  image?: string | null
  sortOrder?: number
  isActive?: boolean
  // /categories returns a 2-level tree: roots carry immediate children only.
  children?: ApiCategory[]
}

export interface ApiProduct {
  id: string
  categoryId: string
  // Included relation — the leaf category the product attaches to.
  category?: ApiCategory
  name: Localized
  slug: string
  sku: string
  modelNumber?: string
  brand?: string
  description?: Localized
  shortDescription?: Localized
  currency?: string
  price?: number
  salePrice?: number
  quantity?: number
  isPublished?: boolean
  isFeatured?: boolean
  featuredPriority?: number
  isNewArrival?: boolean
  weight?: string
  dimensions?: string
  warranty?: Localized
  loyaltyPointsEarned?: number
  tags?: string[]
  media?: ApiProductMedia[]
  options?: ApiProductOption[]
  variants?: ApiProductVariant[]
  characteristics?: ApiProductCharacteristic[]
  highlights?: ApiProductHighlight[]
  specs?: ApiProductSpec[]
  documents?: ApiProductDocument[]
  // Read-time computed fields (added by the products service):
  inStock?: boolean
  priceRange?: { min: number; max: number } | null
  createdAt?: string
  updatedAt?: string
}

// ── Inquiries ────────────────────────────────────────────────────────────────
// Lead capture. POST /inquiries is public (a Bearer token, when present, links
// the inquiry to that user). `source` tags the channel; WhatsApp/email are
// click-to-chat handoffs the storefront opens in addition to this POST.
export type InquirySource = 'web' | 'whatsapp' | 'email'

// NOTE: when an item is sent, the backend validates `productId` AND `sku` as
// required non-empty strings (despite being typed optional here for callers that
// send an empty `items: []`). Only attach an item when both are known.
export interface InquiryItemInput {
  productId?: string
  productName?: string
  sku?: string
  quantity?: number
  notes?: string
}

export interface InquiryInput {
  contactName: string
  // At least one contact channel should be provided.
  contactEmail?: string
  contactPhone?: string
  company?: string
  message: string
  source?: InquirySource
  items?: InquiryItemInput[]
}

export interface ApiInquiry {
  id: string
  inquiryNumber: string
  status: string
  source: InquirySource
  items?: InquiryItemInput[]
}

// ── Auth ────────────────────────────────────────────────────────────────────
export interface ApiAuthUser {
  id: string
  name: string
  email?: string
  phone?: string
  roleSlug: string
}

// POST /auth/login & POST /auth/refresh → both tokens in the body (no cookie).
// Access token 7-day, refresh token 30-day. Store both client-side.
export interface ApiLoginResponse {
  accessToken: string
  refreshToken: string
  user: ApiAuthUser
}

// POST /auth/register → no token. Customers are active immediately
// (`pendingApproval` false/absent); distributors come back `pendingApproval:true`
// and cannot log in until an admin approves them.
export interface ApiRegisterResponse {
  message: string
  pendingApproval?: boolean
  user: ApiAuthUser
}

export interface RegisterInput {
  name: string
  // One of email / phone is required.
  email?: string
  phone?: string
  password: string
  company?: string
  region?: string
  country?: string
  // Self-registration is limited to 'customer' | 'distributor'.
  role?: 'customer' | 'distributor'
}

export interface LoginInput {
  // One of email / phone.
  email?: string
  phone?: string
  password: string
}
