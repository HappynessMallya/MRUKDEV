"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError, apiFetch } from "@/lib/api/client";
import {
  DISTRIBUTOR_STATUSES,
  applicationDecisionSchema,
} from "@/lib/validations";
import type { ActionResult } from "@/lib/actions/products";

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
}

// POST /distributors/:id/approve — flips isActive:true, status:approved.
async function approve(id: string): Promise<void> {
  await apiFetch(`/distributors/${encodeURIComponent(id)}/approve`, {
    method: "POST",
  });
}

// POST /distributors/:id/reject — sets isActive:false, status:rejected; the
// optional reason is stored as distributorProfile.rejectionReason.
async function reject(id: string, reason?: string): Promise<void> {
  await apiFetch(`/distributors/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: reason ? { reason } : undefined,
  });
}

function revalidate(id: string): void {
  revalidatePath("/distributors");
  revalidatePath(`/distributors/${id}`);
}

export async function decideApplication(
  id: string,
  values: unknown,
): Promise<ActionResult<{ status: string }>> {
  try {
    // Approving/rejecting a distributor is an admin-level action.
    await requireRole("ADMIN");
    const parsed = applicationDecisionSchema.safeParse(values);
    if (!parsed.success) return { ok: false, error: "Invalid decision." };

    const { decision, message } = parsed.data;
    if (decision === "approve") {
      await approve(id);
      revalidate(id);
      return { ok: true, data: { status: "active" } };
    }
    if (decision === "reject") {
      await reject(id, message);
      revalidate(id);
      return { ok: true, data: { status: "rejected" } };
    }
    // "request_info" has no backend equivalent yet.
    return {
      ok: false,
      error: "Requesting more information isn't supported yet.",
    };
  } catch (err) {
    return fail(err);
  }
}

export async function updateDistributorStatus(
  id: string,
  status: unknown,
): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    const parsed = z.enum(DISTRIBUTOR_STATUSES).safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid status." };

    // The backend only exposes approve/reject — map the two supported states.
    if (parsed.data === "active") {
      await approve(id);
    } else if (parsed.data === "rejected") {
      await reject(id);
    } else {
      return {
        ok: false,
        error: "Only approve and reject are supported.",
      };
    }
    revalidate(id);
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
