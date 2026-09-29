"use client";

import Link from "next/link";
import { Icon, type IconName } from "@/components/home/icon";

export type AccountDockItem = { label: string; href: string; icon: IconName; section?: number };

export const previewAccountDock: AccountDockItem[] = [
  { label: "Dashboard", href: "/flow/member-26-akaun-utama", icon: "grid", section: 26 },
  { label: "My Bookings", href: "/flow/member-27-tempahan-saya", icon: "calendar", section: 27 },
  { label: "Materials", href: "/flow/member-31-bahan-kelas", icon: "book", section: 31 },
  { label: "Replays", href: "/flow/state-68-replay-tersedia", icon: "play", section: 68 },
  { label: "Payments", href: "/flow/member-32-bayaran-saya", icon: "receipt", section: 32 },
  { label: "Profile", href: "/flow/member-36-profil-saya", icon: "user", section: 36 },
];

export const realAccountDock: AccountDockItem[] = [
  { label: "Dashboard", href: "/dashboard?section=Ringkasan", icon: "grid" },
  { label: "My Registrations", href: "/dashboard?section=Pendaftaran%20saya", icon: "book" },
  { label: "My Bookings", href: "/dashboard?section=Tempahan", icon: "calendar" },
  { label: "Payments", href: "/dashboard?section=Pembayaran", icon: "receipt" },
  { label: "Profile", href: "/dashboard?section=Profil", icon: "user" },
];

export function AccountDock({ items, activeSection, label = "Navigasi akaun bawah" }: { items: AccountDockItem[]; activeSection?: number; label?: string }) {
  return <nav className={`mobile-bottom-navigation app-bottom-dock${items.length > 5 ? " app-bottom-dock-six" : ""}`} aria-label={label}>{items.map((item) => <Link key={item.href} className="app-dock-item" href={item.href} aria-label={item.label} aria-current={activeSection !== undefined && item.section === activeSection ? "page" : undefined}><Icon name={item.icon} /><span>{item.label}</span></Link>)}</nav>;
}
