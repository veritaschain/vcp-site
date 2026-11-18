#!/usr/bin/env python3
# build.py — generates vap.veritaschain.org into the repository root.
# Usage: python3 tools/build.py   (run from the repository root)
import json, os, sys, pathlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from common import SITE, TODAY, FAVICON_SVG, CHAIN_DIVIDER
from content_en import PAGES_EN, POST
from content_ja import PAGES_JA

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Date of the informative website wording correction; publication dates stay unchanged.
WORDING_UPDATED = "2026-10-26"

# Dates for specific content updates; leave unrelated article/feed dates intact.
PAGE_UPDATED = {'/updates/': '2026-11-02', '/ja/updates/': '2026-11-02', '/': '2026-11-02', '/ja/': '2026-11-02', '/profiles/': '2026-10-30', '/ja/profiles/': '2026-10-30', '/code/': '2026-10-30', '/ja/code/': '2026-10-30', '/specification/': '2026-10-30', '/ja/specification/': '2026-10-30'}

# Wording correction dates used only by the sitemap; notice placement is unchanged.
CONTENT_CORRECTION_UPDATED = {"/about/": "2026-11-11", "/ja/about/": "2026-11-11"}

CSS = """
:root{--bg:#131316;--panel:#1A1A1F;--panel2:#1E1E24;--line:#2A2A31;--ink:#E9E9EC;
--muted:#9A9AA3;--brand:#C8102E;--brand-ink:#FA5A6E;--mono:ui-monospace,SFMono-Regular,Menlo,
Consolas,"Cascadia Code",monospace;--sans:system-ui,-apple-system,"Segoe UI",Roboto,
"Hiragino Sans","Noto Sans JP",Meiryo,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 var(--sans);
-webkit-font-smoothing:antialiased}
a{color:var(--brand-ink);text-underline-offset:3px}a:hover{color:#fff}
.skip{position:absolute;left:-999px;top:0;background:var(--brand);color:#fff;padding:.5rem 1rem;z-index:9}
.skip:focus{left:0}
:focus-visible{outline:2px solid var(--brand-ink);outline-offset:2px}
.wrap{max-width:1060px;margin:0 auto;padding:0 20px}
header.site{border-bottom:1px solid var(--line);position:sticky;top:0;background:rgba(19,19,22,.92);
backdrop-filter:blur(6px);z-index:5}
header.site .wrap{display:flex;align-items:center;gap:1.2rem;min-height:58px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:.55rem;text-decoration:none;color:var(--ink);
font-weight:800;letter-spacing:.02em}
.brand svg{width:38px;height:24px}
.brand small{color:var(--muted);font-weight:400;font-size:.72rem;letter-spacing:.06em}
nav.main{margin-left:auto;display:flex;gap:.15rem;flex-wrap:wrap;align-items:center}
nav.main a{color:var(--muted);text-decoration:none;padding:.35rem .6rem;border-radius:6px;font-size:.92rem}
nav.main a[aria-current]{color:var(--ink);background:var(--panel2)}
nav.main a:hover{color:var(--ink)}
.lang{font-family:var(--mono);font-size:.8rem;border:1px solid var(--line);border-radius:6px;
padding:.3rem .55rem;color:var(--ink)!important;text-decoration:none;margin-left:.4rem}
.lang:hover{border-color:var(--brand)}
main{padding:2.6rem 0 3.5rem}
.crumbs{font-family:var(--mono);font-size:.78rem;color:var(--muted);margin:0 0 1.4rem}
.crumbs a{color:var(--muted)}
h1{font-size:clamp(1.9rem,4.6vw,2.9rem);line-height:1.14;letter-spacing:-.015em;margin:.2rem 0 1rem;
font-weight:800}
h1 .thin{font-weight:300;color:var(--muted)}
h2{font-size:1.42rem;letter-spacing:-.01em;margin:2.6rem 0 .8rem}
h3{font-size:1.05rem;margin:1.1rem 0 .45rem}
p{margin:.7rem 0}.lead{font-size:1.12rem;color:#C9C9D0;max-width:64ch}
.eyebrow{font-family:var(--mono);font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;
color:var(--brand-ink);margin:0 0 .3rem}
section{margin:0 0 2.8rem}
.hero{display:grid;grid-template-columns:1.15fr .85fr;gap:2.2rem;align-items:center;
padding:1.4rem 0 .6rem}
.chain-hero{width:100%;height:auto}
@media(max-width:840px){.hero{grid-template-columns:1fr}}
.badges{display:flex;gap:.45rem;flex-wrap:wrap;margin:1rem 0}
.chip{font-family:var(--mono);font-size:.74rem;padding:.22rem .6rem;border-radius:999px;
white-space:nowrap}
.chip-released{background:var(--brand);color:#fff;border:1.5px solid var(--brand)}
.chip-rc{color:var(--brand-ink);border:1.5px solid var(--brand)}
.chip-wd{color:var(--muted);border:1.5px dashed #4A4A55}
.chip-concept{color:var(--muted);border:1.5px dotted #4A4A55}
.cta{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1.2rem}
.btn{display:inline-block;background:var(--brand);color:#fff;text-decoration:none;font-weight:700;
padding:.6rem 1.1rem;border-radius:8px;font-size:.95rem}
.btn:hover{background:#E0243F;color:#fff}
.btn.ghost{background:transparent;border:1.5px solid var(--line);color:var(--ink)}
.btn.ghost:hover{border-color:var(--brand)}
.chain-div{margin:.4rem 0 2.4rem;text-align:center}.chain-div svg{width:200px;height:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:1rem;margin:1.2rem 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:1.1rem 1.15rem}
.card h3{margin:.35rem 0 .3rem}.card p{margin:.3rem 0;color:#C4C4CC;font-size:.94rem}
.card-head{display:flex;justify-content:space-between;align-items:center;gap:.6rem}
.pid{font-family:var(--mono);font-weight:700;color:var(--brand-ink);letter-spacing:.05em}
.alias{font-weight:400;color:var(--muted);font-size:.85em}
.twocol{display:grid;grid-template-columns:1fr 1fr;gap:1.6rem}
@media(max-width:760px){.twocol{grid-template-columns:1fr}}
ul,ol{padding-left:1.3rem}li{margin:.4rem 0}ul.plain{list-style:none;padding-left:0}
table.ledger{width:100%;border-collapse:collapse;margin:1.2rem 0;font-size:.93rem;
background:var(--panel);border:1px solid var(--line);border-radius:10px;overflow:hidden}
table.ledger caption{caption-side:top;text-align:left;font-family:var(--mono);font-size:.76rem;
letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:.6rem .9rem;
background:var(--panel2)}
table.ledger th,table.ledger td{padding:.65rem .9rem;border-top:1px solid var(--line);
text-align:left;vertical-align:top}
table.ledger thead th{background:var(--panel2);border-top:none;font-family:var(--mono);
font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
table.ledger tr.hollow td{border-top:1.5px dashed var(--brand);border-bottom:1.5px dashed var(--brand);
background:rgba(200,16,46,.05)}
blockquote.clause{border-left:3px solid var(--brand);background:var(--panel);margin:1.6rem 0;
padding:1rem 1.2rem;border-radius:0 10px 10px 0}
blockquote.clause p{margin:.3rem 0;color:#D6D6DC}
blockquote.clause .trans{color:var(--muted);font-size:.92rem}
blockquote.clause footer{font-family:var(--mono);font-size:.78rem;color:var(--muted);margin-top:.5rem}
pre{background:#0E0E11;border:1px solid var(--line);border-radius:10px;padding:1rem 1.1rem;
overflow-x:auto;font-size:.85rem;line-height:1.55}
code{font-family:var(--mono)}p code,li code,td code{background:var(--panel2);border:1px solid var(--line);
border-radius:5px;padding:.06rem .35rem;font-size:.85em}
.note{color:var(--muted);font-size:.92rem}
.status{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--brand);
border-radius:10px;padding:1.2rem 1.4rem}
.more{font-family:var(--mono);font-size:.88rem}
details.faq{border:1px solid var(--line);border-radius:10px;background:var(--panel);
margin:.7rem 0;padding:.2rem 1.1rem}
details.faq summary{cursor:pointer;list-style:none;display:flex;gap:.6rem;align-items:baseline}
details.faq summary::before{content:"+";font-family:var(--mono);color:var(--brand-ink);font-size:1.2rem}
details.faq[open] summary::before{content:"–"}
details.faq h2{display:inline;font-size:1.02rem;margin:0}
details.faq summary{padding:.7rem 0}
details.faq p{color:#C4C4CC;margin:.2rem 0 1rem}
.post-card h2{margin:.4rem 0}
footer.site{border-top:1px solid var(--line);padding:1.8rem 0 2.4rem;color:var(--muted);
font-size:.86rem}
footer.site .disclosure{font-family:var(--mono);font-size:.76rem;border:1px dashed #4A4A55;
border-radius:8px;padding:.6rem .9rem;margin-bottom:1.1rem;color:#B8B8C0}
footer.site nav{display:flex;gap:1rem;flex-wrap:wrap;margin:.6rem 0}
footer.site a{color:var(--muted)}footer.site a:hover{color:var(--ink)}

/* ---- motion (fully disabled under prefers-reduced-motion) ---- */
nav.main a,footer.site a,a{transition:color .15s ease}
.card{transition:border-color .2s ease}
@media(prefers-reduced-motion:no-preference){
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes draw{from{stroke-dashoffset:48}to{stroke-dashoffset:0}}
@keyframes march{to{stroke-dashoffset:-9}}
@keyframes marchr{to{stroke-dashoffset:-26}}
main h1{animation:rise .45s ease-out both}
.hero .eyebrow,.hero h1,.hero .lead,.hero .badges,.hero .cta{opacity:0;animation:rise .55s ease-out forwards}
.hero .eyebrow{animation-delay:.05s}.hero h1{animation-delay:.12s}.hero .lead{animation-delay:.22s}
.hero .badges{animation-delay:.34s}.hero .cta{animation-delay:.46s}
.chain-hero .cb{opacity:0;animation:rise .5s ease-out forwards}
.chain-hero .cb1{animation-delay:.15s}.chain-hero .cb2{animation-delay:.4s}
.chain-hero .cb4{animation-delay:.9s}.chain-hero .cb5{animation-delay:1.15s}
.chain-hero .hollow{opacity:0;animation:rise .5s .65s ease-out forwards,marchr 4.5s 1.3s linear infinite}
.chain-hero .cls{stroke-dasharray:48;stroke-dashoffset:48}
.chain-hero .cl1{animation:draw .35s .34s ease-out forwards}
.chain-hero .cl4{animation:draw .35s 1.09s ease-out forwards}
.chain-hero .cld{opacity:0}
.chain-hero .cl2{animation:fade .35s .59s forwards,march 1.4s .59s linear infinite}
.chain-hero .cl3{animation:fade .35s .84s forwards,march 1.4s .84s linear infinite}
.chain-hero .lbl{opacity:0;animation:fade .6s 1.35s forwards}
.chain-hero .cap{opacity:0;animation:fade .8s 1.7s forwards}
.chain-div .march{animation:march 1.6s linear infinite}
.card{transition:transform .2s ease,border-color .2s ease}
.card:hover{transform:translateY(-3px);border-color:var(--brand)}
.btn{transition:transform .15s ease,background .15s ease,border-color .15s ease}
.btn:hover{transform:translateY(-1px)}
.reveal{opacity:0;transform:translateY(14px);transition:opacity .55s ease,transform .55s ease}
.reveal.in{opacity:1;transform:none}
}

/* ---- motion v2: pulses, marquee, stats, pipeline, link underline, progress ---- */
.progress{position:fixed;top:0;left:0;right:0;height:2px;background:var(--brand);
transform:scaleX(0);transform-origin:0 0;z-index:9;pointer-events:none}
.tickwrap{overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);
margin:2.4rem 0;mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.tick{display:flex;width:max-content;font-family:var(--mono);font-size:.78rem;
color:var(--muted);padding:.55rem 0}
.tickrow{display:flex;gap:2.4rem;padding-right:2.4rem;white-space:nowrap}
.tick .sep{color:var(--brand)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin:1.3rem 0 1.6rem}
.stat{background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:1rem .6rem;text-align:center}
.stat.zero{border-style:dashed;border-color:#4A4A55}
.stat .num{display:block;font-family:var(--mono);font-size:2.1rem;font-weight:700;color:var(--ink);line-height:1.1}
.stat .nzero{color:var(--brand-ink)}
.stat .slbl{font-family:var(--mono);font-size:.72rem;color:var(--muted);letter-spacing:.04em}
.pipe{margin:1.6rem auto;max-width:680px}
.pipe svg{width:100%;height:auto;display:block;background:#17171B;border:1px solid var(--line);border-radius:10px}
.pl .flowdot{opacity:0}
@media(prefers-reduced-motion:no-preference){
@keyframes vpulse{0%{transform:translateX(14px);opacity:0}4%{opacity:1}
46%{transform:translateX(540px);opacity:1}52%,100%{transform:translateX(540px);opacity:0}}
.chain-hero .vpulse{animation:vpulse 7s 2.4s linear infinite}
@keyframes dpulse{0%{transform:translateX(28px);opacity:0}8%{opacity:1}
70%{transform:translateX(168px);opacity:1}78%,100%{opacity:0}}
.chain-div .dpulse{animation:dpulse 4.5s linear infinite}
@keyframes tick{to{transform:translateX(-50%)}}
.tick{animation:tick 38s linear infinite}
main p a,main li a,main td a{text-decoration:none;
background:linear-gradient(currentColor,currentColor) left bottom/0% 1.5px no-repeat;
transition:background-size .25s ease,color .15s ease;padding-bottom:1px}
main p a:hover,main li a:hover,main td a:hover{background-size:100% 1.5px}
@keyframes plst{to{opacity:1}}
.pl .st{opacity:.22}
.pl .st1{animation:plst .4s linear 1.0s forwards}
.pl .st2{animation:plst .4s linear 3.0s forwards}
.pl .st3{animation:plst .4s linear 5.2s forwards}
.pl .st4{animation:plst .4s linear 7.4s forwards}
.pl .st5{transform-origin:585px 72px;animation:plst .4s linear 9.6s forwards}
@keyframes plflow{0%,6%{transform:translateX(55px);opacity:0}10%{opacity:1}
24%{transform:translateX(185px)}42%{transform:translateX(320px)}
60%{transform:translateX(455px)}80%{transform:translateX(585px);opacity:1}
86%,100%{transform:translateX(585px);opacity:0}}
.pl .flowdot{animation:plflow 12s 1s linear infinite}
}


/* ---- animated figures ---- */
.fig{margin:1.8rem auto;max-width:680px}
.fig svg{width:100%;height:auto;display:block;background:#17171B;border:1px solid var(--line);border-radius:10px}
.fig figcaption{font-family:var(--mono);font-size:.76rem;color:var(--muted);margin-top:.55rem;line-height:1.55}
/* transient actors are hidden in the static frame */
.d1 .sweep,.d1 .ok2,.d1 .alth0,.d2 .t1dot,.d2 .t2dot,.d2 .t3dot,.d2 .t3solid,.d3 .s3fill,.d3 .n5{opacity:0}
@media(prefers-reduced-motion:no-preference){
/* D1 — chain verification, 12s cycle */
@keyframes d1sweep{0%,6%{transform:translateX(0);opacity:0}8%{opacity:1}30%{transform:translateX(450px);opacity:1}33%,48%{opacity:0}50%{transform:translateX(0);opacity:1}72%{transform:translateX(450px);opacity:1}75%,100%{opacity:0}}
@keyframes d1ok1{0%,11%{opacity:0}13%,96%{opacity:1}100%{opacity:0}}
@keyframes d1ok2{0%,18%{opacity:0}20%,58%{opacity:1}60%,100%{opacity:0}}
@keyframes d1ok3{0%,27%{opacity:0}29%,96%{opacity:1}100%{opacity:0}}
@keyframes d1alt{0%,38%{opacity:0}42%{opacity:1}44%{opacity:.4}46%,96%{opacity:1}100%{opacity:0}}
@keyframes d1h0{0%,40%{opacity:1}42%,100%{opacity:0}}
@keyframes d1h1{0%,40%{opacity:0}42%,96%{opacity:1}100%{opacity:0}}
@keyframes d1bad{0%,60%{opacity:0}63%,96%{opacity:1}100%{opacity:0}}
@keyframes d1det{0%,66%{opacity:0}69%,96%{opacity:1}100%{opacity:0}}
.d1 .sweep{animation:d1sweep 12s linear infinite}
.d1 .ok1{animation:d1ok1 12s linear infinite}
.d1 .ok2{opacity:1;animation:d1ok2 12s linear infinite}
.d1 .ok3{animation:d1ok3 12s linear infinite}
.d1 .altfill,.d1 .altlbl{animation:d1alt 12s linear infinite}
.d1 .alth0{opacity:1;animation:d1h0 12s linear infinite}
.d1 .alth1{animation:d1h1 12s linear infinite}
.d1 .bad2{animation:d1bad 12s linear infinite}
.d1 .det{animation:d1det 12s linear infinite}
/* D2 — three tiers, 14s cycle */
@keyframes d2t1{0%,4%{transform:translateX(0);opacity:0}6%{opacity:1}22%{transform:translateX(150px);opacity:1}28%,100%{transform:translateX(170px);opacity:0}}
@keyframes d2t2{0%,10%{transform:translateX(0);opacity:0}12%{opacity:1}34%{transform:translateX(240px);opacity:1}42%,100%{transform:translateX(300px);opacity:0}}
@keyframes d2t3{0%,16%{transform:translateX(0);opacity:0}18%{opacity:1}52%{transform:translateX(470px);opacity:1}54%,100%{opacity:0}}
@keyframes d2solid{0%,52%{opacity:0}54%,68%{opacity:1}72%,100%{opacity:0}}
@keyframes d2hollow{0%,52%{opacity:0}54%,100%{opacity:1}}
@keyframes d2ring{0%,72%{opacity:0;transform:scale(.6)}76%{opacity:1;transform:scale(1)}84%{opacity:.25;transform:scale(1.25)}88%{opacity:1;transform:scale(1)}96%{opacity:1}100%{opacity:0}}
@keyframes d2l1{0%,24%{opacity:0}27%,97%{opacity:1}100%{opacity:0}}
@keyframes d2l2{0%,38%{opacity:0}41%,97%{opacity:1}100%{opacity:0}}
@keyframes d2l3{0%,74%{opacity:0}77%,97%{opacity:1}100%{opacity:0}}
.d2 .t1dot{animation:d2t1 14s linear infinite}
.d2 .t2dot{animation:d2t2 14s linear infinite}
.d2 .t3dot{animation:d2t3 14s linear infinite}
.d2 .t3solid{animation:d2solid 14s linear infinite}
.d2 .t3hollow{opacity:1;animation:d2hollow 14s linear infinite}
.d2 .t3ring{transform-origin:530px 184px;animation:d2ring 14s linear infinite}
.d2 .t1lbl{animation:d2l1 14s linear infinite}
.d2 .t2lbl{animation:d2l2 14s linear infinite}
.d2 .t3lbl{animation:d2l3 14s linear infinite}
/* D3 — INT-008, 12s cycle */
@keyframes d3sl1{0%,6%{opacity:0}9%,96%{opacity:1}100%{opacity:0}}
@keyframes d3sl2{0%,11%{opacity:0}14%,96%{opacity:1}100%{opacity:0}}
@keyframes d3s3f{0%,16%{opacity:0}19%,44%{opacity:1}50%,100%{opacity:0}}
@keyframes d3sl4{0%,21%{opacity:0}24%,96%{opacity:1}100%{opacity:0}}
@keyframes d3sl5{0%,26%{opacity:0}29%,96%{opacity:1}100%{opacity:0}}
@keyframes d3n5{0%,30%{opacity:0}33%,52%{opacity:1}55%,100%{opacity:0}}
@keyframes d3n4{0%,52%{opacity:0}55%,96%{opacity:1}100%{opacity:0}}
@keyframes d3ring{0%,56%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1)}68%{opacity:.25;transform:scale(1.2)}72%{opacity:1;transform:scale(1)}94%{opacity:1}100%{opacity:0}}
@keyframes d3det{0%,62%{opacity:0}65%,96%{opacity:1}100%{opacity:0}}
.d3 .sl1{animation:d3sl1 12s linear infinite}
.d3 .sl2{animation:d3sl2 12s linear infinite}
.d3 .s3fill{animation:d3s3f 12s linear infinite}
.d3 .sl4{animation:d3sl4 12s linear infinite}
.d3 .sl5{animation:d3sl5 12s linear infinite}
.d3 .n5{animation:d3n5 12s linear infinite}
.d3 .n4{opacity:1;animation:d3n4 12s linear infinite}
.d3 .ring3{transform-origin:460px 106px;animation:d3ring 12s linear infinite}
.d3 .det3{animation:d3det 12s linear infinite}
/* D4 — Merkle proof, 12s cycle */
@keyframes d4lf{0%,5%{opacity:.15}9%,96%{opacity:1}100%{opacity:.15}}
@keyframes d4nd{0%,16%{opacity:.15}20%,96%{opacity:1}100%{opacity:.15}}
@keyframes d4rt{0%,26%{opacity:.15}30%,96%{opacity:1}100%{opacity:.15}}
@keyframes d4p1{0%,42%{opacity:0}46%,95%{opacity:1}100%{opacity:0}}
@keyframes d4p2{0%,50%{opacity:0}54%,95%{opacity:1}100%{opacity:0}}
@keyframes d4p3{0%,58%{opacity:0}62%,95%{opacity:1}100%{opacity:0}}
@keyframes d4p4{0%,66%{opacity:0}70%,95%{opacity:1}100%{opacity:0}}
@keyframes d4lbl{0%,72%{opacity:0}76%,95%{opacity:1}100%{opacity:0}}
.d4 .lf{animation:d4lf 12s linear infinite}
.d4 .nd{animation:d4nd 12s linear infinite}
.d4 .rt{animation:d4rt 12s linear infinite}
.d4 .pe1{animation:d4p1 12s linear infinite}
.d4 .po1,.d4 .pe2{animation:d4p2 12s linear infinite}
.d4 .po2,.d4 .pe3{animation:d4p3 12s linear infinite}
.d4 .po3,.d4 .pe4{animation:d4p4 12s linear infinite}
.d4 .plbl{animation:d4lbl 12s linear infinite}
}

"""

