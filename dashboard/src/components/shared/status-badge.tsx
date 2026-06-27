import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "info" | "danger" | "neutral" | "brand";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  info: "bg-info/10 text-info border-info/20",
  danger: "bg-destructive/10 text-destructive border-destructive/20",
  neutral: "bg-muted text-muted-foreground border-border",
  brand: "bg-brand/10 text-brand border-brand/20",
};

/** Maps common backend status strings to a visual tone. Extend per module. */
const statusTone: Record<string, Tone> = {
  active: "success",
  published: "success",
  approved: "success",
  closed: "success",
  delivered: "success",
  pending: "warning",
  contacted: "warning",
  awaiting: "warning",
  under_review: "info",
  "under review": "info",
  new: "info",
  draft: "neutral",
  archived: "neutral",
  rejected: "danger",
  urgent: "danger",
  low_stock: "danger",
};

interface StatusBadgeProps {
  status: string;
  /** Override the inferred tone. */
  tone?: Tone;
  className?: string;
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const key = status.toLowerCase().trim();
  const resolved = tone ?? statusTone[key] ?? "neutral";
  const label = status.replace(/[_-]/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn("capitalize font-medium", toneClasses[resolved], className)}
    >
      {label}
    </Badge>
  );
}
