"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { hasAtLeastRole, type Role } from "@/types/auth";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  role: Role;
  /** Called when a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

export function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter(
    (item) => !item.minRole || hasAtLeastRole(role, item.minRole),
  );

  return (
    <nav className="flex flex-col gap-1" aria-label="Primary">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActivePath(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
