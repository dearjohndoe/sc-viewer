import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',
  basePath: '/sc-viewer',
  assetPrefix: '/sc-viewer',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
