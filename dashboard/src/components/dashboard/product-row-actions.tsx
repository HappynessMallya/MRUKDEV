"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  MoreVertical,
  Pencil,
  Upload,
  QrCode,
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
import { ProductQrDialog } from "@/components/dashboard/product-qr-dialog";
import { changeProductStatus, deleteProduct } from "@/lib/actions/products";
import type { Product } from "@/types/product";

export function ProductRowActions({ product }: { product: Product }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isPublished = product.status === "published";

  function togglePublish() {
    startTransition(async () => {
      const result = await changeProductStatus(
        product.id,
        isPublished ? "draft" : "published",
      );
      if (result.ok) {
        toast.success(isPublished ? "Moved to draft" : "Product published");
      } else {
        toast.error(result.error);
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      const result = await deleteProduct(product.id);
      if (result.ok) {
        toast.success(`Deleted "${product.name}"`);
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
            aria-label="Product actions"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuItem asChild>
            <Link href={`/products/${product.id}/edit`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); togglePublish(); }}>
            <Upload className="size-4" />
            {isPublished ? "Unpublish" : "Publish"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setQrOpen(true);
            }}
          >
            <QrCode className="size-4" />
            Download QR code
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
            Delete product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{product.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the product and all its variants. This
              action cannot be undone.
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

      <ProductQrDialog
        product={product}
        open={qrOpen}
        onOpenChange={setQrOpen}
      />
    </>
  );
}
