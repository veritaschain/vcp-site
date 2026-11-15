"""Local key-admission regressions, not a normative Ed25519 profile."""
import base64
import copy
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
import verify_observation as v  # noqa: E402

# Canonical encodings of the full eight-point torsion subgroup. The test
# enumerates points independently of the verifier's y-coordinate set.
SMALL_ORDER = [
    "00" * 32,
    "00" * 31 + "80",
    "01" + "00" * 31,
    "ec" + "ff" * 30 + "7f",
    "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc05",
    "26e8958fc2b227b045c3f489f2ef98f0d5dfac05d3c63339b13802886d53fc85",
    "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac037a",
    "c7176a703d4dd84fba3c0b760d10670f2a2053fa2c39ccc64ec7fd7792ac03fa",
]


class PublicKeyAdmissionTests(unittest.TestCase):
    def setUp(self):
        self.pack = v.parse((HERE / "fixtures/synthetic-pack.json").read_bytes())

    def assert_rejected_before_backend(self, public, reason):
        pack = copy.deepcopy(self.pack)
        pack["manifest"]["public_key"] = base64.b64encode(public).decode()
        # A permissive backend must not be able to bypass the admission check.
        with patch.object(v, "Ed25519PublicKey") as backend:
            with self.assertRaisesRegex(v.InvalidEvidence, reason):
                v.verify(pack)
            backend.from_public_bytes.assert_not_called()

    def test_all_eight_small_order_keys_rejected_before_backend(self):
        for encoded in SMALL_ORDER:
            with self.subTest(encoded=encoded):
                self.assert_rejected_before_backend(bytes.fromhex(encoded), "Small-order")

    def test_zero_x_sign_aliases_rejected_before_backend(self):
        for encoded in ["01" + "00" * 30 + "80", "ec" + "ff" * 31]:
            with self.subTest(encoded=encoded):
                self.assert_rejected_before_backend(bytes.fromhex(encoded), "Small-order")

    def test_all_noncanonical_y_encodings_rejected_before_backend(self):
        for y in range(2**255 - 19, 2**255):
            for sign in (0, 1):
                with self.subTest(y=y, sign=sign):
                    public = (y | (sign << 255)).to_bytes(32, "little")
                    self.assert_rejected_before_backend(public, "Noncanonical")

    def test_identity_forgery_rejected_with_or_without_matching_checkpoint(self):
        identity = b"\x01" + b"\x00" * 31
        # R=identity, S=0: construct signatures without generating or using a
        # private key. Hashes, chain, Merkle root and a supplied pin all match.
        forged_signature = base64.b64encode(identity + b"\x00" * 32).decode()
        for text in ("synthetic forged observation A", "synthetic forged observation B"):
            pack = copy.deepcopy(self.pack)
            manifest = pack["manifest"]
            manifest["public_key"] = base64.b64encode(identity).decode()
            previous = None
            for event in pack["events"]:
                event["body"]["text"] = text
                event["body"]["previous_hash"] = previous
                event["event_hash"] = v.digest(v.canonical(event["body"]))
                event["signature"] = forged_signature
                previous = event["event_hash"]
            manifest["head_hash"] = previous
            manifest["merkle_root"] = v.merkle_root(pack["events"])
            pack["signature"] = forged_signature
            pin = {
                "format": v.FORMAT + "-checkpoint",
                "ledger_id": manifest["ledger_id"],
                "event_count": manifest["event_count"],
                "key_fingerprint": v.digest(identity),
                "pack_digest": v.digest(v.canonical(pack)),
            }
            for checkpoint in (None, pin):
                with self.subTest(text=text, pinned=checkpoint is not None):
                    with self.assertRaisesRegex(v.InvalidEvidence, "Small-order"):
                        v.verify(pack, checkpoint)


if __name__ == "__main__":
    unittest.main()
