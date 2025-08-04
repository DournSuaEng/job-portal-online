import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io", "img.clerk.com"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
};

export default nextConfig;