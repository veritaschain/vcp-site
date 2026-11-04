'use strict';

// Offline browser comparison of the shared, scoped CSS against each page's
// original standalone Tailwind configuration compiled with the same pinned v3
// compiler. This is not a capture of the unversioned production Play CDN.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const { ROOT, ASSET, LINK, read, sha256, manifest, compileTheme, compact } = require('./lib.cjs');

const OUTPUT = process.env.CSS_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-css-render');
const ORIGIN = 'https://site.test';
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const FIXTURES = new Map([
  ['https://unpkg.com/react@18.3.1/umd/react.production.min.js', path.join(__dirname, 'node_modules/react/umd/react.production.min.js')],
  ['https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js', path.join(__dirname, 'node_modules/react-dom/umd/react-dom.production.min.js')],
  ['https://unpkg.com/@babel/standalone@8.1.0/babel.min.js', path.join(__dirname, 'node_modules/@babel/standalone/babel.min.js')]
]);

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

// This function runs in the page. Native lazy images must be requested before
// a full-page capture; waiting only for already-complete images misses them.
async function prepareDocumentImages(timeoutMs) {
  return Promise.all([...document.images].filter(img => img.currentSrc || img.getAttribute('src') || img.getAttribute('srcset')).map(async (img, index) => {
    const loading = img.getAttribute('loading');
    let timer, onLoad, onError, phase = 'load';
    try {
      const loaded = new Promise(resolve => {
        onLoad = () => resolve(img.naturalWidth > 0);
        onError = () => resolve(false);
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        if (img.complete) onLoad();
        else if (img.loading === 'lazy') img.loading = 'eager';
      });
      const ready = loaded.then(async success => {
        if (!success) return { status: 'error', phase, error: 'Image load failed' };
        phase = 'decode';
        try {
          await img.decode();
          return { status: 'decoded' };
        } catch (error) { return { status: 'error', phase, error: error.message }; }
      });
      const result = await Promise.race([ready, new Promise(resolve => {
        timer = setTimeout(() => resolve({ status: 'timeout', phase, timeoutMs }), timeoutMs);
      })]);
      return { index, src: img.getAttribute('src'), currentSrc: img.currentSrc, loading,
        complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight, ...result };
    } finally {
      clearTimeout(timer);
      img.removeEventListener('load', onLoad);
      img.removeEventListener('error', onError);
      if (loading === null) img.removeAttribute('loading');
      else img.setAttribute('loading', loading);
    }
  }));
}

async function waitForImages(page) {
  const images = await page.evaluate(prepareDocumentImages, 10000);
  if (images.some(img => img.status === 'timeout')) {
    const error = new Error('Image load/decode timed out before full-page capture');
    error.imagePreparation = images;
    throw error;
  }
  return images;
}

// A full-page screenshot expands the capture beyond the visible viewport, but
// that does not guarantee that offscreen composited layers have been painted.
// Visit the backdrop-filter surfaces in a real viewport first, then restore
// the requested position. Other page regions need no extra raster passes.
// No page styles or comparison tolerances are changed.
async function paintDocument(page) {
  const original = await page.evaluate(() => ({ x: scrollX, y: scrollY }));
  try {
    const images = await waitForImages(page);
    const positions = await page.evaluate(() => {
      const stops = new Set();
      const step = Math.max(1, innerHeight - 128);
      for (const element of [document.body, ...document.body.querySelectorAll('*')]) {
        const style = getComputedStyle(element);
        const filter = style.backdropFilter || style.webkitBackdropFilter;
        if (!filter || filter === 'none' || style.visibility !== 'visible') continue;
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const top = Math.max(0, Math.floor(rect.top + scrollY - 64));
        const bottom = rect.bottom + scrollY;
        for (let y = top; y < bottom; y += step) stops.add(y);
      }
      return [...stops].sort((a, b) => a - b);
    });
    for (const y of positions) {
      await page.evaluate(top => scrollTo(0, top), y);
      await settle(page);
      await page.screenshot({ animations: 'disabled' });
    }
    return images;
  } finally {
    await page.evaluate(({ x, y }) => scrollTo(x, y), original);
    await settle(page);
  }
}

