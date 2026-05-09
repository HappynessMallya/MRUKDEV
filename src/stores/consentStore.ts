import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Cookie consent state — persisted to localStorage so the user's choices
// survive across reloads. Categories follow the GDPR / TCF convention:
// `necessary` is always true (the site can't function without it).
export interface ConsentCategories {
  necessary: true
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

interface ConsentState {
  // null until the user makes their first choice — surface the consent
  // banner / settings page when this is null.
  categories: ConsentCategories | null
  setCategory: (key: keyof ConsentCategories, value: boolean) => void
  acceptAll: () => void
  rejectAll: () => void
  save: (categories: Omit<ConsentCategories, 'necessary'>) => void
}

const ALL: ConsentCategories = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
}

const NONE: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
}

export const useConsentStore = create<ConsentState>()(
  persist(
    (set, get) => ({
      categories: null,
      setCategory: (key, value) => {
        if (key === 'necessary') return
        const current = get().categories ?? NONE
        set({ categories: { ...current, [key]: value } })
      },
      acceptAll: () => set({ categories: ALL }),
      rejectAll: () => set({ categories: NONE }),
      save: (cats) =>
        set({
          categories: { necessary: true, ...cats },
        }),
    }),
    { name: 'mruk-consent' }
  )
)
