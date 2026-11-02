'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { chromium } = require('../site-css/node_modules/playwright');

const ROOT = path.resolve(__dirname, '../..');
const ORIGIN = 'https://veritaschain.org';
const FIXTURES = process.env.SECURITY_FIXTURE_DIR || path.join(os.tmpdir(), 'vcp-site-security-fixtures');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.zip': 'application/zip', '.woff2': 'font/woff2' };

function fixtures() {
  const manifest = JSON.parse(fs.readFileSync(path.join(FIXTURES, 'manifest.json'), 'utf8'));
  const result = new Map();
  for (const [url, record] of Object.entries(manifest)) {
    const bytes = fs.readFileSync(path.join(FIXTURES, record.file));
    const digest = 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
    if (digest !== record.integrity) throw new Error(`Modified offline test fixture: ${url}`);
    result.set(url, bytes);
  }
  return result;
}

async function launch() {
  return chromium.launch({ executablePath: process.env.CSS_BROWSER_PATH || undefined, headless: true, args: ['--no-sandbox'] });
}

async function context(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block', acceptDownloads: true, ...options });
  const cache = fixtures();
  const requests = [];
  await context.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.__cspViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI, disposition: event.disposition });
    });
  });
  await context.route('**/*', async route => {
    const request = route.request();
    const url = new URL(request.url());
    requests.push({ method: request.method(), url: url.href, type: request.resourceType() });
    if (cache.has(url.href)) return route.fulfill({ contentType: 'application/javascript', headers: { 'access-control-allow-origin': '*' }, body: cache.get(url.href) });
    if (url.origin !== ORIGIN) {
      // External style/font delivery is outside this offline test. Literal API
      // and analytics calls are intercepted too, never forwarded.
      if (request.resourceType() === 'stylesheet') return route.fulfill({ contentType: 'text/css', body: '' });
      if (request.resourceType() === 'script') return route.fulfill({ contentType: 'application/javascript', body: '' });
      return route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ events: [], batches: [], data: [], total: 0 }) });
    }
    if (request.method() !== 'GET') return route.fulfill({ status: 204, body: '' });
    let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
    if (!relative || relative.endsWith('/')) relative += 'index.html';
    const file = path.resolve(ROOT, relative);
    if (!file.startsWith(ROOT + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) return route.fulfill({ status: 404, body: 'Missing local test resource' });
    return route.fulfill({ contentType: MIME[path.extname(file)] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  return { context, requests };
}

async function settled(page) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await page.waitForLoadState('load');
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      return;
    } catch (error) {
      if (!/Execution context was destroyed|navigation/i.test(error.message) || attempt === 2) throw error;
    }
  }
}

module.exports = { ROOT, ORIGIN, launch, context, settled, fixtures };
