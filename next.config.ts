import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      {
        source: "/work/loot-membership",
        destination: "/work/rolesync",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
