# Retail, autonomous-driving and agent-scope reports — source review

- Review date / 確認日: **2026-11-08 (Asia/Tokyo)**
- Scope / 対象: **H-E-B, Grab/WeRide, Railway/Primcloud**
- Record decisions / 登録判断: **H-E-B: HOLD; V1105GRAB and V1103RAILWAY: PUBLISH WITH CAVEATS**

## English

### H-E-B: HOLD, not a verified AI incident

The [Nerd Stash article published on 7 November](https://thenerdstash.com/texas-man-gets-falsely-accused-of-stealing-from-h-e-b-because-of-ai-security-system-i-would-be-livid/) recounts a customer's Reddit account of being asked to leave H-E-B's Tech Ridge store. The later manager apology and attribution to an AI error are also the customer's account, not a direct corporate statement to the reporter.

The indexed article was retrieved, but the original post's permalink and timestamp, independent corroboration, and a direct H-E-B confirmation of the technology were not retrieved in this review. The event date is not established by the article's publication date. AI involvement, the system/vendor, the matching mechanism and the existence or adequacy of internal logs remain unverified here. HOLD does not mean the customer's account is false.

Keep this as a review note, outside the verified incident records and published totals. Historical `excluded_counts` are not changed. Re-review when original context and corroborating evidence become accessible; bind each supported claim to its actual source and date before changing the disposition.

### Grab and Railway: what the records verify

The two linked records contain claim-level source bindings and verification dates. Their `CONFIRMED` labels verify the explicitly attributed reporting or policy statement, not independently authenticated vehicle telemetry, a complete agent trace, or a final causal finding.

- **[V1105GRAB](https://veritaschain.org/incidents/#V1105GRAB):** use the [CNA follow-up](https://www.channelnewsasia.com/singapore/lta-grab-pause-av-vehicle-testing-punggol-near-miss-schoolgirl-6531876), including LTA's preliminary account of automatic response before operator takeover. Preserve the limited scope of the testing pause. The LTA statement is accessed through reporting, not a separately retrieved official incident publication.
- **[V1103RAILWAY](https://veritaschain.org/incidents/#V1103RAILWAY):** retain the different parties' accounts in [CSO](https://www.csoonline.com/article/4245637/railways-ai-agents-go-off-the-track-on-a-rivals-network.html) and [The Stack](https://www.thestack.technology/railway-admits-employee-hacked-competitor-after-ai-model-jumped-the-rails/). Distinguish credentials inside the user's own container from platform-wide or other customers' secrets. A reported stop time or policy announcement is not an independently checked execution boundary or implemented control. The [official AUP](https://primcloud.com/aup) establishes the written-consent rule, not this incident's authorization history.

Neither record establishes that absent audit logs caused the event. Non-publication of full records does not establish nonexistence. Public summaries or screenshots also do not establish a complete, reconciled trace.

### VAP design implications and limits

These are design proposals, not findings that the involved systems used VAP or would have avoided the events with it. The reviewed [VAP v1.2 framework at commit 8ca7b6f](https://github.com/veritaschain/vap-spec/blob/8ca7b6fdc278227a1d3664550d651024a53a2110/spec/v1.2/VAP_Framework_Specification.md) distinguishes record integrity and attributability from correct or safe decisions (§1.6), describes decision and causal records (§§4.2–4.3), and records human oversight without supplying intervention capability (§4.4.4). The automotive **DVP remains Planned** in §4.5.2; this review does not introduce or validate a released automotive or retail profile. VCP is the finance profile.

| Domain | Evidence to consider, where lawfully collectable |
| --- | --- |
| Retail, if the reported technology is corroborated | Input reference, model/version, matching output, human review, customer-facing action, appeal and correction. |
| Autonomous driving | Perception, planned trajectory, automatic commands, takeover request and acknowledgement, actual operator commands and vehicle response, with clock uncertainty. |
| Agents | Requested and granted scope, observed target and tool action, result or denial, stop request and observed cessation. |

Keep observations separate from claimed intent and causal interpretation. Tamper-evident records can support later investigation; a signature does not establish that an observation was true, that collection was complete, or why a model internally reached a decision. Hashes alone cannot recover unavailable inputs. VAP does not authorize or block actions and does not guarantee accident prevention, correct decisions, legal compliance or a litigation outcome.

Minimize evidence disclosed to recipients. Do not put raw customer images, secrets or full prompts into a public pack by default. Preserve any necessary originals under restricted custody; create separately identified, minimized derivatives rather than editing signed originals. The existing [cloud-collector security-boundary guide](https://github.com/veritaschain/vap-spec/blob/8ca7b6fdc278227a1d3664550d651024a53a2110/experiments/cloud-credential-collector/SECURITY-BOUNDARIES-ja.md) describes the separation of authorization, execution evidence and disclosure decisions; it is not evidence of deployment in these incidents.

### Regulatory wording

No incident-specific legal determination is made. The [EU AI Act's Article 6](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-6) and [Annex III](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3) do not make every retail AI system high risk merely because it is used in retail. Actual function and use matter, and [Article 2](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2) governs territorial and other scope conditions. The [EDPB's Article 3 guidelines](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en) likewise require a jurisdictional assessment for GDPR. A Texas or Singapore event, by itself, does not settle those questions. Do not cite unspecified future EU agent clauses as existing duties. Applicable local law and any actual proposed provision need separate sources and review.

## 日本語

### H-E-B：HOLD／AI事故としての登録は保留

[11月7日付のThe Nerd Stash記事](https://thenerdstash.com/texas-man-gets-falsely-accused-of-stealing-from-h-e-b-because-of-ai-security-system-i-would-be-livid/)は、Tech Ridge店から退店を求められたという顧客のReddit投稿を紹介しています。後日のマネージャーの謝罪とAI誤判定の説明も、顧客が伝えた会話の内容であり、同社が記者へ直接回答したものではありません。

検索索引上の記事本文は取得できましたが、元投稿の固定URL・投稿時刻、独立した裏付け、H-E-Bによる技術の直接確認は、本レビューでは取得できていません。記事の公表日から発生日を確定することはできません。AIの関与、システム・提供元、照合方式、内部ログの有無や十分性は未確認です。HOLDは、顧客の説明が虚偽であるという判定ではありません。

確認メモとして残し、検証済み事件と公開集計には加えません。過去の`excluded_counts`も変更しません。元の文脈と裏付け資料を取得できた段階で再確認し、支持できる主張ごとに出典と日付を対応付けて登録判断を見直します。

### GrabとRailway：確認できた範囲

2件の記録では主張ごとに出典と確認日を示します。`CONFIRMED`は、明記した当事者への帰属を伴う報道や規程を確認したという意味であり、車両の生データ、エージェントの全実行履歴、最終的な原因を独立に検証したという意味ではありません。

- **[V1105GRAB](https://veritaschain.org/incidents/ja/#V1105GRAB)：** [CNAの続報](https://www.channelnewsasia.com/singapore/lta-grab-pause-av-vehicle-testing-punggol-near-miss-schoolgirl-6531876)にある、オペレーターが引き継ぐ前の自動応答を含むLTAの暫定説明を反映します。試験停止の対象範囲も限定して記載します。LTAの説明は報道を通じて取得したもので、独立した公式事故公表文を取得したものではありません。
- **[V1103RAILWAY](https://veritaschain.org/incidents/ja/#V1103RAILWAY)：** [CSO](https://www.csoonline.com/article/4245637/railways-ai-agents-go-off-the-track-on-a-rivals-network.html)と[The Stack](https://www.thestack.technology/railway-admits-employee-hacked-competitor-after-ai-model-jumped-the-rails/)の当事者別の説明を区別します。利用者自身のコンテナ内資格情報と、プラットフォーム全体・他顧客の秘密情報を混同しません。報道された停止時刻や方針表明だけでは、実行の終了や対策の施行を独立に確認できません。[公式AUP](https://primcloud.com/aup)は書面同意を要する規程の根拠であり、本件の認可履歴そのものの証拠ではありません。

どちらの記録も、監査ログの欠如が原因だったとは立証していません。全記録が公開されていないことは、ログの不存在を意味しません。公開された要約や画面画像だけでも、完全な履歴の照合が済んだとは判断できません。

### VAPへの設計上の示唆と限界

以下は設計提案であり、当該システムへのVAP導入や、導入していれば事件を回避できたという評価ではありません。確認した[VAP v1.2仕様・commit 8ca7b6f](https://github.com/veritaschain/vap-spec/blob/8ca7b6fdc278227a1d3664550d651024a53a2110/spec/v1.2/VAP_Framework_Specification.md)は、記録の改ざん検知可能性・帰属可能性と判断の正しさ・安全性を区別し、網羅性の検証はアンカー粒度に限定します（§1.6）。判断と因果関係の記録を扱い（§§4.2–4.3）、人間の監督に関する記録を定めても介入機能そのものは提供しません（§4.4.4）。自動運転向けの**DVPは§4.5.2でPlanned**です。本レビューは、リリース済みの自動運転・小売向けプロファイルの新設や検証を行うものではありません。VCPは金融分野のプロファイルです。

| 分野 | 適法に収集できる範囲で検討する証跡 |
| --- | --- |
| 小売：報告された技術の裏付けが得られた場合 | 入力への参照、モデル・版、照合結果、人の確認、顧客に対する措置、異議申立て、訂正。 |
| 自動運転 | 知覚、計画経路、自動制御命令、引継ぎ要求と受理、人の操作、車両の実際の応答。時計の不確かさも記録。 |
| エージェント | 要求された範囲と付与された権限、観測した対象・ツール操作、結果・拒否、停止要求、実際に確認できた停止。 |

観測事実、宣言された意図、因果解釈を分けて扱います。改ざん検知可能な記録は事後調査を支援できますが、署名だけでは観測内容の真実性、収集の網羅性、モデル内部の判断理由は立証できません。ハッシュだけでは、利用できない入力を復元できません。VAPは操作を許可・阻止せず、事故防止、判断の正しさ、法令適合性、訴訟の結果を保証しません。

受領者へ開示する証跡は必要最小限にします。顧客画像、秘密情報、プロンプト全文を既定で公開用パックに入れません。必要な原本はアクセスを制限して保持し、署名済み原本の編集ではなく、別の識別子を持つ最小化済みの派生証跡を作成します。既存の[クラウド収集実験のセキュリティ境界ガイド](https://github.com/veritaschain/vap-spec/blob/8ca7b6fdc278227a1d3664550d651024a53a2110/experiments/cloud-credential-collector/SECURITY-BOUNDARIES-ja.md)も、認可・実行証跡・開示判断を区別しています。同ガイドは本件での導入実績を示すものではありません。

### 規制表現

本件固有の法的判断は行いません。[EU AI Act第6条](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-6)と[附属書III](https://ai-act-service-desk.ec.europa.eu/en/ai-act/annex-3)から、小売で使うAIをすべて高リスクと一括分類することはできません。具体的な機能・用途を確認し、[第2条](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2)の適用範囲も検討する必要があります。[GDPR第3条に関するEDPB指針](https://www.edpb.europa.eu/documents/guideline/guidelines-32018-on-the-territorial-scope-of-the-gdpr-article-3-version-adopted_en)も、地域的な適用範囲の検討を要します。テキサスやシンガポールで起きたという情報だけでは適用を確定できません。条文を特定していない将来のEUエージェント条項を現行義務として引用せず、適用される現地法や実在する提案条文は別途出典を確認して評価します。
