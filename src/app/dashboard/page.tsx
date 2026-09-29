import { redirect } from "next/navigation";
import { currentUser } from "@/lib/supabase/server";
import { loadMemberDashboard } from "@/lib/member-dashboard";
import { MemberDashboardView } from "@/components/account/member-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ error?: string; section?: string }> }) {
  const user = await currentUser();
  if (!user) redirect("/login");
  const data = await loadMemberDashboard(user);
  const { error, section } = await searchParams;
  return <MemberDashboardView data={data} signOutError={error === "signout"} initialSection={section} />;
}
