"""Apply the user's class-discovery restoration to derived plans only."""
from pathlib import Path
from zipfile import ZipFile
import json, re, shutil, xml.etree.ElementTree as ET
root = Path('/Users/mrkokom/Library/CloudStorage/GoogleDrive-cocombees@gmail.com/My Drive/AAA Podcast/Website/Plan')
output = Path(__file__).resolve().parents[3] / 'outputs'
backup = output / 'Plan Backups' / 'Before Class Discovery Restoration'
files = ['AAA ONE Improved Website Plan.md','AAA ONE Implementation Handoff.md','AAA ONE Start Here.md','AAA ONE Hosting And Payments.md','AAA ONE Improved Roadmap.xmind']
marker = '### Latest scope — class discovery restored to Phase 1, 27 September 2026'
if marker in (root / files[0]).read_text():
    print('Already applied; no changes.'); raise SystemExit
scope = '''### Latest scope — class discovery restored to Phase 1, 27 September 2026

**Phase 1 includes class discovery again**, restoring the original AAA homepage direction with the accepted repairs. The top remains dedicated to **one featured LaburSaham programme**, with online and physical attendance options under one programme identity. Below it, AAA supplies a searchable class catalogue, topic/format filters, image-led class cards, sales/detail pages, physical-session discovery and suitable same-level/eligible next-level class suggestions. Do not describe the online and physical versions of the featured programme as unrelated classes. Publish only real approved inventory; illustrative dates/prices stay explicitly marked until replaced.

Phase 1 still ships only when sales, actual Google login, customer and admin backends, server-owned package upgrades/extras, Malaysian payment, confirmation/receipts, seat control, physical tickets/check-in, protected Zoom information, notifications/support/refund/reschedule, audited completion and all sold replay/material benefits work together. Preserve scalable shared web/mobile contracts, safe live updates, recovery and isolation. Fresh accounts only; no historical migration.

**Phase 2 adds recorded self-paced learning**: personal lesson library, protected streaming classroom, curriculum/versioning, progress/resume across devices, assessments/certificates where required, moderated Q&A/reviews/community and justified retention. The course catalogue/cards/search have moved into Phase 1; a minimal sold replay benefit does not require the full LMS.

**Mobile design contract:** use the supplied six app references for composition and interaction, ignoring their colours. Keep AAA's own palette and shadcn/Audyt interface discipline. Mobile web is app-like from Phase 1: compact featured programme banner, image-led discovery rails/cards, short filters, readable metadata, persistent bottom navigation and full-page account screens. Shared semantic design tokens, card slots, information order, navigation destinations and states guide future native screens. Native apps reuse the account/API contracts and design specification; platform components, gestures, safe areas and keyboard/media behaviour are adapted. Avoid a second wholesale mobile redesign or a direct transfer of web DOM/shadcn code. Check 320/390/768/1440 CSS-pixel layouts, enlarged text, keyboard/focus and safe-area/last-row visibility. Keep exactly **15 shared text sizes**, +/− FAQ, solid menu icon and outlined utility icons. Use the original transparent AAA logo without a backplate; size images from the visible crop and device pixel ratio, preserve master assets and avoid repeat lossy compression.

This instruction supersedes the earlier decision to defer catalogue/search/cards to Phase 2. Existing ticket/Zoom/payment, native, approved-provider and research/AI gates remain in force. LaburSaham is current business context, not a UI design to copy.

'''
replacements = {
'P1[1 Sales registration accounts tickets Zoom and admin] --> P2[2 Udemy-style catalogue and recorded learning]':'P1[1 Featured LaburSaham class discovery registration accounts and admin] --> P2[2 Recorded learning classroom library and progress]',
'Udemy-style course discovery and online learning':'Recorded online learning, classroom and progress',
'Home explains AAA, highlights the current programme/campaign and leads into a programme sales page. Multiple real offers may have their own sales pages; this does not require a Udemy marketplace or catalogue/filter grid.':'Home highlights one LaburSaham programme with online/physical sessions, then restores AAA class discovery, search/topic/format filters and image-led cards leading to class sales pages.',
'No catalogue/search/category dashboard or self-paced classroom navigation.':'Include the searchable class catalogue, topic/format filters, cards and class sales pages; self-paced classroom navigation waits for Phase 2.',
'Add searchable course catalogue/categories, meaningful filters/sort/pagination and course comparison/cards; structured course detail, related courses and learning paths; personal recorded library;':'Extend the Phase 1 catalogue and class detail with a personal recorded library;',
'Use the actual inspected Udemy patterns here, adapted to AAA rather than copied visually.':'Use the inspected Udemy classroom/library patterns here; discovery/cards/search are already in Phase 1. Adapt to AAA rather than copying visually.',
'Gate: meaningful catalogue inventory and course content exist;':'Gate: Phase 1 discovery is operational and recorded course content exists;',
'**Phase 1 navigation:** Programmes/current campaign · About AAA · FAQ/help · Log in/My account. The landing page supports a sales and registration journey, not a marketplace. Multiple programme sales pages are allowed, but a searchable course catalogue, category/filter grid and learning-path navigation belong to Phase 2.':'**Phase 1 navigation:** Featured LaburSaham programme · AAA Classes/search · About AAA · FAQ/help · Log in/My account. Mobile provides persistent Utama/Classes/LaburSaham/Account navigation. The top promotes one programme with online/physical options; the catalogue below discovers other AAA-supplied classes. Curated class suggestions are in Phase 1; recorded lesson progress/library are Phase 2.',
'Phase 2 Udemy-style discovery; programme/provider foundations exist in Phase 1.':'Phase 1 AAA class discovery/search/filters/cards; approved external providers remain later.',
'Phase 1 preview: AAA landing/campaign → programme sales/session → package/extras → checkout review. No Udemy course catalogue, search/category filters or learning-path navigation.':'Phase 1 preview: featured LaburSaham programme → online/physical session → package/extras → checkout review, plus restored AAA class catalogue/search/topic/format filters and curated class suggestions.',
'Udemy-style catalogue/search/categories/comparison/paths plus recorded classroom/video/progress/library and justified retention':'Recorded classroom/video/progress/library, curriculum revisions and justified moderated retention; discovery/search/cards are Phase 1',
'Phase 1 follows the current LaburSaham sales/registration direction with original AAA design. Actual Udemy desktop inspection informs Phase 2 discovery, comparison/filtering, course cards and learner/classroom surfaces. Do not expose the latter in Phase 1.':'Phase 1 restores the original AAA class-discovery direction below one featured LaburSaham programme with online/physical options. Actual Udemy inspection informs Phase 1 discovery/cards/search and Phase 2 classroom/library. Supplied mobile app references guide structure and interaction, with AAA colours retained.',
'Phase 2 adds the Udemy-style catalogue and online learning.':'Phase 1 also includes AAA catalogue/search/filter/cards below the single featured LaburSaham programme. Phase 2 adds recorded online learning.',
'Keep Udemy-style discovery and recorded learning in Phase 2':'Keep recorded classroom/library/progress in Phase 2; class discovery is Phase 1',
}
updated = {}
for name in files[:-1]:
    text = (root/name).read_text()
    text = re.sub(r'### Phase scope correction — user instruction, 27 September 2026\n.*?(?=\n##[ #])', scope.rstrip()+'\n', text, flags=re.S)
    for old,new in replacements.items(): text=text.replace(old,new)
    if marker not in text:
        at=text.find('\n## '); text=text[:at]+'\n\n'+scope+text[at:] if at>=0 else text+'\n\n'+scope
    # Remove stale split where hosting summary used another spelling.
    text=text.replace('Phase 2 adds the Udemy-style catalogue and online-learning modules.', 'Phase 1 includes the restored class catalogue/search/filters/cards. Phase 2 adds recorded classroom/library/progress.')
    updated[name]=text
