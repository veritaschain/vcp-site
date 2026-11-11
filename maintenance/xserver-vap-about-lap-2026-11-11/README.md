# VAP site external-proposal wording — 11 November 2026 (rebuilt)

**Status: prepared, not deployed.** This package targets `vap.veritaschain.org`
(XServer), which is not served from this repository. Nothing on that host is
changed by merging this record.

## What happened to the first package

The first version of this package (commit `47b022d`) covered eleven files: the
About wording and the LAP wording. It was built from files fetched between
12:58 and 13:05 JST.

Between 13:11 and 13:16 JST the host received a separate About correction
(HTTP `Last-Modified` 04:11–04:16 GMT on `about/index.html`,
`ja/about/index.html`, `tools/build.py`, `tools/content_en.py`,
`tools/content_ja.py` and `sitemap.xml`). That correction is not recorded in
this repository. After it:

- `/about/` and `/ja/about/` no longer say "an independent international
  standards body". They describe VSO as a standards-development initiative
  operated by VeritasChain Co., Ltd., with vendor neutrality as a goal.
- Six of the eleven files no longer matched their `before_sha256`, so the first
  package's own rule ("stop if any differs") applied.
- The LAP wording on `/`, `/ja/`, `/profiles/`, `/ja/profiles/` and `llms.txt`
  was not touched and still reads "Related proposed profile" / "Proposed
  profile".

This rebuilt package drops the About hunks and keeps the LAP hunks unchanged.

## Why the LAP wording still needs to change

The home and profile pages present LAP as a "Related proposed profile" with a
"Proposed profile" chip, and introduce AILEX without the relationship
disclosure published on `veritaschain.org/vap/lap/`. VAP v1.2 §4.5.2 has no
"Proposed" status and describes its registry as the complete profile list.
`veritaschain.org` made the same correction on 11 November 2026 (vcp-site #216).

## What changes

Eight files. Exact before/after SHA-256 values are in
[manifest.json](manifest.json); the edits are in [update.patch](update.patch).

| Area | Change |
| --- | --- |
| `/`, `/ja/`, `/profiles/`, `/ja/profiles/` LAP section | Heading and chip become "Related external proposal" / "External proposal". The note states that LAP is outside the §4.5.2 registry and adds the AILEX relationship disclosure used on `veritaschain.org/vap/lap/` |
| `llms.txt` | Same heading and link label; the AILEX line records the shared representative |
| `sitemap.xml` | `lastmod` of the four pages set to 2026-11-11 (the two About dates are already 2026-11-11 on the host) |
| `tools/content_en.py`, `tools/content_ja.py` | The same LAP section in the generator sources, applied on top of the host's current About text |

Not changed by this package: `about/index.html`, `ja/about/index.html` and
`tools/build.py`. The host's `tools/build.py` already carries the six
correction dates of the first package.

Six of the eight outputs (the four pages, `llms.txt` and `sitemap.xml`) are
byte-identical to the first package's reviewed `after` files. The two generator
sources differ from it only by the host's own About text.

No specification text, registry row, conformance, certification, adoption or
commercial status changes.

## Source snapshot

The `before_sha256` values are of the public files fetched from the live site
on 11 November 2026 at 14:13 JST. The generator sources under `/tools/` are
downloadable from the live host; whether they should be publicly served is a
separate owner decision and is not changed here.

## Apply

1. On the host, compare each of the eight current files with its
   `before_sha256`. Stop if any differs.
2. Back up the eight files.
3. Either upload the eight `after` files individually into their existing
   directories, or from the site root run `patch -p1 --dry-run < update.patch`
   and then `patch -p1 < update.patch`. Do not rely on XServer's ZIP
   extraction to replace files in place (see the 28 October 2026 record).
4. Compare each file with its `after_sha256`.
5. Check `/`, `/ja/`, `/profiles/` and `/ja/profiles/` on desktop and mobile
   widths.
6. Record the deployment date here and add an entry to the public corrections
   log. The About correction already on the host also needs a corrections-log
   entry and a record of its source.

## Validation performed

- `patch -p1` of `update.patch` on the 14:13 JST files reproduces every
  `after_sha256`.
- The two patched Python sources were parsed for syntax only.
- All 28 sitemap URLs were fetched at 14:18 JST: no page contains
  "independent international standards body", and the old LAP labels remain
  only on the four pages in this package.

## Limits

- The generator was not executed, so equality between a fresh generator run and
  the patched pages was not observed.
- No rendering check, deployment or post-deployment hash verification was
  performed.
- Who applied the 13:11–13:16 JST About correction, and from which source, was
  not established from the public files.
- First-party preparation; not an independent review.
