import { Skeleton } from "@/components/ui/skeleton";
import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <DataTableSkeleton />
    </div>
  );
}
