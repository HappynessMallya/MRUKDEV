import { HeroCarousel, type HeroCarouselProps } from './HeroCarousel'
import { FeaturedProducts, type FeaturedProductsProps } from './FeaturedProducts'
import { BestQualityShowcase, type BestQualityShowcaseProps } from './BestQualityShowcase'
import { PopularProducts, type PopularProductsProps } from './PopularProducts'
import { BlogPreview, type BlogPreviewProps } from './BlogPreview'
import type { PageSection, TenantFeatures } from '@/types/tenant'

// Maps `type` strings from the tenant config to React components. Adding a
// new section type is a one-line registry change here plus a typed component.
//
// Each section receives its untyped `props` blob from the JSON; a per-type
// cast at the boundary keeps the rest of the code path strongly typed.
const SECTION_REGISTRY: Record<string, React.ComponentType<any>> = {
  hero_carousel: HeroCarousel,
  featured_products: FeaturedProducts,
  best_quality_showcase: BestQualityShowcase,
  popular_products: PopularProducts,
  blog_preview: BlogPreview,
}

export function SectionRenderer({
  sections,
  features,
}: {
  sections: PageSection[]
  features: TenantFeatures
}) {
  const ordered = [...sections]
    .filter((s) => s.enabled)
    .filter((s) => !s.featureFlag || features[s.featureFlag as keyof TenantFeatures])
    .sort((a, b) => a.order - b.order)

  return (
    <>
      {ordered.map((section) => {
        const Component = SECTION_REGISTRY[section.type]
        if (!Component) {
          if (process.env.NODE_ENV !== 'production') {
            return (
              <div key={section.id} className="bg-yellow-100 border-l-4 border-yellow-500 px-6 py-4 my-4 text-sm">
                <strong>Unknown section type:</strong> <code>{section.type}</code> (id: {section.id})
              </div>
            )
          }
          return null
        }
        return <Component key={section.id} {...(section.props as object)} />
      })}
    </>
  )
}

export type {
  HeroCarouselProps,
  FeaturedProductsProps,
  BestQualityShowcaseProps,
  PopularProductsProps,
  BlogPreviewProps,
}
