#!/usr/bin/env python3
"""Build/check per-document CSP from actual static sources.

Usage: python3 scripts/site_security.py build | check
       python3 scripts/site_security.py render RELATIVE_PATH < input.html
Generators should call apply_csp(text, relative_path) before writing HTML.
"""
from __future__ import annotations

import base64
import hashlib
import html
import json
import re
import sys
from functools import lru_cache
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://veritaschain.org'
SKIP = {'.git', 'node_modules', 'dist', 'maintenance'}
CSP_MARKER = 'data-site-csp="1"'
POLICY_FILE = ROOT / 'tools/site-security/policies.json'
VERIFIED_SRI = json.loads((ROOT / 'tools/site-security/script-integrity.json').read_text(encoding='utf-8'))
for asset_url, integrity in VERIFIED_SRI.items():
    algorithm, separator, encoded = integrity.partition('-')
    expected_bytes = {'sha256': 32, 'sha384': 48, 'sha512': 64}.get(algorithm)
    try:
        decoded = base64.b64decode(encoded, validate=True)
    except ValueError as error:
        raise ValueError(f'Invalid SRI base64 for {asset_url}') from error
    if not separator or expected_bytes is None or len(decoded) != expected_bytes:
        raise ValueError(f'Invalid SRI digest for {asset_url}')
EXECUTABLE_TYPES = {'', 'module', 'text/javascript', 'application/javascript', 'text/ecmascript', 'application/ecmascript'}

# Only sources required by code in these files are added. A link in prose is not
# permission to contact or execute code from its destination.
RUNTIME_SOURCES = {
    'assets/js/analytics.js': {
        'script-src': {'https://www.googletagmanager.com'},
        'connect-src': {'https://www.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.google.com'},
        'img-src': {'https://www.googletagmanager.com', 'https://*.google-analytics.com'},
    },
    'assets/js/main.js': {'script-src': {'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js'}},
    'explorer/app/assets/index-CQ5DI-3r.js': {
        'connect-src': {'https://veritaschain-evidence-demo.kamimura0000.chatgpt.site'},
    },
}


def digest(source: str) -> str:
    # HTML normalizes source newlines before script/hash processing.
    source = source.replace('\r\n', '\n').replace('\r', '\n')
    return "'sha256-" + base64.b64encode(hashlib.sha256(source.encode('utf-8')).digest()).decode('ascii') + "'"


def external_origin(value: str, page: str) -> str | None:
    parts = urlsplit(urljoin(ORIGIN + '/' + page, value))
    if parts.scheme in {'data', 'blob'} or not parts.netloc or parts.netloc == 'veritaschain.org':
        return None
    if parts.scheme != 'https' or parts.username or parts.password:
        raise ValueError(f'Review non-HTTPS resource in {page}: {value}')
    return f'{parts.scheme}://{parts.netloc}'


def local_path(value: str, page: str) -> str | None:
    parts = urlsplit(urljoin(ORIGIN + '/' + page, value))
    if parts.scheme != 'https' or parts.netloc != 'veritaschain.org':
        return None
    relative = unquote(parts.path).lstrip('/')
    absolute = (ROOT / relative).resolve()
    if not absolute.is_relative_to(ROOT):
        raise ValueError(f'Unsafe local resource in {page}: {value}')
    return relative if absolute.is_file() else None


@lru_cache(maxsize=None)
def read_source(relative: str) -> str:
    return (ROOT / relative).read_text(encoding='utf-8')


