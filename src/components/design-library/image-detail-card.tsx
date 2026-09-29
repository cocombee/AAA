import Image from "next/image";
import { assetPath } from "@/lib/site-path";

export type ImageDetailTone = "blue" | "yellow" | "grey";

export function ImageDetailCard({ tone, selectable = false, selected = false, onChange }: { tone: ImageDetailTone; selectable?: boolean; selected?: boolean; onChange?: (value: boolean) => void }) {
  const content = <>
    <span className="library-image-detail-art"><Image src={assetPath("/images/course-asas-crisp.webp")} alt="Buku, nota dan komputer untuk pembelajaran saham" fill sizes="(max-width: 700px) 100vw, 220px" /></span>
    <span className="library-image-detail-copy"><small>LABURSAHAM · ONLINE</small><strong>Fahami dahulu. Praktik bersama.</strong><span>Kenali asas pasaran, risiko dan langkah membuat keputusan dalam satu sesi.</span><em>3 jam · Nota kelas</em></span>
    {selectable && <span className="selection-control library-image-detail-check" data-selected={selected} aria-hidden="true" />}
  </>;
  const className = "library-image-detail-card";
  return selectable ? <label className={className} data-tone={tone}>
    <input type="checkbox" checked={selected} onChange={(event) => onChange?.(event.target.checked)} aria-label="Pilih kelas LaburSaham" />{content}
  </label> : <article className={className} data-tone={tone}>{content}</article>;
}
