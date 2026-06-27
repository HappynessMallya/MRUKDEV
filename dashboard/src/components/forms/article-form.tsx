"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUrlInput } from "@/components/forms/image-url-input";
import { createArticle, updateArticle } from "@/lib/actions/articles";
import { ARTICLE_STATUSES } from "@/lib/validations";
import { ARTICLE_CATEGORIES, type Article } from "@/types/article";

const formSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(200),
    author: z.string().trim().min(1, "Author is required").max(120),
    excerpt: z.string().trim().max(400),
    body: z.string().trim().min(1, "Article body can't be empty"),
    coverImageUrl: z.union([z.literal(""), z.string().url("Enter a valid URL")]),
    categories: z.array(z.string()),
    status: z.enum(ARTICLE_STATUSES),
    visibility: z.enum(["public", "private"]),
    scheduledFor: z.string(),
  })
  .refine((v) => v.status !== "scheduled" || v.scheduledFor !== "", {
    message: "Pick a publish date",
    path: ["scheduledFor"],
  });

type FormValues = z.infer<typeof formSchema>;

function toLocalDatetime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
}

function toDefaults(article?: Article): FormValues {
  return {
    title: article?.title ?? "",
    author: article?.author ?? "",
    excerpt: article?.excerpt ?? "",
    body: article?.body ?? "",
    coverImageUrl: article?.coverImageUrl ?? "",
    categories: article?.categories ?? [],
    status: article?.status ?? "draft",
    visibility: article?.visibility ?? "public",
    scheduledFor: toLocalDatetime(article?.scheduledFor ?? null),
  };
}

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: toDefaults(article),
    mode: "onBlur",
  });

  function submit(values: FormValues, overrideStatus?: "draft" | "published") {
    const status = overrideStatus ?? values.status;
    const input = {
      title: values.title,
      author: values.author,
      excerpt: values.excerpt,
      body: values.body,
      coverImageUrl: values.coverImageUrl === "" ? null : values.coverImageUrl,
      categories: values.categories,
      status,
      visibility: values.visibility,
      scheduledFor:
        status === "scheduled" && values.scheduledFor
          ? new Date(values.scheduledFor).toISOString()
          : null,
    };

    startTransition(async () => {
      const result = article
        ? await updateArticle(article.id, input)
        : await createArticle(input);
      if (result.ok) {
        toast.success(article ? "Article saved" : "Article created");
        router.push("/articles");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit((v) => submit(v))}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]"
    >
      {/* Main */}
      <div className="space-y-6">
        <Card className="gap-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter article title…"
              {...register("title")}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" rows={2} {...register("excerpt")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body *</Label>
            <Textarea
              id="body"
              rows={16}
              placeholder="Start writing your story… (plain text / markdown)"
              className="font-mono text-sm"
              {...register("body")}
              aria-invalid={!!errors.body}
            />
            {errors.body && (
              <p className="text-destructive text-sm">{errors.body.message}</p>
            )}
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        <Card className="gap-4 p-6">
          <h3 className="font-semibold">Publishing</h3>
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input id="author" {...register("author")} aria-invalid={!!errors.author} />
            {errors.author && (
              <p className="text-destructive text-sm">{errors.author.message}</p>
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
                    {ARTICLE_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Controller
            control={control}
            name="status"
            render={({ field: statusField }) =>
              statusField.value === "scheduled" ? (
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Schedule for</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    {...register("scheduledFor")}
                    aria-invalid={!!errors.scheduledFor}
                  />
                  {errors.scheduledFor && (
                    <p className="text-destructive text-sm">
                      {errors.scheduledFor.message}
                    </p>
                  )}
                </div>
              ) : (
                <></>
              )
            }
          />
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </Card>

        <Card className="gap-3 p-6">
          <h3 className="font-semibold">Featured image</h3>
          <Controller
            control={control}
            name="coverImageUrl"
            render={({ field }) => (
              <ImageUrlInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.coverImageUrl?.message}
              />
            )}
          />
        </Card>

        <Card className="gap-3 p-6">
          <h3 className="font-semibold">Categories</h3>
          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <div className="space-y-2">
                {ARTICLE_CATEGORIES.map((cat) => {
                  const checked = field.value.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-2 text-sm"
                    >
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

        <div className="flex flex-col gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            {article ? "Save changes" : "Save article"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={handleSubmit((v) => submit(v, "draft"))}
          >
            <Save className="size-4" />
            Save as draft
          </Button>
        </div>
      </div>
    </form>
  );
}
