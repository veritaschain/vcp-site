# AI patching, US service outages and Java4Shell — source review

- Review date / 確認日: **2026-11-19 (Asia/Tokyo)**
- Scope / 対象: **US service-outage reporting, Java4Shell research disclosure, change-management evidence and regulatory wording**
- Record decision / 登録判断: **REVIEW NOTE ONLY — no new verified AI-harm incident records**

## English

### Separate the reported events from the proposed cause

The reviewed sources describe service outages and an AI-assisted vulnerability discovery. They do not establish one connected AI-caused incident, a common patch, or missing audit logs as the cause. The entries below preserve each source's attribution and date. These evidence descriptions are not incident-registry verdicts or independent authentication of operational telemetry.

| Review claim | Source and supported account | Evidentiary limit |
| --- | --- | --- |
| OUT-FAA | The [FAA's 15 November Q&A][faa] dates the ground stop to **13 November**, from about 15:30 to 20:15 ET. It reports **12,462 cancellations**, while warning that not all were directly caused by the stop. It describes unstable legacy communications equipment and an investigation into router work. | The investigation was ongoing. Do not replace this with “15,000 cancellations caused by an AI patch,” or use the article date as the event date. |
| OUT-BANK | [Reuters, 16 November][reuters-bank], attributes transaction delays to a JPMorgan spokesperson's account of a software bug in on-site hardware. The bank reported no indication of a cyber incident. | A company's explanation reported by a news agency is not a published, independently verified root-cause analysis. Do not generalize it to every bank. |
| OUT-OTHER | The [Financial Times, 18 November][ft], reports Microsoft 365 and NSA network disruption. It attributes the NSA's temporary service degradation to the agency's account of routine maintenance. | This review did not obtain a complete primary incident report for either service. Their inclusion in the same article does not establish a shared cause. |
| OUT-CAUSE | [Reuters, 18 November][reuters-patching], reports expert views that accelerated patching may contribute to outages, while saying the causes remain unclear and citing an official statement that there was no indication the outages were related. | A plausible change-management hypothesis is not evidence that AI-generated patches or inadequate testing caused any particular outage. |
| RES-CVE | [Calif's research disclosure][calif] and [Oracle's 17 November security update][oracle] identify **CVE-2026-114938**, known as Java4Shell. Calif describes AI-assisted discovery. | This is a vulnerability-research disclosure, distinct from a demonstrated harmful deployment or an established cause of the outages above. |

### Java4Shell: preserve timing, environment and attribution

Calif reports using Codex to find an OpenJDK Base64 memory-corruption flaw in about **one hour**, followed by about **two more hours** to obtain a working exploit, with total token spending below **US$200**. These are the researcher's measurements, not a VSO benchmark. The described issue depends on affected Java builds and **x86-64 AVX-512 VBMI** support; the disclosure excludes ARM64 from this CPU-specific bug. Calif describes pre-authentication code-execution demonstrations in particular application configurations. This does not establish universal exposure of all Java deployments or most Fortune 500 companies. [Calif][calif]

Oracle's advisory supplies affected-product details and fixes; its Java risk matrix includes the CVE. Use the relevant vendor's version and platform guidance when evaluating an installation. [Oracle][oracle]

The [17 November CISA alert distributed through its official GovDelivery account][cisa] urges prompt vendor patching, an inventory that includes embedded runtimes, prioritization of internet-facing systems, and compensating controls if immediate deployment is impracticable. Urgency is not evidence that an operator omitted tests, nor an instruction to skip change controls.

No reviewed source establishes that the discovery process lacked logs, that all internal model reasoning was observable, that AI generated the deployed patches, or that absent records caused the outages. The non-publication of full internal records cannot establish their nonexistence. A later incident report could change an individual claim; it should be added with its own source, scope and review date.

### VAP: a proposed evidence design, with implementation limits

The following is a **design inference**, not a finding that these organizations deployed VAP. The reviewed [VAP v1.2 Draft 3 specification at commit 4db6c49][vap] separates evidence integrity from decision correctness (§1.6), describes provenance and traceability (§§4.2–4.3), and records oversight without implementing intervention (§4.4). Its profile registry (§4.5.2) does not supply a general software-patching profile. This note creates no normative requirement or new conformance claim.

| Change stage | Evidence an implementation could bind |
| --- | --- |
| Discovery and assessment | Advisory/version, observed model and tool identifiers, input references, reported findings and independently checked reproduction results. |
| Patch candidate | Artifact digest, affected inventory and environment references, dependencies, intended scope and rollback plan. |
| Tests and decision | Test manifest and results, exceptions, approver identity, decision time, conditional requirements and evidence of their completion. |
| Execution control | Exact authorized artifact, target and scope; dispatch or denial; any expiry, stop or revocation request. An enforcing control must implement these checks. |
| Outcome and reconciliation | Observed deployment state, monitoring, rollback attempts and results, uncertainty and unresolved operations. |

Capture observable inputs, outputs, tool actions and approvals. An explanation emitted by a model is not a complete internal reasoning trace. Sensitive originals can remain under controlled custody with minimized, separately identified evidence for recipients. A digest cannot reconstruct an unavailable original.

Signatures and commitments can help detect later changes within the captured evidence boundary. They do not prove that a patch is safe, tests cover every affected system, a claimed observation is true, or collection was complete. VAP does not itself force impact tests, authorize a production deployment, execute a rollback or stop an agent. Those controls need separately implemented and tested enforcement. The existing [pre-record gate experiment][gate] is a synthetic, local experiment, not evidence that a production patch gate exists at any organization discussed here.

### Current regulatory sources and the Kinosaki correction

| Source checked on 19 November | What it supports | Publication boundary |
| --- | --- | --- |
| [FCA wholesale-bank supervision review, 2 November 2026][fca] | The review reports an AI code recommendation that escaped human review and caused service loss; weaknesses in tracking conditional approvals, production exceptions, agent risk ratings, kill-switch readiness and AI inventories. | These are supervisory observations. They do not identify the organizations above or announce a new kill-switch rule taking effect within the next week. |
| [DORA, Article 9(4)(e)–(f)][dora] | For financial entities within scope, documented ICT change management covers recording, testing, assessment, approval, implementation and verification, alongside patch/update policies. | This is a useful mapping for proposed evidence fields; it does not mandate VAP or establish a breach by a named US organization. |
| [EU AI Act, Article 2][ai-scope] | Scope can extend to providers outside the EU and to third-country providers/deployers whose AI-system output is used in the EU, subject to the provision's conditions and exclusions. | A Japanese or US event location alone neither settles applicability nor establishes a violation. |
| [EU AI Act, current Article 113(c)][ai-current] | In the **27 July 2026 consolidated text**, Chapter III Sections 1–3, except Article 6(5), apply from **2 December 2027** for Article 6(2)/Annex III systems and **2 August 2028** for Article 6(1)/Annex I systems. | These are the specified high-risk provisions, not a postponement of the entire Act. Determine scope, classification, duty and applicable date before alleging a record-keeping breach. |

The legal note in [V1109KINOSAKI][kinosaki] previously excluded the EU AI Act solely because the event occurred in Japan. The dated correction withdraws that explanation. The claim remains **UNCONFIRMED**: no EU nexus, relevant classification, applicable duty or breach has been established in this record. Only that legal claim's review date is refreshed; the original event account, verification date and pending-registration label are preserved. This review also makes no incident-specific GDPR or NIS2 breach finding.

### Publication and re-review decision

Keep the outage reports and the research disclosure in this standalone review. **Do not increment incident totals, historical exclusion counters or ledger registrations.** Re-review a specific event when an operator's incident report, a regulator's finding, or other attributable evidence resolves its AI involvement and causal scope. Track actual FCA follow-up publications; a forecast of next-week requirements is not a current regulatory fact.

## 日本語

### 確認できた範囲と登録判断

米国のサービス障害報道とJava4Shellの研究公表は分けて扱います。複数の障害に共通するAI起因の原因や、監査ログの欠如による障害は確認できていません。このメモは**出典レビュー**であり、検証済みのAI加害事案の追加ではありません。記録件数、過去の除外集計、台帳への登録状態は変更しません。

- [FAAの公式Q&A][faa]による発生日は11月13日です。欠航数は12,462便ですが、すべてがフライト停止に直接起因したわけではありません。「AIパッチによる15,000便の欠航」と置き換える根拠はありません。
- 銀行については[Reutersが伝えたJPMorganの説明][reuters-bank]、Microsoft 365とNSAについては[FTの報道][ft]という帰属を維持します。[11月18日のReuters][reuters-patching]も原因を未確定としており、各障害の因果関係をまとめて認定できません。
- [Califの公表][calif]は、発見に約1時間、動作するエクスプロイトまでさらに約2時間、総トークン費用200ドル未満という研究者側の報告です。CPU・Java版・アプリケーション構成に条件があり、Java利用企業全体の被害を示しません。[Oracleの修正情報][oracle]と[CISAの公式配信][cisa]は、各環境に応じた対応の根拠として扱います。

### VAPへの反映と規制表現

設計上は、発見の出典、モデル・ツールと観測結果、対象環境、パッチのダイジェスト、テスト、条件付き承認、実行・拒否、ロールバック、確認できた結果を対応付ける価値があります。ただし、これは[VAP v1.2 Draft 3][vap]を踏まえた提案です。全内部推論の取得、安全なパッチの保証、影響範囲の自動再現、実行の停止をVAPの既存機能として宣伝しません。実行制御には別の実装と検証が必要です。記録の非公開と不存在も区別します。

[FCAの11月2日付レビュー][fca]は、条件付き承認やkill switch等の管理上の問題を既に公表しています。翌週の新規制導入を予告した資料としては扱いません。[DORA第9条][dora]の変更管理義務は対象となる金融事業者の範囲を確認して対応付け、VAPの採用義務や今回の法令違反とは結び付けません。

[EU AI Act第2条][ai-scope]では、EUとの接点や各種の除外を確認する必要があります。[現行第113条][ai-current]の上記高リスク規定の適用日は、附属書IIIが2027年12月2日、附属書Iが2028年8月2日です。法全体の適用開始がその日まで延期されたという意味ではありません。

[V1109KINOSAKI][kinosaki-ja]の「日本で発生したためEU AI Actは適用されない」という理由付けは、日付付きで訂正しました。適用範囲・分類・義務・違反を確認できていないため、判定は**UNCONFIRMED**を維持しています。事故全体を11月19日に再検証した扱いにはしていません。

## Sources / 出典

Official publications and the researcher disclosure were checked for the claims above. The Reuters and FT accounts are secondary reporting retrieved through indexed article text; this note does not imply direct access to underlying operator records. A link is an inspectable source reference, not a cryptographic seal or independent proof of every statement it contains.

[faa]: https://www.faa.gov/newsroom/nationwide-ground-stop-questions-and-answers
[reuters-bank]: https://www.reuters.com/legal/transactional/downdetector-reports-outages-major-us-banks-2026-11-16/
[ft]: https://www.ft.com/content/96c565f1-f229-40b6-91e8-7a849ec4b208
[reuters-patching]: https://www.reuters.com/legal/litigation/patching-ai-age-may-underlie-some-major-tech-outages-experts-say-2026-11-18/
[calif]: https://calif.io/java4shell/
[oracle]: https://www.oracle.com/security-alerts/cspunov2026.html#AppendixJAVA
[cisa]: https://content.govdelivery.com/accounts/USDHSCISA/bulletins/4332a87
[fca]: https://www.fca.org.uk/publications/multi-firm-reviews/wholesale-banks-supervision-insights-3-autumn-2026
[dora]: https://eur-lex.europa.eu/eli/reg/2022/2554/oj/eng
[ai-scope]: https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-2
[ai-current]: https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02024R1689-20260727
[vap]: https://github.com/veritaschain/vap-spec/blob/4db6c490900dac7e85773c39bbcc5cae935bd730/spec/v1.2/VAP_Framework_Specification.md
[gate]: https://github.com/veritaschain/vap-spec/blob/4db6c490900dac7e85773c39bbcc5cae935bd730/experiments/pre-record-gate/README.md
[kinosaki]: https://veritaschain.org/incidents/#V1109KINOSAKI
[kinosaki-ja]: https://veritaschain.org/incidents/ja/#V1109KINOSAKI
