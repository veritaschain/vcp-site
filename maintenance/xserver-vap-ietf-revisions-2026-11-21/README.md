# 21 November 2026: IETF draft revisions on vap.veritaschain.org

**Status: superseded on 24 November 2026; not applied.** Use
`maintenance/xserver-vap-ietf-revisions-2026-11-24/` instead: the SCITT/VCP
profile moved to -07 before this package was applied. This package was built from the live pages
fetched on 21 November 2026 at 14:27 UTC. Nothing on the XServer host was
changed by preparing it.

## Why

The IETF Datatracker lists two revisions that the VAP site does not yet show:

| Draft | Site shows | Datatracker (checked 21 November 2026) |
| --- | --- | --- |
| `draft-kamimura-scitt-vcp` | -05 | -06, posted 2026-11-20 02:28 UTC |
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
  the 21 November 2026 check and the three posting dates.
- `sitemap.xml`: `lastmod` of those four pages, 2026-11-20 to 2026-11-21.

No other wording, announcement, specification reference or digest changes.

## Applying it

1. Back up the five files.
2. Compare each file's SHA-256 with `before_sha256` in
   `xserver-manifest.json`. Stop if any differs; the live site has moved and
   the patch must be rebuilt.
3. Apply `xserver.patch` (`patch -p1`) and compare with `after_sha256`.

## Generator source

The site generator (`tools/content_en.py`, `tools/content_ja.py`,
`tools/build.py`) is not in a public repository and was not available when
this package was prepared, so the patch covers the generated pages only.
Make the same replacements in the generator before the next rebuild, or the
rebuild will restore the old labels:

- `draft-kamimura-scitt-vcp-05` to `draft-kamimura-scitt-vcp-06`
- `draft-kamimura-rats-behavioral-evidence-02` to
  `draft-kamimura-rats-behavioral-evidence-03`
- the English and Japanese sentence above `{ietf_list()}` (new text is in the
  patch)
- the sitemap date for `/`, `/ja/`, `/specification/` and
  `/ja/specification/`

## Related change on veritaschain.org

The same pull request updates the RATS draft label on `/standardization/`
(English, Japanese and Chinese). That page already shows the SCITT/VCP
profile at -06.

## Sources

- https://datatracker.ietf.org/doc/draft-kamimura-rats-behavioral-evidence/
- https://www.ietf.org/archive/id/draft-kamimura-rats-behavioral-evidence-03.txt
- https://datatracker.ietf.org/doc/draft-kamimura-scitt-vcp/
