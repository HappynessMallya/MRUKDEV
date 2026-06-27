import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Primary CTA (e.g. an "Add product" button or link). */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border bg-card flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-14 text-center",
        className,
      )}
    >
      <span className="bg-brand/10 text-brand flex size-12 items-center justify-center rounded-full">
        <Icon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="text-foreground text-base font-semibold">{title}</p>
        {description && (
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
