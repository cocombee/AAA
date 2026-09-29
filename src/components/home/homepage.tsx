"use client";
import { assetPath } from "@/lib/site-path";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { previewCourses, topics } from "@/lib/preview-courses";
import { Input } from "@/components/ui/input";
import { CourseCard } from "./course-card";
import { MainHomeIntakeCard, MainHomeProgrammeCard } from "./main-home-sections";
import { Icon } from "./icon";
import { IconFrame } from "@/components/ui/icon-frame";
import { SiteFooter } from "@/components/site-footer";
import { useAccountSession } from "@/lib/use-account-session";
import { previewAccountDock, realAccountDock } from "@/components/account/account-dock";
import { homeNavigation as headerNav } from "@/lib/home-navigation";

const topicIcons = { "Semua topik": "grid", "Asas saham": "book", "Analisis teknikal": "chart", Portfolio: "portfolio" } as const;
const questions = [
  { q: "Bagaimana saya mendaftar program AAA?", a: "Semak halaman program, pilih sesi online atau fizikal yang ditawarkan, kemudian log masuk dan lengkapkan pendaftaran. Pendaftaran disahkan selepas bayaran diterima. Pembayaran belum diaktifkan." },
  { q: "Apa beza sesi online dan fizikal?", a: "Sesi online diikuti melalui pautan kelas langsung. Sesi fizikal berlangsung di lokasi yang dinyatakan. Semak tarikh, masa, tempat dan manfaat pakej sebelum mendaftar." },
  { q: "Di mana saya boleh melihat tempahan saya?", a: "Selepas log masuk, dashboard pengguna menghimpunkan pendaftaran, tarikh program dan rekod pembayaran anda. Maklumat penyertaan akan diberikan oleh AAA sebelum program." },
  { q: "Adakah rakaman dan bahan disertakan?", a: "Bahan, rakaman atau sesi tambahan akan dinyatakan pada halaman program sebenar. Semak pakej yang dipilih; jangan anggap semua sesi menyertakan rakaman." },
];

