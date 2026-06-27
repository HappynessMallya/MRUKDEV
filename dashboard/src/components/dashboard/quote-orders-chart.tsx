import { Card } from "@/components/ui/card";
import type { QuoteOrdersChart as ChartData } from "@/types/dashboard";
import { formatNumber } from "@/lib/format";

export function QuoteOrdersChart({ data }: { data: ChartData }) {
  const max = Math.max(
    1,
    ...data.points.flatMap((p) => [p.quotes, p.orders]),
  );

  return (
    <Card className="gap-5 p-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Quote vs. Orders</h2>
        <p className="text-muted-foreground text-sm">
          Last 30 days conversion performance
        </p>
      </div>

      {/* Bars */}
      <div
        className="flex h-56 items-end gap-4"
        role="img"
        aria-label={`Weekly quotes versus completed orders. Conversion rate ${data.conversionRate}%.`}
      >
        {data.points.map((p) => (
          <div key={p.week} className="flex h-full flex-1 flex-col justify-end">
            <div className="flex h-full items-end justify-center gap-1.5">
              <div
                className="bg-brand-muted w-1/3 min-w-2 rounded-t"
                style={{ height: `${(p.quotes / max) * 100}%` }}
                title={`Quotes: ${formatNumber(p.quotes)}`}
              />
              <div
                className="bg-brand w-1/3 min-w-2 rounded-t"
                style={{ height: `${(p.orders / max) * 100}%` }}
                title={`Orders: ${formatNumber(p.orders)}`}
              />
            </div>
            <span className="text-muted-foreground mt-2 text-center text-xs">
              {p.week}
            </span>
          </div>
        ))}
      </div>

      {/* Legend / totals */}
      <dl className="space-y-2 border-t pt-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground flex items-center gap-2">
            <span className="bg-brand-muted size-2.5 rounded-full" />
            Quotes Issued
          </dt>
          <dd className="font-medium tabular-nums">
            {formatNumber(data.totalQuotes)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground flex items-center gap-2">
            <span className="bg-brand size-2.5 rounded-full" />
            Completed Orders
          </dt>
          <dd className="font-medium tabular-nums">
            {formatNumber(data.totalOrders)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Conversion Rate</dt>
          <dd className="text-success font-semibold tabular-nums">
            {data.conversionRate}%
          </dd>
        </div>
      </dl>
    </Card>
  );
}
