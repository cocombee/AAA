"use client";
import { assetPath } from "@/lib/site-path";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { NavigationIcon, type NavigationIconName } from "@/components/navigation-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { signOut } from "@/app/auth/actions";
import { endDevelopmentSession } from "@/lib/development-session";
import type { MemberDashboard, MemberBooking } from "@/lib/member-dashboard";

const sections = ["Ringkasan", "Pendaftaran saya", "Tempahan", "Pembayaran", "Profil"] as const;
type Section = typeof sections[number];
const sectionIcons: Record<Section, NavigationIconName> = { Ringkasan: "grid", "Pendaftaran saya": "book-open", Tempahan: "calendar", Pembayaran: "payment", Profil: "user" };
const bookingLabels = { confirmed: "Akan datang", completed: "Selesai", cancelled: "Dibatalkan" };
const orderLabels = { paid: "Dibayar", pending: "Menunggu", refunded: "Dipulangkan" };
function date(value: string) { return new Intl.DateTimeFormat("ms-MY", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(value)); }
function amount(minor: number) { return new Intl.NumberFormat("ms-MY", { style: "currency", currency: "MYR" }).format(minor / 100); }

export function MemberDashboardView({ data, signOutError = false }: { data: MemberDashboard; signOutError?: boolean }) {
  const [section, setSection] = useState<Section>("Ringkasan");
  const [selected, setSelected] = useState<MemberBooking | null>(null);
  const upcoming = data.bookings.filter(b => b.status === "confirmed");
  const firstName = data.name.trim().split(/\s+/)[0] || "Ahli AAA";
  const displayed = section === "Ringkasan" ? upcoming.slice(0, 2) : data.bookings;
  return <div className="member-app">
    <header className="member-header"><Link href="/" className="brand"><Brand /></Link><div><Button variant="outline" size="sm" asChild><Link href="/#program">Lihat program semasa</Link></Button>{data.preview ? <Button variant="ghost" size="sm" asChild><Link href="/" onClick={endDevelopmentSession}>Log keluar</Link></Button> : <form action={signOut}><Button variant="ghost" size="sm" type="submit">Log keluar</Button></form>}</div></header>
    <div className="member-layout">
      <aside className="member-sidebar"><div className="member-person"><span className="member-avatar" aria-hidden="true">{firstName.slice(0, 1)}</span><strong>{data.name}</strong><small>{data.preview ? "Akaun pembangunan" : "Ahli Asri Ahmad Academy"}</small></div><nav className="app-bottom-dock" aria-label="Dashboard pengguna">{sections.map(item => <button key={item} className="app-dock-item" data-section={item} type="button" aria-label={item === "Ringkasan" ? "Dashboard" : item} aria-current={item === section ? "page" : undefined} onClick={() => setSection(item)}><NavigationIcon name={sectionIcons[item]} /><span className="desktop-nav-label">{item === "Ringkasan" ? "Dashboard" : item}</span><span className="mobile-nav-label">{({ "Ringkasan": "Dashboard", "Pendaftaran saya": "Kelas", "Tempahan": "Tempahan", "Pembayaran": "Bayaran", "Profil": "Profil" })[item]}</span></button>)}</nav><div className="member-sidebar-note"><strong>Satu langkah pada satu masa.</strong><p>Pilih ilmu yang sesuai dengan perjalanan anda.</p></div></aside>
      <main className="member-main" id="dashboard-main">
        <div className="member-page-heading"><span className="eyebrow">AKAUN ASRI AHMAD ACADEMY</span><h1>{section === "Ringkasan" ? `Selamat datang, ${firstName}.` : section}</h1><p>{section === "Ringkasan" ? "Semak pendaftaran, tarikh program dan rekod bayaran anda." : "Urus pendaftaran anda bersama Asri Ahmad Academy."}</p></div>
        {signOutError && <p className="account-message" role="alert">Log keluar tidak selesai. Sila cuba lagi.</p>}
        {section === "Ringkasan" && <div className="member-stats"><div><span>Program akan datang</span><strong>{data.counts.upcoming ?? "—"}</strong></div><div><span>Program selesai</span><strong>{data.counts.completed ?? "—"}</strong></div><div><span>Bayaran menunggu</span><strong>{data.counts.pending ?? "—"}</strong></div></div>}
        {(section === "Ringkasan" || section === "Pendaftaran saya") && <section className="member-section"><div className="member-section-heading"><h2>{section === "Ringkasan" ? "Pendaftaran akan datang" : "Pendaftaran terkini"}</h2>{section === "Ringkasan" && <Button variant="ghost" size="sm" onClick={() => setSection("Pendaftaran saya")}>Lihat pendaftaran</Button>}</div>{data.bookingsUnavailable ? <Unavailable /> : displayed.length ? <div className="member-course-grid">{displayed.map(b => <article className="member-course" key={b.id}><div className="member-course-image"><Image src={assetPath(`/images/course-${b.cover}-crisp.webp`)} alt="" fill quality={90} sizes="(max-width: 700px) 90vw, 40vw" /></div><div className="member-course-copy"><div><Badge variant="secondary">{b.format}</Badge><span className={`member-status status-${b.status}`}>{bookingLabels[b.status]}</span></div><h3>{b.title}</h3><p>{date(b.startsAt)} · {b.location}</p><Button variant="outline" size="sm" onClick={() => setSelected(b)}>Lihat butiran</Button></div></article>)}</div> : <Empty title="Pendaftaran pertama anda bermula di sini." text="Selepas bayaran disahkan, pendaftaran program akan muncul dalam akaun anda." />}</section>}
        {section === "Ringkasan" && <section className="member-next-step"><div><span className="eyebrow">SEBELUM PROGRAM BERMULA</span><h2>Semak maklumat penyertaan anda.</h2><p>Pastikan tarikh, format dan lokasi program sesuai. Maklumat akses akan diberikan oleh AAA sebelum sesi.</p><Button onClick={() => setSection("Tempahan")}>Lihat tempahan</Button></div><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Nota dan bahan pembelajaran bersama" width={1536} height={1024} quality={90} sizes="(max-width: 700px) 90vw, 35vw" /></section>}
        {section === "Tempahan" && <section className="member-section">{data.bookingsUnavailable ? <Unavailable /> : data.bookings.length ? <div className="member-booking-list">{data.bookings.map(b => <article key={b.id}><div className="member-date-tile"><strong>{new Date(b.startsAt).toLocaleDateString("ms-MY", { day: "numeric", timeZone: "Asia/Kuala_Lumpur" })}</strong><span>{new Date(b.startsAt).toLocaleDateString("ms-MY", { month: "short", timeZone: "Asia/Kuala_Lumpur" })}</span></div><div><h3>{b.title}</h3><p>{date(b.startsAt)} · {b.format}</p><small>{b.location}</small></div><Button variant="outline" size="sm" onClick={() => setSelected(b)}>Butiran</Button></article>)}</div> : <Empty title="Belum ada tempahan." text="Tempahan online dan fizikal anda akan disenaraikan di sini." />}</section>}
        {section === "Pembayaran" && <section className="member-section"><h2>Sejarah pembayaran</h2><p className="member-muted">{data.preview ? "Rekod paparan pembangunan. Tiada transaksi sebenar dibuat." : "20 rekod terkini untuk pendaftaran anda."}</p>{data.ordersUnavailable ? <Unavailable /> : data.orders.length ? <div className="member-order-list">{data.orders.map(o => <article key={o.id}><div><small>{o.reference} · {date(o.placedAt)}</small><h3>{o.title}</h3></div><span className={`member-status status-${o.status}`}>{orderLabels[o.status]}</span><strong>{amount(o.amountMinor)}</strong></article>)}</div> : <Empty title="Belum ada pembayaran." text="Rekod akan muncul selepas anda membuat pendaftaran." />}</section>}
        {section === "Profil" && <section className="member-profile-panel"><h2>Profil akaun</h2><dl><div><dt>Nama</dt><dd>{data.name}</dd></div><div><dt>Alamat e-mel</dt><dd>{data.email || "Belum tersedia"}</dd></div><div><dt>Kaedah log masuk</dt><dd>{data.preview ? "Akses pembangunan tanpa Google" : "Google"}</dd></div></dl><p>{data.preview ? "Profil pembangunan. Tiada data akaun sebenar dipaparkan." : "Nama dan e-mel akaun disahkan melalui Google. Akaun yang sama akan digunakan pada aplikasi mudah alih."}</p></section>}
      </main>
    </div>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="member-booking-dialog"><DialogHeader><DialogTitle>{selected?.title}</DialogTitle><DialogDescription>Maklumat tempahan {data.preview ? "pembangunan" : "anda"}.</DialogDescription></DialogHeader>{selected && <><dl className="member-booking-facts"><div><dt>Tarikh</dt><dd>{date(selected.startsAt)}</dd></div><div><dt>Format</dt><dd>{selected.format}</dd></div><div><dt>Tempat</dt><dd>{selected.location}</dd></div><div><dt>Status</dt><dd>{bookingLabels[selected.status]}</dd></div></dl><p className="member-muted">{data.preview ? "Ini ialah pratonton. Tiada pautan sesi, tiket atau bayaran sebenar dikeluarkan." : "Maklumat akses dan arahan penyertaan akan diberikan oleh AAA sebelum kelas."}</p></>}</DialogContent></Dialog>
  </div>;
}

function Empty({ title, text }: { title: string; text: string }) { return <div className="member-empty"><h3>{title}</h3><p>{text}</p><Button variant="outline" asChild><Link href="/#program">Lihat program semasa</Link></Button></div>; }
function Unavailable() { return <div className="member-empty" role="status"><h3>Rekod belum dapat dimuatkan.</h3><p>Sila cuba semula sebentar lagi.</p></div>; }
