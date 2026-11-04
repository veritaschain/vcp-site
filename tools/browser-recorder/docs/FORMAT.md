# Local observation format 0.1.0

This is an experimental application contract, not a VAP/profile wire format.
The implementation in extension/lib/core.mjs defines the exact allowed fields.

## Canonical bytes and JSON parsing

`BROWSER-UNICODE-SAFEINT-JSON-v1`: recursively sorted UTF-16 object keys,
array order retained, JSON string escaping, no insignificant whitespace,
UTF-8 encoding. Strings must be well-formed Unicode; no normalization.
Numbers must be safe integers, excluding negative zero. Floating/exponent
tokens, duplicate keys (including escaped equivalents), BOM, invalid UTF-8,
trailing tokens and depth >16 are rejected. Maximum file size: 4 MiB.
The adapted parser's generic string limit is 32768 UTF-16 units; observation
text has the additional limit of 32768 UTF-8 bytes. Unknown fields are rejected.
This is not a claim of full RFC8785 input-domain support.

## Event

body: format, policy_id, ledger_id, event_id, sequence, previous_hash,
kind, origin, text, captured_at. IDs use UUID v4. Sequence begins at 1.
previous_hash is null only for the first event; later events bind the prior
event_hash. The hash is SHA-256(canonical(body)).

The event signature is Ed25519 over UTF-8(`vap-browser-observation/0.1.0\nevent\n`)
followed by canonical({body,event_hash}). Complete event = {body,event_hash,signature}.
Base64 is canonical padded base64; Ed25519 signatures are 64 bytes.

## Manifest and tree

The manifest binds algorithms, local policy, ledger ID, 32-byte raw public key,
count, first/last IDs, final event hash, Merkle root, observation coverage and
explicit unestablished provenance fields. The manifest signature signs UTF-8
(`vap-browser-observation/0.1.0\nmanifest\n`) followed by canonical(manifest).
Pack = {manifest,events,signature}.

RFC6962 tree: leaves SHA256(0x00 || canonical(complete signed event)); nodes
SHA256(0x01 || left || right). Split at the largest power of two strictly less
than the number of leaves. No duplication. Empty primitive = SHA256(empty),
but empty evidence packs are rejected. The manifest's fixed policy and
coverage are application assertions, not a prior external scope commitment.

## Checkpoint

{format,ledger_id,event_count,key_fingerprint,pack_digest}.
format = `vap-browser-observation/0.1.0-checkpoint`.
key_fingerprint = SHA256(raw public key).
pack_digest = SHA256(canonical(entire pack)).
The exact exported pack remains paired with its checkpoint even if more
observations are later added. Canonical digest ignores JSON whitespace.
Pins must be selected through an independently trusted channel by the verifier.
The checkpoint itself is neither signed nor externally anchored and supplies
no trusted time. Same-package distribution of a checkpoint creates no trust.

## Threat boundary

Without a trusted checkpoint, an attacker can create a different key and pack.
A signer can re-sign a truncated or fabricated ledger. Trusted pack digests
detect substitution relative to that one held snapshot, not completeness of
all activity. Local keys, DOM and the operating system are not independent
trust authorities. The application offers no attested capture or identity
verification. A local clock is recorded without trust or monotonicity claims.
