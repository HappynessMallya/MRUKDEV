import "server-only";
import { z } from "zod";
import { apiFetch } from "@/lib/api/client";

// Media uploads use a presigned-PUT flow (§8): the backend never sees the bytes.
//   1. POST /media/presign  → { uploadUrl, publicUrl, key }   (this module)
//   2. browser PUTs the file straight to `uploadUrl` (Cloudflare R2)
//   3. the product/article saves `publicUrl` via its own write path
// Step 1 is admin-only (needs the Bearer token apiFetch attaches); steps 2–3
// run client-side — see the upload button in `image-url-input.tsx`.

// The backend accepts images and PDFs (catalogue/spec sheets). We gate on this
// list both here and in the UI so a rejected upload fails fast with a clear msg.
export const ALLOWED_UPLOAD_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
] as const;

// `key`/`expiresIn` are returned but unused by the client; keep them optional so
// a minor backend shape change can't 502 the whole upload.
const presignSchema = z.object({
  uploadUrl: z.string().url(),
  publicUrl: z.string().url(),
  key: z.string().optional(),
  expiresIn: z.number().optional(),
});

export interface PresignInput {
  filename: string;
  contentType: string;
  // Optional R2 prefix, e.g. "documents" for PDFs (§13). Defaults server-side.
  folder?: string;
}

export interface PresignResult {
  uploadUrl: string;
  publicUrl: string;
}

export async function presignMediaUpload(
  input: PresignInput,
): Promise<PresignResult> {
  const res = await apiFetch("/media/presign", {
    method: "POST",
    body: {
      filename: input.filename,
      contentType: input.contentType,
      ...(input.folder ? { folder: input.folder } : {}),
    },
    schema: presignSchema,
  });
  return { uploadUrl: res.uploadUrl, publicUrl: res.publicUrl };
}
