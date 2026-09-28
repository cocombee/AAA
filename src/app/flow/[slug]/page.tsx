import { notFound } from "next/navigation";
import screens from "@/lib/figma-flow-screens.json";
import { FlowScreen } from "@/components/flow/flow-screen";
import "@/components/flow/flow.css";

export function generateStaticParams() {
  return screens.map((screen) => ({ slug: screen.slug }));
}

export default async function FlowPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const screen = screens.find((item) => item.slug === slug);
  if (!screen) notFound();
  return <FlowScreen screen={screen} />;
}
