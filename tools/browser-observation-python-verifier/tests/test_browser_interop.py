"""Cross-language tests use Node; the verifier's runtime remains Python-only."""
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


class BrowserTextInteropTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.vectors = json.loads((HERE / 'fixtures/text-validation-vectors.json').read_text())['cases']
        # A missing Node runtime is a failed gate, not a skipped interop check.
        run = subprocess.run(
            ['node', str(HERE / 'tests/browser_text_vectors.mjs')],
            text=True, capture_output=True, timeout=60, check=True,
        )
        cls.rows = json.loads(run.stdout)
        if [row['id'] for row in cls.rows] != [row['id'] for row in cls.vectors]:
            raise AssertionError('Browser producer did not return every shared vector')

    def test_shared_text_vectors_match_browser_validation(self):
        for vector, row in zip(self.vectors, self.rows):
            with self.subTest(vector=vector['id']):
                body = {'origin': 'https://example.test', 'text': vector['text'],
                        'captured_at': '2026-11-06T00:00:00.000Z'}
                if vector['accepted']:
                    v.check_body(body)
                else:
                    with self.assertRaisesRegex(v.InvalidEvidence, '^Invalid text$'):
                        v.check_body(body)
                self.assertEqual(row['accepted'], vector['accepted'])

    def test_js_signed_packs_preserve_text_and_match_pinned_results(self):
        for vector, row in zip(self.vectors, self.rows):
            if not vector['accepted']:
                continue
            with self.subTest(vector=vector['id']):
                pack = v.parse(json.dumps(row['pack'], ensure_ascii=False).encode('utf-8'))
                self.assertEqual(pack['events'][0]['body']['text'], vector['text'])
                self.assertEqual(v.canonical(pack).hex(), row['canonical_hex'])
                self.assertEqual(v.verify(pack, row['pin']), row['result'])

    def test_correctly_signed_whitespace_packs_are_rejected(self):
        for row in self.rows:
            if row['accepted']:
                continue
            with self.subTest(vector=row['id']):
                pack = row['pack']
                event = pack['events'][0]
                public = base64.b64decode(pack['manifest']['public_key'])
                key = Ed25519PublicKey.from_public_bytes(public)
                for signature, kind, value in [
                    (event['signature'], 'event',
                     {'body': event['body'], 'event_hash': event['event_hash']}),
                    (pack['signature'], 'manifest', pack['manifest']),
                ]:
                    key.verify(base64.b64decode(signature),
                               (v.FORMAT + '\n' + kind + '\n').encode() + v.canonical(value))
                self.assertEqual(event['event_hash'], v.digest(v.canonical(event['body'])))
                self.assertEqual(pack['manifest']['merkle_root'], v.merkle_root(pack['events']))
                self.assertEqual(row['error'], 'Select 1–32768 UTF-8 bytes of text')
                with self.assertRaisesRegex(v.InvalidEvidence, '^Invalid text$'):
                    v.verify(pack, row['pin'])

    def test_cli_accepts_next_line_and_rejects_zero_width_no_break_space(self):
        with TemporaryDirectory() as temp:
            for case_id, expected in [('next-line-u0085', 0),
                                      ('zero-width-no-break-space-ufeff', 1)]:
                row = next(row for row in self.rows if row['id'] == case_id)
                path = Path(temp) / (case_id + '.json')
                path.write_text(json.dumps(row['pack']), encoding='utf-8')
                run = subprocess.run(
                    [sys.executable, str(HERE / 'verify_observation.py'), str(path)],
                    text=True, capture_output=True, timeout=30, check=False,
                )
                with self.subTest(vector=case_id):
                    self.assertEqual(run.returncode, expected, run.stderr)
                    output = json.loads(run.stdout if expected == 0 else run.stderr)
                    self.assertEqual(output['verdict'],
                                     'INTEGRITY_OK' if expected == 0 else 'NOT_VERIFIED')
                    if expected:
                        self.assertEqual(output['error'], 'Invalid text')


if __name__ == '__main__':
    unittest.main()
