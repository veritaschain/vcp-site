# VeritasChain Protocol (VCP) - Official Landing Page

**Open audit-trail specification for algorithmic and AI-driven trading**

Official website for VeritasChain Protocol (VCP) - An open standard for recording decision-making and execution results of algorithmic and AI-driven trading in a tamper-evident and verifiable format.

---

## 🌏 Live Site

**Production:** https://veritaschain.org/

### Available Pages

- 🏠 **VCP Protocol Landing:** [index.html](index.html)
- 🏛️ **VSO (Standards Organization):** [vso/index.html](vso/index.html)
- 📜 **VSO Independence Statement:** [vso/policies/](vso/policies/)
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

### Available Languages (VCP Landing)

- 🇬🇧 **English:** [index.html](index.html)
- 🇯🇵 **日本語:** [ja/index.html](ja/index.html)
- 🇨🇳 **中文 (简体):** [zh/index.html](zh/index.html)

---

## 📂 Project Structure

```
vcp-site/
├── index.html              # 🇬🇧 VCP Protocol landing (English)
├── ja/
│   └── index.html          # 🇯🇵 Japanese version
├── zh/
│   └── index.html          # 🇨🇳 Chinese (Simplified) version
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
│   ├── policies/           # VSO Independence Statement
│   │   ├── index.html      # 🇬🇧 English version (default)
│   │   └── ja/
│   │       └── index.html  # 🇯🇵 Japanese version
│   └── README.md           # VSO documentation
├── assets/
│   ├── css/
│   │   └── main.css        # Custom styles
│   ├── img/
│   │   ├── logo.png        # VSO logo
│   │   └── vso-badge.png   # VSO badge
│   └── js/
│       └── main.js         # Custom JavaScript
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

- ✅ **Zero dependencies** - Pure HTML/CSS/JS
- ✅ **Fast loading** - Optimized assets, CDN fonts
- ✅ **SEO optimized** - Meta tags, Open Graph, language alternates
- ✅ **Multi-language** - Full i18n support with language switcher

### Content Sections

1. **Hero Section** - Protocol introduction with VSO badge
2. **What is VCP?** - Protocol explanation with FIX comparison
3. **Why Now?** - Regulatory landscape explanation (MiFID II, EU AI Act, CAT, APAC)
4. **Key Features** - 6 feature cards with crypto agility, multi-tier support
5. **Technology Stack** - Technical specifications (UUIDv7, Ed25519, Merkle Tree, PTP/NTP)
6. **Use Cases** - 6 application scenarios (HFT, CEX, DeFi, On-Chain Proofs)
7. **Get Started** - Target-specific CTAs (Developers, Exchanges, Regulators)
8. **VC-Certified** - Certification program details with SVG badge
9. **Company Info** - VeritasChain Co., Ltd. structure
10. **Contact** - Contact information with standardization inquiry
11. **Footer** - Disclaimers, revision history, independence statement

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

- **MiFID II RTS 25** (Delegated Regulation (EU) 2017/574: synchronisation of business clocks to UTC for trading venues and their members or participants)
- **EU AI Act** (Regulation (EU) 2024/1689; Annex III high-risk obligations apply from 2 December 2027)
- **GDPR** (Data privacy)
- **CAT Rule 613** (US SEC Consolidated Audit Trail)
- **APAC Standards** (Japan, Singapore, Hong Kong alignment)

### Standards Body Conventions

- **"as-is" warranty disclaimer** (ISO/IEEE standard)
- **Revision history** in footer (v1.0 → v1.1)
- **Module coverage** explicitly stated (CORE, TRADE, GOV, RISK, PRIVACY, RECOVERY)
- **Technical precision** - Only guaranteed values stated

---

## 🎯 Target Audiences

1. **Developers** - Implement VCP from the open specification (SDK source code is not yet public)
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

### Next update: planned — no date set

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

- VSO operates independently and does not provide trading services.
- VSO does not endorse or certify any financial performance claims.
- All specifications are provided "as-is" without warranties of any kind.

---

## 🛠️ Development

This site is maintained by VeritasChain Standards Organization (VSO) as part of an international standardization initiative for auditability and AI governance.

**Maintained by:** TOKACHI & Ayano
**Created:** 2025
**Status:** Production-Ready ✅
