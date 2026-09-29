"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteFooter } from "@/components/site-footer";
import { assetPath } from "@/lib/site-path";
import { money, previewCourses, topics } from "@/lib/preview-courses";
import { CourseCover } from "./course-card";
import { Icon } from "./icon";
import { IconFrame } from "@/components/ui/icon-frame";
import { useAccountSession } from "@/lib/use-account-session";
import { previewAccountDock } from "@/components/account/account-dock";
import { HomeTwoHelpBanner, HomeTwoProgramCards } from "./home-two-sections";

const accountHref = "/flow/member-26-akaun-utama";
const nav = [{ label: "LaburSaham", href: "#program", icon: "chart" }, { label: "Courses", href: "#kelas", icon: "graduation" }, { label: "How It Works", href: "#cara", icon: "settings" }, { label: "Help", href: "#soalan", icon: "help" }] as const;
const mobileNav = [{ label: "Home", href: "#main", icon: "home" }, ...nav] as const;

export function HomepageTwo() {
  const accountActive = useAccountSession(true);
  const [homeMenuOpen, setHomeMenuOpen] = useState(false);
  const homeMenuButton = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (window.location.hash && window.location.hash !== "#main") return;
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
  }
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Semua topik");
  const filtered = previewCourses.filter((item) =>
    (topic === "Semua topik" || item.topic === topic) &&
    `${item.title} ${item.description} ${item.topic}`.toLocaleLowerCase("ms").includes(query.trim().toLocaleLowerCase("ms"))
  );
  function reset() { setQuery(""); setTopic("Semua topik"); }

  return <div className="home-two">
    <a className="skip-link" href="#main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      {accountActive ? <Button ref={homeMenuButton} variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Dashboard Menu" aria-expanded={homeMenuOpen} aria-controls="home-two-mobile-menu" onClick={() => setHomeMenuOpen(value => !value)} onKeyDown={event => { if (event.key === "Escape") setHomeMenuOpen(false); }}><Icon name="menu" /></Button> : <span className="mobile-header-spacer" aria-hidden="true" />}
      <Link className="brand" href="/" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Navigasi variasi kedua">{nav.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}</nav>
      <Button asChild size="sm" variant="outline" className="login-button"><Link href={accountHref}><Icon name="user" />{accountActive ? "User Account" : "Login"}</Link></Button>
      {accountActive ? <span className="mobile-header-spacer" aria-hidden="true" /> : <Link href={accountHref} className="mobile-account-button header-icon-control" aria-label="Login"><Icon name="user" /></Link>}
    </div>{accountActive && <nav id="home-two-mobile-menu" className="mobile-inline-navigation page-shell" aria-label="Dashboard Menu" hidden={!homeMenuOpen} onKeyDown={event => { if (event.key === "Escape") { setHomeMenuOpen(false); homeMenuButton.current?.focus(); } }}>{previewAccountDock.map(item => <Link key={item.href} href={item.href} onClick={() => setHomeMenuOpen(false)}><Icon name={item.icon} />{item.label}</Link>)}</nav>}</header>
    <main id="main">
      <section className="page-shell home-two-intro" aria-labelledby="home-two-title">
        <div className="home-two-hero">
          <div className="home-two-hero-copy"><span className="eyebrow">ASRI AHMAD ACADEMY · LABURSAHAM</span><h1 id="home-two-title">Fahami saham.<br /><span>Mulakan dengan ilmu.</span></h1><p>Kelas online dan bersemuka yang membantu anda belajar, berlatih dan bertanya dengan lebih yakin.</p><div className="home-two-hero-actions"><Button asChild size="lg"><a href="#kelas">Teroka kelas <span aria-hidden="true">→</span></a></Button><a href="#cara">Bagaimana ia berfungsi</a></div></div>
          <div className="home-two-hero-visual"><Image src={assetPath("/images/asri-mobile-v2.webp")} alt="Dato Haji Asri dalam sut kelabu, memegang trofi" fill priority unoptimized sizes="(max-width: 700px) 90vw, 45vw" /></div>
          <div className="home-two-hero-note"><Icon name="calendar" /><span><strong>Sesi contoh berikutnya</strong><small>17 Okt · Online langsung</small></span></div>
        </div>
        <div className="home-two-quick" aria-label="Pautan pantas">
          <a href="#kelas"><IconFrame name="search" variant="muted" /><strong>Cari kelas</strong><small>Ikut topik</small><b aria-hidden="true">→</b></a>
          <a href="#program"><IconFrame name="book" variant="muted" /><strong>Kenali LaburSaham</strong><small>Program utama AAA</small><b aria-hidden="true">→</b></a>
          <Link href={accountHref}><IconFrame name="calendar" variant="muted" /><strong>Tempahan contoh</strong><small>Lihat susun atur akaun</small><b aria-hidden="true">→</b></Link>
        </div>
      </section>

      <section id="program" className="page-shell home-two-program"><div className="home-two-section-head"><div><span className="eyebrow">PROGRAM UTAMA</span><h2>Belajar dengan arah.</h2><p>Mulakan dengan asas, kemudian bawa soalan anda ke sesi bersama AAA.</p></div><Link href="/flow/public-02-programme-sales">Butiran program <span aria-hidden="true">→</span></Link></div><HomeTwoProgramCards /></section>

      <section id="kelas" className="page-shell home-two-catalog"><div className="home-two-section-head"><div><span className="eyebrow">KELAS AAA</span><h2>Cari langkah anda.</h2><p>Pilih topik yang sesuai. Kelas dan harga ialah contoh reka bentuk.</p></div><span className="home-two-results" role="status">{filtered.length} kelas</span></div><div className="home-two-tools"><label className="home-two-search"><Icon name="search" /><Input aria-label="Cari kelas AAA" placeholder="Cari kelas atau topik" value={query} onChange={(event) => setQuery(event.target.value)} /></label></div><div className="home-two-topics" aria-label="Topik kelas">{topics.map((value) => <Button key={value} variant={topic === value ? "default" : "secondary"} aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</Button>)}</div>
        {filtered.length ? <div className="home-two-course-grid">{filtered.map((item) => <Link className="home-two-course" href={`/flow/public-10-aaa-class-sales?course=${encodeURIComponent(item.id)}`} aria-label={`Lihat kelas ${item.title}`} key={item.id}><CourseCover course={item} /><div><span className="home-two-course-meta">{item.level} · {item.format}</span><h3>{item.title}</h3><p>{item.description}</p><div className="home-two-course-foot"><strong>{money(item.price)}</strong><span className="home-two-course-action">Lihat kelas <span aria-hidden="true">→</span></span></div></div></Link>)}</div> : <div className="home-two-empty"><strong>Tiada kelas ditemui.</strong><p>Cuba topik atau carian lain.</p><Button onClick={reset}>Lihat semua kelas</Button></div>}
      </section>

      <section id="cara" className="page-shell home-two-steps"><div className="home-two-section-head"><div><span className="eyebrow">CARA MENDAFTAR</span><h2>Tiga langkah yang jelas.</h2></div></div><div className="home-two-step-rail" aria-label="Aliran pendaftaran"><div><IconFrame name="search" variant="muted" /><strong>01 · Teroka</strong><p>Semak kelas, tarikh dan format.</p></div><div><IconFrame name="settings" variant="muted" /><strong>02 · Pilih</strong><p>Pilih sesi dan pakej yang sesuai.</p></div><div><IconFrame name="ticket" variant="muted" /><strong>03 · Sahkan</strong><p>Semak tempahan dan akses kelas selepas bayaran disahkan.</p></div></div><p className="home-two-steps-note">Pendaftaran sebenar belum diaktifkan dalam pratonton ini.</p></section>

      <section id="soalan" className="page-shell"><HomeTwoHelpBanner /></section>
    </main>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Home Menu">{mobileNav.map(item => <a href={item.href} className="app-dock-item" key={item.href} aria-label={item.label} onClick={item.href === "#main" ? scrollToHomeTop : undefined}><Icon name={item.icon} /><span>{item.label}</span></a>)}</nav>

  </div>;
}
