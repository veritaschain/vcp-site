# VAP site organisation description and external-proposal wording — 11 November 2026

**Status: prepared, not deployed.** This package targets `vap.veritaschain.org`
(XServer), which is not served from this repository. Nothing on that host is
changed by merging this record.

## Why

- `/about/` still describes VSO as "an independent international standards body".
  VAP v1.2 erratum E-2026-11-05 and the GitHub-side pages say that VSO is
  operated by VeritasChain Co., Ltd. and aims for vendor neutrality through
  public procedures and conflict-of-interest management.
- The home and profile pages present LAP as a "Related proposed profile" with a
  "Proposed profile" chip, and introduce AILEX without the relationship
  disclosure published on `veritaschain.org/vap/lap/`. VAP v1.2 §4.5.2 has no
  "Proposed" status and describes its registry as the complete profile list.

## What changes

Eleven files: the two generator content files and the generator, the six built
pages they produce, `llms.txt` and `sitemap.xml`. Exact before/after SHA-256
values are in [manifest.json](manifest.json); the edits are in
[update.patch](update.patch).

| Area | Change |
| --- | --- |
| `/about/`, `/ja/about/` lead | "independent international standards body" becomes "a specification-development initiative operated by VeritasChain Co., Ltd." (JA: 「VeritasChain株式会社が運営する仕様開発の取り組み」) |
| `/about/`, `/ja/about/` neutrality section | Present-tense neutrality becomes an aim pursued through public procedures and conflict-of-interest management. The English "disclosed in every public document" becomes "disclosed on this page", matching the Japanese page |
| `/about/`, `/ja/about/` operator paragraph | States that the only registered Conformity Assessment Body is the operating company and is not independent of the scheme owner (E-2026-10-21, E-2026-11-05) |
| `/about/`, `/ja/about/` meta descriptions | Same correction in the description, Open Graph and Twitter tags |
| `/`, `/ja/`, `/profiles/`, `/ja/profiles/` LAP section | Heading and chip become "Related external proposal" / "External proposal". The note states that LAP is outside the §4.5.2 registry and adds the AILEX relationship disclosure used on `veritaschain.org/vap/lap/` |
| `llms.txt` | Same heading and link label; the AILEX line records the shared representative |
| `tools/build.py`, `sitemap.xml` | Correction dates for the six pages set to 2026-11-11 |

No specification text, registry row, conformance, certification, adoption or
commercial status changes. Page titles and the existing descriptive sentences
about the proposal are unchanged.

## Source snapshot

The `before_sha256` values are of the public files fetched from the live site
on 11 November 2026 between 12:58 and 13:05 JST. The generator sources under
`/tools/` were downloadable from the live host; whether they should be publicly
served is a separate owner decision and is not changed here.

## Apply

1. On the host, compare each current file with its `before_sha256`. Stop if any
   differs: the site has moved since this snapshot and the patch must be rebuilt.
2. Back up the eleven files.
3. From the site root: `patch -p1 --dry-run < update.patch`, then
   `patch -p1 < update.patch`.
4. Compare each file with its `after_sha256`.
5. Check `/about/`, `/ja/about/`, `/`, `/ja/`, `/profiles/` and `/ja/profiles/`
   on desktop and mobile widths, and confirm that "independent international
   standards body" no longer appears.
6. Record the deployment date here and add an entry to the public corrections
   log. This package adds no corrections-log entry because nothing is deployed.

The built pages are patched directly, so a generator run is not required. If
the generator is run later, its output for these pages should equal the patched
files; compare hashes before publishing.

## Validation performed

- Every replaced string was required to occur exactly the expected number of
  times in each file; the build of this package stops otherwise.
- `git apply` of `update.patch` on the fetched files reproduces every
  `after_sha256`.
- The three patched Python sources were compiled for syntax only.

## Limits

- The generator was not executed, so equality between a fresh generator run and
  the patched pages is expected from the verbatim source/page correspondence
  but was not observed.
- No rendering check, deployment or public-hash verification was performed.
- First-party preparation; not an independent review.
