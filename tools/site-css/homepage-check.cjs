'use strict';

// Bounded, offline acceptance checks for the three public homepages.
// Uses the same pinned browser and local-only routing as the CSS comparison;
// screenshots are evidence for review, not a softened pixel-comparison gate.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { chromium } = require('playwright');
const { openPage, settle } = require('./render-check.cjs');

const output = path.join(process.env.CSS_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-css-render'), 'homepage');
const widths = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 360, height: 800 }
];
const routeFor = (route, language) => route + (language === 'en' ? '' : language + '/');

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert.ok(dimensions.document <= dimensions.viewport, label + ': document overflow ' + JSON.stringify(dimensions));
  assert.ok(dimensions.body <= dimensions.viewport, label + ': body overflow ' + JSON.stringify(dimensions));
  return dimensions;
}

async function checkSkipLink(page) {
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.home-skip').evaluate(element => element === document.activeElement), true, 'Skip link is the first keyboard stop');
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.activeElement === document.querySelector('#main-content'));
  assert.equal(new URL(page.url()).hash, '#main-content', 'Skip link retains the native fragment destination');
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.home-actions a').first().evaluate(element => element === document.activeElement), true, 'Tab after skipping reaches the primary hero action');
  return 'native target focus and next Tab to primary action passed';
}

async function checkNavigation(page, language, viewport, name) {
  const dropdowns = page.locator('vcp-header .nav-item.dropdown');
  assert.equal(await dropdowns.count(), 5, 'Five navigation groups');
  const mobile = viewport.width <= 1024;
  const toggle = page.locator('vcp-header .nav-toggle');
  const nav = page.locator('vcp-header .nav-menu');

  if (mobile) {
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    const closed = await nav.boundingBox();
    assert.ok(closed && closed.x + closed.width <= 0, 'Closed mobile menu is outside the viewport');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.locator('vcp-header .nav-menu.active').waitFor();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
    const opened = await nav.boundingBox();
    assert.ok(opened && opened.x >= 0 && opened.x + opened.width <= viewport.width, 'Open menu fits the viewport');
  }

  for (let i = 0; i < 5; i++) {
    const group = dropdowns.nth(i);
    const button = group.locator('.dropdown-toggle');
    await button.scrollIntoViewIfNeeded();
    await button.focus();
    if (mobile) await page.keyboard.press('Enter');
    const firstLink = group.locator('.dropdown-menu a').first();
    await firstLink.waitFor({ state: 'visible' });
    await firstLink.focus();
    assert.equal(await firstLink.evaluate(element => element === document.activeElement), true, 'Group ' + (i + 1) + ' is keyboard reachable');
    if (mobile) assert.equal(await page.locator('vcp-header .dropdown.active').count(), 1, 'One mobile group expanded');
    await assertNoHorizontalOverflow(page, language + ' ' + viewport.width + ' menu ' + (i + 1));
  }

  const hrefs = await page.locator('vcp-header .dropdown-menu a').evaluateAll(links => links.map(link => link.getAttribute('href')));
  for (const route of ['/vap/', '/vcp/developers/', '/vso/announcements/', '/vso/corrections/', '/vso/policies/', '/certified/']) {
    assert.ok(hrefs.includes(routeFor(route, language)), 'Navigation keeps ' + language + ': ' + route);
  }
  const guideLanguage = language === 'ja' ? 'ja' : 'en';
  for (const route of ['/guides/', '/guides/ai-agent-audit-log/', '/guides/ai-governance/', '/guides/ai-audit-trail/']) {
    assert.ok(hrefs.includes(routeFor(route, guideLanguage)), 'Guides keep an available translation: ' + route);
  }
  assert.ok(hrefs.includes('/explorer/app/'), 'Demo retains its language-independent application URL');
  assert.ok(hrefs.includes('/vcp/specification/'), 'Specification hub keeps its available canonical URL');

  if (mobile) {
    await page.screenshot({ path: path.join(output, name + '-menu.png'), animations: 'disabled' });
    await toggle.click();
    assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(await page.locator('vcp-header .nav-menu.active').count(), 0);
    assert.equal(await page.locator('vcp-header .dropdown.active').count(), 0, 'Closing menu resets expanded groups');
  } else {
    await page.locator('#vap-home-title').click();
  }
  const languageLinks = await page.locator('vcp-header .lang-link').evaluateAll(links => links.map(link => link.getAttribute('href')));
  assert.deepEqual([...languageLinks].sort(), ['/', '/ja/', '/zh/'].sort());
  return { groups: 5, localizedLinks: hrefs.length, mobileMenu: mobile ? 'keyboard open, all groups and close passed' : 'all groups keyboard reachable' };
}

