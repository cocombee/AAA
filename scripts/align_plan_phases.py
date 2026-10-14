"""Apply the user's phase correction to derived plans; preserve original source maps."""
from pathlib import Path
from zipfile import ZipFile
import json
import re
import shutil
import uuid
import xml.etree.ElementTree as ET

root = Path('/Users/mrkokom/Library/CloudStorage/GoogleDrive-cocombees@gmail.com/My Drive/AAA Podcast/Website/Plan')
output = Path(__file__).resolve().parents[3] / 'outputs'
backup = output / 'Plan Backups' / 'Before Phase Alignment'
backup.mkdir(parents=True, exist_ok=True)
files = ['AAA ONE Improved Website Plan.md', 'AAA ONE Implementation Handoff.md', 'AAA ONE Start Here.md', 'AAA ONE Hosting And Payments.md', 'AAA ONE Improved Roadmap.xmind']
if '### Phase scope correction — user instruction, 27 September 2026' in (root / files[0]).read_text():
    print('This phase correction is already applied. No files changed.')
    raise SystemExit(0)
for name in files:
    if not (backup / name).exists():
        shutil.copy2(root / name, backup / name)

phase_map = {'0': '1', '1': '1', '2': '1', '3': '1', '4': '2', '5A': '3', '5B': '4', '6': '5', '7': '6'}
def remap(text):
    text = text.replace('Phases 2–3', 'Phase 1').replace('Phases 1–3', 'Phase 1').replace('Phases 0–1', 'Phase 1')
    return re.sub(r'Phase (5A|5B|[0-7])\b', lambda m: 'Phase ' + phase_map[m[1]], text)

scope = '''### Phase scope correction — user instruction, 27 September 2026

**Phase 1 is the complete LaburSaham-direction sales/registration product**, with AAA's own design: landing and campaign/program sales pages, Google login, customer and admin backends, online/physical session selection, optional package upgrades/add-ons, Malaysian payment methods, confirmation/receipt, physical tickets and check-in, online Zoom/joining information, support, cancellations/rescheduling/refunds, notifications, audited attendance/completion and suitable next-program suggestions. Fulfil every sold material/replay benefit. Safe releases, recovery, accessibility and scalable shared web/mobile contracts are part of Phase 1.

**Phase 2 adds the Udemy-style learning platform**: searchable course catalogue/categories/filtering, course cards/comparison, learning paths/library, self-paced classroom, video/lessons/progress/resume, relevant assessments/certificates, course Q&A/reviews and retention/community where justified. Do not expose these modules in Phase 1 merely because their future data model exists.

LaburSaham is a reference for the existing business offer and registration flow, not a visual design to copy. AAA means **Asri Ahmad Academy**; use its real logo and the user-selected grey-suit trophy portrait. Keep shadcn/Audyt interface discipline and the corrected **15 shared type sizes**.

The prior numbered foundation/public-preview/backend/shipping phases are now internal work slices within Phase 1, not four separate product releases. This correction supersedes their old numbering and the old launch catalogue navigation. Native apps, approved vendors and advanced research/AI keep their later independent gates. Fresh accounts only; no historical migration.

'''

