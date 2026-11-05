# Compiled site Tailwind CSS

The public HTML previously loaded Tailwind Play CDN on 302 pages. Those pages,
and the six matching Hono source templates, now load one checked-in asset:
`/assets/css/site-tailwind.css`.

## Build and verify

Use Node 24 and the lockfile in this directory:

```sh
npm ci --prefix tools/site-css --ignore-scripts --no-audit --no-fund
npm run build --prefix tools/site-css
npm run check --prefix tools/site-css
```

GitHub Pages serves the committed CSS directly. It does not need npm or a browser
compiler. `check` rebuilds the asset and rejects stale output, missing theme
assignments/links, and Play CDN/config scripts reintroduced into HTML or TSX.

## Why the theme scopes are necessary

The original 49 configuration scripts contain 32 different configurations. For
example, propfirm and developer pages use different `primary` and `accent`
colors; the VAP profiles have language-specific font stacks; the VCC demo uses
class-based dark mode. Combining these theme objects would silently change
colors and fonts on other pages.

`themes.json` preserves each configuration as JSON, together with its page list,
the original commit, and hashes of the captured configuration scripts. The
default configuration is a separate 33rd group. The one-time `migrate.cjs` shows
how the capture was made and refuses to overwrite an existing manifest.

Each configuration is compiled separately using **Tailwind 3.4.17**. The builder
adds a zero-specificity `:where(...)` target guard to every selector, including
preflight. This keeps the page's font defaults, original specificity, root
utilities, pseudo-elements and class-based dark mode. Keyframes cannot carry
selector guards: every generated name is prefixed with `vcp-tw-<theme>-`, and
generated animation declarations use that name. Page-authored animation names
and definitions remain unchanged. This prevents a utility on another page from
overwriting, for example, a local `pulse` ring animation. Themes are never
globally merged.

The stylesheet link is the last element in the static `<head>`, retaining the
late utility cascade of the previous Play CDN. Dynamically loaded header/footer
styles continue to load normally. Existing home/landing CSS builds are unchanged.

The content scan includes each group's HTML/templates and local scripts linked
from those documents, including `solutions/exchanges/static/app.js` and
`explorer/static/app.js`. Complete conditional class strings in the VCC JSX and
the blog/FAQ interactions are included. When adding dynamic classes, keep full
class names in these sources; do not construct partial utility names at runtime.
If a page starts loading another script indirectly, add its class-bearing source
to the content collection before relying on new utilities.

When adding a page, copy the appropriate `data-tw-theme` value and CSS link,
register its path in that theme's `pages` list, then rebuild. Preserve a separate
configuration for incompatible theme values. The IDs are opaque identifiers,
not public product concepts.

## Render comparisons

```sh
CSS_BROWSER_PATH=/absolute/path/to/chrome \
CSS_EVIDENCE_DIR=/tmp/vcp-site-css-render \
npm run test:render --prefix tools/site-css
```

Without `CSS_BROWSER_PATH`, Playwright uses its installed Chromium. The CI job
pins a Chrome for Testing build and verifies the downloaded archive's SHA-256.
The initial local validation used Chrome **137.0.7151.119**.

Every compared full-page frame prepares images, visits visible backdrop-filter
surfaces and rounded clips with actual overflow in real viewports, restores the
requested scroll position, and captures that restored viewport before the
full-page PNG. This preparation also runs before interactions. It changes no
page styles, comparison thresholds, masks or interaction states. The original
Chinese VeraSnap failure omitted two offscreen cards despite unchanged DOM and
styles; later same-CSS controls reproduced single-row clip and rounded-corner
differences. The tested compositor-stage flag did not remove those differences
and is no longer used.

Viewport stops are clamped to the document's scroll range. Coalescing selects
only original stops, preserves their complete viewport interval union, and
keeps the original 128-pixel overlap when combining gaps. Larger gaps remain
only when the original stops were already adjacent. Each traced capture records
requested, normalized and selected stops, actual scroll positions immediately
before viewport screenshots, and the original/restored scroll position.

`node tools/site-css/capture-control.cjs` records fixed same-CSS observations;
it does not search for a passing frame. CI runs three parallel 15-minute groups
selected by `CSS_CAPTURE_CONTROL_GROUP`: `mobile-clips`, `page-clips`, and
`scrolled-faq`. Across eight affected cases, five modes compare backdrop-only,
added clips, added restored-viewport paint, both additions, and both with stop
coalescing. Two fresh contexts and four frames per mode/case produce **320
frames**. The final mode uses exactly the regular comparator's preparation.
The mobile group also retains the Chinese VeraSnap reference/compiled and
same-CSS pairs, original four-frame preparation controls, and a four-frame
sequence using the candidate preparation.

Each group uploads its own `compiled-css-capture-controls-{group}` artifact
independently of the full comparison. PNG hashes and unrounded target geometry,
all computed properties including pseudo-elements, actual viewport/scroll state,
and paint plans are retained. Regular comparison differences save both full
reference/compiled target states; unstable-frame evidence saves the available
side's target state. These
new preparation modes remain browser candidates until their controls demonstrate
the intended effect and the complete render, animation and wrong-theme gates
pass; a completed diagnostic step alone does not establish equivalence.

