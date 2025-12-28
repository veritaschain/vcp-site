/**
 * VAP-AT Internationalization (i18n)
 * Supported languages: English, Japanese, Chinese (Simplified), Spanish
 */

const i18n = {
    // ===== English =====
    en: {
        meta: {
            lang: "en",
            langName: "English",
            dir: "ltr"
        },
        nav: {
            home: "Home",
            assessment: "Self-Assessment",
            registry: "Registry",
            docs: "Documentation"
        },
        hero: {
            title1: "Verifiable AI Provenance",
            title2: "Assessment Test",
            subtitle: "Measure your AI system's <strong>Auditability</strong>, <strong>Verifiability</strong>, and <strong>Regulatory Readiness</strong> with a standardized, score-based framework.",
            startBtn: "Start Self-Assessment",
            docsBtn: "Read Documentation"
        },
        features: {
            score: {
                title: "Score-Based Assessment",
                desc: "10 criteria × 0-2 points = 20-point scale with continuous improvement tracking"
            },
            regulatory: {
                title: "Regulatory Alignment",
                desc: "Mapped to EU AI Act, MiFID II, SEC 17a-4, GDPR, and DORA requirements"
            },
            evidence: {
                title: "Evidence Pack",
                desc: "Generate downloadable assessment reports and structured evidence packages"
            },
            threshold: {
                title: "Threshold Designations",
                desc: "Optional interpretive labels for procurement and regulatory reporting"
            }
        },
        philosophy: {
            quote: "Verify, Don't Trust",
            desc: "Evaluating that audit trails for AI systems exist in a mathematically verifiable form."
        },
        assessment: {
            title: "Self-Assessment",
            subtitle: "Evaluate your AI system across 10 auditability criteria",
            systemInfo: "System Information",
            orgName: "Organization Name",
            orgPlaceholder: "Your organization",
            systemName: "AI System Name",
            systemPlaceholder: "System being assessed",
            assessorName: "Assessor Name",
            assessorPlaceholder: "Your name",
            assessorEmail: "Assessor Email",
            emailPlaceholder: "your@email.com",
            criteria: "Assessment Criteria",
            notes: "Additional Notes",
            notesPlaceholder: "Any additional observations or context...",
            progress: "Progress",
            criteriaCount: "{0}/10 criteria",
            thresholdDesignations: "Threshold Designations",
            generateReport: "Generate Report (PDF)",
            downloadEvidence: "Download Evidence (JSON)",
            reset: "Reset Assessment",
            notScored: "Not Scored",
            score: "Score",
            keyQuestion: "Key Question",
            evidenceExamples: "Evidence Examples",
            disclaimer: "This is a self-assessment tool (VAP-AT Level 1). Results are preliminary and not independently verified. Threshold Designations are interpretive labels, not legal compliance guarantees."
        },
        grades: {
            strong: "Strong",
            moderate: "Moderate",
            limited: "Limited",
            inadequate: "Inadequate"
        },
        designations: {
            euAiAct: "EU AI Act Aligned",
            mifid: "MiFID II Aligned",
            baseline: "Baseline"
        },
        registry: {
            title: "Public Registry",
            subtitle: "Assessed entities with VAP-AT evaluations",
            search: "Search organizations...",
            all: "All",
            organization: "Organization",
            system: "System",
            grade: "Grade",
            level: "Level",
            cab: "CAB",
            validUntil: "Valid Until",
            status: "Status",
            active: "Active",
            suspended: "Suspended",
            pending: "Pending",
            launching: "🚀 Registry launching Q3 2026",
            beFirst: "Be among the first assessed organizations",
            note: "Public Registry displays assessment-conducted status and grade only. Detailed scores (0-20) and Evidence Packs are available to NDA viewers and regulators respectively."
        },
        docs: {
            title: "Documentation",
            download: "Download Charter (MD)",
            overview: "Overview",
            scoring: "Scoring Criteria",
            levels: "Assessment Levels",
            designations: "Threshold Designations",
            governance: "Governance",
            faq: "FAQ"
        },
        footer: {
            by: "by VeritasChain Standards Organization",
            contact: "Contact",
            copyright: "© 2025 VeritasChain Standards Organization. Licensed under CC BY 4.0."
        },
        confirm: {
            reset: "Are you sure you want to reset all scores? This cannot be undone."
        },
        criteria: {
            c1: {
                name: "Third-Party Verifiability",
                question: "Can external parties independently verify audit trails?",
                s0: "No external verification capability. Audit trails are internal-only or non-existent.",
                s1: "Partial verification possible. Some logs exportable but no cryptographic proof.",
                s2: "Full third-party verification. Cryptographic proofs (hash chains, signatures) enable independent verification."
            },
            c2: {
                name: "Tamper Evidence",
                question: "Can unauthorized modifications be detected?",
                s0: "No tamper detection. Logs can be modified without detection.",
                s1: "Basic tamper detection. Checksums or timestamps present but not cryptographically linked.",
                s2: "Strong tamper evidence. Hash chains, Merkle trees, or blockchain anchoring detect any modification."
            },
            c3: {
                name: "Sequence Fixation",
                question: "Is chronological order immutably recorded?",
                s0: "No sequence guarantee. Events may be reordered or backdated.",
                s1: "Timestamps present but not cryptographically fixed. Order depends on system clock integrity.",
                s2: "Immutable sequence. UUIDv7 or similar provides cryptographically fixed ordering."
            },
            c4: {
                name: "Decision Provenance",
                question: "Can decision inputs and rationale be traced?",
                s0: "No decision tracking. Outputs recorded but inputs/rationale unknown.",
                s1: "Partial provenance. Some inputs logged but incomplete chain from input to output.",
                s2: "Full provenance. Complete audit trail from inputs through processing to outputs with rationale."
            },
            c5: {
                name: "Responsibility Boundaries",
                question: "Are approvers and overriders for each action clear?",
                s0: "No attribution. Actions occur without recorded human accountability.",
                s1: "Partial attribution. Some actions attributed but gaps in override/approval logging.",
                s2: "Full attribution. Every action has clear owner; all overrides logged with justification."
            },
            c6: {
                name: "Documentation Completeness",
                question: "Is technical documentation complete and current?",
                s0: "No documentation or severely outdated (>12 months).",
                s1: "Partial documentation. Key documents exist but gaps or outdated sections.",
                s2: "Complete documentation. All required documents current and version-controlled."
            },
            c7: {
                name: "Retention & Availability",
                question: "Is evidence retained and retrievable for required periods?",
                s0: "No retention policy or <3 months retention.",
                s1: "Partial compliance. Retention exists but retrieval untested or incomplete.",
                s2: "Full compliance. 6+ month retention with verified retrieval capability."
            },
            c8: {
                name: "Time Synchronization",
                question: "Is system time synchronized with trusted sources?",
                s0: "No time synchronization. System clock may drift significantly.",
                s1: "Basic NTP synchronization. Millisecond-level accuracy.",
                s2: "High-precision synchronization. PTP or equivalent with microsecond accuracy and drift monitoring."
            },
            c9: {
                name: "Failure & Recovery Logging",
                question: "Are system failures and recoveries logged?",
                s0: "No failure logging. Outages and errors not systematically recorded.",
                s1: "Basic error logging. Major failures logged but recovery actions incomplete.",
                s2: "Comprehensive logging. All failures, root causes, and recovery actions logged with timestamps."
            },
            c10: {
                name: "Right to Erasure Compatibility",
                question: "Can GDPR erasure rights be supported while maintaining auditability?",
                s0: "No erasure capability, or erasure destroys audit integrity.",
                s1: "Basic erasure. Data can be deleted but audit trail gaps result.",
                s2: "Crypto-shredding or equivalent. Personal data erasable while audit integrity maintained."
            }
        }
    },

    // ===== Japanese =====
    ja: {
        meta: {
            lang: "ja",
            langName: "日本語",
            dir: "ltr"
        },
        nav: {
            home: "ホーム",
            assessment: "自己評価",
            registry: "公開レジストリ",
            docs: "ドキュメント"
        },
        hero: {
            title1: "検証可能なAI来歴",
            title2: "評価テスト",
            subtitle: "標準化されたスコアベースのフレームワークで、AIシステムの<strong>監査可能性</strong>、<strong>検証可能性</strong>、<strong>規制対応準備度</strong>を測定します。",
            startBtn: "自己評価を開始",
            docsBtn: "ドキュメントを読む"
        },
        features: {
            score: {
                title: "スコアベース評価",
                desc: "10項目 × 0-2点 = 20点満点、継続的改善の追跡が可能"
            },
            regulatory: {
                title: "規制整合性",
                desc: "EU AI Act、MiFID II、SEC 17a-4、GDPR、DORAの要件にマッピング"
            },
            evidence: {
                title: "エビデンスパック",
                desc: "ダウンロード可能な評価レポートと構造化されたエビデンスパッケージを生成"
            },
            threshold: {
                title: "閾値判定ラベル",
                desc: "調達や規制報告向けの任意の解釈レイヤ"
            }
        },
        philosophy: {
            quote: "Verify, Don't Trust",
            desc: "AIシステムの監査証跡が数学的に検証可能な形で存在することを評価します。"
        },
        assessment: {
            title: "自己評価",
            subtitle: "10項目の監査可能性基準でAIシステムを評価",
            systemInfo: "システム情報",
            orgName: "組織名",
            orgPlaceholder: "組織名を入力",
            systemName: "AIシステム名",
            systemPlaceholder: "評価対象システム",
            assessorName: "評価者名",
            assessorPlaceholder: "お名前",
            assessorEmail: "評価者メール",
            emailPlaceholder: "your@email.com",
            criteria: "評価基準",
            notes: "追加メモ",
            notesPlaceholder: "追加の観察や背景情報...",
            progress: "進捗",
            criteriaCount: "{0}/10 項目",
            thresholdDesignations: "閾値判定ラベル",
            generateReport: "レポート生成 (PDF)",
            downloadEvidence: "エビデンス出力 (JSON)",
            reset: "評価をリセット",
            notScored: "未評価",
            score: "スコア",
            keyQuestion: "キー・クエスチョン",
            evidenceExamples: "エビデンス例",
            disclaimer: "これは自己評価ツール（VAP-AT レベル1）です。結果は暫定的であり、第三者による検証はありません。閾値判定ラベルは解釈レイヤであり、法的コンプライアンスの保証ではありません。"
        },
        grades: {
            strong: "Strong（堅牢）",
            moderate: "Moderate（中程度）",
            limited: "Limited（限定的）",
            inadequate: "Inadequate（不十分）"
        },
        designations: {
            euAiAct: "EU AI Act適合",
            mifid: "MiFID II適合",
            baseline: "ベースライン"
        },
        registry: {
            title: "公開レジストリ",
            subtitle: "VAP-AT評価を受けたエンティティ",
            search: "組織を検索...",
            all: "すべて",
            organization: "組織",
            system: "システム",
            grade: "グレード",
            level: "レベル",
            cab: "CAB",
            validUntil: "有効期限",
            status: "ステータス",
            active: "有効",
            suspended: "停止中",
            pending: "審査中",
            launching: "🚀 レジストリは2026年Q3に開始",
            beFirst: "最初の評価済み組織の一員になりましょう",
            note: "公開レジストリには評価実施ステータスとグレードのみ表示されます。詳細スコア（0-20）とエビデンスパックはNDA締結者および規制当局にそれぞれ提供されます。"
        },
        docs: {
            title: "ドキュメント",
            download: "チャーターをダウンロード (MD)",
            overview: "概要",
            scoring: "スコアリング基準",
            levels: "評価レベル",
            designations: "閾値判定ラベル",
            governance: "ガバナンス",
            faq: "FAQ"
        },
        footer: {
            by: "by VeritasChain Standards Organization",
            contact: "お問い合わせ",
            copyright: "© 2025 VeritasChain Standards Organization. CC BY 4.0ライセンス。"
        },
        confirm: {
            reset: "すべてのスコアをリセットしますか？この操作は元に戻せません。"
        },
        criteria: {
            c1: {
                name: "第三者検証可能性",
                question: "外部の第三者が独立して監査証跡を検証できますか？",
                s0: "外部検証機能なし。監査証跡は内部専用または存在しない。",
                s1: "部分的に検証可能。一部のログはエクスポート可能だが、暗号学的証明なし。",
                s2: "完全な第三者検証。暗号学的証明（ハッシュチェーン、署名）により独立検証が可能。"
            },
            c2: {
                name: "改ざん証拠",
                question: "不正な変更を検知できますか？",
                s0: "改ざん検知なし。ログは検知なく変更可能。",
                s1: "基本的な改ざん検知。チェックサムやタイムスタンプはあるが暗号学的にリンクされていない。",
                s2: "強力な改ざん証拠。ハッシュチェーン、マークルツリー、またはブロックチェーンアンカリングがあらゆる変更を検知。"
            },
            c3: {
                name: "順序固定",
                question: "時系列順序が不変に記録されていますか？",
                s0: "順序保証なし。イベントは並べ替えやバックデートが可能。",
                s1: "タイムスタンプはあるが暗号学的に固定されていない。順序はシステムクロックの整合性に依存。",
                s2: "不変の順序。UUIDv7または同等の機能が暗号学的に固定された順序を提供。"
            },
            c4: {
                name: "意思決定来歴",
                question: "意思決定の入力と根拠を追跡できますか？",
                s0: "意思決定追跡なし。出力は記録されるが入力/根拠は不明。",
                s1: "部分的な来歴。一部の入力はログに記録されるが、入力から出力までの完全なチェーンがない。",
                s2: "完全な来歴。入力から処理、根拠付きの出力までの完全な監査証跡。"
            },
            c5: {
                name: "責任境界",
                question: "各アクションの承認者とオーバーライド者が明確ですか？",
                s0: "帰属なし。アクションは記録された人的責任なしに発生。",
                s1: "部分的な帰属。一部のアクションは帰属されるがオーバーライド/承認ログにギャップあり。",
                s2: "完全な帰属。すべてのアクションに明確な所有者があり、すべてのオーバーライドが正当化とともに記録。"
            },
            c6: {
                name: "ドキュメントの完全性",
                question: "技術文書は完全で最新ですか？",
                s0: "ドキュメントなし、または著しく古い（12ヶ月以上）。",
                s1: "部分的なドキュメント。主要文書は存在するがギャップまたは古いセクションあり。",
                s2: "完全なドキュメント。必要なすべての文書が最新でバージョン管理されている。"
            },
            c7: {
                name: "保持と可用性",
                question: "証拠は必要な期間保持され、取得可能ですか？",
                s0: "保持ポリシーなし、または3ヶ月未満の保持。",
                s1: "部分的な準拠。保持は存在するが取得がテストされていないか不完全。",
                s2: "完全な準拠。検証済みの取得機能を備えた6ヶ月以上の保持。"
            },
            c8: {
                name: "時刻同期",
                question: "システム時刻は信頼できるソースと同期されていますか？",
                s0: "時刻同期なし。システムクロックは大幅にドリフトする可能性あり。",
                s1: "基本的なNTP同期。ミリ秒レベルの精度。",
                s2: "高精度同期。PTPまたは同等の機能でマイクロ秒精度とドリフト監視。"
            },
            c9: {
                name: "障害と復旧のログ",
                question: "システム障害と復旧が記録されていますか？",
                s0: "障害ログなし。停止やエラーは体系的に記録されていない。",
                s1: "基本的なエラーログ。主要な障害は記録されるが復旧アクションが不完全。",
                s2: "包括的なログ。すべての障害、根本原因、復旧アクションがタイムスタンプ付きで記録。"
            },
            c10: {
                name: "削除権互換性",
                question: "監査可能性を維持しながらGDPRの削除権をサポートできますか？",
                s0: "削除機能なし、または削除が監査整合性を破壊。",
                s1: "基本的な削除。データは削除できるが監査証跡にギャップが生じる。",
                s2: "暗号シュレッディングまたは同等。監査整合性を維持しながら個人データを削除可能。"
            }
        }
    },

    // ===== Chinese (Simplified) =====
    zh: {
        meta: {
            lang: "zh",
            langName: "中文",
            dir: "ltr"
        },
        nav: {
            home: "首页",
            assessment: "自我评估",
            registry: "公开注册",
            docs: "文档"
        },
        hero: {
            title1: "可验证的AI溯源",
            title2: "评估测试",
            subtitle: "使用标准化的评分框架，衡量您的AI系统的<strong>可审计性</strong>、<strong>可验证性</strong>和<strong>监管准备度</strong>。",
            startBtn: "开始自我评估",
            docsBtn: "阅读文档"
        },
        features: {
            score: {
                title: "基于评分的评估",
                desc: "10项标准 × 0-2分 = 20分制，支持持续改进追踪"
            },
            regulatory: {
                title: "监管合规",
                desc: "映射到EU AI Act、MiFID II、SEC 17a-4、GDPR和DORA要求"
            },
            evidence: {
                title: "证据包",
                desc: "生成可下载的评估报告和结构化证据包"
            },
            threshold: {
                title: "阈值标识",
                desc: "用于采购和监管报告的可选解释性标签"
            }
        },
        philosophy: {
            quote: "验证，而非信任",
            desc: "评估AI系统的审计痕迹是否以数学可验证的形式存在。"
        },
        assessment: {
            title: "自我评估",
            subtitle: "使用10项可审计性标准评估您的AI系统",
            systemInfo: "系统信息",
            orgName: "组织名称",
            orgPlaceholder: "您的组织",
            systemName: "AI系统名称",
            systemPlaceholder: "被评估的系统",
            assessorName: "评估者姓名",
            assessorPlaceholder: "您的姓名",
            assessorEmail: "评估者邮箱",
            emailPlaceholder: "your@email.com",
            criteria: "评估标准",
            notes: "附加说明",
            notesPlaceholder: "任何额外的观察或背景信息...",
            progress: "进度",
            criteriaCount: "{0}/10 项标准",
            thresholdDesignations: "阈值标识",
            generateReport: "生成报告 (PDF)",
            downloadEvidence: "下载证据 (JSON)",
            reset: "重置评估",
            notScored: "未评分",
            score: "评分",
            keyQuestion: "关键问题",
            evidenceExamples: "证据示例",
            disclaimer: "这是一个自我评估工具（VAP-AT 级别1）。结果是初步的，未经独立验证。阈值标识是解释性标签，不是法律合规保证。"
        },
        grades: {
            strong: "强健",
            moderate: "中等",
            limited: "有限",
            inadequate: "不足"
        },
        designations: {
            euAiAct: "符合EU AI Act",
            mifid: "符合MiFID II",
            baseline: "基线"
        },
        registry: {
            title: "公开注册",
            subtitle: "已完成VAP-AT评估的实体",
            search: "搜索组织...",
            all: "全部",
            organization: "组织",
            system: "系统",
            grade: "等级",
            level: "级别",
            cab: "评估机构",
            validUntil: "有效期至",
            status: "状态",
            active: "有效",
            suspended: "暂停",
            pending: "审核中",
            launching: "🚀 注册将于2026年第三季度启动",
            beFirst: "成为首批获评估的组织",
            note: "公开注册仅显示评估状态和等级。详细评分（0-20）和证据包分别提供给NDA签署方和监管机构。"
        },
        docs: {
            title: "文档",
            download: "下载章程 (MD)",
            overview: "概述",
            scoring: "评分标准",
            levels: "评估级别",
            designations: "阈值标识",
            governance: "治理",
            faq: "常见问题"
        },
        footer: {
            by: "由VeritasChain标准组织提供",
            contact: "联系我们",
            copyright: "© 2025 VeritasChain Standards Organization. 基于CC BY 4.0许可。"
        },
        confirm: {
            reset: "确定要重置所有评分吗？此操作无法撤销。"
        },
        criteria: {
            c1: {
                name: "第三方可验证性",
                question: "外部第三方能否独立验证审计痕迹？",
                s0: "无外部验证能力。审计痕迹仅限内部或不存在。",
                s1: "部分可验证。部分日志可导出但无加密证明。",
                s2: "完全第三方验证。加密证明（哈希链、签名）支持独立验证。"
            },
            c2: {
                name: "篡改证据",
                question: "能否检测未授权的修改？",
                s0: "无篡改检测。日志可被修改而不被发现。",
                s1: "基本篡改检测。有校验和或时间戳但未加密链接。",
                s2: "强篡改证据。哈希链、默克尔树或区块链锚定可检测任何修改。"
            },
            c3: {
                name: "序列固定",
                question: "时间顺序是否不可变地记录？",
                s0: "无序列保证。事件可能被重新排序或回溯。",
                s1: "有时间戳但未加密固定。顺序依赖系统时钟完整性。",
                s2: "不可变序列。UUIDv7或类似机制提供加密固定的排序。"
            },
            c4: {
                name: "决策溯源",
                question: "能否追溯决策的输入和依据？",
                s0: "无决策追踪。输出被记录但输入/依据未知。",
                s1: "部分溯源。部分输入被记录但从输入到输出的链条不完整。",
                s2: "完全溯源。从输入到处理再到输出的完整审计痕迹及依据。"
            },
            c5: {
                name: "责任边界",
                question: "每个操作的批准者和覆盖者是否明确？",
                s0: "无归属。操作发生时没有记录的人员责任。",
                s1: "部分归属。部分操作有归属但覆盖/批准日志有缺口。",
                s2: "完全归属。每个操作都有明确的负责人；所有覆盖都有理由记录。"
            },
            c6: {
                name: "文档完整性",
                question: "技术文档是否完整且最新？",
                s0: "无文档或严重过时（超过12个月）。",
                s1: "部分文档。关键文档存在但有缺口或过时部分。",
                s2: "完整文档。所有必需文档都是最新的并有版本控制。"
            },
            c7: {
                name: "保留与可用性",
                question: "证据是否在要求的期限内保留并可检索？",
                s0: "无保留策略或保留少于3个月。",
                s1: "部分合规。有保留但检索未测试或不完整。",
                s2: "完全合规。6个月以上保留并有经验证的检索能力。"
            },
            c8: {
                name: "时间同步",
                question: "系统时间是否与可信来源同步？",
                s0: "无时间同步。系统时钟可能严重漂移。",
                s1: "基本NTP同步。毫秒级精度。",
                s2: "高精度同步。PTP或同等机制，微秒精度并有漂移监控。"
            },
            c9: {
                name: "故障与恢复日志",
                question: "系统故障和恢复是否被记录？",
                s0: "无故障日志。中断和错误未系统性记录。",
                s1: "基本错误日志。主要故障被记录但恢复操作不完整。",
                s2: "全面日志。所有故障、根本原因和恢复操作都带时间戳记录。"
            },
            c10: {
                name: "删除权兼容性",
                question: "能否在保持可审计性的同时支持GDPR删除权？",
                s0: "无删除能力，或删除会破坏审计完整性。",
                s1: "基本删除。数据可删除但会导致审计痕迹缺口。",
                s2: "加密销毁或同等机制。可删除个人数据同时保持审计完整性。"
            }
        }
    },

    // ===== Spanish =====
    es: {
        meta: {
            lang: "es",
            langName: "Español",
            dir: "ltr"
        },
        nav: {
            home: "Inicio",
            assessment: "Autoevaluación",
            registry: "Registro",
            docs: "Documentación"
        },
        hero: {
            title1: "Procedencia de IA Verificable",
            title2: "Prueba de Evaluación",
            subtitle: "Mida la <strong>Auditabilidad</strong>, <strong>Verificabilidad</strong> y <strong>Preparación Regulatoria</strong> de su sistema de IA con un marco estandarizado basado en puntuación.",
            startBtn: "Iniciar Autoevaluación",
            docsBtn: "Leer Documentación"
        },
        features: {
            score: {
                title: "Evaluación Basada en Puntuación",
                desc: "10 criterios × 0-2 puntos = escala de 20 puntos con seguimiento de mejora continua"
            },
            regulatory: {
                title: "Alineación Regulatoria",
                desc: "Mapeado a requisitos de EU AI Act, MiFID II, SEC 17a-4, GDPR y DORA"
            },
            evidence: {
                title: "Paquete de Evidencia",
                desc: "Genere informes de evaluación descargables y paquetes de evidencia estructurados"
            },
            threshold: {
                title: "Designaciones de Umbral",
                desc: "Etiquetas interpretativas opcionales para adquisiciones e informes regulatorios"
            }
        },
        philosophy: {
            quote: "Verificar, No Confiar",
            desc: "Evaluando que las pistas de auditoría para sistemas de IA existan en una forma matemáticamente verificable."
        },
        assessment: {
            title: "Autoevaluación",
            subtitle: "Evalúe su sistema de IA en 10 criterios de auditabilidad",
            systemInfo: "Información del Sistema",
            orgName: "Nombre de la Organización",
            orgPlaceholder: "Su organización",
            systemName: "Nombre del Sistema de IA",
            systemPlaceholder: "Sistema a evaluar",
            assessorName: "Nombre del Evaluador",
            assessorPlaceholder: "Su nombre",
            assessorEmail: "Email del Evaluador",
            emailPlaceholder: "su@email.com",
            criteria: "Criterios de Evaluación",
            notes: "Notas Adicionales",
            notesPlaceholder: "Cualquier observación o contexto adicional...",
            progress: "Progreso",
            criteriaCount: "{0}/10 criterios",
            thresholdDesignations: "Designaciones de Umbral",
            generateReport: "Generar Informe (PDF)",
            downloadEvidence: "Descargar Evidencia (JSON)",
            reset: "Reiniciar Evaluación",
            notScored: "Sin Puntuar",
            score: "Puntuación",
            keyQuestion: "Pregunta Clave",
            evidenceExamples: "Ejemplos de Evidencia",
            disclaimer: "Esta es una herramienta de autoevaluación (VAP-AT Nivel 1). Los resultados son preliminares y no están verificados independientemente. Las Designaciones de Umbral son etiquetas interpretativas, no garantías de cumplimiento legal."
        },
        grades: {
            strong: "Fuerte",
            moderate: "Moderado",
            limited: "Limitado",
            inadequate: "Inadecuado"
        },
        designations: {
            euAiAct: "Alineado EU AI Act",
            mifid: "Alineado MiFID II",
            baseline: "Línea Base"
        },
        registry: {
            title: "Registro Público",
            subtitle: "Entidades con evaluaciones VAP-AT",
            search: "Buscar organizaciones...",
            all: "Todos",
            organization: "Organización",
            system: "Sistema",
            grade: "Grado",
            level: "Nivel",
            cab: "OEC",
            validUntil: "Válido Hasta",
            status: "Estado",
            active: "Activo",
            suspended: "Suspendido",
            pending: "Pendiente",
            launching: "🚀 El registro se lanzará en Q3 2026",
            beFirst: "Sea de las primeras organizaciones evaluadas",
            note: "El Registro Público muestra solo el estado de evaluación y el grado. Las puntuaciones detalladas (0-20) y los Paquetes de Evidencia están disponibles para firmantes de NDA y reguladores respectivamente."
        },
        docs: {
            title: "Documentación",
            download: "Descargar Carta (MD)",
            overview: "Descripción General",
            scoring: "Criterios de Puntuación",
            levels: "Niveles de Evaluación",
            designations: "Designaciones de Umbral",
            governance: "Gobernanza",
            faq: "FAQ"
        },
        footer: {
            by: "por VeritasChain Standards Organization",
            contact: "Contacto",
            copyright: "© 2025 VeritasChain Standards Organization. Licenciado bajo CC BY 4.0."
        },
        confirm: {
            reset: "¿Está seguro de que desea reiniciar todas las puntuaciones? Esta acción no se puede deshacer."
        },
        criteria: {
            c1: {
                name: "Verificabilidad por Terceros",
                question: "¿Pueden terceros externos verificar independientemente las pistas de auditoría?",
                s0: "Sin capacidad de verificación externa. Las pistas de auditoría son solo internas o inexistentes.",
                s1: "Verificación parcial posible. Algunos registros exportables pero sin prueba criptográfica.",
                s2: "Verificación completa por terceros. Pruebas criptográficas (cadenas hash, firmas) permiten verificación independiente."
            },
            c2: {
                name: "Evidencia de Manipulación",
                question: "¿Se pueden detectar modificaciones no autorizadas?",
                s0: "Sin detección de manipulación. Los registros pueden modificarse sin detección.",
                s1: "Detección básica de manipulación. Checksums o timestamps presentes pero no vinculados criptográficamente.",
                s2: "Fuerte evidencia de manipulación. Cadenas hash, árboles Merkle o anclaje blockchain detectan cualquier modificación."
            },
            c3: {
                name: "Fijación de Secuencia",
                question: "¿Se registra inmutablemente el orden cronológico?",
                s0: "Sin garantía de secuencia. Los eventos pueden reordenarse o antedatarse.",
                s1: "Timestamps presentes pero no fijados criptográficamente. El orden depende de la integridad del reloj del sistema.",
                s2: "Secuencia inmutable. UUIDv7 o similar proporciona ordenamiento fijado criptográficamente."
            },
            c4: {
                name: "Procedencia de Decisiones",
                question: "¿Se pueden rastrear las entradas y fundamentos de las decisiones?",
                s0: "Sin seguimiento de decisiones. Se registran salidas pero entradas/fundamentos desconocidos.",
                s1: "Procedencia parcial. Algunas entradas registradas pero cadena incompleta de entrada a salida.",
                s2: "Procedencia completa. Pista de auditoría completa desde entradas a través del procesamiento hasta salidas con fundamentos."
            },
            c5: {
                name: "Límites de Responsabilidad",
                question: "¿Están claros los aprobadores y anuladores de cada acción?",
                s0: "Sin atribución. Las acciones ocurren sin responsabilidad humana registrada.",
                s1: "Atribución parcial. Algunas acciones atribuidas pero brechas en registro de anulación/aprobación.",
                s2: "Atribución completa. Cada acción tiene propietario claro; todas las anulaciones registradas con justificación."
            },
            c6: {
                name: "Completitud de Documentación",
                question: "¿La documentación técnica está completa y actualizada?",
                s0: "Sin documentación o severamente desactualizada (>12 meses).",
                s1: "Documentación parcial. Documentos clave existen pero con brechas o secciones desactualizadas.",
                s2: "Documentación completa. Todos los documentos requeridos actualizados y con control de versiones."
            },
            c7: {
                name: "Retención y Disponibilidad",
                question: "¿Se retiene y puede recuperarse la evidencia durante los períodos requeridos?",
                s0: "Sin política de retención o retención <3 meses.",
                s1: "Cumplimiento parcial. Existe retención pero recuperación no probada o incompleta.",
                s2: "Cumplimiento total. Retención de 6+ meses con capacidad de recuperación verificada."
            },
            c8: {
                name: "Sincronización de Tiempo",
                question: "¿El tiempo del sistema está sincronizado con fuentes confiables?",
                s0: "Sin sincronización de tiempo. El reloj del sistema puede derivar significativamente.",
                s1: "Sincronización NTP básica. Precisión a nivel de milisegundos.",
                s2: "Sincronización de alta precisión. PTP o equivalente con precisión de microsegundos y monitoreo de deriva."
            },
            c9: {
                name: "Registro de Fallos y Recuperación",
                question: "¿Se registran los fallos del sistema y las recuperaciones?",
                s0: "Sin registro de fallos. Interrupciones y errores no registrados sistemáticamente.",
                s1: "Registro básico de errores. Fallos mayores registrados pero acciones de recuperación incompletas.",
                s2: "Registro exhaustivo. Todos los fallos, causas raíz y acciones de recuperación registradas con timestamps."
            },
            c10: {
                name: "Compatibilidad con Derecho de Supresión",
                question: "¿Se puede soportar el derecho de supresión GDPR manteniendo la auditabilidad?",
                s0: "Sin capacidad de supresión, o la supresión destruye la integridad de auditoría.",
                s1: "Supresión básica. Los datos pueden eliminarse pero resultan brechas en la pista de auditoría.",
                s2: "Crypto-shredding o equivalente. Datos personales eliminables manteniendo la integridad de auditoría."
            }
        }
    }
};

// Current language
let currentLang = 'en';

// Get translation
function t(key) {
    const keys = key.split('.');
    let value = i18n[currentLang];
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to English
            value = i18n['en'];
            for (const k2 of keys) {
                value = value?.[k2];
            }
            break;
        }
    }
    return value || key;
}

// Set language
function setLanguage(lang) {
    if (i18n[lang]) {
        currentLang = lang;
        localStorage.setItem('vap-at-lang', lang);
        applyTranslations();
        updateLangSelector();
    }
}

// Get current language
function getCurrentLang() {
    return currentLang;
}

// Initialize language
function initLanguage() {
    // Check localStorage
    const saved = localStorage.getItem('vap-at-lang');
    if (saved && i18n[saved]) {
        currentLang = saved;
    } else {
        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (i18n[browserLang]) {
            currentLang = browserLang;
        }
    }
}
