/** @type {import('next').NextConfig} */

module.exports = {
  // Environment variables
  env: {
    NEXT_PUBLIC_GATEWAY_DEPLOY: process.env.NEXT_PUBLIC_GATEWAY_DEPLOY,
    NEXT_PUBLIC_COMETCHAT_APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID,
    NEXT_PUBLIC_COMETCHAT_AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY,
    NEXT_PUBLIC_COMETCHAT_REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION,
  },

  // Compress responses
  compress: true,

  // Enable React strict mode để phát hiện vấn đề
  reactStrictMode: true,

  // ESLint config for build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // TypeScript config for build
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  // Tối ưu hóa compiler
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Loại bỏ source maps trong production
  productionBrowserSourceMaps: false,

  // Experimental features cho performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-markdown',
      'recharts',
      'framer-motion',
      'sweetalert2',
      'axios',
    ],
    // Tăng tốc độ Fast Refresh
    scrollRestoration: true,
    // Tối ưu CSS
    optimizeCss: true,
  },

  // Turbopack config (Next.js 15+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      // Alias nếu cần
    },
  },

  // Tối ưu output
  output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers cho caching
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};
