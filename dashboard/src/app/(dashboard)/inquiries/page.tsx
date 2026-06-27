import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { InquiryToolbar } from "@/components/dashboard/inquiry-toolbar";
import { InquiryTable } from "@/components/dashboard/inquiry-table";
import { getInquiries } from "@/lib/data/inquiries";
import { inquiryListQuerySchema } from "@/lib/validations";

export const metadata: Metadata = { title: "Inquiries" };

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = inquiryListQuerySchema.parse({
    page: sp.page,
    search: sp.search,
    status: sp.status,
    pageSize: 10,
  });

  const { data, total, page, pageSize, counts } = await getInquiries(query);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Inquiries"
        description="Manage and respond to operational inquiries and product quotes."
      />

      <Card className="gap-5 p-5">
        <InquiryToolbar
          counts={counts}
          current={{ status: query.status, search: query.search }}
        />
        <InquiryTable
          inquiries={data}
          total={total}
          page={page}
          pageSize={pageSize}
        />
      </Card>
    </div>
  );
}
