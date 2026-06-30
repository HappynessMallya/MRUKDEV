export type ProductStatus = "draft" | "published" | "archived";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  /** Free-form attribute chips shown in the list, e.g. "55\"", "Silver". */
  attributes: string[];
}

export interface SpecGroup {
  label: string;
  value: string;
}

export interface HighlightFeature {
  title: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  model: string;
  imageUrl: string | null;
  category: string;
  subcategory: string;
  status: ProductStatus;
  /** Manual availability toggle (not inventory): true = in stock. Defaults true. */
  inStock?: boolean;
  description: string;
  variants: ProductVariant[];
  highlights: HighlightFeature[];
  specifications: SpecGroup[];
  createdAt: string;
  updatedAt: string;
}

/** Total stock across a product's variants. */
export function totalStock(product: Pick<Product, "variants">): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0);
}

export interface Category {
  name: string;
  subcategories: string[];
}

export interface ProductListResult {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}
