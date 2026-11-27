# CIA and ODNI unclassified OSINT system breach — source review

- Review date / 確認日: **2026-11-26 (Asia/Tokyo)**
- Scope / 対象: **Reported breach of an unclassified open-source intelligence (OSINT) analysis system used by US intelligence agencies**
- Record decision / 登録判断: **HOLD**

## English

### What the reviewed reporting supports

The New York Times first reported the breach on 24 November 2026. VSO could not retrieve its text (paywall) and relies on reports that cite it. [Reuters](https://www.usnews.com/news/top-news/articles/2026-11-24/us-cia-odni-suffer-cybersecurity-breach-of-some-unclassified-information-nyt-reports) (as published by U.S. News & World Report), the [Associated Press](https://federalnewsnetwork.com/cybersecurity/2026/11/an-unclassified-cia-system-was-breached-in-a-cyberattack-ap-source-says/) (as published by Federal News Network), [CNN](https://www.cnn.com/2026/11/24/politics/cia-odni-hack-unclassified-information) and [CyberScoop](https://cyberscoop.com/cia-odni-osint-data-breach/) report a breach of a network that draws intelligence insights from public, unclassified material. Their sources say no classified information or classified networks were involved. CNN and the Times' sources also mention the National Geospatial-Intelligence Agency.

VSO found no agency statement confirming the breach on the record. CyberScoop reports that the CIA declined to comment and that ODNI did not immediately respond. Some reports carry an ODNI response that critical capabilities and classified systems were not disrupted; VSO could not retrieve that response directly. VSO found no NGA statement. How the intruders got in, and what was taken, has not been disclosed.

### Why the record is on hold

The monitoring brief VSO checked listed this case as an AI agent incident whose AI involvement was unconfirmed. The only link to AI is that unnamed officials quoted by the Times pointed to initial signs including the use of ARTEX, a publicly available AI-powered penetration testing framework. No agency has said so. Microsoft's 25 November post on threat actors using ARTEX does not mention this breach, and VSO found no government ARTEX warning that does.

ARTEX traces show a shared technique, not the identity of an incident or an attacker. With AI involvement resting only on anonymous sourcing and no party to the incident describing it, the case does not meet the threshold VSO applies to AI incident records. V1117BELLCANADA was recorded with AI involvement unverified because Bell itself called its attacker "agentic"; here no party has said anything about AI.

Keep this as a review note, outside the verified incident records and published totals. Historical `excluded_counts` are not changed. Re-review if an agency, a court filing or the system's operator describes how the intrusion was carried out. HOLD does not mean the reporting is false.

### No VAP claim

No VAP finding is made. The system is not reported to be an AI decision system, and the AI tool, if any, would have been the attacker's. VAP places no obligation on an attacker's tools, does not detect or stop an intrusion, and cannot recover actions nobody recorded. US federal law, not EU law, would govern any reporting obligations; this review does not assess them.

## 日本語

### 確認できたこと

The New York Timesが2026年11月24日に最初に報じました。VSOは本文を取得できず（ペイウォール）、同紙を引用する報道に依っています。[Reuters](https://www.usnews.com/news/top-news/articles/2026-11-24/us-cia-odni-suffer-cybersecurity-breach-of-some-unclassified-information-nyt-reports)（U.S. News & World Reportの転載）、[AP通信](https://federalnewsnetwork.com/cybersecurity/2026/11/an-unclassified-cia-system-was-breached-in-a-cyberattack-ap-source-says/)（Federal News Networkの転載）、[CNN](https://www.cnn.com/2026/11/24/politics/cia-odni-hack-unclassified-information)、[CyberScoop](https://cyberscoop.com/cia-odni-osint-data-breach/)は、公開・非機密の資料から情報分析の結果を得るネットワークへの侵入を報じています。各社の情報源は、機密情報や機密ネットワークは関係していないとしています。国家地球空間情報局（NGA）を挙げているのはCNNとTimesの情報源です。

侵入を公式に認めた機関の声明は、VSOは見つけていません。CyberScoopによれば、CIAはコメントを拒否し、ODNIはすぐには回答しませんでした。重要な機能や機密システムに支障はないとするODNIの回答を伝える報道もありますが、VSOはその回答を直接確認できていません。NGAの声明は見つかりませんでした。侵入の経路と、持ち出されたものは開示されていません。

### 保留の理由

VSOが確認した監視ブリーフは、本件を「AI関与は未確定」のAIエージェント事故として挙げていました。AIとの結び付きは、Timesが引用した匿名の当局者が、公開のAIペネトレーションテスト・フレームワークARTEXの使用を含む初期の兆候を挙げたことだけです。そう述べた機関はありません。ARTEXを使う攻撃者についてのMicrosoftの11月25日の記事も本件に触れておらず、本件に触れた政府のARTEX警告もVSOは見つけていません。

ARTEXの痕跡は手法の共通性を示すだけで、事件や攻撃者の同一性は示しません。AIの関与が匿名の情報源だけに依り、当事者の誰もそれを述べていない以上、VSOがAI事故の記録に求める基準に届きません。V1117BELLCANADAは「AIの関与は未確認」として記録しましたが、それはBell自身が攻撃者を「agentic」と呼んでいたからです。本件では、どの当事者もAIについて何も述べていません。

確認メモとして残し、検証済みの記録と公開集計には加えません。過去の`excluded_counts`も変えません。機関、裁判書類、システムの運用者が侵入の手口を説明した段階で見直します。HOLDは、報道が誤りだという判定ではありません。

### VAPについて

VAPに関する判断はしません。このシステムがAIの判断を行うシステムだという報道はなく、AIツールが使われたとしても攻撃者のものです。VAPは攻撃者のツールに義務を課さず、侵入を検知も停止もせず、誰も記録しなかった行為を回復することもできません。報告義務などを定めるのは米国連邦法でありEU法ではありませんが、本メモはその内容を評価していません。
