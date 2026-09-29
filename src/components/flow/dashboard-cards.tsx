import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/home/icon";
import { Button } from "@/components/ui/button";
import { assetPath } from "@/lib/site-path";
import { MemberActionCard, type MemberAction } from "@/components/flow/member-cards";

export function MemberDashboardFeature() {
  return <section className="flow-dashboard-feature" aria-label="Sesi seterusnya dalam rekod latihan">
    <div className="flow-dashboard-image"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku dan nota pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 30vw" /><span className="flow-dashboard-date"><strong>17</strong><small>OKT</small></span></div>
    <div className="flow-dashboard-copy">
      <span className="flow-card-index">SESI SETERUSNYA · REKOD LATIHAN</span>
      <h2>LaburSaham <span>Online langsung</span></h2>
      <p>17 Okt 2026 · 9 pagi – 12 tengah hari MYT</p>
      <div className="flow-dashboard-meta"><span>Pakej <strong>Online</strong></span><span>Rujukan <strong>AAA-ONL-001</strong></span></div>
      <div className="flow-actions"><Button size="sm" asChild><Link href="/flow/member-28-maklumat-zoom"><Icon name="video" />Maklumat Zoom</Link></Button><Button size="sm" variant="secondary" asChild><a href={assetPath("/media/labursaham-online-preview.ics")} download="AAA-LaburSaham-pratonton.ics"><Icon name="plus" />Kalendar contoh</a></Button></div>
    </div>
  </section>;
}

const staffMetrics: MemberAction[] = [
  { title: "2 sesi akan datang", detail: "Online 17 Okt · Fizikal 7 Nov", href: "/flow/staff-48-sesi-dan-kapasiti", icon: "calendar" },
  { title: "1 bayaran untuk semakan", detail: "AAA-ONL-003 · RM49", href: "/flow/staff-54-bayaran-dan-pengecualian", icon: "payment" },
  { title: "1 kes sokongan terbuka", detail: "SUP-001 · Refund Online", href: "/flow/staff-58-sokongan-staf", icon: "help" },
  { title: "58 / 80 tempat diisi", detail: "Bengkel asas saham · 7 Nov 2026", href: "/flow/staff-48-sesi-dan-kapasiti", icon: "users" },
];

export function StaffDashboardOverview() {
  return <section className="flow-staff-overview" aria-labelledby="staff-overview-title">
    <div className="flow-staff-intro"><span className="eyebrow">OPERASI AAA · REKOD LATIHAN</span><h2 id="staff-overview-title">Hari ini dalam operasi.</h2><p>Semak sesi, peserta dan kes yang perlu tindakan.</p></div>
    <div className="flow-dashboard-links flow-member-actions flow-staff-metrics"><div>{staffMetrics.map((item, index) => <MemberActionCard item={item} tone={index === staffMetrics.length - 1 ? "yellow" : "grey"} key={item.title} />)}</div></div>
  </section>;
}

type StaffAction = { title: string; detail: string; href: string; icon: IconName };
const staffActions: StaffAction[] = [
  { title: "Program & pakej", detail: "Semak tawaran sebelum diterbitkan", href: "/flow/staff-44-senarai-program", icon: "book" },
  { title: "Sesi & kapasiti", detail: "Tarikh, venue dan tempat", href: "/flow/staff-48-sesi-dan-kapasiti", icon: "calendar" },
  { title: "Peserta & check-in", detail: "Senarai dan pengesahan kehadiran", href: "/flow/staff-50-senarai-peserta", icon: "users" },
  { title: "Akses peserta", detail: "Tiket dan maklumat Zoom", href: "/flow/staff-52-akses-peserta", icon: "key" },
  { title: "Bayaran & refund", detail: "Pengecualian dan penyelarasan", href: "/flow/staff-54-bayaran-dan-pengecualian", icon: "receipt" },
  { title: "Peranan & audit", detail: "Skop akses dan sejarah perubahan", href: "/flow/staff-59-peranan-dan-sejarah", icon: "shield" },
];

export function StaffActionCard({ item }: { item: StaffAction }) {
  return <MemberActionCard item={item} />;
}

export function StaffDashboardActions() {
  return <section className="flow-dashboard-links flow-member-actions" aria-labelledby="staff-actions-title"><header><span className="eyebrow">ALIRAN KERJA</span><h2 id="staff-actions-title">Tindakan operasi</h2><p>Aliran ini belum menyimpan data.</p></header><div>{staffActions.map((item) => <StaffActionCard item={item} key={item.href} />)}</div></section>;
}
