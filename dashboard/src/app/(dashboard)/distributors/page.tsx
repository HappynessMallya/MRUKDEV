import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { DistributorStatsCards } from "@/components/dashboard/distributor-stats";
import { DistributorFilters } from "@/components/dashboard/distributor-filters";
import { DistributorTable } from "@/components/dashboard/distributor-table";
import {
  getDistributorStats,
  getDistributors,
  getRegions,
} from "@/lib/data/distributors";
import { distributorListQuerySchema } from "@/lib/validations";

export const metadata: Metadata = { title: "Distributors" };

export default async function DistributorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = distributorListQuerySchema.parse({
    page: sp.page,
    search: sp.search,
    status: sp.status,
    region: sp.region,
    pageSize: 10,
  });

  const [{ data, total, page, pageSize }, stats, regions] = await Promise.all([
    getDistributors(query),
    getDistributorStats(),
    getRegions(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Distributor Management"
        description="Manage and register distributors across Tanzania."
      />

      <DistributorStatsCards stats={stats} />

      <Card className="gap-5 p-5">
        <DistributorFilters
          regions={regions}
          current={{
            status: query.status,
            region: query.region,
            search: query.search,
          }}
        />
        <DistributorTable
          distributors={data}
          total={total}
          page={page}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
