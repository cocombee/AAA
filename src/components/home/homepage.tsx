"use client";
import { assetPath } from "@/lib/site-path";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { type Course, previewCourses, topics, formats, money } from "@/lib/preview-courses";
import { Input } from "@/components/ui/input";
import { CourseCard } from "./course-card";
import { CoursePreview } from "./course-preview";
import { Icon } from "./icon";
import { NavigationIcon } from "@/components/navigation-icon";
import { SiteFooter } from "@/components/site-footer";

const headerNav = [{ label: "Utama", href: "#utama" }, { label: "LaburSaham", href: "#program" }, { label: "Kelas AAA", href: "#kelas" }, { label: "Tentang AAA", href: "#tentang" }, { label: "Bantuan", href: "#soalan" }];
const topicIcons = { "Semua topik": "grid", "Asas saham": "book", "Analisis teknikal": "chart", Portfolio: "portfolio" } as const;
const questions = [
  { q: "Bagaimana saya mendaftar program AAA?", a: "Semak halaman program, pilih sesi online atau fizikal yang ditawarkan, kemudian log masuk dan lengkapkan pendaftaran. Pendaftaran disahkan selepas bayaran diterima. Pembayaran belum diaktifkan." },
  { q: "Apa beza sesi online dan fizikal?", a: "Sesi online diikuti melalui pautan kelas langsung. Sesi fizikal berlangsung di lokasi yang dinyatakan. Semak tarikh, masa, tempat dan manfaat pakej sebelum mendaftar." },
  { q: "Di mana saya boleh melihat tempahan saya?", a: "Selepas log masuk, dashboard pengguna menghimpunkan pendaftaran, tarikh program dan rekod pembayaran anda. Maklumat penyertaan akan diberikan oleh AAA sebelum program." },
  { q: "Adakah rakaman dan bahan disertakan?", a: "Bahan, rakaman atau sesi tambahan akan dinyatakan pada halaman program sebenar. Semak pakej yang dipilih; jangan anggap semua sesi menyertakan rakaman." },
];
// Presentation fixtures only; one featured programme with two attendance options.
const sessionOptions: Course[] = [previewCourses[0], previewCourses[3]].map(item => ({ ...item, id: `labursaham-${item.format}`, title: "Kelas LaburSaham bersama AAA", shortTitle: "Mulakan dengan ilmu.", description: previewCourses[0].description, outcomes: previewCourses[0].outcomes }));

