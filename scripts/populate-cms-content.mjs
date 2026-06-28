#!/usr/bin/env node
// Populate the live Fanisi CMS `pages.*.content` from our local `mruk.json`.
//
// The backend activated the CMS and scaffolded every page/section to match our
// site, but each section's `content` is empty ({}). This script ports the
// content we already authored in src/data/tenants/mruk.json into the CMS via
// `PATCH /pages/{key}`, so the storefront can later render from `/pages`.
//
// SAFE BY DEFAULT: runs in --dry-run mode (prints the exact PATCH payloads and a
// per-section match report, sends nothing). Pass --commit to actually write to
// the live CMS. It logs in as the seeded admin and PATCHes content only.
//
// Idempotent: PATCH replaces a section's `content` wholesale, so re-running
// converges. Matching is by section `type` (robust to key renames).
//
//   node scripts/populate-cms-content.mjs                 # dry-run (default)
//   node scripts/populate-cms-content.mjs --commit        # write to prod CMS
//   node scripts/populate-cms-content.mjs --only=home     # limit to one page key
//
// Env (all optional; sensible prod defaults):
//   API_BASE        default https://fs-backend-tvk8.onrender.com
//   TENANT_SLUG     default mr-uk
//   ADMIN_EMAIL     default admin@mruk.com
//   ADMIN_PASSWORD  default Admin@12345

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const argv = process.argv.slice(2)
const COMMIT = argv.includes('--commit')
const ONLY = (argv.find((a) => a.startsWith('--only=')) || '').split('=')[1] || null

const API_BASE = process.env.API_BASE ?? 'https://fs-backend-tvk8.onrender.com'
const TENANT_SLUG = process.env.TENANT_SLUG ?? 'mr-uk'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@mruk.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'Admin@12345'

const tenant = JSON.parse(
  readFileSync(join(__dirname, '..', 'src', 'data', 'tenants', 'mruk.json'), 'utf8'),
)

// ── tiny fetch helper ──────────────────────────────────────────────────────
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
  let json
  try { json = text ? JSON.parse(text) : null } catch { json = text }
  if (!res.ok) {
    const msg = json && json.message ? JSON.stringify(json.message) : text
    throw new Error(`${method} ${path} → ${res.status}: ${msg}`)
  }
  return json
}

// ── content builders: mruk.json → CMS `content`, keyed by section `type` ─────
// Each builder receives the tenant config and returns the `content` object that
// matches the live `/section-catalog` field contract for that type.
//
// home_* types map 1:1 — the backend's field contracts mirror our section props,
// so we copy the section's `props` straight across (matched by type below).
function homeSectionProps(type) {
  const s = (tenant.pages.home?.sections ?? []).find((x) => x.type === type)
  return s ? s.props : null
}

const BUILDERS = {
  // ----- Home page content sections (props mirror the CMS field contract) -----
  hero_carousel: () => homeSectionProps('hero_carousel'),
  featured_products: () => homeSectionProps('featured_products'),
  best_quality_showcase: () => homeSectionProps('best_quality_showcase'),
  popular_products: () => homeSectionProps('popular_products'),
  blog_preview: () => homeSectionProps('blog_preview'),

  // ----- Global chrome: WhatsApp widget (phone from contact, keep label) -----
  whatsappWidget: () => ({
    phone: tenant.global?.contact?.whatsapp ?? '',
    label: { en: 'Chat with us', sw: 'Ongea nasi' },
  }),

  // ----- Global chrome: Footer (strip fields not in the CMS contract) -----
  // CMS footer contract: variant, brand{tagline, socials{facebook,instagram,x,
  // linkedin,youtube}, contactDisplay[]{label,value}}, columns[]{id,title,
  // links[]{label,href}}, bottomBar{copyright, legalLinks[]{label,href}}.
  // mruk.json carries extra keys (link ids, featureFlags, tiktok, string-array
  // contactDisplay) that strict validation would reject — drop them here.
  footer: () => {
    const f = tenant.global?.footer
    if (!f) return null
    const c = tenant.global?.contact ?? {}
    return {
      variant: f.variant,
      brand: {
        tagline: f.brand?.tagline,
        socials: {
          // Only instagram survives the contract (no tiktok field in CMS).
          ...(f.brand?.socials?.instagram ? { instagram: f.brand.socials.instagram } : {}),
        },
        // Rebuild contactDisplay as {label,value} from real contact data.
        contactDisplay: [
          ...(c.phones ?? []).map((p) => ({ label: p.label, value: p.value })),
          ...(c.emails ?? []).map((e) => ({ label: e.label, value: e.value })),
        ],
      },
      columns: (f.columns ?? []).map((col) => ({
        id: col.id,
        title: col.title,
        links: (col.links ?? []).map((l) => ({ label: l.label, href: l.href })),
      })),
      bottomBar: {
        copyright: f.bottomBar?.copyright,
        legalLinks: (f.bottomBar?.legalLinks ?? []).map((l) => ({ label: l.label, href: l.href })),
      },
    }
  },
}

