import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
  i18n: {
    locales: ["es"],
    defaultLocale: "es",
  },
};

export default nextConfig;