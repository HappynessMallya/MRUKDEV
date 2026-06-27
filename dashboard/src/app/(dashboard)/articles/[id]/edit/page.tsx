import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/forms/article-form";
import { getArticle } from "@/lib/data/articles";

export const metadata: Metadata = { title: "Edit article" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/articles">
            <ArrowLeft className="size-4" />
            Back to articles
          </Link>
        </Button>
        <PageHeader
          title="Edit Article"
          description={`Update “${article.title}”.`}
        />
      </div>
      <ArticleForm article={article} />
    </div>
  );
}
