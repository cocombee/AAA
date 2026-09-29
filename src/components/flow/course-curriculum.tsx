"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/home/icon";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { coursePreviewDemo, type Course } from "@/lib/preview-courses";

export function CourseCurriculum({ course, onPreview }: {
  course: Course;
  onPreview: (trigger: HTMLButtonElement) => void;
}) {
  const curriculumId = useId();
  const [expanded, setExpanded] = useState<string[]>(["section-0"]);
  const [expandedLessons, setExpandedLessons] = useState<string[]>([]);
  const sections = course.sections.map((section, index) => ({
    ...section,
    segments: index === 0 ? [coursePreviewDemo, ...section.segments] : section.segments,
  }));
  const allExpanded = expanded.length === sections.length;

  return <section className="class-sales-section" aria-labelledby={`${curriculumId}-heading`}>
    <div className="class-sales-section-heading">
      <h2 id={`${curriculumId}-heading`}>Kandungan kelas</h2>
      <Button variant="ghost" size="icon" className="class-curriculum-expand-all" aria-label={allExpanded ? "Tutup semua bahagian" : "Buka semua bahagian"} aria-expanded={allExpanded} aria-controls={`${curriculumId}-sections`} onClick={() => setExpanded(allExpanded ? [] : sections.map((_, index) => `section-${index}`))}>
        <Icon name="chevronDown" />
      </Button>
    </div>
    <p className="class-curriculum-intro">Rangka topik contoh untuk melihat perjalanan kelas, bahagian demi bahagian.</p>
    <Accordion type="multiple" value={expanded} onValueChange={setExpanded} className="class-sales-sections" id={`${curriculumId}-sections`}>
      {sections.map((section, index) => <AccordionItem value={`section-${index}`} key={section.title}>
        <AccordionTrigger>
          <strong>{section.title}</strong>
          <span className="class-curriculum-section-meta">{section.segments.length} segmen{section.duration ? ` · ${section.duration}` : ""}</span>
        </AccordionTrigger>
        <AccordionContent>
          <ol className="class-curriculum-lessons">
            {section.segments.map((segment, segmentIndex) => {
              const lessonKey = `${index}-${segmentIndex}`;
              const lessonOpen = expandedLessons.includes(lessonKey);
              const descriptionId = `${curriculumId}-lesson-${lessonKey}`;
              return <li key={segment.title}>
                <div className="class-curriculum-lesson-header">
                  <button type="button" className="class-curriculum-lesson-toggle" aria-expanded={lessonOpen} aria-controls={descriptionId} onClick={() => setExpandedLessons((current) => lessonOpen ? current.filter((key) => key !== lessonKey) : [...current, lessonKey])}>
                    <Icon name="video" /><span>{segment.title}</span><span className="accordion-plus" aria-hidden="true" />
                  </button>
                  {segment.preview && <Button variant="link" size="sm" className="class-curriculum-preview" onClick={(event) => onPreview(event.currentTarget)}><Icon name="play" />Pratonton</Button>}
                  <span className="class-curriculum-duration">{segment.duration ?? "Belum diterbitkan"}</span>
                </div>
                <p className="class-curriculum-lesson-description" id={descriptionId} hidden={!lessonOpen}>{segment.description}</p>
              </li>;
            })}
          </ol>
        </AccordionContent>
      </AccordionItem>)}
    </Accordion>
    <p className="class-sales-syllabus-note">Rangka ini ialah contoh. Kandungan akhir, video kelas dan tempoh setiap rakaman belum diterbitkan.</p>
  </section>;
}
