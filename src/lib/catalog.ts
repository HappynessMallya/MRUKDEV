import 'server-only'

// Server-side catalog data-access layer — the cutover point from mock JSON to
// the live API, chosen by NEXT_PUBLIC_USE_API:
//   'true'  → live Fanisi API (products + categories), mapped to view models
//   else    → local mock catalog (src/data/products.ts)            [fallback]
//
// Categories are backend-driven when live: the nav taxonomy, subcategory tiles,
// labels and product↔category resolution all come from GET /categories.

import {
  CATEGORIES as MOCK_CATEGORIES,
  getAllProducts as mockGetAll,
  getCategoryLabel as mockCategoryLabel,
  getProduct as mockGetProduct,
  getProductsByCategory as mockByCategory,
  getSubcategories as mockSubcategories,
  listAllSlugs as mockListSlugs,
  type SubcategoryEntry,
} from '@/data/products'
import type { ApiError } from '@/lib/apiClient'
import { getProductBySlug, listCategories, listProducts } from '@/lib/api/products'
import { buildCategoryIndex, mapProduct } from '@/lib/api/mappers'
import { fetchPageSections } from '@/lib/api/pages'
import { listArticles } from '@/lib/api/articles'
import type { BilingualText, Lang, NavLink, PageSection, TenantConfig } from '@/types/tenant'
import type { Product } from '@/types/product'
import type { ProductCardData } from '@/components/molecules/ProductCard'
import type { BlogPostData } from '@/components/molecules/BlogCard'

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

// Upper bound for the in-memory product list (the catalog is small — 51 today).
const MAX_LIST = 100

function isNotFound(err: unknown): boolean {
  return (err as ApiError)?.status === 404
}

// Normalized category shape both sources produce. `imageUrl` feeds the
// subcategory tiles; children are the leaf categories products attach to.
export interface StoreCategory {
  slug: string
  label: BilingualText
  imageUrl?: string
  children: StoreCategory[]
}

// ── Categories ───────────────────────────────────────────────────────────────

export async function getCategoryTree(): Promise<StoreCategory[]> {
  if (!USE_API) {
    return MOCK_CATEGORIES.map((c) => ({
      slug: c.slug,
      label: c.label,
      children: mockSubcategories(c.slug).map((s) => ({
        slug: s.slug,
        label: s.label,
        imageUrl: s.imageUrl,
        children: [],
      })),
    }))
  }
  const tree = await listCategories()
  return tree.map((root) => ({
    slug: root.slug,
    label: root.name.sw ? { en: root.name.en, sw: root.name.sw } : { en: root.name.en },
    imageUrl: root.image ?? undefined,
    children: (root.children ?? []).map((child) => ({
      slug: child.slug,
      label: child.name.sw ? { en: child.name.en, sw: child.name.sw } : { en: child.name.en },
      imageUrl: child.image ?? undefined,
      children: [],
    })),
  }))
}

export async function getCategoryLabel(
  slug: string
): Promise<BilingualText | null> {
  if (!USE_API) return mockCategoryLabel(slug)
  const tree = await getCategoryTree()
  for (const root of tree) {
    if (root.slug === slug) return root.label
    const child = root.children.find((c) => c.slug === slug)
    if (child) return child.label
  }
  return null
}

export async function getSubcategories(
  category: string | null | undefined
): Promise<SubcategoryEntry[]> {
  if (!USE_API) return mockSubcategories(category)
  if (!category) return []
  const tree = await getCategoryTree()
  const root = tree.find((r) => r.slug === category)
  if (!root) return []
  return root.children.map((c) => ({
    slug: c.slug,
    label: c.label,
    imageUrl: c.imageUrl ?? '',
  }))
}

// Top-level category links for the navbar, derived from the same source as the
// catalog (backend when live, mock otherwise) so the nav always matches the
// products users can actually browse.
export async function getCategoryNavLinks(): Promise<NavLink[]> {
  const tree = await getCategoryTree()
  return tree.map((c) => ({
    id: `nav-cat-${c.slug}`,
    label: c.label,
    href: `/products?category=${encodeURIComponent(c.slug)}`,
    megaMenu: null,
  }))
}

// Returns a copy of the tenant config with its hardcoded category nav links
// replaced by `categoryLinks` (any non-category links are preserved). No-op when
// there are no dynamic links (e.g. API unreachable) so the static config shows.
export function withCategoryNav(
  config: TenantConfig,
  categoryLinks: NavLink[]
): TenantConfig {
  if (categoryLinks.length === 0) return config
  const nonCategory = config.global.navbar.links.filter(
    (l) => !l.href.startsWith('/products?category=')
  )
  return {
    ...config,
    global: {
      ...config.global,
      navbar: {
        ...config.global.navbar,
        links: [...categoryLinks, ...nonCategory],
      },
    },
  }
}

// ── Pages (CMS) ──────────────────────────────────────────────────────────────

// Home page sections: CMS-driven when live (GET /pages/home), else the static
// tenant config. Falls back to `staticSections` whenever the CMS is unreachable,
// unpublished, or empty, so the homepage always renders something sensible.
export async function getHomeSections(
  staticSections: PageSection[]
): Promise<PageSection[]> {
  if (!USE_API) return staticSections
  const cms = await fetchPageSections('home')
  return cms && cms.length > 0 ? cms : staticSections
}

// ── Home card data (real catalog/blog, server-fetched) ───────────────────────
//
// The data-bound home sections (featured/popular/blog) carry CMS copy + config,
// but their CARD data comes from the live catalog. We fetch it here, server-side,
// and inject it into each section's props (below). Each fetch returns empty on
// miss/error so the client component keeps its built-in MOCK fallback — nothing
// regresses, and each section auto-upgrades to real data once it's available.

