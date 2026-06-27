import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { StatCardGrid } from "@/components/dashboard/stat-card";
import { QuoteOrdersChart } from "@/components/dashboard/quote-orders-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ActionRequired } from "@/components/dashboard/action-required";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { getDashboardOverview, getNotifications } from "@/lib/data/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [overview, notifications] = await Promise.all([
    getDashboardOverview(),
    getNotifications(),
  ]);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <PageHeader
          title="Enterprise Overview"
          description="Real-time logistics and operational insights for Tanzania"
          actions={
            <Button asChild>
              <Link href="/products">
                <Plus className="size-4" />
                Upload Product
              </Link>
            </Button>
          }
        />

        <StatCardGrid stats={overview.kpis} />
        <QuoteOrdersChart data={overview.chart} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActivityFeed items={overview.activity} />
          <ActionRequired items={overview.actions} />
        </div>
      </div>

      <NotificationsPanel
        notifications={notifications}
        className="xl:sticky xl:top-[calc(var(--spacing-topbar)+1.5rem)] xl:max-h-[calc(100dvh-var(--spacing-topbar)-3rem)]"
      />
    </div>
  );
}
