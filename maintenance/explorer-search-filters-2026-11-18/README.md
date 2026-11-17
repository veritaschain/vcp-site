# Explorer search filter labels — prepared 18 November 2026

This prepared site update carries [GUI PR #32](https://github.com/veritaschain/vcp-explorer-gui/pull/32)
to the copied official Explorer bundle. The four advanced search controls now
have explicit label associations, and the Filters button exposes its expanded
state and controlled panel. The hidden panel preserves filter values while
keeping collapsed controls out of normal interaction.

`build-manifest.json` pins the actual source commit and tree, locked dependencies,
build settings and output hashes. The source was checked out at that immutable
remote commit before the static build. The existing mock/hash-router profile
and Evidence Demo API origin are preserved.

Only the active JavaScript reference changes in the composed HTML. Its metadata,
24 October integrity notice, styles, fallback and CSP remain byte-identical.
The existing CSS and logo are unchanged. The CSP runtime mapping and generated
inventory point to the new bundle with the same connection permission. Previous
bundles and dated records remain available for rollback.

## Verification and publication state

Local source preparation passed lint, 58 unit tests and 13 dashboard/search
query-state scenarios. The pinned source's static build passed. Site checks
passed for exact source-dist asset equality, entry-page preservation, JavaScript
syntax, all 472 CSP documents, six policy tests and `git diff --check`.

The [source accessibility workflow](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/44190627974)
passed on the pinned commit, including the expanded search controls and a
negative control that removes their label associations. Remaining source gates
must also pass before publication. No additional local browser launch was
attempted for this bundle; the source-preparation browser attempt was blocked
by a Unix-socket `EPERM` before page inspection.

**This is a preparation record, not a completed deployment.** Composed-site
hosted browser checks and exact public HTML/asset checks remain separate gates.
A later publication result must be recorded from the actual hosted workflows
and served bytes. This scoped HTML accessibility repair does not complete
native Print/Save-as-PDF or assistive-technology assessment under GUI Issue #6,
and it establishes no external anchoring, certification or VCP/VAP conformance.
