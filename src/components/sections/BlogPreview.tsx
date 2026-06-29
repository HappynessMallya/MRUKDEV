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
  // Real posts injected server-side (see catalog.enrichHomeSections). Falls
  // back to MOCK_POSTS when absent/empty (e.g. no articles seeded yet).
  posts?: BlogPostData[]
}

// Frame 49 in Figma — 'Explore Stories'. Heading + subtitle, then a 3-up grid
// of blog cards, then a "View all posts" CTA. Falls back to mock posts when no
// articles are available so the layout always reads correctly.
export function BlogPreview({ heading, subtitle, limit = 3, cta, posts: injected }: BlogPreviewProps) {
  const t = useTenantStore((s) => s.t)
  const source = injected && injected.length > 0 ? injected : MOCK_POSTS
  const posts = source.slice(0, limit)

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
          {posts.map((post, i) => (
            <BlogCard
              key={post.id}
              post={post}
              fallbackImage={i % 2 === 0 ? '/stories/innovation-1.png' : '/stories/innovation-2.png'}
            />
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

// Two stories — covers live in /public/stories as the project's editorial
// imagery for the Explore Stories block.
const MOCK_POSTS: BlogPostData[] = [
  {
    id: 'b1',
    title: 'Innovation hub event',
    excerpt: 'Explore what happens during the innovation hub event held on Monday — there are new products, demos and giveaways.',
    imageUrl: '/stories/innovation-1.png',
    href: '/blog/innovation-hub',
    minRead: 5,
  },
  {
    id: 'b2',
    title: 'Behind the RF4200',
    excerpt: 'Two years of engineering went into our flagship double-door refrigerator. Here is the story behind the build.',
    imageUrl: '/stories/innovation-2.png',
    href: '/blog/rf4200',
    minRead: 6,
  },
]
