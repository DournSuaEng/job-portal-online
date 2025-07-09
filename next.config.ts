import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['utfs.io', 'img.clerk.com'], // Allow UploadThing and Clerk images
  },
  typescript: {
    // Allow production builds to succeed even if there are type errors
    // Set to true only if you understand the risk
    ignoreBuildErrors: false,
  },
  // Optional: Enable SWC minification and future features
  swcMinify: true,
  experimental: {
    // Add experimental options here if needed
  },
};

export default nextConfig;
