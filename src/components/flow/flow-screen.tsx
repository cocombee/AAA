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
import { previewCourses, formats, money } from "@/lib/preview-courses";
import { Brand } from "@/components/brand";
import { Icon, type IconName } from "@/components/home/icon";
import { NavigationIcon } from "@/components/navigation-icon";
import { SiteFooter } from "@/components/site-footer";
import { endDevelopmentSession } from "@/lib/development-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseCover } from "@/components/home/course-card";
import { fpxPreviewBanks } from "@/lib/fpx-preview-banks";

type Screen = (typeof screens)[number];
type Choice = { session: "Online" | "Fizikal"; package: "Standard" | "Bimbingan"; workbook: boolean; method: "FPX" | "Kad"; bank: string; name: string; email: string; phone: string };
const initialChoice: Choice = { session: "Online", package: "Standard", workbook: false, method: "FPX", bank: "", name: "Nur Aina Ahmad", email: "aina@example.com", phone: "012-345 6789" };
const storageKey = "aaa-v2-checkout-preview";
const previewOptions = (choice: Choice) => ({ session: choice.session, package: choice.package, workbook: choice.workbook, method: choice.method, bank: choice.bank });
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
  { label: "Maklumat Zoom", number: 28, icon: "video" },
  { label: "Tiket fizikal", number: 29, icon: "ticket" },
  { label: "Bahan & replay", number: 31, icon: "play" },
  { label: "Bayaran", number: 32, icon: "receipt" },
  { label: "Profil", number: 36, icon: "user" },
  { label: "Notifikasi", number: 39, icon: "bell" },
  { label: "Privasi", number: 40, icon: "shield" },
  { label: "Keselamatan", number: 38, icon: "key" },
  { label: "Bantuan", number: 37, icon: "help" },
  { label: "Status pertanyaan", number: 41, icon: "history" },
  { label: "Kelas selesai", number: 42, icon: "book" },
];
const staffNav: SideItem[] = [
  { label: "Ringkasan", number: 43, icon: "grid" },
  { label: "Program", number: 44, icon: "book" },
  { label: "Sesi & kapasiti", number: 48, icon: "calendar" },
  { label: "Peserta & check-in", number: 50, icon: "users" },
  { label: "Akses peserta", number: 52, icon: "key" },
  { label: "Bayaran & refund", number: 54, icon: "receipt" },
  { label: "Sokongan", number: 58, icon: "help" },
  { label: "Peranan & audit", number: 59, icon: "shield" },
];
const memberPrimaryNav = memberNav.filter((item) => [26, 27, 31, 32, 36].includes(item.number));
const staffPrimaryNav = staffNav.filter((item) => [43, 44, 48, 50, 54].includes(item.number));
function primarySection(group: Screen["group"], number: number, surface: "member" | "staff") {
  if (surface === "member") {
    if (group === "state") return ({ 67: 27, 68: 31, 69: 31, 70: 31, 71: 32, 72: 32 } as Record<number, number>)[number];
    return ({ 28: 27, 29: 27, 30: 27, 33: 32, 34: 32, 35: 27, 37: 36, 38: 36, 39: 36, 40: 36, 41: 36, 42: 31 } as Record<number, number>)[number] ?? number;
  }
  if (group === "state") return [73, 74, 75].includes(number) ? 50 : undefined;
  return ({ 45: 44, 46: 44, 47: 44, 49: 48, 51: 50, 52: 50, 53: 50, 55: 54, 56: 48, 57: 50, 58: 50, 59: 43 } as Record<number, number>)[number] ?? number;
}
function human(value: string) {
  return value.replace(/&amp;/g, "&").replace(/\bcontoh\b/gi, "pratonton").replace(/\bdraf\b/gi, "dalam semakan").replace(/\s+/g, " ").trim();
}
function total(c: Choice) { return (c.session === "Fizikal" ? 299 : 199) + (c.package === "Bimbingan" ? 100 : 0) + (c.workbook ? 29 : 0); }

