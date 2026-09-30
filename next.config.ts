import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "10.213.190.93",
    "10.213.190.93:3000",
    "10.162.112.201",
    "10.162.112.201:3000",
    "10.*",
    "192.168.*",
  ],
};

export default nextConfig;

