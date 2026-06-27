export interface HeroSlide {
  heading: string;
  subheading: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string | null;
}

export interface LifestyleBlock {
  heading: string;
  subheading: string;
  ctaText: string;
  imageUrl: string | null;
}

export interface LandingConfig {
  heroSlides: HeroSlide[];
  brandTagline: string;
  featuredCategories: string[];
  lifestyleBlocks: LifestyleBlock[];
  updatedAt: string;
}
