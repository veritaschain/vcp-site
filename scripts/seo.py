#!/usr/bin/env python3
"""Validate published static SEO and regenerate the canonical, multilingual sitemap.

Usage: python3 scripts/seo.py check | sitemap
The sitemap is an explicit public-page allowlist: unlisted demos are not auto-added.
"""
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit, urljoin
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://veritaschain.org'
NS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
XHTML = 'http://www.w3.org/1999/xhtml'
ET.register_namespace('', NS)
ET.register_namespace('xhtml', XHTML)

class Page(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.path = path
        self.meta = {}
        self.links = []
        self.title = ''
        self.lang = ''
        self.h1 = 0
        self.json = []
        self.ids = set()
        self.refs = []
        self.images = []
        self.headers = []
        self.mode = ''
        self.feed(path.read_text(encoding='utf-8'))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'): self.ids.add(attrs['id'])
        if tag == 'a' and attrs.get('name'): self.ids.add(attrs['name'])
        if tag == 'a' and attrs.get('href'): self.refs.append(attrs['href'])
        if tag == 'img': self.images.append(attrs)
        if tag == 'vcp-header': self.headers.append(attrs)
        if tag == 'html': self.lang = attrs.get('lang', '')
        if tag == 'h1': self.h1 += 1
        if tag == 'meta':
            key = attrs.get('name', attrs.get('property', '')).lower()
            self.meta.setdefault(key, []).append(attrs.get('content', ''))
        if tag == 'link': self.links.append(attrs)
        if tag == 'title': self.mode = 'title'
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.mode = 'json'
            self.json.append('')

    def handle_data(self, data):
        if self.mode == 'title': self.title += data
        elif self.mode == 'json': self.json[-1] += data

    def handle_endtag(self, tag):
        if tag in ('title', 'script'): self.mode = ''

    @property
    def canonical(self):
        return [x.get('href', '') for x in self.links if x.get('rel') == 'canonical']

    @property
    def alternates(self):
        return {x['hreflang']: x['href'] for x in self.links if 'hreflang' in x and 'href' in x}

    @property
    def indexable(self):
        return not any('noindex' in x.lower() for x in self.meta.get('robots', []))


def page_path(url):
    parts = urlsplit(url)
    if parts.scheme != 'https' or parts.netloc != 'veritaschain.org':
        raise ValueError('Not a canonical site URL: ' + url)
    path = unquote(parts.path).lstrip('/')
    if '..' in Path(path).parts: raise ValueError('Invalid path: ' + path)
    return ROOT / (path + 'index.html' if path.endswith('/') or not path else path)


def sitemap_entries():
    return ET.parse(ROOT / 'sitemap.xml').getroot().findall(f'{{{NS}}}url')


def check():
    errors = []
    entries = sitemap_entries()
    urls = [e.findtext(f'{{{NS}}}loc') for e in entries]
    for url, count in Counter(urls).items():
        if count > 1: errors.append(f'Duplicate sitemap URL: {url}')
    pages = {}
    for url in urls:
        try:
            page = Page(page_path(url))
            pages[url] = page
        except (ValueError, OSError) as exc:
            errors.append(str(exc)); continue
        rel = str(page.path.relative_to(ROOT))
        if not page.indexable: errors.append(f'{rel}: noindex URL in sitemap')
        if page.canonical != [url]: errors.append(f'{rel}: canonical does not match sitemap')
        if not page.title.strip(): errors.append(f'{rel}: missing title')
        if not page.h1: errors.append(f'{rel}: missing static primary heading')
        if not page.lang: errors.append(f'{rel}: missing language')
        for key in ('description', 'og:title', 'og:description', 'og:url', 'twitter:card'):
            if len(page.meta.get(key, [])) != 1 or not page.meta[key][0].strip(): errors.append(f'{rel}: missing/duplicate {key}')
        if page.meta.get('og:url') != [url]: errors.append(f'{rel}: og:url mismatch')
        for key in ('og:title', 'twitter:title'):
            if page.meta.get(key) != [page.title]: errors.append(f'{rel}: {key} differs from title')
        for key in ('og:description', 'twitter:description'):
            if page.meta.get(key) != page.meta.get('description'): errors.append(f'{rel}: {key} differs from description')
        for data in page.json:
            try: json.loads(data)
            except ValueError: errors.append(f'{rel}: invalid JSON-LD')
    targets = {p.path.resolve(): p for p in pages.values()}
    for url, page in pages.items():
        for header in page.headers:
            if header.get('show-lang-switcher') == 'false': continue
            base = re.sub(r'/(ja|zh)/$', '/', url)
            for lang in header.get('available-langs', 'en,ja,zh').split(','):
                suffix = '' if lang.strip() == 'en' else lang.strip() + '/'
                page.refs.append(base + suffix)
        for ref in page.refs + [i.get('src', '') for i in page.images] + page.meta.get('og:image', []) + page.meta.get('twitter:image', []):
            if not ref or ref == '#': continue
            target = urlsplit(urljoin(url, ref))
            if target.scheme not in ('http', 'https') or target.netloc != 'veritaschain.org': continue
            path = ROOT / unquote(target.path).lstrip('/')
            if path.is_dir(): path /= 'index.html'
            if not path.exists():
                errors.append(f'{url}: missing internal target: {ref}'); continue
            # Client-side fragment routes and text fragments are handled by their applications.
            if target.fragment and path.suffix == '.html' and not target.fragment.startswith(('/', ':~:')):
                dest = targets.get(path.resolve())
                if dest is None:
                    dest = Page(path); targets[path.resolve()] = dest
                if unquote(target.fragment) not in dest.ids:
                    errors.append(f'{url}: missing anchor: {ref}')
        for img in page.images:
            if 'alt' not in img: errors.append(f'{url}: image missing alt: {img.get("src", "")}')
        for language, alternate in page.alternates.items():
            # The Japanese security research page is hosted on EVIDECT.
            if (url == 'https://veritaschain.org/use-cases/security-research/'
                    and language == 'ja' and alternate == 'https://evidect.veritaschain.org/'):
                continue
            if alternate not in pages:
                errors.append(f'{url}: alternate not in canonical sitemap: {alternate}')
            elif language != 'x-default' and url not in pages[alternate].alternates.values():
                errors.append(f'{url}: alternate is not reciprocal: {alternate}')
        entry = entries[urls.index(url)]
        xml_alternates = {x.get('hreflang'): x.get('href') for x in entry.findall(f'{{{XHTML}}}link')}
        if xml_alternates != page.alternates: errors.append(f'{url}: HTML/sitemap alternates differ')
    titles = Counter(p.title.strip() for p in pages.values())
    for title, count in titles.items():
        if count > 1: errors.append(f'Duplicate public page title: {title}')
    print(json.dumps({'public_pages': len(pages), 'errors': errors}, ensure_ascii=False, indent=2))
    return bool(errors)


def sitemap():
    # Preserve existing lastmod values; content updates should set their own factual date.
    root = ET.Element(f'{{{NS}}}urlset')
    seen = set()
    for old in sitemap_entries():
        url = old.findtext(f'{{{NS}}}loc')
        page = Page(page_path(url))
        if not page.indexable or url in seen: continue
        if page.canonical != [url]: raise ValueError('Fix canonical first: ' + url)
        seen.add(url)
        element = ET.SubElement(root, f'{{{NS}}}url')
        ET.SubElement(element, f'{{{NS}}}loc').text = url
        lastmod = old.findtext(f'{{{NS}}}lastmod')
        if lastmod: ET.SubElement(element, f'{{{NS}}}lastmod').text = lastmod
        for language, href in page.alternates.items():
            ET.SubElement(element, f'{{{XHTML}}}link', {'rel': 'alternate', 'hreflang': language, 'href': href})
    ET.indent(root, space='  ')
    ET.ElementTree(root).write(ROOT / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    print(f'Wrote {len(seen)} canonical URLs')

if __name__ == '__main__':
    if len(sys.argv) == 2 and sys.argv[1] == 'sitemap': sitemap()
    elif len(sys.argv) == 2 and sys.argv[1] == 'check': sys.exit(check())
    else: sys.exit(__doc__)
