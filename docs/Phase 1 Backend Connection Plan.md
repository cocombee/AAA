# Phase 1 backend connection plan

Updated 30 September 2026. This separates the reviewable `/v2` static preview from the future authenticated sales application. The preview contains training records and cannot create accounts, bookings, payments or staff changes. The existing public site stays in place.

## Current evidence

| Area | Current state | Required connection |
| --- | --- | --- |
| Public pages and class discovery | Responsive preview with linked class details, search and topic filters; format choices appear in programme/class details | Versioned published catalogue from the application API |
| Identity | Google provider configured in Supabase; server login route exists | Complete real sign-in, refresh, sign-out and approved-user test |
| Member data | `aaa_member_bookings` and `aaa_member_orders` read-model migration is a draft | Apply/test migration and connect authoritative booking/order writers |
| Checkout | Choice and quote presentation only; no charge | Server quote, seat hold, order, hosted gateway and verified callback |
| Ticket, Zoom and replay | Training records and demonstrative player | Booking-scoped entitlement, time-bound delivery and revocation |
| Staff | Training-only screens | Restricted staff identity, scoped commands, audit and reconciliation |
| Support/notifications | Screens and no-backend states | Case service, delivery outbox and preference enforcement |

## Ownership and contracts

Keep the first implementation in one application and PostgreSQL database with module boundaries. The web and future native client use the same versioned API and member ID. Do not grant a browser database write role for booking, payment, capacity, ticket or staff commands.

| Module | Owns | Contract to expose |
| --- | --- | --- |
| Identity | Google OAuth, AAA member mapping, session and role assertions | `GET /api/v1/me`; session-aware sign-in/out; staff authorization checked on every command |
| Catalogue | Programme, class, offer, package, inclusion, venue and intake versions | `GET /api/v1/catalogue` with query/topic/format; `GET /api/v1/classes/{id}`; published version and sale window |
| Availability | Capacity, seat requirements and expiring holds | `POST /api/v1/quotes` accepts class/session/package/extras, returns an expiring server price and availability; `POST /api/v1/holds` is idempotent |
| Orders | Participant details, tax/receipt facts, order status and enrollment | `POST /api/v1/orders` accepts quote and idempotency key; `GET /api/v1/me/orders/{id}` returns member-owned status |
| Payments | Hosted provider session, signed callbacks, retries and reconciliation | `POST /api/v1/orders/{id}/payment-session`; provider webhook endpoint; no card or banking credentials pass through AAA forms |
| Access | Physical ticket, check-in, Zoom instructions, sold benefits | `GET /api/v1/me/bookings/{id}`; ticket/Zoom grants issued only after confirmed entitlement; staff check-in and revocation commands |
| Operations | Offers, sessions, attendee roster, refund/reschedule, support and audit | `/api/v1/staff/*` with least-privilege roles and MFA; each mutation records actor, target, reason and timestamp |
| Messaging | Confirmation, reminders, support replies and user preferences | Transactional outbox after committed state changes; delivery retries and suppression rules |

The consequential transaction must commit order status, one aggregated seat allocation, enrollment/access intent and outbox intent atomically. Gateway calls happen outside database locks. Duplicate requests and callbacks must produce one order outcome. Display pending fulfillment until downstream delivery succeeds.

## Data and migration sequence

1. Confirm the real programme names, dates, venues, capacities, prices, packages, workbook, replay terms, refund policy and operational owners. The current `previewCourses` data is fictional and cannot be imported as live offers.
2. Test Google OAuth and member isolation with at least two approved test accounts. Apply the draft read-model migration in development only after checking grants, RLS policies, indexes and rollback. Extend with catalogue/offer versions, holds, orders, payment events, enrollments, access grants, support cases, staff roles and append-only audit events.
3. Add server commands and real PostgreSQL integration tests for last-seat races, double callbacks, price changes, cancellation/refund, ticket reuse and expired access. Every migration must be additive first; backfill and tighten constraints after old-client compatibility is proven.
4. Use provider sandbox payments with signed webhook verification and a reconciliation job. Map FPX and card availability from the selected provider, not the public sample bank list.
5. Connect member and staff screens to the API one module at a time. Replace preview fixtures only when the data owner and failure state are tested. Keep `/v2` clearly labeled and disconnected.

## Security and operational gates

- Keep Supabase publishable configuration separate from server secrets. Supabase secret/service-role credentials stay server-side; they bypass RLS. Set both table grants and RLS policies, including for views, and test cross-account denial. [Supabase RLS guidance](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Verify identity using `getClaims` or a fresh `getUser` on the server; never authorize from an unverified `getSession` user object. Current `/dashboard` uses `getUser`; the API still needs its own checks. [Supabase SSR guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs&queryGroups=framework).
- Do not store participant names, email, phone, credentials or payment information in preview local storage. Current preview stores only non-sensitive display choices. Live orders need server-side validation, CSRF/origin checks, rate limits, input limits and audit logging without card data.
- Run the dynamic application on a supported Node runtime behind a reverse proxy with HTTPS, request-size limits and rate limits. NameHero's observed Node 20 selector does not meet the installed Supabase SDK's Node requirement; a separate supported host and `/v2` routing plan must be proven before moving beyond static review. [Next.js self-hosting guidance](https://nextjs.org/docs/app/guides/self-hosting).
- Production release requires backup/restore rehearsal, migration rollback compatibility, monitor/alert ownership, failed-webhook replay, payment-to-order reconciliation, old-browser-tab testing, accessibility/device QA and a confirmed staffed support path.

## Release boundary

`/v2` is a design and interaction preview. It can ship after static route, visual and no-charge checks. Real registration, staff access and payment stay disabled until the complete Phase 1 sales, member and operations gate passes together. Then point the production application to the supported runtime, keep `/v2` as a separate review build, and compare published assets and API contract versions before switching traffic.
