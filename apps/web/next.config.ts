import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(rootDir, "../../"),
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
