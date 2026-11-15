# Explorer disclosure refresh — staged static assets

**Status: staged, not deployed.** This record covers the 11 November 2026
candidate only. It does not undo or reinterpret the earlier Evidence Demo
rollout recorded in [site PR #164](https://github.com/veritaschain/vcp-site/pull/164).
No live API availability or deployed-site verification was performed here.

## Source and purpose

The assets are built from [GUI PR #28](https://github.com/veritaschain/vcp-explorer-gui/pull/28),
commit `6dbd7156a06360344795e3b2618620b71abd85f7`, tree
`d8875c1dd705a2044f12323750bfb12c6eea4070`. That tree exactly matches the local
source checkout used for the build. The source adds persistent demo disclosures,
labels synthetic anchor/tier data explicitly, and prevents mock transaction
identifiers from being offered as live Etherscan evidence.

The public site baseline is `404d2730472fb86d21177d55b4cb0a767f77d2e1`.
The same candidate also contains the separate public-disclosure corrections.
This candidate is not a specification change or a verified anchoring result.

## Reproduction inputs

Use the GUI lockfile and Node 24.22.1 / npm 11.9.0. From the pinned checkout:

```sh
npm ci
VITE_USE_MOCK=true VITE_ROUTER_MODE=hash VITE_API_BASE_URL= \
  VITE_EVIDENCE_API_BASE_URL=https://veritaschain-evidence-demo.kamimura0000.chatgpt.site/v1 \
  npm run build -- --base=/explorer/app/
```

The legacy routes are synthetic. The separate Evidence Demo retains its existing
explicit API base; this build does not deploy or freshly verify that API. The
asset hashes, lockfile hash, generated-index hash and exact before/after site
entry hashes are in [build-manifest.json](build-manifest.json).

## Site preservation and retired assets

Only the script and stylesheet references change in `explorer/app/index.html`.
Its canonical/OG/JSON-LD metadata, CSP, 24 October integrity notice, layout
styles, static fallback and documentation-link script remain byte-identical.
The logo also matches the GUI distribution without modification.

The three old JavaScript bundles and three old stylesheets are removed from the
public tree after checking that current source files do not reference them.
Dated maintenance manifests remain intact as historical records. All retired
asset hashes are retained in the new manifest and their bytes remain available
at the site baseline in Git history for rollback. No fixed release or ZIP is
changed. The security inventory now references only the new active bundle;
its permitted API connection origin is unchanged and has not been broadened.

## Checks and remaining publication evidence

Local checks verified exact GUI-to-site asset equality, unchanged HTML outside
the two references, the published GUI source tree, JavaScript syntax, site
security, SEO, legacy aliases, analytics coverage and whitespace. These are
first-party checks. At the final GUI source commit, the
[responsive workflow](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/42937005309)
passed in Chromium, Firefox and WebKit, including the Chromium generated-PDF
parser checks. The final test-only change updated the expected printed heading;
the staged application assets are unchanged and were compared again with `dist`.
The [static-subpath](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/42937005181),
[accessibility](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/42937005500),
[hash-chain](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/42937005126)
and [SDK integration](https://github.com/veritaschain/vcp-explorer-gui/actions/runs/42937005152)
workflows also passed. The general GUI CI run was still in progress at this
observation and is not recorded as complete.

These are GUI source workflow results. Composed-site browser testing and
verification of deployed HTML/assets remain pending; no live-site browser
success, comprehensive accessibility audit or independent reproduction is
established by these results.

After a separately reviewed deployment, compare public HTML and linked asset
hashes with the manifest, inspect desktop/mobile navigation and the persistent
disclaimer with the mobile menu closed, and check the Evidence Demo from the
official origin. A transport failure is not a cryptographic INVALID result.
Deployment, successful bounded checks, external anchoring and independent
reproduction remain distinct claims.
