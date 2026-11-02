'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const jsQR = require('jsqr');
const { PNG } = require('../site-css/node_modules/pngjs');
const { ORIGIN, launch, context, settled } = require('./browser.cjs');

// These flows changed when runtime inline handlers/Babel were removed. All
// actions use the real controls; the shared helper intercepts every request and
// serves verified third-party script fixtures without contacting live services.
async function visibleArticles(page) {
  return page.locator('.blog-card:visible').evaluateAll(cards =>
    cards.map(card => card.querySelector('a')?.getAttribute('href') || card.textContent.trim()));
}

async function pageNumber(page, number) {
  await page.waitForFunction(number =>
    document.querySelector('#pagination button[aria-current="page"]')?.textContent.trim() === String(number), number);
}

async function blog(page) {
  const pagination = page.locator('#pagination');
  await pagination.locator('button[data-page="2"]').first().waitFor();
  await pageNumber(page, 1);
  const first = await visibleArticles(page);
  assert.equal(first.length, 9, 'Initial page displays nine articles');
  await pagination.locator('button[data-page="2"]').filter({ hasText: /^2$/ }).click();
  await pageNumber(page, 2);
  const second = await visibleArticles(page);
  assert.equal(second.length, 9, 'Second page displays nine articles');
  assert.ok(second.every(link => !first.includes(link)), 'Page two must display different articles');

  await page.locator('#blogSearchInput').fill('VCP');
  await page.waitForFunction(() => document.getElementById('searchClearBtn').classList.contains('visible'));
  await pageNumber(page, 1);
  assert.ok(await page.locator('#searchResultsInfo').isVisible(), 'Search results feedback appears');
  await pagination.locator('button[data-page="2"]').filter({ hasText: /^2$/ }).click();
  await pageNumber(page, 2);
  assert.ok((await visibleArticles(page)).length > 0, 'Pagination works after search rebuilds the controls');

  await page.locator('#searchClearBtn').click();
  await pageNumber(page, 1);
  assert.deepEqual(await visibleArticles(page), first, 'Clearing search restores the original first page');
  await pagination.locator('button[data-page="2"]').filter({ hasText: /^2$/ }).click();
  await pageNumber(page, 2);
  await pagination.locator('button').first().click();
  await pageNumber(page, 1);
  assert.deepEqual(await visibleArticles(page), first, 'Previous-page control survives repeated rerendering');
  assert.equal(await pagination.locator('[onclick],[onchange]').count(), 0, 'Generated pagination uses delegated listeners');
  return { pagination: 'pass', searchRerender: 'pass', clearAndPrevious: 'pass' };
}

async function portal(page) {
  const first = page.locator('#criteriaList .criterion-card[data-id="1"]');
  const second = page.locator('#criteriaList .criterion-card[data-id="2"]');
  await first.waitFor({ state: 'visible' });
  const title = await first.locator('h4').textContent();
  await first.locator('.criterion-header h4').click();
  assert.ok(await first.evaluate(element => element.classList.contains('expanded')), 'Clicking a nested criterion title expands the card');
  await first.locator('.score-option').nth(2).click();
  assert.ok(await first.locator('input[value="2"]').isChecked(), 'Radio input changes through the real label');
  assert.equal((await page.locator('#totalScore').textContent()).trim(), '2', 'Radio score updates the total');
  assert.match(await page.locator('#badge-1').textContent(), /2$/);

  await page.locator('#langBtn').click();
  await page.locator('.lang-option[data-lang="ja"]').click();
  await page.waitForFunction(() => document.documentElement.lang === 'ja');
  assert.notEqual(await first.locator('h4').textContent(), title, 'Language switch rebuilt translated criteria');
  assert.equal((await page.locator('#totalScore').textContent()).trim(), '2', 'Stored score survives translated rendering');
  assert.ok(await first.locator('.score-option').nth(2).evaluate(element => element.classList.contains('selected')), 'Selected-score presentation survives translated rendering');
  await first.locator('.criterion-header h4').click();
  assert.ok(await first.evaluate(element => element.classList.contains('expanded')), 'Delegated expansion works after translated rendering');
  await first.locator('.score-option').nth(1).click();
  assert.ok(await first.locator('input[value="1"]').isChecked());
  assert.equal((await page.locator('#totalScore').textContent()).trim(), '1', 'Changing a translated radio replaces the previous score');
  await second.locator('.criterion-header h4').click();
  await second.locator('.score-option').nth(2).click();
  assert.equal((await page.locator('#totalScore').textContent()).trim(), '3', 'A second criterion contributes to the total');
  assert.equal((await page.locator('#mobileScore').textContent()).trim(), '3', 'Desktop and mobile totals agree');
  assert.equal(await page.locator('#criteriaList [onclick],#criteriaList [onchange]').count(), 0, 'Generated criteria use delegated listeners');
  return { nestedExpansion: 'pass', radioScoring: 'pass', translatedRerender: 'pass', totalScore: 3 };
}

