import 'server-only'

// Server-side catalog data-access layer.
//
// This is the cutover point from mock JSON to the live API. It exposes the same
// accessors the catalog pages already use, but async. The source is chosen by
// the NEXT_PUBLIC_USE_API flag:
//   - unset / 'false' → local mock catalog (src/data/products.ts)  [default]
//   - 'true'          → live API (mapped to the frontend Product shape)
//
// Default is mock so the storefront keeps rendering until the backend seeds the
// `mr-uk` tenant on the deployed instance (it currently 404s "Unknown tenant
// slug"). Once a real response is verified, flip the flag — no component change.

import {
  getAllProducts as mockGetAll,
  getProduct as mockGetProduct,
  getProductsByCategory as mockByCategory,
  listAllSlugs as mockListSlugs,
} from '@/data/products'
import type { ApiError } from '@/lib/apiClient'
import { getProductBySlug, listProducts } from '@/lib/api/products'
import { mapProduct } from '@/lib/api/mappers'
import type { Product } from '@/types/product'

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

// Upper bound for in-memory category filtering until a verified slug→categoryId
// map exists (the backend filters by leaf ObjectId only, not slug).
const MAX_LIST = 100

function isNotFound(err: unknown): boolean {
  return (err as ApiError)?.status === 404
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!USE_API) return mockGetProduct(slug)
  try {
    return mapProduct(await getProductBySlug(slug))
  } catch (err) {
    if (isNotFound(err)) return null
    throw err
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!USE_API) return mockGetAll()
  const res = await listProducts({ limit: MAX_LIST, isPublished: true })
  return res.data.map(mapProduct)
}

export async function listAllSlugs(): Promise<string[]> {
  if (!USE_API) return mockListSlugs()
  try {
    const res = await listProducts({ limit: MAX_LIST, isPublished: true })
    return res.data.map((p) => p.slug)
  } catch {
    // Don't fail the build if the API is cold/unreachable — fall back to
    // on-demand rendering (empty static params still renders dynamically).
    return []
  }
}

export async function getProductsByCategory(
  category: string | null | undefined,
  sub?: string | null
): Promise<Product[]> {
  if (!USE_API) return mockByCategory(category, sub)
  const res = await listProducts({ limit: MAX_LIST, isPublished: true })
  let list = res.data.map(mapProduct)
  // Filter on the mapped category/sub slugs. Once the backend confirms its
  // category slugs and exposes a categoryId for the frontend taxonomy, push
  // this filter down to the API via the `categoryId` query param.
  if (category) list = list.filter((p) => p.category === category)
  if (sub) list = list.filter((p) => p.sub === sub)
  return list
}
