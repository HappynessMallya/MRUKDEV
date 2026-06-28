// Maps backend API shapes onto the frontend's existing view models so the
// components (ProductCard, ProductInfo, ProductSpecs, compare table, ...) keep
// working unchanged when data comes from the API instead of the mock catalog.
//
// The backend product model is leaner than the Figma-rich frontend `Product`
// in a few areas (its `characteristics` are just icon + title; the frontend's
// have title/subtitle/description/imageUrl/layout). We populate what the API
// provides and leave the richer optional fields undefined — every consuming
// component already treats them as optional.

import type {
  ApiCategory,
  ApiProduct,
  Localized,
} from '@/types/api'
import type {
  CharacteristicBlock,
  ColorVariant,
  HighlightIcon,
  Product,
  ProductDocument,
  SpecRow,
} from '@/types/product'
import type { BilingualText } from '@/types/tenant'

function bi(text: Localized | undefined): BilingualText | undefined {
  if (!text) return undefined
  return text.sw ? { en: text.en, sw: text.sw } : { en: text.en }
}

// Ordered, image-only media URLs (primary first, then sortOrder).
function mediaUrls(api: ApiProduct): string[] {
  const media = (api.media ?? [])
    .filter((m) => !m.type || m.type.toLowerCase().startsWith('image'))
    .slice()
    .sort((a, b) => {
      if (a.isPrimary && !b.isPrimary) return -1
      if (!a.isPrimary && b.isPrimary) return 1
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    })
  return media.map((m) => m.url).filter(Boolean)
}

// Derive a color picker from a "Color" product option, when present.
function colors(api: ApiProduct): ColorVariant[] | undefined {
  const opt = (api.options ?? []).find((o) => /colou?r/i.test(o.name))
  if (!opt || opt.values.length === 0) return undefined
  return opt.values.map((value, i) => ({
    id: `${slugifyValue(value)}-${i}`,
    label: { en: value },
    // No hex from the API — leave a neutral default; the swatch still renders.
    hex: '#C7CCD1',
  }))
}

function slugifyValue(v: string): string {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function highlightIcons(api: ApiProduct): HighlightIcon[] | undefined {
  const chars = (api.characteristics ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  if (chars.length === 0) return undefined
  return chars.map((c, i) => ({
    id: c.id ?? `h${i}`,
    iconName: c.icon ?? 'material-symbols:check-circle-outline',
    label: bi(c.title) ?? { en: '' },
  }))
}

function characteristicBlocks(
  api: ApiProduct
): CharacteristicBlock[] | undefined {
  // The API has no rich characteristic blocks (title/subtitle/description/
  // image/layout). Returning undefined keeps the PDP section graceful.
  void api
  return undefined
}

function specs(api: ApiProduct): SpecRow[] | undefined {
  const list = (api.specs ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  if (list.length === 0) return undefined
  return list.map((s, i) => ({
    id: s.id ?? `s${i}`,
    label: bi(s.name) ?? { en: '' },
    value: { en: s.value },
  }))
}

// Ordered downloadable files (spec sheet / catalogue PDF).
function documents(api: ApiProduct): ProductDocument[] | undefined {
  const list = (api.documents ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .filter((d) => Boolean(d.url))
    .map((d, i) => ({ id: d.id ?? `doc${i}`, url: d.url, name: d.name }))
  return list.length > 0 ? list : undefined
}

function featureBullets(api: ApiProduct): BilingualText[] | undefined {
  const list = (api.highlights ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((h) => bi(h.text))
    .filter((b): b is BilingualText => Boolean(b))
  return list.length > 0 ? list : undefined
}

// Flat compare-table values the /compare page reads (netTotal, dimension,
// color, energyClass, type). The backend has no dedicated compare block, so we
// surface what maps cleanly from scalar product fields.
function compareSpecs(api: ApiProduct): Record<string, string> | undefined {
  const out: Record<string, string> = {}
  if (api.dimensions) out.dimension = api.dimensions
  if (api.weight) out.weight = api.weight
  const colorOpt = (api.options ?? []).find((o) => /colou?r/i.test(o.name))
  if (colorOpt?.values[0]) out.color = colorOpt.values[0]
  if (api.brand) out.type = api.brand
  return Object.keys(out).length > 0 ? out : undefined
}

// Index of every category by its ObjectId → { slug, parentSlug, label }.
// Built from the /categories tree so a product (which only carries its LEAF
// category) can be resolved to its top-level category for nav/filtering.
export interface CategoryIndexEntry {
  slug: string
  parentSlug: string | null
  label: BilingualText
}
export type CategoryIndex = Map<string, CategoryIndexEntry>

export function buildCategoryIndex(tree: ApiCategory[]): CategoryIndex {
  const idx: CategoryIndex = new Map()
  for (const root of tree) {
    idx.set(root.id, {
      slug: root.slug,
      parentSlug: null,
      label: bi(root.name) ?? { en: root.slug },
    })
    for (const child of root.children ?? []) {
      idx.set(child.id, {
        slug: child.slug,
        parentSlug: root.slug,
        label: bi(child.name) ?? { en: child.slug },
      })
    }
  }
  return idx
}

export function mapProduct(api: ApiProduct, catIndex?: CategoryIndex): Product {
  const images = mediaUrls(api)
  const price =
    api.price != null && api.currency
      ? { amount: api.salePrice ?? api.price, currency: api.currency }
      : undefined

  // Resolve the product's leaf category up to its top-level category. The
  // product payload only includes the leaf (with a parentId, not a parent
  // slug), so we look it up in the category index built from /categories.
  let category = api.category?.slug ?? api.categoryId
  let sub: string | undefined = api.category?.slug
  const leafId = api.categoryId || api.category?.id
  const entry = leafId ? catIndex?.get(leafId) : undefined
  if (entry) {
    if (entry.parentSlug) {
      category = entry.parentSlug
      sub = entry.slug
    } else {
      // Leaf is itself a top-level category (no children) → no subcategory.
      category = entry.slug
      sub = undefined
    }
  }

  return {
    id: api.id,
    slug: api.slug,
    name: bi(api.name) ?? { en: '' },
    model: api.modelNumber,
    category,
    sub,
    shortDescription: bi(api.shortDescription),
    images,
    listImage: images[0],
    featureBullets: featureBullets(api),
    price,
    priceRange:
      api.priceRange != null
        ? { ...api.priceRange, currency: api.currency }
        : undefined,
    isAvailable: api.inStock ?? api.isPublished,
    stockCount: api.quantity,
    documents: documents(api),
    colors: colors(api),
    highlightIcons: highlightIcons(api),
    characteristics: characteristicBlocks(api),
    specifications: specs(api),
    compareSpecs: compareSpecs(api),
    // Related products aren't modelled on the backend yet.
    relatedSlugs: undefined,
  }
}

export interface MappedCategory {
  slug: string
  label: BilingualText
  id: string
  parentId?: string | null
  children: MappedCategory[]
}

export function mapCategory(api: ApiCategory): MappedCategory {
  return {
    id: api.id,
    slug: api.slug,
    label: bi(api.name) ?? { en: api.slug },
    parentId: api.parentId,
    children: (api.children ?? []).map(mapCategory),
  }
}
