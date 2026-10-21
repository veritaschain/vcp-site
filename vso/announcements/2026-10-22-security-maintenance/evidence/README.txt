VCP / VSO security-maintenance public record — 2026-10-22

This is an experimental, unregistered local mapping based on VAP v1.2 Draft 3.
It is not a conformance certification or a complete VAP implementation.

Scope: 8 retrospective events and 20 selected public evidence files. Private
repository names, code, deployment logs and local operational evidence are not
included. The aggregate repository inventory is an assertion from the preceding
local batch; the underlying private inventory is not independently reproduced
by this public bundle. Previous commitment/TSA material is included for linkage;
the verifier validates this new bundle, not the withheld previous evidence set.

VERIFY (Node.js 24.22.1+ within the 24.x line, and OpenSSL 3):
  cd vap-pack
  node verify.mjs
If OpenSSL 3 is not the default binary, set OPENSSL to its absolute path:
  OPENSSL=/opt/homebrew/opt/openssl@3/bin/openssl node verify.mjs
No npm installation or network access is required for verification.
Inspect the verifier and the selected FreeTSA root before relying on them.
"valid": true and "external_anchor_verified": true confirm the bundled
hashes, signatures, Merkle paths, evidence and timestamp under that trust root.

For integrity/signatures only (no external timestamp verification):
  node verify.mjs --integrity-only

Commitment SHA-256:
4f4ee60ddb97fb4ec80c44c741f3788a6823e17dbd001753ef5f61ab4bba7754
Merkle root:
79fae0ab69501278200f46df47184a24e7b50d69113914e611614488d8bd737a
FreeTSA genTime: 2026-10-21T17:25:31Z (2026-10-22 02:25:31 JST).

The session key is locally generated, not a certified organizational identity.
The timestamp establishes existence of the commitment by its genTime under the
selected TSA trust root. It does not prove the truth of all observations,
original human awareness time, absence of compromise, host safety, regulatory
compliance, or completion of an uninspected deployment. This batch closes before
the website announcement is published and does not record publication itself.
The snapshot retains dependency audit findings outside the Node.js/build fix.

日本語: 公開可能な情報を選んだVAP適用実例です。署名・証拠ハッシュ・
Merkle証明・タイムスタンプを検証できますが、未調査の環境の安全性や
全依存パッケージの脆弱性解消を保証するものではありません。
私有リポジトリの詳細や運用ログは含めていません。

Archive SHA-256: 874f7d38a624909ae0a12fa61c2e5c081d61eeeb87e0d9b21728cf15b95b0159
