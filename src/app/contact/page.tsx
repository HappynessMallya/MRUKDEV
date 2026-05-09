import type { Metadata } from 'next'

import { ContactForm, ContactInfo, ContactHero } from '@/components/contact'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Contact us — ${tenant.identity.companyName}`,
    description: 'Get in touch with our team — phone, email, WhatsApp, or stop by an office.',
  }
}

export default async function ContactPage() {
  const tenant = await getTenantConfig()

  return (
    <>
      <ContactHero />
      <section className="bg-background py-12 md:py-16">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
            <ContactForm />

            <div className="flex flex-col gap-10">
              <ContactInfo contact={tenant.global.contact} />
              <MapPlaceholder />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// Embeds the mr UK Electronics HQ on Google Maps. The `q=` form works
// without an API key; swap to a `pb=` Embed API URL if/when we want a
// custom-styled map. Place ID source: the cid query in the share URL.
function MapPlaceholder() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface-alt">
      <div className="relative aspect-[16/10] w-full">
        <iframe
          title="mr UK Electronics HQ on Google Maps"
          src="https://www.google.com/maps?q=mr+UK+Electronics+(HQ)&output=embed"
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  )
}
