import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Re-enabled for GitHub Pages deployment
  basePath: "/hitesh-engineering",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: "..",
  },
};

export default nextConfig;
