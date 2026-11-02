#!/usr/bin/env python3
"""Build static, multilingual announcement archives and latest-three home sections.
Edit data/announcements/{en,ja,zh}.json, then run this script. Historical excerpts
are retained; individual article files are never changed by this generator.
"""
from pathlib import Path
from html import escape as e
import json,re,collections
ROOT=Path(__file__).resolve().parents[1]
TEXT={
'en':dict(title='Announcements archive',latest='Latest announcements',all='View all announcements',home='VCP / VSO home',desc='Browse VSO announcements, research updates and press releases by date and category. Historical records and their original article URLs are retained.',intro='Research, specifications and organizational news from VeritasChain Standards Organization. Browse by date or topic, and open each record for its original context.',status='Experimental extensions remain unadopted; independent third-party reproduction has not been established. First-party CI and saved-evidence checks are distinct from independent fresh execution.',history='Dates below are original publication dates. Later updates are identified when recorded. Historical notices describe the status at that time; their claims are not new confirmations of adoption, conformance or certification.',month='Month',category='Category',search='Search announcements',reset='Reset filters',any='All',count='{shown} of {total} records',empty='No announcements match these filters.',original='Read the archived notice',label='Historical notice, including existing corrections',updated='Updated',cats={'research':'Research & development','announcement':'Announcements','press':'Press releases','operations':'Corrections & operations'},lang='Language',directory='Site directory'),
'ja':dict(title='お知らせアーカイブ',latest='最新のお知らせ',all='すべてのお知らせを見る',home='VCP / VSO トップ',desc='VSOのお知らせ・研究更新・プレスリリースを年月と分類で探せます。過去の掲載記録と個別記事のURLを保持しています。',intro='VeritasChain Standards Organization（VSO）の研究・仕様・活動のお知らせ。年月や分類から、読みたい記録を探せます。',status='実験的拡張は未採択、第三者による独立再現は未成立です。自社CIや保存証拠の再検証と、独立した新規実行を区別します。',history='日付は当初の掲載日です。後日の更新日が記録されている記事は併記しています。過去の案内は当時の記録であり、現在の採択・適合・認証を新たに確認したものではありません。',month='年月',category='分類',search='キーワード',reset='絞り込みを解除',any='すべて',count='{total}件中 {shown}件を表示',empty='条件に一致するお知らせはありません。',original='当時の掲載内容を読む',label='過去の掲載内容（既存の訂正を含む）',updated='更新',cats={'research':'研究・開発','announcement':'お知らせ','press':'プレスリリース','operations':'訂正・運営'},lang='言語',directory='サイト一覧'),
'zh':dict(title='公告归档',latest='最新公告',all='查看全部公告',home='VCP / VSO 首页',desc='按年月和类别浏览VSO公告、研究更新及新闻稿。保留历史记录与原文章网址。',intro='VeritasChain Standards Organization（VSO）的研究、规范与组织动态。按日期或类别查找公告，并阅读原始记录。',status='实验性扩展仍未采纳，独立第三方复现尚未成立。自有CI及保存证据的复核，与独立的新执行明确区分。',history='日期为原始发布日期；已记录的后续更新日期另行标注。历史公告反映当时状态，不代表重新确认当前采纳、符合性或认证。',month='年月',category='类别',search='关键词',reset='清除筛选',any='全部',count='显示 {shown} / {total} 条',empty='没有符合条件的公告。',original='阅读当时的公告',label='历史公告（包括已有更正）',updated='更新',cats={'research':'研究与开发','announcement':'公告','press':'新闻稿','operations':'更正与运营'},lang='语言',directory='网站目录')}
def archive_path(lang):return '/vso/announcements/'+('' if lang=='en' else lang+'/')
def homepage(lang):return '/' if lang=='en' else '/'+lang+'/'
def compact_summary(row,lang,limit=180):
 s=row['summary']
 if len(s)<=limit:return s
 return s[:limit].rsplit(' ',1)[0]+'…' if lang=='en' and ' ' in s[:limit] else s[:limit]+'…'
def raw_record(row):
 # Resolve original anchor IDs to the outer archive row; keep descendant IDs unique.
 return re.sub(r'\bid=([\"\x27])(.*?)\1',lambda m:'id='+m[1]+'record-'+row['id']+'-'+m[2]+m[1],row['html'])
def row_html(row,lang,archive=False,new=False):
 t=TEXT[lang]; ident=row['id'];url=row['url'] or (archive_path(lang)+'#'+ident+'-record')
 out=f'<li class="news-row" id="{e(ident)}"'+(f' data-news-record data-month="{row["date"][:7]}" data-category="{row["category"]}"' if archive else '')+'>'
 out+=f'<div class="news-meta"><time datetime="{row["date"]}">{row["date"]}</time><span class="news-category">{t["cats"][row["category"]]}</span>'
 if new:out+='<span class="news-new">NEW</span>'
 if row['updated']:out+=f'<span>{t["updated"]} {row["updated"]}</span>'
 out+='</div><div class="news-content">'
 out+=f'<h3><a href="{e(url)}">{e(row["title"])}</a></h3><p class="news-summary">{e(compact_summary(row,lang))}</p>'
 if archive:out+=f'<details class="archive-record" id="{e(ident)}-record"><summary>{t["original"]}</summary><p class="archive-history-label">{t["label"]}</p><div class="archive-original">{raw_record(row)}</div></details>'
 return out+'</div></li>\n'
