# VAP-AT Assessment Portal

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://veritaschain.github.io/vap-at-portal/)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)

Interactive self-assessment portal for **VAP-AT (Verifiable AI Provenance – Assessment Test)**.

## 🚀 Live Demo

Visit: **https://veritaschain.github.io/vap-at-portal/**

## 📋 Features

### Self-Assessment Tool
- 10 criteria evaluation form
- Real-time score calculation (0-20 scale)
- Automatic grade determination (Strong/Moderate/Limited/Inadequate)
- Threshold Designation indicators
- PDF report generation
- JSON evidence pack download

### Documentation
- Program Charter
- Scoring Criteria guide
- Assessment Levels explanation
- Governance structure
- FAQ

### Public Registry (Preview)
- Sample assessed entities display
- Grade and status visualization
- Launching Q3 2026

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/veritaschain/vap-at-portal.git
cd vap-at-portal

# Serve locally (any HTTP server)
python -m http.server 8000
# or
npx serve .

# Open browser
open http://localhost:8000
```

## 📁 Project Structure

```
vap-at-portal/
├── index.html          # Main SPA
├── css/
│   └── style.css       # Styles
├── js/
│   └── app.js          # Application logic
├── data/
│   └── criteria.json   # 10 criteria definitions
├── docs/
│   └── VAP-AT_Program_Charter_v0.6a.md
├── assets/             # Images, logos
└── README.md
```

## 🎯 Assessment Levels

| Level | Name | Description | Cost |
|-------|------|-------------|------|
| **1** | Self | This tool (preliminary) | Free |
| **2** | Verified | CAB third-party assessment | $15K-$150K |
| **3** | Continuous | Ongoing monitoring | $100K+ |

## 📊 Scoring System

- **10 Criteria** × **0-2 Points** = **20 Points Maximum**

| Score | Grade | Interpretation |
|-------|-------|----------------|
| 16-20 | Strong | Robust auditability |
| 11-15 | Moderate | Auditable with gaps |
| 6-10 | Limited | Significant deficiencies |
| 0-5 | Inadequate | Fundamentally insufficient |

## ⚠️ Disclaimer

This self-assessment tool (VAP-AT Level 1) produces **preliminary results** that are not independently verified.

**Threshold Designations are interpretive labels within the VAP-AT scheme and are NOT guarantees of legal compliance.**

## 📜 License

Content licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Code licensed under [MIT License](LICENSE).

## 🔗 Related

- [VeritasChain Standards Organization](https://veritaschain.org)
- [VAP Framework](https://github.com/veritaschain/vap)
- [VCP Specification](https://github.com/veritaschain/vcp)
- [IETF Draft](https://datatracker.ietf.org/doc/draft-kamimura-scitt-vcp/)

---

*© 2025 VeritasChain Standards Organization*