phases = '''## 9. Delivery phases and gates

Phases are complete product outcomes, not separate frontend/backend releases. Track planned → implemented → tested → deployed → user accepted. Mock screens, a provider adapter or a passing build do not establish production readiness.

```mermaid
flowchart LR
  P1[1 Sales registration accounts tickets Zoom and admin] --> P2[2 Udemy-style catalogue and recorded learning]
  P1 --> P3[3 Native companion after stable contracts]
  P1 --> P4[4 Approved-provider pilot after operations mature]
  P2 --> P5[5 Research and selected AI]
  P5 --> P6[6 Advanced finance discovery]
```

### Phase 1 — Complete sales, registration, user and admin product

The public direction follows LaburSaham's current sales/campaign/registration journey with an original AAA design. Home explains AAA, highlights the current programme/campaign and leads into a programme sales page. Multiple real offers may have their own sales pages; this does not require a Udemy marketplace or catalogue/filter grid. Build the frontend first as a preview, then complete all release-one operations before shipping.

Internal slices:

1. **Foundation proof:** confirm real offers/intakes/venues/capacity, prices, inclusion/replay terms, completion rules and operational owners; prove Supabase identity/data and the reusable admin bridge; inspect NameHero; choose gateway and recovery level. Trial Google login on the free development tier before purchasing production services.
2. **Sales and checkout:** AAA-branded landing/campaign/programme sales pages, audience/outcomes/agenda/instructor/trust, online/physical sessions, optional package upgrades/extras, visible totals, clear terms/refund/support and responsive states. No catalogue/search/category dashboard or self-paced classroom navigation.
3. **Customer backend:** actual Google OAuth and fresh account, dashboard with registrations/upcoming and past sessions, individual booking, ticket or Zoom access, receipts/payments, account/privacy/support, notifications and recovery. Keep demo fixtures isolated. Password recovery follows the identity provider if the account uses Google.
4. **Admin backend:** restricted staff login/MFA, programme/offer/intake/session/venue/capacity publishing, package configuration, attendee roster and bounded exports, learner lookup, tickets/check-in, online joining details and access window, payment exceptions/reconciliation, refund/cancel/reschedule, support and audit. Reuse established admin infrastructure where the capability trial passes; no unrestricted infrastructure dashboard for event staff.
5. **Registration and fulfilment:** server-owned quotes and immutable order terms; transactional shared-seat holds; gateway-hosted payment entry; verified idempotent callbacks; expiry and late-success resolution; durable confirmation/notification work; sold replay/material access when promised. Curated same-level/eligible higher-level programme suggestions follow audited completion. They are simple recommendations to programme sales pages, not a lesson platform.
6. **Pilot and safe ship:** actual online and physical journeys, account isolation, accessibility/device and realistic campaign-load tests; migration/old-client compatibility, operational monitoring, deployment/rollback and timed restore/reconciliation rehearsal. Sales + customer + admin are one first shipping gate.

**Ticket/Zoom contract:** a confirmed physical booking receives a ticket reference and individually scoped opaque QR token. Store a token hash; scan/check-in is an authorized staff command, audit repeated scans and revocation, and never expose a member's identity through a public QR lookup. Reissue/reschedule/cancel changes preserve booking history and revoke superseded access. Online joining details are supplied only to the entitled attendee under the configured session window; use Zoom registration/individual join URLs where the account/API permits, or a protected authorised-information flow with defined manual delivery. Do not publish reusable credentials in sales pages. A join click or ticket scan alone does not prove completion. Calendar and reminder details use MYT and the correct session revision.

**Phase 1 acceptance:**

- One real online and one real physical programme/intake can be published, purchased, confirmed and managed end to end.
- Actual Google identity survives refresh, sign-out/recovery and separates accounts; website/native-ready API uses the same learner ID.
- Customer sees only their booking/receipt and permitted ticket or Zoom instructions; staff see only authorized operational scope.
- Optional extras begin unselected; upgrades clearly replace package benefits; order totals and snapshots match provider payment evidence.
- Concurrent last-seat requests cannot oversell. Duplicate/out-of-order callbacks cannot duplicate seats, money effects, tickets or grants. Ambiguous/late/duplicate charges enter explicit reconciliation/refund handling.
- Admin can reconcile, refund/cancel/reschedule, issue/revoke/check tickets, manage Zoom instructions, export rosters and record audited attendance/completion.
- Every sold material/replay benefit is delivered, including expiring protected replay when promised; a full LMS remains Phase 2.
- Completion produces curated same-level/eligible next-level programme suggestions without auto-enrolment or duplicate owned offers.
- Notifications, support, privacy/terms, safe updates, backup/restore and operational ownership are exercised.

### Phase 2 — Udemy-style course discovery and online learning

Add searchable course catalogue/categories, meaningful filters/sort/pagination and course comparison/cards; structured course detail, related courses and learning paths; personal recorded library; protected media processing and accessible lesson classroom; captions/transcripts, resources, progress/resume across devices, versioned curriculum, assessments/certificates only where required. Add Q&A, verified reviews, alumni/community and retention only with moderation, access rules and a real need. Subscriptions wait for recurring value and defined economics.

Use the actual inspected Udemy patterns here, adapted to AAA rather than copied visually. Phase 1 orders, bookings, tickets and Zoom continue to work; additive migrations and stable entitlements prevent breaking existing customers.

Gate: meaningful catalogue inventory and course content exist; paid/granted playback and expiry, cross-device progress, content revision updates, recoverability, accessibility and moderation are verified. Recognized CPD remains a separate verified product requirement.

### Phase 3 — Native companion

Can begin after Phase 1 account/booking contracts stabilize, independently of Phase 2's full LMS. Start with login, registrations, ticket/Zoom/session details and notifications; add library/playback/progress after Phase 2 contracts stabilize. Native UI adapts navigation, gestures, safe areas and platform media. Decide store purchase policy before native commerce. Downloads need rights, expiry, secure local storage and conflict rules.

Gate: same identity/bookings/purchases across web/iOS/Android, deep links and recovery, real-device accessibility and old-client compatibility. Recheck [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/) and [Google Play Billing](https://developer.android.com/google/play/billing) for the actual offerings.

### Phase 4 — Approved-provider pilot and later self-service

Start after Phase 1 operations and merchant/content/support terms work. Recorded-course vendor supply additionally needs Phase 2 media contracts. Invite approved providers first; scoped drafts, review, attribution, statements and manual settlement. Expand to applications, teams and automated payouts after reconciliation proves reliable.

Gate: provider isolation, independent approval, rollback, learner continuity after suspension/exit, complaints and refund/settlement evidence. No public self-publishing in Phase 1.

### Phase 5 — Research, market tools and selected AI

Owned editorial/IPO research and licensed attributed data precede watchlists/screeners. Add a cited educational assistant over approved entitlement-filtered material if useful. Keep this off checkout's request path.

Gate: rights, provenance, freshness/stale states, costs, evaluation and correction processes. [Bursa licensing guidance](https://assist.bursamalaysia.com/hc/en-us/articles/16107177667599-Will-market-data-licensing-policies-be-revised-or-will-they-remain-unchanged).

### Phase 6 — Optional advanced finance discovery

Portfolio imports, advanced scoring, broker connections/trading and regional expansion are separately scoped products. Require data rights, consent, correction/reconciliation, specialist review and operational ownership. Never collect broker passwords. Personalized investment advice needs its own business/regulatory review; [SC investment adviser guidance](https://www.sc.com.my/regulation/guidelines/investment-advisers).

'''

