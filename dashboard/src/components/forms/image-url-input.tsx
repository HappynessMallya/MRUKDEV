"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { requestUploadUrl } from "@/lib/actions/media";

interface ImageUrlInputProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  aspect?: "video" | "square";
  placeholder?: string;
}

function looksLikeUrl(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

/**
 * Image field with a live preview, accepting either a pasted URL or a direct
 * file upload. Uploads use the presigned-PUT flow (§8): a server action mints an
 * R2 upload URL, the browser PUTs the bytes straight to R2, and the resulting
 * public URL is written back via `onChange`. Uses next/image with `unoptimized`
 * so arbitrary (admin-provided) URLs render without remotePatterns config.
 */
export function ImageUrlInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  aspect = "video",
  placeholder = "https://…",
}: ImageUrlInputProps) {
  const [broken, setBroken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showPreview = looksLikeUrl(value) && !broken;

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const presigned = await requestUploadUrl({
        filename: file.name,
        contentType: file.type,
      });
      if (!presigned.ok) {
        toast.error(presigned.error);
        return;
      }
      // Browser → R2 directly. The Content-Type MUST match what was presigned,
      // or R2 rejects the PUT with a signature mismatch.
      const put = await fetch(presigned.data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!put.ok) {
        toast.error("Upload failed. Please try again.");
        return;
      }
      setBroken(false);
      onChange(presigned.data.publicUrl);
      toast.success("Image uploaded.");
    } catch {
      toast.error("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div
        className={cn(
          "bg-muted/40 relative flex w-full items-center justify-center overflow-hidden rounded-lg border",
          aspect === "video" ? "aspect-video" : "aspect-square max-w-48",
        )}
      >
        {showPreview ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              unoptimized
              className="object-cover"
              onError={() => setBroken(true)}
            />
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 size-7"
              onClick={() => {
                setBroken(false);
                onChange("");
              }}
              aria-label="Remove image"
            >
              <X className="size-4" />
            </Button>
          </>
        ) : (
          <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
            <ImageIcon className="size-6" />
            <span>{broken ? "Couldn't load image" : "No image"}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            setBroken(false);
            onChange(e.target.value);
          }}
          onBlur={onBlur}
          aria-invalid={!!error}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shrink-0"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
