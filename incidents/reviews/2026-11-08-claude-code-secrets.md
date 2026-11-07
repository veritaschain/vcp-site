# Claude Code approval-file secrets report — HOLD / 公開保留

- Review date / 確認日: **2026-11-08 (Asia/Tokyo)**
- Disposition / 判定: **HOLD — incident-level primary evidence not retrieved / 事件の一次資料本文を取得できず保留**
- Registry treatment / 台帳上の扱い: **No VERIFIED incident entry; excluded from published totals / VERIFIED事件として登録せず、公開集計に加えない**

## English

### Evidence status

The supplied [Apiiro article URL](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again) could not be retrieved in this review on 8 November. Retrieval failure does not disprove the report. The reported publication and collection dates, aggregate secret and repository counts, organization count, and claim that a credential was active remain unverified here. This note does not repeat those figures or treat secondary repetition as primary confirmation.

### Independently checked configuration behavior

The official [Claude Code permissions documentation](https://code.claude.com/docs/en/permissions) describes persistent approval rules saved to `.claude/settings.local.json` and exact-command or pattern-based Bash permissions. The official [settings documentation](https://code.claude.com/docs/en/settings) describes a user-global Git exclusion when Claude Code first writes the local file in a repository. It also describes `.claude/settings.json` as shared project configuration intended for version control.

These documents support reviewing how command approvals and configuration files handle sensitive data. They do not independently establish the incident's scale, whether any reported credential remained usable, or whether third parties exploited it. Runtime behavior was not reproduced in this review.

### Engineering scope while the incident remains on hold

Use a repository-level exclusion for local approval files and inspect tracked files and relevant history. Shared settings remain committable after review for embedded secrets and unsafe permission rules; excluding the whole configuration directory is not required. Evidence exports should use non-secret credential references and avoid persisting raw secret values. If exposure is confirmed, credential revocation or rotation takes priority over cleanup; removing a current file does not invalidate its credentials.

These are design and repository-hygiene recommendations. No VAP/VCP prevention, deployment or conformance claim follows from them.

### Release condition

Re-review an accessible primary article or an authentic primary copy. Bind each incident claim to its source and verification date, distinguish current files from historical and other artifacts, and separate reported exposure, credential validity and confirmed misuse. Until then, keep this as a review note without a VERIFIED registry record or unverified aggregates in public totals.

## 日本語

### 証拠の状態

提示された[Apiiroの記事URL](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again)は、11月8日の本レビューで本文を取得できませんでした。取得失敗は報告が誤りであることを意味しません。公表日・調査日、秘密情報数・リポジトリ数・組織数の集計、および有効な認証情報があったという主張は、本レビューでは未確認です。このメモでは数値を転載せず、二次報道の反復を一次確認として扱いません。

### 別途確認できた設定の仕様

公式の[Claude Code権限ドキュメント](https://code.claude.com/docs/en/permissions)には、永続的な承認ルールを`.claude/settings.local.json`へ保存することと、Bashの完全一致・パターンによる許可ルールが記載されています。公式の[設定ドキュメント](https://code.claude.com/docs/en/settings)には、リポジトリ内のローカル設定ファイルへ初めて書き込む際の除外先がユーザー単位のglobal Git excludesであることと、`.claude/settings.json`がバージョン管理を想定した共有設定であることが記載されています。

これらは、承認コマンドと設定ファイル内の機密情報の扱いを点検する根拠になります。事件の規模、報告された認証情報の有効性、第三者による悪用を独立に立証する資料ではありません。本レビューでは実行時の挙動を再現していません。

### 保留中にも進められる対策

ローカル承認ファイルはリポジトリ単位で除外し、追跡中のファイルと関連する履歴を確認します。共有設定は、埋め込まれた秘密情報や危険な許可ルールをレビューしたうえでコミットできます。設定ディレクトリ全体の一律除外は要しません。証跡の出力には秘密値を含まない認証情報の参照を用い、生の秘密値を保存しない設計とします。露出が確認された場合は削除作業より失効・再発行を優先します。現行ファイルの削除だけでは認証情報は無効になりません。

これらは設計とリポジトリ管理の推奨事項であり、VAP/VCPによる防止効果、導入実績、適合性を示すものではありません。

### 公開保留の解除条件

取得可能な一次記事または真正性を確認できる一次資料の写しを再確認します。主張ごとに出典と検証日を対応付け、現行ファイル・履歴・その他の記録を区別し、報告された露出、認証情報の有効性、確認された悪用を分けて記載します。それまではレビュー用メモとして保持し、VERIFIED事件への登録や未確認集計の公開合計への加算を行いません。
