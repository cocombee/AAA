<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AAA design consistency

- The design library route and its gallery-only components live on the `library` Git branch. `main` contains the website and all shared tokens/components. Keep the library current by merging `main` into `library`; compare shared component changes there before release. Do not restore the gallery route to `main`.
- Treat the established main `/v2` page as the source for typography and spacing. Use its six text roles (H1–H4, paragraph, small text) and its approved card padding tokens (large, medium, small, text line). Do not derive new tokens from the design library.
- Before changing a component, inspect the matching approved pattern on `/v2` or the nearest approved live component. Reuse its exact inset and title-to-description spacing; do not invent an extra gap, margin, border inset, status label, or decorative mark.
- Keep the design library and every live use of a shared component in sync. After each change, compare the rendered library and live page at desktop and mobile widths. Preserve the page's existing outer left and right alignment.
- Mobile card padding must inherit exactly 70% of the four established desktop card padding tokens. Keep page gutters separate from card padding. Audit computed padding and card content order on both widths before declaring the change complete.
- Use the shared `IconFrame` for card and step icons. The checkout step circle owns its diameter, glyph size, circular outline width, and regular icon artwork; cards choose only an approved filled or outlined color variant. Do not set icon box dimensions, corner radius, glyph dimensions, or thin artwork inside individual cards.

- Hover follows card role: full package/price comparison cards use the yellow outline; simple course lists, accordions and small white cards use a darker grey fill. Classify sibling groups together: large or dark selectable card groups keep yellow outlines; mostly white/bright medium or small groups use their default darker fill, including occasional colored variants. Keep keyboard focus separate from pointer hover.
- Clicking a class card opens its Udemy-style course detail page with learning outcomes, section-by-section curriculum, a purchase panel and a video preview popout. Keep the same components in the design library. Checkout uses the simple shared checkout header/footer so site banners do not distract from package selection.

- Large card bottom insets use `--card-padding-large` from the painted lower edge to the final content group (40px desktop / 28px mobile). Preserve internal medium gaps, including package price hero spacing; do not override a large card footer with the medium token.
- The main programme card keeps a medium gap from original price to current price. Bottom-align the current price and registration button, with one large inset to the outer card bottom; the shared checkout package hero retains its separately approved medium price inset.
- In the shared main programme card, the gap above the original price (last benefits text to RM499) is large. The original-to-current price gap is medium; bottom clearance is large. Apply to all live and library tones.

- Curriculum hover extends beyond the existing content axis by the medium padding token on both sides; use the shared menu `--action-radius` for its rounded highlight. Lesson hover covers only the video icon, title and plus/minus control. Suppress section hover while expanded. Lesson title controls use the same grey hover for both plus and minus actions; descriptions remain outside the highlight. Section highlight-to-divider clearance is half the small padding token (6px desktop / 4.2px mobile). Reuse the shared Accordion, lesson icons and preview dialog. Keep section counts, expand/collapse all, expandable lesson descriptions and inline preview synchronized with the library; show recording durations only when available.

- Digital course fixtures are recorded classes: no session date or venue on their detail, comparison or checkout pages. Course counts and durations use Paragraph, not Small. The shared purchase panel reuses navy/gold, large card padding and the established H2 price/Paragraph body roles.

- Material cards keep at least a medium gap above the footer divider and a medium gap below it; their final action remains a large inset above the card bottom. Keep sibling footer alignment and use the same owner in the library. Detail tables start without a top divider.
- Member profile uses the shared MemberProfileCard on the live page and library: two field columns on desktop, one on mobile, existing Paragraph/input roles and card padding tokens. Include address lines, postcode, city, state/territory selector and country. Keep address values empty until supplied; fixture identity is preview data.

- Video preview list rows reuse the course lesson height: Paragraph line-height 1.6, Small vertical padding, Medium horizontal extension/inset, action-radius, and half-Small gap to the divider. Thumbnails must fit the text line height. Preserve the navy/white dialog colours. Library samples use the same ClassSalesPage owner.
- Publish the single static review build at /v2. Exclude the standalone /home-2 variation from this export, and preserve the root WordPress site.

- Course curriculum has no total-count / expand-all text row. Use the shared ChevronDown icon button beside its title to open or close all sections, with an accessible label and expanded state. Intro-to-divider spacing is Small.
- Public V2 must serve at the exact /v2 URL without an automatic trailing-slash redirect. Package exports using scripts/package-static-preview.py to preserve UTC document modification times.
