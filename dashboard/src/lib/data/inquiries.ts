import "server-only";
import type {
  Inquiry,
  InquiryListResult,
  InquiryStatus,
  InquiryStatusCounts,
  QuoteLineItem,
} from "@/types/inquiry";
import type { InquiryListQuery, QuoteUpdateInput } from "@/lib/validations";

const now = () => new Date().toISOString();
const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

function item(
  id: string,
  productName: string,
  model: string,
  attributes: string[],
  quantity: number,
  unitPrice: number,
): QuoteLineItem {
  return { id, productName, model, imageUrl: null, attributes, quantity, unitPrice };
}

function seed(): Inquiry[] {
  const data: Omit<Inquiry, "createdAt" | "updatedAt">[] = [
    {
      id: "INQ-8821",
      customerName: "Julian Kamalang'ombe",
      customerType: "individual",
      phone: "+255 764 765 764",
      email: "juliankama@gmail.com",
      location: "Kisongo, Arusha",
      status: "new",
      badges: ["high_value"],
      deliveryFee: 450000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-1", "mrUK Crystal 4K Smart TV", "CR-9000XT", ['55"', "Silver"], 20, 250000),
        item("li-2", "mrUK Crystal 4K Smart TV", "CR-9000XT", ['65"', "Black"], 5, 320000),
        item("li-3", "MRUK Soundbar S500", "SKW-SB-500", ["Black"], 3, 420000),
      ],
    },
    {
      id: "INQ-8822",
      customerName: "Arusha Supplies Ltd",
      customerType: "business",
      phone: "+255 765 765 435",
      email: "sales@arushasupplies.co.tz",
      location: "Arusha, TZ",
      status: "new",
      badges: ["urgent", "high_value"],
      deliveryFee: 600000,
      taxRate: 18,
      notes: "Requested bulk pricing on refrigerators.",
      items: [
        item("li-4", "Onyx Series Refrigerator", "ONX-REF-350", ["350L", "Black"], 12, 1250000),
      ],
    },
    {
      id: "INQ-8823",
      customerName: "Mwanza Kitchenware",
      customerType: "business",
      phone: "+255 753 111 222",
      email: "info@mwanzakitchen.co.tz",
      location: "Mwanza, TZ",
      status: "contacted",
      badges: [],
      deliveryFee: 200000,
      taxRate: 18,
      notes: "Followed up via WhatsApp.",
      items: [
        item("li-5", "MRUK Smart Oven", "SKW-OVN-990", ["60L"], 8, 480000),
        item("li-6", "MRUK Microwave 25L", "SKW-MW-25", ["25L", "Silver"], 10, 350000),
      ],
    },
    {
      id: "INQ-8824",
      customerName: "Zanzibar Distribution",
      customerType: "business",
      phone: "+255 777 888 999",
      email: "orders@zanzibardist.co.tz",
      location: "Zanzibar, TZ",
      status: "awaiting",
      badges: ["new_seller"],
      deliveryFee: 800000,
      taxRate: 18,
      notes: "Awaiting customer confirmation on quantities.",
      items: [
        item("li-7", "PureCool Split AC", "PC-AC-18", ["18000 BTU"], 15, 1150000),
      ],
    },
    {
      id: "INQ-8825",
      customerName: "Isaka Appliances",
      customerType: "business",
      phone: "+255 712 345 678",
      email: "isaka@appliances.co.tz",
      location: "Singida, TZ",
      status: "closed",
      badges: [],
      deliveryFee: 150000,
      taxRate: 18,
      notes: "Deal closed.",
      items: [
        item("li-8", "ChefMaster Gas Cooker", "CM-GC-4B", ["4 Burner"], 6, 610000),
      ],
    },
    {
      id: "INQ-8826",
      customerName: "Happyness Evaristo",
      customerType: "individual",
      phone: "+255 756 543 345",
      email: "happyness@gmail.com",
      location: "Kisongo, Arusha",
      status: "new",
      badges: [],
      deliveryFee: 100000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-9", "TurboBlend 900", "TB-900", ["1.5L"], 4, 145000),
      ],
    },
    {
      id: "INQ-8827",
      customerName: "Olasiti Appliances",
      customerType: "business",
      phone: "+255 713 222 333",
      email: "olasiti@appliances.co.tz",
      location: "Mtwara, TZ",
      status: "contacted",
      badges: ["high_value"],
      deliveryFee: 500000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-10", "FreshKeep Chest Freezer", "FK-CF-300", ["300L", "White"], 9, 890000),
      ],
    },
    {
      id: "INQ-8828",
      customerName: "Harbour Maritime",
      customerType: "business",
      phone: "+255 715 444 555",
      email: "procurement@harbour.co.tz",
      location: "Dar es Salaam, TZ",
      status: "awaiting",
      badges: ["urgent"],
      deliveryFee: 1000000,
      taxRate: 18,
      notes: "Large order pending budget approval.",
      items: [
        item("li-11", "Harvest Pro Solar Pump", "HP-SP-200", ["2HP"], 7, 980000),
        item("li-12", "AgriDry Crop Dryer", "AD-CD-100", ["100kg"], 2, 1750000),
      ],
    },
    {
      id: "INQ-8829",
      customerName: "Tanzanite Retailers",
      customerType: "business",
      phone: "+255 716 666 777",
      email: "buy@tanzanite.co.tz",
      location: "Arusha, TZ",
      status: "new",
      badges: ["new_seller"],
      deliveryFee: 250000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-13", "mrUK Cinema OLED", "CIN-OLE-66", ['66"', "Matte Black"], 3, 410000),
      ],
    },
    {
      id: "INQ-8830",
      customerName: "Dodoma Traders",
      customerType: "business",
      phone: "+255 717 888 000",
      email: "trade@dodoma.co.tz",
      location: "Dodoma, TZ",
      status: "contacted",
      badges: [],
      deliveryFee: 300000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-14", "AquaStream ProX9 Washing machine", "AS-PRO-X19", ["Titanium"], 5, 540000),
      ],
    },
    {
      id: "INQ-8831",
      customerName: "Kilimanjaro Lodge",
      customerType: "business",
      phone: "+255 718 121 212",
      email: "ops@kililodge.co.tz",
      location: "Moshi, TZ",
      status: "closed",
      badges: ["high_value"],
      deliveryFee: 400000,
      taxRate: 18,
      notes: "Repeat customer.",
      items: [
        item("li-15", "PureCool Split AC", "PC-AC-18", ["18000 BTU"], 10, 1150000),
      ],
    },
    {
      id: "INQ-8832",
      customerName: "Mbeya Wholesale",
      customerType: "business",
      phone: "+255 719 343 434",
      email: "sales@mbeyawholesale.co.tz",
      location: "Mbeya, TZ",
      status: "awaiting",
      badges: [],
      deliveryFee: 350000,
      taxRate: 18,
      notes: "",
      items: [
        item("li-16", "Mwanza Grain Mill", "MG-MILL-50", ["50kg/hr"], 4, 2200000),
      ],
    },
  ];

  const stamp = now();
  return data.map((d, i) => ({
    ...d,
    createdAt: minutesAgo((i + 1) * 30),
    updatedAt: stamp,
  }));
}

