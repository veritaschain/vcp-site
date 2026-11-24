#!/usr/bin/env python3
"""Build the IETF SCITT mailing-list activity record pages.

Source (edit this, then run `python3 scripts/build_ietf_activity.py`):
    standardization/ietf-activity/activity.json -- the only source for
    /standardization/ietf-activity/ and /standardization/ietf-activity/ja/

Scope: every message sent from the sender address in "scope" to the SCITT list.
Nothing is selected or left out. When a message is sent to the list, add its
record in the same change (archive id, URL, UTC date and subject exactly as
archived), set "checked", and add any notes it needs.

Archived messages cannot be edited. Wording that VSO no longer uses, or that
needs context, is explained by a note in "notes" and referenced from the record.

    python3 scripts/build_ietf_activity.py            write the pages
    python3 scripts/build_ietf_activity.py --check    fail if the data is invalid or the pages are stale
    python3 scripts/build_ietf_activity.py --verify-online
        compare every record with the IETF archive (date, subject, sender) and
        list messages from the sender in the archive's recent static indexes
        that are not recorded. Uses the network; not part of the PR checks.
"""
import argparse
import html
import json
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

from site_security import apply_csp

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://veritaschain.org'
SRC = ROOT / 'standardization' / 'ietf-activity' / 'activity.json'
DATA_URL = '/standardization/ietf-activity/activity.json'
ARCHIVE = 'https://mailarchive.ietf.org'
MSG_URL = re.compile(r'^https://mailarchive\.ietf\.org/arch/msg/scitt/([A-Za-z0-9_-]+)/$')
CONTEXTS = ('started-by-author', 'reply-in-author-thread', 'reply-in-other-thread')
DISPOSITIONS = ('changes-recorded', 'partly-open', 'no-replies', 'not-applicable')
SIGNATURE_NOTES = ('signature-nonprofit', 'signature-title')
LOCALES = {'en': 'en_US', 'ja': 'ja_JP'}
ANALYTICS = '<script defer src="/assets/js/analytics.js?v=20261103"></script>'

STYLE = ('*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:#0b1220;color:#cbd5e1;'
         'font-family:system-ui,-apple-system,sans-serif;line-height:1.85}a{color:#7dd3fc;overflow-wrap:anywhere}'
         'a:hover{color:white}header,main,footer{max-width:960px;margin:auto;padding:28px 24px}header{display:flex;'
         'flex-wrap:wrap;justify-content:space-between;gap:18px;border-bottom:1px solid #334155}nav{display:flex;'
         'gap:18px;flex-wrap:wrap}main{padding-top:48px;padding-bottom:56px}h1,h2,h3{color:#f8fafc;line-height:1.45}'
         'h1{font-size:clamp(1.9rem,4.5vw,3rem);letter-spacing:-.02em;margin:18px 0 24px}h2{font-size:1.2rem;'
         'margin:0 0 8px}h3{font-size:1rem;margin:6px 0 4px}p{margin:10px 0}.eyebrow{color:#6ee7b7;font-size:.9rem;'
         'letter-spacing:.06em}.intro{font-size:1.05rem;color:#e2e8f0}section.box{margin:28px 0;padding:20px 22px;'
         'border:1px solid #334155;border-radius:14px;background:#0f1a2b}ol.records{list-style:none;padding:0;margin:24px 0 0}'
         'li.entry{margin:0 0 18px;padding:20px 22px;border:1px solid #334155;border-radius:14px;background:#111f33}'
         '.meta{color:#fcd34d;font-size:.85rem}.badge{display:inline-block;margin:4px 8px 4px 0;padding:1px 10px;'
         'border:1px solid #475569;border-radius:999px;font-size:.78rem;color:#e2e8f0;text-decoration:none}'
         '.badge.sig{border-color:#f59e0b;color:#fcd34d}.note{margin:10px 0 0;padding:10px 14px;border-left:3px solid #7dd3fc;'
         'background:#0f1a2b;font-size:.92rem}.resp{margin:10px 0 0;font-size:.92rem}.small{font-size:.9rem;color:#94a3b8}'
         'ul.plain{margin:6px 0;padding-left:20px}footer{border-top:1px solid #334155;font-size:.9rem}')