public = '''### Public website structure

**Phase 1 navigation:** Programmes/current campaign · About AAA · FAQ/help · Log in/My account. The landing page supports a sales and registration journey, not a marketplace. Multiple programme sales pages are allowed, but a searchable course catalogue, category/filter grid and learning-path navigation belong to Phase 2.

| Page | Phase | Main job |
| --- | --- | --- |
| Home/landing/campaign | 1 | AAA proposition, current programme offer, credible instructor/trust, programme CTA, registration explanation and FAQ. |
| Programme sales page | 1 | Audience/outcomes/agenda, online/physical sessions and location, package benefits/upgrades/extras, dates/prices/terms and register CTA. |
| Checkout/confirmation | 1 | Signed-in learner, server quote, optional configuration, payment, confirmed booking and next access step. |
| Instructor/About | 1 | Verified AAA/person information and relevant current programme links. |
| Help/policies | 1 | Buying/joining/ticket/replay FAQs, support, privacy/terms and cancellation/refund information. |
| Owned resources | Optional 1 | Existing podcast/article/video material with rights and clear related programme links. |
| Course catalogue/categories/comparison | 2 | Search/filter/sort/pagination, meaningful categories, course cards, empty/error and URL state. |
| Course detail/learning paths | 2 | Structured curriculum/lesson previews, prerequisites, related courses and suitable sequences. |

LaburSaham may remain a separate campaign landing site linking into the new programme sales/checkout flow. It is current-business direction, not a design to copy. Public offers remain readable without login; ticket/Zoom and member information are private.

'''

