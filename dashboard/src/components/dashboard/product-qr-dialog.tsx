"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import { Download, Loader2, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface ProductQrDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQrDialog({
  product,
  open,
  onOpenChange,
}: ProductQrDialogProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const target = `${origin}/products/${product.id}`;
    let cancelled = false;
    QRCode.toDataURL(target, { width: 320, margin: 2 })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        /* leave loader visible on failure */
      });
    return () => {
      cancelled = true;
    };
  }, [open, product.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Product QR code</DialogTitle>
          <DialogDescription>
            Scan to open “{product.name}”. Download to print on packaging or
            shelf labels.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          <div className="bg-muted/40 flex size-56 items-center justify-center rounded-lg border">
            {dataUrl ? (
              <Image
                src={dataUrl}
                alt={`QR code for ${product.name}`}
                width={224}
                height={224}
                unoptimized
                className="size-56 rounded-lg"
              />
            ) : (
              <Loader2 className="text-muted-foreground size-6 animate-spin" />
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            {product.model}
          </p>
          <Button asChild disabled={!dataUrl} className="w-full">
            {dataUrl ? (
              <a href={dataUrl} download={`qr-${product.model || product.id}.png`}>
                <Download className="size-4" />
                Download PNG
              </a>
            ) : (
              <span>
                <QrCode className="size-4" />
                Generating…
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
