import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io', 'img.clerk.com'], // Allow images from UploadThing and Clerk
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during `npm run dev` and `npm run build`
  },
};

export default nextConfig;