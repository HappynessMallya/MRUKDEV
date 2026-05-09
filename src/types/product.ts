import type { BilingualText } from './tenant'

// Product shape for the PDP. Keeps fields permissive — when the backend goes
// live we'll narrow these down based on the real catalog schema.
export interface Product {
  id: string
  slug: string
  name: BilingualText
  model?: string
  category: string
  // Optional subcategory slug — matches the SUBCATEGORIES tile slug so the
  // products list page can filter by `?sub=` when a tile is active.
  sub?: string
  shortDescription?: BilingualText

  // Gallery
  images: string[]

  // Bullet feature list shown next to the gallery
  featureBullets?: BilingualText[]

  // Optional pricing — omitted entirely until commerce is wired
  price?: { amount: number; currency: string }
  isAvailable?: boolean
  stockCount?: number

  // Optional color/variant picker shown above the CTAs on the PDP.
  colors?: ColorVariant[]

  // Quick-look icon row at the top of the Characteristics section
  highlightIcons?: HighlightIcon[]

  // Long-form image-with-text feature blocks
  characteristics?: CharacteristicBlock[]

  // Key-value specifications table
  specifications?: SpecRow[]

  // IDs of related products (resolved against the products map)
  relatedSlugs?: string[]
}

export interface ColorVariant {
  id: string
  label: BilingualText
  hex: string
}

export interface HighlightIcon {
  id: string
  // Either an Iconify name (e.g. "material-symbols:bolt") or a /public asset
  // path (e.g. "/1.svg"). The renderer picks based on whether the value
  // starts with "/".
  iconName: string
  label: BilingualText
}

export interface CharacteristicBlock {
  id: string
  // Bold large heading.
  title: BilingualText
  // Optional bold smaller heading rendered between title and description.
  subtitle?: BilingualText
  // Optional paragraph copy rendered under the subtitle.
  description?: BilingualText
  imageUrl?: string
  // Image positioning relative to the text. Stacked = full-width image below text.
  layout?: 'stacked' | 'image-left' | 'image-right'
}

export interface SpecRow {
  id: string
  label: BilingualText
  value: BilingualText
}
