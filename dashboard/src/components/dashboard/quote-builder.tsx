"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  FileText,
  Save,
  Send,
  Loader2,
  Package,
  BadgePlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InquiryBadges } from "@/components/dashboard/inquiry-badges";
import {
  saveQuote,
  toggleInquiryBadge,
  updateInquiryStatus,
} from "@/lib/actions/inquiries";
import { INQUIRY_BADGES, INQUIRY_STATUSES } from "@/lib/validations";
import {
  BADGE_LABELS,
  type Inquiry,
  type InquiryBadge,
  type InquiryStatus,
} from "@/types/inquiry";
import { formatMoney } from "@/lib/format";

interface LineState {
  id: string;
  quantity: number;
  unitPrice: number;
}

export function QuoteBuilder({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [isSaving, startSaving] = useTransition();
  const [isMeta, startMeta] = useTransition();

  const [lines, setLines] = useState<LineState[]>(
    inquiry.items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })),
  );
  const [deliveryFee, setDeliveryFee] = useState(inquiry.deliveryFee);
  const [taxRate, setTaxRate] = useState(inquiry.taxRate);
  const [notes, setNotes] = useState(inquiry.notes);
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [badges, setBadges] = useState<InquiryBadge[]>(inquiry.badges);

  const lineById = useMemo(
    () => new Map(lines.map((l) => [l.id, l])),
    [lines],
  );

  const subtotal = useMemo(
    () =>
      inquiry.items.reduce((sum, item) => {
        const line = lineById.get(item.id);
        return sum + (line ? line.quantity * line.unitPrice : 0);
      }, 0),
    [inquiry.items, lineById],
  );
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax + deliveryFee;

  function updateLine(id: string, patch: Partial<LineState>) {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function persist(mode: "draft" | "send") {
    startSaving(async () => {
      const result = await saveQuote(
        inquiry.id,
        { items: lines, deliveryFee, taxRate, notes },
        mode,
      );
      if (result.ok) {
        toast.success(mode === "send" ? "Quote sent to client" : "Draft saved");
        if (mode === "send") setStatus((s) => (s === "new" ? "contacted" : s));
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  function onStatusChange(next: InquiryStatus) {
    setStatus(next);
    startMeta(async () => {
      const result = await updateInquiryStatus(inquiry.id, next);
      if (result.ok) toast.success("Status updated");
      else toast.error(result.error);
    });
  }

  function onToggleBadge(badge: InquiryBadge) {
    setBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
    );
    startMeta(async () => {
      const result = await toggleInquiryBadge(inquiry.id, badge);
      if (!result.ok) {
        toast.error(result.error);
        setBadges(inquiry.badges); // revert on failure
      }
    });
  }

  const whatsappHref = `https://wa.me/${inquiry.phone.replace(/\D/g, "")}`;

  return (
    <div className="space-y-6">
      {/* Customer header */}
      <Card className="gap-4 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{inquiry.id}</h2>
              <Badge variant="secondary" className="capitalize">
                {inquiry.customerType}
              </Badge>
            </div>
            <p className="font-medium">{inquiry.customerName}</p>
            <div className="text-muted-foreground flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-2">
                <MapPin className="size-4" /> {inquiry.location}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="size-4" /> {inquiry.email}
              </span>
              <span className="flex items-center gap-2">
                <Phone className="size-4" /> {inquiry.phone}
              </span>
            </div>
            <InquiryBadges badges={badges} />
          </div>

          <div className="flex flex-col items-stretch gap-2 sm:w-64">
            <Button asChild className="bg-whatsapp text-white hover:bg-whatsapp/90">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                Contact via WhatsApp
              </a>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-muted-foreground text-xs">Status</Label>
                <Select value={status} onValueChange={(v) => onStatusChange(v as InquiryStatus)}>
                  <SelectTrigger className="w-full" disabled={isMeta}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INQUIRY_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="self-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" aria-label="Add badge">
                      <BadgePlus className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Badges</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {INQUIRY_BADGES.map((b) => (
                      <DropdownMenuCheckboxItem
                        key={b}
                        checked={badges.includes(b)}
                        onCheckedChange={() => onToggleBadge(b)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {BADGE_LABELS[b]}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Line items */}
      <Card className="gap-0 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase">
              <tr className="border-b">
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Quantity</th>
                <th className="px-4 py-3 text-left font-medium">Unit price</th>
                <th className="px-4 py-3 text-right font-medium">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {inquiry.items.map((item) => {
                const line = lineById.get(item.id)!;
                const lineTotal = line.quantity * line.unitPrice;
                return (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                          <Package className="size-4" />
                        </span>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-muted-foreground text-xs">
                            Model: {item.model}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.attributes.map((a) => (
                              <Badge key={a} variant="secondary" className="font-normal">
                                {a}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min={0}
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(item.id, {
                            quantity: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="h-9 w-20 tabular-nums"
                        aria-label={`Quantity for ${item.productName}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        min={0}
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(item.id, {
                            unitPrice: Math.max(0, Number(e.target.value) || 0),
                          })
                        }
                        className="h-9 w-32 tabular-nums"
                        aria-label={`Unit price for ${item.productName}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {formatMoney(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charges + notes + totals */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          <Card className="gap-4 p-6">
            <h3 className="font-semibold">Charges</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery fee (TSh)</Label>
                <Input
                  id="delivery"
                  type="number"
                  min={0}
                  value={deliveryFee}
                  onChange={(e) =>
                    setDeliveryFee(Math.max(0, Number(e.target.value) || 0))
                  }
                  className="tabular-nums"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax">Tax (%)</Label>
                <Input
                  id="tax"
                  type="number"
                  min={0}
                  max={100}
                  value={taxRate}
                  onChange={(e) =>
                    setTaxRate(
                      Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                    )
                  }
                  className="tabular-nums"
                />
              </div>
            </div>
          </Card>

          <Card className="gap-2 p-6">
            <Label htmlFor="notes" className="font-semibold">
              Negotiation / customer notes
            </Label>
            <Textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Visible to the client in the final quote…"
            />
          </Card>
        </div>

        <Card className="h-fit gap-4 p-6">
          <h3 className="font-semibold">Summary</h3>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax ({taxRate}%)</dt>
              <dd className="tabular-nums">{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping &amp; delivery</dt>
              <dd className="tabular-nums">{formatMoney(deliveryFee)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 text-base font-semibold">
              <dt>Final Quote Total</dt>
              <dd className="tabular-nums">{formatMoney(total)}</dd>
            </div>
          </dl>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={() => persist("send")} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send Quote to Client
            </Button>
            <Button
              variant="outline"
              onClick={() => persist("draft")}
              disabled={isSaving}
            >
              <Save className="size-4" />
              Save Draft
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/inquiries/${inquiry.id}/quote`}>
                <FileText className="size-4" />
                Open printable quote
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
