#!/usr/bin/env python3
"""Render the EN/JA practical guides from data/practical-pages/*.json.

Each document owns its {sources, page} data. Existing research renderers,
source specifications and implementations are not modified by this builder.
"""
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path

from site_security import apply_csp

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://veritaschain.org'
LANGUAGES = ('en', 'ja')
SOURCE_KEY = r'[A-Za-z0-9_-]+'
SOURCE_TOKEN = re.compile(r'\{\{source:(' + SOURCE_KEY + r')\}\}')
SOURCE_HREF = re.compile(r'\bhref=([\"\'])\{\{source:(' + SOURCE_KEY + r')\}\}\1')
esc = html.escape


def page_url(path, lang):
    return '/' + path + '/' + ('ja/' if lang == 'ja' else '')


def load_documents():
    documents = []
    paths = set()
    for filename in sorted((ROOT / 'data/practical-pages').glob('*.json')):
        document = json.loads(filename.read_text(encoding='utf-8'))
        page = document['page']
        path = page['path']
        if not re.fullmatch(r'[a-z0-9-]+(?:/[a-z0-9-]+)*', path) or path in paths:
            raise ValueError(f'{filename.name}: unsafe or duplicate output path {path!r}')
        paths.add(path)
        for language in LANGUAGES:
            section_ids = [section['id'] for section in page[language]['sections']]
            if (len(section_ids) != len(set(section_ids))
                    or set(section_ids) & {'main', 'sources', 'related-guides'}
                    or any(not re.fullmatch(r'[a-z][a-z0-9-]*', value) for value in section_ids)):
                raise ValueError(f'{filename.name}: invalid or duplicate {language} section IDs')
        for key in page['sources']:
            source = document['sources'][key]
            if not source['url'].startswith('https://'):
                raise ValueError(f'{filename.name}: source {key!r} requires an HTTPS URL')
        document['_filename'] = filename.name
        documents.append(document)
    if not documents:
        raise ValueError('No practical guide data files found')
    return documents


def scrollable_tables(body, label):
    """Wrap only tables without an existing table-wrap ancestor, preserving HTML."""
    class TableLocations(HTMLParser):
        def __init__(self):
            super().__init__(convert_charrefs=False)
            self.offsets = [0]
            for line in body.splitlines(keepends=True):
                self.offsets.append(self.offsets[-1] + len(line))
            self.divs = []
            self.tables = []
            self.edits = []

        def position(self):
            line, column = self.getpos()
            return self.offsets[line - 1] + column

        def handle_starttag(self, tag, attrs):
            if tag == 'div':
                self.divs.append((self.divs and self.divs[-1]) or 'table-wrap' in dict(attrs).get('class', '').split())
            if tag == 'table':
                wrap = not any(self.divs)
                self.tables.append(wrap)
                if wrap:
                    self.edits.append((self.position(), '<div class="table-wrap" role="region" tabindex="0" aria-label="' + esc(label, quote=True) + '">'))

        def handle_endtag(self, tag):
            if tag == 'table' and self.tables:
                if self.tables.pop():
                    self.edits.append((body.index('>', self.position()) + 1, '</div>'))
            if tag == 'div' and self.divs:
                self.divs.pop()

    parser = TableLocations()
    parser.feed(body)
    if parser.tables:
        raise ValueError('Unclosed table in practical guide section')
    for offset, addition in sorted(parser.edits, reverse=True):
        body = body[:offset] + addition + body[offset:]
    return body


def section_html(section, sources, lang):
    """Resolve URL placeholders in hrefs and linked citations in prose separately."""
    def source_url(match):
        return 'href="' + esc(sources[match[2]]['url'], quote=True) + '"'

    def source_link(match):
        source = sources[match[1]]
        return '<a href="' + esc(source['url'], quote=True) + '">' + esc(source['title']) + '</a>'

    body = SOURCE_HREF.sub(source_url, section['html'])
    body = SOURCE_TOKEN.sub(source_link, body)
    if re.search(r'\{+source:', body):
        raise ValueError(f'Unresolved source placeholder in section {section["id"]}')
    # Scrollable code and table regions remain usable with a keyboard at narrow widths.
    code_label = ('コード例：' if lang == 'ja' else 'Code example: ') + section['title']
    body = body.replace('<pre>', '<pre tabindex="0" aria-label="' + esc(code_label, quote=True) + '">')
    body = body.replace('<div class="table-wrap">', '<div class="table-wrap" role="region" tabindex="0" aria-label="' + esc(section['title'], quote=True) + '">')
    return scrollable_tables(body, section['title'])


