import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["utfs.io", "img.clerk.com"],
  },
  eslint : {
    ignoreDuringBuilds: true,
  }
 
  
};

export default nextConfig;