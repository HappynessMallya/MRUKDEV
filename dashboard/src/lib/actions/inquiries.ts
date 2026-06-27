"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import {
  INQUIRY_BADGES,
  INQUIRY_STATUSES,
  quoteUpdateSchema,
} from "@/lib/validations";
import {
  saveQuoteRecord,
  setInquiryStatus,
  toggleInquiryBadgeRecord,
} from "@/lib/data/inquiries";
import type { ActionResult } from "@/lib/actions/products";

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
}

export async function updateInquiryStatus(
  id: string,
  status: unknown,
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const parsed = z.enum(INQUIRY_STATUSES).safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid status." };
    const updated = setInquiryStatus(id, parsed.data);
    if (!updated) return { ok: false, error: "Inquiry not found." };
    revalidatePath("/inquiries");
    revalidatePath(`/inquiries/${id}`);
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function toggleInquiryBadge(
  id: string,
  badge: unknown,
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const parsed = z.enum(INQUIRY_BADGES).safeParse(badge);
    if (!parsed.success) return { ok: false, error: "Invalid badge." };
    const updated = toggleInquiryBadgeRecord(id, parsed.data);
    if (!updated) return { ok: false, error: "Inquiry not found." };
    revalidatePath("/inquiries");
    revalidatePath(`/inquiries/${id}`);
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function saveQuote(
  id: string,
  values: unknown,
  mode: "draft" | "send",
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const parsed = quoteUpdateSchema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, error: "Please review the quote line items." };
    }
    const updated = saveQuoteRecord(id, parsed.data, {
      markSent: mode === "send",
    });
    if (!updated) return { ok: false, error: "Inquiry not found." };
    revalidatePath("/inquiries");
    revalidatePath(`/inquiries/${id}`);
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
