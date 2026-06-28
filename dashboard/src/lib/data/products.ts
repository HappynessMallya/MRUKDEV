import "server-only";
import type {
  Category,
  Product,
  ProductListResult,
  ProductStatus,
} from "@/types/product";
import type {
  BulkInventoryInput,
  ProductInput,
  ProductListQuery,
} from "@/lib/validations";
import { ApiError, apiFetch } from "@/lib/api/client";
import {
  findLeafCategoryId,
  mapBackendCategories,
  mapBackendList,
  mapBackendProduct,
  productInputToPayload,
  type BackendCategory,
  type BackendListEnvelope,
  type BackendProduct,
} from "@/lib/api/products-map";

/**
 * In-memory mock store. Persists for the life of the server process (fine for
 * dev). Replace each function body with `apiFetch(...)` once the backend exists.
 */

export const CATEGORIES: Category[] = [
  {
    name: "Home Appliances",
    subcategories: ["Refrigerator", "Microwave", "Washing Machine", "Television"],
  },
  {
    name: "Kitchen Appliances",
    subcategories: ["Oven", "Blender", "Cooker", "Microwave"],
  },
  {
    name: "Agricultural Appliances",
    subcategories: ["Irrigation", "Processing", "Storage"],
  },
];

const now = () => new Date().toISOString();

