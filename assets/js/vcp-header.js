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
 * Font Awesome is required for icons.
 */

// Auto-load vcp-header.css if not already loaded
(function() {
    const cssId = 'vcp-header-css';
    if (!document.getElementById(cssId)) {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        // Determine the base path from the script location
        const scripts = document.getElementsByTagName('script');
        let basePath = '/assets/css/';
        for (let i = 0; i < scripts.length; i++) {
            const src = scripts[i].src;
            if (src.includes('vcp-header.js')) {
                basePath = src.replace('/js/vcp-header.js', '/css/');
                break;
            }
        }
        link.href = basePath + 'vcp-header.css';
        head.appendChild(link);
    }
})();

class VCPHeader extends HTMLElement {
    constructor() {
        super();

        // Translation data for all supported languages
        this.translations = {
            en: {
                vcp: 'VCP',
                whatIsVcp: 'What is VCP?',
                specification: 'Specification',
                explorer: 'Explorer',
                launchExplorer: '🚀 Launch Explorer',
                solutions: 'Solutions',
                useCases: 'Use Cases',
                forExchanges: 'For Exchanges & Brokers',
                forPropFirms: 'For Prop Firms',
                vcpSec: 'VCP & SEC',
                certification: 'Certification',
                vcCertified: 'VC-Certified',
                faq: 'FAQ (Scope / Limitations)',
                applyCertification: 'Apply for Certification',
                standards: 'Standards',
                vcpProtocol: 'VCP Protocol',
                standardizationRoadmap: 'Standardization Roadmap',
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
                privacy: 'Privacy Policy',
                terms: 'Terms of Use',
                impressum: 'Impressum',
                mediaPress: 'Media & Press',
                support: 'Support'
            },
            ja: {
                vcp: 'VCP',
                whatIsVcp: 'VCPとは',
                specification: '仕様書',
                explorer: 'エクスプローラー',
                launchExplorer: '🚀 エクスプローラーを起動',
                solutions: 'ソリューション',
                useCases: 'ユースケース',
                forExchanges: '取引所・ブローカー向け',
                forPropFirms: 'プロップファーム向け',
                vcpSec: 'VCP & SEC',
                certification: '認証',
                vcCertified: 'VC-Certified',
                faq: 'FAQ（範囲と制限）',
                applyCertification: '認証を申請',
                standards: '標準規格',
                vcpProtocol: 'VCPプロトコル',
                standardizationRoadmap: '標準化ロードマップ',
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
                privacy: '個人情報保護方針',
                terms: '利用規約',
                impressum: 'インプリント',
                mediaPress: 'メディア',
                support: 'サポート'
            },
            zh: {
                vcp: 'VCP',
                whatIsVcp: '什么是VCP',
                specification: '技术规范',
                explorer: '浏览器',
                launchExplorer: '🚀 启动浏览器',
                solutions: '解决方案',
                useCases: '用例',
                forExchanges: '交易所和经纪商',
                forPropFirms: '自营交易公司',
                vcpSec: 'VCP & SEC',
                certification: '认证',
                vcCertified: 'VC-Certified',
                faq: '常见问题（范围/限制）',
                applyCertification: '申请认证',
                standards: '标准',
                vcpProtocol: 'VCP协议',
                standardizationRoadmap: '标准化路线图',
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
                privacy: '隐私政策',
                terms: '服务条款',
                impressum: '出版信息',
                mediaPress: '媒体与新闻',
                support: '支持'
            }
        };
    }

