import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["aaenz.no"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.aaenz.no",
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
