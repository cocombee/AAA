# V2 preview release

Current preview replaced 30 September 2026 at https://labursaham.com/v2. The server still redirects the bare mount to `/v2/`; the final V2-only routing adjustment is pending approval. This is the visual and interaction preview; payments and member persistence remain disabled.

## Git branches

- `main` contains the website, shared tokens and reusable live components. It excludes the design library route and gallery-only components.
- `library` starts from the current `main` and adds the latest library at `/v2/design-library`. Its five gallery files are preserved exactly from verified release `d7471de`, including the user's final highlight, padding, typography, curriculum, card and profile corrections. Shared website components are identical across both branches at the split.
- Merge subsequent `main` changes into `library` to keep its shared components current. Use the same preview-enabled build instructions on either branch. The deployed preview remains the previously verified release until a separate deployment.

## Repeatable build

1. Run `node scripts/build-static-preview.mjs /v2`.
2. Run `node scripts/audit-static-preview.mjs <export-directory> /v2`.
3. Run `python3 scripts/package-static-preview.py <export-directory> <archive-path>`.
4. Stage/extract outside the domain root. Archive only the previous preview directories, then move the new `v2` into `labursaham.com`. Preserve root WordPress content, database and existing rules. On LiteSpeed, insert the narrowly scoped `scripts/v2-root-routing.htaccess` block before the WordPress routing block; back up the original configuration first.

The V2 export uses URLs without trailing slashes. Its Apache-compatible rules are intended to serve `/v2` directly and map extensionless routes to their exported HTML files. Directory listing is disabled. LiteSpeed ignores `DirectorySlash Off`, so its domain root needs the V2-only rewrite snippet. [LiteSpeed directive support](https://docs.litespeedtech.com/lsws/configuration/#directives).

The export writes document-only cache revalidation to its own `.htaccess`. Hashed assets retain their existing caching behavior. Packaging preserves UTC modification times through the standard ZIP timestamp extension. Do not package documents with the ZIP default 1980 timestamp: old `If-Modified-Since` requests would incorrectly receive 304 and retain the previous page.

## Release evidence

- Production build and TypeScript checks passed.
- Static audit: 86 HTML pages, 79 flow routes, 3022 local links/assets passed.
- Course `carta` and portfolio checkout retain the correct query selection and RM349 / RM249 totals.
- Preview video plays; its rows and course lesson controls both measure 49.6px on desktop. Rows use existing Small/Medium padding and action radius; the library uses the same component.
- Homepage has both physical sample dates: 24 October and 7 November.
- Standalone `/home-2` is omitted from this export; selected reusable samples remain in the library.
- Previous public `/v2` and `/vw` builds were moved to `/home8/cocombee/AAA Website Preview Archive`. The pre-existing old WordPress V2 archive remains separate.
- The existing root WordPress homepage remains in place. WordPress content and database were not edited. Existing root routing rules were preserved byte for byte; an anchored V2 routing block was inserted, but the final directory redirect correction remains pending approval.

- Curriculum summary row was removed. An icon button beside the title opens all three sections and closes them again; both states were verified. The intro-to-divider gap is Small (12px desktop, 8.4px mobile), with no horizontal overflow at 390px. The library shares CourseCurriculum.
