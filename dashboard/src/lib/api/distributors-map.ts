import "server-only";

// Maps the Fanisi backend distributor shape onto the dashboard's richer view
// model (src/types/distributor.ts). The backend models a distributor as a user
// with `roleSlug: distributor` plus an optional `distributorProfile`; it has no
// concept of uploaded documents, verification checklists, or per-distributor
// quote history, so those view-model fields are returned empty (the UI already
// renders them gracefully).

import { z } from "zod";
import type { Distributor, DistributorStatus } from "@/types/distributor";

// Backend status enum. Note there is no "under_review" — that's a UI-only state.
export const backendDistributorSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  company: z.string().nullish(),
  region: z.string().nullish(),
  country: z.string().nullish(),
  isActive: z.boolean().nullish(),
  status: z.string().nullish(),
  createdAt: z.string().nullish(),
  distributorProfile: z
    .object({
      companyName: z.string().nullish(),
      region: z.string().nullish(),
      isVerified: z.boolean().nullish(),
      status: z.string().nullish(),
      rejectionReason: z.string().nullish(),
      verifiedAt: z.string().nullish(),
      rejectedAt: z.string().nullish(),
    })
    .nullish(),
});

export type BackendDistributor = z.infer<typeof backendDistributorSchema>;

// Shared paginated envelope `{ data, meta:{ total, page, limit, totalPages } }`.
export function backendListSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    meta: z.object({
      total: z.number(),
      page: z.number(),
      limit: z.number(),
      totalPages: z.number(),
    }),
  });
}

export const distributorListSchema = backendListSchema(backendDistributorSchema);

// backend `approved|pending|rejected` → UI `active|pending|under_review|rejected`.
export function toUiStatus(b: BackendDistributor): DistributorStatus {
  const s = (b.status ?? b.distributorProfile?.status ?? "").toLowerCase();
  if (s === "approved") return "active";
  if (s === "rejected") return "rejected";
  if (s === "pending") return "pending";
  // Fall back to the isActive flag when no explicit status is present.
  return b.isActive ? "active" : "pending";
}

// UI status → backend `?status=` value (under_review has no backend equivalent,
// so it maps to the closest "pending"; absent → "all").
export function toBackendStatusParam(
  ui: DistributorStatus | undefined,
): "pending" | "approved" | "rejected" | "all" {
  switch (ui) {
    case "active":
      return "approved";
    case "rejected":
      return "rejected";
    case "pending":
    case "under_review":
      return "pending";
    default:
      return "all";
  }
}

export function mapDistributor(b: BackendDistributor): Distributor {
  const region = b.region ?? b.distributorProfile?.region ?? "—";
  const country = b.country ?? "";
  return {
    id: b.id,
    // No application id on the backend — derive a short, stable label.
    applicationId: `APP-${b.id.slice(-6).toUpperCase()}`,
    name: b.company ?? b.distributorProfile?.companyName ?? b.name ?? "—",
    location: country ? `${region}, ${country}` : region,
    region,
    phone: b.phone ?? "—",
    email: b.email ?? "—",
    status: toUiStatus(b),
    registrationDate: b.createdAt ?? new Date(0).toISOString(),
    lastQuoteDate: null,
    // The backend doesn't model these — render empty.
    documents: [],
    checklist: [],
    recentQuotes: [],
  };
}
