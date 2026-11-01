# VAP Browser Recorder changes

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

Persistence was tested with the same 0.1.1 extension path and browser profile.
An actual 0.1.0-to-0.1.1 installation update was not tested. Export records and
their checkpoint before updating, and keep the existing installation path.

This remains an experimental, first-party implementation. Test success does not
establish AI-provider identity, externally trusted time, complete conversation
capture, independent validation or VAP conformance.