    static get observedAttributes() {
        return ['theme', 'lang', 'show-lang-switcher', 'available-langs'];
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
        <nav class="main-nav ${themeClass}">
            <div class="nav-container">
                <a href="/" class="nav-logo">
                    <span class="logo-icon">🛡️</span>
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
                            <a href="/what-is-vcp/" class="dropdown-item">${t.whatIsVcp}</a>
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
                            <a href="/use-cases/" class="dropdown-item">${t.useCases}</a>
                            <a href="/solutions/exchanges/" class="dropdown-item">${t.forExchanges}</a>
                            <a href="/propfirms/" class="dropdown-item">${t.forPropFirms}</a>
                            <a href="/sec/" class="dropdown-item">${t.vcpSec}</a>
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
                            <a href="/standardization/" class="dropdown-item">${t.standardizationRoadmap}</a>
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
                            <a href="/privacy/" class="dropdown-item">${t.privacy}</a>
                            <a href="/terms/" class="dropdown-item">${t.terms}</a>
                            <a href="/impressum/" class="dropdown-item">${t.impressum}</a>
                            <a href="/media/" class="dropdown-item">${t.mediaPress}</a>
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
            ${this.generateLangSwitcherLinks(availableLangs, langUrls, lang)}
        </div>
        ` : ''}
        `;

        this.initializeNavigation();
    }

    detectLanguage() {
        const path = window.location.pathname;
        // Support both URL patterns:
        // 1. Suffix pattern: /path/to/page/ja or /path/to/page/zh
        // 2. Prefix pattern: /ja/path/to/page or /zh/path/to/page
        
        // Check suffix pattern first (newer style)
        if (path.endsWith('/ja') || path.endsWith('/ja/')) {
            return 'ja';
        } else if (path.endsWith('/zh') || path.endsWith('/zh/')) {
            return 'zh';
        }
        
        // Check prefix pattern (legacy style)
        if (path.startsWith('/ja/') || path === '/ja') {
            return 'ja';
        } else if (path.startsWith('/zh/') || path === '/zh') {
            return 'zh';
        }
        
        return 'en';
    }

    generateLangUrls() {
        const path = window.location.pathname;

        // Detect which URL pattern is being used
        const isPrefixPattern = path.startsWith('/ja/') || path.startsWith('/zh/') || path === '/ja' || path === '/zh';
        
        if (isPrefixPattern) {
            // Prefix pattern: /ja/company/ or /zh/company/
            // Remove language prefix to get the base path
            let basePath = path;
            if (path.startsWith('/ja/')) {
                basePath = path.replace(/^\/ja\//, '/');
            } else if (path.startsWith('/zh/')) {
                basePath = path.replace(/^\/zh\//, '/');
            } else if (path === '/ja' || path === '/zh') {
                basePath = '/';
            }
            
            // Ensure basePath ends with /
            if (!basePath.endsWith('/')) {
                basePath = basePath + '/';
            }
            
            // Generate URLs with prefix pattern
            return {
                en: basePath,
                ja: '/ja' + basePath.slice(0, -1),  // Remove trailing slash for cleaner URL
                zh: '/zh' + basePath.slice(0, -1)
            };
        } else {
            // Suffix pattern: /company/ja/ or /company/zh/
            // Remove existing language suffix to get the base path
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

            // Generate URLs with suffix pattern
            return {
                en: basePath,
                ja: basePath + 'ja',
                zh: basePath + 'zh'
            };
        }
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
        // Mobile Menu Toggle
        const navToggle = this.querySelector('.nav-toggle');
        const navMenu = this.querySelector('.nav-menu');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close all dropdowns when closing the menu
            if (!navMenu.classList.contains('active')) {
                const dropdowns = this.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }

        // Dropdown functionality
        const dropdowns = this.querySelectorAll('.dropdown');

         dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            // Desktop: hover behavior (only apply inline styles on desktop)
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 1024) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                }
            });

            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 1024) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }
            });

            // Mobile: click behavior - toggle active class only
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                    
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
                    if (window.innerWidth > 1024) {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        menu.style.transform = 'translateY(-10px)';
                    }
                });
                
                // Also close mobile menu
                if (navToggle && navMenu) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
        
        // Handle window resize - reset inline styles when switching to mobile
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                dropdowns.forEach(dropdown => {
                    const menu = dropdown.querySelector('.dropdown-menu');
                    // Remove desktop inline styles so CSS can control mobile behavior
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                    menu.style.transform = '';
                });
            }
        });
    }
}

// Register the custom element
customElements.define('vcp-header', VCPHeader);
