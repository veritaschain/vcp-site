# 24 November 2026: IETF draft revisions on vap.veritaschain.org

**Status: prepared; not published.** This package was built from the live pages
fetched on 24 November 2026 at 02:43 UTC. Nothing on the XServer host was
changed by preparing it.

It **supersedes** `maintenance/xserver-vap-ietf-revisions-2026-11-21/`. That
package had not been applied when the live pages were fetched: each of the five
files still had the `before_sha256` recorded there. Apply this package instead
of the earlier one, not after it.

## Why

The IETF Datatracker lists two revisions that the VAP site does not yet show:

| Draft | Site shows | Datatracker (checked 24 November 2026) |
| --- | --- | --- |
| `draft-kamimura-scitt-vcp` | -05 | -07, posted 2026-11-24 02:34 UTC |
| `draft-kamimura-rats-behavioral-evidence` | -02 | -03, posted 2026-11-21 04:12 UTC |

`draft-kamimura-vap-framework-03`, `draft-kamimura-scitt-refusal-events-04`
and `draft-vso-cpp-core-04` are unchanged. All five remain individual
submissions. None has been adopted by an IETF Working Group and none has IETF
standing.

## What the patch changes

- `index.html`, `ja/index.html`, `specification/index.html`,
  `ja/specification/index.html`: the two revision labels in the IETF list.
- `index.html`, `ja/index.html`: the sentence above the list, which said the
  other revision numbers kept the 26 October 2026 review date. It now gives
  the 24 November 2026 check and the three posting dates.
- `sitemap.xml`: `lastmod` of those four pages, 2026-11-20 to 2026-11-24.

No other wording, announcement, specification reference or digest changes.
Compared with the 21 November package, the differences are the SCITT/VCP label
(-07 instead of -06), its posting date in the sentence (24 November instead of
20 November), the check date and the sitemap date.

## Applying it

1. Back up the eight files (five generated files and three generator sources).
2. Compare each file's SHA-256 with `before_sha256` in
   `xserver-manifest.json` (`files` and `generator_files`). Stop if any
   differs; the live site has moved and the patches must be rebuilt.
3. Apply `xserver.patch` and `generator.patch` (`patch -p1` from the site
   root) and compare with `after_sha256`.

The patch was applied to a copy of the fetched pages and produced the
`after_sha256` values. It has not been applied to the host.

## Generator source

Added later on 24 November 2026. The site generator is not in a public
repository, but the host serves its sources under `/tools/`. The three files
that carry these labels were fetched from there at 03:46 UTC, and
`generator.patch` makes the same replacements in them, so that the next
rebuild does not restore the old labels:

- `tools/content_en.py`: `draft-kamimura-scitt-vcp-05` to `-07`,
  `draft-kamimura-rats-behavioral-evidence-02` to `-03`, and the English
  sentence above `{ietf_list()}`.
- `tools/content_ja.py`: the Japanese sentence above `{ietf_list()}`.
- `tools/build.py`: one added line that sets the sitemap date of `/`, `/ja/`,
  `/specification/` and `/ja/specification/` to 2026-11-24. That table is
  used only for the sitemap `lastmod`.

What was checked: each replaced string occurs exactly once; the patched files
parse as Python; the list markup that the patched `ietf_list()` returns and
the two patched sentences appear byte for byte in the patched pages. **The
generator was not run**, because its other modules and inputs were not
fetched. A rebuild can still change other bytes of these pages.

The earlier statement in this package that the generator "was not available"
was wrong about availability: it had not been looked for on the host.

## Related change on veritaschain.org

The same pull request updates the SCITT/VCP profile label on
`/standardization/` (English, Japanese and Chinese) from -06 to -07.

## Sources

- https://datatracker.ietf.org/doc/draft-kamimura-scitt-vcp/
- https://www.ietf.org/archive/id/draft-kamimura-scitt-vcp-07.txt
- https://datatracker.ietf.org/doc/draft-kamimura-rats-behavioral-evidence/
- https://www.ietf.org/archive/id/draft-kamimura-rats-behavioral-evidence-03.txt
