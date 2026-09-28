import Link from "next/link";
import { notFound } from "next/navigation";
import { previewEnabled } from "@/lib/supabase/config";

export default function DashboardPreview() {
  if (!previewEnabled()) notFound();
  return <main className="login-page"><section className="login-main"><h1>Pratonton akaun AAA</h1><p>Rekod latihan sahaja. Tiada akaun atau tempahan sebenar.</p><Link href="/flow/member-26-akaun-utama">Buka akaun contoh</Link></section></main>;
}
