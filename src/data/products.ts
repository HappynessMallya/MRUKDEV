import type { Product } from '@/types/product'

// Mock product catalog. Replace with `useProduct(slug)` once the backend is
// live. The shape mirrors what the API will return so the swap is mostly the
// data source — components stay the same.

const PRODUCTS: Record<string, Product> = {
  rf4200: {
    id: 'rf4200',
    slug: 'rf4200',
    name: { en: 'P605TMSWD Top Mounted Refrigerator', sw: 'Friji ya P605TMSWD' },
    model: 'P605TMSWD',
    category: 'refrigerator-ac',
    shortDescription: {
      en: 'Spacious 605L double-door refrigerator with total no-frost technology and electronic controls.',
      sw: 'Friji ya milango miwili ya 605L na teknolojia ya total no-frost.',
    },
    images: [
      '/products/product-09.png',
      '/products/product-10.png',
      '/products/product-11.png',
      '/products/product-12.png',
    ],
    featureBullets: [
      { en: 'Total no frost — fresh food longer', sw: 'Total no frost — chakula safi kwa muda mrefu' },
      { en: 'Electronic Control with LED display', sw: 'Udhibiti wa Kielektroniki na onyesho la LED' },
      { en: 'Built-in LED interior light', sw: 'Taa ya LED ndani ya friji' },
      { en: 'Energy efficient — A++ rating', sw: 'Inaokoa nishati — kiwango A++' },
      { en: '605L total capacity', sw: 'Uwezo wa lita 605' },
    ],
    isAvailable: true,
    colors: [
      { id: 'black', label: { en: 'Black', sw: 'Nyeusi' }, hex: '#1A1A1A' },
      { id: 'silver', label: { en: 'Silver', sw: 'Fedha' }, hex: '#C7CCD1' },
    ],
    highlightIcons: [
      { id: 'h1', iconName: 'material-symbols:bolt-rounded', label: { en: 'Digital Inverter motor', sw: 'Motor ya Inverter' } },
      { id: 'h2', iconName: 'material-symbols:eco-rounded', label: { en: 'Energy efficient', sw: 'Inaokoa nishati' } },
      { id: 'h3', iconName: 'material-symbols:ac-unit-rounded', label: { en: 'Total no frost', sw: 'Total no frost' } },
      { id: 'h4', iconName: 'material-symbols:lightbulb-outline', label: { en: 'LED interior light', sw: 'Taa ya LED' } },
    ],
    characteristics: [
      {
        id: 'c1',
        title: { en: 'Powerful & Efficient Cooling', sw: 'Ubaridi wa Nguvu na Ufanisi' },
        subtitle: { en: 'Fast, even cooling performance throughout the cabinet.', sw: 'Ubaridi wa haraka na sawa ndani ya friji.' },
        imageUrl: '/features/modern-technology.png',
        layout: 'stacked',
      },
      {
        id: 'c2',
        title: { en: 'Versatile Storage', sw: 'Hifadhi ya Aina Mbalimbali' },
        subtitle: { en: 'Adjustable shelves and door bins for every kind of grocery.', sw: 'Vituo vinavyoweza kubadilishwa.' },
        imageUrl: '/features/built-to-last.png',
        layout: 'stacked',
      },
      {
        id: 'c3',
        title: { en: 'Durable & Reliable Build', sw: 'Imeundwa Kudumu' },
        subtitle: { en: 'Built to last — designed for long, dependable service.', sw: 'Imeundwa kudumu kwa muda mrefu.' },
        imageUrl: '/features/modern-technology.png',
        layout: 'image-left',
      },
      {
        id: 'c4',
        title: { en: 'Modern & Elegant Design', sw: 'Muundo wa Kisasa na wa Kupendeza' },
        subtitle: { en: 'Sleek, minimal, timeless — fits any kitchen.', sw: 'Mzuri, mdogo, wa kudumu.' },
        imageUrl: '/features/built-to-last.png',
        layout: 'image-right',
      },
    ],
    specifications: [
      { id: 's1', label: { en: 'Power capacity', sw: 'Uwezo wa nguvu' }, value: { en: '230-240 V / 50 Hz', sw: '230-240 V / 50 Hz' } },
      { id: 's2', label: { en: 'Power Consumption', sw: 'Matumizi ya nguvu' }, value: { en: '1500 W', sw: '1500 W' } },
      { id: 's3', label: { en: 'Total capacity', sw: 'Uwezo wa jumla' }, value: { en: '605 L', sw: '605 L' } },
      { id: 's4', label: { en: 'Energy class', sw: 'Daraja la nishati' }, value: { en: 'A++', sw: 'A++' } },
      { id: 's5', label: { en: 'Dimensions (HxWxD)', sw: 'Vipimo (HxWxD)' }, value: { en: '180 × 70 × 65 cm', sw: '180 × 70 × 65 cm' } },
      { id: 's6', label: { en: 'Weight', sw: 'Uzito' }, value: { en: '78 kg', sw: '78 kg' } },
      { id: 's7', label: { en: 'Defrost system', sw: 'Mfumo wa defrost' }, value: { en: 'Total no frost', sw: 'Total no frost' } },
      { id: 's8', label: { en: 'Warranty', sw: 'Dhamana' }, value: { en: '2 years (parts) + 5 years (compressor)', sw: 'Miaka 2 (vipuri) + miaka 5 (kompressor)' } },
    ],
    relatedSlugs: ['air-fryer', 'microwave', 'oven', 'breezin-ac'],
  },

  'air-fryer': {
    id: 'air-fryer',
    slug: 'air-fryer',
    name: { en: 'MR UK Air Fryer', sw: 'Air Fryer ya MR UK' },
    model: 'AF-4200',
    category: 'kitchen',
    shortDescription: {
      en: '4kg-capacity air fryer with dual-cooking and 360° heat circulation.',
      sw: 'Air fryer ya 4kg na 360° mzunguko wa joto.',
    },
    images: ['/products/product-01.png', '/products/product-02.png', '/products/product-03.png'],
    featureBullets: [
      { en: '4 kg capacity', sw: 'Uwezo wa kg 4' },
      { en: 'Dual cooking modes', sw: 'Hali mbili za kupikia' },
      { en: '360° heat circulation', sw: 'Mzunguko wa joto wa 360°' },
      { en: 'Smart digital control', sw: 'Udhibiti wa kidijiti' },
    ],
    isAvailable: true,
    highlightIcons: [
      { id: 'h1', iconName: 'material-symbols:bolt-rounded', label: { en: 'Smart control', sw: 'Smart control' } },
      { id: 'h2', iconName: 'material-symbols:thermostat', label: { en: 'Dual cooking', sw: 'Dual cooking' } },
      { id: 'h3', iconName: 'material-symbols:loop', label: { en: '360° heat', sw: '360° heat' } },
      { id: 'h4', iconName: 'material-symbols:eco-rounded', label: { en: 'Oil-free', sw: 'Bila mafuta' } },
    ],
    characteristics: [
      {
        id: 'c1',
        title: { en: 'Powerful & Efficient Heating', sw: 'Joto la Nguvu na Ufanisi' },
        subtitle: { en: 'Fast, even cooking performance every time.', sw: 'Mapishi ya haraka na sawa kila wakati.' },
        imageUrl: '/features/built-to-last.png',
        layout: 'stacked',
      },
      {
        id: 'c2',
        title: { en: 'Versatile Cooking', sw: 'Mapishi ya Aina Mbalimbali' },
        subtitle: { en: 'More than just heating — fries, grills, bakes and reheats.', sw: 'Zaidi ya kupasha tu — kubongoa, kuchoma na zaidi.' },
        imageUrl: '/features/modern-technology.png',
        layout: 'stacked',
      },
    ],
    specifications: [
      { id: 's1', label: { en: 'Power', sw: 'Nguvu' }, value: { en: '1500 W', sw: '1500 W' } },
      { id: 's2', label: { en: 'Capacity', sw: 'Uwezo' }, value: { en: '4 kg', sw: 'kg 4' } },
      { id: 's3', label: { en: 'Voltage', sw: 'Voltage' }, value: { en: '230-240 V / 50 Hz', sw: '230-240 V / 50 Hz' } },
      { id: 's4', label: { en: 'Warranty', sw: 'Dhamana' }, value: { en: '2 years', sw: 'Miaka 2' } },
    ],
    relatedSlugs: ['microwave', 'oven', 'rf4200'],
  },

  microwave: {
    id: 'microwave',
    slug: 'microwave',
    name: { en: 'French Microwave', sw: 'Microwave ya French' },
    model: 'MW-32K',
    category: 'kitchen',
    shortDescription: { en: 'Modernize your kitchen with smart cooking.', sw: 'Boresha jiko lako.' },
    images: ['/products/product-02.png', '/products/product-03.png'],
    featureBullets: [
      { en: '32 L capacity', sw: 'Uwezo wa lita 32' },
      { en: 'Heavy defrost', sw: 'Heavy defrost' },
      { en: '10 power levels', sw: 'Viwango 10 vya nguvu' },
    ],
    isAvailable: true,
    relatedSlugs: ['oven', 'air-fryer', 'rf4200'],
  },

  // Frame 204+205 hero microwave used as the canonical "rich PDP" reference.
  // Uses the /microwave/{1..6}.png hero gallery and /microwave/dis{...}.png
  // discover row. Subcategory is `microwaves` so it surfaces under the
  // Kitchen Appliances › Microwaves tile.
  p605tmswd: {
    id: 'p605tmswd',
    slug: 'p605tmswd',
    name: { en: 'P605TMSWD Top Mounted Refrigerator' },
    model: 'P605TMSWD',
    category: 'kitchen',
    sub: 'microwaves',
    images: [
      '/microwave/1.png',
      '/microwave/2.png',
      '/microwave/3.png',
      '/microwave/4.png',
      '/microwave/5.png',
      '/microwave/6.png',
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
      { id: 'h1', iconName: '/1.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h2', iconName: '/2.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h3', iconName: '/3.svg', label: { en: 'Digital Invetor motor' } },
      { id: 'h4', iconName: '/4.svg', label: { en: 'Digital Invetor motor' } },
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
        imageUrl: '/microwave/2.png',
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
        imageUrl: '/microwave/3.png',
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
        imageUrl: '/microwave/4.png',
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
        imageUrl: '/microwave/5.png',
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
        imageUrl: '/microwave/6.png',
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
    relatedSlugs: ['ms23-disc-1', 'ms23-disc-2', 'ms23-disc-3', 'ms23-disc-4'],
  },

  // Discover row variants — same SKU stub repeated four times with different
  // photos. Real catalog will replace these with distinct microwave models.
  'ms23-disc-1': {
    id: 'ms23-disc-1',
    slug: 'ms23-disc-1',
    name: { en: '32L Microwave Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/microwave/dis1.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'ms23-disc-2': {
    id: 'ms23-disc-2',
    slug: 'ms23-disc-2',
    name: { en: '32L Microwave Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/microwave/disc2.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'ms23-disc-3': {
    id: 'ms23-disc-3',
    slug: 'ms23-disc-3',
    name: { en: '32L Microwave Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/microwave/disc3.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },
  'ms23-disc-4': {
    id: 'ms23-disc-4',
    slug: 'ms23-disc-4',
    name: { en: '32L Microwave Oven Quick Defrost White' },
    model: 'MS23K3513AW/SG',
    category: 'kitchen',
    sub: 'microwaves',
    images: ['/microwave/disc4.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },

  oven: {
    id: 'oven',
    slug: 'oven',
    name: { en: 'MR UK Oven', sw: 'Oveni ya MR UK' },
    model: 'OV-DC',
    category: 'kitchen',
    shortDescription: { en: 'Four cooks with oven, energy efficient.', sw: 'Inapika mara nne, inaokoa nishati.' },
    images: ['/products/product-03.png', '/products/product-04.png'],
    featureBullets: [
      { en: 'Dual cooking', sw: 'Dual cooking' },
      { en: 'Energy efficient', sw: 'Inaokoa nishati' },
    ],
    isAvailable: true,
    relatedSlugs: ['microwave', 'air-fryer', 'rf4200'],
  },

  'breezin-ac': {
    id: 'breezin-ac',
    slug: 'breezin-ac',
    name: { en: 'BreezIN Air Conditioner', sw: 'Kiyoyozi cha BreezIN' },
    model: 'S09P5S0',
    category: 'refrigerator-ac',
    sub: 'air-conditioning',
    shortDescription: { en: 'Cool beyond limit. Smart control with WiFi, Google Home and Alexa.', sw: 'Baridi isiyo na kikomo.' },
    images: ['/hero/products/ac.png'],
    featureBullets: [
      { en: 'Smart control with WiFi', sw: 'Udhibiti wa WiFi' },
      { en: 'Google Home and Alexa support', sw: 'Inafanya kazi na Google Home na Alexa' },
      { en: 'Inverter technology — quieter', sw: 'Teknolojia ya inverter — kimya' },
    ],
    isAvailable: true,
    relatedSlugs: ['rf4200', 'uk-q65c-soundbar'],
  },

  // Refrigerator subcategory — six SKUs matching the Figma list.
  'sky-43-9wd': {
    id: 'sky-43-9wd',
    slug: 'sky-43-9wd',
    name: { en: 'SKY 43-9WD – BLack Inox' },
    model: 'SKY 43-9WD',
    category: 'refrigerator-ac',
    sub: 'refrigerator',
    images: ['/products/regrigirator-1.png'],
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
    images: ['/products/freezer-1.png'],
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
    images: ['/products/regrigirator-1.png'],
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
    images: ['/products/freezer-1.png'],
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
    images: ['/products/regrigirator-1.png'],
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
    images: ['/products/freezer-1.png'],
    featureBullets: [
      { en: 'Heavy defrost' },
      { en: '32L capacity' },
      { en: 'Clock timer' },
    ],
    isAvailable: true,
  },

  'uk-q65c-soundbar': {
    id: 'uk-q65c-soundbar',
    slug: 'uk-q65c-soundbar',
    name: { en: 'High end home theater soundbar', sw: 'Soundbar ya Hali ya Juu' },
    model: 'UKQ65C',
    category: 'music',
    shortDescription: { en: 'Delicate sound, sound reconstruction.', sw: 'Sauti laini, ufungaji upya wa sauti.' },
    images: ['/hero/products/soundbar.png'],
    featureBullets: [
      { en: 'Dolby Atmos', sw: 'Dolby Atmos' },
      { en: 'Wireless subwoofer', sw: 'Subwoofer ya wireless' },
      { en: 'Voice control', sw: 'Udhibiti wa sauti' },
    ],
    isAvailable: true,
    relatedSlugs: ['breezin-ac', 'rf4200'],
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
