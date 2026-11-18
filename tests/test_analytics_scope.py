import contextlib
import importlib.util
import io
from pathlib import Path
import sys
from tempfile import TemporaryDirectory
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('analytics_tags', ROOT / 'scripts/analytics-tags.py')
tags = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tags)
VIEWER = 'vap/cpp/veracheck/index.html'


class AnalyticsScope(unittest.TestCase):
    def test_viewer_source_has_no_analytics_loader_or_vendor_permissions(self):
        source = (ROOT / VIEWER).read_text()
        self.assertNotIn('/assets/js/analytics.js', source)
        self.assertNotIn('googletagmanager.com', source)
        self.assertNotIn('google-analytics.com', source)

    def test_viewer_stays_excluded_even_if_listed_in_sitemap(self):
        with patch.object(tags, '_paths', {VIEWER}):
            self.assertFalse(tags.eligible(ROOT / VIEWER))

    def test_write_removes_accidental_loader_and_check_rejects_its_return(self):
        with TemporaryDirectory() as directory:
            root = Path(directory)
            viewer = root / VIEWER
            viewer.parent.mkdir(parents=True)
            clean = '<!DOCTYPE html><html><head></head><body>Evidence viewer</body></html>'
            dirty = clean.replace('</head>', tags.TAG + '</head>')
            viewer.write_text(dirty)
            with patch.object(tags, 'ROOT', root), patch.object(tags, '_paths', {VIEWER}), contextlib.redirect_stdout(io.StringIO()):
                with patch.object(sys, 'argv', ['analytics-tags.py', 'check']):
                    self.assertEqual(tags.main(), 1)
                with patch.object(sys, 'argv', ['analytics-tags.py', 'write']):
                    self.assertEqual(tags.main(), 0)
                    self.assertEqual(viewer.read_text(), clean)
                    self.assertEqual(tags.main(), 0)
                    self.assertEqual(viewer.read_text(), clean)
                with patch.object(sys, 'argv', ['analytics-tags.py', 'check']):
                    self.assertEqual(tags.main(), 0)


if __name__ == '__main__':
    unittest.main()
