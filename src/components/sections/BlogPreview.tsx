'use client'

import Link from 'next/link'

import { Button, Container } from '@/components/atoms'
import { BlogCard, type BlogPostData } from '@/components/molecules'
import { useTenantStore } from '@/stores/tenantStore'
import type { BilingualText } from '@/types/tenant'

export interface BlogPreviewProps {
  heading: BilingualText
  subtitle?: BilingualText
  source?: string
  limit?: number
  cta?: { label: BilingualText; href: string }
}

// Frame 49 in Figma — 'Explore Stories'. Heading + subtitle, then a 3-up grid
// of blog cards, then a "View all posts" CTA. Until the backend is live we
// show 3 mock posts so the layout reads correctly.
export function BlogPreview({ heading, subtitle, limit = 3, cta }: BlogPreviewProps) {
  const t = useTenantStore((s) => s.t)
  const posts = MOCK_POSTS.slice(0, limit)

  return (
    <section className="bg-background py-14 md:py-16">
      <Container>
        <h2
          className="font-heading text-foreground text-center"
          style={{ fontSize: 'clamp(24px, 2.6vw, 32px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {t(heading)}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-muted" style={{ fontSize: 15, lineHeight: '22px' }}>
            {t(subtitle)}
          </p>
        )}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {cta && (
          <div className="mt-8 flex justify-center">
            <Link href={cta.href}>
              <Button variant="outline" size="sm">
                {t(cta.label)}
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  )
}

// Two stories — covers use product-09 and product-10 from the public folder.
const MOCK_POSTS: BlogPostData[] = [
  {
    id: 'b1',
    title: 'Innovation hub event',
    excerpt: 'Explore what happens during the innovation hub event held on Monday — there are new products, demos and giveaways.',
    imageUrl: '/products/product-09.png',
    href: '/blog/innovation-hub',
    minRead: 5,
  },
  {
    id: 'b2',
    title: 'Behind the RF4200',
    excerpt: 'Two years of engineering went into our flagship double-door refrigerator. Here is the story behind the build.',
    imageUrl: '/products/product-10.png',
    href: '/blog/rf4200',
    minRead: 6,
  },
]
