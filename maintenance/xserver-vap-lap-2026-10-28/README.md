# VAP-LAP / AILEX discovery on vap.veritaschain.org

Status: prepared and locally validated; not deployed. Merging this package into
`vcp-site` does not deploy changes to the separately hosted XServer site.

## Baseline

Fresh public files were retrieved at `2026-10-27T15:49:30.601652+00:00` from
`https://vap.veritaschain.org/`. `baseline.json` records source URLs,
Last-Modified headers, sizes and SHA-256 digests. No old deployment archive was
used. The known served directory is
`veritaschain.org/public_html/vap.veritaschain.org/`.

The freshly retrieved public generator reproduced the four targeted HTML
pages byte for byte before changes. Only those four pages, `llms.txt` and the
sitemap were generated for this patch. No full-site build or image generation
was performed.

## Change

Add an explicitly proposed VAP-LAP / Legal AI Profile section to the English
and Japanese home and profile pages. Introduce AILEX as a product and use-case
reference, linking the already published main-site LAP pages, AILEX service
information, the GitHub proposal introduction and versioned Internet-Draft -05.
The formal VAP registry and existing profile cards stay intact.

Keep the five-item IETF list explicitly scoped to the items it lists; the
additional LAP proposal has its own section. Add the same discovery references
to `llms.txt`. Source and rendered content are updated together.

Only the four changed HTML pages receive a sitemap lastmod of 2026-10-28.
The generator records these as per-page dates, without changing unrelated
article or feed dates. Existing October 26 notices, links, inline scripts and
structured metadata are preserved.

## Package

This repository preserves the patch, its before/after manifest, the retrieval
metadata in `baseline.json`, and the validation record. The 10-file upload
archive is generated from these materials; it is not a full-site replacement.

Apply `vap-lap-ailex.patch` with `patch -p1` in a fresh working copy whose 10
manifest files match `before_sha256`, then verify every `after_sha256`. Package
only those 10 paths, relative to the served directory. The patch was applied
and the resulting hashes verified during preparation.

## Deployment procedure

1. Compare every current server file with its `before_sha256`. If a file has
   changed since retrieval, review that difference before replacement.
2. Retain a server-side backup outside `public_html` and a local archive of the
   actual current files. The public retrieval is not a replacement for a server
   backup.
3. Replace only the 10 manifest paths in the known served directory. Keep
   archived `vap-deploy` copies and fixed research distributions untouched.
4. Fetch all 10 public URLs and compare with `after_sha256`; check EN/JA home
   and profile pages plus the linked LAP/AILEX sections. Record deployment
   time and results. If publishing on another date, update the four per-page
   dates and regenerate the sitemap before the final comparison.

## Validation

- Four targeted HTML pages reproduced exactly from the original generator.
- Four changed Python sources parse successfully.
- Patch application and all after hashes match.
- All previous links and inline scripts are retained; no duplicate HTML IDs.
- All 26 sitemap URLs are retained; only four lastmod values change.
- No screenshot or visual browser review was performed in this staging task.

See `validation.json` for the machine-readable local result. No server write,
formal profile adoption, conformance decision, certification or new verifier
run is represented by this package.

## Superseding integrated patch — 28 October 2026

Do not deploy this older baseline over the 159-test Explorer update. Use the [reviewed integrated patch](../xserver-vap-github-update-2026-10-28/) and its before/after hash manifest. The original patch remains here as a historical preparation record.
