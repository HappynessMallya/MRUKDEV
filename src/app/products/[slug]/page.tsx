import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Container } from '@/components/atoms'
import {
  ProductGallery,
  ProductInfo,
  ProductTabs,
  ProductCharacteristics,
  ProductSpecs,
  ProductDiscover,
} from '@/components/product'
import { CATEGORIES, getProduct, listAllSlugs } from '@/data/products'
import { getTenantConfig } from '@/lib/tenant'

interface SearchParams {
  // Home-page links append `?from=<category>` so a missing SKU detail
  // page redirects to its parent category landing instead of 404'ing.
  from?: string
}

function fallbackUrl(from: string | undefined): string {
  if (from && CATEGORIES.some((c) => c.slug === from)) {
    return `/products?category=${from}`
  }
  return '/products'
}

// Pre-render every product slug at build time. Once the backend is live this
// becomes a paginated `getStaticPaths`-style fetch from the catalog API.
export function generateStaticParams() {
  return listAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  const tenant = await getTenantConfig()
  if (!product) return { title: tenant.identity.companyName }

  const lang = tenant.defaultLang
  const name = product.name[lang] ?? product.name.en
  const desc = product.shortDescription?.[lang] ?? product.shortDescription?.en

  return {
    title: `${name} — ${tenant.identity.companyName}`,
    description: desc,
    openGraph: {
      title: name,
      description: desc,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  }
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}) {
  const { slug } = await params
  const { from } = await searchParams
  const product = getProduct(slug)
  // No SKU detail page yet for this slug? Send the visitor to the category
  // landing instead of a dead-end 404 — they'll see related products there.
  if (!product) redirect(fallbackUrl(from))

  const tenant = await getTenantConfig()
  const lang = tenant.defaultLang
  const altText = product.name[lang] ?? product.name.en

  // Resolve related slugs → full Product objects, drop any that don't exist.
  const related = (product.relatedSlugs ?? [])
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .slice(0, 4)

  return (
    <>
      <section className="bg-background py-10 md:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <ProductGallery images={product.images} alt={altText} />
            <ProductInfo product={product} />
          </div>
        </Container>
      </section>

      <ProductTabs />

      <ProductCharacteristics
        highlightIcons={product.highlightIcons}
        blocks={product.characteristics}
      />

      {product.specifications && product.specifications.length > 0 && (
        <ProductSpecs specs={product.specifications} />
      )}

      <ProductDiscover related={related} />
    </>
  )
}
