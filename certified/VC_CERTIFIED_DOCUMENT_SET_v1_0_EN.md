# VC-Certified Document Set v1.0

**Historical VCP v1.0 document inventory — reference only**

> **Editorial update (2 November 2026; follows the 28 October status correction).** This is a historical v1.0 inventory, not a current implementation, assessment or certification package. The earlier priority and production-readiness descriptions are withdrawn from the current text. The procedures, tier references and test counts below describe the historical document set and must not be used as current conformance criteria. VSO is operated by VeritasChain Co., Ltd.; the existing certification-status disclosure explains the absence of an independent registered CAB. See the [current specification](https://github.com/veritaschain/vcp-spec) and [certification status](https://veritaschain.org/certified/). Earlier wording remains in Git history.

---

## 🎯 Overview

The historical VC-Certified Document Set grouped VCP v1.0 materials for implementation research. The following intended uses were descriptive goals, not demonstrated outcomes:

- **Prop Firms**: Explore evidence about trader-performance records
- **Exchanges**: Demonstrate trade execution transparency
- **Regulators**: Inspect append-only, tamper-evident audit records
- **Traders**: Verify their results cryptographically

---

## 📚 Complete Document Inventory

### Tier 1: Core Specification

| Document | ID | Purpose | Status |
|----------|-----|---------|--------|
| **VCP Specification v1.0** | VSO-SPEC-001 | Protocol definition | Historical reference |
| **VCP API Reference v1.1** | VSO-API-001 | REST/WebSocket API | Historical reference |

### Tier 2: Implementation Guides

| Document | ID | Purpose | Status |
|----------|-----|---------|--------|
| **VCP SDK Specification v1.0** | VSO-SDK-SPEC-001 | SDK interface definitions | Historical reference |
| **VCP Sidecar Integration Guide** | VSO-INTEG-001 | FIX Protocol integration | Historical reference |
| **Developer Guide** | VSO-DEV-001 | Quick start for developers | Historical reference |

### Tier 3: Testing & Certification

| Document | ID | Purpose | Status |
|----------|-----|---------|--------|
| **VCP Conformance Test Guide v1.0** | VSO-TEST-001 | 125 certification tests | Historical reference |
| **VCP Example Payloads v1.0** | VSO-EXAMPLES-001 | Reference implementations | Historical reference |

### Tier 4: Market Intelligence

| Document | ID | Purpose | Status |
|----------|-----|---------|--------|
| **Prop Firm Industry Crisis Report** | VSO-INTEL-001 | Market context & necessity | Historical reference |
| **VCP International Target List** | VSO-TARGET-001 | Regional market analysis | Historical reference |

---

## 🗺️ Navigation Guide

### By Role

```
┌─────────────────────────────────────────────────────────────────┐
│                     WHO ARE YOU?                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  DEVELOPER  │  │  EXECUTIVE  │  │  REGULATOR  │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         ▼                ▼                ▼                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ SDK Spec    │  │ Market      │  │ VCP Spec    │             │
│  │     ↓       │  │ Intel       │  │     ↓       │             │
│  │ Conformance │  │     ↓       │  │ Conformance │             │
│  │     ↓       │  │ VCP Spec    │  │     ↓       │             │
│  │ Examples    │  │     ↓       │  │ API Ref     │             │
│  └─────────────┘  │ Target List │  └─────────────┘             │
│                   └─────────────┘                               │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │  INTEGRATOR │  │ CERT SEEKER │                              │
│  └──────┬──────┘  └──────┬──────┘                              │
│         │                │                                      │
│         ▼                ▼                                      │
│  ┌─────────────┐  ┌─────────────┐                              │
│  │ Sidecar     │  │ Conformance │                              │
│  │ Guide       │  │ Test Guide  │                              │
│  │     ↓       │  │     ↓       │                              │
│  │ SDK Spec    │  │ Examples    │                              │
│  │     ↓       │  │     ↓       │                              │
│  │ Conformance │  │ Submit App  │                              │
│  └─────────────┘  └─────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### By Certification Tier

| Tier | Required Documents | Optional |
|------|-------------------|----------|
| **Silver** | VCP Spec, SDK Spec, Sidecar Guide, Conformance Guide, Examples | Market Intel |
| **Gold** | All Silver + API Reference (self-signing) | Target List |
| **Platinum** | All Gold + Performance Benchmarks | - |

---

## 🔗 Cross-Reference Matrix

### Document Dependencies

```
VCP Specification v1.0
    │
    ├──► SDK Specification v1.0
    │        │
    │        └──► Conformance Test Guide v1.0
    │                  │
    │                  └──► Example Payloads v1.0
    │
    ├──► API Reference v1.1
    │
    └──► Sidecar Integration Guide
             │
             └──► SDK Specification v1.0
```

### Repository Structure (Recommended)

```
github.com/veritaschain/
│
├── vcp-specification/          # VSO-SPEC-001
│   ├── VCP-Specification-v1_0.md
│   ├── VCP-Specification-v1_0.pdf
│   └── schemas/
│       └── vcp-event.schema.json
│
├── vcp-sdk-spec/               # VSO-SDK-SPEC-001
│   ├── README.md
│   ├── VCP_SDK_SPECIFICATION_v1_0.md
│   └── interfaces/
│       ├── typescript/
│       ├── python/
│       └── mql5/
│
├── vcp-conformance/            # VSO-TEST-001 + VSO-EXAMPLES-001
│   ├── README.md
│   ├── VCP_CONFORMANCE_TEST_GUIDE_v1_0.md
│   ├── VCP_EXAMPLE_PAYLOADS_v1_0.md
│   ├── test-suite/
│   │   ├── schema/
│   │   ├── uuid/
│   │   ├── timestamp/
│   │   ├── hash-chain/
│   │   └── ...
│   └── examples/
│       ├── sig_ord_ack_exe_xauusd.jsonl
│       ├── ord_rej.jsonl
│       └── risk_triggered.jsonl
│
├── vcp-sidecar-guide/          # VSO-INTEG-001
│   ├── README.md
│   ├── VCP_SIDECAR_INTEGRATION_GUIDE.md
│   └── adapters/
│       └── fix-adapter-example/
│
├── vcp-api-reference/          # VSO-API-001
│   ├── README.md
│   ├── API_REFERENCE.md
│   └── openapi/
│       └── vcp-api-v1.1.yaml
│
└── vcp-market-intelligence/    # VSO-INTEL-001 + VSO-TARGET-001
    ├── README.md
    ├── Prop_Firm_Industry_Crisis_Report.md
    └── VCP_International_Target_List.md
```

---

## 📋 VC-Certified Certification Checklist

### Pre-Certification Requirements

#### Documentation Review
- [ ] Read VCP Specification v1.0
- [ ] Review SDK Specification for your language
- [ ] Study Conformance Test Guide

#### Implementation
- [ ] Implement VCP event generation
- [ ] Configure hash chain construction
- [ ] Set up signature mechanism (tier-dependent)
- [ ] Integrate with VCC API

#### Testing
- [ ] Run Schema Validation tests (25 tests)
- [ ] Run UUID v7 tests (10 tests)
- [ ] Run Timestamp tests (12 tests)
- [ ] Run Hash Chain tests (15 tests)
- [ ] Run Signature tests (10 tests)
- [ ] Run Merkle Proof tests (8 tests)
- [ ] Run Event Type tests (20 tests)
- [ ] Run Integration tests (15 tests)
- [ ] Run Performance tests (10 tests)

#### Certification Submission
- [ ] Achieve required pass rate (95%/98%/100%)
- [ ] All 12 critical tests passed
- [ ] Generate conformance report
- [ ] Prepare sample events (100+)
- [ ] Complete security assessment
- [ ] Submit to certification portal

---

## 🌐 Multi-Language Support

| Document | English | Japanese | Chinese |
|----------|---------|----------|---------|
| VCP Specification | ✅ | ✅ | ✅ |
| SDK Specification | ✅ | ⏳ | ⏳ |
| Sidecar Guide | ✅ | ✅ | ⏳ |
| Conformance Guide | ✅ | ⏳ | ⏳ |
| Example Payloads | ✅ | - | - |
| Market Intel | ✅ | ⏳ | ⏳ |

*Note: Code examples and JSON payloads are language-neutral*

---

## 📊 Regulatory Compliance Mapping

| Regulation | Relevant Documents |
|------------|-------------------|
| **EU AI Act (2026)** | VCP Spec (VCP-GOV), SDK Spec, Conformance Guide |
| **MiFID II RTS 25** | VCP Spec (ClockSyncStatus), Conformance Guide (TST-*) |
| **SEC/FINRA** | VCP Spec, API Reference, Market Intel |
| **Submissions Market Abuse** | VCP Spec, Sidecar Guide |
| **JFSA** | VCP Spec (Japanese), Target List |

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| Editorial | 2026-11-02 | Withdraw priority/production assurances from current text; label the inventory and procedures as historical reference. No specification requirement changed. |
| v1.0.0 | 2025-11-25 | Initial publication (historical description: complete conformance package) |

---

## 📞 Resources

### Official Channels
| Resource | URL |
|------------------------------|---------------------------------------------------------------------|
| Website                      | https://veritaschain.org                                           |
| Developers Integration Guide | https://veritaschain.org/vcp/developers/                           |
| VC-Certified Overview        | https://veritaschain.org/certified/                                |
| Conformance Package v1.0     | https://github.com/veritaschain/vcp-conformance-guide              |
| GitHub Organization          | https://github.com/veritaschain

### Support
| Type | Contact |
|------|---------|
| Technical Support | support@veritaschain.org |
| Certification | certification@veritaschain.org |
| Partnerships | partners@veritaschain.org |
| Press | press@veritaschain.org |

---

## 📜 Legal

**Publisher:** VeritasChain Standards Organization (VSO)  
**Legal Entity:** VeritasChain株式会社 (Japan)  
**License:** Apache License 2.0  

---

*"Verify, Don't Trust" — The foundation of algorithmic transparency*

---

## Appendix: Quick Links for README Files

### For vcp-sdk-spec/README.md

```markdown
## Testing Your Implementation

After implementing the SDK interfaces, validate your implementation:

1. **Self-Test**: Run the [VCP Conformance Test Guide](https://github.com/veritaschain/vcp-conformance)
2. **Example Data**: Use [VCP Example Payloads](https://github.com/veritaschain/vcp-conformance/examples)
3. **Certification**: Apply at [certified.veritaschain.org](https://certified.veritaschain.org)
```

### For vcp-sidecar-guide/README.md

```markdown
## After Integration

Once your Sidecar adapter is deployed:

1. **Verify**: Run Silver Tier tests from [VCP Conformance Guide](https://github.com/veritaschain/vcp-conformance)
2. **Certify**: Submit for VC-Certified (Silver) certification
3. **Upgrade**: Progress to Gold/Platinum tiers as needed
```

### For veritaschain.org/developers

```markdown
## VCP 1.0 Conformance Package

Everything you need to implement, test, and certify VCP compliance:

| Resource | Description |
|----------|-------------|
| [SDK Specification](./sdk-spec) | TypeScript, Python, MQL5 interfaces |
| [Conformance Test Guide](./conformance) | 125 certification tests |
| [Example Payloads](./examples) | Historical sample payloads |
| [Sidecar Integration](./sidecar) | FIX Protocol integration |

**Start Here**: [Quick Start Guide →](./quickstart)
```

---

*Document ID: VSO-DOCSET-001*  
*Version: 1.0.0*  
*Last Updated: 2025-11-25*
