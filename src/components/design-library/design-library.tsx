"use client";

import { useState } from "react";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { IconFrame, type IconFrameVariant } from "@/components/ui/icon-frame";
import { Icon, iconNames } from "@/components/home/icon";
import { CourseCard } from "@/components/home/course-card";
import { CheckoutNotice, CheckoutSummaryCard, ChoiceCard, PackageBannerCard, StepRail } from "@/components/flow/checkout-ui";
import { BookingCard, previewBookings, MaterialsIntroBanner, MaterialCard, materialItems, MemberActionCard, memberActions, MemberContextLinks, type MemberActionTone } from "@/components/flow/member-cards";
import { MemberDashboardFeature, StaffDashboardActions } from "@/components/flow/dashboard-cards";
import { ClassCheckoutPreview, ClassSalesPage } from "@/components/flow/class-sales";
import { MemberProfileCard } from "@/components/flow/member-profile-card";
import { HomeTwoHelpBanner, HomeTwoProgramCards } from "@/components/home/home-two-sections";
import { MainHomeIntakeCard, MainHomeProgrammeCard, type ProgrammeCardTone } from "@/components/home/main-home-sections";
import { laburSahamPackages, type LaburSahamPackage } from "@/lib/labursaham-offer";
import { previewCourses } from "@/lib/preview-courses";
import { ReferenceCard, type ReferencePattern, type ReferenceTone } from "./reference-card";
import { ImageDetailCard } from "./image-detail-card";

const tones: { id: ReferenceTone; label: string }[] = [
  { id: "gold", label: "Yellow" }, { id: "neutral", label: "Grey" }, { id: "blue", label: "Blue" },
];
const referenceFamilies: { id: ReferencePattern; label: string; sources: string; note: string }[] = [
  { id: "metric", label: "Progress & metrics", sources: "Mobile 01, 02, 03, 04", note: "One strong value, supporting facts and a clear progress shape." },
  { id: "activity", label: "Activity list", sources: "Mobile 01, 02, 03, 04", note: "Image, title, state and next action in one readable row." },
  { id: "appointment", label: "Session booking", sources: "Mobile 05", note: "Image-led session with date selection and generous card padding." },
  { id: "booking", label: "Booking pass", sources: "Mobile 08", note: "Compact itinerary with start, access and confirmation facts." },
  { id: "order", label: "Order status", sources: "Mobile 09, 11", note: "Status, progress and key facts remain grouped." },
  { id: "checkout", label: "Checkout review", sources: "Mobile 10 · Scout checkout", note: "Selected option, price breakdown, total and action stay close." },
  { id: "quick-actions", label: "Action tiles", sources: "Mobile 06, 09, 11", note: "Paired shortcuts with icons and descriptive labels." },
];
const typeRoles = [
  { token: "--font-h1", label: "H1 · MVP", element: "h1", example: "Fahami saham. Dengan ilmu.", desktop: 72, mobile: 32 },
  { token: "--font-h2", label: "H2 · section", element: "h2", example: "Kelas LaburSaham bersama AAA.", desktop: 40, mobile: 28 },
  { token: "--font-h3", label: "H3 · big cards", element: "h3", example: "Mula dengan asas.", desktop: 24, mobile: 20 },
  { token: "--font-h4", label: "H4 · small cards", element: "h4", example: "Belajar bersama AAA", desktop: 18, mobile: 16 },
  { token: "--font-paragraph", label: "Paragraph", element: "p", example: "Semak manfaat dan harga sebelum meneruskan.", desktop: 16, mobile: 14 },
  { token: "--font-small", label: "Small text", element: "small", example: "Tarikh contoh · Belum disahkan", desktop: 13, mobile: 12 },
] as const;
const weights = [
  { value: 400, token: "--font-weight-slim", label: "Slim", use: "Body and supporting copy" },
  { value: 500, token: "--font-weight-normal", label: "Normal", use: "Navigation and controls" },
  { value: 600, token: "--font-weight-medium", label: "Medium", use: "Card titles and details" },
  { value: 650, token: "--font-weight-bold", label: "Bold", use: "Hero and section headings" },
] as const;
const mainHomeTones: { id: ProgrammeCardTone; label: string }[] = [
  { id: "navy", label: "Navy · live on /v2" },
  { id: "gold", label: "Yellow · variation" },
  { id: "neutral", label: "Grey · variation" },
];
const memberActionTones: { id: MemberActionTone; label: string }[] = [
  { id: "blue", label: "Blue" }, { id: "yellow", label: "Yellow" }, { id: "grey", label: "Grey" },
];
const iconFrameVariants: { variant: IconFrameVariant; label: string }[] = [
  { variant: "outline", label: "Outlined" }, { variant: "navy", label: "Navy filled" },
  { variant: "gold", label: "Yellow filled" }, { variant: "muted", label: "Grey filled" },
  { variant: "navy-soft", label: "Navy surface" }, { variant: "gold-soft", label: "Yellow surface" },
  { variant: "light", label: "White surface" },
];

