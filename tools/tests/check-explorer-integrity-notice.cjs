'use strict';
// Bounded first-party mock-UI layout checks, not WCAG/PDF or crypto certification.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { chromium } = require(process.env.PW_MODULE);

const PREFIX = '/explorer/app/';
const PUBLIC_URL = 'https://veritaschain.org/explorer/app/';
const live = process.env.VERIFY_PUBLIC === '1';
const out = path.resolve(process.env.NOTICE_EVIDENCE_DIR || 'notice-evidence');
const root = path.resolve('explorer/app');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const noticeHash = '0e125a406fddb4bbb79ba2c0a074fa2ecf2fdca4c2eacd8abe1acc17ed17a202';
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const rawNotice = source.match(/<aside id="integrity-review-2026-10-24"[\s\S]*?<\/aside>/g);
assert.equal(rawNotice?.length, 1);
assert.equal(hash(rawNotice[0]), noticeHash, 'Existing notice HTML must remain unchanged');
assert.ok(source.includes('id="explorer-integrity-notice-slot"'));
assert.ok(source.includes('id="explorer-integrity-layout"'));
fs.mkdirSync(out, { recursive: true });
const report = { status: 'failed', live, sourceCommit: process.env.GITHUB_SHA || null,
  startedAt: new Date().toISOString(), noticeHtmlSha256: noticeHash,
  indexSha256: hash(source), checks: [], errors: [],
  limits: 'First-party synthetic demo; third-party fonts blocked. Geometry/hit tests and bounded keyboard/navigation checks only, not full WCAG, PDF/UA or protocol verification.' };
let browser, context, server;

function localServer() {
  return http.createServer((req, res) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
    catch { res.writeHead(400); res.end(); return; }
    if (!pathname.startsWith(PREFIX)) { res.writeHead(404); res.end(); return; }
    const target = path.resolve(root, pathname.slice(PREFIX.length) || 'index.html');
    if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
      res.writeHead(404); res.end(); return;
    }
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
    res.setHeader('Content-Type', types[path.extname(target)] || 'application/octet-stream');
    fs.createReadStream(target).pipe(res);
  });
}

async function verifyPublicBytes() {
  const scripts = [...source.matchAll(/(?:src|href)="(\/explorer\/app\/assets\/index-[\w-]+\.(?:js|css))"/g)].map(m => m[1]);
  assert.equal(scripts.length, 2);
  const expected = [[PREFIX, Buffer.from(source)], ...scripts.map(p => [p, fs.readFileSync(path.join(root, p.slice(PREFIX.length)))])];
  const attempts = [];
  // Bounded retry for Pages propagation, retaining every observed response/error.
  for (let attempt = 1; attempt <= 6; attempt++) {
    const resources = [];
    for (const [pathname, bytes] of expected) {
      const url = new URL(pathname, PUBLIC_URL).href;
      try {
        const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(15000),
          headers: { 'Cache-Control': 'no-cache', 'Accept-Encoding': 'identity' } });
        const body = Buffer.from(await response.arrayBuffer());
        resources.push({ url, status: response.status, bytes: body.length, sha256: hash(body),
          expectedSha256: hash(bytes), matches: response.status === 200 && body.equals(bytes) });
      } catch (error) { resources.push({ url, matches: false, error: String(error) }); }
    }
    attempts.push({ attempt, at: new Date().toISOString(), resources });
    report.publicByteAttempts = attempts;
    if (resources.every(r => r.matches)) return;
    if (attempt < 6) await new Promise(resolve => setTimeout(resolve, 10000));
  }
  throw new Error('Public HTML/JS/CSS did not match checked-out source within bounded attempts');
}

async function geometry(page) {
  return page.evaluate(() => {
    const n = document.querySelector('#integrity-review-2026-10-24');
    const sidebar = document.querySelector('#root aside[aria-label="Desktop navigation"]');
    const header = document.querySelector('#root header');
    if (!n || !sidebar || !header) throw new Error('Notice and real app navigation required');
    const box = n.getBoundingClientRect(), sb = sidebar.getBoundingClientRect(), hb = header.getBoundingClientRect();
    const sidebarVisible = getComputedStyle(sidebar).display !== 'none' && sb.width > 0;
    const overlap = sidebarVisible && Math.min(box.right, sb.right) > Math.max(box.left, sb.left)
      && Math.min(box.bottom, sb.bottom) > Math.max(box.top, sb.top);
    const walker = document.createTreeWalker(n, NodeFilter.SHOW_TEXT);
    let node, total = 0;
    const hits = [];
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      for (const r of range.getClientRects()) {
        if (!r.width || !r.height) continue;
        total++;
        const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
        if (y <= hb.bottom + 1 || y >= innerHeight - 1 || x < 0 || x >= innerWidth) continue;
        const top = document.elementFromPoint(x, y);
        hits.push({ x, y, clear: !!top && (top === n || n.contains(top)) });
      }
    }
    return { left: box.left, right: box.right, top: box.top, height: box.height,
      viewport: innerWidth, sidebarVisible, sidebarRight: sb.right, headerBottom: hb.bottom,
      overlap, visibleTextRectangles: hits.length, totalTextRectangles: total,
      textClear: hits.length >= 3 && hits.every(h => h.clear) };
  });
}

