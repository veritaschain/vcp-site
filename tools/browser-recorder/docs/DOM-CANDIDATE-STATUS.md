# Large-DOM capture fix: development candidate

This source tree extends the Browser Recorder 0.1.1 candidate at commit
`a23bfdfbc02879f2ab6d5939bcb86085d4595ec5`. It is NOT a new public release.

## Change and regression

The previous capture loop counted all descendants of the selected range's
common ancestor, including unrelated content. A short two-paragraph selection
could therefore fail on a large page. The replacement TreeWalker prunes
unselected subtrees and counts only intersecting elements against the existing
20,000-element limit. Flat unselected siblings still require intersection
checks; this is not a constant-time or universal performance claim.

Ancestors, interior editors, form controls, observable shadow hosts and embedded
frames retain their previous rejection rules. Signature code, canonical bytes,
storage, permissions, format and signed examples are unchanged.

The new browser suite covers nested and flat large pages with 50,002 unrelated
elements, pruning of unselected descendants, selected editable/embedded/shadow
boundaries, the selected-element budget and structured error messages. CI first
checks that the two positive large-page cases fail against the pinned previous
capture source with the specific DOM-size error, then restores the current
source and runs the complete selected browser-version test suites.

The local Node v22.16.0 capture-only run had 9 passes and 1 expected regression
failure before the fix, then 10 passes and 0 failures/skips after it. The local
Chromium loopback run was blocked by environment policy and is NOT a browser
validation result. Browser results must come from the linked CI run and its
per-version evidence, not from this document's description of the test plan.

## Archive identity and review gates

The previously committed 0.1.1 candidate ZIP (SHA-256
`3a3e4a9fdd91b990b0361fa30234eec724a7a2e557fd2cb2bd2cedcbb13dbbb3`)
is retained unchanged as a historical candidate. It DOES NOT contain this fix.
CI rebuilds that pinned historical source and compares it byte-for-byte with
the retained ZIP. The published 0.1.0 ZIP is also retained unchanged.

CI separately builds this current source as
`VAP_Browser_Recorder_v0.1.1-dom-candidate.zip`, rebuilds it a second time,
compares the two archives, checks ZIP integrity and writes a SHA-256 sidecar.
The current candidate is available only in the successful Chrome 156 workflow
artifact, identified by run and commit; it is not the old website download.
Artifacts expire according to workflow retention. A public release must first
publish the reviewed new archive and synchronize download links, checksums and
versioned status. Do not merge this stacked source change into a public-release
branch while leaving the announcement pointed at the superseded candidate.

Existing TEST-REPORT and transcript files record the earlier fixed candidate;
they have not been relabeled as execution of these new tests. The workflow
artifact contains the new baseline/fixed test outputs and environment metadata.

No live AI-service accounts or real user data are tested. Windows/macOS, manual
toolbar operation, Web Store updates and Chrome 137 action/activeTab/upgrade
remain unverified. This first-party regression does not establish provider
identity, external anchoring, trusted time, source completeness or VAP conformity.
