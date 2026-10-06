# VeraCheck Web - CPP Evidence Verification

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![CPP Version](https://img.shields.io/badge/CPP-v1.0-blue.svg)](https://github.com/veritaschain/cpp-spec)
[![VAP Version](https://img.shields.io/badge/VAP-v1.2-green.svg)](https://github.com/veritaschain/vap-spec)

Web-based verification tool for cryptographic evidence captured with [VeraSnap](https://veritaschain.org/vap/cpp/verasnap/). Beta viewer for CPP verification packs (CPP v1.0 pack format and VeraSnap INGEST/EXPORT events). Signature, Merkle and RFC 3161 checks are not fully implemented in this web version.

## 🔍 Features

### Three Layers of a Verification Pack

| Layer | What the pack carries | What this web version does |
|-------|-----------------------|----------------------------|
| **Layer 1** | Event integrity: SHA-256 hash + ES256 digital signature | Verifies the ES256 signature when the event embeds its public key (CPP v1.0 pack format); otherwise reports that a signature and a hash are present, without verifying them |
| **Layer 2** | Collection integrity: Merkle proof + completeness field | Reports presence only; the Merkle root and the completeness value are not recomputed |
| **Layer 3** | External verifiability: RFC 3161 TSA timestamp token | Reports presence only; the token is not validated |

Results that are not verified are shown as "present — not verified", never as passed checks.

### Supported Languages (10)

| Language | Code |
|----------|------|
| English | `en` |
| 日本語 (Japanese) | `ja` |
| 简体中文 (Simplified Chinese) | `zh-Hans` |
| 繁體中文 (Traditional Chinese) | `zh-Hant` |
| 한국어 (Korean) | `ko` |
| Deutsch (German) | `de` |
| Français (French) | `fr` |
| Español (Spanish) | `es` |
| Português (Portuguese) | `pt` |
| العربية (Arabic) | `ar` |

### Privacy-First Design

- ✅ **100% client-side processing** - No data sent to any server
- ✅ **No tracking or analytics**
- ✅ **Works offline** after initial page load
- ✅ **Open source** under CC BY 4.0

## 🚀 Deployment to GitHub Pages

### Option 1: Direct Push

1. Fork/clone this repository
2. Push `index.html` to your GitHub repository
3. Go to **Settings** → **Pages**
4. Select **Deploy from a branch** → `main` / `master`
5. Your VeraCheck will be live at `https://[username].github.io/[repo]/`

### Option 2: GitHub Actions (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy VeraCheck to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
          
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## 📁 Verification Pack Format

VeraCheck accepts `.veripack` or `.json` files following the CPP specification and VeraSnap TDS format:

```json
{
  "verification_pack_version": "1.0",
  "verification_code": "CPP-2026-ABC123XYZ",
  "verification_url": "https://verify.veritaschain.org/cpp/...",
  "capture_event": {
    "eventId": "01932f5a-7b8c-7def-8abc-123456789012",
    "eventType": "INGEST",
    "timestamp": "2026-01-23T14:30:00.000Z",
    "prevHash": "GENESIS",
    "eventHash": "sha256:...",
    "asset": {
      "assetType": "IMAGE",
      "assetHash": "sha256:...",
      "mimeType": "image/jpeg"
    },
    "captureContext": {
      "deviceModel": "iPhone 16 Pro",
      "cameraSettings": { "flashMode": "OFF" },
      "humanAttestation": { "method": "BIOMETRIC_FACEID" }
    },
    "signAlgo": "ES256",
    "signature": "base64:..."
  },
  "seal_event": { ... },
  "merkle_proof": { ... },
  "completeness_invariant": { ... },
  "external_anchor": { ... }
}
```

## ⚠️ Important Notice

> **Provenance ≠ Truth**
>
> VeraCheck displays capture provenance data: **when**, and **by what device**, the media is recorded as having been captured. It does **NOT** verify:
> - Content truthfulness
> - Scene authenticity  
> - Whether content was staged or manipulated before capture

This aligns with CPP UI Guidelines (Section 11):
- ✅ USE: "Provenance Available"
- ❌ AVOID: "Verified", "Authenticated"

## 🔗 Related Resources

- **VeraSnap App**: [veritaschain.org/vap/cpp/verasnap/](https://veritaschain.org/vap/cpp/verasnap/)
- **CPP Specification**: [github.com/veritaschain/cpp-spec](https://github.com/veritaschain/cpp-spec)
- **VAP Framework**: [github.com/veritaschain/vap-spec](https://github.com/veritaschain/vap-spec)
- **VCP Protocol**: [github.com/veritaschain/vcp-spec](https://github.com/veritaschain/vcp-spec)

## 📄 License

Copyright © 2026 VeritasChain Standards Organization

Licensed under [CC BY 4.0 International](https://creativecommons.org/licenses/by/4.0/)

---

**Contact**: developers@veritaschain.org
