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
 *
 * Make sure to include:
 *   - /assets/css/main.css for styling
 *   - Font Awesome for icons
 */

class VCPHeader extends HTMLElement {
    constructor() {
        super();

        // Translation data for all supported languages
        this.translations = {
            en: {
                vcp: 'VCP',
                specification: 'Specification',
                explorer: 'Explorer',
                launchExplorer: '🚀 Launch Explorer',
                solutions: 'Solutions',
                forExchanges: 'For Exchanges & Brokers',
                forPropFirms: 'For Prop Firms',
                certification: 'Certification',
                vcCertified: 'VC-Certified',
                faq: 'FAQ (Scope / Limitations)',
                applyCertification: 'Apply for Certification',
                standards: 'Standards',
                vcpProtocol: 'VCP Protocol',
                developersIntegration: 'Developers / Integration',
                developers: 'Developers',
                about: 'About',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI Spec',
                github: 'GitHub (vcp-explorer-api)',
                vso: 'VSO',
                company: 'Company',
                partners: 'Ecosystem Partners',
                pressKit: 'Press Kit',
                legal: 'Legal',
                support: 'Support'
            },
            ja: {
                vcp: 'VCP',
                specification: '仕様書',
                explorer: 'エクスプローラー',
                launchExplorer: '🚀 エクスプローラーを起動',
                solutions: 'ソリューション',
                forExchanges: '取引所・ブローカー向け',
                forPropFirms: 'プロップファーム向け',
                certification: '認証',
                vcCertified: 'VC-Certified',
                faq: 'FAQ（範囲と制限）',
                applyCertification: '認証を申請',
                standards: '標準規格',
                vcpProtocol: 'VCPプロトコル',
                developersIntegration: '開発者 / 統合',
                developers: '開発者',
                about: '概要',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI仕様',
                github: 'GitHub (vcp-explorer-api)',
                vso: 'VSO',
                company: '会社情報',
                partners: 'エコシステムパートナー',
                pressKit: 'プレスキット',
                legal: '法務情報',
                support: 'サポート'
            },
            zh: {
                vcp: 'VCP',
                specification: '技术规范',
                explorer: '浏览器',
                launchExplorer: '🚀 启动浏览器',
                solutions: '解决方案',
                forExchanges: '交易所和经纪商',
                forPropFirms: '自营交易公司',
                certification: '认证',
                vcCertified: 'VC-Certified',
                faq: '常见问题（范围/限制）',
                applyCertification: '申请认证',
                standards: '标准',
                vcpProtocol: 'VCP协议',
                developersIntegration: '开发者 / 集成',
                developers: '开发者',
                about: '关于',
                explorerApi: 'Explorer API',
                openApiSpec: 'OpenAPI规范',
                github: 'GitHub (vcp-explorer-api)',
                vso: 'VSO',
                company: '公司信息',
                partners: '生态系统合作伙伴',
                pressKit: '媒体资料',
                legal: '法律信息',
                support: '支持'
            }
        };
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'show-lang-switcher'];
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

        this.innerHTML = `
        <nav class="main-nav ${themeClass}">
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <span class="logo-icon">🔱</span>
                    <span class="logo-text">VeritasChain</span>
                </a>

                <!-- Mobile Menu Toggle -->
                <button class="nav-toggle" aria-label="Toggle navigation">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div class="nav-menu">
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.vcp} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vcp/specification/" class="dropdown-item">${t.specification}</a>
                            <a href="/explorer/" class="dropdown-item">${t.explorer}</a>
                            <a href="/explorer/app/" class="dropdown-item dropdown-item-highlight">${t.launchExplorer}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.solutions} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/solutions/exchanges/" class="dropdown-item">${t.forExchanges}</a>
                            <a href="/propfirms/" class="dropdown-item">${t.forPropFirms}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.certification} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/certified/" class="dropdown-item">${t.vcCertified}</a>
                            <a href="/certified/faq/" class="dropdown-item">${t.faq}</a>
                            <a href="/certified/apply" class="dropdown-item">${t.applyCertification}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.standards} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="https://github.com/VeritasChain/vcp-spec" class="dropdown-item" target="_blank" rel="noopener">${t.vcpProtocol}</a>
                            <a href="/vcp/developers/" class="dropdown-item">${t.developersIntegration}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.developers} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vcp/developers/" class="dropdown-item">${t.about}</a>
                            <a href="https://veritaschain.github.io/vcp-explorer-api/" class="dropdown-item" target="_blank" rel="noopener">${t.explorerApi}</a>
                            <a href="https://raw.githubusercontent.com/veritaschain/vcp-explorer-api/main/openapi.yaml" class="dropdown-item" target="_blank" rel="noopener">${t.openApiSpec}</a>
                            <a href="https://github.com/veritaschain/vcp-explorer-api" class="dropdown-item" target="_blank" rel="noopener">${t.github}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.about} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vso" class="dropdown-item">${t.vso}</a>
                            <a href="/company/" class="dropdown-item">${t.company}</a>
                            <a href="/partners/" class="dropdown-item">${t.partners}</a>
                            <a href="/press/" class="dropdown-item">${t.pressKit}</a>
                            <a href="/legal/" class="dropdown-item">${t.legal}</a>
                        </div>
                    </div>

                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            ${t.support} <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/support/" class="dropdown-item">${t.support}</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        ${showLangSwitcher ? `
        <!-- Language Switcher -->
        <div class="language-switcher ${themeClass}">
            <a href="${langUrls.zh}" class="lang-link ${lang === 'zh' ? 'active' : ''}">🇨🇳 中文</a>
            <span class="lang-separator">|</span>
            <a href="${langUrls.ja}" class="lang-link ${lang === 'ja' ? 'active' : ''}">🇯🇵 日本語</a>
            <span class="lang-separator">|</span>
            <a href="${langUrls.en}" class="lang-link ${lang === 'en' ? 'active' : ''}">🇬🇧 English</a>
        </div>
        ` : ''}
        `;

        this.initializeNavigation();
    }

    detectLanguage() {
        const path = window.location.pathname;
        // Language code is at the end of the path: /path/to/page/ja or /path/to/page/zh
        if (path.endsWith('/ja') || path.endsWith('/ja/')) {
            return 'ja';
        } else if (path.endsWith('/zh') || path.endsWith('/zh/')) {
            return 'zh';
        }
        return 'en';
    }

    generateLangUrls() {
        const path = window.location.pathname;

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
            ja: basePath + 'ja',
            zh: basePath + 'zh'
        };
    }

    initializeNavigation() {
        // Mobile Menu Toggle
        const navToggle = this.querySelector('.nav-toggle');
        const navMenu = this.querySelector('.nav-menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Dropdown functionality for desktop
        const dropdowns = this.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            // Desktop: hover behavior
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }
            });

            // Mobile: click behavior
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (window.innerWidth > 768) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        menu.style.transform = 'translateY(-10px)';
                    }
                });
            }
        });
    }
}

// Register the custom element
customElements.define('vcp-header', VCPHeader);
