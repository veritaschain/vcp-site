import { html } from 'hono/html'

export const brokersPageEn = () => html`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VCP for Brokers - Cryptographically Prove Best Execution | VeritasChain</title>
    <meta name="description" content="The only way to cryptographically prove Best Execution. MiFID II RTS 25/28 compliance by design. Non-invasive Sidecar integration for rapid deployment.">
    
    <!-- OGP Meta Tags -->
    <meta property="og:title" content="VCP for Brokers - Cryptographically Prove Best Execution">
    <meta property="og:description" content="The world's only algorithmic trading audit protocol. Prove Best Execution mathematically. MiFID II compliant by design.">
    <meta property="og:image" content="https://raw.githubusercontent.com/veritaschain/vcp-site/main/assets/OGP.png">
    <meta property="og:url" content="https://veritaschain.org/brokers">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .font-serif {
            font-family: 'Playfair Display', serif;
        }
        
        .gradient-hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
        }
        
        .verified-glow {
            animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
            from { box-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981; }
            to { box-shadow: 0 0 15px #10b981, 0 0 30px #10b981, 0 0 45px #10b981; }
        }
        
        .chain-animation {
            animation: chain 3s ease-in-out infinite;
        }
        
        @keyframes chain {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(10px); }
        }
        
        .highlight-text {
            background: linear-gradient(180deg, transparent 60%, rgba(16, 185, 129, 0.3) 60%);
        }
        
        .card-hover {
            transition: all 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        
        .architecture-line {
            stroke-dasharray: 5, 5;
            animation: dash 20s linear infinite;
        }
        
        @keyframes dash {
            to { stroke-dashoffset: -100; }
        }

        .lang-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .lang-dropdown {
            position: relative;
            display: inline-block;
        }

        .lang-dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            top: 100%;
            background-color: white;
            min-width: 120px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
            overflow: hidden;
            margin-top: 4px;
        }

        .lang-dropdown:hover .lang-dropdown-content {
            display: block;
        }

        .lang-dropdown-content a {
            color: #374151;
            padding: 10px 16px;
            text-decoration: none;
            display: block;
            font-size: 0.875rem;
        }

        .lang-dropdown-content a:hover {
            background-color: #f3f4f6;
        }
        
        .use-case-card {
            transition: all 0.3s ease;
            border-left: 4px solid transparent;
        }
        
        .use-case-card:hover {
            border-left-color: #10b981;
            background-color: #f8fafc;
        }
    </style>
</head>
<body class="bg-slate-50">
    <!-- Language Switcher -->
    <div class="lang-switcher">
        <div class="lang-dropdown">
            <button class="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-md text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                <i class="fas fa-language"></i>
                English
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <div class="lang-dropdown-content">
                <a href="/brokers/ja"><i class="fas fa-globe mr-2"></i>日本語</a>
                <a href="/brokers/zh"><i class="fas fa-globe mr-2"></i>中文</a>
            </div>
        </div>
    </div>

    <!-- Hero Section -->
    <section class="gradient-hero min-h-screen flex items-center relative overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
            <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" class="text-emerald-500"/>
            </svg>
        </div>
        
        <div class="max-w-6xl mx-auto px-6 py-20 relative z-10">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
                <!-- Left Content -->
                <div>
                    <div class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                        <i class="fas fa-shield-alt"></i>
                        The VCP Standard for Brokers
                    </div>
                    
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Prove Best Execution.
                        <span class="block text-emerald-400">Mathematically.</span>
                    </h1>
                    
                    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
                        Conventional log storage is no longer evidence.<br>
                        VCP runs as a <span class="highlight-text text-white font-semibold">"sidecar"</span> alongside your trading systems,<br>
                        automatically generating <span class="highlight-text text-white font-semibold">tamper-proof audit trails</span><br>
                        compliant with MiFID II RTS 25/28.
                    </p>
                    
                    <div class="flex flex-wrap gap-4">
                        <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30">
                            <i class="fas fa-file-alt"></i>
                            Technical Specification (VCP v1.0)
                        </a>
                        <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%20Inquiry%20-%20Broker" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2">
                            <i class="fas fa-rocket"></i>
                            Apply for Limited PoC
                        </a>
                    </div>
                </div>
                
                <!-- Right Visual -->
                <div class="hidden lg:flex justify-center items-center">
                    <div class="relative">
                        <!-- Chain Visual -->
                        <div class="flex items-center gap-4 chain-animation">
                            <div class="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                                <i class="fas fa-database text-2xl text-slate-400"></i>
                            </div>
                            <div class="text-emerald-400 text-2xl">→</div>
                            <div class="w-20 h-20 bg-slate-700 rounded-lg flex items-center justify-center border border-slate-600">
                                <i class="fas fa-link text-2xl text-emerald-400"></i>
                            </div>
                            <div class="text-emerald-400 text-2xl">→</div>
                            <div class="w-20 h-20 bg-emerald-500 rounded-lg flex items-center justify-center verified-glow">
                                <i class="fas fa-check text-2xl text-white"></i>
                            </div>
                        </div>
                        
                        <!-- Verified Badge -->
                        <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-emerald-500/20 text-emerald-400 px-6 py-2 rounded-full text-sm font-bold border border-emerald-500/50">
                            <i class="fas fa-shield-alt mr-2"></i>VERIFIED
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Trust Gap Section -->
    <section class="py-20 bg-white">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                    How Do You <span class="text-red-600">Prove</span> "Fair Execution"?
                </h2>
                <p class="text-lg text-slate-600 max-w-3xl mx-auto">
                    Traders are suspicious. Regulators are tightening oversight.<br>
                    Yet CSV and database logs can be modified by anyone with admin access.
                </p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
                <div class="flex items-start gap-4">
                    <i class="fas fa-exclamation-triangle text-amber-600 text-3xl mt-1"></i>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">The Critical Question</h3>
                        <p class="text-slate-700 leading-relaxed">
                            It's time to stop treating "transparency" as just marketing speak and elevate it to 
                            <span class="font-bold text-slate-900">"cryptographic verifiability"</span>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- 3 Core Values Section -->
    <section class="py-20 bg-slate-50">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                    Three Messages Only VCP Can Deliver
                </h2>
                <p class="text-slate-600">No one else in the world can say these three things.</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Card 1: Cryptographic Best Execution -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-emerald-500">
                    <div class="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-fingerprint text-3xl text-emerald-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Cryptographic Best Execution</h3>
                    <p class="text-sm text-emerald-600 font-semibold mb-4">The only way to prove Best Execution cryptographically</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCP chains all events from order creation to execution using hash chains and seals them with Ed25519 digital signatures.
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        This provides mathematical proof that slippage and order rejection were not intentional.
                    </p>
                    <div class="bg-emerald-50 p-4 rounded-lg">
                        <p class="text-sm text-emerald-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            Eliminate "he said, she said" disputes. Build absolute trust with traders.
                        </p>
                    </div>
                </div>
                
                <!-- Card 2: Compliance by Design -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-blue-500">
                    <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-balance-scale text-3xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Compliance by Design</h3>
                    <p class="text-sm text-blue-600 font-semibold mb-4">Log structure that clears MiFID RTS 25/28 by design</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCP's data model natively supports MiFID II (RTS 25/27/28) and EU AI Act requirements.
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        PTP time synchronization status and algorithm IDs are automatically recorded—no post-processing required.
                    </p>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-blue-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            Dramatically reduce audit costs and minimize regulatory risk.
                        </p>
                    </div>
                </div>
                
                <!-- Card 3: Non-Intrusive Sidecar -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-purple-500">
                    <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-plug text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Non-Intrusive Sidecar</h3>
                    <p class="text-sm text-purple-600 font-semibold mb-4">No server-side intrusion—Sidecar integration means fast deployment</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        No need to modify your existing matching engine or MT4/cTrader server core logic.
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCP runs as a "sidecar," receiving logs via API and processing signatures asynchronously.
                    </p>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <p class="text-sm text-purple-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            Zero latency impact. Implementation & PoC possible in as little as 2 weeks.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Architecture Section -->
    <section class="py-20 bg-white">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                    Zero-Friction Architecture
                </h2>
                <p class="text-slate-600">
                    "We don't add a single line of code to your core systems. Just stream your logs to VCP."
                </p>
            </div>
            
            <!-- Architecture Diagram -->
            <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl">
                <div class="flex flex-col md:flex-row items-center justify-between gap-8">
                    <!-- Broker's Engine -->
                    <div class="flex-1">
                        <div class="bg-slate-700/50 border border-slate-600 rounded-xl p-6 text-center">
                            <div class="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-server text-2xl text-slate-300"></i>
                            </div>
                            <h4 class="text-white font-bold mb-2">Broker's Engine</h4>
                            <p class="text-slate-400 text-sm">Existing Trading Server<br/>MT4/MT5/cTrader</p>
                        </div>
                        <div class="text-center mt-4">
                            <span class="text-emerald-400 text-sm font-semibold">
                                <i class="fas fa-arrow-right mr-1"></i> API Hook (Non-blocking Log Output)
                            </span>
                        </div>
                    </div>
                    
                    <!-- Arrow -->
                    <div class="hidden md:block">
                        <svg width="60" height="40" viewBox="0 0 60 40">
                            <line x1="0" y1="20" x2="50" y2="20" stroke="#10b981" stroke-width="2" class="architecture-line"/>
                            <polygon points="50,15 60,20 50,25" fill="#10b981"/>
                        </svg>
                    </div>
                    
                    <!-- VCP Sidecar -->
                    <div class="flex-1">
                        <div class="bg-emerald-500/20 border-2 border-emerald-500 rounded-xl p-6 text-center">
                            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-shield-alt text-2xl text-white"></i>
                            </div>
                            <h4 class="text-white font-bold mb-2">VCP Sidecar</h4>
                            <p class="text-emerald-300 text-sm">Hashing → Signing<br/>→ Merkle Tree Construction</p>
                        </div>
                    </div>
                    
                    <!-- Arrow -->
                    <div class="hidden md:block">
                        <svg width="60" height="40" viewBox="0 0 60 40">
                            <line x1="0" y1="20" x2="50" y2="20" stroke="#10b981" stroke-width="2" class="architecture-line"/>
                            <polygon points="50,15 60,20 50,25" fill="#10b981"/>
                        </svg>
                    </div>
                    
                    <!-- Immutable Storage -->
                    <div class="flex-1">
                        <div class="bg-slate-700/50 border border-slate-600 rounded-xl p-6 text-center">
                            <div class="w-16 h-16 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i class="fas fa-cube text-2xl text-slate-300"></i>
                            </div>
                            <h4 class="text-white font-bold mb-2">Immutable Storage</h4>
                            <p class="text-slate-400 text-sm">Audit Log<br/>Blockchain Anchor</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Use Cases Section -->
    <section class="py-20 bg-slate-50">
        <div class="max-w-5xl mx-auto px-6">
            <div class="text-center mb-12">
                <h2 class="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                    Use Cases
                </h2>
                <p class="text-slate-600">Concrete ways to leverage VCP</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <!-- Case 1 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-medal text-xl text-emerald-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">Marketing Differentiator</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        Brand yourself as "All Trades Audited" and achieve overwhelming differentiation from competitors.
                    </p>
                </div>
                
                <!-- Case 2 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-headset text-xl text-blue-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">Dispute Resolution</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        Present signed logs to instantly resolve customer complaints and reduce support costs.
                    </p>
                </div>
                
                <!-- Case 3 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-file-export text-xl text-purple-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">Regulatory Reporting</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        Generate audit firm and regulatory reports with one click from VCP Explorer.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- PoC Offer Section -->
    <section class="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <div class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <i class="fas fa-star"></i>
                Early Adopter Program
            </div>
            
            <h2 class="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                Join the Vanguard of Transparency
            </h2>
            
            <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                VSO is currently recruiting pioneering partners to become the world's first "VCP-Certified Brokers."
                VCP implementation can start with a PoC limited to specific currency pairs and server configurations.
            </p>
            
            <div class="bg-white/10 rounded-xl p-8 mb-8 backdrop-blur-sm">
                <h3 class="text-xl font-bold text-white mb-6">Early Adopter Incentives</h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-users text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">Full Engineering Support</p>
                        <p class="text-slate-400 text-sm">VSO technical team provides implementation support</p>
                    </div>
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-newspaper text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">Joint Press Release</p>
                        <p class="text-slate-400 text-sm">"World's First" co-branded announcement rights</p>
                    </div>
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-tag text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">License Fee Waiver</p>
                        <p class="text-slate-400 text-sm">No license fees during PoC period</p>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap justify-center gap-4">
                <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%20Inquiry%20-%20Broker" class="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30">
                    <i class="fas fa-envelope mr-2"></i>
                    Inquire About PoC
                </a>
                <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-lg font-bold text-lg transition-all">
                    <i class="fas fa-download mr-2"></i>
                    Download Whitepaper
                </a>
            </div>
        </div>
    </section>

    <!-- Trust Footer -->
    <section class="py-12 bg-slate-900 border-t border-slate-800">
        <div class="max-w-5xl mx-auto px-6">
            <div class="flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="flex items-center gap-4">
                    <i class="fas fa-shield-alt text-3xl text-emerald-400"></i>
                    <div>
                        <h4 class="text-white font-bold">VeritasChain Standards Organization</h4>
                        <p class="text-slate-400 text-sm">Encoding Trust in the Algorithmic Age</p>
                    </div>
                </div>
                <div class="flex flex-wrap gap-6 text-sm">
                    <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fab fa-github mr-2"></i>Protocol Specs
                    </a>
                    <a href="https://veritaschain.org/docs" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-book mr-2"></i>Documentation
                    </a>
                    <a href="mailto:info@veritaschain.org" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-envelope mr-2"></i>Contact
                    </a>
                </div>
            </div>
            <div class="text-center text-slate-500 text-sm mt-8 pt-8 border-t border-slate-800">
                <p>© 2025 VeritasChain Standards Organization (VSO). All rights reserved.</p>
                <p class="mt-2 italic">"Verify, Don't Trust"</p>
            </div>
        </div>
    </section>
</body>
</html>
`
