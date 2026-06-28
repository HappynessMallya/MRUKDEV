import "server-only";

// Maps the Fanisi backend Article shape onto the dashboard's view model
// (src/types/article.ts). Backend articles are localized ({en,sw}) and use a
// flat `isPublished` + `tags[]`; the dashboard is monolingual (English) and
// models a `status` (draft|published|scheduled) + `categories[]`.
//
// Lossy by design: Swahili copy is not surfaced/edited here (we read/write
// `.en` only), `scheduled` has no backend equivalent (treated as draft), and
// `visibility` is UI-only (always "public").

import { z } from "zod";
import type { Article } from "@/types/article";
import type { ArticleInput } from "@/lib/validations";

const localized = z
  .union([z.string(), z.object({ en: z.string().nullish(), sw: z.string().nullish() })])
  .nullish();
type Localized = z.infer<typeof localized>;

function toStr(v: Localized): string {
  if (!v) return "";
  return typeof v === "string" ? v : v.en ?? "";
}

export const backendArticleSchema = z.object({
  id: z.string(),
  title: localized,
  slug: z.string().nullish(),
  excerpt: localized,
  body: localized,
  coverImage: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  author: z.string().nullish(),
  isPublished: z.boolean().nullish(),
  publishedAt: z.string().nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export type BackendArticle = z.infer<typeof backendArticleSchema>;

// /articles/all may return a bare array or the standard {data,meta} envelope —
// accept both.
export const articleListSchema = z.union([
  z.array(backendArticleSchema),
  z.object({ data: z.array(backendArticleSchema) }),
]);

export function normalizeList(
  res: z.infer<typeof articleListSchema>,
): BackendArticle[] {
  return Array.isArray(res) ? res : res.data;
}

export function mapArticle(b: BackendArticle): Article {
  const stamp = b.createdAt ?? new Date(0).toISOString();
  return {
    id: b.id,
    title: toStr(b.title),
    slug: b.slug ?? "",
    excerpt: toStr(b.excerpt),
    body: toStr(b.body),
    coverImageUrl: b.coverImage ?? null,
    author: b.author ?? "",
    // Backend has `tags[]`, the dashboard calls them categories.
    categories: b.tags ?? [],
    status: b.isPublished ? "published" : "draft",
    visibility: "public",
    scheduledFor: null,
    publishedAt: b.publishedAt ?? null,
    createdAt: stamp,
    updatedAt: b.updatedAt ?? stamp,
  };
}

// ArticleInput → backend create/update payload. Only DTO fields are sent
// (validation is strict — unknown keys 400). Swahili is mirrored from English
// is intentionally NOT done; we send `{ en }` only. `scheduled` → unpublished.
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function articleInputToPayload(input: ArticleInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: { en: input.title },
    slug: slugify(input.title),
    body: { en: input.body },
    tags: input.categories,
    isPublished: input.status === "published",
  };
  if (input.excerpt) payload.excerpt = { en: input.excerpt };
  if (input.coverImageUrl) payload.coverImage = input.coverImageUrl;
  if (input.author) payload.author = input.author;
  return payload;
}
