import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mongoose/bcryptjs — серверные пакеты, не бандлим их.
  serverExternalPackages: ["mongoose", "bcryptjs"],
};

export default nextConfig;
