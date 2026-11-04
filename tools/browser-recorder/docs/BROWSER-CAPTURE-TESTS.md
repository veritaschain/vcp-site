# Reproduce the real DOM capture checks

These tests exercise the capture function in Chrome on a loopback-only synthetic
HTML fixture. They do not load the extension, grant activeTab, test the popup or
prove behavior on ChatGPT/Claude/Gemini. The extension-level checks are separate.

The same ten cases passed on Linux in Chrome for Testing 156.0.8078.80 and
137.0.7151.119. Results for the older browser are recorded separately in
[the limited compatibility report](BROWSER-STORAGE-TESTS.md).

## Setup and run

Use Node 22+, Playwright, and a reviewed Chrome for Testing binary. The test
expects an installed `playwright` module; alternatively set `PW_MODULE` to its
absolute module path. Set `CHROME_EXECUTABLE` to use an explicitly selected
Chrome binary, otherwise Playwright uses its configured Chromium installation.
No credentials or real conversation data are needed.

```sh
CHROME_EXECUTABLE=/path/to/chrome npm run test:browser-capture
```

The runner binds an ephemeral port on 127.0.0.1, opens the synthetic fixture,
tests DOM Ranges and Selection APIs, and closes its server and browser. It fails
if the required browser/module is absent; it does not silently skip tests.
The current script uses `--no-sandbox` for the isolated container test runtime.

## Covered boundary cases

- Ordinary multi-paragraph Unicode text, including an editor outside the Range.
- Ordinary text endpoints surrounding an interior contenteditable host, input
  or textarea; empty/true/uppercase/plaintext-only contenteditable values.
- Effective inherited editing, document-wide designMode and a false island
  within an editing host; a standalone contenteditable=false region is allowed.
- Endpoints inside open/closed shadow roots, a crossed observable open shadow
  host, and a crossed iframe.
- Empty and oversized selected text.

The closed-shadow endpoint case is one observed browser behavior, not a claim
that arbitrary closed shadow trees can be detected or inspected. Selection
spanning opaque content has no general guarantee. User preview/consent remains
required, and stored text is never claimed to be an AI provider's attestation.

Primary API references used for this change:

- https://dom.spec.whatwg.org/#dom-range-intersectsnode
- https://html.spec.whatwg.org/multipage/interaction.html#contenteditable
- https://w3c.github.io/selection-api/#dom-selection-getcomposedranges
