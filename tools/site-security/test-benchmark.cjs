'use strict';

const assert = require('node:assert/strict');
const { launch, context: createContext, settled, ORIGIN } = require('./browser.cjs');

// Exercise the rendered controls under the real page CSP. The shared browser
// helper fulfills requests locally; no evidence or analytics reaches a server.
(async () => {
  const browser = await launch();
  try {
    const { context, requests } = await createContext(browser);
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(ORIGIN + '/benchmark/app/', { waitUntil: 'load' });
    await settled(page);
    assert.deepEqual(errors, [], 'Initial application scripts must execute without errors');
    assert.deepEqual(await page.evaluate(() => window.__cspViolations), [], 'Initial application scripts must satisfy CSP');
    assert.equal(await page.locator('#criteriaList .criterion').count(), 10);
    await page.locator('#modalBtn').click();

    // Nested header clicks expand once; changing a score must not collapse it.
    await page.locator('#criterion-1 .criterion-name').click();
    assert(await page.locator('#criterion-1').evaluate(element => element.classList.contains('expanded')));
    await page.locator('#criterion-1 [data-score="2"]').click();
    assert(await page.locator('#criterion-1').evaluate(element => element.classList.contains('expanded')));
    assert.equal(await page.locator('#totalScore').textContent(), '2');
    await page.locator('#criterion-1 [data-score="na"]').click();
    assert.equal(await page.locator('#answeredCount').textContent(), '0');
    await page.locator('#criterion-1 [data-score="1"]').click();
    await page.locator('#criterion-1 textarea').fill('Local evidence note');
    await page.locator('#orgName').focus();
    assert.equal(await page.evaluate(() => state.evidence[1]), 'Local evidence note');

    // Replacing the criteria markup must preserve delegation and arguments.
    await page.locator('#viewExecutive').click();
    await page.locator('#criterion-1 .criterion-name').click();
    await page.locator('#criterion-1 .verification-item').first().click();
    assert.equal(await page.evaluate(() => state.checklists[1][0]), 1);
    await page.locator('#criterion-1 .verification-item').first().click();
    assert.equal(await page.evaluate(() => state.checklists[1][0]), 2);

    // Removing a non-first item, then another item, exercises rebuilt indices.
    await page.locator('#fileInput').setInputFiles([
      { name: 'alpha.txt', mimeType: 'text/plain', buffer: Buffer.from('alpha') },
      { name: 'beta.txt', mimeType: 'text/plain', buffer: Buffer.from('beta') },
      { name: 'gamma.txt', mimeType: 'text/plain', buffer: Buffer.from('gamma') },
    ]);
    await page.waitForFunction(() => state.files.length === 3 && document.querySelectorAll('#fileList .file-item').length === 3);
    await page.locator('#fileList [data-remove-file="1"]').click();
    assert.deepEqual(await page.evaluate(() => state.files.map(file => file.name)), ['alpha.txt', 'gamma.txt']);
    await page.locator('#fileList [data-remove-file="0"]').click();
    assert.deepEqual(await page.evaluate(() => state.files.map(file => file.name)), ['gamma.txt']);

    // Local exports must work without eval, Worker, or WebAssembly exceptions.
    const pdfEvent = page.waitForEvent('download');
    await page.locator('button[onclick="exportPDFOnly()"]').click();
    const pdf = await pdfEvent;
    assert(pdf.suggestedFilename().endsWith('.pdf'));
    assert.equal(await pdf.failure(), null);
    const zipEvent = page.waitForEvent('download');
    await page.locator('button[onclick="exportEvidencePack()"]').click();
    const zip = await zipEvent;
    assert(zip.suggestedFilename().endsWith('.zip'));
    assert.equal(await zip.failure(), null);

    await settled(page);
    assert.equal(await page.locator('#criteriaList [onclick],#criteriaList [onchange],#fileList [onclick]').count(), 0);
    assert.deepEqual(await page.evaluate(() => window.__cspViolations), []);
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({
      benchmarkControls: 'pass', criteriaToggle: 'pass', scorePropagation: 'pass',
      evidenceChange: 'pass', checklistRerender: 'pass', removeReindexedFiles: 'pass',
      pdfExport: 'pass', zipExport: 'pass', cspViolations: 0, pageErrors: 0,
      interceptedRequests: requests.length,
    }));
    await context.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