def render(document, lang, documents):
    page = document['page']
    d = page[lang]
    ja = lang == 'ja'
    reviewed = page['reviewed']
    published = page.get('published', reviewed)
    path = page_url(page['path'], lang)
    absolute = ORIGIN + path
    title = d['title'] + ' | VCP / VSO'
    description = d.get('description', d['lead'])
    home = '/ja/' if ja else '/'
    guides = '/guides/' + ('ja/' if ja else '')
    label = '実務ガイド' if ja else 'Practical guides'
    heading = ''.join('<span class="title-chunk">' + esc(part) + '</span>' for part in d.get('heading_parts', [])) or esc(d['title'])
    sections = [
        '<section id="' + section['id'] + '"><h2>' + esc(section['title']) + '</h2>'
        + section_html(section, document['sources'], lang) + '</section>'
        for section in d['sections']
    ]
    related = [item['page'] for item in documents if item['page']['path'] != page['path']]
    related_title = '次に確認するガイド' if ja else 'Related practical guides'
    if related:
        cards = ''.join('<article><h3><a href="' + page_url(item['path'], lang) + '">' + esc(item[lang]['title']) + '</a></h3><p>' + esc(item[lang]['lead']) + '</p></article>' for item in related)
        sections.append('<section id="related-guides"><h2>' + related_title + '</h2><div class="guide-cards">' + cards + '</div></section>')
    sources = [document['sources'][key] for key in page['sources']]
    source_rows = []
    for source in sources:
        revision = ''
        if source.get('repo'):
            revision = source['repo'] + ('@' + source['commit'][:7] if source.get('commit') else '')
        source_rows.append('<li><a href="' + esc(source['url'], quote=True) + '">' + esc(source['title']) + '</a>' + (' · <code>' + esc(revision) + '</code>' if revision else '') + '</li>')
    default_note = ('参照した資料と版を示します。実行結果がある場合は、対象版・環境・条件を該当箇所に記載しています。過去の試験記録と固定配布物は保持します。' if ja else 'These references identify the reviewed materials and revisions. Where execution results are reported, their source, environment and conditions are stated in the relevant section. Historical test records and fixed distributions are retained.')
    sources_note = d.get('sources_note', default_note)
    sections.append('<section id="sources"><h2>' + ('参照資料と確認した版' if ja else 'Sources and reviewed revisions') + '</h2><p>' + esc(sources_note) + '</p><ul>' + ''.join(source_rows) + '</ul></section>')
    toc = ''.join('<li><a href="#' + section['id'] + '">' + esc(section['title']) + '</a></li>' for section in d['sections'])
    if related:
        toc += '<li><a href="#related-guides">' + related_title + '</a></li>'
    toc += '<li><a href="#sources">' + ('参照資料' if ja else 'Sources') + '</a></li>'
    organization = {'@type': 'Organization', '@id': ORIGIN + '/#organization', 'name': 'VeritasChain Standards Organization (VSO)', 'url': ORIGIN + '/'}
    schema = {'@context': 'https://schema.org', '@graph': [
        {'@type': page.get('schema_type', 'TechArticle'), '@id': absolute + '#page', 'url': absolute, 'name': title, 'headline': d['title'], 'description': description, 'inLanguage': lang, 'datePublished': published, 'dateModified': reviewed, 'author': organization, 'publisher': {'@id': ORIGIN + '/#organization'}, 'image': ORIGIN + '/assets/OGP.png', 'mainEntityOfPage': absolute, 'citation': [source['url'] for source in sources]},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'VSO', 'item': ORIGIN + home}, {'@type': 'ListItem', 'position': 2, 'name': label, 'item': ORIGIN + guides}, {'@type': 'ListItem', 'position': 3, 'name': d['title'], 'item': absolute}]}
    ]}
    alternates = ''.join('<link rel="alternate" hreflang="' + language + '" href="' + ORIGIN + page_url(page['path'], 'en' if language == 'x-default' else language) + '">' for language in ['en', 'ja', 'x-default'])
    langlinks = ''.join('<a href="' + page_url(page['path'], language) + '" lang="' + language + '" hreflang="' + language + '"' + (' aria-current="page"' if language == lang else '') + '>' + text + '</a>' for language, text in [('en', 'English'), ('ja', '日本語')])
    status = ('実験的拡張・修正案は未採択で、第三者によるVAPの独立再現は未成立です。自社の実行確認・CI、保存証拠の再検証、独立した新規実行を区別し、対象の版と条件を確認してください。' if ja else 'Experimental extensions and proposed repairs remain unadopted; independent third-party VAP reproduction has not been established. Distinguish first-party runs and CI, saved-evidence rechecks and independent fresh execution, and check the selected revision and conditions.')
    jsonld = json.dumps(schema, ensure_ascii=False).replace('</', '<\\/')
    text = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description, quote=True)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="VeritasChain Standards Organization (VSO)">
