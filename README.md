# VeritasChain Standards Organization (VSO) — VAP / VCP Website

**AI audit trails, public evidence and open specifications**

Source for the official VeritasChain Standards Organization (VSO) website. The homepage introduces VAP (Verifiable AI Provenance Framework) for AI evidence and domain specifications including VeritasChain Protocol (VCP) for algorithmic and AI-driven trading. It connects visitors to public demos, specifications, SDK resources and current implementation and certification disclosures.

---

## 🌏 Live Site

**Production:** https://veritaschain.org/

### Available Pages

- 🏠 **VSO Homepage — VAP / VCP:** [index.html](index.html)
- 🌐 **VAP Framework and Domain Profiles:** [vap/index.html](vap/index.html)
  - [English](vap/index.html) · [日本語](vap/ja/index.html) · [中文](vap/zh/index.html)
- ⚖️ **VAP-LAP — Legal AI Profile (proposed):** [vap/lap/index.html](vap/lap/index.html)
  - [English](vap/lap/index.html) · [日本語](vap/lap/ja/index.html) · [中文](vap/lap/zh/index.html)
  - Legal AI workflows and [AILEX as a product and use-case reference](https://veritaschain.org/vap/lap/#ailex).
  - Based on [individual Internet-Draft -05](https://datatracker.ietf.org/doc/draft-ailex-vap-legal-ai-provenance/05/); proposal status does not establish VAP registry adoption or implementation conformance.
- 🏛️ **VSO (Standards Organization):** [vso/index.html](vso/index.html)
- 📜 **VSO Neutrality, Operating Structure and Non-Endorsement Statement:** [vso/policies/](vso/policies/)
  - 🇬🇧 English: [vso/policies/index.html](vso/policies/index.html)
  - 🇯🇵 Japanese: [vso/policies/ja/index.html](vso/policies/ja/index.html)
- 🌐 **VSO as Distributed Standards Organization:** [distributed-organization/](distributed-organization/) ⭐ NEW
  - 🇬🇧 English: [distributed-organization/index.html](distributed-organization/index.html)
  - 🇯🇵 Japanese: [distributed-organization/ja/index.html](distributed-organization/ja/index.html)
  - 🇨🇳 Chinese: [distributed-organization/zh/index.html](distributed-organization/zh/index.html)
  - Official organizational policy declaration on distributed operations
- ✅ **VC-Certified Program:** [certified/index.html](certified/index.html)
  - 🇬🇧 English certification program page
  - Compliance tiers, target audience, module coverage
- 🏦 **Prop Firms Landing:** [propfirms/index.html](propfirms/index.html)
  - 🇬🇧 English: [propfirms/index.html](propfirms/index.html)
  - 🇯🇵 Japanese: [propfirms/ja/index.html](propfirms/ja/index.html)
  - Trust recovery solution for proprietary trading firms

### Available Languages (VSO Homepage)

- 🇬🇧 **English:** [index.html](index.html)
- 🇯🇵 **日本語:** [ja/index.html](ja/index.html)
- 🇨🇳 **中文 (简体):** [zh/index.html](zh/index.html)

---

## 📂 Project Structure

```
vcp-site/
├── index.html              # 🇬🇧 VSO homepage: VAP / VCP (English)
├── ja/
│   └── index.html          # 🇯🇵 Japanese homepage
├── zh/
│   └── index.html          # 🇨🇳 Chinese (Simplified) homepage
├── certified/              # ⭐ VC-Certified Program (NEW)
│   ├── index.html          # 🇬🇧 Certification program page
│   └── static/
│       └── style.css       # Custom styles
├── propfirms/              # ⭐ Prop Firms Landing (NEW)
│   ├── index.html          # 🇬🇧 English version
│   ├── ja/
│   │   └── index.html      # 🇯🇵 Japanese version
│   ├── css/
│   │   └── styles.css      # Custom styles
│   └── js/
│       └── main.js         # Custom JavaScript
├── vso/                    # VSO Pages
│   ├── index.html          # VSO landing page
│   ├── policies/           # VSO Neutrality, Operating Structure and Non-Endorsement Statement
│   │   ├── index.html      # 🇬🇧 English version (default)
│   │   └── ja/
│   │       └── index.html  # 🇯🇵 Japanese version
│   └── README.md           # VSO documentation
├── assets/
│   ├── css/
│   │   ├── homepage.css    # Current EN / JA / ZH homepage layout
│   │   ├── news-archive.css # Shared announcement styles
│   │   └── main.css        # Existing landing-page styles
│   ├── img/
│   │   ├── logo.png        # VSO logo
│   │   └── vso-badge.png   # VSO badge
│   └── js/
│       ├── vcp-header.js   # Shared navigation and language routes
│       ├── vcp-footer.js   # Shared footer
│       └── main.js         # Shared page behavior
└── README.md               # This file
```

---

## 🚀 Deployment

This is a **static website** that can be deployed to any static hosting service:

### GitHub Pages (Recommended)

Already configured! The site is automatically deployed to:
https://veritaschain.org/

### Other Hosting Options

- **Cloudflare Pages:** Deploy from GitHub repository
- **Netlify:** Connect repository and deploy
- **Vercel:** Import GitHub repository
- **AWS S3 + CloudFront:** Upload files to S3 bucket
- **Traditional Web Server:** Upload files to any Apache/Nginx server

---

## 🎨 Features

### Design & Standards Compliance

- ✅ Standards-document style presentation
- ✅ **Responsive design** - Mobile, tablet, desktop optimized
- ✅ **Dark theme** with professional color scheme
- ✅ **Accessibility** features (ARIA labels, semantic HTML)

### Technical Highlights

- ✅ **Static delivery** - Committed HTML/CSS/JS; development checks use Node.js and Python
- ✅ **Fast loading** - Optimized assets, CDN fonts
- ✅ **SEO optimized** - Meta tags, Open Graph, language alternates
- ✅ **Multi-language** - Full i18n support with language switcher

### Content Sections

Each homepage has eight sections inside `<main>`, with shared navigation and footer components:

1. **Hero** - VSO, VAP and VCP introduction; primary links to the verification demo and specification / SDK resources
2. **How it works** - Record, detect changes and verify, with the limits of record-integrity evidence stated
3. **Public demo and SDK** - Sample evidence in VCP Explorer, SDK source and examples, and related research references
4. **Framework and profiles** - VAP and the published or proposed status of VCP, CAP, CPP and VAP-LAP
5. **Choose your starting point** - Integration, application evaluation and research routes, plus practical guides and the EVIDECT service reference
6. **Latest announcements** - Three recent updates, the full archive and retained announcement anchors
7. **Current status and evidence** - Implementation limits, independent verification, certification availability, corrections and common questions
8. **About VSO** - Operator, founder, company and policy links, contact details, privacy and terms

---

## 📋 Technical Specifications

### Timestamp Precision (Critical)

- **Platinum:** <1µs (PTP IEEE 1588-2019)
- **Gold:** <1ms (NTP Chrony)
- **Silver:** Best-effort (system time; no guaranteed precision)

### Event ID

- **UUIDv7** (RFC 9562, time-ordered, v4 fallback)

### Cryptographic Standards

- **Default:** Ed25519
- **Alternatives:** ECDSA, Dilithium (Post-Quantum Cryptography)
- **Verification:** Merkle Tree + Chain Validation

### Storage Formats

- SBE (Simple Binary Encoding)
- JSON
- Parquet
- FlatBuffers
- Zero-Copy / Kernel Bypass / RDMA ready

---

## 🏛️ Standards & Compliance

### Regulatory Relevance

VCP produces evidence relevant to the regimes below. Conformance to VCP does not constitute compliance with any of them (VAP v1.2 §1.6).

- **EU clock-synchronisation rules** (Commission Delegated Regulation (EU) 2025/1155, Articles 11–16 and Annex IV: synchronisation of business clocks to UTC for trading venues, their members or participants and other market infrastructure; it replaced MiFID II RTS 25 — Delegated Regulation (EU) 2017/574 — on 2 March 2026)
- **EU AI Act** (Regulation (EU) 2024/1689; Annex III high-risk obligations apply from 2 December 2027)
- **GDPR** (Data privacy)
- **CAT Rule 613** (US SEC Consolidated Audit Trail)
- **APAC Standards** (Japan, Singapore, Hong Kong alignment)

### Standards Body Conventions

- **"as-is" warranty disclaimer** (ISO/IEEE standard)
- **Revision history** in footer (current: VCP v1.2)
- **Module coverage** explicitly stated (CORE, TRADE, GOV, RISK, PRIVACY, RECOVERY)
- **Technical precision** - Only guaranteed values stated

---

## 🎯 Target Audiences

1. **Developers** - Implement VCP from the open specification (an offline core for VCP v1.2, [vcp-sdk](https://github.com/veritaschain/vcp-sdk) v0.1.0, is published as a pre-release; it is not an implementation of vcp-sdk-spec)
2. **Exchanges & Brokers** - Deploy as FIX protocol sidecar
3. **Regulators** - Review the open specification
4. **HFT Firms** - Platinum-tier compliance
5. **Institutional Investors** - Gold-tier compliance
6. **Retail Platforms** - Silver-tier transparency

---

## 📊 Version History

### Website v1.0

- Initial release with trilingual support
- Standards-document style presentation
- Technical accuracy (timestamp precision corrections)
- Module coverage (CORE, TRADE, GOV, RISK, PRIVACY, RECOVERY)
- "Why Now?" regulatory landscape explanation
- On-Chain Audit Proofs (ZK-based)
- VC-Certified SVG badge

### Current specification: VCP v1.2.0 — General Availability

- Tag v1.2.0 → b23acb266f88df81d960d36d58fb64ceaa0dd5ed
- GA merged 2026-10-08 JST; fix merged 2026-10-09 JST
- This is the VCP release status, separate from VAP v1.2.0 Draft 3
- Specification: https://github.com/veritaschain/vcp-spec/tree/main/spec/v1.2
- JSON Schema: https://veritaschain.org/schema/vcp-event-v1.2.json
- Previous: v1.1 (2025-12-30), v1.0 (2025-11-25)

---

## 📞 Contact

**VeritasChain Standards Organization (VSO)**

- **Email:** info@veritaschain.org
- **GitHub:** https://github.com/VeritasChain/vcp-spec
- **Support Portal:** https://veritaschain.org/support/

---

## 📄 License

© 2025 VeritasChain Co., Ltd. All rights reserved.

**Important Disclaimers:**

- VSO is operated by VeritasChain Co., Ltd. and does not provide trading services.
- VSO does not endorse or certify any financial performance claims.
- All specifications are provided "as-is" without warranties of any kind.

---

## 🛠️ Development

This site is maintained by VeritasChain Standards Organization (VSO) as part of an international standardization initiative for auditability and AI governance.

### Homepage maintenance

Update [English](index.html), [Japanese](ja/index.html) and [Chinese](zh/index.html) together. The homepage layout is in [assets/css/homepage.css](assets/css/homepage.css); announcements use [assets/css/news-archive.css](assets/css/news-archive.css), and shared navigation is in [assets/js/vcp-header.js](assets/js/vcp-header.js). Keep existing fragment destinations and the visible FAQ aligned with its structured data.

Run from the repository root with Python 3 and Node.js 24. After HTML or script changes, regenerate the Content Security Policy (CSP), review the generated changes, and run the source checks:

```sh
python3 scripts/site_security.py build
python3 scripts/site_security.py check
node --test tests/*.test.cjs
```

For the homepage browser check, install the locked tools and provide an installed Chrome / Chromium executable:

```sh
npm ci --prefix tools/site-css --ignore-scripts --no-audit --no-fund
CSS_BROWSER_PATH=/absolute/path/to/chrome \
CSS_EVIDENCE_DIR=/tmp/vcp-site-homepage \
node tools/site-css/homepage-check.cjs
```

The check covers EN / JA / ZH at 1440, 390 and 360 pixels: page structure, primary actions, language routes, skip-link focus, keyboard navigation, mobile menu state, FAQ behavior and horizontal overflow. Screenshots and `report.json` are saved under `$CSS_EVIDENCE_DIR/homepage/`. The [CSS workflow](.github/workflows/site-css.yml) documents the pinned CI browser and required system dependencies; omitting `CSS_BROWSER_PATH` uses Playwright's installed Chromium.

Browser requests are intercepted and served from local files or pinned fixtures. External fonts and icon stylesheets are omitted, and no live analytics, form submission or service request is sent. These checks cover the local homepage behavior; external resource availability and live service behavior require separate verification. See the [CSS checks](tools/site-css/README.md) and [site security checks](tools/site-security/README.md) for broader coverage and limits.

**Maintained by:** TOKACHI & Ayano
**Created:** 2025
**Status:** Maintained (the status of each specification and program is stated on its own page)