T = {
    'en': {
        'url': '/standardization/ietf-activity/',
        'title': 'IETF SCITT mailing-list activity record | VSO — VeritasChain',
        'h1': 'IETF SCITT mailing-list activity',
        'eyebrow': 'VSO · STANDARDIZATION',
        'desc': ('Every message VSO’s Tokachi Kamimura has sent to the IETF SCITT mailing list since December 2025, with '
                 'what changed in response and notes on wording VSO no longer uses.'),
        'intro': ('This page lists every message sent from {sender} to the IETF SCITT mailing list ({list}), from the first, '
                  'on {first}, to the latest, on {last}: {n} messages. Replies in other participants’ threads are included. '
                  'Each entry links to the message in the IETF archive and to its thread.'),
        'status_h': 'What this record does and does not show',
        'status': [
            ('Posting to an IETF mailing list is open to anyone and is individual participation. None of the drafts '
             'discussed here has been adopted by an IETF Working Group, and none has IETF standing.'),
            ('Replies from other participants are not endorsement. This page links to them but does not quote or '
             'summarize them.'),
            ('No external implementation of VCP or of the VAP framework has been reported to VSO, and no Evidence Pack '
             'has been accepted in any proceeding.'),
        ],
        'method_h': 'How the record was compiled',
        'scope_rule': 'Scope: every message from {sender} to {list}. Nothing is selected or left out.',
        'out_scope': 'Not covered: {items}.',
        'out_scope_items': {'Other IETF mailing lists': 'other IETF mailing lists',
                            'Messages sent to individuals off the list': 'messages sent to individuals off the list',
                            'Datatracker submissions': 'Datatracker submissions'},
        'ai': ('The record was compiled with AI assistance (Claude, Anthropic) and checked against the archived messages. '
               'It has not had independent review.'),
        'checked': 'Last checked against the archive: {date}.',
        'notes_h': 'Wording in archived messages that VSO no longer uses',
        'notes_intro': ('Archived messages cannot be edited. Where a message uses wording that VSO has since withdrawn, or '
                        'that needs context, its entry carries a note. Two notes concern the email signature:'),
        'sig_count': 'In {n} messages, the latest on {last}.',
        'list_h': 'Messages, newest first',
        'context': {'started-by-author': 'New thread by the author',
                    'reply-in-author-thread': 'Reply in the author’s thread',
                    'reply-in-other-thread': 'Reply in another participant’s thread'},
        'thread': 'Thread',
        'resp': 'Response to replies:',
        'disp': {'changes-recorded': 'Changes recorded', 'partly-open': 'Partly open',
                 'no-replies': 'No replies in the thread (checked {date}).', 'not-applicable': 'Not applicable'},
        'sig_badge': {'signature-nonprofit': 'Signature: withdrawn “non-profit” wording',
                      'signature-title': 'Signature: title not in use'},
        'note': 'Note:',
        'links': 'Data (JSON)', 'std': 'Standardization status', 'corr': 'Corrections log',
        'std_url': '/standardization/', 'corr_url': '/vso/corrections/',
        'back': ('Standardization', '/standardization/'),
        'langname': 'English',
        'stop': '.',
    },
    'ja': {
        'url': '/standardization/ietf-activity/ja/',
        'title': 'IETF SCITT メーリングリストでの活動記録 | VSO — VeritasChain',
        'h1': 'IETF SCITT メーリングリストでの活動記録',
        'eyebrow': 'VSO · 標準化',
        'desc': ('VSO の上村十勝が 2025年12月から IETF SCITT メーリングリストに送ったすべてのメッセージと、それを受けた変更、'
                 'VSO が現在は使っていない表現への注記。'),
        'intro': ('このページは、{sender} から IETF SCITT メーリングリスト（{list}）に送ったメッセージを、最初の {first} から'
                  '最新の {last} まで、すべて掲載しています（{n} 通）。他の参加者のスレッドへの返信も含みます。各項目から、'
                  'IETF のアーカイブにあるメッセージとそのスレッドにリンクしています。'),
        'status_h': 'この記録が示すこと、示さないこと',
        'status': [
            ('IETF のメーリングリストには誰でも投稿でき、投稿は個人としての参加です。ここで扱うドラフトはどれも IETF の'
             'ワーキンググループに採択されておらず、IETF での公式な地位を持っていません。'),
            ('他の参加者からの返信は賛同を意味しません。このページは返信にリンクするだけで、引用も要約もしていません。'),
            ('VCP と VAP フレームワークの外部実装は VSO に報告されておらず、手続で受理された Evidence Pack はありません。'),
        ],
        'method_h': '記録の作り方',
        'scope_rule': '範囲：{sender} から {list} へのすべてのメッセージ。選別や除外はしていません。',
        'out_scope': '対象外：{items}。',
        'out_scope_items': {'Other IETF mailing lists': '他の IETF メーリングリスト',
                            'Messages sent to individuals off the list': 'リスト外で個人に送ったメッセージ',
                            'Datatracker submissions': 'Datatracker への提出'},
        'ai': ('この記録は AI（Anthropic の Claude）の支援を受けて作成し、アーカイブのメッセージと照合しました。'
               '独立したレビューは受けていません。'),
        'checked': 'アーカイブとの最終照合：{date}',
        'notes_h': 'アーカイブのメッセージにある、VSO が現在は使っていない表現',
        'notes_intro': ('アーカイブのメッセージは修正できません。VSO がその後に撤回した表現や、説明が必要な表現を含むメッセージ'
                        'には、項目に注記を付けています。メールの署名については次の2つの注記があります。'),
        'sig_count': '{n} 通に含まれます（最新は {last}）。',
        'list_h': 'メッセージ（新しい順）',
        'context': {'started-by-author': '本人が始めたスレッド',
                    'reply-in-author-thread': '本人のスレッドでの返信',
                    'reply-in-other-thread': '他の参加者のスレッドへの返信'},
        'thread': 'スレッド',
        'resp': '返信を受けた対応：',
        'disp': {'changes-recorded': '変更を記録済み', 'partly-open': '一部未決',
                 'no-replies': 'スレッドに返信なし（{date} 確認）。', 'not-applicable': '該当なし'},
        'sig_badge': {'signature-nonprofit': '署名：撤回済みの「非営利」の表現',
                      'signature-title': '署名：現在使っていない肩書き'},
        'note': '注記：',
        'links': 'データ（JSON）', 'std': '標準化の状況', 'corr': '訂正記録',
        'std_url': '/standardization/ja/', 'corr_url': '/vso/corrections/ja/',
        'back': ('標準化', '/standardization/ja/'),
        'langname': '日本語',
        'stop': '。',
    },
}


