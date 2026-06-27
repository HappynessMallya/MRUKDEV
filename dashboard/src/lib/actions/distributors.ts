"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import {
  DISTRIBUTOR_STATUSES,
  applicationDecisionSchema,
} from "@/lib/validations";
import {
  decideApplicationRecord,
  setDistributorStatusRecord,
} from "@/lib/data/distributors";
import type { ActionResult } from "@/lib/actions/products";

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
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
    const updated = decideApplicationRecord(id, parsed.data.decision);
    if (!updated) return { ok: false, error: "Distributor not found." };
    revalidatePath("/distributors");
    revalidatePath(`/distributors/${id}`);
    return { ok: true, data: { status: updated.status } };
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
    const updated = setDistributorStatusRecord(id, parsed.data);
    if (!updated) return { ok: false, error: "Distributor not found." };
    revalidatePath("/distributors");
    revalidatePath(`/distributors/${id}`);
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