BRAND_SVG = """<svg viewBox="0 0 76 48" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><g stroke="#C8102E" stroke-width="4" fill="none"><rect x="2" y="14" width="18" height="20" rx="4" fill="#C8102E"/><rect x="56" y="14" width="18" height="20" rx="4" fill="#C8102E"/><rect x="29" y="14" width="18" height="20" rx="4" stroke-dasharray="6 5"/><line x1="20" y1="24" x2="29" y2="24"/><line x1="47" y1="24" x2="56" y2="24" stroke-dasharray="3 4"/></g></svg>"""

NAV = {
 "en": [("/", "Overview"), ("/specification/", "Specification"), ("/profiles/", "Profiles"),
        ("/code/", "Code"), ("/blog/", "Blog"), ("/faq/", "FAQ"), ("/about/", "About")],
 "ja": [("/ja/", "概要"), ("/ja/specification/", "仕様"), ("/ja/profiles/", "プロファイル"),
        ("/ja/code/", "コード"), ("/ja/blog/", "ブログ"), ("/ja/faq/", "FAQ"), ("/ja/about/", "About")],
}

STATUS_CORRECTION = {'en': '<aside class="status" aria-label="GitHub and status update"><strong>GitHub and status update — 26 October 2026</strong><p><strong>RTA verifier review checkpoint:</strong> the separate VCP RTA repository now provides fixes and a fixed review target (<code>cc695fe</code>). Recorded first-party CI passed 809 regression and 15 separate historical tests per environment, while the 40-event evidence replay remains <strong>INDETERMINATE</strong>. This does not establish independent reproduction, full conformance or a new release. <a href="https://veritaschain.org/vso/announcements/2026-10-26-rta-verifier-checkpoint/">Read the RTA update and limits →</a> A <a href="https://github.com/veritaschain/vcp-rta-reference/actions/runs/40263948191">separate first-party CI</a> also completed the unchanged published recipe from a fresh network clone through final assessment on Python 3.11 and 3.13.5; this is procedure validation, not independent reproduction.</p><p>The <a href="https://github.com/veritaschain/vcp-spec/pull/16">VCP candidate schema and synthetic checker</a> and <a href="https://github.com/veritaschain/vap-spec/pull/26">VAP three-valued verification proposal</a> have been incorporated as research. Experimental extensions and proposed repairs remain <strong>unadopted; independent third-party reproduction has not been established</strong>. VAP v1.2.0 is still Draft 3. VCP v1.2 is Released, with known integrity issues under review and full conformance to VAP unestablished. This website\'s code examples are not a native VCP conformance verifier.</p><p><a href="https://github.com/veritaschain/vcp-sdk/releases/tag/v0.1.0">vcp-sdk v0.1.0</a> is a first-party pre-release offline core on GitHub, not a PyPI/npm release, an implementation of vcp-sdk-spec, or an independent external implementation. Its interpretation choices do not adopt normative changes.</p><p><a href="https://github.com/veritaschain/vap-spec/blob/81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1/README.md#implementation-status-mandatory-disclosure">VSO\'s published disclosure as of 25 October 2026</a> reports zero external implementations and zero Evidence Packs accepted in proceedings. These are disclosed project counts, not an independent assessment. <a href="https://github.com/veritaschain/vap-spec/blob/81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1/disclosures/2026-10-24-commercial-contracts.md">Earlier commercial figures remain withdrawn pending verification</a>; this is not a zero-contract finding. Current normative requirements, existing implementations, signed data, fixed distributions and K3 are unchanged by this website update.</p><p><a class="btn" href="https://veritaschain.org/vso/announcements/2026-10-26-vcp-research-update/">Read the research update and evidence →</a></p></aside>', 'ja': '<aside class="status" aria-label="GitHub更新と現在の状態"><strong>GitHub更新と現在の状態 — 2026年10月26日</strong><p><strong>RTA検証器のレビュー用固定版：</strong>別のVCP RTAリポジトリで修正と対象版（<code>cc695fe</code>）を公開しました。参考の自社CIは環境ごとに回帰809件と別枠の公開証拠15件が成功し、40イベントの証拠再検証は<strong>INDETERMINATE（判定不能）</strong>のままです。独立再現・完全適合の成立や新リリースを示しません。<a href="https://veritaschain.org/vso/announcements/2026-10-26-rta-verifier-checkpoint/ja/">RTAの更新と限界を読む →</a> さらに<a href="https://github.com/veritaschain/vcp-rta-reference/actions/runs/40263948191">別の自社CI</a>が、公開済み手順を改変せず、新規クローンから最終照合までPython 3.11・3.13.5で完了しました。手順の確認であり、独立再現ではありません。</p><p><a href="https://github.com/veritaschain/vcp-spec/pull/16">VCPの候補スキーマ・合成試験・チェッカー</a>と、<a href="https://github.com/veritaschain/vap-spec/pull/26">VAPの三値検証文書案</a>を研究成果として取り込みました。実験的拡張と修正案は<strong>未採択、第三者による独立再現は未成立</strong>です。VAP v1.2.0は引き続きDraft 3です。VCP v1.2は公開済みですが、既知の整合性問題はレビュー中で、VAPへの完全適合は未確認です。本サイトのコード例はVCPネイティブ形式の適合検証器ではありません。</p><p><a href="https://github.com/veritaschain/vcp-sdk/releases/tag/v0.1.0">vcp-sdk v0.1.0</a>は、GitHubで公開された開発元のオフライン中核ライブラリのプレリリースです。PyPI・npmでの配布、vcp-sdk-specの実装、外部の独立実装とは区別します。ライブラリ独自の解釈は、規範変更の採択ではありません。</p><p><a href="https://github.com/veritaschain/vap-spec/blob/81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1/README.md#implementation-status-mandatory-disclosure">VSOの2026年10月25日時点の公開開示</a>は、外部実装ゼロ・法的手続で受理されたEvidence Packゼロです。これはプロジェクトの自己開示であり、第三者による確認ではありません。<a href="https://github.com/veritaschain/vap-spec/blob/81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1/disclosures/2026-10-24-commercial-contracts.md">従来の商業数値は原資料確認まで取り下げ</a>ており、契約ゼロという判断ではありません。このサイト更新によって現行規範・既存実装・署名済みデータ・固定配布物・K3は変更しません。</p><p><a class="btn" href="https://veritaschain.org/vso/announcements/2026-10-26-vcp-research-update/ja/">研究更新と検証記録を読む →</a></p></aside>'}

DISCLOSURE = {
 "en": "Project status (VSO published disclosure, 25 October 2026): zero external implementations · commercial figures withdrawn pending verification (24 October 2026; not a zero-count finding) · zero Evidence Packs accepted in any proceeding.",
 "ja": "プロジェクト状況（VSOの公開開示・2026年10月25日時点）：外部実装ゼロ ／ 商業数値は原資料照合まで取り下げ（2026年10月24日訂正。ゼロとの認定ではない） ／ 法的手続で受理された Evidence Pack ゼロ",
}
FOOT_TAG = {
 "en": 'VAP is tamper-evident, not tamper-proof — post-hoc evidentiary infrastructure, never runtime control.',
 "ja": 'VAPは改ざん検知可能（tamper-evident）であって改ざん不能（tamper-proof）ではない — 事後的な証拠インフラであり、実行時制御ではない。',
}

ORG_LD = {
  "@type": "Organization",
  "@id": SITE + "/#vso",
  "name": "VeritasChain Standards Organization",
  "alternateName": "VSO",
  "url": SITE + "/",
  "logo": SITE + "/assets/og-image.png",
  "email": "standards@veritaschain.org",
  "sameAs": ["https://github.com/veritaschain", "https://veritaschain.org"],
}

REVEAL_JS = """<script>(function(){var m=matchMedia("(prefers-reduced-motion: no-preference)").matches;
if(m){var bar=document.createElement("div");bar.className="progress";document.body.appendChild(bar);
var tk=false;addEventListener("scroll",function(){if(tk)return;tk=true;requestAnimationFrame(function(){var h=document.documentElement,s=h.scrollTop/((h.scrollHeight-h.clientHeight)||1);bar.style.transform="scaleX("+s+")";tk=false})},{passive:true});}
if(!m||!("IntersectionObserver"in window))return;
function count(el){var to=+el.dataset.count,d=900,s=performance.now();
function f(n){var p=Math.min((n-s)/d,1);el.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)}
requestAnimationFrame(f)}
var els=document.querySelectorAll("main h2,.grid .card,table.ledger,blockquote.clause,main pre,details.faq,.status,.stats .stat,.fig,.pipe");
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");
var c=e.target.querySelector("[data-count]");if(c&&!c.dataset.done){c.dataset.done=1;count(c)}
io.unobserve(e.target)}})},{rootMargin:"0px 0px -10% 0px",threshold:.08});
els.forEach(function(el,i){el.classList.add("reveal");el.style.transitionDelay=(i%5)*70+"ms";io.observe(el)})})();</script>"""

def jsonld(blocks):
    out = ""
    for b in blocks:
        data = {"@context": "https://schema.org", **b}
        out += ('<script type="application/ld+json">'
                + json.dumps(data, ensure_ascii=False) + "</script>\n")
    return out

def head(pg, lang):
    url = SITE + pg["path"]
    alt = SITE + pg["alt"]
    en_url, ja_url = (url, alt) if lang == "en" else (alt, url)
    ogtype = "article" if pg.get("article") else "website"
    loc, altloc = ("en_US", "ja_JP") if lang == "en" else ("ja_JP", "en_US")
    h = f"""<script defer src="https://veritaschain.org/assets/js/analytics.js?v=20261028"></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{pg['title']}</title>
<meta name="description" content="{pg['desc']}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="ja" href="{ja_url}">
<link rel="alternate" hreflang="x-default" href="{en_url}">
<link rel="alternate" type="application/atom+xml" title="VAP Blog" href="{SITE}/feed.xml">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<meta name="theme-color" content="#131316">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:site_name" content="Verifiable AI Provenance Framework (VAP)">
<meta property="og:type" content="{ogtype}">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{pg['title']}">
<meta property="og:description" content="{pg['desc']}">
<meta property="og:image" content="{SITE}/assets/og-image.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="VAP — Verifiable AI Provenance Framework. A chain of ledger blocks with one hollow block.">
<meta property="og:locale" content="{loc}"><meta property="og:locale:alternate" content="{altloc}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{pg['title']}">
<meta name="twitter:description" content="{pg['desc']}">
<meta name="twitter:image" content="{SITE}/assets/og-image.png">
"""
    if pg.get("article"):
        h += f'<meta property="article:published_time" content="{pg["published"]}T00:00:00+09:00">\n'
    if pg.get("is_home"):
        h += "<!-- google-site-verification: paste your Search Console meta tag here -->\n"

    # ---- JSON-LD
    blocks = []
    name = ("Verifiable AI Provenance Framework (VAP)" if lang == "en"
            else "検証可能なAIプロビナンス・フレームワーク（VAP）")
    if pg.get("is_home"):
        blocks.append({"@type": "WebSite", "@id": SITE + "/#website", "url": SITE + "/",
                       "name": name, "alternateName": "VAP",
                       "inLanguage": lang, "publisher": {"@id": SITE + "/#vso"}})
        blocks.append(ORG_LD)
    else:
        crumbs = [{"@type": "ListItem", "position": 1,
                   "name": "Home" if lang == "en" else "ホーム",
                   "item": SITE + ("/" if lang == "en" else "/ja/")}]
        if pg.get("crumb"):
            crumbs.append({"@type": "ListItem", "position": 2, "name": pg["crumb"],
                           "item": SITE + pg.get("crumb_href", pg["path"])})
        if pg.get("crumb2"):
            crumbs.append({"@type": "ListItem", "position": 3, "name": pg["crumb2"],
                           "item": SITE + pg["path"]})
        blocks.append({"@type": "BreadcrumbList", "itemListElement": crumbs})
    if pg.get("article"):
        blocks.append({"@type": "TechArticle", "headline": pg.get("crumb2", pg["title"]),
                       "description": pg["desc"], "inLanguage": lang,
                       "datePublished": pg["published"], "dateModified": max(pg["published"], WORDING_UPDATED),
                       "mainEntityOfPage": url, "image": SITE + "/assets/og-image.png",
                       "author": {"@id": SITE + "/#vso"}, "publisher": {"@id": SITE + "/#vso"}})
        blocks.append(ORG_LD)
    if pg.get("faq"):
        blocks.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in pg["faq"]]})
    if pg.get("is_code"):
        blocks.append({"@type": "SoftwareSourceCode",
                       "name": "VAP primitives — illustrative examples",
                       "programmingLanguage": ["Python", "Shell"],
                       "codeRepository": "https://github.com/veritaschain",
                       "license": "https://creativecommons.org/licenses/by/4.0/",
                       "url": url, "inLanguage": lang})
    if pg.get("is_about"):
        blocks.append({"@type": "Organization", "name": "VeritasChain Co., Ltd.",
                       "alternateName": "VeritasChain株式会社",
                       "identifier": [
                         {"@type": "PropertyValue", "propertyID": "JP Corporate Number", "value": "9011001174443"},
                         {"@type": "PropertyValue", "propertyID": "DUNS", "value": "698368529"}],
                       "address": {"@type": "PostalAddress", "streetAddress": "2-4-8 Ebisu-Nishi",
                                   "addressLocality": "Shibuya-ku", "addressRegion": "Tokyo",
                                   "postalCode": "150-0021", "addressCountry": "JP"},
                       "email": "info@veritaschain.org", "url": "https://veritaschain.org",
                       "sameAs": ["https://github.com/veritaschain"]})
    h += jsonld(blocks)
    h += f"<style>{CSS}</style>"
    h += '<link rel="stylesheet" href="/assets/vap-navigation-20261115.css">'
    return h

