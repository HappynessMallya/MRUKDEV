// Blog post shape — keep permissive while content is mocked. Body is a list
// of typed blocks so the article view renders headings, paragraphs, images,
// and pull-quotes without parsing HTML/Markdown at runtime.
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  coverImage: string
  publishedAt: string
  minRead: number
  tags: string[]
  // Optional breadcrumb shown above the body (e.g. Blog › Groceries).
  breadcrumb?: { section: string; category: string }
  author: { name: string; role?: string; avatarUrl?: string }
  body: BlogBlock[]
}

export type BlogBlock =
  | { type: 'heading'; text: string }
  // `emphasized` renders the paragraph in bold for an in-line callout / lede.
  | { type: 'paragraph'; text: string; emphasized?: boolean }
  | { type: 'image'; src: string; caption?: string }
  | { type: 'quote'; text: string }
