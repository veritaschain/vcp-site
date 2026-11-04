# VAP Browser Recorder changes

## 0.1.2 — 2026-11-05

- Count only elements intersecting the selected Range against the 20,000-element
  budget and prune unrelated subtrees. Short selections on large pages remain
  usable while selected editors, shadow hosts and frames are still rejected.
- Add seven real-browser large-DOM cases and two unit budget regressions.
- Publish a new deterministic 0.1.2 ZIP, checksum and synchronized EN/JA/ZH
  download routes; keep both fixed historical archive identities unchanged.
- Check archive/source equality, version parity and unchanged contract bytes.
- Gate publication on the pinned-browser workflow for the exact candidate;
  test real 0.1.0 and 0.1.1 archive upgrades separately, including the large-page
  repair through the installed extension action. Historical test outputs stay
  identified as historical. No current local browser execution is claimed.
- Preserve signing/canonicalization, storage, permissions, record format and
  original signed examples. See docs/TEST-REPORT.md for evidence boundaries.

## 0.1.1 — 2026-11-01

- Reject light-DOM selections that cross an input, textarea or contenteditable
  editing host even when both selection endpoints are ordinary text.
- Exclude inherited editing, document designMode and noneditable islands inside
  an editing host. An unselected neighboring editor remains allowed.
- Reject recognized shadow-root endpoints, open shadow hosts, re-scoped composed
  ranges and embedded-frame boundaries. Closed shadow roots cannot all be
  enumerated from the document; this is not a universal isolation claim.
- Add real Chrome DOM regression tests against a loopback synthetic fixture.
- Preserve the specific capture rejection message across Chrome's executeScript
  result boundary, so the popup explains why a selection was refused.
- Add unpacked-extension lifecycle checks for the actual action/activeTab path,
  consent, persistence across restart, concurrent storage, downloads and tamper
  rejection, CSP enforcement, and a consented reset.
- Keep the 0.1.0 observation/checkpoint byte contract, stored keys, database name
  and existing synthetic signed sample unchanged.

Add an actual 0.1.0-to-0.1.1 unpacked-update test, using the hash-pinned original
archive, the same installation path/profile, Developer mode enabled and
`runtime.reload()`. Preserve keys and old records; check successful appends and
that checkpoints remain specific to their original snapshots. A separate-path
negative control verifies a different extension identity and empty vault.

Add Chrome 137.0.7151.119 coverage for the existing ten DOM cases and one limited
storage/export flow. The action/activeTab/consent path is still tested on Chrome
156 only. Export records and their checkpoint before updating, retain Developer
mode and the existing installation path. Web Store updates, manual toolbar
interaction, other operating systems and actual service UIs remain untested.

This remains an experimental, first-party implementation. Test success does not
establish AI-provider identity, externally trusted time, complete conversation
capture, independent validation or VAP conformance.
