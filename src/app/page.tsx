import { getTenantConfig } from '@/lib/tenant'
import { SectionRenderer } from '@/components/sections'

// Home page is a thin shell — the real content is the `sections` array on
// `tenant.pages.home`. SectionRenderer maps each `type` to a React component
// and respects `enabled` + `featureFlag` from the JSON config.
export default async function HomePage() {
  const tenant = await getTenantConfig()
  const sections = tenant.pages.home?.sections ?? []
  return <SectionRenderer sections={sections} features={tenant.features} />
}