def page(lang,rows):
 t=TEXT[lang];url='https://veritaschain.org'+archive_path(lang);title=t['title']+' | VCP / VSO — VeritasChain'
 head='<!doctype html>\n<html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n<title>'+e(title)+'</title>\n'
 for key,val in [('description',t['desc']),('og:title',title),('og:description',t['desc']),('og:url',url),('og:type','website'),('og:image','https://veritaschain.org/assets/OGP.png'),('twitter:card','summary_large_image'),('twitter:title',title),('twitter:description',t['desc'])]:
  attr='property' if key.startswith('og:') else 'name';head+=f'<meta {attr}="{key}" content="{e(val)}">\n'
 head+=f'<link rel="canonical" href="{url}">\n'
 for l in ['en','ja','zh','x-default']:head+=f'<link rel="alternate" hreflang="{l}" href="https://veritaschain.org{archive_path("en" if l=="x-default" else l)}">\n'
 schema={'@context':'https://schema.org','@type':'CollectionPage','name':t['title'],'description':t['desc'],'url':url,'inLanguage':lang,'publisher':{'@type':'Organization','name':'VeritasChain Standards Organization (VSO)'},'mainEntity':{'@type':'ItemList','numberOfItems':len(rows),'itemListElement':[{'@type':'ListItem','position':i+1,'name':r['title'],'url':r['url'] or url+'#'+r['id']} for i,r in enumerate(rows)]}}
 head+='<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('</','<\\/')+'</script>\n<link rel="icon" href="/favicon.ico"><link rel="stylesheet" href="/assets/css/news-archive.css"><script src="/assets/js/news-archive.js" defer></script><script defer src="/assets/js/analytics.js?v=20261028"></script></head>\n'
 out=head+'<body class="news-archive" style="margin:0;background:#0b1220"><div class="news-shell"><header class="archive-header"><a href="'+homepage(lang)+'">'+t['home']+'</a><nav aria-label="'+t['lang']+'">'
 for l,label in [('en','English'),('ja','日本語'),('zh','中文')]:out+=f'<a href="{archive_path(l)}" lang="{l}" hreflang="{l}"'+(' aria-current="page"' if l==lang else '')+'>'+label+'</a>'
 out+='</nav></header><main><div class="archive-hero"><span class="archive-eyebrow">VCP / VSO · NEWS ARCHIVE</span><h1>'+t['title']+'</h1><p>'+t['intro']+'</p></div><aside class="news-status"><p>'+t['status']+'</p></aside><p class="archive-history-label">'+t['history']+'</p>'
 months=sorted(set(r['date'][:7] for r in rows),reverse=True)
 out+='<form class="archive-controls" hidden><label>'+t['month']+'<select name="month"><option value="">'+t['any']+'</option>'+''.join(f'<option value="{m}">{m}</option>' for m in months)+'</select></label><label>'+t['category']+'<select name="category"><option value="">'+t['any']+'</option>'+''.join(f'<option value="{k}">{v}</option>' for k,v in t['cats'].items() if any(r['category']==k for r in rows))+'</select></label><label class="archive-search">'+t['search']+'<input name="search" type="search" autocomplete="off"></label><button type="reset">'+t['reset']+'</button></form>'
 out+=f'<p class="archive-count" id="archive-count" role="status" aria-live="polite" data-template="{e(t["count"])}">{t["count"].replace("{shown}",str(len(rows))).replace("{total}",str(len(rows)))}</p><p id="archive-empty" class="archive-empty" hidden>{t["empty"]}</p>'
 for m in months:out+=f'<section class="archive-month" id="month-{m}"><h2>{m}</h2><ul class="news-list">'+''.join(row_html(r,lang,archive=True) for r in rows if r['date'].startswith(m))+'</ul></section>'
 return out+'</main><footer class="archive-footer"><p>VeritasChain Standards Organization (VSO)</p><nav><a href="'+homepage(lang)+'">'+t['home']+'</a><a href="/sitemap/">'+t['directory']+'</a><a href="https://vap.veritaschain.org/'+('ja/' if lang=='ja' else '')+'">VAP</a></nav></footer></div></body></html>\n'
def build():
 for lang in TEXT:
  rows=json.loads((ROOT/'data/announcements'/f'{lang}.json').read_text());assert rows==sorted(rows,key=lambda x:x['date'],reverse=True)
  dest=ROOT/(archive_path(lang).lstrip('/')+'index.html');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(page(lang,rows))
  t=TEXT[lang];home=ROOT/(homepage(lang).lstrip('/')+'index.html');s=home.read_text()
  latest=rows[:3];legacy={x:archive_path(lang)+'#'+r['id'] for r in rows[3:] for x in r['legacy_ids']}
  block='<section class="section section-news" style="background:#0f172a;padding:3rem 0"><div class="news-shell" id="news-container"><div class="news-heading"><h2>'+t['latest']+'</h2><a href="'+archive_path(lang)+'">'+t['all']+' →</a></div><aside class="news-status"><p>'+t['status']+'</p></aside><ul class="news-list">'+''.join(row_html(r,lang,new=i==0) for i,r in enumerate(latest))+'</ul><div>'+''.join(f'<span class="news-legacy-anchor" id="{e(x)}" aria-hidden="true"></span>' for x in legacy)+'<a class="news-more" href="'+archive_path(lang)+'">'+t['all']+' →</a></div></div></section>'
  start=s.index('<section class="section section-news"');end=s.index('</section>',start)+len('</section>')
  s=s[:start]+block+s[end:]
  s=re.sub(r'\n?<script id="news-legacy-map" type="application/json">.*?</script>','',s,flags=re.S)
  if '/assets/css/news-archive.css' not in s:s=s.replace('</head>','<link rel="stylesheet" href="/assets/css/news-archive.css">\n<script src="/assets/js/news-archive.js" defer></script>\n</head>')
  s=s.replace('</body>','<script id="news-legacy-map" type="application/json">'+json.dumps(legacy,ensure_ascii=False)+'</script>\n</body>');home.write_text(s)
  print(lang,len(rows),'archived; latest 3 on homepage')
if __name__=='__main__':build()
