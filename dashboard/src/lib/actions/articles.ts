"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import { ARTICLE_STATUSES, articleInputSchema } from "@/lib/validations";
import {
  createArticleRecord,
  deleteArticleRecord,
  setArticleStatus,
  updateArticleRecord,
} from "@/lib/data/articles";
import type { ActionResult } from "@/lib/actions/products";

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
}

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
    const article = createArticleRecord(parsed.data);
    revalidatePath("/articles");
    return { ok: true, data: { id: article.id } };
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
    const updated = updateArticleRecord(id, parsed.data);
    if (!updated) return { ok: false, error: "Article not found." };
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
    const updated = setArticleStatus(id, parsed.data);
    if (!updated) return { ok: false, error: "Article not found." };
    revalidatePath("/articles");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireRole("ADMIN");
    const removed = deleteArticleRecord(id);
    if (!removed) return { ok: false, error: "Article not found." };
    revalidatePath("/articles");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}
