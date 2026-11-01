# GitHub調査とVAPとの対応

調査日: 2026-10-31 JST。参照リポジトリ: https://github.com/veritaschain/vap-spec

参照したmainのcommit: `a2a9f6a25906db4be23e6ecd3796eab144d9ac99`。ファイル取得時のblob SHAがこのcommitのツリーと一致することを確認。

| 参照 | 今回の設計への意味 |
| --- | --- |
| [README](https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/README.md) | 現行表記はVAP v1.2 Draft 3。VAPは横断フレームワークで、プロトコル呼称はVCP。外部アンカーが全レベルで必須。 |
| [VAP v1.2本文](https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/spec/v1.2/VAP_Framework_Specification.md) | §4.1のハッシュ、順序、Merkle、署名を設計参考にした。§7の抽象構造そのものの実装ではない。 |
| [interopデモ契約](https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/interop/vap-evidence-pack-demo/CONFORMANCE.md) | デモの成功とVAP適合は別。独立した信頼入力、厳格JSON解析、正確なMerkle構成を参考にした。今回の日本語観測レコードは別の契約ID。 |
| [Node検証器](https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/interop/vap-evidence-pack-demo/verify_node.mjs) | canonical.mjsの厳格パーサーと正規化関数の派生元。UnicodeとブラウザAPI対応等の変更あり。 |
| [collector pilot契約](https://github.com/veritaschain/vap-spec/blob/a2a9f6a25906db4be23e6ecd3796eab144d9ac99/experiments/incident-collector-pilot/CONTRACT.md) | 収集受領と実際の送信、観測の独立性を分ける考え方を参照。拡張にこのcollectorの接続・互換性は実装していない。 |

| VAP要件 | この試作 |
| --- | --- |
| INT-001 RFC8785 | 独自の制限付きUnicode・安全整数JSONを採用。完全なRFC8785適合性試験は未実施 |
| INT-002 イベントID | UUID v4で一意IDを付与 |
| INT-003 ハッシュ | SHA-256。ただし独自レコード形式 |
| INT-004 順序検証 | 前イベントハッシュ・連番・署名済みマニフェスト |
| INT-005 署名 | ローカルEd25519。署名者の外部的な本人性は未確立 |
| INT-006 外部アンカー | 未実装。Merkleルートをローカル署名するだけでは満たさない |
| INT-007 アンカー継続 | 未実装 |
| INT-008 宣言範囲の欠落検出 | 署名済みファイル内の整合性チェックのみ。外部アンカーも、元の会話集合の観測保証もないため適合を主張しない |
| INT-009 回復 | REBUILD等は提供しない。リセットは新しい独立した記録庫であり連続性はない |
| 出所・説明責任・横断参照 | 利用者が選択したDOM観測。提供者側のactor/model/tool/policy情報は観測していない |
| 消去 | ローカルリセットのみ。ERASUREイベント・暗号消去・保存期間管理ではない |

既存公開リポジトリ一覧とvap-specツリーの調査ではChrome拡張の実装は見当たらなかった。ただし未公開・未接続リポジトリの不在までは確認していない。

OAP（Observed Artifact Provenance）は概念的に近い候補だが、今回確認したREADMEでは公開本文の未公開状態と不整合見直しが明記されている。OAP準拠を名乗らず、独自の実験的観測形式とした。

Chrome公式参照:

- https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
- https://developer.chrome.com/docs/extensions/reference/api/scripting
- https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
- https://developer.chrome.com/docs/modern-web-guidance/guides/security/digital-signatures

添付のAI事故調査メモと規制調査メモからは、記録の完全性と事実の真正性の区別、外部観測、データ最小化を設計上の論点として参照した。個別事件・法令の内容は今回再検証しておらず、本製品の効能や法令対応の根拠として引用していない。
