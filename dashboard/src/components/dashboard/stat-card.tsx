import {
  Banknote,
  Users,
  ClipboardCheck,
  Mail,
  TrendingUp,
  TrendingDown,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import type { KpiStat, TrendDirection } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const ICONS: Record<KpiStat["key"], LucideIcon> = {
  revenue: Banknote,
  distributors: Users,
  inventory: ClipboardCheck,
  inquiries: Mail,
};

const trendClass: Record<TrendDirection, string> = {
  up: "text-success",
  down: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({ stat }: { stat: KpiStat }) {
  const Icon = ICONS[stat.key];
  const trend = stat.hintTrend ?? "neutral";
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;

  return (
    <Card className="gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {stat.label}
        </span>
        <Icon className="text-muted-foreground size-4" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold tracking-tight tabular-nums">
          {stat.value}
        </p>
        {stat.hint && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trendClass[trend],
            )}
          >
            {TrendIcon && <TrendIcon className="size-3.5" />}
            {stat.hint}
          </p>
        )}
      </div>
    </Card>
  );
}

export function StatCardGrid({ stats }: { stats: KpiStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.key} stat={stat} />
      ))}
    </div>
  );
}
