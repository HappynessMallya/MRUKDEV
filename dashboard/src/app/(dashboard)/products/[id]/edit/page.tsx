import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/forms/product-form";
import { getCategories, getProduct } from "@/lib/data/products";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProduct(id),
    getCategories(),
  ]);

  if (!product) notFound();

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
          title="Edit product"
          description={`Update “${product.name}” — variants, stock, and details.`}
        />
      </div>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
