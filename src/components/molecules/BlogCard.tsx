'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Icon } from '@iconify/react'

import { cn } from '@/lib/cn'

// Frame 49 in Figma — 'Explore Stories'. Soft surface card with a rounded
// image well, then a centered title + excerpt. The whole tile is clickable.
export interface BlogPostData {
  id: string
  title: string
  excerpt?: string
  imageUrl?: string
  href: string
  publishedAt?: string
  minRead?: number
}

export function BlogCard({ post, className }: { post: BlogPostData; className?: string }) {
  const [imgErrored, setImgErrored] = useState(false)
  return (
    <Link
      href={post.href}
      className={cn(
        'group flex flex-col gap-4 rounded-2xl bg-surface p-3 transition-colors hover:bg-surface-alt',
        className
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-background">
        {post.imageUrl && !imgErrored ? (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImgErrored(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-placeholder">
            <Icon icon="material-symbols:image-outline" width={48} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 px-4 pb-4 pt-1 text-center">
        <h3
          className="font-heading text-foreground"
          style={{ fontSize: 20, lineHeight: '26px', fontWeight: 700 }}
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p
            className="text-foreground/65 line-clamp-2 mx-auto max-w-md"
            style={{ fontSize: 13, lineHeight: '20px' }}
          >
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