async function snapshot(page) {
  return page.evaluate(() => {
    const props = ['display', 'position', 'visibility', 'opacity', 'color', 'backgroundColor', 'backgroundImage',
      'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'textAlign', 'textDecorationLine',
      'width', 'height', 'maxWidth', 'minHeight', 'boxSizing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
      'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'gap', 'gridTemplateColumns', 'alignItems', 'justifyContent',
      'borderTopWidth', 'borderTopColor', 'borderTopStyle', 'borderRadius', 'boxShadow', 'transform', 'overflowX', 'overflowY', 'zIndex',
      'backdropFilter', 'webkitBackdropFilter', 'filter', 'clip', 'clipPath', 'maskImage', 'maskComposite',
      'contain', 'contentVisibility', 'willChange', 'isolation', 'mixBlendMode', 'backfaceVisibility', 'perspective'];
    return [document.documentElement, document.body, ...document.body.querySelectorAll('*')]
      .filter(el => !['SCRIPT', 'STYLE', 'LINK', 'META'].includes(el.tagName))
      .map(el => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return { tag: el.tagName, id: el.id, class: typeof el.className === 'string' ? el.className : el.getAttribute('class'),
          rect: [rect.x, rect.y, rect.width, rect.height].map(value => Math.round(value * 100) / 100),
          style: Object.fromEntries(props.map(prop => [prop, style[prop]])),
          before: { content: getComputedStyle(el, '::before').content, color: getComputedStyle(el, '::before').color },
          after: { content: getComputedStyle(el, '::after').content, color: getComputedStyle(el, '::after').color } };
      });
  });
}

function comparePixels(a, b) {
  if (a.equals(b)) return { exact: true, changedPixels: 0, aboveTolerancePixels: 0, maxChannelDelta: 0, aboveTolerancePoints: [] };
  const first = PNG.sync.read(a);
  const second = PNG.sync.read(b);
  if (first.width !== second.width || first.height !== second.height) return { exact: false, aboveTolerancePixels: Infinity, dimensionsDiffer: true };
  let changedPixels = 0;
  let aboveTolerancePixels = 0;
  let maxChannelDelta = 0;
  const aboveTolerancePoints = [];
  for (let i = 0; i < first.data.length; i += 4) {
    let delta = 0;
    for (let channel = 0; channel < 4; channel++) delta = Math.max(delta, Math.abs(first.data[i + channel] - second.data[i + channel]));
    if (delta) changedPixels++;
    if (delta > 1) {
      aboveTolerancePixels++;
      aboveTolerancePoints.push({ x: (i / 4) % first.width, y: Math.floor(i / 4 / first.width), maxChannelDelta: delta });
    }
    maxChannelDelta = Math.max(maxChannelDelta, delta);
  }
  return { exact: false, changedPixels, aboveTolerancePixels, maxChannelDelta, aboveTolerancePoints };
}

async function languageCornerGeometry(page) {
  return page.evaluate(() => {
    // The observed full-page control uses a 1:1 pixel grid at the initial scroll
    // position. Do not generalize the allowance to scrolled or scaled captures.
    if (window.devicePixelRatio !== 1 || window.scrollX || window.scrollY) return { regions: [], targets: [] };
    const regions = [];
    const targets = [];
    for (const element of document.querySelectorAll('vcp-header .language-switcher, vcp-header .language-switcher .lang-link.active')) {
      const style = getComputedStyle(element), rect = element.getBoundingClientRect();
      if (style.visibility !== 'visible' || !rect.width || !rect.height) continue;
      targets.push({ class: element.className, rect: [rect.x, rect.y, rect.width, rect.height], computed: Object.fromEntries([...style].map(name => [name, style.getPropertyValue(name)])) });
      if (!element.classList.contains('lang-link')) continue;
      for (const [property, right, bottom] of [
        ['borderTopLeftRadius', false, false], ['borderTopRightRadius', true, false],
        ['borderBottomLeftRadius', false, true], ['borderBottomRightRadius', true, true]
      ]) {
        const radius = Math.min(parseFloat(style[property]) || 0, rect.width / 2, rect.height / 2);
        if (!radius) continue;
        const x = right ? rect.right - radius : rect.left;
        const y = bottom ? rect.bottom - radius : rect.top;
        regions.push({ x: Math.floor(x), y: Math.floor(y), right: Math.ceil(x + radius), bottom: Math.ceil(y + radius) });
      }
    }
    return { regions, targets };
  });
}