p = root / files[0]
s = remap(p.read_text())
s = s.replace('### Decisions established by the user\n', scope + '### Decisions established by the user\n', 1)
s = s.replace('- Multiple classes and courses; inspect the actual Udemy UI before borrowing its patterns. labursaham.com is current-business context only.', '- Phase 1 follows the LaburSaham-direction landing/sales/registration flow plus full customer/admin operations, ticket/Zoom delivery and the other registration release features. Phase 2 adds the Udemy-style catalogue and online-learning UI; inspect actual Udemy when implementing that phase.')
s = s.replace('- AAA supplies the initial catalog; approved/registered vendors may supply courses later.', '- AAA supplies Phase 1 programmes and the Phase 2 course catalogue; approved/registered vendors follow a later gated pilot.')
s = s.replace('AAA course catalog first, curated external-provider pilot later, then self-service vendor operations.', 'AAA registration product first, Udemy-style catalogue/LMS in Phase 2, then curated external providers and later self-service.')
s = s.replace('Borrow the useful Udemy patterns:', 'For Phase 2, borrow the useful Udemy patterns:')
s = s.replace('### Catalog model', '### Programme foundation and later catalogue model')
s = s[:s.index('### Public website structure')] + public + s[s.index('### Member website structure'):]
s = s.replace('**Registration launch:** desktop navigation **Overview · My Classes · Purchases**', '**Phase 1 registration launch:** desktop navigation **Overview · My Registrations · Bookings/Tickets · Payments**')
s = s.replace('My Classes separates upcoming and past bookings', 'My Registrations separates upcoming and past bookings')
s = s.replace('Later add **My Learning** for recordings', 'Phase 2 adds **My Learning** for recordings')
s = s.replace('Launch: next booked class, booking/payment state and announcements. Later LMS: Continue learning. New accounts get useful discovery.', 'Phase 1: next registration, ticket/Zoom access, booking/payment state and announcements. Phase 2: Continue learning. New accounts get current programme links.')
s = s.replace('| My Classes | Upcoming/past bookings; date/format/venue or online joining; receipt/support; canceled/rescheduled/waiting states. |', '| My Registrations / Bookings | Phase 1: upcoming/past bookings; physical ticket/QR or authorised Zoom instructions; date/format/venue, receipt/support and cancellation/reschedule states. |')
s = s.replace('| My Learning | In-progress/completed', '| My Learning | Phase 2: in-progress/completed').replace('| Classroom | Accessible video player', '| Classroom | Phase 2: accessible video player')
s = s.replace('Use proven platform capabilities, keep AAA business rules modular, and validate the integrations in a small Phase 1 capability trial.', 'Use proven platform capabilities, keep AAA business rules modular, and validate them in the Phase 1 foundation capability trial.')
s = s.replace('**Phase 1 capability trial:**', '**Phase 1 foundation capability trial:**')
s = s.replace('**Implementation starting point:** read the companion `AAA ONE Implementation Handoff.md`, then implement Phase 1 in the user\'s authorized implementation stage.', '**Implementation starting point:** read the companion `AAA ONE Implementation Handoff.md`, then implement the complete Phase 1 registration product in the user\'s authorized implementation stage.')
s = s[:s.index('## 9. Delivery phases and gates')] + phases + s[s.index('## 10. Quality, privacy and release evidence'):]
s = s.replace('| 4 | Catalog | Phase 1; provider-aware from foundation. |', '| 4 | Catalog | Phase 2 Udemy-style discovery; programme/provider foundations exist in Phase 1. |')
s = s.replace('Core launch records: Accounts,', 'Core Phase 1 launch records: Tickets, TicketTokens, CheckIns, OnlineJoinGrants, Accounts,')
p.write_text(s)

