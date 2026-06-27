"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import {
  bulkInventorySchema,
  productInputSchema,
} from "@/lib/validations";
import {
  applyBulkInventory,
  createProductRecord,
  deleteProductRecord,
  setProductStatus,
  updateProductRecord,
} from "@/lib/data/products";
import type { ProductStatus } from "@/types/product";

/** Discriminated result every action returns — easy for forms to branch on. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

function fail(err: unknown): ActionResult<never> {
  if (err instanceof ApiError) return { ok: false, error: err.message };
  return { ok: false, error: "Something went wrong. Please try again." };
}

export async function createProduct(
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("EDITOR");
    const parsed = productInputSchema.safeParse(values);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const product = createProductRecord(parsed.data);
    revalidatePath("/products");
    return { ok: true, data: { id: product.id } };
  } catch (err) {
    return fail(err);
  }
}

export async function updateProduct(
  id: string,
  values: unknown,
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("EDITOR");
    const parsed = productInputSchema.safeParse(values);
    if (!parsed.success) {
      return {
        ok: false,
        error: "Please fix the highlighted fields.",
        fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }
    const updated = updateProductRecord(id, parsed.data);
    if (!updated) return { ok: false, error: "Product not found." };
    revalidatePath("/products");
    revalidatePath(`/products/${id}/edit`);
    return { ok: true, data: { id } };
  } catch (err) {
    return fail(err);
  }
}

export async function changeProductStatus(
  id: string,
  status: ProductStatus,
): Promise<ActionResult> {
  try {
    await requireRole("EDITOR");
    const updated = setProductStatus(id, status);
    if (!updated) return { ok: false, error: "Product not found." };
    revalidatePath("/products");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    // Deleting is higher-privilege than editing.
    await requireRole("ADMIN");
    const removed = deleteProductRecord(id);
    if (!removed) return { ok: false, error: "Product not found." };
    revalidatePath("/products");
    return { ok: true, data: undefined };
  } catch (err) {
    return fail(err);
  }
}

export async function bulkUpdateInventory(
  values: unknown,
): Promise<ActionResult<{ changed: number }>> {
  try {
    await requireRole("EDITOR");
    const parsed = bulkInventorySchema.safeParse(values);
    if (!parsed.success) {
      return { ok: false, error: "Invalid inventory changes." };
    }
    const changed = applyBulkInventory(parsed.data);
    revalidatePath("/products");
    return { ok: true, data: { changed } };
  } catch (err) {
    return fail(err);
  }
}