function pixelSummary(comparison) {
  const { aboveTolerancePoints = [], ...summary } = comparison;
  let bounds = null;
  for (const { x, y } of aboveTolerancePoints) {
    if (!bounds) bounds = { left: x, top: y, right: x, bottom: y };
    else {
      bounds.left = Math.min(bounds.left, x); bounds.top = Math.min(bounds.top, y);
      bounds.right = Math.max(bounds.right, x); bounds.bottom = Math.max(bounds.bottom, y);
    }
  }
  return { ...summary, aboveToleranceBounds: bounds };
}

function saveScreenshotFailure(prefix, metadata, previous, current, comparison) {
  fs.mkdirSync(path.dirname(prefix), { recursive: true });
  fs.writeFileSync(`${prefix}-previous.png`, previous);
  fs.writeFileSync(`${prefix}-current.png`, current);
  fs.writeFileSync(`${prefix}.json`, JSON.stringify({ ...metadata, pixels: pixelSummary(comparison),
    screenshots: { previous: { file: path.basename(`${prefix}-previous.png`), sha256: sha256(previous) },
      current: { file: path.basename(`${prefix}-current.png`), sha256: sha256(current) } } }, null, 2) + '\n');
}

async function stableScreenshot(page, evidence) {
  let previous = await page.screenshot({ fullPage: true, animations: 'disabled' });
  let penultimate, comparison;
  for (let attempt = 0; attempt < 3; attempt++) {
    await settle(page);
    const current = await page.screenshot({ fullPage: true, animations: 'disabled' });
    comparison = comparePixels(previous, current);
    if (comparison.aboveTolerancePixels === 0) return current;
    penultimate = previous;
    previous = current;
  }
  const dom = await snapshot(page).catch(error => ({ error: error.message }));
  const images = await page.evaluate(() => [...document.images].map(img => ({
    src: img.getAttribute('src'), currentSrc: img.currentSrc, loading: img.getAttribute('loading'),
    complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight,
    rect: img.getBoundingClientRect().toJSON(),
  }))).catch(error => ({ error: error.message }));
  const prefix = path.join(OUTPUT, `${evidence.name}-${evidence.side}-unstable`);
  saveScreenshotFailure(prefix, { ...evidence, captures: 4, comparisons: 3, dom, images }, penultimate, previous, comparison);
  throw new Error(`Full-page screenshot did not stabilize across repeated paints: ${evidence.name} ${evidence.side}; evidence: ${prefix}.json`);
}

async function openPage(browser, file, id, reference, viewport, baselineCss) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', serviceWorkers: 'block', locale: 'en-US', timezoneId: 'UTC' });
  const page = await context.newPage();
  const errors = [];
  const blocked = new Set();
  page.on('pageerror', error => errors.push(error.message));
  await page.clock.setFixedTime(new Date('2026-11-02T12:00:00Z'));
  await page.addInitScript(() => {
    let seed = 123456789;
    Math.random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 4294967296);
    let uuid = 0;
    Object.defineProperty(crypto, 'randomUUID', { value: () => `00000000-0000-4000-8000-${(++uuid).toString().padStart(12, '0')}` });
  });
  await page.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() !== 'GET') { blocked.add(`${request.method()} ${url.origin}`); return route.abort(); }
    if (FIXTURES.has(url.href)) return route.fulfill({ contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(FIXTURES.get(url.href)) });
    if (![ORIGIN, 'https://veritaschain.org'].includes(url.origin)) {
      blocked.add(url.origin);
      return route.fulfill({ contentType: request.resourceType() === 'stylesheet' ? 'text/css' : 'text/plain', body: '' });
    }
    if (url.pathname === `/__reference-${id}.css`) return route.fulfill({ contentType: 'text/css', body: baselineCss });
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const absolute = path.resolve(ROOT, relative);
    if (!absolute.startsWith(ROOT + path.sep) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) return route.fulfill({ status: 404, body: 'Local test asset missing' });
    let body = fs.readFileSync(absolute);
    if (relative === file) {
      body = body.toString();
      if (reference) body = body.replace(LINK, `<link rel="stylesheet" href="/__reference-${id}.css">`).replace(/ data-tw-theme="[^"]+"/, '');
      else if (process.env.CSS_NEGATIVE_CONTROL === '1') body = body.replace(/ data-tw-theme="[^"]+"/, ' data-tw-theme="default"');
      body = body.replace('</head>', '<style id="css-render-freeze">*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important;caret-color:transparent!important}</style></head>');
    }
    return route.fulfill({ contentType: TYPE[path.extname(relative)] || 'application/octet-stream', body });
  });
  await page.goto(`${ORIGIN}/${file}`, { waitUntil: 'load' });
  if (file === 'vcc/demo/index.html') await page.getByRole('button', { name: /Dark Mode/ }).waitFor();
  await settle(page);
  return { context, page, errors, blocked };
}

