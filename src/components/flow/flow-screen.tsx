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
import { SiteFooter } from "@/components/site-footer";
import { endDevelopmentSession, startDevelopmentSession } from "@/lib/development-session";
import { AccountDock, previewAccountDock } from "@/components/account/account-dock";
import { useAccountSession } from "@/lib/use-account-session";
import { Button } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";
import { Input } from "@/components/ui/input";
import { CourseCover } from "@/components/home/course-card";
import { fpxPreviewBanks } from "@/lib/fpx-preview-banks";
import { laburSahamPackage, laburSahamPackages, type LaburSahamPackage } from "@/lib/labursaham-offer";
import { CheckoutFooter, CheckoutHeader, CheckoutNotice, CheckoutSummaryCard, ChoiceCard, PackageBannerCard, StepRail } from "@/components/flow/checkout-ui";
import { BookingCard, previewBookings, MaterialsIntroBanner, MaterialCard, materialItems, MemberActionCard, memberActions, MemberContextLinks } from "@/components/flow/member-cards";
import { MemberDashboardFeature, StaffDashboardActions, StaffDashboardOverview } from "@/components/flow/dashboard-cards";
import { ClassSalesPage } from "@/components/flow/class-sales";
import { MemberProfileCard } from "@/components/flow/member-profile-card";

