# Website script integrity and CSP

This migration covers **425 checked-in HTML documents and six Hono HTML
templates**. It adds an enforcing Content Security Policy (CSP), verifies pinned
third-party scripts, and moves VCC JSX compilation out of the visitor's browser.
The companion [CSS migration](../site-css/README.md) replaces Tailwind Play CDN
with separately compiled configuration scopes.

**Remaining M8 exception:** Google's live analytics loader is mutable and has no
stable SRI pin in this implementation. It remains behind the existing explicit
analytics opt-in. Advertising consent and Google signals remain disabled. The
requirement to attach SRI to *every* external script is therefore not fully
closed. A successful build or CSP test does not remove that exception.

## Build and update

Use Node 24.22.1, Python 3 and both committed npm lockfiles:

```sh
npm ci --prefix tools/site-css --ignore-scripts --no-audit --no-fund
npm ci --prefix tools/site-security --ignore-scripts --no-audit --no-fund
npm run build:assets --prefix tools/site-security
python3 scripts/site_security.py build
npm run build --prefix tools/site-css
npm run check:assets --prefix tools/site-security
npm run check:policy --prefix tools/site-security
npm run check --prefix tools/site-css
npm run test:policy --prefix tools/site-security
```

Edit `vcc/demo/app.jsx`, then build its JavaScript before rebuilding styles. The
CSS scanner explicitly includes JSX as well as the generated script. Edit the
appropriate source JSON or template for generated public pages, run its
generator, then run the final CSP and CSS build/check sequence. Commit generated
assets, policies and HTML with their sources; GitHub Pages serves the committed
files directly.

`scripts/site_security.py build` updates metadata and
[`policies.json`](policies.json). `check` recomputes the same result without
writing and fails on drift. Both inventory actual executable scripts, decoded
event attributes, linked local JavaScript and resource origins. They reject
unreviewed existing policies, runtime Babel, `javascript:` URLs and external
static scripts without an exact verified pin and anonymous CORS.

### HTML generator integration

The shared `apply_csp(html, relative_path)` function runs immediately before each
HTML write in the corrections, announcements, site-directory, incident and
legacy-alias generators. The alias generator includes CSP in its exact-output
comparison. The security workflow runs all five paths and rejects uncommitted
output drift.

Both legacy `build-static*.mjs` exporters call the read-only projection
`python3 scripts/site_security.py render RELATIVE_PATH`, with HTML on stdin,
after their final URL/subpath rewrites. This covers their generated 404 and root
redirect pages as well as Hono output. These exporters have other existing
filesystem effects; the migration tested their actual HTML-write helpers in
isolation rather than running the destructive full legacy export over the
working repository. Direct Hono templates already include their own generated
policy. Changes to a template or inline script require policy regeneration.

## Script inventory and provenance

[`script-integrity.json`](script-integrity.json) contains verified SHA-384 pins
for these exact versioned resources:

| Resource | Version | Delivery/use |
| --- | --- | --- |
| React | 18.3.1 | `unpkg.com`, VCC demo |
| ReactDOM | 18.3.1 | `unpkg.com`, VCC demo |
| jsPDF | 2.5.1 | `cdnjs.cloudflare.com`, VAP-AT portal |
| Axios | 1.6.0 | `cdn.jsdelivr.net`, three Explorer API pages |
| lazysizes | 5.3.2 | `cdn.jsdelivr.net`, legacy lazy-image fallback |

Static tags require exactly the registered URL and integrity value, plus
`crossorigin="anonymous"`. The dynamic lazysizes fallback sets the same verified
integrity and CORS properties. Negative source fixtures reject missing,
malformed, mismatched and unknown pins and missing/credentialed CORS. The public
fixture downloader independently hashes retrieved bytes; a changed CDN asset
fails the test instead of silently changing its pin.

The previously referenced `qrcode@1.5.3/build/qrcode.min.js` URL returned 404.
The build now bundles **qrcode 1.5.3**'s browser entry locally, preserving its
Promise-capable `QRCode.toCanvas(canvas, text, options)` API. It uses pinned
esbuild 0.28.2; only qrcode, dijkstrajs 1.0.3 and encode-utf8 1.0.3 enter that
bundle. License notices are included beside the asset. The local script tag also
has a SHA-384 integrity attribute.

VCC uses build-time **Babel 8.1.0** with the previous env/classic-React presets.
`app.js` is reproducible from `app.jsx`; the page no longer downloads Babel or
executes `text/babel`. [`vcc-source.json`](vcc-source.json) records the original
extracted JSX digest and the reachable published commit used for comparison.
The local checkpoint identifier is retained explicitly as local provenance.
No verification, certificate or anchoring semantics are changed by precompiling.
The only subsequent JSX adjustment replaces the fractional fixed 200px QR
canvas with an integer module scale, capped at four pixels and fitted to the
modal width, then restores an aspect-safe responsive size after the renderer's
inline styles. Original and current source digests and that exact deviation are
recorded separately. Trailing spaces and the final blank line in the extracted
body are normalized; the emitted JavaScript is unchanged by that formatting.
Certificate contents remain unchanged.

### Live analytics exception

`assets/js/analytics.js` retains the existing public stream and consent UI. Only
after explicit opt-in does it create a script for
`https://www.googletagmanager.com/gtag/js?id=G-XTK1LJKRGV`. Google manages those
changing bytes. Adding a hash for one retrieved response would prevent later
legitimate responses from loading; this change does not pretend that such a hash
is a stable pin or silently replace the consent behavior.