function withinRasterNoiseBudget(pixelComparison, differences, referenceErrors, compiledErrors, regions = [], targetStylesEqual = false) {
  // A fixed five-pair standalone-vs-standalone control reproduced the exact
  // active-language-link corner pixel (max channel delta 5) with identical CSS,
  // geometry and every computed property. Keep a tiny explicit budget, never
  // a percentage-based allowance, and preserve all raw pixel differences.
  const corners = pixelComparison.aboveTolerancePoints?.map(point => regions.findIndex(region => point.x >= region.x && point.x < region.right && point.y >= region.y && point.y < region.bottom)) || [];
  return !pixelComparison.dimensionsDiffer && pixelComparison.aboveTolerancePixels > 0 &&
    pixelComparison.aboveTolerancePixels <= 4 && pixelComparison.maxChannelDelta <= 5 &&
    differences === 0 && referenceErrors.length === 0 && compiledErrors.length === 0 && targetStylesEqual &&
    regions.length === 4 &&
    pixelComparison.aboveTolerancePoints?.length === pixelComparison.aboveTolerancePixels &&
    corners.every(corner => corner >= 0) && new Set(corners).size === corners.length;
}

async function compare(browser, entry, referenceCss) {
  const { file, id, state, viewport } = entry;
  const instances = [];
  const name = `${id}-${file.replace(/\/index\.html$/, '').replace(/[^a-z0-9]+/gi, '-')}-${viewport.width}-${state || 'initial'}`;
  try {
    for (const reference of [true, false]) {
      const instance = await openPage(browser, file, id, reference, viewport, referenceCss.get(file));
      instance.side = reference ? 'reference' : 'compiled';
      instances.push(instance);
      instance.imagePreparation = await paintDocument(instance.page);
      if (entry.action) {
        await entry.action(instance.page);
        instance.imagePreparation = await waitForImages(instance.page);
      }
      await settle(instance.page);
      instance.png = await stableScreenshot(instance.page, { name, file, theme: id, viewport,
        state: state || 'initial', side: instance.side, imagePreparation: instance.imagePreparation });
      await settle(instance.page);
      instance.snapshot = await snapshot(instance.page);
      instance.languageCorners = await languageCornerGeometry(instance.page);
      fs.writeFileSync(path.join(OUTPUT, `${name}-${reference ? 'reference' : 'compiled'}.png`), instance.png);
    }
    const [a, b] = instances;
    const differences = [];
    for (let i = 0; i < Math.max(a.snapshot.length, b.snapshot.length); i++) {
      if (JSON.stringify(a.snapshot[i]) !== JSON.stringify(b.snapshot[i])) differences.push({ index: i, reference: a.snapshot[i], compiled: b.snapshot[i] });
    }
    const pixelComparison = comparePixels(a.png, b.png);
    const pixelsEqual = pixelComparison.aboveTolerancePixels === 0;
    const errorsEqual = JSON.stringify(a.errors) === JSON.stringify(b.errors);
    const languageCornerStylesEqual = JSON.stringify(a.languageCorners) === JSON.stringify(b.languageCorners);
    const rasterNoiseAllowance = withinRasterNoiseBudget(pixelComparison, differences.length, a.errors, b.errors, a.languageCorners.regions, languageCornerStylesEqual);
    if (differences.length || !pixelsEqual || !errorsEqual) fs.writeFileSync(path.join(OUTPUT, `${name}-differences.json`), JSON.stringify({ differences, referenceErrors: a.errors, compiledErrors: b.errors, pixelsEqual }, null, 2));
    return { file, theme: id, viewport, state: state || 'initial', elements: a.snapshot.length, differences: differences.length, pixelsEqual, rasterNoiseAllowance, pixelComparison, errorsEqual,
      languageCornerRegions: a.languageCorners.regions, languageCornerStylesEqual, languageCornerStyleSha256: sha256(JSON.stringify(a.languageCorners.targets)),
      referenceScreenshotSha256: sha256(a.png), compiledScreenshotSha256: sha256(b.png), existingPageErrors: a.errors,
      imageErrors: { reference: a.imagePreparation.filter(img => img.status === 'error'), compiled: b.imagePreparation.filter(img => img.status === 'error') },
      blockedOrigins: [...new Set([...a.blocked, ...b.blocked])].sort(), evidence: name };
  } catch (error) {
    if (error.imagePreparation) {
      const instance = instances.at(-1);
      const dom = await snapshot(instance.page).catch(caught => ({ error: caught.message }));
      fs.writeFileSync(path.join(OUTPUT, `${name}-${instance.side}-image-timeout.json`), JSON.stringify({
        file, theme: id, viewport, state: state || 'initial', side: instance.side,
        error: error.message, imagePreparation: error.imagePreparation, dom,
      }, null, 2) + '\n');
    }
    throw error;
  } finally { for (const instance of instances) await instance.context.close(); }
}

