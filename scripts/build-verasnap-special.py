#!/usr/bin/env python3
"""Build the localized business landing page; does not alter product/specification files."""
import json
from html import escape as e
from pathlib import Path
from urllib.parse import quote

from site_security import apply_csp

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data/verasnap-special.json'
ORIGIN = 'https://veritaschain.org'


def path(lang):
    return '/verasnap/' + ('' if lang == 'en' else lang + '/')


def build(lang, d):
    url = ORIGIN + path(lang)
    home = '/' if lang == 'en' else '/' + lang + '/'
    tech = '/vap/cpp/verasnap/' + ('' if lang == 'en' else lang + '/')
    links = ''.join(f'<a class="vs-link" href="{e(x[0], quote=True)}"><strong>{e(x[1])}</strong><span>{e(x[2])}</span><small>{e(x[3])}</small></a>' for x in d['links'])
    structured = {'@context': 'https://schema.org', '@graph': [
        {'@type': 'WebPage', '@id': url+'#page', 'url': url, 'name': d['title'], 'description': d['description'], 'inLanguage': lang, 'datePublished': '2026-11-20', 'dateModified': '2026-11-20', 'publisher': {'@type': 'Organization', 'name': 'VeritasChain Standards Organization (VSO)', 'url': ORIGIN+'/vso/'}, 'about': {'@type': 'SoftwareApplication', 'name': 'VeraSnap', 'url': 'https://lp.verasnap.net/', 'applicationCategory': 'BusinessApplication', 'operatingSystem': 'iOS, Android'}},
        {'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': 1, 'name': 'VSO', 'item': ORIGIN+home}, {'@type': 'ListItem', 'position': 2, 'name': d['breadcrumb'], 'item': url}]}
    ]}
    alternates = ''.join(f'<link rel="alternate" hreflang="{l}" href="{ORIGIN+path(l)}">\n' for l in ('en', 'ja', 'zh'))
    usecases = ''.join(f'<article><p class="vs-kicker">{e(x[0])}</p><h3>{e(x[1])}</h3><p>{e(x[2])}</p></article>' for x in d['usecases'])
    rows = ''.join(f'<tr><th scope="row">{e(x[0])}</th><td>{e(x[1])}</td><td>{e(x[2])}</td></tr>' for x in d['rows'])
    choices = ''.join(f'<article class="vs-choice"><span class="vs-label">{e(x[0])}</span><h3>{e(x[1])}</h3><p>{e(x[2])}</p><a href="{e(x[3], quote=True)}">{e(x[4])}</a></article>' for x in d['choices'])
    steps = ''.join(f'<li><h3>{e(x[0])}</h3><p>{e(x[1])}</p></li>' for x in d['steps'])
    faqs = ''.join(f'<details><summary>{e(x[0])}</summary><p>{e(x[1])}</p></details>' for x in d['faq'])
    nav = ''.join(f'<a href="#{x[0]}">{e(x[1])}</a>' for x in d['nav'])
    headline = ''.join('<span class="vs-title-line">'+e(x)+'</span>' for x in d.get('headlineLines', [d['headline']]))
    capture_caption = {'ja': '公式製品サイト掲載の画面例（日本語）。表示・機能は端末と版により異なります。', 'en': 'Japanese screen example from the official product site. Features and appearance vary by device and version.', 'zh': '官方产品网站展示的日语界面示例。显示内容与功能因设备和版本而异。'}[lang]
    capture_alt = {'ja': 'VeraSnapで車体の損傷を撮影する画面例', 'en': 'VeraSnap capture screen example showing damage to a vehicle', 'zh': '使用VeraSnap拍摄车辆损伤的界面示例'}[lang]
    head = f'''<!DOCTYPE html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(d['title'])}</title><meta name="description" content="{e(d['description'], quote=True)}">
<meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="VeritasChain Standards Organization (VSO)">
<link rel="canonical" href="{url}">{alternates}<link rel="alternate" hreflang="x-default" href="{ORIGIN}/verasnap/">
<meta property="og:type" content="website"><meta property="og:locale" content="{d['locale']}"><meta property="og:site_name" content="VeritasChain Standards Organization (VSO)">
<meta property="og:title" content="{e(d['title'], quote=True)}"><meta property="og:description" content="{e(d['description'], quote=True)}"><meta property="og:url" content="{url}"><meta property="og:image" content="{ORIGIN}/assets/OGP.png">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(d['title'], quote=True)}"><meta name="twitter:description" content="{e(d['description'], quote=True)}"><meta name="twitter:image" content="{ORIGIN}/assets/OGP.png">
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/verasnap-special.css?v=20261120b">
<script defer src="/assets/js/vcp-header.js?v=20261120"></script><script defer src="/assets/js/vcp-footer.js"></script><script defer src="/assets/js/analytics.js?v=20261103"></script>
<script type="application/ld+json">{json.dumps(structured, ensure_ascii=False)}</script></head>
<body><a class="vs-skip" href="#main">{e(d['skip'])}</a><vcp-header theme="dark" lang="{lang}" available-langs="en,ja,zh"></vcp-header>
<main id="main" class="vs-wrap"><nav class="vs-breadcrumb" aria-label="{e(d['breadcrumbLabel'])}"><ol><li><a href="{home}">VSO</a></li><li aria-current="page">{e(d['breadcrumb'])}</li></ol></nav>
<section class="vs-hero" aria-labelledby="hero-title"><div><p class="vs-eyebrow">{e(d['eyebrow'])}</p><p class="vs-product">Vera<span>Snap</span></p><h1 id="hero-title">{headline}</h1><p class="vs-lead">{e(d['lead'])}</p><div class="vs-actions"><a class="vs-button" href="#contact">{e(d['cta'])}</a><a class="vs-button secondary" href="#links">{e(d['linksCta'])}</a></div><p class="vs-fine">{e(d['heroNote'])}</p></div>
<figure class="vs-visual"><div class="vs-flow"><div class="vs-flow-top"><strong>{e(d['diagram'][0])}</strong><span>VeraSnap / CPP</span></div><div class="vs-proof"><span class="vs-proof-icon" aria-hidden="true">P</span><div><strong>{e(d['diagram'][1])}</strong><small>{e(d['diagram'][2])}</small></div></div><div class="vs-flow-line" aria-hidden="true"></div><div class="vs-review"><strong>{e(d['diagram'][3])}</strong><ul>{''.join('<li>'+e(x)+'</li>' for x in d['diagram'][4:7])}</ul><div class="vs-result"><span>{e(d['diagram'][7])}</span><span>{e(d['diagram'][8])}</span></div></div></div><figcaption>{e(d['diagramCaption'])}</figcaption></figure></section>
<nav class="vs-subnav" aria-label="{e(d['pageNav'])}">{nav}</nav>
<section id="use-cases" class="vs-section"><div class="vs-section-head"><h2>{e(d['useTitle'])}</h2><p>{e(d['useLead'])}</p></div><div class="vs-use-layout"><figure><img src="/assets/images/verasnap/capture-ja-720.jpg" width="720" height="1558" loading="lazy" decoding="async" alt="{e(capture_alt)}"><figcaption>{e(capture_caption)}</figcaption></figure><div class="vs-use-list">{usecases}</div></div><p class="vs-caption">{e(d['useNote'])}</p></section>
<section id="verification" class="vs-section"><div class="vs-section-head"><h2>{e(d['verifyTitle'])}</h2><p>{e(d['verifyLead'])}</p></div><div class="vs-table-wrap" role="region" aria-label="{e(d['tableLabel'])}" tabindex="0"><table class="vs-table"><thead><tr>{''.join('<th scope="col">'+e(x)+'</th>' for x in d['columns'])}</tr></thead><tbody>{rows}</tbody></table></div><p class="vs-caption">{e(d['verifyNote'])}</p></section>
<section id="implementation" class="vs-section"><div class="vs-section-head"><h2>{e(d['choiceTitle'])}</h2><p>{e(d['choiceLead'])}</p></div><div class="vs-choices">{choices}</div><aside class="vs-note"><p><strong>{e(d['keyTitle'])}</strong> {e(d['keyNote'])}</p><p>{e(d['captureNote'])}</p></aside></section>
<section id="links" class="vs-section"><div class="vs-section-head"><h2>{e(d['linksTitle'])}</h2><p>{e(d['linksLead'])}</p></div><div class="vs-links">{links}</div></section>
<section id="evaluation" class="vs-section vs-evaluation"><div><p class="vs-eyebrow">EVALUATION</p><h2>{e(d['evaluationTitle'])}</h2><p>{e(d['evaluationLead'])}</p></div><ol class="vs-steps">{steps}</ol></section>
<section class="vs-section vs-faq" id="questions"><h2>{e(d['faqTitle'])}</h2>{faqs}</section>
<section class="vs-contact" id="contact"><p class="vs-eyebrow">{e(d['contactLabel'])}</p><h2>{e(d['contactTitle'])}</h2><p>{e(d['contactLead'])}</p><div class="vs-actions"><a class="vs-button" href="mailto:enterprise@veritaschain.org?subject={quote(d['mailSubject'])}">{e(d['contactCta'])}</a><a class="vs-button secondary" href="{tech}">{e(d['techCta'])}</a></div><p class="vs-fine">enterprise@veritaschain.org · {e(d['contactNote'])}</p></section>
<aside class="vs-status" aria-label="{e(d['statusLabel'])}"><p><strong>{e(d['statusTitle'])}</strong></p><p>{e(d['status'])}</p><p>{e(d['researchStatus'])} <a href="/vap/limits/{'ja/' if lang == 'ja' else ''}">{e(d['limitsLink'])}</a></p><p>{e(d['sourceLabel'])} <a href="https://github.com/veritaschain/verasnap-verify-sdk">Verify SDK README</a> · <a href="https://github.com/veritaschain/verasnap-verify-sdk/blob/main/docs/LIMITATIONS.md">SDK limitations</a> · <a href="{tech}">{e(d['techCta'])}</a></p></aside>
</main><vcp-footer theme="dark" lang="{lang}"></vcp-footer></body></html>
'''
    relative = path(lang).lstrip('/') + 'index.html'
    target = ROOT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(apply_csp(head, relative), encoding='utf-8')
    print(relative)


if __name__ == '__main__':
    for language, data in json.loads(DATA.read_text(encoding='utf-8')).items():
        build(language, data)
