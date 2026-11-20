'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { ROOT, ORIGIN, launch, context, settled } = require('./browser.cjs');

function failed(page) {
  return page.navigationError || page.inspectionError || page.sourcePolicyCount !== 1 || (page.policyCount !== 1 && !page.declaredExternalRedirect) || page.violations.length || page.pageErrors.length;
}

async function sourceDeclaration(parser, source, base) {
  return parser.evaluate(({ source, base }) => {
    const document = new DOMParser().parseFromString(source, 'text/html');
    const meta = [...document.querySelectorAll('meta[http-equiv]')];
    const policies = meta.filter(tag => tag.httpEquiv.toLowerCase() === 'content-security-policy');
    const refresh = meta.find(tag => tag.httpEquiv.toLowerCase() === 'refresh');
    const match = refresh?.content.match(/^\s*(\d+(?:\.\d+)?)\s*;\s*url\s*=\s*(['"]?)(.*?)\2\s*$/i);
    return { policyCount: policies.length, target: match ? new URL(match[3], base).href : null, immediate: Boolean(match && Number(match[1]) === 0) };
  }, { source, base });
}

async function inspect(page, url, declaration) {
  let navigationError = null;
  let inspectionError = null;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    // The alias load event can precede its zero-delay refresh. Inspect only
    // after the exact declared destination has loaded; never skip its policy.
    if (declaration.immediate) await page.waitForURL(declaration.target, { waitUntil: 'load', timeout: 30000 });
    await settled(page);
  } catch (error) { navigationError = error.message; }
  let state = { finalUrl: page.url(), policyCount: null, violations: [] };
  try {
    state = await page.evaluate(() => ({ finalUrl: location.href, title: document.title, policyCount: document.querySelectorAll('meta[http-equiv="Content-Security-Policy" i]').length, violations: window.__cspViolations || [] }));
  } catch (error) { inspectionError = error.message; }
  if (declaration.immediate && state.finalUrl !== declaration.target && !navigationError) navigationError = `Immediate refresh destination mismatch: expected ${declaration.target}, inspected ${state.finalUrl}`;
  const declaredExternalRedirect = new URL(state.finalUrl).origin !== ORIGIN && declaration.policyCount === 1 && declaration.target === state.finalUrl ? declaration.target : null;
  return { ...state, sourcePolicyCount: declaration.policyCount, declaredRefreshTarget: declaration.target, declaredExternalRedirect, navigationError, inspectionError };
}

async function main() {
  const pages = Object.keys(require('./policies.json').pages).filter(file => file.endsWith('.html'));
  const selected = process.env.SECURITY_TEST_FILTER ? pages.filter(file => file.includes(process.env.SECURITY_TEST_FILTER)) : pages;
  const browser = await launch();
  const parserContext = await browser.newContext({ serviceWorkers: 'block' });
  // Parse declarations without executing a redirect or loading its resources.
  await parserContext.route('**/*', route => route.abort());
  const parser = await parserContext.newPage();
  const report = { browser: browser.version(), mode: 'Offline initial-load CSP smoke; external fonts/styles omitted and external API/analytics requests intercepted', pages: [] };
  let next = 0;
  try {
    await Promise.all([0, 1, 2, 3].map(async () => {
      const session = await context(browser);
      const page = await session.context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      try {
        while (next < selected.length) {
          const file = selected[next++];
          errors.length = 0;
          const url = `${ORIGIN}/${file}`;
          const declaration = await sourceDeclaration(parser, fs.readFileSync(path.join(ROOT, file), 'utf8'), url);
          const state = await inspect(page, url, declaration);
          report.pages.push({ file, ...state, pageErrors: [...errors] });
          if (failed(report.pages.at(-1))) console.log(`CHECK ${file}: ${JSON.stringify(report.pages.at(-1))}`);
          else if (report.pages.length % 25 === 0) console.log(`Checked ${report.pages.length}/${selected.length}`);
        }
      } finally { await session.context.close(); }
    }));
  } finally { await browser.close(); }
  report.pages.sort((a, b) => a.file.localeCompare(b.file));
  const output = process.env.SECURITY_EVIDENCE_DIR || path.join(os.tmpdir(), 'vcp-site-security-evidence');
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, 'crawl.json'), JSON.stringify(report, null, 2) + '\n');
  const failures = report.pages.filter(failed);
  console.log(JSON.stringify({ pages: report.pages.length, protectedLocalLoads: report.pages.filter(page => !page.declaredExternalRedirect).length, declaredExternalRedirects: report.pages.filter(page => page.declaredExternalRedirect).length, failures: failures.length, evidence: output }));
  assert.equal(failures.length, 0, 'Inspect CSP/page errors in crawl.json');
}

if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { failed, sourceDeclaration, inspect };
