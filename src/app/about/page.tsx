import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import { Container } from '@/components/atoms'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `About — ${tenant.identity.companyName}`,
    description:
      'Mr UK is a trusted brand providing high-quality home appliances, entertainment systems and agricultural solutions across Tanzania.',
  }
}

interface ValueProp {
  icon: string
  title: string
  description: string
}

const VALUE_PROPS: ValueProp[] = [
  {
    icon: 'material-symbols:verified-user-outline',
    title: 'Built to Last',
    description: 'Engineered for durability and heavy-duty performance in tropical conditions.',
  },
  {
    icon: 'material-symbols:star-outline',
    title: 'Quality You Can Trust',
    description: 'Every product undergoes rigorous quality control before reaching your home.',
  },
  {
    icon: 'material-symbols:memory-outline',
    title: 'Modern Technology',
    description: 'Integrating the latest energy-efficient tech to save you more every month.',
  },
  {
    icon: 'material-symbols:payments-outline',
    title: 'Customer Value',
    description: 'Premium quality at competitive prices, designed to provide the best return on investment.',
  },
]

interface CategoryTile {
  label: string
  imageUrl: string
  href: string
}

const CATEGORIES: CategoryTile[] = [
  { label: 'Kitchen\nAppliances', imageUrl: '/about/KitchetAppliances.png', href: '/products?category=kitchen' },
  { label: 'Music Systems', imageUrl: '/about/music.png', href: '/products?category=music' },
  { label: 'Fridges & Freezers', imageUrl: '/about/fridgeandfreezers.png', href: '/products?category=refrigerator-ac&sub=refrigerator' },
  { label: 'Air Conditioners', imageUrl: '/about/ac.png', href: '/products?category=refrigerator-ac&sub=air-conditioning' },
  { label: 'Agricultural\nAppliances', imageUrl: '/about/agriculture.png', href: '/products?category=agriculture' },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero band — white bg with a subtle dot grid texture, big title and
          one-line subtitle below. Matches the top of the Figma reference. */}
      <section
        className="relative overflow-hidden bg-background"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(37,57,111,0.10) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      >
        <Container className="py-16 md:py-24 text-center">
          <h1
            className="font-heading text-foreground"
            style={{
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: 1.1,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            THE HOME OF THE BEST QUALITY
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-foreground/70"
            style={{ fontSize: 15, lineHeight: '22px' }}
          >
            Performance You Can Rely On. Technology You Can Trust
          </p>
        </Container>
      </section>

      <Container className="py-12 md:py-16">
        <header className="mx-auto max-w-2xl text-center">
          <h2
            className="font-heading text-foreground"
            style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
          >
            Who We Are
          </h2>
          <p className="mt-5 text-foreground/75" style={{ fontSize: 14, lineHeight: '22px' }}>
            Mr UK is a trusted brand providing high-quality home appliances, entertainment systems, and
            agricultural solutions.
          </p>
          <p className="mt-3 text-foreground/75" style={{ fontSize: 14, lineHeight: '22px' }}>
            Mr UK Tanzania is your trusted provider of durable, reliable, and modern appliances. We are dedicated
            to enhancing everyday life by sourcing quality products that stand the test of time in the unique
            Tanzanian environment
          </p>
        </header>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((v) => (
            <ValueCard key={v.title} value={v} />
          ))}
        </div>
      </Container>

      <Container className="pb-12 md:pb-16">
        <div className="text-center">
          <h2
            className="font-heading text-foreground"
            style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
          >
            Our Categories
          </h2>
          <p className="mt-2 text-foreground/65" style={{ fontSize: 14, lineHeight: '20px' }}>
            Excellence across every corner of your home and workspace.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.label} category={c} />
          ))}
        </div>
      </Container>

      <section className="bg-surface py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="max-w-md">
              <h2
                className="font-heading text-foreground"
                style={{ fontSize: 'clamp(22px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
              >
                Our Promise
              </h2>
              <p className="mt-5 text-foreground/75" style={{ fontSize: 14, lineHeight: '22px' }}>
                We promise more than just a sale. We promise a partnership that ensures your home runs smoothly
                every single day. Our commitment to durability means we only offer products that we would proudly
                use in our own homes.
              </p>
              <p className="mt-4 text-foreground/75" style={{ fontSize: 14, lineHeight: '22px' }}>
                From the moment you browse our catalog to years after your purchase, our support team remains
                your dedicated point of contact for maintenance, advice, and genuine care.
              </p>
            </div>

            <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-surface-alt">
              <Image
                src="/promise.png"
                alt="Two hands forming a promise gesture"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

function ValueCard({ value }: { value: ValueProp }) {
  return (
    <div className="rounded-xl bg-surface p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon icon={value.icon} width={18} />
      </span>
      <h3
        className="mt-5 font-heading text-foreground"
        style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700 }}
      >
        {value.title}
      </h3>
      <p className="mt-2 text-foreground/60" style={{ fontSize: 12, lineHeight: '18px' }}>
        {value.description}
      </p>
    </div>
  )
}

function CategoryCard({ category }: { category: CategoryTile }) {
  return (
    <Link
      href={category.href}
      className="group relative block aspect-square overflow-hidden rounded-2xl bg-surface"
    >
      <Image
        src={category.imageUrl}
        alt={category.label.replace('\n', ' ')}
        fill
        sizes="(min-width: 1024px) 240px, (min-width: 640px) 50vw, 100vw"
        className="object-cover transition-transform group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0) 55%)',
        }}
      />
      <span
        className="absolute bottom-5 left-5 right-5 whitespace-pre-line text-white"
        style={{ fontSize: 14, lineHeight: '18px', fontWeight: 700 }}
      >
        {category.label}
      </span>
    </Link>
  )
}
