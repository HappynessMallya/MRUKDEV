import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { apiFetch } from '@/lib/apiClient'

// Skeleton — Product / ProductInput shapes get tightened once the
// Mongoose schemas land. Keep the function signatures stable so call sites
// don't need to change later.
export interface Product {
  _id: string
  name: { en: string; sw?: string }
  slug: string
  category: string
  price: number
  currency: string
  images: string[]
  tags?: string[]
  isAvailable?: boolean
}

export interface ProductsParams {
  category?: string
  featured?: boolean
  tag?: string
  limit?: number
  page?: number
  sort?: string
}

export function useProducts(params?: ProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () =>
      apiFetch<Product[]>(
        `/api/products?${new URLSearchParams(params as Record<string, string>)}`
      ),
    staleTime: 30_000,
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => apiFetch<Product>(`/api/products/${id}`),
    enabled: Boolean(id),
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Product>) =>
      apiFetch<Product>('/api/products', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
