#!/usr/bin/env python3
"""Standalone Python verification of VAP Browser Recorder local observation packs.

Independent implementation using cryptography's Ed25519 primitives. No browser
or JavaScript verifier is invoked. This is NOT a VAP conformance assessment.
"""
from __future__ import annotations

import argparse
import base64
import binascii
from datetime import datetime
import hashlib
import hmac
import json
from pathlib import Path
import re
import sys
from urllib.parse import urlsplit

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

FORMAT = "vap-browser-observation/0.1.0"
POLICY = "org.veritaschain.experimental.browser-selected-text.v1"
MAX_BYTES = 4 * 1024 * 1024
# Match the shipped browser format's ECMAScript String.prototype.trim predicate:
# WhiteSpace plus LineTerminator. Python's default strip also removes U+0085 and
# U+001C..U+001F, but leaves U+FEFF. Keep this set explicit rather than depending
# on Python's Unicode whitespace tables. It only tests emptiness; signed text
# must never be trimmed or otherwise normalized.
BROWSER_TRIM_CHARACTERS = (
    "\u0009\u000a\u000b\u000c\u000d\u0020\u00a0\u1680"
    "\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a"
    "\u2028\u2029\u202f\u205f\u3000\ufeff"
)
UUID4 = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")
SHA256 = re.compile(r"^[0-9a-f]{64}$")
ISO_MILLIS = re.compile(r"^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$")
PACK_KEYS = {"manifest", "events", "signature"}
MANIFEST_KEYS = {
    "format", "policy_id", "canonicalization", "hash_algorithm", "signature_algorithm",
    "merkle_algorithm", "ledger_id", "public_key", "event_count", "first_event_id",
    "last_event_id", "head_hash", "merkle_root", "coverage", "clock",
    "external_anchor", "provider_attestation",
}
BODY_KEYS = {"format", "policy_id", "ledger_id", "event_id", "sequence",
             "previous_hash", "kind", "origin", "text", "captured_at"}
PIN_KEYS = {"format", "ledger_id", "event_count", "key_fingerprint", "pack_digest"}
MANIFEST_FIXED = {
    "format": FORMAT, "policy_id": POLICY, "canonicalization": "BROWSER-UNICODE-SAFEINT-JSON-v1",
    "hash_algorithm": "SHA-256", "signature_algorithm": "Ed25519",
    "merkle_algorithm": "RFC6962-SHA256", "coverage": "USER_SELECTED_TEXT_ONLY",
    "clock": "LOCAL_UNTRUSTED", "external_anchor": "NONE", "provider_attestation": "NONE",
}


class InvalidEvidence(ValueError):
    pass


def require(condition: bool, message: str) -> None:
    if not condition:
        raise InvalidEvidence(message)


def equal(actual, expected, label: str) -> None:
    require(type(actual) is type(expected) and actual == expected, f"Mismatch: {label}")


def shape(value, fields: set[str], label: str) -> None:
    require(type(value) is dict and value.keys() == fields, f"Invalid fields: {label}")


