import type { NextConfig } from "next";
import { LEGACY_REDIRECTS } from "./src/lib/catalog";

const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).map(([from, to]) => ({
      source: `/${from}`,
      destination: `/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
