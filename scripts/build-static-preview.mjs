import { chmod, cp, mkdtemp, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const source = resolve(import.meta.dirname, "..");
const basePath = process.argv[2] || "/v2";
if (!["/v2", "/vw"].includes(basePath)) throw new Error("Unsupported preview mount path.");
const singleHomepage = basePath === "/v2";
const temporary = await mkdtemp(join(tmpdir(), "aaa-static-preview-"));
const files = ["src", "public", "package.json", "package-lock.json", "next.config.ts", "next-env.d.ts", "tsconfig.json", "postcss.config.mjs", "components.json"];

for (const file of files) await cp(join(source, file), join(temporary, file), { recursive: true });
await rm(join(temporary, "src/app/dashboard"), { recursive: true, force: true });
await rm(join(temporary, "src/app/auth/callback"), { recursive: true, force: true });
await rm(join(temporary, "src/proxy.ts"), { force: true });
if (singleHomepage) await rm(join(temporary, "src/app/home-2"), { recursive: true, force: true });
await writeFile(join(temporary, "src/app/login/page.tsx"), 'export { default } from "../dashboard-preview/page";\n');
await symlink(join(source, "node_modules"), join(temporary, "node_modules"), "dir");

const env = {
  ...process.env,
  AAA_ENABLE_PREVIEW: "true",
  AAA_STATIC_EXPORT: "true",
  NEXT_PUBLIC_AAA_BASE_PATH: basePath,
  NEXT_PUBLIC_AAA_SINGLE_PREVIEW: singleHomepage ? "true" : "false",
  NEXT_PUBLIC_SUPABASE_URL: "",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "",
  AAA_SITE_ORIGIN: "",
};

const code = await new Promise((done, fail) => {
  const child = spawn("npm", ["run", "build"], { cwd: temporary, env, stdio: "inherit" });
  child.on("error", fail);
  child.on("exit", (exitCode) => done(exitCode));
});
if (code !== 0) throw new Error(`Static preview build failed in ${temporary}`);

// Revalidate preview documents; hashed assets keep their existing cache policy.
// This file is exported inside the preview mount only, never the WordPress root.
await writeFile(join(temporary, "out/.htaccess"), `Options -Indexes
<IfModule mod_dir.c>
  DirectorySlash Off
</IfModule>
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteOptions AllowNoSlash
  RewriteBase ${basePath}/
  RewriteRule ^$ index.html [L]
  RewriteCond %{DOCUMENT_ROOT}${basePath}/$1.html -f
  RewriteRule ^(.+?)/?$ $1.html [L]
</IfModule>
<IfModule mod_headers.c>
  <FilesMatch "\\.(html?|txt)$">
    Header always set Cache-Control "no-cache, max-age=0, must-revalidate"
    Header always set Pragma "no-cache"
    Header always set Expires "0"
  </FilesMatch>
</IfModule>
`);

// ZIP extraction preserves source modes. Every exported page and asset must be
// readable by the web server, even when a source image has a private file mode.
async function makeWebReadable(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await chmod(path, 0o755);
      await makeWebReadable(path);
    } else if (entry.isFile()) {
      await chmod(path, 0o644);
    }
  }
}
await makeWebReadable(join(temporary, "out"));
process.stdout.write(`Static preview: ${join(temporary, "out")}\n`);
