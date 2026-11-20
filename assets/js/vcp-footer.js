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

        // Inline SVGs do not depend on the host page loading an icon font.
        // The seven icons replacing font glyphs are Font Awesome Free 6.5.1
        // by Fonticons, Inc. (https://fontawesome.com).
        // Icons: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
        // Geometry unchanged; sizing, currentColor and accessibility attributes added.
        // Source: https://github.com/FortAwesome/Font-Awesome/tree/6.5.1/svgs
        this.xIconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
        this.blueskyIconSvg = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/></svg>';

        // Social media links
        this.socialLinks = [
            { name: 'X', url: 'https://x.com/Veritas_chain', svg: this.xIconSvg },
            { name: 'LinkedIn', url: 'https://www.linkedin.com/company/110199945', svg: '<svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>' },
            { name: 'Facebook', url: 'https://www.facebook.com/veritaschain', svg: '<svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"/></svg>' },
            { name: 'Medium', url: 'https://medium.com/@veritaschain', svg: '<svg viewBox="0 0 640 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M180.5,74.262C80.813,74.262,0,155.633,0,256S80.819,437.738,180.5,437.738,361,356.373,361,256,280.191,74.262,180.5,74.262Zm288.25,10.646c-49.845,0-90.245,76.619-90.245,171.095s40.406,171.1,90.251,171.1,90.251-76.619,90.251-171.1H559C559,161.5,518.6,84.908,468.752,84.908Zm139.506,17.821c-17.526,0-31.735,68.628-31.735,153.274s14.2,153.274,31.735,153.274S640,340.631,640,256C640,171.351,625.785,102.729,608.258,102.729Z"/></svg>' },
            { name: 'DEV.to', url: 'https://dev.to/veritaschain', svg: '<svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"/></svg>' },
            { name: 'Substack', url: 'https://substack.com/@tokachikamimura', svg: '<svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"/></svg>' },
            { name: 'ORCiD', url: 'https://orcid.org/0009-0002-0871-1627', svg: '<svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z"/></svg>' },
            { name: 'GitHub', url: 'https://github.com/veritaschain', svg: '<svg viewBox="0 0 496 512" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>' },
            { name: 'Bluesky', url: 'https://bsky.app/profile/veritaschain.bsky.social', svg: this.blueskyIconSvg }
        ];

        // Translation data for all supported languages
        this.translations = {
            en: {
                copyright: '© 2025 - 2026 VeritasChain Co., Ltd. All rights reserved.',
                independence: 'Neutrality rests on public procedures, conflict-of-interest management, and a non-endorsement policy. VSO does not provide trading services.',
                disclaimer1: 'VSO does not endorse or certify any financial performance claims.',
                disclaimer2: 'All specifications are provided "as-is" without warranties of any kind.',
                organization: 'VeritasChain Standards Organization (VSO), operated by VeritasChain Co., Ltd.',
                duns: 'D-U-N-S: 698368529',
                address: 'Tokyo, Japan',
                revision: 'VCP Specification v1.2.0 GA (tag v1.2.0, b23acb266f88df81d960d36d58fb64ceaa0dd5ed; GA merged 2026-10-08 JST; fix merged 2026-10-09 JST)'
            },
            ja: {
                copyright: '© 2025 - 2026 VeritasChain Co., Ltd. All rights reserved.',
                independence: '中立性は、公開された手続、利益相反の管理、および非推奨方針によって説明されます。VSOは取引サービスを提供しません。',
                disclaimer1: 'VSOは金融パフォーマンスに関する主張を保証または認証しません。',
                disclaimer2: 'すべての仕様は「現状のまま」提供され、いかなる種類の保証も伴いません。',
                organization: 'VeritasChain Standards Organization (VSO), operated by VeritasChain Co., Ltd.',
                duns: 'D-U-N-S: 698368529',
                address: '東京、日本',
                revision: 'VCP仕様 v1.2.0 GA（タグ v1.2.0、b23acb266f88df81d960d36d58fb64ceaa0dd5ed。GAマージ 2026-10-08 JST、修正マージ 2026-10-09 JST）'
            },
            zh: {
                copyright: '© 2025 - 2026 VeritasChain Co., Ltd. 保留所有权利。',
                independence: '中立性由其公开程序、利益冲突管理和非背书政策说明。VSO不提供交易服务。',
                disclaimer1: 'VSO不认可或证明任何财务绩效声明。',
                disclaimer2: '所有规范均按"原样"提供，不提供任何形式的保证。',
                organization: 'VeritasChain Standards Organization (VSO), operated by VeritasChain Co., Ltd.',
                duns: 'D-U-N-S: 698368529',
                address: '日本东京',
                revision: 'VCP规范 v1.2.0 GA（标签 v1.2.0，b23acb266f88df81d960d36d58fb64ceaa0dd5ed。GA合并于2026-10-08 JST，修复合并于2026-10-09 JST）'
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
        const socialLinksHTML = this.socialLinks.map(link => {
            return `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="vcp-footer-social-link" aria-label="${link.name}">
                ${link.svg}
            </a>`;
        }).join('');

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
                <p class="vcp-footer-address">${t.organization}<br>${t.duns}<br>${t.address}</p>
                <p class="vcp-footer-revision">${t.revision}</p>
            </div>
        </footer>
        `;
    }
}

// Register the custom element
customElements.define('vcp-footer', VCPFooter);