async function downloadJSON(download) {
  assert.equal(await download.failure(), null, 'Local certificate download must succeed');
  const stream = await download.createReadStream();
  assert.ok(stream, 'Downloaded certificate must be readable');
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function vcc(page) {
  const create = page.getByRole('button', { name: '+ Create Single Event', exact: true });
  await create.waitFor({ state: 'visible' });
  const runtime = await page.evaluate(() => ({
    react: window.React?.version, babel: typeof window.Babel,
    runtimeBabelTags: document.querySelectorAll('script[type="text/babel"]').length,
    qrAPI: ['create', 'toCanvas', 'toDataURL', 'toString'].every(name => typeof window.QRCode?.[name] === 'function')
  }));
  assert.equal(runtime.react, '18.3.1');
  assert.equal(runtime.babel, 'undefined', 'Babel must run only at build time');
  assert.equal(runtime.runtimeBabelTags, 0);
  assert.equal(runtime.qrAPI, true, 'Pinned QR bundle preserves the original browser API');
  const anchor = page.getByRole('button', { name: /Create Merkle Anchor/ });
  assert.equal(await anchor.isEnabled(), false, 'Fresh context starts with no pending events');
  await create.click();
  await page.waitForFunction(() => [...document.querySelectorAll('main button')].some(button =>
    button.textContent.includes('Create Merkle Anchor') && !button.disabled && button.textContent.includes('1 pending')));
  assert.equal(await page.locator('main tbody tr').count(), 1, 'Actual UI creates one event');
  await anchor.click();
  await page.waitForFunction(() => document.querySelector('main tbody tr')?.textContent.includes('ANCHORED'));

  await page.locator('#root nav').getByRole('button', { name: 'Verify', exact: true }).click();
  const select = page.locator('#root main select');
  assert.equal(await select.locator('option').count(), 2, 'Only the created anchored event is selectable');
  const eventId = await select.locator('option').nth(1).getAttribute('value');
  await select.selectOption(eventId);
  await page.getByText('VERIFICATION PASSED', { exact: true }).waitFor({ state: 'visible' });
  const visible = await page.locator('#root main').evaluate(root => Object.fromEntries(
    [...root.querySelectorAll('strong')].map(label => [
      label.textContent.trim().replace(/:$/, ''), label.parentElement.textContent.slice(label.textContent.length).trim()
    ])));
  const [download] = await Promise.all([
    page.waitForEvent('download'), page.getByRole('button', { name: 'Export Certificate', exact: true }).click()
  ]);
  const certificate = await downloadJSON(download);
  assert.equal(certificate.event_id, eventId);
  assert.equal(certificate.certificate_id, visible['Certificate ID']);
  assert.equal(certificate.event_hash, visible['Event Hash']);
  assert.equal(certificate.merkle_root, visible['Merkle Root']);
  assert.equal(certificate.verification_method, visible['Verification Method']);
  assert.equal(certificate.verified_at, visible['Verified At']);
  assert.equal(certificate.verification_method, 'RFC6962_MERKLE');
  assert.match(certificate.event_hash, /^[a-f0-9]{64}$/);
  assert.match(certificate.merkle_root, /^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(certificate.merkle_proof));
  assert.ok(Number.isFinite(Date.parse(certificate.verified_at)));

  const payload = JSON.stringify(certificate);
  const modules = await page.evaluate(payload => QRCode.create(payload).modules.size, payload);
  const destination = process.env.SECURITY_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-security-evidence');
  fs.mkdirSync(destination, { recursive: true });
  const qrViewports = [];
  for (const width of [1440, 390, 320]) {
    // Open the real modal at each size so its sizing logic observes the actual
    // available space; no test code changes the canvas or re-encodes its data.
    await page.setViewportSize({ width, height: 900 });
    await page.getByRole('button', { name: 'Show QR', exact: true }).click();
    await page.getByRole('heading', { name: 'Certificate QR Code', exact: true }).waitFor({ state: 'visible' });
    const canvas = page.locator('#root canvas');
    await page.waitForFunction(() => {
      const canvas = document.querySelector('#root canvas');
      return canvas && canvas.width === canvas.height && canvas.width > 0;
    });
    await settled(page);
    const pixels = await canvas.evaluate(canvas => {
      const box = canvas.getBoundingClientRect();
      const modal = canvas.closest('.max-w-lg').getBoundingClientRect();
      return {
        width: canvas.width, height: canvas.height,
        rgba: Array.from(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data),
        box: { x: box.x, y: box.y, width: box.width, height: box.height },
        modal: { x: modal.x, y: modal.y, width: modal.width, height: modal.height }
      };
    });
    const screenshot = await canvas.screenshot();
    fs.writeFileSync(path.join(destination, `vcc-qr-${width}.png`), screenshot);
    const painted = PNG.sync.read(screenshot);
    const nativeDecoded = jsQR(Uint8ClampedArray.from(pixels.rgba), pixels.width, pixels.height, { inversionAttempts: 'dontInvert' });
    const paintedDecoded = jsQR(Uint8ClampedArray.from(painted.data), painted.width, painted.height, { inversionAttempts: 'dontInvert' });
    assert.equal(pixels.width % (modules + 8), 0, `QR modules must use integer pixels at viewport ${width}`);
    assert.ok(pixels.width / (modules + 8) <= 4, 'QR scale remains capped for the existing modal');
    assert.ok(Math.abs(pixels.box.width - pixels.box.height) < 1, `Visible QR must retain its square aspect ratio at ${width}`);
    assert.ok(pixels.box.x >= 0 && pixels.box.x + pixels.box.width <= width, `Visible QR must fit viewport ${width}`);
    assert.ok(pixels.box.x >= pixels.modal.x && pixels.box.x + pixels.box.width <= pixels.modal.x + pixels.modal.width, `Visible QR must fit its modal at ${width}`);
    assert.ok(nativeDecoded, `Independent jsQR must decode the real canvas pixels at viewport ${width}`);
    assert.ok(paintedDecoded, `Independent jsQR must decode the actual rendered screenshot at viewport ${width}`);
    assert.deepEqual(JSON.parse(nativeDecoded.data), certificate, 'Canvas QR must equal the exported certificate and visible fields');
    assert.deepEqual(JSON.parse(paintedDecoded.data), certificate, 'Visible QR screenshot must contain the same complete certificate');
    qrViewports.push({ viewport: width, moduleScale: pixels.width / (modules + 8), canvas: pixels.width, painted: [painted.width, painted.height], decoded: true });
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    assert.equal(await canvas.count(), 0, 'QR modal closes normally');
  }
  return { react: runtime.react, runtimeBabel: 'absent', eventAnchorVerify: 'pass', qrRoundtrip: 'pass', qrModules: modules, qrViewports, certificateBytes: Buffer.byteLength(payload) };
}

async function main() {
  const browser = await launch();
  const report = { browser: browser.version(), mode: 'Offline focused CSP interaction checks', cases: [] };
  try {
    const allCases = [
      ['blog/index.html', blog], ['blog/ja/index.html', blog], ['blog/zh/index.html', blog],
      ['vap/at/vap-at-portal/index.html#assessment', portal], ['vcc/demo/index.html', vcc]
    ];
    const cases = process.env.SECURITY_TEST_FILTER
      ? allCases.filter(([file]) => file.includes(process.env.SECURITY_TEST_FILTER)) : allCases;
    assert.ok(cases.length > 0, 'Interaction filter must select at least one case');
    for (const [file, test] of cases) {
      const session = await context(browser, { locale: 'en-US' });
      const page = await session.context.newPage();
      page.setDefaultTimeout(15_000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const result = { file, passed: false };
      try {
        await page.goto(`${ORIGIN}/${file}`, { waitUntil: 'load' });
        await settled(page);
        Object.assign(result, await test(page));
        await settled(page);
        result.violations = await page.evaluate(() => window.__cspViolations);
        assert.deepEqual(result.violations, [], `CSP must allow the existing interaction: ${file}`);
        assert.deepEqual(errors, [], `No JavaScript errors: ${file}`);
        result.passed = true;
      } catch (error) {
        result.error = error.message;
        result.violations = await page.evaluate(() => window.__cspViolations || []).catch(() => []);
      } finally {
        result.pageErrors = errors;
        report.cases.push(result);
        console.log(JSON.stringify(result));
        await session.context.close();
      }
    }
  } finally {
    await browser.close();
    const destination = process.env.SECURITY_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-security-evidence');
    fs.mkdirSync(destination, { recursive: true });
    fs.writeFileSync(path.join(destination, 'interactions.json'), JSON.stringify(report, null, 2) + '\n');
  }
  assert.equal(report.cases.filter(test => !test.passed).length, 0, 'Inspect interactions.json for a failed flow');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
