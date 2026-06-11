/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'organicoptionsfarms.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.organicoptionsfarms.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        pathname: '/**',
      },
    ],
  },
}
module.exports = nextConfig
