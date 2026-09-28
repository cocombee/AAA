import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { GoogleLogin } from "@/components/account/google-login";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/site-path";
import { authConfig, previewEnabled } from "@/lib/supabase/config";

export default function LoginPage() {
  const preview = previewEnabled();
  const googleReady = Boolean(authConfig());
  return <main className="login-page">
    <section className="login-main">
      <Link href="/" className="brand" aria-label="Kembali ke halaman utama"><Brand /></Link>
      <div className="login-copy">
        <span className="eyebrow">AKAUN ASRI AHMAD ACADEMY</span>
        <h1>{preview ? "Lihat akaun contoh." : "Selamat kembali."}</h1>
        <p>{preview ? "Terokai tempahan dan operasi dengan rekod latihan. Ini bukan log masuk sebenar." : "Log masuk dengan Google untuk melihat tempahan dan maklumat kelas anda."}</p>
        {preview ? <Button size="lg" asChild><Link href="/flow/member-26-akaun-utama">Buka pratonton akaun</Link></Button> : <GoogleLogin enabled={googleReady} />}
        {!preview && !googleReady && <div className="account-setup-note"><strong>Log masuk belum tersedia.</strong><p>Sambungan identiti masih disediakan. Hubungi AAA jika anda memerlukan bantuan.</p></div>}
        <p className="login-privacy">{preview ? "Tiada akaun, tempahan atau bayaran sebenar dalam pratonton ini." : "Akaun anda hanya memaparkan rekod yang dibenarkan untuk identiti anda."}</p>
      </div>
      <Button variant="secondary" asChild><Link href="/">Kembali ke laman utama</Link></Button>
    </section>
    <aside className="login-visual" aria-hidden="true"><Image src={assetPath("/images/asri-studio-crisp.webp")} alt="" fill sizes="50vw" className="portrait-photo" /><div><span className="eyebrow">BELAJAR BERSAMA AAA</span><h2>Ilmu dahulu.<br />Langkah yakin.</h2><p>Semak program, sesi dan penyertaan di satu tempat.</p></div></aside>
  </main>;
}
