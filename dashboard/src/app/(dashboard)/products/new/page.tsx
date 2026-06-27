import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";
import { getCategories } from "@/lib/data/products";

export const metadata: Metadata = { title: "Add product" };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/products">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        </Button>
        <PageHeader
          title="Add product"
          description="Create a new catalog product with variants and specifications."
        />
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
