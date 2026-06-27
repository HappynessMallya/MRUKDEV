import { Newspaper, CheckCircle2, FileEdit, CalendarClock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import type { ArticleStats } from "@/types/article";

export function ArticleStatsCards({ stats }: { stats: ArticleStats }) {
  const cards = [
    { icon: Newspaper, label: "Total Articles", value: stats.total },
    { icon: CheckCircle2, label: "Published", value: stats.published },
    { icon: FileEdit, label: "Drafts", value: stats.drafts },
    { icon: CalendarClock, label: "Scheduled", value: stats.scheduled },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="gap-2 p-5">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              {label}
            </span>
            <Icon className="text-muted-foreground size-4" />
          </div>
          <p className="text-2xl font-bold tracking-tight tabular-nums">
            {formatNumber(value)}
          </p>
        </Card>
      ))}
    </div>
  );
}
