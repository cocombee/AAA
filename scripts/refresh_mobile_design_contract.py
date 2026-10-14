from pathlib import Path
from zipfile import ZipFile
import json,uuid,xml.etree.ElementTree as ET
root=Path('/Users/mrkokom/Library/CloudStorage/GoogleDrive-cocombees@gmail.com/My Drive/AAA Podcast/Website/Plan')
for p in root.glob('AAA ONE *.md'):
 if 'Original' in p.name:continue
 s=p.read_text().replace('| Course catalogue/categories/comparison | 2 |', '| Course catalogue/categories/comparison | 1 |').replace('AAA registration product first, Udemy-style catalogue/LMS in Phase 2, then curated external providers and later self-service.', 'AAA class discovery and registration product first, recorded LMS in Phase 2, then curated external providers and later self-service.').replace('For Phase 2, borrow the useful Udemy patterns: searchable catalog, categories, learning outcomes, curriculum previews, instructor profiles, clear offer terms, a personal library, lesson navigation, progress and appropriate reviews.', 'For Phase 1, use inspected Udemy discovery patterns: searchable catalogue, useful categories, image-led cards, learning outcomes, instructor context and clear class offers. Phase 2 adds recorded curriculum previews, personal library, lesson navigation, progress and appropriate moderated reviews.').replace('Phase 2 adds the Udemy-style catalogue and online-learning UI; inspect actual Udemy when implementing that phase.','Phase 1 restores AAA class discovery/cards/search below the single LaburSaham programme; Phase 2 adds recorded classroom/library/progress. Actual Udemy discovery has been inspected.').replace('AAA supplies Phase 1 programmes and the Phase 2 course catalogue;','AAA supplies Phase 1 programmes and the class catalogue;').replace('Use its source\'s','Use its source\'s')
 anchor='This instruction supersedes the earlier decision to defer catalogue/search/cards to Phase 2.'
 addition='**Reusable geometry:** small surfaces/fields 12px, medium cards 20px, large/featured cards 28px, action buttons pill-shaped. Map these named categories to shared web/native tokens rather than assigning a radius per screen. Keep mobile page gutters about 20–24px (18px only at the narrowest 320px fallback), card content 18–24px, deliberate section gaps and at least 44px touch targets. The dense green multi-screen reference is accepted for concepts only; explicitly reject its cramped padding. The selected dark portrait-banner crop guides the featured top: subject on the right, short copy on the left, one primary rounded registration action, legible text and no face/text collision. Preserve all other supplied app references as supporting concepts, ignoring their colours.\n\n'
 if addition not in s:s=s.replace(anchor,addition+anchor)
 p.write_text(s)
p=root/'AAA ONE Improved Roadmap.xmind'
with ZipFile(p)as z:entries={i.filename:(i,z.read(i.filename))for i in z.infolist()}
d=json.loads(entries['content.json'][1]);nodes={}
def collect(v):
 if isinstance(v,dict):
  if 'title'in v:nodes[v['title']]=v
  for x in v.values():collect(x)
 elif isinstance(v,list):
  for x in v:collect(x)
collect(d)
p1=nodes['Phase 1: class discovery and complete registration product']
x=ET.fromstring(entries['content.xml'][1]);ns={'x':'urn:xmind:xmap:xmlns:content:2.0'};xp1=next(t for t in x.findall('.//x:topic',ns) if t.get('id')==p1['id']).find('x:children/x:topics',ns)
for title in ['Shared corners: small 12 / medium 20 / large 28 / pill actions; keep 15 text sizes','App concepts only, AAA colours; roomy 20–24px mobile gutters/card padding; portrait banner without face/text collision']:
 if title in nodes:continue
 node={'id':uuid.uuid4().hex[:24],'title':title};p1['children']['attached'].append(node)
 t=ET.SubElement(xp1,'{'+ns['x']+'}topic',{'id':node['id']});ET.SubElement(t,'{'+ns['x']+'}title').text=title
with ZipFile(p,'w')as z:
 for name,(i,b)in entries.items():
  if name=='content.json':b=json.dumps(d,ensure_ascii=False).encode()
  if name=='content.xml':b=ET.tostring(x,encoding='utf-8',xml_declaration=True)
  z.writestr(i,b)
with ZipFile(p)as z:
 assert z.testzip()is None
 assert len(json.loads(z.read('content.json')))==5
 ET.fromstring(z.read('content.xml'))
print('Four plans and derived five-sheet roadmap include latest mobile padding and shared corner rules.')
