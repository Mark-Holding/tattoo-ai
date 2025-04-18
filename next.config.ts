import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'replicate.delivery',
      'ljstutljyoxobatkqohf.supabase.co', // Your Supabase storage domain
    ],
  },
};

export default nextConfig;
