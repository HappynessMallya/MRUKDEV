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
    listImage: '/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20black.png',
    images: [
      '/products/kitchen/microwave/m1.png',
      '/products/kitchen/microwave/m2.png',
      '/products/kitchen/microwave/m3.png',
      '/products/kitchen/microwave/m4.png',
      '/products/kitchen/microwave/m5.png',
      '/products/kitchen/microwave/m6.png',
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
    compareSpecs: {
      netTotal: '32 litre',
      dimension: '357*255*357',
      color: 'Black',
      energyClass: 'A',
      type: 'Convection',
    },
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
    images: ['/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20blac2.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '32 litre',
      dimension: '357*255*357',
      color: 'Black',
      energyClass: 'A',
      type: 'Grill',
    },
  },
  'mw-32l-black-3': {
    id: 'mw-32l-black-3',
    slug: 'mw-32l-black-3',
    name: { en: '32L Microwave Oven Quick Defrost Black' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/products/kitchen/32L%20Microwave%20Oven%20Quick%20Defrost%20Black3.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '32 litre',
      dimension: '357*255*357',
      color: 'Black',
      energyClass: 'A',
      type: 'Solo',
    },
  },

  // Kettles subcategory.
  'kt-32l-black': {
    id: 'kt-32l-black',
    slug: 'kt-32l-black',
    name: { en: '32L Kettle Oven Quick Defrost Black' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'kettles',
    images: ['/products/kitchen/32L%20kittle%20Oven%20Quick%20Defrost%20Black.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '1.7 litre',
      dimension: '220*150*250',
      color: 'Black',
      energyClass: 'A',
      type: 'Kettle',
    },
  },
  'kt-32l-white': {
    id: 'kt-32l-white',
    slug: 'kt-32l-white',
    name: { en: '32L Kettle Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'kettles',
    images: ['/products/kitchen/32L%20kittle%20Oven%20Quick%20Defrost%20White.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '1.7 litre',
      dimension: '220*150*250',
      color: 'White',
      energyClass: 'A',
      type: 'Kettle',
    },
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
    images: ['/products/refrigirator%26ac/SKY%2043-9WD%20%E2%80%93%20BLack%20Inox.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '439L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '439 litre',
      dimension: '91*50*177',
      color: 'Black',
      energyClass: 'F',
      type: 'Convection',
    },
  },
  'sky-50-5bi': {
    id: 'sky-50-5bi',
    slug: 'sky-50-5bi',
    name: { en: 'SKY-50-5BI – Black Inox' },
    model: 'SKY-50-5BI',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-50-5BI%20%E2%80%93%20Black%20Inox.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '423L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '423 litre',
      dimension: '79*60*190',
      color: 'Black',
      energyClass: 'E',
      type: 'Grill',
    },
  },
  'sky-32-black-inox': {
    id: 'sky-32-black-inox',
    slug: 'sky-32-black-inox',
    name: { en: 'SKY -32-Black Inox' },
    model: 'SKY -32',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY%20-32-Black%20Inox.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '320L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '320 litre',
      dimension: '64*67*186',
      color: 'Black',
      energyClass: 'D',
      type: 'Oven',
    },
  },
  'combi-style-no-frost': {
    id: 'combi-style-no-frost',
    slug: 'combi-style-no-frost',
    name: { en: 'Combi Style No Frost' },
    model: 'SKY-24-6BI',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/Combi%20Style%20No%20Frost.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '320 litre',
      dimension: '70*65*180',
      color: 'Black',
      energyClass: 'D',
      type: 'No Frost',
    },
  },
  'sky-10-8i': {
    id: 'sky-10-8i',
    slug: 'sky-10-8i',
    name: { en: 'SKY-10-8I RefrigeratorDefrost White' },
    model: 'SKY-10-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-10-8I%20RefrigeratorDefrost%20White.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '108 litre',
      dimension: '55*52*84',
      color: 'White',
      energyClass: 'A',
      type: 'Defrost',
    },
  },
  'sky-13-8i': {
    id: 'sky-13-8i',
    slug: 'sky-13-8i',
    name: { en: 'SKY-13-8I Freezer Defrost White' },
    model: 'SKY-13-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-13-8I%20Freezer%20Defrost%20White.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '138 litre',
      dimension: '60*55*86',
      color: 'White',
      energyClass: 'B',
      type: 'Defrost',
    },
  },
  'sky-17-3bg': {
    id: 'sky-17-3bg',
    slug: 'sky-17-3bg',
    name: { en: 'SKY-17-3BG Refrigerator' },
    model: 'SKY-17-3BG',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-17-3BG%20Refrigerator.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '173 litre',
      dimension: '60*55*88',
      color: 'Brown',
      energyClass: 'C',
      type: 'Defrost',
    },
  },
  'sky-10-8i-2': {
    id: 'sky-10-8i-2',
    slug: 'sky-10-8i-2',
    name: { en: 'SKY-10-8I RefrigeratorDefrost White' },
    model: 'SKY-10-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-10-8I%20RefrigeratorDefrost%20White2.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '108 litre',
      dimension: '55*52*84',
      color: 'Silver',
      energyClass: 'A',
      type: 'Defrost',
    },
  },
  'sky-13-8i-2': {
    id: 'sky-13-8i-2',
    slug: 'sky-13-8i-2',
    name: { en: 'SKY-13-8I Freezer Defrost White' },
    model: 'SKY-13-8I',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/refrigirator%26ac/SKY-13-8I%20Freezer%20Defrost%20White2.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '138 litre',
      dimension: '60*55*86',
      color: 'Cream',
      energyClass: 'B',
      type: 'Defrost',
    },
  },

  // ────────────────────────────────────────────────────────────────────
  //  PLACEHOLDER PRODUCTS — Music + Agriculture
  //  Imagery is sourced from Unsplash (free for commercial use) until the
  //  real catalog photography is supplied. When the official assets land,
  //  swap the `listImage` URLs for `/products/<category>/<sku>.png`.
  // ────────────────────────────────────────────────────────────────────

  // Music systems
  'sb-q65c': {
    id: 'sb-q65c',
    slug: 'sb-q65c',
    name: { en: 'Q65C Home Theatre Soundbar' },
    model: 'Q65C',
    category: 'music',
    sub: 'soundbars',
    listImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: 'Dolby Atmos surround' },
      { en: 'Wireless subwoofer' },
      { en: 'HDMI eARC + Bluetooth 5.2' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '5.1.2 ch',
      dimension: '1100*70*120',
      color: 'Black',
      energyClass: 'A',
      type: 'Soundbar',
    },
  },
  'sp-bookshelf': {
    id: 'sp-bookshelf',
    slug: 'sp-bookshelf',
    name: { en: 'Bookshelf Active Speakers' },
    model: 'BS-200',
    category: 'music',
    sub: 'speakers',
    listImage: 'https://images.unsplash.com/photo-1558379850-1d3a3a40a26b?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1558379850-1d3a3a40a26b?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '120W RMS per pair' },
      { en: 'Bluetooth + 3.5mm aux' },
      { en: 'Walnut wood finish' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '120 W',
      dimension: '180*220*270',
      color: 'Walnut',
      energyClass: 'A',
      type: 'Bookshelf',
    },
  },
  'hp-overear': {
    id: 'hp-overear',
    slug: 'hp-overear',
    name: { en: 'Over-Ear Wireless Headphones' },
    model: 'WH-PRO',
    category: 'music',
    sub: 'headphones',
    listImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: 'Active noise cancellation' },
      { en: '40-hour battery life' },
      { en: 'Hi-Res audio certified' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '40 h',
      dimension: '180*200*80',
      color: 'Black',
      energyClass: 'A',
      type: 'Headphones',
    },
  },
  'ht-surround': {
    id: 'ht-surround',
    slug: 'ht-surround',
    name: { en: '7.1 Home Theatre System' },
    model: 'HT-7100',
    category: 'music',
    sub: 'home-theater',
    listImage: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '1000W total output' },
      { en: 'Dolby Atmos / DTS:X' },
      { en: '4K HDR HDMI passthrough' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '1000 W',
      dimension: '450*380*150',
      color: 'Black',
      energyClass: 'A',
      type: 'Home theater',
    },
  },

  // Agricultural appliances
  'ag-water-pump-1-5hp': {
    id: 'ag-water-pump-1-5hp',
    slug: 'ag-water-pump-1-5hp',
    name: { en: '1.5HP Centrifugal Water Pump' },
    model: 'WP-150',
    category: 'agriculture',
    sub: 'water-pumps',
    listImage: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '1.5HP single-phase motor' },
      { en: 'Cast-iron impeller' },
      { en: 'Self-priming' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '1.5 HP',
      dimension: '480*220*270',
      color: 'Blue',
      energyClass: 'B',
      type: 'Centrifugal',
    },
  },
  'ag-generator-5kva': {
    id: 'ag-generator-5kva',
    slug: 'ag-generator-5kva',
    name: { en: '5kVA Diesel Generator' },
    model: 'GEN-5K',
    category: 'agriculture',
    sub: 'generators',
    listImage: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '5kVA continuous output' },
      { en: 'Electric start' },
      { en: '12-hour runtime' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '5 kVA',
      dimension: '900*550*740',
      color: 'Yellow',
      energyClass: 'C',
      type: 'Diesel',
    },
  },
  'ag-solar-3kw': {
    id: 'ag-solar-3kw',
    slug: 'ag-solar-3kw',
    name: { en: '3kW Off-Grid Solar Inverter' },
    model: 'SI-3000',
    category: 'agriculture',
    sub: 'inverters',
    listImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '3kW pure sine output' },
      { en: 'MPPT solar charger' },
      { en: 'WiFi monitoring' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '3 kW',
      dimension: '420*150*460',
      color: 'White',
      energyClass: 'A',
      type: 'Off-grid',
    },
  },
  'ag-maize-mill': {
    id: 'ag-maize-mill',
    slug: 'ag-maize-mill',
    name: { en: 'Heavy-Duty Maize Mill' },
    model: 'MM-DUTY',
    category: 'agriculture',
    sub: 'mills',
    listImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'],
    featureBullets: [
      { en: '300kg/h throughput' },
      { en: 'Single-phase motor' },
      { en: 'Tempered steel hammers' },
    ],
    isAvailable: true,
    compareSpecs: {
      netTotal: '300 kg/h',
      dimension: '1100*600*1500',
      color: 'Red',
      energyClass: 'C',
      type: 'Hammer mill',
    },
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
    { slug: 'microwaves', label: { en: 'Microwaves' }, imageUrl: '/categories/nav/microwaves.png' },
    { slug: 'blender', label: { en: 'Blender' }, imageUrl: '/categories/nav/blender.png' },
    { slug: 'air-fryer', label: { en: 'Air Fryer' }, imageUrl: '/categories/nav/air-friers.png' },
    { slug: 'cookers', label: { en: 'Cookers' }, imageUrl: '/categories/nav/cookers.png' },
    { slug: 'kettles', label: { en: 'Kettles' }, imageUrl: '/categories/nav/kettles.png' },
    { slug: 'gas-stove', label: { en: 'Electric & Gas stove' }, imageUrl: '/categories/nav/Electric%20%26%20Gas%20stove.png' },
  ],
  music: [
    { slug: 'music-systems', label: { en: 'Music systems' }, imageUrl: '/categories/nav/music.png' },
  ],
  'refrigerator-ac': [
    { slug: 'refrigerator', label: { en: 'Refrigarator' }, imageUrl: '/categories/nav/freezer.png' },
    { slug: 'air-conditioning', label: { en: 'Air conditioning' }, imageUrl: '/categories/nav/ac.png' },
  ],
  agriculture: [
    { slug: 'water-pumps', label: { en: 'Water pumps' }, imageUrl: '/categories/nav/water-pump.png' },
    { slug: 'generators', label: { en: 'Generators' }, imageUrl: '/categories/nav/generator.png' },
    { slug: 'pvc-hoses', label: { en: 'PVC hoses' }, imageUrl: '/categories/nav/pvs-horses.png' },
    { slug: 'garden-hoses', label: { en: 'Garden hoses' }, imageUrl: '/categories/nav/garnen-horses.png' },
  ],
}

export function getSubcategories(category: string | null | undefined): SubcategoryEntry[] {
  if (!category) return []
  return SUBCATEGORIES[category] ?? []
}
