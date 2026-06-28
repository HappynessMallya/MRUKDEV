import "server-only";
import type {
  Distributor,
  DistributorListResult,
  DistributorStats,
  DistributorStatusCounts,
} from "@/types/distributor";
import type { DistributorListQuery } from "@/lib/validations";
import { apiFetch } from "@/lib/api/client";
import {
  distributorListSchema,
  backendDistributorSchema,
  mapDistributor,
  toBackendStatusParam,
} from "@/lib/api/distributors-map";

// Distributor reads, wired to the live backend (admin-protected — these calls
// attach the session's backend access token). The backend has no region filter
// or per-status counts on the list endpoint, so region filtering is applied
// client-side and counts are gathered with cheap parallel meta-only calls.

const REVALIDATE = 30;
const TAGS = { list: "distributors" };

// The backend caps a single page; pull a generous page for region derivation.
const MAX_PAGE = 100;

async function statusTotal(
  status: "all" | "pending" | "approved" | "rejected",
): Promise<number> {
  const res = await apiFetch("/distributors", {
    query: { status, page: 1, limit: 1 },
    schema: distributorListSchema,
    next: { revalidate: REVALIDATE, tags: [TAGS.list] },
  });
  return res.meta.total;
}

async function getCounts(): Promise<DistributorStatusCounts> {
  const [all, pending, active, rejected] = await Promise.all([
    statusTotal("all"),
    statusTotal("pending"),
    statusTotal("approved"),
    statusTotal("rejected"),
  ]);
  // The backend has no "under_review" state — it's folded into pending.
  return { all, active, pending, under_review: 0, rejected };
}

export async function getDistributors(
  query: DistributorListQuery,
): Promise<DistributorListResult> {
  const { page, pageSize, search, status, region } = query;

  const [res, counts] = await Promise.all([
    apiFetch("/distributors", {
      query: {
        status: toBackendStatusParam(status),
        page,
        limit: pageSize,
        search: search || undefined,
      },
      schema: distributorListSchema,
      next: { revalidate: REVALIDATE, tags: [TAGS.list] },
    }),
    getCounts(),
  ]);

  let data: Distributor[] = res.data.map(mapDistributor);
  // Region isn't a server-side filter — best-effort filter on the current page.
  if (region) data = data.filter((d) => d.region === region);

  return { data, total: res.meta.total, page, pageSize, counts };
}

export async function getDistributorStats(): Promise<DistributorStats> {
  const [counts, regions] = await Promise.all([getCounts(), getRegions()]);
  return {
    total: counts.all,
    totalTrend: "",
    pendingApprovals: counts.pending + counts.under_review,
    activeRegions: regions.length,
  };
}

export async function getRegions(): Promise<string[]> {
  const res = await apiFetch("/distributors", {
    query: { status: "all", page: 1, limit: MAX_PAGE },
    schema: distributorListSchema,
    next: { revalidate: REVALIDATE, tags: [TAGS.list] },
  });
  const regions = new Set(
    res.data
      .map((d) => d.region ?? d.distributorProfile?.region ?? "")
      .filter((r): r is string => Boolean(r)),
  );
  return Array.from(regions).sort();
}

export async function getDistributor(id: string): Promise<Distributor | null> {
  try {
    const res = await apiFetch(`/distributors/${encodeURIComponent(id)}`, {
      schema: backendDistributorSchema,
      next: { revalidate: REVALIDATE, tags: [TAGS.list] },
    });
    return mapDistributor(res);
  } catch {
    return null;
  }
}
