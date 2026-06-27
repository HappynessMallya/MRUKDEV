import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/dashboard/print-button";
import { getInquiry } from "@/lib/data/inquiries";
import {
  inquirySubtotal,
  inquiryTotal,
  lineSubtotal,
} from "@/types/inquiry";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Quote" };

export default async function QuotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  const subtotal = inquirySubtotal(inquiry);
  const tax = (subtotal * inquiry.taxRate) / 100;
  const total = inquiryTotal(inquiry);
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <div className="space-y-4">
      {/* Toolbar (hidden when printing) */}
      <div className="flex items-center justify-between print:hidden">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href={`/inquiries/${inquiry.id}`}>
            <ArrowLeft className="size-4" />
            Back to quote builder
          </Link>
        </Button>
        <PrintButton />
      </div>

      {/* Printable quote */}
      <div className="mx-auto max-w-3xl rounded-lg border bg-white p-8 text-sm text-neutral-900 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-2xl font-bold tracking-tight">MRUK</p>
            <p className="text-neutral-500">Magila / Likoma Street, Kariakoo</p>
            <p className="text-neutral-500">Dar es Salaam, Tanzania</p>
            <p className="text-neutral-500">sales@mruk.co.tz</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-semibold text-neutral-400">QUOTE</p>
            <table className="mt-2 ml-auto text-xs">
              <tbody>
                <tr>
                  <td className="pr-3 text-neutral-500">DATE</td>
                  <td className="font-medium">{today}</td>
                </tr>
                <tr>
                  <td className="pr-3 text-neutral-500">QUOTE #</td>
                  <td className="font-medium">{inquiry.id}</td>
                </tr>
                <tr>
                  <td className="pr-3 text-neutral-500">CUSTOMER TYPE</td>
                  <td className="font-medium capitalize">{inquiry.customerType}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
            Customer
          </p>
          <p className="mt-1 font-medium">{inquiry.customerName}</p>
          <p className="text-neutral-600">{inquiry.location}</p>
          <p className="text-neutral-600">{inquiry.email}</p>
          <p className="text-neutral-600">{inquiry.phone}</p>
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-neutral-100 text-left text-xs text-neutral-600 uppercase">
              <th className="border border-neutral-200 px-3 py-2">Description</th>
              <th className="border border-neutral-200 px-3 py-2 text-right">Unit price</th>
              <th className="border border-neutral-200 px-3 py-2 text-right">Qty</th>
              <th className="border border-neutral-200 px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {inquiry.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-neutral-200 px-3 py-2">
                  <span className="font-medium">{item.productName}</span>
                  {item.attributes.length > 0 && (
                    <span className="text-neutral-500">
                      {" "}
                      — {item.attributes.join(", ")}
                    </span>
                  )}
                </td>
                <td className="border border-neutral-200 px-3 py-2 text-right tabular-nums">
                  {formatMoney(item.unitPrice)}
                </td>
                <td className="border border-neutral-200 px-3 py-2 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="border border-neutral-200 px-3 py-2 text-right tabular-nums">
                  {formatMoney(lineSubtotal(item))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <table className="text-sm">
            <tbody>
              <tr>
                <td className="pr-8 text-neutral-500">Subtotal</td>
                <td className="text-right tabular-nums">{formatMoney(subtotal)}</td>
              </tr>
              <tr>
                <td className="pr-8 text-neutral-500">Tax ({inquiry.taxRate}%)</td>
                <td className="text-right tabular-nums">{formatMoney(tax)}</td>
              </tr>
              <tr>
                <td className="pr-8 text-neutral-500">Delivery fee</td>
                <td className="text-right tabular-nums">
                  {formatMoney(inquiry.deliveryFee)}
                </td>
              </tr>
              <tr className="border-t font-semibold">
                <td className="pr-8 pt-1">TOTAL</td>
                <td className="pt-1 text-right tabular-nums">{formatMoney(total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {inquiry.notes && (
          <div className="mt-6">
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Notes
            </p>
            <p className="mt-1 whitespace-pre-line text-neutral-700">
              {inquiry.notes}
            </p>
          </div>
        )}

        <div className="mt-8 border-t pt-4 text-xs text-neutral-500">
          <p className="font-semibold text-neutral-700">Terms and conditions</p>
          <ol className="mt-1 list-decimal space-y-0.5 pl-4">
            <li>Customer will be billed after indicating acceptance of this quote.</li>
            <li>Payment will be due prior to delivery of goods.</li>
            <li>Please sign and return the quote to the address above.</li>
          </ol>
          <p className="mt-6 text-center font-medium text-neutral-700">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
}
