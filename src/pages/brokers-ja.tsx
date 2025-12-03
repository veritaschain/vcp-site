import { html } from 'hono/html'

export const brokersPageJa = () => html`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ブローカー向けVCP - Best Executionを暗号学的に証明 | VeritasChain</title>
    <meta name="description" content="Best Executionを暗号学的に証明できる唯一の方法。MiFID II RTS 25/28を設計段階でクリア。サーバー侵入不要のSidecar方式で迅速導入。">
    
    <!-- OGP Meta Tags -->
    <meta property="og:title" content="ブローカー向けVCP - Best Executionを暗号学的に証明">
    <meta property="og:description" content="世界唯一のアルゴリズム取引監査プロトコル。Best Executionを数学的に証明。MiFID IIに設計段階で準拠。">
    <meta property="og:image" content="https://raw.githubusercontent.com/veritaschain/vcp-site/main/assets/OGP.png">
    <meta property="og:url" content="https://veritaschain.org/brokers/ja">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
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
                日本語
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <div class="lang-dropdown-content">
                <a href="/brokers"><i class="fas fa-globe mr-2"></i>English</a>
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
                        Best Executionを、
                        <span class="block text-emerald-400">数学的に証明せよ。</span>
                    </h1>
                    
                    <p class="text-xl text-slate-300 mb-8 leading-relaxed">
                        従来のログ保存は、もはや証拠ではありません。<br>
                        VCPは、御社の取引システムの横で<span class="highlight-text text-white font-semibold">「サイドカー」</span>として稼働し、<br>
                        MiFID II RTS 25/28 に準拠した<br>
                        <span class="highlight-text text-white font-semibold">「改ざん不能な監査証跡」</span>を自動生成します。
                    </p>
                    
                    <div class="flex flex-wrap gap-4">
                        <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/30">
                            <i class="fas fa-file-alt"></i>
                            技術仕様書 (VCP v1.0) を見る
                        </a>
                        <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%20-%20%E3%83%96%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%BC" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2">
                            <i class="fas fa-rocket"></i>
                            限定PoCに申し込む
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
                
                <!-- Card 3: Non-Intrusive Sidecar -->
                <div class="bg-white rounded-xl shadow-lg p-8 card-hover border-t-4 border-purple-500">
                    <div class="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                        <i class="fas fa-plug text-3xl text-purple-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-2">Non-Intrusive Sidecar</h3>
                    <p class="text-sm text-purple-600 font-semibold mb-4">サーバー側に侵入しない Sidecar 方式だから導入が速い</p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        既存のマッチングエンジンやMT4/cTraderサーバーのコアロジックを書き換える必要はありません。
                    </p>
                    <p class="text-slate-600 leading-relaxed mb-4">
                        VCPは「サイドカー（並走型）」としてAPI経由でログを受け取り、非同期で署名・保存処理を行います。
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
                    導入シナリオ
                </h2>
                <p class="text-slate-600">VCPの具体的な活用方法</p>
            </div>
            
            <div class="grid md:grid-cols-3 gap-6">
                <!-- Case 1 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-medal text-xl text-emerald-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">マーケティング差別化</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        「全取引監査済み」をブランド化し、他社との圧倒的な差別化を図る。
                    </p>
                </div>
                
                <!-- Case 2 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-headset text-xl text-blue-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">紛争解決</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        顧客からのクレームに対し、署名付きログを提示して即時解決（サポートコスト削減）。
                    </p>
                </div>
                
                <!-- Case 3 -->
                <div class="bg-white rounded-xl p-6 use-case-card">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <i class="fas fa-file-export text-xl text-purple-600"></i>
                        </div>
                        <h4 class="font-bold text-slate-900">規制レポーティング</h4>
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed">
                        監査法人や当局への提出レポートを、VCPエクスプローラーからワンクリックで出力。
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
                VSOでは現在、世界初の「VCP認定ブローカー」となる先行パートナー（Early Adopter）を募集しています。
                VCPの実装は、特定の通貨ペア・限定されたサーバー構成でのPoCから開始可能です。
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
                <a href="mailto:partners@veritaschain.org?subject=VCP%20PoC%E3%81%AE%E3%81%8A%E5%95%8F%E3%81%84%E5%90%88%E3%82%8F%E3%81%9B%20-%20%E3%83%96%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%BC" class="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-emerald-500/30">
                    <i class="fas fa-envelope mr-2"></i>
                    PoCについて問い合わせる
                </a>
                <a href="https://github.com/VeritasChain/vcp-specification" target="_blank" class="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-10 py-4 rounded-lg font-bold text-lg transition-all">
                    <i class="fas fa-download mr-2"></i>
                    ホワイトペーパーをダウンロード
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
                        <i class="fab fa-github mr-2"></i>プロトコル仕様
                    </a>
                    <a href="https://veritaschain.org/docs" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-book mr-2"></i>ドキュメント
                    </a>
                    <a href="mailto:info@veritaschain.org" class="text-slate-400 hover:text-white transition-colors">
                        <i class="fas fa-envelope mr-2"></i>お問い合わせ
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
