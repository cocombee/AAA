"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "@/lib/supabase/server";
import { authConfig } from "@/lib/supabase/config";

export async function signInWithGoogle() {
  const config = authConfig();
  const supabase = await createAuthClient();
  if (!config || !supabase) redirect("/login?error=unavailable");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${config.origin}${config.basePath}/auth/callback`,
      scopes: "openid email profile",
      queryParams: { prompt: "select_account" },
      skipBrowserRedirect: true,
    },
  });
  if (error || !data.url) redirect("/login?error=provider");
  // Redirect only to the configured Auth provider, never a user-supplied URL.
  const destination = new URL(data.url);
  if (destination.origin !== config.url || destination.pathname !== "/auth/v1/authorize") redirect("/login?error=provider");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createAuthClient();
  if (supabase) {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error) redirect("/dashboard?error=signout");
  }
  revalidatePath("/dashboard");
  redirect("/");
}
