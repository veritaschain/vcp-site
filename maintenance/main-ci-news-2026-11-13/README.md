# Dated website CI follow-up — 13 November 2026

The existing 12 November announcement receives a dated follow-up in English,
Japanese and Chinese. Its earlier body and archive source excerpt remain intact.
Archive summaries and modification dates expose the follow-up without adding a
duplicate announcement. The XServer patch applies the same update to the VAP
English/Japanese home and archive pages and their generator and sitemap.

The reported result is fixed to site merge
`720852c026913c6f4e0dd4a48ce2a85ae673ac2a` ([PR #222](https://github.com/veritaschain/vcp-site/pull/222)).
It is not a statement about every later commit or a new research test run.
All six workflows and 13 jobs completed successfully. The
[main CSS run](https://github.com/veritaschain/vcp-site/actions/runs/43330507404)
recorded 110 comparisons, zero failures and zero uses of the existing raster-noise
allowance; authored-animation and incorrect-theme controls also passed. The
[same-CSS candidate](https://github.com/veritaschain/vcp-site/actions/runs/43330507108)
recorded 40 cross-context and 40 consecutive-frame comparisons with identical
pixels. Baseline observations with differences are not counted as passing
comparisons. See the [diagnosis](../css-backdrop-capture-2026-11-13/README.md).

This announcement reports first-party website CI, not independent reproduction,
normative conformance, adoption, certification or production suitability.
Experimental extensions remain unadopted; independent third-party reproduction
remains unestablished. Historical failures, version-specific research records,
fixed distributions and the signature-fix main/fixed-ZIP distinction are retained.
No research norm, schema, implementation, signed data or K3 condition changes.

`manifest.json` records expected pre/post hashes for the six XServer files.
Publication is a separate operation: compare current bytes, retain the existing
files and a server-side copy outside `public_html`, apply only this patch, then
verify served hashes and desktop/mobile layouts. It does not declare publication
complete merely because this document has been merged.
