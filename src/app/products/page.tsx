import type { Metadata } from 'next'

import { Container } from '@/components/atoms'
import {
  CategoryHero,
  CompareStrip,
  FilterBar,
  FilterSidebar,
  ProductListCard,
} from '@/components/product-list'
import { getCategoryLabel, getProductsByCategory, getSubcategories } from '@/data/products'
import { getTenantConfig } from '@/lib/tenant'
import type { Product } from '@/types/product'

interface SearchParams {
  category?: string
  sub?: string
  sort?: string
  type?: string
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
  const catLabel = category ? getCategoryLabel(category) : null
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
  const { category, sub, sort } = await searchParams

  const products = sortProducts(getProductsByCategory(category, sub), sort)
  const subcategories = getSubcategories(category)
  const catLabel = category ? getCategoryLabel(category) : null
  const heading = catLabel
    ? { en: `Explore ${catLabel.en.toLowerCase()}`, sw: catLabel.sw && `Tazama ${catLabel.sw.toLowerCase()}` }
    : { en: 'Explore products' }

  return (
    <div className="bg-surface">
      {category && subcategories.length > 0 && (
        <CategoryHero heading={heading} subcategories={subcategories} category={category} />
      )}

      <CompareStrip />

      <div className="bg-background">
        <Container>
          <FilterBar resultsCount={products.length} />
        </Container>
      </div>

      <Container className="py-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <FilterSidebar />

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