class Sources(HTMLParser):
    def __init__(self, text: str, page: str):
        super().__init__(convert_charrefs=True)
        self.page = page
        self.inline_scripts: list[str] = []
        self.handlers: list[str] = []
        self.local_scripts: set[str] = set()
        self.local_styles: set[str] = set()
        self.styles: list[str] = []
        self.external_scripts: list[dict] = []
        self.script_urls: set[str] = set()
        self.existing_policies: list[str] = []
        self.destinations = {name: set() for name in ('script-src', 'style-src', 'img-src', 'font-src', 'connect-src', 'frame-src', 'media-src', 'form-action')}
        self.script = None
        self.style = None
        self.feed(text)
        if self.script is not None:
            raise ValueError(f'Unclosed script: {page}')

    def resource(self, directive: str, value: str):
        origin = external_origin(value, self.page)
        if origin:
            self.destinations[directive].add(origin)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        for name, value in attrs.items():
            if name.lower().startswith('on') and value is not None:
                self.handlers.append(value)
            if value and value.lstrip().lower().startswith('javascript:'):
                raise ValueError(f'Replace javascript: URL before enforcing CSP: {self.page}')
        if attrs.get('style'):
            self.styles.append(attrs['style'])
        if tag == 'meta' and attrs.get('http-equiv', '').lower() == 'content-security-policy':
            self.existing_policies.append(attrs.get('content', ''))
        if tag == 'script':
            if attrs.get('src'):
                relative = local_path(attrs['src'], self.page)
                if relative:
                    self.local_scripts.add(relative)
                elif external_origin(attrs['src'], self.page):
                    if attrs.get('integrity') != VERIFIED_SRI.get(attrs['src']) or attrs['src'] not in VERIFIED_SRI or attrs.get('crossorigin') != 'anonymous':
                        raise ValueError(f'External script requires verified pinned SRI and anonymous CORS: {self.page}: {attrs["src"]}')
                    self.script_urls.add(attrs['src'])
                    self.external_scripts.append({'url': attrs['src'], 'integrity': attrs['integrity']})
                self.script = {'execute': False, 'text': ''}
            else:
                kind = attrs.get('type', '').strip().lower()
                if kind == 'text/babel':
                    raise ValueError(f'Precompile runtime Babel before enforcing CSP: {self.page}')
                self.script = {'execute': kind in EXECUTABLE_TYPES, 'text': ''}
        if tag == 'style':
            self.style = ''
        if tag == 'link':
            rel = attrs.get('rel', '').split()
            value = attrs.get('href', '')
            if 'stylesheet' in rel or ('preload' in rel and attrs.get('as') == 'style'):
                self.resource('style-src', value)
                relative = local_path(value, self.page)
                if relative:
                    self.local_styles.add(relative)
            elif 'modulepreload' in rel or ('preload' in rel and attrs.get('as') == 'script'):
                self.resource('script-src', value)
            elif 'preload' in rel and attrs.get('as') == 'font':
                self.resource('font-src', value)
        if tag in {'img', 'image'}:
            self.resource('img-src', attrs.get('src', attrs.get('href', attrs.get('xlink:href', ''))))
        if tag in {'iframe', 'frame'}:
            self.resource('frame-src', attrs.get('src', ''))
        if tag in {'audio', 'video', 'source'}:
            self.resource('media-src', attrs.get('src', ''))
            if attrs.get('poster'):
                self.resource('img-src', attrs['poster'])
        if tag == 'form' and attrs.get('action'):
            self.resource('form-action', attrs['action'])
        if attrs.get('formaction'):
            self.resource('form-action', attrs['formaction'])

    def handle_data(self, data):
        if self.script is not None:
            self.script['text'] += data
        if self.style is not None:
            self.style += data

    def handle_endtag(self, tag):
        if tag == 'script' and self.script is not None:
            if self.script['execute']:
                self.inline_scripts.append(self.script['text'])
            self.script = None
        if tag == 'style' and self.style is not None:
            self.styles.append(self.style)
            self.style = None


class MetaLocations(HTMLParser):
    """Locate real metadata tags, without matching text inside script strings."""
    def __init__(self, text: str):
        super().__init__(convert_charrefs=True)
        self.text = text
        self.offsets = [0]
        for line in text.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1] + len(line))
        self.meta = []
        self.heads = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        line, column = self.getpos()
        start = self.offsets[line - 1] + column
        end = start + len(self.get_starttag_text())
        if tag == 'meta':
            self.meta.append((start, end, dict(attrs)))
        if tag == 'head':
            self.heads.append((start, end))


def policy(text: str, page: str) -> tuple[str, dict]:
    sources = Sources(text, page)
    destinations = sources.destinations
    js = '\n'.join(read_source(file) for file in sorted(sources.local_scripts)) + '\n' + '\n'.join(sources.inline_scripts)
    for file in sources.local_scripts:
        for directive, origins in RUNTIME_SOURCES.get(file, {}).items():
            destinations[directive].update(origins)
    # Existing forms use a literal Formspree URL; other fetch/XHR destinations
    # must be represented by their real literal source or a reviewed exception.
    for value in re.findall(r'\b(?:fetch|axios\.(?:get|post|put|delete))\s*\(\s*[\'\"]([^\'\"]+)', js):
        sources.resource('connect-src', value)
    # Google Fonts and the two CSS delivery services serve the linked font files.
    if 'https://fonts.googleapis.com' in destinations['style-src']:
        destinations['font-src'].add('https://fonts.gstatic.com')
    for origin in ('https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'):
        if origin in destinations['style-src']:
            destinations['font-src'].add(origin)
    css = '\n'.join(read_source(file) for file in sorted(sources.local_styles)) + '\n' + '\n'.join(sources.styles)
    for value in re.findall(r'@import\s+(?:url\(\s*)?[\'\"]([^\'\"]+)', css):
        sources.resource('style-src', value)
        if 'fonts.googleapis.com' in value:
            destinations['font-src'].add('https://fonts.gstatic.com')
    for value in re.findall(r'url\(\s*[\'\"]?([^\'\")]+)', css):
        kind = 'font-src' if re.search(r'\.(?:woff2?|ttf|otf|eot)(?:[?#]|$)', value, re.I) else 'img-src'
        sources.resource(kind, value)
    scripts = sorted({digest(source) for source in sources.inline_scripts})
    handlers = sorted({digest(source) for source in sources.handlers})
    directives = {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'object-src': ["'none'"],
        'script-src': ["'self'", *sorted(destinations['script-src']), *sorted(sources.script_urls), *scripts],
        'script-src-attr': ["'unsafe-hashes'", *handlers] if handlers else ["'none'"],
        # Existing CSS-in-JS components and style attributes require this. It
        # does not allow arbitrary scripts or eval.
        'style-src': ["'self'", "'unsafe-inline'", *sorted(destinations['style-src'])],
        'img-src': ["'self'", 'data:', 'blob:', *sorted(destinations['img-src'])],
        'font-src': ["'self'", 'data:', *sorted(destinations['font-src'])],
        'connect-src': ["'self'", *sorted(destinations['connect-src'])],
        'frame-src': ["'self'", 'blob:', *sorted(destinations['frame-src'])],
        'media-src': ["'self'", 'data:', 'blob:', *sorted(destinations['media-src'])],
        'worker-src': ["'self'", 'blob:'],
        'form-action': ["'self'", *sorted(destinations['form-action'])],
    }
    serialized = '; '.join(name + ' ' + ' '.join(values) for name, values in directives.items())
    record = {'inline_script_hashes': scripts, 'handler_hashes': handlers,
              'external_scripts': sources.external_scripts, 'local_scripts': sorted(sources.local_scripts),
              'resource_origins': {key: sorted(value) for key, value in destinations.items() if value},
              'policy': serialized}
    return serialized, record


