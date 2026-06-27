import { Skeleton } from "@/components/ui/skeleton";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function DataTableSkeleton({
  rows = 8,
  columns = 5,
}: DataTableSkeletonProps) {
  return (
    <div className="border-border overflow-hidden rounded-lg border">
      <div className="bg-muted/40 flex items-center gap-4 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      <div className="divide-border divide-y">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-4 py-4">
            {Array.from({ length: columns }).map((_, c) => (
              <Skeleton key={c} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
