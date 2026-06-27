export type ArticleStatus = "draft" | "published" | "scheduled";
export type ArticleVisibility = "public" | "private";

export const ARTICLE_CATEGORIES = [
  "Smart Home Reviews",
  "Industry News",
  "Product Care",
  "Buying Guides",
] as const;

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string; // markdown-ish plain text
  coverImageUrl: string | null;
  author: string;
  categories: string[];
  status: ArticleStatus;
  visibility: ArticleVisibility;
  scheduledFor: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleStats {
  total: number;
  published: number;
  drafts: number;
  scheduled: number;
}

export interface ArticleStatusCounts {
  all: number;
  published: number;
  draft: number;
  scheduled: number;
}

export interface ArticleListResult {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
  counts: ArticleStatusCounts;
}
