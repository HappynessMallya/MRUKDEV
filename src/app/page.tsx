import { getTenantConfig } from '@/lib/tenant'
import { enrichHomeSections, getHomeSections } from '@/lib/catalog'
import { SectionRenderer } from '@/components/sections'

// Home page is a thin shell — the real content is an ordered `sections` array.
// When the API is live this comes from the CMS (GET /pages/home); otherwise it
// falls back to `tenant.pages.home.sections` from the static config. Section
// `type` strings and field contracts match either source, so SectionRenderer
// maps each `type` to a component and respects `enabled` + `featureFlag`.
//
// `enrichHomeSections` then injects real card data (products/articles) into the
// data-bound sections, server-side; sections without live data keep their MOCK
// fallback so nothing renders empty.
export default async function HomePage() {
  const tenant = await getTenantConfig()
  const staticSections = tenant.pages.home?.sections ?? []
  const sections = await enrichHomeSections(
    await getHomeSections(staticSections),
    tenant.defaultLang
  )
  return <SectionRenderer sections={sections} features={tenant.features} />
}
