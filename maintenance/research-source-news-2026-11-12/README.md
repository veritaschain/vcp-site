# Website source and research notice — 12 November 2026

Informative website update only. Experimental extensions remain unadopted;
independent third-party reproduction is not established. First-party CI and
public website checks are separate from independent execution.

- Add EN/JA/ZH announcement and latest-three/archive entries; all prior notice
  data and individual articles remain unchanged.
- Pin the current VAP Draft 3 reference to `e00ee5a26087ec91f2dbd7994498b2e800373d39`;
  SHA-256 `a35d5e082fd4b2f9921a78b1a71df263018320375e09fa18cf81533a18a19998` was
  independently recalculated from the exact GitHub blob during preparation.
  Previous source pins/digests remain explicitly historical.
- Explain that PR #68's experimental Ed25519 input rejection is on main only,
  not in the immutable `vap-interop-demo-v0.2.0` prerelease ZIP at `cbd4502`.
  The 41-method main result is not attributed to the original 32-test ZIP.
- Link the 44 merged PRs and 36 successful current-head workflow records from
  the 12 November 23:44 JST check. Three documentation repositories had no
  current-head workflow; these are not counted as passed. Open Drafts are not
  represented as merged. No research suite was rerun for writing this notice.

## XServer patch

`xserver.patch` and `manifest.json` cover 11 existing files on
`vap.veritaschain.org`. Compare each before hash, back up, apply only matching
files, and verify exact after hashes and desktop/mobile display. A merge of
this repository does not itself deploy XServer.

The preparation used fresh HTTPS copies of all 28 sitemap pages and generator
sources, including the 11 November About/LAP corrections. The original
renderer reproduced all 28 live HTML files byte-for-byte before modification.
Only six HTML pages, three generator files, sitemap and llms.txt change.
Old notice payloads and unrelated page dates are preserved. The current-source
check is added before the retained 3 November and earlier source history.

## Preservation and validation

The complete main-site baseline `b416009` was archived locally before edits.
XServer backup: `/veritaschain.org/vap-backup-20261112-before-research-news`,
outside the public document root. Exact local before/after manifests and
publication checks are retained in the project output, not analytics data in
this public repository.

Validation: canonical metadata/internal links, analytics coverage, unchanged
incident generation, Python/Node site regressions, compiled CSS generation,
script integrity and CSP checks. Full repository CI and public rendering are
verified separately during publication. No thresholds or CI tests are changed.

No normative requirement, research implementation, signed data, fixed release,
K3 input/result or historical test record is edited.
