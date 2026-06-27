import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ArticleForm } from "@/components/forms/article-form";

export const metadata: Metadata = { title: "New article" };

export default function NewArticlePage() {
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
          title="New Article"
          description="Write and publish a new article for the storefront."
        />
      </div>
      <ArticleForm />
    </div>
  );
}
