import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
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