type Screen = (typeof screens)[number];
type PreviewDate = "" | "2026-10-24" | "2026-11-07";
const previewDateLabel: Record<Exclude<PreviewDate, "">, string> = { "2026-10-24": "24 Okt 2026", "2026-11-07": "7 Nov 2026" };
type Choice = { session: "Online" | "Fizikal"; package: LaburSahamPackage; previewDate: PreviewDate; workbook: boolean; method: "FPX" | "Kad"; bank: string; name: string; email: string; phone: string };
const initialChoice: Choice = { session: "Online", package: "Online", previewDate: "", workbook: false, method: "FPX", bank: "", name: "Nur Aina Ahmad", email: "aina@example.com", phone: "012-345 6789" };
let participantDraft = { name: initialChoice.name, email: initialChoice.email, phone: initialChoice.phone };
const storageKey = "aaa-v2-checkout-preview";
const previewOptions = (choice: Choice) => ({ session: choice.session, package: choice.package, previewDate: choice.previewDate, workbook: choice.workbook, method: choice.method, bank: choice.bank });
const byNumber = (group: Screen["group"], number: number) => screens.find((s) => s.group === group && Number(s.number) === number);
const href = (group: Screen["group"], number: number) => `/flow/${byNumber(group, number)?.slug ?? screens[0].slug}`;
const memberPaymentRows = [
  { status: "DIBAYAR", title: "LaburSaham online", detail: "AAA-ONL-001 · FPX", amount: 49, href: href("member", 33) },
  { status: "DIBAYAR", title: "Bengkel asas saham", detail: "AAA-PHY-002 · Kad · Contoh status", amount: 129, href: undefined },
  { status: "SEMAKAN", title: "Pengesahan bank belum diterima", detail: "AAA-ONL-003 · Semak status sebelum mencuba lagi", amount: 49, href: href("state", 76) },
] as const;
const confirmedMemberPayments = memberPaymentRows.filter((row) => row.status === "DIBAYAR");
const navItems = [
  { label: "Home", href: "/", icon: "home" },
  { label: "LaburSaham", href: href("public", 2), icon: "chart" },
  { label: "Courses", href: href("public", 3), icon: "graduation" },
  { label: "About", href: href("public", 5), icon: "academy" },
  { label: "Help", href: href("public", 6), icon: "help" },
] as const;
type SideItem = { label: string; number: number; icon: IconName; group?: Screen["group"] };
const memberNav: SideItem[] = [
  { label: "Dashboard", number: 26, icon: "grid" },
  { label: "Tempahan saya", number: 27, icon: "calendar" },
  { label: "Maklumat Zoom", number: 28, icon: "video" },
  { label: "Tiket fizikal", number: 29, icon: "ticket" },
  { label: "Bahan", number: 31, icon: "book" },
  { label: "Replay", number: 68, icon: "play", group: "state" },
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
const memberMenuLabels: Record<number, string> = {
  26: "Dashboard", 27: "My Bookings", 28: "Zoom Details", 29: "Physical Ticket",
  31: "Materials", 68: "Replays", 32: "Payments", 36: "Profile", 37: "Help",
  38: "Security", 39: "Notifications", 40: "Privacy", 41: "Request Status",
  42: "Completed Classes",
};
const staffMenuLabels: Record<number, string> = {
  43: "Overview", 44: "Programs", 48: "Sessions & Capacity", 50: "Participants & Check-In",
  52: "Participant Access", 54: "Payments & Refunds", 58: "Support", 59: "Roles & Audit",
};
const memberPrimaryNav = memberNav.filter((item) => [26, 27, 31, 68, 32, 36].includes(item.number));
const staffPrimaryNav = staffNav.filter((item) => [43, 44, 48, 50, 54].includes(item.number));
function primarySection(group: Screen["group"], number: number, surface: "member" | "staff") {
  if (surface === "member") {
    if (group === "state") return ({ 67: 27, 68: 68, 69: 68, 70: 31, 71: 32, 72: 32 } as Record<number, number>)[number];
    return ({ 28: 27, 29: 27, 30: 27, 33: 32, 34: 32, 35: 27, 37: 36, 38: 36, 39: 36, 40: 36, 41: 36, 42: 31 } as Record<number, number>)[number] ?? number;
  }
  if (group === "state") return [73, 74, 75].includes(number) ? 50 : undefined;
  return ({ 45: 44, 46: 44, 47: 44, 49: 48, 51: 50, 52: 50, 53: 50, 55: 54, 56: 48, 57: 50, 58: 50, 59: 43 } as Record<number, number>)[number] ?? number;
}
function human(value: string) {
  const preserveCase = (match: string, replacement: string) => match === match.toUpperCase()
    ? replacement.toUpperCase()
    : match[0] === match[0].toUpperCase()
      ? replacement[0].toUpperCase() + replacement.slice(1)
      : replacement;
  return value.replace(/&amp;/g, "&")
    .replace(/\bcontoh\b/gi, (match) => preserveCase(match, "pratonton"))
    .replace(/\bdraf\b/gi, (match) => preserveCase(match, "dalam semakan"))
    .replace(/\s+/g, " ").trim();
}
function accountActionIcon(label: string): IconName {
  if (/polisi|terma/i.test(label)) return "shield";
  if (/teruskan|daftar/i.test(label)) return "payment";
  if (/video|replay|zoom/i.test(label)) return "video";
  if (/nota|bahan|kelas selesai|workbook|pdf|program|pakej/i.test(label)) return "book";
  if (/sesi|kalendar|tempahan|kehadiran|check-in/i.test(label)) return "calendar";
  if (/refund/i.test(label)) return "refund";
  if (/resit|bayaran|transaksi/i.test(label)) return "receipt";
  if (/bantuan|pertanyaan|kes|hubungi/i.test(label)) return "help";
  if (/profil|akaun|peranan|peserta|pemilik/i.test(label)) return "user";
  if (/kembali/i.test(label)) return "arrowLeft";
  if (/batal|semula/i.test(label)) return "reset";
  if (/semak|status|rekod|sejarah/i.test(label)) return "search";
  return "plus";
}
function total(c: Choice) { return laburSahamPackage(c.package).price; }
const participantRoute = (c: Choice) => c.package === "Fizikal" ? 21 : c.package === "Online+" ? 20 : 19;

export function FlowScreen({ screen, courseId = "carta" }: { screen: Screen; courseId?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const accountActive = useAccountSession(true);
  useEffect(() => {
    if (screen.group === "member" || screen.group === "staff") startDevelopmentSession();
  }, [screen.group]);
  const [choice, setChoice] = useState<Choice>(() => ({ ...initialChoice, ...participantDraft }));
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState(screen.group === "public" && Number(screen.number) === 11 ? "Analisis teknikal" : "Semua topik");
  useEffect(() => {
    if (screen.group !== "public" || ![3, 11].includes(Number(screen.number))) return;
    setTopic(Number(screen.number) === 11 ? "Analisis teknikal" : "Semua topik");
    setSearch("");
  }, [screen.group, screen.number]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (screen.group === "public" && Number(screen.number) === 2) {
      const incoming: Partial<Choice> = {};
      if (["Online", "Fizikal"].includes(params.get("session") || "")) incoming.session = params.get("session") as Choice["session"];
      if (laburSahamPackages.some((offer) => offer.id === params.get("package"))) incoming.package = params.get("package") as Choice["package"];
      else if (params.get("package") === "Bimbingan") incoming.package = "Online+";
      else if (params.get("session") === "Fizikal") incoming.package = "Fizikal";
      if (params.get("previewDate") === "2026-10-24" || params.get("previewDate") === "2026-11-07") incoming.previewDate = params.get("previewDate") as PreviewDate;
      if (Object.keys(incoming).length) setChoice((current) => {
        const next = { ...current, ...incoming };
        try { localStorage.setItem(storageKey, JSON.stringify(previewOptions(next))); } catch { /* Preview remains usable without storage. */ }
        return next;
      });
    }
  }, [screen.group, screen.number]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null") as Partial<Choice> | null;
      if (saved) {
        const safe: Choice = {
          ...initialChoice,
          ...participantDraft,
          session: saved.session === "Fizikal" ? "Fizikal" : "Online",
          package: laburSahamPackages.some((offer) => offer.id === saved.package) ? saved.package as LaburSahamPackage : (saved.package as string) === "Bimbingan" ? "Online+" : saved.session === "Fizikal" ? "Fizikal" : "Online",
          previewDate: saved.previewDate === "2026-10-24" || saved.previewDate === "2026-11-07" ? saved.previewDate : "",
          workbook: false,
          method: saved.method === "Kad" ? "Kad" : "FPX",
          bank: fpxPreviewBanks.some((bank) => bank.id === saved.bank) ? saved.bank! : "",
        };
        if (screen.group === "public" && Number(screen.number) === 2) {
          const params = new URLSearchParams(window.location.search);
          const selected = params.get("package");
          if (laburSahamPackages.some((offer) => offer.id === selected)) safe.package = selected as LaburSahamPackage;
          const selectedDate = params.get("previewDate");
          if (selectedDate === "2026-10-24" || selectedDate === "2026-11-07") safe.previewDate = selectedDate;
        }
        setChoice(safe);
        localStorage.setItem(storageKey, JSON.stringify(previewOptions(safe)));
      }
    } catch { /* Empty or old preview state. */ }
  }, []);
  useEffect(() => {
    if (screen.group !== "public") return;
    const number = Number(screen.number);
    const routeChoice: Partial<Choice> = {};
    if ([14, 19].includes(number)) routeChoice.package = "Online";
    if ([15, 20].includes(number)) routeChoice.package = "Online+";
    if ([18, 21].includes(number)) routeChoice.package = "Fizikal";
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
    const next = { ...current, ...value, ...(value.package ? { session: value.package === "Fizikal" ? "Fizikal" as const : "Online" as const, workbook: false } : {}) };
    participantDraft = { name: next.name, email: next.email, phone: next.phone };
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
    `${course.title} ${course.description}`.toLocaleLowerCase("ms").includes(search.toLocaleLowerCase("ms"))
  ), [search, topic]);
  const catalogueCourse = previewCourses.find((course) => course.id === courseId) ?? previewCourses[1];
  const requestNotice = (action?: string) => setNotice(`${action ? `${action}: ` : ""}Sambungan pelayan belum aktif. Tiada perubahan atau bayaran dibuat.`);

  function actionTarget(index: number): string | null {
    if (screen.group === "public" && number === 2 && index === 0) return href("public", choice.package === "Fizikal" ? 18 : choice.package === "Online+" ? 15 : 14);
    if (screen.group === "public" && number === 11 && index === 0) return filteredCourses[0] ? `${href("public", 10)}?course=${filteredCourses[0].id}` : null;
    if (screen.group === "public" && number === 22 && index === 0) return href("public", choice.method === "Kad" ? 28 : 27);
    const entry = targetMap.find((item) => item.slug === screen.slug);
    return entry?.targets[index] ? `/flow/${entry.targets[index]}` : null;
  }
  function actions(labels = screen.actions) {
    if (!labels.length) return null;
    return <div className="flow-actions">{labels.map((label, i) => {
      const target = actionTarget(i);
      const text = screen.group === "state" && number === 60 && i === 0 ? "Masuk akaun" : screen.group === "member" && number === 31 && i === 1 ? "Tonton video demonstrasi" : human(label);
      const icon = <Icon name={accountActionIcon(text)} />;
      if (!target && label === "Tambah ke kalendar") return <Button key={label} variant={i ? "secondary" : "default"} asChild><a href={assetPath("/media/labursaham-online-preview.ics")} download="AAA-LaburSaham-pratonton.ics">{icon}Kalendar contoh</a></Button>;
      return target
        ? <Button key={label} variant={i ? "secondary" : "default"} asChild><Link href={target}>{icon}{text}</Link></Button>
        : <Button key={label} variant={i ? "secondary" : "default"} onClick={() => requestNotice(text)}>{icon}{text}</Button>;
    })}</div>;
  }
  const isCheckout = screen.group === "public" && (number === 2 || number >= 14 && number <= 28);
  const checkoutTitle = screen.group === "public" && (number === 2 || number >= 14 && number <= 18) ? "Pilih pakej anda"
    : screen.group === "public" && number >= 19 && number <= 21 ? "Maklumat peserta"
    : screen.group === "public" && number === 23 ? "Bayaran sedang disemak"
    : screen.group === "public" && number === 24 ? "Tempahan disahkan"
    : screen.group === "public" && number === 25 ? "Bayaran belum selesai"
    : screen.group === "public" && number >= 22 && number <= 28 ? "Bayaran tempahan"
    : screen.group === "member" && number === 31 ? "Bahan & replay"
    : null;
  const headingDescription = screen.group === "public" && (number === 2 || number >= 14 && number <= 18) ? "Bandingkan manfaat dan pilih satu pakej untuk seorang peserta."
    : screen.group === "public" && number >= 19 && number <= 21 ? "Isi maklumat peserta untuk pakej yang dipilih."
    : screen.group === "public" && [22, 26].includes(number) ? "Pilih kaedah bayaran dalam pratonton. Tiada penyedia bayaran disambungkan."
    : screen.group === "public" && number === 27 ? "Pilih bank contoh. Ketersediaan sebenar ditentukan penyedia bayaran."
    : screen.group === "public" && number === 10 ? catalogueCourse.description
    : screen.group === "state" && number === 60 ? "Pasukan AAA boleh membantu jika anda kehilangan akses."
    : screen.group === "member" && number === 26 ? "Semak susun atur akaun menggunakan sesi contoh AAA."
    : human(screen.description);
  const checkoutEyebrow = screen.group === "public" && (number === 2 || number >= 14 && number <= 18) ? "LANGKAH 01 · PAKEJ"
    : screen.group === "public" && number >= 19 && number <= 21 ? "LANGKAH 02 · PESERTA"
    : screen.group === "public" && [23, 24, 25].includes(number) ? "LANGKAH 04 · STATUS"
    : screen.group === "public" && number >= 22 && number <= 28 ? "LANGKAH 03 · BAYARAN" : null;
  const heading = screen.group === "public" && number === 10 ? null : <div className="flow-heading"><span className="eyebrow">{checkoutEyebrow ?? human(screen.subtitle)}</span><h1>{checkoutTitle ?? human(screen.title)}</h1>{headingDescription && <p>{headingDescription}</p>}</div>;

  return <div className={`flow-site${isCheckout ? " flow-checkout-site" : ""}${showingSide ? " flow-account" : ""}${surface === "staff" ? " flow-staff" : ""}${screen.group === "public" && (number === 2 || number >= 14 && number <= 18) ? " flow-sales-site" : ""}`}>
    <a className="skip-link" href="#flow-main">Langkau ke kandungan</a>
    {isCheckout ? <CheckoutHeader /> : <header className="site-header"><div className="page-shell header-inner">
      {showingSide || accountActive ? <Button variant="ghost" size="sm" className="mobile-menu-button header-icon-control" aria-label={surface === "staff" ? "Operations Menu" : "Dashboard Menu"} aria-expanded={menuOpen} aria-controls="flow-mobile-menu" onClick={() => setMenuOpen((open) => !open)}><Icon name="menu" /></Button> : <span className="mobile-header-spacer" aria-hidden="true" />}
      <Link href="/" className="brand" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link>
      <nav className="desktop-nav" aria-label="Navigasi utama">{navItems.map((item) => <Link key={item.label} href={item.href}>{item.label === "Home" && <Icon name="home" />}{item.label}</Link>)}</nav>
      <Button variant="outline" size="sm" className="login-button" asChild><Link href={isAccount ? "/" : accountHref} onClick={isAccount ? endDevelopmentSession : undefined}><Icon name={isAccount ? "logout" : "user"} />{isAccount ? "Log Out" : accountActive ? "User Account" : "Login"}</Link></Button>
      {showingSide || accountActive ? <span className="mobile-header-spacer" aria-hidden="true" /> : <Link href={accountHref} className="mobile-account-button header-icon-control" aria-label="Login"><Icon name="user" /></Link>}
    </div>{(showingSide || accountActive) && <nav id="flow-mobile-menu" className="mobile-inline-navigation page-shell" aria-label={surface === "staff" ? "Operations Menu" : "Dashboard Menu"} hidden={!menuOpen}>{showingSide ? <>{side.map((item) => <Link key={item.number} href={href(item.group ?? (surface === "staff" ? "staff" : "member"), item.number)} aria-current={activeSideNumber === item.number ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon name={item.icon} />{surface === "staff" ? staffMenuLabels[item.number] : memberMenuLabels[item.number]}</Link>)}<Link href="/" onClick={() => { setMenuOpen(false); endDevelopmentSession(); }}><Icon name="logout" />Log Out</Link></> : previewAccountDock.map((item) => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}><Icon name={item.icon} />{item.label}</Link>)}</nav>}</header>}
    <div className={showingSide ? "page-shell flow-with-sidebar" : "page-shell flow-main-only"}>
      {showingSide && <aside className="flow-sidebar"><nav aria-label={surface === "staff" ? "Operations Menu" : "Dashboard Menu"}>{side.map((item, index) => <div className="flow-sidebar-item" key={item.number}>{(index === 0 || index === 1 || index === (surface === "staff" ? 4 : 5)) && <span className="flow-sidebar-group">{index === 0 ? "Main" : index === 1 ? surface === "staff" ? "Operations" : "Learning" : surface === "staff" ? "Services" : "Account & Help"}</span>}<Link href={href(item.group ?? (surface === "staff" ? "staff" : "member"), item.number)} aria-current={activeSideNumber === item.number ? "page" : undefined}><Icon name={item.icon} />{surface === "staff" ? staffMenuLabels[item.number] : memberMenuLabels[item.number]}</Link></div>)}<Link href="/" onClick={endDevelopmentSession}><Icon name="logout" />Log Out</Link></nav></aside>}
      <main id="flow-main" className={`flow-main${showingSide ? " flow-dashboard-main" : ""}${screen.group === "public" && (number === 2 || number >= 14 && number <= 18) ? " flow-sales-main" : ""}`}>{heading}
        {showingSide && <p className="flow-inline-note flow-preview-banner"><strong>Pratonton pembangunan · rekod latihan.</strong> Tiada akaun, tempahan atau bayaran sebenar.</p>}
        {screen.group === "public" && number <= 12 && <PublicContent screen={screen} number={number} filteredCourses={filteredCourses} search={search} setSearch={setSearch} topic={topic} setTopic={setTopic} catalogueCourse={catalogueCourse} choice={choice} update={update} actions={actions} />}
        {screen.group === "public" && number === 13 && <div className="flow-card flow-center"><p>Lihat susun atur akaun dengan rekod latihan. Log masuk sebenar memerlukan sambungan identiti.</p><Button asChild><Link href={href("member", 26)}>Lihat akaun contoh</Link></Button></div>}
        {screen.group === "public" && number >= 14 && number <= 18 && <ProgrammeSales choice={choice} update={update} />}
        {screen.group === "public" && number >= 19 && number <= 21 && <CheckoutParticipant choice={choice} update={update} />}
        {screen.group === "public" && number >= 22 && number <= 28 && <PaymentContent number={number} choice={choice} update={update} actions={actions} />}
        {screen.group !== "public" && <AccountContent screen={screen} actions={actions} />}
        {notice && <p className="flow-notice" role="status">{notice}</p>}
      </main>
    </div>
    {isCheckout ? <CheckoutFooter /> : <SiteFooter />}
    {!isCheckout && (showingSide ? <AccountDock items={surface === "staff" ? staffPrimaryNav.map((item) => ({ label: staffMenuLabels[item.number], href: href("staff", item.number), icon: item.icon, section: item.number })) : previewAccountDock} activeSection={activeSideNumber} label={surface === "staff" ? "Operations Menu" : "Dashboard Menu"} /> : <nav className="mobile-bottom-navigation app-bottom-dock" aria-label="Home Menu">{navItems.map(item => <Link className="app-dock-item" key={item.href} href={item.href} aria-label={item.label}><Icon name={item.icon} /><span>{item.label}</span></Link>)}</nav>)}
  </div>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="flow-field"><span>{label}</span><Input value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function ProgrammeSales({ choice, update }: { choice: Choice; update: (value: Partial<Choice>) => void }) {
  const selected = laburSahamPackage(choice.package);
  return <><StepRail step={1} />
    <section className="flow-programme-selection" aria-label="Pilihan pakej">
      <div className="flow-programme-selection-heading"><h2>Pakej tersedia</h2><span className="flow-programme-selection-price">Bermula <strong>RM49</strong> / seorang</span></div>
      <div className="flow-programme-package-grid">{laburSahamPackages.map((offer) => <PackageBannerCard key={offer.id} offer={offer} active={choice.package === offer.id} onClick={() => update({ package: offer.id })} />)}</div>
      <div className="flow-programme-checkout"><div><span>Jumlah untuk {selected.title}</span><strong>{money(selected.price)}</strong>{choice.package === "Fizikal" && choice.previewDate && <small>Sesi {previewDateLabel[choice.previewDate]} ialah tarikh contoh, belum disahkan.</small>}</div><Button asChild className="flow-programme-continue"><Link href={href("public", participantRoute(choice))}><span className="flow-continue-long">Teruskan ke maklumat peserta</span><span className="flow-continue-short">Teruskan</span><span aria-hidden="true">→</span></Link></Button></div>
      <p className="flow-programme-disclaimer">Harga pakej daripada LaburSaham.com. Jadual sebenar belum diterbitkan. Ini pratonton tempahan; pembayaran belum diaktifkan.</p>
    </section>
  </>;
}
function Summary({ choice }: { choice: Choice }) {
  const selected = laburSahamPackage(choice.package);
  return <CheckoutSummaryCard packageName={selected.title} format={selected.id === "Fizikal" ? "Seminar bersemuka" : "Webinar"} schedule={selected.id === "Fizikal" && choice.previewDate ? `${previewDateLabel[choice.previewDate]} (contoh)` : "Akan diumumkan"} total={money(selected.price)} note="Harga diterbitkan di LaburSaham.com. Ini pratonton tanpa bayaran sebenar." />;
}
function CheckoutParticipant({ choice, update }: { choice: Choice; update: (value: Partial<Choice>) => void }) {
  return <><StepRail step={2} /><div className="flow-checkout-layout"><section className="flow-checkout-panel"><h2>Maklumat peserta</h2><p>Pastikan butiran ini betul sebelum memilih kaedah bayaran.</p><div className="flow-checkout-fields"><Field label="Nama penuh" value={choice.name} onChange={(v) => update({ name: v })} /><Field label="E-mel" value={choice.email} onChange={(v) => update({ email: v })} /><Field label="Telefon" value={choice.phone} onChange={(v) => update({ phone: v })} /></div></section><Summary choice={choice} /></div><div className="flow-actions flow-checkout-actions"><Button asChild><Link href={href("public", 22)}><Icon name="payment" />Teruskan ke bayaran</Link></Button><Button variant="secondary" asChild><Link href={href("public", 2)}><Icon name="arrowLeft" />Ubah tempahan</Link></Button></div></>;
}

