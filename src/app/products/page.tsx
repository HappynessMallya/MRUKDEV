import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import {
  CategoryHero,
  CompareStrip,
  FilterBar,
  FilterSidebar,
  ProductListCard,
} from '@/components/product-list'
import {
  getCategoryLabel,
  getProductsByCategory,
  getSubcategories,
  searchProducts,
} from '@/lib/catalog'
import { getTenantConfig } from '@/lib/tenant'
import type { Product } from '@/types/product'

interface SearchParams {
  category?: string
  sub?: string
  sort?: string
  type?: string
  // Free-text query from the header search → /products?search=
  search?: string
}

// Sorts the filtered list in-place. `featured` keeps insertion order,
// `newest` reverses it (placeholder until products carry a real createdAt),
// price sorts skip products without a price.
function sortProducts(products: Product[], sort: string | undefined): Product[] {
  const list = [...products]
  switch (sort) {
    case 'price_asc':
      return list.sort((a, b) => (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity))
    case 'price_desc':
      return list.sort((a, b) => (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity))
    case 'newest':
      return list.reverse()
    default:
      return list
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { category } = await searchParams
  const tenant = await getTenantConfig()
  const lang = tenant.defaultLang
  const catLabel = category ? await getCategoryLabel(category) : null
  const heading = catLabel ? (catLabel[lang] ?? catLabel.en) : 'All products'
  return {
    title: `${heading} — ${tenant.identity.companyName}`,
    description: `Browse ${heading.toLowerCase()} from ${tenant.identity.companyName}.`,
  }
}

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { category, sub, sort, type, search } = await searchParams
  const query = search?.trim()
  const isSearch = Boolean(query)
  const tenant = await getTenantConfig()
  const lang = tenant.defaultLang

  // Search mode bypasses category/subcategory filtering entirely and matches
  // the query across the whole catalog.
  const [sorted, subcategories, catLabel] = await Promise.all([
    (isSearch
      ? searchProducts(query as string)
      : getProductsByCategory(category, sub)
    ).then((p) => sortProducts(p, sort)),
    isSearch ? Promise.resolve([]) : getSubcategories(category),
    category && !isSearch ? getCategoryLabel(category) : Promise.resolve(null),
  ])
  // "Type" sidebar filter — ?type=<sub-slug>[,<sub-slug>], applied on subcategory.
  const typeSet = new Set((type ?? '').split(',').map((s) => s.trim()).filter(Boolean))
  const products = !isSearch && typeSet.size
    ? sorted.filter((p) => p.sub && typeSet.has(p.sub))
    : sorted
  // Live subcategories become the sidebar's Type options (values match p.sub).
  const filterOptions = subcategories.map((s) => ({
    value: s.slug,
    label: s.label[lang] ?? s.label.en,
  }))
  const hasSidebar = filterOptions.length > 0
  const heading = catLabel
    ? { en: `Explore ${catLabel.en.toLowerCase()}`, sw: catLabel.sw && `Tazama ${catLabel.sw.toLowerCase()}` }
    : { en: 'Explore products' }

  return (
    <div className="bg-surface">
      {isSearch && (
        <div className="bg-background">
          <Container className="pt-8 md:pt-10">
            <h1
              className="font-heading text-foreground"
              style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
            >
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="mt-1 text-foreground/55" style={{ fontSize: 14, lineHeight: '20px' }}>
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          </Container>
        </div>
      )}

      {!isSearch && category && subcategories.length > 0 && (
        <CategoryHero heading={heading} subcategories={subcategories} category={category} />
      )}

      <CompareStrip />

      <div className="bg-background">
        <Container>
          <FilterBar resultsCount={products.length} />
        </Container>
      </div>

      <Container className="py-8 md:py-10">
        {/* Only use the two-column [sidebar | grid] layout when there ARE filter
            options. Otherwise FilterSidebar renders null and the lone product
            grid would be placed into the fixed 240px column, collapsing every
            card — so without a sidebar the grid spans the full width instead. */}
        <div className={hasSidebar ? 'grid gap-6 lg:grid-cols-[240px_1fr]' : ''}>
          {hasSidebar && <FilterSidebar options={filterOptions} />}

          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductListCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-background px-6 py-16 text-center">
      <p
        className="font-heading text-foreground"
        style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
      >
        No products found
      </p>
      <p className="mt-2 text-muted" style={{ fontSize: 14, lineHeight: '20px' }}>
        Try clearing the filters or pick a different category.
      </p>
    </div>
  )
}
