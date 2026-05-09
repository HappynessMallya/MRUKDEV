import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'bucket.mruk.co.tz' },
      { protocol: 'https', hostname: '*.mruk.co.tz' },
    ],
  },
}

export default nextConfig
