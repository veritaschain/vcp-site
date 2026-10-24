#!/usr/bin/env python3
"""Build the incident verification records and the "What VAP does not do" page.

Sources (edit these, then run `python3 scripts/build_incidents.py`):
    incidents/incidents.json  -- the only source for /incidents/ and /incidents/ja/ (published, CC BY 4.0)
    vap/limits/limits.json    -- the only source for /vap/limits/ and /vap/limits/ja/

Each record states what VSO verified on the date shown. Correct a record by
editing it and adding a dated entry to its "corrections" list.
"""
import html
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://veritaschain.org'
INCIDENTS = ROOT / 'incidents' / 'incidents.json'
LIMITS = ROOT / 'vap' / 'limits' / 'limits.json'

# AI developers whose models VSO uses in its own verification work. Records in
# which one of them is a party or the subject carry a note saying so.
VSO_USES_MODELS_FROM = {'Anthropic'}

VERDICTS = ('CONFIRMED', 'UNCONFIRMED', 'CONTRADICTED', 'UNVERIFIABLE')
PUBLICATION_VERDICTS = ('VERIFIED', 'PARTIALLY VERIFIED', 'PUBLISH WITH CAVEATS', 'PUBLISH WITH HEAVY CAVEATS',
                        'PUBLISH WITH CORRECTIONS', 'PUBLISH AS NEW', 'PROCEDURAL FACTS ONLY')

STYLE = ('*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:#0b1220;color:#cbd5e1;'
         'font-family:system-ui,-apple-system,sans-serif;line-height:1.85}a{color:#7dd3fc;overflow-wrap:anywhere}'
         'a:hover{color:white}header,main,footer{max-width:960px;margin:auto;padding:28px 24px}header{display:flex;'
         'flex-wrap:wrap;justify-content:space-between;gap:18px;border-bottom:1px solid #334155}nav{display:flex;'
         'gap:18px;flex-wrap:wrap}main{padding-top:48px;padding-bottom:56px}h1,h2,h3{color:#f8fafc;line-height:1.45}'
         'h1{font-size:clamp(1.9rem,4.5vw,3rem);letter-spacing:-.02em;margin:18px 0 24px}h2{font-size:1.2rem;'
         'margin:0 0 8px}h3{font-size:1rem;margin:18px 0 4px}p{margin:10px 0}.eyebrow{color:#6ee7b7;font-size:.9rem;'
         'letter-spacing:.06em}.intro{font-size:1.05rem;color:#e2e8f0}section.box{margin:28px 0;padding:20px 22px;'
         'border:1px solid #334155;border-radius:14px;background:#0f1a2b}blockquote{margin:12px 0;padding:4px 0 4px 16px;'
         'border-left:3px solid #6ee7b7;color:#e2e8f0}ol.records,ol.patterns{list-style:none;padding:0;margin:32px 0 0}'
         'li.entry{margin:0 0 22px;padding:22px 24px;border:1px solid #334155;border-radius:14px;background:#111f33}'
         '.meta{color:#fcd34d;font-size:.85rem}.badges{margin:6px 0 4px}.badge{display:inline-block;margin:0 8px 6px 0;'
         'padding:1px 10px;border:1px solid #475569;border-radius:999px;font-size:.78rem;color:#e2e8f0}'
         '.badge.alleg{border-color:#f59e0b;color:#fcd34d}.badge.note{border-color:#7dd3fc;color:#bae6fd}'
         'table{width:100%;border-collapse:collapse;font-size:.92rem;margin:8px 0}td{border-top:1px solid #334155;'
         'padding:6px 8px;vertical-align:top}td.v{white-space:nowrap;font-size:.78rem;letter-spacing:.04em;color:#e2e8f0}'
         '.small{font-size:.9rem;color:#94a3b8}ul.src{margin:4px 0;padding-left:20px;font-size:.9rem}'
         'ul.toc{columns:2;column-gap:28px;padding-left:18px;font-size:.92rem}@media(max-width:640px){ul.toc{columns:1}}'
         'footer{border-top:1px solid #334155;font-size:.9rem}')

