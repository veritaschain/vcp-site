import { html } from 'hono/html'

export const brokersPageJa = () => html`
<!DOCTYPE html>
<html lang="ja">
<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XTK1LJKRGV"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XTK1LJKRGV');
    </script>
    
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Favicon -->
    <link rel="icon" href="/assets/img/logo.png" type="image/png">
    <link rel="shortcut icon" href="/assets/img/logo.png" type="image/png">
    <link rel="apple-touch-icon" href="/assets/img/logo.png">
    
    <!-- Primary Meta Tags -->
    <title>機関投資家向けVCP | Best Executionを暗号学的に証明 | MiFID II準拠</title>
    <meta name="title" content="機関投資家向けVCP | Best Executionを暗号学的に証明 | MiFID II準拠">
    <meta name="description" content="Best Executionを暗号学的に証明できる世界唯一のプロトコル。MiFID II RTS 25/28・EU AI Act第12条準拠の監査証跡。機関投資家向けブローカー・ECN・監査法人のためのサイドカー統合。">
    <meta name="keywords" content="Best Execution, MiFID II, RTS 25, RTS 28, EU AI Act, アルゴリズム取引, 監査証跡, 暗号学的証明, 機関投資家, ECN, コンプライアンス, レグテック, 取引透明性, VCP, VeritasChain, ブローカー">
    <meta name="author" content="VeritasChain Standards Organization (VSO)">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    
    <!-- Canonical & Language Alternates -->
    <link rel="canonical" href="https://veritaschain.org/brokers/ja/">
    <link rel="alternate" hreflang="en" href="https://veritaschain.org/brokers/">
    <link rel="alternate" hreflang="ja" href="https://veritaschain.org/brokers/ja/">
    <link rel="alternate" hreflang="zh" href="https://veritaschain.org/brokers/zh/">
    <link rel="alternate" hreflang="x-default" href="https://veritaschain.org/brokers/">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="VeritasChain">
    <meta property="og:url" content="https://veritaschain.org/brokers/ja/">
    <meta property="og:title" content="機関投資家向けVCP | Best Executionを暗号学的に証明">
    <meta property="og:description" content="Best Executionを暗号学的に証明できる世界唯一のプロトコル。MiFID II RTS 25/28・EU AI Act第12条準拠。機関投資家向けブローカー・ECN・監査法人に対応。">
    <meta property="og:image" content="https://raw.githubusercontent.com/veritaschain/vcp-site/main/assets/OGP.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="VeritasChain Protocol - 暗号学的なBest Execution検証">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:locale:alternate" content="en_US">
    <meta property="og:locale:alternate" content="zh_CN">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@VeritasChainOrg">
    <meta name="twitter:creator" content="@VeritasChainOrg">
    <meta name="twitter:title" content="機関投資家向けVCP | Best Executionを暗号学的に証明">
    <meta name="twitter:description" content="Best Executionを暗号学的に証明できる世界唯一のプロトコル。MiFID II準拠の監査証跡を機関投資家向けデューデリジェンスに。">
    <meta name="twitter:image" content="https://raw.githubusercontent.com/veritaschain/vcp-site/main/assets/OGP.png">
    <meta name="twitter:image:alt" content="VeritasChain Protocol - 暗号学的なBest Execution検証">
    
    <!-- Additional SEO Meta -->
    <meta name="theme-color" content="#0f172a">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">
    
    <!-- Structured Data - Organization -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "VeritasChain Standards Organization",
        "alternateName": "VSO",
        "url": "https://veritaschain.org",
        "logo": "https://raw.githubusercontent.com/veritaschain/vcp-site/main/assets/OGP.png",
        "description": "アルゴリズム時代における暗号学的に検証可能な取引標準を確立"
    }
    </script>
    
    <!-- Structured Data - WebPage -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "機関投資家向けVCP",
        "description": "Best Executionを暗号学的に証明できる世界唯一のプロトコル。MiFID II RTS 25/28・EU AI Act第12条準拠の監査証跡。",
        "url": "https://veritaschain.org/brokers/ja/",
        "inLanguage": "ja",
        "isPartOf": {
            "@type": "WebSite",
            "name": "VeritasChain",
            "url": "https://veritaschain.org"
        },
        "about": {
            "@type": "Service",
            "name": "VeritasChain Protocol (VCP)",
            "serviceType": "アルゴリズム取引監査プロトコル",
            "provider": {
                "@type": "Organization",
                "name": "VeritasChain Standards Organization"
            },
            "areaServed": "Worldwide"
        }
    }
    </script>
    
    <!-- Structured Data - FAQPage -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "VCP（VeritasChain Protocol）とは何ですか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VCPは、アルゴリズム取引におけるBest Executionを暗号学的に証明できる世界唯一のプロトコルです。MiFID II RTS 25/28およびEU AI Act第12条に準拠した改ざん不能な監査証跡を作成します。"
                }
            },
            {
                "@type": "Question",
                "name": "VCPは既存の取引システムとどのように統合しますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "VCPは非侵入型のサイドカーアーキテクチャを採用しています。既存のマッチングエンジンやFIXゲートウェイを変更することなく、API経由でログを受け取ります。最短2週間での実装が可能です。"
                }
            },
            {
                "@type": "Question",
                "name": "VCPはMiFID II規制に準拠していますか？",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "はい。VCPのデータモデルはMiFID II RTS 25/27/28およびEU AI Act第12条の要件をネイティブにサポートしています。PTP時刻同期やアルゴリズムIDは自動的に記録されます。"
                }
            }
        ]
    }
    </script>
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- VCP Common Header/Footer Components -->
    <script src="/assets/js/vcp-header.js"></script>
    <script src="/assets/js/vcp-footer.js"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Noto Sans JP', sans-serif;
        }
        
        .font-serif {
            font-family: 'Noto Serif JP', serif;
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
    <!-- VCP Common Header -->
    <vcp-header lang="ja" show-lang-switcher="true"></vcp-header>

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
                    
                    <p class="text-slate-400 text-sm font-semibold tracking-wider mb-4 uppercase">
                        For Institutional Brokers, ECNs & Audit Firms
                    </p>
                    
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                        Best Executionを、
                        <span class="block text-emerald-400">規制対応グレードで検証。</span>
                    </h1>
                    
                    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
                        VCPは御社の執行システムの横で<span class="highlight-text text-white font-semibold">サイドカー</span>として稼働し、<br>
                        <span class="highlight-text text-white font-semibold">MiFID II RTS 25 / EU AI Act 第12条</span>に準拠した<br>
                        <span class="highlight-text text-white font-semibold">機関投資家向けデューデリジェンス</span>対応の監査証跡を生成します。
                    </p>
                    
                    <div class="flex flex-wrap gap-4">
                        <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30">
                            <i class="fas fa-file-alt"></i>
                            技術仕様書 (VCP v1.0) を見る
                        </a>
                        <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%20-%20%E6%A9%9F%E9%96%A2%E6%8A%95%E8%B3%87%E5%AE%B6%E5%90%91%E3%81%91" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2">
                            <i class="fas fa-rocket"></i>
                            機関投資家向けPoCに申し込む
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
                    「公正な取引」を、どう<span class="text-red-600">証明</span>しますか？
                </h2>
                <p class="text-lg text-slate-600 max-w-3xl mx-auto">
                    トレーダーは疑っています。規制当局は監視を強めています。<br>
                    しかし、CSVやデータベースのログは、管理者権限があれば書き換え可能です。
                </p>
            </div>
            
            <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-8 rounded-r-lg">
                <div class="flex items-start gap-4">
                    <i class="fas fa-exclamation-triangle text-amber-600 text-3xl mt-1"></i>
                    <div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">問われている本質</h3>
                        <p class="text-slate-700 leading-relaxed">
                            「透明性」をマーケティングワードで終わらせず、
                            <span class="font-bold text-slate-900">「暗号学的な検証可能性」</span>へと昇華させる時が来ました。
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
                    VCPだけが伝えられる3つのメッセージ
                </h2>
                <p class="text-slate-600">世界で他に、この3つを言える存在はいません。</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-8">
                <!-- Card 1: Cryptographic Best Execution -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-emerald-500">
                    <div class="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-fingerprint text-3xl text-emerald-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">暗号学的Best Execution</h3>
                    <p class="text-sm text-emerald-600 font-semibold mb-4">Best Executionを暗号学的に証明できる唯一の方法</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCPは、注文発生から約定までの全イベントをハッシュチェーンで連結し、Ed25519デジタル署名で封印します。
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        これにより、スリッページや約定拒否が「作為的ではない」ことを数学的に証明できます。
                    </p>
                    <div class="bg-emerald-50 p-4 rounded-lg">
                        <p class="text-sm text-emerald-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            「言ったもん勝ち」の水掛け論を排除。トレーダーからの信頼を絶対的なものに。
                        </p>
                    </div>
                </div>
                
                <!-- Card 2: Compliance by Design -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-blue-500">
                    <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-balance-scale text-3xl text-blue-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Compliance by Design</h3>
                    <p class="text-sm text-blue-600 font-semibold mb-4">MiFID RTS 25/28 を"設計段階でクリア"できるログ構造</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCPのデータモデルは、MiFID II (RTS 25/27/28) および EU AI Act の要件をネイティブにサポートしています。
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        PTP時刻同期ステータスやアルゴリズムIDを自動記録するため、事後的なデータ加工や複雑なレポート作成業務から解放されます。
                    </p>
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <p class="text-sm text-blue-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            監査コストの劇的な削減と、規制リスクの最小化。
                        </p>
                    </div>
                </div>
                
                <!-- Card 3: Non-Intrusive Sidecar & Trusted Data Layer -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-purple-500">
                    <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-layer-group text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Non-Intrusive Sidecar & Trusted Data Layer</h3>
                    <p class="text-sm text-purple-600 font-semibold mb-4">ゼロフリクション導入と監査プラットフォーム互換性</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        既存のマッチングエンジンやFIXゲートウェイの改修は不要。VCPはサイドカーとしてAPI経由でログを受け取り、非同期で署名・保存処理を行います。
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        CompliAI™ や Omnia™ などの監査プラットフォームと互換性があり、暗号学的に検証可能な入力データを提供します。
                    </p>
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <p class="text-sm text-purple-800 font-medium">
                            <i class="fas fa-check-circle mr-2"></i>
                            既存システムのパフォーマンスへの影響はゼロ。最短2週間での実装・PoC開始が可能。
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
                    「御社のコアシステムには1行もコードを追加しません。ただ、ログをVCPに流すだけです。」
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
                            <p class="text-slate-400 text-sm">既存取引サーバー<br/>MT4/MT5/cTrader</p>
                        </div>
                        <div class="text-center mt-4">
                            <span class="text-emerald-400 text-sm font-semibold">
                                <i class="fas fa-arrow-right mr-1"></i> API Hook (ノンブロッキング出力)
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
                            <p class="text-emerald-300 text-sm">ハッシュ化 → 署名<br/>→ Merkleツリー構築</p>
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
                            <p class="text-slate-400 text-sm">監査ログ<br/>Blockchainアンカー</p>
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
                    機関投資家向けユースケース
                </h2>
                <p class="text-slate-600">大手ブローカー・ECNがVCPを活用する方法</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <!-- Case 1: Institutional Due Diligence -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-building text-xl text-emerald-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">機関投資家デューデリジェンス</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        機関投資家のオンボーディング、リクイディティプロバイダー審査、アルゴ取引ガバナンス監査に検証可能なエビデンスを提供。
                    </p>
                </div>
                
                <!-- Case 2: Regulatory Compliance Automation -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-robot text-xl text-blue-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">規制コンプライアンス自動化</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        MiFID II RTS 25 / EU AI Act 第12条の記録保持義務を、暗号学的に保護されたログで自動的に充足。
                    </p>
                </div>
                
                <!-- Case 3: Execution Forensics -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-search-dollar text-xl text-purple-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">執行フォレンジクス</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        規制当局・監査法人に、シグナル→注文→約定チェーンの数学的に証明可能な再構築を提供。
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
                透明性の先駆者になる
            </h2>
            
            <p class="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                VSOでは現在、機関投資家向けマーケットインフラへの世界初のMiFID準拠VCP実装に向けた先行パートナーを募集しています。
                VCPの実装は、特定のアセットクラス・限定されたサーバー構成でのPoCから開始可能です。
            </p>
            
            <div class="bg-white/10 rounded-xl p-8 mb-8 backdrop-blur-sm">
                <h3 class="text-xl font-bold text-white mb-6">Early Adopter 特典</h3>
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-users text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">フルエンジニアリングサポート</p>
                        <p class="text-slate-400 text-sm">VSO技術チームによる実装支援</p>
                    </div>
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-newspaper text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">共同プレスリリース</p>
                        <p class="text-slate-400 text-sm">「世界初」の共同発表権</p>
                    </div>
                    <div class="text-center">
                        <div class="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i class="fas fa-tag text-xl text-white"></i>
                        </div>
                        <p class="text-white font-semibold mb-1">ライセンス費免除</p>
                        <p class="text-slate-400 text-sm">PoC期間中は無料</p>
                    </div>
                </div>
            </div>
            
            <div class="flex flex-wrap justify-center gap-4">
                <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%20-%20%E6%A9%9F%E9%96%A2%E6%8A%95%E8%B3%87%E5%AE%B6%E5%90%91%E3%81%91" class="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30">
                    <i class="fas fa-envelope mr-2"></i>
                    PoCについて問い合わせる（機関投資家向け）
                </a>
                <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-lg font-bold text-lg transition-all">
                    <i class="fas fa-download mr-2"></i>
                    ホワイトペーパーをダウンロード
                </a>
            </div>
        </div>
    </section>

    <!-- VCP Common Footer -->
    <vcp-footer lang="ja"></vcp-footer>
</body>
</html>
`
