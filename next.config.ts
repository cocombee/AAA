import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_AAA_BASE_PATH || "";
if (!["", "/v2"].includes(basePath)) throw new Error("Unsupported AAA mount path.");
const config: NextConfig = { devIndicators: false, basePath, images: { qualities: [75, 90] } };
export default config;
