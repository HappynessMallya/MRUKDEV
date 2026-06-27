import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth-guard";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppTopbar } from "@/components/dashboard/app-topbar";
import { getNotifications } from "@/lib/data/dashboard";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Guard the entire dashboard segment (defense in depth alongside proxy.ts).
  const session = await requireSession();
  const notifications = await getNotifications();

  return (
    <div className="flex min-h-dvh">
      <AppSidebar role={session.user.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar user={session.user} notifications={notifications} />
        <main className="mx-auto w-full max-w-350 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
