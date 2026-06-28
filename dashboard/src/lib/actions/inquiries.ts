"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError, apiFetch } from "@/lib/api/client";
import {
  INQUIRY_BADGES,
  INQUIRY_STATUSES,
  quoteUpdateSchema,
} from "@/lib/validations";
import { toBackendStatus } from "@/lib/api/inquiries-map";
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
    await apiFetch(`/inquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { status: toBackendStatus(parsed.data) },
    });
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
  // Badges (high_value / urgent / new_seller) are a dashboard-only concept —
  // the backend inquiry has no equivalent field, so this can't persist yet.
  void id;
  const parsed = z.enum(INQUIRY_BADGES).safeParse(badge);
  if (!parsed.success) return { ok: false, error: "Invalid badge." };
  return { ok: false, error: "Tagging inquiries isn’t supported by the backend yet." };
}

export async function saveQuote(
  id: string,
  values: unknown,
  mode: "draft" | "send",
): Promise<ActionResult> {
  // The quote builder (line prices, tax, delivery) maps to the backend's
  // separate PROFORMA flow, which isn't wired into the dashboard yet. Validate
  // the input but don't pretend to persist it.
  void id;
  void mode;
  const parsed = quoteUpdateSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please review the quote line items." };
  return {
    ok: false,
    error: "Quoting will be wired through proformas in a later update.",
  };
}
