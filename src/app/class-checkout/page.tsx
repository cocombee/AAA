import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ClassCheckoutPage } from "@/components/flow/class-sales";
import { StaticClassCheckout } from "@/components/flow/static-course-query";
import { previewCourses } from "@/lib/preview-courses";
import { previewEnabled } from "@/lib/supabase/config";
import "@/components/flow/flow.css";

export default async function Page({ searchParams }: { searchParams: Promise<{ course?: string }> }) {
  if (!previewEnabled()) notFound();
  if (process.env.AAA_STATIC_EXPORT === "true") {
    return <Suspense fallback={<main className="page-shell flow-main-only"><p role="status">Memuatkan kelas…</p></main>}><StaticClassCheckout /></Suspense>;
  }
  const { course: courseId } = await searchParams;
  const course = previewCourses.find((item) => item.id === courseId);
  if (!course) notFound();
  return <ClassCheckoutPage course={course} />;
}