export function Homepage({ loginHref }: { loginHref: string }) {
  const accountHref = loginHref;
  const accountLabel = loginHref.startsWith("/flow/") ? "Akaun contoh" : "Log masuk";
  const accountIcon = loginHref.startsWith("/flow/") ? "grid" : "user";
  const [mobileDestination, setMobileDestination] = useState("#utama");
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setMobileDestination(`#${entry.target.id}`); }, { rootMargin: "-100px 0px -55% 0px", threshold: 0 });
    for (const id of ["utama", "program", "kelas", "tentang", "soalan"]) { const element = document.getElementById(id); if (element) observer.observe(element); }
    return () => observer.disconnect();
  }, []);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("Semua topik");
  const [format, setFormat] = useState<string>("Semua format");
  const visibleCourses = previewCourses.filter(item => (topic === "Semua topik" || item.topic === topic) && (format === "Semua format" || item.format === format) && `${item.title} ${item.description} ${item.topic}`.toLocaleLowerCase("ms").includes(query.trim().toLocaleLowerCase("ms")));
  function resetFilters() { setQuery(""); setTopic("Semua topik"); setFormat("Semua format"); }
  function previewClass(item: Course, trigger: HTMLButtonElement) { lastTrigger.current = trigger; setCourse(item); setOpen(true); }
  const [session, setSession] = useState("Online");
  const [course, setCourse] = useState<Course | null>(null);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const menuButton = useRef<HTMLButtonElement | null>(null);
  const offer = sessionOptions.find(item => item.format === session)!;
  function previewProgramme(trigger: HTMLButtonElement) { lastTrigger.current = trigger; setCourse(offer); setOpen(true); }

  return <>
    <a className="skip-link" href="#main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      <Button ref={menuButton} variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Menu" aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(value => !value)}><Icon name="menu" /></Button>
      <a className="brand" href="#utama" aria-label="Asri Ahmad Academy halaman utama"><Brand /></a>
      <nav className="desktop-nav" aria-label="Navigasi utama">{headerNav.map(n => <a key={n.href} href={n.href} aria-current={mobileDestination === n.href ? "location" : undefined}>{n.href === "#utama" && <Icon name="home" />}{n.label}</a>)}</nav>
      <Button variant="outline" size="sm" className="login-button" asChild><Link href={accountHref}><Icon name={accountIcon} />{accountLabel}</Link></Button>
      <Link href={accountHref} className="mobile-account-button header-icon-control" aria-label={accountLabel}><Icon name={accountIcon} /></Link>
    </div><nav id="mobile-navigation" className="mobile-inline-navigation page-shell" aria-label="Navigasi telefon" hidden={!menuOpen} onKeyDown={e => { if (e.key === "Escape") { setMenuOpen(false); menuButton.current?.focus(); } }}>{headerNav.map(n => <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)}>{n.label}</a>)}<Link href={accountHref} onClick={() => setMenuOpen(false)}>{accountLabel}</Link></nav></header>
    <main id="main">
      <section id="utama" className="hero page-shell"><div className="hero-feature">
        <div className="hero-copy"><div className="eyebrow">KELAS LABURSAHAM · AAA</div><h1>Fahami saham.<br /><span className="hero-final-line">Dengan <span className="hero-highlight">ilmu.</span></span></h1><p><span>Kelas LaburSaham.</span><span>Pilih online atau fizikal.</span></p><div className="hero-actions"><Button asChild size="lg"><a href="#program">Lihat program semasa<span className="action-arrow" aria-hidden="true">→</span></a></Button></div><div className="hero-presenter"><span>BELAJAR BERSAMA</span><strong>Dato Haji Asri</strong></div></div>
        <div className="hero-visual"><Image src={assetPath("/images/hero-market-accent.svg")} alt="" width={240} height={240} unoptimized className="hero-market-accent" /><Image src={assetPath("/images/asri-mobile-v2.webp")} alt="Dato Haji Asri dalam sut kelabu, memegang trofi" fill preload unoptimized className="hero-portrait" /></div>
      </div></section>
      <div className="learning-strip"><div className="page-shell strip-inner"><span className="strip-title"><span>Cara Belajar.</span><strong>Pilihan anda.</strong></span><div><span className="strip-index">1</span><p><strong>Sesi online</strong><span>Belajar dari tempat anda bersama AAA.</span></p></div><div><span className="strip-index">2</span><p><strong>Sesi bersemuka</strong><span>Ruang untuk bertanya dan berlatih.</span></p></div><div><span className="strip-index">3</span><p><strong>Pendaftaran teratur</strong><span>Semak tempahan anda dalam akaun.</span></p></div></div></div>
      <section id="program" className="programme-section page-shell">
        <div className="section-heading"><div className="section-title"><span className="eyebrow">PROGRAM UTAMA · LABURSAHAM</span><h2>Kelas LaburSaham bersama AAA.</h2><p>Semak program dan pilih sesi yang sesuai sebelum mendaftar.</p></div></div>
        <div className="programme-offer"><div className="programme-image"><picture><source media="(max-width: 700px)" srcSet={assetPath("/images/course-asas.webp")} /><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku, nota dan komputer untuk pembelajaran pelaburan" fill quality={90} sizes="(max-width: 700px) 90vw, 600px" /></picture><span>PENDIDIKAN SAHAM & PELABURAN</span></div><div className="programme-copy section-title"><span className="eyebrow">PROGRAM PENGENALAN · LABURSAHAM</span><h3>Fahami dahulu.<br />Bina langkah anda.</h3><p>Kenali pasaran, risiko dan proses membuat keputusan melalui sesi bersama AAA.</p><ul><li>Asas pasaran saham dan pelaburan</li><li>Risiko, matlamat dan disiplin keputusan</li><li>Latihan dan ruang untuk bertanya</li></ul><fieldset className="programme-sessions"><legend>Pilih sesi</legend><div className="programme-session-options">{sessionOptions.map(item => <label key={item.id} className={session === item.format ? "session-selected" : ""}><input type="radio" name="programme-session" value={item.format} checked={session === item.format} onChange={() => setSession(item.format)} /><span><strong>{item.format === "Online" ? "Online langsung" : "Bersemuka"}</strong><small>{item.date.replace("Oktober", "Okt").replace("November", "Nov")}</small></span></label>)}</div></fieldset><p className="programme-location">{offer.location} · {offer.duration}</p><div className="programme-action"><div><span>Harga</span><strong>{money(offer.price)}</strong></div><Button onClick={e => previewProgramme(e.currentTarget)}>Semak program & pakej</Button></div><small className="programme-note">Program dan pakej sebenar akan disahkan sebelum pendaftaran dibuka.</small></div></div>
      </section>
      <section id="kelas" className="catalog-section page-shell">
        <div className="section-heading"><div className="section-title"><span className="eyebrow">TEROKAI KELAS AAA</span><h2>Ilmu untuk langkah seterusnya.</h2><p>Cari kelas mengikut topik, tahap dan format yang sesuai untuk anda.</p></div></div>
        <div className="catalog-tools"><div className="catalog-search"><Icon name="search" /><Input aria-label="Cari kelas AAA" placeholder="Cari kelas atau topik" value={query} onChange={e => setQuery(e.target.value)} /><Button type="button" variant="ghost" className="catalog-reset" aria-label="Set semula penapis kelas" onClick={resetFilters}><Icon name="reset" /></Button></div><label className="format-select">Format <select value={format} onChange={e => setFormat(e.target.value)}>{formats.map(value => <option key={value} value={value}>{value}</option>)}</select></label></div>
        <div className="topic-filters" aria-label="Topik kelas">{topics.map(value => <Button key={value} variant="ghost" className={topic === value ? "topic-selected" : ""} aria-pressed={topic === value} onClick={() => setTopic(value)}><Icon name={topicIcons[value]} />{value}</Button>)}</div>
        <span className="sr-only" role="status">{visibleCourses.length} kelas</span>
        {visibleCourses.length ? <div className="course-grid">{visibleCourses.map(item => <CourseCard key={item.id} course={item} onPreview={previewClass} />)}</div> : <div className="empty-catalog"><h3>Tiada kelas ditemui.</h3><p>Cuba topik atau carian lain.</p><Button onClick={resetFilters}>Lihat semua kelas</Button></div>}
      </section>
      <section className="intake-section page-shell"><div className="intake-panel"><div className="section-title"><span className="eyebrow">SESI BERSEMUKA</span><h2>Belajar bersama.<br />Tanya terus.</h2><p>Semak lokasi dan tarikh sebelum memilih kelas fizikal. Jadual tertakluk kepada pengesahan.</p><Button className="intake-explore" asChild><a href="#kelas">Terokai semua kelas</a></Button></div><div className="intake-list">{previewCourses.filter(item => item.format === "Fizikal").map(item => <button className="intake-row" key={item.id} onClick={e => previewClass(item, e.currentTarget)}><span className="date-tile"><strong>{item.date.split(" ")[0]}</strong><span>{item.date.includes("Oktober") ? "OKT" : "NOV"}</span></span><span className="intake-text"><strong>{item.title}</strong><small>{item.location}</small><span>{item.duration} · Tarikh akan disahkan</span></span><span className="intake-price">{money(item.price)}<small>Harga</small></span></button>)}</div></div></section>
      <section className="registration-steps page-shell"><div className="section-heading"><div className="section-title"><span className="eyebrow">PENDAFTARAN YANG MUDAH</span><h2>Dari pilihan ke pengesahan.</h2></div></div><div className="path-grid">{([{ icon: "search", title: "Semak program", text: "Lihat tarikh, format, lokasi dan manfaat pakej sebelum membuat pilihan." }, { icon: "payment", title: "Daftar & bayar", text: "Log masuk, semak maklumat pendaftaran dan lengkapkan pembayaran." }, { icon: "grid", title: "Semak dalam akaun", text: "Lihat pengesahan, tempahan dan maklumat penyertaan dalam dashboard anda." }] as const).map(step => <article className="path-card" key={step.title}><span className="path-icon"><Icon name={step.icon} /></span><div className="path-copy"><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section>
      <section id="tentang" className="about-section page-shell"><div className="about-panel"><figure className="about-visual"><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Ilustrasi sesi belajar bersama, dengan nota dan latihan carta" fill quality={90} sizes="(max-width: 700px) max(90vw, 375px), 660px" /><figcaption>Ruang untuk belajar bersama.</figcaption></figure><div className="about-copy section-title"><span className="eyebrow">ASRI AHMAD ACADEMY</span><h2>Ilmu dahulu.<br />Keputusan dengan kefahaman.</h2><p>AAA membantu anda memahami saham dan pelaburan melalui program pendidikan yang memberi ruang untuk belajar, berlatih dan bertanya.</p><p className="about-note">Untuk pendidikan. Kandungan pembelajaran bukan cadangan membeli atau menjual saham tertentu.</p><Button asChild><a href="#program">Lihat program semasa</a></Button></div></div></section>
      <section id="soalan" className="faq-section page-shell"><div className="section-title"><span className="eyebrow">SEBELUM ANDA MENDAFTAR</span><h2>Ada soalan?<br />Mulakan di sini.</h2><p>Panduan ringkas tentang program dan pendaftaran.</p></div><Accordion type="single" collapsible>{questions.map((q, i) => <AccordionItem value={`q-${i}`} key={q.q}><AccordionTrigger>{q.q}</AccordionTrigger><AccordionContent>{q.a}</AccordionContent></AccordionItem>)}</Accordion></section>
    </main>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Navigasi bawah">{([{ href: "#utama", label: "Utama", icon: "home" }, { href: "#kelas", label: "Kelas", icon: "book-open" }, { href: "#program", label: "LaburSaham", icon: "graduation-cap" }] as const).map(item => <a className="app-dock-item" key={item.href} href={item.href} aria-label={item.label} aria-current={mobileDestination === item.href ? "location" : undefined} onClick={() => setMobileDestination(item.href)}><NavigationIcon name={item.icon} /><span>{item.label}</span></a>)}<Link href={accountHref} className="app-dock-item" aria-label={accountLabel}><NavigationIcon name={accountIcon} /><span>{accountLabel}</span></Link></nav>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="course-dialog" showCloseButton={false} onCloseAutoFocus={e => { e.preventDefault(); lastTrigger.current?.focus(); }}><div className="dialog-top"><span className="eyebrow">{course?.id.startsWith("labursaham-") ? "PROGRAM LABURSAHAM" : "KELAS AAA"}</span><DialogClose asChild><Button variant="ghost" size="sm">Tutup</Button></DialogClose></div><DialogHeader><DialogTitle>{course?.title} · {course?.format}</DialogTitle><DialogDescription>Semak butiran sesi sebelum mendaftar.</DialogDescription></DialogHeader>{course && <CoursePreview key={`${course.id}-${open}`} course={course} />}</DialogContent></Dialog>
  </>;
}
