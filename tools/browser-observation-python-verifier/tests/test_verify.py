"""Conformance-to-fixed-sample tests; not VAP conformance certification."""
import copy
import json
from pathlib import Path
import subprocess
import sys
import unittest

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
import verify_observation as v  # noqa: E402

PACK_PATH = HERE / "fixtures" / "synthetic-pack.json"
PIN_PATH = HERE / "fixtures" / "synthetic-checkpoint.json"


class IndependentVerifierTests(unittest.TestCase):
    def setUp(self):
        self.pack = v.parse(PACK_PATH.read_bytes())
        self.pin = v.parse(PIN_PATH.read_bytes())

    def bad(self, modify):
        p = copy.deepcopy(self.pack)
        modify(p)
        with self.assertRaises(v.InvalidEvidence):
            v.verify(p)

    def test_original_js_signed_fixture_and_separately_pinned_checkpoint(self):
        result = v.verify(self.pack, self.pin)
        self.assertEqual(result["verdict"], "INTEGRITY_OK")
        self.assertEqual(result["event_count"], 2)
        self.assertEqual(result["key_fingerprint"], "bf10b43e7a8f90045caeaf4821fb00c8c12a930aa9360c3f4688204ab03f71c5")
        self.assertEqual(result["pack_digest"], "7d3555a5a119c4082d77798acdd3cd68eb708e0698d6d72a974c57cfd2e84263")
        self.assertTrue(result["pack_pin_matched"])
        for field in ("external_anchor", "provider_identity", "source_completeness",
                      "trusted_time", "vap_conformance"):
            self.assertEqual(result[field], "NOT_ESTABLISHED")

    def test_valid_self_signed_pack_has_no_trusted_identity_without_pin(self):
        result = v.verify(self.pack)
        self.assertEqual(result["verdict"], "INTEGRITY_OK")
        self.assertFalse(result["key_pin_matched"])
        self.assertFalse(result["pack_pin_matched"])

    def test_modified_text_origin_timestamp_and_event_signature(self):
        for change in [
            lambda p: p["events"][0]["body"].__setitem__("text", "forged"),
            lambda p: p["events"][0]["body"].__setitem__("origin", "https://forged.test"),
            lambda p: p["events"][0]["body"].__setitem__("captured_at", "2026-10-30T00:00:00.000Z"),
            lambda p: p["events"][1].__setitem__("signature", "A" * 86 + "=="),
        ]:
            with self.subTest(change=repr(change)):
                self.bad(change)

    def test_modified_manifest_algorithms_external_anchor_or_count(self):
        for field, value in [("hash_algorithm", "MD5"), ("external_anchor", "ESTABLISHED"),
                             ("event_count", 3), ("merkle_root", "0" * 64)]:
            with self.subTest(field=field):
                self.bad(lambda p: p["manifest"].__setitem__(field, value))

    def test_missing_reordered_duplicated_event(self):
        for change in [
            lambda p: p["events"].pop(),
            lambda p: p["events"].reverse(),
            lambda p: p["events"].append(copy.deepcopy(p["events"][0])),
        ]:
            with self.subTest(change=repr(change)):
                self.bad(change)

    def test_unknown_field_and_noncanonical_base64(self):
        self.bad(lambda p: p["manifest"].__setitem__("unexpected", "x"))
        self.bad(lambda p: p["manifest"].__setitem__(
            "public_key", p["manifest"]["public_key"].rstrip("=")))

    def test_checkpoint_rejects_replacement_and_replay(self):
        for name, value in [("event_count", 1), ("pack_digest", "0" * 64),
                            ("key_fingerprint", "f" * 64), ("ledger_id", "a")]:
            pin = copy.deepcopy(self.pin)
            pin[name] = value
            with self.subTest(name=name), self.assertRaises(v.InvalidEvidence):
                v.verify(self.pack, pin)

    def test_new_key_can_sign_replacement_but_original_checkpoint_rejects_it(self):
        # Valid signatures alone cannot tell whether the signing party is trusted.
        p = copy.deepcopy(self.pack)
        private = Ed25519PrivateKey.generate()
        public = private.public_key().public_bytes(Encoding.Raw, PublicFormat.Raw)
        import base64
        p["manifest"]["public_key"] = base64.b64encode(public).decode()
        prefix = (v.FORMAT + "\nevent\n").encode()
        for item in p["events"]:
            message = prefix + v.canonical({"body": item["body"], "event_hash": item["event_hash"]})
            item["signature"] = base64.b64encode(private.sign(message)).decode()
        p["manifest"]["merkle_root"] = v.merkle_root(p["events"])
        signature = private.sign((v.FORMAT + "\nmanifest\n").encode() + v.canonical(p["manifest"]))
        p["signature"] = base64.b64encode(signature).decode()
        self.assertEqual(v.verify(p)["verdict"], "INTEGRITY_OK")
        with self.assertRaises(v.InvalidEvidence):
            v.verify(p, self.pin)

    def test_strict_parser_rejects_ambiguous_tokens(self):
        cases = [
            b'{"a":1,"a":2}', rb'{"a":1,"\u0061":2}', b'{"a":-0}',
            b'{"a":1.0}', b'{"a":1e2}', b'9007199254740992',
            b'\xef\xbb\xbf{}', rb'"\ud800"',
            (b"[" * 18) + b"0" + (b"]" * 18),
            b'{} trailing', b'\xff',
        ]
        for source in cases:
            with self.subTest(source=source[:35]), self.assertRaises(v.InvalidEvidence):
                v.parse(source)

    def test_sort_js_utf16_keys_not_python_codepoint_order(self):
        text = v.canonical({"\ue000": 1, "\U00010000": 2}).decode("utf-8")
        self.assertEqual(text, '{"\U00010000":2,"\ue000":1}')

    def test_cli_success_and_tampering_exit_status(self):
        command = [sys.executable, str(HERE / "verify_observation.py"),
                   str(PACK_PATH), "--checkpoint", str(PIN_PATH)]
        proc = subprocess.run(command, text=True, capture_output=True, check=False)
        self.assertEqual(proc.returncode, 0, proc.stderr)
        self.assertEqual(json.loads(proc.stdout)["verdict"], "INTEGRITY_OK")
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as td:
            p = copy.deepcopy(self.pack)
            p["events"][1]["body"]["text"] = "forged"
            bad = Path(td) / "bad.json"
            bad.write_text(json.dumps(p), encoding="utf-8")
            proc = subprocess.run([sys.executable, str(HERE / "verify_observation.py"),
                                   str(bad)], text=True, capture_output=True, check=False)
            self.assertEqual(proc.returncode, 1)
            self.assertEqual(json.loads(proc.stderr)["verdict"], "NOT_VERIFIED")


if __name__ == "__main__":
    unittest.main()