The full comparison job has a 35-minute execution budget: the measured
[110-case comparison took 21:04](https://github.com/veritaschain/vcp-site/actions/runs/41936887494),
while a prior successful run spent
[4:32 installing browser dependencies](https://github.com/veritaschain/vcp-site/actions/runs/41930914037).
Together those stages already exceed 25 minutes. This is only a job-resource
budget change. The image load/decode timeout, four-frame/three-comparison limit,
pixel thresholds, 110-case coverage, active-animation check and deliberate
wrong-theme rejection are unchanged.

`node tools/site-css/homepage-check.cjs` checks the English, Japanese and Chinese
homepages at 1440, 390 and 360 pixels. It verifies content and primary actions,
available-language routes, keyboard navigation through all five menu groups,
mobile open/close state, FAQ operation, and horizontal overflow. Screenshots
and a separate report are saved in the `homepage` evidence subdirectory.

The suite renders one representative of every configuration plus default at
1440 px and 390 px, three-language broker/blog/FAQ pages, the three blog articles
with dynamic classes, the changed law/press pages, and interactive mobile-menu,
FAQ, search, scroll-button and VCC dark/tab states. It compares stable full-page
PNG pixels, element geometry, computed styles, pseudo-elements and JavaScript
errors. The base pixel tolerance is one level out of 255 per channel. A tightly
bounded raster-noise allowance permits **at most one pixel per distinct rounded
corner (four total)** above that base, with a **maximum channel difference of
five**, only if dimensions, element
geometry and computed styles are identical and both pages have zero JavaScript
errors. Every allowed pixel must lie within a distinct measured rounded corner of the
header's active language link, with every computed property of that link and its
language-switcher parent identical. The allowance is unavailable for scrolled or
scaled captures; the original threshold applies everywhere else. Its use is
explicitly marked; raw pixel counts, measured regions and both images remain
in the evidence. These images are not described as byte-identical.

This budget comes from a fixed five-pair control using fresh contexts and the
same mobile law page with identical independently compiled standalone CSS on
both sides. One pair reproduced the exact one-pixel color difference and both
PNG hashes seen in the migration comparison, at a rounded active-language-link
corner. All 279 element snapshots and every computed property of the language
switcher and active link matched, with zero errors. Each context's final paint
was stable, so repeated paints alone cannot remove the difference. The suite
does not retry comparisons until they pass or change public styling for the test.
The first CI run reproduced the identical color pair at all four corners on the
Japanese law page. The bound therefore allows one pixel per corner, and rejects
two pixels in one corner or any pixel outside those four measured regions.
The browser disables LCD text rasterization and overlay scrollbars. Evidence is written to the
selected directory, outside the public site.
Search comparisons wait for the debounced rendered-results state. They disable
native spellcheck on the test input so runner-specific spelling underlines do
not become CSS differences; the public input and its behavior are unchanged.

Set `CSS_NEGATIVE_CONTROL=1` to deliberately assign the default theme to the
propfirms page in the test response. This control succeeds only if the comparator
detects the resulting visual regression; it does not modify the source page.

All browser requests are intercepted. Local repository assets and the exact
pinned React/ReactDOM fixtures are served locally; other external resources
(including fonts and icon stylesheets) are omitted equally on both sides. No
form submission, analytics request or live service call is sent by the tests.

The reference is **each page's own content and original configuration compiled
independently by the same pinned Tailwind compiler**, without the page scopes.
It does not pool other pages' content into the reference. This checks that the
single scoped asset preserves those configurations and their rendered behavior.
It is not a claim of pixel identity with captured production CDN bytes: the
unversioned Play CDN endpoint returned HTTP 403 in the implementation environment.
External font/icon availability and every possible application interaction are
outside this comparison.

`npm run test:animations --prefix tools/site-css` separately checks live browser
keyframes on all nine English/Japanese/Chinese media, standardization and MAP
pages. Animations remain active in this test. A negative control deliberately
recreates the global `pulse` collision and must be detected. Static screenshot
comparisons alone do not validate animation semantics.

## Security boundary

The cumulative migration also precompiles VCC JSX, removes runtime Babel, and
enforces generated per-document CSP. The independent
[site security checks](../site-security/README.md) cover script/handler hashes,
third-party integrity, application interactions and negative controls. CSS
render parity is not proof that a security policy or every application path works.

Existing inline styles remain allowed. Google's mutable, consent-gated analytics
loader remains an explicitly documented SRI exception; the requirement to attach
SRI to every external script is not fully closed. Versioned external assets and
the legacy lazy-image fallback are pinned and integrity checked. See the security
README for the exact policy, generator integration and verification limits.

Primary documentation: [Tailwind v3 Play CDN](https://v3.tailwindcss.com/docs/installation/play-cdn),
[Tailwind content detection](https://v3.tailwindcss.com/docs/content-configuration).
