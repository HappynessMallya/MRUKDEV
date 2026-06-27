"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { InquiryStatusCounts } from "@/types/inquiry";

const TABS: { key: string; label: string; countKey: keyof InquiryStatusCounts }[] =
  [
    { key: "", label: "All Inquiries", countKey: "all" },
    { key: "new", label: "New", countKey: "new" },
    { key: "contacted", label: "Contacted", countKey: "contacted" },
    { key: "awaiting", label: "Awaiting", countKey: "awaiting" },
    { key: "closed", label: "Closed", countKey: "closed" },
  ];

interface InquiryToolbarProps {
  counts: InquiryStatusCounts;
  current: { status?: string; search?: string };
}

export function InquiryToolbar({ counts, current }: InquiryToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(current.search ?? "");

  function setParam(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if ((current.search ?? "") !== search) setParam({ search });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const activeStatus = current.status ?? "";

  return (
    <div className="space-y-4">
      <div className="relative">
        {isPending ? (
          <Loader2 className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin" />
        ) : (
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        )}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inquiries, IDs, or customers…"
          className="pl-9"
          aria-label="Search inquiries"
        />
      </div>

      <div
        className="flex flex-wrap gap-1 border-b"
        role="tablist"
        aria-label="Filter by status"
      >
        {TABS.map((tab) => {
          const active = activeStatus === tab.key;
          return (
            <button
              key={tab.key || "all"}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setParam({ status: tab.key || undefined })}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-brand text-foreground"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                  active ? "bg-brand/10 text-brand" : "bg-muted",
                )}
              >
                {counts[tab.countKey]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
