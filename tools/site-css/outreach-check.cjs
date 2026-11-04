'use strict';

// Checks the preserved outreach archive, not the truth of historical outreach claims.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const { openPage, settle } = require('./render-check.cjs');
const { assertNoHorizontalOverflow } = require('./homepage-check.cjs');

const root = path.resolve(__dirname, '../..');
const output = path.join(process.env.CSS_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-css-render'), 'outreach');
const sourceCommit = 'dfec3b6802b04d9f177f54169eb6000b2c175a55';
// Hashes calculated from the original homepage section at sourceCommit.
// Only spaces on otherwise blank lines were removed during relocation.
const snapshots = {
  en: { homepage: 'index.html', file: 'standardization/index.html', hash: '3d245c9b4c8d639fd3dd277397145622e71e32186f474f1d5c527054a5383c4f', label: 'Homepage snapshot · 3 November 2026' },
  ja: { homepage: 'ja/index.html', file: 'standardization/ja/index.html', hash: 'a7b3933e25c69527ba5420b0e82431c9a1db771db49f707424bfc954cf7355da', label: '旧トップページの記録 · 2026年11月3日' },
  zh: { homepage: 'zh/index.html', file: 'standardization/zh/index.html', hash: '5dc726e703fd8da9f5c745452b3b1b5e83bb7f09bde2c91d73b5604fa1f57f46', label: '旧主页记录 · 2026年11月3日' }
};

function verifySourceSnapshots() {
  return Object.entries(snapshots).map(([language, snapshot]) => {
    const html = fs.readFileSync(path.join(root, snapshot.file), 'utf8');
    const parts = html.split('<!-- Archived outreach snapshot: begin -->\n');
    assert.equal(parts.length, 2, snapshot.file + ': one archive beginning');
    const tail = parts[1].split('\n<!-- Archived outreach snapshot: end -->');
    assert.equal(tail.length, 2, snapshot.file + ': one archive end');
    const hash = crypto.createHash('sha256').update(tail[0]).digest('hex');
    assert.equal(hash, snapshot.hash, snapshot.file + ': original localized text, qualifications, cards, links and markup preserved');
    return { language, file: snapshot.file, sha256: hash, sourceCommit };
  });
}

async function checkArchive(browser, language, viewport) {
  const snapshot = snapshots[language];
  const name = language + '-' + viewport.width;
  const result = { language, file: snapshot.file, viewport, failures: [], screenshot: name + '-archive.png' };
  let instance;
  try {
    instance = await openPage(browser, snapshot.file, 'default', false, viewport, '');
    const { page, errors } = instance;
    page.setDefaultTimeout(5000);
    await page.waitForFunction(() => document.querySelector('vcp-header .nav-menu') && document.querySelector('vcp-footer footer'));
    // Keep the existing consent flow; decline locally so the evidence is unobstructed.
    const consent = page.locator('#vso-analytics-panel');
    if (await consent.isVisible()) await consent.locator('button').first().click();
    const archive = page.locator('details#regulatory-outreach');
    assert.equal(await archive.getAttribute('open'), null, 'Archive initially collapsed');
    assert.equal(await archive.getAttribute('data-source-commit'), sourceCommit);
    assert.equal(await archive.locator('.outreach-archive-date').textContent(), snapshot.label, 'Dated historical label visible while collapsed');
    result.closedDimensions = await assertNoHorizontalOverflow(page, name + ' closed');
    const summary = archive.locator(':scope > summary');
    await summary.scrollIntoViewIfNeeded();
    await summary.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('#regulatory-outreach').open);
    assert.equal(await archive.locator('time').getAttribute('datetime'), '2026-11-03');
    const sourceHref = 'https://github.com/veritaschain/vcp-site/blob/' + sourceCommit + '/' + snapshot.homepage;
    assert.equal(await archive.locator('a[href="' + sourceHref + '"]').isVisible(), true, 'Original localized source is linked');
    assert.equal(await archive.locator('img[src*="/nationalflag/"]').count(), 76, 'All 76 historical cards retained');
    assert.equal(await archive.locator('.outreach-map img').count(), 2, 'World map and European inset retained');
    const bounds = await archive.evaluate(element => ({ top: element.getBoundingClientRect().top + window.scrollY, height: element.scrollHeight }));
    // Scroll through the native expanded archive to load its lazy images.
    for (let y = bounds.top; y < bounds.top + bounds.height; y += Math.floor(viewport.height * 0.8)) {
      await page.evaluate(top => window.scrollTo(0, top), y);
      await settle(page);
    }
    await page.waitForFunction(() => [...document.querySelectorAll('#regulatory-outreach img')].every(img => img.complete && img.naturalWidth > 0));
    result.loadedImages = await archive.locator('img').count();
    result.expandedDimensions = await assertNoHorizontalOverflow(page, name + ' expanded');
    await summary.scrollIntoViewIfNeeded();
    await settle(page);
    await archive.screenshot({ path: path.join(output, result.screenshot), animations: 'disabled' });
    assert.deepEqual(errors, [], 'No JavaScript page errors');
    result.pageErrors = [...errors];
    result.blockedOrigins = [...instance.blocked].sort();
  } catch (error) {
    result.failures.push(error.message);
    if (instance) {
      result.pageErrors = [...instance.errors];
      await instance.page.screenshot({ path: path.join(output, name + '-failure.png'), animations: 'disabled' }).catch(() => {});
    }
  } finally {
    if (instance) await instance.context.close();
  }
  return result;
}

async function main() {
  const preservation = verifySourceSnapshots();
  if (process.argv.includes('--source-only')) { console.log(JSON.stringify({ preservation }, null, 2)); return; }
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined, headless: true, args: ['--no-sandbox', '--hide-scrollbars', '--disable-lcd-text', '--force-color-profile=srgb'] });
  const report = { browser: browser.version(), sourceCommit, preservation, network: 'Local-only routing; external fonts/icons omitted.', scope: 'EN/JA/ZH at 1440 and 390 pixels; historical source preservation, native details keyboard interaction, all archive images loaded and horizontal overflow.', cases: [] };
  try {
    for (const language of ['en', 'ja', 'zh']) {
      for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
        const result = await checkArchive(browser, language, viewport);
        report.cases.push(result);
        console.log((result.failures.length ? 'FAIL' : 'PASS') + ' outreach ' + language + ' ' + viewport.width + 'px' + (result.failures.length ? ': ' + result.failures.join('; ') : ''));
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
      }
    }
  } finally { await browser.close(); }
  const failures = report.cases.filter(result => result.failures.length);
  console.log(JSON.stringify({ cases: report.cases.length, failures: failures.length, evidence: output }));
  assert.equal(failures.length, 0, 'Outreach archive acceptance checks failed; inspect outreach/report.json');
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { verifySourceSnapshots, checkArchive, main };