// Sections we deliberately DO NOT auto-populate (documented, not silent):
//  - navbar: contract diverges (auth.signIn shape, userMenu, dataSource=categories
//    injects category links server-side); safer to configure in the dashboard.
//  - text pages (about/faq/contact/service_locator/blog/privacy/terms/cookies):
//    their copy lives hardcoded in React components, not in mruk.json — needs a
//    separate extraction pass or dashboard authoring.
const SKIP_TYPES = new Set(['navbar'])

// ── main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${COMMIT ? '🔴 COMMIT' : '🟡 DRY-RUN'} · ${API_BASE} · tenant ${TENANT_SLUG}\n`)

  const token = COMMIT || true ? await login() : null
  const pages = await api('/pages', { token })
  const targets = ONLY ? pages.filter((p) => p.key === ONLY) : pages

  let patched = 0, skipped = 0, unmatched = 0
  for (const page of targets) {
    const updates = []
    for (const section of page.sections ?? []) {
      if (SKIP_TYPES.has(section.type)) { skipped++; continue }
      const build = BUILDERS[section.type]
      if (!build) { continue } // no builder for this type → leave as-is
      const content = build(tenant)
      if (content == null) { unmatched++; console.log(`   · ${page.key}/${section.key} (${section.type}) — no source data, skipped`); continue }
      updates.push({ key: section.key, content })
    }
    if (!updates.length) continue

    console.log(`\n📄 ${page.key}  (${page.path ?? 'no path'})`)
    for (const u of updates) {
      const bytes = JSON.stringify(u.content).length
      console.log(`   → ${u.key}: ${bytes} bytes of content`)
    }

    if (COMMIT) {
      await api(`/pages/${page.key}`, { method: 'PATCH', token, body: { sections: updates } })
      console.log(`   ✅ PATCHed /pages/${page.key}`)
    } else {
      console.log(`   (dry-run) payload:`)
      console.log(indent(JSON.stringify({ sections: updates }, null, 2), 6))
    }
    patched += updates.length
  }

  console.log(`\n${COMMIT ? 'Committed' : 'Would patch'}: ${patched} section(s) · skipped(navbar): ${skipped} · no-source: ${unmatched}`)
  if (!COMMIT) console.log(`\nRe-run with --commit to write to the live CMS.\n`)
}

async function login() {
  const out = await api('/auth/login', {
    method: 'POST',
    body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  if (!out?.accessToken) throw new Error('login returned no accessToken')
  console.log(`🔑 logged in as ${out.user?.email ?? ADMIN_EMAIL} (${out.user?.roleSlug ?? '?'})\n`)
  return out.accessToken
}

const indent = (s, n) => s.split('\n').map((l) => ' '.repeat(n) + l).join('\n')

main().catch((e) => { console.error('\n❌', e.message, '\n'); process.exit(1) })
