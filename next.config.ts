import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lcgzqcukutvvgrgchifh.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [75, 100],
  },
};

export default nextConfig;