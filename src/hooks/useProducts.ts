'use client'

import { useQuery } from '@tanstack/react-query'

import { mapProduct } from '@/lib/api/mappers'
import {
  getProductBySlug,
  listProducts,
  type ListProductsParams,
} from '@/lib/api/products'

// Client-side catalog hooks (public reads — tenant header only, no token).
// These call the live API and map straight to the frontend `Product` view
// model, so client components (compare, mega-menu featured rows) get the same
// shape the server components render.

export function useProducts(params?: ListProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const res = await listProducts(params)
      return { items: res.data.map((p) => mapProduct(p)), meta: res.meta }
    },
    staleTime: 60_000,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug).then(mapProduct),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })
}
