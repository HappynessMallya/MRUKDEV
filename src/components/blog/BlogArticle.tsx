'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@iconify/react'

import type { BlogPost } from '@/types/blog'

// Frame 99 in Figma — single-article view. Layout sequence:
//   1. Two-column hero: chip + read time + title + published date on the
//      left; large cover image filling the right column.
//   2. Breadcrumb on the left + share row on the right.
//   3. Body content in a centered narrow column.
//   4. "Share this post" row + tag chips.
//   5. Author block centered at the bottom.
export function BlogArticle({ post }: { post: BlogPost }) {
  const date = new Date(post.publishedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const primaryTag = post.tags[0]

  return (
    <article className="bg-background pb-16 md:pb-20">
      <header className="pt-6 md:pt-10">
        <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
            <div className="flex flex-col gap-4 lg:pt-4">
              <div className="flex items-center gap-3">
                {primaryTag && (
                  <span
                    className="rounded-md bg-surface px-2.5 py-1 text-foreground"
                    style={{ fontSize: 12, lineHeight: '16px', fontWeight: 600 }}
                  >
                    {primaryTag}
                  </span>
                )}
                <span className="text-foreground/60" style={{ fontSize: 13, lineHeight: '18px' }}>
                  {post.minRead} min read
                </span>
              </div>
              <h1
                className="font-heading text-foreground"
                style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-0.01em' }}
              >
                {post.title}
              </h1>
              <p className="text-foreground/55" style={{ fontSize: 14, lineHeight: '20px' }}>
                Published on {date}
              </p>
            </div>

            <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-surface">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 660px, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-10 w-full max-w-[1200px] px-6 md:px-10">
        <div className="flex items-center justify-between">
          {post.breadcrumb && (
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-foreground/55"
              style={{ fontSize: 13, lineHeight: '18px' }}
            >
              <Link href="/blog" className="transition-colors hover:text-foreground">
                {post.breadcrumb.section}
              </Link>
              <Icon icon="material-symbols:chevron-right" width={14} />
              <span className="text-foreground">{post.breadcrumb.category}</span>
            </nav>
          )}
          <ShareRow title={post.title} />
        </div>
      </div>

      <div className="mx-auto mt-12 flex w-full max-w-[820px] flex-col gap-6 px-6 md:px-10">
        {post.body.map((block, i) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>

      <div className="mx-auto mt-16 w-full max-w-[820px] px-6 md:px-10">
        <div className="flex flex-col items-center gap-4">
          <p
            className="text-foreground"
            style={{ fontSize: 16, lineHeight: '22px', fontWeight: 700 }}
          >
            Share this post
          </p>
          <ShareRow title={post.title} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <span
                  className="inline-block rounded-md bg-surface px-3 py-1.5 text-foreground"
                  style={{ fontSize: 12, lineHeight: '16px', fontWeight: 600 }}
                >
                  {tag}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 border-t border-border-subtle pt-10">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-foreground/40">
              {post.author.avatarUrl ? (
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <Icon icon="material-symbols:image-outline" width={22} />
              )}
            </div>
            <p
              className="text-foreground"
              style={{ fontSize: 14, lineHeight: '20px', fontWeight: 700 }}
            >
              {post.author.name}
            </p>
            {post.author.role && (
              <p className="text-foreground/55" style={{ fontSize: 13, lineHeight: '18px' }}>
                {post.author.role}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function BlockRenderer({ block }: { block: BlogPost['body'][number] }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2
          className="font-heading text-foreground mt-2"
          style={{ fontSize: 'clamp(22px, 2.4vw, 30px)', lineHeight: 1.2, fontWeight: 700 }}
        >
          {block.text}
        </h2>
      )
    case 'paragraph':
      return (
        <p
          className={block.emphasized ? 'text-foreground' : 'text-foreground/75'}
          style={{
            fontSize: block.emphasized ? 17 : 16,
            lineHeight: '26px',
            fontWeight: block.emphasized ? 700 : 400,
          }}
        >
          {block.text}
        </p>
      )
    case 'image':
      return (
        <figure className="my-2 space-y-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-surface">
            <Image src={block.src} alt={block.caption ?? ''} fill sizes="820px" className="object-cover" />
          </div>
          {block.caption && (
            <figcaption
              className="border-l-2 border-foreground/20 pl-3 text-foreground/55"
              style={{ fontSize: 13, lineHeight: '18px' }}
            >
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'quote':
      return (
        <blockquote
          className="border-l-2 border-foreground/30 pl-5 italic text-foreground/85"
          style={{ fontSize: 17, lineHeight: '28px' }}
        >
          {block.text}
        </blockquote>
      )
  }
}

function ShareRow({ title, className }: { title: string; className?: string }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  return (
    <ul className={`flex items-center gap-3 text-foreground ${className ?? ''}`}>
      <li>
        <button
          type="button"
          aria-label="Copy link"
          onClick={() => {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl).catch(() => {})
            }
          }}
          className="transition-opacity hover:opacity-70"
        >
          <Icon icon="material-symbols:link" width={18} />
        </button>
      </li>
      <li>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="transition-opacity hover:opacity-70"
        >
          <Icon icon="mdi:linkedin" width={18} />
        </a>
      </li>
      <li>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="transition-opacity hover:opacity-70"
        >
          <Icon icon="prime:twitter" width={16} />
        </a>
      </li>
      <li>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="transition-opacity hover:opacity-70"
        >
          <Icon icon="mdi:facebook" width={18} />
        </a>
      </li>
    </ul>
  )
}
