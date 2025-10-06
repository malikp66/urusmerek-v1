// next.config.ts
import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(
  __dirname,
  "src/visual-edits/component-tagger-loader.js"
);

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },

  // ✅ Only use outputFileTracingRoot locally (or when you really need it)
  ...(isVercel
    ? {}
    : {
        outputFileTracingRoot: path.resolve(__dirname, "../../"),
      }),

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // (optional) you enabled “Skipping types” anyway

  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER],
      },
    },
  },
};

export default nextConfig;
