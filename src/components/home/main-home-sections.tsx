import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { laburSahamPackage } from "@/lib/labursaham-offer";
import { money } from "@/lib/preview-courses";
import { assetPath } from "@/lib/site-path";

export type ProgrammeCardTone = "navy" | "gold" | "neutral";

const physicalPreviewDates = [
  { value: "2026-10-24", day: "24", month: "OKT" },
  { value: "2026-11-07", day: "07", month: "NOV" },
] as const;

export function MainHomeIntakeCard() {
  const offer = laburSahamPackage("Fizikal");
  return <div className="intake-panel">
    <div className="section-title">
      <span className="eyebrow">SESI BERSEMUKA</span>
      <h2>Belajar bersama.<br />Tanya terus.</h2>
      <p>From Zero to Hero turut ditawarkan sebagai seminar fizikal. Tarikh ini ialah contoh paparan; jadual sebenar belum diumumkan.</p>
      <Button className="intake-explore" asChild><Link href="/flow/public-02-programme-sales?package=Fizikal">Lihat pakej Fizikal <span aria-hidden="true">→</span></Link></Button>
    </div>
    <div className="intake-list">{physicalPreviewDates.map((date) => <Link className="intake-row" href={`/flow/public-02-programme-sales?package=Fizikal&previewDate=${date.value}`} key={date.value}>
      <span className="date-tile"><strong>{date.day}</strong><span>{date.month}</span></span>
      <span className="intake-text"><strong>From Zero to Hero · Fizikal</strong><small>Seminar saham patuh syariah bersama Datuk Haji Mohd Asri</small><span>Tarikh contoh · Belum disahkan</span></span>
      <span className="intake-price">{money(offer.price)}<small>/ seorang</small></span>
    </Link>)}</div>
  </div>;
}

export function MainHomeProgrammeCard({ tone = "navy" }: { tone?: ProgrammeCardTone }) {
  const onlineOffer = laburSahamPackage("Online");
  return <div className="programme-offer" data-tone={tone}>
    <div className="programme-image">
      <picture>
        <source media="(max-width: 700px)" srcSet={assetPath("/images/course-asas.webp")} />
        <Image src={assetPath("/images/programme-study-v2.webp")} alt="Buku, nota dan komputer untuk pembelajaran pelaburan" fill quality={90} sizes="(max-width: 700px) 90vw, 600px" />
      </picture>
      <span>SAHAM PATUH SYARIAH</span>
    </div>
    <div className="programme-copy section-title">
      <span className="eyebrow">FROM ZERO TO HERO · LABURSAHAM</span>
      <h3>Mula dengan ilmu.<br />Pilih cara belajar.</h3>
      <p>Kuasai asas saham patuh syariah, cari peluang pasaran dan fahami cara mengurus risiko bersama Datuk Haji Mohd Asri.</p>
      <ul>
        <li>Online · Webinar dan akaun saham CGS International</li>
        <li>Online+ · Tambah rakaman, eBook, eWorkbook dan sesi bonus</li>
        <li>Fizikal · Seminar, bahan lengkap dan buku bercetak</li>
      </ul>
      <div className="programme-action">
        <div><del>{money(onlineOffer.originalPrice)}</del><strong>{money(onlineOffer.price)}</strong></div>
        <Button asChild className="programme-register"><Link href="/flow/public-02-programme-sales">Daftar sekarang <span className="action-arrow" aria-hidden="true">→</span></Link></Button>
      </div>
    </div>
  </div>;
}
