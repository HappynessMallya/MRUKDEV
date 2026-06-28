// Typed fetcher for the public blog/articles read path (Fanisi `GET /articles`).
// Public read — only the `x-tenant-slug` header is required. ISR-cached like the
// catalog. The collection may be empty (no articles seeded yet); callers should
// treat an empty list as "fall back to static/mock content".

import { apiFetch } from '@/lib/apiClient'
import type { Localized, Paginated } from '@/types/api'

const ARTICLES_REVALIDATE = 300

// Only the fields the storefront consumes are typed. `title`/`excerpt`/`body`
// are localized; `coverImage`/`author` are plain strings (per backend answer).
// `body` is only returned by the single-article read (`GET /articles/:slug`),
// so it's optional here and absent on list items.
export interface ApiArticle {
  id: string
  slug: string
  title: Localized
  excerpt?: Localized
  body?: Localized
  coverImage?: string | null
  author?: string
  tags?: string[]
  publishedAt?: string
  isPublished?: boolean
}

export interface ListArticlesParams {
  page?: number
  limit?: number
  tag?: string
}

// GET /articles → { data, meta } (published-only, publishedAt desc).
export function listArticles(
  params: ListArticlesParams = {}
): Promise<Paginated<ApiArticle>> {
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v))
  }
  const suffix = qs.toString() ? `?${qs}` : ''
  return apiFetch<Paginated<ApiArticle>>(`/articles${suffix}`, {
    next: { revalidate: ARTICLES_REVALIDATE, tags: ['articles'] },
  })
}

// GET /articles/{slug} → a single published article including its localized
// `body` (404 if missing/unpublished).
export function getArticleBySlug(slug: string): Promise<ApiArticle> {
  return apiFetch<ApiArticle>(`/articles/${encodeURIComponent(slug)}`, {
    next: { revalidate: ARTICLES_REVALIDATE, tags: ['articles', `article:${slug}`] },
  })
}
