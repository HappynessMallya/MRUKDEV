import "server-only";

// Maps Fanisi backend product/category shapes onto the dashboard's flat view
// models (src/types/product.ts). The backend uses localized { en, sw } objects
// and a richer embedded structure; the dashboard tables/forms use plain strings.
// Read-only: this is for displaying the live catalog. Writes still go through
// the mock store until the create/update path is mapped to CreateProductDto.

import type {
  Category,
  Product,
  ProductListResult,
  ProductStatus,
} from "@/types/product";
import type { ProductInput } from "@/lib/validations";

interface Localized {
  en?: string;
  sw?: string;
}

interface BackendVariant {
  id?: string;
  title?: string;
  sku?: string;
  price?: number | null;
  stock?: number;
  options?: { name: string; value: string }[];
}

export interface BackendCategory {
  id: string;
  slug: string;
  name: Localized;
  parentId?: string | null;
  children?: BackendCategory[];
}

export interface BackendProduct {
  id: string;
  name: Localized;
  modelNumber?: string | null;
  description?: Localized | null;
  isPublished?: boolean;
  categoryId?: string;
  category?: BackendCategory;
  media?: { url: string; isPrimary?: boolean; sortOrder?: number; type?: string }[];
  variants?: BackendVariant[];
  highlights?: { text?: Localized }[];
  specs?: { name?: Localized; value: string }[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendListEnvelope {
  data: BackendProduct[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

function primaryImage(p: BackendProduct): string | null {
  const imgs = (p.media ?? []).filter(
    (m) => !m.type || m.type.toLowerCase().startsWith("image"),
  );
  const primary = imgs.find((m) => m.isPrimary) ?? imgs[0];
  return primary?.url ?? null;
}

function status(p: BackendProduct): ProductStatus {
  return p.isPublished ? "published" : "draft";
}

export function mapBackendProduct(p: BackendProduct): Product {
  return {
    id: p.id,
    name: p.name?.en ?? "",
    model: p.modelNumber ?? "",
    imageUrl: primaryImage(p),
    // The product attaches to its leaf category; the leaf name is the most
    // specific label we have on the payload.
    category: p.category?.name?.en ?? "",
    subcategory: "",
    status: status(p),
    description: p.description?.en ?? "",
    variants: (p.variants ?? []).map((v, i) => ({
      id: v.id ?? `v-${i}`,
      name: v.title ?? "Default",
      sku: v.sku ?? "",
      stock: v.stock ?? 0,
      price: v.price ?? 0,
      attributes: (v.options ?? []).map((o) => o.value),
    })),
    highlights: (p.highlights ?? []).map((h) => ({
      title: h.text?.en ?? "",
      description: "",
    })),
    specifications: (p.specs ?? []).map((s) => ({
      label: s.name?.en ?? "",
      value: s.value,
    })),
    createdAt: p.createdAt ?? "",
    updatedAt: p.updatedAt ?? "",
  };
}

export function mapBackendList(env: BackendListEnvelope): ProductListResult {
  return {
    data: env.data.map(mapBackendProduct),
    total: env.meta.total,
    page: env.meta.page,
    pageSize: env.meta.limit,
  };
}

// Backend /categories tree (roots + children) → dashboard Category[].
export function mapBackendCategories(tree: BackendCategory[]): Category[] {
  return tree.map((root) => ({
    name: root.name?.en ?? root.slug,
    subcategories: (root.children ?? []).map((c) => c.name?.en ?? c.slug),
  }));
}

// ── Write mapping: dashboard ProductInput → backend Create/Update payload ──────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Resolve the dashboard's (category name, subcategory name) to the backend LEAF
// category ObjectId products attach to. Falls back to the root id when there's
// no matching child (e.g. categories with no subcategories).
export function findLeafCategoryId(
  tree: BackendCategory[],
  category: string,
  subcategory: string,
): string | null {
  const root = tree.find((r) => (r.name?.en ?? r.slug) === category);
  if (!root) return null;
  const child = (root.children ?? []).find(
    (c) => (c.name?.en ?? c.slug) === subcategory,
  );
  return child?.id ?? root.id;
}

// Backend write payload (subset of CreateProductDto we can populate from the
// dashboard form). `includeSlugSku` is true on create (both are required &
// unique) and false on update (we don't churn the handle/sku on edits).
export function productInputToPayload(
  input: ProductInput,
  categoryId: string,
  includeSlugSku: boolean,
): Record<string, unknown> {
  const slug = slugify(input.name);
  const payload: Record<string, unknown> = {
    categoryId,
    name: { en: input.name, sw: input.name },
    modelNumber: input.model || undefined,
    description: input.description
      ? { en: input.description, sw: input.description }
      : undefined,
    isPublished: input.status === "published",
    currency: "TZS",
    media: input.imageUrl
      ? [{ url: input.imageUrl, type: "image", isPrimary: true, sortOrder: 0 }]
      : [],
    variants: input.variants.map((v, i) => ({
      title: v.name,
      sku: v.sku,
      price: v.price,
      stock: v.stock,
      options: v.attributes.map((value, j) => ({
        name: `Attribute ${j + 1}`,
        value,
      })),
      sortOrder: i,
    })),
    highlights: input.highlights.map((h, i) => ({
      text: { en: h.title, sw: h.title },
      sortOrder: i,
    })),
    specs: input.specifications.map((s, i) => ({
      name: { en: s.label, sw: s.label },
      value: s.value,
      sortOrder: i,
    })),
  };
  if (includeSlugSku) {
    payload.slug = slug;
    payload.sku = (input.model || slug).toUpperCase().slice(0, 60);
  }
  return payload;
}
