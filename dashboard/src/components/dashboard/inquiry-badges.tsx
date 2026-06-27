import { StatusBadge } from "@/components/shared/status-badge";
import { BADGE_LABELS, type InquiryBadge } from "@/types/inquiry";

const BADGE_TONE = {
  high_value: "brand",
  urgent: "danger",
  new_seller: "info",
} as const;

export function InquiryBadges({ badges }: { badges: InquiryBadge[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b) => (
        <StatusBadge
          key={b}
          status={BADGE_LABELS[b]}
          tone={BADGE_TONE[b]}
          className="text-[10px]"
        />
      ))}
    </div>
  );
}
