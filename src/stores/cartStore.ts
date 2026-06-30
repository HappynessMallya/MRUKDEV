import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Minimal cart shape — keep just what the cart UI + navbar badge need.
// Pricing isn't in the catalog yet so the line item carries a quantity but
// no price; the WhatsApp/inquiry handoff settles the actual quote.
export interface CartItem {
  id: string
  slug: string
  name: string
  imageUrl: string
  model?: string
  qty: number
}

interface CartState {
  items: CartItem[]
  count: number
  // Adds `qty` units (default 1); increments if the line already exists.
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const recountAfter = (items: CartItem[]): number =>
  items.reduce((sum, i) => sum + i.qty, 0)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      count: 0,
      add: (item, qty = 1) => {
        const n = Math.max(1, Math.floor(qty))
        const existing = get().items.find((i) => i.id === item.id)
        const items = existing
          ? get().items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + n } : i
            )
          : [...get().items, { ...item, qty: n }]
        set({ items, count: recountAfter(items) })
      },
      remove: (id) => {
        const items = get().items.filter((i) => i.id !== id)
        set({ items, count: recountAfter(items) })
      },
      setQty: (id, qty) => {
        const next = Math.max(1, qty)
        const items = get().items.map((i) =>
          i.id === id ? { ...i, qty: next } : i
        )
        set({ items, count: recountAfter(items) })
      },
      clear: () => set({ items: [], count: 0 }),
    }),
    {
      // Persist across tabs / reloads — the cart should survive a refresh,
      // unlike the compare strip which is intentionally session-scoped.
      name: 'mruk-cart',
    }
  )
)
