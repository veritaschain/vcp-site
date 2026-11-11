# Independent Python verifier for VAP Browser Recorder
**Status:** experimental, first-party cross-language reproduction. Not a VAP conformance test, product certification, external audit or a trusted evidence source.

This standalone Python 3.12 CLI independently recomputes the constrained canonical bytes, SHA-256 event hash-chain, complete signed-event Merkle root (RFC 6962 domain prefixes), Ed25519 event/manifest signatures and an optional separately held checkpoint. It **does not import or invoke the JavaScript verifier**. Cryptography is provided by the independently maintained `cryptography` package.

This verifies the local `vap-browser-observation/0.1.0` format retained by Browser Recorder v0.1.2, not the VAP Evidence Pack wire format. The format is `BROWSER-UNICODE-SAFEINT-JSON-v1`, **not unrestricted RFC 8785/JCS**. The original v0.1.0/v0.1.1 signed sample and checkpoint remain unchanged.

## Usage

```sh
python -m pip install -r requirements.txt
python verify_observation.py fixtures/synthetic-pack.json --checkpoint fixtures/synthetic-checkpoint.json
# Regression tests additionally require Node 22+ and the adjacent browser-recorder source.
python -m unittest discover -s tests -p 'test_*.py' -v
```

The fixture files are the **unchanged** original signed sample and checkpoint from `tools/browser-recorder/examples/` on the Browser Recorder v0.1.1 candidate PR, copied byte-for-byte. The tests deliberately exercise tampered text, origin, time, signatures, malformed JSON, reordered/omitted events and a wholly re-signed alternative pack.

## Browser text interoperability

Text emptiness follows the browser's [ECMAScript `trim` operation](https://tc39.es/ecma262/multipage/text-processing.html#sec-string.prototype.trim), using an explicit set of [WhiteSpace and LineTerminator characters](https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-white-space). Using Python's default `str.strip()` for emptiness incorrectly rejected a U+0085-only observation accepted by the browser and accepted U+FEFF-only text the browser rejects. This verifier uses the browser set solely for the emptiness check. It never trims or normalizes the signed text. A UTF-8 BOM at the start of the JSON file remains rejected.

`fixtures/text-validation-vectors.json` contains 38 shared cases: the 25 trim characters, empty/mixed whitespace, U+001C–U+001F and U+0085, non-trim zero-width characters, and meaningful Unicode text with surrounding or embedded trim characters. The test-only Node producer calls the adjacent Recorder's actual append/export/verification code. Python independently verifies the accepted JavaScript-signed packs and their checkpoints, compares canonical bytes, and rejects correctly re-signed whitespace-only packs. The tests also check CLI exit status for U+0085 and U+FEFF. No generated keys or packs are saved as distribution artifacts.

Only the regression suite invokes Node; running `verify_observation.py` remains Python-only. These synthetic format checks do not establish live-browser capture behavior or independent third-party reproduction.

## Verification boundary

An `INTEGRITY_OK` result means the submitted pack is internally consistent and validly signed with its **embedded** Ed25519 public key. It does not show that the embedded key belongs to the claimed provider or any particular person. A checkpoint supplied by the same untrusted party is **not independent trust**. Verify a pinned checkpoint only if the verifier obtained it through an independent, previously trusted channel.

The verifier does not establish source attribution, collection completeness, original webpage authenticity, trusted timestamps, external anchoring, VAP conformance, clinical/factual correctness, or provider identity. Output fields explicitly report these properties as `NOT_ESTABLISHED`.

Python's JSON parser and canonicalizer independently reproduce the *restricted* browser format's UTF-16 object key ordering, Unicode restrictions, integer-only representation, duplicate-key rejection and input size/depth constraints. Internationalized origin edge cases and every browser runtime have not been exhaustively tested. Origin comparison is conservative; valid unusual browser origins may be rejected until covered by fixed cross-language vectors.

## Dependency and scope

The only runtime dependency is `cryptography==46.0.4`; pinned for reproducible CI. This is a separate reference verifier, not a replacement for the browser extension. It does not change previously signed evidence, the manifest schema, or any Browser Recorder distribution ZIP. CI exercises the shipped fixed sample, negative controls and shared text vectors on Python 3.12 with Node 24.22.1, and reruns when either verifier or the browser's core modules change.

Source: VeritasChain Standards Organization (VSO), CC BY 4.0. Please report mismatches as an issue with a non-sensitive synthetic test vector.
