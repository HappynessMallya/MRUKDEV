import {
  LayoutGrid,
  Package,
  Home,
  Newspaper,
  MessageSquareText,
  Network,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/types/auth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Minimum role required to see this item. Defaults to VIEWER (everyone). */
  minRole?: Role;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Product", href: "/products", icon: Package },
  { label: "Home page", href: "/landing", icon: Home, minRole: "EDITOR" },
  { label: "Article management", href: "/articles", icon: Newspaper, minRole: "EDITOR" },
  { label: "Inquiries", href: "/inquiries", icon: MessageSquareText },
  { label: "Distributors", href: "/distributors", icon: Network },
];

/** True when `href` should be highlighted for the current pathname. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
