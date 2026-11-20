# VeraSnap business and insurer landing page — 2026-11-20

Adds `/verasnap/`, `/verasnap/ja/` and `/verasnap/zh/` as concise business evaluation and official-link entrances. Existing `/vap/cpp/verasnap/` technical pages and historical notices remain in place. Discovery comes from the shared navigation, the technical pages and both sitemaps.

## Content and status

The pages distinguish the published Verify SDK alpha from the Capture SDK design work, limited VeraCheck Web viewing from full cryptographic verification, and app terms from the SDK license. They do not promise customer adoption, fraud prevention, claims acceptance, legal admissibility or unconditional commercial-use permission. Contact links open an email composer; the site does not accept claim files.

The status text refers to the revision recommended in the SDK README (`5b19884061729c1aadbf3f22daab133c42082ede`), not the latest main commit. The fixed v0.1.0 distribution is not replaced. First-party checks are not independent audit or reproduction. VAP/VCP experimental extensions remain unadopted and independent reproduction remains unestablished.

## Sources

- Product site: https://lp.verasnap.net/ja/
- Insurance product page: https://lp.verasnap.net/ja/insurance/
- App Store: https://apps.apple.com/app/id6757994770
- Google Play: https://play.google.com/store/apps/details?id=org.veritaschain.verasnap
- Verify SDK and limitations: https://github.com/veritaschain/verasnap-verify-sdk
- Existing VSO technical and EULA pages under `/vap/cpp/verasnap/`.

The product site's Chinese route returned 404 at review time. Chinese links explicitly identify the English product pages instead.

## Asset provenance

`assets/images/verasnap/capture-ja-720.jpg` is an unchanged copy of the official public product-site screen example, https://lp.verasnap.net/assets/mockup/capture-ja-720.jpg. The source is 720 × 1558. It is labelled a Japanese screen example whose appearance/features depend on device/version; it is not presented as the latest release screen or an actual customer case.

SHA-256: `7079665a8d5bd56684d68a8eed0f7cd160baeb223fc9fb62010c68d63f9c5afc`

## Rebuild and validation

```
python3 scripts/build-verasnap-special.py
python3 scripts/build-site-directory.py
python3 scripts/site_security.py check
python3 scripts/seo.py check
python3 scripts/analytics-tags.py check
npm run check --prefix tools/site-css
npm run check:assets --prefix tools/site-security
```

The landing source is `data/verasnap-special.json`. Its generator applies the existing CSP builder; there is no new executable inline JavaScript. The existing analytics loader keeps opt-in and URL redaction. The CSS respects reduced motion, the table has a labelled keyboard-focusable scroll region, and FAQ disclosure uses native details elements.

Local checks: 447 canonical pages reachable with zero SEO errors; 446 analytics-eligible pages passed; unchanged generated Tailwind bytes; existing navigation tests 10 passed; policy tests 6, analytics/viewer tests 30 and analytics scope tests 3 passed. Desktop 1440px and mobile 390px checks covered all three new languages, official-link anchors, shared mobile navigation and FAQ disclosure. These are internal checks, not independent product verification.

Backups of changed pre-existing files and their baseline hashes, pre-publication HTTP copies, localized content review and UI evidence are retained privately with the task outputs. No specification, normative requirement, implementation, signed data, fixed distribution or K3 material is changed.
