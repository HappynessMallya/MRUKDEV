import "server-only";
import type {
  ChecklistItem,
  Distributor,
  DistributorDocument,
  DistributorListResult,
  DistributorQuote,
  DistributorStats,
  DistributorStatus,
  DistributorStatusCounts,
} from "@/types/distributor";
import type { DistributorListQuery } from "@/lib/validations";

const daysAgo = (d: number) =>
  new Date(Date.now() - d * 86_400_000).toISOString();

const DOCS = (): DistributorDocument[] => [
  { id: "d1", name: "Business License.pdf", sizeLabel: "2.4 MB", uploadedAt: daysAgo(20) },
  { id: "d2", name: "TIN Certificate.pdf", sizeLabel: "1.1 MB", uploadedAt: daysAgo(20) },
  { id: "d3", name: "VAT Registration.pdf", sizeLabel: "0.8 MB", uploadedAt: daysAgo(20) },
  { id: "d4", name: "Warehouse Photos.zip", sizeLabel: "45.2 MB", uploadedAt: daysAgo(20) },
];

const CHECKLIST = (): ChecklistItem[] => [
  { key: "vat", label: "VAT Verification", status: "verified", note: "Confirmed via global registry" },
  { key: "tra", label: "TRA Verification", status: "in_progress", note: "TIN check in progress" },
  { key: "insurance", label: "Insurance Policy Review", status: "required", note: "Manual verification required" },
  { key: "site", label: "Site Inspection", status: "required", note: "Pending field visit" },
];

const QUOTES = (): DistributorQuote[] => [
  { inquiryId: "INQ-8821", productCount: 7, totalQuantity: 24, customerType: "business", status: "closed", date: daysAgo(5) },
  { inquiryId: "INQ-8814", productCount: 7, totalQuantity: 24, customerType: "business", status: "contacted", date: daysAgo(12) },
  { inquiryId: "INQ-8802", productCount: 7, totalQuantity: 24, customerType: "business", status: "new", date: daysAgo(20) },
];

function seed(): Distributor[] {
  const rows: Array<
    Pick<
      Distributor,
      | "id"
      | "applicationId"
      | "name"
      | "location"
      | "region"
      | "phone"
      | "email"
      | "status"
    > & { regDays: number; lastQuoteDays: number | null }
  > = [
    { id: "dist-1", applicationId: "APP-0001", name: "Arusha Supplies Ltd", location: "Arusha, TZ", region: "Arusha", phone: "+255 765 765 435", email: "julian@gmail.com", status: "active", regDays: 500, lastQuoteDays: 5 },
    { id: "dist-2", applicationId: "APP-0002", name: "Mwanza Kitchenware", location: "Mwanza, TZ", region: "Mwanza", phone: "+255 753 111 222", email: "info@mwanzakitchen.co.tz", status: "pending", regDays: 4, lastQuoteDays: null },
    { id: "dist-3", applicationId: "APP-0003", name: "Zanzibar Distribution", location: "Zanzibar, TZ", region: "Zanzibar", phone: "+255 777 888 999", email: "orders@zanzibardist.co.tz", status: "active", regDays: 300, lastQuoteDays: 9 },
    { id: "dist-4", applicationId: "APP-0004", name: "Isaka Appliances", location: "Singida, TZ", region: "Singida", phone: "+255 712 345 678", email: "isaka@appliances.co.tz", status: "under_review", regDays: 8, lastQuoteDays: 9 },
    { id: "dist-5", applicationId: "APP-0005", name: "Olasiti Appliances", location: "Mtwara, TZ", region: "Mtwara", phone: "+255 713 222 333", email: "olasiti@appliances.co.tz", status: "under_review", regDays: 10, lastQuoteDays: 9 },
    { id: "dist-6", applicationId: "APP-0006", name: "Harbour Maritime", location: "Dar es Salaam, TZ", region: "Dar es Salaam", phone: "+255 715 444 555", email: "procurement@harbour.co.tz", status: "pending", regDays: 1, lastQuoteDays: null },
    { id: "dist-7", applicationId: "APP-0007", name: "Tanzanite Retailers", location: "Arusha, TZ", region: "Arusha", phone: "+255 716 666 777", email: "buy@tanzanite.co.tz", status: "active", regDays: 220, lastQuoteDays: 2 },
    { id: "dist-8", applicationId: "APP-0008", name: "Dodoma Traders", location: "Dodoma, TZ", region: "Dodoma", phone: "+255 717 888 000", email: "trade@dodoma.co.tz", status: "active", regDays: 180, lastQuoteDays: 30 },
    { id: "dist-9", applicationId: "APP-0009", name: "Kilimanjaro Lodge", location: "Moshi, TZ", region: "Kilimanjaro", phone: "+255 718 121 212", email: "ops@kililodge.co.tz", status: "active", regDays: 410, lastQuoteDays: 15 },
    { id: "dist-10", applicationId: "APP-0010", name: "Mbeya Wholesale", location: "Mbeya, TZ", region: "Mbeya", phone: "+255 719 343 434", email: "sales@mbeyawholesale.co.tz", status: "rejected", regDays: 60, lastQuoteDays: null },
    { id: "dist-11", applicationId: "APP-0011", name: "Zahara Logistics", location: "Arusha, TZ", region: "Arusha", phone: "+255 754 565 656", email: "hello@zahara.co.tz", status: "active", regDays: 12, lastQuoteDays: 1 },
    { id: "dist-12", applicationId: "APP-0012", name: "Coastal Imports", location: "Tanga, TZ", region: "Tanga", phone: "+255 755 676 767", email: "import@coastal.co.tz", status: "pending", regDays: 3, lastQuoteDays: null },
    { id: "dist-13", applicationId: "APP-0013", name: "Highlands Agro", location: "Iringa, TZ", region: "Iringa", phone: "+255 756 787 878", email: "agro@highlands.co.tz", status: "active", regDays: 95, lastQuoteDays: 22 },
    { id: "dist-14", applicationId: "APP-0014", name: "Lake View Traders", location: "Mwanza, TZ", region: "Mwanza", phone: "+255 757 898 989", email: "lake@view.co.tz", status: "under_review", regDays: 6, lastQuoteDays: null },
  ];

  return rows.map((r) => ({
    id: r.id,
    applicationId: r.applicationId,
    name: r.name,
    location: r.location,
    region: r.region,
    phone: r.phone,
    email: r.email,
    status: r.status,
    registrationDate: daysAgo(r.regDays),
    lastQuoteDate: r.lastQuoteDays === null ? null : daysAgo(r.lastQuoteDays),
    documents: DOCS(),
    checklist: CHECKLIST(),
    recentQuotes: r.status === "active" ? QUOTES() : [],
  }));
}

