# GitHub RTA update — 26 October 2026

Website publication only, not specification adoption or a new independent run.

## Source review

Organization-wide recent PRs and public repository updates were checked. The
VCP native-layout research, SDK pre-release and VAP three-valued proposal were
already reflected by website PR #117. Website PRs #118–121 are retained.
Unmerged PRs in other repositories are not represented as completed changes.

The newly reflected work is vcp-rta-reference PRs #2–15, through
`a839d7a918c9a23ce170937f536e6c13b3a69b93` (PR #15, merged).
The current README and fixed-checkpoint MD/JSON were read at that commit.
[Regression CI](https://github.com/veritaschain/vcp-rta-reference/actions/runs/40258239286)
and [historical CI](https://github.com/veritaschain/vcp-rta-reference/actions/runs/40258239228)
were independently queried for SUCCESS status. Test counts and verdicts are
attributed to their recorded first-party results, not a local re-execution.
The referenced CI executed merge 0314e01, with the same tree as target cc695fe.
The website does not label those logs as final-merge executions.

## Publication

- Add EN/JA/ZH dated announcements with pinned source links.
- Update the current homepage RTA section: remove unconditional Silver-tier,
  strict-RFC-tree, historical-anchor and completeness claims contradicted by
  the current README. Preserve dated historical news unchanged.
- Separate ordinary CLI, supplemental verification and historical replay.
- Keep 809 main and 15 historical tests separate from the INDETERMINATE evidence
  result; preserve 30-day artifact retention and environment-lock limitations.
- Add developer entry links and update canonical/hreflang/sitemap/directory.
- Keep one NEW badge on the latest item; align the existing outreach card with
  the localized announcement filter.

## Boundaries

Supplemental formats remain unadopted. Independent reproduction remains
NOT_ESTABLISHED. No current normative text/schema, implementation, signed data,
fixed distribution/tag, previous VAP kit, K3, or XServer-hosted site is changed.
No outside evaluator is contacted or attributed by this publication.

## Website validation

357 canonical pages are statically reachable; SEO/internal-link/hreflang checks
reported zero errors. All 12 legacy destinations passed and all 15 JavaScript
tests passed without skips. Homepage inline scripts passed syntax checks, and
all three homepages have exactly one NEW badge. Browser review at 375 CSS pixels
confirmed no horizontal overflow on the Japanese announcement or homepage;
announcement filtering keeps both the new RTA item and recent outreach visible.
Desktop article layout was also reviewed; the Japanese title uses phrase-level
wrapping. These are website checks, not another execution of the RTA test suites.
