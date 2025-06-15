import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL('https://github.com/*'),
      new URL('https://i.pravatar.cc/*'),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
