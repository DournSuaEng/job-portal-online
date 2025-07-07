import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['utfs.io','img.clerk.com'], // Add utfs.io to allow images from UploadThing
     
  },
};

export default nextConfig;
