import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/legal/LegalPage'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Privacy policy — ${tenant.identity.companyName}`,
    description:
      'How MR UK collects, uses, and protects your personal information. Read about your rights and how to contact us.',
  }
}

export default async function PrivacyPolicyPage() {
  const tenant = await getTenantConfig()
  const company = tenant.identity.companyName
  const supportEmail = tenant.global.contact.emails[0]?.value ?? 'support@mruk.co.tz'

  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      lastUpdated="May 2026"
      sections={[
        {
          id: 'intro',
          title: 'Introduction',
          body: (
            <>
              <p>
                {company} (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates this
                website. This Privacy Policy explains how we collect, use, share, and protect
                personal information when you visit our website, browse our catalogue, request
                a quotation, or place an order.
              </p>
              <p>
                By using our website you agree to the collection and use of information in
                accordance with this policy. If you don&apos;t agree, please do not use the
                website.
              </p>
            </>
          ),
        },
        {
          id: 'data-we-collect',
          title: 'Information we collect',
          body: (
            <>
              <p>We collect the following categories of information:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-foreground">
                <li>
                  <strong>Account &amp; contact details</strong> — name, email, phone number,
                  delivery address (only when you create an account or place an order).
                </li>
                <li>
                  <strong>Order &amp; quotation data</strong> — products you&apos;ve enquired
                  about or purchased, payment confirmation, delivery preferences.
                </li>
                <li>
                  <strong>Device &amp; usage data</strong> — IP address, browser type, pages
                  visited, time spent on each page (collected via cookies; see our{' '}
                  <Link href="/cookies" className="underline underline-offset-2 hover:text-foreground">
                    Cookie settings
                  </Link>
                  ).
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'how-we-use',
          title: 'How we use your information',
          body: (
            <>
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-foreground">
                <li>Process orders, quotations, and warranty claims.</li>
                <li>Communicate about your purchase, deliveries, and after-sales service.</li>
                <li>Improve the website, our products, and your overall experience.</li>
                <li>Comply with applicable laws and respond to lawful requests.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'sharing',
          title: 'Sharing &amp; disclosure',
          body: (
            <p>
              We never sell your personal information. We may share data with vetted service
              providers (payment processors, delivery partners, IT vendors) strictly to deliver
              the service you&apos;ve requested. We may also disclose information if required
              by law or to protect our legal rights.
            </p>
          ),
        },
        {
          id: 'security',
          title: 'How we protect your data',
          body: (
            <p>
              We use industry-standard administrative, technical, and physical safeguards —
              encryption in transit, access controls, and routine audits — to protect your
              information. No system is 100% secure; if a breach occurs we&apos;ll notify you
              without undue delay.
            </p>
          ),
        },
        {
          id: 'your-rights',
          title: 'Your rights',
          body: (
            <>
              <p>You can:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-foreground">
                <li>Access, correct, or delete your personal data.</li>
                <li>Object to or restrict certain processing.</li>
                <li>Withdraw consent for cookies anytime via Cookie settings.</li>
                <li>Lodge a complaint with the relevant data-protection authority.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'contact',
          title: 'Contact us',
          body: (
            <p>
              Questions about this policy or your data? Email us at{' '}
              <a
                href={`mailto:${supportEmail}`}
                className="text-primary underline underline-offset-2"
              >
                {supportEmail}
              </a>{' '}
              or visit our{' '}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
