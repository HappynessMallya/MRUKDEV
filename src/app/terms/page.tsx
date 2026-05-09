import type { Metadata } from 'next'
import Link from 'next/link'

import { LegalPage } from '@/components/legal/LegalPage'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Terms of service — ${tenant.identity.companyName}`,
    description:
      'The agreement that governs your use of the MR UK website, products, and services.',
  }
}

export default async function TermsOfServicePage() {
  const tenant = await getTenantConfig()
  const company = tenant.identity.companyName

  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of service"
      lastUpdated="May 2026"
      sections={[
        {
          id: 'agreement',
          title: 'Acceptance of terms',
          body: (
            <p>
              These Terms of Service govern your use of the {company} website and any related
              services we provide. By accessing or using our website, you agree to be bound by
              these terms. If you do not agree, please do not use the website.
            </p>
          ),
        },
        {
          id: 'use',
          title: 'Use of the website',
          body: (
            <>
              <p>You agree to use the website only for lawful purposes and in a way that does not:</p>
              <ul className="list-disc space-y-2 pl-5 marker:text-foreground">
                <li>Infringe the rights of any other person or entity.</li>
                <li>Disrupt or interfere with the website&apos;s operation or security.</li>
                <li>Attempt unauthorized access to any part of the website or its systems.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'orders',
          title: 'Orders &amp; quotations',
          body: (
            <p>
              Placing an order or requesting a quotation through this website constitutes an
              offer to purchase, which we may accept or decline. Prices, availability, and
              delivery times are subject to change. We&apos;ll always confirm the final terms
              before any payment is taken.
            </p>
          ),
        },
        {
          id: 'warranty',
          title: 'Warranty &amp; returns',
          body: (
            <p>
              All {company} products carry the manufacturer&apos;s standard warranty unless
              stated otherwise. To claim warranty service, contact us within the warranty
              window with your order number and proof of purchase. Returns are accepted in
              accordance with our published returns policy.
            </p>
          ),
        },
        {
          id: 'ip',
          title: 'Intellectual property',
          body: (
            <p>
              All content on this website — including text, images, logos, and software — is
              owned by {company} or its licensors and is protected by copyright and trademark
              laws. You may not copy, reproduce, or distribute any content without our prior
              written permission.
            </p>
          ),
        },
        {
          id: 'liability',
          title: 'Limitation of liability',
          body: (
            <p>
              To the fullest extent permitted by law, {company} is not liable for any indirect,
              incidental, special, or consequential damages arising from your use of the
              website. Our total liability for any claim arising out of or relating to these
              Terms or the website is limited to the amount you paid us in the twelve months
              preceding the claim.
            </p>
          ),
        },
        {
          id: 'changes',
          title: 'Changes to these terms',
          body: (
            <p>
              We may update these Terms from time to time. The &quot;Last updated&quot; date at
              the top of this page reflects the most recent revision. Continued use of the
              website after a change constitutes acceptance of the revised Terms.
            </p>
          ),
        },
        {
          id: 'contact',
          title: 'Contact us',
          body: (
            <p>
              Questions about these Terms? Visit our{' '}
              <Link href="/contact" className="text-primary underline underline-offset-2">
                contact page
              </Link>{' '}
              and we&apos;ll get back to you.
            </p>
          ),
        },
      ]}
    />
  )
}
