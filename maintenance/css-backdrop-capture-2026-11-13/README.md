# Rounded backdrop capture correction — 13 November 2026

## Observed failure

At site main `97ace1b36d65af96c4082a1091f72e373f08b83f`, the
[first comparison attempt](https://github.com/veritaschain/vcp-site/actions/runs/43246242110/attempts/1)
failed on the English blog desktop CTA: 16 pixels exceeded the existing
one-channel-level tolerance (maximum difference 9). The
[unchanged-code second attempt](https://github.com/veritaschain/vcp-site/actions/runs/43246242110/attempts/2)
passed that case but failed on the Chinese counterpart: 17 pixels, maximum 10.
Both differences were at the rounded edge of `a.btn.btn-secondary`, which uses
`backdrop-filter: blur(10px)`. Geometry, inspected computed styles, complete
target styles and JavaScript errors matched. These were failed checks, not
successful runs or an allowance expansion. Their raw evidence is preserved.

## Controlled diagnosis

[Commit `0f0d3f9`](https://github.com/veritaschain/vcp-site/commit/0f0d3f95c93cb82c6a7332ecaed015513caae42d)
ran the same compiled CSS on both sides using the same pinned Chrome 156 Linux
environment. Each mode used ten fixed fresh-context pairs for each of the two
pages, with two frames per context: 80 frames, 40 cross-context comparisons and
40 consecutive-frame comparisons. Counts were fixed in advance; no passing
frame was selected and no threshold, mask or page styling was changed.

| Mode | Cross-context differences above base tolerance | Consecutive-frame differences above base tolerance |
| --- | ---: | ---: |
| Original partial-raster path | 10 / 40 | 28 / 40 |
| Same path with `--disable-partial-raster` | 0 / 40 | 0 / 40 |

The original mode reproduced **both complete PNG hashes from each original
failed pair**, not merely a similar region. All cross-context DOM and complete
target-state comparisons matched; there were no page errors. In the second
mode all 40 cross-context PNG pairs were byte-identical. Results and artifacts:
[diagnostic run](https://github.com/veritaschain/vcp-site/actions/runs/43327006816),
[machine summary](diagnostic-summary.json).

This isolates the observed failure to the browser's partial-raster capture
path for these rounded backdrop surfaces. It does not establish the exact
internal Chromium defect or general equivalence of all rendering backends.
The flag is a browser rendering control documented by
[Google's Chrome tooling project](https://github.com/GoogleChrome/chrome-launcher/blob/main/docs/chrome-flags-for-tools.md#rendering--gpu).

## Correction and verification boundary

The regular comparison uses `CAPTURE_BROWSER_ARGS` with partial raster disabled.
The final mode in the older capture controls uses the same arguments and
preparation. Earlier observation modes keep their original arguments, recorded
separately. The dedicated backdrop controls retain the old observations and
make the candidate fail if any of its fixed pairs differs above the original
base tolerance, changes inspected DOM/target state, or raises a page error.

The pixel comparator, narrow pre-existing header-corner allowance, four-frame
limit, image timeout, 110-case coverage, animations and wrong-theme negative
control are unchanged. There are no new ignored pixels, retries-to-pass,
reference-image replacements, removed CSS effects or public CSS/HTML changes.
The independent-reference theme comparison remains the full-suite gate;
same-CSS diagnostic completion alone does not establish theme equivalence.

The full gates must pass on the fix HEAD before merge and on the resulting main
commit after merge. Their GitHub records are separate from the earlier control
experiment. Original failures, earlier maintenance records and historical
research results are retained rather than rewritten as passes.

This is first-party site maintenance. Experimental extensions remain unadopted;
independent third-party reproduction remains unestablished. No research
normative requirement, implementation, signed data, fixed distribution or K3
condition is changed.