const store: { distributors: Distributor[] } = { distributors: seed() };

function countByStatus(rows: Distributor[]): DistributorStatusCounts {
  return {
    all: rows.length,
    active: rows.filter((r) => r.status === "active").length,
    pending: rows.filter((r) => r.status === "pending").length,
    under_review: rows.filter((r) => r.status === "under_review").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };
}

/* ──────────────────────────── Reads ──────────────────────────────── */

export async function getDistributorStats(): Promise<DistributorStats> {
  const rows = store.distributors;
  const regions = new Set(rows.filter((r) => r.status === "active").map((r) => r.region));
  return {
    total: rows.length,
    totalTrend: "+12% from last month",
    pendingApprovals: rows.filter(
      (r) => r.status === "pending" || r.status === "under_review",
    ).length,
    activeRegions: regions.size,
  };
}

export async function getRegions(): Promise<string[]> {
  return Array.from(new Set(store.distributors.map((d) => d.region))).sort();
}

export async function getDistributors(
  query: DistributorListQuery,
): Promise<DistributorListResult> {
  const { page, pageSize, search, status, region } = query;
  let rows = store.distributors;
  const counts = countByStatus(rows);

  if (status) rows = rows.filter((r) => r.status === status);
  if (region) rows = rows.filter((r) => r.region === region);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.applicationId.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q),
    );
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total, page, pageSize, counts };
}

export async function getDistributor(id: string): Promise<Distributor | null> {
  return store.distributors.find((d) => d.id === id) ?? null;
}

/* ─────────────────────────── Mutations ───────────────────────────── */

export function setDistributorStatusRecord(
  id: string,
  status: DistributorStatus,
): Distributor | null {
  const d = store.distributors.find((x) => x.id === id);
  if (!d) return null;
  d.status = status;
  return d;
}

export function decideApplicationRecord(
  id: string,
  decision: "approve" | "reject" | "request_info",
): Distributor | null {
  const next: DistributorStatus =
    decision === "approve"
      ? "active"
      : decision === "reject"
        ? "rejected"
        : "under_review";
  return setDistributorStatusRecord(id, next);
}
