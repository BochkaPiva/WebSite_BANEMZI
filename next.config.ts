import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Оптимизации для Netlify
  output: 'export',
  trailingSlash: true,
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
