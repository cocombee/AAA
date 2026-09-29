import { notFound } from "next/navigation";
import { Suspense } from "react";
import screens from "@/lib/figma-flow-screens.json";
import { previewEnabled } from "@/lib/supabase/config";
import { FlowScreen } from "@/components/flow/flow-screen";
import { StaticCourseFlow } from "@/components/flow/static-course-query";
import "@/components/flow/flow.css";

export function generateStaticParams() {
  return screens.map((screen) => ({ slug: screen.slug }));
}

export default async function FlowPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ course?: string | string[] }> }) {
  const { slug } = await params;
  if (!previewEnabled()) notFound();
  const screen = screens.find((item) => item.slug === slug);
  if (!screen) notFound();
  if (process.env.AAA_STATIC_EXPORT === "true" && screen.group === "public" && Number(screen.number) === 10) {
    return <Suspense fallback={<main className="page-shell flow-main-only"><p role="status">Memuatkan kelas…</p></main>}><StaticCourseFlow screen={screen} /></Suspense>;
  }
  const query = screen.group === "public" && Number(screen.number) === 10 ? await searchParams : undefined;
  const courseId = typeof query?.course === "string" ? query.course : undefined;
  return <FlowScreen screen={screen} courseId={courseId} />;
}
