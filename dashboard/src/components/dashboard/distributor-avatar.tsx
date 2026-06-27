import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-brand/15 text-brand",
  "bg-success/15 text-success",
  "bg-info/15 text-info",
  "bg-warning/20 text-warning-foreground",
  "bg-destructive/15 text-destructive",
];

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function DistributorAvatar({
  name,
  seed,
  className,
}: {
  name: string;
  seed: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-9", className)}>
      <AvatarFallback className={cn("text-xs font-medium", colorFor(seed))}>
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