# Move existing discovery topics between phases in both XMind serializations.
with ZipFile(root/files[-1]) as z:
    entries={i.filename:(i,z.read(i.filename)) for i in z.infolist()}
content=json.loads(entries['content.json'][1])
nodes={}
def collect(v):
    if isinstance(v,dict):
        if 'title' in v:nodes[v['title']]=v
        for x in v.values():collect(x)
    elif isinstance(v,list):
        for x in v:collect(x)
collect(content)
p1=nodes['Phase 1: complete registration product'];p2=nodes['Phase 2: Udemy-style discovery and learning']
moved=p2['children']['attached'][:2]
p2['children']['attached']=p2['children']['attached'][2:]
p1['children']['attached'][1:1]=moved
renames={
'AAA programmes first; Udemy catalogue in Phase 2':'Featured LaburSaham programme first; AAA class catalogue in Phase 1',
'Actual Udemy UI inspected for Phase 2; Phase 1 follows LaburSaham business flow':'Udemy discovery inspected for Phase 1; mobile app references guide composition with AAA colours',
'Phase 1: programme sales page and offered session selection; catalogue/search in Phase 2':'Phase 1: one featured LaburSaham programme online/physical plus class catalogue/search/cards',
'Phase 1 mobile web prioritizes programme registration, ticket/Zoom and checkout':'Phase 1 app-like mobile web: compact banner, image cards, bottom navigation, account and ticket/Zoom',
'Phase 1: complete registration product':'Phase 1: class discovery and complete registration product',
'Phase 2: Udemy-style discovery and learning':'Phase 2: recorded learning classroom library and progress',
'Sales + customer + admin accepted together; no Udemy catalogue/LMS UI':'Sales + class discovery + customer + admin accepted together; recorded LMS remains Phase 2',
'Course comparison, structured detail and learning paths':'Class comparison, sales detail and curated same/next-level suggestions; recorded progression later',
'LaburSaham-direction landing and programme sales, original AAA design':'Single featured LaburSaham programme online/physical; original AAA design and accepted repairs',
}
for old,new in renames.items():
    if old in nodes:nodes[old]['title']=new
