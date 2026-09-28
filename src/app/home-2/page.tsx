import { notFound } from "next/navigation";
import { HomepageTwo } from "@/components/home/homepage-two";
import { previewEnabled } from "@/lib/supabase/config";
import "@/components/home/homepage-two.css";

export default function HomeTwoPage() {
  if (!previewEnabled()) notFound();
  return <HomepageTwo />;
}
