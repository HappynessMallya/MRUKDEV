"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, Network, Check, X, Loader2 } from "lucide-react";
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DistributorAvatar } from "@/components/dashboard/distributor-avatar";
import { Button } from "@/components/ui/button";
import { updateDistributorStatus } from "@/lib/actions/distributors";
import type { Distributor } from "@/types/distributor";

interface DistributorTableProps {
  distributors: Distributor[];
  total: number;
  page: number;
  pageSize: number;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DistributorTable({
  distributors,
  total,
  page,
  pageSize,
}: DistributorTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  function bulkSetStatus(status: "active" | "rejected") {
    startTransition(async () => {
      const results = await Promise.all(
        selectedIds.map((id) => updateDistributorStatus(id, status)),
      );
      const failed = results.filter((r) => !r.ok).length;
      if (failed === 0) toast.success(`Updated ${selectedIds.length} distributor(s).`);
      else toast.error(`${failed} update(s) failed.`);
      setRowSelection({});
      router.refresh();
    });
  }

  const columns = useMemo<ColumnDef<Distributor, unknown>[]>(
    () => [
      {
        id: "distributor",
        header: "Distributor",
        accessorFn: (d) => d.name,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <DistributorAvatar name={row.original.name} seed={row.original.id} />
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-muted-foreground text-xs">
                {row.original.applicationId}
              </p>
            </div>
          </div>
        ),
      },
      { accessorKey: "location", header: "Location" },
      {
        id: "registration",
        header: "Registration date",
        accessorFn: (d) => d.registrationDate,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {fmtDate(row.original.registrationDate)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "lastQuote",
        header: "Last quote",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.lastQuoteDate ? (
            <span className="text-muted-foreground">
              {fmtDate(row.original.lastQuoteDate)}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs italic">
              No quotes yet
            </span>
          ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="View distributor"
              onClick={(e) => e.stopPropagation()}
            >
              <Link href={`/distributors/${row.original.id}`}>
                <Eye className="size-4" />
              </Link>
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="bg-brand/5 border-brand/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
          <p className="text-sm font-medium">{selectedIds.length} selected</p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => bulkSetStatus("active")}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Activate
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => bulkSetStatus("rejected")}
            >
              Reject
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setRowSelection({})}>
              <X className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={distributors}
        getRowId={(d) => d.id}
        enableSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sorting={sorting}
        onSortingChange={setSorting}
        onRowClick={(d) => router.push(`/distributors/${d.id}`)}
        emptyState={
          <EmptyState
            icon={Network}
            title="No distributors found"
            description="Try adjusting the status, region, or search filters."
            className="border-0 py-12"
          />
        }
      />

      <TablePagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
