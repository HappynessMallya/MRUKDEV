"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUrlInput } from "@/components/forms/image-url-input";
import { Checkbox } from "@/components/ui/checkbox";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { PRODUCT_STATUSES } from "@/lib/validations";
import type { Category, Product } from "@/types/product";

const formSchema = z.object({
  name: z.string().trim().min(1, "Product name is required").max(200),
  model: z.string().trim().min(1, "Model is required").max(80),
  category: z.string().trim().min(1, "Select a category"),
  subcategory: z.string().trim().min(1, "Select a subcategory"),
  status: z.enum(PRODUCT_STATUSES),
  inStock: z.boolean(),
  description: z.string().trim().max(4000),
  imageUrl: z.union([z.literal(""), z.string().url("Enter a valid URL")]),
  variants: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Variant name is required"),
        sku: z.string().trim().min(1, "SKU is required"),
        stock: z
          .number({ message: "Enter a number" })
          .int()
          .nonnegative("Can't be negative"),
        price: z
          .number({ message: "Enter a number" })
          .nonnegative("Can't be negative"),
        attributes: z.string().trim(), // comma-separated in the UI
      }),
    )
    .min(1, "Add at least one variant"),
  highlights: z.array(
    z.object({
      title: z.string().trim().min(1, "Title is required"),
      description: z.string().trim(),
    }),
  ),
  specifications: z.array(
    z.object({
      label: z.string().trim().min(1, "Label is required"),
      value: z.string().trim().min(1, "Value is required"),
    }),
  ),
});

type FormValues = z.infer<typeof formSchema>;

