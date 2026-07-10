import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: false,
    clientSegmentCache: true
  }
};

export default nextConfig;
