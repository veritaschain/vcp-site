#!/usr/bin/env python3
"""Build /vso/corrections/ (EN) and /vso/corrections/ja/ (JA) from corrections.json.

vso/corrections/corrections.json is the only source. Edit it, then run:
    python3 scripts/build_corrections.py
Entries are append-only records: correct an entry by adding a new one.
"""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'vso' / 'corrections' / 'corrections.json'
BASE = 'https://veritaschain.org/vso/corrections/'

STYLE = ('*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:#0b1220;color:#cbd5e1;'
         'font-family:system-ui,-apple-system,sans-serif;line-height:1.85}a{color:#7dd3fc;overflow-wrap:anywhere}'
         'a:hover{color:white}header,main,footer{max-width:960px;margin:auto;padding:28px 24px}header{display:flex;'
         'flex-wrap:wrap;justify-content:space-between;gap:18px;border-bottom:1px solid #334155}nav{display:flex;'
         'gap:18px;flex-wrap:wrap}main{padding-top:48px;padding-bottom:56px}h1,h2{color:#f8fafc;line-height:1.45}'
         'h1{font-size:clamp(1.9rem,4.5vw,3rem);letter-spacing:-.02em;margin:18px 0 24px}h2{font-size:1.15rem;'
         'margin:0 0 6px}p{margin:10px 0}.eyebrow{color:#6ee7b7;font-size:.9rem;letter-spacing:.06em}'
         '.intro{font-size:1.05rem;color:#e2e8f0}ol{list-style:none;padding:0;margin:32px 0 0}'
         'li.entry{margin:0 0 18px;padding:20px 22px;border:1px solid #334155;border-radius:14px;background:#111f33}'
         '.date{color:#fcd34d;font-size:.85rem}.records{font-size:.9rem;color:#94a3b8}.records a{margin-right:14px}'
         'footer{border-top:1px solid #334155;font-size:.9rem}')

TEXT = {
    'en': {
        'url': BASE,
        'title': 'Corrections log | VCP / VSO — VeritasChain',
        'h1': 'Corrections log',
        'desc': 'Dated corrections to VSO specifications, repository READMEs and veritaschain.org, newest first, each linked to its change record.',
        'eyebrow': 'VCP / VSO · CORRECTIONS',
        'intro': ('VSO corrects its public statements by adding dated records rather than silently rewriting them. '
                  'This page lists corrections to the specifications, repository READMEs and this website, newest first. '
                  'Each entry links to its change record. Dated announcements and blog posts are kept as records of what '
                  'was published at the time; where they are affected, they carry a note.'),
        'records': 'Records:',
        'back': 'VSO announcements',
        'updated': 'Last updated',
        'home': '/#news-container',
        'langname': 'English',
    },
    'ja': {
        'url': BASE + 'ja/',
        'title': '訂正記録 | VCP / VSO — VeritasChain',
        'h1': '訂正記録',
        'desc': 'VSOの仕様、リポジトリのREADME、veritaschain.orgに対する日付入りの訂正を新しい順に掲載し、それぞれの変更記録にリンクしています。',
        'eyebrow': 'VCP / VSO · 訂正記録',
        'intro': ('VSOは、公開した記述を黙って書き換えず、日付入りの記録を追加して訂正します。'
                  'このページは、仕様、リポジトリのREADME、本サイトに対する訂正を新しい順に掲載します。'
                  '各項目は変更記録にリンクしています。日付入りのお知らせとブログ記事は公開当時の記録として残し、'
                  '影響を受けるものには注記を付けています。'),
        'records': '記録：',
        'back': 'VSOのお知らせ',
        'updated': '最終更新',
        'home': '/ja/#news-container',
        'langname': '日本語',
    },
}


def esc(value):
    return html.escape(value, quote=True)


def page(lang, data):
    t = TEXT[lang]
    alternates = ''.join(
        f'<link rel="alternate" hreflang="{code}" href="{TEXT[code]["url"]}">' for code in ('en', 'ja'))
    alternates += f'<link rel="alternate" hreflang="x-default" href="{TEXT["en"]["url"]}">'
    nav = ''.join(
        f'<a href="{TEXT[code]["url"]}" lang="{code}"' + (' aria-current="page"' if code == lang else '') +
        f'>{TEXT[code]["langname"]}</a>' for code in ('en', 'ja'))
    ld = json.dumps({
        '@context': 'https://schema.org', '@type': 'WebPage', 'name': t['h1'], 'description': t['desc'],
        'url': t['url'], 'inLanguage': lang, 'dateModified': data['updated'],
        'publisher': {'@type': 'Organization', 'name': 'VeritasChain Standards Organization (VSO)'},
    }, ensure_ascii=False)
    items = []
    for entry in data['entries']:
        body = entry[lang]
        records = ' '.join(f'<a href="{esc(url)}">{esc(label)}</a>' for label, url in body.get('records', entry['records']))
        items.append(
            f'<li class="entry"><div class="date"><time datetime="{entry["date"]}">{entry["date"]}</time></div>'
            f'<h2>{esc(body["title"])}</h2><p>{esc(body["text"])}</p>'
            f'<p class="records">{t["records"]} {records}</p></li>')
    return (
        '<!DOCTYPE html>\n'
        f'<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{esc(t["title"])}</title>\n'
        f'<meta name="description" content="{esc(t["desc"])}">\n'
        f'<meta property="og:title" content="{esc(t["title"])}">\n'
        f'<meta property="og:description" content="{esc(t["desc"])}">\n'
        f'<meta property="og:url" content="{t["url"]}">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:image" content="https://veritaschain.org/assets/OGP.png">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{esc(t["title"])}">\n'
        f'<meta name="twitter:description" content="{esc(t["desc"])}">\n'
        '<meta name="twitter:image" content="https://veritaschain.org/assets/OGP.png">\n'
        f'<link rel="canonical" href="{t["url"]}">\n{alternates}\n'
        f'<link rel="icon" href="/favicon.ico"><style>{STYLE}</style>\n'
        f'<script type="application/ld+json">{ld}</script></head>\n'
        f'<body><header><a href="{t["home"]}">{t["back"]}</a><nav aria-label="Language">{nav}</nav></header>\n'
        f'<main><div class="eyebrow">{t["eyebrow"]} · {t["updated"]} <time datetime="{data["updated"]}">{data["updated"]}</time></div>'
        f'<h1>{t["h1"]}</h1><p class="intro">{esc(t["intro"])}</p>\n'
        f'<ol>{"".join(items)}</ol></main>\n'
        '<footer>VeritasChain Standards Organization (VSO)<br><a href="mailto:standards@veritaschain.org">standards@veritaschain.org</a></footer>'
        '</body></html>\n')


def main():
    data = json.loads(SRC.read_text(encoding='utf-8'))
    out_en = ROOT / 'vso' / 'corrections' / 'index.html'
    out_ja = ROOT / 'vso' / 'corrections' / 'ja' / 'index.html'
    out_ja.parent.mkdir(parents=True, exist_ok=True)
    out_en.write_text(page('en', data), encoding='utf-8')
    out_ja.write_text(page('ja', data), encoding='utf-8')
    print(f'Wrote {out_en.relative_to(ROOT)} and {out_ja.relative_to(ROOT)} ({len(data["entries"])} entries)')


if __name__ == '__main__':
    main()
