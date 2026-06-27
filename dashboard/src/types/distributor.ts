export type DistributorStatus =
  | "active"
  | "pending"
  | "under_review"
  | "rejected";

export type ChecklistStatus = "verified" | "in_progress" | "required";

export interface DistributorDocument {
  id: string;
  name: string;
  sizeLabel: string;
  uploadedAt: string;
}

export interface ChecklistItem {
  key: string;
  label: string;
  status: ChecklistStatus;
  note?: string;
}

export interface DistributorQuote {
  inquiryId: string;
  productCount: number;
  totalQuantity: number;
  customerType: "individual" | "business";
  status: string;
  date: string;
}

export interface Distributor {
  id: string;
  applicationId: string;
  name: string;
  location: string;
  region: string;
  phone: string;
  email: string;
  status: DistributorStatus;
  registrationDate: string;
  lastQuoteDate: string | null;
  documents: DistributorDocument[];
  checklist: ChecklistItem[];
  recentQuotes: DistributorQuote[];
}

/** A pending or under-review distributor is treated as an application. */
export function isApplication(d: Pick<Distributor, "status">): boolean {
  return d.status === "pending" || d.status === "under_review";
}

export interface DistributorStats {
  total: number;
  totalTrend: string;
  pendingApprovals: number;
  activeRegions: number;
}

export interface DistributorStatusCounts {
  all: number;
  active: number;
  pending: number;
  under_review: number;
  rejected: number;
}

export interface DistributorListResult {
  data: Distributor[];
  total: number;
  page: number;
  pageSize: number;
  counts: DistributorStatusCounts;
}
