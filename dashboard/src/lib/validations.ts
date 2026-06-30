import { z } from "zod";

/* ────────────────────────────── Auth ────────────────────────────── */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Shape returned by the Fanisi backend's POST /auth/login:
 *   { accessToken, user: { id, name?, email?, phone?, roleSlug } }
 * Note it's `roleSlug` (lowercase) not `role`; mapped via roleFromSlug().
 * email is optional because accounts can sign in by phone.
 */
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({
    id: z.string().min(1),
    name: z.string().nullish(),
    email: z.string().email().nullish(),
    phone: z.string().nullish(),
    roleSlug: z.string().min(1),
  }),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

/* ──────────────────────────── Shared ─────────────────────────────── */

/** Standard list query for any paginated backend resource. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().trim().max(200).optional(),
  sort: z.string().max(50).optional(),
});
export type PaginationInput = z.infer<typeof paginationSchema>;

/** Envelope the backend wraps list responses in. */
export function paginatedSchema<T extends z.ZodTypeAny>(item: T) {
  return z.object({
    data: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });
}

/* ──────────────────────────── Dashboard ──────────────────────────── */

export const kpiStatSchema = z.object({
  key: z.enum(["revenue", "distributors", "inventory", "inquiries"]),
  label: z.string(),
  value: z.string(),
  hint: z.string().optional(),
  hintTrend: z.enum(["up", "down", "neutral"]).optional(),
});

export const quoteOrdersChartSchema = z.object({
  points: z.array(
    z.object({
      week: z.string(),
      quotes: z.number().nonnegative(),
      orders: z.number().nonnegative(),
    }),
  ),
  totalQuotes: z.number().nonnegative(),
  totalOrders: z.number().nonnegative(),
  conversionRate: z.number().min(0).max(100),
});

export const activityItemSchema = z.object({
  id: z.string(),
  kind: z.enum([
    "distributor",
    "quote",
    "stock",
    "verification",
    "inquiry",
    "system",
  ]),
  message: z.string(),
  createdAt: z.string(),
});

export const actionItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  count: z.number().int().nonnegative(),
  severity: z.enum(["danger", "warning", "info"]),
  href: z.string(),
});

export const dashboardOverviewSchema = z.object({
  kpis: z.array(kpiStatSchema),
  chart: quoteOrdersChartSchema,
  activity: z.array(activityItemSchema),
  actions: z.array(actionItemSchema),
});

/* ──────────────────────────── Products ───────────────────────────── */

export const PRODUCT_STATUSES = ["draft", "published", "archived"] as const;

export const variantInputSchema = z.object({
  name: z.string().trim().min(1, "Variant name is required").max(120),
  sku: z.string().trim().min(1, "SKU is required").max(60),
  stock: z.coerce.number().int().nonnegative("Stock can't be negative"),
  price: z.coerce.number().nonnegative("Price can't be negative"),
  attributes: z.array(z.string().trim().min(1)).default([]),
});

export const highlightInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(500).default(""),
});

export const specInputSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(80),
  value: z.string().trim().min(1, "Value is required").max(200),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200),
  model: z.string().trim().min(1, "Model is required").max(80),
  category: z.string().trim().min(1, "Category is required"),
  subcategory: z.string().trim().min(1, "Subcategory is required"),
  status: z.enum(PRODUCT_STATUSES).default("draft"),
  // Manual availability toggle (not inventory): true = in stock.
  inStock: z.boolean().default(true),
  description: z.string().trim().max(4000).default(""),
  imageUrl: z.string().url().nullish(),
  variants: z
    .array(variantInputSchema)
    .min(1, "Add at least one variant"),
  highlights: z.array(highlightInputSchema).default([]),
  specifications: z.array(specInputSchema).default([]),
});
export type ProductInput = z.infer<typeof productInputSchema>;

