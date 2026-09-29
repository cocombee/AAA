"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type Course } from "@/lib/preview-courses";
import { Button } from "@/components/ui/button";

export function CoursePreview({course}: {course: Course}) {
  const previewHref = `/flow/public-10-aaa-class-sales?course=${course.id}`;
  return <div className="course-preview">
    <div className="course-badges"><Badge variant="secondary">{course.level}</Badge><Badge variant="outline">{course.format}</Badge></div>
    <p>{course.description}</p>
    <dl className="preview-facts"><div><dt>Pembelajaran</dt><dd>Rakaman · Ikut masa sendiri</dd></div><div><dt>Tempoh</dt><dd>{course.duration}</dd></div></dl>
    <h3>Apa yang anda akan pelajari</h3>
    <ul className="outcome-list">{course.outcomes.map(x=><li key={x}>{x}</li>)}</ul>
    <div className="course-preview-action"><Button asChild><Link href={previewHref}>Lihat butiran kelas</Link></Button><p className="preview-disclaimer">Kelas dan harga yang dipaparkan ialah contoh. Pendaftaran dan pembayaran belum diaktifkan.</p></div>
  </div>;
}
