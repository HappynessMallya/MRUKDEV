import "server-only";
import type { LandingConfig } from "@/types/landing";
import type { LandingConfigInput } from "@/lib/validations";

const store: { config: LandingConfig } = {
  config: {
    heroSlides: [
      {
        heading: "Modern Living, Managed",
        subheading:
          "Discover our premium range of smart appliances and home appliances designed for the modern household.",
        ctaText: "Shop the Collection",
        ctaHref: "/products",
        imageUrl: null,
      },
    ],
    brandTagline: "Efficiency in every corner of your life.",
    featuredCategories: ["Home Appliances", "Kitchen Appliances"],
    lifestyleBlocks: [
      {
        heading: "Modern Living, Managed",
        subheading:
          "Discover our premium range of smart appliances designed for the modern household.",
        ctaText: "Learn More",
        imageUrl: null,
      },
    ],
    updatedAt: new Date().toISOString(),
  },
};

export async function getLandingConfig(): Promise<LandingConfig> {
  return store.config;
}

export function saveLandingConfigRecord(input: LandingConfigInput): LandingConfig {
  store.config = {
    heroSlides: input.heroSlides.map((s) => ({
      heading: s.heading,
      subheading: s.subheading,
      ctaText: s.ctaText,
      ctaHref: s.ctaHref,
      imageUrl: s.imageUrl ?? null,
    })),
    brandTagline: input.brandTagline,
    featuredCategories: input.featuredCategories,
    lifestyleBlocks: input.lifestyleBlocks.map((b) => ({
      heading: b.heading,
      subheading: b.subheading,
      ctaText: b.ctaText,
      imageUrl: b.imageUrl ?? null,
    })),
    updatedAt: new Date().toISOString(),
  };
  return store.config;
}
