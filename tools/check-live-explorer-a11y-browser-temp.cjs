'use strict';
// Read-only first-party public demo smoke. No forms, uploads, API writes, or credentials.
const { chromium } = require(process.env.PW_MODULE);
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve('live-observation');
fs.mkdirSync(out, { recursive: true });
const checks = [];
const errors = [];
let browser, context;
const url = 'https://veritaschain.org/explorer/app/';

(async () => {
  browser = await chromium.launch({ headless: true });
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route('**/*', route => {
    const u = new URL(route.request().url());
    if (u.protocol === 'https:' && u.hostname === 'veritaschain.org') return route.continue();
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', e => errors.push(String(e)));

  async function check(name, fn) {
    try { await fn(); checks.push({ name, status: 'passed' }); }
    catch (e) { checks.push({ name, status: 'failed', error: String(e) }); throw e; }
  }

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await check('original public integrity-review notice preserved', async () => {
    await page.locator('#integrity-review-2026-10-24').waitFor();
  });
  await check('public header has labeled search and no inert shortcut/buttons', async () => {
    await page.getByRole('textbox', { name: 'Search events', exact: true }).waitFor();
    assert.equal(await page.locator('header kbd').count(), 0);
    assert.equal(await page.locator('header button:not([aria-controls="mobile-navigation"])').count(), 0);
  });
  const first = page.locator('a[href*="#/events/"]').first();
  await check('new hash-routed demo dashboard available at public URL', async () => {
    await first.waitFor();
    assert.equal(new URL(page.url()).pathname, '/explorer/app/');
    await page.screenshot({ path: path.join(out, 'public-dashboard.png'), fullPage: true });
  });
  await first.click();
  await page.getByRole('heading', { name: 'Event Details', exact: true }).waitFor();
  await page.getByRole('link', { name: 'Certificate', exact: true }).click();
  await check('certificate uses an unverified demo disclaimer and functional browser-print label', async () => {
    await page.getByRole('heading', { name: 'Event Certificate', exact: true }).waitFor();
    await page.getByText('Demo data — not verified', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Print / Save as PDF' }).count(), 1);
    assert.equal(await page.getByRole('button', { name: 'Download PDF' }).count(), 0);
    await page.reload();
    await page.getByText('Demo data — not verified', { exact: true }).waitFor();
    assert.equal(new URL(page.url()).pathname, '/explorer/app/');
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await check('public mobile certificate fits viewport and navigation works', async () => {
    const geom = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    assert.ok(geom.scroll <= geom.width + 1, JSON.stringify(geom));
    const btn = page.getByRole('button', { name: 'Open navigation menu' });
    await btn.click();
    const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
    assert.equal(await nav.isVisible(), true);
    await page.screenshot({ path: path.join(out, 'public-certificate-mobile.png'), fullPage: true });
  });
  await check('no runtime page exceptions', async () => assert.deepEqual(errors, []));
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({
    status:'passed',url,browser:browser.version(),checks,errors,
    limits:'Public demo smoke on first-party host, no production API or cryptographic verification; 1 Chromium session, not full accessibility review.',
  },null,2)+'\n');
})().catch(e => {
  console.error(e); process.exitCode=1;
  fs.writeFileSync(path.join(out,'browser.json'),JSON.stringify({status:'failed',error:String(e),checks,errors},null,2)+'\n');
}).finally(async () => {
  if(context) await context.close();
  if(browser) await browser.close();
});