export function FlowScreen({ screen }: { screen: Screen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [choice, setChoice] = useState<Choice>(initialChoice);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("Semua topik");
  const [format, setFormat] = useState("Semua format");
  const [catalogueCourseId, setCatalogueCourseId] = useState("carta");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("course");
    if (screen.group === "public" && Number(screen.number) === 10) setCatalogueCourseId(courseId && previewCourses.some((course) => course.id === courseId) ? courseId : "carta");
    if (screen.group === "public" && Number(screen.number) === 2) {
      const incoming: Partial<Choice> = {};
      if (["Online", "Fizikal"].includes(params.get("session") || "")) incoming.session = params.get("session") as Choice["session"];
      if (["Standard", "Bimbingan"].includes(params.get("package") || "")) incoming.package = params.get("package") as Choice["package"];
      if (["0", "1"].includes(params.get("workbook") || "")) incoming.workbook = params.get("workbook") === "1";
      if (Object.keys(incoming).length) setChoice((current) => {
        const next = { ...current, ...incoming };
        try { localStorage.setItem(storageKey, JSON.stringify(previewOptions(next))); } catch { /* Preview remains usable without storage. */ }
        return next;
      });
    }
  }, [screen.group, screen.number]);
  useEffect(() => {
    if (screen.group !== "public" || Number(screen.number) !== 10) return;
    const syncCourse = () => {
      const courseId = new URLSearchParams(window.location.search).get("course");
      setCatalogueCourseId(courseId && previewCourses.some((course) => course.id === courseId) ? courseId : "carta");
    };
    window.addEventListener("popstate", syncCourse);
    return () => window.removeEventListener("popstate", syncCourse);
  }, [screen.group, screen.number]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<Choice> | null;
      if (saved) {
        const safe: Choice = {
          ...initialChoice,
          session: saved.session === "Fizikal" ? "Fizikal" : "Online",
          package: saved.package === "Bimbingan" ? "Bimbingan" : "Standard",
          workbook: saved.workbook === true,
          method: saved.method === "Kad" ? "Kad" : "FPX",
          bank: fpxPreviewBanks.some((bank) => bank.id === saved.bank) ? saved.bank! : "",
        };
        setChoice(safe);
        localStorage.setItem(storageKey, JSON.stringify(previewOptions(safe)));
      }
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
      try { localStorage.setItem(storageKey, JSON.stringify(previewOptions(next))); } catch { /* Preview remains usable without storage. */ }
      return next;
    });
  }, [screen.group, screen.number]);
  const update = (value: Partial<Choice>) => setChoice((current) => {
    const next = { ...current, ...value };
    try { localStorage.setItem(storageKey, JSON.stringify(previewOptions(next))); } catch { /* Preview remains usable without storage. */ }
    return next;
  });
  const number = Number(screen.number);
  const surface = screen.group === "state"
    ? number >= 73 && number <= 75 ? "staff" : number >= 60 && number <= 66 ? "public" : "member"
    : screen.group;
  const isAccount = surface === "member" || surface === "staff";
  const accountHref = href("member", 26);
  const side = surface === "staff" ? staffPrimaryNav : memberPrimaryNav;
  const showingSide = surface !== "public";
  const activeSideNumber = surface === "member" || surface === "staff" ? primarySection(screen.group, number, surface) : undefined;
  const filteredCourses = useMemo(() => previewCourses.filter((course) =>
    (topic === "Semua topik" || course.topic === topic) &&
    (format === "Semua format" || course.format === format) &&
    `${course.title} ${course.description}`.toLocaleLowerCase("ms").includes(search.toLocaleLowerCase("ms"))
  ), [search, topic, format]);
  const catalogueCourse = previewCourses.find((course) => course.id === catalogueCourseId) ?? previewCourses[1];
  const selectedSession = choice.session === "Fizikal" ? "7 Nov 2026 · Shah Alam" : "17 Okt 2026 · Online langsung";
  const requestNotice = (action?: string) => setNotice(`${action ? `${action}: ` : ""}Sambungan pelayan belum aktif. Tiada perubahan atau bayaran dibuat.`);

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
      if (!target && label === "Tambah ke kalendar") return <Button key={label} variant={i ? "secondary" : "default"} asChild><a href={assetPath("/media/labursaham-online-preview.ics")} download="AAA-LaburSaham-pratonton.ics">Kalendar contoh</a></Button>;
      return target
        ? <Button key={label} variant={i ? "secondary" : "default"} asChild><Link href={target}>{text}</Link></Button>
        : <Button key={label} variant={i ? "secondary" : "default"} onClick={() => requestNotice(text)}>{text}</Button>;
    })}</div>;
  }
  const headingDescription = screen.group === "public" && number === 10 ? catalogueCourse.description
    : screen.group === "public" && [14, 15].includes(number) ? `LaburSaham · ${selectedSession} · pilihan pratonton.`
    : screen.group === "public" && [22, 26].includes(number) ? "Semak kaedah bayaran dalam pratonton. Tiada penyedia bayaran disambungkan."
    : screen.group === "public" && number === 27 ? "Senarai bank contoh untuk semakan antaramuka. Ketersediaan sebenar ditentukan penyedia bayaran."
    : screen.group === "state" && number === 60 ? "Pasukan AAA boleh membantu jika anda kehilangan akses."
    : screen.group === "member" && number === 26 ? "Semak susun atur akaun menggunakan sesi contoh AAA."
    : human(screen.description);
  const heading = <div className="flow-heading"><span className="eyebrow">{screen.group === "public" && number === 10 ? catalogueCourse.topic.toUpperCase() : human(screen.subtitle)}</span><h1>{screen.group === "public" && number === 10 ? catalogueCourse.title : human(screen.title)}</h1>{headingDescription && <p>{headingDescription}</p>}</div>;

  return <div className={`flow-site${showingSide ? " flow-account" : ""}${surface === "staff" ? " flow-staff" : ""}`}>
    <a className="skip-link" href="#flow-main">Langkau ke kandungan</a>
    <header className="site-header"><div className="page-shell header-inner">
      <Button variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label="Menu" aria-expanded={menuOpen} aria-controls="flow-mobile-menu" onClick={() => setMenuOpen((open) => !open)}><Icon name="menu" /></Button>
      <Link href="/" className="brand" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">{navItems.map((item) => <Link key={item.label} href={item.href}>{item.label === "Utama" && <Icon name="home" />}{item.label}</Link>)}</nav>
      <Button variant="outline" size="sm" className="login-button" asChild><Link href={isAccount ? "/" : accountHref} onClick={isAccount ? endDevelopmentSession : undefined}><Icon name={isAccount ? "logout" : "grid"} />{isAccount ? "Tutup pratonton" : "Akaun contoh"}</Link></Button>
      <Link href={isAccount ? "/" : accountHref} onClick={isAccount ? endDevelopmentSession : undefined} className="mobile-account-button header-icon-control" aria-label={isAccount ? "Tutup pratonton" : "Akaun contoh"}><Icon name={isAccount ? "logout" : "grid"} /></Link>
    </div><nav id="flow-mobile-menu" className="mobile-inline-navigation page-shell" aria-label="Navigasi telefon" hidden={!menuOpen}>{navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}<Link href={accountHref} onClick={() => setMenuOpen(false)}>Akaun contoh</Link>{showingSide && <div className="flow-mobile-account-links"><strong>{surface === "staff" ? "OPERASI CONTOH" : "AKAUN CONTOH"}</strong>{side.map((item) => <Link key={item.number} href={href(surface === "staff" ? "staff" : "member", item.number)} aria-current={activeSideNumber === item.number ? "page" : undefined} onClick={() => setMenuOpen(false)}>{item.label}</Link>)}</div>}</nav></header>
    <div className={showingSide ? "page-shell flow-with-sidebar" : "page-shell flow-main-only"}>
      {showingSide && <aside className="flow-sidebar"><nav aria-label={surface === "staff" ? "Operasi staf" : "Akaun"}>{side.map((item, index) => <div className="flow-sidebar-item" key={item.number}>{(index === 0 || index === 1 || index === 4) && <span className="flow-sidebar-group">{index === 0 ? "Utama" : index === 1 ? surface === "staff" ? "Operasi" : "Pembelajaran" : surface === "staff" ? "Perkhidmatan" : "Akaun & bantuan"}</span>}<Link href={href(surface === "staff" ? "staff" : "member", item.number)} aria-current={activeSideNumber === item.number ? "page" : undefined}><Icon name={item.icon} />{item.label}</Link></div>)}<Link href="/" onClick={endDevelopmentSession}><Icon name="logout" />Tutup pratonton</Link></nav></aside>}
      <main id="flow-main" className={`flow-main${showingSide ? " flow-dashboard-main" : ""}`}>{heading}
        {showingSide && <p className="flow-inline-note flow-preview-banner"><strong>Pratonton pembangunan · rekod latihan.</strong> Tiada akaun, tempahan atau bayaran sebenar.</p>}
        {screen.group === "public" && number <= 12 && <PublicContent screen={screen} number={number} filteredCourses={filteredCourses} search={search} setSearch={setSearch} topic={topic} setTopic={setTopic} format={format} setFormat={setFormat} catalogueCourse={catalogueCourse} setCatalogueCourseId={setCatalogueCourseId} choice={choice} update={update} actions={actions} />}
        {screen.group === "public" && number === 13 && <div className="flow-card flow-center"><p>Lihat susun atur akaun dengan rekod latihan. Log masuk sebenar memerlukan sambungan identiti.</p><Button asChild><Link href={href("member", 26)}>Lihat akaun contoh</Link></Button></div>}
        {screen.group === "public" && number >= 14 && number <= 18 && <><StepRail step={number < 16 ? 2 : 3} /><div className="flow-choice-grid">{number < 16 ? <><ChoiceCard active={choice.package === "Standard"} label="Standard" description="Sesi bersama AAA, nota PDF dan maklumat penyertaan." price={choice.session === "Fizikal" ? 299 : 199} onClick={() => update({ package: "Standard" })} /><ChoiceCard active={choice.package === "Bimbingan"} label="Bimbingan" description="Semua dalam Standard, dengan sesi soal jawab tambahan." price={(choice.session === "Fizikal" ? 299 : 199) + 100} onClick={() => update({ package: "Bimbingan" })} /></> : <><ChoiceCard active={choice.workbook} label="Workbook latihan" description="Latihan digital untuk mengukuhkan pembelajaran." price={29} onClick={() => update({ workbook: !choice.workbook })} /><div className="flow-card"><h2>Tambahan mengikut pilihan</h2><p>Workbook bermula tanpa dipilih. Pakej Bimbingan menggantikan Standard dan tidak dicaj dua kali.</p></div></>}</div><Summary choice={choice} /><div className="flow-actions"><Button asChild><Link href={href("public", number < 16 ? choice.package === "Bimbingan" ? 18 : 16 : choice.package === "Bimbingan" ? 21 : choice.workbook ? 20 : 19)}>{number < 16 ? "Teruskan ke tambahan" : "Semak tempahan"}</Link></Button><Button variant="secondary" asChild><Link href={href("public", number < 16 ? 2 : choice.package === "Bimbingan" ? 15 : 14)}>Kembali</Link></Button></div></>}
        {screen.group === "public" && number >= 19 && number <= 21 && <><StepRail step={4} /><div className="flow-columns"><div className="flow-card"><h2>Maklumat peserta</h2><Field label="Nama penuh" value={choice.name} onChange={(v) => update({ name: v })} /><Field label="E-mel" value={choice.email} onChange={(v) => update({ email: v })} /><Field label="Telefon" value={choice.phone} onChange={(v) => update({ phone: v })} /></div><Summary choice={choice} /></div><div className="flow-actions"><Button asChild><Link href={href("public", 22)}>Teruskan ke bayaran</Link></Button><Button variant="secondary" asChild><Link href={href("public", choice.workbook ? 17 : 16)}>Ubah tempahan</Link></Button></div></>}
        {screen.group === "public" && number >= 22 && number <= 28 && <PaymentContent number={number} choice={choice} update={update} actions={actions} notice={requestNotice} />}
        {screen.group !== "public" && <AccountContent screen={screen} actions={actions} />}
        {notice && <p className="flow-notice" role="status">{notice}</p>}
      </main>
    </div>
    <SiteFooter />
    <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Navigasi bawah"><Link className="app-dock-item" href="/" aria-label="Utama"><NavigationIcon name="home" /><span>Utama</span></Link><Link className="app-dock-item" href={href("public", 3)} aria-label="Kelas"><NavigationIcon name="book-open" /><span>Kelas</span></Link><Link className="app-dock-item" href={href("public", 2)} aria-label="LaburSaham"><NavigationIcon name="graduation-cap" /><span>LaburSaham</span></Link><Link className="app-dock-item" href={accountHref} aria-label="Akaun contoh"><NavigationIcon name="grid" /><span>Akaun contoh</span></Link></nav>
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