function localize(text: BilingualText | undefined, lang: Lang): string | undefined {
  if (!text) return undefined
  return text[lang] ?? text.en
}

function productToCard(p: Product, lang: Lang): ProductCardData {
  return {
    id: p.id,
    name: localize(p.name, lang) ?? p.slug,
    description: localize(p.shortDescription, lang),
    imageUrl: p.listImage ?? p.images[0],
    href: `/products/${p.slug}`,
  }
}

// N products for the "popular" row. The API exposes no popularity signal, so we
// prefer featured products and fall back to the general published list.
async function getPopularCards(limit: number, lang: Lang): Promise<ProductCardData[]> {
  if (!USE_API) return []
  try {
    const tree = await listCategories()
    const idx = buildCategoryIndex(tree)
    let res = await listProducts({ limit, isPublished: true, isFeatured: true })
    if (res.data.length === 0) res = await listProducts({ limit, isPublished: true })
    return res.data.map((p) => productToCard(mapProduct(p, idx), lang))
  } catch {
    return []
  }
}

// Real products per featured tab, keyed by the tab's `category` slug. Tabs whose
// slug doesn't match a live category resolve to an empty list (→ MOCK fallback),
// so the section stays intact until the tabs are re-authored to live slugs.
async function getFeaturedCardsByCategory(
  categories: string[],
  limit: number,
  lang: Lang
): Promise<Record<string, ProductCardData[]>> {
  if (!USE_API) return {}
  const out: Record<string, ProductCardData[]> = {}
  await Promise.all(
    categories.map(async (cat) => {
      try {
        const list = await getProductsByCategory(cat)
        if (list.length > 0) out[cat] = list.slice(0, limit).map((p) => productToCard(p, lang))
      } catch {
        /* leave unset → MOCK fallback for this tab */
      }
    })
  )
  return out
}

// Latest blog posts for the preview grid. Empty until articles are seeded.
async function getBlogCards(limit: number, lang: Lang): Promise<BlogPostData[]> {
  if (!USE_API) return []
  try {
    const res = await listArticles({ limit })
    return res.data.map((a) => ({
      id: a.id,
      title: localize(a.title, lang) ?? a.slug,
      excerpt: localize(a.excerpt, lang),
      imageUrl: a.coverImage ?? undefined,
      href: `/blog/${a.slug}`,
    }))
  } catch {
    return []
  }
}

// Enrich data-bound home sections with real card data, injected into `props`.
// Unknown/content-only sections pass through untouched. Called by the home page
// after `getHomeSections`. The injected props are plain JSON, so they cross the
// server→client boundary into the (client) section components cleanly.
export async function enrichHomeSections(
  sections: PageSection[],
  lang: Lang
): Promise<PageSection[]> {
  if (!USE_API) return sections
  return Promise.all(
    sections.map(async (s) => {
      const props = s.props as Record<string, unknown>
      if (s.type === 'popular_products') {
        const limit = typeof props.limit === 'number' ? props.limit : 3
        return { ...s, props: { ...props, products: await getPopularCards(limit, lang) } }
      }
      if (s.type === 'blog_preview') {
        const limit = typeof props.limit === 'number' ? props.limit : 2
        return { ...s, props: { ...props, posts: await getBlogCards(limit, lang) } }
      }
      if (s.type === 'featured_products') {
        const limit = typeof props.limit === 'number' ? props.limit : 4
        const tabs = (props.tabs as { items?: { category?: string }[] } | undefined)?.items ?? []
        const cats = tabs.map((t) => t.category).filter((c): c is string => !!c)
        return {
          ...s,
          props: { ...props, productsByCategory: await getFeaturedCardsByCategory(cats, limit, lang) },
        }
      }
      return s
    })
  )
}

// ── Products ─────────────────────────────────────────────────────────────────

export async function getProduct(slug: string): Promise<Product | null> {
  if (!USE_API) return mockGetProduct(slug)
  try {
    const [api, tree] = await Promise.all([getProductBySlug(slug), listCategories()])
    return mapProduct(api, buildCategoryIndex(tree))
  } catch (err) {
    if (isNotFound(err)) return null
    throw err
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!USE_API) return mockGetAll()
  const [res, tree] = await Promise.all([
    listProducts({ limit: MAX_LIST, isPublished: true }),
    listCategories(),
  ])
  const idx = buildCategoryIndex(tree)
  return res.data.map((p) => mapProduct(p, idx))
}

export async function listAllSlugs(): Promise<string[]> {
  if (!USE_API) return mockListSlugs()
  try {
    const res = await listProducts({ limit: MAX_LIST, isPublished: true })
    return res.data.map((p) => p.slug)
  } catch {
    // Don't fail the build if the API is cold/unreachable — fall back to
    // on-demand rendering (empty static params still renders dynamically).
    return []
  }
}

export async function getProductsByCategory(
  category: string | null | undefined,
  sub?: string | null
): Promise<Product[]> {
  if (!USE_API) return mockByCategory(category, sub)
  const all = await getAllProducts()
  // Filter on the resolved top-level `category` and leaf `sub` slugs (set by
  // the mapper via the category index). Once the backend exposes a category
  // slug→id lookup we can push the leaf filter down to ?categoryId=.
  let list = all
  if (category) list = list.filter((p) => p.category === category)
  if (sub) list = list.filter((p) => p.sub === sub)
  return list
}
