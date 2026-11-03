#!/usr/bin/env python3
"""Negative fixtures for the source gate; browser enforcement is tested separately."""
import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'scripts'))
from site_security import Sources, VERIFIED_SRI, apply_csp, digest, policy


class PolicyGate(unittest.TestCase):
    def document(self, body):
        return '<!doctype html><html><head><meta charset="utf-8">' + body + '</head><body></body></html>'

    def test_verified_external_pin_and_negative_variants(self):
        url = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        pin = VERIFIED_SRI[url]
        valid = f'<script src="{url}" integrity="{pin}" crossorigin="anonymous"></script>'
        actual, record = policy(self.document(valid), 'fixture.html')
        self.assertIn(url, actual)
        self.assertEqual(record['external_scripts'], [{'url': url, 'integrity': pin}])
        self.assertNotIn('https://cdnjs.cloudflare.com ', actual)
        invalid = [
            valid.replace(f' integrity="{pin}"', ''),
            valid.replace(pin, 'bogus'),
            valid.replace(pin, 'sha384-'),
            valid.replace(pin, 'sha384-' + 'A' * 64),
            valid.replace(url, 'https://cdnjs.cloudflare.com/ajax/libs/other/1.0.0/other.js'),
            valid.replace(' crossorigin="anonymous"', ''),
            valid.replace('anonymous', 'use-credentials'),
        ]
        for source in invalid:
            with self.subTest(source=source), self.assertRaises(ValueError):
                policy(self.document(source), 'fixture.html')

    def test_meta_order_idempotence_and_parser_values(self):
        source = self.document('<script>\r\nwindow.fixture = "<meta charset=ascii>";\r\n</script><button onclick="window.x = &quot;ok&quot;">test</button>')
        result = apply_csp(source, 'fixture.html')
        self.assertEqual(apply_csp(result, 'fixture.html'), result)
        self.assertLess(result.index('<meta charset="utf-8">'), 1024)
        self.assertLess(result.index('data-site-csp="1"'), result.index('<script>'))
        self.assertEqual(result.count('data-site-csp="1"'), 1)
        _, record = policy(result, 'fixture.html')
        self.assertIn(digest('\nwindow.fixture = "<meta charset=ascii>";\n'), record['inline_script_hashes'])
        self.assertIn(digest('window.x = "ok"'), record['handler_hashes'])
        self.assertNotIn("'unsafe-eval'", record['policy'])
        self.assertNotIn("'unsafe-inline'", record['policy'].split(';')[3])

    def test_unreviewed_policy_runtime_compiler_and_script_urls_reject(self):
        for body in [
            '<meta http-equiv="Content-Security-Policy" content="default-src *">',
            '<script type="text/babel">const x = <div />;</script>',
            '<a href="javascript:alert(1)">test</a>',
            '<script src="https://www.googletagmanager.com/gtag/js?id=fixture"></script>',
        ]:
            with self.subTest(body=body), self.assertRaises(ValueError):
                apply_csp(self.document(body), 'fixture.html')

    def test_dynamic_lazy_image_fallback_uses_verified_pin(self):
        source = (ROOT / 'assets/js/main.js').read_text()
        url = re.search(r"script\.src\s*=\s*'([^']+)'", source).group(1)
        integrity = re.search(r"script\.integrity\s*=\s*'([^']+)'", source).group(1)
        self.assertEqual(integrity, VERIFIED_SRI[url])
        self.assertRegex(source, r"script\.crossOrigin\s*=\s*'anonymous'")

    def test_active_explorer_bundle_retains_evidence_connection(self):
        page = 'explorer/app/index.html'
        source = (ROOT / page).read_text()
        actual, record = policy(source, page)
        bundles = [file for file in record['local_scripts']
                   if file.startswith('explorer/app/assets/index-') and file.endswith('.js')]
        self.assertEqual(len(bundles), 1)
        origin = 'https://veritaschain-evidence-demo.kamimura0000.chatgpt.site'
        self.assertIn(origin + '/v1', (ROOT / bundles[0]).read_text())
        connections = next(value.split()[1:] for value in actual.split('; ')
                           if value.startswith('connect-src '))
        # A new hashed bundle must keep the reviewed indirect fetch destination.
        self.assertIn(origin, connections)
        self.assertNotIn('https://explorer.veritaschain.org', connections)


if __name__ == '__main__':
    unittest.main()
