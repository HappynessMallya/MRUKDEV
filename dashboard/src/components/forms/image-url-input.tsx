"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
 * URL-based image field with a live preview. Uses next/image with `unoptimized`
 * so arbitrary (admin-provided) URLs render without remotePatterns config.
 * Ready to swap for a real upload once a storage endpoint exists.
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
  const showPreview = looksLikeUrl(value) && !broken;

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
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
