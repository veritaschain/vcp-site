# Registry reviews and release known-issue notice — 13 November 2026

This informative website update records vcp-site PR #224 (`32dc73659e88474046880a84c69ef09da8032811`) and vap-spec PR #70 (`b92955667f94e9c00a061b8c600500939a08c1e2`). It adds one announcement in EN/JA/ZH, archive/home links, sitemap discovery and generated CSP entries for the three new pages. No existing policy or comparison criterion is relaxed.

- The registry's ten additions are source reviews pending registration: 64 total entries = 19 registered + 45 verified/pending. They include industry developments, not only incidents. No independent review is inferred.
- The experimental interop 0.2.0 release was published on 8 November. Its fixed tag/ZIP remains `cbd4502`; PR #68's explicit Ed25519 input policy is main-only. The known issue is conditional on caller-accepted substituted trust and backend behavior. Original trust and the release Node toolchain reject the recorded altered pack. Trust authentication remains required.
- A dated note has been added to the GitHub release body; the prior body is retained verbatim. The tag and all five downloaded assets were compared before/after and were byte-identical. ZIP SHA-256: `4bd598fcb44c743f23e05e4b5ecc5905034edb140391c76b0b3387380a76cf3c`.
- Source website main CI at `32dc736`: five workflows / 11 jobs succeeded; 110 image comparisons, zero failures, zero raster-noise allowances. The wrong-theme control rejected the deliberately incorrect CSS. VAP `b929556` has two successful applicable jobs. These are first-party CI results; this publication's later CI is separate.
- All previous individual announcement files and archive record objects are unchanged. The VAP patch prepends one notice; all 14 previous notice payloads, including the `720852c` image-comparison follow-up, are retained. Normative text/references, implementations, signed data, fixed distributions and K3 are not edited.
- Experimental extensions remain unadopted; independent third-party reproduction has not been established.

## Verification and deployment

Local checks: SEO (414 reachable canonical pages), analytics and legacy URL checks, compiled CSS/assets, CSP policy validation and six policy regression checks, 58 JavaScript tests and 23 Python tests. Desktop/mobile article previews were checked. Full publication CI and live-file verification are recorded separately; these local checks do not predict their results.

`xserver.patch` changes only VAP EN/JA home and update archives and `tools/build.py`. Same-day sitemap timestamps already equal 13 November and need no rewrite. `manifest.json` commits to each old and prepared file hash. A fresh complete VAP folder backup is retained outside public_html; local pre-change archives and public-file hashes are also retained. The patch is reviewed distribution material, not an automatic deployment.

[New notice](https://veritaschain.org/vso/announcements/2026-11-13-registry-release-known-issue/) · [Source CI](https://github.com/veritaschain/vcp-site/actions/runs/43367862506) · [Release warning](https://github.com/veritaschain/vap-spec/releases/tag/vap-interop-demo-v0.2.0) · [Pinned release documentation](https://github.com/veritaschain/vap-spec/blob/b92955667f94e9c00a061b8c600500939a08c1e2/interop/vap-evidence-pack-demo/RELEASE.md)
