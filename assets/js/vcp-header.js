/**
 * VCP Header Web Component
 *
 * Usage:
 *   <script src="/assets/js/vcp-header.js"></script>
 *   <vcp-header></vcp-header>
 *
 * Attributes:
 *   - theme: "dark" (default), "light", or "blue"
 *     <vcp-header theme="light"></vcp-header>
 *     <vcp-header theme="blue"></vcp-header>
 *   - lang: "en" (default), "ja", or "zh" - sets active language
 *     <vcp-header lang="ja"></vcp-header>
 *   - show-lang-switcher: "true" (default) or "false" - show/hide language switcher
 *     <vcp-header show-lang-switcher="false"></vcp-header>
 *   - available-langs: comma-separated list of languages to show in switcher (default: "en,ja,zh")
 *     <vcp-header available-langs="en,ja"></vcp-header>
 *
 * The component automatically loads vcp-header.css for styling.
 * Navigation icons are drawn in CSS; no icon font is required.
 */

// Shared progressive enhancements apply to every page using this header.
// Metadata remains in server-delivered HTML; this loader only adds presentation.
(() => {
    const scriptURL = new URL(document.currentScript.src);
    const assetURL = (path) => {
        const url = new URL(path, scriptURL);
        url.search = scriptURL.search;
        return url.href;
    };
    if (!document.getElementById('vcp-header-css')) {
        const css = document.createElement('link');
        css.id = 'vcp-header-css';
        css.rel = 'stylesheet';
        css.href = assetURL('../css/vcp-header.css');
        document.head.appendChild(css);
    }
    if (!document.getElementById('vso-motion-css')) {
        const css = document.createElement('link');
        css.id = 'vso-motion-css';
        css.rel = 'stylesheet';
        css.href = assetURL('../css/site-motion.css');
        document.head.appendChild(css);
        const script = document.createElement('script');
        script.src = assetURL('site-motion.js');
        script.defer = true;
        document.head.appendChild(script);
    }
})();

