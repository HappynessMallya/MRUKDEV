"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  /** When provided, renders a retry button (e.g. React Query's `refetch`). */
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-destructive/30 bg-destructive/5 flex flex-col items-center justify-center gap-3 rounded-lg border px-6 py-10 text-center",
        className,
      )}
    >
      <span className="bg-destructive/10 text-destructive flex size-11 items-center justify-center rounded-full">
        <AlertTriangle className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-foreground text-sm font-semibold">{title}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RotateCw className="size-4" />
          Try again
        </Button>
      )}
    </div>
  );
}
