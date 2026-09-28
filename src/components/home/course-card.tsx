import { assetPath } from "@/lib/site-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Course, money } from "@/lib/preview-courses";
import { Icon } from "./icon";

export function CourseCover({course, sizes = "(max-width: 700px) 50vw, (max-width: 1150px) 45vw, 24vw"}: {course: Course; sizes?: string}) {
  return <div className={`course-cover cover-${course.cover}`} aria-hidden="true">
    <Image src={assetPath(`/images/course-${course.id}-crisp.webp`)} alt="" fill quality={90} sizes={sizes} className="course-cover-photo" />
    <div className="cover-shade" />
    <div className="cover-title">{course.shortTitle}</div>
    <span className="cover-label">{course.topic}</span>
  </div>;
}

export function CourseCard({course, onPreview}: {course: Course; onPreview: (course: Course, trigger: HTMLButtonElement) => void}) {
  return <article className="course-card">
    <CourseCover course={course} />
    <div className="course-content">
      <div className="course-badges"><Badge variant="secondary">{course.level}</Badge><Badge variant="outline">{course.format}</Badge></div>
      <h3>{course.title}</h3>
      <p className="course-description">{course.description}</p>
      <div className="course-meta"><Icon name="calendar" /><span>{course.date}</span></div>
      <div className="course-location">{course.location} <span>· {course.duration}</span></div>
      <div className="course-bottom"><div><span className="price-label">Harga</span><strong>{money(course.price)}</strong></div><Button variant="outline" size="sm" onClick={e=>onPreview(course,e.currentTarget)} aria-label={`Lihat kelas ${course.title}`}>Lihat kelas</Button></div>
    </div>
    <div className="course-compact">
      <span className="course-compact-format">{course.format}</span>
      <h3>{course.cardTitle}</h3>
      <span className="course-compact-meta">{course.cardMeta}</span>
      <div className="course-compact-bottom"><strong>{money(course.price)}</strong><button type="button" onClick={e=>onPreview(course,e.currentTarget)} aria-label={`Lihat kelas ${course.title}`}><span aria-hidden="true">→</span></button></div>
    </div>
  </article>;
}
import Image from "next/image";
