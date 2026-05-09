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

export function getProductsByCategory(category: string | null | undefined): Product[] {
  if (!category) return getAllProducts()
  return getAllProducts().filter((p) => p.category === category)
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
    { slug: 'microwaves', label: { en: 'Microwaves' }, imageUrl: '/products/product-02.png' },
    { slug: 'blender', label: { en: 'Blender' }, imageUrl: '/products/product-04.png' },
    { slug: 'air-fryer', label: { en: 'Air Fryer' }, imageUrl: '/products/product-01.png' },
    { slug: 'cookers', label: { en: 'Cookers' }, imageUrl: '/products/product-11.png' },
    { slug: 'kettles', label: { en: 'Kettles' }, imageUrl: '/products/product-12.png' },
    { slug: 'gas-stove', label: { en: 'Electric & Gas stove' }, imageUrl: '/products/product-03.png' },
  ],
  music: [
    { slug: 'soundbars', label: { en: 'Soundbars' }, imageUrl: '/products/product-06.png' },
    { slug: 'speakers', label: { en: 'Speakers' }, imageUrl: '/products/product-07.png' },
    { slug: 'headphones', label: { en: 'Headphones' }, imageUrl: '/products/product-08.png' },
    { slug: 'home-theater', label: { en: 'Home theater' }, imageUrl: '/products/product-05.png' },
  ],
  'refrigerator-ac': [
    { slug: 'refrigerators', label: { en: 'Refrigerators' }, imageUrl: '/products/product-09.png' },
    { slug: 'freezers', label: { en: 'Freezers' }, imageUrl: '/products/product-10.png' },
    { slug: 'air-conditioners', label: { en: 'Air conditioners' }, imageUrl: '/products/product-11.png' },
    { slug: 'wine-coolers', label: { en: 'Wine coolers' }, imageUrl: '/products/product-12.png' },
  ],
  agriculture: [
    { slug: 'water-pumps', label: { en: 'Water pumps' }, imageUrl: '/products/product-14.png' },
    { slug: 'generators', label: { en: 'Generators' }, imageUrl: '/products/product-13.png' },
    { slug: 'inverters', label: { en: 'Inverters' }, imageUrl: '/products/product-15.png' },
    { slug: 'mills', label: { en: 'Mills' }, imageUrl: '/products/product-16.png' },
  ],
}

export function getSubcategories(category: string | null | undefined): SubcategoryEntry[] {
  if (!category) return []
  return SUBCATEGORIES[category] ?? []
}
