import path from "node:path";
import type { NextConfig } from "next";

const repoRoot = path.resolve(process.cwd(), "..");

const nextConfig: NextConfig = {
  outputFileTracingRoot: repoRoot,
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["orbcafe-ui"],
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
