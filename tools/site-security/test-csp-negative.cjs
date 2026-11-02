'use strict';

// Exercise the browser's real document policy. DevTools is used only to append
// an external <script> element and read results; the probes themselves execute
// in a same-origin script loaded through the ordinary browser/CSP pipeline.
// Every HTTP request is fulfilled or aborted locally. No remote code runs.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('../site-css/node_modules/playwright');

const ROOT = path.resolve(__dirname, '../..');
const ORIGIN = 'https://veritaschain.org';
const PAGE = '/certified/faq/index.html';
const DRIVER = '/__site-security-tests__/csp-driver.js';
const EXTERNAL = 'https://csp-negative.invalid/unlisted-script.js';
const source = fs.readFileSync(path.join(ROOT, PAGE), 'utf8');
const policyTags = source.match(/<meta\b[^>]*>/gi)?.filter(tag =>
  /\bhttp-equiv\s*=\s*(?:"content-security-policy"|'content-security-policy'|content-security-policy(?=\s|>))/i.test(tag)) || [];

// Deliberately unique source text: neither this inline script nor this handler
// should be among the generated page's allowed hashes.
const driver = `
'use strict';
(() => {
window.__cspNegative = {
  driverLoaded: true, ready: false, inlineExecuted: false,
  handlerExecuted: false, evalEntered: false, evalExecuted: false,
  evalError: null, externalExecuted: false, externalSettled: null,
  violations: []
};
const result = window.__cspNegative;
document.addEventListener('securitypolicyviolation', event => {
  result.violations.push({
    directive: event.effectiveDirective, blocked: event.blockedURI,
    disposition: event.disposition
  });
});
const inline = document.createElement('script');
inline.textContent = 'window.__cspNegative.inlineExecuted = true;';
document.body.appendChild(inline);
const button = document.createElement('button');
button.id = 'csp-negative-handler';
button.textContent = 'CSP unlisted-handler probe';
button.setAttribute('onclick', 'window.__cspNegative.handlerExecuted = true;');
button.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;padding:12px;background:white;color:black';
document.body.appendChild(button);
result.evalEntered = true;
try {
  (0, eval)('window.__cspNegative.evalExecuted = true;');
} catch (error) {
  result.evalError = error.name;
}
const external = document.createElement('script');
external.src = ${JSON.stringify(EXTERNAL)};
external.addEventListener('load', () => { result.externalSettled = 'load'; });
external.addEventListener('error', () => { result.externalSettled = 'error'; });
document.body.appendChild(external);
result.ready = true;
})();
`;

const contentTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf'
};

async function browserHashes(browser) {
  const inventory = JSON.parse(fs.readFileSync(path.join(__dirname, 'policies.json'), 'utf8')).pages;
  const context = await browser.newContext({ serviceWorkers: 'block' });
  // DOMParser is inert, and this route also prevents image/font side effects.
  await context.route('**/*', route => route.abort());
  try {
    const page = await context.newPage();
    const digest = value => "'sha256-" + crypto.createHash('sha256').update(value, 'utf8').digest('base64') + "'";
    const hashes = values => [...new Set(values.map(digest))].sort();
    let documents = 0;
    let inlineScriptHashes = 0;
    let handlerHashes = 0;
    for (const [file, expected] of Object.entries(inventory)) {
      if (!file.endsWith('.html')) continue;
      const parsed = await page.evaluate(html => {
        const document = new DOMParser().parseFromString(html, 'text/html');
        const executable = new Set(['', 'module', 'text/javascript', 'application/javascript', 'text/ecmascript', 'application/ecmascript']);
        const data = new Set(['application/json', 'application/ld+json']);
        const scripts = [...document.querySelectorAll('script:not([src])')];
        for (const script of scripts) {
          const type = (script.type || '').trim().toLowerCase();
          if (!executable.has(type) && !data.has(type)) throw new Error(`Review unrecognized script type: ${type}`);
        }
        const policies = [...document.querySelectorAll('meta[http-equiv="Content-Security-Policy" i]')];
        if (policies.length !== 1) throw new Error(`Expected one browser-parsed enforced policy, received ${policies.length}`);
        return {
          policy: policies[0].content,
          scripts: scripts.filter(script => executable.has((script.type || '').trim().toLowerCase())).map(script => script.textContent),
          handlers: [...document.querySelectorAll('*')].flatMap(element => [...element.attributes]
            .filter(attribute => attribute.name.toLowerCase().startsWith('on')).map(attribute => attribute.value))
        };
      }, fs.readFileSync(path.join(ROOT, file), 'utf8'));
      const actualScripts = hashes(parsed.scripts);
      const actualHandlers = hashes(parsed.handlers);
      assert.equal(parsed.policy, expected.policy, `Browser-parsed policy must match the current inventory: ${file}`);
      const scriptSources = parsed.policy.split(';').map(directive => directive.trim().split(/\s+/)).find(directive => directive[0] === 'script-src');
      assert.ok(scriptSources, `Explicit script-src is required: ${file}`);
      assert.ok(!scriptSources.includes("'unsafe-inline'") && !scriptSources.includes("'unsafe-eval'"), `No blanket inline-script/eval permission: ${file}`);
      assert.deepEqual(actualScripts, expected.inline_script_hashes, `Browser-parsed inline script hashes: ${file}`);
      assert.deepEqual(actualHandlers, expected.handler_hashes, `Browser-decoded handler hashes: ${file}`);
      documents++;
      inlineScriptHashes += actualScripts.length;
      handlerHashes += actualHandlers.length;
    }
    assert.ok(documents > 0, 'Policy inventory must cover real static HTML documents');
    console.log(JSON.stringify({ browserHashParity: 'pass', documents, inlineScriptHashes, handlerHashes }));
  } finally { await context.close(); }
}

