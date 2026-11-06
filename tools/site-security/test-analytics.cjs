'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { ORIGIN, launch, context, settled } = require('./browser.cjs');

const google = request => /(?:^|\.)(?:googletagmanager\.com|google-analytics\.com|google\.com)$/.test(new URL(request.url).hostname);

async function main() {
  const browser = await launch();
  const session = await context(browser);
  const page = await session.context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let report;
  try {
    await page.goto(`${ORIGIN}/index.html?email=fixture%40example.invalid&token=fixture&utm_source=security-test#fixture`, { waitUntil: 'load' });
    await settled(page);
    assert.equal(session.requests.filter(google).length, 0, 'No vendor request before opt-in');
    await page.getByRole('button', { name: 'Decline', exact: true }).click();
    await settled(page);
    assert.equal(session.requests.filter(google).length, 0, 'Declining must not load analytics');
    await page.locator('#vso-cookie-settings').click();
    const collection = page.waitForRequest(request => /(?:^|\.)google-analytics\.com$/.test(new URL(request.url()).hostname), { timeout: 15000 });
    await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
    await collection;
    await page.waitForLoadState('networkidle');
    const active = await page.evaluate(() => {
      const calls = (window.dataLayer || []).map(item => Array.from(item));
      return {
        calls,
        tags: [...document.scripts].filter(script => script.src.startsWith('https://www.googletagmanager.com/gtag/js')).map(script => ({ src: script.src, integrity: script.integrity })),
        disabled: window['ga-disable-G-XTK1LJKRGV'],
        violations: window.__cspViolations,
      };
    });
    assert.equal(active.tags.length, 1);
    assert.equal(active.tags[0].integrity, '', 'Live Google loader remains an explicit unpinned exception');
    assert.equal(active.disabled, false);
    const configs = active.calls.filter(call => call[0] === 'config');
    assert.equal(configs.length, 1);
    assert.equal(configs[0][2].allow_google_signals, false);
    assert.equal(configs[0][2].allow_ad_personalization_signals, false);
    assert.equal(configs[0][2].page_location, `${ORIGIN}/index.html?utm_source=security-test`);
    const consent = active.calls.filter(call => call[0] === 'consent');
    assert.equal(consent[0][2].analytics_storage, 'denied');
    for (const call of consent) {
      assert.equal(call[2].ad_storage, 'denied');
      assert.equal(call[2].ad_user_data, 'denied');
      assert.equal(call[2].ad_personalization, 'denied');
    }
    // The privacy page shares the domain consent cookie with the already open
    // homepage. Withdrawal must stop that existing page without a reload.
    const privacy = await session.context.newPage();
    privacy.on('pageerror', error => errors.push(error.message));
    await privacy.goto(`${ORIGIN}/privacy/`, { waitUntil: 'load' });
    await settled(privacy);
    assert.equal(await privacy.evaluate(() => window['ga-disable-G-XTK1LJKRGV']), false);
    const eventsBefore = await page.evaluate(() => (window.dataLayer || []).filter(item => item[0] === 'event').length);
    await privacy.locator('#vso-cookie-settings').click();
    await privacy.getByRole('button', { name: 'Decline', exact: true }).click();
    await page.waitForFunction(() => window['ga-disable-G-XTK1LJKRGV'] === true);
    await settled(page);
    const withdrawn = await page.evaluate(() => ({
      disabled: window['ga-disable-G-XTK1LJKRGV'],
      cookies: document.cookie,
      consent: (window.dataLayer || []).map(item => Array.from(item)).filter(call => call[0] === 'consent').at(-1),
      violations: window.__cspViolations,
    }));
    assert.equal(withdrawn.disabled, true);
    assert.ok(withdrawn.cookies.includes('vso_analytics_consent_v1=denied'));
    assert.ok(!/(?:^|;\s*)_ga(?:_|=)/.test(withdrawn.cookies));
    assert.equal(withdrawn.consent[2].analytics_storage, 'denied');
    assert.deepEqual(withdrawn.violations, []);
    await page.evaluate(() => {
      const link = document.createElement('a');
      link.id = 'consent-revocation-fixture';
      link.href = 'mailto:standards@veritaschain.org';
      link.textContent = 'Offline consent regression';
      link.addEventListener('click', event => event.preventDefault());
      document.body.appendChild(link);
    });
    await page.locator('#consent-revocation-fixture').click();
    assert.equal(await page.evaluate(() => (window.dataLayer || []).filter(item => item[0] === 'event').length), eventsBefore,
      'The already open homepage must not emit a custom event after withdrawal in its privacy tab');
    assert.deepEqual(await privacy.evaluate(() => window.__cspViolations), []);
    await privacy.close();
    assert.deepEqual(errors, []);
    report = {
      browser: browser.version(),
      mode: 'Offline current vendor fixture; every browser request intercepted and no analytics sent',
      preConsentRequests: 0,
      declinedRequests: 0,
      vendorScriptLoads: active.tags.length,
      vendorLoaderSRI: 'Unresolved: mutable Google-managed opt-in loader',
      advertisingConsent: 'denied',
      withdrawalDisablesAnalytics: withdrawn.disabled,
      sharedTabWithdrawalDisablesAnalytics: withdrawn.disabled,
      eventsAfterSharedTabWithdrawal: 0,
      attemptedOrigins: [...new Set(session.requests.filter(google).map(request => new URL(request.url).origin))].sort(),
      violations: withdrawn.violations,
      pageErrors: errors,
    };
  } finally {
    await session.context.close();
    await browser.close();
  }
  const output = process.env.SECURITY_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-security-evidence');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'analytics.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
