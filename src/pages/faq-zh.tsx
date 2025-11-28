import { html } from 'hono/html'

export const faqPageZh = () => html`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>常见问题 - VeritasChain Certified (VC-Certified)</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Noto Sans SC', 'Inter', sans-serif;
        }
        
        .faq-item {
            transition: all 0.3s ease;
        }
        
        .faq-item:hover {
            background-color: #f9fafb;
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.4s ease-out, opacity 0.3s ease-out;
            opacity: 0;
        }
        
        .faq-answer.active {
            max-height: 1000px;
            opacity: 1;
            transition: max-height 0.5s ease-in, opacity 0.4s ease-in;
        }
        
        .faq-icon {
            transition: transform 0.3s ease;
        }
        
        .faq-icon.rotate {
            transform: rotate(180deg);
        }
        
        .category-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }
        
        .badge-scope { background: #FEF3C7; color: #92400E; }
        .badge-privacy { background: #DBEAFE; color: #1E40AF; }
        .badge-tier { background: #DCFCE7; color: #166534; }
        .badge-governance { background: #F3E8FF; color: #6B21A8; }
        .badge-process { background: #FEE2E2; color: #991B1B; }
        
        .highlight {
            background: linear-gradient(180deg, transparent 65%, #FDE047 65%);
            font-weight: 600;
        }
        
        .warning-box {
            border-left: 4px solid #F59E0B;
            background: #FFFBEB;
        }
        
        .info-box {
            border-left: 4px solid #3B82F6;
            background: #EFF6FF;
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
    </style>
</head>
<body class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
    <!-- Language Switcher -->
    <div class="lang-switcher">
        <div class="lang-dropdown">
            <button class="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-md text-sm font-semibold text-gray-700 transition-colors flex items-center gap-2">
                <i class="fas fa-language"></i>
                中文
                <i class="fas fa-chevron-down text-xs"></i>
            </button>
            <div class="lang-dropdown-content">
                <a href="/certified/faq/"><i class="fas fa-globe mr-2"></i>English</a>
                <a href="/certified/faq/ja.html"><i class="fas fa-globe mr-2"></i>日本語</a>
            </div>
        </div>
    </div>

    <!-- Header -->
    <header class="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 shadow-xl">
        <div class="max-w-5xl mx-auto px-6">
            <div class="flex items-center gap-4 mb-4">
                <i class="fas fa-shield-alt text-4xl text-blue-400"></i>
                <div>
                    <h1 class="text-3xl font-bold tracking-tight">VeritasChain Certified (VC-Certified)</h1>
                    <p class="text-slate-300 text-sm mt-1">常见问题 (FAQ)</p>
                </div>
            </div>
            <p class="text-slate-200 text-lg italic border-l-4 border-blue-400 pl-4">
                在算法时代编码信任
            </p>
        </div>
    </header>

    <!-- Introduction -->
    <div class="max-w-5xl mx-auto px-6 py-8">
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <p class="text-gray-700 leading-relaxed">
                本常见问题页面解答了关于 <strong class="highlight">VC-Certified</strong> 认证计划的关键技术、法律和道德问题。
                该计划由 <strong>VeritasChain 标准组织 (VSO)</strong> 运营。
            </p>
            <div class="mt-4 info-box p-4 rounded-md">
                <p class="text-sm text-gray-700">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                    <strong>目的：</strong>主动回应常见问题，通过明确 VC-Certified 的保证范围和限制来增强信任。
                </p>
            </div>
        </div>

        <!-- Category 1: Scope & Limitations -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span class="category-badge badge-scope">
                    <i class="fas fa-chart-line mr-1"></i>范围
                </span>
                <span>1. 认证范围与限制</span>
            </h2>
            
            <!-- FAQ Item 1 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-university text-yellow-600 mr-2"></i>
                            Q. VC-Certified 是否保证公司的财务稳定性或偿付能力？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="warning-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-amber-900">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            A. 否，本认证不保证财务健康或偿付能力。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong class="highlight">VC-Certified</strong> 仅认证系统在技术上
                            <strong class="text-blue-600">符合</strong>
                            <strong>VeritasChain Protocol (VCP)</strong> 国际标准。
                        </p>
                        <p class="font-semibold text-gray-800">具体而言，我们验证以下内容在数学和密码学上是正确的：</p>
                        <ul class="list-disc list-inside space-y-2 ml-4">
                            <li><i class="fas fa-check-circle text-green-500 mr-2"></i>交易数据<strong>不可篡改</strong>（防篡改）</li>
                            <li><i class="fas fa-check-circle text-green-500 mr-2"></i>算法<strong>决策过程</strong>已被记录</li>
                            <li><i class="fas fa-check-circle text-green-500 mr-2"></i>时间同步和数值精度符合指定的<strong>层级要求</strong></li>
                        </ul>
                        <div class="warning-box p-4 rounded-md mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-ban text-red-500 mr-2"></i>重要声明：</strong>
                                VSO 不保证或背书任何公司的：
                            </p>
                            <ul class="text-sm text-gray-700 mt-2 space-y-1 ml-4">
                                <li>• 偿付能力或履行财务义务的能力</li>
                                <li>• 业务连续性或长期生存能力</li>
                                <li>• 投资产品的盈利能力或回报</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Item 2 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-handshake text-purple-600 mr-2"></i>
                            Q. VSO 是否推荐特定的投资策略或经纪商？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="warning-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-amber-900">
                            <i class="fas fa-times-circle mr-2"></i>
                            A. 否，VSO 严格遵守"非背书政策"。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong>VSO 是中立的国际标准组织。</strong>
                            颁发认证徽章仅表示系统
                            <strong class="highlight">符合透明度标准</strong>——这并非对该公司产品或服务的背书。
                        </p>
                        <p>
                            VSO 保持<strong class="text-blue-600">供应商中立</strong>立场，旨在改善整个市场生态系统的健康状况。
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category 2: Data & Privacy -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span class="category-badge badge-privacy">
                    <i class="fas fa-lock mr-1"></i>隐私
                </span>
                <span>2. 数据隐私与安全</span>
            </h2>
            
            <!-- FAQ Item 3 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-user-shield text-blue-600 mr-2"></i>
                            Q. 认证是否会导致客户个人信息暴露给 VSO 或第三方？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-shield-alt mr-2"></i>
                            A. 否，个人信息受 VCP-PRIVACY 模块保护。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            VCP 的设计理念平衡了<strong class="highlight">"公共真相 (Veritas)"</strong>与
                            <strong class="highlight">"隐私保护"</strong>。
                        </p>
                        <div class="grid md:grid-cols-2 gap-4 mt-4">
                            <div class="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
                                <h4 class="font-bold text-blue-900 mb-2">
                                    <i class="fas fa-hashtag mr-2"></i>哈希处理
                                </h4>
                                <p class="text-sm text-gray-700">
                                    记录在区块链或审计日志中的是数据的<strong>哈希值（指纹）</strong>——而非原始个人信息。
                                </p>
                            </div>
                            <div class="border-l-4 border-purple-500 bg-purple-50 p-4 rounded">
                                <h4 class="font-bold text-purple-900 mb-2">
                                    <i class="fas fa-trash-alt mr-2"></i>密码学销毁
                                </h4>
                                <p class="text-sm text-gray-700">
                                    个人身份信息 (PII) 使用每用户唯一密钥加密。
                                    对于 <strong>GDPR 的"被遗忘权"</strong>，销毁解密密钥可使数据
                                    <strong class="text-red-600">在数学上不可恢复</strong>。
                                </p>
                            </div>
                        </div>
                        <p class="mt-4 font-semibold text-gray-800">
                            <i class="fas fa-check-double text-green-500 mr-2"></i>
                            因此，<strong>VSO 或第三方在技术上不可能从审计日志中提取客户姓名或地址</strong>。
                        </p>
                    </div>
                </div>
            </div>

            <!-- FAQ Item 4 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-cubes text-indigo-600 mr-2"></i>
                            Q. 区块链上记录的数据是否可以被任何人查看？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-eye mr-2"></i>
                            A. 仅"验证所需数据"是透明的。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            在符合 VCP 的系统中，交易的<strong>哈希值</strong>和
                            <strong>Merkle 根</strong>被锚定到公共链上。
                        </p>
                        <p>
                            这允许用户使用浏览器工具验证<strong class="highlight">"我的交易是否被篡改"</strong>。
                        </p>
                        <div class="warning-box p-4 rounded-md mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-shield-alt text-amber-600 mr-2"></i>受保护信息：</strong>
                                算法的具体逻辑（知识产权）和他人的详细交易信息不会被暴露。
                            </p>
                        </div>
                        <p class="mt-4">
                            VCP 提供介于<strong class="text-red-600">"黑箱（不透明）"</strong>和
                            <strong class="text-green-600">"玻璃房（完全暴露）"</strong>之间的
                            <strong class="highlight text-blue-600">"可验证透明度"</strong>。
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category 3: Tiers & Value -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span class="category-badge badge-tier">
                    <i class="fas fa-layer-group mr-1"></i>层级
                </span>
                <span>3. 认证层级与技术价值</span>
            </h2>
            
            <!-- FAQ Item 5 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-medal text-gray-400 mr-2"></i>
                            Q. Silver 层级（零售/自营）在时间同步为"尽力而为"的情况下是否有意义？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-check-circle mr-2"></i>
                            A. 是的，它提供极强的"证明价值"。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            虽然 <strong>Silver 层级</strong>不要求原子钟精度（PTPv2），
                            但它保证了<strong class="highlight">"欺诈不可逆"</strong>。
                        </p>
                        <div class="grid gap-3 mt-4">
                            <div class="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded">
                                <i class="fas fa-fingerprint text-green-600 text-xl mt-1"></i>
                                <div>
                                    <h4 class="font-bold text-green-900">UUID v7 排序</h4>
                                    <p class="text-sm text-gray-700">所有事件都被分配时间排序的 ID。</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                <i class="fas fa-chain-broken text-blue-600 text-xl mt-1"></i>
                                <div>
                                    <h4 class="font-bold text-blue-900">防止事后篡改</h4>
                                    <p class="text-sm text-gray-700">数据每 24 小时锚定到区块链。</p>
                                </div>
                            </div>
                        </div>
                        <div class="warning-box p-4 rounded-md mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-ban text-red-600 mr-2"></i>可防止的欺诈类型：</strong>
                            </p>
                            <ul class="text-sm text-gray-700 mt-2 space-y-1">
                                <li>• "事后删除不利交易"</li>
                                <li>• "用过去时间戳插入虚假数据"</li>
                            </ul>
                            <p class="text-sm text-gray-800 mt-2">
                                这些典型欺诈行为<strong>即使对数据库管理员也是不可能的</strong>。
                            </p>
                        </div>
                        <p class="mt-4 font-semibold text-green-700">
                            <i class="fas fa-star text-yellow-500 mr-2"></i>
                            Silver 层级是以低成本解决<strong>信任争议（各执一词）</strong>的强大工具。
                        </p>
                    </div>
                </div>
            </div>

            <!-- FAQ Item 6 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-plug text-green-600 mr-2"></i>
                            Q. 实施是否需要更换现有系统？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-check-circle mr-2"></i>
                            A. 否，可以进行"边车"部署。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            VCP 提供适配器（SDK 和桥接器），可<strong class="highlight">与现有系统并行运行</strong>，
                            包括 <strong>FIX 引擎</strong>和交易服务器（MT4/MT5 等），
                            <strong>无需修改</strong>现有基础设施即可生成审计日志。
                        </p>
                        <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4 rounded-lg mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-code text-green-600 mr-2"></i>面向零售经纪商和自营公司：</strong>
                            </p>
                            <p class="text-sm text-gray-700 mt-2">
                                我们提供 <code class="bg-white px-2 py-1 rounded border text-green-700">vcp-mql-bridge</code>，
                                在最小化对现有环境影响的同时实现认证。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Item: Prop Firms Silver Tier -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-briefcase text-amber-600 mr-2"></i>
                            Q. 自营交易公司可以在生产环境中使用 Silver 层级吗？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-check-circle mr-2"></i>
                            A. 是的。Silver 层级专为尽力而为同步可接受的零售/自营环境设计。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong>Silver 层级</strong>提供 VCP 合规的所有核心优势：
                        </p>
                        <ul class="list-disc list-inside space-y-1 ml-4">
                            <li>具有密码学完整性的不可变审计记录</li>
                            <li>UUID v7 时间排序事件日志</li>
                            <li>24 小时区块链锚定</li>
                            <li>防止事后数据篡改</li>
                        </ul>
                        <p class="mt-3">
                            对于<strong>毫秒级精度</strong>足够（非微秒/纳秒高频交易）的自营公司，
                            Silver 层级提供了<strong class="highlight">合规价值和实施成本</strong>的极佳平衡。
                        </p>
                    </div>
                </div>
            </div>

            <!-- FAQ Item: Exchanges Platinum Tier -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-exchange-alt text-indigo-600 mr-2"></i>
                            Q. 交易所是否必须获得 Platinum 层级？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-info-circle mr-2"></i>
                            A. 不是严格要求，但对于高频交易环境推荐使用。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong class="text-purple-700">Platinum 层级</strong>推荐用于需要以下条件的环境：
                        </p>
                        <div class="grid md:grid-cols-2 gap-3 mt-3">
                            <div class="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded">
                                <i class="fas fa-clock text-purple-600 mt-1"></i>
                                <div>
                                    <strong class="text-purple-900">PTP v2 同步</strong>
                                    <p class="text-sm text-gray-600">微秒/纳秒精度</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded">
                                <i class="fas fa-bolt text-purple-600 mt-1"></i>
                                <div>
                                    <strong class="text-purple-900">SBE 编码</strong>
                                    <p class="text-sm text-gray-600">简单二进制编码以提高速度</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded">
                                <i class="fas fa-network-wired text-purple-600 mt-1"></i>
                                <div>
                                    <strong class="text-purple-900">FIX 引擎集成</strong>
                                    <p class="text-sm text-gray-600">原生协议支持</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded">
                                <i class="fas fa-key text-purple-600 mt-1"></i>
                                <div>
                                    <strong class="text-purple-900">HSM 密钥管理</strong>
                                    <p class="text-sm text-gray-600">硬件安全模块</p>
                                </div>
                            </div>
                        </div>
                        <p class="mt-3 text-sm text-gray-600">
                            组织可以选择与其运营需求相匹配的层级。
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category 4: Governance & Future -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span class="category-badge badge-governance">
                    <i class="fas fa-balance-scale mr-1"></i>治理
                </span>
                <span>4. 治理与面向未来</span>
            </h2>
            
            <!-- FAQ Item 7 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-atom text-purple-600 mr-2"></i>
                            Q. 量子计算机到来时会发生什么？安全性会受到威胁吗？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-rocket mr-2"></i>
                            A. VCP 配备了"密码敏捷性"，已做好准备。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            目前，我们默认使用快速的 <strong class="text-blue-600">Ed25519 签名</strong>算法，
                            但规范中定义了向<strong class="highlight">后量子密码学 (PQC)</strong> 的迁移路径。
                        </p>
                        <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 p-4 rounded-lg mt-4">
                            <h4 class="font-bold text-purple-900 mb-2">
                                <i class="fas fa-road mr-2"></i>未来迁移路径
                            </h4>
                            <p class="text-sm text-gray-700">
                                当量子计算威胁成为现实时，我们将<strong>无缝升级</strong>到 NIST 标准算法，
                                如 <strong class="text-purple-700">Dilithium</strong>，
                                确保记录的未来真实性。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ Item 8 -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-gavel text-blue-600 mr-2"></i>
                            Q. VCP 是否支持欧盟 AI 法案？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-check-circle mr-2"></i>
                            A. 是的，协议内置了支持。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong class="text-blue-600">VCP-GOV</strong> 扩展模块包含用于存储以下内容的字段：
                        </p>
                        <ul class="list-disc list-inside space-y-1 ml-4">
                            <li>AI 算法决策因素</li>
                            <li>风险分类</li>
                            <li>人工监督记录</li>
                        </ul>
                        <div class="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 p-4 rounded-lg mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-shield-alt text-blue-600 mr-2"></i>合规支持：</strong>
                            </p>
                            <p class="text-sm text-gray-700 mt-2">
                                这强力支持<strong>高风险 AI 系统</strong>
                                关于<strong class="highlight">透明度和记录保存</strong>的合规要求。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Category 5: Certification Process & Compliance -->
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                <span class="category-badge badge-process">
                    <i class="fas fa-clipboard-check mr-1"></i>流程
                </span>
                <span>5. 认证流程与合规</span>
            </h2>
            
            <!-- FAQ: Is certification mandatory? -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-question-circle text-red-600 mr-2"></i>
                            Q. 使用 VCP 是否必须获得 VC-Certified 认证？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-times-circle mr-2"></i>
                            A. 否。VC-Certified 是可选的，实施 VeritasChain Protocol (VCP) 不需要认证。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            组织可以在<strong>开放标准许可</strong>下自由部署 VCP，
                            无论是否获得认证。
                        </p>
                        <div class="bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 p-4 rounded-lg mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-unlock text-blue-600 mr-2"></i>开放标准：</strong>
                            </p>
                            <p class="text-sm text-gray-700 mt-2">
                                VCP 被设计为<strong class="highlight">开放的国际标准</strong>。
                                认证提供第三方验证，但不是实施的前提条件。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ: Does it replace audits? -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-file-contract text-orange-600 mr-2"></i>
                            Q. VC-Certified 是否可以替代法律、财务或监管审计？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="warning-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-amber-900">
                            <i class="fas fa-exclamation-triangle mr-2"></i>
                            A. 否。VC-Certified 仅评估 VCP 的技术合规性。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            它<strong class="text-red-600">不能替代</strong>：
                        </p>
                        <ul class="list-disc list-inside space-y-1 ml-4">
                            <li>法定财务审计</li>
                            <li>许可要求</li>
                            <li>监管检查</li>
                            <li>法律合规审查</li>
                        </ul>
                        <div class="warning-box p-4 rounded-md mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-info-circle text-amber-600 mr-2"></i>重要区别：</strong>
                            </p>
                            <p class="text-sm text-gray-700 mt-2">
                                VC-Certified 是<strong>技术合规认证</strong>，而非监管许可或财务审计。
                                组织应独立维护所有必需的监管和财务合规。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ: How long does certification take? -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-calendar-alt text-teal-600 mr-2"></i>
                            Q. 认证需要多长时间？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-clock mr-2"></i>
                            A. 大多数组织在 2-6 周内完成认证流程。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            时间线取决于以下几个因素：
                        </p>
                        <div class="grid md:grid-cols-3 gap-3 mt-3">
                            <div class="flex flex-col items-center p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                                <i class="fas fa-layer-group text-teal-600 text-2xl mb-2"></i>
                                <strong class="text-teal-900">集成深度</strong>
                                <p class="text-xs text-gray-600 mt-1">系统集成的复杂性</p>
                            </div>
                            <div class="flex flex-col items-center p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                                <i class="fas fa-database text-teal-600 text-2xl mb-2"></i>
                                <strong class="text-teal-900">日志量</strong>
                                <p class="text-xs text-gray-600 mt-1">需要验证的数据量</p>
                            </div>
                            <div class="flex flex-col items-center p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                                <i class="fas fa-tools text-teal-600 text-2xl mb-2"></i>
                                <strong class="text-teal-900">技术准备度</strong>
                                <p class="text-xs text-gray-600 mt-1">现有 VCP 实施情况</p>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-gray-600">
                            已有 VCP 实施的组织通常能更快完成认证。
                        </p>
                    </div>
                </div>
            </div>

            <!-- FAQ: What does certification NOT cover? -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-ban text-red-600 mr-2"></i>
                            Q. 认证不涵盖哪些内容？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="warning-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-amber-900">
                            <i class="fas fa-exclamation-circle mr-2"></i>
                            A. VC-Certified 仅专注于 VCP 技术合规。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong class="text-red-600">VC-Certified 不评估：</strong>
                        </p>
                        <div class="grid md:grid-cols-2 gap-3 mt-3">
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>财务稳健性</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>交易策略质量</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>盈利能力或回报</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>风险偏好适当性</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>业务绩效</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>AML/KYC 合规</span>
                            </div>
                            <div class="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded md:col-span-2">
                                <i class="fas fa-times-circle text-red-500"></i>
                                <span>客户资金处理或托管实践</span>
                            </div>
                        </div>
                        <div class="info-box p-4 rounded-md mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-check-circle text-blue-600 mr-2"></i>涵盖内容：</strong>
                                VCP 规范的技术合规——确保数据完整性、密码学正确性和审计跟踪不可变性。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ: Can certification be revoked? -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-user-slash text-red-700 mr-2"></i>
                            Q. VSO 可以撤销 VC-Certified 认证吗？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="warning-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-amber-900">
                            <i class="fas fa-gavel mr-2"></i>
                            A. 是的。在特定条件下可能撤销认证。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong>撤销理由包括：</strong>
                        </p>
                        <div class="space-y-2 mt-3">
                            <div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <i class="fas fa-edit text-red-600 mt-1"></i>
                                <div>
                                    <strong class="text-red-900">日志篡改</strong>
                                    <p class="text-sm text-gray-600">篡改或伪造审计日志</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <i class="fas fa-trash-alt text-red-600 mt-1"></i>
                                <div>
                                    <strong class="text-red-900">模块移除</strong>
                                    <p class="text-sm text-gray-600">认证后移除 VCP 必需模块</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <i class="fas fa-robot text-red-600 mt-1"></i>
                                <div>
                                    <strong class="text-red-900">AI 元数据造假</strong>
                                    <p class="text-sm text-gray-600">伪造 AI 治理元数据 (VCP-GOV)</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <i class="fas fa-unlink text-red-600 mt-1"></i>
                                <div>
                                    <strong class="text-red-900">验证失败</strong>
                                    <p class="text-sm text-gray-600">审计证明未能通过密码学验证</p>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r">
                                <i class="fas fa-exclamation-triangle text-red-600 mt-1"></i>
                                <div>
                                    <strong class="text-red-900">政策违反</strong>
                                    <p class="text-sm text-gray-600">实质性违反 VSO 非背书政策</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-lg mt-4">
                            <p class="text-sm text-gray-800">
                                <strong><i class="fas fa-shield-alt text-slate-600 mr-2"></i>诚信保证：</strong>
                            </p>
                            <p class="text-sm text-gray-700 mt-2">
                                此撤销政策确保 <strong class="highlight">VC-Certified 作为真正技术合规标志的诚信</strong>。
                                组织必须持续维护 VCP 标准。
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FAQ: International Recognition -->
            <div class="bg-white rounded-lg shadow-md mb-4 faq-item">
                <button class="w-full text-left p-6 flex items-start justify-between gap-4" onclick="toggleFAQ(this)">
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-gray-800 mb-2">
                            <i class="fas fa-globe text-blue-600 mr-2"></i>
                            Q. 认证是否会获得国际认可？
                        </h3>
                    </div>
                    <i class="fas fa-chevron-down text-gray-400 faq-icon mt-1"></i>
                </button>
                <div class="faq-answer px-6 pb-6">
                    <div class="info-box p-4 rounded-md mb-4">
                        <p class="text-sm font-bold text-blue-900">
                            <i class="fas fa-handshake mr-2"></i>
                            A. VSO 与全球监管、学术和技术机构合作，促进互操作性。
                        </p>
                    </div>
                    <div class="text-gray-700 leading-relaxed space-y-3">
                        <p>
                            <strong class="highlight">VC-Certified 不是监管许可</strong>，但可能支持各司法管辖区的合规文档。
                        </p>
                        <div class="grid md:grid-cols-3 gap-3 mt-4">
                            <div class="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <i class="fas fa-university text-blue-600 text-2xl mb-2"></i>
                                <strong class="text-blue-900 text-sm">监管机构</strong>
                                <p class="text-xs text-gray-600 mt-1">与金融监管机构合作</p>
                            </div>
                            <div class="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <i class="fas fa-graduation-cap text-blue-600 text-2xl mb-2"></i>
                                <strong class="text-blue-900 text-sm">学术伙伴</strong>
                                <p class="text-xs text-gray-600 mt-1">研究合作</p>
                            </div>
                            <div class="flex flex-col items-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <i class="fas fa-cogs text-blue-600 text-2xl mb-2"></i>
                                <strong class="text-blue-900 text-sm">技术标准</strong>
                                <p class="text-xs text-gray-600 mt-1">行业互操作性</p>
                            </div>
                        </div>
                        <p class="mt-4 text-sm text-gray-600">
                            VCP 被设计为开放的国际标准，便于在不同监管环境中采用。
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer CTA -->
        <div class="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-lg shadow-xl p-8 mt-12">
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-3">
                    <i class="fas fa-question-circle mr-2"></i>
                    需要更多信息？
                </h3>
                <p class="text-slate-300 mb-6">
                    VeritasChain 标准组织 (VSO) 致力于为算法时代构建信任基础设施。
                </p>
                <div class="flex flex-wrap justify-center gap-4">
                    <a href="https://veritaschain.org" class="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-home mr-2"></i>官方网站
                    </a>
                    <a href="https://veritaschain.org/docs" class="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-book mr-2"></i>技术规范
                    </a>
                    <a href="mailto:info@veritaschain.org" class="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition-colors">
                        <i class="fas fa-envelope mr-2"></i>联系我们
                    </a>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="text-center text-gray-500 text-sm mt-8 pb-8">
            <p>© 2025 VeritasChain 标准组织 (VSO). 保留所有权利。</p>
            <p class="mt-2 italic">"验证，而非信任" — 在算法时代编码信任</p>
        </div>
    </div>

    <script>
        function toggleFAQ(button) {
            const faqItem = button.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const icon = button.querySelector('.faq-icon');
            
            // Close other open FAQs
            document.querySelectorAll('.faq-answer.active').forEach(item => {
                if (item !== answer) {
                    item.classList.remove('active');
                    item.parentElement.querySelector('.faq-icon').classList.remove('rotate');
                }
            });
            
            // Toggle current FAQ
            answer.classList.toggle('active');
            icon.classList.toggle('rotate');
        }
    </script>
</body>
</html>
`
