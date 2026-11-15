# Verification hardening and Explorer publication — 15 November 2026

This change groups 23 already-merged PRs into five areas in one EN/JA/ZH notice and an EN/JA VAP archive entry. The separate header change is excluded. The source-review JSON preserves the checked commits and 55 successful first-party workflow runs; these are not test-method totals or independent reproduction.

The public Explorer assets are rebuilt from GUI main `fb6a313e4060b72b218d874257e55211ae8817b7` with Node 24.22.1 / npm 11.9.0. Build settings, exact files and hashes are in `explorer-build.json`. The legacy dashboard remains synthetic. The existing Evidence Demo API origin is unchanged; this publication does not deploy API main or assert that the live API contains API PR #31. Old hashed assets are retained for rollback. Only the two active asset references change in the composed app HTML.

The SDK guide adds an explicitly pinned evaluation command for `0832f1d84af9b130db6a17d36c343a8abd7002a8`, retaining the older README installation snapshot and historical v0.1.0 distinction. It does not publish a package, move a tag or edit signed data.

The XServer patch changes only the EN/JA homepage and archive, their generator, and sitemap dates. It preserves every prior notice payload, the header and all other VAP files. Its manifest describes the prepared bytes, not evidence of deployment. Publication, served hashes and responsive checks are recorded separately after upload.

Local checks: GUI 56 Node tests and production build; site 23 Python tests, 58 Node tests, six security-policy tests, 435-page SEO/analytics checks, alias checks, generated CSS/assets and current page links. Twenty preview combinations (1440/390px) passed overflow, image, heading and status checks. Hosted PR/main workflows and publication checks must complete separately; no pending run is represented as successful here.

Fixed releases, research archives, old signed fixtures, historical notices/test records, K3 and normative requirements remain unchanged. The VAP document hash remains `a35d5e082fd4b2f9921a78b1a71df263018320375e09fa18cf81533a18a19998`. Experimental extensions remain unadopted and independent third-party reproduction remains not established.
