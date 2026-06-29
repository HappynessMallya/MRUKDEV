import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Multi-Zone: this admin app is served under /dashboard of the storefront
  // domain. basePath prefixes every route AND its _next assets with /dashboard,
  // so next/link and next/router auto-prefix and there are no asset clashes
  // with the storefront zone. (Must be set at build time — it's inlined.)
  basePath: "/dashboard",

  images: {
    formats: ["image/avif", "image/webp"],
    // Add the backend / CDN hostnames that serve product & article images.
    remotePatterns: [
      // Cloudflare R2 (mruk-product-images) — live product & article images.
      { protocol: "https", hostname: "pub-1c80634c6ca74f99a1583b3d9b57f3de.r2.dev" },
    ],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Server Actions verify the request Origin. Because the storefront domain
    // proxies /dashboard to this zone, requests arrive with the storefront's
    // origin — it must be allow-listed or every form action 403s. Add the real
    // production domain(s) here alongside local dev.
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "mruk.co.tz",
        "www.mruk.co.tz",
      ],
    },
  },
};

export default nextConfig;
