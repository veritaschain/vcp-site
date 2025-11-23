import { Hono } from 'hono'
import { renderer } from './renderer'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

app.use(renderer)

app.get('/', (c) => {
  return c.render(
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🔱</span>
            <span>VeritasChain Standards Organization (VSO)</span>
          </div>
          <h1 className="hero-title">
            VeritasChain Protocol (VCP)
          </h1>
          <p className="hero-subtitle">
            アルゴリズム取引とAI駆動型取引の「意思決定」と「実行結果」を検証可能な形式で記録
          </p>
          <p className="hero-tagline">
            "Encoding Trust in the Algorithmic Age" — アルゴリズム時代の信頼をコード化する
          </p>
          <div className="hero-cta">
            <a href="https://github.com/VeritasChain/vcp-spec" className="btn btn-primary" target="_blank" rel="noopener">
              <i className="fas fa-book"></i> View Specification
            </a>
            <a href="https://support.veritaschain.org" className="btn btn-secondary" target="_blank" rel="noopener">
              <i className="fas fa-life-ring"></i> Technical Support
            </a>
          </div>
        </div>
      </section>

      {/* What is VCP Section */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">VeritasChain Protocol (VCP) とは</h2>
          <div className="vcp-description">
            <p>
              VeritasChain Protocol (VCP) は、アルゴリズム取引やAI駆動型取引における<strong>「意思決定」</strong>と<strong>「実行結果」</strong>をシステムに上げるためのオープンプロトコルです。改ざん不可能、または改ざんを検知できる監査証跡を形成し、<strong>MiFID II</strong>、<strong>EU AI Act</strong>、<strong>CAT (Consolidated Audit Trail)</strong> など国際的な規制基準への準拠をサポートし、RobTech / Audit / Compliance において不可欠なものです。
            </p>
          </div>
          <p className="vcp-english">
            VCP is an open protocol for recording the "decision-making" and "execution results" of algorithms and AI-driven trading in an immutable and verifiable format, designed to support global regulatory requirements such as MiFID II, EU AI Act, and CAT.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="section section-dark">
        <div className="container">
          <h2 className="section-title">主要機能</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Immutable & Verifiable</h3>
              <p>暗号署名とMerkle Treeによる改ざん不可能な監査証跡</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Crypto Agility</h3>
              <p>Ed25519から量子耐性暗号(Dilithium)への移行対応</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3>Regulatory Compliance</h3>
              <p>MiFID II、EU AI Act、CAT等の国際規制に対応</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Multi-Tier Support</h3>
              <p>Silver/Gold/Platinumの3段階コンプライアンス</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>FIX Protocol Integration</h3>
              <p>既存FIXエンジンとシームレスに連携</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Open Standard</h3>
              <p>オープンソース・オープンスタンダード</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">技術スタック</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <div className="tech-label">Event ID</div>
              <div className="tech-value">UUIDv7 (時系列順序保証)</div>
            </div>
            <div className="tech-item">
              <div className="tech-label">Signature</div>
              <div className="tech-value">Ed25519 / ECDSA / Dilithium (PQC)</div>
            </div>
            <div className="tech-item">
              <div className="tech-label">Verification</div>
              <div className="tech-value">Merkle Tree + Chain Validation</div>
            </div>
            <div className="tech-item">
              <div className="tech-label">Timestamp</div>
              <div className="tech-value">PTP (IEEE 1588) / NTP Sync</div>
            </div>
            <div className="tech-item">
              <div className="tech-label">Integration</div>
              <div className="tech-value">FIX Protocol Sidecar</div>
            </div>
            <div className="tech-item">
              <div className="tech-label">Storage</div>
              <div className="tech-value">SBE / JSON / Parquet</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section section-dark">
        <div className="container">
          <h2 className="section-title">ユースケース</h2>
          <div className="usecases-grid">
            <div className="usecase-card">
              <h3>🚀 HFT / Algorithmic Trading</h3>
              <p>高頻度取引・アルゴリズムトレーディングの完全監査証跡</p>
            </div>
            <div className="usecase-card">
              <h3>💎 Crypto Exchanges</h3>
              <p>暗号資産取引所の透明性確保とコンプライアンス対応</p>
            </div>
            <div className="usecase-card">
              <h3>🏛️ Prop Firm Certification</h3>
              <p>プロップファームのトレーダー成績認証</p>
            </div>
            <div className="usecase-card">
              <h3>📊 Regulatory Reporting</h3>
              <p>MiFID II RTS 25等の規制報告書自動生成</p>
            </div>
          </div>
        </div>
      </section>

      {/* VC-Certified Section */}
      <section className="section section-certified">
        <div className="container">
          <div className="certified-badge">
            <span className="cert-icon">✓</span>
          </div>
          <h2 className="section-title">VeritasChain Certified (VC-Certified)</h2>
          <p className="certified-subtitle">VCP Compliance Certification</p>
          <p className="certified-description">
            VeritasChain株式会社（英語名: VeritasChain Inc.）は、全世界でおよびアルゴリズム取引に対する認証プログラム <strong>VC-Certified</strong> を運営し、AI安全性とReg Tech / Fin Tech事業での標準化を促進する「VeritasChain Certified (VC-Certified)」認証を提供します。
          </p>
          <p className="certified-english">
            VeritasChain Inc. (VeritasChain株式会社) hosts the VeritasChain Protocol (VCP) standard and runs the VeritasChain Certified (VC-Certified) program.
          </p>
        </div>
      </section>

      {/* Company Section */}
      <section className="section section-light">
        <div className="container">
          <h2 className="section-title">VeritasChain Inc. / VeritasChain株式会社 (設立準備中)</h2>
          <p className="company-description">
            VeritasChain Inc. (VeritasChain株式会社) は、Reg Tech / Fin Tech企業として全世界でアルゴリズム監査とAI駆動型取引の標準化を目指します。VCPの標準化を通じて、コンプライアンスを提供し、準拠するアルゴリズムやシステムに対して「VeritasChain Certified (VC-Certified)」認証を行います。
          </p>
          <p className="company-english">
            VeritasChain Inc. (VeritasChain株式会社) is a Reg Tech / Fin Tech company focusing on transparency, auditability, and compliance for algorithmic and AI-driven trading. The company will own the VeritasChain Protocol (VCP) standard and run the VeritasChain Certified (VC-Certified) program.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section section-dark">
        <div className="container">
          <h2 className="section-title">お問い合わせ</h2>
          <p className="contact-description">
            メディアパートナーシップ・技術連携窓口に関するお問い合わせは、以下までご連絡ください。
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>メール: <a href="mailto:info@veritaschain.org">info@veritaschain.org</a></span>
            </div>
          </div>
          <p className="contact-english">
            For media inquiries, partnership opportunities, or technical collaboration, please contact us at <a href="mailto:info@veritaschain.org">info@veritaschain.org</a>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 VeritasChain Inc. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
})

export default app
