"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Package, PencilRuler, X } from "lucide-react";
import {
  type ColumnDef,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/dashboard/data-table";
import { ProductRowActions } from "@/components/dashboard/product-row-actions";
import { TablePagination } from "@/components/dashboard/table-pagination";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Product, totalStock } from "@/types/product";
import { formatNumber } from "@/lib/format";

interface ProductTableProps {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

function ProductCell({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={40}
          height={40}
          unoptimized
          className="size-10 shrink-0 rounded-md object-cover"
        />
      ) : (
        <span className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md">
          <Package className="size-4" />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate font-medium">{product.name}</p>
        <p className="text-muted-foreground text-xs">Model: {product.model}</p>
      </div>
    </div>
  );
}

function VariantsCell({ product }: { product: Product }) {
  const first = product.variants[0];
  const extra = product.variants.length - 1;
  if (!first) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className="flex flex-wrap items-center gap-1">
      {first.attributes.slice(0, 2).map((a) => (
        <Badge key={a} variant="secondary" className="font-normal">
          {a}
        </Badge>
      ))}
      {extra > 0 && (
        <span className="text-muted-foreground text-xs">+{extra} more</span>
      )}
    </div>
  );
}

function VariantSubRow({ product }: { product: Product }) {
  return (
    <div className="py-2">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted-foreground text-xs uppercase">
            <th className="py-1.5 pr-4 text-left font-medium">Variant name</th>
            <th className="py-1.5 pr-4 text-left font-medium">SKU</th>
            <th className="py-1.5 pr-4 text-left font-medium">Stock</th>
            <th className="py-1.5 text-left font-medium">Unit price</th>
          </tr>
        </thead>
        <tbody>
          {product.variants.map((v) => (
            <tr key={v.id} className="border-border/60 border-t">
              <td className="py-2 pr-4 font-medium">{v.name}</td>
              <td className="text-muted-foreground py-2 pr-4">{v.sku}</td>
              <td className="py-2 pr-4 tabular-nums">{formatNumber(v.stock)}</td>
              <td className="py-2 tabular-nums">{formatNumber(v.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProductTable({
  products,
  total,
  page,
  pageSize,
}: ProductTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        id: "product",
        header: "Product",
        accessorFn: (p) => p.name,
        cell: ({ row }) => <ProductCell product={row.original} />,
      },
      { accessorKey: "category", header: "Category" },
      {
        id: "variants",
        header: "Variants",
        enableSorting: false,
        cell: ({ row }) => <VariantsCell product={row.original} />,
      },
      {
        id: "stock",
        header: "Stock",
        accessorFn: (p) => totalStock(p),
        cell: ({ row }) => (
          <span className="tabular-nums">
            {formatNumber(totalStock(row.original))}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      { accessorKey: "subcategory", header: "Subcategory" },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="View product"
            >
              <Link href={`/products/${row.original.id}/edit`}>
                <Eye className="size-4" />
              </Link>
            </Button>
            <ProductRowActions product={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="bg-brand/5 border-brand/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
          <p className="text-sm font-medium">
            {selectedIds.length} product{selectedIds.length > 1 ? "s" : ""} selected
          </p>
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={`/products/bulk-edit?ids=${selectedIds.join(",")}`}>
                <PencilRuler className="size-4" />
                Bulk edit inventory
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
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
        data={products}
        getRowId={(p) => p.id}
        enableSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sorting={sorting}
        onSortingChange={setSorting}
        renderSubRow={(p) => <VariantSubRow product={p} />}
        emptyState={
          <EmptyState
            icon={Package}
            title="No products found"
            description="Try adjusting your filters, or add your first product."
            className="border-0 py-12"
            action={
              <Button asChild>
                <Link href="/products/new">Add product</Link>
              </Button>
            }
          />
        }
      />

      <TablePagination page={page} pageSize={pageSize} total={total} />
    </div>
  );
}
