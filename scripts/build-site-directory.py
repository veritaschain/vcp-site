#!/usr/bin/env python3
"""Build the visible site directory from canonical sitemap entries.

Run after updating sitemap.xml: python3 scripts/build-site-directory.py
The directory is a static discovery path; it does not replace the XML sitemap.
"""
import html
import json
from collections import OrderedDict
from urllib.parse import urlsplit

from seo import ORIGIN, NS, ROOT, Page, page_path, sitemap_entries

URL = ORIGIN + '/sitemap/'
TITLE = 'Site Directory | VeritasChain Protocol (VCP) & VSO'
DESCRIPTION = ('Browse the official VSO website: AI governance and audit-trail guides, '
               'VAP and VCP specifications, developer resources, certification, research and multilingual articles.')
LANGUAGES = {'en': 'English', 'ja': '日本語', 'zh': '简体中文', 'zh-CN': '简体中文'}
GROUPS = OrderedDict((name, []) for name in (
    'Start here', 'AI governance and audit-trail guides',
    'Frameworks, profiles and developer resources', 'Tools and demonstrations',
    'Certification', 'Use cases and industry resources',
    'VSO, governance and policies', 'Research announcements', 'Blog and dated articles',
))


def category(url):
    path = urlsplit(url).path
    if path in ('/', '/ja/', '/zh/', '/overview/', '/overview/ja/', '/overview/zh/', '/sitemap/'):
        return 'Start here'
    if path.startswith('/guides/'):
        return 'AI governance and audit-trail guides'
    if path.startswith('/vso/announcements/'):
        return 'Research announcements'
    if path.startswith('/blog/'):
        return 'Blog and dated articles'
    if path.startswith('/certified/'):
        return 'Certification'
    if path.startswith(('/explorer/', '/benchmark/', '/vcc/', '/vap/at/vap-at-portal/', '/vap/cpp/veracheck/')):
        return 'Tools and demonstrations'
    if path.startswith(('/use-cases/', '/solutions/', '/docs/brokers/', '/propfirms/', '/regtech/', '/sec/')):
        return 'Use cases and industry resources'
    if path.startswith(('/vap/', '/vcp/', '/what-is-vcp/')):
        return 'Frameworks, profiles and developer resources'
    return 'VSO, governance and policies'


def main():
    entries = {}
    for entry in sitemap_entries():
        url = entry.findtext(f'{{{NS}}}loc')
        if url == URL:
            continue
        page = Page(page_path(url))
        if not page.indexable or page.canonical != [url]:
            raise ValueError('Directory requires an indexable canonical page: ' + url)
        entries[url] = (page.title, page.lang)

    # These four guide routes are authored with this directory. If the XML
    # addition is still pending, include their real metadata once files exist.
    for path in ('/guides/ai-governance/', '/guides/ai-governance/ja/',
                 '/guides/ai-audit-trail/', '/guides/ai-audit-trail/ja/'):
        url = ORIGIN + path
        if page_path(url).exists() and url not in entries:
            page = Page(page_path(url))
            if not page.indexable or page.canonical != [url]:
                raise ValueError('Guide is not indexable and self-canonical: ' + url)
            entries[url] = (page.title, page.lang)

    entries[URL] = (TITLE, 'en')
    for url, (title, language) in sorted(entries.items()):
        GROUPS[category(url)].append((url, title, language))

    sections = []
    contents = []
    for index, (name, rows) in enumerate(GROUPS.items(), 1):
        if not rows:
            continue
        section_id = f'section-{index}'
        contents.append(f'<a href="#{section_id}">{html.escape(name)} <span>{len(rows)}</span></a>')
        items = []
        for url, title, language in rows:
            path = urlsplit(url).path
            label = LANGUAGES.get(language, language or 'English')
            items.append(
                f'<li><a href="{html.escape(path, quote=True)}" lang="{html.escape(language, quote=True)}">'
                f'{html.escape(title)}</a><span class="language">{html.escape(label)}</span>'
                f'<span class="route">{html.escape(path)}</span></li>'
            )
        body = f'<ul class="page-list">{"".join(items)}</ul>'
        if name == 'Blog and dated articles':
            body = ('<p>These articles are dated records. Check the current specification and the editorial notes '
                    'on each article for subsequent corrections.</p>'
                    f'<details><summary>Browse all {len(rows)} blog pages</summary>{body}</details>')
        sections.append(f'<section id="{section_id}" aria-labelledby="heading-{index}">'
                        f'<h2 id="heading-{index}">{html.escape(name)} <span>{len(rows)}</span></h2>{body}</section>')

    structured = json.dumps({
        '@context': 'https://schema.org', '@type': 'WebPage', '@id': URL + '#webpage',
        'url': URL, 'name': TITLE, 'description': DESCRIPTION, 'inLanguage': 'en',
        'isPartOf': {'@id': ORIGIN + '/#website'},
        'publisher': {'@id': ORIGIN + '/#organization'},
    }, ensure_ascii=False).replace('<', '\\u003c')
    output = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(TITLE)}</title>
  <meta name="description" content="{html.escape(DESCRIPTION, quote=True)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="{URL}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="{html.escape(TITLE, quote=True)}">
  <meta property="og:description" content="{html.escape(DESCRIPTION, quote=True)}">
  <meta property="og:url" content="{URL}">
  <meta property="og:site_name" content="VeritasChain Standards Organization (VSO)">
  <meta property="og:image" content="{ORIGIN}/assets/OGP.png">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@Veritas_chain">
  <meta name="twitter:title" content="{html.escape(TITLE, quote=True)}">
  <meta name="twitter:description" content="{html.escape(DESCRIPTION, quote=True)}">
  <meta name="twitter:image" content="{ORIGIN}/assets/OGP.png">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/assets/css/site-directory.css">
  <script type="application/ld+json">{structured}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to directory</a>
  <header class="site-header">
    <a class="brand" href="/">VeritasChain Standards Organization <span>VSO · VAP · VCP</span></a>
    <nav aria-label="Homepage languages"><a href="/" lang="en">English home</a><a href="/ja/" lang="ja">日本語ホーム</a><a href="/zh/" lang="zh-CN">中文首页</a></nav>
  </header>
  <main id="main">
    <div class="intro"><p class="eyebrow">Explore VSO</p><h1>Site directory</h1>
      <p>Find the specifications, practical guides, research and organizational information published by VeritasChain Standards Organization (VSO).</p>
      <p class="directory-note">{len(entries)} pages, including English, Japanese and Chinese editions. The language label identifies each page's language.</p>
    </div>
    <nav class="contents" aria-label="Directory sections">{"".join(contents)}</nav>
    {''.join(sections)}
  </main>
  <footer><p><a href="/">VeritasChain Standards Organization (VSO)</a> · <a href="/vso/policies/">Organization policies</a> · <a href="/support/">Contact and support</a></p><p>VAP and VeritasChain Protocol (VCP) define verifiable records. Conformance does not establish the correctness, safety or legal compliance of an AI system.</p></footer>
</body>
</html>
'''
    destination = ROOT / 'sitemap/index.html'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(output, encoding='utf-8')
    print(f'Wrote {destination.relative_to(ROOT)} with {len(entries)} canonical pages')


if __name__ == '__main__':
    main()
