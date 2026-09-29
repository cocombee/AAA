import { notFound } from "next/navigation";
import { DesignLibrary } from "@/components/design-library/design-library";
import { previewEnabled } from "@/lib/supabase/config";
import "@/components/flow/flow.css";
import "@/components/home/homepage-two.css";
import "@/components/design-library/design-library.css";

export default function DesignLibraryPage() {
  if (!previewEnabled()) notFound();
  return <DesignLibrary />;
}
