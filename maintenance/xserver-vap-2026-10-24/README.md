# XServer VAP wording correction — review package

**Draft, not deployed.** This patch is for the separately hosted
`https://vap.veritaschain.org/`, not this repository's main website. Merging this
PR does not apply it to XServer. No server file, existing ZIP, fixed research
distribution, tag, signed data or K3 record has been changed.

## Baseline and scope

The XServer file manager confirmed the served directory as
`veritaschain.org/public_html/vap.veritaschain.org/`. The public root still served
the August wording on 24 October 2026. An existing `vap-deploy.zip` and separate
`vap-deploy` / `vap-deploy-1` directories were also present. The ZIP's home page
differs from the served home page and still contains an earlier commercial
claim. Its existence is not evidence of deployment. This package does not use
that ZIP as the patch baseline, alter it, or infer how the difference arose.

`manifest.json` records SHA-256 before and after for each of the 31 changed
files. Originals were retrieved from their public URLs on 24 October 2026.
`wording-only.patch` covers 26 served HTML pages, three generator sources,
`README.md` and `llms.txt`. The source and rendered wording are both included to
avoid a later regeneration silently restoring the old claims.

The patch propagates the commercial-count withdrawal without claiming zero
customers, labels the site as an informative summary, links the pinned Draft 3
and its digest, records VCP Released separately from its unresolved integrity
review, corrects DVP/AAP names and MAP's registry status, and separates
ScopeManifest experiments from adopted requirements. Existing code examples,
the quoted §1.6 text and incident narratives are preserved. No repair to the
examples or normative specification is represented by this wording change.

The reference is the **already merged** VAP commit
`0f8a2faa2cd50c296c90974476f4b6ecf169c163`, document SHA-256
`a966a6d6de00f84a4d3fc1d6188b833aac0714f50fa7088b87bd475b307d4a3f`.
It deliberately does not describe a pending public-disclosure PR as published.
Reconcile the reference if a newer version is approved before deployment.

## Validation and deployment boundary

- Check every current server file against its **before** hash. If any differs,
  stop and review that difference; do not overwrite it with this snapshot.
- Apply the patch to a fresh local working copy first and compare all **after**
  hashes. The included patch was checked against the retrieved baseline.
- Python source syntax and rendered HTML metadata/JSON-LD were checked; executable
  code blocks and inline scripts were compared with the baseline. The full site
  generator, which has additional assets/modules outside this package, was not
  rerun. Rebuild from a complete source checkout and reconcile generated output
  before publishing a rebuilt site.
- Preview English and Japanese output. Publish only following a separate
  deployment decision and preserve a backup of the actual pre-deployment files.
  Update sitemap/feed modification dates when the approved pages are deployed;
  this proposal is not a claim that they changed on the server today.

Experimental extensions remain **unadopted**. Independent third-party
reproduction remains **unestablished**. This is a website correction package,
not a new specification release, certification decision, or research result.
