# VeraSnap Verify SDK 0.1.0 notice — 18 November 2026

This change adds one EN/JA/ZH notice for the first-party release of VeraSnap Verify SDK 0.1.0 (`veritaschain/verasnap-verify-sdk`, tag `v0.1.0` at `0caa054`, Apache-2.0). It also adds a dated NEWS item and an insurer-page link to the EN/JA/ZH VeraSnap pages.

The notice states what the SDK checks and lists the fraud scenarios it covers and the ones it does not. It separates the published insurer reports, cited from the two primary PDFs, from VSO's analysis. It also discloses that the operator of VSO is the developer. The notice does not describe the SDK as a reference implementation, a conformance test suite or a certification.

The SDK reproduces the VeraSnap app formats, not draft-vso-cpp-core: its Merkle tree has no leaf or node domain separation. Proofs exported from devices running the current apps, a parity run against the apps' scenario tests, independent reproduction and a security audit are listed as not yet done.

Generated with the existing tools:

- `scripts/build-announcements.py`
- `scripts/build-site-directory.py`
- `scripts/site_security.py build`

The three sitemap entries were added in the existing format.

Local checks run:

- 23 Python tests
- 58 Node tests
- incident build check
- SEO check: 438 pages, 0 errors
- CSP check
- legacy-alias and analytics checks
- generated CSS and asset checks

The browser render tests and hosted workflows run separately in CI.

Follow-up (same day): the notice links the Medium article, the LinkedIn post (VSO page) and the X post (@Veritas_chain) published after the notice went live.

The VAP subsite (vap.veritaschain.org) received the EN/JA entry through its own generator, `tools/build.py`. The local rebuild first reproduced the live `index.html`, `ja/index.html`, `updates/index.html` and `ja/updates/index.html` byte for byte; the entry was then added. `sitemap.xml` changes only the four lastmod dates. `xserver.patch` and `xserver-manifest.json` describe the prepared bytes. After upload, all six served files matched the manifest's after-hashes.

No fixed release, signed data, normative requirement or historical notice is changed.
