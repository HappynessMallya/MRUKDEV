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

  // Multi-Zone: the admin dashboard is a separate Next app (in ./dashboard)
  // served under /dashboard via its own `basePath`. We proxy every /dashboard
  // request to that zone. Set DASHBOARD_URL to the dashboard deployment URL in
  // production; it defaults to the local dev server (port 3001).
  async rewrites() {
    const dashboard = process.env.DASHBOARD_URL ?? 'http://localhost:3001'
    return [
      { source: '/dashboard', destination: `${dashboard}/dashboard` },
      { source: '/dashboard/:path*', destination: `${dashboard}/dashboard/:path*` },
    ]
  },
}

export default nextConfig
