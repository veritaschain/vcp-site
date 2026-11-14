#!/usr/bin/env python3
"""Render the informative research directory; source proposals are never edited."""
import html
import json
import re
from pathlib import Path
from site_security import apply_csp

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'data/research-pages.json').read_text())
ORIGIN = 'https://veritaschain.org'
esc = html.escape

def url(path, lang):
    return '/' + path + '/' + ('ja/' if lang == 'ja' else '')

def render(page, lang):
    ja = lang == 'ja'
    d = page[lang]
    path = url(page['path'], lang)
    absolute = ORIGIN + path
    title = d['title'] + ' | VCP / VSO'
    hub = url('research', lang)
    home = '/ja/' if ja else '/'
    label = '研究資料' if ja else 'Research resources'
    status = ('実験的拡張・修正案は未採択、第三者による独立再現は未成立です。自社CI、保存証拠の再検証、独立した環境での新規実行を区別します。研究上の一致は完全適合・本番安全性・認証を示しません。' if ja else 'Experimental extensions and proposed repairs remain unadopted; independent third-party reproduction has not been established. First-party CI, historical evidence rechecks and independent fresh execution are distinct. Research agreement is not full conformance, production safety or certification.')
    def replace_source(m):
        s = DATA['sources'][m[1]]
        return '<a href="' + esc(s['url']) + '">' + esc(s['title']) + '</a>'
    cards = '<div class="guide-cards">' + ''.join('<article><h3><a href="' + url(p['path'], lang) + '">' + esc(p[lang]['title']) + '</a></h3><p>' + esc(p[lang]['lead']) + '</p></article>' for p in DATA['pages'] if p['path'] != 'research') + '</div>'
    sections = []
    for section in d['sections']:
        body = re.sub(r'\{\{source:([a-z-]+)\}\}', replace_source, section['html']).replace('{{cards}}', cards)
        sections.append('<section id="' + section['id'] + '"><h2>' + esc(section['title']) + '</h2>' + body + '</section>')
    sources = [DATA['sources'][key] for key in page['sources']]
    sources_html = '<ul>' + ''.join('<li><a href="' + esc(s['url']) + '">' + esc(s['title']) + '</a> · <code>' + esc(s['repo']) + '@' + s['commit'][:7] + '</code></li>' for s in sources) + '</ul>'
    sections.append('<section id="sources"><h2>' + ('参照した公開資料と版' if ja else 'Sources and reviewed revisions') + '</h2><p>' + ('このページは固定コミットの公開資料を整理した案内です。掲載のために研究試験を新規実行したものではありません。過去の試験記録・固定配布物はそのまま保持します。' if ja else 'This page summarizes public materials at pinned commits. Creating it is not a new research test run. Historical test records and fixed distributions remain unchanged.') + '</p>' + sources_html + '</section>')
    toc = ''.join('<li><a href="#' + s['id'] + '">' + esc(s['title']) + '</a></li>' for s in d['sections']) + '<li><a href="#sources">' + ('参照資料' if ja else 'Sources') + '</a></li>'
    schema = {'@context':'https://schema.org','@graph':[{'@type':'CollectionPage' if page['path']=='research' else 'TechArticle','@id':absolute+'#page','url':absolute,'name':title,'headline':d['title'],'description':d['lead'],'inLanguage':lang,'datePublished':DATA['reviewed'],'dateModified':DATA['reviewed'],'author':{'@type':'Organization','name':'VeritasChain Standards Organization (VSO)','url':ORIGIN+'/vso/'},'citation':[s['url'] for s in sources]},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'VSO','item':ORIGIN+home},{'@type':'ListItem','position':2,'name':label,'item':ORIGIN+hub}]+([] if page['path']=='research' else [{'@type':'ListItem','position':3,'name':d['title'],'item':absolute}])}]}
    langlinks = ''.join('<a href="' + url(page['path'], l) + '" lang="'+l+'" hreflang="'+l+'"'+(' aria-current="page"' if l==lang else '')+'>'+t+'</a>' for l,t in [('en','English'),('ja','日本語')])
    alternates = ''.join('<link rel="alternate" hreflang="'+l+'" href="'+ORIGIN+url(page['path'], 'en' if l=='x-default' else l)+'">' for l in ['en','ja','x-default'])
    s = f'''<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(d['lead'],quote=True)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="author" content="VeritasChain Standards Organization (VSO)">
<link rel="canonical" href="{absolute}">{alternates}
<meta property="og:type" content="{'website' if page['path']=='research' else 'article'}"><meta property="og:title" content="{esc(title,quote=True)}"><meta property="og:description" content="{esc(d['lead'],quote=True)}"><meta property="og:url" content="{absolute}"><meta property="og:image" content="{ORIGIN}/assets/OGP.png"><meta property="og:site_name" content="VeritasChain Standards Organization (VSO)"><meta property="og:locale" content="{'ja_JP' if ja else 'en_US'}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title,quote=True)}"><meta name="twitter:description" content="{esc(d['lead'],quote=True)}"><meta name="twitter:image" content="{ORIGIN}/assets/OGP.png">
<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/guides.css"><link rel="stylesheet" href="/assets/css/research-pages.css">
<script type="application/ld+json">{json.dumps(schema,ensure_ascii=False)}</script><script defer src="/assets/js/analytics.js?v=20261103"></script></head>
<body><a class="skip" href="#main">{'本文へ' if ja else 'Skip to content'}</a><header class="site-header"><div class="nav-wrap"><a class="brand" href="{home}"><img src="/press/logo-transparent.png" width="36" height="36" alt="">VSO / {label}</a><nav class="site-nav" aria-label="{'主なナビゲーション' if ja else 'Main navigation'}"><a href="{hub}">{label}</a><a href="/vap/{'ja/' if ja else ''}">VAP</a><a href="/vcp/developers/{'ja/' if ja else ''}">{'開発者向け' if ja else 'Developers'}</a>{langlinks}</nav></div></header>
<main class="wrap" id="main"><nav class="breadcrumb" aria-label="{'パンくず' if ja else 'Breadcrumb'}"><ol><li><a href="{home}">VSO</a></li><li><a href="{hub}">{label}</a></li>{'' if page['path']=='research' else '<li>'+esc(d['title'])+'</li>'}</ol></nav>
<div class="hero"><p class="eyebrow">VSO · Public research resources</p><h1>{esc(d['title'])}</h1><p class="lead">{esc(d['lead'])}</p><p class="byline">{'公開資料の確認日' if ja else 'Public-source review'}: <time datetime="{DATA['reviewed']}">{DATA['reviewed']}</time> · {'解説・非規範' if ja else 'Informative, non-normative'}</p></div>
<aside class="callout" aria-label="{'研究の状態と限界' if ja else 'Research status and limits'}"><p>{status}</p></aside>
<div class="layout"><aside class="toc"><nav aria-label="{'目次' if ja else 'On this page'}"><strong>{'このページの内容' if ja else 'On this page'}</strong><ol>{toc}</ol></nav></aside><article class="content">{''.join(sections)}</article></div></main>
<footer class="footer"><div class="wrap"><strong>VeritasChain Standards Organization (VSO)</strong><p>{'記録の検証は、AIの判断の正しさ・安全性・法令適合を保証しません。' if ja else 'Verification of records does not guarantee correct, safe or legally compliant decisions.'}</p><nav class="footer-links"><a href="{hub}">{label}</a><a href="/guides/{'ja/' if ja else ''}">{'実務ガイド' if ja else 'Practical guides'}</a><a href="/vap/limits/{'ja/' if ja else ''}">{'検証の限界' if ja else 'Verification limits'}</a><a href="/support/{'ja/' if ja else ''}">{'相談・問い合わせ' if ja else 'Contact'}</a><a href="/sitemap/">{'サイト内の全資料' if ja else 'Site directory'}</a></nav></div></footer></body></html>
'''
    return path.lstrip('/') + 'index.html', apply_csp(s, ROOT / (path.lstrip('/') + 'index.html'))

if __name__ == '__main__':
    for page in DATA['pages']:
        for lang in ['en','ja']:
            rel, text = render(page,lang)
            path = ROOT / rel
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text)
            print(rel)
