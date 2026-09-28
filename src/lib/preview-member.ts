import type { MemberDashboard } from "./member-dashboard";

/** Isolated design fixtures: never use for an authenticated member. */
export const previewMember: MemberDashboard = {
  name: "Nur Aina Ahmad", email: "ahli@example.com", preview: true,
  bookingsUnavailable: false, ordersUnavailable: false,
  counts: { upcoming: 2, completed: 1, pending: 0 },
  bookings: [
    { id: "sample-01", title: "Langkah pertama dalam pelaburan saham", format: "Online", startsAt: "2026-10-17T01:00:00Z", location: "Kelas langsung online", status: "confirmed", cover: "asas" },
    { id: "sample-02", title: "Baca carta dengan lebih yakin", format: "Fizikal", startsAt: "2026-10-24T01:00:00Z", location: "Kuala Lumpur · Lokasi akan diumumkan", status: "confirmed", cover: "carta" },
    { id: "sample-03", title: "Bengkel asas saham bersama AAA", format: "Fizikal", startsAt: "2026-09-05T01:00:00Z", location: "Shah Alam · Lokasi akan diumumkan", status: "completed", cover: "bengkel" },
  ],
  orders: [
    { id: "order-example-01", reference: "AAA-ONL-001", title: "Langkah pertama dalam pelaburan saham", placedAt: "2026-09-27T01:00:00Z", amountMinor: 19900, status: "paid" },
    { id: "order-example-02", reference: "AAA-PHY-002", title: "Baca carta dengan lebih yakin", placedAt: "2026-09-26T01:00:00Z", amountMinor: 34900, status: "paid" },
  ],
};
