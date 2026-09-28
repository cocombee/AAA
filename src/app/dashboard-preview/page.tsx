"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPreview() {
  const router = useRouter();
  useEffect(() => { router.replace("/flow/member-26-akaun-utama"); }, [router]);
  return <main className="login-page"><section className="login-main"><h1>Membuka akaun...</h1><Link href="/flow/member-26-akaun-utama">Buka akaun</Link></section></main>;
}