def esc(value):
    return html.escape(str(value), quote=True)


def a(label, url):
    return f'<a href="{esc(url)}">{esc(label)}</a>'


def fail(message):
    raise SystemExit('activity.json: ' + message)


def check_links(links, where):
    for link in links:
        if not isinstance(link, dict) or not link.get('en') or not link.get('ja'):
            fail(f'{where}: each link needs "en" and "ja" labels')
        for key in ('url', 'url_ja'):
            if key in link and not link[key].startswith('https://'):
                fail(f'{where}: {key} must be an https URL')
        if 'url' not in link:
            fail(f'{where}: link without url')


def validate(data):
    for key in ('checked', 'scope', 'method', 'notes', 'records'):
        if key not in data:
            fail(f'missing "{key}"')
    datetime.strptime(data['checked'], '%Y-%m-%d')
    notes = data['notes']
    for nid, note in notes.items():
        if not re.fullmatch(r'[a-z0-9-]+', nid):
            fail(f'bad note id {nid!r}')
        for lang in ('en', 'ja'):
            if not note.get(lang, '').strip():
                fail(f'note {nid} has no {lang} text')
        check_links(note.get('links', []), f'note {nid}')
    ids, used, previous = set(), set(), ''
    for r in data['records']:
        rid = r.get('archive_id', '')
        m = MSG_URL.match(r.get('url', ''))
        if not m or m.group(1) != rid:
            fail(f'{rid}: url does not match archive_id')
        if rid in ids:
            fail(f'{rid}: duplicate record')
        ids.add(rid)
        if r.get('thread_url') != f'{ARCHIVE}/arch/browse/scitt/?gbt=1&index={rid}':
            fail(f'{rid}: unexpected thread_url')
        if not re.fullmatch(r'\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ', r.get('date_utc', '')):
            fail(f'{rid}: date_utc must be YYYY-MM-DDTHH:MM:SSZ')
        if r['date_utc'] < previous:
            fail(f'{rid}: records must be in date order')
        previous = r['date_utc']
        if r['date_utc'][:10] > data['checked']:
            fail(f'{rid}: dated after "checked"')
        if not r.get('subject', '').startswith('[SCITT]'):
            fail(f'{rid}: subject must be the archived subject')
        if r.get('context') not in CONTEXTS:
            fail(f'{rid}: unknown context {r.get("context")!r}')
        for doc in r.get('documents', []):
            if not re.fullmatch(r'draft-[a-z0-9-]+?(-\d\d)?', doc):
                fail(f'{rid}: bad document name {doc!r}')
        for nid in r.get('notes', []):
            if nid not in notes:
                fail(f'{rid}: unknown note {nid}')
            used.add(nid)
        disp = r.get('disposition')
        if r['context'] == 'started-by-author':
            if not disp or disp.get('status') not in DISPOSITIONS:
                fail(f'{rid}: a thread started by the author needs a disposition')
            if disp['status'] != 'no-replies':
                for lang in ('en', 'ja'):
                    if not disp.get(lang, '').strip():
                        fail(f'{rid}: disposition has no {lang} text')
            check_links(disp.get('links', []), f'{rid} disposition')
        elif disp:
            fail(f'{rid}: only threads started by the author carry a disposition')
    unused = set(notes) - used
    if unused:
        fail('notes not used by any record: ' + ', '.join(sorted(unused)))
    if not data['records']:
        fail('no records')