def nav_html(pg, lang):
    ja = lang == 'ja'
    base = '/ja/' if ja else '/'
    groups = [
        ('VAPを知る' if ja else 'About VAP', [
            ('', '概要' if ja else 'Overview', 'フレームワークの目的と範囲' if ja else 'Purpose and scope of the framework'),
            ('profiles/', 'プロファイル' if ja else 'Profiles', '分野別の仕様と公開状態' if ja else 'Domain profiles and publication status'),
            ('faq/', 'よくある質問' if ja else 'FAQ', 'できること・できないこと' if ja else 'Capabilities and limitations'),
            ('about/', 'VSOについて' if ja else 'About VSO', '組織・ガバナンス・連絡先' if ja else 'Organization, governance and contact')]),
        ('仕様・研究' if ja else 'Specifications & research', [
            ('specification/', '仕様' if ja else 'Specification', '公開ドラフトと参照資料' if ja else 'Published draft and references'),
            ('research/', '研究資料' if ja else 'Research resources', '目的から検証資料を探す' if ja else 'Find verification resources by purpose'),
            ('code/', 'コード' if ja else 'Code', 'コード例・実装と検証の範囲' if ja else 'Examples, implementations and limits')]),
        ('読みもの・更新' if ja else 'News & insights', [
            ('updates/', 'お知らせ' if ja else 'Announcements', '最新の更新と過去の試験記録' if ja else 'Latest updates and historical test records'),
            ('blog/', 'ブログ' if ja else 'Blog', '証拠・来歴を読み解く記事' if ja else 'Articles on evidence and provenance')])]
    menus = ''
    for i, (label, entries) in enumerate(groups):
        links = ''
        for path, title, desc in entries:
            href = base + path
            aria = ' aria-current="page"' if href == pg['path'] else ''
            links += f'<a href="{href}"{aria}><span class="nav-title">{title}</span><span class="nav-desc">{desc}</span><span class="nav-arrow" aria-hidden="true">→</span></a>'
        menus += f'<details class="nav-group"><summary>{label}</summary><div class="nav-panel">{links}</div></details>'
    language = 'English' if ja else '日本語'
    altlang = 'en' if ja else 'ja'
    open_label = 'メニューを開く' if ja else 'Open menu'
    close_label = 'メニューを閉じる' if ja else 'Close menu'
    nav_label = 'メインメニュー' if ja else 'Main navigation'
    return f'''<header class="site"><div class="wrap">
<a class="brand" href="{base}" aria-label="VAP — Verifiable AI Provenance Framework">{BRAND_SVG}<span class="brand-name">VAP<small>VERIFIABLE AI PROVENANCE</small></span></a>
<button class="nav-toggle" type="button" aria-controls="vap-navigation" aria-expanded="false" aria-label="{open_label}" data-open="{open_label}" data-close="{close_label}"><svg class="nav-menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg><svg class="nav-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
<nav class="vap-nav" id="vap-navigation" aria-label="{nav_label}">{menus}<a class="nav-language" href="{pg['alt']}" hreflang="{altlang}" lang="{altlang}">{language}</a></nav>
</div></header><script src="/assets/vap-navigation-20261115.js" defer></script>'''

def crumbs_html(pg, lang):
    if pg.get("is_home"): return ""
    home = ('<a href="/">Home</a>' if lang == "en" else '<a href="/ja/">ホーム</a>')
    parts = [home]
    if pg.get("crumb"):
        href = pg.get("crumb_href")
        parts.append(f'<a href="{href}">{pg["crumb"]}</a>' if href else pg["crumb"])
    if pg.get("crumb2"): parts.append(pg["crumb2"])
    return '<p class="crumbs">' + " / ".join(parts) + "</p>"

def footer_html(lang):
    links = ('<a href="/specification/">Specification</a><a href="/profiles/">Profiles</a>'
             '<a href="/code/">Code</a><a href="/blog/">Blog</a><a href="/faq/">FAQ</a>'
             '<a href="/about/">About</a>'
             if lang == "en" else
             '<a href="/ja/specification/">仕様</a><a href="/ja/profiles/">プロファイル</a>'
             '<a href="/ja/code/">コード</a><a href="/ja/blog/">ブログ</a><a href="/ja/faq/">FAQ</a>'
             '<a href="/ja/about/">About</a>')
    company = ("VeritasChain Standards Organization · Secretariat: VeritasChain Co., Ltd., "
               "2-4-8 Ebisu-Nishi, Shibuya-ku, Tokyo"
               if lang == "en" else
               "VeritasChain Standards Organization ／ 事務局：VeritasChain株式会社（東京都渋谷区恵比寿西2-4-8）")
    return f"""<footer class="site"><div class="wrap">
<p class="disclosure">{DISCLOSURE[lang]}</p>
<p>{FOOT_TAG[lang]}</p>
<nav aria-label="Footer">{links}
<a href="https://github.com/veritaschain" rel="external">GitHub</a>
<a href="https://veritaschain.org" rel="external">veritaschain.org</a>
<a href="/feed.xml">Atom</a>
<a href="mailto:standards@veritaschain.org">standards@veritaschain.org</a></nav>
<p>{company} · Specifications CC BY 4.0 · © 2025–2026 VeritasChain Standards Organization</p>
</div></footer>"""

EXPLORER_UPDATED = "2026-10-27"
EXPLORER_PATHS = {"/", "/ja/", "/code/", "/ja/code/"}
EXPLORER_UPDATE = {'en': '<section id="explorer-update-20261027" class="status" aria-label="Explorer update — 27 October 2026"><h2 style="margin-top:0">27 October: Explorer API\'s 159 tests and public GUI update</h2><p>The separate Explorer API fixed search-filter validation and exact nanosecond time-range comparisons. Its first-party CI passed <strong>159 tests</strong>, with zero failures, cancellations, skips or TODOs. This is a repository/CI checkpoint, not confirmation of a production API deployment.</p><p>The <a href="https://veritaschain.org/explorer/app/">public Explorer GUI</a> now requires an explicit tree size for its inclusion calculation, handles uneven branches and rejects malformed proofs. The GUI\'s separate first-party suite passed <strong>26 tests</strong>. The public page remains an API-disconnected demo with 12 synthetic leaves: unsigned, externally unanchored, and not hashes derived from the displayed event contents. A path matching a supplied root does not authenticate the root or tree size, or verify event contents, signatures or external anchors.</p><p>First-party publication checks exercised the 12 demo inclusion controls, notice placement at seven widths, and mobile controls. These checks are separate from the 159 API tests and <strong>do not establish independent reproduction</strong>. VAP\'s historical teaching snippets and the fixed RTA review target remain separate. VAP is still Draft 3; experimental extensions and proposed repairs remain <strong>unadopted</strong>, and independent third-party reproduction has <strong>not been established</strong>.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-26-report-intake-explorer-update/#explorer-update-20261027">Detailed update and limits</a> · <a href="https://github.com/veritaschain/vcp-explorer-api/actions/runs/40355875498">API CI: 159 tests</a> · <a href="https://github.com/veritaschain/vcp-explorer-gui/actions/runs/40360033313">GUI CI: 26 tests</a> · <a href="https://github.com/veritaschain/vcp-site/actions/runs/40427147021">First-party public-page checks</a></p></section>', 'ja': '<section id="explorer-update-20261027" class="status" aria-label="Explorer更新 — 2026年10月27日"><h2 style="margin-top:0">10月27日：Explorer APIの159テストと公開GUIの更新</h2><p>別のExplorer APIでは検索条件の検査と、正確なナノ秒による時刻範囲の比較を修正し、自社CIで<strong>159テスト成功</strong>、失敗・中断・スキップ・todo各0件を確認しました。リポジトリとCIの到達点であり、本番APIの配備確認ではありません。</p><p><a href="https://veritaschain.org/explorer/app/">公開Explorer GUI</a>にも、木のサイズを必須とする包含計算、不均等な枝への対応、不正な証明の拒否を反映しました。GUIの別枠の自社試験は<strong>26テスト成功</strong>です。公開画面はAPI未接続の12葉の合成デモで、未署名・外部アンカーなし、表示されたイベント本文から導いたハッシュでもありません。与えられた根に経路が一致しても、根・サイズの真正性や、イベント本文・署名・外部アンカーを検証したことにはなりません。</p><p>公開後の自社確認では、合成12件の包含計算操作、7種類の画面幅での注意書き、スマホの操作ボタンを確認しました。APIの159テストとは別の確認であり、<strong>独立再現の成立を示しません</strong>。VAPの従来の説明用コード例とRTAの固定レビュー対象も別のものです。VAPはDraft 3のまま、実験的拡張・修正案は<strong>未採択</strong>、第三者による独立再現は<strong>未成立</strong>です。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-26-report-intake-explorer-update/ja/#explorer-update-20261027">更新内容と限界の詳細</a> · <a href="https://github.com/veritaschain/vcp-explorer-api/actions/runs/40355875498">API自社CI・159テスト</a> · <a href="https://github.com/veritaschain/vcp-explorer-gui/actions/runs/40360033313">GUI自社CI・26テスト</a> · <a href="https://github.com/veritaschain/vcp-site/actions/runs/40427147021">公開ページの自社確認</a></p></section>'}

GITHUB_UPDATE = {'en': '<section id="github-update-20261028" class="status"><h2 style="margin-top:0">VSO updates VAP-LAP references, VAP errata and SDK boundary checks</h2><p>28 October: VAP-LAP proposal links, current Draft 3 errata/hash references and SDK boundary checks are available. SDK first-party CI passed <strong>306 Python and 140 TypeScript tests per matrix job</strong>, including 13 shared cases and 15 focused tests per language. The Explorer 159-test notice below is retained separately. Experimental extensions remain <strong>unadopted</strong>; independent reproduction has <strong>not been established</strong>.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-28-vap-lap-sdk-status-update/">Read the update and limits →</a></p></section>', 'ja': '<section id="github-update-20261028" class="status"><h2 style="margin-top:0">VSO、VAP-LAP・VAP正誤情報・SDK境界試験の更新を公開</h2><p>10月28日：VAP-LAPの提案紹介、Draft 3の正誤情報・参照ハッシュ、SDK境界試験を更新。SDKの自社CIは<strong>各環境でPython 306件・TypeScript 140件が成功</strong>し、共通13ケース・各言語15件の対象試験を含みます。Explorerの159テストのお知らせは別記録として維持します。実験的拡張は<strong>未採択</strong>、独立再現は<strong>未成立</strong>です。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-28-vap-lap-sdk-status-update/ja/">更新内容と限界を読む →</a></p></section>'}

GITHUB_UPDATE_20261029 = {'en': '<section id="github-update-20261029" class="status"><h2 style="margin-top:0">VSO updates SDK evidence checks, the Explorer demo and Evidect reproduction guidance</h2><p>29 October: stricter SDK inputs, an API-connected signed-evidence Explorer route and Evidect reproduction guidance are available. The legacy dashboard and historical 159 / 26 and 306 / 140 test records remain separate. Experimental extensions are <strong>unadopted</strong>; independent reproduction is <strong>not established</strong>.</p><p>The new demo uses signed synthetic evidence; intact full evidence is still INDETERMINATE. The API-disconnected / unsigned description in the 27 October record applies to the legacy dashboard.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-29-sdk-evidence-demo-reproduction-update/">Read the update and limits →</a> · <a href="https://veritaschain.org/explorer/app/#/evidence-demo">SDK Evidence Demo</a> · <a href="https://evidect.veritaschain.org/methodology/#reproduce">Evidect</a></p></section>', 'ja': '<section id="github-update-20261029" class="status"><h2 style="margin-top:0">VSO、SDKの証拠検査・Explorerデモ・Evidectの再現手順を更新</h2><p>10月29日：SDKの不正入力対応、API接続した署名付き証拠のExplorerデモ、Evidectの再現手順を追加。旧ダッシュボードと過去の159 / 26・306 / 140テスト記録は別に残します。実験的拡張は<strong>未採択</strong>、独立再現は<strong>未成立</strong>です。</p><p>新デモは署名付き合成証拠を使いますが、正常ケースでも証拠全体はINDETERMINATEです。10月27日付の記録にある「API未接続・未署名」は旧ダッシュボードの説明です。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-29-sdk-evidence-demo-reproduction-update/ja/">更新内容と限界を読む →</a> · <a href="https://veritaschain.org/explorer/app/#/evidence-demo">SDK Evidence Demo</a> · <a href="https://evidect.veritaschain.org/methodology/#reproduce">Evidect</a></p></section>'}

GITHUB_UPDATE_20261030 = {'en': '<section id="github-update-20261030" class="status"><h2 style="margin-top:0">30 October: evidence assessment, uploads and authorization research</h2><p>VAP PR #30 proposes evidence bindings; #31 provides an offline assessor (20 test methods; 23/23 matching scenarios); #32 exercises loopback uploads (39 methods; 17/17 upload cases and 17/17 evidence rechecks match). Evidect #20 adds a synthetic authorization gate (37 tests; 18 scenarios); #21 adds optional SQLite replay reservations (33 new tests; 70 gate-specific tests and four process scenarios). Counts remain separate by scope.</p><p>All results are first-party CI checks. Upload case UL-14 shows a <strong>successful bypass outside the gate</strong>, not OS isolation or production bypass prevention. Experimental extensions remain <strong>unadopted</strong>; independent third-party reproduction is <strong>not established</strong>. Historical 159 / 26 and 306 / 140 test records and fixed distributions are preserved.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-30-incident-evidence-authorization-research-update/">Read the five updates and limits →</a></p></section>', 'ja': '<section id="github-update-20261030" class="status"><h2 style="margin-top:0">10月30日：証拠評価・送信・実行認可の研究更新</h2><p>VAPのPR #30は証拠の結び付けに関する提案、#31はオフライン評価器（20テストメソッド・23/23シナリオ一致）、#32はループバック送信実験（39メソッド・17/17送信ケース・17/17保存証拠の再検証一致）です。Evidect #20は合成の認可ゲート（37テスト・18シナリオ）、#21は任意のSQLite再実行防止（追加33件、ゲート関連計70件・実プロセス4シナリオ）です。件数は対象ごとに区別します。</p><p>すべて自社CIによる確認です。送信実験のUL-14は<strong>ゲート外の迂回が成功するケース</strong>であり、OS隔離や本番での迂回阻止を示しません。実験的拡張は<strong>未採択</strong>、第三者による独立再現は<strong>未成立</strong>です。過去の159 / 26・306 / 140テスト記録と固定配布物は維持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-30-incident-evidence-authorization-research-update/ja/">5件の更新と限界を読む →</a></p></section>'}

GITHUB_UPDATE_20261030_EVENING = {'en': '<section id="github-update-20261030-evening" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">30 October follow-up: evidence preservation, rechecks and guide notices</h2><p>VAP #33 binds publication, disclosure and authorization; #34 covers scoped erasure; #35 preserves 53 original evidence cases and an offline kit; #36 generates bilingual reports; #37 maps 23 requirements and provides review handoff; #38 checks sending prerequisites during collector outage and recovery. VCP guide #3 and #4 distinguish illustrative SDK names from the available SDK, and historical certification procedures from VSO’s current role.</p><p>Runtime checks passed first-party Python 3.12 / 3.14 CI. Saved-evidence rechecks are not fresh runs; automated reports are not human review. Proposals and extensions remain <strong>unadopted</strong>; independent third-party reproduction is <strong>not established</strong>. Erasure is not universal deletion; collector evidence is not independent observation or all-route bypass prevention. Historical tests and fixed distributions remain intact.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-30-evidence-preservation-collector-review-update/">Read the eight updates and limits →</a></p></section>', 'ja': '<section id="github-update-20261030-evening" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">10月30日追記：研究証拠の保存・再検証とガイド訂正</h2><p>VAP #33は公開内容・開示・承認の結び付け、#34は範囲を限定した削除証拠、#35は元証拠53ケースの保存とオフライン再検証、#36は日英の自動報告、#37は要求23項目との対応と外部レビュー手順、#38は収集サービス停止・復旧時の送信条件を扱います。VCPガイド #3・#4では説明用SDK名と実在するSDK、歴史的な認証手順と現在のVSOの役割を区別しました。</p><p>実行系の自社CIはPython 3.12／3.14で成功。保存証拠の再検証は新規実行ではなく、自動報告は人のレビューではありません。提案・実験的拡張は<strong>未採択</strong>、第三者による独立再現は<strong>未成立</strong>です。削除実験は全コピーの消去を、収集実験は独立観測や全経路の迂回阻止を保証しません。過去の試験記録と固定配布物は維持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-30-evidence-preservation-collector-review-update/ja/">8件の更新と限界を読む →</a></p></section>'}

