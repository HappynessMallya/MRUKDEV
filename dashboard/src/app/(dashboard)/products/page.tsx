import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductFilters } from "@/components/dashboard/product-filters";
import { ProductTable } from "@/components/dashboard/product-table";
import { getCategories, getProducts } from "@/lib/data/products";
import { productListQuerySchema } from "@/lib/validations";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = productListQuerySchema.parse({
    page: sp.page,
    search: sp.search,
    category: sp.category,
    subcategory: sp.subcategory,
    status: sp.status,
    pageSize: 10,
  });

  const [{ data, total, page, pageSize }, categories] = await Promise.all([
    getProducts(query),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage catalog, variants, inventory, and publication status."
        actions={
          <Button asChild>
            <Link href="/products/new">
              <Plus className="size-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <Card className="gap-5 p-5">
        <ProductFilters
          categories={categories}
          current={{
            search: query.search,
            category: query.category,
            subcategory: query.subcategory,
          }}
        />
        <ProductTable
          products={data}
          total={total}
          page={page}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
