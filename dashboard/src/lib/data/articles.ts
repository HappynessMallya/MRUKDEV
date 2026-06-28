import "server-only";
import type {
  Article,
  ArticleListResult,
  ArticleStats,
  ArticleStatusCounts,
} from "@/types/article";
import type { ArticleListQuery } from "@/lib/validations";
import { apiFetch } from "@/lib/api/client";
import {
  articleListSchema,
  mapArticle,
  normalizeList,
} from "@/lib/api/articles-map";

// Article reads, wired to the live backend admin endpoint `GET /articles/all`
// (returns drafts + published). Its pagination/filter params aren't part of the
// contract, so we fetch the full set and filter/paginate/count client-side —
// robust regardless of backend behaviour, and article volumes are small.

const REVALIDATE = 30;
const TAG = "articles";

// Re-export so existing imports of `slugify` from this module keep working.
export { slugify } from "@/lib/api/articles-map";

async function fetchAll(): Promise<Article[]> {
  const res = await apiFetch("/articles/all", {
    schema: articleListSchema,
    next: { revalidate: REVALIDATE, tags: [TAG] },
  });
  return normalizeList(res).map(mapArticle);
}

function countByStatus(rows: Article[]): ArticleStatusCounts {
  return {
    all: rows.length,
    published: rows.filter((r) => r.status === "published").length,
    draft: rows.filter((r) => r.status === "draft").length,
    scheduled: rows.filter((r) => r.status === "scheduled").length,
  };
}

export async function getArticleStats(): Promise<ArticleStats> {
  const c = countByStatus(await fetchAll());
  return { total: c.all, published: c.published, drafts: c.draft, scheduled: c.scheduled };
}

export async function getArticles(
  query: ArticleListQuery,
): Promise<ArticleListResult> {
  const { page, pageSize, search, status } = query;
  const all = await fetchAll();
  const counts = countByStatus(all);

  let rows = all;
  if (status) rows = rows.filter((r) => r.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) => r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q),
    );
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total, page, pageSize, counts };
}

export async function getArticle(id: string): Promise<Article | null> {
  // No admin single-article-by-id endpoint — resolve from the full set so
  // drafts (not served by the public /articles/:slug) are editable too.
  const all = await fetchAll();
  return all.find((a) => a.id === id || a.slug === id) ?? null;
}
