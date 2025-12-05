import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
        protocol: "https",
      },
    ],
  },
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const backendUrl = isDevelopment
      ? process.env.NEXT_PUBLIC_API_URL_DEVELOPMENT
      : process.env.NEXT_PUBLIC_API_URL_PRODUCTION;
    if (!backendUrl) {
      console.error("Backend URL is not defined. Check your .env.local file.");
      return [];
    }
    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
