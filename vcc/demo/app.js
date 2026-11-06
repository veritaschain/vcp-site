/* Generated from app.jsx by tools/site-security/build-assets.cjs (Babel 8.1.0). */
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(r) { for (var t = 1; t < arguments.length; t++) { var o = null != arguments[t] ? arguments[t] : {}; t % 2 ? ownKeys(Object(o), !0).forEach(function (t) { _defineProperty(r, t, o[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(o)) : ownKeys(Object(o)).forEach(function (e) { Object.defineProperty(r, e, Object.getOwnPropertyDescriptor(o, e)); }); } return r; }
function _defineProperty(r, t, o) { return (t = _toPropertyKey(t)) in r ? Object.defineProperty(r, t, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : r[t] = o, r; }
function _toPropertyKey(r) { var o = _toPrimitive(r, "string"); return "symbol" == _typeof(o) ? o : o + ""; }
function _toPrimitive(t, e) { if ("object" != _typeof(t) || !t) return t; var r; if ("undefined" != typeof Symbol && void 0 !== (r = t[Symbol.toPrimitive])) { var i = r.call(t, e || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === e ? String : Number)(t); }
function _slicedToArray(e, i) { return _iterableToArrayLimit(e, i) || _unsupportedIterableToArray(e, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, t) { var e = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (Array.isArray(r) && (null == e || e === ("undefined" != typeof Symbol && [][Symbol.iterator]) || e === []["@@iterator"])) return r; if (null != e) { var l, n, i, a, u = [], o = !0, f = !1; try { if (i = (e = e.call(r)).next, 0 === t) { if (Object(e) !== e) return; o = !1; } else for (; !(o = (l = i.call(e)).done) && (u.push(l.value), u.length !== t); o = !0); } catch (r) { f = !0, n = r; } finally { try { if (!o && null != e["return"] && (a = e["return"](), Object(a) !== a)) return; } finally { if (f) throw n; } } return u; } }
function _createForOfIteratorHelper(e, t) { var _n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"]; if (!_n) { if (Array.isArray(e) || (_n = _unsupportedIterableToArray(e)) || t && e && "number" == typeof e.length) { _n && (e = _n); var o = 0, F = function F() {}; return { s: F, n: function n() { return o >= e.length ? { done: !0 } : { done: !1, value: e[o++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var a, u, i = !0; return { s: function s() { _n = _n.call(e); }, n: function n() { i = !0; var r = _n.next(); return r.done ? { done: !0 } : { value: r.value, done: i = !1 }; }, e: function e(r) { a = !0, u = r; }, f: function f() { try { i || null == _n["return"] || _n["return"](); } finally { if (a) throw u; } } }; }
function _unsupportedIterableToArray(t, e) { if (t) { if ("string" == typeof t) return _arrayLikeToArray(t, e); var o = {}.toString.call(t).slice(8, -1); return "Object" === o && t.constructor && (o = t.constructor.name), "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? _arrayLikeToArray(t, e) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { var r, e, o = "function" == typeof Symbol ? Symbol : {}, n = o.iterator || "@@iterator", a = o.toStringTag || "@@toStringTag"; function i(o, n, a, i) { var u = n && n.prototype instanceof Generator ? n : Generator, f = Object.create(u.prototype); return _regeneratorDefine2(f, "_invoke", function (t, o, n) { var a, i, u, f = 0, p = n || [], y = !1, G = { p: 0, n: 0, v: r, a: l, f: l.bind(r, 4), d: function d(t, e) { return a = t, i = 0, u = r, G.n = e, c; } }; function l(t, o) { for (i = t, u = o, e = 0; !y && f && !n && e < p.length; e++) { var n, a = p[e], l = G.p, F = a[2]; t > 3 ? (n = F === o) && (u = a[(i = a[4]) ? 5 : (i = 3, 3)], a[4] = a[5] = r) : a[0] <= l && ((n = t < 2 && l < a[1]) ? (i = 0, G.v = o, G.n = a[1]) : l < F && (n = t < 3 || a[0] > o || o > F) && (a[4] = t, a[5] = o, G.n = F, i = 0)); } if (n || t > 1) return c; throw y = !0, o; } return function (n, p, F) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && l(p, F), i = p, u = F; (e = i < 2 ? r : u) || !y;) { a || (i ? i < 3 ? (i > 1 && (G.n = -1), l(i, u)) : G.n = u : G.v = u); try { if (f = 2, a) { if (i || (n = "next"), e = a[n]) { if (!(e = e.call(a, u))) throw TypeError("iterator result is not an object"); if (!e.done) return e; u = e.value, i < 2 && (i = 0); } else 1 === i && (e = a["return"]) && e.call(a), i < 2 && (u = TypeError("The iterator does not provide a '" + n + "' method"), i = 1); a = r; } else if ((e = (y = G.n < 0) ? u : t.call(o, G)) !== c) break; } catch (t) { a = r, i = 1, u = t; } finally { f = 1; } } return { value: e, done: y }; }; }(o, a, i), !0), f; } var c = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} e = Object.getPrototypeOf; var u = [][n] ? e(e([][n]())) : (_regeneratorDefine2(e = {}, n, function () { return this; }), e), f = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(u); function p(r) { return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(r, a, "GeneratorFunction")), r.prototype = Object.create(f), r; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(f, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, a, "GeneratorFunction"), _regeneratorDefine2(f), _regeneratorDefine2(f, a, "Generator"), _regeneratorDefine2(f, n, function () { return this; }), _regeneratorDefine2(f, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: p }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useCallback = _React.useCallback,
  useMemo = _React.useMemo,
  useRef = _React.useRef;
var translations = {
  en: {
    title: 'VCC Demo',
    subtitle: 'VeritasChain Cloud - Client-Side Demo',
    dashboard: 'Dashboard',
    events: 'Events',
    anchors: 'Anchors',
    verify: 'Verify',
    tamper: 'Tamper Demo',
    tree: 'Merkle Tree',
    simulator: 'Simulator',
    totalEvents: 'Total Events',
    anchorsCreated: 'Anchors Created',
    pendingEvents: 'Pending Events',
    quickActions: 'Quick Actions',
    createSingleEvent: '+ Create Single Event',
    createTradeFlow: '📊 Create Trade Flow (5 events)',
    createMerkleAnchor: '🔗 Create Merkle Anchor',
    pending: 'pending',
    recentEvents: 'Recent Events',
    noEventsYet: 'No events yet. Create some above!',
    type: 'Type',
    symbol: 'Symbol',
    hash: 'Hash',
    status: 'Status',
    time: 'Time',
    action: 'Action',
    verifyBtn: 'Verify',
    allEvents: 'All Events',
    eventHash: 'Event Hash',
    merkleRoot: 'Merkle Root',
    anchorRecords: 'Anchor Records',
    noAnchorsYet: 'No anchors yet. Create events and anchor them!',
    verifyEvent: 'Verify Event',
    verifySubtitle: "Select an anchored event to verify its Merkle proof independently.",
    selectEvent: 'Select Event',
    selectAnchored: '-- Select an anchored event --',
    verificationResult: 'Verification Result',
    verificationPassed: 'VERIFICATION PASSED',
    verificationFailed: 'VERIFICATION FAILED',
    certificateId: 'Certificate ID',
    verificationMethod: 'Verification Method',
    verifiedAt: 'Verified At',
    merkleProof: 'Merkle Proof',
    steps: 'steps',
    exportJson: 'Export JSON',
    exportCert: 'Export Certificate',
    showQr: 'Show QR',
    tamperDemo: 'Tamper Detection Demo',
    tamperSubtitle: 'See what happens when data is modified after anchoring.',
    selectEventToTamper: 'Select an event to tamper with:',
    originalData: 'Original Data',
    simulateTamper: '⚠️ Simulate Tampering',
    tamperedData: 'Tampered Data (modified)',
    verifyTampered: '🔍 Verify Tampered Event',
    tamperExplanation: 'Why Verification Failed',
    tamperReason1: '1. The original event hash was recorded in the Merkle tree',
    tamperReason2: '2. Tampering changed the data, producing a different hash',
    tamperReason3: '3. The new hash cannot reach the same Merkle root',
    tamperReason4: '4. This proves the data was modified after anchoring',
    resetTamper: 'Reset',
    treeVisualization: 'Merkle Tree Visualization',
    selectAnchorToVisualize: 'Select an anchor to visualize its Merkle tree:',
    selectAnchor: '-- Select an anchor --',
    treeStats: 'Tree Statistics',
    treeDepth: 'Tree Depth',
    leafCount: 'Leaf Count',
    clickToHighlight: 'Click any leaf node to see its audit path to the root.',
    auditPath: 'Audit Path',
    liveSimulator: 'Live Trading Simulator',
    simulatorSubtitle: 'Simulates real-time price feeds and automatic event generation.',
    startSimulator: '▶️ Start Simulator',
    stopSimulator: '⏹️ Stop Simulator',
    simulatorRunning: 'Simulator Running',
    simulatorStopped: 'Simulator Stopped',
    priceFeeds: 'Price Feeds',
    autoAnchor: 'Auto-anchor every 10 events',
    eventsGenerated: 'Events Generated',
    searchFilter: 'Search & Filter',
    searchPlaceholder: 'Search by trace ID, symbol...',
    filterByType: 'Filter by Type',
    allTypes: 'All Types',
    filterByStatus: 'Filter by Status',
    allStatuses: 'All Statuses',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',
    clearAllData: 'Clear All Data',
    footer1: 'VCC Demo - Client-Side Demonstration (not a conformant VCP implementation)',
    footer2: 'This demo runs entirely in your browser using IndexedDB. No server required.',
    footer3: '⚠️ This is NOT VC-Certified and does not constitute VSO endorsement.',
    verifyDontTrust: '"Verify, Don\'t Trust"',
    downloadPdf: '📄 Download PDF',
    close: 'Close',
    qrTitle: 'Certificate QR Code',
    qrSubtitle: 'Scan to verify this certificate'
  },
  ja: {
    title: 'VCC デモ',
    subtitle: 'VeritasChain Cloud - クライアントサイドデモ',
    dashboard: 'ダッシュボード',
    events: 'イベント',
    anchors: 'アンカー',
    verify: '検証',
    tamper: '改ざん検知',
    tree: 'マークルツリー',
    simulator: 'シミュレータ',
    totalEvents: '総イベント数',
    anchorsCreated: 'アンカー数',
    pendingEvents: '保留中',
    quickActions: 'クイックアクション',
    createSingleEvent: '+ 単一イベント作成',
    createTradeFlow: '📊 トレードフロー作成 (5件)',
    createMerkleAnchor: '🔗 マークルアンカー作成',
    pending: '保留中',
    recentEvents: '最近のイベント',
    noEventsYet: 'イベントがありません。上のボタンで作成してください。',
    type: 'タイプ',
    symbol: 'シンボル',
    hash: 'ハッシュ',
    status: 'ステータス',
    time: '時刻',
    action: 'アクション',
    verifyBtn: '検証',
    allEvents: '全イベント',
    eventHash: 'イベントハッシュ',
    merkleRoot: 'マークルルート',
    anchorRecords: 'アンカー記録',
    noAnchorsYet: 'アンカーがありません。イベントを作成してアンカー化してください。',
    verifyEvent: 'イベント検証',
    verifySubtitle: 'アンカー化されたイベントを選択し、マークル証明を独立して検証します。',
    selectEvent: 'イベント選択',
    selectAnchored: '-- アンカー済みイベントを選択 --',
    verificationResult: '検証結果',
    verificationPassed: '検証成功',
    verificationFailed: '検証失敗',
    certificateId: '証明書ID',
    verificationMethod: '検証方式',
    verifiedAt: '検証日時',
    merkleProof: 'マークル証明',
    steps: 'ステップ',
    exportJson: 'JSON出力',
    exportCert: '証明書出力',
    showQr: 'QR表示',
    tamperDemo: '改ざん検知デモ',
    tamperSubtitle: 'アンカー後にデータが変更されると何が起こるか確認できます。',
    selectEventToTamper: '改ざんするイベントを選択:',
    originalData: '元データ',
    simulateTamper: '⚠️ 改ざんをシミュレート',
    tamperedData: '改ざんデータ（変更済み）',
    verifyTampered: '🔍 改ざんデータを検証',
    tamperExplanation: '検証が失敗した理由',
    tamperReason1: '1. 元のイベントハッシュがマークルツリーに記録されています',
    tamperReason2: '2. 改ざんによりデータが変更され、異なるハッシュが生成されました',
    tamperReason3: '3. 新しいハッシュでは同じマークルルートに到達できません',
    tamperReason4: '4. これはデータがアンカー後に変更されたことを証明しています',
    resetTamper: 'リセット',
    treeVisualization: 'マークルツリー可視化',
    selectAnchorToVisualize: '可視化するアンカーを選択:',
    selectAnchor: '-- アンカーを選択 --',
    treeStats: 'ツリー統計',
    treeDepth: 'ツリー深度',
    leafCount: 'リーフ数',
    clickToHighlight: 'リーフノードをクリックすると、ルートへの監査パスが表示されます。',
    auditPath: '監査パス',
    liveSimulator: 'ライブ取引シミュレータ',
    simulatorSubtitle: 'リアルタイム価格フィードと自動イベント生成をシミュレートします。',
    startSimulator: '▶️ シミュレータ開始',
    stopSimulator: '⏹️ シミュレータ停止',
    simulatorRunning: 'シミュレータ実行中',
    simulatorStopped: 'シミュレータ停止中',
    priceFeeds: '価格フィード',
    autoAnchor: '10イベントごとに自動アンカー',
    eventsGenerated: '生成イベント数',
    searchFilter: '検索・フィルタ',
    searchPlaceholder: 'トレースID、シンボルで検索...',
    filterByType: 'タイプでフィルタ',
    allTypes: '全タイプ',
    filterByStatus: 'ステータスでフィルタ',
    allStatuses: '全ステータス',
    darkMode: 'ダークモード',
    lightMode: 'ライトモード',
    language: '言語',
    clearAllData: '全データ削除',
    footer1: 'VCC デモ - クライアントサイドリファレンス実装',
    footer2: 'このデモはIndexedDBを使用してブラウザ内で完全に動作します。サーバー不要。',
    footer3: '⚠️ これはVC-Certified認証を受けておらず、VSOの推奨を意味するものではありません。',
    verifyDontTrust: '「信頼するな、検証せよ」',
    downloadPdf: '📄 PDF出力',
    close: '閉じる',
    qrTitle: '証明書QRコード',
    qrSubtitle: 'スキャンして証明書を検証'
  },
  zh: {
    title: 'VCC 演示',
    subtitle: 'VeritasChain Cloud - 客户端演示',
    dashboard: '仪表板',
    events: '事件',
    anchors: '锚点',
    verify: '验证',
    tamper: '篡改检测',
    tree: '默克尔树',
    simulator: '模拟器',
    totalEvents: '总事件数',
    anchorsCreated: '锚点数',
    pendingEvents: '待处理',
    quickActions: '快捷操作',
    createSingleEvent: '+ 创建单个事件',
    createTradeFlow: '📊 创建交易流程 (5个事件)',
    createMerkleAnchor: '🔗 创建默克尔锚点',
    pending: '待处理',
    recentEvents: '最近事件',
    noEventsYet: '暂无事件。请使用上方按钮创建。',
    type: '类型',
    symbol: '符号',
    hash: '哈希',
    status: '状态',
    time: '时间',
    action: '操作',
    verifyBtn: '验证',
    allEvents: '所有事件',
    eventHash: '事件哈希',
    merkleRoot: '默克尔根',
    anchorRecords: '锚点记录',
    noAnchorsYet: '暂无锚点。请创建事件并锚定。',
    verifyEvent: '事件验证',
    verifySubtitle: '选择已锚定的事件，独立验证其默克尔证明。',
    selectEvent: '选择事件',
    selectAnchored: '-- 选择已锚定事件 --',
    verificationResult: '验证结果',
    verificationPassed: '验证通过',
    verificationFailed: '验证失败',
    certificateId: '证书ID',
    verificationMethod: '验证方法',
    verifiedAt: '验证时间',
    merkleProof: '默克尔证明',
    steps: '步骤',
    exportJson: '导出JSON',
    exportCert: '导出证书',
    showQr: '显示二维码',
    tamperDemo: '篡改检测演示',
    tamperSubtitle: '查看锚定后数据被修改时会发生什么。',
    selectEventToTamper: '选择要篡改的事件:',
    originalData: '原始数据',
    simulateTamper: '⚠️ 模拟篡改',
    tamperedData: '已篡改数据（已修改）',
    verifyTampered: '🔍 验证已篡改事件',
    tamperExplanation: '验证失败的原因',
    tamperReason1: '1. 原始事件哈希已记录在默克尔树中',
    tamperReason2: '2. 篡改更改了数据，产生了不同的哈希',
    tamperReason3: '3. 新哈希无法到达相同的默克尔根',
    tamperReason4: '4. 这证明数据在锚定后被修改',
    resetTamper: '重置',
    treeVisualization: '默克尔树可视化',
    selectAnchorToVisualize: '选择要可视化的锚点:',
    selectAnchor: '-- 选择锚点 --',
    treeStats: '树统计',
    treeDepth: '树深度',
    leafCount: '叶节点数',
    clickToHighlight: '点击任意叶节点查看其到根的审计路径。',
    auditPath: '审计路径',
    liveSimulator: '实时交易模拟器',
    simulatorSubtitle: '模拟实时价格馈送和自动事件生成。',
    startSimulator: '▶️ 启动模拟器',
    stopSimulator: '⏹️ 停止模拟器',
    simulatorRunning: '模拟器运行中',
    simulatorStopped: '模拟器已停止',
    priceFeeds: '价格馈送',
    autoAnchor: '每10个事件自动锚定',
    eventsGenerated: '已生成事件',
    searchFilter: '搜索和筛选',
    searchPlaceholder: '按跟踪ID、符号搜索...',
    filterByType: '按类型筛选',
    allTypes: '所有类型',
    filterByStatus: '按状态筛选',
    allStatuses: '所有状态',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    language: '语言',
    clearAllData: '清除所有数据',
    footer1: 'VCC演示 - 客户端参考实现',
    footer2: '此演示完全在浏览器中使用IndexedDB运行。无需服务器。',
    footer3: '⚠️ 这不是VC-Certified认证，不代表VSO的认可。',
    verifyDontTrust: '"验证，而非信任"',
    downloadPdf: '📄 下载PDF',
    close: '关闭',
    qrTitle: '证书二维码',
    qrSubtitle: '扫描以验证此证书'
  },
  es: {
    title: 'VCC Demo',
    subtitle: 'VeritasChain Cloud - Demo del Cliente',
    dashboard: 'Panel',
    events: 'Eventos',
    anchors: 'Anclas',
    verify: 'Verificar',
    tamper: 'Demo Manipulación',
    tree: 'Árbol Merkle',
    simulator: 'Simulador',
    totalEvents: 'Total de Eventos',
    anchorsCreated: 'Anclas Creadas',
    pendingEvents: 'Eventos Pendientes',
    quickActions: 'Acciones Rápidas',
    createSingleEvent: '+ Crear Evento Individual',
    createTradeFlow: '📊 Crear Flujo de Trading (5 eventos)',
    createMerkleAnchor: '🔗 Crear Ancla Merkle',
    pending: 'pendiente',
    recentEvents: 'Eventos Recientes',
    noEventsYet: 'Sin eventos aún. ¡Crea algunos arriba!',
    type: 'Tipo',
    symbol: 'Símbolo',
    hash: 'Hash',
    status: 'Estado',
    time: 'Hora',
    action: 'Acción',
    verifyBtn: 'Verificar',
    allEvents: 'Todos los Eventos',
    eventHash: 'Hash del Evento',
    merkleRoot: 'Raíz Merkle',
    anchorRecords: 'Registros de Anclas',
    noAnchorsYet: 'Sin anclas aún. ¡Crea eventos y anclarlos!',
    verifyEvent: 'Verificar Evento',
    verifySubtitle: 'Selecciona un evento anclado para verificar su prueba Merkle independientemente.',
    selectEvent: 'Seleccionar Evento',
    selectAnchored: '-- Seleccionar evento anclado --',
    verificationResult: 'Resultado de Verificación',
    verificationPassed: 'VERIFICACIÓN EXITOSA',
    verificationFailed: 'VERIFICACIÓN FALLIDA',
    certificateId: 'ID del Certificado',
    verificationMethod: 'Método de Verificación',
    verifiedAt: 'Verificado En',
    merkleProof: 'Prueba Merkle',
    steps: 'pasos',
    exportJson: 'Exportar JSON',
    exportCert: 'Exportar Certificado',
    showQr: 'Mostrar QR',
    tamperDemo: 'Demo de Detección de Manipulación',
    tamperSubtitle: 'Ve qué sucede cuando los datos se modifican después del anclaje.',
    selectEventToTamper: 'Selecciona un evento para manipular:',
    originalData: 'Datos Originales',
    simulateTamper: '⚠️ Simular Manipulación',
    tamperedData: 'Datos Manipulados (modificados)',
    verifyTampered: '🔍 Verificar Evento Manipulado',
    tamperExplanation: 'Por Qué Falló la Verificación',
    tamperReason1: '1. El hash del evento original fue registrado en el árbol Merkle',
    tamperReason2: '2. La manipulación cambió los datos, produciendo un hash diferente',
    tamperReason3: '3. El nuevo hash no puede alcanzar la misma raíz Merkle',
    tamperReason4: '4. Esto prueba que los datos fueron modificados después del anclaje',
    resetTamper: 'Reiniciar',
    treeVisualization: 'Visualización del Árbol Merkle',
    selectAnchorToVisualize: 'Selecciona un ancla para visualizar:',
    selectAnchor: '-- Seleccionar ancla --',
    treeStats: 'Estadísticas del Árbol',
    treeDepth: 'Profundidad',
    leafCount: 'Cantidad de Hojas',
    clickToHighlight: 'Haz clic en cualquier nodo hoja para ver su ruta de auditoría hasta la raíz.',
    auditPath: 'Ruta de Auditoría',
    liveSimulator: 'Simulador de Trading en Vivo',
    simulatorSubtitle: 'Simula feeds de precios en tiempo real y generación automática de eventos.',
    startSimulator: '▶️ Iniciar Simulador',
    stopSimulator: '⏹️ Detener Simulador',
    simulatorRunning: 'Simulador Ejecutándose',
    simulatorStopped: 'Simulador Detenido',
    priceFeeds: 'Feeds de Precios',
    autoAnchor: 'Auto-anclar cada 10 eventos',
    eventsGenerated: 'Eventos Generados',
    searchFilter: 'Buscar y Filtrar',
    searchPlaceholder: 'Buscar por trace ID, símbolo...',
    filterByType: 'Filtrar por Tipo',
    allTypes: 'Todos los Tipos',
    filterByStatus: 'Filtrar por Estado',
    allStatuses: 'Todos los Estados',
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro',
    language: 'Idioma',
    clearAllData: 'Borrar Todos los Datos',
    footer1: 'VCC Demo - Implementación de Referencia del Cliente',
    footer2: 'Este demo se ejecuta completamente en tu navegador usando IndexedDB. Sin servidor.',
    footer3: '⚠️ Esto NO está VC-Certified y no constituye respaldo de VSO.',
    verifyDontTrust: '"Verifica, No Confíes"',
    downloadPdf: '📄 Descargar PDF',
    close: 'Cerrar',
    qrTitle: 'Código QR del Certificado',
    qrSubtitle: 'Escanea para verificar este certificado'
  }
};
var useTranslation = function useTranslation(lang) {
  return useCallback(function (key) {
    var _translations$lang;
    return ((_translations$lang = translations[lang]) === null || _translations$lang === void 0 ? void 0 : _translations$lang[key]) || translations.en[key] || key;
  }, [lang]);
};
var generateUUIDv7 = function generateUUIDv7() {
  var now = BigInt(Date.now());
  var timeHex = now.toString(16).padStart(12, '0');
  var randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  var randomHex = Array.from(randomBytes).map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
  return "".concat(timeHex.slice(0, 8), "-").concat(timeHex.slice(8, 12), "-7").concat(randomHex.slice(0, 3), "-").concat((0x80 | parseInt(randomHex.slice(3, 5), 16) & 0x3f).toString(16)).concat(randomHex.slice(5, 7), "-").concat(randomHex.slice(7, 19));
};
var sha256 = function () {
  var _sha = _asyncToGenerator(_regenerator().m(function _callee(data) {
    var encoder, dataBuffer, hashBuffer;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          encoder = new TextEncoder();
          dataBuffer = encoder.encode(typeof data === 'string' ? data : JSON.stringify(data));
          _context.n = 1;
          return crypto.subtle.digest('SHA-256', dataBuffer);
        case 1:
          hashBuffer = _context.v;
          return _context.a(2, Array.from(new Uint8Array(hashBuffer)).map(function (b) {
            return b.toString(16).padStart(2, '0');
          }).join(''));
      }
    }, _callee);
  }));
  function sha256(_x) {
    return _sha.apply(this, arguments);
  }
  return sha256;
}();
var merkleHashLeaf = function () {
  var _merkleHashLeaf = _asyncToGenerator(_regenerator().m(function _callee2(data) {
    var prefix, dataBytes, combined, hash;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          prefix = new Uint8Array([0x00]);
          dataBytes = new TextEncoder().encode(data);
          combined = new Uint8Array(prefix.length + dataBytes.length);
          combined.set(prefix);
          combined.set(dataBytes, prefix.length);
          _context2.n = 1;
          return crypto.subtle.digest('SHA-256', combined);
        case 1:
          hash = _context2.v;
          return _context2.a(2, Array.from(new Uint8Array(hash)).map(function (b) {
            return b.toString(16).padStart(2, '0');
          }).join(''));
      }
    }, _callee2);
  }));
  function merkleHashLeaf(_x2) {
    return _merkleHashLeaf.apply(this, arguments);
  }
  return merkleHashLeaf;
}();
var merkleHashNode = function () {
  var _merkleHashNode = _asyncToGenerator(_regenerator().m(function _callee3(left, right) {
    var prefix, leftBytes, rightBytes, combined, hash;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          prefix = new Uint8Array([0x01]);
          leftBytes = new Uint8Array(left.match(/.{2}/g).map(function (h) {
            return parseInt(h, 16);
          }));
          rightBytes = new Uint8Array(right.match(/.{2}/g).map(function (h) {
            return parseInt(h, 16);
          }));
          combined = new Uint8Array(prefix.length + leftBytes.length + rightBytes.length);
          combined.set(prefix);
          combined.set(leftBytes, prefix.length);
          combined.set(rightBytes, prefix.length + leftBytes.length);
          _context3.n = 1;
          return crypto.subtle.digest('SHA-256', combined);
        case 1:
          hash = _context3.v;
          return _context3.a(2, Array.from(new Uint8Array(hash)).map(function (b) {
            return b.toString(16).padStart(2, '0');
          }).join(''));
      }
    }, _callee3);
  }));
  function merkleHashNode(_x3, _x4) {
    return _merkleHashNode.apply(this, arguments);
  }
  return merkleHashNode;
}();
var buildMerkleTree = function () {
  var _buildMerkleTree = _asyncToGenerator(_regenerator().m(function _callee4(hashes) {
    var leaves, tree, nextLevel, i, _t;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          if (!(hashes.length === 0)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, []);
        case 1:
          _context4.n = 2;
          return Promise.all(hashes.map(function (h) {
            return merkleHashLeaf(h);
          }));
        case 2:
          leaves = _context4.v;
          tree = [leaves];
        case 3:
          if (!(leaves.length > 1)) {
            _context4.n = 9;
            break;
          }
          nextLevel = [];
          i = 0;
        case 4:
          if (!(i < leaves.length)) {
            _context4.n = 8;
            break;
          }
          if (!(i + 1 < leaves.length)) {
            _context4.n = 6;
            break;
          }
          _t = nextLevel;
          _context4.n = 5;
          return merkleHashNode(leaves[i], leaves[i + 1]);
        case 5:
          _t.push.call(_t, _context4.v);
          _context4.n = 7;
          break;
        case 6:
          nextLevel.push(leaves[i]);
        case 7:
          i += 2;
          _context4.n = 4;
          break;
        case 8:
          tree.push(nextLevel);
          leaves = nextLevel;
          _context4.n = 3;
          break;
        case 9:
          return _context4.a(2, tree);
      }
    }, _callee4);
  }));
  function buildMerkleTree(_x5) {
    return _buildMerkleTree.apply(this, arguments);
  }
  return buildMerkleTree;
}();
var getMerkleRoot = function getMerkleRoot(tree) {
  return tree.length > 0 ? tree[tree.length - 1][0] : null;
};
var generateAuditPath = function generateAuditPath(tree, leafIndex) {
  var path = [];
  var idx = leafIndex;
  for (var level = 0; level < tree.length - 1; level++) {
    var isRight = idx % 2 === 1;
    var siblingIdx = isRight ? idx - 1 : idx + 1;
    if (siblingIdx < tree[level].length) {
      path.push({
        hash: tree[level][siblingIdx],
        position: isRight ? 'left' : 'right',
        level: level,
        siblingIdx: siblingIdx
      });
    }
    idx = Math.floor(idx / 2);
  }
  return path;
};
var verifyMerkleProof = function () {
  var _verifyMerkleProof = _asyncToGenerator(_regenerator().m(function _callee5(eventHash, merkleRoot, auditPath) {
    var currentHash, _iterator, _step, step, _t2;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.n = 1;
          return merkleHashLeaf(eventHash);
        case 1:
          currentHash = _context5.v;
          _iterator = _createForOfIteratorHelper(auditPath);
          _context5.p = 2;
          _iterator.s();
        case 3:
          if ((_step = _iterator.n()).done) {
            _context5.n = 8;
            break;
          }
          step = _step.value;
          if (!(step.position === 'left')) {
            _context5.n = 5;
            break;
          }
          _context5.n = 4;
          return merkleHashNode(step.hash, currentHash);
        case 4:
          currentHash = _context5.v;
          _context5.n = 7;
          break;
        case 5:
          _context5.n = 6;
          return merkleHashNode(currentHash, step.hash);
        case 6:
          currentHash = _context5.v;
        case 7:
          _context5.n = 3;
          break;
        case 8:
          _context5.n = 10;
          break;
        case 9:
          _context5.p = 9;
          _t2 = _context5.v;
          _iterator.e(_t2);
        case 10:
          _context5.p = 10;
          _iterator.f();
          return _context5.f(10);
        case 11:
          return _context5.a(2, currentHash === merkleRoot);
      }
    }, _callee5, null, [[2, 9, 10, 11]]);
  }));
  function verifyMerkleProof(_x6, _x7, _x8) {
    return _verifyMerkleProof.apply(this, arguments);
  }
  return verifyMerkleProof;
}();
var EVENT_TYPES = {
  SIG: {
    code: 1,
    name: 'Signal Generated',
    color: 'blue'
  },
  ORD: {
    code: 2,
    name: 'Order Submitted',
    color: 'yellow'
  },
  ACK: {
    code: 3,
    name: 'Order Acknowledged',
    color: 'green'
  },
  REJ: {
    code: 6,
    name: 'Order Rejected',
    color: 'red'
  },
  EXE: {
    code: 4,
    name: 'Execution',
    color: 'purple'
  },
  CXL: {
    code: 7,
    name: 'Cancellation',
    color: 'orange'
  },
  CLS: {
    code: 9,
    name: 'Position Closed',
    color: 'gray'
  }
};
var DB_NAME = 'VCCDemo';
var DB_VERSION = 1;
var openDB = function openDB() {
  return new Promise(function (resolve, reject) {
    var request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = function () {
      return reject(request.error);
    };
    request.onsuccess = function () {
      return resolve(request.result);
    };
    request.onupgradeneeded = function (e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('events')) {
        var eventStore = db.createObjectStore('events', {
          keyPath: 'event_id'
        });
        eventStore.createIndex('trace_id', 'trace_id', {
          unique: false
        });
        eventStore.createIndex('account_id', 'account_id', {
          unique: false
        });
        eventStore.createIndex('timestamp', 'timestamp_int', {
          unique: false
        });
      }
      if (!db.objectStoreNames.contains('anchors')) {
        db.createObjectStore('anchors', {
          keyPath: 'anchor_id'
        });
      }
    };
  });
};
var dbOperation = function () {
  var _dbOperation = _asyncToGenerator(_regenerator().m(function _callee6(storeName, mode, operation) {
    var db;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return openDB();
        case 1:
          db = _context6.v;
          return _context6.a(2, new Promise(function (resolve, reject) {
            var tx = db.transaction(storeName, mode);
            var store = tx.objectStore(storeName);
            var request = operation(store);
            request.onsuccess = function () {
              return resolve(request.result);
            };
            request.onerror = function () {
              return reject(request.error);
            };
          }));
      }
    }, _callee6);
  }));
  function dbOperation(_x9, _x0, _x1) {
    return _dbOperation.apply(this, arguments);
  }
  return dbOperation;
}();
var VCCService = {
  createEvent: function createEvent(eventType, symbol, accountId) {
    var _arguments = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee7() {
      var _EVENT_TYPES$eventTyp;
      var payload, eventId, traceId, now, event, hashInput;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            payload = _arguments.length > 3 && _arguments[3] !== undefined ? _arguments[3] : {};
            eventId = generateUUIDv7();
            traceId = payload.trace_id || generateUUIDv7();
            now = Date.now();
            event = {
              event_id: eventId,
              trace_id: traceId,
              timestamp_int: now * 1000000,
              timestamp_iso: new Date(now).toISOString(),
              event_type: eventType,
              event_type_code: ((_EVENT_TYPES$eventTyp = EVENT_TYPES[eventType]) === null || _EVENT_TYPES$eventTyp === void 0 ? void 0 : _EVENT_TYPES$eventTyp.code) || 0,
              symbol: symbol,
              venue_id: 'VCC-DEMO',
              account_id: accountId,
              payload: payload,
              anchor_status: 'PENDING',
              created_at: new Date().toISOString()
            };
            hashInput = {
              event_id: event.event_id,
              trace_id: event.trace_id,
              timestamp_int: event.timestamp_int,
              event_type: event.event_type,
              symbol: event.symbol,
              venue_id: event.venue_id,
              account_id: event.account_id,
              payload: event.payload
            };
            _context7.n = 1;
            return sha256(hashInput);
          case 1:
            event.event_hash = _context7.v;
            _context7.n = 2;
            return dbOperation('events', 'readwrite', function (store) {
              return store.add(event);
            });
          case 2:
            return _context7.a(2, event);
        }
      }, _callee7);
    }))();
  },
  getEvents: function getEvents() {
    var _arguments2 = arguments;
    return _asyncToGenerator(_regenerator().m(function _callee8() {
      var limit, db;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            limit = _arguments2.length > 0 && _arguments2[0] !== undefined ? _arguments2[0] : 500;
            _context8.n = 1;
            return openDB();
          case 1:
            db = _context8.v;
            return _context8.a(2, new Promise(function (resolve) {
              var tx = db.transaction('events', 'readonly');
              var store = tx.objectStore('events');
              var events = [];
              store.openCursor(null, 'prev').onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor && events.length < limit) {
                  events.push(cursor.value);
                  cursor["continue"]();
                } else {
                  resolve(events);
                }
              };
            }));
        }
      }, _callee8);
    }))();
  },
  getPendingEvents: function getPendingEvents() {
    var _this = this;
    return _asyncToGenerator(_regenerator().m(function _callee9() {
      var events;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.n = 1;
            return _this.getEvents(500);
          case 1:
            events = _context9.v;
            return _context9.a(2, events.filter(function (e) {
              return e.anchor_status === 'PENDING';
            }));
        }
      }, _callee9);
    }))();
  },
  createAnchor: function createAnchor() {
    var _this2 = this;
    return _asyncToGenerator(_regenerator().m(function _callee0() {
      var pending, eventHashes, tree, merkleRoot, anchorId, anchor, db, tx, store, i;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            _context0.n = 1;
            return _this2.getPendingEvents();
          case 1:
            pending = _context0.v;
            if (!(pending.length === 0)) {
              _context0.n = 2;
              break;
            }
            return _context0.a(2, null);
          case 2:
            pending.sort(function (a, b) {
              return a.timestamp_int - b.timestamp_int;
            });
            eventHashes = pending.map(function (e) {
              return e.event_hash;
            });
            _context0.n = 3;
            return buildMerkleTree(eventHashes);
          case 3:
            tree = _context0.v;
            merkleRoot = getMerkleRoot(tree);
            anchorId = generateUUIDv7();
            anchor = {
              anchor_id: anchorId,
              merkle_root: merkleRoot,
              timestamp_iso: new Date().toISOString(),
              anchor_type: 'CLIENT_DEMO',
              anchor_identifier: 'browser-indexeddb',
              event_count: pending.length,
              event_ids: pending.map(function (e) {
                return e.event_id;
              }),
              event_hashes: eventHashes,
              status: 'ANCHORED',
              tree: tree
            };
            _context0.n = 4;
            return dbOperation('anchors', 'readwrite', function (store) {
              return store.add(anchor);
            });
          case 4:
            _context0.n = 5;
            return openDB();
          case 5:
            db = _context0.v;
            tx = db.transaction('events', 'readwrite');
            store = tx.objectStore('events');
            for (i = 0; i < pending.length; i++) {
              pending[i].anchor_status = 'ANCHORED';
              pending[i].anchor_reference = anchorId;
              pending[i].merkle_root = merkleRoot;
              pending[i].merkle_index = i;
              store.put(pending[i]);
            }
            return _context0.a(2, anchor);
        }
      }, _callee0);
    }))();
  },
  getAnchors: function getAnchors() {
    return _asyncToGenerator(_regenerator().m(function _callee1() {
      var db;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.n = 1;
            return openDB();
          case 1:
            db = _context1.v;
            return _context1.a(2, new Promise(function (resolve) {
              var tx = db.transaction('anchors', 'readonly');
              var store = tx.objectStore('anchors');
              var anchors = [];
              store.openCursor(null, 'prev').onsuccess = function (e) {
                var cursor = e.target.result;
                if (cursor) {
                  anchors.push(cursor.value);
                  cursor["continue"]();
                } else {
                  resolve(anchors);
                }
              };
            }));
        }
      }, _callee1);
    }))();
  },
  getEventProof: function getEventProof(eventId) {
    return _asyncToGenerator(_regenerator().m(function _callee10() {
      var event, anchor, auditPath;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.n = 1;
            return dbOperation('events', 'readonly', function (store) {
              return store.get(eventId);
            });
          case 1:
            event = _context10.v;
            if (!(!event || event.anchor_status !== 'ANCHORED')) {
              _context10.n = 2;
              break;
            }
            return _context10.a(2, null);
          case 2:
            _context10.n = 3;
            return dbOperation('anchors', 'readonly', function (store) {
              return store.get(event.anchor_reference);
            });
          case 3:
            anchor = _context10.v;
            if (!(!anchor || !anchor.tree)) {
              _context10.n = 4;
              break;
            }
            return _context10.a(2, null);
          case 4:
            auditPath = generateAuditPath(anchor.tree, event.merkle_index);
            return _context10.a(2, {
              event_id: event.event_id,
              event_hash: event.event_hash,
              merkle_root: event.merkle_root,
              merkle_index: event.merkle_index,
              audit_path: auditPath,
              anchor_id: event.anchor_reference
            });
        }
      }, _callee10);
    }))();
  },
  verifyCertificate: function verifyCertificate(eventId) {
    var _this3 = this;
    return _asyncToGenerator(_regenerator().m(function _callee11() {
      var proof, event, isValid;
      return _regenerator().w(function (_context11) {
        while (1) switch (_context11.n) {
          case 0:
            _context11.n = 1;
            return _this3.getEventProof(eventId);
          case 1:
            proof = _context11.v;
            if (proof) {
              _context11.n = 2;
              break;
            }
            return _context11.a(2, {
              valid: false,
              reason: 'No proof available'
            });
          case 2:
            _context11.n = 3;
            return dbOperation('events', 'readonly', function (store) {
              return store.get(eventId);
            });
          case 3:
            event = _context11.v;
            _context11.n = 4;
            return verifyMerkleProof(event.event_hash, proof.merkle_root, proof.audit_path);
          case 4:
            isValid = _context11.v;
            return _context11.a(2, {
              valid: isValid,
              certificate: {
                certificate_id: generateUUIDv7(),
                event_id: eventId,
                event_hash: event.event_hash,
                merkle_root: proof.merkle_root,
                merkle_proof: proof.audit_path,
                verified_at: new Date().toISOString(),
                verification_method: 'RFC6962_MERKLE'
              }
            });
        }
      }, _callee11);
    }))();
  },
  verifyWithCustomHash: function verifyWithCustomHash(customHash, merkleRoot, auditPath) {
    return _asyncToGenerator(_regenerator().m(function _callee12() {
      return _regenerator().w(function (_context12) {
        while (1) switch (_context12.n) {
          case 0:
            _context12.n = 1;
            return verifyMerkleProof(customHash, merkleRoot, auditPath);
          case 1:
            return _context12.a(2, _context12.v);
        }
      }, _callee12);
    }))();
  },
  clearAll: function clearAll() {
    return _asyncToGenerator(_regenerator().m(function _callee13() {
      var db, tx;
      return _regenerator().w(function (_context13) {
        while (1) switch (_context13.n) {
          case 0:
            _context13.n = 1;
            return openDB();
          case 1:
            db = _context13.v;
            tx = db.transaction(['events', 'anchors'], 'readwrite');
            tx.objectStore('events').clear();
            tx.objectStore('anchors').clear();
          case 2:
            return _context13.a(2);
        }
      }, _callee13);
    }))();
  },
  getStats: function getStats() {
    var _this4 = this;
    return _asyncToGenerator(_regenerator().m(function _callee14() {
      var events, anchors, pending;
      return _regenerator().w(function (_context14) {
        while (1) switch (_context14.n) {
          case 0:
            _context14.n = 1;
            return _this4.getEvents(1000);
          case 1:
            events = _context14.v;
            _context14.n = 2;
            return _this4.getAnchors();
          case 2:
            anchors = _context14.v;
            pending = events.filter(function (e) {
              return e.anchor_status === 'PENDING';
            }).length;
            return _context14.a(2, {
              events_count: events.length,
              anchors_count: anchors.length,
              pending_count: pending
            });
        }
      }, _callee14);
    }))();
  }
};
var Badge = function Badge(_ref) {
  var color = _ref.color,
    children = _ref.children,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className;
  var colors = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };
  return React.createElement("span", {
    className: "px-2 py-1 rounded text-xs font-medium ".concat(colors[color] || colors.gray, " ").concat(className)
  }, children);
};
var Card = function Card(_ref2) {
  var title = _ref2.title,
    children = _ref2.children,
    _ref2$className = _ref2.className,
    className = _ref2$className === void 0 ? '' : _ref2$className;
  return React.createElement("div", {
    className: "bg-white dark:bg-gray-800 rounded-lg shadow p-4 ".concat(className)
  }, title && React.createElement("h3", {
    className: "font-semibold text-gray-700 dark:text-gray-200 mb-3"
  }, title), children);
};
var Modal = function Modal(_ref3) {
  var isOpen = _ref3.isOpen,
    onClose = _ref3.onClose,
    title = _ref3.title,
    children = _ref3.children;
  if (!isOpen) return null;
  return React.createElement("div", {
    className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  }, React.createElement("div", {
    className: "bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-auto"
  }, React.createElement("div", {
    className: "flex justify-between items-center p-4 border-b dark:border-gray-700"
  }, React.createElement("h3", {
    className: "font-semibold text-gray-700 dark:text-gray-200"
  }, title), React.createElement("button", {
    onClick: onClose,
    className: "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
  }, "\u2715")), React.createElement("div", {
    className: "p-4"
  }, children)));
};
var MerkleTreeVisualization = function MerkleTreeVisualization(_ref4) {
  var anchor = _ref4.anchor,
    t = _ref4.t,
    onSelectLeaf = _ref4.onSelectLeaf;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    highlightedPath = _useState2[0],
    setHighlightedPath = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    selectedLeaf = _useState4[0],
    setSelectedLeaf = _useState4[1];
  if (!anchor || !anchor.tree || anchor.tree.length === 0) {
    return React.createElement("div", {
      className: "text-gray-500 dark:text-gray-400 text-center py-8"
    }, "No tree data available");
  }
  var tree = anchor.tree;
  var maxWidth = tree[0].length;
  var height = tree.length;
  var handleLeafClick = function handleLeafClick(leafIndex) {
    setSelectedLeaf(leafIndex);
    var path = generateAuditPath(tree, leafIndex);
    var highlighted = [{
      level: 0,
      index: leafIndex
    }];
    var idx = leafIndex;
    for (var level = 0; level < tree.length - 1; level++) {
      var parentIdx = Math.floor(idx / 2);
      highlighted.push({
        level: level + 1,
        index: parentIdx
      });
      idx = parentIdx;
    }
    path.forEach(function (p) {
      highlighted.push({
        level: p.level,
        index: p.siblingIdx
      });
    });
    setHighlightedPath(highlighted);
    if (onSelectLeaf) onSelectLeaf(leafIndex, path);
  };
  var isHighlighted = function isHighlighted(level, index) {
    return highlightedPath.some(function (h) {
      return h.level === level && h.index === index;
    });
  };
  var nodeWidth = 60;
  var nodeHeight = 30;
  var levelGap = 50;
  var svgWidth = Math.max(maxWidth * (nodeWidth + 20), 400);
  var svgHeight = height * levelGap + 60;
  return React.createElement("div", {
    className: "overflow-auto"
  }, React.createElement("svg", {
    width: svgWidth,
    height: svgHeight,
    className: "mx-auto"
  }, tree.map(function (level, levelIdx) {
    var y = svgHeight - (levelIdx + 1) * levelGap;
    var levelWidth = level.length * (nodeWidth + 10);
    var startX = (svgWidth - levelWidth) / 2;
    return level.map(function (hash, nodeIdx) {
      var x = startX + nodeIdx * (nodeWidth + 10) + nodeWidth / 2;
      var highlighted = isHighlighted(levelIdx, nodeIdx);
      var line = null;
      if (levelIdx < tree.length - 1) {
        var parentIdx = Math.floor(nodeIdx / 2);
        var parentLevel = tree[levelIdx + 1];
        var parentLevelWidth = parentLevel.length * (nodeWidth + 10);
        var parentStartX = (svgWidth - parentLevelWidth) / 2;
        var parentX = parentStartX + parentIdx * (nodeWidth + 10) + nodeWidth / 2;
        var parentY = svgHeight - (levelIdx + 2) * levelGap + nodeHeight / 2;
        var lineHighlighted = highlighted && isHighlighted(levelIdx + 1, parentIdx);
        line = React.createElement("line", {
          key: "line-".concat(levelIdx, "-").concat(nodeIdx),
          x1: x,
          y1: y,
          x2: parentX,
          y2: parentY,
          className: "tree-line ".concat(lineHighlighted ? 'highlighted' : '')
        });
      }
      return React.createElement("g", {
        key: "node-".concat(levelIdx, "-").concat(nodeIdx)
      }, line, React.createElement("rect", {
        x: x - nodeWidth / 2,
        y: y,
        width: nodeWidth,
        height: nodeHeight,
        rx: "4",
        className: "tree-node cursor-pointer ".concat(highlighted ? 'fill-yellow-300 dark:fill-yellow-600' : 'fill-gray-200 dark:fill-gray-600'),
        onClick: function onClick() {
          return levelIdx === 0 && handleLeafClick(nodeIdx);
        }
      }), React.createElement("text", {
        x: x,
        y: y + nodeHeight / 2 + 4,
        textAnchor: "middle",
        className: "text-xs fill-gray-700 dark:fill-gray-200 pointer-events-none"
      }, levelIdx === tree.length - 1 ? 'ROOT' : hash.slice(0, 6)));
    });
  })), React.createElement("div", {
    className: "text-center mt-2 text-sm text-gray-500 dark:text-gray-400"
  }, t('clickToHighlight')));
};
var generateCertificatePDF = function generateCertificatePDF(certificate, event) {
  var content = "\n%PDF-1.4\n1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n4 0 obj << /Length 1500 >> stream\nBT\n/F1 24 Tf\n50 720 Td\n(VCP VERIFICATION CERTIFICATE) Tj\n/F1 12 Tf\n0 -40 Td\n(Certificate ID: ".concat(certificate.certificate_id, ") Tj\n0 -20 Td\n(Verified At: ").concat(certificate.verified_at, ") Tj\n0 -20 Td\n(Verification Method: ").concat(certificate.verification_method, ") Tj\n0 -40 Td\n(EVENT DETAILS) Tj\n0 -20 Td\n(Event ID: ").concat(event.event_id, ") Tj\n0 -20 Td\n(Event Type: ").concat(event.event_type, ") Tj\n0 -20 Td\n(Symbol: ").concat(event.symbol, ") Tj\n0 -20 Td\n(Timestamp: ").concat(event.timestamp_iso, ") Tj\n0 -40 Td\n(CRYPTOGRAPHIC PROOF) Tj\n0 -20 Td\n(Event Hash:) Tj\n0 -15 Td\n(").concat(certificate.event_hash, ") Tj\n0 -25 Td\n(Merkle Root:) Tj\n0 -15 Td\n(").concat(certificate.merkle_root, ") Tj\n0 -25 Td\n(Audit Path: ").concat(certificate.merkle_proof.length, " steps) Tj\n0 -40 Td\n(---) Tj\n0 -20 Td\n(This certificate was generated by VCC Demo) Tj\n0 -15 Td\n(VeritasChain Standards Organization - veritaschain.org) Tj\n0 -15 Td\n(Verify, Don't Trust) Tj\nET\nendstream endobj\n5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000266 00000 n\n0000001820 00000 n\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n1897\n%%EOF");
  var blob = new Blob([content], {
    type: 'application/pdf'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = "VCP_Certificate_".concat(certificate.certificate_id.slice(0, 8), ".pdf");
  a.click();
  URL.revokeObjectURL(url);
};
var App = function App() {
  var _verifyResult$certifi, _selectedAnchor$tree, _selectedAnchor$tree2;
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    events = _useState6[0],
    setEvents = _useState6[1];
  var _useState7 = useState([]),
    _useState8 = _slicedToArray(_useState7, 2),
    anchors = _useState8[0],
    setAnchors = _useState8[1];
  var _useState9 = useState({
      events_count: 0,
      anchors_count: 0,
      pending_count: 0
    }),
    _useState0 = _slicedToArray(_useState9, 2),
    stats = _useState0[0],
    setStats = _useState0[1];
  var _useState1 = useState('dashboard'),
    _useState10 = _slicedToArray(_useState1, 2),
    activeTab = _useState10[0],
    setActiveTab = _useState10[1];
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    verifyResult = _useState12[0],
    setVerifyResult = _useState12[1];
  var _useState13 = useState(false),
    _useState14 = _slicedToArray(_useState13, 2),
    isLoading = _useState14[0],
    setIsLoading = _useState14[1];
  var _useState15 = useState(false),
    _useState16 = _slicedToArray(_useState15, 2),
    darkMode = _useState16[0],
    setDarkMode = _useState16[1];
  var _useState17 = useState('en'),
    _useState18 = _slicedToArray(_useState17, 2),
    language = _useState18[0],
    setLanguage = _useState18[1];
  var _useState19 = useState(''),
    _useState20 = _slicedToArray(_useState19, 2),
    searchQuery = _useState20[0],
    setSearchQuery = _useState20[1];
  var _useState21 = useState(''),
    _useState22 = _slicedToArray(_useState21, 2),
    filterType = _useState22[0],
    setFilterType = _useState22[1];
  var _useState23 = useState(''),
    _useState24 = _slicedToArray(_useState23, 2),
    filterStatus = _useState24[0],
    setFilterStatus = _useState24[1];
  var _useState25 = useState('XAUUSD'),
    _useState26 = _slicedToArray(_useState25, 2),
    formSymbol = _useState26[0],
    setFormSymbol = _useState26[1];
  var _useState27 = useState('demo-trader-001'),
    _useState28 = _slicedToArray(_useState27, 2),
    formAccount = _useState28[0],
    setFormAccount = _useState28[1];
  var _useState29 = useState('SIG'),
    _useState30 = _slicedToArray(_useState29, 2),
    formEventType = _useState30[0],
    setFormEventType = _useState30[1];
  var _useState31 = useState(null),
    _useState32 = _slicedToArray(_useState31, 2),
    tamperEvent = _useState32[0],
    setTamperEvent = _useState32[1];
  var _useState33 = useState(null),
    _useState34 = _slicedToArray(_useState33, 2),
    tamperedData = _useState34[0],
    setTamperedData = _useState34[1];
  var _useState35 = useState(null),
    _useState36 = _slicedToArray(_useState35, 2),
    tamperResult = _useState36[0],
    setTamperResult = _useState36[1];
  var _useState37 = useState(null),
    _useState38 = _slicedToArray(_useState37, 2),
    selectedAnchor = _useState38[0],
    setSelectedAnchor = _useState38[1];
  var _useState39 = useState(null),
    _useState40 = _slicedToArray(_useState39, 2),
    selectedLeafPath = _useState40[0],
    setSelectedLeafPath = _useState40[1];
  var _useState41 = useState(false),
    _useState42 = _slicedToArray(_useState41, 2),
    simulatorRunning = _useState42[0],
    setSimulatorRunning = _useState42[1];
  var _useState43 = useState(0),
    _useState44 = _slicedToArray(_useState43, 2),
    simulatorCount = _useState44[0],
    setSimulatorCount = _useState44[1];
  var _useState45 = useState(true),
    _useState46 = _slicedToArray(_useState45, 2),
    autoAnchor = _useState46[0],
    setAutoAnchor = _useState46[1];
  var _useState47 = useState({
      XAUUSD: 2650.00,
      EURUSD: 1.0850,
      BTCUSD: 42500.00,
      USDJPY: 148.50
    }),
    _useState48 = _slicedToArray(_useState47, 2),
    prices = _useState48[0],
    setPrices = _useState48[1];
  var simulatorRef = useRef(null);
  var _useState49 = useState(false),
    _useState50 = _slicedToArray(_useState49, 2),
    qrModalOpen = _useState50[0],
    setQrModalOpen = _useState50[1];
  var _useState51 = useState(''),
    _useState52 = _slicedToArray(_useState51, 2),
    qrData = _useState52[0],
    setQrData = _useState52[1];
  var qrCanvasRef = useRef(null);
  var t = useTranslation(language);
  var loadData = useCallback(_asyncToGenerator(_regenerator().m(function _callee15() {
    var _yield$Promise$all, _yield$Promise$all2, evts, anchs, st;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.n) {
        case 0:
          _context15.n = 1;
          return Promise.all([VCCService.getEvents(), VCCService.getAnchors(), VCCService.getStats()]);
        case 1:
          _yield$Promise$all = _context15.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 3);
          evts = _yield$Promise$all2[0];
          anchs = _yield$Promise$all2[1];
          st = _yield$Promise$all2[2];
          setEvents(evts);
          setAnchors(anchs);
          setStats(st);
        case 2:
          return _context15.a(2);
      }
    }, _callee15);
  })), []);
  useEffect(function () {
    loadData();
  }, [loadData]);
  useEffect(function () {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  useEffect(function () {
    if (qrModalOpen && qrData && qrCanvasRef.current) {
      var canvas = qrCanvasRef.current;
      var modules = QRCode.create(qrData).modules.size + 8;
      var scale = Math.max(1, Math.min(4, Math.floor(canvas.parentElement.clientWidth / modules)));
      QRCode.toCanvas(canvas, qrData, {
        scale: scale
      }).then(function () {
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
      });
    }
  }, [qrModalOpen, qrData]);
  useEffect(function () {
    if (simulatorRunning) {
      simulatorRef.current = setInterval(_asyncToGenerator(_regenerator().m(function _callee16() {
        var _prices$symbol;
        var symbols, types, symbol, type;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              setPrices(function (prev) {
                return {
                  XAUUSD: prev.XAUUSD + (Math.random() - 0.5) * 2,
                  EURUSD: prev.EURUSD + (Math.random() - 0.5) * 0.001,
                  BTCUSD: prev.BTCUSD + (Math.random() - 0.5) * 100,
                  USDJPY: prev.USDJPY + (Math.random() - 0.5) * 0.2
                };
              });
              symbols = ['XAUUSD', 'EURUSD', 'BTCUSD', 'USDJPY'];
              types = ['SIG', 'ORD', 'ACK', 'EXE'];
              symbol = symbols[Math.floor(Math.random() * symbols.length)];
              type = types[Math.floor(Math.random() * types.length)];
              _context16.n = 1;
              return VCCService.createEvent(type, symbol, 'simulator-001', {
                price: (_prices$symbol = prices[symbol]) === null || _prices$symbol === void 0 ? void 0 : _prices$symbol.toFixed(symbol === 'BTCUSD' ? 2 : symbol === 'EURUSD' ? 5 : 2),
                quantity: (Math.random() * 0.5).toFixed(2)
              });
            case 1:
              setSimulatorCount(function (c) {
                var newCount = c + 1;
                if (autoAnchor && newCount % 10 === 0) {
                  VCCService.createAnchor().then(function () {
                    return loadData();
                  });
                }
                return newCount;
              });
              _context16.n = 2;
              return loadData();
            case 2:
              return _context16.a(2);
          }
        }, _callee16);
      })), 1000);
    } else {
      if (simulatorRef.current) {
        clearInterval(simulatorRef.current);
      }
    }
    return function () {
      if (simulatorRef.current) {
        clearInterval(simulatorRef.current);
      }
    };
  }, [simulatorRunning, autoAnchor, prices, loadData]);
  var handleCreateEvent = function () {
    var _handleCreateEvent = _asyncToGenerator(_regenerator().m(function _callee17() {
      return _regenerator().w(function (_context17) {
        while (1) switch (_context17.n) {
          case 0:
            setIsLoading(true);
            _context17.n = 1;
            return VCCService.createEvent(formEventType, formSymbol, formAccount, {
              price: (2650 + Math.random() * 10).toFixed(2),
              quantity: '0.1'
            });
          case 1:
            _context17.n = 2;
            return loadData();
          case 2:
            setIsLoading(false);
          case 3:
            return _context17.a(2);
        }
      }, _callee17);
    }));
    function handleCreateEvent() {
      return _handleCreateEvent.apply(this, arguments);
    }
    return handleCreateEvent;
  }();
  var handleCreateTradeFlow = function () {
    var _handleCreateTradeFlow = _asyncToGenerator(_regenerator().m(function _callee18() {
      var traceId, _i, _arr, type;
      return _regenerator().w(function (_context18) {
        while (1) switch (_context18.n) {
          case 0:
            setIsLoading(true);
            traceId = generateUUIDv7();
            _i = 0, _arr = ['SIG', 'ORD', 'ACK', 'EXE', 'CLS'];
          case 1:
            if (!(_i < _arr.length)) {
              _context18.n = 4;
              break;
            }
            type = _arr[_i];
            _context18.n = 2;
            return VCCService.createEvent(type, formSymbol, formAccount, {
              trace_id: traceId,
              price: (2650 + Math.random() * 10).toFixed(2),
              quantity: '0.1'
            });
          case 2:
            _context18.n = 3;
            return new Promise(function (r) {
              return setTimeout(r, 100);
            });
          case 3:
            _i++;
            _context18.n = 1;
            break;
          case 4:
            _context18.n = 5;
            return loadData();
          case 5:
            setIsLoading(false);
          case 6:
            return _context18.a(2);
        }
      }, _callee18);
    }));
    function handleCreateTradeFlow() {
      return _handleCreateTradeFlow.apply(this, arguments);
    }
    return handleCreateTradeFlow;
  }();
  var handleCreateAnchor = function () {
    var _handleCreateAnchor = _asyncToGenerator(_regenerator().m(function _callee19() {
      return _regenerator().w(function (_context19) {
        while (1) switch (_context19.n) {
          case 0:
            setIsLoading(true);
            _context19.n = 1;
            return VCCService.createAnchor();
          case 1:
            _context19.n = 2;
            return loadData();
          case 2:
            setIsLoading(false);
          case 3:
            return _context19.a(2);
        }
      }, _callee19);
    }));
    function handleCreateAnchor() {
      return _handleCreateAnchor.apply(this, arguments);
    }
    return handleCreateAnchor;
  }();
  var handleVerify = function () {
    var _handleVerify = _asyncToGenerator(_regenerator().m(function _callee20(eventId) {
      var result;
      return _regenerator().w(function (_context20) {
        while (1) switch (_context20.n) {
          case 0:
            _context20.n = 1;
            return VCCService.verifyCertificate(eventId);
          case 1:
            result = _context20.v;
            setVerifyResult(result);
          case 2:
            return _context20.a(2);
        }
      }, _callee20);
    }));
    function handleVerify(_x10) {
      return _handleVerify.apply(this, arguments);
    }
    return handleVerify;
  }();
  var handleClearAll = function () {
    var _handleClearAll = _asyncToGenerator(_regenerator().m(function _callee21() {
      return _regenerator().w(function (_context21) {
        while (1) switch (_context21.n) {
          case 0:
            if (!confirm('Clear all data? This cannot be undone.')) {
              _context21.n = 3;
              break;
            }
            _context21.n = 1;
            return VCCService.clearAll();
          case 1:
            _context21.n = 2;
            return loadData();
          case 2:
            setVerifyResult(null);
            setTamperEvent(null);
            setTamperedData(null);
            setTamperResult(null);
          case 3:
            return _context21.a(2);
        }
      }, _callee21);
    }));
    function handleClearAll() {
      return _handleClearAll.apply(this, arguments);
    }
    return handleClearAll;
  }();
  var handleExportJson = function handleExportJson(data, filename) {
    var blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  var handleShowQR = function handleShowQR(data) {
    setQrData(JSON.stringify(data));
    setQrModalOpen(true);
  };
  var handleSelectTamperEvent = function () {
    var _handleSelectTamperEvent = _asyncToGenerator(_regenerator().m(function _callee22(eventId) {
      var event;
      return _regenerator().w(function (_context22) {
        while (1) switch (_context22.n) {
          case 0:
            event = events.find(function (e) {
              return e.event_id === eventId;
            });
            if (event) {
              setTamperEvent(event);
              setTamperedData(null);
              setTamperResult(null);
            }
          case 1:
            return _context22.a(2);
        }
      }, _callee22);
    }));
    function handleSelectTamperEvent(_x11) {
      return _handleSelectTamperEvent.apply(this, arguments);
    }
    return handleSelectTamperEvent;
  }();
  var handleSimulateTamper = function handleSimulateTamper() {
    if (!tamperEvent) return;
    var tampered = _objectSpread({}, tamperEvent);
    tampered.payload = _objectSpread(_objectSpread({}, tampered.payload), {}, {
      price: '9999.99',
      tampered: true
    });
    setTamperedData(tampered);
    setTamperResult(null);
  };
  var handleVerifyTampered = function () {
    var _handleVerifyTampered = _asyncToGenerator(_regenerator().m(function _callee23() {
      var tamperedHashInput, tamperedHash, proof, isValid;
      return _regenerator().w(function (_context23) {
        while (1) switch (_context23.n) {
          case 0:
            if (!(!tamperedData || !tamperEvent)) {
              _context23.n = 1;
              break;
            }
            return _context23.a(2);
          case 1:
            tamperedHashInput = {
              event_id: tamperedData.event_id,
              trace_id: tamperedData.trace_id,
              timestamp_int: tamperedData.timestamp_int,
              event_type: tamperedData.event_type,
              symbol: tamperedData.symbol,
              venue_id: tamperedData.venue_id,
              account_id: tamperedData.account_id,
              payload: tamperedData.payload
            };
            _context23.n = 2;
            return sha256(tamperedHashInput);
          case 2:
            tamperedHash = _context23.v;
            _context23.n = 3;
            return VCCService.getEventProof(tamperEvent.event_id);
          case 3:
            proof = _context23.v;
            if (proof) {
              _context23.n = 4;
              break;
            }
            setTamperResult({
              valid: false,
              reason: 'No proof available'
            });
            return _context23.a(2);
          case 4:
            _context23.n = 5;
            return VCCService.verifyWithCustomHash(tamperedHash, proof.merkle_root, proof.audit_path);
          case 5:
            isValid = _context23.v;
            setTamperResult({
              valid: isValid,
              originalHash: tamperEvent.event_hash,
              tamperedHash: tamperedHash,
              merkleRoot: proof.merkle_root
            });
          case 6:
            return _context23.a(2);
        }
      }, _callee23);
    }));
    function handleVerifyTampered() {
      return _handleVerifyTampered.apply(this, arguments);
    }
    return handleVerifyTampered;
  }();
  var filteredEvents = useMemo(function () {
    return events.filter(function (e) {
      if (searchQuery) {
        var q = searchQuery.toLowerCase();
        if (!e.trace_id.toLowerCase().includes(q) && !e.symbol.toLowerCase().includes(q) && !e.event_id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterType && e.event_type !== filterType) return false;
      if (filterStatus && e.anchor_status !== filterStatus) return false;
      return true;
    });
  }, [events, searchQuery, filterType, filterStatus]);
  var tabs = [{
    id: 'dashboard',
    label: t('dashboard')
  }, {
    id: 'events',
    label: t('events')
  }, {
    id: 'anchors',
    label: t('anchors')
  }, {
    id: 'verify',
    label: t('verify')
  }, {
    id: 'tamper',
    label: t('tamper')
  }, {
    id: 'tree',
    label: t('tree')
  }, {
    id: 'simulator',
    label: t('simulator')
  }];
  return React.createElement("div", {
    className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors"
  }, React.createElement("header", {
    className: "bg-gradient-to-r from-vcc-700 to-vcc-800 text-white shadow-lg"
  }, React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 py-4"
  }, React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-4"
  }, React.createElement("div", null, React.createElement("h1", {
    className: "text-2xl font-bold"
  }, t('title')), React.createElement("p", {
    className: "text-vcc-100 text-sm"
  }, t('subtitle'))), React.createElement("div", {
    className: "flex items-center gap-4"
  }, React.createElement("select", {
    value: language,
    onChange: function onChange(e) {
      return setLanguage(e.target.value);
    },
    className: "bg-vcc-600 text-white rounded px-2 py-1 text-sm"
  }, React.createElement("option", {
    value: "en"
  }, "English"), React.createElement("option", {
    value: "ja"
  }, "\u65E5\u672C\u8A9E"), React.createElement("option", {
    value: "zh"
  }, "\u4E2D\u6587"), React.createElement("option", {
    value: "es"
  }, "Espa\xF1ol")), React.createElement("button", {
    onClick: function onClick() {
      return setDarkMode(!darkMode);
    },
    className: "bg-vcc-600 hover:bg-vcc-500 px-3 py-1 rounded text-sm"
  }, darkMode ? '☀️' : '🌙', " ", darkMode ? t('lightMode') : t('darkMode')))))), React.createElement("nav", {
    className: "bg-white dark:bg-gray-800 border-b dark:border-gray-700 overflow-x-auto"
  }, React.createElement("div", {
    className: "max-w-7xl mx-auto px-4"
  }, React.createElement("div", {
    className: "flex space-x-2"
  }, tabs.map(function (tab) {
    return React.createElement("button", {
      key: tab.id,
      onClick: function onClick() {
        return setActiveTab(tab.id);
      },
      className: "py-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap ".concat(activeTab === tab.id ? 'border-vcc-500 text-vcc-600 dark:text-vcc-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300')
    }, tab.label);
  })))), React.createElement("main", {
    className: "max-w-7xl mx-auto px-4 py-6"
  }, activeTab === 'dashboard' && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-4"
  }, React.createElement(Card, null, React.createElement("div", {
    className: "text-3xl font-bold text-vcc-600 dark:text-vcc-400"
  }, stats.events_count), React.createElement("div", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, t('totalEvents'))), React.createElement(Card, null, React.createElement("div", {
    className: "text-3xl font-bold text-blue-600 dark:text-blue-400"
  }, stats.anchors_count), React.createElement("div", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, t('anchorsCreated'))), React.createElement(Card, null, React.createElement("div", {
    className: "text-3xl font-bold text-yellow-600 dark:text-yellow-400"
  }, stats.pending_count), React.createElement("div", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, t('pendingEvents')))), React.createElement(Card, {
    title: t('quickActions')
  }, React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }, React.createElement("div", {
    className: "space-y-3"
  }, React.createElement("div", {
    className: "flex gap-2 flex-wrap"
  }, React.createElement("select", {
    value: formSymbol,
    onChange: function onChange(e) {
      return setFormSymbol(e.target.value);
    },
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
  }, React.createElement("option", null, "XAUUSD"), React.createElement("option", null, "EURUSD"), React.createElement("option", null, "BTCUSD"), React.createElement("option", null, "USDJPY")), React.createElement("select", {
    value: formEventType,
    onChange: function onChange(e) {
      return setFormEventType(e.target.value);
    },
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
  }, Object.keys(EVENT_TYPES).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  }))), React.createElement("input", {
    value: formAccount,
    onChange: function onChange(e) {
      return setFormAccount(e.target.value);
    },
    placeholder: "Account ID",
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm w-full"
  })), React.createElement("div", {
    className: "space-y-2"
  }, React.createElement("button", {
    onClick: handleCreateEvent,
    disabled: isLoading,
    className: "w-full bg-vcc-600 text-white py-2 rounded hover:bg-vcc-700 disabled:opacity-50 text-sm"
  }, t('createSingleEvent')), React.createElement("button", {
    onClick: handleCreateTradeFlow,
    disabled: isLoading,
    className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
  }, t('createTradeFlow')), React.createElement("button", {
    onClick: handleCreateAnchor,
    disabled: isLoading || stats.pending_count === 0,
    className: "w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
  }, t('createMerkleAnchor'), " (", stats.pending_count, " ", t('pending'), ")")))), React.createElement(Card, {
    title: t('recentEvents')
  }, events.length === 0 ? React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400 text-sm"
  }, t('noEventsYet')) : React.createElement("div", {
    className: "overflow-x-auto"
  }, React.createElement("table", {
    className: "w-full text-sm"
  }, React.createElement("thead", {
    className: "bg-gray-50 dark:bg-gray-700"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('type')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('symbol')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('hash')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('status')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('time')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('action')))), React.createElement("tbody", null, events.slice(0, 10).map(function (e) {
    var _EVENT_TYPES$e$event_, _e$event_hash;
    return React.createElement("tr", {
      key: e.event_id,
      className: "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
    }, React.createElement("td", {
      className: "py-2 px-3"
    }, React.createElement(Badge, {
      color: (_EVENT_TYPES$e$event_ = EVENT_TYPES[e.event_type]) === null || _EVENT_TYPES$e$event_ === void 0 ? void 0 : _EVENT_TYPES$e$event_.color
    }, e.event_type)), React.createElement("td", {
      className: "py-2 px-3 mono text-xs dark:text-gray-300"
    }, e.symbol), React.createElement("td", {
      className: "py-2 px-3 mono hash-text text-gray-500 dark:text-gray-400"
    }, (_e$event_hash = e.event_hash) === null || _e$event_hash === void 0 ? void 0 : _e$event_hash.slice(0, 16), "..."), React.createElement("td", {
      className: "py-2 px-3"
    }, React.createElement(Badge, {
      color: e.anchor_status === 'ANCHORED' ? 'green' : 'yellow'
    }, e.anchor_status)), React.createElement("td", {
      className: "py-2 px-3 text-xs text-gray-500 dark:text-gray-400"
    }, new Date(e.timestamp_iso).toLocaleTimeString()), React.createElement("td", {
      className: "py-2 px-3"
    }, e.anchor_status === 'ANCHORED' && React.createElement("button", {
      onClick: function onClick() {
        setActiveTab('verify');
        handleVerify(e.event_id);
      },
      className: "text-xs text-vcc-600 hover:text-vcc-800 dark:text-vcc-400 font-medium"
    }, t('verifyBtn'))));
  })))))), activeTab === 'events' && React.createElement("div", {
    className: "space-y-4"
  }, React.createElement(Card, {
    title: t('searchFilter')
  }, React.createElement("div", {
    className: "flex flex-wrap gap-4"
  }, React.createElement("input", {
    type: "text",
    value: searchQuery,
    onChange: function onChange(e) {
      return setSearchQuery(e.target.value);
    },
    placeholder: t('searchPlaceholder'),
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
  }), React.createElement("select", {
    value: filterType,
    onChange: function onChange(e) {
      return setFilterType(e.target.value);
    },
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
  }, React.createElement("option", {
    value: ""
  }, t('allTypes')), Object.keys(EVENT_TYPES).map(function (t) {
    return React.createElement("option", {
      key: t,
      value: t
    }, t);
  })), React.createElement("select", {
    value: filterStatus,
    onChange: function onChange(e) {
      return setFilterStatus(e.target.value);
    },
    className: "border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm"
  }, React.createElement("option", {
    value: ""
  }, t('allStatuses')), React.createElement("option", {
    value: "PENDING"
  }, "PENDING"), React.createElement("option", {
    value: "ANCHORED"
  }, "ANCHORED")), React.createElement("button", {
    onClick: function onClick() {
      return handleExportJson(filteredEvents, 'vcc-events.json');
    },
    className: "bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
  }, t('exportJson')))), React.createElement(Card, {
    title: "".concat(t('allEvents'), " (").concat(filteredEvents.length, ")")
  }, React.createElement("div", {
    className: "overflow-x-auto max-h-96 overflow-y-auto"
  }, React.createElement("table", {
    className: "w-full text-sm"
  }, React.createElement("thead", {
    className: "bg-gray-50 dark:bg-gray-700 sticky top-0"
  }, React.createElement("tr", null, React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('type')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('symbol')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('eventHash')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('merkleRoot')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('status')), React.createElement("th", {
    className: "text-left py-2 px-3 text-gray-600 dark:text-gray-300"
  }, t('time')))), React.createElement("tbody", null, filteredEvents.map(function (e) {
    var _EVENT_TYPES$e$event_2, _e$event_hash2, _e$merkle_root;
    return React.createElement("tr", {
      key: e.event_id,
      className: "border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
    }, React.createElement("td", {
      className: "py-2 px-3"
    }, React.createElement(Badge, {
      color: (_EVENT_TYPES$e$event_2 = EVENT_TYPES[e.event_type]) === null || _EVENT_TYPES$e$event_2 === void 0 ? void 0 : _EVENT_TYPES$e$event_2.color
    }, e.event_type)), React.createElement("td", {
      className: "py-2 px-3 mono text-xs dark:text-gray-300"
    }, e.symbol), React.createElement("td", {
      className: "py-2 px-3 mono hash-text text-gray-500 dark:text-gray-400"
    }, (_e$event_hash2 = e.event_hash) === null || _e$event_hash2 === void 0 ? void 0 : _e$event_hash2.slice(0, 20), "..."), React.createElement("td", {
      className: "py-2 px-3 mono hash-text text-gray-500 dark:text-gray-400"
    }, ((_e$merkle_root = e.merkle_root) === null || _e$merkle_root === void 0 ? void 0 : _e$merkle_root.slice(0, 20)) || '-', "..."), React.createElement("td", {
      className: "py-2 px-3"
    }, React.createElement(Badge, {
      color: e.anchor_status === 'ANCHORED' ? 'green' : 'yellow'
    }, e.anchor_status)), React.createElement("td", {
      className: "py-2 px-3 text-xs text-gray-500 dark:text-gray-400"
    }, new Date(e.timestamp_iso).toLocaleString()));
  })))))), activeTab === 'anchors' && React.createElement(Card, {
    title: "".concat(t('anchorRecords'), " (").concat(anchors.length, ")")
  }, anchors.length === 0 ? React.createElement("p", {
    className: "text-gray-500 dark:text-gray-400 text-sm"
  }, t('noAnchorsYet')) : React.createElement("div", {
    className: "space-y-4"
  }, anchors.map(function (a) {
    return React.createElement("div", {
      key: a.anchor_id,
      className: "border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
    }, React.createElement("div", {
      className: "flex justify-between items-start flex-wrap gap-2"
    }, React.createElement("div", null, React.createElement("div", {
      className: "font-medium dark:text-white"
    }, "Anchor #", a.anchor_id.slice(0, 8), "..."), React.createElement("div", {
      className: "text-sm text-gray-500 dark:text-gray-400"
    }, a.event_count, " events")), React.createElement("div", {
      className: "flex items-center gap-2"
    }, React.createElement(Badge, {
      color: "green"
    }, a.status), React.createElement("button", {
      onClick: function onClick() {
        return handleExportJson(a, "anchor-".concat(a.anchor_id.slice(0, 8), ".json"));
      },
      className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800"
    }, t('exportJson')))), React.createElement("div", {
      className: "mt-3 space-y-1"
    }, React.createElement("div", {
      className: "text-xs"
    }, React.createElement("span", {
      className: "text-gray-500 dark:text-gray-400"
    }, t('merkleRoot'), ": "), React.createElement("span", {
      className: "mono text-gray-700 dark:text-gray-300"
    }, a.merkle_root)), React.createElement("div", {
      className: "text-xs text-gray-500 dark:text-gray-400"
    }, "Created: ", new Date(a.timestamp_iso).toLocaleString())));
  }))), activeTab === 'verify' && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement(Card, {
    title: "".concat(t('verifyEvent'), " - ").concat(t('verifyDontTrust'))
  }, React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mb-4"
  }, t('verifySubtitle')), React.createElement("select", {
    className: "w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm",
    onChange: function onChange(e) {
      return e.target.value && handleVerify(e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, t('selectAnchored')), events.filter(function (e) {
    return e.anchor_status === 'ANCHORED';
  }).map(function (e) {
    var _e$event_hash3;
    return React.createElement("option", {
      key: e.event_id,
      value: e.event_id
    }, e.event_type, " - ", e.symbol, " - ", (_e$event_hash3 = e.event_hash) === null || _e$event_hash3 === void 0 ? void 0 : _e$event_hash3.slice(0, 12), "...");
  }))), verifyResult && React.createElement(Card, {
    title: t('verificationResult')
  }, React.createElement("div", {
    className: "p-4 rounded-lg ".concat(verifyResult.valid ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800')
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, React.createElement("span", {
    className: "text-2xl"
  }, verifyResult.valid ? '✅' : '❌'), React.createElement("span", {
    className: "font-bold ".concat(verifyResult.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')
  }, verifyResult.valid ? t('verificationPassed') : t('verificationFailed'))), verifyResult.valid && verifyResult.certificate && React.createElement("div", {
    className: "space-y-2 text-sm"
  }, React.createElement("div", {
    className: "dark:text-gray-300"
  }, React.createElement("strong", null, t('certificateId'), ":"), " ", React.createElement("span", {
    className: "mono"
  }, verifyResult.certificate.certificate_id)), React.createElement("div", {
    className: "dark:text-gray-300"
  }, React.createElement("strong", null, t('eventHash'), ":"), " ", React.createElement("span", {
    className: "mono text-xs"
  }, verifyResult.certificate.event_hash)), React.createElement("div", {
    className: "dark:text-gray-300"
  }, React.createElement("strong", null, t('merkleRoot'), ":"), " ", React.createElement("span", {
    className: "mono text-xs"
  }, verifyResult.certificate.merkle_root)), React.createElement("div", {
    className: "dark:text-gray-300"
  }, React.createElement("strong", null, t('verificationMethod'), ":"), " ", verifyResult.certificate.verification_method), React.createElement("div", {
    className: "dark:text-gray-300"
  }, React.createElement("strong", null, t('verifiedAt'), ":"), " ", verifyResult.certificate.verified_at), React.createElement("div", {
    className: "mt-3"
  }, React.createElement("strong", {
    className: "dark:text-gray-300"
  }, t('merkleProof'), " (", (_verifyResult$certifi = verifyResult.certificate.merkle_proof) === null || _verifyResult$certifi === void 0 ? void 0 : _verifyResult$certifi.length, " ", t('steps'), "):"), React.createElement("pre", {
    className: "mt-1 p-2 bg-white dark:bg-gray-800 rounded text-xs overflow-x-auto dark:text-gray-300"
  }, JSON.stringify(verifyResult.certificate.merkle_proof.map(function (p) {
    return {
      hash: p.hash.slice(0, 16) + '...',
      position: p.position
    };
  }), null, 2))), React.createElement("div", {
    className: "flex gap-2 mt-4 flex-wrap"
  }, React.createElement("button", {
    onClick: function onClick() {
      return handleExportJson(verifyResult.certificate, "certificate-".concat(verifyResult.certificate.certificate_id.slice(0, 8), ".json"));
    },
    className: "bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
  }, t('exportCert')), React.createElement("button", {
    onClick: function onClick() {
      return handleShowQR(verifyResult.certificate);
    },
    className: "bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
  }, t('showQr')), React.createElement("button", {
    onClick: function onClick() {
      return generateCertificatePDF(verifyResult.certificate, events.find(function (e) {
        return e.event_id === verifyResult.certificate.event_id;
      }));
    },
    className: "bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
  }, t('downloadPdf'))))))), activeTab === 'tamper' && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement(Card, {
    title: t('tamperDemo')
  }, React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mb-4"
  }, t('tamperSubtitle')), React.createElement("div", {
    className: "mb-4"
  }, React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
  }, t('selectEventToTamper')), React.createElement("select", {
    className: "w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm",
    onChange: function onChange(e) {
      return handleSelectTamperEvent(e.target.value);
    }
  }, React.createElement("option", {
    value: ""
  }, t('selectAnchored')), events.filter(function (e) {
    return e.anchor_status === 'ANCHORED';
  }).map(function (e) {
    var _e$event_hash4;
    return React.createElement("option", {
      key: e.event_id,
      value: e.event_id
    }, e.event_type, " - ", e.symbol, " - ", (_e$event_hash4 = e.event_hash) === null || _e$event_hash4 === void 0 ? void 0 : _e$event_hash4.slice(0, 12), "...");
  }))), tamperEvent && React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800"
  }, React.createElement("h4", {
    className: "font-medium text-green-800 dark:text-green-400 mb-2"
  }, t('originalData')), React.createElement("pre", {
    className: "text-xs overflow-x-auto dark:text-gray-300"
  }, JSON.stringify({
    event_type: tamperEvent.event_type,
    symbol: tamperEvent.symbol,
    payload: tamperEvent.payload
  }, null, 2)), React.createElement("div", {
    className: "mt-2 text-xs text-green-600 dark:text-green-400 mono"
  }, "Hash: ", tamperEvent.event_hash)), React.createElement("button", {
    onClick: handleSimulateTamper,
    className: "w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 tamper-pulse"
  }, t('simulateTamper')), tamperedData && React.createElement(React.Fragment, null, React.createElement("div", {
    className: "p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800"
  }, React.createElement("h4", {
    className: "font-medium text-red-800 dark:text-red-400 mb-2"
  }, t('tamperedData')), React.createElement("pre", {
    className: "text-xs overflow-x-auto dark:text-gray-300"
  }, JSON.stringify({
    event_type: tamperedData.event_type,
    symbol: tamperedData.symbol,
    payload: tamperedData.payload
  }, null, 2))), React.createElement("button", {
    onClick: handleVerifyTampered,
    className: "w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
  }, t('verifyTampered'))), tamperResult && React.createElement("div", {
    className: "p-4 rounded-lg ".concat(tamperResult.valid ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30')
  }, React.createElement("div", {
    className: "flex items-center gap-2 mb-3"
  }, React.createElement("span", {
    className: "text-2xl"
  }, tamperResult.valid ? '✅' : '❌'), React.createElement("span", {
    className: "font-bold ".concat(tamperResult.valid ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400')
  }, tamperResult.valid ? t('verificationPassed') : t('verificationFailed'))), !tamperResult.valid && React.createElement("div", {
    className: "space-y-3 text-sm"
  }, React.createElement("div", {
    className: "p-3 bg-white dark:bg-gray-800 rounded"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, "Original Hash:"), React.createElement("div", {
    className: "mono text-xs text-green-600 dark:text-green-400"
  }, tamperResult.originalHash)), React.createElement("div", {
    className: "p-3 bg-white dark:bg-gray-800 rounded"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, "Tampered Hash:"), React.createElement("div", {
    className: "mono text-xs text-red-600 dark:text-red-400"
  }, tamperResult.tamperedHash)), React.createElement("div", {
    className: "p-3 bg-white dark:bg-gray-800 rounded"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, "Merkle Root:"), React.createElement("div", {
    className: "mono text-xs dark:text-gray-300"
  }, tamperResult.merkleRoot)), React.createElement("div", {
    className: "mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800"
  }, React.createElement("h4", {
    className: "font-medium text-yellow-800 dark:text-yellow-400 mb-2"
  }, t('tamperExplanation')), React.createElement("ul", {
    className: "text-sm text-yellow-700 dark:text-yellow-300 space-y-1"
  }, React.createElement("li", null, t('tamperReason1')), React.createElement("li", null, t('tamperReason2')), React.createElement("li", null, t('tamperReason3')), React.createElement("li", null, t('tamperReason4')))))), React.createElement("button", {
    onClick: function onClick() {
      setTamperEvent(null);
      setTamperedData(null);
      setTamperResult(null);
    },
    className: "text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
  }, t('resetTamper'))))), activeTab === 'tree' && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement(Card, {
    title: t('treeVisualization')
  }, React.createElement("div", {
    className: "mb-4"
  }, React.createElement("label", {
    className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
  }, t('selectAnchorToVisualize')), React.createElement("select", {
    className: "w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded px-3 py-2 text-sm",
    onChange: function onChange(e) {
      return setSelectedAnchor(anchors.find(function (a) {
        return a.anchor_id === e.target.value;
      }));
    }
  }, React.createElement("option", {
    value: ""
  }, t('selectAnchor')), anchors.map(function (a) {
    return React.createElement("option", {
      key: a.anchor_id,
      value: a.anchor_id
    }, "Anchor #", a.anchor_id.slice(0, 8), "... (", a.event_count, " events)");
  }))), selectedAnchor && React.createElement("div", {
    className: "space-y-4"
  }, React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, React.createElement("div", {
    className: "p-3 bg-gray-50 dark:bg-gray-700 rounded"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, t('treeDepth')), React.createElement("div", {
    className: "text-lg font-bold dark:text-white"
  }, ((_selectedAnchor$tree = selectedAnchor.tree) === null || _selectedAnchor$tree === void 0 ? void 0 : _selectedAnchor$tree.length) || 0)), React.createElement("div", {
    className: "p-3 bg-gray-50 dark:bg-gray-700 rounded"
  }, React.createElement("div", {
    className: "text-xs text-gray-500 dark:text-gray-400"
  }, t('leafCount')), React.createElement("div", {
    className: "text-lg font-bold dark:text-white"
  }, ((_selectedAnchor$tree2 = selectedAnchor.tree) === null || _selectedAnchor$tree2 === void 0 || (_selectedAnchor$tree2 = _selectedAnchor$tree2[0]) === null || _selectedAnchor$tree2 === void 0 ? void 0 : _selectedAnchor$tree2.length) || 0))), React.createElement("div", {
    className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-x-auto"
  }, React.createElement(MerkleTreeVisualization, {
    anchor: selectedAnchor,
    t: t,
    onSelectLeaf: function onSelectLeaf(idx, path) {
      return setSelectedLeafPath({
        index: idx,
        path: path
      });
    }
  })), selectedLeafPath && React.createElement("div", {
    className: "p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
  }, React.createElement("h4", {
    className: "font-medium text-blue-800 dark:text-blue-400 mb-2"
  }, t('auditPath'), " for Leaf #", selectedLeafPath.index), React.createElement("div", {
    className: "space-y-2"
  }, selectedLeafPath.path.map(function (step, i) {
    return React.createElement("div", {
      key: i,
      className: "text-xs mono dark:text-gray-300"
    }, "Step ", i + 1, ": ", step.hash.slice(0, 24), "... (", step.position, ")");
  })))))), activeTab === 'simulator' && React.createElement("div", {
    className: "space-y-6"
  }, React.createElement(Card, {
    title: t('liveSimulator')
  }, React.createElement("p", {
    className: "text-sm text-gray-600 dark:text-gray-400 mb-4"
  }, t('simulatorSubtitle')), React.createElement("div", {
    className: "flex items-center gap-4 mb-4 flex-wrap"
  }, React.createElement("button", {
    onClick: function onClick() {
      return setSimulatorRunning(!simulatorRunning);
    },
    className: "px-4 py-2 rounded text-white ".concat(simulatorRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700')
  }, simulatorRunning ? t('stopSimulator') : t('startSimulator')), React.createElement(Badge, {
    color: simulatorRunning ? 'green' : 'gray'
  }, simulatorRunning ? t('simulatorRunning') : t('simulatorStopped')), React.createElement("label", {
    className: "flex items-center gap-2 text-sm dark:text-gray-300"
  }, React.createElement("input", {
    type: "checkbox",
    checked: autoAnchor,
    onChange: function onChange(e) {
      return setAutoAnchor(e.target.checked);
    },
    className: "rounded"
  }), t('autoAnchor'))), React.createElement("div", {
    className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
  }, Object.entries(prices).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
      symbol = _ref8[0],
      price = _ref8[1];
    return React.createElement("div", {
      key: symbol,
      className: "p-3 bg-gray-50 dark:bg-gray-700 rounded"
    }, React.createElement("div", {
      className: "text-xs text-gray-500 dark:text-gray-400"
    }, symbol), React.createElement("div", {
      className: "text-lg font-bold mono dark:text-white"
    }, symbol === 'EURUSD' ? price.toFixed(5) : symbol === 'BTCUSD' ? price.toFixed(2) : price.toFixed(2)));
  })), React.createElement("div", {
    className: "p-4 bg-blue-50 dark:bg-blue-900/30 rounded"
  }, React.createElement("div", {
    className: "text-sm text-blue-800 dark:text-blue-400"
  }, t('eventsGenerated'), ": ", React.createElement("strong", null, simulatorCount)))))), React.createElement("footer", {
    className: "bg-gray-800 dark:bg-gray-950 text-gray-400 py-6 mt-8"
  }, React.createElement("div", {
    className: "max-w-7xl mx-auto px-4 text-center text-sm"
  }, React.createElement("p", {
    className: "mb-2"
  }, React.createElement("strong", {
    className: "text-white"
  }, t('title')), " - ", t('footer1')), React.createElement("p", {
    className: "text-xs mb-2"
  }, t('footer2')), React.createElement("p", {
    className: "text-xs text-gray-500"
  }, t('footer3')), React.createElement("div", {
    className: "mt-4 flex justify-center gap-4 flex-wrap"
  }, React.createElement("a", {
    href: "https://veritaschain.org",
    className: "text-vcc-400 hover:text-vcc-300"
  }, "veritaschain.org"), React.createElement("a", {
    href: "https://github.com/veritaschain",
    className: "text-vcc-400 hover:text-vcc-300"
  }, "GitHub"), React.createElement("button", {
    onClick: handleClearAll,
    className: "text-red-400 hover:text-red-300"
  }, t('clearAllData'))), React.createElement("p", {
    className: "mt-4 text-xs text-gray-600"
  }, "VeritasChain Standards Organization (VSO) \u2022 ", t('verifyDontTrust'), " \u2022 VCP v1.1"))), React.createElement(Modal, {
    isOpen: qrModalOpen,
    onClose: function onClose() {
      return setQrModalOpen(false);
    },
    title: t('qrTitle')
  }, React.createElement("div", {
    className: "text-center"
  }, React.createElement("canvas", {
    ref: qrCanvasRef,
    className: "mx-auto mb-4"
  }), React.createElement("p", {
    className: "text-sm text-gray-500 dark:text-gray-400"
  }, t('qrSubtitle')), React.createElement("button", {
    onClick: function onClick() {
      return setQrModalOpen(false);
    },
    className: "mt-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
  }, t('close')))));
};
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App, null));