function SectionHeading({ number, eyebrow, title, description, href }: { number: string; eyebrow: string; title: string; description: string; href?: string }) {
  return <div className="library-section-heading"><div><span className="library-section-number">{number} / {eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{href && <Link href={href}>Lihat halaman <span aria-hidden="true">↗</span></Link>}</div>;
}

export function DesignLibrary() {
  const [selectedPackage, setSelectedPackage] = useState<LaburSahamPackage>("Online+");
  const [selectedPayment, setSelectedPayment] = useState("FPX");
  const [imageCardSelected, setImageCardSelected] = useState(false);

  return <div className="design-library">
    <a className="skip-link" href="#library-main">Langkau ke kandungan</a>
    <header className="library-header"><div className="library-shell library-header-inner"><Link href="/" aria-label="Asri Ahmad Academy home"><Brand /></Link><span className="library-header-title">Component Library <small>Local review page</small></span><nav aria-label="Page links"><Link href="/">Home</Link>{process.env.NEXT_PUBLIC_AAA_SINGLE_PREVIEW !== "true" && <Link href="/home-2">Home 2</Link>}<Link href="/flow/public-02-programme-sales">Checkout</Link></nav></div></header>
    <main id="library-main" className="library-shell">
      <div className="library-intro"><span className="eyebrow">AAA · DESIGN SYSTEM REVIEW</span><h1>Shared patterns, in one place.</h1><p>These samples use the website’s type, button and spacing tokens. “Live” samples share their component or CSS owner with the site; reference concepts are candidates for your review.</p><nav className="library-jump" aria-label="Library sections"><a href="#foundations">Foundations</a><a href="#buttons">Buttons</a><a href="#live-cards">Live cards</a><a href="#main-v2">Main V2 card</a><a href="#home-two-picks">Home 2 picks</a><a href="#reference-patterns">Reference patterns</a></nav></div>

      <section id="foundations" className="library-section"><SectionHeading number="01" eyebrow="FOUNDATIONS" title="Type, color and spacing" description="The six live type roles below use the established sizes from the main /v2 page, including its mobile breakpoints." />
        <div className="library-type-panel library-panel"><h3>Six shared text roles</h3><p>Real heading, paragraph and small-text samples; desktop and mobile use the same token names.</p><div className="library-type-list">{typeRoles.map((role) => { const Tag = role.element; return <div className="library-type-row" key={role.token}><span className="library-type-label"><strong>{role.label}</strong><code>{role.token}</code></span><Tag className={`library-type-sample library-type-${role.element}`}>{role.example}</Tag><span className="library-type-values"><strong>{role.desktop}px</strong><span>desktop</span><b aria-hidden="true">→</b><strong>{role.mobile}px</strong><span>mobile</span></span></div>; })}</div></div>
        <div className="library-foundation-grid"><div className="library-panel"><h3>Four shared font weights</h3><p className="library-weight-intro">Consolidated from the established /v2 home page and used across the site.</p><div className="library-weight-list">{weights.map((weight) => <div key={weight.value}><code>{weight.value}</code><span style={{ fontWeight: `var(${weight.token})` }}>{weight.label} · Belajar dengan arah</span><small>{weight.use}</small></div>)}</div></div><div className="library-panel"><h3>Palette</h3><div className="library-swatches"><div><i className="library-swatch-navy" /><strong>One navy</strong><code>#102139</code></div><div><i className="library-swatch-gold" /><strong>Yellow</strong><code>#f8c345</code></div><div><i className="library-swatch-grey" /><strong>Grey</strong><code>--muted</code></div><div><i className="library-swatch-blue" /><strong>Light blue</strong><code>--secondary</code></div></div></div></div>
        <div className="library-panel library-icon-panel"><h3>Icon artwork</h3><p>The regular icon artwork and one shared round frame. The frame follows the checkout step icon size and outline across its color variants.</p><div className="library-icon-grid">{iconNames.map((name) => <div className="library-icon-sample" key={name}><Icon name={name} /><span>{name}</span></div>)}</div><h4>One icon frame · outlined and filled variants</h4><div className="library-icon-surfaces">{iconFrameVariants.map((item) => <div key={item.variant}><IconFrame name="book" variant={item.variant} /><span>{item.label}</span></div>)}</div></div>
        <div className="library-geometry"><div><strong>12px</strong><span>Small corner</span></div><div><strong>20px</strong><span>Card corner</span></div><div><strong>28px</strong><span>Feature corner</span></div><div><strong>Full pill</strong><span>Action corner</span></div></div>
        <div className="library-panel library-padding-panel"><h3>Four card padding roles</h3><p>Inherited from the main /v2 page. Mobile card insets are 70% of the established desktop values.</p><div className="library-padding-grid"><div data-padding="large"><span><strong>Large</strong><small>40px desktop · 28px mobile</small></span></div><div data-padding="medium"><span><strong>Medium</strong><small>22px desktop · 15.4px mobile</small></span></div><div data-padding="small"><span><strong>Small</strong><small>12px desktop · 8.4px mobile</small></span></div><div data-padding="text-line"><span><strong>Text line</strong><small>7px desktop · 4.9px mobile</small></span></div></div></div>
      </section>

      <section id="buttons" className="library-section"><SectionHeading number="02" eyebrow="ACTIONS" title="Buttons and interaction states" description="The actual shared Button component, including sizes, color variants, icons and disabled state." />
        <div className="library-panel library-buttons"><div><h3>Purpose</h3><p>Hover: filled blue and yellow darken. Neutral grey and white invert to navy.</p><div className="library-button-row"><Button>Primary action</Button><Button variant="secondary">Secondary action</Button><Button variant="outline">Outline action</Button><Button variant="ghost">Ghost action</Button><Button variant="destructive">Destructive</Button><Button variant="link">Text link</Button></div></div><div><h3>Size & content</h3><div className="library-button-row"><Button size="sm">Small</Button><Button>Default</Button><Button size="lg">Large</Button><Button><Icon name="payment" />Continue to payment</Button><Button variant="secondary"><Icon name="arrowLeft" />Back</Button><Button size="icon" aria-label="Search example"><Icon name="search" /></Button><Button disabled>Unavailable</Button></div></div></div>
        <div className="library-family"><div className="library-family-head"><h3>Context links · content width</h3><span>Shared: MemberContextLinks · account pages</span></div><div className="library-context-examples"><MemberContextLinks title="Akaun & tetapan" items={[{ label: "Notifikasi", icon: "bell", href: "/flow/member-39-pilihan-notifikasi" }, { label: "Privasi", icon: "shield", href: "/flow/member-40-privasi-akaun" }, { label: "Keselamatan", icon: "key", href: "/flow/member-38-keselamatan-akaun" }, { label: "Bantuan", icon: "help", href: "/flow/member-37-bantuan-peserta" }]} /><MemberContextLinks title="Pembelajaran" items={[{ label: "Kelas selesai", icon: "book", href: "/flow/member-42-kelas-selesai" }, { label: "Tempahan saya", icon: "calendar", href: "/flow/member-27-tempahan-saya" }]} /></div></div>
      </section>

      <section id="live-cards" className="library-section"><SectionHeading number="03" eyebrow="LIVE SITE" title="Current website components" description="Cards keep their established hover behavior. Selectable cards show a checked box. These samples share their component or styling owner with the website." href="/flow/public-02-programme-sales" />
        <div className="library-family"><div className="library-family-head"><h3>Three packages</h3><span>Shared: PackageBannerCard · checkout</span></div><div className="flow-programme-package-grid">{laburSahamPackages.map((offer) => <PackageBannerCard key={offer.id} offer={offer} active={selectedPackage === offer.id} onClick={() => setSelectedPackage(offer.id)} />)}</div></div>
        <div className="library-two-column"><div className="library-family"><div className="library-family-head"><h3>Card selection</h3><span>Shared: ChoiceCard · payment</span></div><div className="library-choice-stack"><ChoiceCard method="fpx" active={selectedPayment === "FPX"} label="FPX" description="Bayar melalui perbankan internet bank pilihan anda." onClick={() => setSelectedPayment("FPX")} /><ChoiceCard method="card" active={selectedPayment === "Kad"} label="Kad" description="Bayar menggunakan kad debit atau kredit Visa atau Mastercard." onClick={() => setSelectedPayment("Kad")} /></div></div><div className="library-family"><div className="library-family-head"><h3>Checkout progress and summary</h3><span>Shared: StepRail + CheckoutSummaryCard · checkout</span></div><div className="library-step-frame"><StepRail step={2} /></div><div className="library-summary"><CheckoutSummaryCard packageName={selectedPackage} format={selectedPackage === "Fizikal" ? "Seminar bersemuka" : "Webinar"} schedule="Akan diumumkan" total={`RM${laburSahamPackages.find((offer) => offer.id === selectedPackage)?.price}`} academyLabel="LaburSaham · AAA" note="Pratonton tempahan tanpa bayaran sebenar." /></div></div></div>
        <div className="library-family"><div className="library-family-head"><h3>Checkout notices</h3><span>Shared: CheckoutNotice · payment and status pages</span></div><div className="library-choice-stack"><CheckoutNotice icon="lock" title="Pembayaran belum diaktifkan." description="Maklumat kad dan perbankan tidak diminta atau disimpan di laman ini." /><CheckoutNotice status icon="history" title="Rujukan contoh AAA-ONL-001" description="Semak status dan butiran lanjut melalui pautan di bawah." /></div></div>
        <div className="library-two-column">
          <div className="library-family"><div className="library-family-head"><h3>Digital class card</h3><span>Shared: CourseCard · home catalogue</span></div><div className="library-course-sample"><CourseCard course={previewCourses[0]} /></div></div>
          <div className="library-family"><div className="library-family-head"><h3>Member action row · three tones</h3><span>Shared: MemberActionCard · account dashboard</span></div><div className="flow-dashboard-links flow-member-actions library-member-actions"><div>{memberActionTones.map((tone) => <div className="library-action-variant" key={tone.id}><span className="library-variation-label">{tone.label}</span><MemberActionCard item={memberActions[1]} tone={tone.id} /></div>)}</div></div></div>
        </div>
        <div className="library-family"><div className="library-family-head"><h3>Member dashboard feature</h3><span>Shared: MemberDashboardFeature · member dashboard</span></div><MemberDashboardFeature /></div>
        <div className="library-family"><div className="library-family-head"><h3>Staff action rows</h3><span>Shared: MemberActionCard · staff dashboard</span></div><div className="library-dashboard-samples"><StaffDashboardActions /></div></div>
        <div className="library-family"><div className="library-family-head"><h3>Dated class rows · three tones</h3><span>Shared: BookingCard · member bookings</span></div><div className="library-booking-variants">{memberActionTones.map((tone, index) => <div className="library-action-variant" key={tone.id}><span className="library-variation-label">{tone.label}{index < 2 ? " · live" : " · variation"}</span><BookingCard item={previewBookings[index === 1 ? 1 : 0]} tone={tone.id} /></div>)}</div></div>
        <div className="library-family"><div className="library-family-head"><h3>Learning resources banner</h3><span>Shared: MaterialsIntroBanner · member materials</span></div><MaterialsIntroBanner /></div>
        <div className="library-family"><div className="library-family-head"><h3>Materials surfaces</h3><span>Shared: MaterialCard · member materials</span></div><div id="materials-list" className="flow-materials-grid library-materials-grid">{materialItems.map((item) => <MaterialCard item={item} key={item.title} />)}</div></div>
        <div className="library-family"><div className="library-family-head"><h3>Member profile and address</h3><span>Shared: MemberProfileCard · member profile</span></div><MemberProfileCard /></div>
        <div className="library-family"><div className="library-family-head"><h3>Image left, details right</h3><span>Optional checkbox · blue, yellow, grey</span></div><div className="library-image-detail-grid">{memberActionTones.map((tone) => <div className="library-variation" key={tone.id}><span className="library-variation-label">{tone.label}{tone.id === "blue" ? " · selectable" : ""}</span><ImageDetailCard tone={tone.id} selectable={tone.id === "blue"} selected={tone.id === "blue" && imageCardSelected} onChange={setImageCardSelected} /></div>)}</div></div>
        <div className="library-family"><div className="library-family-head"><h3>Physical seminar dates</h3><span>Shared: MainHomeIntakeCard · home</span></div><MainHomeIntakeCard /></div>
        <div className="library-family"><div className="library-family-head"><h3>Class detail and curriculum</h3><span>Shared: ClassSalesPage · CourseCurriculum · individual class</span></div><ClassSalesPage course={previewCourses[2]} /></div>
        <div className="library-family"><div className="library-family-head"><h3>Individual class checkout</h3><span>Shared: ClassCheckoutPreview · class checkout</span></div><ClassCheckoutPreview course={previewCourses[2]} /></div>
      </section>

      <section id="main-v2" className="library-section"><SectionHeading number="04" eyebrow="MAIN V2" title="Image and colour split card" description="The navy card below is the same component used on the main /v2 page. Yellow and grey change only its surface and contrast colors." href="/" /><div className="library-main-variants">{mainHomeTones.map((tone) => <div className="library-family" key={tone.id}><div className="library-family-head"><h3>{tone.label}</h3><span>Shared: MainHomeProgrammeCard</span></div><MainHomeProgrammeCard tone={tone.id} /></div>)}</div></section>

      <section id="home-two-picks" className="library-section home-two"><SectionHeading number="05" eyebrow="HOME 2 PICKS" title="The two sections you chose" description="The same components render here and on Home 2. Other Home 2 sections are excluded." href={process.env.NEXT_PUBLIC_AAA_SINGLE_PREVIEW === "true" ? undefined : "/home-2"} /><div className="library-family"><div className="library-family-head"><h3>Programme feature + two supporting cards</h3><span>Shared: HomeTwoProgramCards</span></div><HomeTwoProgramCards /></div><div className="library-family"><div className="library-family-head"><h3>Help image banner</h3><span>Shared: HomeTwoHelpBanner</span></div><HomeTwoHelpBanner /></div></section>

      <section id="reference-patterns" className="library-section"><SectionHeading number="06" eyebrow="REFERENCE CONCEPTS" title="Additional card families in AAA colors" description="New card compositions appear in yellow, grey and blue. One-off hero designs stay on their existing pages; only the two selected Home 2 sections appear above." /><div className="library-reference-note">Sources: Mobile Concepts 01–11 in the local design archive, plus <a href="https://dribbble.com/shots/27758822-Scout-AI-Shopping-App-Price-Comparison-and-Checkout" target="_blank" rel="noreferrer">Scout AI price comparison and checkout ↗</a>. Reference 03’s cramped padding is deliberately excluded.</div>{referenceFamilies.map((family, index) => <div className="library-family" key={family.id} id={`pattern-${family.id}`}><div className="library-family-head"><div><h3>{String(index + 1).padStart(2, "0")} · {family.label}</h3><p>{family.note}</p></div><span>{family.sources}</span></div><div className="library-reference-grid">{tones.map((tone) => <div className="library-variation" key={tone.id}><span className="library-variation-label">{tone.label}</span><ReferenceCard pattern={family.id} tone={tone.id} /></div>)}</div></div>)}</section>
      <footer className="library-footer"><p>Local visual review only. Sample dates, learning progress, booking status and payment states are not live data.</p><Link href="#library-main">Back to top ↑</Link></footer>
    </main>
  </div>;
}
