"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/home/icon";
import { Button } from "@/components/ui/button";
import { IconFrame } from "@/components/ui/icon-frame";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutFooter, CheckoutHeader, CheckoutNotice, ChoiceCard } from "@/components/flow/checkout-ui";
import { CourseCurriculum } from "@/components/flow/course-curriculum";
import { assetPath } from "@/lib/site-path";
import { coursePreviewDemo, type Course, money } from "@/lib/preview-courses";

export function ClassSalesPage({ course }: { course: Course }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewTrigger = useRef<HTMLButtonElement>(null);
  const previewVideo = useRef<HTMLVideoElement>(null);
  const checkoutHref = `/class-checkout?course=${encodeURIComponent(course.id)}`;
  const openPreview = (trigger: HTMLButtonElement) => {
    previewTrigger.current = trigger;
    setPreviewOpen(true);
  };

  return <section className="class-sales-layout" aria-label={`Butiran ${course.title}`}>
    <div className="class-sales-main">
      <header className="class-sales-hero">
        <span className="eyebrow">{course.topic.toUpperCase()} · KELAS AAA</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>
        <div className="class-sales-facts"><span>{course.level}</span><span>{course.format}</span><span>{course.duration}</span></div>
      </header>

      <section className="class-sales-section" aria-labelledby="class-outcomes"><h2 id="class-outcomes">Apa yang anda akan pelajari</h2><ul className="class-sales-outcomes">{course.outcomes.map((outcome) => <li key={outcome}><span aria-hidden="true">✓</span>{outcome}</li>)}</ul></section>

      <CourseCurriculum course={course} onPreview={openPreview} />

      <section className="class-sales-section" aria-labelledby="class-details"><h2 id="class-details">Butiran kelas</h2><dl className="aaa-detail-rows class-sales-details"><div><dt>Format</dt><dd>Rakaman video</dd></div><div><dt>Pembelajaran</dt><dd>Ikut masa sendiri</dd></div><div><dt>Tempoh video</dt><dd>{course.duration}</dd></div><div><dt>Akses</dt><dd>Online</dd></div></dl></section>
    </div>

    <aside className="class-sales-purchase" aria-label="Pratonton dan pembelian kelas">
      <button type="button" className="class-sales-preview-trigger" onClick={(event) => openPreview(event.currentTarget)} aria-label={`Buka pratonton ${course.title}`}>
        <Image src={assetPath(`/images/course-${course.id}-crisp.webp`)} alt="" fill loading="eager" sizes="(max-width: 700px) 100vw, 340px" />
        <IconFrame name="play" variant="light" className="class-sales-preview-play" />
        <span className="class-sales-preview-caption">Tonton pratonton</span>
      </button>
      <div className="class-sales-purchase-copy">
        <div className="class-sales-purchase-price"><span className="class-sales-price-label">Harga kelas · contoh</span><strong>{money(course.price)}</strong></div>
        <ul className="class-sales-purchase-benefits"><li>Video mengikut bahagian</li><li>Belajar ikut masa sendiri</li></ul>
        <Button asChild><Link href={checkoutHref}>Beli kelas <span aria-hidden="true">→</span></Link></Button>
        <p>Pratonton pembelian. Pembayaran sebenar belum diaktifkan.</p>
      </div>
    </aside>

    <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
      <DialogContent className="class-video-dialog" showCloseButton={false} onCloseAutoFocus={(event) => { event.preventDefault(); previewTrigger.current?.focus(); }}>
        <div className="class-video-dialog-top"><span className="eyebrow">PRATONTON KELAS</span><DialogClose asChild><Button variant="ghost" size="icon" className="class-video-dialog-close" aria-label="Tutup pratonton"><span aria-hidden="true">×</span></Button></DialogClose></div>
        <DialogHeader><DialogTitle>{course.title}</DialogTitle><DialogDescription>Video demonstrasi tersedia. Rakaman khusus kelas ini belum diterbitkan.</DialogDescription></DialogHeader>
        <video ref={previewVideo} controls playsInline preload="metadata" poster={assetPath("/media/labursaham-demo-poster.webp")} aria-label="Video demonstrasi pemain AAA"><source src={assetPath("/media/labursaham-demo.webm")} type="video/webm" />Pelayar ini tidak menyokong video WebM.</video>
        <div className="class-video-samples"><h3>Video pratonton</h3>
          <div className="class-video-sample-item"><button type="button" className="class-video-sample-row is-active" onClick={() => { previewVideo.current?.play().catch(() => {}); }} aria-label="Mainkan video demonstrasi pemain AAA"><span className="class-video-sample-thumb"><Image src={assetPath("/media/labursaham-demo-poster.webp")} alt="" fill sizes="80px" /></span><span className="class-video-sample-title"><Icon name="play" /><strong>{coursePreviewDemo.title}</strong></span><small>{coursePreviewDemo.duration}</small></button></div>
          {course.sections.slice(0, 2).map((section) => <div className="class-video-sample-item" key={section.title}><div className="class-video-sample-row"><span className="class-video-sample-thumb"><Image src={assetPath(`/images/course-${course.id}-crisp.webp`)} alt="" fill sizes="80px" /></span><span className="class-video-sample-title"><Icon name="lock" /><strong>{section.segments[0].title}</strong></span><small>Belum diterbitkan</small></div></div>)}
        </div>
      </DialogContent>
    </Dialog>
  </section>;
}