async function openCase(browser, enforce) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, serviceWorkers: 'block'
  });
  const traffic = { externalProbeRequests: 0, localMissing: [], externalStubs: new Set() };
  const html = enforce ? source : source.replace(policyTags[0], '');
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.href === EXTERNAL) {
      traffic.externalProbeRequests++;
      return route.fulfill({ contentType: 'text/javascript', body: 'window.__cspNegative.externalExecuted = true;' });
    }
    if (url.origin !== ORIGIN) {
      // Empty local stubs satisfy unrelated font/style/image requests without
      // depending on a CDN or sending analytics/other traffic to an endpoint.
      traffic.externalStubs.add(url.origin);
      const type = request.resourceType();
      if (type === 'stylesheet') return route.fulfill({ contentType: 'text/css', body: '' });
      if (type === 'image') return route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg"/>' });
      if (type === 'script') return route.fulfill({ contentType: 'text/javascript', body: '' });
      return route.fulfill({ status: 204, body: '' });
    }
    if (url.pathname === PAGE) return route.fulfill({ contentType: contentTypes['.html'], body: html });
    if (url.pathname === DRIVER) return route.fulfill({ contentType: contentTypes['.js'], body: driver });
    let relative;
    try { relative = decodeURIComponent(url.pathname).replace(/^\/+/, ''); }
    catch { return route.abort('failed'); }
    const local = path.resolve(ROOT, relative);
    if (!local.startsWith(ROOT + path.sep)) return route.abort('accessdenied');
    if (!fs.existsSync(local) || !fs.statSync(local).isFile()) {
      traffic.localMissing.push(url.pathname);
      return route.fulfill({ status: 404, body: 'Missing local test resource' });
    }
    return route.fulfill({
      contentType: contentTypes[path.extname(local)] || 'application/octet-stream',
      body: fs.readFileSync(local)
    });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(10_000);
  const errors = [];
  const policyConsole = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (/Content Security Policy/i.test(message.text())) policyConsole.push(message.text());
  });
  await page.goto(ORIGIN + PAGE, { waitUntil: 'load' });
  return { context, page, traffic, errors, policyConsole };
}

async function positiveControls(page) {
  const toggle = page.locator('vcp-header .nav-toggle');
  const menu = page.locator('vcp-header .nav-menu');
  await toggle.waitFor({ state: 'visible' });
  assert.equal(await menu.evaluate(element => element.classList.contains('active')), false, 'Header initially closed');
  await toggle.click();
  assert.equal(await menu.evaluate(element => element.classList.contains('active')), true, 'Header opens through existing event listener');
  await toggle.click();
  assert.equal(await menu.evaluate(element => element.classList.contains('active')), false, 'Header closes through existing event listener');

  const item = page.locator('.faq-item').first();
  const button = item.locator('button[onclick="toggleFAQ(this)"]');
  const answer = item.locator('.faq-answer');
  assert.equal(await answer.evaluate(element => element.classList.contains('active')), false, 'FAQ initially closed');
  await button.click();
  assert.equal(await answer.evaluate(element => element.classList.contains('active')), true, 'Hashed inline FAQ function and handler open answer');
  assert.equal(await item.locator('.faq-icon').evaluate(element => element.classList.contains('rotate')), true, 'FAQ indicator opens');
  await button.click();
  assert.equal(await answer.evaluate(element => element.classList.contains('active')), false, 'FAQ closes through its existing handler');
}

