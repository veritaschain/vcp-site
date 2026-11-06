# 旧0.1.0 / 0.1.1アーカイブから0.1.2への更新試験

現行の公開ゲートは、固定した2つの旧ZIPをそれぞれ導入して0.1.2へ更新する、各2件の試験です。
このページは再実行手順と範囲を説明します。0.1.2の実行結果は配布対象コミットのCIで確認し、
過去版の成功を新版の実行結果へ読み替えません。ローカル準備環境にはChromeがなく、
現行版のローカル実ブラウザ成功は主張していません。

## 固定した入力

現行コードのversionだけを変更したfixtureは使いません。次の旧ZIPそのものを照合して展開します。

| BASELINE_VERSION | SHA-256 |
| --- | --- |
| `0.1.0` | `d17496cf9b096da85546a1e343e791138a1c807f1a37c518b28c140e424ffcf4` |
| `0.1.1` | `3a3e4a9fdd91b990b0361fa30234eec724a7a2e557fd2cb2bd2cedcbb13dbbb3` |

Node 24、Python 3、固定したPlaywright依存、Chrome for Testing 156.0.8078.80を使用します。
リポジトリでは `vso/announcements/2026-10-31-vap-browser-recorder-preview/downloads/` の旧ZIPを参照します。
0.1.2 ZIPを単独で展開した場合は、`BASELINE_ARCHIVE`で対象の旧ZIPを指定してください。

```sh
npm ci
BASELINE_VERSION=0.1.0 CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-upgrade
BASELINE_VERSION=0.1.1 CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-upgrade
```

`BROWSER_EVIDENCE_DIR`には、旧版ごとに別の出力先を指定します。
`browser-upgrade.json`と合成の更新前後のJSON・照合票を保存します。
秘密鍵やブラウザプロファイルは書き出しません。

## 各旧版で実行する2つのフロー

1. **同じ場所で更新する。** 一時プロファイルの拡張管理画面でデベロッパーモードをONにします。
   旧版の実actionから本文を取得・同意・保存し、旧画面からJSONと照合票を書き出します。
   同じ場所のファイルを0.1.2へ置き換え、`chrome.runtime.reload()`で更新します。
   拡張ID、鍵指紋、ledger ID、公開鍵、非抽出可能鍵、旧イベントと署名を保持することを確認します。
   新版の実action / activeTab / ISOLATED経路で編集領域の拒否と、大量の選択外DOMがあるページ上の
   短い選択の成功を検査します。大きなページのプレビューは保存せず、同意前の件数が増えないことも確認。
   その後の追記は旧署名を維持し、連番・前イベントハッシュ・書き出しを検証します。
   新旧のJSONはそれぞれ対応する照合票で成功し、照合票を取り違えると拒否されます。
2. **別の場所を読み込む。** 同じ新版を別フォルダーから読み込み、異なる拡張IDと空の記録庫を確認します。
   元の拡張IDの更新済み記録は残ります。これを更新失敗やデータ消去とは扱いません。

## 範囲と過去の証拠

Linux・Chrome 156・同じ拡張パスとプロファイル・デベロッパーモードONでのunpacked extension更新に限定します。
Chrome 137、Windows/macOS、Web Storeの自動更新、手動の再読み込みボタン、実サービス画面は対象外です。

隣接する `upgrade-browser-transcript.txt` と `browser-upgrade.json` は元0.1.0から固定0.1.1候補への
**過去の2件**の成功記録です。今回の0.1.2試験の結果ではありません。
新旧の照合票は各時点のpackに対応し、追記後のpackに旧照合票が一致することは期待しません。

Chromeの公式説明では、unpacked extensionのreloadはupdateとして扱われます:
https://developer.chrome.com/docs/extensions/reference/api/runtime#unpacked-extension-behavior
