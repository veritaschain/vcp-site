# GitHub status and website update — 26 October 2026

This is a website publication record, not a normative adoption or an independent
reproduction report.

## Sources checked

- [VCP PR #16](https://github.com/veritaschain/vcp-spec/pull/16): merged at
  `3f99ba3bf84c86c7b6192f9089aa978e71035287`; reviewed head
  `7ca78559705e3cc8240ce2aa884e12bf24b665db`.
  [Python 3.12/3.14 CI](https://github.com/veritaschain/vcp-spec/actions/runs/40253438920)
  succeeded. The final review records 62 bundle expectations, 14 unit expectations,
  39 regression tests and 8 report-mutation controls. These overlapping checks are
  not an independent-validation count; expected FAIL/UNASSESSED outcomes are not
  successful verification of the corresponding evidence.
- [VCP v1.2 known issues](https://github.com/veritaschain/vcp-spec/blob/943d513fec3c0eaa7eb683120e2d82d5eb748285/spec/v1.2/README.md#known-issues-in-v12-informative)
  and informative status updates through PR #18.
- [vcp-sdk v0.1.0](https://github.com/veritaschain/vcp-sdk/releases/tag/v0.1.0):
  GitHub pre-release published 25 October. First-party offline core, not a
  PyPI/npm release, independent implementation, or implementation of vcp-sdk-spec.
  Its interpretation choices do not adopt normative repairs.
- [VAP PR #26](https://github.com/veritaschain/vap-spec/pull/26) and main
  `81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1`: three-valued proposal clarification,
  still unadopted. Known failures are not erased by separate unknown checks.
- [Website PR #116](https://github.com/veritaschain/vcp-site/pull/116): reviewed
  head `76aea94cb7addbf047ea8375e0669e63d90e7e7b`, merged as
  `b3843132e14a831f522706da1d06a6649ddfdbec`. Its 68-file cross-language status
  correction passed website CI and Pages deployment before this follow-up.
- Official Datatracker records: scitt-vcp-05, vap-framework-02,
  scitt-refusal-events-04, vso-cpp-core-04 and rats-behavioral-evidence-02.
  These are individual Internet-Drafts, not IETF endorsement or WG adoption.

## Publication changes

- Add an English/Japanese/Chinese announcement separating released specifications,
  first-party SDK availability, unadopted research and known limitations.
- Add the announcement to all three homepages, move their sole NEW badge to it,
  and make news filters include the explicit category on recent cards.
- Link the update from VAP, developer and specification resource pages. Clarify
  the distinction between the SDK interface proposal and the separate core library.
- Add a dated correction entry, retaining previous entries unchanged. Update
  canonical/hreflang metadata, sitemap entries and the visible site directory.

## Validation before publication

- `python3 scripts/seo.py check`: 350 canonical public pages, all 350 statically
  reachable, zero metadata/sitemap/internal-link errors.
- `python3 scripts/build-legacy-aliases.py check`: 12 destinations passed.
- `node --test tests/*.test.cjs`: 15 passed, no skips or failures.
- All six inline executable homepage scripts passed `node --check`.
- `git diff --check` passed. Previous correction entries compare equal as JSON.
- Browser review of the Japanese article and homepage confirmed readable layout,
  aligned NEW badge, and correct All/Announcement/Press Release filtering of both
  the new announcement and the earlier commercial correction.

This is a targeted source-backed content review plus site-wide mechanical checks;
it is not a new legal, security, or conformance audit of every historical article.

## Preserved boundaries

Current normative requirements and schemas, protocol implementations, signed data,
fixed distributions/tags and K3 are unchanged. The website's current v1.2 schema
retains SHA-256
`fa73e3e76ebd939f84f6ac28dd6aadd08007aa753feb25f278d58ff02a74eac4`,
matching the repository schema. The earlier VAP reproduction kit (`b1af0dc`,
target `c8ccf97`) remains a separate fixed experiment. No historical announcement
is rewritten by this follow-up. Research extensions remain unadopted, and
independent third-party reproduction remains unestablished.

This change deploys through the veritaschain.org GitHub Pages source. The existing
vap.veritaschain.org XServer page was read to check its status notice; no XServer
files are modified by this change.
