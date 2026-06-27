"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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
import type { Category } from "@/types/product";

const ALL = "__all";

interface ProductFiltersProps {
  categories: Category[];
  current: { search?: string; category?: string; subcategory?: string };
}

export function ProductFilters({ categories, current }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(current.search ?? "");

  const selectedCategory = categories.find((c) => c.name === current.category);

  function setParam(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (!value || value === ALL) params.delete(key);
      else params.set(key, value);
    }
    params.delete("page"); // reset to first page on any filter change
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }

  // Debounced search → URL.
  useEffect(() => {
    const handle = setTimeout(() => {
      if ((current.search ?? "") !== search) setParam({ search });
    }, 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Filter by category</Label>
          <Select
            value={current.category ?? ALL}
            onValueChange={(v) =>
              setParam({ category: v, subcategory: undefined })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">Filter by subcategory</Label>
          <Select
            value={current.subcategory ?? ALL}
            onValueChange={(v) => setParam({ subcategory: v })}
            disabled={!selectedCategory}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All subcategories</SelectItem>
              {selectedCategory?.subcategories.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        {isPending ? (
          <Loader2 className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2 animate-spin" />
        ) : (
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        )}
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Product name, model, or SKU…"
          className="pl-9"
          aria-label="Search products"
        />
      </div>
    </div>
  );
}
