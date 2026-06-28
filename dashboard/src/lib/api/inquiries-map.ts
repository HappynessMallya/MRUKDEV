import "server-only";

// Maps the Fanisi backend Inquiry (a lead-capture record) onto the dashboard's
// quote-builder view model (src/types/inquiry.ts).
//
// IMPORTANT mismatch: the dashboard inquiry models a full quotation —
// per-line unit prices, tax, delivery, badges. The backend inquiry has NONE of
// those; pricing/quoting lives in the separate PROFORMA flow. So on read we
// surface contact + items + status only (prices default to 0, badges empty),
// and the quote-builder write path is intentionally NOT wired here.

import { z } from "zod";
import type { Inquiry, InquiryStatus } from "@/types/inquiry";

export const backendInquirySchema = z.object({
  id: z.string(),
  inquiryNumber: z.string().nullish(),
  status: z.string().nullish(),
  source: z.string().nullish(),
  contactName: z.string().nullish(),
  contactEmail: z.string().nullish(),
  contactPhone: z.string().nullish(),
  company: z.string().nullish(),
  message: z.string().nullish(),
  internalNotes: z.string().nullish(),
  items: z
    .array(
      z.object({
        productId: z.string().nullish(),
        productName: z.string().nullish(),
        sku: z.string().nullish(),
        quantity: z.number().nullish(),
        notes: z.string().nullish(),
      }),
    )
    .nullish(),
  createdAt: z.string().nullish(),
  updatedAt: z.string().nullish(),
});

export type BackendInquiry = z.infer<typeof backendInquirySchema>;

export const inquiryListSchema = z.object({
  data: z.array(backendInquirySchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

// backend lifecycle (open|in_review|quoted|closed|cancelled) → UI buckets.
export function toUiStatus(s: string | null | undefined): InquiryStatus {
  switch ((s ?? "").toLowerCase()) {
    case "in_review":
      return "contacted";
    case "quoted":
      return "awaiting";
    case "closed":
    case "cancelled":
      return "closed";
    default:
      return "new"; // "open" and anything unknown
  }
}

// UI status → backend status for PATCH /inquiries/:id.
export function toBackendStatus(
  ui: InquiryStatus,
): "open" | "in_review" | "quoted" | "closed" {
  switch (ui) {
    case "contacted":
      return "in_review";
    case "awaiting":
      return "quoted";
    case "closed":
      return "closed";
    default:
      return "open";
  }
}

export function mapInquiry(b: BackendInquiry): Inquiry {
  const stamp = b.createdAt ?? new Date(0).toISOString();
  return {
    // Display label prefers the human inquiry number; routing/PATCH still use id.
    id: b.id,
    customerName: b.contactName ?? b.company ?? "—",
    customerType: b.company ? "business" : "individual",
    phone: b.contactPhone ?? "—",
    email: b.contactEmail ?? "—",
    location: "—",
    status: toUiStatus(b.status),
    badges: [],
    items: (b.items ?? []).map((it, i) => ({
      id: it.productId ?? `li-${i}`,
      productName: it.productName ?? "—",
      model: it.sku ?? "",
      imageUrl: null,
      attributes: [],
      quantity: it.quantity ?? 1,
      // Backend has no pricing on inquiries (that's proformas).
      unitPrice: 0,
    })),
    deliveryFee: 0,
    taxRate: 0,
    // Surface the customer's message + any internal notes for context.
    notes: b.internalNotes ?? b.message ?? "",
    createdAt: stamp,
    updatedAt: b.updatedAt ?? stamp,
  };
}