GITHUB_UPDATE_20261031 = {'en': '<section id="github-update-20261031" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">31 October follow-up: post-approval changes, retention evidence and interoperability</h2><p>Evidect #27 tests post-approval changes and process observations (37 existing + 43 new tests; eight synthetic cases). VAP #39–#41 and Evidect #22–#26 separate retention deadlines, deletion evidence and receiver review. VAP #1 adds Python/Node interoperability (32 test methods; two positive and six negative vectors). First-party CI counts remain separate by scope.</p><p>Process separation is not independent authority; a reached deadline or CLOSED_REVIEW does not establish deletion success. Proposals and experimental extensions remain <strong>unadopted</strong>; independent third-party reproduction is <strong>not established</strong>. Historical 53-case, 159 / 26 and other records and fixed distributions are preserved.</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-31-retention-runtime-interop-research-update/">Read the three research areas and limits →</a></p></section>\n', 'ja': '<section id="github-update-20261031" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">10月31日追記：承認後の変更・保存証拠・相互運用</h2><p>Evidect #27は承認後の変更と別プロセス観測（既存37＋追加43テスト、合成8ケース）。VAP #39〜#41とEvidect #22〜#26は保存期限・削除証拠と受領後のレビューを分けます。VAP #1はPython／Node相互運用デモ（32テストメソッド、正例2・負例6）です。対象別の自社CI記録へリンクし、件数は合算しません。</p><p>別プロセスの観測は独立した評価主体ではなく、期限到来やCLOSED_REVIEWは削除成功を意味しません。提案・実験的拡張は<strong>未採択</strong>、第三者による独立再現は<strong>未成立</strong>です。過去の53ケース・159／26等の記録と固定配布物は保持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-10-31-retention-runtime-interop-research-update/ja/">3区分の更新と限界を読む →</a></p></section>\n'}

GITHUB_UPDATE_20261101 = {'en': '<section id="github-update-20261101" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">1 November: saved-report receiver verification and incident review</h2><p>Evidect #28 binds the signed observation handoff to original report bytes and recomputes summaries from saved observations. Each Ubuntu/macOS first-party CI passed 137 tests, including 27 new tests, and eight synthetic cases. PR #29 documents incident sources and scope limits; its three future test candidates remain unimplemented and untested.</p><p>Saved-evidence verification does not rerun the original operation or re-establish its authorization and original signatures. A narrow VALID is not a safety verdict. Extensions remain <strong>unadopted</strong>; independent third-party reproduction is <strong>not established</strong>. Historical 53-case, 159 / 26 and other records and fixed distributions are preserved.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-01-runtime-handoff-incident-review/">Read the two updates and their limits →</a></p></section>\n', 'ja': '<section id="github-update-20261101" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">11月1日：保存レポートの受取側検証と事案レビュー</h2><p>Evidect #28は署名付き観測記録と元レポートを照合し、保存された観測から要約を再計算します。追加27テストを含む計137テストと合成8ケースがUbuntu／macOSの各自社CIで成功。#29は事案の出典と主張範囲を整理した文書更新で、追加候補3試験は未実装・未試験です。</p><p>保存証拠の再検証は元操作の再実行ではなく、当時の認可・元署名は再証明しません。限定的なVALIDも安全性の合格ではありません。実験的拡張は<strong>未採択</strong>、第三者による<strong>独立再現未成立</strong>。過去の53ケース、159／26件などの記録と固定配布物は保持しています。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-01-runtime-handoff-incident-review/ja/">2件の更新と検証範囲を読む →</a></p></section>\n'}

GITHUB_UPDATE_20261102 = {'en': '<section id="github-update-20261102" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">2 November: five service-permission and receiver-history research updates</h2><p>Evidect #30–#34 add service-permission rechecks, saved ten-case verification, checkpoint expiry/generations/key revocation and challenge-bound checks against a separate store. Latest merged eeeacf7 passed 306 tests per Ubuntu/macOS first-party CI job (44 new + 262 existing).</p><p>These are same-controller synthetic experiments. Separate processes and keys do not establish independent administration; both-store rollback and other limits remain. Extensions are <strong>unadopted</strong>; independent third-party reproduction is <strong>not established</strong>. The 137-test record, earlier results and fixed distributions are preserved.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-02-service-permission-receiver-state/">Read the five updates and their limits →</a></p></section>\n', 'ja': '<section id="github-update-20261102" class="status" style="scroll-margin-top:10rem"><h2 style="margin-top:0">11月2日：サービス許可と受取側の証拠履歴の研究更新5件</h2><p>Evidect #30–#34は、サービス許可の再確認、保存10ケースの検証、基準記録の期限・世代・鍵失効、別の保存状態とのチャレンジ照合を追加。最新のマージ済み版eeeacf7では、Ubuntu／macOSの各自社CIで306テスト成功（追加44＋既存262）を確認しました。</p><p>同一管理下の合成実験です。別プロセス・鍵は運営上の独立性を示さず、両保存状態の巻き戻し等は保証範囲外。実験的拡張は<strong>未採択</strong>、第三者による<strong>独立再現未成立</strong>です。137テスト時点を含む過去の記録と固定配布物を保持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-02-service-permission-receiver-state/ja/">5件の更新と検証範囲を読む →</a></p></section>\n'}

def render_legacy(pg, lang):
    return f"""<!doctype html>
<html lang="{lang}">
<head>
{head(pg, lang)}</head>
<body>
<a class="skip" href="#main">{'Skip to content' if lang=='en' else '本文へ移動'}</a>
{nav_html(pg, lang)}
<main id="main">
<div class="wrap">
{GITHUB_UPDATE_20261102[lang] if pg["path"] in ["/", "/ja/"] else ""}{GITHUB_UPDATE_20261101[lang] if pg["path"] in ["/", "/ja/"] else ""}{GITHUB_UPDATE_20261031[lang] if pg["path"] in ["/", "/ja/"] else ""}{GITHUB_UPDATE_20261030_EVENING[lang] + chr(10) if pg["path"] in PAGE_UPDATED else ""}{GITHUB_UPDATE_20261030[lang] + chr(10) if pg["path"] in PAGE_UPDATED else ""}{GITHUB_UPDATE_20261029[lang] + chr(10) if pg["path"] in PAGE_UPDATED else ""}{GITHUB_UPDATE[lang] + chr(10) if pg["path"] in PAGE_UPDATED else ""}{EXPLORER_UPDATE[lang] + chr(10) if pg["path"] in EXPLORER_PATHS else ""}{STATUS_CORRECTION[lang] if not pg.get("is_research") else ""}
{crumbs_html(pg, lang)}{pg['body']}
</div></main>
{footer_html(lang)}
{REVEAL_JS}
</body></html>"""

# Informative notice archive: no changes to the specification or research code.
from html import escape as _esc
NEWS_META = {'en': [{'date': '2026-11-02', 'key': 'GITHUB_UPDATE_20261102', 'id': 'github-update-20261102', 'title': '2 November: five service-permission and receiver-history research updates', 'summary': 'Evidect #30–#34 add synthetic permission and receiver-state experiments. Latest first-party CI passed 306 tests per Ubuntu/macOS job. Extensions remain unadopted; independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-02-service-permission-receiver-state/'}, {'date': '2026-11-01', 'key': 'GITHUB_UPDATE_20261101', 'id': 'github-update-20261101', 'title': '1 November: saved-report receiver verification and incident review', 'summary': 'Evidect #28 adds receiver verification; #29 documents incident sources and scope limits. First-party CI passed 137 tests and eight synthetic cases per OS. Extensions remain unadopted; independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-01-runtime-handoff-incident-review/'}, {'date': '2026-10-31', 'key': 'GITHUB_UPDATE_20261031', 'id': 'github-update-20261031', 'title': '31 October follow-up: post-approval changes, retention evidence and interoperability', 'summary': 'Three research areas: Evidect post-approval checks and process observations, VAP/Evidect retention review, and Python/Node interoperability. First-party CI only; extensions remain unadopted and independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-10-31-retention-runtime-interop-research-update/'}, {'date': '2026-10-30', 'key': 'GITHUB_UPDATE_20261030_EVENING', 'id': 'github-update-20261030-evening', 'title': '30 October follow-up: evidence preservation, rechecks and guide notices', 'summary': 'VAP #33 binds publication, disclosure and authorization; #34 covers scoped erasure; #35 preserves 53 original evidence cases and an offline kit; #36 generates bilingual reports; #37 maps 23 requirements and provides review handoff; #38 checks sending prerequisites during collector outage and recovery. VCP guide #3 and #4 distinguish illustrative SDK names from the available SDK, and historical certification procedures from VSO’s current role.', 'url': 'https://veritaschain.org/vso/announcements/2026-10-30-evidence-preservation-collector-review-update/'}, {'date': '2026-10-30', 'key': 'GITHUB_UPDATE_20261030', 'id': 'github-update-20261030', 'title': '30 October: evidence assessment, uploads and authorization research', 'summary': 'VAP PR #30 proposes evidence bindings; #31 provides an offline assessor (20 test methods; 23/23 matching scenarios); #32 exercises loopback uploads (39 methods; 17/17 upload cases and 17/17 evidence rechecks match). Evidect #20 adds a synthetic authorization gate (37 tests; 18 scenarios); #21 adds optional SQLite replay reservations (33 new tests; 70 gate-specific tests and four process scenarios). Counts remain separate by scope.', 'url': 'https://veritaschain.org/vso/announcements/2026-10-30-incident-evidence-authorization-research-update/'}, {'date': '2026-10-29', 'key': 'GITHUB_UPDATE_20261029', 'id': 'github-update-20261029', 'title': 'VSO updates SDK evidence checks, the Explorer demo and Evidect reproduction guidance', 'summary': '29 October: stricter SDK inputs, an API-connected signed-evidence Explorer route and Evidect reproduction guidance are available. The legacy dashboard and historical 159 / 26 and 306 / 140 test records remain separate. Experimental extensions are unadopted ; independent reproduction is not established .', 'url': 'https://veritaschain.org/vso/announcements/2026-10-29-sdk-evidence-demo-reproduction-update/'}, {'date': '2026-10-28', 'key': 'GITHUB_UPDATE', 'id': 'github-update-20261028', 'title': 'VSO updates VAP-LAP references, VAP errata and SDK boundary checks', 'summary': '28 October: VAP-LAP proposal links, current Draft 3 errata/hash references and SDK boundary checks are available. SDK first-party CI passed 306 Python and 140 TypeScript tests per matrix job , including 13 shared cases and 15 focused tests per language. The Explorer 159-test notice below is retained separately. Experimental extensions remain unadopted ; independent reproduction has not been established .', 'url': 'https://veritaschain.org/vso/announcements/2026-10-28-vap-lap-sdk-status-update/'}, {'date': '2026-10-27', 'key': 'EXPLORER_UPDATE', 'id': 'explorer-update-20261027', 'title': "27 October: Explorer API's 159 tests and public GUI update", 'summary': 'The separate Explorer API fixed search-filter validation and exact nanosecond time-range comparisons. Its first-party CI passed 159 tests , with zero failures, cancellations, skips or TODOs. This is a repository/CI checkpoint, not confirmation of a production API deployment.', 'url': 'https://veritaschain.org/vso/announcements/2026-10-26-report-intake-explorer-update/#explorer-update-20261027'}, {'date': '2026-10-26', 'key': 'STATUS_CORRECTION', 'id': 'status-update-20261026', 'title': 'GitHub and status update — 26 October 2026', 'summary': 'RTA verifier review checkpoint: the separate VCP RTA repository now provides fixes and a fixed review target ( cc695fe ). Recorded first-party CI passed 809 regression and 15 separate historical tests per environment, while the 40-event evidence replay remains INDETERMINATE . This does not establish independent reproduction, full conformance or a new release. Read the RTA update and limits → A separate first-party CI also completed the unchanged published recipe from a fresh network clone through final assessment on Python 3.11 and 3.13.5; this is procedure validation, not independent reproduction.', 'url': 'https://veritaschain.org/vso/announcements/2026-10-26-rta-verifier-checkpoint/'}], 'ja': [{'date': '2026-11-02', 'key': 'GITHUB_UPDATE_20261102', 'id': 'github-update-20261102', 'title': '11月2日：サービス許可と受取側の証拠履歴の研究更新5件', 'summary': 'Evidect #30–#34の合成実験を紹介。最新の自社CIはUbuntu・macOSで各306テスト成功。実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-02-service-permission-receiver-state/ja/'}, {'date': '2026-11-01', 'key': 'GITHUB_UPDATE_20261101', 'id': 'github-update-20261101', 'title': '11月1日：保存レポートの受取側検証と事案レビュー', 'summary': 'Evidect #28の受取側検証と#29の事案レビューを紹介。各OSで137テストと合成8ケースを確認した自社CIの記録です。実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-01-runtime-handoff-incident-review/ja/'}, {'date': '2026-10-31', 'key': 'GITHUB_UPDATE_20261031', 'id': 'github-update-20261031', 'title': '10月31日追記：承認後の変更・保存証拠・相互運用', 'summary': 'Evidectの承認後変更・別プロセス観測、VAPとEvidectの保存証拠レビュー、Python／Node相互運用デモを紹介。自社CIの記録であり、実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-31-retention-runtime-interop-research-update/ja/'}, {'date': '2026-10-30', 'key': 'GITHUB_UPDATE_20261030_EVENING', 'id': 'github-update-20261030-evening', 'title': '10月30日追記：研究証拠の保存・再検証とガイド訂正', 'summary': 'VAP #33は公開内容・開示・承認の結び付け、#34は範囲を限定した削除証拠、#35は元証拠53ケースの保存とオフライン再検証、#36は日英の自動報告、#37は要求23項目との対応と外部レビュー手順、#38は収集サービス停止・復旧時の送信条件を扱います。VCPガイド #3・#4では説明用SDK名と実在するSDK、歴史的な認証手順と現在のVSOの役割を区別しました。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-30-evidence-preservation-collector-review-update/ja/'}, {'date': '2026-10-30', 'key': 'GITHUB_UPDATE_20261030', 'id': 'github-update-20261030', 'title': '10月30日：証拠評価・送信・実行認可の研究更新', 'summary': 'VAPのPR #30は証拠の結び付けに関する提案、#31はオフライン評価器（20テストメソッド・23/23シナリオ一致）、#32はループバック送信実験（39メソッド・17/17送信ケース・17/17保存証拠の再検証一致）です。Evidect #20は合成の認可ゲート（37テスト・18シナリオ）、#21は任意のSQLite再実行防止（追加33件、ゲート関連計70件・実プロセス4シナリオ）です。件数は対象ごとに区別します。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-30-incident-evidence-authorization-research-update/ja/'}, {'date': '2026-10-29', 'key': 'GITHUB_UPDATE_20261029', 'id': 'github-update-20261029', 'title': 'VSO、SDKの証拠検査・Explorerデモ・Evidectの再現手順を更新', 'summary': '10月29日：SDKの不正入力対応、API接続した署名付き証拠のExplorerデモ、Evidectの再現手順を追加。旧ダッシュボードと過去の159 / 26・306 / 140テスト記録は別に残します。実験的拡張は 未採択 、独立再現は 未成立 です。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-29-sdk-evidence-demo-reproduction-update/ja/'}, {'date': '2026-10-28', 'key': 'GITHUB_UPDATE', 'id': 'github-update-20261028', 'title': 'VSO、VAP-LAP・VAP正誤情報・SDK境界試験の更新を公開', 'summary': '10月28日：VAP-LAPの提案紹介、Draft 3の正誤情報・参照ハッシュ、SDK境界試験を更新。SDKの自社CIは 各環境でPython 306件・TypeScript 140件が成功 し、共通13ケース・各言語15件の対象試験を含みます。Explorerの159テストのお知らせは別記録として維持します。実験的拡張は 未採択 、独立再現は 未成立 です。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-28-vap-lap-sdk-status-update/ja/'}, {'date': '2026-10-27', 'key': 'EXPLORER_UPDATE', 'id': 'explorer-update-20261027', 'title': '10月27日：Explorer APIの159テストと公開GUIの更新', 'summary': '別のExplorer APIでは検索条件の検査と、正確なナノ秒による時刻範囲の比較を修正し、自社CIで 159テスト成功 、失敗・中断・スキップ・todo各0件を確認しました。リポジトリとCIの到達点であり、本番APIの配備確認ではありません。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-26-report-intake-explorer-update/ja/#explorer-update-20261027'}, {'date': '2026-10-26', 'key': 'STATUS_CORRECTION', 'id': 'status-update-20261026', 'title': 'GitHub更新と現在の状態 — 2026年10月26日', 'summary': 'RTA検証器のレビュー用固定版： 別のVCP RTAリポジトリで修正と対象版（ cc695fe ）を公開しました。参考の自社CIは環境ごとに回帰809件と別枠の公開証拠15件が成功し、40イベントの証拠再検証は INDETERMINATE（判定不能） のままです。独立再現・完全適合の成立や新リリースを示しません。 RTAの更新と限界を読む → さらに 別の自社CI が、公開済み手順を改変せず、新規クローンから最終照合までPython 3.11・3.13.5で完了しました。手順の確認であり、独立再現ではありません。', 'url': 'https://veritaschain.org/vso/announcements/2026-10-26-rta-verifier-checkpoint/ja/'}]}
NEWS_TEXT = {'en': {'title': 'Announcements archive', 'latest': 'Latest announcements', 'all': 'View all announcements', 'home': 'VCP / VSO home', 'desc': 'Browse VSO announcements, research updates and press releases by date and category. Historical records and their original article URLs are retained.', 'intro': 'Research, specifications and organizational news from VeritasChain Standards Organization. Browse by date or topic, and open each record for its original context.', 'status': 'Experimental extensions remain unadopted; independent third-party reproduction has not been established. First-party CI and saved-evidence checks are distinct from independent fresh execution.', 'history': 'Dates below are original publication dates. Later updates are identified when recorded. Historical notices describe the status at that time; their claims are not new confirmations of adoption, conformance or certification.', 'month': 'Month', 'category': 'Category', 'search': 'Search announcements', 'reset': 'Reset filters', 'any': 'All', 'count': '{shown} of {total} records', 'empty': 'No announcements match these filters.', 'original': 'Read the archived notice', 'label': 'Historical notice, including existing corrections', 'updated': 'Updated', 'cats': {'research': 'Research & development', 'announcement': 'Announcements', 'press': 'Press releases', 'operations': 'Corrections & operations'}, 'lang': 'Language', 'directory': 'Site directory'}, 'ja': {'title': 'お知らせアーカイブ', 'latest': '最新のお知らせ', 'all': 'すべてのお知らせを見る', 'home': 'VCP / VSO トップ', 'desc': 'VSOのお知らせ・研究更新・プレスリリースを年月と分類で探せます。過去の掲載記録と個別記事のURLを保持しています。', 'intro': 'VeritasChain Standards Organization（VSO）の研究・仕様・活動のお知らせ。年月や分類から、読みたい記録を探せます。', 'status': '実験的拡張は未採択、第三者による独立再現は未成立です。自社CIや保存証拠の再検証と、独立した新規実行を区別します。', 'history': '日付は当初の掲載日です。後日の更新日が記録されている記事は併記しています。過去の案内は当時の記録であり、現在の採択・適合・認証を新たに確認したものではありません。', 'month': '年月', 'category': '分類', 'search': 'キーワード', 'reset': '絞り込みを解除', 'any': 'すべて', 'count': '{total}件中 {shown}件を表示', 'empty': '条件に一致するお知らせはありません。', 'original': '当時の掲載内容を読む', 'label': '過去の掲載内容（既存の訂正を含む）', 'updated': '更新', 'cats': {'research': '研究・開発', 'announcement': 'お知らせ', 'press': 'プレスリリース', 'operations': '訂正・運営'}, 'lang': '言語', 'directory': 'サイト一覧'}}

