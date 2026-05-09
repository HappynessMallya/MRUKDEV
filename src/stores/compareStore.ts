import { create } from 'zustand'

// Up to 3 products can be compared at once. Store only what the strip + the
// future /compare page needs — id, name, image, slug — so we don't have to
// pull the full Product object out of the global config.
export interface CompareItem {
  id: string
  slug: string
  name: string
  imageUrl: string
}

interface CompareState {
  items: CompareItem[]
  add: (item: CompareItem) => void
  remove: (id: string) => void
  toggle: (item: CompareItem) => void
  clear: () => void
  has: (id: string) => boolean
}

export const COMPARE_LIMIT = 3

export const useCompareStore = create<CompareState>()((set, get) => ({
  items: [],
  add: (item) =>
    set((s) => {
      if (s.items.some((i) => i.id === item.id)) return s
      if (s.items.length >= COMPARE_LIMIT) return s
      return { items: [...s.items, item] }
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  toggle: (item) => {
    const has = get().items.some((i) => i.id === item.id)
    if (has) get().remove(item.id)
    else get().add(item)
  },
  clear: () => set({ items: [] }),
  has: (id) => get().items.some((i) => i.id === id),
}))
