#!/usr/bin/env node
// Reconcile the live CMS home content to the LIVE catalog taxonomy.
//
// The home content was ported from the old 4-category demo, but the live
// catalog has different category slugs and 51 real products. This script fixes
// the two stale references that break real-data rendering / cause 404s:
//
//   1. Featured tabs — remap each tab's `category` slug (and its hero/"view all"
//      hrefs) from the demo slug to the live category slug, so the product grid
//      resolves real products.
//   2. Hero slides — repoint each "Learn more" CTA from a dead demo product slug
//      (/products/rf4200 …) to the relevant live CATEGORY listing page (product
//      names are opaque model numbers, so a category link is the correct,
//      guaranteed-valid target; there is no AC category, so that slide → /products).
//
// SAFE BY DEFAULT: dry-run prints a before→after diff and writes nothing. Pass
// --commit to PATCH /pages/home. Idempotent (re-applying the maps is a no-op).
//
//   node scripts/reconcile-home-taxonomy.mjs            # dry-run
//   node scripts/reconcile-home-taxonomy.mjs --commit   # write to prod CMS

const COMMIT = process.argv.includes('--commit')
const API_BASE = process.env.API_BASE ?? 'https://fs-backend-tvk8.onrender.com'
const TENANT_SLUG = process.env.TENANT_SLUG ?? 'mr-uk'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mruk.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@12345'

// Demo category slug → live category slug (verified against GET /categories).
const SLUG_MAP = {
  kitchen: 'kitchen-appliances',
  music: 'music-tv',
  refrigerator: 'refrigerators-freezers',
  'refrigerator-ac': 'refrigerators-freezers', // demo used this in hrefs
  agriculture: 'agriculture', // already correct
}

// Hero slide id → live category listing (no AC category exists → browse all).
const HERO_CTA = {
  'slide-001': '/products?category=refrigerators-freezers', // double-door refrigerator
  'slide-002': '/products?category=kitchen-appliances', // air fryer
  'slide-003': '/products', // BreezIN AC — no AC category live
  'slide-004': '/products?category=music-tv', // soundbar
}

async function api(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'x-tenant-slug': TENANT_SLUG,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const text = await res.text()
  let json; try { json = text ? JSON.parse(text) : null } catch { json = text }
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${json?.message ? JSON.stringify(json.message) : text}`)
  return json
}

// Rewrite any `/products?category=<demo>` href to its live slug.
const remapHref = (href) => {
  if (typeof href !== 'string') return href
  const m = href.match(/^\/products\?category=([^&]+)$/)
  if (m && SLUG_MAP[m[1]]) return `/products?category=${SLUG_MAP[m[1]]}`
  return href
}

const changes = []
function note(where, before, after) {
  if (before !== after) changes.push(`  ${where}\n      ${before}  →  ${after}`)
}

function reconcileFeatured(content) {
  const next = structuredClone(content)
  for (const tab of next.tabs?.items ?? []) {
    const live = SLUG_MAP[tab.category]
    if (live && live !== tab.category) { note(`featured tab "${tab.id}".category`, tab.category, live); tab.category = live }
    if (tab.hero?.cta?.href) {
      const h = remapHref(tab.hero.cta.href)
      note(`featured tab "${tab.id}".hero.cta.href`, tab.hero.cta.href, h); tab.hero.cta.href = h
    }
  }
  return next
}

function reconcileHero(content) {
  const next = structuredClone(content)
  for (const slide of next.slides ?? []) {
    const target = HERO_CTA[slide.id]
    if (target && slide.cta?.href !== target) {
      note(`hero slide "${slide.id}".cta.href`, slide.cta?.href, target)
      slide.cta = { ...(slide.cta ?? {}), href: target }
    }
  }
  return next
}

async function main() {
  console.log(`\n${COMMIT ? '🔴 COMMIT' : '🟡 DRY-RUN'} · ${API_BASE} · tenant ${TENANT_SLUG}\n`)
  const { accessToken: token, user } = await api('/auth/login', { method: 'POST', body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })
  console.log(`🔑 ${user?.email} (${user?.roleSlug})\n`)

  const home = await api('/pages/home', { token })
  const updates = []
  for (const s of home.sections) {
    if (s.type === 'featured_products') updates.push({ key: s.key, content: reconcileFeatured(s.content ?? {}) })
    if (s.type === 'hero_carousel') updates.push({ key: s.key, content: reconcileHero(s.content ?? {}) })
  }

  console.log(changes.length ? `Changes (${changes.length}):\n${changes.join('\n')}` : 'No changes — already reconciled.')

  if (COMMIT && changes.length) {
    await api('/pages/home', { method: 'PATCH', token, body: { sections: updates } })
    console.log(`\n✅ PATCHed /pages/home (${updates.length} sections)`)
  } else if (!COMMIT && changes.length) {
    console.log(`\nRe-run with --commit to write.`)
  }
  console.log()
}

main().catch((e) => { console.error('\n❌', e.message, '\n'); process.exit(1) })
