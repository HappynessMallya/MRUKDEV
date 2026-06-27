import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { QuoteBuilder } from "@/components/dashboard/quote-builder";
import { getInquiry } from "@/lib/data/inquiries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `Inquiry ${id}` };
}

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/inquiries">
            <ArrowLeft className="size-4" />
            Back to inquiries
          </Link>
        </Button>
        <PageHeader
          title="Quote builder"
          description="Build and respond to this inquiry with a product quote."
        />
      </div>
      <QuoteBuilder inquiry={inquiry} />
    </div>
  );
}
