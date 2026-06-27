export type TrendDirection = "up" | "down" | "neutral";

export interface KpiStat {
  key: "revenue" | "distributors" | "inventory" | "inquiries";
  label: string;
  value: string;
  /** Small note shown next to the value, e.g. "+12.4%" or "5 Low SKUs". */
  hint?: string;
  hintTrend?: TrendDirection;
}

export interface QuoteOrdersPoint {
  week: string;
  quotes: number;
  orders: number;
}

export interface QuoteOrdersChart {
  points: QuoteOrdersPoint[];
  totalQuotes: number;
  totalOrders: number;
  conversionRate: number; // percentage, e.g. 88.4
}

export type ActivityKind =
  | "distributor"
  | "quote"
  | "stock"
  | "verification"
  | "inquiry"
  | "system";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  message: string;
  createdAt: string; // ISO
}

export type ActionSeverity = "danger" | "warning" | "info";

export interface ActionItem {
  id: string;
  label: string;
  description: string;
  count: number;
  severity: ActionSeverity;
  href: string;
}

export interface DashboardOverview {
  kpis: KpiStat[];
  chart: QuoteOrdersChart;
  activity: ActivityItem[];
  actions: ActionItem[];
}
