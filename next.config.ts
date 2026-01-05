import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/auth/google',
        destination: 'http://localhost:3333/auth/google',
      },
      {
        source: '/auth/google/callback',
        destination: 'http://localhost:3333/auth/google/callback',
      },
      // Also handy:
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/:path*',
      },
    ];
  },
};

export default nextConfig;