SECTION_16 = ('VAP and its domain profiles define mechanisms for producing cryptographically verifiable evidence of AI system '
              'decisions. Conformance to VAP or any profile: (a) does not constitute compliance with the EU AI Act, GDPR, '
              'MiFID II/III, CAT Rule 613, NIS2, FDA SaMD guidance, or any other law or regulation; (b) does not constitute '
              'a legal determination that any technical mechanism (including crypto-shredding) satisfies a specific legal '
              'obligation; (c) does not warrant the correctness, fairness, or safety of the underlying AI decisions — only '
              'the integrity, completeness (at anchor granularity), and attributability of their records. VAP generates '
              'evidence; competent authorities and courts evaluate it.')
SECTION_16_JA = ('VAP とその領域プロファイルは、AI システムの判断について暗号学的に検証可能な証拠を作る仕組みを定めます。'
                 'VAP またはいずれかのプロファイルへの適合は、(a) EU AI Act、GDPR、MiFID II/III、CAT Rule 613、NIS2、FDA の SaMD '
                 'ガイダンスその他の法令への準拠を意味しません。(b) いかなる技術的仕組み（crypto-shredding を含む）が特定の法的義務を'
                 '満たすという法的判断を意味しません。(c) 基になる AI の判断が正しい、公正である、または安全であることを保証しません。'
                 'VAP が扱うのは、その記録の完全性（integrity）、アンカー粒度での完全性（completeness）、帰属可能性だけです。'
                 'VAP は証拠を作り、その評価は権限のある当局と裁判所が行います。')
DECLARATION = ('VAP makes AI decision records auditable, attributable, and — at anchor granularity — completeness-verifiable '
               'after the fact. It does not prevent, block, or intercept any AI behaviour, and it does not warrant that any '
               'recorded decision was correct, fair, or safe (§1.6). Events that were never measured are permanently outside '
               'its reach by construction, and no revision of this framework will change that.')
DECLARATION_JA = ('VAP は、AI の判断記録を事後に監査可能・帰属可能にし、アンカー粒度で完全性を検証できるようにします。'
                  'AI の挙動を防止・遮断・傍受することはなく、記録された判断が正しい、公正である、または安全であることを保証しません'
                  '（§1.6）。計測されなかった事象は構造上、恒久的に射程の外にあり、本フレームワークをどう改訂してもそれは変わりません。')

COMMON = {
    'en': {
        'langname': 'English',
        'spec_vs': 'VAP v1.2 §1.6 (verbatim)',
        'decl_vs': 'VAP v1.2, Declaration (verbatim)',
        'status_h': 'Implementation status',
        'status': ('As of 25 October 2026: zero external implementations of VAP or any VAP profile, and zero Evidence Packs '
                   'accepted in any proceeding. The previously published paid-service contract figure was withdrawn on '
                   '24 October 2026 pending reconciliation with primary records; this does not establish a count of zero.'),
        'status_link': ('Dated correction', 'https://github.com/veritaschain/vap-spec/blob/main/disclosures/2026-10-24-commercial-contracts.md'),
        'corrections': ('Corrections log', '/vso/corrections/'),
        'records_page': ('Incident verification records', '/incidents/'),
        'limits_page': ('What VAP does not do', '/vap/limits/'),
        'back': ('VAP overview', '/vap/'),
    },
    'ja': {
        'langname': '日本語',
        'spec_vs': 'VAP v1.2 §1.6（原文）',
        'decl_vs': 'VAP v1.2 Declaration（原文）',
        'status_h': '実装状況',
        'status': ('2026年10月25日時点で、VAP または VAP プロファイルの外部実装はゼロ、手続で受理された Evidence Pack もゼロです。'
                   '以前に公表した有償契約の件数は、一次記録との照合が済むまで2026年10月24日に取り下げました。これは件数がゼロだという意味ではありません。'),
        'status_link': ('日付入りの訂正（英語）', 'https://github.com/veritaschain/vap-spec/blob/main/disclosures/2026-10-24-commercial-contracts.md'),
        'corrections': ('訂正記録', '/vso/corrections/ja/'),
        'records_page': ('事件検証記録', '/incidents/ja/'),
        'limits_page': ('VAPにできないこと', '/vap/limits/ja/'),
        'back': ('VAP の概要', '/vap/ja/'),
        'ref_tr': '参考訳',
    },
}