function MemberMore({ number }: { number: number }) {
  const groups: Record<number, { title: string; items: { label: string; number: number; icon: IconName }[] }> = {
    27: { title: "Butiran tempahan", items: [{ label: "Maklumat Zoom", number: 28, icon: "video" }, { label: "Tiket fizikal", number: 29, icon: "ticket" }, { label: "Tukar sesi", number: 35, icon: "calendar" }] },
    31: { title: "Pembelajaran", items: [{ label: "Kelas selesai", number: 42, icon: "book" }, { label: "Tempahan saya", number: 27, icon: "calendar" }] },
    32: { title: "Urus bayaran", items: [{ label: "Resit tempahan", number: 33, icon: "receipt" }, { label: "Mohon refund", number: 34, icon: "history" }] },
    36: { title: "Akaun & tetapan", items: [{ label: "Notifikasi", number: 39, icon: "bell" }, { label: "Privasi", number: 40, icon: "shield" }, { label: "Keselamatan", number: 38, icon: "key" }, { label: "Bantuan", number: 37, icon: "help" }] },
    37: { title: "Sokongan", items: [{ label: "Status pertanyaan", number: 41, icon: "history" }, { label: "Profil saya", number: 36, icon: "user" }] },
  };
  const group = groups[number];
  if (!group) return null;
  return <section className="flow-context-links" aria-label={group.title}><h2>{group.title}</h2><div>{group.items.map((item) => <Link href={href("member", item.number)} key={item.number}><Icon name={item.icon} />{item.label}<span aria-hidden="true">→</span></Link>)}</div></section>;
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

function RelatedCourses({ current, onSelect, title = "Teroka kelas lain.", description = "Pilihan kelas contoh untuk dibandingkan mengikut topik dan format." }: { current: (typeof previewCourses)[number]; onSelect?: (id: string) => void; title?: string; description?: string }) {
  const related = previewCourses
    .filter((course) => course.id !== current.id)
    .sort((a, b) => Number(b.topic === current.topic) - Number(a.topic === current.topic))
    .slice(0, 2);
  return <section className="flow-related-courses" aria-labelledby="related-courses-title">
    <div><span className="eyebrow">KELAS AAA</span><h2 id="related-courses-title">{title}</h2><p>{description}</p></div>
    <div className="flow-related-course-list">{related.map((course) => <Link className="flow-related-course" href={`${href("public", 10)}?course=${course.id}`} onClick={() => onSelect?.(course.id)} key={course.id}>
      <CourseCover course={course} sizes="(max-width: 700px) 82vw, 150px" /><span><small>{course.topic} · {course.format}</small><strong>{course.title}</strong><span>{course.date} · {money(course.price)}</span></span><span aria-hidden="true">→</span>
    </Link>)}</div>
  </section>;
}

function PublicContent({ screen, number, filteredCourses, search, setSearch, topic, setTopic, format, setFormat, catalogueCourse, setCatalogueCourseId, choice, update, actions }: {
  screen: Screen; number: number; filteredCourses: typeof previewCourses; search: string; setSearch: (value: string) => void; topic: string; setTopic: (value: string) => void; format: string; setFormat: (value: string) => void; catalogueCourse: (typeof previewCourses)[number]; setCatalogueCourseId: (id: string) => void; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode;
}) {
  if (number === 3 || number === 11) return <><div className="flow-catalog-tools"><label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari kelas" placeholder="Cari kelas" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label className="format-select">Format <select value={format} onChange={(event) => setFormat(event.target.value)}>{formats.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><Button variant="secondary" onClick={() => { setSearch(""); setTopic("Semua topik"); setFormat("Semua format"); }}><Icon name="reset" />Set semula</Button></div><div className="flow-topics">{["Semua topik", "Asas saham", "Analisis teknikal", "Portfolio"].map((name) => <Button key={name} variant={topic === name ? "default" : "secondary"} onClick={() => setTopic(name)}>{name}</Button>)}</div><p className="flow-count">{filteredCourses.length} kelas</p><div className="flow-course-grid">{filteredCourses.map((course) => <Link href={`${href("public", 10)}?course=${course.id}`} className="flow-course" key={course.id}><CourseCover course={course} /><div><h2>{course.title}</h2><p>{course.location} · {course.duration}</p><strong>{money(course.price)}</strong></div></Link>)}</div>{!filteredCourses.length && <div className="flow-card"><h2>Tiada kelas ditemui.</h2><p>Cuba carian atau format lain.</p></div>}{actions()}</>;
  if (number === 10) return <><div className="flow-feature"><div className="flow-feature-copy"><span className="eyebrow">{catalogueCourse.topic.toUpperCase()} · AAA</span><h2>{catalogueCourse.shortTitle}</h2><p>{catalogueCourse.outcomes[0]}</p><div className="flow-feature-facts"><span>{catalogueCourse.format}</span><span>{catalogueCourse.duration}</span><span>{catalogueCourse.level}</span></div></div><div className="flow-feature-image"><Image src={assetPath(`/images/course-${catalogueCourse.id}-crisp.webp`)} alt={`Ilustrasi ${catalogueCourse.title}`} fill sizes="(max-width: 700px) 100vw, 45vw" /></div></div><div className="flow-choice-grid"><div className="flow-card"><h2>Butiran kelas</h2><dl className="flow-facts"><div><dt>Tarikh</dt><dd>{catalogueCourse.date}</dd></div><div><dt>Tempat</dt><dd>{catalogueCourse.location}</dd></div><div><dt>Harga contoh</dt><dd>{money(catalogueCourse.price)}</dd></div></dl></div><div className="flow-card"><h2>Apa yang anda akan pelajari</h2><ul className="flow-outcomes">{catalogueCourse.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div></div><p className="flow-inline-note">Ini kelas dan harga contoh untuk semakan reka bentuk. Pendaftaran kelas ini belum dibuka.</p><RelatedCourses current={catalogueCourse} onSelect={setCatalogueCourseId} /><div className="flow-actions"><Button asChild><Link href={href("public", 3)}>Lihat kelas lain</Link></Button><Button variant="secondary" asChild><Link href={href("public", 6)}>Tanya AAA</Link></Button></div></>;
  if (number === 2 || number === 12) return <><div className="flow-feature"><div className="flow-feature-copy"><span className="eyebrow">KELAS LABURSAHAM</span><h2>Fahami dahulu.<br />Praktik bersama.</h2><p>Pilih sesi yang sesuai dan semak pakej sebelum mendaftar.</p><div className="flow-feature-facts">{["Asas pasaran", "Urus risiko", "Latihan dan soalan"].map((fact) => <span key={fact}>{fact}</span>)}</div></div><div className="flow-feature-image"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku dan nota pembelajaran" fill sizes="(max-width: 700px) 100vw, 45vw" /></div></div><div className="flow-choice-grid"><ChoiceCard active={choice.session === "Online"} label="Online langsung" description="Belajar dari tempat anda. 17 Okt 2026." price={199} onClick={() => update({ session: "Online" })} /><ChoiceCard active={choice.session === "Fizikal"} label="Fizikal" description="Belajar bersemuka. 7 Nov 2026, Shah Alam." price={299} onClick={() => update({ session: "Fizikal" })} /></div><FlowBlocks slug={screen.slug} /><div className="flow-actions"><Button asChild><Link href={href("public", choice.package === "Bimbingan" ? 15 : 14)}>Pilih pakej →</Link></Button><Button variant="secondary" asChild><Link href={href("public", 7)}>Baca polisi</Link></Button></div></>;
  const cards = screen.cards.filter((card) => !["Utama", "LaburSaham", "Kelas AAA", "Tentang AAA", "Bantuan"].includes(card) && card !== screen.title).slice(0, 4);
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{cards.map((card, index) => <article className="flow-card" key={card}><span className="flow-card-index">{String(index + 1).padStart(2, "0")}</span><h2>{human(card)}</h2>{index === 0 && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}</>;
}

function PaymentContent({ number, choice, update, actions, notice }: { number: number; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode; notice: (action?: string) => void }) {
  const [bankSearch, setBankSearch] = useState("");
  const query = bankSearch.trim().toLocaleLowerCase("ms");
  const banks = fpxPreviewBanks.filter((bank) => bank.label.toLocaleLowerCase("ms").includes(query));
  if ([23, 24, 25].includes(number)) return <><div className="flow-card"><h2>Tempahan contoh AAA-ONL-001</h2><p>Keadaan ini untuk semakan aliran. Tiada transaksi dibuat melalui laman ini.</p><Summary choice={choice} /></div>{actions()}</>;
  return <>
    <div className="flow-payment-grid">
      <div>
        <div className="flow-card"><h2>Pilihan sebelum bayaran</h2><dl className="flow-facts"><div><dt>LaburSaham · {choice.package}</dt><dd>{money(total(choice))}</dd></div><div><dt>Peserta contoh</dt><dd>{choice.name}</dd></div></dl></div>
        <div className="flow-card flow-amount"><h2>Jumlah contoh</h2><strong>{money(total(choice))}</strong></div>
      </div>
      <div className="flow-card">
        <h2 className="flow-payment-title"><Icon name={number === 27 ? "search" : "payment"} />{number === 27 ? "Pilih bank FPX" : number === 28 ? "Butiran kad" : "Kaedah bayaran"}</h2>
        {number === 22 || number === 26 ? <div className="flow-payment-options">
          <ChoiceCard active={choice.method === "FPX"} label="FPX / perbankan internet" description="Pilih bank dalam pratonton. Ketersediaan sebenar ditentukan penyedia bayaran." price={total(choice)} onClick={() => update({ method: "FPX" })} />
          <ChoiceCard active={choice.method === "Kad"} label="Kad debit / kredit" description="Butiran kad hanya boleh diisi pada penyedia bayaran apabila disambung." price={total(choice)} onClick={() => update({ method: "Kad" })} />
        </div> : number === 27 ? <>
          <label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari bank" placeholder="Cari atau pilih bank" value={bankSearch} onChange={(event) => setBankSearch(event.target.value)} /></label>
          <p className="flow-bank-hint">{banks.length} bank contoh · Senarai sebenar dan status bank akan datang daripada penyedia bayaran.</p>
          <div className="flow-bank-list" role="radiogroup" aria-label="Bank FPX contoh">{banks.length ? banks.map((bank) => <label className={choice.bank === bank.id ? "is-active" : ""} key={bank.id}><input type="radio" name="fpx-bank" value={bank.id} checked={choice.bank === bank.id} onChange={() => update({ bank: bank.id })} /><span>{bank.label}</span><span aria-hidden="true">{choice.bank === bank.id ? "◉" : "○"}</span></label>) : <p>Tiada bank sepadan. Cuba carian lain.</p>}</div>
        </> : <>
          <div className="flow-card-placeholder"><strong>Kad debit / kredit</strong><span>Visa · Mastercard</span></div>
          <div className="flow-disabled-fields"><label>Nama pada kad<input disabled placeholder="Diisi pada halaman penyedia bayaran" /></label><label>Nombor kad<input disabled placeholder="Diisi pada halaman penyedia bayaran" /></label><div><label>Tarikh luput<input disabled placeholder="MM / YY" /></label><label>Kod keselamatan<input disabled placeholder="CVC" /></label></div></div>
        </>}
      </div>
    </div>
    <div className="flow-payment-note"><strong>Pembayaran belum diaktifkan.</strong><p>Maklumat kad dan perbankan tidak diminta atau disimpan di laman ini.</p></div>
    <div className="flow-actions">{number === 22 || number === 26 ? <Button asChild><Link href={href("public", choice.method === "FPX" ? 27 : 28)}><Icon name="payment" />Teruskan dengan {choice.method}</Link></Button> : <Button disabled={number === 27 && !choice.bank} onClick={() => notice(number === 27 ? "FPX" : "Bayaran kad")}><Icon name="payment" />{number === 27 ? "Teruskan ke bank" : `Bayar ${money(total(choice))}`}</Button>}<Button variant="secondary" asChild><Link href={href("public", number === 22 ? choice.package === "Bimbingan" ? 21 : choice.workbook ? 20 : 19 : 22)}>Kembali ke semakan</Link></Button></div>
  </>;
}

function AccountContent({ screen, actions }: { screen: Screen; actions: (labels?: string[]) => React.ReactNode }) {
  const number = Number(screen.number);
  const cards = (contentMap.find((item) => item.slug === screen.slug)?.content || screen.cards).filter((card) => ![...memberNav, ...staffNav].some((item) => item.label === card) && card !== screen.title && !/^(AAA|Details|Current step)/.test(card)).slice(0, 4);
  if (screen.group === "state" && number === 60) return <><div className="flow-card"><h2>Akses akaun</h2><p>Masuk terus ke paparan akaun pembangunan. Tempahan dan profil yang ditunjukkan ialah rekod latihan.</p></div>{actions()}</>;
  if (screen.group === "member" && number === 26) return <>
    <section className="flow-dashboard-feature" aria-label="Sesi seterusnya dalam rekod latihan">
      <div className="flow-dashboard-image"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku dan nota pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 30vw" /><span className="flow-dashboard-date"><strong>17</strong><small>OKT</small></span></div>
      <div className="flow-dashboard-copy">
        <span className="flow-card-index">SESI SETERUSNYA · REKOD LATIHAN</span>
        <h2>LaburSaham <span>Online langsung</span></h2>
        <p>17 Okt 2026 · 9 pagi – 12 tengah hari MYT</p>
        <div className="flow-dashboard-meta"><span>Pakej <strong>Standard</strong></span><span>Rujukan <strong>AAA-ONL-001</strong></span></div>
        <div className="flow-actions"><Button size="sm" asChild><Link href={href("member", 28)}><Icon name="video" />Maklumat Zoom</Link></Button><Button size="sm" variant="secondary" asChild><a href={assetPath("/media/labursaham-online-preview.ics")} download="AAA-LaburSaham-pratonton.ics"><Icon name="plus" />Kalendar contoh</a></Button></div>
      </div>
    </section>
    <section className="flow-dashboard-links flow-member-actions" aria-labelledby="member-actions-title"><header><span className="eyebrow">AKAUN CONTOH</span><h2 id="member-actions-title">Urus penyertaan</h2><p>Pilih maklumat yang mahu disemak.</p></header><div>
      {([
        { title: "Tempahan saya", detail: "Sesi akan datang dan lepas", n: 27, icon: "calendar" },
        { title: "Tiket fizikal", detail: "Akses tiket selepas pengesahan", n: 29, icon: "ticket" },
        { title: "Bahan & replay", detail: "Mengikut pakej dan tempoh akses", n: 31, icon: "play" },
        { title: "Bayaran & resit", detail: "Status dan butiran transaksi", n: 32, icon: "receipt" },
        { title: "Notifikasi", detail: "Peringatan dan pilihan mesej", n: 39, icon: "bell" },
        { title: "Bantuan", detail: "Pertanyaan dan status sokongan", n: 37, icon: "help" },
      ] as const).map((item, index) => <Link className="flow-dashboard-link" href={href("member", item.n)} key={item.n}><span className="flow-dashboard-link-icon"><Icon name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span aria-hidden="true">→</span>{index === 0 && <span className="flow-dashboard-link-art"><Image src={assetPath("/images/course-portfolio-crisp.webp")} alt="Nota dan suasana pembelajaran" fill sizes="(max-width: 700px) 100vw, 30vw" /></span>}</Link>)}
    </div></section>
    <Link className="flow-staff-preview-link" href={href("staff", 43)}>Lihat pratonton operasi staf →</Link>
  </>;
  if (screen.group === "member" && number === 28) return <>
    <section className="flow-zoom-feature" aria-label="Maklumat sesi Zoom contoh">
      <div className="flow-zoom-copy"><span className="eyebrow">LABURSAHAM ONLINE · REKOD LATIHAN</span><h2>Pautan dibuka sebelum kelas.</h2><p>Maklumat menyertai sesi tersedia untuk peserta yang mempunyai tempahan disahkan, mulai 8:45 pagi pada hari kelas.</p>
        <div className="flow-zoom-time"><span><small>17 OKTOBER 2026</small><strong>9 pagi – 12 tengah hari</strong></span><span><small>WAKTU</small><strong>Malaysia (MYT)</strong></span></div>
        <div className="flow-actions"><Button asChild><a href={assetPath("/media/labursaham-online-preview.ics")} download="AAA-LaburSaham-pratonton.ics"><Icon name="calendar" />Kalendar contoh</a></Button><Button variant="secondary" asChild><Link href={href("member", 31)}><Icon name="book" />Lihat bahan kelas</Link></Button></div>
      </div>
      <div className="flow-zoom-image"><Image src={assetPath("/images/course-carta-crisp.webp")} alt="Komputer dan nota pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 35vw" /></div>
    </section>
    <section className="flow-zoom-steps" aria-label="Persediaan sesi"><div><span className="flow-zoom-step-icon"><Icon name="settings" /></span><h2>Sebelum kelas</h2><p>Semak audio, sambungan internet dan aplikasi Zoom. Gunakan maklumat kelas yang disahkan dalam akaun anda.</p></div><div><span className="flow-zoom-step-icon"><Icon name="play" /></span><h2>Selepas kelas</h2><p>Replay dan nota dipaparkan mengikut pakej serta tempoh akses yang telah disahkan.</p></div></section>
    <Link className="flow-staff-preview-link" href={href("member", 27)}>Kembali ke tempahan saya →</Link>
  </>;
  if (screen.group === "member" && number === 27) return <>
    <section className="flow-bookings" aria-labelledby="flow-bookings-title"><header><span className="eyebrow">2 SESI AKAN DATANG</span><h2 id="flow-bookings-title">Pilih sesi untuk lihat butiran.</h2></header><div>
      {([
        { day: "17", month: "OKT", format: "ONLINE LANGSUNG", title: "LaburSaham", detail: "9 pagi – 12 tengah hari · Standard", reference: "AAA-ONL-001", n: 28, image: "course-asas-crisp.webp", alt: "Nota pembelajaran saham" },
        { day: "07", month: "NOV", format: "FIZIKAL · SHAH ALAM", title: "Bengkel asas saham", detail: "9 pagi – 5 petang · 1 peserta", reference: "AAA-PHY-002", n: 29, image: "course-bengkel-crisp.webp", alt: "Suasana pembelajaran bersemuka" },
      ] as const).map((booking) => <Link className="flow-booking-item" href={href("member", booking.n)} key={booking.reference}>
        <span className="flow-booking-date"><strong>{booking.day}</strong><small>{booking.month}</small></span>
        <span className="flow-booking-copy"><small>{booking.format} · REKOD LATIHAN</small><strong>{booking.title}</strong><span>{booking.detail}</span><span>{booking.reference} · Disahkan</span></span>
        <span className="flow-booking-art"><Image src={assetPath(`/images/${booking.image}`)} alt={booking.alt} fill sizes="(max-width: 700px) 100vw, 180px" /></span><span className="flow-booking-arrow" aria-hidden="true">→</span>
      </Link>)}
    </div></section>
    <div className="flow-actions"><Button variant="secondary" asChild><Link href={href("member", 35)}>Tukar sesi</Link></Button><Button variant="secondary" asChild><Link href={href("member", 42)}>Lihat kelas selesai</Link></Button></div>
  </>;
  if (screen.group === "member" && number === 32) return <>
    <section className="flow-ledger" aria-labelledby="flow-ledger-title"><header><div><span className="eyebrow">BAYARAN DISAHKAN · REKOD LATIHAN</span><h2 id="flow-ledger-title">Sejarah transaksi</h2><p>Semak satu rujukan sebelum memuat turun resit atau meminta bantuan.</p></div><div className="flow-ledger-total"><small>2 TRANSAKSI</small><strong>RM498</strong></div></header><div className="flow-ledger-list">
      <Link href={href("member", 33)}><span className="flow-ledger-status">DIBAYAR</span><span><strong>LaburSaham online</strong><small>AAA-ONL-001 · FPX</small></span><b>RM199</b><span aria-hidden="true">→</span></Link>
      <div><span className="flow-ledger-status">DIBAYAR</span><span><strong>Bengkel asas saham</strong><small>AAA-PHY-002 · Kad · Contoh status</small></span><b>RM299</b><span aria-hidden="true">·</span></div>
      <Link href={href("state", 76)}><span className="flow-ledger-status is-pending">SEMAKAN</span><span><strong>Pengesahan bank belum diterima</strong><small>AAA-ONL-003 · Semak status sebelum mencuba lagi</small></span><b>RM199</b><span aria-hidden="true">→</span></Link>
    </div></section>
    <div className="flow-actions"><Button asChild><Link href={href("member", 33)}>Lihat resit AAA-ONL-001</Link></Button><Button variant="secondary" asChild><Link href={href("member", 34)}>Mohon refund</Link></Button></div>
  </>;
  if (screen.group === "member" && number === 42) return <>
    <FlowBlocks slug={screen.slug} />
    <RelatedCourses current={previewCourses[0]} title="Sambung pembelajaran." description="Selepas kelas asas, lihat bengkel setara atau kelas carta peringkat pertengahan. Semua kelas dan rekod di sini ialah contoh." />
    <Link className="flow-staff-preview-link" href={href("member", 31)}>Semak bahan & replay →</Link>
  </>;
  if (screen.group === "staff" && number === 43) return <>
    <section className="flow-staff-overview" aria-labelledby="staff-overview-title"><div className="flow-staff-intro"><span className="eyebrow">OPERASI AAA · REKOD LATIHAN</span><h2 id="staff-overview-title">Hari ini dalam operasi.</h2><p>Semak sesi, peserta dan kes yang perlu tindakan.</p></div><div className="flow-dashboard-metrics">
      {([
        { label: "SESI", value: "2 akan datang", detail: "Online 17 Okt · Fizikal 7 Nov", n: 48 },
        { label: "BAYARAN", value: "1 untuk semakan", detail: "AAA-ONL-003 · RM199", n: 54 },
        { label: "SOKONGAN", value: "1 kes terbuka", detail: "SUP-001 · Refund Standard", n: 58 },
      ] as const).map((item) => <Link href={href("staff", item.n)} key={item.n}><span className="flow-card-index">{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small><span aria-hidden="true">→</span></Link>)}
    </div><Link className="flow-capacity" href={href("staff", 48)}><div><span className="flow-card-index">KAPASITI SESI FIZIKAL · REKOD LATIHAN</span><strong>58 daripada 80 tempat diisi</strong><small>Bengkel asas saham · 7 Nov 2026</small></div><span className="flow-capacity-graph" role="img" aria-label="58 daripada 80 tempat diisi, 73 peratus"><span>73%</span></span></Link></section>
    <section className="flow-dashboard-links" aria-labelledby="staff-actions-title"><header><span className="eyebrow">ALIRAN KERJA</span><h2 id="staff-actions-title">Tindakan operasi</h2><p>Aliran ini belum menyimpan data.</p></header><div>
      {([
        { title: "Program & pakej", detail: "Semak tawaran sebelum diterbitkan", n: 44, icon: "book" },
        { title: "Sesi & kapasiti", detail: "Tarikh, venue dan tempat", n: 48, icon: "calendar" },
        { title: "Peserta & check-in", detail: "Senarai dan pengesahan kehadiran", n: 50, icon: "users" },
        { title: "Akses peserta", detail: "Tiket dan maklumat Zoom", n: 52, icon: "key" },
        { title: "Bayaran & refund", detail: "Pengecualian dan penyelarasan", n: 54, icon: "receipt" },
        { title: "Peranan & audit", detail: "Skop akses dan sejarah perubahan", n: 59, icon: "shield" },
      ] as const).map((item) => <Link className="flow-dashboard-link" href={href("staff", item.n)} key={item.n}><span className="flow-dashboard-link-icon"><Icon name={item.icon} /></span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span aria-hidden="true">→</span></Link>)}
    </div></section>{actions()}
  </>;
  if (screen.group === "state" && number === 68) return <><article className="flow-card flow-replay"><h2>Rakaman sesi · Video demonstrasi</h2><p>Video ini menguji paparan dan kawalan pemain. Ia bukan rakaman kelas sebenar.</p><video controls playsInline preload="metadata" poster={assetPath("/media/labursaham-demo-poster.webp")} aria-label="Video demonstrasi LaburSaham"><source src={assetPath("/media/labursaham-demo.webm")} type="video/webm" />Pelayar ini tidak menyokong video WebM.</video></article><FlowBlocks slug={screen.slug} />{actions()}</>;
  if (screen.group === "staff" && number === 43) return <><div className="flow-generic-grid">{[{ title: "SESI", value: "2 sesi akan datang", detail: "Online 17 Okt · Fizikal 7 Nov", n: 48 }, { title: "BAYARAN", value: "1 bayaran disemak", detail: "AAA-ONL-003 · RM199", n: 54 }, { title: "SOKONGAN", value: "1 kes terbuka", detail: "SUP-001 · Refund Standard", n: 58 }].map((item) => <Link className="flow-card flow-link-card" href={href("staff", item.n)} key={item.n}><span className="flow-card-index">{item.title}</span><h2>{item.value}</h2><p>{item.detail}</p></Link>)}</div><div className="flow-card"><h2>Tindakan seterusnya</h2><p>Sahkan persediaan sesi online dan semak permohonan refund yang terbuka.</p></div>{actions()}</>;
  if (screen.group === "member" && [34, 35, 36, 37, 39].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={initialChoice.name} fallback={number === 39 ? ["E-mel", "Peringatan kelas", "Maklumat program"] : ["Tempahan", "Sebab", "Penjelasan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}<MemberMore number={number} /></>;
  if (screen.group === "staff" && [45, 49, 51, 53, 55, 56, 59].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={initialChoice.name} fallback={number === 59 ? ["Peranan", "Pengguna", "Catatan"] : ["Peserta", "Sebab", "Catatan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}</>;
  const related = screen.group === "staff" ? staffNav : memberNav;
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks && !(screen.group === "state" && number === 60) ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{(cards.length ? cards : [screen.label]).map((card, index) => <article className="flow-card" key={index}><span className="flow-card-index">{String(index + 1).padStart(2, "0")}</span><h2>{human(card)}</h2>{index === 0 && screen.description && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}{screen.group === "member" && <MemberMore number={number} />}{screen.group === "state" && <p className="flow-inline-note">Status ini untuk semakan antaramuka. Tiada akaun atau transaksi diubah.</p>}{screen.group === "staff" && <div className="flow-related"><h2>Operasi lain</h2>{related.slice(0, 4).map((item) => <Link href={href("staff", item.number)} key={item.number}>{item.label} →</Link>)}</div>}</>;
}
