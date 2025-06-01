import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://github.com/*'),
      new URL('http://localhost:9000/ecommerce/*'),
    ],
  },
}

export default nextConfig
