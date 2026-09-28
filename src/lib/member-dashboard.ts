import "server-only";
import { createAuthClient } from "@/lib/supabase/server";

export type MemberBooking = {
  id: string; title: string; format: "Online" | "Fizikal";
  startsAt: string; location: string; status: "confirmed" | "completed" | "cancelled";
  cover: "asas" | "carta" | "portfolio" | "bengkel";
};
export type MemberOrder = {
  id: string; reference: string; title: string; placedAt: string;
  amountMinor: number; status: "paid" | "pending" | "refunded";
};
export type MemberDashboard = {
  name: string; email: string; preview: boolean;
  bookings: MemberBooking[]; orders: MemberOrder[];
  bookingsUnavailable: boolean; ordersUnavailable: boolean;
  counts: { upcoming: number | null; completed: number | null; pending: number | null };
};

/** Read models only. The upcoming booking/payment command layer owns writes. */
export async function loadMemberDashboard(user: { id: string; email?: string; user_metadata: Record<string, unknown> }): Promise<MemberDashboard> {
  const supabase = await createAuthClient();
  const name = typeof user.user_metadata.full_name === "string" ? user.user_metadata.full_name : "Ahli AAA";
  const base: MemberDashboard = { name, email: user.email ?? "", preview: false, bookings: [], orders: [], bookingsUnavailable: true, ordersUnavailable: true, counts: { upcoming: null, completed: null, pending: null } };
  if (!supabase) return base;
  const [bookings, orders, upcoming, completed, pending] = await Promise.all([
    supabase.from("aaa_member_bookings").select("id,title,format,starts_at,location,status,cover").eq("user_id", user.id).order("starts_at", { ascending: false }).limit(20),
    supabase.from("aaa_member_orders").select("id,reference,title,placed_at,amount_minor,status").eq("user_id", user.id).order("placed_at", { ascending: false }).limit(20),
    supabase.from("aaa_member_bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "confirmed"),
    supabase.from("aaa_member_bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "completed"),
    supabase.from("aaa_member_orders").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "pending"),
  ]);
  return {
    ...base,
    bookingsUnavailable: Boolean(bookings.error), ordersUnavailable: Boolean(orders.error),
    counts: { upcoming: upcoming.error ? null : upcoming.count, completed: completed.error ? null : completed.count, pending: pending.error ? null : pending.count },
    bookings: (bookings.data ?? []).map(row => ({ id: row.id, title: row.title, format: row.format, startsAt: row.starts_at, location: row.location, status: row.status, cover: row.cover })),
    orders: (orders.data ?? []).map(row => ({ id: row.id, reference: row.reference, title: row.title, placedAt: row.placed_at, amountMinor: row.amount_minor, status: row.status })),
  };
}
