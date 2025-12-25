/**
 * VCP Footer Web Component
 *
 * Usage:
 *   <script src="/assets/js/vcp-footer.js"></script>
 *   <vcp-footer></vcp-footer>
 *
 * Attributes:
 *   - theme: "dark" (default) or "light"
 *     <vcp-footer theme="light"></vcp-footer>
 *   - lang: "en" (default), "ja", or "zh" - sets content language
 *     <vcp-footer lang="ja"></vcp-footer>
 *
 * The component automatically loads vcp-footer.css for styling.
 */

// Auto-load vcp-footer.css if not already loaded
(function() {
    const cssId = 'vcp-footer-css';
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
            if (src.includes('vcp-footer.js')) {
                basePath = src.replace('/js/vcp-footer.js', '/css/');
                break;
            }
        }
        link.href = basePath + 'vcp-footer.css';
        head.appendChild(link);
    }
})();

class VCPFooter extends HTMLElement {
    constructor() {
        super();

        // Social media links
        this.socialLinks = [
            { name: 'X', url: 'https://x.com/Veritas_chain', icon: 'fa-brands fa-x-twitter' },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/110199945', icon: 'fa-brands fa-linkedin' },
            { name: 'Facebook', url: 'https://www.facebook.com/veritaschain', icon: 'fa-brands fa-facebook' },
            { name: 'Medium', url: 'https://medium.com/@veritaschain', icon: 'fa-brands fa-medium' },
            { name: 'DEV.to', url: 'https://dev.to/veritaschain', icon: 'fa-brands fa-dev' }
        ];

        // Translation data for all supported languages
        this.translations = {
            en: {
                copyright: '© 2025 VeritasChain Inc. All rights reserved.',
                independence: 'VSO operates independently and does not provide trading services.',
                disclaimer1: 'VSO does not endorse or certify any financial performance claims.',
                disclaimer2: 'All specifications are provided "as-is" without warranties of any kind.',
                organization: 'VeritasChain Standards Organization',
                address: 'Ebisu Office — 2-4-8 Ebisu-Nishi, Shibuya-ku, Tokyo 150-0021, Japan',
                revision: 'VCP Specification v1.0 — Released 2025-01-20 | Next update: v1.1 (Q2 2026)'
            },
            ja: {
                copyright: '© 2025 VeritasChain Inc. All rights reserved.',
                independence: 'VSOは独立して運営されており、取引サービスを提供していません。',
                disclaimer1: 'VSOは金融パフォーマンスに関する主張を保証または認証しません。',
                disclaimer2: 'すべての仕様は「現状のまま」提供され、いかなる種類の保証も伴いません。',
                organization: 'VeritasChain Standards Organization',
                address: '恵比寿オフィス — 〒150-0021 東京都渋谷区恵比寿西2-4-8',
                revision: 'VCP仕様 v1.0 — 2025年1月20日リリース | 次回更新: v1.1 (2026年第2四半期)'
            },
            zh: {
                copyright: '© 2025 VeritasChain Inc. 保留所有权利。',
                independence: 'VSO独立运营，不提供交易服务。',
                disclaimer1: 'VSO不认可或证明任何财务绩效声明。',
                disclaimer2: '所有规范均按"原样"提供，不提供任何形式的保证。',
                organization: 'VeritasChain Standards Organization',
                address: '惠比寿办公室 — 日本东京都涩谷区惠比寿西2-4-8 邮编150-0021',
                revision: 'VCP规范 v1.0 — 2025年1月20日发布 | 下次更新: v1.1 (2026年第二季度)'
            }
        };
    }

    static get observedAttributes() {
        return ['theme', 'lang'];
    }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    detectLanguage() {
        const path = window.location.pathname;
        if (path.endsWith('/ja') || path.endsWith('/ja/')) {
            return 'ja';
        } else if (path.endsWith('/zh') || path.endsWith('/zh/')) {
            return 'zh';
        }
        return 'en';
    }

    render() {
        const theme = this.getAttribute('theme') || 'dark';
        const themeClass = theme === 'light' ? 'theme-light' : '';
        const lang = this.getAttribute('lang') || this.detectLanguage();
        const t = this.translations[lang] || this.translations.en;

        // Generate social links HTML
        const socialLinksHTML = this.socialLinks.map(link => 
            `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="vcp-footer-social-link" aria-label="${link.name}">
                <i class="${link.icon}"></i>
            </a>`
        ).join('');

        this.innerHTML = `
        <footer class="vcp-footer ${themeClass}">
            <div class="vcp-footer-container">
                <div class="vcp-footer-social">
                    ${socialLinksHTML}
                </div>
                <p class="vcp-footer-copyright">${t.copyright}</p>
                <p class="vcp-footer-independence">${t.independence}</p>
                <p class="vcp-footer-disclaimer">${t.disclaimer1}</p>
                <p class="vcp-footer-disclaimer">${t.disclaimer2}</p>
                <p class="vcp-footer-address">${t.organization}<br>${t.address}</p>
                <p class="vcp-footer-revision">${t.revision}</p>
            </div>
        </footer>
        `;
    }
}

// Register the custom element
customElements.define('vcp-footer', VCPFooter);
