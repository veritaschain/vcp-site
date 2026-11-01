# VAP Browser Recorder 0.1.1

Experimental Chrome extension for recording a user-selected text observation
locally, exporting signed records, and checking their file integrity.

- [Japanese installation and usage guide](README-ja.md)
- [Executed tests and remaining limits](docs/TEST-REPORT.md)
- [Byte contract](docs/FORMAT.md)
- [Changes](CHANGELOG.md) and [attribution](NOTICE.md)

Load the `extension/` directory through Chrome's unpacked-extension interface.
Normal use requires no npm install, API key or server. Exported text is plaintext.
The custom `vap-browser-observation/0.1.0` format is unchanged in app version
0.1.1; it is not a VAP v1.2 conformant Evidence Pack or provider attestation.

## Development checks

Node 22+ runs the dependency-free unit tests and file verifier:

```sh
npm test
node verify.mjs examples/synthetic-pack.json --checkpoint examples/synthetic-checkpoint.json
```

The real browser suites use the locked Playwright dependency and Chrome for
Testing 156.0.8078.80. The lifecycle automation requires that browser's
experimental DevTools extension commands. See [capture](docs/BROWSER-CAPTURE-TESTS.md)
and [lifecycle](docs/BROWSER-EXTENSION-TESTS.md) instructions for exact scope.

```sh
npm ci
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-capture
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-extension
```

## Versioned archive

The repository keeps the historical 0.1.0 ZIP unchanged. To reproduce the
current source archive using Python 3, including its checked file manifest:

```sh
python scripts/package.py --output /tmp/VAP_Browser_Recorder_v0.1.1.zip
```

After intentionally changing source or recorded test evidence, refresh
`SHA256SUMS` with `--refresh-checksums` before building. The archive uses sorted
entries, a fixed date and uncompressed storage for reproducible bytes. CI
compares the rebuilt ZIP to the committed versioned download. A matching hash
only establishes artifact identity; it is not an external trust anchor.
