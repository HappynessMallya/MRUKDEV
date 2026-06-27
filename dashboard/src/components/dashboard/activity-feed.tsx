import Link from "next/link";
import {
  UserPlus,
  BadgeCheck,
  PackageCheck,
  ShieldCheck,
  MessageSquare,
  Bell,
  History,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ActivityItem, ActivityKind } from "@/types/dashboard";
import { formatRelativeTime } from "@/lib/format";

const ICONS: Record<ActivityKind, LucideIcon> = {
  distributor: UserPlus,
  quote: BadgeCheck,
  stock: PackageCheck,
  verification: ShieldCheck,
  inquiry: MessageSquare,
  system: Bell,
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="gap-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Link
          href="/notifications"
          className="text-brand text-sm font-medium hover:underline"
        >
          View All
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={History}
          title="No recent activity"
          description="Distributor, quote, and inventory events will appear here."
          className="border-0 py-8"
        />
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const Icon = ICONS[item.kind];
            return (
              <li key={item.id} className="flex gap-3">
                <span className="bg-secondary text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm leading-snug font-medium">
                    {item.message}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(item.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
