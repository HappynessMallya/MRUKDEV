"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { AppNotification } from "@/types/notification";
import { cn } from "@/lib/utils";

interface NotificationsBellProps {
  notifications?: AppNotification[];
}

export function NotificationsBell({
  notifications = [],
}: NotificationsBellProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-5" />
          {unread > 0 && (
            <span className="bg-brand absolute top-1.5 right-1.5 size-2 rounded-full ring-2 ring-card" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          {unread > 0 && (
            <span className="bg-brand/10 text-brand rounded-full px-2 py-0.5 text-xs font-medium">
              {unread} new
            </span>
          )}
        </div>
        {notifications.length === 0 ? (
          <p className="text-muted-foreground px-4 py-8 text-center text-sm">
            You&apos;re all caught up.
          </p>
        ) : (
          <ScrollArea className="max-h-80">
            <ul className="divide-border divide-y">
              {notifications.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href ?? "#"}
                    className="hover:bg-secondary/60 flex flex-col gap-0.5 px-4 py-3 transition-colors"
                  >
                    <span
                      className={cn(
                        "text-sm",
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
          </ScrollArea>
        )}
        <div className="border-t p-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
