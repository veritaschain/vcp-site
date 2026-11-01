# Independent Python verifier for VAP Browser Recorder
**Status:** experimental, first-party cross-language reproduction. Not a VAP conformance test, product certification, external audit or a trusted evidence source.

This standalone Python 3.12 CLI independently recomputes the constrained canonical bytes, SHA-256 event hash-chain, complete signed-event Merkle root (RFC 6962 domain prefixes), Ed25519 event/manifest signatures and an optional separately held checkpoint. It **does not import or invoke the JavaScript verifier**. Cryptography is provided by the independently maintained `cryptography` package.

This verifies the local `vap-browser-observation/0.1.0` format from the Browser Recorder v0.1.0 and v0.1.1 candidate, not the VAP Evidence Pack wire format. The format is `BROWSER-UNICODE-SAFEINT-JSON-v1`, **not unrestricted RFC 8785/JCS**.

## Usage

```sh
python -m pip install -r requirements.txt
python verify_observation.py fixtures/synthetic-pack.json --checkpoint fixtures/synthetic-checkpoint.json
python -m unittest discover -s tests -p 'test_*.py' -v
```

The fixture files are the **unchanged** original signed sample and checkpoint from `tools/browser-recorder/examples/` on the Browser Recorder v0.1.1 candidate PR, copied byte-for-byte. The tests deliberately exercise tampered text, origin, time, signatures, malformed JSON, reordered/omitted events and a wholly re-signed alternative pack.

## Verification boundary

An `INTEGRITY_OK` result means the submitted pack is internally consistent and validly signed with its **embedded** Ed25519 public key. It does not show that the embedded key belongs to the claimed provider or any particular person. A checkpoint supplied by the same untrusted party is **not independent trust**. Verify a pinned checkpoint only if the verifier obtained it through an independent, previously trusted channel.

The verifier does not establish source attribution, collection completeness, original webpage authenticity, trusted timestamps, external anchoring, VAP conformance, clinical/factual correctness, or provider identity. Output fields explicitly report these properties as `NOT_ESTABLISHED`.

Python's JSON parser and canonicalizer independently reproduce the *restricted* browser format's UTF-16 object key ordering, Unicode restrictions, integer-only representation, duplicate-key rejection and input size/depth constraints. Internationalized origin edge cases and every browser runtime have not been exhaustively tested. Origin comparison is conservative; valid unusual browser origins may be rejected until covered by fixed cross-language vectors.

## Dependency and scope

The only runtime dependency is `cryptography==46.0.4`; pinned for reproducible CI. This is a separate reference verifier, not a replacement for the browser extension. It does not change previously signed evidence, the manifest schema, the old ZIP, or the v0.1.1 candidate ZIP. CI exercises the shipped fixed sample and the negative controls on Python 3.12.

Source: VeritasChain Standards Organization (VSO), CC BY 4.0. Please report mismatches as an issue with a non-sensitive synthetic test vector.
