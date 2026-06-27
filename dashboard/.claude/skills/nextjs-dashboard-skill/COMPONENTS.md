COMPONENTS.md — Reusable Component Patterns
SIDEBAR COMPONENT
// components/dashboard/Sidebar.tsx

"use client";

import { usePathname } from "next/navigation";

import Link from "next/link";

import { cn } from "@/lib/utils";

import {

  LayoutDashboard, Package, ShoppingCart,

  Users, FolderOpen, Image, Settings

} from "lucide-react";

const navItems = [

  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },

  { href: "/dashboard/products", icon: Package, label: "Products" },

  { href: "/dashboard/orders", icon: ShoppingCart, label: "Orders" },

  { href: "/dashboard/customers", icon: Users, label: "Customers" },

  { href: "/dashboard/categories", icon: FolderOpen, label: "Categories" },

  { href: "/dashboard/media", icon: Image, label: "Media" },

  { href: "/dashboard/settings", icon: Settings, label: "Settings" },

];

export function Sidebar() {

  const pathname = usePathname();

  return (

    <aside className="w-60 h-screen bg-sidebar fixed left-0 top-0 flex flex-col border-r">

      <div className="p-6 border-b">

        <h1 className="font-bold text-xl">Store Admin</h1>

      </div>

      <nav className="flex-1 p-4 space-y-1">

        {navItems.map(({ href, icon: Icon, label }) => (

          <Link

            key={href}

            href={href}

            className={cn(

              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",

              pathname === href

                ? "bg-primary text-primary-foreground"

                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"

            )}

          >

            <Icon className="h-4 w-4" />

            {label}

          </Link>

        ))}

      </nav>

    </aside>

  );

}


DATA TABLE PATTERN
// components/dashboard/DataTable.tsx

"use client";

import {

  useReactTable, getCoreRowModel, flexRender,

  ColumnDef, PaginationState,

} from "@tanstack/react-table";

import { useState } from "react";

import { Button } from "@/components/ui/button";

interface DataTableProps<T> {

  columns: ColumnDef<T>[];

  data: T[];

  total: number;

  onPageChange: (page: number) => void;

  isLoading?: boolean;

}

export function DataTable<T>({ columns, data, total, onPageChange, isLoading }: DataTableProps<T>) {

  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 20 });

  const table = useReactTable({

    data,

    columns,

    pageCount: Math.ceil(total / pagination.pageSize),

    state: { pagination },

    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,

  });

  if (isLoading) return <TableSkeleton />;

  return (

    <div className="space-y-4">

      <div className="rounded-md border">

        <table className="w-full">

          <thead>

            {table.getHeaderGroups().map(headerGroup => (

              <tr key={headerGroup.id} className="border-b bg-muted/50">

                {headerGroup.headers.map(header => (

                  <th key={header.id} className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">

                    {flexRender(header.column.columnDef.header, header.getContext())}

                  </th>

                ))}

              </tr>

            ))}

          </thead>

          <tbody>

            {table.getRowModel().rows.length === 0 ? (

              <tr><td colSpan={columns.length} className="h-32 text-center text-muted-foreground">No results found.</td></tr>

            ) : (

              table.getRowModel().rows.map(row => (

                <tr key={row.id} className="border-b hover:bg-muted/30 transition-colors">

                  {row.getVisibleCells().map(cell => (

                    <td key={cell.id} className="px-4 py-3 text-sm">

                      {flexRender(cell.column.columnDef.cell, cell.getContext())}

                    </td>

                  ))}

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex items-center justify-between">

        <p className="text-sm text-muted-foreground">

          Showing {pagination.pageIndex * pagination.pageSize + 1}–

          {Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)} of {total}

        </p>

        <div className="flex gap-2">

          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>

          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>

        </div>

      </div>

    </div>

  );

}

function TableSkeleton() {

  return (

    <div className="rounded-md border animate-pulse">

      {Array.from({ length: 5 }).map((_, i) => (

        <div key={i} className="h-14 border-b bg-muted/20 m-2 rounded" />

      ))}

    </div>

  );

}


PRODUCT FORM PATTERN
// components/forms/ProductForm.tsx

"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { updateProduct } from "@/lib/actions/products";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { Loader2 } from "lucide-react";

const schema = z.object({

  name: z.string().min(1, "Name is required").max(200),

  price: z.coerce.number().positive("Price must be positive"),

  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),

  description: z.string().optional(),

});

type FormData = z.infer<typeof schema>;

export function ProductForm({ product }: { product?: Partial<FormData> & { id?: string } }) {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({

    resolver: zodResolver(schema),

    defaultValues: product,

  });

  const onSubmit = async (data: FormData) => {

    const result = await updateProduct(product?.id ?? "", data);

    if (result.error) {

      toast.error(result.error);

    } else {

      toast.success("Product saved successfully!");

    }

  };

  return (

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">

      <div className="space-y-2">

        <Label htmlFor="name">Product Name *</Label>

        <Input id="name" {...register("name")} />

        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}

      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="space-y-2">

          <Label htmlFor="price">Price (USD) *</Label>

          <Input id="price" type="number" step="0.01" {...register("price")} />

          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}

        </div>

        <div className="space-y-2">

          <Label htmlFor="stock">Stock *</Label>

          <Input id="stock" type="number" {...register("stock")} />

          {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}

        </div>

      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">

        {isSubmitting ? (

          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>

        ) : "Save Product"}

      </Button>

    </form>

  );

}


STATS CARD PATTERN
// components/dashboard/StatsCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatsCardProps {

  title: string;

  value: string | number;

  change?: number; // percentage change vs last period

  icon: LucideIcon;

  className?: string;

}

export function StatsCard({ title, value, change, icon: Icon, className }: StatsCardProps) {

  const isPositive = change !== undefined && change >= 0;

  return (

    <Card className={cn("", className)}>

      <CardHeader className="flex flex-row items-center justify-between pb-2">

        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>

        <Icon className="h-4 w-4 text-muted-foreground" />

      </CardHeader>

      <CardContent>

        <div className="text-2xl font-bold">{value}</div>

        {change !== undefined && (

          <p className={cn("text-xs mt-1", isPositive ? "text-green-600" : "text-red-600")}>

            {isPositive ? "+" : ""}{change}% from last month

          </p>

        )}

      </CardContent>

    </Card>

  );

}


CONFIRM DELETE MODAL
// components/dashboard/DeleteDialog.tsx

"use client";

import {

  AlertDialog, AlertDialogAction, AlertDialogCancel,

  AlertDialogContent, AlertDialogDescription,

  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,

} from "@/components/ui/alert-dialog";

interface DeleteDialogProps {

  open: boolean;

  onOpenChange: (open: boolean) => void;

  onConfirm: () => void;

  itemName: string;

}

export function DeleteDialog({ open, onOpenChange, onConfirm, itemName }: DeleteDialogProps) {

  return (

    <AlertDialog open={open} onOpenChange={onOpenChange}>

      <AlertDialogContent>

        <AlertDialogHeader>

          <AlertDialogTitle>Delete {itemName}?</AlertDialogTitle>

          <AlertDialogDescription>

            This action cannot be undone. This will permanently delete this {itemName.toLowerCase()} from your store.

          </AlertDialogDescription>

        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">

            Delete

          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );

}

