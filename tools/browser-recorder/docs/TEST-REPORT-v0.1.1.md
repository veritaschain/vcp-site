# v0.1.1 試作検証結果 — 2026-11-01

アプリ版: 0.1.1。観測・照合票形式は `vap-browser-observation/0.1.0` を維持。
環境: Linux / Node.js v24.22.1 / Chrome for Testing 156.0.8078.80。
対応下限の限定試験はChrome for Testing 137.0.7151.119で別途実行。
実行はVSO開発作業内の確認であり、独立した第三者再現・監査ではありません。

## Nodeの検証

`npm test`: **20件成功、0件失敗、0件スキップ**。
記録: `test-transcript.txt`。

既存の暗号・改変試験12件を維持し、取得範囲の試験を8件に拡充しました。
通常の両端で囲まれた編集領域、選択外の編集欄、継承された編集状態、
編集ホスト内の非編集部分、designMode、認識できるShadow DOM・埋め込み境界を対象にしています。
Node側のDOMはモックであり、DOM実装自体を検証したものではありません。

既存の合成署名pack・照合票の検証は `INTEGRITY_OK`。
署名形式・サンプルの書き換えは行っていません。

## 実Chromeの選択範囲検証

`CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-capture`:
**10件成功、0件失敗、0件スキップ**。
記録: `capture-browser-transcript.txt`。

ローカルの合成HTTPページに対し、実際のRange・Selection APIを使いました。

- 普通の複数段落を取得でき、選択外の編集欄は取得を妨げない。
- 両端が普通の本文でも、中間にcontenteditable・input・textareaがあれば拒否する。
- 空値・true・TRUE・plaintext-only、編集状態の継承、designModeを拒否する。
- 編集ホスト内のcontenteditable=false部分は拒否し、単独のfalse領域は許可する。
- open/closed shadow root内に端点がある選択、認識できるopen shadow host横断、iframe横断を拒否する。
- 選択なし・32 KiB超過を拒否する。

この10件は取得関数を通常ページで実行した結果です。拡張のロード、activeTab権限、
ISOLATED world、ポップアップ、IndexedDB、鍵の永続化を検証した結果ではありません。
再実行手順と範囲は `BROWSER-CAPTURE-TESTS.md` を参照してください。
閉じたShadow DOMを任意のページで全て検出できるとは主張しません。

## 拡張全体の検証

`CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-extension`:
**7件成功、0件失敗、0件スキップ**。
記録: `extension-browser-transcript.txt`、`browser-lifecycle.json`。

同じLinux / Chrome for Testing 156.0.8078.80で、実際のunpacked extensionを
一時プロファイルへ読み込みました。Chrome DevToolsの `Extensions.triggerAction`
で実actionを起動し、ポップアップを操作しています。Chrome APIをモックした結果ではありません。

1. Manifest V3の読み込み、actionによるactiveTab許可、ISOLATED worldでの選択取得、
   オリジンと本文のプレビュー、保存前の同意、非抽出可能鍵による保存。
2. 中間に編集領域を含む選択の拒否、具体的な拒否理由の表示、記録件数の維持。
3. 同じ拡張パス・同じプロファイルでChromeを終了・再起動し、記録と鍵を再利用して追加保存。
4. 2つの実拡張ページから各3件を同時保存し、Web LocksとIndexedDBで欠番・消失なく計8件を保持。
   このケースは画面のボタンを連打する試験ではなく、各拡張ページから実storage moduleを呼び出しています。
5. 実画面からJSONと照合票をダウンロードし、Nodeと拡張画面の両方で整合性を確認。
   本文を改変したファイルは両方で拒否。
6. 拡張ページからのfetchをCSPが遮断。`connect-src` のpolicy violationとサーバーへの未着信を確認。
7. 同意後のリセットで鍵を交換し、リセット前の書き出しデータも引き続き検証可能。

手動操作を再現したheadless自動試験であり、物理的なツールバークリックの手動評価ではありません。
再実行手順は `BROWSER-EXTENSION-TESTS.md` を参照してください。

## 旧配布版からの更新

`npm run test:browser-upgrade`: **2件成功、0件失敗、0件スキップ**。
Chrome 156で、元の0.1.0配布ZIPを既知のSHA-256で照合し、実際に保存してから0.1.1へ更新しました。
デベロッパーモードON・同じ拡張パス・同じプロファイルで、`runtime.reload()`による更新を確認。
鍵・ledger・旧イベントと署名を保持したまま追記でき、旧書き出しも対応する旧照合票で検証できました。
新旧の照合票を入れ替えた組合せは拒否されます。

別パスから読み込む負例では、別の拡張IDと空の記録庫になり、元の記録は残りました。
手順と範囲は `BROWSER-UPGRADE-TESTS.md`、記録は `upgrade-browser-transcript.txt` と `browser-upgrade.json`。

## Chrome 137の限定試験

同じ実DOM選択試験が **10件成功**。追加の実拡張保存フローが **1件成功**。
いずれも失敗・スキップ0です。保存フロー内の4チェックは、4件として加算しません。

Ed25519・非抽出可能鍵、並列保存、同じプロファイルで再起動・再読み込み後の記録と鍵の保持、
実記録庫のダウンロード・検証・改変拒否を確認しました。
Chrome 137のaction・activeTab・取得ポップアップの同意操作は、この試験には含みません。
範囲と記録は `BROWSER-STORAGE-TESTS.md` を参照してください。

## 未確認の範囲

ChatGPT・Claude・Geminiの現行画面、Windows/macOS、手動ツールバー操作、Web Store経由の更新、
Chrome 137での取得・同意の全経路と旧版更新は未確認です。
実サービス用の手順 `SERVICE-VALIDATION.md` を追加していますが、実施済みの試験とは数えません。
外部アンカー・AI提供者の署名・会話全体の完全性・信頼できる時刻・VAP適合は未確立。
Chrome Web Store審査や独立したセキュリティ監査も、これらの試験の対象ではありません。

## 履歴

初版2026-10-31の試験報告は `TEST-REPORT-v0.1.0.md` にそのまま保存しています。
旧0.1.0配布ZIPは変更していません。