p = root / files[1]
s = remap(p.read_text())
s = s.replace('## Latest user decisions — do not reopen by accident\n', '## Latest user decisions — do not reopen by accident\n\n' + scope)
s = s.replace('Phase 1 capability trial:', 'Phase 1 foundation capability trial:')
s = s.replace('Phase 1 preview: home → catalog → course/intake detail → package/extras → review.', 'Phase 1 preview: AAA landing/campaign → programme sales/session → package/extras → checkout review. No Udemy course catalogue, search/category filters or learning-path navigation.')
s = s.replace('Continue Phase 1 customer/admin/backend vertical slices; ship only after Phase 1\'s full gate.', 'Complete Phase 1 customer/admin/backend vertical slices, ticket/check-in and Zoom access; ship only after the complete Phase 1 gate.')
s = s.replace('filters, changing totals,', 'session selection, ticket/Zoom states, changing totals,')
start = s.index('| Phase | Outcome |')
end = s.index('## Invariants and evidence', start)
s = s[:start] + '''| Phase | Outcome |
| --- | --- |
| 1 | Complete LaburSaham-direction landing/sales, Google identity, customer/admin backends, package/checkout/payment, physical ticket/check-in, online Zoom access, receipts/support/refunds/reschedule, completion suggestions, sold benefits and safe-shipping gates |
| 2 | Udemy-style catalogue/search/categories/comparison/paths plus recorded classroom/video/progress/library and justified retention |
| 3 | Native companion after shared identity/registration contracts stabilize; LMS capability follows Phase 2 readiness |
| 4 | Approved-provider pilot, then self-service and settlement automation |
| 5 | Licensed research/data and evaluated educational AI |
| 6 | Separately scoped advanced portfolio/broker/finance products |

''' + s[end:]
s = s.replace('Begin Phase 1\'s backend/admin proof and Phase 1 responsive public preview', 'Begin Phase 1\'s backend/admin proof and registration-focused public preview, including tickets/Zoom and all release-one operations; keep Udemy-style features in Phase 2')
s += '\n## Current implementation location and evidence\n\nCanonical source: `/Users/mrkokom/Library/CloudStorage/GoogleDrive-cocombees@gmail.com/My Drive/Codex/Apps/AAA Website/work/Website`. Read task outputs for current implemented/tested/blocked states; planning is not runtime evidence. The parent task cwd discrepancy remains documented separately. Do not migrate existing users or seed design fixtures into real accounts.\n'
p.write_text(s)

p = root / files[2]
s = remap(p.read_text())
s = s.replace('## What the first release includes', scope + '## What the first release includes', 1)
s = s.replace('Browse real classes, choose online/physical intake', 'Open the programme sales page, choose online/physical session')
s = s.replace('See booking, receipt, joining/attendance instructions', 'See booking, receipt, physical ticket/QR or authorised Zoom details')
s = s.replace('Roster, check-in, reschedule/cancel and audited support', 'Roster, ticket issuance/revocation/check-in, Zoom access, reschedule/cancel and audited support')
s = s.replace('The plan is based on actual Udemy desktop inspection: discovery cards, comparison rows/filters, course details and learner area. Adapt these to AAA\'s class dates, locations and packages.', 'Phase 1 follows the current LaburSaham sales/registration direction with original AAA design. Actual Udemy desktop inspection informs Phase 2 discovery, comparison/filtering, course cards and learner/classroom surfaces. Do not expose the latter in Phase 1.')
start = s.index('```mermaid', s.index('## Phases'))
end = s.index('```', start + 3) + 3
s = s[:start] + phases[phases.index('```mermaid'):phases.index('```', phases.index('```mermaid') + 3) + 3] + s[end:]
s = s.replace('Status: planning completed; architecture/provider candidates need the documented implementation trial. No application built, paid services selected, deployment performed or original source modified.', 'Status: phase scope corrected from the latest user instruction. A local AAA sales-landing/account implementation is in progress; actual Google/provider access, admin/payment/fulfilment and production gates are not yet verified. No paid service or customer charge has been made.')
p.write_text(s)

