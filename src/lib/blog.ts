import 'server-only'

// Server-side blog data-access — the cutover from mock posts to the live
// articles API, chosen by NEXT_PUBLIC_USE_API (same flag as the catalog):
//   'true'  → live Fanisi articles (GET /articles, GET /articles/:slug)
//   else    → local mock posts (src/data/blog.ts)                  [fallback]
//
// Even when live, we fall back to the mock posts whenever the API is empty (no
// articles seeded yet) or unreachable, so /blog and /blog/:slug always render
// real-looking content rather than an empty page.

import {
  getAllBlogPosts as mockAll,
  getBlogPost as mockGet,
  listAllBlogSlugs as mockSlugs,
} from '@/data/blog'
import type { ApiError } from '@/lib/apiClient'
import { getArticleBySlug, listArticles, type ApiArticle } from '@/lib/api/articles'
import { getTenantConfig } from '@/lib/tenant'
import type { Localized } from '@/types/api'
import type { BlogBlock, BlogPost } from '@/types/blog'
import type { Lang } from '@/types/tenant'

const USE_API = process.env.NEXT_PUBLIC_USE_API === 'true'

// Upper bound for the article list (content volume is small).
const MAX_LIST = 50

// Cover is fed to next/image with `fill` — it must never be empty, so articles
// without a cover borrow a bundled placeholder.
const FALLBACK_COVER = '/content/blog1.png'

function localize(text: Localized | undefined, lang: Lang): string {
  if (!text) return ''
  return (lang === 'sw' ? text.sw : undefined) ?? text.en ?? ''
}

function estimateMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  // ~200 wpm; floor of 1 so a short/empty post still reads "1 min read".
  return Math.max(1, Math.round(words / 200))
}

// The live article `body` is a single localized string (plain text or markdown).
// The article view renders typed blocks, so we split blank-line-separated chunks
// into paragraphs and recognise markdown-ish '#' headings and '>' quotes. Good
// enough for plain/markdown content; rich HTML would need a real parser — none
// is seeded yet, so this is the documented best-effort mapping.
function bodyToBlocks(body: string): BlogBlock[] {
  const trimmed = body.trim()
  if (!trimmed) return []
  return trimmed.split(/\n{2,}/).map((chunk): BlogBlock => {
    const line = chunk.trim()
    const heading = line.match(/^#{1,6}\s+(.+)$/)
    if (heading) return { type: 'heading', text: heading[1].trim() }
    const quote = line.match(/^>\s+(.+)$/)
    if (quote) return { type: 'quote', text: quote[1].trim() }
    return { type: 'paragraph', text: line }
  })
}

function mapArticle(a: ApiArticle, lang: Lang, companyName: string): BlogPost {
  const bodyText = localize(a.body, lang)
  return {
    id: a.id,
    slug: a.slug,
    title: localize(a.title, lang) || a.slug,
    excerpt: localize(a.excerpt, lang),
    coverImage: a.coverImage || FALLBACK_COVER,
    publishedAt: a.publishedAt ?? '',
    minRead: estimateMinutes(bodyText),
    tags: a.tags ?? [],
    // `author` is a plain string; role/avatar aren't modelled backend-side.
    author: { name: a.author || companyName },
    body: bodyToBlocks(bodyText),
  }
}

// defaultLang + company name drive localization and the author fallback.
// getTenantConfig is React.cache-memoised, so this is cheap to call per render.
async function blogContext(): Promise<{ lang: Lang; company: string }> {
  const tenant = await getTenantConfig()
  return { lang: tenant.defaultLang, company: tenant.identity.companyName }
}

function isNotFound(err: unknown): boolean {
  return (err as ApiError)?.status === 404
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!USE_API) return mockAll()
  try {
    const res = await listArticles({ limit: MAX_LIST })
    if (res.data.length === 0) return mockAll()
    const { lang, company } = await blogContext()
    return res.data.map((a) => mapArticle(a, lang, company))
  } catch {
    return mockAll()
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!USE_API) return mockGet(slug)
  try {
    const a = await getArticleBySlug(slug)
    const { lang, company } = await blogContext()
    return mapArticle(a, lang, company)
  } catch (err) {
    // Unknown slug on the live API → try the mock posts (keeps the seeded demo
    // slugs working until real articles exist); anything else also degrades to
    // mock so a cold backend never 500s the page.
    if (isNotFound(err)) return mockGet(slug)
    return mockGet(slug)
  }
}

export async function listAllBlogSlugs(): Promise<string[]> {
  if (!USE_API) return mockSlugs()
  try {
    const res = await listArticles({ limit: MAX_LIST })
    if (res.data.length === 0) return mockSlugs()
    return res.data.map((a) => a.slug)
  } catch {
    return mockSlugs()
  }
}