function MemberMore({ number }: { number: number }) {
  const groups: Record<number, { title: string; items: { label: string; number: number; icon: IconName }[] }> = {
    27: { title: "Butiran tempahan", items: [{ label: "Maklumat Zoom", number: 28, icon: "video" }, { label: "Tiket fizikal", number: 29, icon: "ticket" }, { label: "Tukar sesi", number: 35, icon: "calendar" }] },
    31: { title: "Pembelajaran", items: [{ label: "Kelas selesai", number: 42, icon: "book" }, { label: "Tempahan saya", number: 27, icon: "calendar" }] },
    32: { title: "Urus bayaran", items: [{ label: "Resit tempahan", number: 33, icon: "receipt" }, { label: "Mohon refund", number: 34, icon: "refund" }] },
    36: { title: "Akaun & tetapan", items: [{ label: "Notifikasi", number: 39, icon: "bell" }, { label: "Privasi", number: 40, icon: "shield" }, { label: "Keselamatan", number: 38, icon: "key" }, { label: "Bantuan", number: 37, icon: "help" }] },
    37: { title: "Sokongan", items: [{ label: "Status pertanyaan", number: 41, icon: "history" }, { label: "Profil saya", number: 36, icon: "user" }] },
  };
  const group = groups[number];
  if (!group) return null;
  return <MemberContextLinks title={group.title} items={group.items.map((item) => ({ label: item.label, icon: item.icon, href: href("member", item.number) }))} />;
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
function StaffPaymentRows({ slug }: { slug: string }) {
  const blocks = (blockMap.find((item) => item.slug === slug)?.blocks || []) as FlowBlock[];
  const transactions = blocks.filter((block) => block.kind === "AaaInfoCard");
  const detail = blocks.find((block) => block.kind.startsWith("AaaDetailsTable"));
  const rows = detail ? Array.from({ length: 4 }, (_, index) => ({ label: detail[`label${index + 1}`], value: detail[`value${index + 1}`] })).filter((row) => row.label && row.value) : [];
  return <>
    <section className="flow-ledger flow-staff-payments" aria-label="Senarai bayaran peserta">
      <div className="flow-ledger-list">{transactions.map((transaction) => {
        const [reference, amount] = human(transaction.title || "").split(" · ");
        return <div key={reference}>
          <span className={`flow-ledger-status${transaction.subtitle === "SEDANG DISEMAK" ? " is-pending" : ""}`}>{human(transaction.subtitle || "")}</span>
          <span><strong>{reference}</strong><small>{human(transaction.description || "")}</small></span>
          <b>{amount}</b>
        </div>;
      })}</div>
    </section>
    {rows.length > 0 && <div className="flow-card flow-detail-card"><dl className="flow-facts">{rows.map((row) => <div key={row.label}><dt>{human(row.label || "")}</dt><dd>{human(row.value || "")}</dd></div>)}</dl></div>}
  </>;
}
function ReplayDetails({ slug }: { slug: string }) {
  const blocks = (blockMap.find((item) => item.slug === slug)?.blocks || []) as FlowBlock[];
  const detail = blocks.find((block) => block.kind.startsWith("AaaDetailsTable"));
  const note = blocks.find((block) => block.kind === "AaaInfoCard");
  const rows = detail ? [1, 2].map((index) => ({ label: detail[`label${index}`], value: detail[`value${index}`] })).filter((row) => row.label && row.value) : [];
  return <section className="flow-card flow-replay-details" aria-label="Butiran akses replay">
    <dl className="flow-facts aaa-detail-rows">{rows.map((row) => <div key={row.label}><dt>{human(row.label || "")}</dt><dd>{human(row.value || "")}</dd></div>)}</dl>
    {note && <div className="flow-replay-details-note"><h2>{human(note.title || "")}</h2><p>{human(note.description || "")}</p></div>}
  </section>;
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

function RelatedCourses({ current, title = "Teroka kelas lain.", description = "Pilihan kelas contoh untuk dibandingkan mengikut topik dan format." }: { current: (typeof previewCourses)[number]; title?: string; description?: string }) {
  const related = previewCourses
    .filter((course) => course.id !== current.id)
    .sort((a, b) => Number(b.topic === current.topic) - Number(a.topic === current.topic))
    .slice(0, 2);
  return <section className="flow-related-courses" aria-labelledby="related-courses-title">
    <div><span className="eyebrow">KELAS AAA</span><h2 id="related-courses-title">{title}</h2><p>{description}</p></div>
    <div className="flow-related-course-list">{related.map((course) => <Link className="flow-related-course" href={`${href("public", 10)}?course=${course.id}`} key={course.id}>
      <CourseCover course={course} sizes="(max-width: 700px) 82vw, 150px" /><span><small>{course.topic} · {course.format}</small><strong>{course.title}</strong><span>{money(course.price)}</span></span><span aria-hidden="true">→</span>
    </Link>)}</div>
  </section>;
}

function ClassComparisonCards({ courses }: { courses: typeof previewCourses }) {
  return <section className="flow-block-grid flow-class-comparison-grid" aria-label="Perbandingan kelas AAA">
    {courses.map((course) => <Link className="flow-card flow-link-card flow-class-comparison-card" href={`${href("public", 10)}?course=${course.id}`} key={course.id}>
      <span className="eyebrow">{course.topic}</span>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <dl className="aaa-detail-rows">
        <div><dt>Tahap</dt><dd>{course.level}</dd></div>
        <div><dt>Format</dt><dd>{course.format}</dd></div>
        <div><dt>Tempoh video</dt><dd>{course.duration}</dd></div>
        <div><dt>Harga contoh</dt><dd>{money(course.price)}</dd></div>
      </dl>
      <span className="flow-class-comparison-action">Lihat kelas <span aria-hidden="true">→</span></span>
    </Link>)}
  </section>;
}

function PublicContent({ screen, number, filteredCourses, search, setSearch, topic, setTopic, catalogueCourse, choice, update, actions }: {
  screen: Screen; number: number; filteredCourses: typeof previewCourses; search: string; setSearch: (value: string) => void; topic: string; setTopic: (value: string) => void; catalogueCourse: (typeof previewCourses)[number]; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode;
}) {
  if (number === 3 || number === 11) return <>
    <div className="flow-catalog-tools"><label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari kelas" placeholder="Cari kelas" value={search} onChange={(event) => setSearch(event.target.value)} /></label><Button variant="secondary" onClick={() => { setSearch(""); setTopic("Semua topik"); }}><Icon name="reset" />Set semula</Button></div>
    <div className="flow-topics">{["Semua topik", "Asas saham", "Analisis teknikal", "Portfolio"].map((name) => <Button key={name} variant={topic === name ? "default" : "secondary"} onClick={() => setTopic(name)}>{name}</Button>)}</div>
    <p className="flow-count">{filteredCourses.length} kelas</p>
    <div className="flow-course-grid">{filteredCourses.map((course) => <Link href={`${href("public", 10)}?course=${course.id}`} className="flow-course" key={course.id}><CourseCover course={course} /><div><h2>{course.title}</h2><p>{course.description}</p><strong>{money(course.price)}</strong></div></Link>)}</div>
    {!filteredCourses.length && <div className="flow-card"><h2>Tiada kelas ditemui.</h2><p>Cuba carian atau topik lain.</p></div>}
    {number === 11 && !filteredCourses.length ? <div className="flow-actions"><Button variant="secondary" asChild><Link href={href("public", 3)}>Lihat semua kelas</Link></Button></div> : actions()}
  </>;
  if (number === 4) return <>
    <ClassComparisonCards courses={previewCourses.filter((course) => course.topic === "Asas saham")} />
    <div className="flow-actions"><Button asChild><Link href={href("public", 9)}>Bandingkan semua kelas</Link></Button><Button variant="secondary" asChild><Link href={href("public", 3)}>Lihat semua kelas</Link></Button></div>
  </>;
  if (number === 9) return <>
    <ClassComparisonCards courses={previewCourses} />
    <div className="flow-actions"><Button variant="secondary" asChild><Link href={href("public", 3)}>Kembali ke semua kelas</Link></Button><Button variant="secondary" asChild><Link href={href("public", 6)}>Bantuan memilih</Link></Button></div>
  </>;
  if (number === 10) return <><ClassSalesPage key={catalogueCourse.id} course={catalogueCourse} /><RelatedCourses current={catalogueCourse} /></>;
  if (number === 2) return <ProgrammeSales choice={choice} update={update} />;
  if (number === 12) return <><div className="flow-feature"><div className="flow-feature-copy"><span className="eyebrow">KELAS LABURSAHAM</span><h2>Fahami dahulu.<br />Praktik bersama.</h2><p>Pilih sesi yang sesuai dan semak pakej sebelum mendaftar.</p><div className="flow-feature-facts">{["Asas pasaran", "Urus risiko", "Latihan dan soalan"].map((fact) => <span key={fact}>{fact}</span>)}</div></div><div className="flow-feature-image"><Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku dan nota pembelajaran" fill sizes="(max-width: 700px) 100vw, 45vw" /></div></div><div className="flow-actions"><Button asChild><Link href={href("public", 2)}><Icon name="book" />Pilih sesi & pakej</Link></Button><Button variant="secondary" asChild><Link href={href("public", 7)}><Icon name="shield" />Baca polisi</Link></Button></div></>;
  const cards = screen.cards.filter((card) => !["Utama", "LaburSaham", "Kelas AAA", "Tentang AAA", "Bantuan"].includes(card) && card !== screen.title).slice(0, 4);
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{cards.map((card, index) => <article className="flow-card" key={card}><span className="flow-card-index">{String(index + 1).padStart(2, "0")}</span><h2>{human(card)}</h2>{index === 0 && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}</>;
}

function PaymentContent({ number, choice, update, actions }: { number: number; choice: Choice; update: (value: Partial<Choice>) => void; actions: (labels?: string[]) => React.ReactNode }) {
  const [bankSearch, setBankSearch] = useState("");
  const query = bankSearch.trim().toLocaleLowerCase("ms");
  const banks = fpxPreviewBanks.filter((bank) => bank.label.toLocaleLowerCase("ms").includes(query));
  if ([23, 24, 25].includes(number)) return <><StepRail step={4} /><div className="flow-checkout-layout"><section className="flow-checkout-panel"><h2>{number === 24 ? "Tempahan disahkan" : number === 25 ? "Bayaran belum selesai" : "Bayaran sedang disemak"}</h2><p>Ini keadaan contoh untuk menyemak aliran tempahan. Tiada transaksi dibuat melalui laman ini.</p><CheckoutNotice status icon={number === 24 ? "calendar" : "history"} title="Rujukan contoh AAA-ONL-001" description="Semak status dan butiran lanjut melalui pautan di bawah." /></section><Summary choice={choice} /></div>{actions()}</>;
  const choosingMethod = number === 22 || number === 26;
  return <><StepRail step={3} /><div className="flow-checkout-layout"><section className="flow-checkout-panel flow-checkout-payment"><h2>{number === 27 ? "Pilih bank FPX" : number === 28 ? "Pembayaran kad" : "Kaedah bayaran"}</h2><p>{choosingMethod ? "Pilih cara bayaran untuk melihat langkah seterusnya." : number === 28 ? "Butiran kad diisi pada halaman penyedia bayaran apabila pembayaran diaktifkan. Pratonton ini hanya menunjukkan aliran." : "Pilih bank contoh untuk melihat langkah FPX."}</p>
    {choosingMethod ? <div className="flow-payment-options"><ChoiceCard method="fpx" active={choice.method === "FPX"} label="FPX / perbankan internet" description="Bayar melalui perbankan internet bank pilihan anda." onClick={() => update({ method: "FPX" })} /><ChoiceCard method="card" active={choice.method === "Kad"} label="Kad debit / kredit" description="Bayar menggunakan kad debit atau kredit Visa atau Mastercard." onClick={() => update({ method: "Kad" })} /></div> : number === 27 ? <><label className="flow-search-field"><Icon name="search" /><Input aria-label="Cari bank" placeholder="Cari atau pilih bank" value={bankSearch} onChange={(event) => setBankSearch(event.target.value)} /></label><p className="flow-bank-hint">{banks.length} bank contoh · Ketersediaan sebenar ditentukan penyedia bayaran.</p><div className="flow-bank-list" role="radiogroup" aria-label="Bank FPX contoh">{banks.length ? banks.map((bank) => <label className={choice.bank === bank.id ? "is-active" : ""} key={bank.id}><input type="radio" name="fpx-bank" value={bank.id} checked={choice.bank === bank.id} onChange={() => update({ bank: bank.id })} /><span className="flow-bank-identity"><span className="flow-bank-logo" aria-hidden="true">{bank.logo ? <Image src={assetPath(`/images/banks/${bank.logo}.png`)} alt="" width={70} height={30} /> : <strong>KFH</strong>}</span><span>{bank.label}</span></span><span className="selection-control flow-bank-indicator" data-selected={choice.bank === bank.id} aria-hidden="true" /></label>) : <p>Tiada bank sepadan. Cuba carian lain.</p>}</div></> : null}
    <CheckoutNotice icon="lock" title="Pembayaran belum diaktifkan." description="Maklumat kad dan perbankan tidak diminta atau disimpan di laman ini." />
  </section><Summary choice={choice} /></div><div className="flow-actions flow-checkout-actions">{choosingMethod ? <Button asChild><Link href={href("public", choice.method === "FPX" ? 27 : 28)}><Icon name="payment" />Teruskan dengan {choice.method}</Link></Button> : number === 27 && !choice.bank ? <Button disabled><Icon name="search" />Pilih bank dahulu</Button> : <Button asChild><Link href={href("public", 23)}><Icon name="search" />Lihat status contoh</Link></Button>}<Button variant="secondary" asChild><Link href={href("public", choosingMethod ? participantRoute(choice) : 22)}><Icon name="arrowLeft" />Kembali ke semakan</Link></Button></div></>;
}

function AccountContent({ screen, actions }: { screen: Screen; actions: (labels?: string[]) => React.ReactNode }) {
  const number = Number(screen.number);
  const cards = (contentMap.find((item) => item.slug === screen.slug)?.content || screen.cards).filter((card) => card !== "Bahan & replay" && ![...memberNav, ...staffNav].some((item) => item.label === card) && card !== screen.title && !/^(AAA|Details|Current step)/.test(card)).slice(0, 4);
  if (screen.group === "state" && number === 60) return <><div className="flow-card"><h2>Akses akaun</h2><p>Masuk terus ke paparan akaun pembangunan. Tempahan dan profil yang ditunjukkan ialah rekod latihan.</p></div>{actions()}</>;
  if (screen.group === "member" && number === 26) return <>
    <MemberDashboardFeature />
    <section className="flow-dashboard-links flow-member-actions" aria-labelledby="member-actions-title"><header><span className="eyebrow">AKAUN CONTOH</span><h2 id="member-actions-title">Urus penyertaan</h2><p>Pilih maklumat yang mahu disemak.</p></header><div>
      {memberActions.map((item, index) => <MemberActionCard item={item} tone={index === 0 || index === 2 ? "blue" : index === 1 ? "yellow" : "grey"} key={item.href} />)}
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
    <section className="flow-zoom-steps" aria-label="Persediaan sesi"><div><IconFrame name="settings" variant="gold" className="flow-zoom-step-icon" /><h2>Sebelum kelas</h2><p>Semak audio, sambungan internet dan aplikasi Zoom. Gunakan maklumat kelas yang disahkan dalam akaun anda.</p></div><div><IconFrame name="play" variant="gold" className="flow-zoom-step-icon" /><h2>Selepas kelas</h2><p>Replay dan nota dipaparkan mengikut pakej serta tempoh akses yang telah disahkan.</p></div></section>
    <Link className="flow-staff-preview-link" href={href("member", 27)}>Kembali ke tempahan saya →</Link>
  </>;
  if (screen.group === "member" && number === 27) return <>
    <section className="flow-bookings" aria-labelledby="flow-bookings-title"><header><span className="eyebrow">2 SESI AKAN DATANG</span><h2 id="flow-bookings-title">Pilih sesi untuk lihat butiran.</h2></header><div>
      {previewBookings.map((booking, index) => <BookingCard item={booking} tone={index === 0 ? "blue" : "yellow"} key={booking.reference} />)}
    </div></section>
    <div className="flow-actions"><Button variant="secondary" asChild><Link href={href("member", 35)}><Icon name="calendar" />Tukar sesi</Link></Button><Button variant="secondary" asChild><Link href={href("member", 42)}><Icon name="book" />Lihat kelas selesai</Link></Button></div>
  </>;
  if (screen.group === "member" && number === 32) return <>
    <section className="flow-ledger" aria-labelledby="flow-ledger-title"><header><div><span className="eyebrow">BAYARAN DISAHKAN · REKOD LATIHAN</span><h2 id="flow-ledger-title">Sejarah transaksi</h2><p>Semak satu rujukan sebelum memuat turun resit atau meminta bantuan.</p></div><div className="flow-ledger-total"><small>{confirmedMemberPayments.length} BAYARAN DISAHKAN</small><strong>{money(confirmedMemberPayments.reduce((total, row) => total + row.amount, 0))}</strong></div></header><div className="flow-ledger-list">
      {memberPaymentRows.map((row) => {
        const content = <><span className={`flow-ledger-status${row.status === "SEMAKAN" ? " is-pending" : ""}`}>{row.status}</span><span><strong>{row.title}</strong><small>{row.detail}</small></span><b>{money(row.amount)}</b><span aria-hidden="true">{row.href ? "→" : "·"}</span></>;
        return "href" in row && row.href ? <Link href={row.href} key={row.detail}>{content}</Link> : <div key={row.detail}>{content}</div>;
      })}
    </div></section>
    <div className="flow-actions"><Button asChild><Link href={href("member", 33)}><Icon name="receipt" />Lihat resit AAA-ONL-001</Link></Button><Button variant="secondary" asChild><Link href={href("member", 34)}><Icon name="refund" />Mohon refund</Link></Button></div>
  </>;
  if (screen.group === "member" && number === 42) return <>
    <FlowBlocks slug={screen.slug} />
    <RelatedCourses current={previewCourses[0]} title="Sambung pembelajaran." description="Selepas kelas asas, lihat bengkel setara atau kelas carta peringkat pertengahan. Semua kelas dan rekod di sini ialah contoh." />
    <Link className="flow-staff-preview-link" href={href("member", 31)}>Semak bahan & replay →</Link>
  </>;
  if (screen.group === "staff" && number === 43) return <>
    <StaffDashboardOverview />
    <StaffDashboardActions />{actions()}
  </>;
  if (screen.group === "state" && number === 68) return <><article className="flow-card flow-replay"><h2>Rakaman sesi · Video demonstrasi</h2><p>Video ini menguji paparan dan kawalan pemain. Ia bukan rakaman kelas sebenar.</p><video controls playsInline preload="metadata" poster={assetPath("/media/labursaham-demo-poster.webp")} aria-label="Video demonstrasi LaburSaham"><source src={assetPath("/media/labursaham-demo.webm")} type="video/webm" />Pelayar ini tidak menyokong video WebM.</video></article><ReplayDetails slug={screen.slug} />{actions()}</>;
  if (screen.group === "state" && number === 70) return <>
    <section className="flow-card flow-detail-card" aria-label="Butiran bahan kelas">
      <dl className="flow-facts aaa-detail-rows">
        <div><dt>Bahan</dt><dd>Nota kelas · PDF</dd></div>
        <div><dt>Topik</dt><dd>Asas pasaran, risiko dan langkah membuat keputusan.</dd></div>
      </dl>
    </section>
    {actions()}
    <p className="flow-inline-note">Status ini untuk semakan antaramuka. Tiada akaun atau transaksi diubah.</p>
  </>;
  if (screen.group === "member" && number === 31) return <>
    <section className="flow-materials" aria-label="Bahan kelas mengikut pakej">
      <MaterialsIntroBanner />
      <div id="materials-list" className="flow-materials-grid">
        {materialItems.map((item) => <MaterialCard item={item} key={item.title} />)}
      </div>
    </section><MemberMore number={number} />
  </>;
  if (screen.group === "staff" && number === 54) return <><StaffPaymentRows slug={screen.slug} />{actions()}<div className="flow-related"><h2>Operasi lain</h2>{staffNav.slice(0, 4).map((item) => <Link href={href("staff", item.number)} key={item.number}>{item.label} →</Link>)}</div></>;
  if (screen.group === "member" && number === 36) return <><MemberProfileCard />{actions()}<MemberMore number={number} /></>;
  if (screen.group === "member" && [34, 35, 37, 39].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={initialChoice.name} fallback={number === 39 ? ["E-mel", "Peringatan kelas", "Maklumat program"] : ["Tempahan", "Sebab", "Penjelasan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}<MemberMore number={number} /></>;
  if (screen.group === "staff" && [45, 49, 51, 53, 55, 56, 59].includes(number)) return <><div className="flow-card flow-form"><h2>{screen.title}</h2><FlowFormFields slug={screen.slug} name={initialChoice.name} fallback={number === 59 ? ["Peranan", "Pengguna", "Catatan"] : ["Peserta", "Sebab", "Catatan"]} /></div><FlowBlocks slug={screen.slug} />{actions()}</>;
  const related = screen.group === "staff" ? staffNav : memberNav;
  const hasBlocks = (blockMap.find((item) => item.slug === screen.slug)?.blocks.length || 0) > 0;
  return <>{hasBlocks && !(screen.group === "state" && number === 60) ? <FlowBlocks slug={screen.slug} /> : <div className="flow-generic-grid">{(cards.length ? cards : [screen.label]).map((card, index) => <article className="flow-card" key={index}><h2>{human(card)}</h2>{index === 0 && screen.description && <p>{human(screen.description)}</p>}</article>)}</div>}{actions()}{screen.group === "member" && <MemberMore number={number} />}{screen.group === "state" && <p className="flow-inline-note">Status ini untuk semakan antaramuka. Tiada akaun atau transaksi diubah.</p>}{screen.group === "staff" && <div className="flow-related"><h2>Operasi lain</h2>{related.slice(0, 4).map((item) => <Link href={href("staff", item.number)} key={item.number}>{item.label} →</Link>)}</div>}</>;
}
