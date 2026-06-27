"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Save, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { saveLandingConfig } from "@/lib/actions/landing";
import type { LandingConfig } from "@/types/landing";

const urlField = z.union([z.literal(""), z.string().url("Enter a valid URL")]);

const formSchema = z.object({
  heroSlides: z
    .array(
      z.object({
        heading: z.string().trim().min(1, "Heading is required"),
        subheading: z.string().trim(),
        ctaText: z.string().trim(),
        ctaHref: z.string().trim(),
        imageUrl: urlField,
      }),
    )
    .min(1, "Add at least one slide")
    .max(8, "Up to 8 slides"),
  brandTagline: z.string().trim().max(160),
  featuredCategories: z.array(z.string()),
  lifestyleBlocks: z
    .array(
      z.object({
        heading: z.string().trim().min(1, "Heading is required"),
        subheading: z.string().trim(),
        ctaText: z.string().trim(),
        imageUrl: urlField,
      }),
    )
    .max(6, "Up to 6 blocks"),
});

type FormValues = z.infer<typeof formSchema>;

function toDefaults(config: LandingConfig): FormValues {
  return {
    heroSlides: config.heroSlides.map((s) => ({
      heading: s.heading,
      subheading: s.subheading,
      ctaText: s.ctaText,
      ctaHref: s.ctaHref,
      imageUrl: s.imageUrl ?? "",
    })),
    brandTagline: config.brandTagline,
    featuredCategories: config.featuredCategories,
    lifestyleBlocks: config.lifestyleBlocks.map((b) => ({
      heading: b.heading,
      subheading: b.subheading,
      ctaText: b.ctaText,
      imageUrl: b.imageUrl ?? "",
    })),
  };
}

export function LandingEditor({
  config,
  categories,
}: {
  config: LandingConfig;
  categories: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toDefaults(config),
    mode: "onBlur",
  });

  const hero = useFieldArray({ control, name: "heroSlides" });
  const lifestyle = useFieldArray({ control, name: "lifestyleBlocks" });

  const onSubmit = (values: FormValues) => {
    const input = {
      ...values,
      heroSlides: values.heroSlides.map((s) => ({
        ...s,
        imageUrl: s.imageUrl === "" ? null : s.imageUrl,
      })),
      lifestyleBlocks: values.lifestyleBlocks.map((b) => ({
        ...b,
        imageUrl: b.imageUrl === "" ? null : b.imageUrl,
      })),
    };
    startTransition(async () => {
      const result = await saveLandingConfig(input);
      if (result.ok) {
        toast.success("Landing page saved");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hero slider */}
      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Hero Section</h2>
            <p className="text-muted-foreground text-sm">
              Slides shown at the top of the homepage.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              hero.append({
                heading: "",
                subheading: "",
                ctaText: "",
                ctaHref: "",
                imageUrl: "",
              })
            }
            disabled={hero.fields.length >= 8}
          >
            <Plus className="size-4" />
            Add slide
          </Button>
        </div>
        {errors.heroSlides?.root && (
          <p className="text-destructive text-sm">
            {errors.heroSlides.root.message}
          </p>
        )}
        <div className="space-y-4">
          {hero.fields.map((field, i) => (
            <div
              key={field.id}
              className="border-border grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2"
            >
              <div className="space-y-2 sm:col-span-2">
                <Label>Heading *</Label>
                <Input {...register(`heroSlides.${i}.heading`)} />
                {errors.heroSlides?.[i]?.heading && (
                  <p className="text-destructive text-sm">
                    {errors.heroSlides[i]?.heading?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Subheading</Label>
                <Textarea rows={2} {...register(`heroSlides.${i}.subheading`)} />
              </div>
              <div className="space-y-2">
                <Label>CTA text</Label>
                <Input {...register(`heroSlides.${i}.ctaText`)} />
              </div>
              <div className="space-y-2">
                <Label>CTA link</Label>
                <Input placeholder="/products" {...register(`heroSlides.${i}.ctaHref`)} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Image URL</Label>
                <Input placeholder="https://…" {...register(`heroSlides.${i}.imageUrl`)} />
                {errors.heroSlides?.[i]?.imageUrl && (
                  <p className="text-destructive text-sm">
                    {errors.heroSlides[i]?.imageUrl?.message}
                  </p>
                )}
              </div>
              {hero.fields.length > 1 && (
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => hero.remove(i)}
                  >
                    <Trash2 className="size-4" />
                    Remove slide
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Brand tagline */}
      <Card className="gap-3 p-6">
        <h2 className="text-lg font-semibold">Brand tagline</h2>
        <Input
          placeholder="Efficiency in every corner of your life."
          {...register("brandTagline")}
        />
      </Card>

      {/* Featured categories */}
      <Card className="gap-3 p-6">
        <h2 className="text-lg font-semibold">Featured categories</h2>
        <Controller
          control={control}
          name="featuredCategories"
          render={({ field }) => (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {categories.map((cat) => {
                const checked = field.value.includes(cat);
                return (
                  <label key={cat} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) =>
                        field.onChange(
                          v
                            ? [...field.value, cat]
                            : field.value.filter((c) => c !== cat),
                        )
                      }
                    />
                    {cat}
                  </label>
                );
              })}
            </div>
          )}
        />
      </Card>

      {/* Lifestyle */}
      <Card className="gap-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lifestyle section</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              lifestyle.append({
                heading: "",
                subheading: "",
                ctaText: "",
                imageUrl: "",
              })
            }
            disabled={lifestyle.fields.length >= 6}
          >
            <Plus className="size-4" />
            Add block
          </Button>
        </div>
        {lifestyle.fields.length === 0 ? (
          <p className="text-muted-foreground flex items-center gap-2 text-sm">
            <ImageIcon className="size-4" /> No lifestyle blocks yet.
          </p>
        ) : (
          <div className="space-y-4">
            {lifestyle.fields.map((field, i) => (
              <div
                key={field.id}
                className="border-border grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2"
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label>Heading *</Label>
                  <Input {...register(`lifestyleBlocks.${i}.heading`)} />
                  {errors.lifestyleBlocks?.[i]?.heading && (
                    <p className="text-destructive text-sm">
                      {errors.lifestyleBlocks[i]?.heading?.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Subheading</Label>
                  <Textarea rows={2} {...register(`lifestyleBlocks.${i}.subheading`)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA text</Label>
                  <Input {...register(`lifestyleBlocks.${i}.ctaText`)} />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input placeholder="https://…" {...register(`lifestyleBlocks.${i}.imageUrl`)} />
                  {errors.lifestyleBlocks?.[i]?.imageUrl && (
                    <p className="text-destructive text-sm">
                      {errors.lifestyleBlocks[i]?.imageUrl?.message}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => lifestyle.remove(i)}
                  >
                    <Trash2 className="size-4" />
                    Remove block
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Publish changes
        </Button>
      </div>
    </form>
  );
}
