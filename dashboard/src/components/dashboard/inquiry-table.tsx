"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquareText, Check, X, Loader2 } from "lucide-react";
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { InquiryBadges } from "@/components/dashboard/inquiry-badges";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { updateInquiryStatus } from "@/lib/actions/inquiries";
import { type Inquiry, inquiryTotal } from "@/types/inquiry";
import { formatMoney } from "@/lib/format";

interface InquiryTableProps {
  inquiries: Inquiry[];
  total: number;
  page: number;
  pageSize: number;
}

export function InquiryTable({
  inquiries,
  total,
  page,
  pageSize,
}: InquiryTableProps) {
  const router = useRouter();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  function bulkSetStatus(status: "contacted" | "closed") {
    startTransition(async () => {
      const results = await Promise.all(
        selectedIds.map((id) => updateInquiryStatus(id, status)),
      );
      const failed = results.filter((r) => !r.ok).length;
      if (failed === 0) {
        toast.success(`Marked ${selectedIds.length} as ${status}.`);
      } else {
        toast.error(`${failed} update(s) failed.`);
      }
      setRowSelection({});
      router.refresh();
    });
  }

  const columns = useMemo<ColumnDef<Inquiry, unknown>[]>(
    () => [
      {
        id: "inquiry",
        header: "Inquiry ID",
        accessorFn: (i) => i.id,
        cell: ({ row }) => (
          <div className="space-y-1">
            <span className="font-medium">{row.original.id}</span>
            <InquiryBadges badges={row.original.badges} />
          </div>
        ),
      },
      { accessorKey: "customerName", header: "Customer name" },
      {
        accessorKey: "phone",
        header: "Phone number",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-muted-foreground tabular-nums">
            {row.original.phone}
          </span>
        ),
      },
      { accessorKey: "location", header: "Location" },
      {
        id: "products",
        header: "Products",
        accessorFn: (i) => i.items.length,
        cell: ({ row }) => (
          <span className="tabular-nums">{row.original.items.length}</span>
        ),
      },
      {
        id: "total",
        header: "Total",
        accessorFn: (i) => inquiryTotal(i),
        cell: ({ row }) => (
          <span className="font-medium tabular-nums">
            {formatMoney(inquiryTotal(row.original))}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="bg-brand/5 border-brand/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
          <p className="text-sm font-medium">
            {selectedIds.length} selected
          </p>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => bulkSetStatus("contacted")}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Mark contacted
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => bulkSetStatus("closed")}
            >
              Mark closed
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setRowSelection({})}
            >
              <X className="size-4" />
              Clear
            </Button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        data={inquiries}
        getRowId={(i) => i.id}
        enableSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sorting={sorting}
        onSortingChange={setSorting}
        onRowClick={(i) => router.push(`/inquiries/${i.id}`)}
        emptyState={
          <EmptyState
            icon={MessageSquareText}
            title="No inquiries found"
            description="Inquiries from customers will appear here. Try adjusting the filters."
            className="border-0 py-12"
          />
        }
      />

      <TablePagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
