"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import screens from "@/lib/figma-flow-screens.json";
import contentMap from "@/lib/figma-flow-content.json";
import blockMap from "@/lib/figma-flow-blocks.json";
import targetMap from "@/lib/figma-flow-targets.json";
import fieldMap from "@/lib/figma-flow-fields.json";
import { assetPath } from "@/lib/site-path";
import { previewCourses, money } from "@/lib/preview-courses";
import { Brand } from "@/components/brand";
import { Icon, type IconName } from "@/components/home/icon";
import { NavigationIcon } from "@/components/navigation-icon";
import { SiteFooter } from "@/components/site-footer";
import { developmentSessionEvent, endDevelopmentSession, hasDevelopmentSession, startDevelopmentSession } from "@/lib/development-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseCover } from "@/components/home/course-card";

type Screen = (typeof screens)[number];
type Choice = { session: "Online" | "Fizikal"; package: "Standard" | "Bimbingan"; workbook: boolean; method: "FPX" | "Kad"; bank: string; name: string; email: string; phone: string };
const initialChoice: Choice = { session: "Online", package: "Standard", workbook: false, method: "FPX", bank: "Maybank2u", name: "Nur Aina Ahmad", email: "aina@example.com", phone: "012-345 6789" };
const storageKey = "aaa-v2-checkout-preview";
const byNumber = (group: Screen["group"], number: number) => screens.find((s) => s.group === group && Number(s.number) === number);
const href = (group: Screen["group"], number: number) => `/flow/${byNumber(group, number)?.slug ?? screens[0].slug}`;
const navItems = [
  { label: "Utama", href: "/" },
  { label: "LaburSaham", href: href("public", 2) },
  { label: "Kelas AAA", href: href("public", 3) },
  { label: "Tentang AAA", href: href("public", 5) },
  { label: "Bantuan", href: href("public", 6) },
];
type SideItem = { label: string; number: number; icon: IconName };
const memberNav: SideItem[] = [
  { label: "Dashboard", number: 26, icon: "grid" },
  { label: "Tempahan saya", number: 27, icon: "calendar" },
  { label: "Bahan & replay", number: 31, icon: "book" },
  { label: "Bayaran", number: 32, icon: "payment" },
  { label: "Profil", number: 36, icon: "user" },
  { label: "Keselamatan", number: 38, icon: "lock" },
  { label: "Bantuan", number: 37, icon: "search" },
];
const staffNav: SideItem[] = [
  { label: "Ringkasan", number: 43, icon: "grid" },
  { label: "Program", number: 44, icon: "book" },
  { label: "Sesi & kapasiti", number: 48, icon: "calendar" },
  { label: "Peserta & check-in", number: 50, icon: "user" },
  { label: "Akses peserta", number: 52, icon: "user" },
  { label: "Bayaran & refund", number: 54, icon: "payment" },
  { label: "Sokongan", number: 58, icon: "search" },
  { label: "Peranan & audit", number: 59, icon: "grid" },
];
function human(value: string) {
  return value.replace(/&amp;/g, "&").replace(/\bcontoh\b/gi, "pratonton").replace(/\bdraf\b/gi, "dalam semakan").replace(/\s+/g, " ").trim();
}
function total(c: Choice) { return (c.session === "Fizikal" ? 299 : 199) + (c.package === "Bimbingan" ? 100 : 0) + (c.workbook ? 29 : 0); }

