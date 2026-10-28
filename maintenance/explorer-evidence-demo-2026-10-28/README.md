> **Historical preparation snapshot.** This README and its
> build-manifest.json preserve the original pre-deployment state for auditability.
> The authoritative **subsequent rollout record** is
> [merged site PR #164](https://github.com/veritaschain/vcp-site/pull/164):
> on 28 October 2026 the page was deployed at
> https://veritaschain.org/explorer/app/#/evidence-demo, and Chrome
> integration reported all three expected synthetic outcomes. This does **not**
> prove independent reproduction or general CLI access. A separate Python
> HTTPS probe of the API reported Cloudflare HTTP 403 / error 1010; it is not
> a cryptographic INVALID result. The
> [SDK offline replay CLI](https://github.com/veritaschain/vcp-sdk/blob/main/docs/EXPLORER_REPLAY_CLI.md)
> provides a network-independent first-party recheck (after its PR is merged).
>
> **Do not overwrite historical status fields with a retroactive success.**
> Preparation, deployment, browser observations and third-party reproduction
> are distinct states.

# Explorer SDK Evidence Demo — prepared static-site update

**Static-site package prepared on 28 October 2026; official-site rollout is
pending.** The API was subsequently deployed and checked by direct public
browser navigation, as recorded below. The site changes in this package have
not been published. API availability does not establish that the official
Explorer GUI has been deployed or that its cross-origin requests work.

## Fixed build inputs

- GUI source: `veritaschain/vcp-explorer-gui` at
  `0afb76943c0c4b915553ccc72b66cb62e99e7cf1` (merged PR #21).
- Site baseline: `veritaschain/vcp-site` at
  `3942ee42c758a7313385ce5e0b38a1f46c03f62c`.
- Node.js `24.22.1`, npm `11.9.0`; use the committed GUI lockfile.
- Evidence API base embedded in the unchanged build:
  `https://veritaschain-evidence-demo.kamimura0000.chatgpt.site/v1`.
- Portable API source: `veritaschain/vcp-explorer-api` at
  `7b6cb63930594b091330dc1cf41584b98e68a9b5`, merged by PR #25 as
  `c3d67ab2467a55e017f652b38a2b89c3f4a7cee7`.
- SDK source: `veritaschain/vcp-sdk` at
  `70240a45fc83d38c3b4282ff886afd4dbbb9e006`.

From the pinned GUI checkout, with dependencies installed from its lockfile:

```sh
npm ci
VITE_USE_MOCK=true VITE_API_BASE_URL= \
  VITE_EVIDENCE_API_BASE_URL=https://veritaschain-evidence-demo.kamimura0000.chatgpt.site/v1 \
  VITE_ROUTER_MODE=hash npm run build -- --base=/explorer/app/
```

The legacy dashboard remains a synthetic mock demonstration. Only Evidence
Demo uses the dedicated API. The public origin allowed by the API must be
`https://veritaschain.org`; the hash route is not part of that origin.
The intended entry is `https://veritaschain.org/explorer/app/#/evidence-demo`.
The root Explorer URL continues to open its existing dashboard.

## Subsequent public API observations

The Sites deployment succeeded at **2026-10-28 13:25:22.938892 UTC**:

- Sites source commit: `f43627e150de11654fc02763a8b6c0f640af2837`.
- Version: `appgprj_6ae1ccc51fe081919f422d68ab9a1cba~appgver_9702cfc076a481918ae707bbe188be50`.
- Deployment: `appgdep_6ae1f7a70e6481918d599d0101a44fc0`.

At approximately **2026-10-28 13:33 UTC**, direct navigation in Chrome to the
public origin returned the health and case-list JSON and the following case
reports. No sign-in or browser challenge was observed. These are first-party
browser observations, not independent reproduction or official-GUI results.

| Case | Local checks | Full evidence | Checks |
| --- | --- | --- | --- |
| `intact` | `VALID` | `INDETERMINATE` | 31 |
| `tampered` | `INVALID` | `INVALID` | 32 |
| `missing-key` | `INDETERMINATE` | `INDETERMINATE` | 31 |

`/health` reported `status: ok` and the pinned SDK, portable API and GUI
revisions above. `/v1/evidence-demo/cases` listed the three cases. The
verification routes were `/v1/evidence-demo/cases/<case>/verification`.
The intact response preserved the raw nanosecond integer
`1793145600123456789`. The tampered response reported event-hash, signature,
link-source and inclusion mismatches; the missing-key response reported
`key_configured: false`. Missing external anchor proof remained
`INDETERMINATE`.

A separate Python HTTPS request to `/health` returned **HTTP 403**, with
`error code: 1010`; it did not verify the API. Browser success must not be
represented as CLI success. Requests from the official site's origin, CORS,
the published hash-route GUI and public HTML/asset hashes remain pending.
The manifest keeps deployment, direct-browser and site-rollout states separate.

## Files and preservation

The new hashed JavaScript and CSS are copied from this build into
`explorer/app/assets/`. The existing assets remain untouched for rollback.
The generated Vite index is not copied over the site index: only the two asset
references, four matching descriptions and static fallback scope/link change.
The canonical URL, social titles/images, structured-data identities, original
24 October integrity notice and both existing layout styles remain unchanged.

`build-manifest.json` records build inputs, old/new file hashes and the notice
hash. The old index is recoverable at the site baseline above; rollback does
not require deleting the new assets. This package contains no API credentials
or production trading evidence. The synthetic demo retains its separate
local-check and full-evidence verdicts; external anchoring and full VCP/VAP
conformance are not established.

## Checks and publication gate

Local staging checks comprise the GUI production build, generated asset-path
and API-base inspection, exact notice/metadata preservation, and static-site
SEO validation. Their results are recorded in the manifest. No network server
or browser check was run for this staging step.

Before official-site publication, complete the composed-site browser checks.
After the reviewed site change is deployed, verify cross-origin API requests
from the official GUI, compare independent public GETs of the HTML and
referenced assets to the manifest, and inspect desktop/mobile results.
First-party tests and a public demo do not establish independent reproduction,
production readiness or certification.
