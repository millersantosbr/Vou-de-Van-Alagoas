/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure PWA assets are properly handled
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Special headers for manifest
        source: "/site.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
        ],
      },
    ]
  },
  // During production build, copy some files to the output
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure service worker and other critical PWA files are included
      // Note: This is handled differently in Next.js 13+ with app router
    }
    return config
  },
}

module.exports = nextConfig

