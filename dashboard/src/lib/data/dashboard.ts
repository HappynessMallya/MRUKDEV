import "server-only";
import type { DashboardOverview } from "@/types/dashboard";
import type { AppNotification } from "@/types/notification";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

/**
 * Dashboard overview.
 *
 * MOCK for now. When the backend is ready, replace the body with:
 *
 *   import { apiFetch } from "@/lib/api/client";
 *   import { dashboardOverviewSchema } from "@/lib/validations";
 *   return apiFetch("/dashboard/overview", {
 *     schema: dashboardOverviewSchema,
 *     next: { revalidate: 60, tags: ["dashboard"] },
 *   });
 */
export async function getDashboardOverview(): Promise<DashboardOverview> {
  return {
    kpis: [
      { key: "revenue", label: "Total Revenue", value: "TSh 124.8M", hint: "+12.4%", hintTrend: "up" },
      { key: "distributors", label: "Active Distributors", value: "842", hint: "+18 this week", hintTrend: "up" },
      { key: "inventory", label: "Inventory Health", value: "94%", hint: "5 Low SKUs", hintTrend: "down" },
      { key: "inquiries", label: "Open Inquiries", value: "42", hint: "avg. 4h response", hintTrend: "neutral" },
    ],
    chart: {
      points: [
        { week: "W1", quotes: 420, orders: 360 },
        { week: "W2", quotes: 510, orders: 452 },
        { week: "W3", quotes: 640, orders: 590 },
        { week: "W4", quotes: 570, orders: 490 },
      ],
      totalQuotes: 2140,
      totalOrders: 1892,
      conversionRate: 88.4,
    },
    activity: [
      { id: "a1", kind: "distributor", message: "Zahara Logistics registered as a new distributor in Arusha.", createdAt: minutesAgo(2) },
      { id: "a2", kind: "quote", message: "Bulk Quote #4902 has been finalized by Admin.", createdAt: minutesAgo(45) },
      { id: "a3", kind: "stock", message: "Stock Level Updated: SKU-990 Smart Oven (Mwanza Hub).", createdAt: minutesAgo(180) },
      { id: "a4", kind: "verification", message: "Tanzanite Retailers completed onboarding verification.", createdAt: minutesAgo(300) },
    ],
    actions: [
      { id: "act1", label: "Pending Approvals", description: "Requires immediate review", count: 8, severity: "danger", href: "/distributors" },
      { id: "act2", label: "Unresolved Inquiries", description: "Wait time exceeding 2h", count: 12, severity: "info", href: "/inquiries" },
      { id: "act3", label: "Low Stock Alerts", description: "SKU availability critical", count: 5, severity: "warning", href: "/products" },
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
