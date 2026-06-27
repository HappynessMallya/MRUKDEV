'use client'

import { useQuery } from '@tanstack/react-query'

import { apiFetch } from '@/lib/apiClient'
import type { Paginated } from '@/types/api'

// Distributor "orders" map to the backend's invoices + proformas. These are
// PROTECTED routes (Bearer JWT required) and tenant-scoped.
//
// ⚠️ BLOCKED — do not surface these in the UI yet. Per the backend team
// (docs/backend-questions.md → C4), the own-data list/detail handlers currently
// 403 for distributor/customer roles: the CASL check evaluates a conditional
// `read:own_*` grant without a record instance, and the services don't yet
// auto-scope by the current user. Enable these screens only after the backend
// fixes the ability check and adds server-side `userId` scoping.
//
// The hooks below are wired to the correct endpoints + envelope so they work
// the moment the backend fix lands; they stay disabled until then.

const ORDERS_ENABLED = false

export interface ApiInvoice {
  id: string
  status: string
  total: number
  currency: string
  createdAt: string
}

export interface ApiProforma {
  id: string
  status: string
  total: number
  currency: string
  createdAt: string
}

export function useInvoices(token: string | undefined) {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () =>
      apiFetch<Paginated<ApiInvoice>>('/invoices', { token }),
    enabled: ORDERS_ENABLED && Boolean(token),
  })
}

export function useProformas(token: string | undefined) {
  return useQuery({
    queryKey: ['proformas'],
    queryFn: () =>
      apiFetch<Paginated<ApiProforma>>('/proformas', { token }),
    enabled: ORDERS_ENABLED && Boolean(token),
  })
}
