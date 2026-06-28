import "server-only";
import { z } from "zod";
import type { DashboardOverview } from "@/types/dashboard";
import type { AppNotification } from "@/types/notification";
import { apiFetch } from "@/lib/api/client";
import { formatNumber, formatTSh } from "@/lib/format";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

// GET /dashboard/overview — flat all-time KPI snapshot (admin/staff). The
// backend has no time-series or activity feed, so the chart/activity panels are
// returned empty; revenue is `sum(amountPaid)` in major-unit TZS.
const overviewSchema = z.object({
  products: z.object({ total: z.number(), published: z.number() }),
  categories: z.number(),
  inquiries: z.object({ total: z.number() }),
  proformas: z.object({ total: z.number() }),
  invoices: z.object({
    total: z.number(),
    revenue: z.number(),
    grossBilled: z.number().optional(),
  }),
  distributors: z.object({ total: z.number(), pending: z.number() }),
  customers: z.object({ total: z.number() }),
});

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const o = await apiFetch("/dashboard/overview", {
    schema: overviewSchema,
    next: { revalidate: 60, tags: ["dashboard"] },
  });

  return {
    kpis: [
      {
        key: "revenue",
        label: "Revenue Collected",
        value: formatTSh(o.invoices.revenue),
        hint: o.invoices.grossBilled != null ? `${formatTSh(o.invoices.grossBilled)} billed` : undefined,
        hintTrend: "neutral",
      },
      {
        key: "distributors",
        label: "Distributors",
        value: formatNumber(o.distributors.total),
        hint: o.distributors.pending > 0 ? `${o.distributors.pending} pending` : "none pending",
        hintTrend: o.distributors.pending > 0 ? "down" : "up",
      },
      {
        key: "inventory",
        label: "Published Products",
        value: `${formatNumber(o.products.published)} / ${formatNumber(o.products.total)}`,
        hint: `${formatNumber(o.categories)} categories`,
        hintTrend: "neutral",
      },
      {
        key: "inquiries",
        label: "Open Inquiries",
        value: formatNumber(o.inquiries.total),
        hint: `${formatNumber(o.proformas.total)} proformas`,
        hintTrend: "neutral",
      },
    ],
    // No time-series from the backend yet.
    chart: { points: [], totalQuotes: o.proformas.total, totalOrders: o.invoices.total, conversionRate: 0 },
    activity: [],
    actions: [
      {
        id: "act-approvals",
        label: "Pending Approvals",
        description: "Distributor applications awaiting review",
        count: o.distributors.pending,
        severity: "danger",
        href: "/distributors?status=pending",
      },
      {
        id: "act-inquiries",
        label: "Open Inquiries",
        description: "Customer & distributor requests",
        count: o.inquiries.total,
        severity: "info",
        href: "/inquiries",
      },
    ],
  };
}

/**
 * Notifications for the dashboard aside + topbar bell.
 * MOCK — swap for `apiFetch("/notifications", { schema, ... })` later.
 */
export async function getNotifications(): Promise<AppNotification[]> {
  return [
    { id: "n1", title: "Harbour Maritime submitted a new distributor application", category: "Approvals", createdAt: minutesAgo(0), read: false, href: "/distributors" },
    { id: "n2", title: "Low stock alert: Onyx Series Refrigerator (Mwanza Hub)", category: "System", createdAt: minutesAgo(12), read: false, href: "/products" },
    { id: "n3", title: "New bulk quote inquiry from Arusha Supplies Ltd", category: "Inquiries", createdAt: minutesAgo(45), read: false, href: "/inquiries" },
    { id: "n4", title: "System maintenance scheduled for Sunday, 2:00 AM", category: "System", createdAt: minutesAgo(120), read: true },
  ];
}
