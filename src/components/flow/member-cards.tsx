import Image from "next/image";
import Link from "next/link";
import { Icon, type IconName } from "@/components/home/icon";
import { IconFrame } from "@/components/ui/icon-frame";
import { assetPath } from "@/lib/site-path";

export type MemberAction = { title: string; detail: string; href: string; icon: IconName };
export const memberActions: MemberAction[] = [
  { title: "Tempahan saya", detail: "Sesi akan datang dan lepas", href: "/flow/member-27-tempahan-saya", icon: "calendar" },
  { title: "Tiket fizikal", detail: "Akses tiket selepas pengesahan", href: "/flow/member-29-tiket-fizikal", icon: "ticket" },
  { title: "Bahan & replay", detail: "Mengikut pakej dan tempoh akses", href: "/flow/member-31-bahan-kelas", icon: "play" },
  { title: "Bayaran & resit", detail: "Status dan butiran transaksi", href: "/flow/member-32-bayaran-saya", icon: "receipt" },
  { title: "Notifikasi", detail: "Peringatan dan pilihan mesej", href: "/flow/member-39-pilihan-notifikasi", icon: "bell" },
  { title: "Bantuan", detail: "Pertanyaan dan status sokongan", href: "/flow/member-37-bantuan-peserta", icon: "help" },
];

export type MemberActionTone = "blue" | "yellow" | "grey";

export type MemberContextLink = { label: string; href: string; icon: IconName };

export function MemberContextLinks({ title, items }: { title: string; items: MemberContextLink[] }) {
  return <section className="flow-context-links" aria-label={title}><h2>{title}</h2><div>{items.map((item) => <Link href={item.href} key={item.href}><Icon name={item.icon} />{item.label}<span aria-hidden="true">→</span></Link>)}</div></section>;
}

export function MemberActionCard({ item, tone = "grey" }: { item: MemberAction; tone?: MemberActionTone }) {
  return <Link className="flow-dashboard-link" data-tone={tone} href={item.href}><IconFrame name={item.icon} variant={tone === "blue" ? "navy-soft" : tone === "yellow" ? "gold-soft" : "outline"} /><span><strong>{item.title}</strong><small>{item.detail}</small></span><span aria-hidden="true">→</span></Link>;
}

export type BookingItem = { day: string; month: string; format: string; title: string; detail: string; reference: string; href: string; image: string; alt: string };
export const previewBookings: BookingItem[] = [
  { day: "17", month: "OKT", format: "ONLINE LANGSUNG", title: "LaburSaham", detail: "9 pagi – 12 tengah hari · Online", reference: "AAA-ONL-001", href: "/flow/member-28-maklumat-zoom", image: "course-asas-crisp.webp", alt: "Nota pembelajaran saham" },
  { day: "07", month: "NOV", format: "FIZIKAL · SHAH ALAM", title: "Bengkel asas saham", detail: "9 pagi – 5 petang · 1 peserta", reference: "AAA-PHY-002", href: "/flow/member-29-tiket-fizikal", image: "course-bengkel-crisp.webp", alt: "Suasana pembelajaran bersemuka" },
];

export function BookingCard({ item, tone = "blue" }: { item: BookingItem; tone?: MemberActionTone }) {
  return <Link className="flow-booking-item" data-tone={tone} href={item.href}>
    <span className="flow-booking-date"><strong>{item.day}</strong><small>{item.month}</small></span>
    <span className="flow-booking-copy"><small>{item.format} · REKOD LATIHAN</small><strong>{item.title}</strong><span>{item.detail}</span><span>{item.reference} · Disahkan</span></span>
    <span className="flow-booking-art"><Image src={assetPath(`/images/${item.image}`)} alt={item.alt} fill sizes="(max-width: 700px) 100vw, 180px" /></span><span className="flow-booking-arrow" aria-hidden="true">→</span>
  </Link>;
}

export function MaterialsIntroBanner() {
  return <div className="flow-materials-intro"><IconFrame name="book" variant="navy-soft" /><div><span className="eyebrow">SUMBER PEMBELAJARAN</span><h2>Semuanya di satu tempat.</h2><p>Pratonton nota, workbook dan rakaman. Akses sebenar bergantung pada pakej dan tempahan yang disahkan.</p></div><a href="#materials-list">Lihat bahan <span aria-hidden="true">→</span></a></div>;
}

export type MaterialItem = { title: string; label: string; detail: string; action: string; icon: IconName; href?: string; tone: "navy" | "gold" | "blue" };
export const materialItems: MaterialItem[] = [
  { title: "Nota LaburSaham · PDF", label: "PRATONTON", detail: "Lihat nota contoh. Fail penuh tersedia selepas tempahan disahkan.", action: "Lihat nota contoh", icon: "book", href: "/flow/state-70-buka-bahan-kelas", tone: "navy" },
  { title: "Workbook latihan", label: "ONLINE+ & FIZIKAL", detail: "Online+ mendapat eWorkbook; Fizikal mendapat workbook bercetak.", action: "Selepas pengesahan", icon: "graduation", tone: "gold" },
  { title: "Replay kelas", label: "SELEPAS SESI", detail: "Rakaman Online+ dan Fizikal tersedia 48 jam selepas diterbitkan.", action: "Tonton demonstrasi", icon: "play", href: "/flow/state-68-replay-tersedia", tone: "blue" },
];

export function MaterialCard({ item }: { item: MaterialItem }) {
  const content = <><span className="flow-materials-card-top"><IconFrame name={item.icon} variant={item.tone === "navy" ? "navy-soft" : item.tone === "gold" ? "gold-soft" : "light"} /><span className="flow-materials-card-label">{item.label}</span></span><strong>{item.title}</strong><span className="flow-materials-card-detail">{item.detail}</span><span className="flow-materials-card-action">{item.action}{item.href && <span aria-hidden="true">→</span>}</span></>;
  const className = `flow-materials-card flow-materials-${item.tone}`;
  return item.href ? <Link className={className} href={item.href}>{content}</Link> : <article className={className}>{content}</article>;
}
