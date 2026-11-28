# SAP development-environment incident, and a repeat of the CSIRT Italia bulletin — source review

- Review date / 確認日: **2026-11-28 (Asia/Tokyo)**
- Scope / 対象: **Reported intrusion into SAP's GitHub environment ("Project Granite"); a monitoring brief's re-listing of CSIRT Italia bulletin BL01/261123/CSIRT-ITA**
- Record decision / 登録判断: **HOLD (SAP); DO-NOT-PUBLISH-AS-NEW (CSIRT Italia)**

## English

### SAP: what the reviewed reporting supports

Der Spiegel reported on the evening of 26 November 2026 that SAP was dealing with an attack. VSO could not retrieve its text (paywall) and relies on reports that cite it. [BleepingComputer](https://www.bleepingcomputer.com/news/security/sap-confirms-security-incident-after-suspicious-github-activity/), [The Next Web](https://thenextweb.com/news/sap-security-incident-github-breach) and [Techzine](https://www.techzine.eu/news/security/146116/sap-hit-by-hack-source-code-modified/) report SAP's statement: it identified suspicious activity, took measures to protect customers and its services, and has so far found no evidence of unauthorised access to customer business data.

Everything beyond that rests on Der Spiegel's sources. According to the reports citing it, an insider said that attackers stole authentication tokens of SAP employees and used them to copy and alter SAP source code on GitHub, possibly with the help of AI agents, and an internal memo called the matter an active security incident handled under the name "Project Granite". SAP has not confirmed the token theft, any change to source code, the name or any use of AI. VSO found no statement from GitHub, no SAP newsroom or trust-centre notice and no capital-markets disclosure. The monitoring brief also cited a Reuters report of 27 November; VSO did not retrieve it.

### SAP: why the record is on hold

The monitoring brief VSO checked listed this case as one whose AI involvement was unconfirmed and proposed not to count it as an AI agent incident. VSO agrees and goes one step further: it does not record it. SAP's own confirmation covers suspicious activity and nothing about method. The link to AI is one unnamed source's "possibly", without a technical basis. That is the same position as the CIA and ODNI case reviewed on 26 November, and it does not meet the threshold VSO applies to AI incident records.

Keep this as a review note, outside the verified incident records and published totals. Historical `excluded_counts` are not changed. Re-review if SAP, a regulator filing or an investigator describes how the intrusion was carried out. HOLD does not mean the reporting is false.

### CSIRT Italia: nothing new

The same brief listed CSIRT Italia's bulletin BL01/261123/CSIRT-ITA as an unreported incident. It is already recorded as V1123CSIRTITA, verified on 28 November 2026, and the brief adds no primary fact to that record. It describes the bulletin as a confirmation by the Italian government of a large-scale attack; the document is a technical bulletin by the national CSIRT that names no victim, sector, date or attacker. The brief also cites a la Repubblica report of 27 November. VSO found no such article and does not treat it as a source. V1123CSIRTITA is unchanged.

### No VAP claim

No VAP finding is made on the SAP case. Whether source code in a repository was changed, and by whose credential, is the subject of software supply-chain provenance (for example signed commits, SLSA and Sigstore), not of VAP v1.2. VAP does not detect or stop an intrusion, protect a signing key or a token, or recover actions nobody recorded. German and EU law would govern any notification or disclosure duties; this review does not assess them.

## 日本語

### SAP：確認できたこと

Der Spiegelは2026年11月26日夜、SAPが攻撃への対応にあたっていると報じました。VSOは本文を取得できず（ペイウォール）、同誌を引用する報道に依っています。[BleepingComputer](https://www.bleepingcomputer.com/news/security/sap-confirms-security-incident-after-suspicious-github-activity/)、[The Next Web](https://thenextweb.com/news/sap-security-incident-github-breach)、[Techzine](https://www.techzine.eu/news/security/146116/sap-hit-by-hack-source-code-modified/)は、SAPの声明を伝えています。不審な活動を特定し、顧客とサービスを守るための措置を取り、現時点の調査では顧客の業務データへの不正アクセスの証拠は見つかっていない、という内容です。

それ以上のことは、Der Spiegelの情報源に依っています。同誌を引用する報道によれば、内部関係者は、攻撃者がSAP従業員の認証トークンを盗み、それを使ってGitHub上のSAPのソースコードを複製・変更した（AIエージェントが使われた可能性がある）と述べ、社内文書は本件を「Project Granite」の名で扱う進行中のセキュリティ事案と呼んでいます。SAPは、トークンの窃取、ソースコードの変更、この呼称、AIの使用のいずれも認めていません。GitHubの声明、SAPのニュースルームやトラストセンターの告知、資本市場向けの開示は、VSOは見つけていません。監視ブリーフは11月27日のReutersの報道も挙げていましたが、VSOは取得していません。

### SAP：保留の理由

VSOが確認した監視ブリーフは、本件を「AI関与は未確定」とし、AIエージェント事故の件数には含めないとしていました。VSOはこれに同意したうえで、記録もしません。SAP自身が認めているのは不審な活動までで、手口については何も述べていません。AIとの結び付きは、匿名の情報源1人の「可能性がある」という発言だけで、技術的な根拠は示されていません。11月26日に確認したCIA・ODNIの件と同じ状況であり、VSOがAI事故の記録に求める基準に届きません。

確認メモとして残し、検証済みの記録と公開集計には加えません。過去の`excluded_counts`も変えません。SAP、規制当局への届出、調査担当者が侵入の手口を説明した段階で見直します。HOLDは、報道が誤りだという判定ではありません。

### CSIRT Italia：新しい事実なし

同じブリーフは、CSIRT Italiaの速報 BL01/261123/CSIRT-ITA を未報告の事例として挙げていました。これは V1123CSIRTITA として2026年11月28日に検証・記録済みで、ブリーフはこの記録に加える一次事実を含んでいません。ブリーフは速報を「イタリア政府が大規模攻撃を確認した」ものと説明していますが、実際は国家CSIRTの技術的な速報で、被害者、セクター、日付、攻撃者のいずれも示していません。ブリーフは11月27日のla Repubblicaの報道も挙げていますが、VSOは該当する記事を見つけられず、出典として扱いません。V1123CSIRTITA は変更しません。

### VAPについて

SAPの件について、VAPに関する判断はしません。リポジトリのソースコードが変更されたか、どの資格情報で行われたかは、ソフトウェア供給網の来歴（署名付きコミット、SLSA、Sigstoreなど）の対象であり、VAP v1.2の対象ではありません。VAPは侵入を検知も停止もせず、署名鍵やトークンを保護せず、誰も記録しなかった行為を回復することもできません。通知や開示の義務を定めるのはドイツ法とEU法ですが、本メモはその内容を評価していません。
