import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Container } from '@/components/atoms'
import { getAllBlogPosts } from '@/data/blog'
import { getTenantConfig } from '@/lib/tenant'

export async function generateMetadata(): Promise<Metadata> {
  const tenant = await getTenantConfig()
  return {
    title: `Blog — ${tenant.identity.companyName}`,
    description: 'Stories, product deep-dives, and updates from the team.',
  }
}

// Lightweight index that lists every mock post. Replace with a paginated CMS
// fetch once the content backend is live.
export default function BlogIndexPage() {
  const posts = getAllBlogPosts()

  return (
    <Container className="py-12 md:py-16">
      <header className="max-w-2xl">
        <h1
          className="font-heading text-foreground"
          style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.1, fontWeight: 700 }}
        >
          Blog
        </h1>
        <p className="mt-3 text-foreground/65" style={{ fontSize: 16, lineHeight: '24px' }}>
          Stories, product deep-dives, and updates from the team.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-4 rounded-2xl bg-surface p-3 transition-colors hover:bg-surface-alt"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-background">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 px-3 pb-3 pt-1">
                <p
                  className="text-foreground/55"
                  style={{ fontSize: 12, lineHeight: '16px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}
                >
                  {date} · {post.minRead} min read
                </p>
                <h2
                  className="font-heading text-foreground"
                  style={{ fontSize: 18, lineHeight: '24px', fontWeight: 700 }}
                >
                  {post.title}
                </h2>
                <p className="text-foreground/65 line-clamp-2" style={{ fontSize: 14, lineHeight: '20px' }}>
                  {post.excerpt}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </Container>
  )
}
