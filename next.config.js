/** @type {import('next').NextConfig} */

module.exports = {
  // Compress responses
  compress: true,

  // Enable React strict mode để phát hiện vấn đề
  reactStrictMode: true,

  // Tối ưu hóa compiler
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Experimental features cho performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-markdown'],
    // Tăng tốc độ Fast Refresh
    scrollRestoration: true,
  },

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
