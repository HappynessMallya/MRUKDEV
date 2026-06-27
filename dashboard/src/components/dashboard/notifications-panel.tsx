import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { BellOff } from "lucide-react";
import type { AppNotification } from "@/types/notification";
import { cn } from "@/lib/utils";

interface NotificationsPanelProps {
  notifications?: AppNotification[];
  className?: string;
}

/** Standalone right-hand notifications aside used on the dashboard. */
export function NotificationsPanel({
  notifications = [],
  className,
}: NotificationsPanelProps) {
  return (
    <Card className={cn("flex h-full flex-col gap-0 p-0", className)}>
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-semibold">Notifications</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {notifications.length === 0 ? (
          <EmptyState
            icon={BellOff}
            title="No notifications"
            description="New activity across approvals, inventory, and inquiries will show up here."
            className="border-0 py-10"
          />
        ) : (
          <ul className="space-y-1">
            {notifications.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href ?? "#"}
                  className="hover:bg-secondary/60 flex flex-col gap-1 rounded-lg px-3 py-3 transition-colors"
                >
                  <span
                    className={cn(
                      "text-sm leading-snug",
                      n.read ? "text-muted-foreground" : "font-medium",
                    )}
                  >
                    {n.title}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {n.category}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t p-3">
        <Button asChild variant="outline" className="w-full">
          <Link href="/notifications">View All Notifications</Link>
        </Button>
      </div>
    </Card>
  );
}
