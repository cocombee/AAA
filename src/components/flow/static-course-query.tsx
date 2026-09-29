"use client";

import type { ComponentProps } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FlowScreen } from "@/components/flow/flow-screen";
import { ClassCheckoutPage } from "@/components/flow/class-sales";
import { CheckoutFooter, CheckoutHeader } from "@/components/flow/checkout-ui";
import { Button } from "@/components/ui/button";
import { previewCourses } from "@/lib/preview-courses";

// Static hosting resolves the URL query in the browser. The regular application
// keeps resolving it on the server before rendering the selected course.
export function StaticCourseFlow({ screen }: { screen: ComponentProps<typeof FlowScreen>["screen"] }) {
  const query = useSearchParams();
  return <FlowScreen screen={screen} courseId={query.get("course") ?? undefined} />;
}

export function StaticClassCheckout() {
  const query = useSearchParams();
  const course = previewCourses.find((item) => item.id === query.get("course"));
  if (course) return <ClassCheckoutPage course={course} />;
  return <div className="flow-site flow-checkout-site"><CheckoutHeader backHref="/flow/public-03-class-catalogue" backLabel="Kembali ke kelas" /><main className="page-shell flow-main-only"><section className="flow-card"><h1>Pilih kelas dahulu.</h1><p>Kelas yang dipilih tidak ditemui. Pilih kelas untuk meneruskan pembelian.</p><div className="flow-actions"><Button asChild><Link href="/flow/public-03-class-catalogue">Lihat kelas</Link></Button></div></section></main><CheckoutFooter /></div>;
}
