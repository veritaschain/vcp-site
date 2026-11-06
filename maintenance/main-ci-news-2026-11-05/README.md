# Website main CI completion notice — 5 November 2026

This maintenance change appends the completed first-party website CI results for
`veritaschain/vcp-site` revision `a18cda8303c7d0719ce2f298c1030f95508ac91b`
to the existing 5 November announcement in English, Japanese and Chinese. It
updates the corresponding archive/home summaries without replacing original
archived excerpts or earlier test records.

The five completed workflows and 12 jobs include 110 CSS image comparisons,
55 site regression tests and a 428-page CSP crawl (426 protected local pages,
two declared external redirects). Chinese VeraSnap image pairs match exactly at
1440px and 390px. One separate page has a two-pixel corner difference within the
pre-existing narrow allowance. The comparison criteria were not relaxed.

These results concern website maintenance only. Experimental extensions remain
unadopted; independent third-party reproduction has not been established. The
news does not claim normative conformance, production suitability or a new
specification release. No research implementation, signed data, fixed package,
K3 record or earlier test result is changed.

## VAP site patch

`xserver.patch` contains the corresponding English/Japanese notice update for
`vap.veritaschain.org`: two homepages, two archives and their existing generator.
`manifest.json` records exact before/after SHA-256 values. It records prepared
files, not an assertion that deployment has occurred.

Before applying, compare every current server file with its `before_sha256`,
retain a backup outside the public document root, and stop for reconciliation
if any hash differs. After applying, retrieve the public files and compare their
SHA-256 values with `after_sha256`; verify desktop/mobile rendering and retained
status/history notices. A rollback restores the corresponding backed-up files.
The existing specification pages, reference hashes, distributions and historical
Explorer 159-test record are preserved.

## Fixed CI sources

- [CSS/render](https://github.com/veritaschain/vcp-site/actions/runs/41950468662)
- [HTML/regression](https://github.com/veritaschain/vcp-site/actions/runs/41950468685)
- [CSP/script integrity](https://github.com/veritaschain/vcp-site/actions/runs/41950468661)
- [Browser Recorder](https://github.com/veritaschain/vcp-site/actions/runs/41950468738)
- [Pages deployment](https://github.com/veritaschain/vcp-site/actions/runs/41950468019)