function seed(): Product[] {
  const base: Omit<Product, "createdAt" | "updatedAt">[] = [
    {
      id: "p-1001",
      name: "mrUK Crystal 4K Smart TV",
      model: "CR-9000XT",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Television",
      status: "published",
      description: "Crystal-clear 4K UHD smart television with HDR.",
      variants: [
        { id: "v-1", name: '55" Crystal OLED - Silver Edition', sku: "UK-TV-55-SIL", stock: 45, price: 250000, attributes: ['55"', "Silver"] },
        { id: "v-2", name: '65" Crystal OLED - Stealth Black', sku: "UK-TV-65-BLK", stock: 97, price: 320000, attributes: ['65"', "Black"] },
      ],
      highlights: [{ title: "4K HDR", description: "Vivid high-dynamic-range picture." }],
      specifications: [{ label: "Resolution", value: "3840 x 2160" }],
    },
    {
      id: "p-1002",
      name: "AquaStream ProX9 Washing machine",
      model: "AS-PRO-X19",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Washing Machine",
      status: "published",
      description: "Front-load washer with eco wash cycles.",
      variants: [
        { id: "v-3", name: "Standard Edition - Titanium", sku: "AS-PRO-TIT", stock: 8, price: 540000, attributes: ["Titanium"] },
      ],
      highlights: [],
      specifications: [{ label: "Capacity", value: "9 kg" }],
    },
    {
      id: "p-1003",
      name: "mrUK Cinema OLED",
      model: "CIN-OLE-66",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Television",
      status: "draft",
      description: "Cinematic OLED panel for home theatre.",
      variants: [
        { id: "v-4", name: '66" Matte Black', sku: "CIN-66-MAT", stock: 12, price: 410000, attributes: ['66"', "Matte Black"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1004",
      name: "Onyx Series Refrigerator",
      model: "ONX-REF-350",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Refrigerator",
      status: "published",
      description: "Double-door frost-free refrigerator.",
      variants: [
        { id: "v-5", name: "350L - Onyx Black", sku: "ONX-350-BLK", stock: 3, price: 1250000, attributes: ["350L", "Black"] },
        { id: "v-6", name: "350L - Polar White", sku: "ONX-350-WHT", stock: 0, price: 1250000, attributes: ["350L", "White"] },
      ],
      highlights: [{ title: "Frost-Free", description: "No manual defrosting." }],
      specifications: [{ label: "Capacity", value: "350 L" }],
    },
    {
      id: "p-1005",
      name: "MRUK Smart Oven",
      model: "SKW-OVN-990",
      imageUrl: null,
      category: "Kitchen Appliances",
      subcategory: "Oven",
      status: "published",
      description: "Convection smart oven with presets.",
      variants: [
        { id: "v-7", name: "60L - Inox", sku: "SKW-OVN-60", stock: 34, price: 480000, attributes: ["60L"] },
      ],
      highlights: [],
      specifications: [{ label: "Capacity", value: "60 L" }],
    },
    {
      id: "p-1006",
      name: "TurboBlend 900",
      model: "TB-900",
      imageUrl: null,
      category: "Kitchen Appliances",
      subcategory: "Blender",
      status: "draft",
      description: "High-power countertop blender.",
      variants: [
        { id: "v-8", name: "1.5L Glass Jar", sku: "TB-900-GLS", stock: 60, price: 145000, attributes: ["1.5L"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1007",
      name: "Harvest Pro Solar Pump",
      model: "HP-SP-200",
      imageUrl: null,
      category: "Agricultural Appliances",
      subcategory: "Irrigation",
      status: "published",
      description: "Solar-powered irrigation pump.",
      variants: [
        { id: "v-9", name: "2HP - Standard", sku: "HP-SP-2HP", stock: 18, price: 980000, attributes: ["2HP"] },
      ],
      highlights: [],
      specifications: [{ label: "Power", value: "2 HP" }],
    },
    {
      id: "p-1008",
      name: "Mwanza Grain Mill",
      model: "MG-MILL-50",
      imageUrl: null,
      category: "Agricultural Appliances",
      subcategory: "Processing",
      status: "archived",
      description: "Diesel grain milling machine.",
      variants: [
        { id: "v-10", name: "50 kg/hr", sku: "MG-MILL-50A", stock: 5, price: 2200000, attributes: ["50kg/hr"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1009",
      name: "MRUK Microwave 25L",
      model: "SKW-MW-25",
      imageUrl: null,
      category: "Kitchen Appliances",
      subcategory: "Microwave",
      status: "published",
      description: "Compact 25L microwave with grill.",
      variants: [
        { id: "v-11", name: "25L - Silver", sku: "SKW-MW-25S", stock: 41, price: 350000, attributes: ["25L", "Silver"] },
      ],
      highlights: [],
      specifications: [{ label: "Capacity", value: "25 L" }],
    },
    {
      id: "p-1010",
      name: "MRUK Soundbar S500",
      model: "SKW-SB-500",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Television",
      status: "draft",
      description: "2.1 channel soundbar with subwoofer.",
      variants: [
        { id: "v-12", name: "S500 - Black", sku: "SKW-SB-500B", stock: 22, price: 420000, attributes: ["Black"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1011",
      name: "FreshKeep Chest Freezer",
      model: "FK-CF-300",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Refrigerator",
      status: "published",
      description: "300L chest freezer for bulk storage.",
      variants: [
        { id: "v-13", name: "300L - White", sku: "FK-CF-300W", stock: 14, price: 890000, attributes: ["300L", "White"] },
      ],
      highlights: [],
      specifications: [{ label: "Capacity", value: "300 L" }],
    },
    {
      id: "p-1012",
      name: "ChefMaster Gas Cooker",
      model: "CM-GC-4B",
      imageUrl: null,
      category: "Kitchen Appliances",
      subcategory: "Cooker",
      status: "published",
      description: "4-burner gas cooker with oven.",
      variants: [
        { id: "v-14", name: "4 Burner - Steel", sku: "CM-GC-4BS", stock: 27, price: 610000, attributes: ["4 Burner"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1013",
      name: "AgriDry Crop Dryer",
      model: "AD-CD-100",
      imageUrl: null,
      category: "Agricultural Appliances",
      subcategory: "Storage",
      status: "draft",
      description: "Solar crop drying unit.",
      variants: [
        { id: "v-15", name: "100 kg Batch", sku: "AD-CD-100A", stock: 9, price: 1750000, attributes: ["100kg"] },
      ],
      highlights: [],
      specifications: [],
    },
    {
      id: "p-1014",
      name: "PureCool Split AC",
      model: "PC-AC-18",
      imageUrl: null,
      category: "Home Appliances",
      subcategory: "Refrigerator",
      status: "published",
      description: "Inverter split air conditioner.",
      variants: [
        { id: "v-16", name: "18000 BTU", sku: "PC-AC-18K", stock: 31, price: 1150000, attributes: ["18000 BTU"] },
      ],
      highlights: [],
      specifications: [{ label: "Cooling", value: "18000 BTU" }],
    },
  ];

  const stamp = now();
  return base.map((p) => ({ ...p, createdAt: stamp, updatedAt: stamp }));
}

const store: { products: Product[] } = { products: seed() };

/* ──────────────────────────── Reads ──────────────────────────────── */

// Reads now come from the live Fanisi catalog. Product reads are PUBLIC (only
// the tenant header is needed — apiFetch adds it), so they work without a
// backend token even under the dev auth bypass. Writes below still use the mock
// store until the create/update path is mapped to CreateProductDto.

export async function getCategories(): Promise<Category[]> {
  try {
    const tree = (await apiFetch("/categories", {
      authenticated: false,
      next: { revalidate: 300 },
    })) as BackendCategory[];
    return mapBackendCategories(tree);
  } catch {
    return CATEGORIES; // fallback to mock if the API is unreachable
  }
}

export async function getProducts(
  query: ProductListQuery,
): Promise<ProductListResult> {
  const env = (await apiFetch("/products", {
    authenticated: false,
    query: {
      page: query.page,
      limit: query.pageSize,
      search: query.search,
      // dashboard "published" filter → backend isPublished; draft → false.
      isPublished:
        query.status === "published"
          ? true
          : query.status === "draft"
            ? false
            : undefined,
    },
    next: { revalidate: 30 },
  })) as BackendListEnvelope;
  return mapBackendList(env);
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const p = (await apiFetch(`/products/${id}`, {
      authenticated: false,
      next: { revalidate: 30 },
    })) as BackendProduct;
    return mapBackendProduct(p);
  } catch {
    return null;
  }
}

/* ─────────────── Backend writes (require a real admin token) ─────────────── */
// These hit the admin write path on the live backend. They need a valid backend
// JWT, so they work only after a REAL admin login (admin@mruk.com) — the dev
// bypass token is rejected by the backend with 401.

async function resolveCategoryId(
  category: string,
  subcategory: string,
): Promise<string> {
  const tree = (await apiFetch("/categories", {
    authenticated: false,
  })) as BackendCategory[];
  const id = findLeafCategoryId(tree, category, subcategory);
  if (!id) {
    throw new ApiError(400, `Unknown category "${category} / ${subcategory}".`);
  }
  return id;
}

export async function createProductOnApi(
  input: ProductInput,
): Promise<{ id: string }> {
  const categoryId = await resolveCategoryId(input.category, input.subcategory);
  const payload = productInputToPayload(input, categoryId, true);
  const created = (await apiFetch("/products", {
    method: "POST",
    body: payload,
  })) as { id: string };
  return { id: created.id };
}

export async function updateProductOnApi(
  id: string,
  input: ProductInput,
): Promise<void> {
  const categoryId = await resolveCategoryId(input.category, input.subcategory);
  const payload = productInputToPayload(input, categoryId, false);
  await apiFetch(`/products/${id}`, { method: "PATCH", body: payload });
}

export async function deleteProductOnApi(id: string): Promise<void> {
  await apiFetch(`/products/${id}`, { method: "DELETE" });
}

export async function setStatusOnApi(
  id: string,
  status: ProductStatus,
): Promise<void> {
  await apiFetch(`/products/${id}`, {
    method: "PATCH",
    body: { isPublished: status === "published" },
  });
}

/* ─────────────────────────── Mutations (mock) ───────────────────────────── */
// Legacy in-memory writes — superseded by the *OnApi functions above. Kept for
// reference/offline dev only.

function toVariants(input: ProductInput["variants"]): Product["variants"] {
  return input.map((v, i) => ({
    id: `v-${crypto.randomUUID().slice(0, 8)}-${i}`,
    name: v.name,
    sku: v.sku,
    stock: v.stock,
    price: v.price,
    attributes: v.attributes,
  }));
}

export function createProductRecord(input: ProductInput): Product {
  const stamp = now();
  const product: Product = {
    id: `p-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    model: input.model,
    imageUrl: input.imageUrl ?? null,
    category: input.category,
    subcategory: input.subcategory,
    status: input.status,
    description: input.description,
    variants: toVariants(input.variants),
    highlights: input.highlights,
    specifications: input.specifications,
    createdAt: stamp,
    updatedAt: stamp,
  };
  store.products = [product, ...store.products];
  return product;
}

export function updateProductRecord(
  id: string,
  input: ProductInput,
): Product | null {
  const idx = store.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const existing = store.products[idx];
  const updated: Product = {
    ...existing,
    name: input.name,
    model: input.model,
    imageUrl: input.imageUrl ?? null,
    category: input.category,
    subcategory: input.subcategory,
    status: input.status,
    description: input.description,
    variants: toVariants(input.variants),
    highlights: input.highlights,
    specifications: input.specifications,
    updatedAt: now(),
  };
  store.products[idx] = updated;
  return updated;
}

export function setProductStatus(
  id: string,
  status: ProductStatus,
): Product | null {
  const product = store.products.find((p) => p.id === id);
  if (!product) return null;
  product.status = status;
  product.updatedAt = now();
  return product;
}

export function deleteProductRecord(id: string): boolean {
  const before = store.products.length;
  store.products = store.products.filter((p) => p.id !== id);
  return store.products.length < before;
}

export function applyBulkInventory(input: BulkInventoryInput): number {
  let changed = 0;
  for (const { variantId, newStock } of input.updates) {
    for (const product of store.products) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (variant && variant.stock !== newStock) {
        variant.stock = newStock;
        product.updatedAt = now();
        changed += 1;
      }
    }
  }
  return changed;
}
