#!/usr/bin/env node
/**
 * rasterize-fake-svgs.mjs
 *
 * Many SVGs in /public are actually rasters (base64 PNG) wrapped in an
 * <svg> shell — they ship 600KB–2MB per icon over the wire even though
 * the rendered size is < 200×200px.
 *
 * This script walks /public, finds those bloated SVGs (size > THRESHOLD,
 * or content has `base64`), reads their viewBox dimensions, and uses
 * sharp to rasterize them into a real PNG at 2× the intrinsic size
 * (high-DPI safe). The resulting PNG sits next to the SVG with the
 * same basename. Code references will be updated separately.
 *
 * Usage:
 *   node scripts/rasterize-fake-svgs.mjs            # dry-run
 *   node scripts/rasterize-fake-svgs.mjs --apply    # actually write PNGs
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public')

// Anything over ~80KB is suspicious for an SVG icon. We still verify
// base64 content as a second signal before converting.
const SIZE_THRESHOLD = 80 * 1024

const APPLY = process.argv.includes('--apply')

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function parseDimensions(svg) {
  // Prefer width/height attributes if present.
  const wAttr = svg.match(/<svg[^>]*\swidth="(\d+(?:\.\d+)?)"/)
  const hAttr = svg.match(/<svg[^>]*\sheight="(\d+(?:\.\d+)?)"/)
  if (wAttr && hAttr) {
    return { width: Math.round(+wAttr[1]), height: Math.round(+hAttr[1]) }
  }
  const view = svg.match(/<svg[^>]*\sviewBox="\s*[\d.-]+\s+[\d.-]+\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/)
  if (view) {
    return { width: Math.round(+view[1]), height: Math.round(+view[2]) }
  }
  return { width: 600, height: 600 } // fallback
}

const results = []

for await (const file of walk(PUBLIC_DIR)) {
  if (!file.toLowerCase().endsWith('.svg')) continue

  const stat = await fs.stat(file)
  if (stat.size < SIZE_THRESHOLD) continue

  const svg = await fs.readFile(file, 'utf8')
  if (!svg.includes('base64')) continue // legit complex SVG, leave alone

  const dims = parseDimensions(svg)
  // Render at 2× for retina screens, capped at 800px wide (most icons
  // never need more — bigger lifestyle hero images can be tuned later).
  const renderWidth = Math.min(dims.width * 2, 800)
  const renderHeight = Math.round((dims.height / dims.width) * renderWidth)

  const pngPath = file.replace(/\.svg$/i, '.png')
  const beforeKB = (stat.size / 1024).toFixed(1)

  if (!APPLY) {
    results.push({ file: path.relative(PUBLIC_DIR, file), beforeKB, dims, renderWidth, renderHeight })
    continue
  }

  // Bypass sharp's SVG parser (hits libxml's hard buffer limit on
  // 20MB monsters). Extract the largest embedded base64 raster from
  // the SVG and resize that directly — that's the only payload that
  // matters anyway since the SVG is just a wrapper.
  const dataUriMatches = [...svg.matchAll(/data:image\/(png|jpe?g);base64,([A-Za-z0-9+/=]+)/g)]
  const biggest = dataUriMatches.length > 0
    ? dataUriMatches.reduce((a, b) => (b[2].length > a[2].length ? b : a))
    : null

  let pipeline
  if (biggest) {
    const rasterBuffer = Buffer.from(biggest[2], 'base64')
    pipeline = sharp(rasterBuffer)
  } else {
    pipeline = sharp(Buffer.from(svg))
  }

  const buffer = await pipeline
    .resize(renderWidth, renderHeight, { fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toBuffer()

  await fs.writeFile(pngPath, buffer)
  const afterKB = (buffer.length / 1024).toFixed(1)
  results.push({
    file: path.relative(PUBLIC_DIR, file),
    beforeKB,
    afterKB,
    saved: ((stat.size - buffer.length) / 1024).toFixed(1),
  })
}

if (results.length === 0) {
  console.log('No oversize SVGs found. Nothing to do.')
} else if (!APPLY) {
  console.log(`\nDry run — ${results.length} oversize SVG(s) detected:\n`)
  for (const r of results) {
    console.log(
      `  ${r.file.padEnd(72)}  ${r.beforeKB} KB  →  rasterize at ${r.renderWidth}×${r.renderHeight}`
    )
  }
  console.log('\nRun again with --apply to write PNGs alongside.')
} else {
  let totalBefore = 0
  let totalAfter = 0
  console.log(`\nRasterized ${results.length} SVG(s):\n`)
  for (const r of results) {
    totalBefore += +r.beforeKB
    totalAfter += +r.afterKB
    console.log(
      `  ${r.file.padEnd(72)}  ${r.beforeKB} KB  →  ${r.afterKB} KB  (saved ${r.saved} KB)`
    )
  }
  console.log(`\nTotal:  ${totalBefore.toFixed(1)} KB  →  ${totalAfter.toFixed(1)} KB`)
  console.log(`Saved:  ${(totalBefore - totalAfter).toFixed(1)} KB (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`)
}
