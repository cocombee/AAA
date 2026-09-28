import { chmod, cp, mkdtemp, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const source = resolve(import.meta.dirname, "..");
const temporary = await mkdtemp(join(tmpdir(), "aaa-vw-preview-"));
const files = ["src", "public", "package.json", "package-lock.json", "next.config.ts", "next-env.d.ts", "tsconfig.json", "postcss.config.mjs", "components.json"];

for (const file of files) await cp(join(source, file), join(temporary, file), { recursive: true });
await rm(join(temporary, "src/app/dashboard"), { recursive: true, force: true });
await rm(join(temporary, "src/app/auth/callback"), { recursive: true, force: true });
await rm(join(temporary, "src/proxy.ts"), { force: true });
await writeFile(join(temporary, "src/app/login/page.tsx"), 'export { default } from "../dashboard-preview/page";\n');
await symlink(join(source, "node_modules"), join(temporary, "node_modules"), "dir");

const env = {
  ...process.env,
  AAA_ENABLE_PREVIEW: "true",
  AAA_STATIC_EXPORT: "true",
  NEXT_PUBLIC_AAA_BASE_PATH: "/vw",
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
