import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep generated AI instruction files out of this standalone client repo.
  agentRules: false,
};

export default nextConfig;
