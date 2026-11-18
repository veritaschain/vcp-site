# Explorer detail controls — prepared 18 November 2026

This prepared site update carries [GUI PR #34](https://github.com/veritaschain/vcp-explorer-gui/pull/34)
into the copied official Explorer bundle. Event Details and Merkle Proof now
name their back links and copy actions. Merkle Proof shows copy success only
after the clipboard write succeeds. The detail headers also wrap at narrow
widths so their actions remain within the viewport.

`build-manifest.json` pins the immutable remote GUI commit
`21cd6fefb98206ce116025c439005c701cac104c`, its full source tree, locked
dependencies, build settings and output hashes. That exact commit was checked
out before the static build. The existing mock/hash-router configuration and
Evidence Demo API origin are preserved.

Only the active JavaScript and stylesheet references change in the composed
entry HTML. Its metadata, 24 October integrity notice, inline styles, fallback
and CSP remain byte-identical. The logo is unchanged. The CSP runtime mapping
and generated inventory point to the new JavaScript with the same connection
permission. Previous hashed assets and dated records remain available for
rollback.

## Preparation base

The candidate is stacked on the immutable incident-correction
[PR #239](https://github.com/veritaschain/vcp-site/pull/239) head
`7f72bbb59bc1d02fe5425a66fa8e165cb2a2c77d`. Its incident records are preserved.
The original Explorer preparation used `62b23e0ae2903b47cfadf07187de7878b531f111`;
the manifest records that earlier base and preparation time. Rebasing changes
neither the built GUI assets, composed entry HTML nor browser regression script,
so the existing local browser observation is retained without rerunning it.
Entry/asset preservation, CSP and diff checks were repeated for the new base.
This is a combined preparation candidate, not a claim that either PR deployed.

## Verification scope

Local source preparation passed lint, 58 unit tests, 13 dashboard/search
query-state cases, 19 detail query-state cases and eight Chromium detail
route/viewport checks. The new rejected-write component regression also
rejects the previous copy-handler behavior while the other 18 detail cases
still pass. The pinned remote source's static build passed separately.

The composed site's local browser checks passed with Playwright 1.56.1 and
Chromium 141.0.7390.37. They cover all 12 synthetic inclusion examples, the
notice and its keyboard link at seven widths, the existing notice/sidebar
negative control, and bounded detail-control checks at 320px and 390px.
Those detail checks require the new names, viewport containment, no copy
success after a rejected proof write, and a full Event ID copied with Space
while focus remains on the button. Clipboard writes use a test-only browser
stub; the host clipboard is not accessed.

The previous proof-layout negative control disabled the site's historical
mobile workaround and expected overflow. The GUI now repairs that header
itself, so the control explicitly restores the former source-header classes
as well. It still requires overflow in the old state, then requires the new
header to fit even with the site-only workaround disabled. This preserves
the regression's ability to detect the original problem.

Exact source-dist asset equality, entry-page preservation, JavaScript syntax,
all 472 CSP documents, six security-policy tests and `git diff --check` passed.

## Publication state and limits

**This is a preparation record, not a completed deployment.** The exact GUI
PR head's hosted checks, the site PR's hosted checks and public HTML/JS/CSS
byte verification remain publication gates. Record their later results from
the actual workflow runs and served bytes. The separately hosted Evidence
Demo API is not redeployed by this static update.

These checks do not establish complete page contrast, native Print/Save-as-PDF
reading order, screen-reader behavior, WCAG/PDF/UA conformance, external
anchoring or VCP/VAP conformance. The GUI's separate manual/native-output
acceptance criteria remain open in
[issue #6](https://github.com/veritaschain/vcp-explorer-gui/issues/6).
