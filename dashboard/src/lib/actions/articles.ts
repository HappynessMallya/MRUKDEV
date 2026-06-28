"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError, apiFetch } from "@/lib/api/client";
import { ARTICLE_STATUSES, articleInputSchema } from "@/lib/validations";
import { articleInputToPayload } from "@/lib/api/articles-map";
import type { ActionResult } from "@/lib/actions/products";

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
}

const createdSchema = z.object({ id: z.string() });

export async function createArticle(
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("EDITOR");
    const parsed = articleInputSchema.safeParse(values);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const created = await apiFetch("/articles", {
      method: "POST",
      body: articleInputToPayload(parsed.data),
      schema: createdSchema,
    });
    revalidatePath("/articles");
    return { ok: true, data: { id: created.id } };
  } catch (err) {
    return fail(err);
  }
}

export async function updateArticle(
  id: string,
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("EDITOR");
    const parsed = articleInputSchema.safeParse(values);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    await apiFetch(`/articles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: articleInputToPayload(parsed.data),
    });
    revalidatePath("/articles");
    revalidatePath(`/articles/${id}`);
    return { ok: true, data: { id } };
  } catch (err) {
    return fail(err);
  }
}

export async function changeArticleStatus(
  id: string,
  status: unknown,
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const parsed = z.enum(ARTICLE_STATUSES).safeParse(status);
    if (!parsed.success) return { ok: false, error: "Invalid status." };
    // Backend only has isPublished — "scheduled" has no equivalent (→ unpublished).
    await apiFetch(`/articles/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: { isPublished: parsed.data === "published" },
    });
    revalidatePath("/articles");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    await apiFetch(`/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
    revalidatePath("/articles");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
