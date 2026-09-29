import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";
import { assetPath } from "@/lib/site-path";

/** Shared by Home 2 and the local design library so corrections reach both. */
export function HomeTwoProgramCards() {
  return <div className="home-two-program-grid">
    <article className="home-two-program-feature"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku, nota dan komputer untuk pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 60vw" /><div><span className="eyebrow">LABURSAHAM · ONLINE / FIZIKAL</span><h3>Fahami dahulu.<br />Praktik bersama.</h3><Button asChild><Link href="/flow/public-02-programme-sales">Daftar sekarang</Link></Button></div></article>
    <div className="home-two-program-side"><article><IconFrame name="chart" variant="light" className="home-two-round-icon" /><h3>Asas pasaran</h3><p>Kenali cara pasaran berfungsi sebelum membuat keputusan.</p></article><article><IconFrame name="shield" variant="muted" className="home-two-round-icon" /><h3>Risiko & disiplin</h3><p>Belajar membaca risiko dan membina langkah yang sesuai.</p></article></div>
  </div>;
}

export function HomeTwoHelpBanner() {
  return <div className="home-two-help"><div className="home-two-help-copy"><span className="eyebrow">BANTUAN</span><h2>Ada soalan?</h2><p>Semak butiran program sebelum memilih kelas.</p></div><Button asChild variant="secondary"><Link href="/flow/public-06-help-and-faq">Buka panduan AAA</Link></Button><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Ruang pembelajaran dengan nota dan latihan" fill sizes="(max-width: 700px) 100vw, 40vw" /></div>;
}
