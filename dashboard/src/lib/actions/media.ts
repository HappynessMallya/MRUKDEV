"use server";

import { requireRole } from "@/lib/auth-guard";
import { ApiError } from "@/lib/api/client";
import {
  ALLOWED_UPLOAD_TYPES,
  presignMediaUpload,
  type PresignInput,
  type PresignResult,
} from "@/lib/data/media";
import type { ActionResult } from "@/lib/actions/products";

// Hand the browser a presigned R2 URL to upload an image/PDF to (§8). The bytes
// never pass through this server action — only the metadata does. Editor+ only,
// mirroring the product/article write guards.
export async function requestUploadUrl(
  input: PresignInput,
): Promise<ActionResult<PresignResult>> {
  try {
    await requireRole("EDITOR");

    const filename = input.filename?.trim();
    if (!filename) {
      return { ok: false, error: "A filename is required." };
    }
    if (!ALLOWED_UPLOAD_TYPES.includes(input.contentType as (typeof ALLOWED_UPLOAD_TYPES)[number])) {
      return {
        ok: false,
        error: "Unsupported file type. Upload a JPG, PNG, WebP, GIF, SVG, or PDF.",
      };
    }

    const result = await presignMediaUpload({
      filename,
      contentType: input.contentType,
      folder: input.folder,
    });
    return { ok: true, data: result };
  } catch (err) {
    if (err instanceof ApiError) return { ok: false, error: err.message };
    return { ok: false, error: "Could not start the upload. Please try again." };
  }
}
