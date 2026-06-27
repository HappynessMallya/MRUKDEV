/** Compact Tanzanian shilling formatting, e.g. 124800000 -> "TSh 124.8M". */
export function formatTSh(amount: number): string {
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
  return `TSh ${compact}`;
}

/** Thousands-separated integer, e.g. 2140 -> "2,140". */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

/** Full shilling amount, e.g. 12500000 -> "TSh 12,500,000". */
export function formatMoney(amount: number): string {
  return `TSh ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount)}`;
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });

/** Human relative time from an ISO string, e.g. "2 minutes ago". */
export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  let duration = (new Date(iso).getTime() - now.getTime()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return new Date(iso).toLocaleDateString();
}