async function probes(test, enforce) {
  const { page } = test;
  await page.evaluate(src => {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
  }, DRIVER);
  await page.waitForFunction(() => window.__cspNegative?.ready && window.__cspNegative.externalSettled);
  await page.locator('#csp-negative-handler').click();
  if (enforce) {
    await page.waitForFunction(() => {
      const events = window.__cspNegative.violations;
      return events.some(event => event.directive === 'script-src-elem' && event.blocked === 'inline') &&
        events.some(event => event.directive === 'script-src-attr' && event.blocked === 'inline') &&
        events.some(event => event.directive === 'script-src' && event.blocked === 'eval') &&
        events.some(event => event.directive === 'script-src-elem' && event.blocked.startsWith('https://csp-negative.invalid'));
    });
  } else {
    await page.waitForFunction(() => window.__cspNegative.handlerExecuted);
  }
  const result = await page.evaluate(() => window.__cspNegative);
  assert.equal(result.driverLoaded, true, 'Same-origin external driver must execute normally');
  assert.equal(result.evalEntered, true, 'eval probe must actually be reached');
  for (const property of ['inlineExecuted', 'handlerExecuted', 'evalExecuted', 'externalExecuted']) {
    assert.equal(result[property], !enforce, `${property}: ${enforce ? 'CSP must block' : 'unprotected control must execute'}`);
  }
  assert.equal(result.evalError, enforce ? 'EvalError' : null, 'String eval runs inside an ordinary allowed script');
  assert.equal(result.externalSettled, enforce ? 'error' : 'load', 'External script must settle through browser loading');
  assert.equal(test.traffic.externalProbeRequests, enforce ? 0 : 1, 'CSP must block the disallowed origin before any request');
  if (enforce) {
    const blocked = (directive, resource) => result.violations.some(event =>
      event.directive === directive && event.blocked === resource && event.disposition === 'enforce');
    assert.ok(blocked('script-src-elem', 'inline'), 'Inline script must produce an enforcing violation');
    assert.ok(blocked('script-src-attr', 'inline'), 'Unlisted handler must produce an enforcing violation');
    assert.ok(blocked('script-src', 'eval'), 'String eval must produce an enforcing violation');
    assert.ok(result.violations.some(event => event.directive === 'script-src-elem' &&
      event.blocked.startsWith(new URL(EXTERNAL).origin) && event.disposition === 'enforce'), 'Unlisted origin must produce an enforcing violation');
  } else {
    assert.deepEqual(result.violations, [], 'Control removes only the CSP meta and proves all four probes are executable');
  }
  assert.deepEqual(test.errors, [], 'No unrelated JavaScript failure may masquerade as CSP protection');
  assert.deepEqual(test.traffic.localMissing, [], 'All local page dependencies must be available');
  return result;
}

async function main() {
  assert.equal(policyTags.length, 1, 'Generate one enforced CSP meta for the real FAQ page before this test');
  const browser = await chromium.launch({
    executablePath: process.env.CSS_BROWSER_PATH || undefined,
    headless: true, args: ['--no-sandbox']
  });
  try {
    await browserHashes(browser);
    for (const enforce of [true, false]) {
      const test = await openCase(browser, enforce);
      try {
        await positiveControls(test.page);
        assert.deepEqual(test.policyConsole, [], 'Existing FAQ/header must work without CSP violations before probes');
        const result = await probes(test, enforce);
        console.log(JSON.stringify({
          policy: enforce ? 'actual-generated-csp' : 'no-policy-control',
          faqToggle: 'pass', mobileHeader: 'pass',
          inlineScript: result.inlineExecuted ? 'executed' : 'blocked',
          inlineHandler: result.handlerExecuted ? 'executed' : 'blocked',
          stringEval: result.evalExecuted ? 'executed' : 'blocked',
          unlistedExternalScript: result.externalExecuted ? 'executed' : 'blocked',
          externalProbeRequests: test.traffic.externalProbeRequests,
          enforcingViolations: result.violations.length
        }));
      } finally { await test.context.close(); }
    }
  } finally { await browser.close(); }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
