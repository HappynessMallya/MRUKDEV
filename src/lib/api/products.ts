// Typed fetchers for the public catalog read path.
//
// All of these are public reads — only the `x-tenant-slug` header is required
// (apiFetch adds it), no Bearer token. Server-side calls use ISR caching both
// to cut load and to soften the deployed backend's free-tier cold starts.

import { apiFetch } from '@/lib/apiClient'
import type { ApiCategory, ApiProduct, Paginated } from '@/types/api'

// Revalidate window for catalog reads (seconds). Catalog data changes rarely,
// so a 5-minute ISR window keeps pages fast and the backend lightly loaded.
const CATALOG_REVALIDATE = 300

export interface ListProductsParams {
  page?: number
  limit?: number
  // Backend filters by leaf-category ObjectId only — there is no slug filter.
  categoryId?: string
  search?: string
  isPublished?: boolean
  isFeatured?: boolean
  brand?: string
  inStock?: boolean
}

function toQuery(params: ListProductsParams): string {
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value))
    }
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

// GET /products → { data, meta } envelope.
export function listProducts(
  params: ListProductsParams = {}
): Promise<Paginated<ApiProduct>> {
  return apiFetch<Paginated<ApiProduct>>(`/products${toQuery(params)}`, {
    next: { revalidate: CATALOG_REVALIDATE },
  })
}

// GET /products/slug/{slug} → single product (404 if missing).
export function getProductBySlug(slug: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/slug/${encodeURIComponent(slug)}`, {
    next: { revalidate: CATALOG_REVALIDATE },
  })
}

// GET /products/{id} → single product (404 if missing).
export function getProductById(id: string): Promise<ApiProduct> {
  return apiFetch<ApiProduct>(`/products/${encodeURIComponent(id)}`, {
    next: { revalidate: CATALOG_REVALIDATE },
  })
}

// GET /categories → bare array, 2-level tree (roots with immediate children).
export function listCategories(): Promise<ApiCategory[]> {
  return apiFetch<ApiCategory[]>(`/categories`, {
    next: { revalidate: CATALOG_REVALIDATE },
  })
}
