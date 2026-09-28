// Build-time mount path. Next.js applies it to Link/redirect routes automatically;
// public asset URLs and provider callbacks need the explicit prefix.
export const basePath = process.env.NEXT_PUBLIC_AAA_BASE_PATH || "";
export const assetPath = (path: string) => `${basePath}${path}`;
