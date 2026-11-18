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

No VAP subsite (vap.veritaschain.org) patch is included. No fixed release, signed data, normative requirement or historical notice is changed.