class VCPHeader extends HTMLElement {
    constructor() {
        super();

        // Translation data for all supported languages
        this.translations = {
            en: {
                frameworkGroup: "Start here",
                profilesGroup: "Domain profiles",
                buildGroup: "Specifications & SDK",
                integrateGroup: "Developer resources",
                tryGroup: "Explore the demos",
                applyGroup: "Explore applications",
                learnGroup: "Practical guides",
                researchGroup: "Research & updates",
                organizationGroup: "Organization",
                governanceGroup: "Policies & transparency",
                explorerDescription: "Inspect synthetic events and evidence.",
                scorecardDescription: "Explore auditability assessments.",
                tamperDescription: "See how changes to records are detected.",
                explorerAboutDescription: "How the Explorer works and its limits.",
                useCasesDescription: "Find an application by context.",
                exchangeDescription: "Evidence for trading infrastructure.",
                evidectDescription: "Security research and evidence design.",
                vapDescription: "The framework, its scope and status.",
                specDescription: "Read the published VCP specification.",
                sdkDescription: "Source, examples and development status.",
                announcementsDescription: "Dated updates and historical records.",
                specsSdk: "Specs & SDK",
                demosUsage: "Demos & use cases",
                researchGuides: "Research & guides",
                aboutVsoNav: "VSO",
                vapSpec: "VAP framework (GitHub)",
                sdk: "VCP SDK (development preview)",
                announcements: "Latest announcements",
                corrections: "Corrections log",
                policies: "Policies & disclosures",
                evidect: "EVIDECT (Japanese)",
                mainNavigation: "Main navigation",
                toggleNavigation: "Toggle navigation",
                vcp: 'VCP',
                whatIsVcp: 'What is VCP?',
                specification: 'Specification',
                explorer: 'About the Explorer',
                launchExplorer: 'Explorer demo',
                solutions: 'Solutions',
                useCases: 'Use Cases',
                forExchanges: 'For Exchanges & Brokers',
                forBrokers: 'For Brokers',
                forPropFirms: 'For Prop Firms',
                vcpSec: 'VCP & SEC',
                certification: 'Certification',
                vcCertified: 'VC-Certified',
                certifiedOverview: 'Overview',
                certifiedApply: 'Status & enquiries',
                certifiedFaq: 'FAQ',
                certifiedCabs: 'CABs',
                vap: 'VAP',
                vapOverview: 'Overview',
                vapDvp: 'DVP - Driving Vehicle',
                vapMap: 'MAP - Medical AI',
                vapEip: 'EIP - Energy Infrastructure',
                vapPap: 'PAP - Public Administration',
                vapIap: 'IAP - Industry Accountability',
                vapCap: 'CAP - Content / Creative',
                vapCpp: 'CPP - Capture Provenance',
                vapLap: 'VAP-LAP - Legal AI (external proposal)',
                vapGam: 'GAM - Gaming (concept)',
                vapAt: 'VAP-AT',
                vapLimits: 'What VAP does not do',
                vapIncidents: 'AI incident verification records',
                faq: 'FAQ (Scope / Limitations)',
                applyCertification: 'Certification status & enquiries',
                standards: 'Standards',
                benchmarks: 'Auditability Benchmark',
                launchScorecard: 'Scorecard Explorer',
                vcpProtocol: 'VCP Protocol',
                standardizationRoadmap: 'Standardization Roadmap',
                tamperEvidenceDemo: 'Tamper-Evidence Demo',
                developersIntegration: 'Developers / Integration',
                developers: 'Developers',
                about: 'About',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI Spec',
                github: 'GitHub (vcp-explorer-api)',
                vcpV11: 'VCP V1.1',
                vcpV12: 'VCP v1.2 Spec (GitHub)',
                vccDemo: 'VCC Demo',
                overview: 'Overview',
                aboutVso: 'About VSO',
                distributedOrganization: 'Distributed Organization',
                vso: 'VSO',
                company: 'Company',
                partners: 'Ecosystem Partners',
                pressKit: 'Press Kit',
                legal: 'Legal',
                privacy: 'Privacy Policy',
                terms: 'Terms of Use',
                commercialLaw: 'Specified Commercial Transactions Act',
                impressum: 'Impressum',
                mediaPress: 'Media & Press',
                blog: 'Blog',
                guides: 'Practical Guides',
                aiAgentGuide: 'AI Agent Audit Logs',
                aiGovernanceGuide: 'AI Governance Guide',
                aiAuditTrailGuide: 'AI Audit Trail Guide',
                siteDirectory: 'All Pages',
                support: 'Support'
            },
            ja: {
                frameworkGroup: "全体像を知る",
                profilesGroup: "領域別の仕様",
                buildGroup: "仕様とSDK",
                integrateGroup: "開発者向け資料",
                tryGroup: "デモを試す",
                applyGroup: "適用を知る",
                learnGroup: "実務ガイド",
                researchGroup: "研究と更新情報",
                organizationGroup: "運営組織",
                governanceGroup: "方針と透明性",
                explorerDescription: "合成イベントと証拠を画面で確認",
                scorecardDescription: "監査可能性の評価内容を確認",
                tamperDescription: "記録の変更が検出される仕組み",
                explorerAboutDescription: "使い方と検証できる範囲",
                useCasesDescription: "利用場面から適用例を探す",
                exchangeDescription: "取引基盤の証拠設計を知る",
                evidectDescription: "セキュリティ調査と証拠設計",
                vapDescription: "フレームワークの構成・範囲・状態",
                specDescription: "公開されているVCPの仕様を読む",
                sdkDescription: "ソース・実行例・開発状況を確認",
                announcementsDescription: "日付付きの更新と過去の記録",
                specsSdk: "仕様・開発",
                demosUsage: "デモ・活用例",
                researchGuides: "研究・ガイド",
                aboutVsoNav: "VSOについて",
                vapSpec: "VAPフレームワーク（GitHub）",
                sdk: "VCP SDK（開発版）",
                announcements: "最新のお知らせ",
                corrections: "訂正ログ",
                policies: "方針・開示",
                evidect: "EVIDECTのサービス",
                mainNavigation: "メインナビゲーション",
                toggleNavigation: "メニューを開閉",
                vcp: 'VCP',
                whatIsVcp: 'VCPとは',
                specification: '仕様書',
                explorer: 'Explorerの概要',
                launchExplorer: 'Explorer デモ',
                solutions: 'ソリューション',
                useCases: 'ユースケース',
                forExchanges: '取引所・ブローカー',
                forBrokers: 'ブローカー向け',
                forPropFirms: 'プロップファーム向け',
                vcpSec: 'VCP & SEC',
                certification: '認証',
                vcCertified: 'VC-Certified',
                certifiedOverview: '概要',
                certifiedApply: '状況・お問い合わせ',
                certifiedFaq: 'FAQ',
                certifiedCabs: 'CABs',
                vap: 'VAP',
                vapOverview: '概要',
                vapDvp: 'DVP - 自動運転車両',
                vapMap: 'MAP - 医療AI',
                vapEip: 'EIP - エネルギーインフラ',
                vapPap: 'PAP - 公共行政',
                vapIap: 'IAP - 産業アカウンタビリティ',
                vapCap: 'CAP - コンテンツ・創作',
                vapCpp: 'CPP - キャプチャ来歴',
                vapLap: 'VAP-LAP - 法律AI（外部提案）',
                vapGam: 'GAM - ゲーミング（構想）',
                vapAt: 'VAP-AT',
                vapLimits: 'VAPにできないこと',
                vapIncidents: 'AI事件の検証記録',
                faq: 'FAQ（範囲と制限）',
                applyCertification: '認証の状況・お問い合わせ',
                standards: '標準規格',
                benchmarks: '監査可能性ベンチマーク',
                launchScorecard: 'スコアカード',
                vcpProtocol: 'VCPプロトコル',
                standardizationRoadmap: '標準化ロードマップ',
                tamperEvidenceDemo: '改ざん検知デモ',
                developersIntegration: '開発者 / 統合',
                developers: '開発者',
                about: '概要',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI仕様',
                github: 'GitHub (vcp-explorer-api)',
                vcpV11: 'VCP V1.1',
                vcpV12: 'VCP v1.2 仕様（GitHub）',
                vccDemo: 'VCC Demo',
                overview: '概要',
                aboutVso: 'VSOの概要',
                distributedOrganization: '分散型組織',
                vso: 'VSO',
                company: '会社情報',
                partners: 'エコシステムパートナー',
                pressKit: 'プレスキット',
                legal: '法務情報',
                privacy: '個人情報保護方針',
                terms: '利用規約',
                commercialLaw: '特定商取引法に基づく表示',
                impressum: 'インプリント',
                mediaPress: 'メディア',
                blog: 'ブログ',
                guides: '実務ガイド一覧',
                aiAgentGuide: 'AIエージェント監査ログ',
                aiGovernanceGuide: 'AIガバナンスガイド',
                aiAuditTrailGuide: 'AI監査ログガイド',
                siteDirectory: 'サイトマップ',
                support: 'サポート'
            },
            zh: {
                frameworkGroup: "了解框架",
                profilesGroup: "领域规范",
                buildGroup: "规范与SDK",
                integrateGroup: "开发资源",
                tryGroup: "体验演示",
                applyGroup: "了解应用",
                learnGroup: "实务指南",
                researchGroup: "研究与更新",
                organizationGroup: "组织信息",
                governanceGroup: "政策与透明度",
                explorerDescription: "查看合成事件与证据。",
                scorecardDescription: "了解可审计性评估。",
                tamperDescription: "了解如何检测记录变更。",
                explorerAboutDescription: "使用方法与验证范围。",
                useCasesDescription: "按使用场景查找应用。",
                exchangeDescription: "交易基础设施的证据设计。",
                evidectDescription: "安全研究与证据设计（日文）。",
                vapDescription: "框架的结构、范围与状态。",
                specDescription: "阅读已公开的VCP规范。",
                sdkDescription: "源码、示例与开发状态。",
                announcementsDescription: "有日期的更新与历史记录。",
                specsSdk: "规范与开发",
                demosUsage: "演示与应用",
                researchGuides: "研究与指南",
                aboutVsoNav: "关于VSO",
                vapSpec: "VAP框架（GitHub）",
                sdk: "VCP SDK（开发版）",
                announcements: "最新公告",
                corrections: "更正日志",
                policies: "政策与披露",
                evidect: "EVIDECT服务（日文）",
                mainNavigation: "主导航",
                toggleNavigation: "展开或收起菜单",
                vcp: 'VCP',
                whatIsVcp: '什么是VCP',
                specification: '技术规范',
                explorer: 'Explorer概述',
                launchExplorer: 'Explorer 演示',
                solutions: '解决方案',
                useCases: '用例',
                forExchanges: '交易所和经纪商',
                forBrokers: '经纪商',
                forPropFirms: '自营交易公司',
                vcpSec: 'VCP & SEC',
                certification: '认证',
                vcCertified: 'VC-Certified',
                certifiedOverview: '概述',
                certifiedApply: '状态与咨询',
                certifiedFaq: '常见问题',
                certifiedCabs: 'CABs',
                vap: 'VAP',
                vapOverview: '概述',
                vapDvp: 'DVP - 自动驾驶车辆',
                vapMap: 'MAP - 医疗AI',
                vapEip: 'EIP - 能源基础设施',
                vapPap: 'PAP - 公共行政',
                vapIap: 'IAP - 行业问责',
                vapCap: 'CAP - 内容 / 创意',
                vapCpp: 'CPP - 捕获来源',
                vapLap: 'VAP-LAP - 法律AI（外部提案）',
                vapGam: 'GAM - 游戏（构想）',
                vapAt: 'VAP-AT',
                vapLimits: 'VAP 的限制（英文）',
                vapIncidents: 'AI 事件核查记录（英文）',
                faq: '常见问题（范围/限制）',
                applyCertification: '认证状态与咨询',
                standards: '标准',
                benchmarks: '可审计性基准',
                launchScorecard: '评分卡浏览器',
                vcpProtocol: 'VCP协议',
                standardizationRoadmap: '标准化路线图',
                tamperEvidenceDemo: '篡改检测演示',
                developersIntegration: '开发者 / 集成',
                developers: '开发者',
                about: '关于',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI规范',
                github: 'GitHub (vcp-explorer-api)',
                vcpV11: 'VCP V1.1',
                vcpV12: 'VCP v1.2 规范（GitHub）',
                vccDemo: 'VCC Demo',
                overview: '概述',
                aboutVso: 'VSO概述',
                distributedOrganization: '分布式组织',
                vso: 'VSO',
                company: '公司信息',
                partners: '生态系统合作伙伴',
                pressKit: '媒体资料',
                legal: '法律信息',
                privacy: '隐私政策',
                terms: '服务条款',
                commercialLaw: '特定商业交易法信息',
                impressum: '出版信息',
                mediaPress: '媒体与新闻',
                blog: '博客',
                guides: '实务指南（英文）',
                aiAgentGuide: 'AI智能体审计日志（英文）',
                aiGovernanceGuide: 'AI治理指南（英文）',
                aiAuditTrailGuide: 'AI审计日志指南（英文）',
                siteDirectory: '网站地图',
                support: '支持'
            }
        };
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'show-lang-switcher', 'available-langs', 'ja-url'];
    }

    connectedCallback() {
        const theme = this.getAttribute('theme') || 'dark';
        const themeClass = theme === 'light' ? 'theme-light' : (theme === 'blue' ? 'theme-blue' : '');

        // Check if language switcher should be shown (default: true)
        const showLangSwitcher = this.getAttribute('show-lang-switcher') !== 'false';

        // Detect current language from URL path or attribute
        const lang = this.getAttribute('lang') || this.detectLanguage();

        // Get translations for current language
        const t = this.translations[lang] || this.translations.en;

        // Generate language-specific URLs for current page
        const langUrls = this.generateLangUrls();

        // Get available languages (default: all three)
        const availableLangsAttr = this.getAttribute('available-langs');
        const availableLangs = availableLangsAttr
            ? availableLangsAttr.split(',').map(l => l.trim())
            : ['en', 'ja', 'zh'];

        this.innerHTML = `
        <nav class="main-nav ${themeClass}" aria-label="${t.mainNavigation}">
            <div class="nav-container">
                <a href="${lang === 'en' ? '/' : `/${lang}/`}" class="nav-logo" aria-label="VeritasChain Standards Organization (VSO)">
                    <img class="logo-image" src="/press/logo-transparent.png" width="40" height="40" alt="" decoding="async">
                    <span class="logo-wordmark"><span class="logo-text">VeritasChain</span><span class="logo-subtitle">VSO · VAP / VCP</span></span>
                </a>

                <!-- Mobile Menu Toggle -->
                <button class="nav-toggle" aria-label="${t.toggleNavigation}" aria-controls="vcp-nav-menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-menu" id="vcp-nav-menu">
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" id="vcp-nav-toggle-0" aria-expanded="false" aria-controls="vcp-nav-panel-0">
                            ${t.vap}<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="dropdown-menu" id="vcp-nav-panel-0" aria-labelledby="vcp-nav-toggle-0">
                            <div class="nav-group"><p class="nav-group-label">${t.frameworkGroup}</p>
                                <a href="/vap/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapOverview}</span><span class="nav-item-description">${t.vapDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/what-is-vcp/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.whatIsVcp}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/vap/limits/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapLimits}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                            <div class="nav-group"><p class="nav-group-label">${t.profilesGroup}</p>
                                <a href="/vap/cap/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapCap}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/vap/cpp/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapCpp}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/vap/lap/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapLap}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" id="vcp-nav-toggle-1" aria-expanded="false" aria-controls="vcp-nav-panel-1">
                            ${t.specsSdk}<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="dropdown-menu" id="vcp-nav-panel-1" aria-labelledby="vcp-nav-toggle-1">
                            <div class="nav-group"><p class="nav-group-label">${t.buildGroup}</p>
                                <a href="/vcp/specification/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.specification}</span><span class="nav-item-description">${t.specDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="https://github.com/veritaschain/vap-spec" class="dropdown-item" target="_blank" rel="noopener noreferrer"><span class="nav-item-copy"><span class="nav-item-title">${t.vapSpec}</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>
                                <a href="https://github.com/veritaschain/vcp-sdk" class="dropdown-item" target="_blank" rel="noopener noreferrer"><span class="nav-item-copy"><span class="nav-item-title">${t.sdk}</span><span class="nav-item-description">${t.sdkDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>
                            </div>
                            <div class="nav-group"><p class="nav-group-label">${t.integrateGroup}</p>
                                <a href="/vcp/developers/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.developersIntegration}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="https://veritaschain.github.io/vcp-explorer-api/" class="dropdown-item" target="_blank" rel="noopener noreferrer"><span class="nav-item-copy"><span class="nav-item-title">${t.explorerApi}</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>
                                <a href="https://raw.githubusercontent.com/veritaschain/vcp-explorer-api/main/openapi.yaml" class="dropdown-item" target="_blank" rel="noopener noreferrer"><span class="nav-item-copy"><span class="nav-item-title">${t.openApiSpec}</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" id="vcp-nav-toggle-2" aria-expanded="false" aria-controls="vcp-nav-panel-2">
                            ${t.demosUsage}<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="dropdown-menu" id="vcp-nav-panel-2" aria-labelledby="vcp-nav-toggle-2">
                            <div class="nav-group"><p class="nav-group-label">${t.tryGroup}</p>
                                <a href="/explorer/app/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.launchExplorer}</span><span class="nav-item-description">${t.explorerDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/benchmark/app/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.launchScorecard}</span><span class="nav-item-description">${t.scorecardDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/regtech/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.tamperEvidenceDemo}</span><span class="nav-item-description">${t.tamperDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                            <div class="nav-group"><p class="nav-group-label">${t.applyGroup}</p>
                                <a href="/explorer/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.explorer}</span><span class="nav-item-description">${t.explorerAboutDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/use-cases/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.useCases}</span><span class="nav-item-description">${t.useCasesDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/solutions/exchanges/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.forExchanges}</span><span class="nav-item-description">${t.exchangeDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="https://evidect.veritaschain.org/" class="dropdown-item" target="_blank" rel="noopener noreferrer"><span class="nav-item-copy"><span class="nav-item-title">${t.evidect}</span><span class="nav-item-description">${t.evidectDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">↗</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" id="vcp-nav-toggle-3" aria-expanded="false" aria-controls="vcp-nav-panel-3">
                            ${t.researchGuides}<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="dropdown-menu" id="vcp-nav-panel-3" aria-labelledby="vcp-nav-toggle-3">
                            <div class="nav-group"><p class="nav-group-label">${t.learnGroup}</p>
                                <a href="/guides/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.guides}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/guides/ai-agent-audit-log/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.aiAgentGuide}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/guides/ai-governance/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.aiGovernanceGuide}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/guides/ai-audit-trail/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.aiAuditTrailGuide}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                            <div class="nav-group"><p class="nav-group-label">${t.researchGroup}</p>
                                <a href="/vso/announcements/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.announcements}</span><span class="nav-item-description">${t.announcementsDescription}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/incidents/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.vapIncidents}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/standardization/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.standardizationRoadmap}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/vso/corrections/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.corrections}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                        </div>
                    </div>
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle" id="vcp-nav-toggle-4" aria-expanded="false" aria-controls="vcp-nav-panel-4">
                            ${t.aboutVsoNav}<span class="nav-chevron" aria-hidden="true"></span>
                        </button>
                        <div class="dropdown-menu" id="vcp-nav-panel-4" aria-labelledby="vcp-nav-toggle-4">
                            <div class="nav-group"><p class="nav-group-label">${t.organizationGroup}</p>
                                <a href="/about/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.aboutVso}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/company/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.company}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/support/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.support}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/sitemap/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.siteDirectory}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                            <div class="nav-group"><p class="nav-group-label">${t.governanceGroup}</p>
                                <a href="/vso/policies/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.policies}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/certified/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.applyCertification}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/certified/cab/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.certifiedCabs}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/privacy/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.privacy}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                                <a href="/terms/" class="dropdown-item"><span class="nav-item-copy"><span class="nav-item-title">${t.terms}</span></span><span class="nav-item-arrow" aria-hidden="true">→</span></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        ${showLangSwitcher ? `
        <!-- Language Switcher - Below header, right aligned -->
        <div class="language-switcher ${themeClass}">
            ${this.generateLangSwitcherLinks(availableLangs, langUrls, lang)}
        </div>
        ` : ''}
        `;

        this.localizeNavigation(lang);
        this.initializeNavigation();
    }

    localizeNavigation(lang) {
        if (!['ja', 'zh'].includes(lang)) return;
        // Only route to translations that exist; English-only tools keep their working URL.
        const translatedRoutes = new Set(["/about/", "/benchmark/", "/blog/", "/certified/", "/certified/apply/", "/certified/cab/", "/certified/faq/", "/company/", "/distributed-organization/", "/docs/brokers/", "/explorer/", "/impressum/", "/law/", "/media/", "/overview/", "/privacy/", "/propfirms/", "/regtech/", "/sec/", "/solutions/exchanges/", "/standardization/", "/support/", "/terms/", "/use-cases/", "/v1-1/", "/vap/", "/vap/at/", "/vap/cap/", "/vap/cpp/", "/vap/dvp/", "/vap/eip/", "/vap/gam/", "/vap/iap/", "/vap/lap/", "/vap/map/", "/vap/pap/", "/vcc/", "/vcp/developers/", "/vso/", "/vso/announcements/", "/vso/corrections/", "/vso/policies/", "/what-is-vcp/"]);
        this.querySelectorAll('.dropdown-menu a[href^="/"]').forEach(link => {
            const path = link.getAttribute('href');
            if (translatedRoutes.has(path) || (lang === 'ja' && ['/guides/', '/guides/ai-agent-audit-log/', '/guides/ai-governance/', '/guides/ai-audit-trail/', '/vap/limits/', '/incidents/'].includes(path))) link.setAttribute('href', `${path}${lang}/`);
        });
    }

    detectLanguage() {
        const path = window.location.pathname.replace(/\/index\.html$/, "/");
        // Language code is at the end of the path: /path/to/page/ja or /path/to/page/zh
        if (path.endsWith('/ja') || path.endsWith('/ja/')) {
            return 'ja';
        } else if (path.endsWith('/zh') || path.endsWith('/zh/')) {
            return 'zh';
        }
        return 'en';
    }

    generateLangUrls() {
        const path = window.location.pathname.replace(/\/index\.html$/, "/");

        // Remove existing language suffix to get the base path
        // Pattern: /path/to/page/ja or /path/to/page/zh
        let basePath = path;
        if (path.endsWith('/ja') || path.endsWith('/ja/')) {
            basePath = path.replace(/\/ja\/?$/, '/');
        } else if (path.endsWith('/zh') || path.endsWith('/zh/')) {
            basePath = path.replace(/\/zh\/?$/, '/');
        }

        // Ensure basePath ends with /
        if (!basePath.endsWith('/')) {
            basePath = basePath + '/';
        }

        // Generate URLs for each language
        // English is the base path, ja/zh are suffixes
        return {
            en: basePath,
            ja: this.getAttribute('ja-url') || basePath + 'ja/',
            zh: basePath + 'zh/'
        };
    }

    generateLangSwitcherLinks(availableLangs, langUrls, currentLang) {
        // Language display configuration
        const langConfig = {
            zh: { flag: '🇨🇳', label: '中文' },
            ja: { flag: '🇯🇵', label: '日本語' },
            en: { flag: '🇬🇧', label: 'English' }
        };

        // Build links for available languages only
        const links = [];
        ['zh', 'ja', 'en'].forEach(langCode => {
            if (availableLangs.includes(langCode)) {
                const config = langConfig[langCode];
                const isActive = currentLang === langCode ? 'active' : '';
                links.push(`<a href="${langUrls[langCode]}" class="lang-link ${isActive}">${config.flag} ${config.label}</a>`);
            }
        });

        // Join with separators
        return links.join('<span class="lang-separator">|</span>');
    }

    initializeNavigation() {
        this.navigationController?.abort();
        const controller = new AbortController();
        this.navigationController = controller;
        const options = { signal: controller.signal };
        const navToggle = this.querySelector('.nav-toggle');
        const navMenu = this.querySelector('.nav-menu');
        const dropdowns = [...this.querySelectorAll('.dropdown')];
        let suppressFocusOpen = false;
        let closeTimer;
        const mobile = () => window.innerWidth <= 1024;
        navMenu.inert = mobile();
        const setOpen = (dropdown, open) => {
            dropdown.classList.toggle('active', open);
            dropdown.querySelector('.dropdown-toggle').setAttribute('aria-expanded', String(open));
        };
        const closeGroups = () => dropdowns.forEach(dropdown => setOpen(dropdown, false));
        const openGroup = dropdown => {
            clearTimeout(closeTimer);
            dropdowns.forEach(other => setOpen(other, other === dropdown));
        };
        const closeNavigation = () => {
            clearTimeout(closeTimer);
            closeGroups();
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.inert = mobile();
        };
        navToggle.addEventListener('click', () => {
            const open = !navMenu.classList.contains('active');
            closeGroups();
            navToggle.classList.toggle('active', open);
            navMenu.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            navMenu.inert = !open;
        }, options);
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            dropdown.addEventListener('mouseenter', () => {
                if (!mobile()) openGroup(dropdown);
            }, options);
            dropdown.addEventListener('mouseleave', () => {
                if (!mobile()) closeTimer = setTimeout(() => {
                    if (!dropdown.contains(document.activeElement)) setOpen(dropdown, false);
                }, 140);
            }, options);
            dropdown.addEventListener('focusin', () => {
                if (!mobile() && !suppressFocusOpen) openGroup(dropdown);
            }, options);
            dropdown.addEventListener('focusout', event => {
                // On mobile, closing on pointer focus would move the next button
                // before mouseup/click. The click handler switches groups atomically.
                if (!mobile() && !dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
            }, options);
            toggle.addEventListener('click', () => {
                if (mobile() && dropdown.classList.contains('active')) setOpen(dropdown, false);
                else openGroup(dropdown);
            }, options);
            toggle.addEventListener('keydown', event => {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    openGroup(dropdown);
                    dropdown.querySelector('.dropdown-item').focus();
                }
            }, options);
        });
        this.addEventListener('keydown', event => {
            if (event.key !== 'Escape') return;
            const active = dropdowns.find(dropdown => dropdown.classList.contains('active'));
            event.preventDefault();
            if (active) {
                setOpen(active, false);
                suppressFocusOpen = true;
                active.querySelector('.dropdown-toggle').focus();
                suppressFocusOpen = false;
            } else {
                closeNavigation();
                if (mobile()) navToggle.focus();
            }
        }, options);
        document.addEventListener('click', event => {
            if (!this.contains(event.target)) closeNavigation();
        }, options);
        let wasMobile = mobile();
        window.addEventListener('resize', () => {
            if (mobile() !== wasMobile) closeNavigation();
            wasMobile = mobile();
        }, options);
        controller.signal.addEventListener('abort', () => clearTimeout(closeTimer), { once: true });
    }

    disconnectedCallback() {
        this.navigationController?.abort();
    }

}

// Register the custom element
customElements.define('vcp-header', VCPHeader);
