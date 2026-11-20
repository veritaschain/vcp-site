'use strict';

const assert = require('node:assert/strict');
const { launch, ORIGIN } = require('./browser.cjs');
const { failed, sourceDeclaration, inspect } = require('./crawl.cjs');

const policy = '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'none\'">';
const document = (body, withPolicy = true) => `<!doctype html><html><head>${withPolicy ? policy : ''}<title>Crawl regression</title></head><body>${body}</body></html>`;
const target = `${ORIGIN}/__crawl-regression/target`;
const missing = `${ORIGIN}/__crawl-regression/missing-policy`;
const violation = `${ORIGIN}/__crawl-regression/violation`;
const duplicate = `${ORIGIN}/__crawl-regression/duplicate-policy`;
const pageError = `${ORIGIN}/__crawl-regression/page-error`;
const external = 'https://external.invalid/declared';
const refresh = destination => `<meta http-equiv="refresh" content="0; url=${destination}">`;

async function main() {
  const browser = await launch();
  const session = await browser.newContext({ serviceWorkers: 'block' });
  const parserSession = await browser.newContext({ serviceWorkers: 'block' });
  await parserSession.route('**/*', route => route.abort());
  const parser = await parserSession.newPage();
  const page = await session.newPage();
  const errors = [];
  const records = [];
  page.on('pageerror', error => errors.push(error.message));
  await session.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.__cspViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI, disposition: event.disposition });
    });
  });
  let source = '';
  await session.route('**/*', async route => {
    const url = route.request().url();
    // Keep the redirect in flight past the source's load event. No network
    // requests leave this synthetic context.
    if ([target, missing, violation].includes(url)) await new Promise(resolve => setTimeout(resolve, 80));
    const body = url === target ? document('<p>Protected destination</p>')
      : url === missing ? document('<p>No policy</p>', false)
      : url === violation ? document('<script>window.unapproved = true;</script>')
      : url === duplicate ? document('<p>Duplicate policy</p>').replace(policy, policy + policy)
      : url === pageError ? document('<script>throw new Error("Page error regression probe")</script>').replace("script-src 'none'", "script-src 'unsafe-inline'")
      : url === external ? document('<p>Intercepted external destination</p>', false)
      : source;
    await route.fulfill({ contentType: 'text/html', body });
  });
  try {
    async function check(name, html, expectedFailure, expectedUrl) {
      source = html;
      errors.length = 0;
      const url = `${ORIGIN}/__crawl-regression/${name}`;
      const declaration = await sourceDeclaration(parser, source, url);
      const result = { ...await inspect(page, url, declaration), pageErrors: [...errors] };
      assert.equal(Boolean(failed(result)), expectedFailure, `${name}: ${JSON.stringify(result)}`);
      if (expectedUrl) assert.equal(result.finalUrl, expectedUrl, name);
      assert.equal(result.navigationError, null, name);
      assert.equal(result.inspectionError, null, name);
      records.push({ name, expectedFailure, ...result });
      return result;
    }
    await check('ordinary', document('<p>Protected ordinary page</p>'), false);
    await check('direct-target', document('<p>Protected direct page</p>'), false);
    await check('immediate-alias', document(refresh(target)), false, target);
    await check('source-without-policy', document(refresh(target), false), true, target);
    await check('source-with-duplicate-policy', document(refresh(target)).replace(policy, policy + policy), true, target);
    const absent = await check('destination-without-policy', document(refresh(missing)), true, missing);
    assert.equal(absent.policyCount, 0);
    const duplicated = await check('destination-duplicate-policy', document(refresh(duplicate)), true, duplicate);
    assert.equal(duplicated.policyCount, 2);
    const blocked = await check('destination-violation', document(refresh(violation)), true, violation);
    assert.ok(blocked.violations.some(item => item.directive === 'script-src-elem'));
    const scriptError = await check('destination-page-error', document(refresh(pageError)), true, pageError);
    assert.ok(scriptError.pageErrors.some(error => error.includes('Page error regression probe')));
    const allowedExternal = await check('declared-external', document(refresh(external)), false, external);
    assert.equal(allowedExternal.declaredExternalRedirect, external);
    await check('external-without-source-policy', document(refresh(external), false), true, external);

    // Controlled boundary failures that do not depend on browser timing: the
    // first evaluate is settled(), the second is the actual inspection.
    function inspectionStub(snapshot, error) {
      let evaluations = 0;
      return {
        goto: async () => {}, waitForURL: async () => {}, waitForLoadState: async () => {},
        url: () => target,
        evaluate: async () => {
          if (++evaluations === 1) return;
          if (error) throw error;
          return snapshot;
        },
        count: () => evaluations
      };
    }
    const evaluationStub = inspectionStub(null, new Error('Unknown inspection regression probe'));
    const evaluationFailure = { ...await inspect(evaluationStub, target, { policyCount: 1, target: null, immediate: false }), pageErrors: [] };
    assert.equal(evaluationFailure.navigationError, null);
    assert.match(evaluationFailure.inspectionError, /Unknown inspection regression probe/);
    assert.equal(evaluationStub.count(), 2, 'Unknown evaluation failures must not be retried');
    assert.ok(failed({ ...evaluationFailure, policyCount: 1 }), 'inspectionError alone must remain a failure');
    records.push({ name: 'inspection-only-failure', expectedFailure: true, ...evaluationFailure });
    const changedUrl = `${ORIGIN}/__crawl-regression/unexpected-after-wait`;
    const retargeted = inspectionStub({ finalUrl: changedUrl, title: 'Unexpected destination', policyCount: 1, violations: [] });
    const mismatch = { ...await inspect(retargeted, target, { policyCount: 1, target, immediate: true }), pageErrors: [] };
    assert.match(mismatch.navigationError, /Immediate refresh destination mismatch/);
    assert.equal(mismatch.inspectionError, null);
    assert.ok(failed(mismatch), 'A different local URL must fail even when both policies are present');
    records.push({ name: 'destination-changed-after-wait', expectedFailure: true, ...mismatch });

    // A terminal evaluation error must be explicit and must never resemble a
    // successful policy inspection or the old fabricated policyCount: 0 result.
    source = document('<p>Closed inspection page</p>');
    const declaration = await sourceDeclaration(parser, source, `${ORIGIN}/__crawl-regression/closed`);
    await page.close();
    const closed = { ...await inspect(page, `${ORIGIN}/__crawl-regression/closed`, declaration), pageErrors: [] };
    assert.ok(closed.inspectionError);
    assert.equal(closed.policyCount, null);
    assert.ok(failed(closed));
    records.push({ name: 'closed-inspection', expectedFailure: true, ...closed });
    console.log(JSON.stringify({ crawlRegression: 'pass', cases: records.length, records }));
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
