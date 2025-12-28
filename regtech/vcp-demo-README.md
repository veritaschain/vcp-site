# VCP Tamper-Evidence Validation Demo

**An interactive proof-of-concept demonstrating cryptographic audit trail integrity for algorithmic trading systems.**

🌐 **Live Demo**: [veritaschain.github.io/tamper-evidence-demo](https://veritaschain.github.io/tamper-evidence-demo)

---

## Purpose

This demo shows **RegTech companies, audit firms, and compliance teams** how cryptographic hash chains transform audit logs from "trust me" claims into mathematically verifiable proof.

**Target Audience:**
- RegTech product managers evaluating integration
- Compliance officers understanding technical capabilities  
- Auditors assessing verification methodology
- Technical teams planning implementation

---

## What You'll See

### Three Interactive Scenarios

| Scenario | Description | Outcome |
|----------|-------------|---------|
| **A: Intact Chain** | Original, untouched event log | ✅ All checks pass |
| **B: Tampered Event** | Order quantity modified (100→500) | ❌ Hash mismatch detected |
| **C: Deleted Event** | AI decision event removed | ❌ Sequence gap detected |

### Key Technical Elements

- **UUIDv7 Event IDs** - Time-ordered identifiers
- **SHA-256 Hash Chains** - Cryptographic linkage between events
- **Merkle Roots** - Batch integrity verification
- **Ed25519 Signatures** - Non-repudiation capability

---

## Demo Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SINGLE HTML FILE                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Embedded CSS (Dark theme, professional UI)             │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │  Embedded JavaScript                                    │   │
│  │  - Hash chain simulation                                │   │
│  │  - Verification logic                                   │   │
│  │  - Interactive UI controls                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  NO EXTERNAL DEPENDENCIES • OFFLINE-CAPABLE • INSTANT LOAD     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Integration Value Proposition

### For RegTech Companies

| Current State | With VCP |
|--------------|----------|
| Logs can be modified without detection | Any modification breaks hash chain |
| Compliance is based on assertions | Compliance is mathematically provable |
| Third parties must trust your systems | Third parties can independently verify |

### Key Messages

1. **This is NOT a monitoring tool** - VCP creates evidence, not surveillance
2. **This does NOT replace existing logs** - Runs as a sidecar alongside current infrastructure
3. **This transforms "claims" into "proofs"** - Regulatory compliance becomes demonstrable

---

## Deployment

### GitHub Pages

1. Fork this repository
2. Enable GitHub Pages in Settings → Pages
3. Select `main` branch, root folder
4. Access at `https://[username].github.io/tamper-evidence-demo/`

### Self-Hosted

Simply serve `index.html` from any static web server:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# Any web server
# Just serve index.html as the root document
```

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Complete demo (HTML + CSS + JS) |
| `README.md` | This documentation |

---

## Related Resources

- **VCP Specification**: [veritaschain.org](https://veritaschain.org)
- **GitHub Organization**: [github.com/veritaschain](https://github.com/veritaschain)
- **IETF Draft**: [draft-kamimura-scitt-vcp](https://datatracker.ietf.org/doc/draft-kamimura-scitt-vcp/)

---

## License

This demo is provided for educational and evaluation purposes by the VeritasChain Standards Organization (VSO).

---

## Contact

- **Technical Inquiries**: technical@veritaschain.org
- **Partnership**: partners@veritaschain.org
- **General**: info@veritaschain.org
