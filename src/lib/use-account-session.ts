"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { developmentSessionEvent, hasDevelopmentSession } from "@/lib/development-session";

export function useAccountSession(preview: boolean) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (preview) {
      const sync = () => setActive(hasDevelopmentSession());
      sync();
      window.addEventListener(developmentSessionEvent, sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener(developmentSessionEvent, sync);
        window.removeEventListener("storage", sync);
      };
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return;
    const client = createBrowserClient(url, key);
    let mounted = true;
    void client.auth.getUser().then(({ data, error }) => {
      if (mounted) setActive(!error && Boolean(data.user));
    });
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        if (mounted) setActive(Boolean(session?.user));
      }
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [preview]);

  return active;
}