async function checkPage(browser, language, viewport) {
  const file = language === 'en' ? 'index.html' : language + '/index.html';
  const name = language + '-' + viewport.width;
  let instance;
  const result = { file, language, viewport, failures: [], screenshots: [name + '-above-fold.png', name + '-full.png'] };
  try {
    instance = await openPage(browser, file, 'homepage', false, viewport, '');
    const { page, errors } = instance;
    page.setDefaultTimeout(5000);
    await page.waitForFunction(() => document.querySelector('vcp-header .nav-menu') && document.querySelector('vcp-footer footer'));
    await settle(page);
    await page.screenshot({ path: path.join(output, name + '-above-fold.png'), animations: 'disabled' });
    await page.screenshot({ path: path.join(output, name + '-full.png'), fullPage: true, animations: 'disabled' });
    assert.equal(await page.locator('main h1').count(), 1, 'One primary heading');
    assert.equal(await page.locator('main > section').count(), 8, 'Eight homepage sections');
    result.dimensions = await assertNoHorizontalOverflow(page, language + ' ' + viewport.width + ' initial');

    const heroLinks = await page.locator('.home-actions a').evaluateAll(links => links.map(link => link.getAttribute('href')));
    assert.deepEqual(heroLinks, ['/explorer/app/', routeFor('/vcp/developers/', language)], 'Primary actions are demo and localized implementation resources');
    assert.equal(await page.locator('.section-news .news-row').count(), 3, 'Latest three announcements');
    assert.equal(await page.locator('.home-profile-table tbody tr').count(), 4, 'Four principal domain profile entries');

    result.skipLink = await checkSkipLink(page);
    result.navigation = await checkNavigation(page, language, viewport, name);
    const status = page.locator('#current-status');
    await status.scrollIntoViewIfNeeded();
    assert.equal(await status.isVisible(), true, 'Current status is visible');
    assert.equal(await status.locator('a[href="' + routeFor('/certified/', language) + '"]').isVisible(), true, 'Current certification status is linked');
    assert.equal(await status.locator('a[href="' + routeFor('/vso/corrections/', language) + '"]').isVisible(), true, 'Corrections are linked');
    const questions = page.locator('#faq details');
    await questions.first().locator('summary').click();
    assert.equal(await questions.first().getAttribute('open'), '', 'FAQ works without custom scripting');
    await assertNoHorizontalOverflow(page, language + ' ' + viewport.width + ' status');
    assert.deepEqual(errors, [], 'No JavaScript page errors');
    result.blockedOrigins = [...instance.blocked].sort();
    result.pageErrors = [...errors];
  } catch (error) {
    result.failures.push(error.message);
    if (instance) {
      result.pageErrors = [...instance.errors];
      result.blockedOrigins = [...instance.blocked].sort();
      await instance.page.screenshot({ path: path.join(output, name + '-failure.png'), animations: 'disabled' }).catch(() => {});
    }
  } finally {
    if (instance) await instance.context.close();
  }
  return result;
}

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CSS_BROWSER_PATH || undefined,
    headless: true,
    args: ['--no-sandbox', '--hide-scrollbars', '--disable-lcd-text', '--force-color-profile=srgb']
  });
  const report = {
    browser: browser.version(),
    network: 'All requests intercepted by openPage; local files only, external fonts/icons omitted.',
    scope: 'EN/JA/ZH at 1440, 390 and 360 pixels; content, routes, native skip-link focus, keyboard navigation, mobile menu, FAQ and horizontal overflow.',
    cases: []
  };
  try {
    for (const language of ['en', 'ja', 'zh']) {
      for (const viewport of widths) {
        const result = await checkPage(browser, language, viewport);
        report.cases.push(result);
        console.log((result.failures.length ? 'FAIL' : 'PASS') + ' homepage ' + language + ' ' + viewport.width + 'px' + (result.failures.length ? ': ' + result.failures.join('; ') : ''));
        fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
      }
    }
  } finally { await browser.close(); }
  const failures = report.cases.filter(result => result.failures.length);
  console.log(JSON.stringify({ cases: report.cases.length, failures: failures.length, evidence: output }));
  assert.equal(failures.length, 0, 'Homepage acceptance checks failed; inspect homepage/report.json');
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { checkPage, assertNoHorizontalOverflow, main };

