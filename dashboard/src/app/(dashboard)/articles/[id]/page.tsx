import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Pencil, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { getArticle } from "@/lib/data/articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  return { title: article ? article.title : "Article" };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticleViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  const paragraphs = article.body.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/articles">
            <ArrowLeft className="size-4" />
            Back to articles
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`/articles/${article.id}/edit`}>
            <Pencil className="size-4" />
            Edit
          </Link>
        </Button>
      </div>

      <article className="space-y-6">
        <div className="bg-muted text-muted-foreground relative flex aspect-16/7 w-full items-center justify-center overflow-hidden rounded-lg">
          {article.coverImageUrl ? (
            <Image
              src={article.coverImageUrl}
              alt={article.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <ImageIcon className="size-8" />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {article.categories.map((c) => (
              <Badge key={c} variant="secondary" className="font-normal">
                {c}
              </Badge>
            ))}
            <StatusBadge status={article.status} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">
            {article.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            By {article.author} ·{" "}
            {fmtDate(article.publishedAt ?? article.updatedAt)}
          </p>
        </div>

        <div className="space-y-4 text-[15px] leading-relaxed">
          {paragraphs.map((p, i) =>
            p.startsWith('"') ? (
              <blockquote
                key={i}
                className="border-brand text-muted-foreground border-l-2 pl-4 italic"
              >
                {p}
              </blockquote>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </div>
      </article>
    </div>
  );
}