p = root / files[3]
s = remap(p.read_text())
s = s.replace('## Recommended direction\n', '## Recommended direction\n\n**Phase scope update:** Phase 1 is the complete landing/sales + customer/admin + payment + physical ticket/check-in + online Zoom-access registration product. Include optional upgrades, completion suggestions, notifications/support/refund/reschedule, sold replay/material benefits and safe-shipping gates. Phase 2 adds the Udemy-style catalogue and online learning. The master plan owns the detailed boundaries.\n', 1)
s = s.replace('The first shipping gate remains sales pages + customer account/backend + admin operations for online and physical classes.', 'The Phase 1 shipping gate is sales pages + customer account/backend + admin operations for online and physical programmes, including physical tickets/check-in and authorised Zoom joining information.')
s += '\n## Free development trial versus paid production\n\nUser authorized trying the recommended stack. Supabase Free supports the development identity/database trial; Pro starts at US$25/month as checked 27 September 2026. Free projects can pause and lack automatic backups; this is not the production recovery gate. The existing US$187 worked production example is not the immediate development bill or an approved purchase. Use existing NameHero only after checking its exact Node/application capabilities. [Supabase pricing](https://supabase.com/pricing), [cPanel Node.js availability](https://docs.cpanel.net/cpanel/meridian/websites/deploy-a-website-with-nodejs/).\n'
p.write_text(s)

# Keep both current and legacy XMind content consistent, retaining all five sheets.
p = root / files[4]
with ZipFile(p) as z:
    entries = {info.filename: (info, z.read(info.filename)) for info in z.infolist()}
data = json.loads(entries['content.json'][1])
replace_titles = {
    'AAA catalog first': 'AAA programmes first; Udemy catalogue in Phase 2',
    'Actual Udemy desktop UI inspected': 'Actual Udemy UI inspected for Phase 2; Phase 1 follows LaburSaham business flow',
    'Search/filter real published classes': 'Phase 1: programme sales page and offered session selection; catalogue/search in Phase 2',
    'My Classes: upcoming and past': 'My Registrations: upcoming/past, physical tickets and online Zoom details',
    'Booking details, receipts, venue or authorized joining': 'Booking/receipt, opaque ticket QR or authorised Zoom joining details',
    'Planning only; no implementation or purchases': 'Local implementation underway; actual provider and shipping gates unverified; no purchases',
    'Mobile web prioritizes classes, checkout and sharing': 'Phase 1 mobile web prioritizes programme registration, ticket/Zoom and checkout',
}
def walk(topic):
    topic['title'] = replace_titles.get(topic.get('title'), topic.get('title'))
    for group in topic.get('children', {}).values():
        for child in group: walk(child)
for sheet in data: walk(sheet['rootTopic'])
def topic(title, children=None):
    value = {'id': uuid.uuid4().hex[:24], 'title': title}
    if children: value['children'] = {'attached': [topic(x) for x in children]}
    return value