<link rel="canonical" href="{absolute}">{alternates}
<meta property="og:type" content="article"><meta property="og:title" content="{esc(title, quote=True)}"><meta property="og:description" content="{esc(description, quote=True)}"><meta property="og:url" content="{absolute}"><meta property="og:image" content="{ORIGIN}/assets/OGP.png"><meta property="og:image:alt" content="VeritasChain Standards Organization (VSO)"><meta property="og:site_name" content="VeritasChain Standards Organization (VSO)"><meta property="og:locale" content="{'ja_JP' if ja else 'en_US'}"><meta property="og:locale:alternate" content="{'en_US' if ja else 'ja_JP'}">
<meta property="article:published_time" content="{published}T00:00:00+09:00"><meta property="article:modified_time" content="{reviewed}T00:00:00+09:00">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title, quote=True)}"><meta name="twitter:description" content="{esc(description, quote=True)}"><meta name="twitter:image" content="{ORIGIN}/assets/OGP.png">
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/guides.css"><link rel="stylesheet" href="/assets/css/practical-pages.css">
<script type="application/ld+json">{jsonld}</script><script defer src="/assets/js/analytics.js?v=20261103"></script></head>
<body class="practical-page"><a class="skip" href="#main">{'本文へ' if ja else 'Skip to content'}</a><header class="site-header"><div class="nav-wrap"><a class="brand" href="{home}"><img src="/press/logo-transparent.png" width="36" height="36" alt="">VSO / {label}</a><nav class="site-nav" aria-label="{'主なナビゲーション' if ja else 'Main navigation'}"><a href="{guides}">{label}</a><a href="/verasnap/{'ja/' if ja else ''}">VeraSnap</a><a href="/research/{'ja/' if ja else ''}">{'研究資料' if ja else 'Research'}</a>{langlinks}</nav></div></header>
<main class="wrap" id="main"><nav class="breadcrumb" aria-label="{'パンくず' if ja else 'Breadcrumb'}"><ol><li><a href="{home}">VSO</a></li><li><a href="{guides}">{label}</a></li><li aria-current="page">{esc(d['title'])}</li></ol></nav>
<div class="hero"><p class="eyebrow">VSO · {'検証の実務ガイド' if ja else 'Practical verification guides'}</p><h1>{heading}</h1><p class="lead">{esc(d['lead'])}</p><p class="byline">{'確認・更新日' if ja else 'Reviewed and updated'}: <time datetime="{reviewed}">{reviewed}</time> · {'解説・非規範' if ja else 'Informative, non-normative'}</p></div>
<aside class="callout" aria-label="{'状態と検証の限界' if ja else 'Status and verification limits'}"><p>{status}</p></aside>
<div class="layout"><aside class="toc"><nav aria-label="{'目次' if ja else 'On this page'}"><strong>{'このページの内容' if ja else 'On this page'}</strong><ol>{toc}</ol></nav></aside><article class="content">{''.join(sections)}</article></div></main>
<footer class="footer"><div class="wrap"><strong>VeritasChain Standards Organization (VSO)</strong><p>{'記録の検証は、実世界の事実・判断の正しさ・本番安全性・法令適合・保険での受理を保証しません。' if ja else 'Verification of records does not guarantee real-world facts, correct decisions, production safety, legal compliance or insurance acceptance.'}</p><nav class="footer-links"><a href="{guides}">{label}</a><a href="/verasnap/{'ja/' if ja else ''}">VeraSnap</a><a href="/software/status/{'ja/' if ja else ''}">{'公開版・既知問題' if ja else 'Releases and known issues'}</a><a href="/vap/limits/{'ja/' if ja else ''}">{'検証の限界' if ja else 'Verification limits'}</a><a href="/support/{'ja/' if ja else ''}">{'相談・問い合わせ' if ja else 'Contact'}</a><a href="/sitemap/">{'サイト内の全資料' if ja else 'Site directory'}</a></nav></div></footer></body></html>
'''
    relative = path.lstrip('/') + 'index.html'
    return relative, apply_csp(text, relative)


def main():
    documents = load_documents()
    # Render and validate every document before writing any generated page.
    outputs = [render(document, language, documents) for document in documents for language in LANGUAGES]
    for relative, text in outputs:
        target = ROOT / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding='utf-8')
        print(relative)


if __name__ == '__main__':
    main()