def esc(value):
    return html.escape(str(value), quote=True)


def a(label, url):
    return f'<a href="{esc(url)}">{esc(label)}</a>'


def head(lang, title, desc, url, alt_urls, ld):
    alternates = ''.join(f'<link rel="alternate" hreflang="{code}" href="{SITE}{alt_urls[code]}">' for code in ('en', 'ja'))
    alternates += f'<link rel="alternate" hreflang="x-default" href="{SITE}{alt_urls["en"]}">'
    return (
        '<!DOCTYPE html>\n'
        f'<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f'<title>{esc(title)}</title>\n'
        f'<meta name="description" content="{esc(desc)}">\n'
        f'<meta property="og:title" content="{esc(title)}">\n'
        f'<meta property="og:description" content="{esc(desc)}">\n'
        f'<meta property="og:url" content="{SITE}{url}">\n'
        '<meta property="og:type" content="website">\n'
        '<meta property="og:image" content="https://veritaschain.org/assets/OGP.png">\n'
        '<meta name="twitter:card" content="summary_large_image">\n'
        f'<meta name="twitter:title" content="{esc(title)}">\n'
        f'<meta name="twitter:description" content="{esc(desc)}">\n'
        '<meta name="twitter:image" content="https://veritaschain.org/assets/OGP.png">\n'
        f'<link rel="canonical" href="{SITE}{url}">\n{alternates}\n'
        f'<link rel="icon" href="/favicon.ico"><style>{STYLE}</style>\n'
        f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script></head>\n')


def top(lang, alt_urls):
    c = COMMON[lang]
    nav = ''.join(
        f'<a href="{alt_urls[code]}" lang="{code}"' + (' aria-current="page"' if code == lang else '') +
        f'>{COMMON[code]["langname"]}</a>' for code in ('en', 'ja'))
    return f'<body><header>{a(*c["back"])}<nav aria-label="Language">{nav}</nav></header>\n'


def footer():
    return ('<footer>VeritasChain Standards Organization (VSO)<br>'
            '<a href="mailto:standards@veritaschain.org">standards@veritaschain.org</a></footer></body></html>\n')


def section_16(lang):
    c = COMMON[lang]
    out = f'<section class="box"><h3>{c["spec_vs"]}</h3><blockquote lang="en">{esc(SECTION_16)}</blockquote>'
    if lang == 'ja':
        out += f'<p class="small">{c["ref_tr"]}：{esc(SECTION_16_JA)}</p>'
    return out + '</section>\n'


def status(lang):
    c = COMMON[lang]
    return (f'<section class="box"><h3>{c["status_h"]}</h3><p>{esc(c["status"])}</p>'
            f'<p class="small">{a(*c["status_link"])} · {a(*c["corrections"])}</p></section>\n')


# ---------------------------------------------------------------- incidents

INC = {
    'en': {
        'url': '/incidents/',
        'title': 'AI incident verification records | VSO — VeritasChain',
        'h1': 'AI incident verification records',
        'eyebrow': 'VSO · INCIDENT VERIFICATION',
        'desc': ('Reported AI incidents that VSO checked against primary sources where available, and otherwise against reliable reporting: what was confirmed, what was not, '
                 'the jurisdiction, and what VAP would not have done. Each record states what VSO verified on the date shown.'),
        'intro': ('Before VSO writes about a reported AI incident, it checks the report against primary sources where it '
                  'can obtain them — court filings, regulators’ releases and the parties’ own statements — and otherwise '
                  'against the most reliable reporting, and each record says which. This page publishes the records of '
                  'those checks. Each record states what VSO verified on the date shown and is not updated as a live case '
                  'tracker. Listing an incident is not a claim about VAP: none of these incidents involved a VAP '
                  'implementation, and each record states what VAP would not have done.'),
        'rules_h': 'How to read a record',
        'rules': [
            'Litigation: every claim made in a case is an untested allegation unless a court has decided it.',
            'Jurisdiction: each record is read under its own jurisdiction only. EU law is not applied to matters outside the EU.',
            'CONFIRMED — found in the cited sources; a claim confirmed only from secondary reporting is marked “(secondary)”. UNCONFIRMED — not found in the sources checked; this is not a finding that the claim is false. CONTRADICTED — a cited source states otherwise. UNVERIFIABLE — the source could not be retrieved, for example a paywalled court docket.',
            'Outcome of the check: VERIFIED — the core claims checked out. PARTIALLY VERIFIED — some did; the rest are marked in the record. PUBLISH WITH CAVEATS — the claims checked out, with limits stated in the record that any use must keep. PUBLISH WITH CORRECTIONS — the report VSO checked contained claims that did not hold up; the summary states only what was verified or attributes it to its source, and the claims that did not hold up are listed with their verdicts. PUBLISH WITH HEAVY CAVEATS — as above, with wider limits; a parenthesis says what may be published in full. PUBLISH AS NEW — the report contained new primary facts and is recorded as its own incident rather than as a follow-up; “after corrections” means corrections were applied first. PROCEDURAL FACTS ONLY — only court and filing facts, and the parties’ public responses, are listed.',
            'Registered — entered in VSO’s incident ledger. Verified, pending registration — checked against sources, not yet entered in the ledger.',
        ],
        'method_h': 'Method',
        'method': ('VSO’s verification is AI-assisted: VSO uses AI models, including Anthropic’s Claude, to search for and '
                   'compare sources. Each record lists the sources it relies on, linked wherever VSO has confirmed the address, '
                   'so that readers can check them. Several records involve AI developers. They are held to the same rules '
                   'and marked: a developer is marked when it is a party, or its model or tool is central to the record, in its '
                   'role as developer or provider of the AI system at issue. Records involving Anthropic, whose Claude models VSO '
                   'uses in this work, say so.'),
        'excluded': 'Not listed: {items}. Follow-up reporting on an incident already listed is not recorded as a new incident.',
        'reasons': {'HOLD': 'on hold', 'DO-NOT-PUBLISH-AS-NEW': 'not recorded as new incidents (no new primary facts)',
                    'awaiting re-verification': 'awaiting re-verification', 'registration undecided': 'registration undecided'},
        'data': 'Data (JSON, CC BY 4.0)',
        'index': 'Records',
        'verified': 'Verified',
        'event': 'Event',
        'allegations': 'Allegations — untested',
        'party_note': 'Involves {p}, whose models VSO uses in its verification work',
        'party_other': 'Involves AI developer {p}',
        'no_link': 'link not yet confirmed',
        'claims': 'Checked claims',
        'relevance': 'Where VAP is relevant',
        'would_not': 'What VAP would not have done',
        'sources': 'Sources',
        'primary': 'primary',
        'secondary': 'secondary',
        'corr': 'Corrections to VSO’s earlier statements',
        'later': 'Developments noted on recheck (not a full status check)',
        'rechecked': 'sources rechecked',
        'src_label': 'source',
        'undisclosed': 'date not disclosed',
        'status_reg': {'registered (ledger v1.2)': 'Registered', 'verified, pending registration': 'Verified, pending registration'},
    },
    'ja': {
        'url': '/incidents/ja/',
        'title': 'AI事件の検証記録 | VSO — VeritasChain',
        'h1': 'AI事件の検証記録',
        'eyebrow': 'VSO · 事件検証',
        'desc': ('報じられたAI事件を VSO が一次情報（取得できない場合は信頼できる報道）と照合した記録です。確認できたこと・できなかったこと、法域、'
                 'VAP にできないことを示します。各記録は表示した日付時点で VSO が検証した内容です。'),
        'intro': ('VSO は、報じられた AI 事件について書く前に、その内容を裁判書類、規制当局の発表、当事者自身の声明などの一次情報と照合し、'
                  '一次情報を取得できない場合は最も信頼できる報道と照合して、その別を各記録に示しています。'
                  'このページはその照合の記録を公開します。各記録は表示した日付時点で VSO が検証した内容であり、事件の進行を随時追うものではありません。'
                  '掲載は VAP についての主張ではありません。いずれの事件にも VAP の実装は関わっておらず、各記録に「VAPにできないこと」を記しています。'),
        'rules_h': '記録の読み方',
        'rules': [
            '訴訟：裁判所が判断していない限り、事件で主張されている内容はすべて未検証の主張です。',
            '法域：各記録はその法域の枠内でだけ扱います。EU 域外の事案に EU 法を当てはめません。',
            'CONFIRMED：引用した情報源で確認できた（二次報道だけで確認したものは「（二次資料）」と付記）。UNCONFIRMED：確認した範囲では見つからなかった（誤りだと判断したわけではない）。CONTRADICTED：引用した情報源が異なる内容を示している。UNVERIFIABLE：有料の裁判記録など、情報源を取得できなかった。',
            '検証の結論：VERIFIED は中核の主張が裏付けられたもの。PARTIALLY VERIFIED は一部が裏付けられ、残りを記録中に示したもの。PUBLISH WITH CAVEATS は裏付けられたが、利用時に必ず付ける限定を記録中に示したもの。PUBLISH WITH CORRECTIONS は検証した報道に裏付けのない主張が含まれていたもので、要約には検証できた内容か出典を明示した内容だけを記し、裏付けのない主張は判定とともに一覧に示しています。PUBLISH WITH HEAVY CAVEATS は同様で限定の範囲が広いもの（括弧内は全面的に掲載できる範囲）。PUBLISH AS NEW は新しい一次情報を含み、続報ではなく独立の事件として記録したもの（「after corrections」は訂正を施したうえでという意味）。PROCEDURAL FACTS ONLY は裁判所と提出書類に関する事実と、当事者の公の反応だけを掲載したものです。',
            '登録済み：VSO の事件台帳に登録したもの。検証済み・登録待ち：情報源と照合済みで、台帳への登録前のもの。',
        ],
        'method_h': '方法',
        'method': ('VSO の検証は AI の支援を受けています。Anthropic の Claude を含む AI モデルを、情報源の検索と照合に使っています。'
                   '各記録には根拠とした情報源を挙げ、所在を確認できたものにはリンクを付けて、読み手が自ら確かめられるようにしています。'
                   'いくつかの記録には AI 開発者が関わっています。それらにも同じ規則を当てて印を付けています。印を付けるのは、問題の AI システムの開発者・提供者としての立場で当事者である場合か、そのモデルやツールが記録の中心にある場合です。'
                   'VSO がこの作業で Claude のモデルを使っている Anthropic が関わる記録には、その旨を記しています。'),
        'excluded': '掲載していないもの：{items}。掲載済みの事件の続報は、新しい事件として記録しません。',
        'reasons': {'HOLD': '保留', 'DO-NOT-PUBLISH-AS-NEW': '新しい一次情報がないため新規事件として記録していないもの',
                    'awaiting re-verification': '再検証待ち', 'registration undecided': '登録未決'},
        'data': 'データ（JSON、CC BY 4.0）',
        'index': '記録一覧',
        'verified': '検証日',
        'event': '発生',
        'allegations': '主張（未検証）',
        'party_note': '{p} が関わる記録（VSO は検証作業で同社のモデルを使っています）',
        'party_other': 'AI 開発者 {p} が関わる記録',
        'no_link': 'リンク未確認',
        'claims': '検証した主張',
        'relevance': 'VAP が関わる点',
        'would_not': 'VAPにできないこと',
        'sources': '情報源',
        'primary': '一次',
        'secondary': '二次',
        'corr': 'VSO の過去の記述に対する訂正',
        'later': '再確認の際に把握した動き（網羅的な確認ではありません）',
        'rechecked': '情報源を再確認',
        'src_label': '出典',
        'undisclosed': '時期は非公表',
        'status_reg': {'registered (ledger v1.2)': '登録済み', 'verified, pending registration': '検証済み・登録待ち'},
    },
}


def validate_incidents(data):
    ids = set()
    for r in data['records']:
        rid = r['id']
        assert rid not in ids, f'duplicate id {rid}'
        ids.add(rid)
        assert r['publication_verdict'].split(' (')[0] in PUBLICATION_VERDICTS, (rid, r['publication_verdict'])
        for c in r['claims']:
            assert c['verdict'] in VERDICTS, (rid, c['verdict'])
        for field in ('title', 'jurisdiction', 'summary', 'vap_would_not'):
            assert r[field]['en'].strip() and r[field]['ja'].strip(), (rid, field)
        assert r['sources'] or r.get('references_without_url'), (rid, 'no sources')
        for s in r['sources']:
            assert s['url'].startswith('https://') or s['url'].startswith('http://'), (rid, s['url'])
            assert s['kind'] in ('primary', 'secondary'), (rid, s)
    return ids


def record_html(lang, r):
    t = INC[lang]
    badges = [f'<span class="badge">{esc(r["publication_verdict"])}</span>',
              f'<span class="badge">{esc(t["status_reg"].get(r["registry_status"], r["registry_status"]))}</span>']
    if r.get('allegations'):
        badges.append(f'<span class="badge alleg">{t["allegations"]}</span>')
    for party in r.get('ai_provider_party') or []:
        key = 'party_note' if party in VSO_USES_MODELS_FROM else 'party_other'
        badges.append(f'<span class="badge note">{esc(t[key].format(p=party))}</span>')
    claims = ''.join(f'<tr><td>{esc(c["claim"][lang])}</td><td class="v">{esc(c["verdict"])}</td></tr>' for c in r['claims'])
    sources = ''.join(f'<li>{a(s["label"], s["url"])} <span class="small">({t[s["kind"]]})</span></li>' for s in r['sources'])
    sources += ''.join(f'<li>{esc(x)} <span class="small">({t["no_link"]})</span></li>' for x in r.get('references_without_url', []))
    corr = ''.join(f'<li><time datetime="{esc(c["date"])}">{esc(c["date"])}</time> — {esc(c[lang])}</li>'
                   for c in r.get('corrections', []))
    event = t['undisclosed'] if r['event_date'] == 'undisclosed' else r['event_date']
    out = (f'<li class="entry" id="{esc(r["id"])}"><div class="meta">{esc(r["id"])} · {t["event"]} {esc(event)} · '
           f'{t["verified"]} <time datetime="{esc(r["verified"])}">{esc(r["verified"])}</time>'
           + (f' ({t["rechecked"]} <time datetime="{esc(r["rechecked"])}">{esc(r["rechecked"])}</time>)' if r.get('rechecked') else '')
           + f' · {esc(r["jurisdiction"][lang])}</div>'
           f'<h2>{esc(r["title"][lang])}</h2><div class="badges">{"".join(badges)}</div>'
           f'<p>{esc(r["summary"][lang])}</p>')
    if claims:
        out += f'<h3>{t["claims"]}</h3><table>{claims}</table>'
    if r.get('vap_relevance', {}).get(lang, '').strip():
        out += f'<h3>{t["relevance"]}</h3><p>{esc(r["vap_relevance"][lang])}</p>'
    out += f'<h3>{t["would_not"]}</h3><p>{esc(r["vap_would_not"][lang])}</p>'
    if sources:
        out += f'<h3>{t["sources"]}</h3><ul class="src">{sources}</ul>'
    later = ''.join(f'<li><time datetime="{esc(x["date"])}">{esc(x["date"])}</time> — {esc(x[lang])}'
                    + (f' ({a(t["src_label"], x["url"])})' if x.get('url') else '') + '</li>' for x in r.get('later', []))
    if later:
        out += f'<h3>{t["later"]}</h3><ul class="src">{later}</ul>'
    if corr:
        out += f'<h3>{t["corr"]}</h3><ul class="src">{corr}</ul>'
    return out + '</li>'


def incidents_page(lang, data):
    t = INC[lang]
    alt = {code: INC[code]['url'] for code in ('en', 'ja')}
    ld = {'@context': 'https://schema.org', '@type': 'Dataset', 'name': t['h1'], 'description': t['desc'],
          'url': SITE + t['url'], 'inLanguage': lang, 'dateModified': data['as_of'],
          'license': 'https://creativecommons.org/licenses/by/4.0/',
          'distribution': {'@type': 'DataDownload', 'encodingFormat': 'application/json',
                           'contentUrl': SITE + '/incidents/incidents.json'},
          'creator': {'@type': 'Organization', 'name': 'VeritasChain Standards Organization (VSO)'}}
    records = sorted(data['records'], key=lambda r: (r['verified'], r['id']), reverse=True)
    toc = ''.join(f'<li><a href="#{esc(r["id"])}">{esc(r["id"])}</a> {esc(r["title"][lang])}</li>' for r in records)
    fmt = '{r}（{n}件）' if lang == 'ja' else '{r} ({n})'
    items = ('、' if lang == 'ja' else ', ').join(
        fmt.format(r=t['reasons'].get(x['reason'], x['reason']), n=x['count'])
        for x in data.get('excluded_counts', []) if x['count'])
    rules = ''.join(f'<li>{esc(x)}</li>' for x in t['rules'])
    c = COMMON[lang]
    body = (f'<main><div class="eyebrow">{t["eyebrow"]} · {data["as_of"]}</div><h1>{t["h1"]}</h1>'
            f'<p class="intro">{esc(t["intro"])}</p>'
            f'<p class="small">{a(t["data"], "/incidents/incidents.json")} · {a(*c["limits_page"])} · {a(*c["corrections"])}</p>\n'
            f'<section class="box"><h3>{t["rules_h"]}</h3><ul>{rules}</ul>'
            f'<h3>{t["method_h"]}</h3><p>{esc(t["method"])}</p>'
            + (f'<p class="small">{esc(t["excluded"].format(items=items))}</p>' if items else '') +
            '</section>\n' + section_16(lang) + status(lang) +
            f'<h2>{t["index"]} ({len(records)})</h2><ul class="toc">{toc}</ul>\n'
            f'<ol class="records">{"".join(record_html(lang, r) for r in records)}</ol></main>\n')
    return head(lang, t['title'], t['desc'], t['url'], alt, ld) + top(lang, alt) + body + footer()


# ---------------------------------------------------------------- limits

LIM = {
    'en': {
        'url': '/vap/limits/',
        'title': 'What VAP does not do | VAP — VeritasChain',
        'h1': 'What VAP does not do',
        'eyebrow': 'VAP · LIMITS',
        'desc': ('Limits of the VAP metaframework, set out by the patterns that recur in VSO’s verified AI incident '
                 'records, with the specification clauses behind each.'),
        'intro': ('VSO checks reported AI incidents against primary sources where it can, and otherwise against reliable reporting, before writing about them. The same patterns '
                  'recur, and in most of them VAP has a limited role or none. This page sets those limits out pattern by '
                  'pattern, with the clauses of VAP v1.2 that state them. It does not say what VAP would have done in any incident.'),
        'basis': 'Basis in the specification',
        'examples': 'Verified examples',
    },
    'ja': {
        'url': '/vap/limits/ja/',
        'title': 'VAPにできないこと | VAP — VeritasChain',
        'h1': 'VAPにできないこと',
        'eyebrow': 'VAP · 限界',
        'desc': ('VSO が検証した AI 事件の記録で繰り返し現れるパターンごとに、VAP メタフレームワークの限界と、'
                 'その根拠となる仕様の条項をまとめています。'),
        'intro': ('VSO は、報じられた AI 事件を、一次情報（取得できない場合は信頼できる報道）と照合してから扱っています。そこでは同じパターンが繰り返し現れ、'
                  'その多くで VAP の役割は限られているか、まったくありません。このページは、その限界をパターンごとに、'
                  '根拠となる VAP v1.2 の条項とともに示します。どの事件についても、VAP の効果を仮定して述べるものではありません。'),
        'basis': '仕様上の根拠',
        'examples': '検証済みの例',
    },
}


def limits_page(lang, limits, records):
    t = LIM[lang]
    c = COMMON[lang]
    alt = {code: LIM[code]['url'] for code in ('en', 'ja')}
    ld = {'@context': 'https://schema.org', '@type': 'WebPage', 'name': t['h1'], 'description': t['desc'],
          'url': SITE + t['url'], 'inLanguage': lang, 'dateModified': limits['updated'],
          'publisher': {'@type': 'Organization', 'name': 'VeritasChain Standards Organization (VSO)'}}
    decl = f'<section class="box"><h3>{c["decl_vs"]}</h3><blockquote lang="en">{esc(DECLARATION)}</blockquote>'
    if lang == 'ja':
        decl += f'<p class="small">{c["ref_tr"]}：{esc(DECLARATION_JA)}</p>'
    decl += '</section>\n'
    items = []
    rec_base = INC[lang]['url']
    for p in limits['patterns']:
        ex = ''
        if p['examples']:
            lis = ''.join(
                f'<li>{a(e["record"] + " " + records[e["record"]]["title"][lang], rec_base + "#" + e["record"])} — {esc(e[lang])}</li>'
                for e in p['examples'])
            ex = f'<h3>{t["examples"]}</h3><ul class="src">{lis}</ul>'
        items.append(f'<li class="entry" id="{esc(p["id"])}"><h2>{esc(p["title"][lang])}</h2><p>{esc(p["text"][lang])}</p>'
                     f'<p class="small">{t["basis"]}：{esc(p["basis"][lang])}</p>{ex}</li>'
                     if lang == 'ja' else
                     f'<li class="entry" id="{esc(p["id"])}"><h2>{esc(p["title"][lang])}</h2><p>{esc(p["text"][lang])}</p>'
                     f'<p class="small">{t["basis"]}: {esc(p["basis"][lang])}</p>{ex}</li>')
    spec = limits['spec']
    body = (f'<main><div class="eyebrow">{t["eyebrow"]} · {limits["updated"]}</div><h1>{t["h1"]}</h1>'
            f'<p class="intro">{esc(t["intro"])}</p>'
            f'<p class="small">{a(spec["label"], spec["url"])} · {a(*c["records_page"])} · {a(*c["corrections"])}</p>\n'
            + decl + f'<ol class="patterns">{"".join(items)}</ol>\n' + section_16(lang) + status(lang) + '</main>\n')
    return head(lang, t['title'], t['desc'], t['url'], alt, ld) + top(lang, alt) + body + footer()


def write(rel, text):
    path = ROOT / rel.strip('/') / 'index.html'
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding='utf-8')
    return path.relative_to(ROOT)


def main():
    data = json.loads(INCIDENTS.read_text(encoding='utf-8'))
    limits = json.loads(LIMITS.read_text(encoding='utf-8'))
    ids = validate_incidents(data)
    records = {r['id']: r for r in data['records']}
    for p in limits['patterns']:
        for e in p['examples']:
            if e['record'] not in ids:
                sys.exit(f'limits.json: pattern {p["id"]} cites unknown record {e["record"]}')
    out = [write(INC[lang]['url'], incidents_page(lang, data)) for lang in ('en', 'ja')]
    out += [write(LIM[lang]['url'], limits_page(lang, limits, records)) for lang in ('en', 'ja')]
    print('Wrote ' + ', '.join(str(p) for p in out) + f' ({len(ids)} records)')


if __name__ == '__main__':
    main()
