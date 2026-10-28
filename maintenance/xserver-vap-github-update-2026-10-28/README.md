# Integrated VAP website update — 28 October 2026

## Publication verified

Public HTTPS reads on **28 October 2026 at 11:05–11:06 JST** verified that all
15 manifest files were served with their exact `after_sha256` values. All eight
normal HTML page URLs also returned HTTP 200 without redirects and matched the
corresponding file hashes. See [publication-verification.json](publication-verification.json)
for the observation times, URLs and individual results.

The English and Japanese home and profile pages include the proposed VAP-LAP
profile and AILEX product/use-case reference. The existing 27 October Explorer
notices remain present. A separate assistant content review checked these
sections and the LAP/AILEX links.

This records the observed public state. It does not identify the deployment
operator or exact deployment time, and no XServer write was performed during
this verification. It is not an implementation-conformance or independent
reproduction result. The manifest's `prepared; not deployed` status is retained
as its historical preparation-time state; the publication observation is
recorded separately here.

## Prepared package

This reviewed deployment patch supersedes the earlier VAP-LAP-only patch. It applies to the public 27 October Explorer state retrieved on 28 October, not the earlier 26 October baseline. It retains the complete 159-test Explorer notice and integrates VAP-LAP discovery, current Draft 3 errata/hash references, and first-party SDK boundary-test reporting.

The manifest records exact before/after SHA-256 hashes for 15 files. It is a prepared artifact, not proof of server publication. Check every current file against `before_sha256` before applying; stop on any mismatch. Back up the complete site outside the web root, retain a local archive, publish only listed files, then compare the served bytes with `after_sha256` and check desktop/mobile display. Never apply the older patch over the new Explorer state.

Validation: 26 generated pages match their source; 18 unrelated pages and 40 total public files remain byte-identical, including the fixed ZIP and archived deployment copies. Historical code examples, quoted passages and the complete Explorer notice remain unchanged. Only eight sitemap dates change. The generated llms.txt matches the reviewed text.

Experimental extensions remain unadopted; independent reproduction has not been established. SDK results (306 Python / 140 TypeScript per matrix job) are first-party CI results, not independent reproduction. Current normative requirements, existing implementations, signed data, fixed distributions and K3 are unchanged.
