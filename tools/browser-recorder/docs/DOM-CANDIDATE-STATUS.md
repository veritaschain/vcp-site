# Selected-range capture fix and 0.1.2 distribution

The large-DOM fix first reviewed at
`a4d785baf395591c47da6531417cba3a79d26432` is incorporated into the separately
versioned **0.1.2** source and archive. It no longer depends on an expiring
`0.1.1-dom-candidate` workflow artifact as its distribution path.

## Fix

The old loop counted all descendants of the selected range's common ancestor,
including unrelated content. A short selection could therefore fail on a large
page. The replacement TreeWalker prunes unselected subtrees and counts only
intersecting elements against the existing 20,000-element limit. Flat unselected
siblings still require intersection checks; this is not a constant-time or
universal performance guarantee.

Ancestors, interior editors, form controls, observable shadow hosts and embedded
frames retain their rejection rules. Canonicalization, signed bytes, storage,
permissions, record format and original signed examples are unchanged.

## Fixed distribution identities

| Archive | SHA-256 / status |
| --- | --- |
| `VAP_Browser_Recorder_v0.1.0.zip` | `d17496cf9b096da85546a1e343e791138a1c807f1a37c518b28c140e424ffcf4`; historical original |
| `VAP_Browser_Recorder_v0.1.1.zip` | `3a3e4a9fdd91b990b0361fa30234eec724a7a2e557fd2cb2bd2cedcbb13dbbb3`; historical boundary-fix candidate, without the large-DOM fix |
| `VAP_Browser_Recorder_v0.1.2.zip` | Current versioned experimental distribution; exact digest in its adjacent `.zip.sha256` file |

The current ZIP, its sidecar and all three announcement locales are committed
together. `scripts/check-distribution.py` verifies every shipped file against
source, both historical archive digests, unchanged signed-contract files,
version parity and the current download/checksum links in EN/JA/ZH.
The workflow also rebuilds the historical 0.1.1 candidate from its pinned commit,
and builds the current source twice before comparing the committed bytes.

Publication remains gated on the **exact candidate commit's** browser workflow.
[The current validation record](TEST-REPORT.md) separates local checks, prior
executed source evidence and current-release CI requirements. Historical
transcripts are not relabeled as new executions.

This is a first-party experimental observation tool. No live service accounts
or real user data are tested. Windows/macOS, manual toolbar operation, Web Store
updates and Chrome 137 action/activeTab/upgrade remain unverified. Test results
do not establish provider identity, external anchoring, trusted time, source
completeness or VAP conformity.
