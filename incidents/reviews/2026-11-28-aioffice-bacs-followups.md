# EU AI Office requests and Swiss AI-agent attacks: follow-up review, and other European government statements — source review

- Review date / 確認日: **2026-11-28 (Asia/Tokyo)**
- Scope / 対象: **A 28 November monitoring brief that repeated V1125AIOFFICE and V1124BACS, and statements by other European government bodies on AI-agent attacks published from 23 to 27 November 2026**
- Record decision / 登録判断: **DO-NOT-PUBLISH-AS-NEW** for both follow-ups (records unchanged); **new record V1123CSIRTITA** for CSIRT Italia's bulletin; the Dutch NCSC report is **not recorded** as an incident

## English

### Follow-ups on records already listed

**V1125AIOFFICE (European Commission requests to OpenAI and Anthropic).** VSO found no Commission statement after the midday briefing of 25 November 2026 ([I-298550](https://audiovisual.ec.europa.eu/en/media/video/I-298550)), no announced procedure, no published incident count and no statement by either company. The article the brief cited ([ppc.land, 26 November](https://ppc.land/eu-needed-2-requests-to-get-ai-incident-answers-from-openai-and-anthropic/)) is a secondary account of that briefing. Its legal commentary on Articles 91 and 101 is the publication's own; the Commission cited no article. The record is unchanged. Disclosure: this review was prepared with Claude, a model made by Anthropic, one of the two companies the Commission asked.

**V1124BACS (Switzerland).** BACS's statements in English and German still carry the date 24 November and give no figures. A Keystone-SDA report published by [swissinfo.ch](https://www.swissinfo.ch/ger/erste-cyberangriffe-auf-kritische-infrastruktur-mit-ki-agenten/92439882) on 26 November adds that three of the attacks concerned critical infrastructure and that the attacks succeeded in two cases. It does not say in so many words whether the two are among the three. SRF's article, the record's source for the director's figures, gives four successful cases out of five and no breakdown. The record is unchanged. If BACS or its director confirms the breakdown, add a `later` entry. Ochsner Sport and Planzer disclosed cyberattacks on 25 and 26 November. VSO found no statement by either company or by BACS linking them to AI agents, and does not treat them as part of this record.

**What the brief got wrong.** It applied NIS2 and the EU AI Act to the Swiss case; neither applies in Switzerland, where reporting duties for critical-infrastructure operators come from the Information Security Act. It also said VAP would have made the Commission's second request unnecessary and given "immediate forensics" of the Swiss intrusions. Both statements are counterfactual, and VAP has no detection or intervention function (§4.4.4). The Commission's questions were about counting and classifying incidents, which the integrity of a record does not answer.

### Other government statements reviewed

**CSIRT Italia, bulletin BL01/261123/CSIRT-ITA (23 November).** Recorded as **V1123CSIRTITA**. The national CSIRT reports mass compromise campaigns in Italy by AI-orchestrated agents and names the tools used. The bulletin gives no victims, sectors, dates or attacker.

**Dutch NCSC (27 November).** The [news item](https://www.ncsc.nl/nieuws/ai-gestuurde-frameworks-versnellen-en-vergroten-digitale-aanvallen) and the accompanying CTI report say AI-driven frameworks were seen in attacks on DIVD, European institutions, South Korea's financial sector, webshops and telecom providers, and the page description says incidents at DIVD, in South Korea and in Japan share ARTEX. NCSC lab tests put a simple defacement at about one minute and under €0.20, and remote code execution on a vulnerable GitLab CE version at about 35 minutes and €2. The report gives no new victim, date or count. DIVD's attack was reported in September 2026. South Korea's financial-sector case is V1013, and "European institutions" may overlap V1119EUCOMMISSION. The report is a threat assessment rather than an incident report, and it is not recorded as an incident. The DIVD attack itself is a candidate for a separate review against DIVD's own statements, which VSO did not retrieve here.

**Germany's BSI (26 November) and the UK NCSC (24 November).** Secondary reporting describes a BSI confirmation, through AISI Germany, of what agentic offensive frameworks can do, and a UK NCSC blog post on a rise in AI-assisted attacks. Neither is reported to give a domestic incident count. VSO did not retrieve either page directly for this review, and neither is recorded.

Historical `excluded_counts` are not changed.

## 日本語

### 掲載済みの記録の続報

**V1125AIOFFICE（欧州委員会からOpenAI・Anthropicへの請求）。** 2026年11月25日の定例記者会見（[I-298550](https://audiovisual.ec.europa.eu/en/media/video/I-298550)）より後の委員会の発表、手続の開始、インシデント件数の公表、両社の声明は、いずれもVSOは見つけていません。ブリーフが挙げた[ppc.land（11月26日）](https://ppc.land/eu-needed-2-requests-to-get-ai-incident-answers-from-openai-and-anthropic/)は、この会見を伝える二次の記事です。第91条・第101条についての法的な解説は同サイト独自のもので、委員会は根拠条文を示していません。記録は変更しません。開示：この確認メモは、委員会が請求した2社の1社であるAnthropicのモデル、Claudeを使って作成しました。

**V1124BACS（スイス）。** BACSの英語版・ドイツ語版の声明は、11月24日付のまま数字を含んでいません。[swissinfo.ch](https://www.swissinfo.ch/ger/erste-cyberangriffe-auf-kritische-infrastruktur-mit-ki-agenten/92439882)が11月26日に掲載したKeystone-SDAの記事は、攻撃のうち3件が重要インフラに関わり、2件で攻撃が成功したと伝えています。この2件が3件の内数かどうかは明示していません。局長の数字について記録が出典としているSRFの記事は、5件中4件で成功とするだけで内訳はありません。記録は変更しません。BACSか局長が内訳を確認した場合に`later`を追加します。Ochsner SportとPlanzerは11月25〜26日にサイバー攻撃の被害を公表しましたが、両社またはBACSがAIエージェントとの関係を述べた発表は、VSOは見つけていません。この記録の一部としては扱いません。

**ブリーフの誤り。** スイスの事案にNIS2とEU AI法を当てはめていましたが、どちらもスイスには適用されません。重要インフラ事業者の報告義務は情報セキュリティ法によるものです。また、VAPがあれば委員会の2回目の請求は不要になった、スイスの侵入を「即時にフォレンジック」できた、としていました。どちらも反実仮想で、VAPは検知や介入の機能を持ちません（§4.4.4）。委員会の問いはインシデントを数え、分類することについてで、記録の完全性はそれに答えません。

### 確認したほかの政府機関の発表

**CSIRT Italia、速報 BL01/261123/CSIRT-ITA（11月23日）。** **V1123CSIRTITA**として記録しました。国家CSIRTが、AIで統率されたエージェントによる大規模な侵害キャンペーンを国内で検知したとし、使われたツールを挙げています。被害者、セクター、日付、攻撃者は示していません。

**オランダNCSC（11月27日）。** [ニュース](https://www.ncsc.nl/nieuws/ai-gestuurde-frameworks-versnellen-en-vergroten-digitale-aanvallen)と付属のCTIレポートは、DIVD、欧州の機関、韓国の金融部門、ウェブショップ、通信事業者への攻撃でAI駆動の枠組みが確認されたとし、ページの説明文は、DIVD・韓国・日本の事案にARTEXが共通するとしています。NCSCの試験では、単純な改ざんは約1分・0.20ユーロ未満、脆弱なGitLab CEでの遠隔コード実行は約35分・約2ユーロでした。新しい被害者、日付、件数は示していません。DIVDへの攻撃は2026年9月に報じられています。韓国の金融部門の事案はV1013で、「欧州の機関」はV1119EUCOMMISSIONと重なる可能性があります。事件の報告ではなく脅威の評価のため、事件としては記録しません。DIVDへの攻撃そのものは、DIVD自身の発表に照らして別に確認する候補とします（今回はDIVDの発表を取得していません）。

**ドイツBSI（11月26日）と英国NCSC（11月24日）。** 二次の報道によれば、BSIはAISI Deutschlandを通じてエージェント型攻撃フレームワークの能力を確認したとし、英国NCSCはブログでAI支援の攻撃の増加を述べています。どちらも国内の事案の件数は示していないと報じられています。今回はどちらのページも直接取得しておらず、記録しません。

過去の`excluded_counts`は変更しません。
