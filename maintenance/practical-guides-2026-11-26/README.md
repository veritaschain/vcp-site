# 26 November 2026: practical verification guide navigation

Prepared for publication, not a claim that XServer publication is complete. This patch links the EN/JA VAP home, research and code pages to three canonical main-site guides: VeraSnap Verify SDK (alpha), receiving evidence and interpreting results, and software release/known-issue status. It does not duplicate their article text or change the VAP navigation across all pages.

Apply only after saving a server backup outside the public root and matching **every before SHA-256** in `xserver-manifest.json`. The patch changes six HTML pages, `tools/build.py`, and only the six pages' sitemap modification dates. Each page changes by insertion of one generated navigation section. The exact current HTML is retained outside that section; no full-site regeneration was used to overwrite live files. Keep the source generator and HTML together.

Before publication, ensure the six main-site destination URLs are live. Apply with `patch --batch --fuzz=0 -p1` against verified originals, then compare every resulting SHA-256 with the manifest. After upload, fetch the eight public files and verify their expected hashes; inspect desktop/mobile pages separately. Local preflight and expected-post-publication input JSON files are stored with the private task outputs.

All historical notices, test records, specification references and hashes are preserved. Existing metadata, scripts, styles and navigation are unchanged. Experimental extensions remain unadopted; independent third-party VAP reproduction is not established. First-party CI and saved-evidence checks remain distinct from independent execution. Normative requirements, implementations, signed data, fixed tags/ZIPs and K3 are unchanged.

## Main-site articles

The six canonical articles are generated from `data/practical-pages/*.json` with `python3 scripts/build-practical-pages.py`. English and Japanese use reciprocal canonical/hreflang links and retain the same executable commands. The receiving workflow is informative, not an adopted normative requirement or a claims-decision policy. The version matrix is a dated review, not live service monitoring.

On 26 November, the SDK guide's published command blocks were executed verbatim in a fresh clone and virtual environment pinned to `66d1875b5977feacb755c3bb92c38d2f2ba39665`. Seven existing synthetic cases produced the expected status/level/exit/media results; all 186 SDK tests also passed in a separate local virtual environment (Python 3.14.3, macOS arm64). Stored 18 November TSA tokens were rechecked; no new timestamp was requested and the SDK source was unchanged. This is first-party local validation, not independent reproduction. In particular, green with no photo does not establish media verification, and manual key registration is not hardware attestation.

Regenerate the practical, research and VeraSnap pages, then site directory and CSP policies; run canonical/link, analytics, policy and compiled-style checks. Existing GitHub workflows remain unchanged. Do not interpret this site CI as new verification of an immutable kit or as third-party validation.
