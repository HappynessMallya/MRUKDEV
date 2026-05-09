import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bucket.mruk.co.tz' },
      { protocol: 'https', hostname: '*.mruk.co.tz' },
      // Temporary placeholder source — used for music + agriculture product
      // mocks until the real catalog photography is supplied. Drop this entry
      // once every product image lives under /products/<category>/.
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
    // Modern formats first — Vercel's optimizer picks the smallest the
    // browser can render. AVIF is ~50% smaller than the equivalent JPEG/PNG;
    // WebP is the safe fallback for older browsers.
    formats: ['image/avif', 'image/webp'],
    // Allow SVGs through the optimizer so they benefit from CDN caching
    // alongside the rest. SVG can execute scripts, so we lock down what
    // it can do via a strict per-image CSP and disable inline scripts.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
