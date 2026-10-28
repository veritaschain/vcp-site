# GA4 setup — 28 October 2026

**Site changes published; GA4 administrative saves still unconfirmed.**
See [publication.json](publication.json) and [publication-hashes.json](publication-hashes.json). All 391 reviewed served-file hashes match. A full VAP backup remains outside the public webroot. The prepared manifest below is retained as a preparation record.

Website implementation, not a change to VAP/VCP normative requirements.

- Reuse existing property `514599945`, web stream `13062917269`, measurement ID `G-XTK1LJKRGV`.
- One consent-gated shared loader covers 363 public content pages. Local previews never load Google. Applications and demos are excluded from this rollout.
- `veritaschain.org` and `vap.veritaschain.org` share analytics consent and the root-domain GA cookie. Consent lasts 180 days and can be withdrawn from Cookie settings. No advertising consent or Google Signals is enabled by this loader.
- The page URL retains only allowlisted campaign fields; referrer queries and fragments are removed. Custom events never read form values. This is not a guarantee that arbitrary page paths, campaign values or Google's enhanced-measurement parameters can never contain personal data; do not put personal data into URLs or campaigns.
- `contact_click` measures email-link intent; `research_resource_click` measures VSO GitHub-link intent. Neither is `generate_lead`, a confirmed submission, a sale or a protocol conformance result.
- No conversion is inferred from a thank-you page. Forms need an independently verified success integration before a confirmed lead event is enabled.

## Checks and backup

Local automated checks: 29 tests passed, 363 analytics coverage checks passed, 366 SEO page checks passed, and 12 legacy aliases passed. The 360 non-policy HTML pages preserve visible text. Privacy text changes intentionally describe the actual consent behavior in EN/JA/ZH. Desktop and 390px mobile consent controls were inspected.

Pre-change main-site files are preserved in Git at the base in `validation.json`; a separate local ZIP backup was retained. VAP files were freshly retrieved and backed up before preparing its 27-file patch. The unmodified generator reproduced all 26 served HTML files before the one-tag change; removing the added tag reproduces each prior page byte-for-byte. `vap-manifest.json` records the before/after SHA-256 values. No deployment is implied by this preparation record.

## GA4 administration

Japan time zone and JPY currency were already configured. Enhanced measurement and email redaction were already enabled. At inspection, event data retention was 2 months, user retention 14 months, and URL-query redaction disabled. Save attempts for 14-month event retention and query redaction did not survive reload; user verification was requested. These admin changes must not be reported as completed until saved values are read back. Do not create a duplicate property or add advertising/account-access privileges to work around the issue.

Self-run checks and CI are not independent reproduction. Experimental extensions remain unadopted; independent third-party reproduction remains unestablished. Existing implementations, signed data, fixed distributions and K3 are unchanged.
