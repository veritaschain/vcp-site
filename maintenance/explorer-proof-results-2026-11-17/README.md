# Explorer proof-result binding — prepared 17 November 2026

This staged update carries the GUI fixes in [source PR #30](https://github.com/veritaschain/vcp-explorer-gui/pull/30) to the official site's copied Explorer bundle. Merging the GUI repository alone does not publish `/explorer/app/`: the page is served from `vcp-site/explorer/app/`. The pinned source commit, matching Git tree, build settings and exact bytes are recorded in `build-manifest.json`.

## Changed behavior

A displayed inclusion result belongs to the event and proof response that were checked. Navigating to another event or refreshing the proof clears the previous result, and a superseded asynchronous verification cannot write its result into the current view. The new proof must be checked again.

Event, proof and certificate pages distinguish a retrieval failure from known missing data. HTTP 404 and typed absent mock records retain the appropriate missing-data view; other failures offer retry. Offline-paused and active refreshes hide previously displayed data. A certificate is not offered for printing while its current request is unresolved.

These are display/request-lifecycle fixes. The Merkle check still evaluates the supplied hash, path, root and tree size only. It does not authenticate event contents, signatures or an external anchor.

## Build and preservation

The static profile uses Node 24.22.1 / npm 11.9.0 and the unchanged locked dependency file. Legacy pages remain in mock mode, the router remains a hash router, and the Evidence Demo retains its existing API URL. No API deployment or new availability measurement is included.

Only the active JavaScript reference changes in the composed site HTML. Canonical/OG/JSON-LD metadata, the 24 October integrity notice, fallback text, mobile layout styles and CSP text are preserved byte for byte. Existing CSS and logo bytes are unchanged. The CSP source mapping and generated policy now point to the new bundle with the same reviewed evidence API origin; no connection permission is broadened. Previous hashed assets and dated records remain available for rollback.

## Checks and publication status

Local source checks passed: production build, lint, 58 unit tests, 18 detail/proof component scenarios and 13 dashboard/search component scenarios. Site checks passed for asset-byte equality, unchanged entry-page content outside the script reference, JavaScript syntax, all 472 CSP documents, six policy tests and `git diff --check`.

The local Chromium checks were blocked before page inspection by an environment Unix-socket `EPERM`. They are not reported as successful. Source hosted checks, composed-site browser checks and public HTML/asset verification are separate gates and were pending when this record was prepared. The existing site notice workflow performs its composed-page check for the PR and exact public-byte/notice checks after the site push.

**This record describes prepared files, not a completed deployment.** A later publication result must be established from the actual hosted workflows and served bytes. No external anchoring, independent reproduction, certification, VCP/VAP conformance or API availability is established by this bundle refresh.