export function ClassCheckoutPreview({ course }: { course: Course }) {
  const [method, setMethod] = useState<"FPX" | "Kad">("FPX");
  return <div className="class-checkout-preview"><div className="class-checkout-heading"><span className="eyebrow">PEMBELIAN KELAS · PRATONTON</span><h1>Semak pembelian kelas</h1><p>Semak kelas, jumlah dan cara bayaran sebelum meneruskan.</p></div><div className="class-checkout-grid"><section className="class-checkout-panel" aria-label="Butiran pembelian"><div className="class-checkout-course"><div className="class-checkout-image"><Image src={assetPath(`/images/course-${course.id}-crisp.webp`)} alt="" fill sizes="120px" /></div><div><span className="eyebrow">KELAS AAA · {course.format.toUpperCase()}</span><h2>{course.title}</h2><p>Rakaman video · Belajar ikut masa sendiri</p></div></div><div className="class-checkout-methods"><h2>Kaedah bayaran</h2><p>Pilih kaedah untuk melihat pilihan pembayaran.</p><div><ChoiceCard method="fpx" active={method === "FPX"} label="FPX / perbankan internet" description="Bayar melalui perbankan internet bank pilihan anda." onClick={() => setMethod("FPX")} /><ChoiceCard method="card" active={method === "Kad"} label="Kad debit / kredit" description="Bayar menggunakan kad debit atau kredit Visa atau Mastercard." onClick={() => setMethod("Kad")} /></div></div><CheckoutNotice icon="lock" title="Pembayaran belum diaktifkan." description="Pratonton ini tidak meminta maklumat peserta, kad atau perbankan dan tidak membuat pembelian sebenar." /></section><aside className="class-checkout-summary" aria-label="Ringkasan jumlah"><h2>Ringkasan</h2><div className="aaa-detail-rows"><div><span>Kelas</span><strong>{course.title}</strong></div><div><span>Harga contoh</span><strong>{money(course.price)}</strong></div></div><div className="class-checkout-total"><span>Jumlah</span><strong>{money(course.price)}</strong></div><Button disabled>Pembayaran belum tersedia</Button><Link href={`/flow/public-10-aaa-class-sales?course=${encodeURIComponent(course.id)}`}>Kembali ke butiran kelas</Link></aside></div></div>;
}

export function ClassCheckoutPage({ course }: { course: Course }) {
  return <div className="flow-site flow-checkout-site"><CheckoutHeader backHref={`/flow/public-10-aaa-class-sales?course=${encodeURIComponent(course.id)}`} backLabel="Kembali ke kelas" /><main className="page-shell flow-main-only"><ClassCheckoutPreview course={course} /></main><CheckoutFooter /></div>;
}