export const productListQuerySchema = paginationSchema.extend({
  category: z.string().trim().optional(),
  subcategory: z.string().trim().optional(),
  status: z.enum(PRODUCT_STATUSES).optional(),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const bulkInventorySchema = z.object({
  updates: z
    .array(
      z.object({
        variantId: z.string().min(1),
        newStock: z.coerce.number().int().nonnegative(),
      }),
    )
    .min(1, "No changes to apply"),
});
export type BulkInventoryInput = z.infer<typeof bulkInventorySchema>;

/* ─────────────────────────── Inquiries ───────────────────────────── */

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "awaiting",
  "closed",
] as const;

export const INQUIRY_BADGES = ["high_value", "urgent", "new_seller"] as const;

export const inquiryListQuerySchema = paginationSchema.extend({
  status: z.enum(INQUIRY_STATUSES).optional(),
});
export type InquiryListQuery = z.infer<typeof inquiryListQuerySchema>;

export const quoteUpdateSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.coerce.number().int().nonnegative(),
        unitPrice: z.coerce.number().nonnegative(),
      }),
    )
    .min(1, "A quote needs at least one line item"),
  deliveryFee: z.coerce.number().nonnegative().default(0),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  notes: z.string().trim().max(2000).default(""),
});
export type QuoteUpdateInput = z.infer<typeof quoteUpdateSchema>;

/* ────────────────────────── Distributors ─────────────────────────── */

export const DISTRIBUTOR_STATUSES = [
  "active",
  "pending",
  "under_review",
  "rejected",
] as const;

export const distributorListQuerySchema = paginationSchema.extend({
  status: z.enum(DISTRIBUTOR_STATUSES).optional(),
  region: z.string().trim().optional(),
});
export type DistributorListQuery = z.infer<typeof distributorListQuerySchema>;

export const applicationDecisionSchema = z.object({
  decision: z.enum(["approve", "reject", "request_info"]),
  message: z.string().trim().max(1000).optional(),
});
export type ApplicationDecisionInput = z.infer<typeof applicationDecisionSchema>;

/* ──────────────────────────── Articles ───────────────────────────── */

export const ARTICLE_STATUSES = ["draft", "published", "scheduled"] as const;

export const articleInputSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    excerpt: z.string().trim().max(400).default(""),
    body: z.string().trim().min(1, "Article body can't be empty"),
    coverImageUrl: z.string().url("Enter a valid URL").nullish(),
    author: z.string().trim().min(1, "Author is required").max(120),
    categories: z.array(z.string().trim().min(1)).default([]),
    status: z.enum(ARTICLE_STATUSES).default("draft"),
    visibility: z.enum(["public", "private"]).default("public"),
    scheduledFor: z.string().datetime().nullish(),
  })
  .refine(
    (v) => v.status !== "scheduled" || Boolean(v.scheduledFor),
    { message: "Pick a publish date for scheduled articles", path: ["scheduledFor"] },
  );
export type ArticleInput = z.infer<typeof articleInputSchema>;

export const articleListQuerySchema = paginationSchema.extend({
  status: z.enum(ARTICLE_STATUSES).optional(),
});
export type ArticleListQuery = z.infer<typeof articleListQuerySchema>;

/* ──────────────────────────── Landing ────────────────────────────── */

export const landingConfigSchema = z.object({
  heroSlides: z
    .array(
      z.object({
        heading: z.string().trim().min(1, "Heading is required").max(160),
        subheading: z.string().trim().max(300).default(""),
        ctaText: z.string().trim().max(60).default(""),
        ctaHref: z.string().trim().max(300).default(""),
        imageUrl: z.string().url().nullish(),
      }),
    )
    .max(8, "Up to 8 slides"),
  brandTagline: z.string().trim().max(160).default(""),
  featuredCategories: z.array(z.string().trim().min(1)).default([]),
  lifestyleBlocks: z
    .array(
      z.object({
        heading: z.string().trim().min(1, "Heading is required").max(160),
        subheading: z.string().trim().max(300).default(""),
        ctaText: z.string().trim().max(60).default(""),
        imageUrl: z.string().url().nullish(),
      }),
    )
    .max(6, "Up to 6 blocks"),
});
export type LandingConfigInput = z.infer<typeof landingConfigSchema>;