The policy includes Google's non-advertising Analytics origins documented in
[Google's CSP guidance](https://developers.google.com/tag-platform/security/guides/csp):
Tag Manager for script delivery, Tag Manager/Google Analytics for image and
connection delivery, and `*.google.com` for the documented Analytics connection
requirement. It does not add Ads, DoubleClick or Floodlight origins or collection
features. The live-loader exception cannot be used by a static external script
tag: the source gate still requires a registered SRI pin for every such tag.

The browser consent test caches a current public loader as an **unpinned test
fixture**, records its actual digest, and runs it only through a local request
interceptor. It verifies no vendor request before consent or after decline,
one loader/config per page after acceptance, sanitized page URLs, denied advertising
consent, and disabling/clearing cookies on withdrawal. A two-page check opens
the homepage and privacy page in one browser context, withdraws consent in the
privacy page, and verifies that the already open homepage is disabled and emits
no further custom contact event. It is not a guarantee
about future vendor code or remote account configuration. No analytics event or
form submission is sent to a live service by the browser tests.

Open pages re-read the shared consent cookie before custom events and on focus,
page restoration and visibility changes. A same-origin `BroadcastChannel`
notifies other open pages of withdrawal; receivers check the cookie and never
grant consent from a message. Environments without that channel and separate
subdomains use the lifecycle/event checks. Cookie expiry or withdrawal on a
different subdomain is therefore detected on those checks, not instantaneously
in an idle unchanged page. Grants in another tab take effect after navigation
or local acceptance. The loader URL version is updated with this correction so
newly loaded documents request the corrected code.

## Policy behavior and limits

The generator places UTF-8 metadata first, within the first 1024 bytes, and CSP
immediately after it, before any script or requesting element. It hashes actual
parser-normalized inline script text and decoded event-handler values. A separate
browser test checks those values against Chromium's DOM parser for every HTML
document.

`script-src` allows same-origin scripts, the exact versioned external script
URLs needed by that document, the documented runtime dependencies, and SHA-256
hashes for its existing executable blocks. It contains neither `unsafe-inline`
nor `unsafe-eval`. `script-src-attr` is `none` where possible; otherwise it uses
`unsafe-hashes` with only the required event-handler hashes. Hash-authorized
handler text can be reused by an injected matching attribute, so this is not a
claim that all inline-handler injection is impossible.

Runtime-generated blog pagination, benchmark controls and portal scoring use
delegated listeners and data attributes instead of constructing new inline
handlers. VCC React event listeners continue to work after precompilation.

Resource directives reflect the document's real sources. Reviewed dynamic
exceptions are explicit in `RUNTIME_SOURCES`, including the existing Explorer
demo API base assembled through a variable. The active bundle and retained
historical bundle have separate entries; a source regression test checks that
the currently linked bundle's evidence connection remains permitted after an
asset-name change. Newly introduced indirect script,
fetch, worker or module dependencies need a source review and interaction test;
literal-source scanning cannot infer arbitrary JavaScript behavior.

Existing CSS-in-JS components, `<style>` blocks and style attributes still need
**`style-src 'unsafe-inline'`**. This does not grant script inline/eval
permission. `object-src 'none'`, a self-only base URL and explicit form/connection
destinations provide additional restrictions. Same-origin script hosting and
allowed vendor endpoints remain trust boundaries.

GitHub Pages serves these policies as HTML metadata. Meta CSP cannot provide
the header-only `frame-ancestors` directive or CSP reporting configuration. This
change does not claim clickjacking protection, a reporting endpoint, removal of
all inline CSS, or a general XSS audit. Two repository pages intentionally
redirect to external sites; their source policy does not govern the destination.

Primary references: [CSP Level 3](https://www.w3.org/TR/CSP3/) and
[`script-src-attr`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src-attr).

## Browser verification

Both security and CSS workflows run for pull requests with any base branch,
including the dependent review branch. They use Chrome for Testing
**137.0.7151.119**, with the downloaded archive SHA-256 verified before launch.
All browser requests are intercepted; external fonts/styles are omitted and
external API responses are local fixtures. This tests policy enforcement and
application behavior without claiming live service or typography availability.

```sh
npm run cache:fixtures --prefix tools/site-security
export CSS_BROWSER_PATH=/absolute/path/to/chrome
export SECURITY_EVIDENCE_DIR=/tmp/vcp-site-security-evidence
npm run test:csp --prefix tools/site-security
npm run test:crawl --prefix tools/site-security
npm run test:benchmark --prefix tools/site-security
npm run test:interactions --prefix tools/site-security
npm run test:analytics --prefix tools/site-security
```

The CSP harness verifies every static page's policy and hashes, then proves
that real injected inline scripts, new event attributes, eval called from an
allowed same-origin script, and an unlisted external script are blocked. A
response-only no-policy control must execute all four probes. DevTools evaluation
alone is not accepted as evidence of script-policy enforcement. Existing FAQ
and mobile-header controls must still work.

The initial-load crawl checks all 425 HTML source paths: 423 local loads and two
explicitly declared external redirects. It rejects page errors, unexpected
policy omissions, and CSP violations. The redirect exemption requires an exact
browser-parsed source refresh target and a source CSP; it does not assert a
policy on the intercepted external destination.

Focused tests exercise all three blog languages, translated portal scoring,
benchmark criteria/file removal/PDF and ZIP exports, and the VCC
event/anchor/verification/certificate/QR sequence. The separate CSS suite checks
all 33 configuration groups at desktop/mobile sizes, dynamic/dark states and
active authored keyframes, with deliberate wrong-theme and animation-collision
negative controls. These checks cover representative paths; they do not prove
every possible application input or future dependency update.
