"use client";

import { Fragment, type ReactNode } from "react";
import {
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId: (row: TData) => string;
  enableSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** When provided, each row becomes expandable and this renders its detail. */
  renderSubRow?: (row: TData) => ReactNode;
  /** Makes rows clickable (interactive controls in cells should stopPropagation). */
  onRowClick?: (row: TData) => void;
  /** Shown when `data` is empty. */
  emptyState?: ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  enableSelection = false,
  rowSelection = {},
  onRowSelectionChange,
  sorting,
  onSortingChange,
  renderSubRow,
  onRowClick,
  emptyState,
}: DataTableProps<TData>) {
  const expandable = Boolean(renderSubRow);

  const allColumns: ColumnDef<TData, unknown>[] = [
    ...(enableSelection
      ? [
          {
            id: "__select",
            header: ({ table }) => (
              <Checkbox
                checked={
                  table.getIsAllRowsSelected()
                    ? true
                    : table.getIsSomeRowsSelected()
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={(v) => table.toggleAllRowsSelected(!!v)}
                aria-label="Select all rows"
              />
            ),
            cell: ({ row }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
                aria-label="Select row"
                onClick={(e) => e.stopPropagation()}
              />
            ),
            enableSorting: false,
            size: 36,
          } satisfies ColumnDef<TData, unknown>,
        ]
      : []),
    ...(expandable
      ? [
          {
            id: "__expander",
            header: () => null,
            cell: ({ row }) =>
              row.getCanExpand() ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    row.toggleExpanded();
                  }}
                  aria-label={row.getIsExpanded() ? "Collapse" : "Expand"}
                >
                  {row.getIsExpanded() ? (
                    <ChevronDown className="size-4" />
                  ) : (
                    <ChevronRight className="size-4" />
                  )}
                </Button>
              ) : null,
            enableSorting: false,
            size: 36,
          } satisfies ColumnDef<TData, unknown>,
        ]
      : []),
    ...columns,
  ];

  // TanStack Table returns functions that the React Compiler can't memoize;
  // this is expected and safe here.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: allColumns,
    getRowId,
    state: { rowSelection, sorting },
    enableRowSelection: enableSelection,
    onRowSelectionChange,
    onSortingChange,
    getRowCanExpand: () => expandable,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="border-border overflow-x-auto rounded-lg border">
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-muted/40">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b">
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort();
                return (
                  <th
                    key={header.id}
                    className="text-muted-foreground h-11 px-3 text-left align-middle text-xs font-medium tracking-wide whitespace-nowrap uppercase"
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="hover:text-foreground inline-flex items-center gap-1"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        <ArrowUpDown className="size-3" />
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={allColumns.length} className="p-0">
                {emptyState ?? (
                  <p className="text-muted-foreground py-12 text-center text-sm">
                    No results found.
                  </p>
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <Fragment key={row.id}>
                <tr
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "border-b transition-colors",
                    row.getIsSelected() ? "bg-brand/5" : "hover:bg-muted/30",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 align-middle">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && renderSubRow && (
                  <tr className="bg-muted/20 border-b">
                    <td colSpan={allColumns.length} className="px-3 py-0">
                      {renderSubRow(row.original)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
