"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import { landingConfigSchema } from "@/lib/validations";
import { saveLandingConfigRecord } from "@/lib/data/landing";
import type { ActionResult } from "@/lib/actions/products";

export async function saveLandingConfig(
  values: unknown,
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const parsed = landingConfigSchema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, error: "Please review the landing page sections." };
    }
    saveLandingConfigRecord(parsed.data);
    revalidatePath("/landing");
    return { ok: true, data: undefined };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, error: err.message };
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
