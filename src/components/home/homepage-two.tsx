"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SiteFooter } from "@/components/site-footer";
import { NavigationIcon } from "@/components/navigation-icon";
import { assetPath } from "@/lib/site-path";
import { type Course, formats, money, previewCourses, topics } from "@/lib/preview-courses";
import { CourseCover } from "./course-card";
import { CoursePreview } from "./course-preview";
import { Icon } from "./icon";

const accountHref = "/flow/member-26-akaun-utama";
const nav = [{ label: "Program", href: "#program" }, { label: "Kelas", href: "#kelas" }, { label: "Cara daftar", href: "#cara" }, { label: "Soalan", href: "#soalan" }];

export function HomepageTwo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Semua topik");
  const [format, setFormat] = useState("Semua format");
  const [course, setCourse] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const filtered = previewCourses.filter((item) =>
    (topic === "Semua topik" || item.topic === topic) &&
    (format === "Semua format" || item.format === format) &&
    `${item.title} ${item.description} ${item.topic}`.toLocaleLowerCase("ms").includes(query.trim().toLocaleLowerCase("ms"))
  );
  function inspect(item: Course, button: HTMLButtonElement) { trigger.current = button; setCourse(item); setOpen(true); }
  function reset() { setQuery(""); setTopic("Semua topik"); setFormat("Semua format"); }

  return <div className="home-two">
    <a className="skip-link" href="#main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      <Button variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Menu" aria-expanded={menuOpen} aria-controls="home-two-menu" onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></Button>
      <Link className="brand" href="/" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Navigasi variasi kedua">{nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      <Button asChild size="sm" variant="outline" className="login-button"><Link href={accountHref}><Icon name="user" />Akaun contoh</Link></Button>
      <Link href={accountHref} className="mobile-account-button header-icon-control" aria-label="Akaun contoh"><Icon name="user" /></Link>
    </div><nav id="home-two-menu" className="mobile-inline-navigation page-shell" aria-label="Navigasi telefon" hidden={!menuOpen}>{nav.map((item) => <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}<Link href={accountHref} onClick={() => setMenuOpen(false)}>Akaun contoh</Link><Link href="/" onClick={() => setMenuOpen(false)}>Lihat variasi asal</Link></nav></header>
    <main id="main">
      <section className="page-shell home-two-intro" aria-labelledby="home-two-title">
        <div className="home-two-hero">
          <div className="home-two-hero-copy"><span className="eyebrow">ASRI AHMAD ACADEMY · LABURSAHAM</span><h1 id="home-two-title">Fahami saham.<br /><span>Mulakan dengan ilmu.</span></h1><p>Kelas online dan bersemuka yang membantu anda belajar, berlatih dan bertanya dengan lebih yakin.</p><div className="home-two-hero-actions"><Button asChild size="lg"><a href="#kelas">Teroka kelas <span aria-hidden="true">→</span></a></Button><a href="#cara">Bagaimana ia berfungsi</a></div></div>
          <div className="home-two-hero-visual"><Image src={assetPath("/images/asri-mobile-v2.webp")} alt="Dato Haji Asri dalam sut kelabu, memegang trofi" fill priority unoptimized sizes="(max-width: 700px) 90vw, 45vw" /></div>
          <div className="home-two-hero-note"><Icon name="calendar" /><span><strong>Sesi contoh berikutnya</strong><small>17 Okt · Online langsung</small></span></div>
        </div>
        <div className="home-two-quick" aria-label="Pautan pantas">
          <a href="#kelas"><span><Icon name="search" /></span><strong>Cari kelas</strong><small>Ikut topik & format</small><b aria-hidden="true">→</b></a>
          <a href="#program"><span><Icon name="book" /></span><strong>Kenali LaburSaham</strong><small>Program utama AAA</small><b aria-hidden="true">→</b></a>
          <Link href={accountHref}><span><Icon name="calendar" /></span><strong>Tempahan contoh</strong><small>Lihat susun atur akaun</small><b aria-hidden="true">→</b></Link>
        </div>
      </section>

      <section id="program" className="page-shell home-two-program"><div className="home-two-section-head"><div><span className="eyebrow">PROGRAM UTAMA</span><h2>Belajar dengan arah.</h2><p>Mulakan dengan asas, kemudian bawa soalan anda ke sesi bersama AAA.</p></div><Link href="/flow/public-02-programme-sales">Butiran program <span aria-hidden="true">→</span></Link></div><div className="home-two-program-grid">
        <article className="home-two-program-feature"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku, nota dan komputer untuk pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 60vw" /><div><span className="eyebrow">LABURSAHAM · ONLINE / FIZIKAL</span><h3>Fahami dahulu.<br />Praktik bersama.</h3><Button asChild><Link href="/flow/public-02-programme-sales">Semak sesi & pakej</Link></Button></div></article>
        <div className="home-two-program-side"><article><span className="home-two-round-icon"><Icon name="chart" /></span><h3>Asas pasaran</h3><p>Kenali cara pasaran berfungsi sebelum membuat keputusan.</p></article><article><span className="home-two-round-icon"><Icon name="shield" /></span><h3>Risiko & disiplin</h3><p>Belajar membaca risiko dan membina langkah yang sesuai.</p></article></div>
      </div></section>

      <section id="kelas" className="page-shell home-two-catalog"><div className="home-two-section-head"><div><span className="eyebrow">KELAS AAA</span><h2>Cari langkah anda.</h2><p>Pilih topik dan format yang sesuai. Kelas dan harga ialah contoh reka bentuk.</p></div><span className="home-two-results" role="status">{filtered.length} kelas</span></div><div className="home-two-tools"><label className="home-two-search"><Icon name="search" /><Input aria-label="Cari kelas AAA" placeholder="Cari kelas atau topik" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="home-two-format">Format <select value={format} onChange={(event) => setFormat(event.target.value)}>{formats.map((value) => <option value={value} key={value}>{value}</option>)}</select></label></div><div className="home-two-topics" aria-label="Topik kelas">{topics.map((value) => <Button key={value} variant={topic === value ? "default" : "secondary"} aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</Button>)}</div>
        {filtered.length ? <div className="home-two-course-grid">{filtered.map((item) => <article className="home-two-course" key={item.id}><CourseCover course={item} /><div><span className="home-two-course-meta">{item.format} · {item.duration}</span><h3>{item.title}</h3><p>{item.description}</p><div className="home-two-course-foot"><strong>{money(item.price)}</strong><button type="button" aria-label={`Lihat kelas ${item.title}`} onClick={(event) => inspect(item, event.currentTarget)}>Lihat kelas <span aria-hidden="true">→</span></button></div></div></article>)}</div> : <div className="home-two-empty"><strong>Tiada kelas ditemui.</strong><p>Cuba topik atau format lain.</p><Button onClick={reset}>Lihat semua kelas</Button></div>}
      </section>

      <section id="cara" className="page-shell home-two-steps"><div className="home-two-section-head"><div><span className="eyebrow">CARA MENDAFTAR</span><h2>Tiga langkah yang jelas.</h2></div></div><div className="home-two-step-rail" aria-label="Aliran pendaftaran"><div><span><Icon name="search" /></span><strong>01 · Teroka</strong><p>Semak kelas, tarikh dan format.</p></div><div><span><Icon name="settings" /></span><strong>02 · Pilih</strong><p>Pilih sesi dan pakej yang sesuai.</p></div><div><span><Icon name="ticket" /></span><strong>03 · Sahkan</strong><p>Semak tempahan dan akses kelas selepas bayaran disahkan.</p></div></div><p className="home-two-steps-note">Pendaftaran sebenar belum diaktifkan dalam pratonton ini.</p></section>

      <section id="soalan" className="page-shell home-two-help"><div><span className="eyebrow">BANTUAN</span><h2>Ada soalan?</h2><p>Semak butiran program sebelum memilih kelas.</p><Button asChild variant="secondary"><Link href="/flow/public-06-help-and-faq">Buka panduan AAA</Link></Button></div><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Ruang pembelajaran dengan nota dan latihan" fill sizes="(max-width: 700px) 100vw, 40vw" /></section>
    </main>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Navigasi bawah"><a href="#main" className="app-dock-item" aria-label="Utama"><NavigationIcon name="home" /></a><a href="#kelas" className="app-dock-item" aria-label="Kelas"><NavigationIcon name="book-open" /></a><a href="#program" className="app-dock-item" aria-label="LaburSaham"><NavigationIcon name="graduation-cap" /></a><Link href={accountHref} className="app-dock-item" aria-label="Akaun contoh"><NavigationIcon name="grid" /></Link></nav>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="course-dialog" showCloseButton={false} onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}><div className="dialog-top"><span className="eyebrow">KELAS AAA</span><DialogClose asChild><Button variant="ghost" size="sm">Tutup</Button></DialogClose></div><DialogHeader><DialogTitle>{course?.title} · {course?.format}</DialogTitle><DialogDescription>Semak butiran kelas contoh.</DialogDescription></DialogHeader>{course && <CoursePreview key={`${course.id}-${open}`} course={course} />}</DialogContent></Dialog>
  </div>;
}
