import "server-only";
import { basePath } from "@/lib/site-path";

export function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const origin = process.env.AAA_SITE_ORIGIN;
  if (!url || !key || !origin) return null;
  try {
    const site = new URL(origin);
    const backend = new URL(url);
    const local = ["localhost", "127.0.0.1"].includes(site.hostname);
    if (site.protocol !== "https:" && !(local && site.protocol === "http:")) return null;
    if (backend.protocol !== "https:") return null;
    if (site.username || site.password || site.pathname !== "/" || site.search || site.hash) return null;
    return { url: backend.origin, key, origin: site.origin, basePath };
  } catch { return null; }
}

export const previewEnabled = () => process.env.AAA_ENABLE_PREVIEW === "true";
