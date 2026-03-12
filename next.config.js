/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure API routes work correctly in production
  async rewrites() {
    return [];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce memory usage during build
  experimental: {
    optimizeCss: false, // Disable CSS optimization to save memory
  },
};

module.exports = nextConfig;




