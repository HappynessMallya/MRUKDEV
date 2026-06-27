"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bulkUpdateInventory } from "@/lib/actions/products";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BulkInventoryRow {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  sku: string;
  currentStock: number;
  category: string;
}

export function BulkInventoryTable({ rows }: { rows: BulkInventoryRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Map of variantId -> adjustment delta.
  const [deltas, setDeltas] = useState<Record<string, number>>({});

  const newStockOf = (r: BulkInventoryRow) =>
    Math.max(0, r.currentStock + (deltas[r.variantId] ?? 0));

  const changes = useMemo(
    () =>
      rows
        .filter((r) => newStockOf(r) !== r.currentStock)
        .map((r) => ({ variantId: r.variantId, newStock: newStockOf(r) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rows, deltas],
  );

  function adjust(variantId: string, by: number) {
    setDeltas((prev) => ({ ...prev, [variantId]: (prev[variantId] ?? 0) + by }));
  }

  function setDelta(variantId: string, value: number) {
    setDeltas((prev) => ({ ...prev, [variantId]: value }));
  }

  function apply() {
    if (changes.length === 0) return;
    startTransition(async () => {
      const result = await bulkUpdateInventory({ updates: changes });
      if (result.ok) {
        toast.success(
          `Updated stock for ${formatNumber(result.data.changed)} variant${
            result.data.changed === 1 ? "" : "s"
          }.`,
        );
        router.push("/products");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="bg-foreground text-background flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
        <p className="text-sm font-medium">
          {rows.length} variant{rows.length === 1 ? "" : "s"} selected
          {changes.length > 0 && (
            <span className="text-background/70">
              {" "}
              · {changes.length} pending change{changes.length === 1 ? "" : "s"}
            </span>
          )}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={apply}
          disabled={isPending || changes.length === 0}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Applying…
            </>
          ) : (
            "Apply Change"
          )}
        </Button>
      </div>

      <div className="border-border overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase">
            <tr className="border-b">
              <th className="px-4 py-3 text-left font-medium">Product / Variant</th>
              <th className="px-4 py-3 text-left font-medium">Current stock</th>
              <th className="px-4 py-3 text-left font-medium">Adjustment</th>
              <th className="px-4 py-3 text-left font-medium">New stock</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const next = newStockOf(r);
              const diff = next - r.currentStock;
              return (
                <tr key={r.variantId} className="border-b">
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.productName}</p>
                    <p className="text-muted-foreground text-xs">
                      {r.variantName} · SKU: {r.sku}
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatNumber(r.currentStock)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => adjust(r.variantId, -1)}
                        aria-label="Decrease"
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <Input
                        type="number"
                        value={deltas[r.variantId] ?? 0}
                        onChange={(e) =>
                          setDelta(r.variantId, Number(e.target.value) || 0)
                        }
                        className="h-8 w-16 text-center tabular-nums"
                        aria-label={`Adjustment for ${r.sku}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => adjust(r.variantId, 1)}
                        aria-label="Increase"
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium tabular-nums">
                      {formatNumber(next)}
                    </span>
                    <span
                      className={cn(
                        "ml-2 text-xs",
                        diff === 0
                          ? "text-muted-foreground"
                          : diff > 0
                            ? "text-success"
                            : "text-destructive",
                      )}
                    >
                      {diff === 0
                        ? "No change"
                        : diff > 0
                          ? `+${diff}`
                          : diff}
                    </span>
                  </td>
                  <td className="text-muted-foreground px-4 py-3">{r.category}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
