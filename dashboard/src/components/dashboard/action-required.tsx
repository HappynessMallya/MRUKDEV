import Link from "next/link";
import {
  ClipboardList,
  MessageSquareWarning,
  TriangleAlert,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ActionItem, ActionSeverity } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "Pending Approvals": ClipboardList,
  "Unresolved Inquiries": MessageSquareWarning,
  "Low Stock Alerts": TriangleAlert,
};

const severityStyles: Record<
  ActionSeverity,
  { row: string; icon: string; badge: string }
> = {
  danger: {
    row: "hover:bg-destructive/5",
    icon: "bg-destructive/10 text-destructive",
    badge: "bg-destructive/10 text-destructive",
  },
  warning: {
    row: "hover:bg-warning/10",
    icon: "bg-warning/15 text-warning-foreground",
    badge: "bg-warning/15 text-warning-foreground",
  },
  info: {
    row: "hover:bg-info/5",
    icon: "bg-info/10 text-info",
    badge: "bg-info/10 text-info",
  },
};

export function ActionRequired({ items }: { items: ActionItem[] }) {
  return (
    <Card className="gap-4 p-6">
      <h2 className="text-lg font-semibold">Action Required</h2>

      {items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Nothing needs your attention"
          description="Approvals, inquiries, and stock alerts will surface here."
          className="border-0 py-8"
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = ICONS[item.label] ?? ClipboardList;
            const styles = severityStyles[item.severity];
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg p-3 transition-colors",
                    styles.row,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      styles.icon,
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.description}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                      styles.badge,
                    )}
                  >
                    {item.count}
                  </span>
                  <ChevronRight className="text-muted-foreground size-4 shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
