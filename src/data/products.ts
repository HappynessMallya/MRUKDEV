import type { Product } from '@/types/product'

// Mock product catalog. Replace with `useProduct(slug)` once the backend is
// live. The shape mirrors what the API will return so the swap is mostly the
// data source — components stay the same.

const PRODUCTS: Record<string, Product> = {
  // Frame 204+205 hero microwave used as the canonical "rich PDP" reference.
  // Uses the /products/kitchen/microwave/{1..6}.png hero gallery and
  // /products/kitchen/microwave/dis{...}.png discover row. Subcategory is
  // `microwaves` so it surfaces under the Kitchen Appliances › Microwaves tile.
  p605tmswd: {
    id: 'p605tmswd',
    slug: 'p605tmswd',
    name: { en: 'P605TMSWD Top Mounted Refrigerator' },
    model: 'P605TMSWD',
    category: 'kitchen',
    sub: 'microwaves',
    // Catalog thumbnail lives at the category root; deep PDP gallery uses the
    // /microwave/ subfolder so the rich photo set stays scoped to this SKU.
    listImage: '/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20black.svg',
    images: [
      '/products/kitchen/microwave/1.png',
      '/products/kitchen/microwave/2.png',
      '/products/kitchen/microwave/3.png',
      '/products/kitchen/microwave/4.png',
      '/products/kitchen/microwave/5.png',
      '/products/kitchen/microwave/6.png',
    ],
    featureBullets: [
      { en: 'Total no frost' },
      { en: 'Electronic Control' },
      { en: 'LED light' },
      { en: 'Humidity care crisper' },
      { en: 'Recessed handle without lock' },
    ],
    colors: [
      { id: 'black', label: { en: 'Black' }, hex: '#1A1A1A' },
      { id: 'silver', label: { en: 'Silver' }, hex: '#C7CCD1' },
    ],
    isAvailable: true,
    highlightIcons: [
      { id: 'h1', iconName: '/icons/1.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h2', iconName: '/icons/2.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h3', iconName: '/icons/3.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h4', iconName: '/icons/4.svg', label: { en: 'Digital Invetor motor' } },
    ],
    characteristics: [
      {
        id: 'c1',
        title: { en: 'Powerful & Efficient Heating' },
        subtitle: { en: 'Fast, Even Cooking Performance' },
        description: {
          en:
            'Enjoy quick and consistent results with powerful heating designed for everyday convenience. The microwave delivers efficient energy distribution to ensure your food is heated evenly, saving time while maintaining great taste and quality',
        },
        imageUrl: '/products/kitchen/microwave/2.png',
        layout: 'stacked',
      },
      {
        id: 'c2',
        title: { en: 'Versatile Grill Function' },
        subtitle: { en: 'More Than Just Heating' },
        description: {
          en:
            'Unlock more cooking possibilities with a built-in grill feature that adds a perfect finish to your meals. Enjoy enhanced flavor and texture with ease.',
        },
        imageUrl: '/products/kitchen/microwave/3.png',
        layout: 'stacked',
      },
      {
        id: 'c3',
        title: { en: 'Durable & Reliable Build' },
        subtitle: { en: 'Built to Last, Designed to Perform' },
        description: {
          en:
            'Crafted with high-quality materials and a strong glass door, this microwave is designed for long-lasting performance. Enjoy dependable operation you can trust every day',
        },
        imageUrl: '/products/kitchen/microwave/4.png',
        layout: 'image-right',
      },
      {
        id: 'c4',
        title: { en: 'Modern & Elegant Design' },
        subtitle: { en: 'Sleek. Minimal. Timeless' },
        description: {
          en:
            'A refined grey finish and minimalist design create a sophisticated look that complements modern living spaces effortlessly.',
        },
        imageUrl: '/products/kitchen/microwave/5.png',
        layout: 'image-left',
      },
      {
        id: 'c5',
        title: { en: '10 Adjustable Power Levels' },
        subtitle: { en: 'Precision Control for Every Meal' },
        description: {
          en:
            'Easily adjust the power to suit different foods and cooking needs. From gentle defrosting to high-power heating, enjoy precise control that delivers consistent and reliable results every time',
        },
        imageUrl: '/products/kitchen/microwave/6.png',
        layout: 'stacked',
      },
    ],
    specifications: [
      { id: 's1', label: { en: 'Power capacity' }, value: { en: '230-240 V / 50 Hz' } },
      { id: 's2', label: { en: 'Power Consumption' }, value: { en: '1500 W' } },
      { id: 's3', label: { en: 'Power Consumption (Max)' }, value: { en: '2900 - 3050 W' } },
      { id: 's4', label: { en: 'Dimension' }, value: { en: '357 × 255 × 357 mm' } },
      { id: 's5', label: { en: 'Oven Capacity' }, value: { en: '32 litre' } },
      { id: 's6', label: { en: 'Weight' }, value: { en: '17.2 kg' } },
      { id: 's7', label: { en: 'Door type' }, value: { en: 'Recessed Handle' } },
      { id: 's8', label: { en: 'Color' }, value: { en: 'Black, White' } },
    ],
    relatedSlugs: ['mw-32l-black-2', 'mw-32l-black-3', 'kt-32l-black', 'kt-32l-white'],
  },

  // Two more microwave variants in the Kitchen › Microwaves subcategory list.
  // They reuse the same featureBullets as p605tmswd; each has its own SVG.
  'mw-32l-black-2': {
    id: 'mw-32l-black-2',
    slug: 'mw-32l-black-2',
    name: { en: '32L Microwave Oven Quick Defrost Black' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20blac2.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'mw-32l-black-3': {
    id: 'mw-32l-black-3',
    slug: 'mw-32l-black-3',
    name: { en: '32L Microwave Oven Quick Defrost Black' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20Black3.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },

  // Kettles subcategory.
  'kt-32l-black': {
    id: 'kt-32l-black',
    slug: 'kt-32l-black',
    name: { en: '32L Kettle Oven Quick Defrost Black' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'kettles',
    images: ['/products/kitchen/32L%20kittle%20Oven%20Quick%20Defrost%20Black.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'kt-32l-white': {
    id: 'kt-32l-white',
    slug: 'kt-32l-white',
    name: { en: '32L Kettle Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'kettles',
    images: ['/products/kitchen/32L%20kittle%20Oven%20Quick%20Defrost%20White.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },

  // Refrigerator subcategory — nine SKUs (paths URL-encoded because the
  // folder name has `&` and the filenames have spaces and an en-dash).
  'sky-43-9wd': {
    id: 'sky-43-9wd',
    slug: 'sky-43-9wd',
    name: { en: 'SKY 43-9WD – BLack Inox' },
    model: 'SKY 43-9WD',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY%2043-9WD%20%E2%80%93%20BLack%20Inox.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '439L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-50-5bi': {
    id: 'sky-50-5bi',
    slug: 'sky-50-5bi',
    name: { en: 'SKY-50-5BI – Black Inox' },
    model: 'SKY-50-5BI',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-50-5BI%20%E2%80%93%20Black%20Inox.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '423L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-32-black-inox': {
    id: 'sky-32-black-inox',
    slug: 'sky-32-black-inox',
    name: { en: 'SKY -32-Black Inox' },
    model: 'MS23K3513AW/SG',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY%20-32-Black%20Inox.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '320L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'combi-style-no-frost': {
    id: 'combi-style-no-frost',
    slug: 'combi-style-no-frost',
    name: { en: 'Combi Style No Frost' },
    model: 'SKY-24-6BI',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/Combi%20Style%20No%20Frost.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-10-8i': {
    id: 'sky-10-8i',
    slug: 'sky-10-8i',
    name: { en: 'SKY-10-8I RefrigeratorDefrost White' },
    model: 'SKY-10-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-10-8I%20RefrigeratorDefrost%20White.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-13-8i': {
    id: 'sky-13-8i',
    slug: 'sky-13-8i',
    name: { en: 'SKY-13-8I Freezer Defrost White' },
    model: 'SKY-13-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-13-8I%20Freezer%20Defrost%20White.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-17-3bg': {
    id: 'sky-17-3bg',
    slug: 'sky-17-3bg',
    name: { en: 'SKY-17-3BG Refrigerator' },
    model: 'SKY-17-3BG',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-17-3BG%20Refrigerator.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-10-8i-2': {
    id: 'sky-10-8i-2',
    slug: 'sky-10-8i-2',
    name: { en: 'SKY-10-8I RefrigeratorDefrost White' },
    model: 'SKY-10-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-10-8I%20RefrigeratorDefrost%20White2.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'sky-13-8i-2': {
    id: 'sky-13-8i-2',
    slug: 'sky-13-8i-2',
    name: { en: 'SKY-13-8I Freezer Defrost White' },
    model: 'SKY-13-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-13-8I%20Freezer%20Defrost%20White2.svg'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },

}

export function getProduct(slug: string): Product | null {
  return PRODUCTS[slug] ?? null
}

export function listAllSlugs(): string[] {
  return Object.keys(PRODUCTS)
}

export function getAllProducts(): Product[] {
  return Object.values(PRODUCTS)
}

export function getProductsByCategory(
  category: string | null | undefined,
  sub?: string | null
): Product[] {
  let list = getAllProducts()
  if (category) list = list.filter((p) => p.category === category)
  if (sub) list = list.filter((p) => p.sub === sub)
  return list
}

// Canonical category list — slugs match the URL ?category=… query param and
// the navbar/footer links. Keep in sync with `branding.tabs` if those move
// into the JSON later.
export interface CategoryEntry {
  slug: string
  label: { en: string; sw?: string }
}

export const CATEGORIES: CategoryEntry[] = [
  { slug: 'kitchen', label: { en: 'Kitchen Appliances', sw: 'Vifaa vya Jikoni' } },
  { slug: 'music', label: { en: 'Music Systems', sw: 'Mifumo ya Muziki' } },
  { slug: 'refrigerator-ac', label: { en: 'Refrigerators & AC', sw: 'Friji na Viyoyozi' } },
  { slug: 'agriculture', label: { en: 'Agricultural Appliances', sw: 'Vifaa vya Kilimo' } },
]

export function getCategoryLabel(slug: string): { en: string; sw?: string } | null {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? null
}

// Subcategory tiles shown on the category landing band (Frame 25 in Figma).
// Image paths reuse existing product mocks until real subcategory art ships.
export interface SubcategoryEntry {
  slug: string
  label: { en: string; sw?: string }
  imageUrl: string
}

export const SUBCATEGORIES: Record<string, SubcategoryEntry[]> = {
  kitchen: [
    { slug: 'microwaves', label: { en: 'Microwaves' }, imageUrl: '/categories/nav/microwaves.svg' },
    { slug: 'blender', label: { en: 'Blender' }, imageUrl: '/categories/nav/blender.svg' },
    { slug: 'air-fryer', label: { en: 'Air Fryer' }, imageUrl: '/categories/nav/air-friers.svg' },
    { slug: 'cookers', label: { en: 'Cookers' }, imageUrl: '/categories/nav/cookers.svg' },
    { slug: 'kettles', label: { en: 'Kettles' }, imageUrl: '/categories/nav/kettles.svg' },
    { slug: 'gas-stove', label: { en: 'Electric & Gas stove' }, imageUrl: '/categories/nav/Electric%20%26%20Gas%20stove.svg' },
  ],
  music: [
    { slug: 'music-systems', label: { en: 'Music systems' }, imageUrl: '/categories/nav/music.svg' },
  ],
  'refrigerator-ac': [
    { slug: 'refrigerator', label: { en: 'Refrigarator' }, imageUrl: '/categories/nav/freezer.svg' },
    { slug: 'air-conditioning', label: { en: 'Air conditioning' }, imageUrl: '/categories/nav/ac.svg' },
  ],
  agriculture: [
    { slug: 'water-pumps', label: { en: 'Water pumps' }, imageUrl: '/categories/nav/water-pump.svg' },
    { slug: 'generators', label: { en: 'Generators' }, imageUrl: '/categories/nav/generator.svg' },
    { slug: 'pvc-hoses', label: { en: 'PVC hoses' }, imageUrl: '/categories/nav/pvs-horses.svg' },
    { slug: 'garden-hoses', label: { en: 'Garden hoses' }, imageUrl: '/categories/nav/garnen-horses.svg' },
  ],
}

export function getSubcategories(category: string | null | undefined): SubcategoryEntry[] {
  if (!category) return []
  return SUBCATEGORIES[category] ?? []
}
