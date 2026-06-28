import "server-only";
import type {
  Inquiry,
  InquiryListResult,
  InquiryStatusCounts,
} from "@/types/inquiry";
import type { InquiryListQuery } from "@/lib/validations";
import { apiFetch } from "@/lib/api/client";
import {
  backendInquirySchema,
  inquiryListSchema,
  mapInquiry,
} from "@/lib/api/inquiries-map";

// Inquiry reads, wired to the live backend (`GET /inquiries`). The dashboard's
// status buckets don't line up 1:1 with the backend lifecycle and we want stable
// per-bucket counts, so we fetch a generous page and filter/paginate/count
// client-side. Quoting (prices/tax/delivery) is the separate PROFORMA flow and
// is NOT wired here — see lib/actions/inquiries.ts.

const REVALIDATE = 20;
const TAG = "inquiries";
const MAX_PAGE = 200;

async function fetchAll(): Promise<Inquiry[]> {
  const res = await apiFetch("/inquiries", {
    query: { page: 1, limit: MAX_PAGE },
    schema: inquiryListSchema,
    next: { revalidate: REVALIDATE, tags: [TAG] },
  });
  return res.data.map(mapInquiry);
}

function countByStatus(rows: Inquiry[]): InquiryStatusCounts {
  return {
    all: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    contacted: rows.filter((r) => r.status === "contacted").length,
    awaiting: rows.filter((r) => r.status === "awaiting").length,
    closed: rows.filter((r) => r.status === "closed").length,
  };
}

export async function getInquiries(
  query: InquiryListQuery,
): Promise<InquiryListResult> {
  const { page, pageSize, search, status } = query;
  const all = await fetchAll();
  const counts = countByStatus(all);

  let rows = all;
  if (status) rows = rows.filter((r) => r.status === status);
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (r) =>
        r.customerName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.phone.includes(q),
    );
  }

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const data = rows.slice(start, start + pageSize);
  return { data, total, page, pageSize, counts };
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  try {
    const res = await apiFetch(`/inquiries/${encodeURIComponent(id)}`, {
      schema: backendInquirySchema,
      next: { revalidate: REVALIDATE, tags: [TAG] },
    });
    return mapInquiry(res);
  } catch {
    return null;
  }
}
