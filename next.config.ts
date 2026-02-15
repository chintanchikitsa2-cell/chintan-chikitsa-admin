import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb", // or "5mb", "20mb"
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cmyygklvjhwpholkkfit.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;
