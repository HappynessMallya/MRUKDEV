import { apiFetch } from '@/lib/apiClient'
import type { PageSection } from '@/types/tenant'

// CMS page reads (Fanisi `GET /pages/{key}`). The backend models each page as an
// ordered list of typed sections; the section `type` strings and their `content`
// field contracts mirror our local tenant-config sections, so a CMS section maps
// 1:1 onto our `PageSection` view model (content → props, sortOrder → order).

// Only the fields the storefront consumes are typed here; the full field
// contracts (`fields`) are validated server-side and irrelevant at render time.
interface CmsSection {
  key: string
  type: string
  enabled: boolean
  sortOrder: number
  content?: Record<string, unknown> | null
}

interface CmsPage {
  key: string
  path: string | null
  isPublished: boolean
  sections: CmsSection[]
  config?: Record<string, unknown>
}

function toPageSections(page: CmsPage): PageSection[] {
  return page.sections.map((s) => ({
    id: s.key,
    type: s.type,
    enabled: s.enabled,
    order: s.sortOrder,
    props: s.content ?? {},
  }))
}

/**
 * Fetch a CMS page and map its sections to the storefront `PageSection` shape.
 * Returns `null` on any failure (cold/unreachable backend, 404, unpublished) so
 * callers can fall back to the static tenant config — the storefront never hard-
 * fails on a CMS hiccup. ISR-cached (5 min) and tagged for targeted revalidation.
 */
export async function fetchPageSections(pageKey: string): Promise<PageSection[] | null> {
  try {
    const page = await apiFetch<CmsPage>(`/pages/${pageKey}`, {
      next: { revalidate: 300, tags: [`page:${pageKey}`] },
    })
    if (!page || page.isPublished === false) return null
    return toPageSections(page)
  } catch {
    return null
  }
}
