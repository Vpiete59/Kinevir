/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Désactive ESLint pendant le build de production
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig