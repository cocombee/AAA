"use client";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type Course, money } from "@/lib/preview-courses";
import { Button } from "@/components/ui/button";

export function CoursePreview({course}: {course: Course}) {
  const [packageChoice, setPackageChoice] = useState("standard");
  const [workbook, setWorkbook] = useState(false);
  const upgrade = packageChoice === "guided" ? 100 : 0;
  const featured = course.id.startsWith("labursaham-");
  const previewHref = featured
    ? `/flow/public-02-programme-sales?session=${course.format}&package=${packageChoice === "guided" ? "Bimbingan" : "Standard"}&workbook=${workbook ? "1" : "0"}`
    : `/flow/public-10-aaa-class-sales?course=${course.id}`;
  return <div className="course-preview">
    <div className="course-badges"><Badge variant="secondary">{course.level}</Badge><Badge variant="outline">{course.format}</Badge></div>
    <p>{course.description}</p>
    <dl className="preview-facts"><div><dt>Tarikh</dt><dd>{course.date}</dd></div><div><dt>Tempat</dt><dd>{course.location}</dd></div><div><dt>Tempoh</dt><dd>{course.duration}</dd></div></dl>
    <h3>Apa yang anda akan pelajari</h3>
    <ul className="outcome-list">{course.outcomes.map(x=><li key={x}>{x}</li>)}</ul>
    {featured && <><fieldset className="package-choice"><legend>Pilih pengalaman belajar</legend>
      <label className={packageChoice === "standard" ? "selected" : ""}><input type="radio" name={`package-${course.id}`} value="standard" checked={packageChoice === "standard"} onChange={()=>setPackageChoice("standard")} /><span><strong>Kelas standard</strong><small>Sesi kelas dan bahan asas.</small></span><b>{money(course.price)}</b></label>
      <label className={packageChoice === "guided" ? "selected" : ""}><input type="radio" name={`package-${course.id}`} value="guided" checked={packageChoice === "guided"} onChange={()=>setPackageChoice("guided")} /><span><strong>Kelas + sesi bimbingan</strong><small>Tambah satu sesi soalan bersama kumpulan.</small></span><b>+ {money(100)}</b></label>
    </fieldset>
    <label className={`extra-choice ${workbook ? "selected" : ""}`}><input type="checkbox" checked={workbook} onChange={e=>setWorkbook(e.target.checked)} /><span><strong>Buku latihan digital</strong><small>Tambahan pilihan. Tidak dipilih secara automatik.</small></span><b>+ {money(29)}</b></label>
    <div className="preview-total" role="status" aria-live="polite"><span>Jumlah contoh</span><strong>{money(course.price+upgrade+(workbook ? 29 : 0))}</strong></div></>}
    <Button asChild><Link href={previewHref}>{featured ? "Semak program & pilihan" : "Lihat butiran kelas"}</Link></Button>
    <p className="preview-disclaimer">Kelas dan harga yang dipaparkan ialah contoh. Pendaftaran dan pembayaran belum diaktifkan.</p>
  </div>;
}