(async () => {
  let url;
  if (live) { await verifyPublicBytes(); url = PUBLIC_URL; }
  else {
    server = localServer();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    url = `http://127.0.0.1:${server.address().port}${PREFIX}`;
  }
  const origin = new URL(url).origin;
  browser = await chromium.launch({ headless: true });
  report.browser = browser.version();
  context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.route('**/*', route => {
    const u = new URL(route.request().url());
    return u.origin === origin && u.pathname.startsWith(PREFIX) && route.request().method() === 'GET'
      ? route.continue() : route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20000);
  page.on('pageerror', e => report.errors.push(String(e)));
  await page.goto(url);
  const first = page.locator('a[href*="#/events/"]').first();
  await first.waitFor();
  const href = await first.getAttribute('href');
  const eventId = href.split('#/events/')[1];
  assert.match(eventId, /^[0-9a-f-]{36}$/i);
  const certUrl = url + '#/events/' + eventId + '/certificate';

  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(certUrl);
    await page.getByText('Demo data — not verified', { exact: true }).waitFor();
    await page.evaluate(() => window.scrollTo(0, 0));
    const g = await geometry(page);
    assert.ok(!g.overlap && g.left >= 0 && g.right <= width + 1 && g.top >= g.headerBottom && g.textClear, JSON.stringify(g));
    const link = page.locator('#integrity-review-2026-10-24 a');
    assert.equal(await link.getAttribute('href'), 'https://github.com/veritaschain/vap-spec/blob/9fa5fbc68075079b4599e16940e9078db976cd59/experiments/vcp-v1.2-integrity-alignment/README.md');
    // The retained notice link is the first keyboard target before React's root.
    await page.keyboard.press('Tab');
    assert.ok(await link.evaluate(a => document.activeElement === a), 'Notice link must be reachable by Tab');
    await link.scrollIntoViewIfNeeded();
    const linkHits = await link.evaluate(a => [...a.getClientRects()].map(r => {
      const x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2, top = document.elementFromPoint(x, y);
      return { x, y, clear: !!top && (top === a || a.contains(top)) };
    }));
    assert.ok(linkHits.length && linkHits.every(h => h.clear), JSON.stringify(linkHits));
    report.checks.push({ name: 'notice-and-link', width, passed: true, geometry: g, linkHits });
    if (width === 390 || width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: path.join(out, `notice-${width}.png`), fullPage: true });
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(certUrl);
  await page.getByText('Demo data — not verified', { exact: true }).waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  const override = await page.addStyleTag({ content: '#explorer-integrity-notice-slot { display:block!important; margin-inline-start:0!important; padding-inline:0!important; }' });
  const negative = await geometry(page);
  assert.ok(negative.overlap, 'Restoring prior layout must reproduce sidebar overlap');
  await override.evaluate(el => el.remove());
  await page.evaluate(() => window.scrollTo(0, 0));
  const restored = await geometry(page);
  assert.ok(!restored.overlap && restored.textClear);
  report.checks.push({ name: 'old-layout-negative-control', passed: true, negative, restored });

  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(certUrl);
  await page.getByText('Demo data — not verified', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Search Events' }).click();
  await page.getByRole('heading', { name: 'Search Events', exact: true }).waitFor();
  assert.ok(new URL(page.url()).hash.startsWith('#/search'));
  await page.goto(certUrl); await page.reload();
  await page.getByText('Demo data — not verified', { exact: true }).waitFor();
  assert.equal((await page.locator('[data-certificate-field="Event ID"] dd p').innerText()).trim(), eventId);
  report.checks.push({ name: 'mock-navigation-reload-full-id', passed: true });

  // The layout addition is screen-only: the existing print treatment is retained.
  await page.emulateMedia({ media: 'print' });
  const print = await page.evaluate(() => ({
    noticeDisplay: getComputedStyle(document.querySelector('#integrity-review-2026-10-24')).display,
    slotMargin: getComputedStyle(document.querySelector('#explorer-integrity-notice-slot')).marginInlineStart,
    slotPadding: getComputedStyle(document.querySelector('#explorer-integrity-notice-slot')).paddingInlineStart,
    certificateBackground: getComputedStyle(document.querySelector('.certificate-print-surface')).backgroundColor,
  }));
  assert.deepEqual(print, { noticeDisplay: 'none', slotMargin: '0px', slotPadding: '0px', certificateBackground: 'rgb(255, 255, 255)' });
  report.checks.push({ name: 'existing-print-style-retained', passed: true, print });
  assert.deepEqual(report.errors, []);
  report.status = 'passed';
})().catch(error => {
  report.error = String(error); console.error(error); process.exitCode = 1;
}).finally(async () => {
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  if (context) await context.close();
  if (browser) await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
});
