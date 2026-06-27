"use client";

import { toast } from "sonner";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DistributorDocument } from "@/types/distributor";

export function DocumentsList({
  documents,
}: {
  documents: DistributorDocument[];
}) {
  if (documents.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No documents submitted.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="border-border flex items-center gap-3 rounded-lg border p-3"
        >
          <span className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-md">
            <FileText className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{doc.name}</p>
            <p className="text-muted-foreground text-xs">{doc.sizeLabel}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label={`Download ${doc.name}`}
            onClick={() =>
              toast.info("File download will be wired to the backend.")
            }
          >
            <Download className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
