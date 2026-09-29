import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/home/icon";
import { IconFrame, type IconFrameVariant } from "@/components/ui/icon-frame";
import { assetPath } from "@/lib/site-path";

export type ReferenceTone = "gold" | "neutral" | "blue";
export type ReferencePattern = "metric" | "activity" | "appointment" | "booking" | "order" | "checkout" | "quick-actions";

const checkoutHref = "/flow/public-02-programme-sales";

/** AAA components derived from the reference compositions, with one shared tone API. */
export function ReferenceCard({ pattern, tone }: { pattern: ReferencePattern; tone: ReferenceTone }) {
  const className = `library-reference-card library-tone-${tone} library-pattern-${pattern}`;
  const iconVariant: IconFrameVariant = tone === "blue" ? "navy-soft" : tone === "gold" ? "gold-soft" : "light";

  if (pattern === "metric") return <article className={className}>
    <div className="library-card-top"><IconFrame name="chart" variant={iconVariant} /><span className="library-card-kicker">PEMBELAJARAN</span></div>
    <h3>Kemajuan anda</h3><p>Jejak latihan dan bahan dalam satu pandangan.</p>
    <div className="library-metric-body"><div className="library-progress-ring"><span><strong>68%</strong><small>Selesai</small></span></div><div className="library-metric-facts"><div><strong>4 / 6</strong><span>Latihan</span></div><div><strong>2 jam</strong><span>Masa belajar</span></div></div></div>
    <div className="library-card-foot"><span>Kemas kini terakhir · contoh</span><span aria-hidden="true">→</span></div>
  </article>;

  if (pattern === "activity") return <article className={className}>
    <div className="library-card-top"><IconFrame name="play" variant={iconVariant} /><span className="library-card-kicker">AKTIVITI</span></div>
    <h3>Teruskan belajar</h3><p>Sesi yang berkaitan, disusun untuk langkah seterusnya.</p>
    <div className="library-activity-list">
      <div><span className="library-activity-thumb"><Image src={assetPath("/images/course-asas-crisp.webp")} alt="" fill sizes="64px" /></span><span><strong>Kenali pasaran</strong><small>Asas · 3 modul</small></span><b>✓</b></div>
      <div><span className="library-activity-thumb"><Image src={assetPath("/images/course-carta-crisp.webp")} alt="" fill sizes="64px" /></span><span><strong>Baca carta</strong><small>Seterusnya · 4 modul</small></span><b aria-hidden="true">→</b></div>
    </div>
  </article>;

  if (pattern === "appointment") return <article className={className}>
    <div className="library-appointment-image"><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Ruang pembelajaran bersama" fill sizes="(max-width: 700px) 90vw, 30vw" /><span>SESI BERSEMUKA</span></div>
    <div className="library-appointment-content"><div className="library-card-top"><span className="library-card-kicker">PILIH TARIKH</span><IconFrame name="calendar" variant={iconVariant} /></div><h3>Bengkel bersama AAA</h3><p>Butiran lokasi dan tarikh disahkan sebelum pendaftaran.</p><div className="library-date-choices"><span><strong>24</strong>OKT</span><span className="is-selected"><strong>07</strong>NOV</span><span><strong>14</strong>NOV</span></div><span className="library-preview-note">Tarikh di sini ialah contoh reka bentuk.</span></div>
  </article>;

  if (pattern === "booking") return <article className={className}>
    <div className="library-card-top"><IconFrame name="ticket" variant={iconVariant} /><span className="library-card-kicker">PAS KELAS</span></div>
    <h3>From Zero to Hero</h3><p>Butiran sesi dalam satu pas yang mudah dibaca.</p>
    <div className="library-booking-route"><div><small>MULA</small><strong>Online</strong><span>Jadual akan diumumkan</span></div><span aria-hidden="true">→</span><div><small>AKSES</small><strong>Akaun anda</strong><span>Selepas pengesahan</span></div></div>
    <div className="library-booking-meta"><span><Icon name="calendar" /> Jadual menunggu</span><span><Icon name="user" /> 1 peserta</span></div>
    <Link className="library-card-action" href={checkoutHref}>Semak pakej <span aria-hidden="true">→</span></Link>
  </article>;

  if (pattern === "order") return <article className={className}>
    <div className="library-card-top"><IconFrame name="receipt" variant={iconVariant} /><span className="library-status-pill">PRATONTON</span></div>
    <h3>Tempahan anda</h3><p>Jejak status dan lihat butiran tanpa membuka banyak kad.</p>
    <div className="library-order-progress" aria-label="Status tempahan contoh"><span className="is-done" /><span className="is-current" /><span /><span /></div>
    <div className="library-order-facts aaa-detail-rows"><div><span>Pakej</span><strong>Online+</strong></div><div><span>Jumlah</span><strong>RM79</strong></div></div>
    <span className="library-preview-note">Tiada tempahan sebenar dibuat.</span>
  </article>;

  if (pattern === "checkout") return <article className={className}>
    <div className="library-card-top"><IconFrame name="payment" variant={iconVariant} /><span className="library-card-kicker">SEMAK & SAHKAN</span></div>
    <h3>Ringkasan tempahan</h3><p>Bandingkan nilai sebelum meneruskan.</p>
    <div className="library-checkout-option"><span><strong>Online+</strong><small>Webinar, rakaman dan bahan digital</small></span><b>RM79</b><span className="selection-control" data-selected="true" aria-hidden="true" /></div>
    <div className="library-order-facts aaa-detail-rows"><div><span>Pakej</span><strong>Online+</strong></div><div className="library-order-total"><span>Jumlah</span><strong>RM79</strong></div></div>
    <Link className="library-card-action" href={checkoutHref}>Pilih pakej <span aria-hidden="true">→</span></Link>
  </article>;

  return <article className={className}>
    <div className="library-card-top"><IconFrame name="grid" variant={iconVariant} /><span className="library-card-kicker">TINDAKAN PANTAS</span></div>
    <h3>Pilih tujuan anda</h3><p>Dua laluan jelas, dengan status di kad utama.</p>
    <div className="library-quick-grid"><Link href={checkoutHref}><IconFrame name="book" variant="outline" /><strong>Lihat pakej</strong><span>Bandingkan pilihan</span><b aria-hidden="true">→</b></Link><Link href="/flow/member-27-tempahan-saya"><IconFrame name="calendar" variant="outline" /><strong>Tempahan</strong><span>Semak dalam akaun</span><b aria-hidden="true">→</b></Link></div>
  </article>;
}
