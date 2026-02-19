import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: ['localhost:3000', 'betterbasket.com'],
    },
  },
};

export default config;
