import type { Metadata } from "next";
import Link from "next/link";
import { BellOff } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNotifications } from "@/lib/data/dashboard";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        title="Notifications"
        description="All approvals, system alerts, inquiries, and product updates."
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No notifications yet"
          description="New activity will appear here as it happens."
        />
      ) : (
        <Card className="gap-0 p-0">
          <ul className="divide-border divide-y">
            {notifications.map((n) => {
              const content = (
                <div className="flex items-start justify-between gap-3 px-5 py-4">
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        n.read ? "text-muted-foreground" : "font-medium",
                      )}
                    >
                      {n.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 font-normal">
                    {n.category}
                  </Badge>
                </div>
              );
              return (
                <li key={n.id} className="hover:bg-secondary/40 transition-colors">
                  {n.href ? (
                    <Link href={n.href} className="block">
                      {content}
                    </Link>
                  ) : (
                    content
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
