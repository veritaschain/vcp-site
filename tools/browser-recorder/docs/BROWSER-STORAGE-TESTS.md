# Chrome 137の限定互換性試験

以下の冒頭の成功数は0.1.1候補の過去の実行記録です。現行0.1.2の結果・公開ゲートは `TEST-REPORT.md` と配布対象コミットのCIで確認してください。

2026年11月1日（日本時間）、Linux / Node v24.22.1 / Chrome for Testing
**137.0.7151.119**で、実DOM選択試験10件と、実拡張の保存・書き出しフロー1件が成功しました。
失敗・スキップはいずれも0です。

## 再実行

```sh
npm ci
CHROME_EXECUTABLE=/path/to/chrome-137 npm run test:browser-capture
CHROME_EXECUTABLE=/path/to/chrome-137 npm run test:browser-storage
```

CIで使う公式Chrome for Testing ZIP:

```text
https://storage.googleapis.com/chrome-for-testing-public/137.0.7151.119/linux64/chrome-linux64.zip
SHA-256: 680a672ed0cc7b8fae6ee5b21691a55273228b05e1f3f80580606c4db203994a
```

取得範囲の10件は `BROWSER-CAPTURE-TESTS.md` と同じケースを、Chrome 137で実行したものです。
保存試験は実拡張のオリジンで保存モジュールを呼び出す **1つのフロー**であり、以下の4段階を含みます。

1. Ed25519鍵生成・署名・保存。非抽出可能な秘密鍵のPKCS8書き出しが拒否される。
2. 2つの拡張ページから並列保存。Web LocksとIndexedDBにより5イベントの連番と署名が維持される。
3. 同じプロファイルでChromeを終了・再起動し、同じパスの拡張を再読み込み。
   同じ公開鍵と5つの旧イベントを保持したまま、6件目を追加して検証する。
4. 実際の記録庫画面からJSONと照合票をダウンロードし、Nodeと記録庫画面で検証。
   合成本文を変更したコピーは両方で拒否される。

4段階を4つの独立したテストとは数えません。`BROWSER_EVIDENCE_DIR`を指定すると
`browser-storage.json`へ結果を保存し、全フローと後処理が成功した場合だけ`PASSED`になります。

## 残る範囲

Chrome 137では、現在のaction自動操作スイートが使う `Extensions.getExtensions` が利用できません。
この保存フローはそのAPIや `triggerAction` を使用しません。
**action・activeTab・取得ポップアップの同意操作をChrome 137で確認した結果ではありません。**
Chrome 156のライフサイクル・旧版ごとの更新試験は、別の範囲として記録します。

実サービスの現行画面、手動ツールバー操作、Windows/macOS、外部アンカー、第三者監査、VAP適合は確認していません。

実行記録: `minimum-chrome-capture-transcript.txt`、`minimum-chrome-storage-transcript.txt`、`browser-storage.json`。

Chrome 137の公式リリースノート:
https://developer.chrome.com/release-notes/137
