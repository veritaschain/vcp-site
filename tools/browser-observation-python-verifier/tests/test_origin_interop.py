"""Canonical origins are checked against the actual Recorder implementation."""
import base64
import json
from pathlib import Path
import subprocess
import sys
from tempfile import TemporaryDirectory
import unittest

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey

HERE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(HERE))
import verify_observation as v  # noqa: E402


class BrowserOriginInteropTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.vectors = json.loads((HERE / 'fixtures/origin-validation-vectors.json').read_text())['cases']
        run = subprocess.run(
            ['node', str(HERE / 'tests/browser_origin_vectors.mjs')],
            text=True, capture_output=True, timeout=60, check=True,
        )
        cls.rows = json.loads(run.stdout)
        if [row['id'] for row in cls.rows] != [row['id'] for row in cls.vectors]:
            raise AssertionError('Browser producer did not return every origin vector')

    def test_shared_origins_match_browser_validation(self):
        for vector, row in zip(self.vectors, self.rows):
            with self.subTest(vector=vector['id']):
                self.assertEqual(row['accepted'], vector['accepted'])
                if vector['accepted']:
                    v.origin(vector['origin'])
                else:
                    with self.assertRaises(v.InvalidEvidence):
                        v.origin(vector['origin'])

    def test_valid_browser_origins_preserve_signed_bytes_and_pinned_results(self):
        for vector, row in zip(self.vectors, self.rows):
            if not vector['accepted']:
                continue
            with self.subTest(vector=vector['id']):
                pack = v.parse(json.dumps(row['pack'], ensure_ascii=False).encode('utf-8'))
                self.assertEqual(pack['events'][0]['body']['origin'], vector['origin'])
                self.assertEqual(v.canonical(pack).hex(), row['canonical_hex'])
                self.assertEqual(v.verify(pack, row['pin']), row['result'])

    def test_correctly_signed_invalid_origins_are_rejected_with_or_without_pin(self):
        for row in self.rows:
            if row['accepted']:
                continue
            pack, pin = row['pack'], row['pin']
            event = pack['events'][0]
            public = base64.b64decode(pack['manifest']['public_key'])
            key = Ed25519PublicKey.from_public_bytes(public)
            # Independent signature/commitment checks prevent stale negatives.
            for signature, kind, value in [
                (event['signature'], 'event',
                 {'body': event['body'], 'event_hash': event['event_hash']}),
                (pack['signature'], 'manifest', pack['manifest']),
            ]:
                key.verify(base64.b64decode(signature),
                           (v.FORMAT + '\n' + kind + '\n').encode() + v.canonical(value))
            self.assertEqual(event['event_hash'], v.digest(v.canonical(event['body'])))
            self.assertEqual(pack['manifest']['head_hash'], event['event_hash'])
            self.assertEqual(pack['manifest']['merkle_root'], v.merkle_root(pack['events']))
            self.assertEqual(pin['pack_digest'], v.digest(v.canonical(pack)))
            self.assertEqual(pin['key_fingerprint'], v.digest(public))
            self.assertIsNone(row['result'])
            self.assertTrue(row['error'])
            for supplied_pin in (None, pin):
                with self.subTest(vector=row['id'], pinned=supplied_pin is not None):
                    with self.assertRaisesRegex(v.InvalidEvidence, '^Invalid URL origin$'):
                        v.verify(pack, supplied_pin)

    def test_cli_rejects_signed_ipv4_alias_and_accepts_canonical_ipv6(self):
        with TemporaryDirectory() as temp:
            for case_id, expected in [('ipv4-short', 1), ('ipv6-mapped-ipv4', 0)]:
                row = next(row for row in self.rows if row['id'] == case_id)
                path, pin = Path(temp) / 'pack.json', Path(temp) / 'checkpoint.json'
                path.write_text(json.dumps(row['pack']), encoding='utf-8')
                pin.write_text(json.dumps(row['pin']), encoding='utf-8')
                run = subprocess.run(
                    [sys.executable, str(HERE / 'verify_observation.py'), str(path),
                     '--checkpoint', str(pin)],
                    text=True, capture_output=True, timeout=30, check=False,
                )
                with self.subTest(vector=case_id):
                    self.assertEqual(run.returncode, expected, run.stdout + run.stderr)
                    output = json.loads(run.stdout if expected == 0 else run.stderr)
                    self.assertEqual(output['verdict'],
                                     'INTEGRITY_OK' if expected == 0 else 'NOT_VERIFIED')
                    if expected:
                        self.assertEqual(output['error'], 'Invalid URL origin')
                    else:
                        self.assertTrue(output['key_pin_matched'])
                        self.assertTrue(output['pack_pin_matched'])


if __name__ == '__main__':
    unittest.main()