def stamp(date_utc):
    return date_utc[:10] + ' ' + date_utc[11:16] + ' UTC'


def doc_link(name):
    m = re.fullmatch(r'(draft-[a-z0-9-]+?)-(\d\d)', name)
    url = f'https://datatracker.ietf.org/doc/{m.group(1)}/{m.group(2)}/' if m else f'https://datatracker.ietf.org/doc/{name}/'
    return a(name, url)


def links_html(links, lang):
    if not links:
        return ''
    items = [a(link[lang], link.get('url_' + lang, link['url'])) for link in links]
    return ' <span class="small">' + ' · '.join(items) + '</span>'


def page(lang, data):
    t = T[lang]
    alt = {code: T[code]['url'] for code in ('en', 'ja')}
    records = data['records']
    scope = data['scope']
    intro = t['intro'].format(sender=scope['sender'], list=scope['list'], first=records[0]['date_utc'][:10],
                              last=records[-1]['date_utc'][:10], n=len(records))
    status = ''.join(f'<li>{esc(x)}</li>' for x in t['status'])
    out_scope = ('、' if lang == 'ja' else ', ').join(t['out_scope_items'][x] for x in scope['out_of_scope'])
    method = (f'<section class="box"><h2>{esc(t["method_h"])}</h2><p>{esc(data["method"][lang])}</p>'
              f'<p>{esc(t["scope_rule"].format(sender=scope["sender"], list=scope["list"]))} '
              f'{esc(t["out_scope"].format(items=out_scope))}</p>'
              f'<p class="small">{esc(t["ai"])} {esc(t["checked"].format(date=data["checked"]))}</p></section>\n')
    sig = []
    for nid in SIGNATURE_NOTES:
        if nid not in data['notes']:
            continue
        having = [r for r in records if nid in r['notes']]
        note = data['notes'][nid]
        sig.append(f'<li id="note-{nid}"><strong>{esc(t["sig_badge"][nid])}{t["stop"]}</strong> {esc(note[lang])}'
                   f'{links_html(note.get("links", []), lang)} <span class="small">'
                   f'{esc(t["sig_count"].format(n=len(having), last=having[-1]["date_utc"][:10] if having else "—"))}</span></li>')
    notes_sec = (f'<section class="box" id="notes"><h2>{esc(t["notes_h"])}</h2><p>{esc(t["notes_intro"])}</p>'
                 f'<ul class="plain">{"".join(sig)}</ul></section>\n')
    items = []
    for r in reversed(records):
        badges = ''.join(f'<a class="badge sig" href="#note-{nid}">{esc(t["sig_badge"][nid])}</a>'
                         for nid in SIGNATURE_NOTES if nid in r['notes'])
        docs = ' · '.join(doc_link(d) for d in r.get('documents', []))
        meta = f'{esc(stamp(r["date_utc"]))} · {esc(t["context"][r["context"]])}'
        body = (f'<li class="entry" id="m-{esc(r["archive_id"])}"><div class="meta">{meta}</div>'
                f'<h3 lang="en">{a(r["subject"], r["url"])}</h3>'
                f'<p class="small">{a(t["thread"], r["thread_url"])}' + (f' · {docs}' if docs else '') + '</p>')
        disp = r.get('disposition')
        if disp:
            label = t['disp'][disp['status']].format(date=data['checked'])
            text = f' {esc(disp[lang])}' if disp.get(lang) else ''
            body += (f'<p class="resp"><strong>{esc(t["resp"])}</strong> {esc(label)}{t["stop"] if disp["status"] != "no-replies" else ""}'
                     f'{text}{links_html(disp.get("links", []), lang)}</p>')
        for nid in r['notes']:
            if nid in SIGNATURE_NOTES:
                continue
            note = data['notes'][nid]
            body += f'<p class="note"><strong>{esc(t["note"])}</strong> {esc(note[lang])}{links_html(note.get("links", []), lang)}</p>'
        if badges:
            body += f'<p>{badges}</p>'
        items.append(body + '</li>')
    ld = {'@context': 'https://schema.org', '@type': 'CollectionPage', 'name': t['h1'], 'url': SITE + t['url'],
          'inLanguage': lang, 'description': t['desc'], 'dateModified': data['checked'],
          'isPartOf': {'@type': 'WebSite', 'name': 'VeritasChain Standards Organization (VSO)', 'url': SITE + '/'}}
    alternates = ''.join(f'<link rel="alternate" hreflang="{code}" href="{SITE}{alt[code]}">' for code in ('en', 'ja'))
    alternates += f'<link rel="alternate" hreflang="x-default" href="{SITE}{alt["en"]}">'
    head = (
        '<!DOCTYPE html>\n'
        f'<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{esc(t["title"])}</title>\n'
        f'<meta name="description" content="{esc(t["desc"])}">\n'
        f'<meta property="og:title" content="{esc(t["title"])}">\n'
        f'<meta property="og:description" content="{esc(t["desc"])}">\n'
        f'<meta property="og:url" content="{SITE}{t["url"]}">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:site_name" content="VeritasChain Standards Organization (VSO)">\n'
        f'<meta property="og:locale" content="{LOCALES[lang]}">\n'
        + ''.join(f'<meta property="og:locale:alternate" content="{LOCALES[c]}">\n' for c in ('en', 'ja') if c != lang) +
        '<meta property="og:image" content="https://veritaschain.org/assets/OGP.png">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{esc(t["title"])}">\n'
        f'<meta name="twitter:description" content="{esc(t["desc"])}">\n'
        '<meta name="twitter:image" content="https://veritaschain.org/assets/OGP.png">\n'
        f'<link rel="canonical" href="{SITE}{t["url"]}">\n{alternates}\n'
        f'<link rel="icon" href="/favicon.ico"><style>{STYLE}</style>\n'
        f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>{ANALYTICS}</head>\n')
    nav = ''.join(f'<a href="{alt[c]}" lang="{c}"' + (' aria-current="page"' if c == lang else '') +
                  f'>{T[c]["langname"]}</a>' for c in ('en', 'ja'))
    top = f'<body><header>{a(*t["back"])}<nav aria-label="Language">{nav}</nav></header>\n'
    main = (f'<main><p class="eyebrow">{esc(t["eyebrow"])}</p><h1>{esc(t["h1"])}</h1>'
            f'<p class="intro">{esc(intro)}</p>\n'
            f'<p class="small">{a(t["links"], DATA_URL)} · {a(t["std"], t["std_url"])} · {a(t["corr"], t["corr_url"])}</p>\n'
            f'<section class="box"><h2>{esc(t["status_h"])}</h2><ul class="plain">{status}</ul></section>\n'
            + method + notes_sec +
            f'<h2 id="messages">{esc(t["list_h"])}</h2><ol class="records">{"".join(items)}</ol></main>\n')
    foot = ('<footer>VeritasChain Standards Organization (VSO)<br>'
            '<a href="mailto:standards@veritaschain.org">standards@veritaschain.org</a></footer></body></html>\n')
    return head + top + main + foot


def write(rel, text, check):
    path = ROOT / rel.strip('/') / 'index.html'
    expected = apply_csp(text, path)
    if check:
        if not path.exists() or path.read_text(encoding='utf-8') != expected:
            raise SystemExit(f'Stale generated page: {path.relative_to(ROOT)}; run python3 scripts/build_ietf_activity.py')
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(expected, encoding='utf-8')
    return path.relative_to(ROOT)


def fetch(url):
    req = urllib.request.Request(url, headers={'User-Agent': 'vcp-site build_ietf_activity.py --verify-online'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode('utf-8', 'replace')


def header_fields(page_html):
    m = re.search(r'<div id="msg-header" class="msg-header">(.*?)</div>', page_html, re.S)
    if not m:
        return {}
    text = html.unescape(re.sub(r'<[^>]+>', '', re.sub(r'<br\s*/?>', '\n', m.group(1))))
    out = {}
    for line in text.splitlines():
        key, sep, value = line.strip().partition(':')
        if sep and key in ('Date', 'Subject', 'X-MailFrom'):
            out.setdefault(key, value.strip())
    return out


def verify_online(data, delay=2.0):
    problems = []
    sender = data['scope']['sender'].lower()
    for r in data['records']:
        try:
            h = header_fields(fetch(r['url']))
        except OSError as exc:
            problems.append(f'{r["archive_id"]}: fetch failed ({exc})')
            continue
        date = parsedate_to_datetime(h['Date']).astimezone(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ') if 'Date' in h else ''
        if date != r['date_utc']:
            problems.append(f'{r["archive_id"]}: date {date!r} != {r["date_utc"]!r}')
        if h.get('Subject') != r['subject']:
            problems.append(f'{r["archive_id"]}: subject {h.get("Subject")!r} != {r["subject"]!r}')
        if h.get('X-MailFrom', '').lower() != sender:
            problems.append(f'{r["archive_id"]}: sender {h.get("X-MailFrom")!r}')
        time.sleep(delay)
    known = {r['archive_id'] for r in data['records']}
    now = datetime.now(timezone.utc)
    months = sorted({now.strftime('%Y-%m'), data['checked'][:7]})
    for ym in months:
        try:
            index = fetch(f'{ARCHIVE}/arch/browse/static/scitt/{ym}/')
        except OSError as exc:
            problems.append(f'index {ym}: fetch failed ({exc})')
            continue
        for mid, author in re.findall(r'<a id="([^"]+)" href="/arch/msg/scitt/\1/">.*?</a>,\s*<em>(.*?)</em>', index, re.S):
            if 'kamimura' in html.unescape(author).lower() and mid not in known:
                problems.append(f'not recorded: {ARCHIVE}/arch/msg/scitt/{mid}/')
        time.sleep(delay)
    for p in problems:
        print(p)
    print(f'Checked {len(data["records"])} records and indexes {", ".join(months)}: {len(problems)} problem(s)')
    return 1 if problems else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--check', action='store_true', help='check the data and generated pages without writing')
    parser.add_argument('--verify-online', action='store_true', help='compare the records with the IETF archive')
    args = parser.parse_args()
    data = json.loads(SRC.read_text(encoding='utf-8'))
    validate(data)
    if args.verify_online:
        sys.exit(verify_online(data))
    out = [write(T[lang]['url'], page(lang, data), args.check) for lang in ('en', 'ja')]
    print(('Checked ' if args.check else 'Wrote ') + ', '.join(str(p) for p in out) + f' ({len(data["records"])} messages)')


if __name__ == '__main__':
    main()
