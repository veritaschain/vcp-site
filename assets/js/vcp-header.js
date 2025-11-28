/**
 * VCP Header Web Component
 * 
 * Usage:
 *   <script src="/assets/js/vcp-header.js"></script>
 *   <vcp-header></vcp-header>
 * 
 * Make sure to include:
 *   - /assets/css/main.css for styling
 *   - Font Awesome for icons
 */

class VCPHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <nav class="main-nav">
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
                            VCP <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vcp/specification/" class="dropdown-item">Specification</a>
                            <a href="/explorer/" class="dropdown-item">Explorer</a>
                            <a href="/explorer/app/" class="dropdown-item dropdown-item-highlight">🚀 Launch Explorer</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            Solutions <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/solutions/exchanges/" class="dropdown-item">For Exchanges & Brokers</a>
                            <a href="/propfirms/" class="dropdown-item">For Prop Firms</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            Certification <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/certified/" class="dropdown-item">VC-Certified</a>
                            <a href="/certified/faq/" class="dropdown-item">FAQ (Scope / Limitations)</a>
                            <a href="/certified/apply" class="dropdown-item">Apply for Certification</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            Standards <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="https://github.com/VeritasChain/vcp-spec" class="dropdown-item" target="_blank" rel="noopener">VCP Protocol</a>
                            <a href="/vcp/developers/" class="dropdown-item">Developers / Integration</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            Developers <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vcp/developers/" class="dropdown-item">About</a>
                            <a href="https://veritaschain.github.io/vcp-explorer-api/" class="dropdown-item" target="_blank" rel="noopener">Explorer API</a>
                            <a href="https://raw.githubusercontent.com/veritaschain/vcp-explorer-api/main/openapi.yaml" class="dropdown-item" target="_blank" rel="noopener">OpenAPI Spec</a>
                            <a href="https://github.com/veritaschain/vcp-explorer-api" class="dropdown-item" target="_blank" rel="noopener">GitHub (vcp-explorer-api)</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            About <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/vso" class="dropdown-item">VSO</a>
                            <a href="/company/" class="dropdown-item">Company</a>
                            <a href="/partners/" class="dropdown-item">Ecosystem Partners</a>
                            <a href="/press/" class="dropdown-item">Press Kit</a>
                            <a href="/legal/" class="dropdown-item">Legal</a>
                        </div>
                    </div>
                    
                    <div class="nav-item dropdown">
                        <button class="nav-link dropdown-toggle">
                            Support <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-menu">
                            <a href="/support/" class="dropdown-item">Support</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        `;

        this.initializeNavigation();
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
