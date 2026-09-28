-- Draft migration. Not applied or PostgreSQL-tested yet.
-- These are member-facing projections. Booking/payment commands will own writes.
-- No fixture seeding, client insert/update/delete, or inferred staff role.
begin;

create table public.aaa_member_bookings (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  title text not null,
  format text not null check (format in ('Online', 'Fizikal')),
  starts_at timestamptz not null,
  location text not null,
  status text not null check (status in ('confirmed', 'completed', 'cancelled')),
  cover text not null check (cover in ('asas', 'carta', 'portfolio', 'bengkel'))
);
create index aaa_member_bookings_owner_time on public.aaa_member_bookings (user_id, starts_at desc, id);
create index aaa_member_bookings_owner_status on public.aaa_member_bookings (user_id, status);
alter table public.aaa_member_bookings enable row level security;
revoke all on public.aaa_member_bookings from anon, authenticated;
grant select on public.aaa_member_bookings to authenticated;
create policy member_reads_own_bookings on public.aaa_member_bookings for select to authenticated
  using ((select auth.uid()) = user_id);

create table public.aaa_member_orders (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  reference text not null unique,
  title text not null,
  placed_at timestamptz not null,
  amount_minor bigint not null check (amount_minor >= 0 and amount_minor <= 9007199254740991),
  currency text not null default 'MYR' check (currency = 'MYR'),
  status text not null check (status in ('paid', 'pending', 'refunded'))
);
create index aaa_member_orders_owner_time on public.aaa_member_orders (user_id, placed_at desc, id);
create index aaa_member_orders_owner_status on public.aaa_member_orders (user_id, status);
alter table public.aaa_member_orders enable row level security;
revoke all on public.aaa_member_orders from anon, authenticated;
grant select on public.aaa_member_orders to authenticated;
create policy member_reads_own_orders on public.aaa_member_orders for select to authenticated
  using ((select auth.uid()) = user_id);

commit;
