# 旧配布版からの更新試験

2026年11月1日（日本時間）、Linux / Node v24.22.1 / Chrome for Testing
156.0.8078.80で **2件成功、失敗0、スキップ0**。
一時プロファイルと合成本文を使う内部のheadless自動試験です。

## 入力と実行方法

入力は、公開済み0.1.0 ZIPそのものです。現行コードのversionを書き換えたfixtureではありません。
試験は次のSHA-256に一致することを確認してから、旧extensionファイルを展開します。

```text
d17496cf9b096da85546a1e343e791138a1c807f1a37c518b28c140e424ffcf4
```

Node 24、Python 3、固定したPlaywright依存、Chrome for Testing 156.0.8078.80を使用します。
リポジトリでは既存の `vso/announcements/2026-10-31-vap-browser-recorder-preview/downloads/`
にある0.1.0 ZIPを自動参照します。0.1.1 ZIPだけを展開した場合は、旧ZIPの場所を指定してください。

```sh
npm ci
BASELINE_ARCHIVE=/path/to/VAP_Browser_Recorder_v0.1.0.zip \
CHROME_EXECUTABLE=/path/to/chrome \
npm run test:browser-upgrade
```

`BROWSER_EVIDENCE_DIR`を指定すると、`browser-upgrade.json`と、合成の更新前後の
JSON・照合票を保存します。秘密鍵やブラウザプロファイルは書き出しません。

## 2つのフロー

1. **同じ場所で更新する。** 拡張管理画面のデベロッパーモードをONにし、0.1.0の実actionから
   本文を取得・同意・保存。旧画面からJSONと照合票を書き出します。同じ場所のファイルを
   0.1.1へ置き換え、`chrome.runtime.reload()`で更新します。同じ拡張ID、鍵指紋、ledger ID、
   公開鍵、非抽出可能鍵、旧イベントと署名を確認し、追記前のpack全体が完全一致することを確認します。
   新版の編集領域拒否と追加保存を実行し、連番・前イベントのハッシュ・署名を検証します。
   新旧のJSONはそれぞれ対応する照合票で成功し、組合せを入れ替えると拒否されます。
2. **別の場所を読み込む。** 同じ版を別フォルダーから読み込むと、異なる拡張IDと空の記録庫になります。
   元の拡張IDの更新済み記録が残っていることも確認します。これを更新失敗やデータ消去とは扱いません。

最初の試験では、一時プロファイルのデベロッパーモードがOFFのため、再読み込み後に
拡張が無効になりました。最終試験は、導入手順と同じく通常の拡張管理UIでONにしてから実行しています。

## 範囲

この結果は、Linux・Chrome 156・同じ拡張パス・同じプロファイル・デベロッパーモードONでの
unpacked extension更新に限定します。Chrome 137での更新、Windows/macOS、Web Storeの自動更新、
手動による再読み込みボタン、実サービスの画面は確認していません。
新旧の照合票は各時点のpackに対応し、追記後のpackに旧照合票が一致することは期待しません。

記録: `upgrade-browser-transcript.txt`、`browser-upgrade.json`。
既存の7件のライフサイクル試験とは別の2件です。

Chromeの公式説明では、unpacked extensionのreloadはupdateとして扱われます:
https://developer.chrome.com/docs/extensions/reference/api/runtime#unpacked-extension-behavior
