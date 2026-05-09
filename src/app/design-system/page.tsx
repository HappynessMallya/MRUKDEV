'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

import {
  Button,
  Container,
  Heading,
  Input,
  Logo,
  Tab,
  Text,
  ValueCard,
} from '@/components/atoms'

export default function DesignSystemPage() {
  return (
    <div className="bg-background">
      <Container className="py-16 space-y-20">
        <header className="space-y-2">
          <Text size="caption" className="text-muted uppercase tracking-widest">
            MR UK · Design system · Atoms
          </Text>
          <Heading size="section" className="text-primary">
            Atoms — extracted from Figma
          </Heading>
          <Text size="subhead" className="text-muted">
            Every value below is a 1:1 read of the Figma component sets in the
            Templates page. Iconify names ship straight from the design.
          </Text>
        </header>

        <Section title="Logo" subtitle="From tenant.branding.logos.navbar">
          <div className="flex flex-wrap items-center gap-12">
            <div className="rounded-lg border border-border-subtle bg-background p-6">
              <Logo variant="light" />
            </div>
            <div className="rounded-lg bg-primary p-6">
              <Logo variant="dark" />
            </div>
          </div>
        </Section>

        <Section
          title="Headings"
          subtitle="Inter 700/600 — sizes from displayXl 64/77 down to h4 24/29"
        >
          <div className="space-y-4">
            <Heading size="displayXl">HOME OF THE BEST QUALITY</Heading>
            <Heading size="displayL">MR UK Double door refrigerator</Heading>
            <Heading size="section" className="text-primary">
              Featured products
            </Heading>
            <Heading size="h1">Modern Technology, Trusted Quality</Heading>
            <Heading size="h2">Air fryer</Heading>
            <Heading size="h3">French Microwave</Heading>
            <Heading size="h4">Kitchen Appliances</Heading>
          </div>
        </Section>

        <Section
          title="Body text"
          subtitle="Inter regular/semibold/medium — paragraph, CTAs, captions"
        >
          <div className="space-y-3 max-w-2xl">
            <Text size="subhead">
              Take care of your kitchen with modern appliances
            </Text>
            <Text size="bodyLg">Superior performance you can rely on</Text>
            <Text size="cta" className="text-primary">
              Learn more →
            </Text>
            <Text size="bodyEmph">Kitchen Appliances (compact head)</Text>
            <Text size="body" className="text-muted">
              Get fresh market updates and exclusive offers from our team.
            </Text>
            <Text size="caption" className="text-muted">
              © 2026 Mr UK. All rights reserved.
            </Text>
            <Text size="small" className="text-muted">
              By subscribing you agree to our Privacy Policy.
            </Text>
          </div>
        </Section>

        <Section
          title="Buttons"
          subtitle="5 variants × 3 sizes — radius 16, padding 16×24, Inter 500"
        >
          <div className="space-y-8">
            <VariantRow label="Solid (primary CTA)">
              <Button size="sm">Compare</Button>
              <Button size="md">Learn more</Button>
              <Button size="lg">View all kitchen appliances</Button>
            </VariantRow>
            <VariantRow label="Secondary (white + navy border)">
              <Button variant="secondary" size="sm">Compare</Button>
              <Button variant="secondary" size="md">Learn more</Button>
              <Button variant="secondary" size="lg">View all</Button>
            </VariantRow>
            <VariantRow label="Outline (light surfaces)">
              <Button variant="outline" size="sm">Compare</Button>
              <Button
                variant="outline"
                size="md"
                rightIcon={<Icon icon="grommet-icons:next" width={16} />}
              >
                Learn more
              </Button>
              <Button variant="outline" size="lg">View all</Button>
            </VariantRow>
            <div className="rounded-lg bg-primary p-6">
              <VariantRow label="Outline-light (dark surfaces)" labelClassName="text-white">
                <Button variant="outlineLight" size="sm">Compare</Button>
                <Button
                  variant="outlineLight"
                  size="md"
                  rightIcon={<Icon icon="grommet-icons:next" width={16} />}
                >
                  Learn more
                </Button>
                <Button variant="outlineLight" size="lg">View all</Button>
              </VariantRow>
            </div>
            <VariantRow label="Ghost (translucent navy)">
              <div className="rounded-lg bg-foreground p-4">
                <Button variant="ghost" size="sm">Compare</Button>
              </div>
            </VariantRow>
          </div>
        </Section>

        <Section
          title="Tabs"
          subtitle="Frame 58 — category filter chip, default vs active"
        >
          <Tabs />
        </Section>

        <Section
          title="Input"
          subtitle="Newsletter / form field — placeholder uses #AEAEB2"
        >
          <NewsletterPreview />
        </Section>

        <Section
          title="ValueCards"
          subtitle="Container 1-4 — surface bg, 8px radius, hover/active = 2px navy border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Icon icon="material-symbols:bolt-rounded" width={32} />}
              title="Built to Last"
              body="Engineered for durability and heavy-duty performance in tropical conditions."
            />
            <ValueCard
              icon={<Icon icon="material-symbols:verified-rounded" width={32} />}
              title="Quality You Can Trust"
              body="Every product undergoes rigorous quality control before reaching your home."
              active
            />
            <ValueCard
              icon={<Icon icon="material-symbols:bolt-outline" width={32} />}
              title="Modern Technology"
              body="Integrating the latest energy-efficient tech to save you more every month."
            />
            <ValueCard
              icon={<Icon icon="material-symbols:diamond-outline" width={32} />}
              title="Customer Value"
              body="Premium quality at competitive prices — designed for the best return on investment."
            />
          </div>
        </Section>

        <Section
          title="Iconify icons"
          subtitle="Same icon names the Figma uses — drop-in via @iconify/react"
        >
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-6 text-primary">
            {[
              'grommet-icons:next',
              'ic:twotone-whatsapp',
              'logos:whatsapp-icon',
              'ic:outline-phone',
              'mdi:location',
              'material-symbols:bolt-rounded',
              'material-symbols:verified-rounded',
              'material-symbols:diamond-outline',
            ].map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2 rounded-lg border border-border-subtle bg-surface p-4"
              >
                <Icon icon={name} width={32} />
                <Text size="small" className="text-muted text-center break-all">
                  {name}
                </Text>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </div>
  )
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div className="space-y-1 border-l-2 border-primary pl-4">
        <Heading size="h4" as="h2" className="text-foreground">
          {title}
        </Heading>
        {subtitle && (
          <Text size="caption" className="text-muted">
            {subtitle}
          </Text>
        )}
      </div>
      {children}
    </section>
  )
}

function VariantRow({
  label,
  labelClassName,
  children,
}: {
  label: string
  labelClassName?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <Text size="caption" className={labelClassName ?? 'text-muted uppercase tracking-widest'}>
        {label}
      </Text>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  )
}

function Tabs() {
  const [active, setActive] = useState('Kitchen Appliances')
  const items = ['Kitchen Appliances', 'Refrigerators & AC', 'Music systems', 'TV & Soundbar']
  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => (
        <Tab key={item} active={item === active} onClick={() => setActive(item)}>
          {item}
        </Tab>
      ))}
    </div>
  )
}

function NewsletterPreview() {
  return (
    <div className="max-w-md flex flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Icon icon="ic:outline-email" width={20} />}
      />
      <Button fullWidth size="md">
        Subscribe
      </Button>
      <Text size="small" className="text-muted">
        By subscribing you agree to our Privacy Policy.
      </Text>
    </div>
  )
}
