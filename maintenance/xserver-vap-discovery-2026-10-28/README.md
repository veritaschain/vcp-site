# VAP-LAP and AILEX discovery metadata — XServer VAP site

**Deployed and publicly verified on 28 October 2026.** The separately hosted
`https://vap.veritaschain.org/` was updated through XServer File Manager.
The public check at **13:04:51–13:04:54 JST** matched all six changed files,
all 31 other snapshot files and all four normal page URLs to their expected
hashes. See [deployment.json](deployment.json) and
[publication-verification.json](publication-verification.json).

The preparation records below retain their original status and hashes.
Merging this repository alone does not upload files to XServer.

## Publication

- A full copy and ZIP were created outside `public_html` before upload. The
  ZIP contains 191 entries; all six target files match their before hashes.
- The six reviewed files were uploaded individually into their five existing
  directories. Their public hashes match the prepared after values.
- All 37 file URLs and four normal page URLs returned HTTP 200 without
  redirects. All 64 bounded public-content checks passed.
- A browser confirmed the new Japanese Profiles title and the identical
  description across HTML, Open Graph and Twitter metadata. The visible
  VAP-LAP and AILEX introduction was also inspected after publication.

## Subsequent GA4 publication

The separate GA4 update in PR #161/#162 was published after this metadata
deployment. A bounded recheck at **13:54:54–13:54:55 JST** fetched only the six
targets once. All four HTML pages retain the new metadata, identical bodies
and one shared analytics loader; both content sources retain their after
hashes. Removing only that exact later loader tag reproduces the four prepared
HTML hashes. All 34 checks passed, with no errors or redirects.

[post-ga4-metadata-check.json](post-ga4-metadata-check.json) records the current
hashes and observations. The original publication record remains the dated
13:04 snapshot. No metadata file was uploaded again during this recheck.

## Reason and scope

The English and Japanese homepage and Profiles bodies already introduce
VAP-LAP and AILEX. Their search and sharing descriptions still summarize the
earlier profile list. This update brings those summaries into line with the
visible content, describing VAP-LAP as a Legal AI Profile **proposal** and AILEX
as a **product and use-case reference**.

The change consists of six source fields: both homepage descriptions and both
Profiles titles and descriptions. The generator expands them into the HTML,
Open Graph and Twitter metadata. Four rendered pages and two generator files
change. `manifest.json` records the exact old/new text and before/after hashes.

The three-language LAP pages on `veritaschain.org`, their shared navigation,
and the GitHub profile/proposal links were also reviewed. They already carry
the intended introduction and do not need changes for this task.

## Preparation evidence

- The six target URLs were fetched on **28 October 2026 at 12:58 JST** and
  matched the preceding publication recorded in vcp-site PR #160.
- The other files used for local regeneration are the preceding verified
  37-file snapshot; this is not a new live fetch of every file.
- Regeneration changes exactly four HTML files and two Python source files.
  All four HTML bodies are byte-identical; changes are confined to title and
  description metadata. The other 22 HTML pages and 31 snapshot files remain
  byte-identical.
- Canonical URLs, language alternates, JSON-LD, sitemap, feed and `llms.txt`
  are unchanged. The previous company-date and OAP-alias corrections remain.
- `validation.json` records 79 bounded checks with no failures.

## Applying the package

To reproduce the update, use a copy of the pre-update served root. `apply.py` checks all six before hashes,
then every expected after hash, before writing any file. `--check` verifies the
transformation without writing:

```sh
python3 -I apply.py /path/to/copy-of-served-root --check
python3 -I apply.py /path/to/copy-of-served-root
```

Keep a current backup outside `public_html` and upload only the six manifest paths into their
existing directories. After publication, check all six hashes and the four
normal page URLs, and record the result separately from preparation.

These checks cover page metadata and content preservation. Search engines and
social platforms control their own indexing and caches; this package does not
claim that their displayed results have refreshed or that ranking improved.
