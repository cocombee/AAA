import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_AAA_BASE_PATH || "";
if (!["", "/v2", "/vw"].includes(basePath)) throw new Error("Unsupported AAA mount path.");
const staticPreview = process.env.AAA_STATIC_EXPORT === "true";
const config: NextConfig = {
  devIndicators: false,
  basePath,
  output: staticPreview ? "export" : undefined,
  trailingSlash: staticPreview,
  images: { qualities: [75, 90], unoptimized: staticPreview },
};
export default config;
