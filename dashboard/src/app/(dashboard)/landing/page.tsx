import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { LandingEditor } from "@/components/forms/landing-editor";
import { getLandingConfig } from "@/lib/data/landing";
import { getCategories } from "@/lib/data/products";

export const metadata: Metadata = { title: "Home page" };

export default async function LandingPage() {
  const [config, categories] = await Promise.all([
    getLandingConfig(),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Landing Page Manager"
        description="Manage sections, slides, and product showcases for the homepage."
      />
      <LandingEditor
        config={config}
        categories={categories.map((c) => c.name)}
      />
    </div>
  );
}
