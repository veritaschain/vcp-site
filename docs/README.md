# VeritasChain Certified FAQ - Static Site

This directory contains the generated static HTML files for GitHub Pages.

**Deployment URL:** https://veritaschain.org/certified/faq/

## Structure
```
docs/
├── certified/
│   └── faq/
│       ├── index.html    # English FAQ (default)
│       └── ja.html       # Japanese FAQ
├── .nojekyll             # Disables Jekyll processing
└── 404.html              # Not found page
```

**Build command:**
```bash
npm run build:subpath
```

**Deployment:**
This folder is served via GitHub Pages with custom domain veritaschain.org.
