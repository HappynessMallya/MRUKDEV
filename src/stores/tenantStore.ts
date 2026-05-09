import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { BilingualText, Lang, TenantConfig, TenantFeatures } from '@/types/tenant'

interface TenantState {
  // Seeded once from server props on first client render — never changes during a session
  config: TenantConfig | null

  // UI / session state
  lang: Lang
  sidebarOpen: boolean
  cartCount: number

  // Actions
  setConfig: (config: TenantConfig) => void
  setLang: (lang: Lang) => void
  toggleSidebar: () => void
  setCartCount: (n: number) => void

  // Derived helpers — call from any component, no extra imports needed
  t: (field: BilingualText) => string
  isFeatureEnabled: (feature: keyof TenantFeatures | string) => boolean
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      config: null,
      lang: 'en',
      sidebarOpen: false,
      cartCount: 0,

      setConfig: (config) => set({ config }),
      setLang: (lang) => set({ lang }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setCartCount: (n) => set({ cartCount: n }),

      t: (field) => {
        const { lang } = get()
        if (!field) return ''
        return field[lang] ?? field.en ?? ''
      },

      isFeatureEnabled: (feature) => {
        const { config } = get()
        if (!config) return false
        return Boolean(config.features?.[feature as keyof TenantFeatures])
      },
    }),
    {
      name: 'mruk-tenant-store',
      // Only persist the language preference. Config comes from server every load;
      // UI state (sidebar, cart) is intentionally session-scoped.
      partialize: (s) => ({ lang: s.lang }),
    }
  )
)
