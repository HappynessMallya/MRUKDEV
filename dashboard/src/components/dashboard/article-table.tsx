"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { type ColumnDef, type SortingState } from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ArticleRowActions } from "@/components/dashboard/article-row-actions";
import { Badge } from "@/components/ui/badge";
import type { Article } from "@/types/article";

interface ArticleTableProps {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ArticleTable({
  articles,
  total,
  page,
  pageSize,
}: ArticleTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Article, unknown>[]>(
    () => [
      {
        id: "title",
        header: "Article title",
        accessorFn: (a) => a.title,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.coverImageUrl ? (
              <Image
                src={row.original.coverImageUrl}
                alt={row.original.title}
                width={40}
                height={40}
                unoptimized
                className="size-10 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md">
                <Newspaper className="size-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-medium">{row.original.title}</p>
              <p className="text-muted-foreground text-xs">
                {row.original.author}
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "categories",
        header: "Categories",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.categories.slice(0, 2).map((c) => (
              <Badge key={c} variant="secondary" className="font-normal">
                {c}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "date",
        header: "Date",
        accessorFn: (a) => a.updatedAt,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {fmtDate(row.original.updatedAt)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <ArticleRowActions article={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={articles}
        getRowId={(a) => a.id}
        sorting={sorting}
        onSortingChange={setSorting}
        onRowClick={(a) => router.push(`/articles/${a.id}/edit`)}
        emptyState={
          <EmptyState
            icon={Newspaper}
            title="No articles found"
            description="Create your first article or adjust the filters."
            className="border-0 py-12"
          />
        }
      />
      <TablePagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
