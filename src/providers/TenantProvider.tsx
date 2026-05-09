'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { useTenantStore } from '@/stores/tenantStore'
import type { TenantConfig } from '@/types/tenant'

export function TenantProvider({
  config,
  children,
}: {
  config: TenantConfig
  children: React.ReactNode
}) {
  // Seed Zustand synchronously on first render so children read the correct
  // config on their initial render — avoids the one-frame `config: null` flash
  // that a useEffect-based seed would cause.
  useState(() => {
    useTenantStore.setState({
      config,
      lang: config.defaultLang,
    })
  })

  // QueryClient must be stable across renders; useState initializer guarantees
  // a single instance per provider mount.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
