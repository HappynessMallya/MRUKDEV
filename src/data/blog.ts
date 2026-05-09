import type { BlogPost } from '@/types/blog'

// Mock article catalog — replace with `useBlog(slug)` once the CMS is live.
// Body is structured as typed blocks so the page renders without parsing HTML.

const POSTS: Record<string, BlogPost> = {
  'innovation-hub': {
    id: 'innovation-hub',
    slug: 'innovation-hub',
    title: 'The innovation event that led to fruitful result',
    excerpt:
      'Explore what happened during the innovation hub event held on Monday — there are new products, demos, and giveaways.',
    coverImage: '/content/blog1.png',
    publishedAt: '2026-03-15',
    minRead: 6,
    tags: ['Innovation', 'Local markets', 'Fresh produce', 'Shopping tips', 'Quality food'],
    breadcrumb: { section: 'Blog', category: 'Groceries' },
    author: {
      name: 'Sarah Mitchell',
      role: 'Food writer, Mercado',
    },
    body: [
      { type: 'heading', text: 'Introduction' },
      {
        type: 'paragraph',
        text:
          'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.',
      },
      {
        type: 'paragraph',
        text:
          'Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim. Quis ut habitant diam at. Suscipit tristique risus, at donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.',
      },
      { type: 'image', src: '/content/blog2.png', caption: 'Image caption goes here' },
      {
        type: 'paragraph',
        text:
          'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.',
        emphasized: true,
      },
      {
        type: 'paragraph',
        text:
          'Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.',
      },
      {
        type: 'quote',
        text:
          '"Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim mauris id. Non pellentesque congue eget consectetur turpis. Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt aenean tempus."',
      },
      {
        type: 'paragraph',
        text:
          'Tristique odio senectus nam posuere ornare leo metus, ultricies. Blandit duis ultricies vulputate morbi feugiat cras placerat elit. Aliquam tellus lorem sed ac. Montes, sed mattis pellentesque suscipit accumsan. Cursus viverra aenean magna risus elementum faucibus molestie pellentesque. Arcu ultricies sed mauris vestibulum.',
      },
      { type: 'heading', text: 'Conclusion' },
      {
        type: 'paragraph',
        text:
          'Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus id scelerisque est ultricies ultricies. Duis est sit sed leo nisl, blandit elit sagittis. Quisque tristique consequat quam sed. Nisl at scelerisque amet nulla purus habitasse.',
      },
      {
        type: 'paragraph',
        text:
          'Nunc sed faucibus bibendum feugiat sed interdum. Ipsum egestas condimentum mi massa. In tincidunt pharetra consectetur sed duis facilisis metus. Etiam egestas in nec sed et. Quis lobortis at sit dictum eget nibh tortor commodo cursus.',
      },
      {
        type: 'paragraph',
        text:
          'Odio felis sagittis, morbi feugiat tortor vitae feugiat fusce aliquet. Nam elementum urna nisi aliquet erat dolor enim. Ornare id morbi eget ipsum. Aliquam senectus neque ut id eget consectetur dictum. Donec posuere pharetra odio consequat scelerisque et, nunc tortor.Nulla adipiscing erat a erat. Condimentum lorem posuere gravida enim posuere cursus diam.',
      },
    ],
  },

  'rf4200-story': {
    id: 'rf4200-story',
    slug: 'rf4200-story',
    title: 'Behind the RF4200 — two years of engineering',
    excerpt:
      'A look at the design and engineering decisions that shaped our flagship double-door refrigerator.',
    coverImage: '/content/blog2.png',
    publishedAt: '2026-04-12',
    minRead: 6,
    tags: ['Design', 'Engineering'],
    breadcrumb: { section: 'Blog', category: 'Engineering' },
    author: { name: 'James Mwakyembe', role: 'Product Lead' },
    body: [
      { type: 'heading', text: 'The brief' },
      { type: 'paragraph', text: 'Vivamus tristique facilisis arcu, sit amet faucibus eros tristique nec…' },
    ],
  },
}

export function getBlogPost(slug: string): BlogPost | null {
  return POSTS[slug] ?? null
}

export function listAllBlogSlugs(): string[] {
  return Object.keys(POSTS)
}

export function getAllBlogPosts(): BlogPost[] {
  return Object.values(POSTS)
}