xml=ET.fromstring(entries['content.xml'][1]);ns={'x':'urn:xmind:xmap:xmlns:content:2.0'}
xmltopics={t.find('x:title',ns).text:t for t in xml.findall('.//x:topic',ns) if t.find('x:title',ns) is not None}
xp1=xmltopics['Phase 1: complete registration product'].find('x:children/x:topics',ns);xp2=xmltopics['Phase 2: Udemy-style discovery and learning'].find('x:children/x:topics',ns)
for idx,title in enumerate([m['title'] for m in moved],1):
    # Match by immutable id because JSON titles may have changed.
    m=moved[idx-1];xt=next(t for t in xp2 if t.get('id')==m['id']);xp2.remove(xt);xp1.insert(idx,xt)
for old,new in renames.items():
    if old in xmltopics:xmltopics[old].find('x:title',ns).text=new
backup.mkdir(parents=True,exist_ok=True)
for name in files:
    if not (backup/name).exists():shutil.copy2(root/name,backup/name)
for name,text in updated.items():(root/name).write_text(text)
with ZipFile(root/files[-1],'w') as z:
    for name,(info,data) in entries.items():
        if name=='content.json':data=json.dumps(content,ensure_ascii=False).encode()
        if name=='content.xml':data=ET.tostring(xml,encoding='utf-8',xml_declaration=True)
        z.writestr(info,data)
with ZipFile(root/files[-1]) as z:
    assert z.testzip() is None
    assert len(json.loads(z.read('content.json')))==5
    ET.fromstring(z.read('content.xml'))
print('Updated four derived Markdown plans and five-sheet derived XMind; originals untouched; prior edition backed up.')
