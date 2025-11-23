# VeritasChain Certified (VC-Certified) - FAQ Website

## Project Overview
- **Name**: VeritasChain Certified FAQ
- **Goal**: VCP認証に関するよくある質問を事前に解決し、信頼感を高める
- **Features**: 
  - アコーディオン形式のインタラクティブFAQ
  - カテゴリ別に整理された質問項目
  - レスポンシブデザイン対応
  - Tailwind CSS + Font Awesome によるモダンなUI

## URLs
- **Sandbox Development**: http://localhost:3000
- **GitHub**: (設定後に追加)
- **Production**: (デプロイ後に追加)

## FAQ Categories

### 1. 認証の範囲と限界 (Scope & Limitations)
- VC-Certifiedは財務的安全性を保証するのか？→ **しない。技術的準拠のみ**
- VSOは特定の投資戦略を推奨するのか？→ **しない。ベンダー・ニュートラル**

### 2. データプライバシーとセキュリティ (Data & Privacy)
- 個人情報は外部に漏れないか？→ **VCP-PRIVACY / Crypto-shredding で保護**
- ブロックチェーンのデータは誰でも見られるのか？→ **検証に必要なデータのみ透明化**

### 3. 認証ティアと技術的価値 (Tiers & Value)
- Silver Tier だけでも意味があるのか？→ **ある。不正の不可逆性を保証**
- 既存システムの入れ替えが必要か？→ **不要。サイドカー方式で導入可能**

### 4. ガバナンスと将来性 (Governance & Future)
- 量子コンピュータへの対策は？→ **Crypto Agility で対応済み**
- EU AI Act への対応は？→ **VCP-GOV モジュールで対応**

## Data Architecture
- **Frontend**: Hono (JSX/TSX) with Tailwind CSS
- **Backend**: Hono on Cloudflare Workers
- **Deployment**: Cloudflare Pages
- **Storage**: Static files only (no database required)

## User Guide
1. トップページ（/）にアクセスすると自動的にFAQページ（/faq）にリダイレクト
2. カテゴリ別に整理された質問をクリックすると回答が展開
3. 他の質問をクリックすると前の回答は自動的に閉じる
4. モバイル・デスクトップ両対応のレスポンシブデザイン

## Development

### Setup
```bash
cd /home/user/webapp
npm install
```

### Local Development (Sandbox)
```bash
# Build first
npm run build

# Start with PM2
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000
```

### Build for Production
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
# After setup_cloudflare_api_key
npm run deploy:prod
```

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Development
- **Tech Stack**: Hono + TypeScript + Tailwind CSS + Font Awesome
- **Last Updated**: 2025-11-23

## Key Technical Implementations

### Interactive Accordion
- クリック時にのみ回答を展開するアコーディオンUI
- 他の質問を開くと自動的に前の回答を閉じる
- スムーズなアニメーション効果

### Category-Based Design
- 4つの主要カテゴリでFAQを整理
- カテゴリごとに異なる色のバッジで視覚的に区別
- アイコンによる直感的な理解

### Security & Privacy Highlights
- VCP-PRIVACY モジュールの説明
- Crypto-shredding（暗号的シュレッダー）の仕組み
- GDPR「忘れられる権利」への対応

### Visual Design Elements
- グラデーション背景
- ハイライト効果
- 警告ボックス・情報ボックス
- アイコンによる視覚的強調

## Project Structure
```
webapp/
├── src/
│   ├── index.tsx           # Main Hono application
│   ├── renderer.tsx        # Default renderer (unused)
│   └── pages/
│       └── faq.tsx         # FAQ page with complete UI
├── ecosystem.config.cjs    # PM2 configuration
├── package.json            # Dependencies and scripts
├── wrangler.jsonc          # Cloudflare configuration
└── README.md               # This file
```

## Credits
- **Organization**: VeritasChain Standards Organization (VSO)
- **Tagline**: "Verify, Don't Trust" — Encoding Trust in the Algorithmic Age
- **License**: Production Ready
