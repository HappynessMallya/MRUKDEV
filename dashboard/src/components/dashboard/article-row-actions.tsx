"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  MoreVertical,
  Pencil,
  Eye,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { changeArticleStatus, deleteArticle } from "@/lib/actions/articles";
import type { Article } from "@/types/article";

export function ArticleRowActions({ article }: { article: Article }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isPublished = article.status === "published";

  function togglePublish() {
    startTransition(async () => {
      const result = await changeArticleStatus(
        article.id,
        isPublished ? "draft" : "published",
      );
      if (result.ok) toast.success(isPublished ? "Moved to draft" : "Published");
      else toast.error(result.error);
    });
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deleteArticle(article.id);
      if (result.ok) {
        toast.success(`Deleted "${article.title}"`);
        setConfirmOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Article actions"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-44"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem asChild>
            <Link href={`/articles/${article.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/articles/${article.id}`}>
              <Eye className="size-4" />
              Preview
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              togglePublish();
            }}
          >
            <Upload className="size-4" />
            {isPublished ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => {
              e.preventDefault();
              setConfirmOpen(true);
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{article.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the article. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onDelete();
              }}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
