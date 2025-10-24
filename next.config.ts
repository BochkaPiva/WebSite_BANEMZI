import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Оптимизация изображений
  images: { 
    unoptimized: false, // Включаем оптимизацию
    formats: ['image/webp', 'image/avif'], // Современные форматы
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 год кеша для изображений
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Оптимизации для Vercel
  output: 'standalone',
  experimental: {
    optimizeCss: false, // Отключаем из-за проблем с critters
  },
  // Настройки CDN для Vercel
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Оптимизированное кеширование для разных типов ресурсов
  async headers() {
    return [
      // Статические ресурсы (изображения, иконки, шрифты) - кеш на 1 год
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // CSS и JS файлы - кеш на 1 год
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // HTML страницы - кеш на 1 час
      {
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
