/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cloudflare Pages does not support Next.js Image Optimization;
    // use unoptimized mode so <Image> renders a plain <img> tag.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig
