# Reproduce the extension lifecycle checks

These seven checks use the actual unpacked extension in headless Chrome for
Testing on synthetic loopback pages. They use a temporary browser profile and
do not access a user's browser, account, conversations or other extensions.

## Setup and run

Use Node 24, the Playwright version pinned in `package-lock.json`, and Chrome
for Testing **156.0.8078.80**. The suite uses the experimental DevTools
`Extensions.loadUnpacked`, `getExtensions` and `triggerAction` commands; an older
browser may lack these automation commands even if it supports the extension.

```sh
npm ci
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-extension
```

`PW_MODULE` may point at an already-installed Playwright module. Set
`BROWSER_EVIDENCE_DIR` to a separate output directory to retain a structured
case list, synthetic JSON/checkpoint exports, and two screenshots. Tests fail
if the browser or required APIs are absent; they do not silently skip.

The CI workflow pins the official Chrome download and checks its SHA-256.
These test launchers use `--no-sandbox` and
`--enable-unsafe-extension-debugging` in an isolated test environment. Those
flags are not installation instructions for a normal user profile.

## What is exercised

The runner starts an HTTP server on an ephemeral `127.0.0.1` port, loads the
shipping manifest, and invokes the extension action against the source tab.
The resulting popup runs the real activeTab and ISOLATED-world capture code.
It checks preview, consent, save and rejection messages through the popup DOM.
The server, browser and temporary profile are removed after the run.

The same profile is reopened to check stored events and the nonextractable
signing key. Concurrency checks call the real storage module from two extension
pages. Downloads and file verification use the vault UI. The CSP check records
an actual `connect-src` violation and confirms no request reached the server.
The final reset creates a new key without invalidating previously exported data.

The Node and browser verifiers use the same implementation. Cross-runtime
agreement is useful compatibility evidence, not independent implementation
validation. An exported checkpoint is not an externally anchored commitment.

## Boundaries

- This is first-party headless automation, not a manual toolbar evaluation.
- The suite tests current-version persistence at the same extension path; it
  does not test installation over a historical version. Separate two-case
  flows for 0.1.0 and 0.1.1 are documented in [the upgrade tests](BROWSER-UPGRADE-TESTS.md).
- Current ChatGPT, Claude and Gemini pages, Windows/macOS, Chrome 137, browser
  sync, external anchors and provider-signed records are outside this run.
  [Chrome 137 storage checks](BROWSER-STORAGE-TESTS.md) are a separate limited
  flow and do not establish action/activeTab behavior on that version.
- Synthetic exports contain generated text and keys, never real conversation
  content. A private CryptoKey is not exported.
- No third-party audit, certification or VAP conformance follows from a pass.

Primary automation reference:
https://chromedevtools.github.io/devtools-protocol/tot/Extensions/