phase_root = data[-1]['rootTopic']
continuity = phase_root['children']['attached'][-1]
phase_root['children']['attached'] = [
    topic('Phase 1: complete registration product', [
        'LaburSaham-direction landing and programme sales, original AAA design',
        'Foundation/admin proof, real offers, hosting/recovery and scalable shared contracts',
        'Actual Google login and customer registrations/payments/account dashboard',
        'Restricted admin publishing, rosters, refunds/reschedule and audit',
        'Package upgrades/optional extras, Malaysian payments and verified fulfilment',
        'Physical ticket/opaque QR/reissue/revocation and authorised check-in',
        'Online Zoom details or individual join links with access windows',
        'Receipt, notifications/support and every sold material/replay benefit',
        'Audited completion and curated same/next-level programme recommendations',
        'Online/physical pilot; capacity/permission/payment/load/rollback/restore gates',
        'Sales + customer + admin accepted together; no Udemy catalogue/LMS UI',
    ]),
    topic('Phase 2: Udemy-style discovery and learning', [
        'Searchable course catalogue/categories/filters/sort/pagination and course cards',
        'Course comparison, structured detail and learning paths',
        'Recorded library, protected classroom/video/lessons/progress/resume',
        'Curriculum revisions, relevant assessments/certificates and resources',
        'Q&A/reviews/alumni/retention only with moderation and defined access',
        'Phase 1 bookings/tickets/Zoom/payment stay compatible and operational',
    ]),
    topic('Later independent gates', [
        '3 Native registration companion after stable contracts; LMS when ready',
        '4 Approved-provider pilot, then self-service and settlement',
        '5 Licensed research/data and evaluated educational AI',
        '6 Separately scoped advanced finance/broker discovery',
    ]), continuity,
]
entries['content.json'] = (entries['content.json'][0], json.dumps(data, ensure_ascii=False, indent=2).encode())
ns = 'urn:xmind:xmap:xmlns:content:2.0'
ET.register_namespace('', ns)
xml = ET.fromstring(entries['content.xml'][1])
by_id = {}
def index(t):
    by_id[t['id']] = t
    for group in t.get('children', {}).values():
        for child in group: index(child)
for sheet in data: index(sheet['rootTopic'])
for node in xml.iter(f'{{{ns}}}topic'):
    matching = by_id.get(node.attrib['id'])
    if matching is not None:
        node.find(f'{{{ns}}}title').text = matching['title']
def xml_topic(t):
    element = ET.Element(f'{{{ns}}}topic', id=t['id'])
    ET.SubElement(element, f'{{{ns}}}title').text = t['title']
    attached = t.get('children', {}).get('attached', [])
    if attached:
        groups = ET.SubElement(ET.SubElement(element, f'{{{ns}}}children'), f'{{{ns}}}topics', type='attached')
        for child in attached: groups.append(xml_topic(child))
    return element
for node in xml.iter(f'{{{ns}}}topic'):
    if node.attrib['id'] == phase_root['id']:
        old = node.find(f'{{{ns}}}children')
        if old is not None: node.remove(old)
        replacement = xml_topic(phase_root).find(f'{{{ns}}}children')
        node.append(replacement)
        break
entries['content.xml'] = (entries['content.xml'][0], ET.tostring(xml, encoding='utf-8', xml_declaration=True))
temp = p.with_suffix('.xmind.updating')
with ZipFile(temp, 'w') as z:
    for info, content in entries.values(): z.writestr(info, content)
with ZipFile(temp) as z:
    assert z.testzip() is None
    assert len(json.loads(z.read('content.json'))) == 5
    ET.fromstring(z.read('content.xml'))
temp.replace(p)

# Verify no superseded numbered delivery headings or catalogue-first launch remain.
master = (root / files[0]).read_text()
assert '### Phase 0' not in master and '### Phase 7' not in master
assert 'Primary navigation at launch: **Courses' not in master
assert 'Phase 2 — Udemy-style' in master
print('Updated and verified:', ', '.join(files))
print('Backups:', backup)
print('Original source XMind maps, PNG boards and PDF were not changed.')
