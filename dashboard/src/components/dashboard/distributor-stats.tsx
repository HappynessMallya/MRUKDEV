import { Users, Clock, Map } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { DistributorStats } from "@/types/distributor";

export function DistributorStatsCards({ stats }: { stats: DistributorStats }) {
  const cards = [
    {
      icon: Users,
      label: "Total Distributors",
      value: formatNumber(stats.total),
      hint: stats.totalTrend,
    },
    {
      icon: Clock,
      label: "Pending Approvals",
      value: formatNumber(stats.pendingApprovals),
      hint: "Requires review",
    },
    {
      icon: Map,
      label: "Active Regions",
      value: formatNumber(stats.activeRegions),
      hint: "Focus: Tanzania",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map(({ icon: Icon, label, value, hint }) => (
        <Card key={label} className="gap-2 p-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {label}
            </span>
            <Icon className="text-muted-foreground size-4" />
          </div>
          <p className="text-2xl font-bold tracking-tight tabular-nums">{value}</p>
          <p className="text-muted-foreground text-xs">{hint}</p>
        </Card>
      ))}
    </div>
  );
}