function toDefaults(product?: Product): FormValues {
  if (!product) {
    return {
      name: "",
      model: "",
      category: "",
      subcategory: "",
      status: "draft",
      inStock: true,
      description: "",
      imageUrl: "",
      variants: [{ name: "", sku: "", stock: 0, price: 0, attributes: "" }],
      highlights: [],
      specifications: [],
    };
  }
  return {
    name: product.name,
    model: product.model,
    category: product.category,
    subcategory: product.subcategory,
    status: product.status,
    inStock: product.inStock ?? true,
    description: product.description,
    imageUrl: product.imageUrl ?? "",
    variants: product.variants.map((v) => ({
      name: v.name,
      sku: v.sku,
      stock: v.stock,
      price: v.price,
      attributes: v.attributes.join(", "),
    })),
    highlights: product.highlights,
    specifications: product.specifications,
  };
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toDefaults(product),
    mode: "onBlur",
  });

  const variants = useFieldArray({ control, name: "variants" });
  const highlights = useFieldArray({ control, name: "highlights" });
  const specs = useFieldArray({ control, name: "specifications" });

  const selectedCategory = useWatch({ control, name: "category" });
  const subcategories =
    categories.find((c) => c.name === selectedCategory)?.subcategories ?? [];

  const onSubmit = (values: FormValues) => {
    const input = {
      ...values,
      imageUrl: values.imageUrl === "" ? null : values.imageUrl,
      variants: values.variants.map((v) => ({
        ...v,
        attributes: v.attributes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      })),
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, input)
        : await createProduct(input);

      if (result.ok) {
        toast.success(product ? "Product updated" : "Product created");
        router.push("/products");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Details */}
      <Card className="gap-5 p-6">
        <h2 className="text-lg font-semibold">Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product name *</Label>
            <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model *</Label>
            <Input id="model" {...register("model")} aria-invalid={!!errors.model} />
            {errors.model && (
              <p className="text-destructive text-sm">{errors.model.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Category *</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    setValue("subcategory", "");
                  }}
                >
                  <SelectTrigger className="w-full" aria-invalid={!!errors.category}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-destructive text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subcategory *</Label>
            <Controller
              control={control}
              name="subcategory"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!selectedCategory}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.subcategory}
                  >
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategories.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subcategory && (
              <p className="text-destructive text-sm">
                {errors.subcategory.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Controller
            control={control}
            name="inStock"
            render={({ field }) => (
              <Checkbox
                id="inStock"
                checked={field.value}
                onCheckedChange={(v) => field.onChange(v === true)}
              />
            )}
          />
          <Label htmlFor="inStock" className="cursor-pointer">
            In stock{" "}
            <span className="text-muted-foreground font-normal">
              — uncheck to show “Out of stock”
            </span>
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
        </div>

        <Controller
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <ImageUrlInput
              label="Cover image"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={errors.imageUrl?.message}
            />
          )}
        />
      </Card>

      {/* Variants */}
      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Variants</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              variants.append({
                name: "",
                sku: "",
                stock: 0,
                price: 0,
                attributes: "",
              })
            }
          >
            <Plus className="size-4" />
            Add variant
          </Button>
        </div>
        {errors.variants?.root && (
          <p className="text-destructive text-sm">{errors.variants.root.message}</p>
        )}
        <div className="space-y-4">
          {variants.fields.map((field, i) => (
            <div
              key={field.id}
              className="border-border grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2"
            >
              <div className="space-y-2 sm:col-span-2">
                <Label>Variant name *</Label>
                <Input
                  {...register(`variants.${i}.name`)}
                  aria-invalid={!!errors.variants?.[i]?.name}
                />
                {errors.variants?.[i]?.name && (
                  <p className="text-destructive text-sm">
                    {errors.variants[i]?.name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  {...register(`variants.${i}.sku`)}
                  aria-invalid={!!errors.variants?.[i]?.sku}
                />
                {errors.variants?.[i]?.sku && (
                  <p className="text-destructive text-sm">
                    {errors.variants[i]?.sku?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Attributes (comma-separated)</Label>
                <Input
                  placeholder='e.g. 55", Silver'
                  {...register(`variants.${i}.attributes`)}
                />
              </div>
              <div className="space-y-2">
                <Label>Stock *</Label>
                <Input
                  type="number"
                  {...register(`variants.${i}.stock`, { valueAsNumber: true })}
                  aria-invalid={!!errors.variants?.[i]?.stock}
                />
                {errors.variants?.[i]?.stock && (
                  <p className="text-destructive text-sm">
                    {errors.variants[i]?.stock?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Unit price (TSh) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register(`variants.${i}.price`, { valueAsNumber: true })}
                  aria-invalid={!!errors.variants?.[i]?.price}
                />
                {errors.variants?.[i]?.price && (
                  <p className="text-destructive text-sm">
                    {errors.variants[i]?.price?.message}
                  </p>
                )}
              </div>
              {variants.fields.length > 1 && (
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => variants.remove(i)}
                  >
                    <Trash2 className="size-4" />
                    Remove variant
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Highlights */}
      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Highlight features</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => highlights.append({ title: "", description: "" })}
          >
            <Plus className="size-4" />
            Add highlight
          </Button>
        </div>
        {highlights.fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">No highlights added.</p>
        ) : (
          <div className="space-y-3">
            {highlights.fields.map((field, i) => (
              <div
                key={field.id}
                className="border-border grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_2fr_auto]"
              >
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input {...register(`highlights.${i}.title`)} />
                  {errors.highlights?.[i]?.title && (
                    <p className="text-destructive text-sm">
                      {errors.highlights[i]?.title?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input {...register(`highlights.${i}.description`)} />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => highlights.remove(i)}
                    aria-label="Remove highlight"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Specifications */}
      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">General specifications</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => specs.append({ label: "", value: "" })}
          >
            <Plus className="size-4" />
            Add specification
          </Button>
        </div>
        {specs.fields.length === 0 ? (
          <p className="text-muted-foreground text-sm">No specifications added.</p>
        ) : (
          <div className="space-y-3">
            {specs.fields.map((field, i) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]"
              >
                <div className="space-y-2">
                  <Label>Label *</Label>
                  <Input {...register(`specifications.${i}.label`)} />
                  {errors.specifications?.[i]?.label && (
                    <p className="text-destructive text-sm">
                      {errors.specifications[i]?.label?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Value *</Label>
                  <Input {...register(`specifications.${i}.value`)} />
                  {errors.specifications?.[i]?.value && (
                    <p className="text-destructive text-sm">
                      {errors.specifications[i]?.value?.message}
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => specs.remove(i)}
                    aria-label="Remove specification"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/products")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : product ? (
            "Save changes"
          ) : (
            "Create product"
          )}
        </Button>
      </div>
    </form>
  );
}
