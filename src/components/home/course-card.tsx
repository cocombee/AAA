import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/site-path";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Course, money } from "@/lib/preview-courses";

export function CourseCover({course, sizes = "(max-width: 700px) 50vw, (max-width: 1150px) 45vw, 24vw"}: {course: Course; sizes?: string}) {
  return <div className={`course-cover cover-${course.cover}`} aria-hidden="true">
    <Image src={assetPath(`/images/course-${course.id}-crisp.webp`)} alt="" fill quality={90} sizes={sizes} className="course-cover-photo" />
    <div className="cover-shade" />
    <div className="cover-title">{course.shortTitle}</div>
    <span className="cover-label">{course.topic}</span>
  </div>;
}

export function CourseCard({course}: {course: Course}) {
  return <Link className="course-card" href={`/flow/public-10-aaa-class-sales?course=${encodeURIComponent(course.id)}`} aria-label={`Lihat kelas ${course.title}`}>
    <CourseCover course={course} />
    <div className="course-content">
      <div className="course-badges"><Badge variant="secondary">{course.level}</Badge><Badge variant="outline">{course.format}</Badge></div>
      <h3>{course.title}</h3>
      <p className="course-description">{course.description}</p>
      <div className="course-bottom"><div><span className="price-label">Harga</span><strong>{money(course.price)}</strong></div><Button variant="outline" size="sm" asChild><span>Lihat kelas</span></Button></div>
    </div>
    <div className="course-compact">
      <div className="course-badges course-compact-badges"><Badge variant="secondary">{course.level}</Badge><Badge variant="outline">{course.format}</Badge></div>
      <h3>{course.cardTitle}</h3>
      <p className="course-description course-compact-description">{course.description}</p>
      <div className="course-compact-bottom"><strong>{money(course.price)}</strong><span className="course-compact-action" aria-hidden="true">→</span></div>
    </div>
  </Link>;
}
