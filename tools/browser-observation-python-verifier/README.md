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

### Canonical origin admission — 15 November 2026

The earlier Python origin check used `urllib.parse.urlsplit` as if it validated
browser host syntax. A correctly signed pack could therefore pass with a host
containing spaces or forbidden characters, a percent-encoded hostname, an IPv4
alias such as `127.1`, or a noncanonical IPv6 address. These are rejected by the
Recorder's `new URL(value).origin === value` check. This was a format-validation
false acceptance, not evidence of authentic webpage origin or provider identity.

The Python check now admits lowercase `http`/`https` origins with already-ASCII
domains, canonical four-octet decimal IPv4, or bracketed compressed hexadecimal
IPv6 (including mapped IPv4 represented in hex). It rejects forbidden domain
characters, percent escapes, IPv6 zone identifiers, and numeric-ending hosts
unless they are canonical IPv4. Ports must use canonical decimal syntax and
omit the scheme's default. Paths, credentials, query strings and fragments are
not origins. Signed values are compared unchanged; no input is normalized.

This follows the relevant [WHATWG host parsing and serialization rules](https://url.spec.whatwg.org/#host-parsing)
for already serialized ASCII origins. Punycode is retained as ASCII; this is
not Unicode hostname conversion, DNS validation, or a complete independent
implementation of the WHATWG URL parser. Non-ASCII input is outside this
accepted subset. Permitted ASCII punctuation, underscores, empty DNS labels,
and trailing DNS dots are retained rather than imposing stricter DNS rules.

`fixtures/origin-validation-vectors.json` contains 20 valid and 28 invalid
origins. Tests run these through the actual Recorder validator and verifier,
compare canonical bytes and pinned results for valid exports, and reject
invalid origins signed with a real private key after all hashes, signatures,
Merkle roots and supplied checkpoints are recomputed. Signature and commitment
checks independently establish that the negative controls are coherent. CLI
tests also verify rejection status and successful canonical IPv6 pin matching.

### Local public-key admission — 15 November 2026

The Python verifier rejects the eight small-order Ed25519 public keys, their two
invalid zero-x sign aliases, and encodings with y outside the field before it
calls the signature backend. With the pinned `cryptography==46.0.4`, the previous
implementation accepted an identity-key pack with signatures constructed without
a private key. Recomputing the hashes, Merkle root and a matching supplied
checkpoint did not fix this weakness. A pre-existing checkpoint for an ordinary
key still prevented replacement; the reproduction does not bypass such a pin.

This is a local defensive admission rule. It does not change VAP/VCP normative
requirements or redefine the published Browser Recorder format. Other point and
signature checks, including R/S and the verification equation, remain delegated
to `cryptography`; this guard is not a prime-subgroup membership check. The
historical JavaScript implementation and distribution ZIPs remain unchanged,
so rejection of every malformed signature is not claimed to match every browser
or Node backend.

`tests/test_public_keys.py` covers all eight small-order keys, two zero-x sign
aliases and all 38 out-of-field encodings before a deliberately permissive
backend, plus two complete forged messages with and without matching supplied
checkpoints. These checks run normally and with Python assertions disabled.

## Dependency and scope

The only runtime dependency is `cryptography==46.0.4`; pinned for reproducible CI. This is a separate reference verifier, not a replacement for the browser extension. It does not change previously signed evidence, the manifest schema, or any Browser Recorder distribution ZIP. CI exercises the shipped fixed sample, negative controls and shared text vectors on Python 3.12 with both Node 22.23.4 and Node 24.22.1, and reruns when either verifier or the browser's core modules change.

The existing Browser Recorder regression workflow also runs for changes to this
verifier. Its full Chrome lifecycle suite saves an actual synthetic extension
download and checkpoint, then passes those saved files to this Python CLI and
retains the result with the browser artifacts. The checkpoint is a consistency
control generated by the same test, not an independently trusted identity or
time anchor. This adds no browser suite and leaves the minimum Chrome-version
storage test unchanged. A workflow definition alone is not a passing browser
run; consult the checks on the exact reviewed commit.

Source: VeritasChain Standards Organization (VSO), CC BY 4.0. Please report mismatches as an issue with a non-sensitive synthetic test vector.
