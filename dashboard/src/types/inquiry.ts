export type InquiryStatus = "new" | "contacted" | "awaiting" | "closed";
export type CustomerType = "individual" | "business";
export type InquiryBadge = "high_value" | "urgent" | "new_seller";

export interface QuoteLineItem {
  id: string;
  productName: string;
  model: string;
  imageUrl: string | null;
  attributes: string[];
  quantity: number;
  unitPrice: number;
}

export interface Inquiry {
  id: string;
  customerName: string;
  customerType: CustomerType;
  phone: string;
  email: string;
  location: string;
  status: InquiryStatus;
  badges: InquiryBadge[];
  items: QuoteLineItem[];
  deliveryFee: number;
  taxRate: number; // percentage
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const BADGE_LABELS: Record<InquiryBadge, string> = {
  high_value: "High Value",
  urgent: "Urgent",
  new_seller: "New Seller",
};

export function lineSubtotal(item: Pick<QuoteLineItem, "quantity" | "unitPrice">): number {
  return item.quantity * item.unitPrice;
}

export function inquirySubtotal(inquiry: Pick<Inquiry, "items">): number {
  return inquiry.items.reduce((sum, i) => sum + lineSubtotal(i), 0);
}

export function inquiryTotal(
  inquiry: Pick<Inquiry, "items" | "deliveryFee" | "taxRate">,
): number {
  const subtotal = inquirySubtotal(inquiry);
  const tax = (subtotal * inquiry.taxRate) / 100;
  return subtotal + tax + inquiry.deliveryFee;
}

export interface InquiryStatusCounts {
  all: number;
  new: number;
  contacted: number;
  awaiting: number;
  closed: number;
}

export interface InquiryListResult {
  data: Inquiry[];
  total: number;
  page: number;
  pageSize: number;
  counts: InquiryStatusCounts;
}
