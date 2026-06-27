import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ApplicationReview } from "@/components/dashboard/application-review";
import { DistributorProfile } from "@/components/dashboard/distributor-profile";
import { getDistributor } from "@/lib/data/distributors";
import { isApplication } from "@/types/distributor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const distributor = await getDistributor(id);
  return { title: distributor ? distributor.name : "Distributor" };
}

export default async function DistributorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const distributor = await getDistributor(id);
  if (!distributor) notFound();

  const application = isApplication(distributor);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
          <Link href="/distributors">
            <ArrowLeft className="size-4" />
            Back to distributors
          </Link>
        </Button>
        <PageHeader
          title={application ? "Application review" : "Distributor profile"}
          description={
            application
              ? "Review documents and approve, reject, or request more information."
              : "Manage this distributor's profile, documents, and quote history."
          }
        />
      </div>

      {application ? (
        <ApplicationReview distributor={distributor} />
      ) : (
        <DistributorProfile distributor={distributor} />
      )}
    </div>
  );
}