def string(value: str) -> None:
    require(type(value) is str, "Expected string")
    require(all(not 0xD800 <= ord(ch) <= 0xDFFF for ch in value), "Malformed Unicode")
    require(len(value.encode("utf-16-le")) // 2 <= 32768, "String too long")


def canonical(value) -> bytes:
    """Sorted UTF-16 keys, constrained safe integers and JSON strings; NOT full JCS."""
    def encode(obj, depth):
        require(depth <= 16, "Depth exceeds 16")
        if obj is None:
            return "null"
        if obj is True:
            return "true"
        if obj is False:
            return "false"
        if type(obj) is int:
            require(abs(obj) <= 9007199254740991, "Unsafe JSON integer")
            return str(obj)
        if type(obj) is str:
            string(obj)
            return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
        if type(obj) is list:
            return "[" + ",".join(encode(v, depth + 1) for v in obj) + "]"
        if type(obj) is dict:
            for key in obj:
                string(key)
            return "{" + ",".join(
                json.dumps(key, ensure_ascii=False) + ":" + encode(obj[key], depth + 1)
                for key in sorted(obj, key=lambda s: s.encode("utf-16-be"))
            ) + "}"
        raise InvalidEvidence("Unsupported JSON type")
    return encode(value, 0).encode("utf-8")


def parse(data: bytes):
    require(len(data) <= MAX_BYTES, "Input exceeds 4 MiB")
    try:
        text = data.decode("utf-8", "strict")
    except UnicodeDecodeError as exc:
        raise InvalidEvidence("Invalid UTF-8") from exc
    require(not text.startswith("\ufeff"), "UTF-8 BOM rejected")

    def pairs(items):
        out = {}
        for key, value in items:
            require(key not in out, "Duplicate object key")
            out[key] = value
        return out

    def integer(token):
        require(token != "-0", "Negative zero rejected")
        n = int(token)
        require(abs(n) <= 9007199254740991, "Unsafe integer")
        return n

    def numeric_error(_):
        raise InvalidEvidence("Floating, exponent or non-finite number rejected")

    try:
        obj = json.loads(text, object_pairs_hook=pairs, parse_int=integer,
                         parse_float=numeric_error, parse_constant=numeric_error)
    except (json.JSONDecodeError, RecursionError) as exc:
        raise InvalidEvidence("Invalid JSON syntax or depth") from exc
    canonical(obj)  # Enforce depth and string domain on every field.
    return obj


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def base64_exact(text, size: int) -> bytes:
    require(type(text) is str and len(text) <= 128, "Bad base64 type or length")
    try:
        result = base64.b64decode(text, validate=True)
    except (ValueError, binascii.Error) as exc:
        raise InvalidEvidence("Bad base64") from exc
    require(len(result) == size and base64.b64encode(result).decode() == text,
            "Noncanonical base64 or byte length")
    return result


def uuid4(value) -> None:
    require(type(value) is str and UUID4.fullmatch(value) is not None, "Invalid UUIDv4")


def hash256(value) -> None:
    require(type(value) is str and SHA256.fullmatch(value) is not None, "Invalid SHA-256")


def origin(value) -> None:
    string(value)
    require(len(value) <= 2048, "Origin too long")
    try:
        u = urlsplit(value)
        require(u.scheme in {"http", "https"} and u.hostname is not None
                and u.username is None and u.password is None
                and not u.path and not u.query and not u.fragment, "Invalid origin")
        hostname = u.hostname
        require(hostname.isascii() and hostname == hostname.lower(), "Noncanonical hostname")
        hostname = f"[{hostname}]" if ":" in hostname else hostname
        reconstructed = f"{u.scheme}://{hostname}"
        port = u.port
        if port is not None and (u.scheme, port) not in {("http", 80), ("https", 443)}:
            reconstructed += f":{port}"
        equal(value, reconstructed, "origin")
    except (ValueError, AttributeError) as exc:
        raise InvalidEvidence("Invalid URL origin") from exc


def check_time(value) -> None:
    require(type(value) is str and ISO_MILLIS.fullmatch(value) is not None,
            "Invalid timestamp format")
    try:
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError as exc:
        raise InvalidEvidence("Invalid timestamp") from exc
    equal(dt.isoformat(timespec="milliseconds").replace("+00:00", "Z"), value, "timestamp")


def check_body(body) -> None:
    origin(body["origin"])
    check_time(body["captured_at"])
    text = body["text"]
    string(text)
    require(bool(text.strip(BROWSER_TRIM_CHARACTERS))
            and len(text.encode("utf-8")) <= 32768, "Invalid text")


def merkle_root(events) -> str:
    leaves = [hashlib.sha256(b"\x00" + canonical(e)).digest() for e in events]

    def tree(nodes):
        if len(nodes) == 1:
            return nodes[0]
        split = 1 << ((len(nodes) - 1).bit_length() - 1)
        return hashlib.sha256(b"\x01" + tree(nodes[:split]) + tree(nodes[split:])).digest()

    return tree(leaves).hex()


def verify(pack: dict, pin: dict | None = None) -> dict:
    require(len(canonical(pack)) <= MAX_BYTES, "Pack exceeds 4 MiB")
    shape(pack, PACK_KEYS, "pack")
    manifest = pack["manifest"]
    shape(manifest, MANIFEST_KEYS, "manifest")
    for key, value in MANIFEST_FIXED.items():
        equal(manifest[key], value, key)
    for key in ("ledger_id", "first_event_id", "last_event_id"):
        uuid4(manifest[key])
    for key in ("head_hash", "merkle_root"):
        hash256(manifest[key])
    count = manifest["event_count"]
    require(type(count) is int and 1 <= count <= 500 and type(pack["events"]) is list
            and len(pack["events"]) == count, "Invalid event count")
    public = base64_exact(manifest["public_key"], 32)
    key = Ed25519PublicKey.from_public_bytes(public)
    fingerprint = digest(public)

    def signed(sig, kind, body):
        message = (FORMAT + "\n" + kind + "\n").encode() + canonical(body)
        try:
            key.verify(base64_exact(sig, 64), message)
        except InvalidSignature as exc:
            raise InvalidEvidence("Invalid " + kind + " signature") from exc

    signed(pack["signature"], "manifest", manifest)
    previous = None
    seen = set()
    for index, event in enumerate(pack["events"], 1):
        shape(event, {"body", "event_hash", "signature"}, "event")
        body = event["body"]
        shape(body, BODY_KEYS, "event body")
        for name, expected in {
            "format": FORMAT, "policy_id": POLICY, "ledger_id": manifest["ledger_id"],
            "kind": "USER_SELECTED_DOM_TEXT", "sequence": index,
            "previous_hash": previous,
        }.items():
            equal(body[name], expected, name)
        uuid4(body["event_id"])
        require(body["event_id"] not in seen, "Duplicate event ID")
        seen.add(body["event_id"])
        check_body(body)
        hash256(event["event_hash"])
        equal(event["event_hash"], digest(canonical(body)), "event_hash")
        signed(event["signature"], "event",
               {"body": body, "event_hash": event["event_hash"]})
        previous = event["event_hash"]
    equal(manifest["head_hash"], previous, "head_hash")
    equal(manifest["first_event_id"], pack["events"][0]["body"]["event_id"], "first")
    equal(manifest["last_event_id"], pack["events"][-1]["body"]["event_id"], "last")
    equal(manifest["merkle_root"], merkle_root(pack["events"]), "merkle_root")
    pack_digest = digest(canonical(pack))

    if pin is not None:
        shape(pin, PIN_KEYS, "checkpoint")
        equal(pin["format"], FORMAT + "-checkpoint", "pin format")
        equal(pin["ledger_id"], manifest["ledger_id"], "pin ledger")
        equal(pin["event_count"], count, "pin count")
        hash256(pin["key_fingerprint"])
        hash256(pin["pack_digest"])
        require(hmac.compare_digest(pin["key_fingerprint"], fingerprint), "Pinned key mismatch")
        require(hmac.compare_digest(pin["pack_digest"], pack_digest), "Pinned pack mismatch")

    return {
        "verdict": "INTEGRITY_OK", "event_count": count,
        "key_fingerprint": fingerprint, "pack_digest": pack_digest,
        "key_pin_matched": pin is not None, "pack_pin_matched": pin is not None,
        "external_anchor": "NOT_ESTABLISHED",
        "provider_identity": "NOT_ESTABLISHED",
        "source_completeness": "NOT_ESTABLISHED",
        "trusted_time": "NOT_ESTABLISHED",
        "vap_conformance": "NOT_ESTABLISHED",
    }


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("pack", type=Path)
    p.add_argument("--checkpoint", type=Path)
    args = p.parse_args(argv)
    try:
        record = parse(args.pack.read_bytes())
        checkpoint = parse(args.checkpoint.read_bytes()) if args.checkpoint else None
        print(json.dumps(verify(record, checkpoint), indent=2, ensure_ascii=False))
        return 0
    except (OSError, InvalidEvidence, ValueError) as exc:
        print(json.dumps({"verdict": "NOT_VERIFIED", "error": str(exc)}, ensure_ascii=False),
              file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