const store: { inquiries: Inquiry[] } = { inquiries: seed() };

function countByStatus(rows: Inquiry[]): InquiryStatusCounts {
  return {
    all: rows.length,
    new: rows.filter((r) => r.status === "new").length,
    contacted: rows.filter((r) => r.status === "contacted").length,
    awaiting: rows.filter((r) => r.status === "awaiting").length,
    closed: rows.filter((r) => r.status === "closed").length,
  };
}

/* ──────────────────────────── Reads ──────────────────────────────── */

export async function getInquiries(
  query: InquiryListQuery,
): Promise<InquiryListResult> {
  const { page, pageSize, search, status } = query;
  let rows = store.inquiries;

  const counts = countByStatus(rows);

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
  return store.inquiries.find((i) => i.id === id) ?? null;
}

/* ─────────────────────────── Mutations ───────────────────────────── */
// Called only by guarded Server Actions (lib/actions/inquiries.ts).

export function setInquiryStatus(
  id: string,
  status: InquiryStatus,
): Inquiry | null {
  const inquiry = store.inquiries.find((i) => i.id === id);
  if (!inquiry) return null;
  inquiry.status = status;
  inquiry.updatedAt = now();
  return inquiry;
}

export function toggleInquiryBadgeRecord(
  id: string,
  badge: Inquiry["badges"][number],
): Inquiry | null {
  const inquiry = store.inquiries.find((i) => i.id === id);
  if (!inquiry) return null;
  inquiry.badges = inquiry.badges.includes(badge)
    ? inquiry.badges.filter((b) => b !== badge)
    : [...inquiry.badges, badge];
  inquiry.updatedAt = now();
  return inquiry;
}

export function saveQuoteRecord(
  id: string,
  input: QuoteUpdateInput,
  options: { markSent: boolean },
): Inquiry | null {
  const inquiry = store.inquiries.find((i) => i.id === id);
  if (!inquiry) return null;

  // Merge edited quantities / prices onto the existing line items.
  const byId = new Map(input.items.map((i) => [i.id, i]));
  inquiry.items = inquiry.items.map((line) => {
    const edit = byId.get(line.id);
    return edit
      ? { ...line, quantity: edit.quantity, unitPrice: edit.unitPrice }
      : line;
  });
  inquiry.deliveryFee = input.deliveryFee;
  inquiry.taxRate = input.taxRate;
  inquiry.notes = input.notes;
  if (options.markSent && inquiry.status === "new") {
    inquiry.status = "contacted";
  }
  inquiry.updatedAt = now();
  return inquiry;
}