async function main() {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const man = manifest();
  const referenceCss = new Map();
  const themesByFile = new Map();
  const cases = [];
  const widths = [{ width: 1440, height: 900 }, { width: 390, height: 844 }];
  for (const [id, theme] of Object.entries(man.themes)) {
    for (const file of theme.pages) themesByFile.set(file, id);
    const file = theme.pages.filter(file => file.endsWith('.html')).sort((a, b) => a.split('/').length - b.split('/').length || a.localeCompare(b))[0];
    for (const viewport of widths) cases.push({ file, id, viewport });
  }
  for (const file of [
    'blog/index.html', 'blog/ja/index.html', 'blog/zh/index.html',
    'certified/faq/index.html', 'certified/faq/ja/index.html', 'certified/faq/zh/index.html',
    'blog/posts/2026-01-18-algorithmic-trading-crisis-2025/index.html',
    'blog/posts/2026-01-18-crypto-shredding-gdpr-mifid-ii-reconciliation/index.html',
    'blog/posts/2026-01-17-vcp-v1-1-regulatory-compliance-solutions/index.html',
    'docs/brokers/index.html', 'docs/brokers/ja/index.html', 'docs/brokers/zh/index.html',
    'law/index.html', 'law/ja/index.html', 'law/zh/index.html', 'press/index.html'
  ]) {
    const id = themesByFile.get(file);
    if (!id) throw new Error(`Dynamic test page has no theme: ${file}`);
    for (const viewport of widths) cases.push({ file, id, viewport });
    if (file.startsWith('certified/faq/')) cases.push({ file, id, viewport: widths[1], state: 'faq-open', action: async page => {
      await page.locator('button[onclick="toggleFAQ(this)"]').first().click();
      await page.locator('.faq-answer.active').waitFor({ state: 'visible' });
    } });
    if (/^blog\/(?:ja\/|zh\/)?index\.html$/.test(file)) cases.push({ file, id, viewport: widths[1], state: 'search', action: async page => {
      const input = page.locator('#blogSearchInput');
      // Native spelling annotations depend on runner dictionaries and paint
      // timing, not site CSS. Disable them only in this test's typed input.
      await input.evaluate(element => { element.spellcheck = false; });
      await input.fill('VCP');
      // Filtering is debounced; the input echo and Enter do not prove it ran.
      await page.waitForFunction(() => {
        const feedback = document.getElementById('searchResultsInfo');
        return document.getElementById('searchClearBtn').classList.contains('visible') &&
          feedback.classList.contains('visible') && feedback.textContent.toLowerCase().includes('vcp') &&
          document.querySelector('#pagination button[aria-current="page"]')?.textContent.trim() === '1';
      });
    } });
  }
  cases.push({ file: 'propfirms/index.html', id: themesByFile.get('propfirms/index.html'), viewport: widths[1], state: 'menu-open', action: async page => {
    await page.locator('vcp-header .nav-toggle').click();
    await page.locator('vcp-header .nav-menu.active').waitFor({ state: 'visible' });
  } });
  cases.push({ file: 'solutions/exchanges/index.html', id: themesByFile.get('solutions/exchanges/index.html'), viewport: widths[0], state: 'scroll-button', action: async page => {
    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForFunction(() => [...document.querySelectorAll('button')].some(el => el.classList.contains('bg-vcp-primary') && getComputedStyle(el).opacity === '1'));
  } });
  for (const viewport of widths) for (const state of ['dark', 'events']) cases.push({ file: 'vcc/demo/index.html', id: themesByFile.get('vcc/demo/index.html'), viewport, state, action: async page => {
    await page.getByRole('button', { name: /Dark Mode/ }).click();
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    assert.equal(await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(17, 24, 39)');
    if (state === 'events') await page.locator('nav button').nth(1).click();
  } });

  const negativeControl = process.env.CSS_NEGATIVE_CONTROL === '1';
  const selected = negativeControl ? cases.filter(test => test.file === 'propfirms/index.html' && test.viewport.width === 1440 && !test.state)
    : process.env.CSS_TEST_FILTER ? cases.filter(test => process.env.CSS_TEST_FILTER.split(',').some(part => `${test.file}:${test.state || 'initial'}`.includes(part))) : cases;
  for (const { file, id } of selected) {
    if (!referenceCss.has(file)) referenceCss.set(file, compact(await compileTheme({ ...man.themes[id], pages: [file] })));
  }
  // Overlay-scrollbar fade and LCD text rasterization vary with paint timing,
  // independently of layout. Disable those browser effects, not page styling.
  const browserArgs = ['--no-sandbox', '--hide-scrollbars', '--disable-lcd-text', '--force-color-profile=srgb'];
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined, headless: true, args: browserArgs });
  const report = { baseline: 'Original per-page configurations compiled independently by pinned Tailwind 3.4.17; no captured production CDN bytes', capturedFromCommit: man.capturedFromCommit,
    cssSha256: sha256(read(ASSET)), browser: browser.version(), browserArgs, negativeControl, pixelTolerance: 'Base: maximum 1 of 255 per channel. Proven same-CSS raster-noise allowance: at most 1 pixel per distinct active-language-link rounded corner (4 total), maximum channel delta 5, with identical dimensions/geometry/all target styles and zero JavaScript errors. Raw counts and allowance use retained.', externalRequests: 'All network intercepted; local resources and exact pinned React fixtures only. External fonts/icons omitted equally.', cases: [] };
  try {
    for (const entry of selected) {
      const result = await compare(browser, entry, referenceCss);
      report.cases.push(result);
      console.log(`${result.differences || (!result.pixelsEqual && !result.rasterNoiseAllowance) || !result.errorsEqual ? 'FAIL' : 'PASS'} ${entry.file} ${entry.viewport.width}px ${entry.state || 'initial'} (${result.elements} elements)${result.rasterNoiseAllowance ? ' [documented raster-noise allowance]' : ''}`);
      fs.writeFileSync(path.join(OUTPUT, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    }
  } finally { await browser.close(); }
  const failures = report.cases.filter(result => result.differences || (!result.pixelsEqual && !result.rasterNoiseAllowance) || !result.errorsEqual);
  console.log(JSON.stringify({ cases: report.cases.length, failures: failures.length, rasterNoiseAllowances: report.cases.filter(result => result.rasterNoiseAllowance).length, evidence: OUTPUT }));
  if (negativeControl) assert.equal(failures.length, 1, 'The deliberately wrong propfirms theme must be detected');
  else assert.equal(failures.length, 0, 'Rendered CSS differs from standalone theme baseline; inspect report.json');
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { openPage, snapshot, settle, paintDocument, comparePixels, withinRasterNoiseBudget, languageCornerGeometry,
  prepareDocumentImages, waitForImages, pixelSummary, saveScreenshotFailure, stableScreenshot, main };
