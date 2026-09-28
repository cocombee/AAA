import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { authConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const config = authConfig();
  if (!config) return new NextResponse("Log masuk belum tersedia.", { status: 503, headers: { "Cache-Control": "private, no-store, max-age=0" } });
  const origin = `${config.origin}${config.basePath}`;
  const supabase = await createAuthClient();
  const code = incoming.searchParams.get("code");
  if (config && supabase && code && !incoming.searchParams.has("error")) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data, error: validationError } = await supabase.auth.getUser();
      if (!validationError && data.user) return privateRedirect(`${origin}/dashboard`);
    }
  }
  return privateRedirect(`${origin}/login?error=callback`);
}

function privateRedirect(url: string) {
  const response = NextResponse.redirect(url);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
