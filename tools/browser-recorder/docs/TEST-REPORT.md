# v0.1.2 distribution and validation record — 2026-11-05

App version: **0.1.2**. The observation/checkpoint contract remains
`vap-browser-observation/0.1.0`. This is a first-party experimental extension,
not an independent audit or a VAP-conformant Evidence Pack implementation.

## Current source and local checks

This revision combines the capture-boundary repair at
`a23bfdfbc02879f2ab6d5939bcb86085d4595ec5` with the selected-range DOM fix at
`a4d785baf395591c47da6531417cba3a79d26432`, and publishes a separately versioned
0.1.2 archive. The retained 0.1.0 and 0.1.1 archives are unchanged.

Local preparation used Linux, Node **v24.22.1** and Python **3.12.14**:

- Dependency-free unit and cryptographic tests: **22 passed, 0 failed, 0 skipped**.
  [Local transcript](v0.1.2-unit-transcript.txt).
- Original signed synthetic pack and its matching checkpoint: `INTEGRITY_OK`.
  [Local verification output](v0.1.2-example-verification.json).
- Current source manifest, two deterministic builds, committed archive bytes,
  ZIP integrity, app/package versions and the three localized download routes
  are checked by `scripts/package.py` and `scripts/check-distribution.py`.
- The observation contract, canonicalization, signing/verifying code, storage,
  extension permissions and fixed signed examples match the retained 0.1.1
  candidate byte-for-byte (apart from the new app version in the manifest).

Chrome is not installed in this local preparation environment. **No local
real-browser execution is claimed for 0.1.2.** The older transcripts in this
archive are historical evidence and are not renamed as current execution.

## Current-release CI gate

The [Browser Recorder workflow](https://github.com/veritaschain/vcp-site/actions/workflows/browser-recorder.yml)
must pass on the release candidate's exact commit before publication. Read the
release PR and its workflow run for that commit, runtime versions, individual
suite results and artifacts; an earlier green run does not validate a later
revision. The workflow retains synthetic evidence for 30 days.

The current gate runs these suites; the counts below describe the selected
suite definitions, not an assertion that this new revision has already run:

| Runtime | Selected suite | Test count |
| --- | --- | ---: |
| Node 24 | Unit and cryptographic checks | 22 |
| Chrome 156.0.8078.80 | Real DOM selection | 10 |
| Chrome 156.0.8078.80 | Large-page selection | 7 |
| Chrome 156.0.8078.80 | Loaded-extension lifecycle | 7 |
| Chrome 156.0.8078.80 | Actual 0.1.0 archive to 0.1.2, plus separate-path control | 2 |
| Chrome 156.0.8078.80 | Actual 0.1.1 archive to 0.1.2, plus separate-path control | 2 |
| Chrome 137.0.7151.119 | Real DOM selection | 10 |
| Chrome 137.0.7151.119 | Large-page selection | 7 |
| Chrome 137.0.7151.119 | Extension storage/export | 1 flow |

Both browser jobs first restore the pinned previous capture source and require
exactly the two selected large-page regression cases to fail with the expected
DOM-budget error. They then restore the current source and run its positive and
negative cases. Those deliberate baseline failures are regression controls.

The upgrade suites use the real hash-pinned old archives, retain the same
installation directory/profile and reload with Developer mode enabled. They
check keys, ledger, old records, exported signatures, append ordering and the
new capture behavior through the actual action/activeTab/ISOLATED path.
A second installation path must have its own empty vault without altering the
original vault. New and old checkpoints remain specific to their own snapshots.

## Previously executed source evidence

The selected-range source predecessor
`a4d785baf395591c47da6531417cba3a79d26432` passed
[run 41294482201](https://github.com/veritaschain/vcp-site/actions/runs/41294482201)
on 2026-11-01. Its actual logs report:

- Chrome 156 job: 22 unit, 10 DOM, 7 large-DOM, 7 lifecycle and **2** upgrade
  tests passed. The upgrade target was the predecessor marked 0.1.1, not 0.1.2.
- Chrome 137 job: 10 DOM, 7 large-DOM and 1 storage/export flow passed.
- Each executed fixed-source suite reported zero failures and zero skips.
  Matrix-excluded suites are not counted as having been executed.
- The two baseline large-page cases failed for the expected reason on each browser.

[The retained 0.1.1 report](TEST-REPORT-v0.1.1.md) and its adjacent transcript
files describe the earlier capture-boundary candidate at `a23bfdf…`, before
the large-DOM fix. [The 0.1.0 report](TEST-REPORT-v0.1.0.md) is also retained.
Neither historical report establishes current-release execution.

## Limits

All tests use synthetic pages/text and temporary profiles. Current
ChatGPT/Claude/Gemini interfaces, Windows/macOS, manual toolbar interaction,
Chrome Web Store installation/updates and Chrome 137 action/activeTab/consent
and upgrade paths remain unverified. The Chrome 137 storage flow's four
internal checkpoints are counted as one flow, not four tests.

Closed Shadow DOM cannot be detected universally. Flat unselected siblings
still require intersection checks; no constant-time claim is made. Signatures
and hashes do not establish provider identity, trusted time, completeness of
the original conversation, external anchoring or VAP conformance.
