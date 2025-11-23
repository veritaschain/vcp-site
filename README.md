# VeritasChain Certified (VC-Certified) - FAQ Website

## Project Overview
- **Name**: VeritasChain Certified FAQ
- **Goal**: Proactively address common questions about VCP certification and enhance trust
- **Features**: 
  - Interactive accordion-style FAQ with category-based organization
  - Bilingual support: English (default) and Japanese
  - Responsive design with Tailwind CSS
  - Static site generation for GitHub Pages deployment
  - Language switcher between English and Japanese

## URLs
- **GitHub Pages**: (Will be available after deployment)
  - English: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
  - Japanese: `https://YOUR_USERNAME.github.io/YOUR_REPO/ja.html`
- **Local Development**: http://localhost:3000

## FAQ Categories

### 1. Certification Scope & Limitations
- **Q: Does VC-Certified guarantee financial stability?** → **No. Technical compliance only.**
- **Q: Does VSO endorse specific strategies?** → **No. Vendor-neutral stance.**

### 2. Data Privacy & Security
- **Q: Is personal information exposed?** → **No. Protected by VCP-PRIVACY / Crypto-shredding**
- **Q: Can anyone view blockchain data?** → **Only verification-necessary data is transparent**

### 3. Certification Tiers & Technical Value
- **Q: Is Silver Tier meaningful?** → **Yes. Guarantees irreversibility of fraud**
- **Q: Does it require system replacement?** → **No. Sidecar deployment possible**

### 4. Governance & Future-Proofing
- **Q: What about quantum computers?** → **Crypto Agility ensures future-proofing**
- **Q: EU AI Act compliance?** → **Supported via VCP-GOV module**

## Tech Stack
- **Frontend**: Hono (JSX/TSX) with Tailwind CSS + Font Awesome
- **Backend**: Hono on Cloudflare Workers (for dynamic version)
- **Static Generation**: Node.js build script
- **Deployment**: GitHub Pages (static HTML)
- **Storage**: No database required

## Development

### Setup
```bash
cd /home/user/webapp
npm install
```

### Local Development
```bash
# Build and start dev server
npm run build
pm2 start ecosystem.config.cjs

# Test
curl http://localhost:3000
```

### Build Static Site for GitHub Pages
```bash
# Generate static HTML files in docs/ directory
npm run build:static
```

This creates:
- `docs/index.html` - English FAQ (default)
- `docs/ja.html` - Japanese FAQ
- `docs/404.html` - Not found page
- `docs/.nojekyll` - Disables Jekyll processing

## Deployment to GitHub Pages

### Step 1: Commit Static Files
```bash
git add docs/
git commit -m "Add static site for GitHub Pages"
```

### Step 2: Push to GitHub
```bash
# Setup GitHub authentication first
# Call setup_github_environment tool

# Add remote and push
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Under **Branch**, select **main** and **/docs** folder
4. Click **Save**
5. Wait a few minutes for deployment

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Project Structure
```
webapp/
├── src/
│   ├── index.tsx           # Main Hono application with routing
│   └── pages/
│       ├── faq-en.tsx      # English FAQ page (default)
│       └── faq.tsx         # Japanese FAQ page (/ja)
├── docs/                   # Generated static site (GitHub Pages)
│   ├── index.html          # English FAQ
│   ├── ja.html             # Japanese FAQ
│   ├── 404.html            # Not found page
│   └── .nojekyll           # Disables Jekyll
├── dist/                   # Vite build output (Cloudflare Workers)
├── build-static.mjs        # Static site generator script
├── ecosystem.config.cjs    # PM2 configuration (for dev)
├── package.json            # Dependencies and scripts
├── wrangler.jsonc          # Cloudflare configuration
└── README.md               # This file
```

## Key Features Implementation

### Interactive Accordion UI
- Click to expand/collapse answers
- Auto-close other FAQs when opening a new one
- Smooth animations with CSS transitions
- Chevron icon rotation for visual feedback

### Category-Based Design
- 4 main categories with color-coded badges:
  - 🟡 Scope & Limitations
  - 🔵 Data Privacy & Security
  - 🟢 Certification Tiers & Value
  - 🟣 Governance & Future-Proofing
- Font Awesome icons for visual hierarchy
- Highlight effects for important terms

### Bilingual Support
- English as default language (`/` or `/faq`)
- Japanese version at `/ja`
- Fixed language switcher button (top-right)
- Consistent UI across both languages

### Security & Privacy Highlights
- VCP-PRIVACY module explanation
- Crypto-shredding mechanism
- GDPR "Right to be Forgotten" compliance
- Hashing vs. encryption clarification

## Build Scripts

### `npm run build`
Builds the Vite project for Cloudflare Workers deployment.

### `npm run build:static`
Generates static HTML files in `docs/` directory:
1. Builds Vite project
2. Imports built worker module
3. Renders each route to HTML
4. Creates supporting files (.nojekyll, 404.html, README.md)

### `npm run dev`
Starts Vite development server (localhost only).

### `npm run dev:sandbox`
Starts Wrangler Pages dev server for sandbox environment.

## Git Workflow

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit: Bilingual FAQ with static generation"

# Build static site
npm run build:static

# Commit generated files
git add docs/
git commit -m "Add static site for GitHub Pages"

# Setup GitHub and push (use setup_github_environment tool first)
git remote add origin https://github.com/YOUR_ORG/YOUR_REPO.git
git push -u origin main
```

## Deployment Status
- **Platform**: GitHub Pages (Static HTML)
- **Status**: ✅ Ready for Deployment
- **Tech Stack**: Hono + TypeScript + Tailwind CSS + Font Awesome
- **Languages**: English (default), Japanese
- **Last Updated**: 2025-11-23

## Credits
- **Organization**: VeritasChain Standards Organization (VSO)
- **Tagline**: "Verify, Don't Trust" — Encoding Trust in the Algorithmic Age
- **License**: Production Ready
- **Website**: https://veritaschain.org (planned)

## Support
For questions or issues:
- **Email**: info@veritaschain.org
- **Documentation**: https://veritaschain.org/docs (planned)
- **GitHub Issues**: (after repository creation)
