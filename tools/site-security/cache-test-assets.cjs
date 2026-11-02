'use strict';

// Public bytes are downloaded once for tests, verified, and then served only
// through an offline browser router. Nothing is sent to analytics endpoints.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const output = process.env.SECURITY_FIXTURE_DIR || path.join(os.tmpdir(), 'vcp-site-security-fixtures');
const pins = require('./script-integrity.json');

async function main() {
  fs.mkdirSync(output, { recursive: true });
  const manifest = {};
  const assets = Object.entries(pins);
  if (process.argv.includes('--analytics')) {
    const loader = fs.readFileSync(path.resolve(__dirname, '../../assets/js/analytics.js'), 'utf8');
    const id = loader.match(/\bID\s*=\s*['"]([^'"]+)/)?.[1];
    if (!id) throw new Error('Could not read the existing public analytics stream ID');
    assets.push([`https://www.googletagmanager.com/gtag/js?id=${id}`, null]);
  }
  for (const [url, expected] of assets) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status}: ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const integrity = 'sha384-' + crypto.createHash('sha384').update(bytes).digest('base64');
    if (expected && integrity !== expected) throw new Error(`SRI mismatch: ${url}`);
    const file = crypto.createHash('sha256').update(url).digest('hex').slice(0, 20) + '.js';
    fs.writeFileSync(path.join(output, file), bytes);
    manifest[url] = { file, bytes: bytes.length, integrity, pinned: Boolean(expected), finalUrl: response.url };
  }
  fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ verifiedPinnedAssets: Object.keys(pins).length, analyticsVendorFixture: assets.length > Object.keys(pins).length, directory: output }));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
