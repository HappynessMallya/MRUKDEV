"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  X,
  Info,
  MapPin,
  Mail,
  Phone,
  CircleCheck,
  Clock,
  CircleAlert,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DocumentsList } from "@/components/dashboard/documents-list";
import { decideApplication } from "@/lib/actions/distributors";
import type { ChecklistStatus, Distributor } from "@/types/distributor";

const CHECK_ICON: Record<ChecklistStatus, typeof CircleCheck> = {
  verified: CircleCheck,
  in_progress: Clock,
  required: CircleAlert,
};
const CHECK_CLASS: Record<ChecklistStatus, string> = {
  verified: "text-success",
  in_progress: "text-warning-foreground",
  required: "text-muted-foreground",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationReview({ distributor }: { distributor: Distributor }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function decide(decision: "approve" | "reject" | "request_info") {
    startTransition(async () => {
      const result = await decideApplication(distributor.id, { decision });
      if (result.ok) {
        toast.success(
          decision === "approve"
            ? "Application approved"
            : decision === "reject"
              ? "Application rejected"
              : "More information requested",
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card className="gap-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">
                #{distributor.applicationId}
              </span>
              <StatusBadge status={distributor.status} />
            </div>
            <p className="font-medium">{distributor.name}</p>
            <div className="text-muted-foreground flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-2">
                <MapPin className="size-4" /> {distributor.location}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4" /> {distributor.phone}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4" /> {distributor.email}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Submission date: {fmtDate(distributor.registrationDate)}
            </p>
          </div>

          <div className="flex flex-col gap-2 lg:w-64">
            <Button
              className="bg-success text-white hover:bg-success/90"
              onClick={() => decide("approve")}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Approve
            </Button>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/5"
              onClick={() => decide("reject")}
              disabled={isPending}
            >
              <X className="size-4" />
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => decide("request_info")}
              disabled={isPending}
            >
              <Info className="size-4" />
              Request More Info
            </Button>
          </div>
        </div>
      </Card>

      <Card className="gap-4 p-6">
        <h2 className="font-semibold">
          Submitted documents{" "}
          <span className="text-muted-foreground text-sm font-normal">
            · {distributor.documents.length} files attached
          </span>
        </h2>
        <DocumentsList documents={distributor.documents} />
      </Card>

      <Card className="gap-4 p-6">
        <h2 className="font-semibold">Application Verification Checklist</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {distributor.checklist.map((item) => {
            const Icon = CHECK_ICON[item.status];
            return (
              <li
                key={item.key}
                className="border-border flex items-start gap-3 rounded-lg border p-3"
              >
                <Icon className={`mt-0.5 size-4 shrink-0 ${CHECK_CLASS[item.status]}`} />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  {item.note && (
                    <p className="text-muted-foreground text-xs">{item.note}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