GITHUB_UPDATE_20261103 = {'en': '<section id="github-corrections-20261103" class="status"><h2>VSO updates verification-status disclosures and the public Explorer</h2><p>23 merged repository corrections: current VAP text and digest, bounded Explorer hash-chain checks, authentication fixes and historical-status disclosures. Experimental extensions remain unadopted; independent reproduction is not established.</p><p>These are disclosure corrections, bounded implementation repairs and first-party checks. They do not establish full VCP/VAP conformance, certification, production readiness or independent third-party reproduction. Experimental extensions remain <strong>unadopted</strong>; independent reproduction is <strong>not established</strong>. A local test reported in a PR, first-party CI, this website deployment check and an independent new execution are different records.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-03-verification-status-explorer-corrections/">Read the corrections and their limits →</a></p></section>', 'ja': '<section id="github-corrections-20261103" class="status"><h2>VSO、検証状態の表記と公開Explorerを更新</h2><p>23リポジトリのマージ済み修正を集約。VAP本文参照・ハッシュ、Explorerの限定的なリンク照合、認証処理と過去資料の状態表記を更新。実験的拡張は未採択、独立再現は未成立です。</p><p>公開表記の訂正、限定した実装修正、自社による確認の記録です。VCP／VAPの完全適合、認証、本番適合、第三者による独立再現を成立させるものではありません。実験的拡張は<strong>未採択</strong>、独立再現は<strong>未成立</strong>です。PRに記載されたローカル試験、自社CI、今回のサイト公開確認、第三者自身による新規実行を区別します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-03-verification-status-explorer-corrections/ja/">修正内容と確認範囲を読む →</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-03', 'key': 'GITHUB_UPDATE_20261103', 'id': 'github-corrections-20261103', 'title': 'VSO updates verification-status disclosures and the public Explorer', 'summary': 'VAP source/hash, public Explorer and 23 merged corrections. First-party checks are distinct from independent reproduction; experimental extensions remain unadopted.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-03-verification-status-explorer-corrections/'}], 'ja': [{'date': '2026-11-03', 'key': 'GITHUB_UPDATE_20261103', 'id': 'github-corrections-20261103', 'title': 'VSO、検証状態の表記と公開Explorerを更新', 'summary': 'VAP本文参照・ハッシュ、公開Explorer、マージ済み23件の修正を反映。自社確認と独立再現を区別し、実験的拡張は未採択のままです。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-03-verification-status-explorer-corrections/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]
PAGE_UPDATED.update({'/': '2026-11-03', '/ja/': '2026-11-03', '/updates/': '2026-11-03', '/ja/updates/': '2026-11-03', '/specification/': '2026-11-03', '/ja/specification/': '2026-11-03'})

GITHUB_UPDATE_20261105 = {'en': '<section id="research-sdk-20261105" class="status"><h2>VAP research, SDK updates and external reproduction notes</h2><p>Merged research separates control observations, wallet authorization and execution evidence. SDK fixes and reproduction notes are available; independent reproduction is not established.</p><p>Experimental extensions remain unadopted; independent third-party reproduction has not been established. The results below are first-party CI and internal research checks, not an independent assessment, certification, production-readiness determination or proof of complete observation.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/">Read the update and source records</a></p><div id="main-ci-20261105"><h3>5 November follow-up: site main CI completed</h3><p>Website main <code>a18cda8</code> completed all five workflows and 12 jobs, including 110 image comparisons, 55 regression tests and a 428-page CSP crawl. Chinese VeraSnap image pairs matched exactly at desktop and mobile widths. Comparison criteria were not relaxed.</p><p>This is first-party website CI, not an independent reproduction result. Experimental extensions remain unadopted; independent reproduction is not established. Historical test records remain attached to their original revisions.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/#main-ci-20261105">Read the main CI completion results and scope</a></p></div></section>', 'ja': '<section id="research-sdk-20261105" class="status"><h2>VAP研究・SDKの更新と外部再現ノートを公開</h2><p>制御状態の観測、ウォレットの承認と実行証拠を分ける研究更新、SDKの修正、外部再現ノートを案内します。実験的拡張は未採択、独立再現は未成立です。</p><p>実験的拡張は未採択、第三者による独立再現は未成立です。以下は自社CI・内部研究での確認であり、独立した評価、認証、本番適合、全操作の観測を示すものではありません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/ja/">更新内容と一次資料を読む</a></p><div id="main-ci-20261105"><h3>11月5日追記：サイトmainのCIが完了</h3><p>サイト用リポジトリのmain <code>a18cda8</code> で、5ワークフロー・12ジョブが完了。画像比較110ケース、回帰試験55件、CSP検査428ページを確認しました。中国語VeraSnapはPC・スマホとも比較画像が完全一致しています。検査基準は緩めていません。</p><p>サイト保守の自社CIであり、独立再現の実績ではありません。実験的拡張は未採択、独立再現は未成立のままです。過去の試験記録は当時の版に結び付けて保持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/ja/#main-ci-20261105">main CIの完了結果と確認範囲を読む</a></p></div></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-05', 'key': 'GITHUB_UPDATE_20261105', 'id': 'research-sdk-20261105', 'title': 'VAP research, SDK updates and external reproduction notes', 'summary': '5 Nov: a18cda8 site CI completed (110 image comparisons; 55 regression tests). Research remains unadopted; independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/'}], 'ja': [{'date': '2026-11-05', 'key': 'GITHUB_UPDATE_20261105', 'id': 'research-sdk-20261105', 'title': 'VAP研究・SDKの更新と外部再現ノートを公開', 'summary': '11月5日追記：サイトmain a18cda8の自社CIが完了。画像比較110件・回帰55件が成功。研究の未採択・独立再現未成立と過去の記録を維持しています。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]
PAGE_UPDATED.update({'/': '2026-11-05', '/ja/': '2026-11-05', '/updates/': '2026-11-05', '/ja/updates/': '2026-11-05'})

GITHUB_UPDATE_20261107 = {'en': '<section id="payment-research-20261107" class="status"><h2>VSO publishes seven VAP payment-evidence research and AI design updates</h2><p>VAP #52–#58 were merged on 6 November. First-party payment-research CI checked 57 offline-evidence, 28 dispatch/recovery, 20 authorization and 25 collector tests separately. School-AI and consumer-agent updates are documents; the latter’s eight review cases are unexecuted. Extensions and proposals remain unadopted; independent reproduction is not established.</p><p>All experiments use first-party synthetic environments. A holder of raw mock-provider credentials can bypass the wrapper. Complete route coverage, independent custody, external anchoring, OS privilege separation and full proposal conformance are not established. A signed ACK does not prove truth, completeness or continuing retention.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-07-payment-evidence-research-update/">Read the seven updates, CI and limitations</a></p></section>', 'ja': '<section id="payment-research-20261107" class="status"><h2>VSO、決済証拠の研究とAI利用の文書案7件を公開</h2><p>11月6日にマージされたVAP #52〜#58を紹介します。決済研究の自社CIは、オフライン証拠57件、送信・回復28件、二者承認20件、収集先25件をそれぞれ確認。学校AI・消費者向けエージェントは文書案で、後者の8レビューケースは未実行です。実験的拡張と文書案は未採択、独立再現は未成立です。</p><p>全実験は自社管理の合成環境です。模擬決済先へ直接アクセスできる認証情報を持つ主体の迂回は防いでおらず、全経路の観測、独立保管、外部アンカー、OS権限分離、提案全体の適合は確立していません。署名付きACKは、内容の真実性・完全性・現在も保管されていることの証明にはなりません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-07-payment-evidence-research-update/ja/">7件の内容・CI・限界を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-07', 'key': 'GITHUB_UPDATE_20261107', 'id': 'payment-research-20261107', 'title': 'VSO publishes seven VAP payment-evidence research and AI design updates', 'summary': 'VAP #52–#58 cover payment evidence, dispatch recovery, two-person approval and collection, plus school-AI and consumer-agent design notes. First-party CI only; unadopted, independent reproduction not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-07-payment-evidence-research-update/'}], 'ja': [{'date': '2026-11-07', 'key': 'GITHUB_UPDATE_20261107', 'id': 'payment-research-20261107', 'title': 'VSO、決済証拠の研究とAI利用の文書案7件を公開', 'summary': 'VAP #52〜#58の決済証拠・送信回復・二者承認・証拠収集の研究と、学校AI・消費者向けエージェントの文書案を紹介。自社CIの確認であり、未採択・独立再現未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-07-payment-evidence-research-update/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]
PAGE_UPDATED.update({"/":"2026-11-07","/ja/":"2026-11-07","/updates/":"2026-11-07","/ja/updates/":"2026-11-07"})

GITHUB_UPDATE_20261108 = {'en': '<section id="cloud-evidence-20261108" class="status"><h2>VSO reports ten merged cloud-evidence and maintenance updates</h2><p>Ten merged PRs cover cloud-evidence research, interop release preparation, Explorer dependency maintenance, local-settings guards and incident-source records. PR #61 is release preparation and was unpublished at the initial review. A later experimental prerelease at 12:09 JST on 8 November is recorded separately in the linked article. The research is unadopted; independent reproduction is not established. Test and CI records are first-party checks, not independent confirmation.</p><p>All cloud experiments are synthetic and operated by the same party; no live cloud calls were made. They do not prove Azure origin, complete observation, independent custody, latestness, third-party timestamps, power-loss durability or production readiness. A valid older snapshot can remain valid without a separately retained contradictory checkpoint. Verification of custody does not grant permission to publish evidence. First-party CI is not independent reproduction.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-08-cloud-evidence-maintenance-update/">Read the ten updates, CI and limitations</a></p></section>', 'ja': '<section id="cloud-evidence-20261108" class="status"><h2>VSO、クラウド証拠研究と保守のマージ済み10件を報告</h2><p>クラウド証拠研究、相互運用のリリース準備、Explorerの依存関係、開発設定の混入防止、事案の出典整理の計10件を紹介します。PR #61はリリース準備で、初回確認時は未公開でした。その後の11月8日12:09 JSTの実験用プレリリース公開は、リンク先で別記録として説明しています。研究は未採択・独立再現未成立であり、試験とCIは自社確認の記録です。</p><p>クラウド実験は同じ運営者による合成環境で、実際のクラウドへの呼び出しはありません。Azure由来、観測の全量、独立した保管、最新性、第三者の時刻証明、停電時の耐久性、本番適合を証明しません。別に保持したチェックポイントとの矛盾がなければ、正しい古いパックも検証を通り得ます。保管証拠の検証と公開許可は別です。自社CIを独立再現へ読み替えません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-08-cloud-evidence-maintenance-update/ja/">10件の更新・CI・限界を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-08', 'key': 'GITHUB_UPDATE_20261108', 'id': 'cloud-evidence-20261108', 'title': 'VSO reports ten merged cloud-evidence and maintenance updates', 'summary': 'Ten merged PRs cover cloud-evidence research, interop release preparation and maintenance. The demo was unpublished at the initial review; a later experimental prerelease is recorded separately. Unadopted; independent reproduction not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-08-cloud-evidence-maintenance-update/'}], 'ja': [{'date': '2026-11-08', 'key': 'GITHUB_UPDATE_20261108', 'id': 'cloud-evidence-20261108', 'title': 'VSO、クラウド証拠研究と保守のマージ済み10件を報告', 'summary': 'クラウド証拠研究・相互運用のリリース準備・保守・事案記録の計10件。初回確認時の未公開状態と、その後の実験用プレリリース公開を区別。研究は未採択・独立再現未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-08-cloud-evidence-maintenance-update/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]
PAGE_UPDATED.update({"/":"2026-11-08","/ja/":"2026-11-08","/updates/":"2026-11-08","/ja/updates/":"2026-11-08"})

GITHUB_UPDATE_20261112 = {'en': '<section id="signature-source-20261112" class="status"><h2>VSO updates VAP references and research status; signature fix is on main only</h2><p>VAP PR #68 strengthens Ed25519 input rejection in the experimental Python/Node interop demo. The fix is merged into main (35e56ba; included in e00ee5a). It is NOT included in the fixed vap-interop-demo-v0.2.0 ZIP, which remains at cbd4502. No replacement ZIP or new release is announced. Experimental extensions remain unadopted; independent third-party reproduction has not been established.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/">Read source revisions, the main/ZIP distinction and limitations</a></p><div id="main-ci-20261113"><h3>13 November follow-up: 110 image comparisons passed in site main CI</h3><p>Website vcp-site fix merge <code>720852c</code> completed all six workflows and 13 jobs. All 110 image comparisons passed with zero failures and zero raster-noise allowances. Incorrect-CSS rejection and animation checks also passed; comparison criteria were not relaxed. These are first-party CI results for this fixed website revision.</p><p>Experimental extensions remain unadopted; independent third-party reproduction is not established. This is not a new research-implementation test or independent reproduction. Earlier failures, historical test records and the distinction between fixed distributions and main are retained.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/#main-ci-20261113">Read the first-party CI revision, results and limits</a> · <a href="https://github.com/veritaschain/vcp-site/actions/runs/43330507404">CI · 720852c</a></p></div></section>', 'ja': '<section id="signature-source-20261112" class="status"><h2>VSO、VAP本文参照と研究状況を更新 — 署名検証修正はmainのみ</h2><p>VAP PR #68は、実験用のPython／Node相互運用デモでEd25519の不正入力の拒否を強化した修正です。mainへの取り込み済み（35e56ba、e00ee5aにも含まれる）ですが、cbd4502を固定した vap-interop-demo-v0.2.0 のZIPには反映されていません。ZIPの差し替えや新リリースを告知するものではありません。実験的拡張は未採択、第三者による独立再現は未成立です。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/ja/">対象版・mainとZIPの違い・限界を読む</a></p><div id="main-ci-20261113"><h3>11月13日追記：サイトmainの自社CIで画像比較110件が成功</h3><p>サイト用リポジトリ vcp-site の修正マージ版 <code>720852c</code> で、6ワークフロー・13ジョブが成功終了しました。画像比較110件は失敗0件・画素例外使用0件。誤ったCSSの拒否とアニメーション検査も成功し、比較基準は維持しています。これはこの固定したサイト版の自社CI結果です。</p><p>実験的拡張は未採択、第三者による独立再現は未成立です。研究実装の新たな試験や独立再現を示すものではありません。過去の失敗・試験記録、固定配布物とmainの区別を保持します。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/ja/#main-ci-20261113">自社CIの対象版・結果・限界を読む</a> · <a href="https://github.com/veritaschain/vcp-site/actions/runs/43330507404">CI · 720852c</a></p></div></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-12', 'key': 'GITHUB_UPDATE_20261112', 'id': 'signature-source-20261112', 'title': 'VSO updates VAP references and research status; signature fix is on main only', 'summary': '13 Nov: site CI at 720852c passed 110 image comparisons. Signature fix: main only, absent from fixed ZIP. Extensions unadopted; independent reproduction not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/'}], 'ja': [{'date': '2026-11-12', 'key': 'GITHUB_UPDATE_20261112', 'id': 'signature-source-20261112', 'title': 'VSO、VAP本文参照と研究状況を更新 — 署名検証修正はmainのみ', 'summary': '11月13日追記：サイトmain 720852cの自社CIで画像比較110件成功。署名修正はmainのみ・固定ZIP未反映。実験的拡張は未採択・独立再現未成立。過去の試験記録を保持。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]
PAGE_UPDATED.update({'/': '2026-11-12', '/ja/': '2026-11-12', '/updates/': '2026-11-12', '/ja/updates/': '2026-11-12', '/specification/': '2026-11-12', '/ja/specification/': '2026-11-12'})

PAGE_UPDATED.update({'/': '2026-11-13', '/ja/': '2026-11-13', '/updates/': '2026-11-13', '/ja/updates/': '2026-11-13'})

GITHUB_UPDATE_20261113 = {'en': '<section id="registry-release-20261113" class="status"><h2>VSO adds ten source reviews and a fixed-demo known-issue notice</h2><p>Website PR #224 adds ten reviews, bringing the registry to 64 entries: 19 registered and 45 source-verified, pending registration. The ten additions belong to the latter category. They are not ten newly confirmed incidents, and the total does not mean 64 registered cases.</p><p>PR #68 merged the explicit input policy into main. It is absent from the fixed tag, fixed ZIP and original 32-test record. This update changes the public explanation only: the tag, all five assets, checksums and historical execution evidence are retained. No replacement ZIP or new release is announced. Reports must pin the implementation commit.</p><p>Experimental extensions remain unadopted; independent third-party reproduction has not been established. Source checks, synthetic observations and CI described here are first-party work. Merging or passing CI does not establish full normative conformance, adoption, certification or production suitability.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-13-registry-release-known-issue/">Read updates, pinned revisions and limits</a> · <a href="https://github.com/veritaschain/vap-spec/releases/tag/vap-interop-demo-v0.2.0">GitHub release</a></p></section>', 'ja': '<section id="registry-release-20261113" class="status"><h2>VSO、事案・動向レビュー10件と固定版デモの既知問題を追記</h2><p>サイトPR #224でレビュー10件を追加し、一覧は計64件になりました。内訳は登録済み19件、出典確認済み・登録待ち45件です。今回の10件は後者であり、「新たな確定事案10件」や「登録済み64件」を意味しません。</p><p>入力検査の修正はPR #68でmainに取り込み済みですが、固定タグ・固定ZIP・当初の32テストの記録には含まれません。今回変更したのは公開説明のみで、タグ・5つの配布ファイル・チェックサム・過去の実行証拠は維持しています。新しいZIPや代替リリースの公開を意味しません。結果を報告するときは実装コミットを固定してください。</p><p>実験的拡張は未採択、第三者による独立再現は未成立です。今回の出典照合・合成データの観察・CIは自社による確認です。マージやCIの成功は、規範への完全適合、正式採択、認証、本番適合を示しません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-13-registry-release-known-issue/ja/">更新内容・対象版・限界を読む</a> · <a href="https://github.com/veritaschain/vap-spec/releases/tag/vap-interop-demo-v0.2.0">GitHub release</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-13', 'key': 'GITHUB_UPDATE_20261113', 'id': 'registry-release-20261113', 'title': 'VSO adds ten source reviews and a fixed-demo known-issue notice', 'summary': 'Ten source reviews added; the fixed demo now has a known-issue notice. Signature fix: main only, absent from fixed ZIP. Extensions unadopted; independent reproduction not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-13-registry-release-known-issue/'}], 'ja': [{'date': '2026-11-13', 'key': 'GITHUB_UPDATE_20261113', 'id': 'registry-release-20261113', 'title': 'VSO、事案・動向レビュー10件と固定版デモの既知問題を追記', 'summary': '出典レビュー10件を追加し、固定版デモの既知問題を明記。署名修正はmainのみ・固定ZIP未反映。実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-13-registry-release-known-issue/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]

SOURCE_REVIEW_20261114 = {'en': '<section id="snowball-grok-20261114" class="status"><h2>Snowball and Grok Build reports: AI actions, publication permissions and evidence limits</h2><p>A source review of Snowball and Grok Build separates the Cisco correction, researcher estimates and VSO analysis. Extensions remain unadopted; independent reproduction is not established.</p><p>Experimental extensions remain unadopted; independent third-party reproduction has not been established. First-party CI success is distinct from independent fresh execution. This article establishes no VAP/VCP prevention record, full conformance or certification for these cases.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-14-snowball-grok-source-review/">Read corrections, estimates and VSO analysis</a></p></section>', 'ja': '<section id="snowball-grok-20261114" class="status"><h2>Snowball・Grok Buildの報告を検討：AIの操作・公開権限と証拠の境界</h2><p>SnowballとGrok Buildの報告を一次資料で照合。Ciscoの訂正、研究者の推計、VSOの考察を分けて紹介します。実験的拡張は未採択、独立再現は未成立です。</p><p>実験的拡張は未採択、第三者による独立再現は未成立です。自社CIの成功と、独立した環境での新規実行を区別します。本記事は2件に対するVAP/VCPの防御実績・完全適合・認証を示すものではありません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-14-snowball-grok-source-review/ja/">訂正・推計・VSOの考察を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-14', 'key': 'SOURCE_REVIEW_20261114', 'id': 'snowball-grok-20261114', 'title': 'Snowball and Grok Build reports: AI actions, publication permissions and evidence limits', 'summary': 'A source review of Snowball and Grok Build separates the Cisco correction, researcher estimates and VSO analysis. Extensions remain unadopted; independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-14-snowball-grok-source-review/'}], 'ja': [{'date': '2026-11-14', 'key': 'SOURCE_REVIEW_20261114', 'id': 'snowball-grok-20261114', 'title': 'Snowball・Grok Buildの報告を検討：AIの操作・公開権限と証拠の境界', 'summary': 'SnowballとGrok Buildの報告を一次資料で照合。Ciscoの訂正、研究者の推計、VSOの考察を分けて紹介します。実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-14-snowball-grok-source-review/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]

CURSOR_APIFY_EPOCH_20261114 = {'en': '<section id="cursor-apify-epoch-20261114" class="status"><h2>Cursor follow-up, Apify and Epoch AI: secrets, permissions and evaluation boundaries</h2><p>Reviewing three 13 November reports and updates, with Cursor identified as a follow-up. Official reports, participant accounts, press reporting and VSO analysis are separate. Extensions remain unadopted; independent reproduction is not established.</p><p>Experimental extensions remain unadopted; independent third-party reproduction is not established. First-party CI is distinct from independent fresh execution. This article demonstrates no VAP/VCP prevention capability, full conformance or certification.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-14-cursor-apify-epoch-source-review/">Read the source distinctions and VSO analysis</a></p></section>', 'ja': '<section id="cursor-apify-epoch-20261114" class="status"><h2>Cursor続報・Apify・Epoch AI：秘密情報、権限と評価範囲の境界</h2><p>11月13日付の公表・更新3件を照合。Cursorは既報の続報として、公式報告・関係者の説明・報道・VSOの考察を区別します。実験的拡張は未採択、独立再現は未成立です。</p><p>実験的拡張は未採択、第三者による独立再現は未成立です。自社CIの確認と独立した新規実行を区別します。本記事はVAP/VCPによる事故防止・完全適合・認証を実証するものではありません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-14-cursor-apify-epoch-source-review/ja/">出典の区別とVSOの考察を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-14', 'key': 'CURSOR_APIFY_EPOCH_20261114', 'id': 'cursor-apify-epoch-20261114', 'title': 'Cursor follow-up, Apify and Epoch AI: secrets, permissions and evaluation boundaries', 'summary': 'Reviewing three 13 November reports and updates, with Cursor identified as a follow-up. Official reports, participant accounts, press reporting and VSO analysis are separate. Extensions remain unadopted; independent reproduction is not established.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-14-cursor-apify-epoch-source-review/'}], 'ja': [{'date': '2026-11-14', 'key': 'CURSOR_APIFY_EPOCH_20261114', 'id': 'cursor-apify-epoch-20261114', 'title': 'Cursor続報・Apify・Epoch AI：秘密情報、権限と評価範囲の境界', 'summary': '11月13日付の公表・更新3件を照合。Cursorは既報の続報として、公式報告・関係者の説明・報道・VSOの考察を区別します。実験的拡張は未採択、独立再現は未成立です。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-14-cursor-apify-epoch-source-review/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]

VERIFICATION_HARDENING_20261115 = {'en': '<section id="verification-hardening-20261115" class="status"><h2>VSO reports 23 verification, SDK and Explorer improvements</h2><p>Five areas cover configured-key validation, safer inputs and outputs, unresolved verdicts, evidence-review research and the public Explorer. Current main, fixed distributions and first-party CI remain distinct.</p><p>Experimental extensions and proposed repairs remain unadopted; independent third-party reproduction has not been established. First-party CI, separate-language recomputation, saved-evidence rechecks and an independent fresh run are distinct. Merges and synthetic successes do not establish full conformance, production safety or certification.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-15-verification-hardening-explorer-update/">Read changes, revisions and limits</a></p></section>', 'ja': '<section id="verification-hardening-20261115" class="status"><h2>VSO、証拠検証・SDK・Explorerの改善23件を報告</h2><p>弱い信頼鍵の拒否、入力・出力と不明判定の改善、証拠レビュー研究、公開Explorerの更新を5項目で紹介。mainと固定配布物、自社CIと独立再現を区別します。</p><p>実験的拡張・修正案は未採択、第三者による独立再現は未成立です。自社CI、別言語による再計算、保存証拠の再検証、独立した第三者による新規実行を区別します。マージや合成試験の成功は、完全適合・本番安全性・認証を示しません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-15-verification-hardening-explorer-update/ja/">更新内容・対象版・限界を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-15', 'key': 'VERIFICATION_HARDENING_20261115', 'id': 'verification-hardening-20261115', 'title': 'VSO reports 23 verification, SDK and Explorer improvements', 'summary': 'Five areas cover configured-key validation, safer inputs and outputs, unresolved verdicts, evidence-review research and the public Explorer. Current main, fixed distributions and first-party CI remain distinct.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-15-verification-hardening-explorer-update/'}], 'ja': [{'date': '2026-11-15', 'key': 'VERIFICATION_HARDENING_20261115', 'id': 'verification-hardening-20261115', 'title': 'VSO、証拠検証・SDK・Explorerの改善23件を報告', 'summary': '弱い信頼鍵の拒否、入力・出力と不明判定の改善、証拠レビュー研究、公開Explorerの更新を5項目で紹介。mainと固定配布物、自社CIと独立再現を区別します。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-15-verification-hardening-explorer-update/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]

VERASNAP_VERIFY_SDK_20261118 = {'en': '<section id="verasnap-verify-sdk-20261118" class="status"><h2>VeraSnap Verify SDK 0.1.0: open-source server-side checks for CPP capture proofs</h2><p>VeritasChain Co., Ltd. published a Python verifier and device-key enrollment checks for VeraSnap proofs under Apache-2.0, for insurers that receive claim photos. It is a first-party alpha release and has not been independently audited.</p><p>First-party alpha release by the operator of VSO; not independently audited, not a conformance test suite and not a certification. A proof shows when and on which device a capture was recorded; it does not show that the picture is true.</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-18-verasnap-verify-sdk-0-1-0/">Read the release notice, checks and limits</a></p></section>', 'ja': '<section id="verasnap-verify-sdk-20261118" class="status"><h2>VeraSnap Verify SDK 0.1.0を公開 — CPPの撮影証明をサーバー側で検証するオープンソースSDK</h2><p>VeritasChain株式会社は、VeraSnapの撮影証明の検証と端末鍵の登録をサーバー側で行うPythonのSDKを、Apache-2.0で公開しました。保険金請求の写真を受け取る保険会社を主な対象とします。自社によるアルファ版で、第三者の監査は受けていません。</p><p>VSOの運営会社による自社実装のアルファ版です。第三者の監査は受けておらず、適合性テストスイートでも認証でもありません。証明が示すのは撮影の記録であり、写真の内容が真実であることは示しません。</p><p><a href="https://veritaschain.org/vso/announcements/2026-11-18-verasnap-verify-sdk-0-1-0/ja/">公開内容・チェック項目・限界を読む</a></p></section>'}
for _lang, _rows in {'en': [{'date': '2026-11-18', 'key': 'VERASNAP_VERIFY_SDK_20261118', 'id': 'verasnap-verify-sdk-20261118', 'title': 'VeraSnap Verify SDK 0.1.0: open-source server-side checks for CPP capture proofs', 'summary': 'VeritasChain Co., Ltd. published a Python verifier and device-key enrollment checks for VeraSnap proofs under Apache-2.0, for insurers that receive claim photos. It is a first-party alpha release and has not been independently audited.', 'url': 'https://veritaschain.org/vso/announcements/2026-11-18-verasnap-verify-sdk-0-1-0/'}], 'ja': [{'date': '2026-11-18', 'key': 'VERASNAP_VERIFY_SDK_20261118', 'id': 'verasnap-verify-sdk-20261118', 'title': 'VeraSnap Verify SDK 0.1.0を公開 — CPPの撮影証明をサーバー側で検証するオープンソースSDK', 'summary': 'VeritasChain株式会社は、VeraSnapの撮影証明の検証と端末鍵の登録をサーバー側で行うPythonのSDKを、Apache-2.0で公開しました。保険金請求の写真を受け取る保険会社を主な対象とします。自社によるアルファ版で、第三者の監査は受けていません。', 'url': 'https://veritaschain.org/vso/announcements/2026-11-18-verasnap-verify-sdk-0-1-0/ja/'}]}.items():
    NEWS_META[_lang] = _rows + NEWS_META[_lang]

def notice_rows(lang):
    return [dict(r, html=globals()[r['key']][lang], category='research', updated='') for r in NEWS_META[lang]]

def notice_item(r, lang, full=False):
    t=NEWS_TEXT[lang]
    summary=r['summary']
    if len(summary)>180:
        summary=summary[:180].rsplit(' ',1)[0]+'…' if lang=='en' else summary[:180]+'…'
    out=f'<li class="news-row" id="{r["id"]}" data-news-record data-month="{r["date"][:7]}" data-category="research"><div class="news-meta"><time datetime="{r["date"]}">{r["date"]}</time></div><div><h3><a href="{_esc(r["url"])}">{_esc(r["title"])}</a></h3><p class="news-summary">{_esc(summary)}</p>'
    if full:
        # Keep all original notice text/links; disambiguate the archived wrapper ID.
        import re
        raw=re.sub(r'\bid=([\"\'])(.*?)\1',lambda m:'id='+m[1]+'original-'+m[2]+m[1],r['html'])
        out+=f'<details class="archive-record" id="{r["id"]}-record"><summary>{t["original"]}</summary><p class="archive-history-label">{t["label"]}</p><div class="archive-original">{raw}</div></details>'
    return out+'</div></li>'

def latest_notices(lang):
    t=NEWS_TEXT[lang];path='/updates/' if lang=='en' else '/ja/updates/'
    return '<section class="vap-news" id="latest-updates"><div class="news-heading"><h2>'+t['latest']+'</h2><a href="'+path+'">'+t['all']+' →</a></div><aside class="news-status"><p>'+t['status']+'</p></aside><ul class="news-list">'+''.join(notice_item(r,lang) for r in notice_rows(lang)[:3])+'</ul><a class="news-more" href="'+path+'">'+t['all']+' →</a></section>'

def notice_archive_body(lang):
    t=NEWS_TEXT[lang];rows=notice_rows(lang);total=len(rows)
    out='<div class="news-archive vap-news"><div class="archive-hero"><span class="archive-eyebrow">VAP · NEWS ARCHIVE</span><h1>'+t['title']+'</h1><p>'+('VAP research and website update history.' if lang=='en' else 'VAPの研究・サイト更新の記録をまとめています。')+'</p></div><aside class="news-status"><p>'+t['status']+'</p></aside><p class="archive-history-label">'+t['history']+'</p>'
    out+='<form class="archive-controls" hidden><label>'+t['month']+'<select name="month"><option value="">'+t['any']+'</option><option value="2026-11">2026-11</option><option value="2026-10">2026-10</option></select></label><label class="archive-search">'+t['search']+'<input type="search" name="search" autocomplete="off"></label><input type="hidden" name="category" value=""><button type="reset">'+t['reset']+'</button></form>'
    out+=f'<p class="archive-count" id="archive-count" role="status" aria-live="polite" data-template="{t["count"]}">{t["count"].replace("{shown}",str(total)).replace("{total}",str(total))}</p><p class="archive-empty" id="archive-empty" hidden>{t["empty"]}</p>'
    for month in sorted({r['date'][:7] for r in rows},reverse=True):
        out+='<section class="archive-month" id="month-'+month+'"><h2>'+month+'</h2><ul class="news-list">'+''.join(notice_item(r,lang,True) for r in rows if r['date'].startswith(month))+'</ul></section>'
    main='https://veritaschain.org/vso/announcements/'+('ja/' if lang=='ja' else '')
    out+='<p><a href="'+main+'">'+('All VSO announcements' if lang=='en' else 'VSO全体のお知らせを見る')+' →</a></p></div>'
    return out

NOTICE_PAGES = [dict(path='/updates/' if lang=='en' else '/ja/updates/',alt='/ja/updates/' if lang=='en' else '/updates/',title=('VAP announcements archive | VeritasChain Standards Organization (VSO)' if lang=='en' else 'VAP お知らせアーカイブ | VeritasChain Standards Organization（VSO）'),desc=NEWS_TEXT[lang]['desc'],crumb=NEWS_TEXT[lang]['title'],body=notice_archive_body(lang),is_updates=True) for lang in ['en','ja']]

# Only the two homepages and new archive pages use this layout.
# Other published pages retain the historical renderer unchanged.
def practical_guides(lang):
    ja = lang == 'ja'
    suffix = 'ja/' if ja else ''
    heading = 'AIの権限と監査証拠を整理する実務ガイド' if ja else 'Practical guides to AI permissions and audit evidence'
    intro = '予防策、操作の記録、提出証拠の検証を分けて説明します。仕様の規範要件を追加するものではありません。' if ja else 'Separate preventive controls, action records and submitted-evidence verification. These explanatory guides add no normative requirements.'
    items = [('ai-agent-security', 'AIエージェントのセキュリティ・MCP' if ja else 'AI agent security and MCP'), ('ai-audit-trail', 'AI監査ログの記録例・検証チェックリスト' if ja else 'AI audit trail examples and verification checklist'), ('ai-governance', 'AIガバナンス：責任と証拠' if ja else 'AI governance: responsibilities and evidence')]
    links = ''.join('<li><a href="https://veritaschain.org/guides/'+slug+'/'+suffix+'">'+label+'</a></li>' for slug,label in items)
    return '<section aria-labelledby="practical-guides-title"><h2 id="practical-guides-title">'+heading+'</h2><p>'+intro+'</p><ul>'+links+'</ul></section>'


# Informative resource navigation added 14 November 2026; previous notices remain fixed.
RESEARCH_PAGES = [{'path': '/research/', 'alt': '/ja/research/', 'title': 'VAP research resources and verification entry points | VSO', 'desc': 'Choose published GitHub materials by the question you need to examine. Research implementations, specification proposals and fixed distributions have distinct roles.', 'crumb': 'Research resources', 'body': '<section><p class="eyebrow">VAP · RESEARCH RESOURCES</p><h1>Published research resources</h1><p class="lead">Choose evidence verification, mock controls or specification proposals by purpose.</p><div class="status"><p>Experimental extensions remain unadopted; independent third-party reproduction is not established. First-party CI and saved-evidence checks are separate from independent fresh execution.</p></div><div class="grid"><article class="card"><h2><a href="https://veritaschain.org/research/evidence-verification/">Choosing an evidence verifier or reproduction kit</a></h2><p>Select by purpose and environment: reviewing submitted evidence is separate from experimenting with execution controls and OS isolation.</p></article><article class="card"><h2><a href="https://veritaschain.org/research/cloud-credential-evidence/">Cloud credential and operation evidence research</a></h2><p>Synthetic research materials separate signature verification, authentication, operation authority and custody of records.</p></article><article class="card"><h2><a href="https://veritaschain.org/research/payment-authorization-evidence/">Payment API authorization and evidence research</a></h2><p>Mock experiments distinguish valid signatures, exact-request approval, known execution outcomes and retained evidence.</p></article><article class="card"><h2><a href="https://veritaschain.org/research/vcp-integrity/">VCP integrity, numeric representation and migration research</a></h2><p>Navigate known issues, proposed repairs, candidate schemas and synthetic tests without mixing their versions or adoption status.</p></article><article class="card"><h2><a href="https://veritaschain.org/vcp/sdk/">VCP SDK: source, installation and verification limits</a></h2><p>An offline core for Python, TypeScript and MQL5. Check distribution status, the installation snapshot and unsupported claims before evaluating it.</p></article></div><h2>Select the evaluation revision</h2><p>The offline evidence verifier and the Linux/Docker OS-isolation kit are separate. The interop signature-input fix is on main only; existing tags and fixed ZIPs do not contain it. Record the commit, inputs, trust, dependencies and support provided.</p><h2>Document status and historical records</h2><p>OAP, MAP, PAP Track B and DAP/SMP have registry states but unpublished texts. This directory does not invent unpublished specifications or adopt proposals.</p><p><a href="https://veritaschain.org/research/">VSO research directory and sources</a> · <a href="/updates/">Historical notices and test records</a></p><p class="note">Public-source review: 14 November 2026. Documentation navigation, not a new research test run.</p></section>', 'is_research': True}, {'path': '/ja/research/', 'alt': '/research/', 'title': 'VAPの公開研究資料・検証の入口 | VSO', 'desc': 'GitHubの公開資料を、確かめたいことから選ぶための一覧です。研究実装、仕様案、固定配布物を分けて案内します。', 'crumb': '研究資料', 'body': '<section><p class="eyebrow">VAP · RESEARCH RESOURCES</p><h1>公開研究資料</h1><p class="lead">証拠集合の検証、模擬制御、仕様案を目的別に選べる入口です。</p><div class="status"><p>実験的拡張は未採択、第三者による独立再現は未成立です。自社CI・保存証拠の再検証と、独立した新規実行を区別します。</p></div><div class="grid"><article class="card"><h2><a href="https://veritaschain.org/research/evidence-verification/ja/">証拠検証・再現キットの選び方</a></h2><p>提出された証拠を調べる研究用検証器と、実行制御・OS分離の実験を、目的と必要な環境で選び分けます。</p></article><article class="card"><h2><a href="https://veritaschain.org/research/cloud-credential-evidence/ja/">クラウド資格情報と操作証拠の研究</a></h2><p>署名の正しさ、本人認証、操作の許可、記録の保全を分けて検討する、合成データによる研究資料です。</p></article><article class="card"><h2><a href="https://veritaschain.org/research/payment-authorization-evidence/ja/">決済APIの承認・実行・証拠保全の研究</a></h2><p>「署名が正しい」「承認されている」「結果が分かる」「証拠が残っている」を分けて調べる、模擬環境の研究です。</p></article><article class="card"><h2><a href="https://veritaschain.org/research/vcp-integrity/ja/">VCPの整合性・数値表現・移行研究</a></h2><p>現行仕様の既知問題、修正案、候補スキーマと合成試験を、適用状態と対象版を保ったまま参照できます。</p></article><article class="card"><h2><a href="https://veritaschain.org/vcp/sdk/ja/">VCP SDK：公開ソース・導入と検証の範囲</a></h2><p>Python・TypeScript・MQL5のオフライン中核ライブラリ。配布状態、固定した導入版、検証できない事項を先に確認できます。</p></article></div><h2>評価する版を選ぶ</h2><p>オフラインの証拠検証と、Linux・Dockerを要するOS実験キットは別です。相互運用デモの署名検証修正はmainのみで、既存タグ・固定ZIPには未反映です。対象コミット、入力、信頼設定、依存関係、支援内容を記録してください。</p><h2>資料の状態と過去の記録</h2><p>OAP・MAP・PAP（Track B）とDAP・SMPは、登録表に状態があっても本文は未公開です。この案内で未公開仕様を補作したり、採択を宣言したりしません。</p><p><a href="https://veritaschain.org/research/ja/">VSOの研究資料一覧と出典</a> · <a href="/ja/updates/">過去のお知らせ・試験記録</a></p><p class="note">公開資料確認：2026年11月14日。文書の案内であり、新規の研究試験実行ではありません。</p></section>', 'is_research': True}]
for _rp in RESEARCH_PAGES:
    CONTENT_CORRECTION_UPDATED[_rp["path"]] = "2026-11-14"
for _rp in ["/", "/ja/", "/code/", "/ja/code/"]:
    CONTENT_CORRECTION_UPDATED[_rp] = "2026-11-14"

def research_entry(lang):
    ja = lang == "ja"
    path = "/ja/research/" if ja else "/research/"
    return "<section class=\"status\"><h2>" + ("公開研究・検証の入口" if ja else "Published research and verification") + "</h2><p>" + ("証拠検証・クラウド資格情報・決済承認・VCP整合性研究・SDKを用途別に探せます。実験的拡張は未採択、独立再現は未成立です。" if ja else "Find evidence verification, cloud credentials, payment authorization, VCP integrity research and SDK resources. Extensions remain unadopted; independent reproduction is not established.") + "</p><p><a href=\"" + path + "\">" + ("研究資料一覧を開く" if ja else "Browse research resources") + " →</a></p></section>"

def render(pg, lang):
    if pg['path'] in ['/code/', '/ja/code/']:
        pg = dict(pg, body=pg['body']+research_entry(lang))
    if not (pg.get('is_home') or pg.get('is_updates')):
        return render_legacy(pg,lang)
    import re
    body=pg['body'];legacy={}
    if pg.get('is_home'):
        end=body.index('</section>')+len('</section>')
        body=body[:end]+latest_notices(lang)+research_entry(lang)+practical_guides(lang)+body[end:]
        path='/updates/' if lang=='en' else '/ja/updates/'
        legacy={r['id']:path+'#'+r['id'] for r in notice_rows(lang)[3:]}
        body+=''.join('<span class="news-legacy-anchor" aria-hidden="true" id="'+i+'"></span>' for i in legacy)
    header=nav_html(pg,lang)
    path='/updates/' if lang=='en' else '/ja/updates/'
    label='News' if lang=='en' else 'お知らせ'
    styles='<link rel="stylesheet" href="https://veritaschain.org/assets/css/news-archive.css"><style>.vap-news a,.vap-news .archive-eyebrow{color:var(--brand-ink)}.vap-news .news-row{border-color:var(--line)}.vap-news .news-heading h2{margin:0}.vap-news{margin:2.5rem 0}.vap-news .news-row h3{margin:0 0 7px}.vap-news .news-meta time{white-space:nowrap}.vap-news .archive-original .status{margin:0!important}.hero{margin-bottom:2rem}@media(max-width:640px){.vap-news .news-row{scroll-margin-top:12rem}}</style>'
    return f'<!doctype html>\n<html lang="{lang}"><head>{head(pg,lang)}{styles}<script src="https://veritaschain.org/assets/js/news-archive.js" defer></script></head><body><a class="skip" href="#main">'+('Skip to content' if lang=='en' else '本文へ移動')+f'</a>{header}<main id="main"><div class="wrap">{crumbs_html(pg,lang)}{body}</div></main>{footer_html(lang)}'+('<script id="news-legacy-map" type="application/json">'+json.dumps(legacy)+'</script>' if legacy else '')+REVEAL_JS+'</body></html>\n'

def write(rel, text):
    p = ROOT / rel.lstrip("/")
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")
    print(f"  {rel}")

def build_pages():
    all_pages = [(p, "en") for p in PAGES_EN] + [(p, "ja") for p in PAGES_JA] + list(zip(NOTICE_PAGES, ["en", "ja"])) + list(zip(RESEARCH_PAGES, ["en", "ja"]))
    for pg, lang in all_pages:
        write(pg["path"].rstrip("/") + "/index.html" if pg["path"] != "/" else "index.html",
              render(pg, lang))
    return all_pages

def build_sitemap(all_pages):
    seen, rows = set(), []
    for pg, lang in all_pages:
        if pg["path"] in seen: continue
        seen.add(pg["path"])
        en = pg["path"] if lang == "en" else pg["alt"]
        ja = pg["alt"] if lang == "en" else pg["path"]
        rows.append(f"""  <url>
    <loc>{SITE}{pg['path']}</loc>
    <lastmod>{max(TODAY, WORDING_UPDATED, EXPLORER_UPDATED if pg["path"] in EXPLORER_PATHS else "", PAGE_UPDATED.get(pg["path"], ""), CONTENT_CORRECTION_UPDATED.get(pg["path"], ""))}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="{SITE}{en}"/>
    <xhtml:link rel="alternate" hreflang="ja" href="{SITE}{ja}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="{SITE}{en}"/>
  </url>""")
    write("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n'
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
          'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(rows) + "\n</urlset>\n")

def build_feed():
    from content_ja import POST_JA_TITLE, POST_JA_DESC
    from posts_en import CASE_POSTS
    from posts_ja import CASE_POSTS_JA
    items = []
    for p in CASE_POSTS:
        items.append((p["title"], f"/blog/{p['slug']}/", p["date"], p["desc"], None))
    for p, pe in zip(CASE_POSTS_JA, CASE_POSTS):
        items.append((p["title"], f"/ja/blog/{pe['slug']}/", p["date"], p["desc"], "ja"))
    items.append((POST["title"], f"/blog/{POST['slug']}/", POST["date"], POST["desc"], None))
    items.append((POST_JA_TITLE, f"/ja/blog/{POST['slug']}/", POST["date"], POST_JA_DESC, "ja"))
    entries = ""
    for title, path, date, desc, lang in items:
        xl = ' xml:lang="ja"' if lang == "ja" else ""
        entries += f"""
  <entry{xl}>
    <title>{title}</title>
    <link href="{SITE}{path}"/>
    <id>{SITE}{path}</id>
    <published>{date}T00:00:00+09:00</published>
    <updated>{max(date, WORDING_UPDATED)}T00:00:00+09:00</updated>
    <summary>{desc}</summary>
  </entry>"""
    latest = max(WORDING_UPDATED, max(i[2] for i in items))
    write("feed.xml", f"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <title>VAP Blog — Verifiable AI Provenance Framework</title>
  <link href="{SITE}/blog/"/><link rel="self" href="{SITE}/feed.xml"/>
  <id>{SITE}/</id>
  <updated>{latest}T00:00:00+09:00</updated>
  <author><name>VeritasChain Standards Organization</name></author>{entries}
</feed>
""")

def build_misc():
    write("robots.txt", f"""User-agent: *
Allow: /
Disallow: /tools/

Sitemap: {SITE}/sitemap.xml
""")
    write("CNAME", "vap.veritaschain.org\n")
    write(".nojekyll", "")
    write("llms.txt", f"""# Verifiable AI Provenance Framework (VAP)

> VAP is an open meta-framework (never a protocol) by the VeritasChain Standards
> Organization (VSO) for making AI processing records tamper-evident,
> completeness-checkable, and attributable after the fact. It is post-hoc
> evidentiary infrastructure: it does not prevent, block, or monitor anything at
> runtime, and per §1.6 it does not warrant the correctness, fairness, or safety
> of the underlying AI decisions — only the integrity, completeness (at anchor
> granularity), and attributability of their records.
> Status (VSO published disclosure, 25 October 2026): zero external implementations, commercial figures withdrawn pending verification (24 October 2026; not a zero-count finding), zero Evidence Packs accepted in any proceeding.

## Docs
- [Specification summary](https://vap.veritaschain.org/specification/): VAP v1.2 invariants (INT-006..009), three-tier missing-data taxonomy, Evidence Pack
- [Domain profiles](https://vap.veritaschain.org/profiles/): VCP v1.2 Released (the only Protocol), CAP v1.0, CPP v1.4, MAP, OAP, PAP; capabilities DAP (VAP-AGENT), SMP (VAP-SLEEP)
- [Code examples](https://vap.veritaschain.org/code/): hash-chained events, Ed25519, Merkle proofs, RFC 3161 anchoring
- [FAQ](https://vap.veritaschain.org/faq/)
- [Blog](https://vap.veritaschain.org/blog/)
- [日本語](https://vap.veritaschain.org/ja/)

## Related proposed profile
- [VAP-LAP — Legal AI Profile](https://veritaschain.org/vap/lap/): proposed legal AI provenance profile; [日本語](https://veritaschain.org/vap/lap/ja/) / [中文](https://veritaschain.org/vap/lap/zh/)
- [Internet-Draft -05](https://datatracker.ietf.org/doc/draft-ailex-vap-legal-ai-provenance/05/): individual proposal, profile v0.6.0, published 26 October 2026; not registered under VAP §4.5.2
- [AILEX product and use-case reference](https://veritaschain.org/vap/lap/#ailex): an introduction to legal AI workflows, not a claim of implementation conformance

## Source
- [GitHub](https://github.com/veritaschain): specifications (CC BY 4.0) and reference code
- [IETF drafts](https://datatracker.ietf.org/): draft-kamimura-vap-framework, draft-kamimura-scitt-vcp, draft-kamimura-scitt-refusal-events, draft-kamimura-rats-behavioral-evidence, draft-vso-cpp-core

Status correction (24 October 2026): commercial figures are withdrawn pending verification; this is not a zero-count finding. https://github.com/veritaschain/vap-spec/blob/main/disclosures/2026-10-24-commercial-contracts.md
VCP integrity alignment remains under review. Experimental extensions are unadopted; independent reproduction is unestablished.

GitHub update (26 October 2026): VCP candidate schema/synthetic checker (PR #16) and VAP three-valued proposal (PR #26) are research, not adopted normative repairs. The first-party vcp-sdk v0.1.0 offline core is a GitHub pre-release, not a PyPI/npm release, an implementation of vcp-sdk-spec or independent third-party implementation.
- Research update and limits: https://veritaschain.org/vso/announcements/2026-10-26-vcp-research-update/
- Current disclosure (25 October 2026, self-reported): https://github.com/veritaschain/vap-spec/blob/81fa81e01ef9418c3fb7a02ddfc7fd72d993b6b1/README.md#implementation-status-mandatory-disclosure
Earlier dated articles retain their historical body text; current status is given by the dated notice and disclosure.

RTA checkpoint (26 October 2026): target cc695fe; recorded first-party checks are 809 regression and 15 separate historical tests per environment. Historical evidence verdict remains INDETERMINATE. Supplemental verification is an unadopted implementation extension; independent reproduction is not established. CI artifacts have 30-day retention; this is not a new release or replacement for earlier VAP kits or K3.
PR #16 adds a separate first-party end-to-end recipe workflow. CI 40263948191 succeeded in both Python jobs from a fresh clone through final assessment, without changing the checkpoint or establishing independence.
- RTA update: https://veritaschain.org/vso/announcements/2026-10-26-rta-verifier-checkpoint/
- Pinned instructions: https://github.com/veritaschain/vcp-rta-reference/blob/a839d7a918c9a23ce170937f536e6c13b3a69b93/docs/REPRODUCTION_CHECKPOINT_2026-10-26.md

26 October follow-up: six selected original JSON records from first-party PR #16 CI are copied byte-for-byte into Git (PR #17), not the full CI artifacts or a new run. Full JUnit XML, detailed replay and shell logs are not included. This is not immutable or permanent storage. PR #18 separates RTA and VAP OS-gate review targets, report receipt, technical agreement, independence and publication permissions. GitHub issues are public. Experimental extensions remain unadopted; independent reproduction is not established.
- Selected CI originals: https://github.com/veritaschain/vcp-rta-reference/blob/ec424de00f7c4b59506f173eca000f8faaacf71a/docs/reproduction-results/2026-10-26-pr16/README.md
- Review intake: https://github.com/veritaschain/vcp-rta-reference/blob/ec424de00f7c4b59506f173eca000f8faaacf71a/docs/EXTERNAL_REVIEW_INTAKE.md



27 October Explorer checkpoint: the separate API passed 159 first-party CI tests (zero failures, cancellations, skips or TODOs), including search-filter and exact nanosecond time-range fixes. The GUI's separate suite passed 26 tests. The public GUI now checks inclusion against a supplied root and explicit tree size; it remains an API-disconnected, unsigned/unanchored 12-leaf synthetic demo, not event-content, signature or external-anchor verification. The supplied root and size are not authenticated. First-party public-page checks exercised 12 demo inclusion controls, seven notice widths and mobile controls; these are not additional API tests or independent reproduction. VAP's historical code examples and RTA fixed target are separate and unchanged. VAP remains Draft 3; experimental extensions and proposed repairs remain unadopted; independent reproduction is not established.
- Explorer update and limits: https://veritaschain.org/vso/announcements/2026-10-26-report-intake-explorer-update/#explorer-update-20261027
- Public synthetic Explorer: https://veritaschain.org/explorer/app/
- API first-party CI (159): https://github.com/veritaschain/vcp-explorer-api/actions/runs/40355875498
- GUI first-party CI (26): https://github.com/veritaschain/vcp-explorer-gui/actions/runs/40360033313
- Public-page first-party checks: https://github.com/veritaschain/vcp-site/actions/runs/40427147021

Current normative requirements, existing implementations, signed data, fixed distributions and K3 remain unchanged.

28 October GitHub update: VAP-LAP remains a related proposal outside the VAP registry. VAP v1.2.0 Draft 3 includes informative errata dated 25 and 27 October; current text SHA-256: 429ae7765438625adfb5ba66c380b4c2108de3c1be78e376422f25348346e415. The 24 October hash is retained as a historical reference. Specification GA does not mean Production Ready or formal adoption. VCP full conformance remains unestablished.
- Current pinned VAP text: https://github.com/veritaschain/vap-spec/blob/357b8e6b232750180a2a0ce185355e31880edaf6/spec/v1.2/VAP_Framework_Specification.md
SDK PR #2 adds documentation, 13 shared synthetic boundary cases and 15 focused tests per language; runtime code, API and version are unchanged. First-party CI 40529498586 passed 306 Python tests and 140 TypeScript tests plus cross-language checks in each of its Python 3.10 and 3.13 jobs. These overlapping cases/matrix jobs are not summed. Numeric, signature-byte and AnchorRecord binding interpretation limits remain; first-party results are not independent reproduction. Experimental extensions remain unadopted; independent reproduction is not established.
- SDK first-party CI: https://github.com/veritaschain/vcp-sdk/actions/runs/40529498586
- Dated update: https://veritaschain.org/vso/announcements/2026-10-28-vap-lap-sdk-status-update/

29 October 2026 follow-up: SDK input/proof checks at c2bc767 and first-party public-API/parity CI succeeded. The public Explorer now has a separate API-connected SDK Evidence Demo with signed synthetic events (deployed SDK 70240a4, not c2bc767). Intact local checks are VALID but full evidence remains INDETERMINATE; external anchors are not verified. The API-disconnected, unsigned 12-leaf description in the historical 27 October record refers to the legacy dashboard only. Historical 159/26 and 306/140 counts are preserved, not combined. Evidect provides a fixed 22-stage synthetic exercise and a reproduction guide; eight first-party Chromium width/JavaScript checks passed after deployment. These are not independent reproduction, full conformance or production-control verification. Experimental extensions remain unadopted; independent reproduction is not established.
- Latest dated update: https://veritaschain.org/vso/announcements/2026-10-29-sdk-evidence-demo-reproduction-update/

30 October 2026 follow-up: VAP PR 30 is an unadopted informative incident-evidence binding proposal. PR 31 adds an offline assessor (20 test methods and 23/23 expected scenario results); PR 32 adds a controlled loopback upload pilot (39 methods with no skips, 17/17 cases and 17/17 exported-evidence rechecks). Upload case UL-14 deliberately demonstrates a successful bypass outside the gate; this is not OS isolation or production bypass prevention. Evidect PR 20 adds a synthetic authorization gate (37 tests and 18 scenarios); PR 21 adds optional SQLite replay reservations (33 added tests, 70 gate-specific tests, four real-process scenarios). These are separate first-party CI records, not independent reproduction. Extensions remain unadopted; independent reproduction is not established. Existing normative text, implementations, signed data, fixed distributions, K3 and historical test records are unchanged.
- 30 October research update: https://veritaschain.org/vso/announcements/2026-10-30-incident-evidence-authorization-research-update/

30 October 2026 evening follow-up (checked 18:25 JST): VAP PRs 33-38 add local publication/disclosure/reviewer bindings (45 methods, 18 scenarios, 18 export rechecks), scoped local erasure (54 methods, 18 scenarios, 18 export rechecks), preservation of 53 original cases and an offline recheck kit (29 methods, 53 case rechecks), bilingual source-attributed reports (37 methods, 53 case rechecks), a documentary mapping of 23 requirements, and a separate-process collector outage/recovery pilot (41 tests, 18 scenarios, 18 export rechecks). These are separate first-party checks, not one total. Rechecking saved evidence is not fresh execution; automated reporting is not human review. VCP Conformance Guide PRs 3 and 4 distinguish illustrative SDK names from the actual prerelease offline core and historical certification text from the current VSO role (VSO itself does not review submissions or issue certifications). Proposals and experimental extensions remain unadopted; independent third-party reproduction is not established. Historical records, normative text, fixed distributions and K3 remain unchanged.
- 30 October evening follow-up: https://veritaschain.org/vso/announcements/2026-10-30-evidence-preservation-collector-review-update/

31 October 2026 research follow-up (checked 23:28 JST): Evidect PR 27 adds post-approval context checks and child-process observations (37 existing tests, 43 new tests, 8 synthetic cases per OS). Same-host/same-UID process separation is not independent authority; injected contradictions are not proof of an external action by a denied agent. VAP PRs 39-41 distinguish retention deadlines from deletion evidence (PR40: 42 new methods, 16 scenarios and 16 saved rechecks per Python version); Evidect PRs 22-26 add intake, follow-up and scoped review decisions (PR26: 72 tests, 4 intake, 4 follow-up and 12 workflow cases plus their saved rechecks per Python version). A reached deadline or CLOSED_REVIEW does not establish deletion success. VAP PR1 adds vap-interop-demo/0.2.0 (32 unittest methods; 2 positive and 6 negative vectors checked by Python/Node CLIs). These are separate first-party CI records, not one combined total. Proposals and extensions remain unadopted; independent reproduction is not established. Existing dated records and fixed distributions are preserved.
- 31 October research follow-up: https://veritaschain.org/vso/announcements/2026-10-31-retention-runtime-interop-research-update/

1 November 2026 follow-up (checked 09:48 JST): Evidect PR28 adds verification of original runtime-report bytes against an existing signed observation handoff and receiver-selected trust/checkpoint. It recomputes eight saved observation summaries; it does not rerun original operations or reverify original request/approval/context signatures and historical authorization. PR28 adds 27 regression tests. At merged PR29 commit 2bebc7c7582fa91a08c77fd381976034f47d6aab, first-party Ubuntu/macOS CI passed 137 tests (37 + 43 + 30 existing, plus 27 new) and eight synthetic cases per OS. Narrow local VALID is not safety PASS; overall remains INDETERMINATE unless invalid. PR29 is an attributed incident review only; three future tests remain unimplemented and untested. Demo checkpoint expires after one hour; CI artifacts last 14 days. Experimental extensions remain unadopted; independent reproduction is not established. Historical records and fixed distributions are preserved.
- 1 November runtime handoff and incident review: https://veritaschain.org/vso/announcements/2026-11-01-runtime-handoff-incident-review/

2 November 2026 follow-up: Evidect PR30–PR34 were merged on 1 November. Synthetic service-permission/route rechecks, saved ten-case report verification, checkpoint evaluation time and identity, opt-in receiver SQLite generations and local key revocations, and challenge-bound witness checks were added. At merged eeeacf7effc8103276106dcf606b2bafb7349081, first-party Ubuntu 24.04/macOS 15 CI logs each record 306 successful tests: 44 new witness tests (32 contract + 12 integration), plus 262 existing tests. Do not add counts across OSes or historical versions. Separate stores, processes and keys do not establish independent administration. Receiver-only rollback can be detected under the stated assumptions; both-store rollback can regain local consistency while overall remains INDETERMINATE. Original authorization and service-permission evidence is not reverified by saved-report checks. Experimental extensions remain unadopted; independent reproduction is not established. The earlier PR28/29 137-test record and fixed distributions are unchanged. PR35 is an unmerged alternative, not the source of these main results.
- 2 November service permission and receiver-state update: https://veritaschain.org/vso/announcements/2026-11-02-service-permission-receiver-state/

5 November 2026 research update: https://veritaschain.org/vso/announcements/2026-11-05-vap-research-sdk-reproduction/ — merged VAP control-state and wallet-evidence experiments, SDK fixes and external reproduction notes. First-party CI is not independent reproduction. Experimental extensions remain unadopted; independent reproduction is not established. Package 0.1.0 remains a pre-release; development snapshots are identified by commit, not a new registry release. Historical records, fixed distributions, VAP specification references and K3 are unchanged.

12 November 2026 current VAP v1.2.0 Draft 3 reference: https://github.com/veritaschain/vap-spec/blob/e00ee5a26087ec91f2dbd7994498b2e800373d39/spec/v1.2/VAP_Framework_Specification.md ; SHA-256 a35d5e082fd4b2f9921a78b1a71df263018320375e09fa18cf81533a18a19998. Interop signature correction PR68 is on main only and is NOT in the fixed vap-interop-demo-v0.2.0 ZIP at cbd4502. Experimental extensions remain unadopted; independent third-party reproduction is not established. First-party CI is distinct from independent execution. Details: https://veritaschain.org/vso/announcements/2026-11-12-vap-signature-source-update/

Historical 3 November 2026 website follow-up: 23 merged corrections across 23 repositories are recorded at https://veritaschain.org/vso/announcements/2026-11-03-verification-status-explorer-corrections/. VAP source at that date: https://github.com/veritaschain/vap-spec/blob/5ed1084a7647ca10f5a1f98e77346f4b6029ce09/spec/v1.2/VAP_Framework_Specification.md ; SHA-256 4eef5270fbd08bc1ffbae8f08d8bcb41a7f961a70b4a8e4edb75d6f2af280583. PR45 adds an inline withdrawal marker to historical G-2; requirements unchanged, no replacement contract count. Public Explorer GUI source f18c079 includes bounded hash-link inspection and no fallback for unknown IDs. Local hash equality does not verify signatures, trusted anchors or completeness. First-party CI/local tests and website checks are not independent reproduction. Experimental extensions remain unadopted; independent reproduction is not established. Historical test records, fixed distributions and K3 are unchanged.
- Signed evidence demo: https://veritaschain.org/explorer/app/#/evidence-demo
- Evidect reproduction guide: https://evidect.veritaschain.org/methodology/#reproduce


""")
    err = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>404 — VAP</title>
<meta name="robots" content="noindex"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<style>%s</style></head><body><main style="padding:14vh 0"><div class="wrap">
<p class="eyebrow">404</p><h1>This record does not exist<span class="thin"> / この記録は存在しません</span></h1>
<p class="lead">Which is, on this site, a meaningful state. Nothing was anchored at this URL.</p>
<div class="chain-div" aria-hidden="true"><svg viewBox="0 0 200 18" xmlns="http://www.w3.org/2000/svg"><g stroke="#3A3A44" stroke-width="1.5"><rect x="30" y="4" width="24" height="10" rx="2" fill="#1B1B21"/><rect x="88" y="4" width="24" height="10" rx="2" fill="none" stroke-dasharray="4 4"/><rect x="146" y="4" width="24" height="10" rx="2" fill="#1B1B21"/><line x1="54" y1="9" x2="88" y2="9"/><line class="march" x1="112" y1="9" x2="146" y2="9" stroke-dasharray="4 5"/><circle class="dpulse" cx="0" cy="9" r="2.5" fill="#FA5A6E"/></g></svg></div>
<p class="cta"><a class="btn" href="/">Overview (EN)</a> <a class="btn ghost" href="/ja/">概要（日本語）</a></p>
</div></main></body></html>""" % CSS
    write("404.html", err)
    (ROOT / "css").mkdir(exist_ok=True)
    write("css/style.css", CSS)
    write("assets/favicon.svg", FAVICON_SVG)

    llms_path = ROOT / 'llms.txt'
    llms_path.write_text(llms_path.read_text() + '\n## Announcement archives\n- [VAP update history](https://vap.veritaschain.org/updates/)\n- [VAP お知らせアーカイブ](https://vap.veritaschain.org/ja/updates/)\n- [VSO announcements](https://veritaschain.org/vso/announcements/)\n')

def build_og():
    from PIL import Image, ImageDraw, ImageFont
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), "#131316")
    d = ImageDraw.Draw(img)
    def font(sz, bold=True):
        path = f"/usr/share/fonts/truetype/dejavu/DejaVuSans{'-Bold' if bold else ''}.ttf"
        return ImageFont.truetype(path, sz)
    # chain of blocks, one hollow
    y, bh, bw, gap, x = 120, 96, 150, 66, 90
    red = "#C8102E"
    for i in range(5):
        x0 = x + i * (bw + gap)
        if i == 2:  # hollow dashed block
            seg, on = 16, True
            # dashed rect
            def dline(a, b):
                import math
                ax, ay = a; bx, by = b
                L = math.hypot(bx-ax, by-ay); n = int(L // seg)
                for k in range(0, n, 2):
                    t0, t1 = k/n, min((k+1)/n, 1)
                    d.line([(ax+(bx-ax)*t0, ay+(by-ay)*t0),
                            (ax+(bx-ax)*t1, ay+(by-ay)*t1)], fill=red, width=6)
            dline((x0, y), (x0+bw, y)); dline((x0+bw, y), (x0+bw, y+bh))
            dline((x0+bw, y+bh), (x0, y+bh)); dline((x0, y+bh), (x0, y))
        else:
            d.rounded_rectangle([x0, y, x0+bw, y+bh], radius=12,
                                fill="#1E1E24", outline=red, width=6)
        if i < 4:
            ly = y + bh//2
            if i in (1, 2):
                for k in range(x0+bw, x0+bw+gap, 18):
                    d.line([(k, ly), (min(k+9, x0+bw+gap), ly)], fill=red, width=6)
            else:
                d.line([(x0+bw, ly), (x0+bw+gap, ly)], fill=red, width=6)
    d.text((90, 300), "VAP", font=font(128), fill="#FFFFFF")
    d.text((90, 452), "Verifiable AI Provenance Framework", font=font(52), fill="#C9C9D0")
    d.text((90, 530), "tamper-evident · completeness-checkable · attributable — after the fact",
           font=font(30, bold=False), fill="#9A9AA3")
    d.text((900, 560), "vap.veritaschain.org", font=font(26, bold=False), fill="#FA5A6E")
    (ROOT / "assets").mkdir(exist_ok=True)
    img.save(ROOT / "assets" / "og-image.png", optimize=True)
    img.resize((360, 189)).save(ROOT / "assets" / "og-thumb.png", optimize=True)
    print("  /assets/og-image.png")

if __name__ == "__main__":
    print("Building vap.veritaschain.org →", ROOT)
    pages = build_pages()
    build_sitemap(pages)
    build_feed()
    build_misc()
    build_og()
    print(f"Done. {len(pages)} pages.")
