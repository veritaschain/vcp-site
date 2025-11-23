# VeritasChain Protocol (VCP) - Official Website

## 🔱 プロジェクト概要

**VeritasChain Protocol (VCP)** の公式Webサイト  
"Encoding Trust in the Algorithmic Age" — アルゴリズム時代の信頼をコード化する

### 目標
- VCPプロトコルの認知度向上
- 技術仕様とドキュメントへのアクセス提供
- VC-Certified認証プログラムの紹介
- パートナーシップと技術連携の促進

### 主な機能
- **モダンなUIデザイン**: プロフェッショナルなダークテーマ
- **レスポンシブ対応**: モバイル・タブレット・デスクトップ完全対応
- **アニメーション効果**: 滑らかなフェードイン・ホバーエフェクト
- **高速表示**: Cloudflare Workersエッジデプロイ
- **SEO最適化**: メタタグ・構造化データ対応

## 🌐 公開URL

- **開発環境**: https://3000-igzldmgok7fa8iamx8niq-6532622b.e2b.dev
- **本番環境**: (デプロイ後に更新予定)

## 📋 完成済み機能

### ✅ Hero Section
- VSOバッジ表示
- プロトコル名とビジョン
- CTAボタン（Specification / Technical Support）
- グラデーションアニメーション背景

### ✅ VCP説明セクション
- プロトコルの概要説明（日本語/英語）
- 規制対応（MiFID II、EU AI Act、CAT）
- RobTech / Audit / Compliance重要性の強調

### ✅ 主要機能セクション
- 6つのコア機能カード
- ホバーアニメーション
- アイコン表示

### ✅ 技術スタックセクション
- UUIDv7、Ed25519、Merkle Tree
- PTP時刻同期、FIX Protocol連携
- ストレージフォーマット

### ✅ ユースケースセクション
- HFT/アルゴリズムトレーディング
- 暗号資産取引所
- Prop Firm認証
- 規制報告

### ✅ VC-Certified認証セクション
- 認証バッジデザイン
- プログラム説明
- VeritasChain Inc.紹介

### ✅ 会社情報セクション
- VeritasChain株式会社（設立準備中）
- Reg Tech / Fin Tech事業説明
- 標準化とコンプライアンス重視

### ✅ お問い合わせセクション
- メール連絡先
- パートナーシップ窓口

### ✅ フッター
- コピーライト表示

## 🗂️ データアーキテクチャ

### データモデル
現在、静的サイトのためデータベース不使用

### ストレージサービス
- **Cloudflare Workers**: エッジコンピューティング
- **静的ファイル**: `/public/static/`に配置

### 将来の拡張予定
- **D1 Database**: VC-Certified認証データベース
- **KV Storage**: API キャッシュ
- **R2 Storage**: ドキュメント・資料ストレージ

## 🚀 ユーザーガイド

### サイト構成
1. **トップページ**: VCPプロトコルの概要
2. **技術仕様**: GitHub仕様書へのリンク
3. **テクニカルサポート**: support.veritaschain.orgへのリンク
4. **お問い合わせ**: info@veritaschain.org

### ナビゲーション
- スムーススクロール対応
- モバイルレスポンシブ
- アクセシビリティ対応

## 💻 技術スタック

- **フレームワーク**: Hono (v4.10.6)
- **ランタイム**: Cloudflare Workers
- **ビルドツール**: Vite (v6.3.5)
- **デプロイ**: Wrangler (v4.4.0)
- **スタイリング**: Tailwind CSS + Custom CSS
- **フォント**: Inter + JetBrains Mono
- **アイコン**: Font Awesome 6.4.0

## 🛠️ 開発環境セットアップ

```bash
# 依存関係インストール
npm install

# ビルド
npm run build

# 開発サーバー起動（PM2）
pm2 start ecosystem.config.cjs

# サーバーステータス確認
pm2 list
pm2 logs webapp --nostream

# ポートクリーンアップ
npm run clean-port

# テスト
npm run test
```

## 📦 デプロイメント

### 開発環境
```bash
# ビルド
npm run build

# PM2で起動
pm2 start ecosystem.config.cjs

# 確認
curl http://localhost:3000
```

### 本番環境（Cloudflare Pages）
```bash
# ビルド & デプロイ
npm run deploy:prod
```

## 📊 デプロイステータス

- **プラットフォーム**: Cloudflare Pages
- **ステータス**: ✅ 開発環境稼働中 / ❌ 本番環境未デプロイ
- **最終更新**: 2025-11-23

## 📝 今後の開発予定

### Phase 1（完了）
- ✅ トップページデザイン
- ✅ レスポンシブ対応
- ✅ アニメーション実装
- ✅ PM2セットアップ

### Phase 2（予定）
- ⏳ Cloudflare Pages本番デプロイ
- ⏳ カスタムドメイン設定（veritaschain.org）
- ⏳ GitHub連携

### Phase 3（検討中）
- 🔮 多言語対応（英語版）
- 🔮 VC-Certified認証データベース
- 🔮 SDK/ライブラリダウンロードページ
- 🔮 ドキュメントセクション

## 🤝 貢献

このプロジェクトは **VeritasChain Standards Organization (VSO)** によって管理されています。

## 📄 ライセンス

© 2025 VeritasChain Inc. All rights reserved.

## 📧 お問い合わせ

- **メール**: info@veritaschain.org
- **GitHub**: https://github.com/VeritasChain/vcp-spec
- **サポート**: https://support.veritaschain.org

---

**VeritasChain Protocol (VCP)** - Encoding Trust in the Algorithmic Age
