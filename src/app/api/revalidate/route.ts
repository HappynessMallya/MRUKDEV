import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// On-demand revalidation. The backend (fs-backend RevalidationService) POSTs
// here after a CMS mutation so the storefront drops its ISR cache immediately,
// instead of waiting out the ~5-min revalidate window. Auth: shared secret in
// the `x-revalidate-secret` header.
//
// Body: { tags?: string[]; paths?: string[] }
//   tags  — informational (site-config | articles | pages)
//   paths — optional explicit paths; defaults to a full-tree purge
// Env:  REVALIDATE_SECRET (must match the backend's)
//
// Site-config drives global chrome (navbar/footer/contact) on every page, and
// the site is small with infrequent admin edits, so the default purges the
// whole tree via the root layout — reliable and signature-stable across the
// Next 16 cache API changes (updateTag is Server-Action-only; revalidateTag now
// needs a cacheLife profile).
export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret || req.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { tags?: string[]; paths?: string[] } = {}
  try {
    body = await req.json()
  } catch {
    // empty/invalid body → fall through to a full-tree purge
  }

  const paths = body.paths?.length ? body.paths : ['/']
  for (const p of paths) revalidatePath(p, 'layout')

  return NextResponse.json({
    revalidated: true,
    paths,
    tags: body.tags ?? [],
  })
}