export function FlowScreen({ screen }: { screen: Screen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [choice, setChoice] = useState<Choice>(initialChoice);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Semua topik");
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<Choice> | null;
      if (saved) setChoice({ ...initialChoice, ...saved });
    } catch { /* Empty or old preview state. */ }
  }, []);
  useEffect(() => {
    if (screen.group !== "public") return;
    const number = Number(screen.number);
    const routeChoice: Partial<Choice> = {};
    if ([14, 19, 20].includes(number)) routeChoice.package = "Standard";
    if ([15, 18, 21].includes(number)) routeChoice.package = "Bimbingan";
    if ([16, 19].includes(number)) routeChoice.workbook = false;
    if ([17, 20].includes(number)) routeChoice.workbook = true;
    if (number === 27) routeChoice.method = "FPX";
    if (number === 28) routeChoice.method = "Kad";
    if (!Object.keys(routeChoice).length) return;
    setChoice((current) => {
      const next = { ...current, ...routeChoice };
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Preview remains usable without storage. */ }
      return next;
    });
  }, [screen.group, screen.number]);
  const update = (value: Partial<Choice>) => setChoice((current) => {
    const next = { ...current, ...value };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Preview remains usable without storage. */ }
    return next;
  });
  const number = Number(screen.number);
  const surface = screen.group === "state"
    ? number >= 73 && number <= 75 ? "staff" : number >= 60 && number <= 66 ? "public" : "member"
    : screen.group;
  const isAccount = surface === "member" || surface === "staff";
  useEffect(() => {
    if (isAccount) startDevelopmentSession();
    const refresh = () => setSignedIn(hasDevelopmentSession());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener(developmentSessionEvent, refresh);
    return () => { window.removeEventListener("storage", refresh); window.removeEventListener(developmentSessionEvent, refresh); };
  }, [isAccount]);
  const accountHref = href("member", 26);
  const side = surface === "staff" ? staffNav : memberNav;
  const showingSide = surface !== "public";
  const filteredCourses = useMemo(() => previewCourses.filter((course) =>
    (topic === "Semua topik" || course.topic === topic) &&
    `${course.title} ${course.description}`.toLocaleLowerCase("ms").includes(search.toLocaleLowerCase("ms"))
  ), [search, topic]);
  const selectedSession = choice.session === "Fizikal" ? "7 Nov 2026 · Shah Alam" : "17 Okt 2026 · Online langsung";
  const requestNotice = () => setNotice("Sambungan pelayan belum aktif. Tiada perubahan atau bayaran dibuat.");

  function actionTarget(index: number): string | null {
    if (screen.group === "public" && number === 2 && index === 0) return href("public", choice.package === "Bimbingan" ? 15 : 14);
    if (screen.group === "public" && number === 22 && index === 0) return href("public", choice.method === "Kad" ? 28 : 27);
    const entry = targetMap.find((item) => item.slug === screen.slug);
    return entry?.targets[index] ? `/flow/${entry.targets[index]}` : null;
  }
  function actions(labels = screen.actions) {
    if (!labels.length) return null;
    return <div className="flow-actions">{labels.map((label, i) => {
      const target = actionTarget(i);
      const text = screen.group === "state" && number === 60 && i === 0 ? "Masuk akaun" : screen.group === "member" && number === 31 && i === 1 ? "Tonton video demonstrasi" : human(label);
      return target
        ? <Button key={label} variant={i ? "secondary" : "default"} asChild><Link href={target}>{text}</Link></Button>
        : <Button key={label} variant={i ? "secondary" : "default"} onClick={requestNotice}>{text}</Button>;
    })}</div>;
  }
  const heading = <div className="flow-heading"><span className="eyebrow">{human(screen.subtitle)}</span><h1>{human(screen.title)}</h1>{screen.description && <p>{screen.group === "state" && number === 60 ? "Masuk semula untuk membuka akaun anda. Pasukan AAA boleh membantu jika anda kehilangan akses." : human(screen.description)}</p>}</div>;

  return <div className="flow-site">
    <a className="skip-link" href="#flow-main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      <Button variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Menu" aria-expanded={menuOpen} aria-controls="flow-mobile-menu" onClick={() => setMenuOpen((open) => !open)}><Icon name="menu" /></Button>
      <Link href="/" className="brand" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">{navItems.map((item) => <Link key={item.label} href={item.href}>{item.label === "Utama" && <Icon name="home" />}{item.label}</Link>)}</nav>
      <Button variant="outline" size="sm" className="login-button" asChild><Link href={isAccount ? "/" : accountHref} onClick={isAccount ? endDevelopmentSession : undefined}><Icon name={isAccount ? "logout" : signedIn ? "grid" : "user"} />{isAccount ? "Log keluar" : signedIn ? "Dashboard" : "Log masuk"}</Link></Button>
      <Link href={isAccount ? "/" : accountHref} onClick={isAccount ? endDevelopmentSession : undefined} className="mobile-account-button header-icon-control" aria-label={isAccount ? "Log keluar" : signedIn ? "Dashboard" : "Akaun saya"}><Icon name={isAccount ? "logout" : signedIn ? "grid" : "user"} /></Link>
    </div><nav id="flow-mobile-menu" className="mobile-inline-navigation page-shell" aria-label="Navigasi telefon" hidden={!menuOpen}>{navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}<Link href={accountHref} onClick={() => setMenuOpen(false)}>{signedIn || isAccount ? "Dashboard" : "Log masuk"}</Link></nav></header>
    <div className={showingSide ? "page-shell flow-with-sidebar" : "page-shell flow-main-only"}>
      {showingSide && <aside className="flow-sidebar"><nav aria-label={surface === "staff" ? "Operasi staf" : "Akaun"}>{side.map((item) => <Link key={item.number} href={href(surface === "staff" ? "staff" : "member", item.number)} aria-current={screen.group === surface && number === item.number ? "page" : undefined}><Icon name={item.icon} />{item.label}</Link>)}<Link href="/" onClick={endDevelopmentSession}><Icon name="logout" />Log keluar</Link></nav></aside>}
      <main id="flow-main" className={`flow-main${showingSide ? " flow-dashboard-main" : ""}`}>{heading}
        {screen.group === "staff" && <p className="flow-inline-note">Paparan operasi pembangunan menggunakan rekod latihan. Tindakan menyimpan dan mengesahkan memerlukan sambungan pelayan.</p>}
        {screen.group === "public" && number <= 12 && <PublicContent screen={screen} number={number} filteredCourses={filteredCourses} search={search} setSearch={setSearch} topic={topic} setTopic={setTopic} choice={choice} update={update} actions={actions} />}
        {screen.group === "public" && number === 13 && <div className="flow-card flow-center"><p>Masuk terus ke akaun anda untuk melihat tempahan dan bahan kelas.</p><Button asChild><Link href={href("member", 26)}>Masuk akaun</Link></Button></div>}
        {screen.group === "public" && number >= 14 && number <= 18 && <><StepRail step={number < 16 ? 2 : 3} /><div className="flow-choice-grid">{number < 16 ? <><ChoiceCard active={choice.package === "Standard"} label="Standard" description="Sesi bersama AAA, nota PDF dan maklumat penyertaan." price={choice.session === "Fizikal" ? 299 : 199} onClick={() => update({ package: "Standard" })} /><ChoiceCard active={choice.package === "Bimbingan"} label="Bimbingan" description="Semua dalam Standard, dengan sesi soal jawab tambahan." price={(choice.session === "Fizikal" ? 299 : 199) + 100} onClick={() => update({ package: "Bimbingan" })} /></> : <><ChoiceCard active={choice.workbook} label="Workbook latihan" description="Latihan digital untuk mengukuhkan pembelajaran." price={29} onClick={() => update({ workbook: !choice.workbook })} /><div className="flow-card"><h2>Tambahan mengikut pilihan</h2><p>Workbook bermula tanpa dipilih. Pakej Bimbingan menggantikan Standard dan tidak dicaj dua kali.</p></div></>}</div><Summary choice={choice} /><div className="flow-actions"><Button asChild><Link href={href("public", number < 16 ? choice.package === "Bimbingan" ? 18 : 16 : choice.package === "Bimbingan" ? 21 : choice.workbook ? 20 : 19)}>{number < 16 ? "Teruskan ke tambahan" : "Semak tempahan"}</Link></Button><Button variant="secondary" asChild><Link href={href("public", number < 16 ? 2 : choice.package === "Bimbingan" ? 15 : 14)}>Kembali</Link></Button></div></>}
        {screen.group === "public" && number >= 19 && number <= 21 && <><StepRail step={4} /><div className="flow-columns"><div className="flow-card"><h2>Maklumat peserta</h2><Field label="Nama penuh" value={choice.name} onChange={(v) => update({ name: v })} /><Field label="E-mel" value={choice.email} onChange={(v) => update({ email: v })} /><Field label="Telefon" value={choice.phone} onChange={(v) => update({ phone: v })} /></div><Summary choice={choice} /></div><div className="flow-actions"><Button asChild><Link href={href("public", 22)}>Teruskan ke bayaran</Link></Button><Button variant="secondary" asChild><Link href={href("public", choice.workbook ? 17 : 16)}>Ubah tempahan</Link></Button></div></>}
        {screen.group === "public" && number >= 22 && number <= 28 && <PaymentContent number={number} choice={choice} update={update} actions={actions} notice={requestNotice} />}
        {screen.group !== "public" && <AccountContent screen={screen} choice={choice} actions={actions} notice={requestNotice} />}
        {notice && <p className="flow-notice" role="status">{notice}</p>}
      </main>
    </div>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Navigasi bawah"><Link className="app-dock-item" href="/" aria-label="Utama"><NavigationIcon name="home" /><span>Utama</span></Link><Link className="app-dock-item" href={href("public", 3)} aria-label="Kelas"><NavigationIcon name="book-open" /><span>Kelas</span></Link><Link className="app-dock-item" href={href("public", 2)} aria-label="LaburSaham"><NavigationIcon name="graduation-cap" /><span>LaburSaham</span></Link><Link className="app-dock-item" href={accountHref} aria-label={signedIn || isAccount ? "Dashboard" : "Akaun"}><NavigationIcon name={signedIn || isAccount ? "grid" : "user"} /><span>{signedIn || isAccount ? "Dashboard" : "Akaun"}</span></Link></nav>
  </div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="flow-field"><span>{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function StepRail({ step }: { step: number }) {
  return <div className="flow-steps" aria-label="Langkah pendaftaran">{["Sesi", "Pakej", "Tambahan", "Semak"].map((label, index) => <span key={label} className={index + 1 === step ? "is-active" : ""}>{String(index + 1).padStart(2, "0")} · {label}</span>)}</div>;
}
function ChoiceCard({ active, label, description, price, onClick }: { active: boolean; label: string; description: string; price: number; onClick: () => void }) {
  return <button className={`flow-choice-card ${active ? "is-active" : ""}`} type="button" aria-pressed={active} onClick={onClick}><span className="flow-choice-state">{active ? "DIPILIH" : "PILIHAN"}</span><strong>{label}</strong><span>{description}</span><b>{money(price)}</b></button>;
}
function Summary({ choice }: { choice: Choice }) {
  return <div className="flow-card flow-summary"><h2>Ringkasan pilihan</h2><dl><div><dt>Sesi</dt><dd>{choice.session === "Fizikal" ? "Fizikal" : "Online langsung"}</dd></div><div><dt>Pakej</dt><dd>{choice.package}</dd></div>{choice.workbook && <div><dt>Tambahan</dt><dd>Workbook latihan · RM29</dd></div>}<div><dt>Jumlah</dt><dd><strong>{money(total(choice))}</strong></dd></div></dl></div>;
}

type FlowBlock = { kind: string; title?: string; subtitle?: string; description?: string; question?: string; [key: string]: string | undefined };
function faqAnswer(question: string) {
  if (/daftar|pakej/i.test(question)) return "Pilih sesi dan pakej, semak maklumat peserta, kemudian pilih kaedah bayaran. Tempahan disahkan selepas bayaran disahkan.";
  if (/ticket|tiket|zoom/i.test(question)) return "Maklumat Zoom dan tiket fizikal tersedia dalam bahagian Tempahan saya selepas tempahan disahkan.";
  if (/replay|bahan|nota/i.test(question)) return "Bahan dan tempoh akses bergantung pada pakej yang dipilih. Semak butiran pakej sebelum mendaftar.";
  if (/bayaran/i.test(question)) return "Pengesahan bayaran mungkin mengambil masa. Semak status di akaun anda atau hubungi bantuan jika status tidak berubah.";
  if (/tarikh|sesi|pembatalan/i.test(question)) return "Permohonan perubahan sesi atau pembatalan boleh dibuat melalui akaun dan tertakluk pada polisi AAA.";
  return "Semak butiran program atau hubungi pasukan AAA untuk bantuan lanjut.";
}
function FlowBlocks({ slug }: { slug: string }) {
  const blocks = (blockMap.find((item) => item.slug === slug)?.blocks || []) as FlowBlock[];
  if (!blocks.length) return null;
  return <div className="flow-block-grid">{blocks.map((block, index) => {
    if (block.kind === "AaaFaqRow") {
      const question = human(block.question || (slug.includes("help-and-faq") ? "Bagaimana saya mendaftar?" : "Apa yang termasuk dalam pakej?"));
      return <details className="flow-card flow-faq" key={index}><summary>{question}</summary><p>{faqAnswer(question)}</p></details>;
    }
    if (block.kind.startsWith("AaaDetailsTable")) {
      const rows = Array.from({ length: 6 }, (_, row) => ({ label: human(block[`label${row + 1}`] || ["Tarikh", "Masa", "Pakej", "Rujukan", "Tempat", "Status"][row]), value: block[`value${row + 1}`] })).filter((row) => row.value);
      if (!rows.length) return null;
      return <div className="flow-card flow-detail-card" key={index}><dl className="flow-facts">{rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{human(row.value || "")}</dd></div>)}</dl></div>;
    }
    const title = human(block.title || "");
    const subtitle = human(block.subtitle || "");
    if (!title && !block.description) return null;
    return <article className={`flow-card ${block.kind === "AaaNotice" ? "flow-block-notice" : ""}`} key={index}>{subtitle && <span className="flow-card-index">{subtitle}</span>}{title && <h2>{title}</h2>}{block.description && <p>{human(block.description)}</p>}</article>;
  })}</div>;
}
function FlowFormFields({ slug, fallback, name }: { slug: string; fallback: string[]; name: string }) {
  const fields = fieldMap.find((item) => item.slug === slug)?.fields || [];
  const items = fields.length ? fields.map((field) => ({ label: field.label || "Nama peserta", value: field.value || "" })) : fallback.map((label) => ({ label, value: label === "Nama penuh" ? name : "" }));
  return <>{items.map((item, index) => {
    const label = human(item.label.replace(/ Google\b/i, ""));
    const empty = /^(Pilih|Tambah|Terangkan|Masukkan|Muat naik)/i.test(item.value);
    return <label className="flow-field" key={`${label}-${index}`}><span>{label}</span><Input aria-label={label} defaultValue={empty ? undefined : human(item.value)} placeholder={empty ? human(item.value) : label} /></label>;
  })}</>;
}