def apply_csp(text: str, page: str | Path) -> str:
    page = str(page).replace('\\', '/')
    if page.startswith(str(ROOT) + '/'):
        page = page[len(str(ROOT)) + 1:]
    if '\x00' in text:
        raise ValueError(f'Unexpected NUL in HTML source: {page}')
    # Only remove policies managed by this generator. Never silently replace a
    # separately authored policy or permit multiple policies to mask mistakes.
    locations = MetaLocations(text)
    removals = []
    for start, end, attrs in locations.meta:
        equiv = attrs.get('http-equiv', '').lower()
        is_csp = equiv == 'content-security-policy'
        if is_csp and attrs.get('data-site-csp') != '1':
            raise ValueError(f'Review existing non-generated CSP: {page}')
        is_charset = 'charset' in attrs or (equiv == 'content-type' and 'charset=' in attrs.get('content', '').lower())
        if is_charset:
            declared = attrs.get('charset', re.sub(r'.*charset=', '', attrs.get('content', ''), flags=re.I)).strip().lower()
            if declared not in {'utf-8', 'utf8'}:
                raise ValueError(f'Review unexpected encoding {declared}: {page}')
        if is_csp or is_charset:
            line_start = text.rfind('\n', 0, start) + 1
            if not text[line_start:start].strip():
                start = line_start
            if text[end:end + 1] == '\n':
                end += 1
            removals.append((start, end))
    for start, end in reversed(removals):
        text = text[:start] + text[end:]
    heads = MetaLocations(text).heads
    if len(heads) != 1:
        raise ValueError(f'Expected one real head: {page}')
    # Put charset within the first 1024 bytes, then CSP before every fetch/script.
    head_end = heads[0][1]
    serialized, _ = policy(text, page)
    tag = '<meta charset="utf-8">\n<meta http-equiv="Content-Security-Policy" data-site-csp="1" content="' + html.escape(serialized, quote=False).replace('"', '&quot;') + '">'
    return text[:head_end] + '\n' + tag + '\n' + text[head_end:].lstrip('\r\n')


def source_pages() -> list[Path]:
    pages = [path for path in ROOT.rglob('*.html') if not SKIP.intersection(path.relative_to(ROOT).parts)]
    pages += sorted((ROOT / 'src/pages').glob('*.tsx'))
    return sorted(pages)


def main():
    if len(sys.argv) == 3 and sys.argv[1] == 'render':
        sys.stdout.write(apply_csp(sys.stdin.read(), sys.argv[2]))
        return
    if len(sys.argv) != 2 or sys.argv[1] not in {'build', 'check'}:
        raise SystemExit(__doc__)
    records = {}
    changed = []
    for path in source_pages():
        relative = path.relative_to(ROOT).as_posix()
        source = path.read_text(encoding='utf-8')
        result = apply_csp(source, relative)
        if source != result:
            changed.append(relative)
            if sys.argv[1] == 'build':
                path.write_text(result, encoding='utf-8')
        _, records[relative] = policy(result, relative)
    inventory = json.dumps({'schema_version': 1, 'pages': records}, ensure_ascii=False, indent=2) + '\n'
    if sys.argv[1] == 'build':
        POLICY_FILE.write_text(inventory, encoding='utf-8')
    elif not POLICY_FILE.exists() or POLICY_FILE.read_text(encoding='utf-8') != inventory:
        changed.append(str(POLICY_FILE.relative_to(ROOT)))
    if sys.argv[1] == 'check' and changed:
        raise SystemExit('Stale CSP; run python3 scripts/site_security.py build:\n' + '\n'.join(changed))
    print(json.dumps({'documents': len(records), 'updated': len(changed), 'inline_script_hashes': sum(len(row['inline_script_hashes']) for row in records.values()), 'handler_hashes': sum(len(row['handler_hashes']) for row in records.values())}))


if __name__ == '__main__':
    main()
