import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building static site for veritaschain.org/certified/faq/...\n');

// Step 1: Build the Vite project first
console.log('1️⃣  Building Vite project...');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n2️⃣  Generating static HTML files from dist...');

// Create directory structure for subpath: certified/faq/
const certifiedDir = path.join(__dirname, 'docs', 'certified');
const faqDir = path.join(certifiedDir, 'faq');

if (fs.existsSync(faqDir)) {
  fs.rmSync(faqDir, { recursive: true });
}
fs.mkdirSync(faqDir, { recursive: true });

// Import the built worker and create mock environment
const workerModule = await import('./dist/_worker.js');
const app = workerModule.default;

// Mock Cloudflare environment
const env = {};
const executionCtx = {
  waitUntil: () => {},
  passThroughOnException: () => {}
};

// Update HTML to fix asset paths for subpath deployment
function fixAssetPaths(html, lang) {
  // Fix language switcher links
  html = html.replace(/href="\/ja"/g, 'href="/certified/faq/ja.html"');
  html = html.replace(/href="\/zh"/g, 'href="/certified/faq/zh.html"');
  html = html.replace(/href="\/faq"/g, 'href="/certified/faq/"');
  html = html.replace(/href="\/certified\/faq\/ja\.html"/g, 'href="/certified/faq/ja.html"');
  html = html.replace(/href="\/certified\/faq\/zh\.html"/g, 'href="/certified/faq/zh.html"');
  html = html.replace(/href="\/certified\/faq\/"/g, 'href="/certified/faq/"');
  return html;
}

// Generate English FAQ (index.html)
try {
  const req = new Request('http://localhost/faq', { method: 'GET' });
  const response = await app.fetch(req, env, executionCtx);
  let html = await response.text();
  html = fixAssetPaths(html, 'en');
  fs.writeFileSync(path.join(faqDir, 'index.html'), html, 'utf-8');
  console.log('   ✓ Generated: certified/faq/index.html (English FAQ)');
} catch (error) {
  console.error('   ✗ Failed to generate index.html:', error.message);
}

// Generate Japanese FAQ (ja.html)
try {
  const req = new Request('http://localhost/ja', { method: 'GET' });
  const response = await app.fetch(req, env, executionCtx);
  let html = await response.text();
  html = fixAssetPaths(html, 'ja');
  fs.writeFileSync(path.join(faqDir, 'ja.html'), html, 'utf-8');
  console.log('   ✓ Generated: certified/faq/ja.html (Japanese FAQ)');
} catch (error) {
  console.error('   ✗ Failed to generate ja.html:', error.message);
}

// Generate Chinese FAQ (zh.html)
try {
  const req = new Request('http://localhost/zh', { method: 'GET' });
  const response = await app.fetch(req, env, executionCtx);
  let html = await response.text();
  html = fixAssetPaths(html, 'zh');
  fs.writeFileSync(path.join(faqDir, 'zh.html'), html, 'utf-8');
  console.log('   ✓ Generated: certified/faq/zh.html (Chinese FAQ)');
} catch (error) {
  console.error('   ✗ Failed to generate zh.html:', error.message);
}

// Create .nojekyll at root to disable Jekyll processing
fs.writeFileSync(path.join(__dirname, 'docs', '.nojekyll'), '', 'utf-8');
console.log('   ✓ Created: docs/.nojekyll');

// Create 404.html at root (redirect to FAQ)
const html404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Page Not Found - VeritasChain</title>
  <meta http-equiv="refresh" content="0; url=/certified/faq/">
  <link rel="canonical" href="/certified/faq/" />
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 50px; }
    a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>Redirecting to <a href="/certified/faq/">VeritasChain FAQ</a>...</p>
</body>
</html>`;
fs.writeFileSync(path.join(__dirname, 'docs', '404.html'), html404, 'utf-8');
console.log('   ✓ Generated: docs/404.html');

// Create README for docs folder
const docsReadme = `# VeritasChain Certified FAQ - Static Site

This directory contains the generated static HTML files for GitHub Pages.

**Deployment URL:** https://veritaschain.org/certified/faq/

## Structure
\`\`\`
docs/
├── certified/
│   └── faq/
│       ├── index.html    # English FAQ (default)
│       ├── ja.html       # Japanese FAQ
│       └── zh.html       # Chinese FAQ
├── .nojekyll             # Disables Jekyll processing
└── 404.html              # Not found page
\`\`\`

**Build command:**
\`\`\`bash
npm run build:subpath
\`\`\`

**Deployment:**
This folder is served via GitHub Pages with custom domain veritaschain.org.
`;
fs.writeFileSync(path.join(__dirname, 'docs', 'README.md'), docsReadme, 'utf-8');
console.log('   ✓ Generated: docs/README.md');

// Create index.html at root that redirects to /certified/faq/
const rootIndex = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>VeritasChain</title>
  <meta http-equiv="refresh" content="0; url=/certified/faq/">
  <link rel="canonical" href="/certified/faq/" />
</head>
<body>
  <p>Redirecting to <a href="/certified/faq/">FAQ</a>...</p>
</body>
</html>`;
fs.writeFileSync(path.join(__dirname, 'docs', 'index.html'), rootIndex, 'utf-8');
console.log('   ✓ Generated: docs/index.html (redirect)');

console.log('\n✨ Static site generation complete!');
console.log(`📂 Output directory: ${faqDir}`);
console.log('\n🌐 Deployment URL: https://veritaschain.org/certified/faq/');
console.log('\n📝 Next steps:');
console.log('   1. git add docs/');
console.log('   2. git commit -m "Deploy FAQ to /certified/faq/"');
console.log('   3. git push origin main');
console.log('   4. Verify deployment at https://veritaschain.org/certified/faq/');
