#!/usr/bin/env python3
"""Install/check one consent-gated analytics loader on public content pages.

No app/demo, redirect, source, maintenance or fixed distribution is instrumented.
Run after page generators: python3 scripts/analytics-tags.py write | check
"""
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
TAG = '<script defer src="/assets/js/analytics.js?v=20261028"></script>'
SCRIPT = re.compile(r'<script\b[^>]*>.*?</script\s*>', re.I | re.S)
EXCLUDED = {'maintenance', 'src', 'node_modules', '.git', 'docs', 'dist'}

def eligible(path):
    rel = path.relative_to(ROOT)
    if any(x in EXCLUDED for x in rel.parts) or 'app' in rel.parts or 'demo' in rel.parts:
        return False
    text = path.read_text(encoding='utf-8')
    if re.search(r'<meta\b[^>]*http-equiv=[\"\x27]refresh', text, re.I):
        return False
    return 'G-XTK1LJKRGV' in text or '/assets/js/analytics.js' in text or rel.as_posix() in sitemap_paths()

_paths = None
def sitemap_paths():
    global _paths
    if _paths is None:
        _paths = set()
        for loc in ET.parse(ROOT / 'sitemap.xml').iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc'):
            part = unquote(urlsplit(loc.text).path).lstrip('/')
            _paths.add(part + 'index.html' if not part or part.endswith('/') else part)
    return _paths

def update(text):
    def remove(match):
        block = match[0]
        if 'G-XTK1LJKRGV' in block and ('googletagmanager.com/gtag/js' in block or re.search(r'gtag\s*\(', block)):
            return ''
        if re.search(r'<script\b[^>]*src=[\"\x27]/assets/js/analytics\.js(?:\?[^\"\x27]*)?[\"\x27]', block):
            return ''
        return block
    text = SCRIPT.sub(remove, text)
    text = re.sub(r'\s*<!-- Google tag \(gtag\.js\) -->', '', text)
    head, sep, body = text.partition('</head>')
    text = re.sub(r'^[ \t]+$', '', head, flags=re.M) + sep + body
    return re.sub(r'</head\s*>', '\n' + TAG + '\n</head>', text, count=1, flags=re.I)

def main():
    write = sys.argv[1:] == ['write']
    if not write and sys.argv[1:] != ['check']:
        raise SystemExit('Usage: analytics-tags.py write | check')
    errors = []; count = 0
    for path in ROOT.rglob('*.html'):
        if not eligible(path):
            continue
        count += 1
        text = path.read_text(encoding='utf-8')
        if write:
            if text.count(TAG) == 1 and 'googletagmanager.com/gtag/js' not in text and not re.search(r'gtag\s*\(', text):
                continue
            path.write_text(update(text), encoding='utf-8')
        elif text.count(TAG) != 1 or 'googletagmanager.com/gtag/js' in text or re.search(r'gtag\s*\(', text):
            errors.append(str(path.relative_to(ROOT)))
    print(f'{count} content pages checked; {len(errors)} failures')
    if errors:
        print('\n'.join(errors)); return 1
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
