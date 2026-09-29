import { readFile, readdir, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const output = resolve(process.argv[2] || "out");
const basePath = process.argv[3] || "/v2";
if (!["/v2", "/vw"].includes(basePath)) throw new Error("Unsupported preview mount path.");
const screens = JSON.parse(await readFile(new URL("../src/lib/figma-flow-screens.json", import.meta.url), "utf8"));
const targets = JSON.parse(await readFile(new URL("../src/lib/figma-flow-targets.json", import.meta.url), "utf8"));
const known = new Set(screens.map((screen) => screen.slug));
const issues = [];

for (const entry of targets) for (const target of entry.targets) {
  if (target && !known.has(target)) issues.push(`Unknown flow target: ${entry.slug} -> ${target}`);
}

async function exists(path) { try { await stat(path); return true; } catch { return false; } }
async function htmlFiles(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => entry.isDirectory() ? htmlFiles(join(path, entry.name)) : Promise.resolve(entry.name.endsWith(".html") ? [join(path, entry.name)] : [])));
  return nested.flat();
}

const pages = await htmlFiles(output);
let links = 0;
for (const screen of screens) {
  if (!await exists(join(output, "flow", screen.slug, "index.html")) && !await exists(join(output, "flow", `${screen.slug}.html`))) issues.push(`Missing flow page: ${screen.slug}`);
}
for (const page of pages) {
  const html = await readFile(page, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (!url.startsWith(`${basePath}/`)) continue;
    links += 1;
    const relative = decodeURIComponent(url.slice(basePath.length + 1).split(/[?#]/, 1)[0]);
    const asset = join(output, relative);
    if (!await exists(asset) && !await exists(join(asset, "index.html")) && !await exists(`${asset}.html`)) issues.push(`Missing link in ${page}: ${url}`);
  }
}

if (issues.length) { process.stderr.write(`${issues.slice(0, 30).join("\n")}\n${issues.length} issue(s)\n`); process.exitCode = 1; }
else process.stdout.write(`${pages.length} HTML pages, ${screens.length} flow routes, ${links} local links/assets: OK\n`);
