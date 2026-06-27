import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Boxes } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BulkInventoryTable,
  type BulkInventoryRow,
} from "@/components/dashboard/bulk-inventory-table";
import { getProduct } from "@/lib/data/products";

export const metadata: Metadata = { title: "Bulk Edit Inventory" };

export default async function BulkEditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const idsParam = typeof sp.ids === "string" ? sp.ids : "";
  const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);

  const products = (await Promise.all(ids.map((id) => getProduct(id)))).filter(
    (p): p is NonNullable<typeof p> => p !== null,
  );

  const rows: BulkInventoryRow[] = products.flatMap((p) =>
    p.variants.map((v) => ({
      productId: p.id,
      productName: p.name,
      variantId: v.id,
      variantName: v.name,
      sku: v.sku,
      currentStock: v.stock,
      category: p.category,
    })),
  );

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/products">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        </Button>
        <PageHeader
          title="Bulk Edit Inventory"
          description="Review and adjust stock levels for multiple variants simultaneously."
        />
      </div>

      {rows.length === 0 ? (
        <Card className="p-5">
          <EmptyState
            icon={Boxes}
            title="No products selected"
            description="Select products from the list, then choose “Bulk edit inventory”."
            className="border-0 py-12"
            action={
              <Button asChild>
                <Link href="/products">Go to products</Link>
              </Button>
            }
          />
        </Card>
      ) : (
        <BulkInventoryTable rows={rows} />
      )}
    </div>
  );
}
