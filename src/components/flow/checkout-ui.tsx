"use client";

import Link from "next/link";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/home/icon";
import { Button } from "@/components/ui/button";
import { type IconName } from "@/components/home/icon";
import { IconFrame } from "@/components/ui/icon-frame";
import { money } from "@/lib/preview-courses";
import { type laburSahamPackages } from "@/lib/labursaham-offer";

export function CheckoutHeader({ backHref = "/", backLabel = "Kembali ke laman utama" }: { backHref?: string; backLabel?: string }) {
  return <header className="site-header flow-checkout-header"><div className="page-shell header-inner"><Link href="/" className="brand" aria-label="Asri Ahmad Academy halaman utama"><Brand /></Link><Button asChild variant="ghost" size="sm"><Link href={backHref}><Icon name="arrowLeft" />{backLabel}</Link></Button></div></header>;
}

export function CheckoutFooter() {
  return <footer className="page-shell flow-checkout-footer"><span>© 2026 Asri Ahmad Academy</span><Link href="/flow/public-06-help-and-faq">Perlu bantuan?</Link></footer>;
}

export function StepRail({ step }: { step: number }) {
  return <div className="flow-steps" aria-label="Langkah pendaftaran">{([{ label: "Pakej", icon: "book" }, { label: "Peserta", icon: "user" }, { label: "Bayaran", icon: "payment" }, { label: "Status", icon: "search" }] as const).map((item, index) => <span key={item.label} className={index + 1 === step ? "is-active" : index + 1 < step ? "is-complete" : ""} aria-current={index + 1 === step ? "step" : undefined}><IconFrame name={item.icon} variant={index + 1 === step ? "gold" : index + 1 < step ? "navy" : "outline"} className="flow-step-node" /><span className="flow-step-label">{String(index + 1).padStart(2, "0")} · {item.label}</span></span>)}</div>;
}

export function CheckoutNotice({ icon, title, description, status = false }: { icon: IconName; title: string; description: string; status?: boolean }) {
  return <div className={status ? "flow-checkout-note" : "flow-payment-note"}><IconFrame name={icon} variant="outline" /><span><strong>{title}</strong><small>{description}</small></span></div>;
}

export function ChoiceCard({ active, label, description, onClick, benefits, method }: { active: boolean; label: string; description: string; onClick: () => void; benefits?: readonly string[]; method: "fpx" | "card" }) {
  return <button className={`flow-choice-card ${active ? "is-active" : ""}`} type="button" aria-pressed={active} onClick={onClick}>
    {method === "fpx" ? <IconFrame label="FPX" variant="light" /> : <IconFrame name="payment" variant="light" />}
    <span className="flow-choice-copy">
      <strong>{label}</strong>
      <span className="flow-choice-description">{description}</span>
      {benefits && <span className="flow-choice-benefits">{benefits.map((benefit) => <span key={benefit}><span aria-hidden="true">✓</span>{benefit}</span>)}</span>}
    </span>
    <span className="selection-control flow-choice-indicator" data-selected={active} aria-hidden="true" />
  </button>;
}

export function PackageBannerCard({ offer, active, onClick }: { offer: (typeof laburSahamPackages)[number]; active: boolean; onClick: () => void }) {
  return <button type="button" className={`flow-package-banner flow-package-banner-${offer.id.toLowerCase().replace("+", "-plus")} ${active ? "is-active" : ""}`} aria-pressed={active} onClick={onClick}>
    <span className="flow-package-banner-hero">
      <span className="flow-package-banner-top"><span>{offer.id === "Fizikal" ? "SEMINAR BERSEMUKA" : offer.id === "Online+" ? "DIGITAL LENGKAP" : "WEBINAR"}</span><span className="selection-control flow-choice-indicator" data-selected={active} aria-hidden="true" /></span>
      <span className="flow-package-banner-identity"><IconFrame name={offer.id === "Fizikal" ? "users" : offer.id === "Online+" ? "book" : "video"} variant={offer.id === "Fizikal" ? "navy-soft" : offer.id === "Online+" ? "gold-soft" : "light"} /><strong className="flow-package-banner-title">{offer.title}</strong></span>
      <span className="flow-package-banner-description">{offer.description}</span>
      <span className="flow-package-banner-price"><del>{money(offer.originalPrice)}</del><span><strong>{money(offer.price)}</strong><small>/ seorang</small></span></span>
    </span>
    <span className="flow-package-banner-benefits">{offer.benefits.map((benefit) => <span key={benefit}><span aria-hidden="true">✓</span>{benefit}</span>)}</span>
    <span className="flow-package-banner-tradeoff">{offer.id === "Online" ? "Webinar sahaja; rakaman dan bahan tidak disertakan." : offer.id === "Online+" ? "+ RM30 untuk rakaman dan bahan digital." : "+ RM50 daripada Online+ untuk seminar dan bahan bercetak."}</span>
  </button>;
}

export function CheckoutSummaryCard({ packageName, format, schedule, total, academyLabel = "LaburSaham · Asri Ahmad Academy", note }: { packageName: string; format?: string; schedule: string; total: string; academyLabel?: string; note?: string }) {
  return <aside className="flow-card flow-summary">
    <span className="eyebrow">TEMPAHAN ANDA</span>
    <h2>Ringkasan tempahan</h2>
    <div className="flow-summary-details">
      <div className="flow-summary-product"><IconFrame name="book" variant="outline" /><span><strong>From Zero to Hero</strong><small>{academyLabel}</small></span></div>
      <dl className="aaa-detail-rows">
        <div><dt>Pakej</dt><dd>{packageName}</dd></div>
        {format && <div><dt>Format</dt><dd>{format}</dd></div>}
        <div><dt>Jadual</dt><dd>{schedule}</dd></div>
        <div className="flow-summary-total"><dt>Jumlah</dt><dd><strong>{total}</strong></dd></div>
      </dl>
    </div>
    {note && <p>{note}</p>}
  </aside>;
}
