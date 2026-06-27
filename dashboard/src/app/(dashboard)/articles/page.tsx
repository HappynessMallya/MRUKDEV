import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArticleStatsCards } from "@/components/dashboard/article-stats";
import { ArticleToolbar } from "@/components/dashboard/article-toolbar";
import { ArticleTable } from "@/components/dashboard/article-table";
import { getArticleStats, getArticles } from "@/lib/data/articles";
import { articleListQuerySchema } from "@/lib/validations";

export const metadata: Metadata = { title: "Article management" };

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = articleListQuerySchema.parse({
    page: sp.page,
    search: sp.search,
    status: sp.status,
    pageSize: 10,
  });

  const [{ data, total, page, pageSize, counts }, stats] = await Promise.all([
    getArticles(query),
    getArticleStats(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Article Management"
        description="Manage, edit, and track the performance of all your published content."
        actions={
          <Button asChild>
            <Link href="/articles/new">
              <Plus className="size-4" />
              Create new article
            </Link>
          </Button>
        }
      />

      <ArticleStatsCards stats={stats} />

      <Card className="gap-5 p-5">
        <ArticleToolbar
          counts={counts}
          current={{ status: query.status, search: query.search }}
        />
        <ArticleTable
          articles={data}
          total={total}
          page={page}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
