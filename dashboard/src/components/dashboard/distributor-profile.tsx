import { MapPin, Mail, Phone, Pencil } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { DistributorAvatar } from "@/components/dashboard/distributor-avatar";
import { DocumentsList } from "@/components/dashboard/documents-list";
import { ContactCard } from "@/components/dashboard/contact-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import type { Distributor } from "@/types/distributor";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function DistributorProfile({
  distributor,
}: {
  distributor: Distributor;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        {/* Header */}
        <Card className="gap-4 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <DistributorAvatar
                name={distributor.name}
                seed={distributor.id}
                className="size-12"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{distributor.name}</h2>
                  <StatusBadge status={distributor.status} />
                </div>
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
                  Registered: {fmtDate(distributor.registrationDate)}
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>
              <Pencil className="size-4" />
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* Documents */}
        <Card className="gap-4 p-6">
          <h2 className="font-semibold">Registration Documents</h2>
          <DocumentsList documents={distributor.documents} />
        </Card>

        {/* Recent quotes */}
        <Card className="gap-4 p-6">
          <h2 className="font-semibold">Recent Quotes</h2>
          {distributor.recentQuotes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No quotes yet"
              description="Quotes raised with this distributor will appear here."
              className="border-0 py-8"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-xs uppercase">
                  <tr className="border-b">
                    <th className="py-2 pr-4 text-left font-medium">Inquiry ID</th>
                    <th className="py-2 pr-4 text-left font-medium">Products</th>
                    <th className="py-2 pr-4 text-left font-medium">Total qty</th>
                    <th className="py-2 pr-4 text-left font-medium">Customer</th>
                    <th className="py-2 pr-4 text-left font-medium">Status</th>
                    <th className="py-2 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {distributor.recentQuotes.map((q) => (
                    <tr key={q.inquiryId} className="border-b">
                      <td className="py-3 pr-4 font-medium">{q.inquiryId}</td>
                      <td className="py-3 pr-4 tabular-nums">{q.productCount}</td>
                      <td className="py-3 pr-4 tabular-nums">{q.totalQuantity}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="secondary" className="capitalize">
                          {q.customerType}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="text-muted-foreground py-3">
                        {fmtDate(q.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <ContactCard email={distributor.email} phone={distributor.phone} />
    </div>
  );
}
