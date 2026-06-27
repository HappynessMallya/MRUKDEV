import Link from "next/link";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import type { Role } from "@/types/auth";

/** Fixed desktop sidebar. Hidden on mobile (see MobileNav). */
export function AppSidebar({ role }: { role: Role }) {
  return (
    <aside className="bg-card hidden w-sidebar shrink-0 flex-col border-r lg:flex">
      <div className="flex h-topbar items-center border-b px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          MRUK
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SidebarNav role={role} />
      </div>
    </aside>
  );
}
