import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Оптимизации для Vercel
  output: 'standalone',
  experimental: {
    optimizeCss: false,
  },
  // Настройки CDN для Vercel
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Ensure CSS and static files are properly served
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
