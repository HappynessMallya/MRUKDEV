import "server-only";
import type {
  Article,
  ArticleListResult,
  ArticleStats,
  ArticleStatus,
  ArticleStatusCounts,
} from "@/types/article";
import type { ArticleInput, ArticleListQuery } from "@/lib/validations";

const now = () => new Date().toISOString();
const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86_400_000).toISOString();
const daysAhead = (d: number) =>
  new Date(Date.now() + d * 86_400_000).toISOString();

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const SAMPLE_BODY = `The promise of a truly unified smart home has remained just out of reach.

Developed by the Connectivity Standards Alliance, the new standard is designed to ensure that any device leaning to tap will work seamlessly with any other certified device.

"The goal is not just compatibility, but invisibility. Technology should serve the home without demanding constant troubleshooting."

We remain committed to this future, ensuring our customers can build their own ecosystems without compromise.`;

function seed(): Article[] {
  const rows: Array<
    Pick<Article, "title" | "author" | "categories" | "status"> & {
      days: number;
    }
  > = [
    { title: "The Future of Smart Home Connectivity: Living with Matter", author: "Alex Mercer", categories: ["Smart Home Reviews"], status: "published", days: 2 },
    { title: "OLED vs MicroLED: The Guide for Living Rooms", author: "Sarah Jennings", categories: ["Buying Guides"], status: "published", days: 6 },
    { title: "Sustainable Cooking: 5 Amazon HVAC Trends for 2026", author: "Dr. Liam Chau", categories: ["Industry News"], status: "published", days: 9 },
    { title: "How to Clean Your Refrigerator Coils", author: "Maria Gomez", categories: ["Product Care"], status: "draft", days: 1 },
    { title: "Inverter ACs Explained: Save on Your Power Bill", author: "Alex Mercer", categories: ["Buying Guides"], status: "published", days: 14 },
    { title: "Choosing the Right Solar Pump for Your Farm", author: "Dr. Liam Chau", categories: ["Buying Guides"], status: "scheduled", days: -3 },
    { title: "Top 10 Kitchen Appliances for Small Spaces", author: "Sarah Jennings", categories: ["Buying Guides"], status: "draft", days: 3 },
    { title: "Understanding Energy Ratings on Appliances", author: "Maria Gomez", categories: ["Product Care", "Buying Guides"], status: "published", days: 20 },
    { title: "MRUK Expands Distribution to Mbeya", author: "Newsroom", categories: ["Industry News"], status: "published", days: 25 },
    { title: "Microwave Maintenance: Do's and Don'ts", author: "Maria Gomez", categories: ["Product Care"], status: "draft", days: 4 },
    { title: "Smart TVs in 2026: What to Look For", author: "Alex Mercer", categories: ["Smart Home Reviews", "Buying Guides"], status: "scheduled", days: -7 },
    { title: "Preparing Your Home Appliances for the Rainy Season", author: "Newsroom", categories: ["Product Care"], status: "published", days: 30 },
  ];

  return rows.map((r, i) => {
    const stamp = daysAgo(r.days < 0 ? 0 : r.days);
    return {
      id: `art-${1000 + i}`,
      title: r.title,
      slug: slugify(r.title),
      excerpt:
        "A practical look at what this means for Tanzanian homes and businesses.",
      body: SAMPLE_BODY,
      coverImageUrl: null,
      author: r.author,
      categories: r.categories,
      status: r.status,
      visibility: "public",
      scheduledFor: r.status === "scheduled" ? daysAhead(Math.abs(r.days)) : null,
      publishedAt: r.status === "published" ? stamp : null,
      createdAt: stamp,
      updatedAt: stamp,
    } satisfies Article;
  });
}

const store: { articles: Article[] } = { articles: seed() };

function countByStatus(rows: Article[]): ArticleStatusCounts {
  return {
    all: rows.length,
    published: rows.filter((r) => r.status === "published").length,
    draft: rows.filter((r) => r.status === "draft").length,
    scheduled: rows.filter((r) => r.status === "scheduled").length,
  };
}

/* ──────────────────────────── Reads ──────────────────────────────── */

export async function getArticleStats(): Promise<ArticleStats> {
  const c = countByStatus(store.articles);
  return {
    total: c.all,
    published: c.published,
    drafts: c.draft,
    scheduled: c.scheduled,
  };
}

export async function getArticles(
  query: ArticleListQuery,
): Promise<ArticleListResult> {
  const { page, pageSize, search, status } = query;
  let rows = store.articles;
  const counts = countByStatus(rows);

  if (status) rows = rows.filter((r) => r.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q),
    );
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total, page, pageSize, counts };
}

export async function getArticle(id: string): Promise<Article | null> {
  return (
    store.articles.find((a) => a.id === id || a.slug === id) ?? null
  );
}

/* ─────────────────────────── Mutations ───────────────────────────── */

function applyInput(target: Article, input: ArticleInput): Article {
  const wasPublished = target.status === "published";
  target.title = input.title;
  target.slug = slugify(input.title);
  target.excerpt = input.excerpt;
  target.body = input.body;
  target.coverImageUrl = input.coverImageUrl ?? null;
  target.author = input.author;
  target.categories = input.categories;
  target.status = input.status;
  target.visibility = input.visibility;
  target.scheduledFor = input.scheduledFor ?? null;
  if (input.status === "published" && !wasPublished) {
    target.publishedAt = now();
  }
  target.updatedAt = now();
  return target;
}

export function createArticleRecord(input: ArticleInput): Article {
  const stamp = now();
  const article: Article = {
    id: `art-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title,
    slug: slugify(input.title),
    excerpt: input.excerpt,
    body: input.body,
    coverImageUrl: input.coverImageUrl ?? null,
    author: input.author,
    categories: input.categories,
    status: input.status,
    visibility: input.visibility,
    scheduledFor: input.scheduledFor ?? null,
    publishedAt: input.status === "published" ? stamp : null,
    createdAt: stamp,
    updatedAt: stamp,
  };
  store.articles = [article, ...store.articles];
  return article;
}

export function updateArticleRecord(
  id: string,
  input: ArticleInput,
): Article | null {
  const article = store.articles.find((a) => a.id === id);
  if (!article) return null;
  return applyInput(article, input);
}

export function setArticleStatus(
  id: string,
  status: ArticleStatus,
): Article | null {
  const article = store.articles.find((a) => a.id === id);
  if (!article) return null;
  article.status = status;
  if (status === "published" && !article.publishedAt) {
    article.publishedAt = now();
  }
  article.updatedAt = now();
  return article;
}

export function deleteArticleRecord(id: string): boolean {
  const before = store.articles.length;
  store.articles = store.articles.filter((a) => a.id !== id);
  return store.articles.length < before;
}
