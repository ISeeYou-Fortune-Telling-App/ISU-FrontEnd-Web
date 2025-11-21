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

  // Tối ưu performance
  swcMinify: true,

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
    // Tối ưu fonts
    optimizeFonts: true,
  },

  // Tối ưu output
  output: 'standalone',

  // Tối ưu webpack
  webpack: (config, { dev, isServer }) => {
    // Tăng tốc độ build trong dev mode
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    // Loại bỏ duplicate code
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      // Loại bỏ duplicate modules
      providedExports: true,
      usedExports: true,
      sideEffects: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Recharts chunk (nặng)
          recharts: {
            name: 'recharts',
            test: /[\\/]node_modules[\\/](recharts)[\\/]/,
            priority: 30,
          },
          // CometChat chunk (rất nặng)
          cometchat: {
            name: 'cometchat',
            test: /[\\/]node_modules[\\/](@cometchat)[\\/]/,
            priority: 30,
          },
        },
      },
    };

    return config;
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