export function Homepage({ loginHref }: { loginHref: string }) {
  const previewAccount = loginHref.startsWith("/flow/");
  const accountActive = useAccountSession(previewAccount);
  const accountHref = accountActive && !previewAccount ? "/dashboard" : loginHref;
  const accountLabel = accountActive ? "User Account" : "Login";
  const accountIcon = "user";
  const dashboardMenu = previewAccount ? previewAccountDock : realAccountDock;
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const homeMenuButton = useRef<HTMLButtonElement | null>(null);
  const [mobileDestination, setMobileDestination] = useState("#utama");
  useEffect(() => {
    if (window.location.hash && window.location.hash !== "#utama") return;
    const resetScroll = () => window.scrollTo({ top: 0, behavior: "instant" });
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    window.addEventListener("pageshow", resetScroll);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("pageshow", resetScroll); };
  }, []);
  function scrollToHomeTop(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, behavior: "instant" });
    setMobileDestination("#utama");
  }
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) setMobileDestination(`#${entry.target.id}`); }, { rootMargin: "-100px 0px -55% 0px", threshold: 0 });
    for (const id of ["utama", "program", "kelas", "tentang", "soalan"]) { const element = document.getElementById(id); if (element) observer.observe(element); }
    return () => observer.disconnect();
  }, []);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<string>("Semua topik");
  const visibleCourses = previewCourses.filter(item => (topic === "Semua topik" || item.topic === topic) && `${item.title} ${item.description} ${item.topic}`.toLocaleLowerCase("ms").includes(query.trim().toLocaleLowerCase("ms")));
  function resetFilters() { setQuery(""); setTopic("Semua topik"); }


  return <>
    <a className="skip-link" href="#main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      {accountActive ? <Button ref={homeMenuButton} variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Dashboard Menu" aria-expanded={homeMenuOpen} aria-controls="home-mobile-menu" onClick={() => setHomeMenuOpen(value => !value)} onKeyDown={event => { if (event.key === "Escape") setHomeMenuOpen(false); }}><Icon name="menu" /></Button> : <span className="mobile-header-spacer" aria-hidden="true" />}
      <a className="brand" href="#utama" aria-label="Asri Ahmad Academy halaman utama" onClick={scrollToHomeTop}><Brand /></a>
      <nav className="desktop-nav" aria-label="Navigasi utama">{headerNav.map(n => <a key={n.href} href={n.href} onClick={n.href === "#utama" ? scrollToHomeTop : undefined} aria-current={mobileDestination === n.href ? "location" : undefined}>{n.href === "#utama" && <Icon name="home" />}{n.label}</a>)}</nav>
      <Button variant="outline" size="sm" className="login-button" asChild><Link href={accountHref}><Icon name={accountIcon} />{accountLabel}</Link></Button>
      {accountActive ? <span className="mobile-header-spacer" aria-hidden="true" /> : <Link href={accountHref} className="mobile-account-button header-icon-control" aria-label={accountLabel}><Icon name={accountIcon} /></Link>}
    </div>{accountActive && <nav id="home-mobile-menu" className="mobile-inline-navigation page-shell" aria-label="Dashboard Menu" hidden={!homeMenuOpen} onKeyDown={event => { if (event.key === "Escape") { setHomeMenuOpen(false); homeMenuButton.current?.focus(); } }}>{dashboardMenu.map(item => <Link key={item.href} href={item.href} onClick={() => setHomeMenuOpen(false)}><Icon name={item.icon} />{item.label}</Link>)}</nav>}</header>
    <main id="main">
      <section id="utama" className="hero page-shell"><div className="hero-feature">
        <div className="hero-copy"><div className="eyebrow">KELAS LABURSAHAM · AAA</div><h1>Fahami saham.<br /><span className="hero-final-line">Dengan <span className="hero-highlight">ilmu.</span></span></h1><p><span>From Zero to Hero.</span><span>Online, Online+ atau Fizikal.</span></p><div className="hero-actions"><Button asChild><a href="#program">Lihat program semasa<span className="action-arrow" aria-hidden="true">→</span></a></Button></div><div className="hero-presenter"><span>BELAJAR BERSAMA</span><strong>Datuk Haji Mohd Asri</strong></div></div>
        <div className="hero-visual"><Image src={assetPath("/images/hero-market-accent.svg")} alt="" width={240} height={240} unoptimized className="hero-market-accent" /><Image src={assetPath("/images/asri-mobile-v2.webp")} alt="Datuk Haji Mohd Asri dalam sut kelabu, memegang trofi" fill preload unoptimized className="hero-portrait" /></div>
      </div></section>
      <div className="learning-strip"><div className="page-shell strip-inner"><span className="strip-title"><span>Cara Belajar.</span><strong>Pilihan anda.</strong></span><div><span className="strip-index">1</span><p><strong>Sesi online</strong><span>Belajar dari tempat anda bersama AAA.</span></p></div><div><span className="strip-index">2</span><p><strong>Sesi bersemuka</strong><span>Ruang untuk bertanya dan berlatih.</span></p></div><div><span className="strip-index">3</span><p><strong>Pendaftaran teratur</strong><span>Semak tempahan anda dalam akaun.</span></p></div></div></div>
      <section id="program" className="programme-section page-shell">
        <div className="section-heading"><div className="section-title"><span className="eyebrow">PROGRAM UTAMA · LABURSAHAM</span><h2>Kelas LaburSaham bersama AAA.</h2><p>Lihat manfaat setiap pakej, kemudian daftar dengan pilihan yang sesuai.</p></div></div>
        <MainHomeProgrammeCard />
      </section>
      <section id="kelas" className="catalog-section page-shell">
        <div className="section-heading"><div className="section-title"><span className="eyebrow">TEROKAI KELAS AAA</span><h2>Ilmu untuk langkah seterusnya.</h2><p>Cari kelas mengikut topik dan tahap yang sesuai untuk anda.</p></div></div>
        <div className="catalog-tools"><div className="catalog-search"><Icon name="search" /><Input aria-label="Cari kelas AAA" placeholder="Cari kelas atau topik" value={query} onChange={e => setQuery(e.target.value)} /><Button type="button" variant="ghost" className="catalog-reset" aria-label="Set semula penapis kelas" onClick={resetFilters}><Icon name="reset" /></Button></div></div>
        <div className="topic-filters" aria-label="Topik kelas">{topics.map(value => <Button key={value} variant="ghost" className={topic === value ? "topic-selected" : ""} aria-pressed={topic === value} onClick={() => setTopic(value)}><Icon name={topicIcons[value]} />{value}</Button>)}</div>
        <span className="sr-only" role="status">{visibleCourses.length} kelas</span>
        {visibleCourses.length ? <div className="course-grid">{visibleCourses.map(item => <CourseCard key={item.id} course={item} />)}</div> : <div className="empty-catalog"><h3>Tiada kelas ditemui.</h3><p>Cuba topik atau carian lain.</p><Button onClick={resetFilters}>Lihat semua kelas</Button></div>}
      </section>
      <section className="intake-section page-shell"><MainHomeIntakeCard /></section>
      <section className="registration-steps page-shell"><div className="section-heading"><div className="section-title"><span className="eyebrow">PENDAFTARAN YANG MUDAH</span><h2>Dari pilihan ke pengesahan.</h2></div></div><div className="path-grid">{([{ icon: "search", title: "Semak program", text: "Lihat tarikh, format, lokasi dan manfaat pakej sebelum membuat pilihan." }, { icon: "payment", title: "Daftar & bayar", text: "Log masuk, semak maklumat pendaftaran dan lengkapkan pembayaran." }, { icon: "grid", title: "Semak dalam akaun", text: "Lihat pengesahan dan tempahan dalam akaun anda." }] as const).map(step => <article className="path-card" key={step.title}><IconFrame name={step.icon} variant="navy" /><div className="path-copy"><h3>{step.title}</h3><p>{step.text}</p></div></article>)}</div></section>
      <section id="tentang" className="about-section page-shell"><div className="about-panel"><figure className="about-visual"><Image src={assetPath("/images/course-bengkel-crisp.webp")} alt="Ilustrasi sesi belajar bersama, dengan nota dan latihan carta" fill quality={90} sizes="(max-width: 700px) max(90vw, 375px), 660px" /><figcaption>Ruang untuk belajar bersama.</figcaption></figure><div className="about-copy section-title"><span className="eyebrow">ASRI AHMAD ACADEMY</span><h2>Ilmu dahulu.<br />Keputusan dengan kefahaman.</h2><p>Belajar saham dan pelaburan melalui latihan, perbincangan dan bimbingan bersama AAA.</p><p className="about-note">Untuk pendidikan. Kandungan pembelajaran bukan cadangan membeli atau menjual saham tertentu.</p><Button asChild><a href="#program">Lihat program semasa</a></Button></div></div></section>
      <section id="soalan" className="faq-section page-shell"><div className="section-title"><span className="eyebrow">SEBELUM ANDA MENDAFTAR</span><h2>Ada soalan?<br />Mulakan di sini.</h2><p>Panduan ringkas tentang program dan pendaftaran.</p></div><Accordion type="single" collapsible>{questions.map((q, i) => <AccordionItem value={`q-${i}`} key={q.q}><AccordionTrigger>{q.q}</AccordionTrigger><AccordionContent>{q.a}</AccordionContent></AccordionItem>)}</Accordion></section>
    </main>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Home Menu">{headerNav.map(item => <a className="app-dock-item" key={item.href} href={item.href} aria-label={item.label} aria-current={mobileDestination === item.href ? "location" : undefined} onClick={item.href === "#utama" ? scrollToHomeTop : () => setMobileDestination(item.href)}><Icon name={item.icon} /><span>{item.label}</span></a>)}</nav>

  </>;
}
