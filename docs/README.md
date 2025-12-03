# VeritasChain Static Site

This directory contains the generated static HTML files for GitHub Pages.

## Deployment URLs
- **FAQ:** https://veritaschain.org/certified/faq/
- **Brokers LP:** https://veritaschain.org/brokers/

## Structure
```
docs/
├── certified/
│   └── faq/
│       ├── index.html    # English FAQ (default)
│       ├── ja.html       # Japanese FAQ
│       └── zh.html       # Chinese FAQ
├── brokers/
│   ├── index.html        # English Brokers LP (default)
│   ├── ja/
│   │   └── index.html    # Japanese Brokers LP
│   └── zh/
│       └── index.html    # Chinese Brokers LP
├── .nojekyll             # Disables Jekyll processing
└── 404.html              # Not found page
```

**Build command:**
```bash
npm run build:subpath
```

**Deployment:**
This folder is served via GitHub Pages with custom domain veritaschain.org.