function PublicContent({ screen, number, filteredCourses, search, setSearch, topic, setTopic, choice, update, actions }: {
  screen: Screen; number: number; filteredCourses: typeof previewCourses; search: string; setSearch: (value: string) => void; topic: string; setTopic: (value: string) => void; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode;
}) {
  if (number === 3 || number === 11) return <><div className="flow-catalog-tools"><label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari kelas" placeholder="Cari kelas" value={search} onChange={(event) => setSearch(event.target.value)} /></label><Button variant="secondary" onClick={() => { setSearch(""); setTopic("Semua topik"); }}><Icon name="reset" />Set semula</Button></div><div className="flow-topics">{["Semua topik", "Asas saham", "Analisis teknikal", "Portfolio"].map((name) => <Button key={name} variant={topic === name ? "default" : "secondary"} onClick={() => setTopic(name)}>{name}</Button>)}</div><p className="flow-count">{filteredCourses.length} kelas</p><div className="flow-course-grid">{filteredCourses.map((course) => <Link href={href("public", course.id === "carta" ? 10 : 2)} className="flow-course" key={course.id}><CourseCover course={course} /><div><h2>{course.title}</h2><p>{course.location} · {course.duration}</p><strong>{money(course.price)}</strong></div></Link>)}</div>{actions()}</>;
  if (number === 2 || number === 12 || number === 10) return <><div className="flow-feature"><div className="flow-feature-copy"><span className="eyebrow">{number === 10 ? "ANALISIS TEKNIKAL · AAA" : "KELAS LABURSAHAM"}</span><h2>{number === 10 ? "Baca carta dengan lebih yakin." : <>Fahami dahulu.<br />Praktik bersama.</>}</h2><p>{number === 10 ? "Praktik mengenali struktur carta dalam konteks risiko." : "Pilih sesi yang sesuai dan semak pakej sebelum mendaftar."}</p><div className="flow-feature-facts">{(number === 10 ? ["Struktur carta", "Latihan berpandu", "Risiko dan disiplin"] : ["Asas pasaran", "Urus risiko", "Latihan dan soalan"]).map((fact) => <span key={fact}>{fact}</span>)}</div></div><div className="flow-feature-image"><Image src={assetPath(number === 10 ? "/images/course-carta.webp" : "/images/programme-study-v2.webp")} alt={number === 10 ? "Ilustrasi carta saham" : "Buku dan nota pembelajaran"} fill sizes="(max-width: 700px) 100vw, 45vw" /></div></div>{number !== 10 && <div className="flow-choice-grid"><ChoiceCard active={choice.session === "Online"} label="Online langsung" description="Belajar dari tempat anda. 17 Okt 2026." price={199} onClick={() => update({ session: "Online" })} /><ChoiceCard active={choice.session === "Fizikal"} label="Fizikal" description="Belajar bersemuka. 7 Nov 2026, Shah Alam." price={299} onClick={() => update({ session: "Fizikal" })} /></div>}<FlowBlocks slug={screen.slug} /><div className="flow-actions"><Button asChild><Link href={href("public", choice.package === "Bimbingan" ? 15 : 14)}>{number === 10 ? "Pilih kelas →" : "Pilih pakej →"}</Link></Button><Button variant="secondary" asChild><Link href={href("public", 7)}>Baca polisi</Link></Button></div></>;
  const cards = screen.cards.filter((card) => !["Utama", "LaburSaham", "Kelas AAA", "Tentang AAA", "Bantuan"].includes(card) && card !== screen.title).slice(0, 4);
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{cards.map((card, index) => <article className="flow-card" key={card}><span className="flow-card-index">{String(index + 1).padStart(2, "0")}</span><h2>{human(card)}</h2>{index === 0 && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}</>;
}

function PaymentContent({ number, choice, update, actions, notice }: { number: number; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode; notice: () => void }) {
  const [bankSearch, setBankSearch] = useState("");
  const banks = ["Maybank2u", "CIMB Clicks", "Bank lain"].filter((bank) => bank.toLocaleLowerCase("ms").includes(bankSearch.toLocaleLowerCase("ms")));
  if (number === 23 || number === 24 || number === 25) return <><div className="flow-card"><h2>Tempahan AAA-ONL-001</h2><p>Keadaan ini untuk semakan aliran. Tiada transaksi dibuat melalui laman ini.</p><Summary choice={choice} /></div>{actions()}</>;
  return <><div className="flow-payment-grid"><div><div className="flow-card"><h2>Tempahan AAA-ONL-001</h2><dl className="flow-facts"><div><dt>LaburSaham · {choice.package}</dt><dd>{money(total(choice))}</dd></div><div><dt>Peserta</dt><dd>{choice.name}</dd></div></dl></div><div className="flow-card flow-amount"><h2>Jumlah perlu dibayar</h2><strong>{money(total(choice))}</strong></div></div><div className="flow-card"><h2 className="flow-payment-title"><Icon name={number === 27 ? "search" : "payment"} />{number === 27 ? "Pilih bank FPX" : number === 28 ? "Butiran kad" : "Kaedah bayaran"}</h2>{number === 22 || number === 26 ? <div className="flow-payment-options"><ChoiceCard active={choice.method === "FPX"} label="FPX / perbankan internet" description="Pilih bank dan sahkan pada laman bank." price={total(choice)} onClick={() => update({ method: "FPX" })} /><ChoiceCard active={choice.method === "Kad"} label="Kad debit / kredit" description="Visa dan Mastercard melalui penyedia bayaran." price={total(choice)} onClick={() => update({ method: "Kad" })} /></div> : number === 27 ? <><label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari bank" placeholder="Cari atau pilih bank" value={bankSearch} onChange={(event) => setBankSearch(event.target.value)} /></label><div className="flow-bank-list">{banks.length ? banks.map((bank) => <button type="button" className={choice.bank === bank ? "is-active" : ""} onClick={() => update({ bank })} key={bank}><span>{bank}</span><span aria-hidden="true">{choice.bank === bank ? "◉" : "○"}</span></button>) : <p>Tiada bank sepadan.</p>}</div></> : <><div className="flow-card-placeholder"><strong>Kad debit / kredit</strong><span>Visa · Mastercard</span></div><div className="flow-disabled-fields"><label>Nama pada kad<input disabled placeholder="Diisi pada halaman penyedia bayaran" /></label><label>Nombor kad<input disabled placeholder="Diisi pada halaman penyedia bayaran" /></label><div><label>Tarikh luput<input disabled placeholder="MM / YY" /></label><label>Kod keselamatan<input disabled placeholder="CVC" /></label></div></div></>}</div></div><div className="flow-payment-note"><strong>{number === 27 ? "Anda akan ke laman bank." : number === 28 ? "Butiran kad diisi oleh penyedia bayaran." : "Pembayaran belum diaktifkan."}</strong><p>Maklumat kad dan perbankan tidak diminta atau disimpan di laman ini.</p></div><div className="flow-actions">{number === 22 || number === 26 ? <Button asChild><Link href={href("public", choice.method === "FPX" ? 27 : 28)}><Icon name="payment" />Teruskan dengan {choice.method}</Link></Button> : <Button onClick={notice}><Icon name="payment" />{number === 27 ? "Teruskan ke bank" : `Bayar ${money(total(choice))}`}</Button>}<Button variant="secondary" asChild><Link href={href("public", number === 22 ? choice.package === "Bimbingan" ? 21 : choice.workbook ? 20 : 19 : 22)}>Kembali ke semakan</Link></Button></div></>;
}

function AccountContent({ screen, choice, actions, notice }: { screen: Screen; choice: Choice; actions: (labels?: string[]) => React.ReactNode; notice: () => void }) {
  const number = Number(screen.number);
  const cards = (contentMap.find((item) => item.slug === screen.slug)?.content || screen.cards).filter((card) => ![...memberNav, ...staffNav].some((item) => item.label === card) && card !== screen.title && !/^(AAA|Details|Current step)/.test(card)).slice(0, 4);
  if (screen.group === "state" && number === 60) return <><div className="flow-card"><h2>Akses akaun</h2><p>Masuk terus ke paparan akaun pembangunan. Tempahan dan profil yang ditunjukkan ialah rekod latihan.</p></div>{actions()}</>;
  if (screen.group === "member" && number === 26) return <><div className="flow-card"><h2>LaburSaham · Online langsung</h2><span className="flow-status">TEMPAHAN DISAHKAN</span><dl className="flow-facts"><div><dt>Tarikh</dt><dd>17 Okt 2026</dd></div><div><dt>Masa</dt><dd>9 pagi – 12 tengah hari · MYT</dd></div><div><dt>Pakej</dt><dd>{choice.package}</dd></div><div><dt>Rujukan</dt><dd>AAA-ONL-001</dd></div></dl><div className="flow-actions"><Button size="sm" asChild><Link href={href("member", 28)}><Icon name="video" />Lihat maklumat Zoom</Link></Button><Button size="sm" variant="secondary" onClick={notice}><Icon name="plus" />Tambah ke kalendar</Button></div></div><div className="flow-generic-grid">{[{ title: "Tempahan saya", description: "Sesi online dan fizikal yang telah anda daftar.", n: 27 }, { title: "Bahan kelas", description: "Nota, workbook dan replay mengikut pakej.", n: 31 }, { title: "Bayaran & resit", description: "Semak status transaksi dan muat turun resit.", n: 32 }].map((item) => <Link className="flow-card flow-link-card" href={href("member", item.n)} key={item.n}><h2>{item.title}</h2><p>{item.description}</p></Link>)}</div><Link className="flow-staff-preview-link" href={href("staff", 43)}>Buka operasi staf pembangunan →</Link></>;
  if (screen.group === "state" && number === 68) return <><article className="flow-card flow-replay"><h2>Rakaman sesi · Video demonstrasi</h2><p>Video ini menguji paparan dan kawalan pemain. Ia bukan rakaman kelas sebenar.</p><video controls playsInline preload="metadata" poster={assetPath("/media/labursaham-demo-poster.webp")} aria-label="Video demonstrasi LaburSaham"><source src={assetPath("/media/labursaham-demo.webm")} type="video/webm" />Pelayar ini tidak menyokong video WebM.</video></article><FlowBlocks slug={screen.slug} />{actions()}</>;
  if (screen.group === "staff" && number === 43) return <><div className="flow-generic-grid">{[{ title: "SESI", value: "2 sesi akan datang", detail: "Online 17 Okt · Fizikal 7 Nov", n: 48 }, { title: "BAYARAN", value: "1 bayaran disemak", detail: "AAA-ONL-003 · RM199", n: 54 }, { title: "SOKONGAN", value: "1 kes terbuka", detail: "SUP-001 · Refund Standard", n: 58 }].map((item) => <Link className="flow-card flow-link-card" href={href("staff", item.n)} key={item.n}><span className="flow-card-index">{item.title}</span><h2>{item.value}</h2><p>{item.detail}</p></Link>)}</div><div className="flow-card"><h2>Tindakan seterusnya</h2><p>Sahkan persediaan sesi online dan semak permohonan refund yang terbuka.</p></div>{actions()}</>;
  if (screen.group === "member" && [34, 35, 36, 37, 39].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={choice.name} fallback={number === 39 ? ["E-mel", "Peringatan kelas", "Maklumat program"] : ["Tempahan", "Sebab", "Penjelasan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}</>;
  if (screen.group === "staff" && [45, 49, 51, 53, 55, 56, 59].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={choice.name} fallback={number === 59 ? ["Peranan", "Pengguna", "Catatan"] : ["Peserta", "Sebab", "Catatan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}</>;
  const related = screen.group === "staff" ? staffNav : memberNav;
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks && !(screen.group === "state" && number === 60) ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{(cards.length ? cards : [screen.label]).map((card, index) => <article className="flow-card" key={index}><span className="flow-card-index">{String(index + 1).padStart(2, "0")}</span><h2>{human(card)}</h2>{index === 0 && screen.description && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}{screen.group === "state" && <p className="flow-inline-note">Status ini untuk semakan antaramuka. Tiada akaun atau transaksi diubah.</p>}{screen.group === "staff" && <div className="flow-related"><h2>Operasi lain</h2>{related.slice(0, 4).map((item) => <Link href={href("staff", item.number)} key={item.number}>{item.label} →</Link>)}</div>}</>;
}
