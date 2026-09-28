"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/app/auth/actions";

function GoogleSubmit({ enabled }: { enabled: boolean }) {
  const { pending } = useFormStatus();
  return <Button variant="outline" size="lg" className="google-login" type="submit" disabled={!enabled || pending}>
    {pending ? "Membuka Google…" : "Teruskan dengan Google"}
  </Button>;
}

export function GoogleLogin({ enabled }: { enabled: boolean }) {
  return <form action={signInWithGoogle}><GoogleSubmit enabled={enabled} /></form>;
}
