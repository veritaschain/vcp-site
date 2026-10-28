# XServer VAP correction — founding date and "VAP-WEB"

**Deployed and publicly verified on 28 October 2026.** The separately hosted
`https://vap.veritaschain.org/` was updated through XServer File Manager after
the preparation package in [PR #159](https://github.com/veritaschain/vcp-site/pull/159)
was merged. The publication check at **12:36:48–12:36:51 JST** matched all 11
changed files to their after hashes, all 26 other checked files to their before
hashes, and all six normal page URLs to the expected content.

See [deployment.json](deployment.json) for the upload and backup record and
[publication-verification.json](publication-verification.json) for the public
HTTPS results. The preparation records below retain their original status and
hashes; merging this repository alone does not deploy the XServer site.

## Publication

- A full server-side copy and ZIP were retained outside `public_html` before
  publishing. The downloaded ZIP contains 191 entries; all 11 target files
  match their before hashes.
- XServer's ZIP extraction created a named subdirectory instead of replacing
  the served files. The first publication check detected that no target file
  had changed. The temporary subdirectory was moved outside `public_html`, and
  the 11 reviewed files were uploaded individually into their seven existing
  directories. The server then served every expected after hash.
- The final check returned HTTP 200 without redirects for all 37 file URLs
  and six normal page URLs. All 127 bounded content checks passed. The Japanese
  About and Profiles pages were also inspected in a browser.
- VAP-LAP, AILEX, Explorer notices, registered DAP/SMP aliases, links and
  unrelated JSON-LD were preserved. Only the two About sitemap dates changed;
  the blog feed remained byte-identical.
- Existing deployment archives, fixed research distributions, tags, signed
  data and K3 records were not modified by this correction.

## What it changes

| Item | Where | Change |
| --- | --- | --- |
| Company founding date | `about/index.html`, `ja/about/index.html` (JSON-LD `foundingDate` key and the visible "Founded" / 「設立」 row); generator sources `tools/build.py`, `tools/content_en.py`, `tools/content_ja.py` | Removed. The date has not been confirmed against the commercial registry certificate. veritaschain.org removed its own founding date on 28 October 2026 (vcp-site #154) for the same reason. |
| "VAP-WEB" | `index.html`, `ja/index.html`, `profiles/index.html`, `ja/profiles/index.html`, `llms.txt`, generator sources | Removed. VAP v1.2 §4.5.2 registers OAP without this alias, so the name is not specification vocabulary. DAP (VAP-AGENT) and SMP (VAP-SLEEP) keep their aliases, which §4.6.2 registers. |

The generator sources are corrected together with the rendered pages, so a later
regeneration does not restore the removed text. The sources come from the copies
the host serves publicly.

Only the English and Japanese About sitemap entries change to 2026-10-28. The
other four changed HTML pages already carry that date. Blog feed dates and
existing notice placement are unchanged.

## Files

- `manifest.json` lists the 11 affected files with SHA-256 **before** (as
  retrieved from the public URLs on 28 October 2026) and **after**.
- `baseline-check.json` records the current public files retrieved at
  **12:01 JST**. The original ten-file correction still matched all ten before
  hashes. The current package additionally includes the sitemap date correction.
- `apply.py` applies the corrections by key and pattern. The package therefore
  does not contain the removed date itself, unlike a unified diff would.
  - It first checks every file against its before hash and stops on any
    difference.
  - It then checks every result against its after hash.
  - `--check` runs both checks without writing.
- `validation.json` records generator reproduction, unchanged files, and the
  11-file upload archive hash. Reconstruct the archive from the verified output
  of `apply.py`; include only the manifest paths relative to the served root.

## Checks made

- `apply.py` on the retrieved files reproduces every after hash.
- The patched Python sources compile, and all JSON-LD blocks in the changed
  pages parse.
- No changed file still contains a `foundingDate` key, a Founded / 設立 row or
  `VAP-WEB`.
- A separate assistant review of the original package regenerated the site from the patched generator
  sources (`build_pages()`, `build_misc()`): the result reproduces the patched
  rendered files byte for byte and leaves the other pages unchanged.
- The completed deployment package reproduces all 26 HTML pages before and
  after the correction. Six pages change; 20 remain byte-identical. All 26
  sitemap URLs remain, with only the two About dates changed. Regenerated
  `llms.txt` and sitemap match, and `feed.xml` stays byte-identical.
- A separate `CONTENT_CORRECTION_UPDATED` map supplies only sitemap dates.
  Extending `PAGE_UPDATED` would also add the 28 October GitHub notice to About,
  because that map controls notice placement; this package preserves it.
- These checks review website content and reproducibility, not implementation
  conformance or independent external reproduction.

## Deployment boundary

- Run `python3 -I apply.py <copy-of-served-root> --check` against a fresh copy
  of the server files. If any before hash differs, stop and review that file.
- Run it without `--check` on the copy, keep a backup of the pre-deployment
  files, and upload only the changed files.
- Before publishing, compare the current files again and retain a server-side
  backup outside `public_html`. Use the manifest's 2026-10-28 publication date
  only when publishing that day. If the date changes, refresh the sitemap dates
  and hashes before upload. Blog feed entries are unaffected and keep their dates.
- After upload, compare all 11 served files with `after_sha256` and check the
  six normal page URLs. Record the publication result separately from preparation.
- Archived copies on the host (for example the `vap-deploy` ZIP and directories
  noted in `maintenance/xserver-vap-2026-10-24/README.md`) were not checked and
  may still contain the removed text.
