"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DISTRIBUTOR_STATUSES } from "@/lib/validations";

const ALL = "__all";

interface DistributorFiltersProps {
  regions: string[];
  current: { status?: string; region?: string; search?: string };
}

export function DistributorFilters({
  regions,
  current,
}: DistributorFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(current.search ?? "");

  function setParam(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === ALL) params.delete(key);
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Filter by status</Label>
        <Select
          value={current.status ?? ALL}
          onValueChange={(v) => setParam({ status: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {DISTRIBUTOR_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Region</Label>
        <Select
          value={current.region ?? ALL}
          onValueChange={(v) => setParam({ region: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All regions</SelectItem>
            {regions.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs">Search</Label>
        <div className="relative">
          {isPending ? (
            <Loader2 className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin" />
          ) : (
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          )}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Distributors, IDs, or locations…"
            className="pl-9"
            aria-label="Search distributors"
          />
        </div>
      </div>
    </div>
  );
}
