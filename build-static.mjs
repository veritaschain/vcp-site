import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building static site for GitHub Pages...\n');

// Step 1: Build the Vite project first
console.log('1️⃣  Building Vite project...');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n2️⃣  Generating static HTML files from dist...');

// Create docs directory for GitHub Pages
const docsDir = path.join(__dirname, 'docs');
if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true });
}
fs.mkdirSync(docsDir, { recursive: true });

// Import the built worker and create mock environment
const workerModule = await import('./dist/_worker.js');
const app = workerModule.default;

// Mock Cloudflare environment
const env = {};
const executionCtx = {
  waitUntil: () => {},
  passThroughOnException: () => {}
};

// Generate English FAQ (index.html)
try {
  const req = new Request('http://localhost/faq', { method: 'GET' });
  const response = await app.fetch(req, env, executionCtx);
  const html = await response.text();
  fs.writeFileSync(path.join(docsDir, 'index.html'), html, 'utf-8');
  console.log('   ✓ Generated: index.html (English FAQ)');
} catch (error) {
  console.error('   ✗ Failed to generate index.html:', error.message);
}

// Generate Japanese FAQ (ja.html)
try {
  const req = new Request('http://localhost/ja', { method: 'GET' });
  const response = await app.fetch(req, env, executionCtx);
  const html = await response.text();
  fs.writeFileSync(path.join(docsDir, 'ja.html'), html, 'utf-8');
  console.log('   ✓ Generated: ja.html (Japanese FAQ)');
} catch (error) {
  console.error('   ✗ Failed to generate ja.html:', error.message);
}

// Create .nojekyll to disable Jekyll processing
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '', 'utf-8');
console.log('   ✓ Created: .nojekyll');

// Create 404.html (redirect to index)
const html404 = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Page Not Found - VeritasChain</title>
  <meta http-equiv="refresh" content="0; url=/">
  <link rel="canonical" href="/" />
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 50px; }
    a { color: #3b82f6; text-decoration: none; }
  </style>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>Redirecting to <a href="/">FAQ home</a>...</p>
</body>
</html>`;
fs.writeFileSync(path.join(docsDir, '404.html'), html404, 'utf-8');
console.log('   ✓ Generated: 404.html');

// Create README for docs folder
const docsReadme = `# VeritasChain Certified FAQ - Static Site

This directory contains the generated static HTML files for GitHub Pages.

**Generated files:**
- \`index.html\` - English FAQ (default)
- \`ja.html\` - Japanese FAQ
- \`404.html\` - Not found page
- \`.nojekyll\` - Disables Jekyll processing

**Build command:**
\`\`\`bash
npm run build:static
\`\`\`

**Deployment:**
This folder is served via GitHub Pages.
`;
fs.writeFileSync(path.join(docsDir, 'README.md'), docsReadme, 'utf-8');
console.log('   ✓ Generated: README.md');

console.log('\n✨ Static site generation complete!');
console.log(`📂 Output directory: ${docsDir}`);
console.log('\n📝 Next steps:');
console.log('   1. git add docs/');
console.log('   2. git commit -m "Add static site for GitHub Pages"');
console.log('   3. git push origin main');
console.log('   4. Enable GitHub Pages with /docs folder in repository settings');
