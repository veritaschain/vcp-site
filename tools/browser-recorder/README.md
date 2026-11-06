# VAP Browser Recorder 0.1.2

Experimental Chrome extension for recording a user-selected text observation
locally, exporting signed records, and checking their file integrity.

- [Japanese installation and usage guide](README-ja.md)
- [Executed tests and remaining limits](docs/TEST-REPORT.md)
- [Versioned distribution and retained history](docs/DOM-CANDIDATE-STATUS.md)
- [Byte contract](docs/FORMAT.md)
- [Changes](CHANGELOG.md) and [attribution](NOTICE.md)

Load the `extension/` directory through Chrome's unpacked-extension interface.
Normal use requires no npm install, API key or server. Exported text is plaintext.
The custom `vap-browser-observation/0.1.0` format is unchanged in app version
0.1.2; it is not a VAP v1.2 conformant Evidence Pack or provider attestation.

## Development checks

Node 22+ runs the dependency-free unit tests and file verifier:

```sh
npm test
node verify.mjs examples/synthetic-pack.json --checkpoint examples/synthetic-checkpoint.json
```

The current local check is 22 Node tests; no local Chrome run is claimed.
The validation report links prior source evidence and defines the exact-commit
CI gate for this distribution.

The real browser suites use the locked Playwright dependency. Chrome for
Testing 156.0.8078.80 runs the capture, lifecycle and historical-upgrade suites.
Chrome 137.0.7151.119 runs capture and a limited extension storage/export flow.
The lifecycle/upgrade automation requires the newer browser's DevTools commands.
See [capture](docs/BROWSER-CAPTURE-TESTS.md), [lifecycle](docs/BROWSER-EXTENSION-TESTS.md),
[upgrade](docs/BROWSER-UPGRADE-TESTS.md) and [storage](docs/BROWSER-STORAGE-TESTS.md)
instructions for exact scope. Upgrade tests also require Python 3 and the
hash-pinned historical 0.1.0 / 0.1.1 archives; standalone ZIP users set
`BASELINE_ARCHIVE` to the selected old archive.

```sh
npm ci
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-capture
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-large-dom
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-extension
BASELINE_VERSION=0.1.0 CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-upgrade
BASELINE_VERSION=0.1.1 CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-upgrade
CHROME_EXECUTABLE=/path/to/chrome-137 npm run test:browser-storage
```

The [real-service validation guide](docs/SERVICE-VALIDATION.md) remains unexecuted.
Synthetic and module-level passes do not establish behavior on current service UIs.

## Versioned archive

The repository keeps the historical 0.1.0 and fixed 0.1.1 ZIPs unchanged. To reproduce the
current source archive using Python 3, including its checked file manifest:

```sh
python scripts/package.py --output /tmp/VAP_Browser_Recorder_v0.1.2.zip
```

After intentionally changing source or recorded test evidence, refresh
`SHA256SUMS` with `--refresh-checksums` before building. The archive uses sorted
entries, a fixed date and uncompressed storage for reproducible bytes. CI
compares the rebuilt ZIP to the committed versioned download. In a repository
checkout, `python scripts/check-distribution.py` additionally verifies the
three-language release links, version parity and retained contract bytes. A matching hash
only establishes artifact identity; it is not an external trust anchor.
