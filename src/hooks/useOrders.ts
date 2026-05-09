import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { apiFetch } from '@/lib/apiClient'

// Skeleton — Order shape gets tightened once the Mongoose schema lands.
export interface Order {
  _id: string
  status: 'quote' | 'invoice' | 'paid' | 'cancelled'
  total: number
  currency: string
  createdAt: string
}

export interface OrdersFilters {
  status?: string
  from?: string
}

export function useOrders(filters?: OrdersFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () =>
      apiFetch<Order[]>(
        `/api/orders?${new URLSearchParams(filters as Record<string, string>)}`
      ),
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Order>) =>
      apiFetch<Order>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['inventory'] })
    },
  })
}

export function useQuoteToInvoice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (quoteId: string) =>
      apiFetch<Order>(`/api/orders/${quoteId}/convert`, { method: 'POST' }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.setQueryData(['orders', data._id], data)
    },
  })
}
