// Full TypeScript shape of the tenant config returned by the backend.
// Mirrors the JSON schema described in /src/data/tenants/*.json.

export type Lang = 'en' | 'sw'

export type BilingualText = {
  en: string
  sw?: string
}

export interface TenantConfig {
  _id: { $oid: string }
  dateAdded: { $date: string }
  dateUpdated: { $date: string }
  identity: TenantIdentity
  lang: Lang[]
  defaultLang: Lang
  layout: string
  branding: TenantBranding
  commerce: TenantCommerce
  features: TenantFeatures
  cms: TenantCms
  global: TenantGlobal
  pages: TenantPages
}

export interface TenantIdentity {
  slug: string
  domain: string
  dbName: string
  isActive: boolean
  companyName: string
  legalName: string
  tinNumber: string
  poweredBy?: string
}

export interface TenantBranding {
  logos: {
    navbar: { light: string; dark: string }
    footer: string
    favicon: string
    og: string
  }
  colors: TenantColors
  gradients?: TenantGradients
  fonts: { heading: string; body: string }
  tailwindConfigName: string
}

export interface TenantColors {
  primary: string
  background: string
  surface: string
  surfaceAlt?: string
  border: string
  borderSubtle?: string
  foreground: string
  foregroundStrong?: string
  muted?: string
  placeholder?: string
}

export interface TenantGradients {
  heroOverlay?: string
  brandSweep?: string
  subtleSurface?: string
  [key: string]: string | undefined
}

export interface TenantCommerce {
  defaultCurrency: string
  supportedCurrencies: string[]
  taxRate: number
  taxLabel: BilingualText
  paymentMethods: string[]
  invoicePrefix: string
  proformaPrefix: string
  receiptPrefix: string
  loyaltyPointsRate: number
  loyaltyPointsPerAmount: number
}

export interface TenantFeatures {
  loyalty: boolean
  chatbot: boolean
  whatsapp: boolean
  distributorPortal: boolean
  serviceLocator: boolean
  productComparison: boolean
  wishlist: boolean
  reviews: boolean
  multiCurrency: boolean
  blogEnabled: boolean
  careersEnabled: boolean
  [key: string]: boolean
}

export interface TenantCms {
  lockedFields: string[]
  propagation: Record<string, string>
}

export interface TenantGlobal {
  navbar: NavbarConfig
  footer: FooterConfig
  contact: ContactConfig
}

export interface NavbarConfig {
  variant: string
  showSearch: boolean
  showCart: boolean
  showWishlist: boolean
  showLanguageSwitcher: boolean
  supportLink?: { label: BilingualText; href: string }
  cta: { enabled: boolean; label: BilingualText; href: string; style: string }
  auth: NavbarAuth
  links: NavLink[]
}

export interface NavbarAuth {
  signIn: BilingualText
  signUp: BilingualText
  userMenu: UserMenuItem[]
}

export interface UserMenuItem {
  id: string
  label: BilingualText
  href?: string
  action?: string
  featureFlag?: string
}

export interface NavLink {
  id: string
  label: BilingualText
  href: string
  featureFlag?: string
  megaMenu: MegaMenu | null
}

export interface MegaMenu {
  enabled: boolean
  columns: MegaMenuColumn[]
}

export type MegaMenuColumn =
  | MegaMenuCategoriesColumn
  | MegaMenuFeaturedProductsColumn
  | MegaMenuPromoBannerColumn

export interface MegaMenuCategoriesColumn {
  id: string
  type: 'categories'
  title: BilingualText
  items: CategoryItem[]
}

export interface MegaMenuFeaturedProductsColumn {
  id: string
  type: 'featured_products'
  title: BilingualText
  source: string
  sourceValue: string
  limit: number
}

export interface MegaMenuPromoBannerColumn {
  id: string
  type: 'promo_banner'
  banner: PromoBanner
}

export interface CategoryItem {
  id: string
  label: BilingualText
  href: string
  iconUrl: string
  subtitle?: BilingualText
}

export interface PromoBanner {
  tag: BilingualText
  title: BilingualText
  imageUrl: string
  cta: { label: BilingualText; href: string }
}

export interface FooterConfig {
  variant: string
  brand: {
    tagline: BilingualText
    socials: Record<string, string>
    contactDisplay: string[]
  }
  columns: FooterColumn[]
  bottomBar: { copyright: BilingualText; legalLinks: FooterLink[] }
}

export interface FooterColumn {
  id: string
  title: BilingualText
  links: FooterLink[]
}

export interface FooterLink {
  id: string
  label: BilingualText
  href: string
  featureFlag?: string
  external?: boolean
}

export interface ContactConfig {
  phones: ContactPhone[]
  emails: ContactEmail[]
  whatsapp?: string
  offices: Office[]
  hours: { timezone: string; schedule: HourSchedule[] }
  visibility: Record<string, string[]>
}

export interface ContactPhone {
  id: string
  value: string
  label: BilingualText
}
export interface ContactEmail {
  id: string
  value: string
  label: BilingualText
}

export interface Office {
  id: string
  isHQ: boolean
  name: BilingualText
  address: BilingualText
  city: BilingualText
  lat: number
  lng: number
  phones: string[]
}

export interface HourSchedule {
  id: string
  days: BilingualText
  open: string | null
  close: string | null
  closed: boolean
}

// Page-level config — only the structural envelope is typed here.
// Per-page sections/texts/settings are intentionally permissive so the backend
// can evolve copy and toggles without forcing a frontend redeploy.
export interface PageConfig {
  seo?: {
    title?: BilingualText
    description?: BilingualText
    titleTemplate?: BilingualText
    descriptionTemplate?: BilingualText
    ogImage?: string
  }
  texts?: Record<string, unknown>
  settings?: Record<string, unknown>
  sections?: PageSection[]
  featureFlag?: string
}

export interface PageSection {
  id: string
  type: string
  enabled: boolean
  order: number
  featureFlag?: string
  props: Record<string, unknown>
}

export interface TenantPages {
  home: PageConfig
  products: PageConfig
  product_detail: PageConfig
  comparison: PageConfig
  inquiry: PageConfig
  contact: PageConfig
  faq: PageConfig
  loyalty?: PageConfig
  distributors?: PageConfig
  service_locator?: PageConfig
  blog?: PageConfig
  legal: {
    privacy: PageConfig
    terms: PageConfig
    refund: PageConfig
    warranty: PageConfig
  }
  [key: string]: unknown
}
