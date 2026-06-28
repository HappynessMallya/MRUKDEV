import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogArticle } from '@/components/blog'
import { getBlogPostBySlug, listAllBlogSlugs } from '@/lib/blog'
import { getTenantConfig } from '@/lib/tenant'

// Pre-render every published article slug at build time (mock slugs when none
// are seeded yet — see src/lib/blog.ts).
export async function generateStaticParams() {
  const slugs = await listAllBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  const tenant = await getTenantConfig()
  if (!post) return { title: 'Article not found' }

  return {
    title: `${post.title} — ${tenant.identity.companyName}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return <BlogArticle post={post} />
}
