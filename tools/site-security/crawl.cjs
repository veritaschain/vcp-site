'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { ROOT, ORIGIN, launch, context, settled } = require('./browser.cjs');

function failed(page) {
  return page.navigationError || (page.policyCount !== 1 && !page.declaredExternalRedirect) || page.violations.length || page.pageErrors.length;
}

async function main() {
  const pages = Object.keys(require('./policies.json').pages).filter(file => file.endsWith('.html'));
  const selected = process.env.SECURITY_TEST_FILTER ? pages.filter(file => file.includes(process.env.SECURITY_TEST_FILTER)) : pages;
  const browser = await launch();
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
          let error = null;
          try {
            await page.goto(`${ORIGIN}/${file}`, { waitUntil: 'load', timeout: 30000 });
            await settled(page);
          } catch (caught) { error = caught.message; }
          const state = await page.evaluate(() => ({ title: document.title, policyCount: document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]').length, violations: window.__cspViolations || [] })).catch(() => ({ policyCount: 0, violations: [] }));
          let declaredExternalRedirect = null;
          if (new URL(page.url()).origin !== ORIGIN) {
            // A repository redirect cannot impose its CSP on a different site.
            // Require a real source policy and an exact declared refresh target;
            // do not count the intercepted external response as a protected page.
            const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
            const declaration = await page.evaluate(({ source, base }) => {
              const document = new DOMParser().parseFromString(source, 'text/html');
              const meta = [...document.querySelectorAll('meta[http-equiv]')];
              const policies = meta.filter(tag => tag.httpEquiv.toLowerCase() === 'content-security-policy');
              const refresh = meta.find(tag => tag.httpEquiv.toLowerCase() === 'refresh');
              const match = refresh?.content.match(/^\s*\d+(?:\.\d+)?\s*;\s*url\s*=\s*(['"]?)(.*?)\1\s*$/i);
              return { policyCount: policies.length, target: match ? new URL(match[2], base).href : null };
            }, { source, base: `${ORIGIN}/${file}` });
            if (declaration.policyCount === 1 && declaration.target === page.url()) declaredExternalRedirect = declaration.target;
          }
          report.pages.push({ file, finalUrl: page.url(), ...state, declaredExternalRedirect, pageErrors: [...errors], navigationError: error });
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

main().catch(error => { console.error(error); process.exitCode = 1; });
