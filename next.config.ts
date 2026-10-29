import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/hitesh-engineering",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Inline CSS into each page: removes the render-blocking stylesheet round trips.
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;
