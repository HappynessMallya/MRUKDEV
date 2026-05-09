import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogArticle } from '@/components/blog'
import { getBlogPost, listAllBlogSlugs } from '@/data/blog'
import { getTenantConfig } from '@/lib/tenant'

// Pre-render every blog slug at build time.
export function generateStaticParams() {
  return listAllBlogSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
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
  const post = getBlogPost(slug)
  if (!post) notFound()

  return <BlogArticle post={post} />
}
