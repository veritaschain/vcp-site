/**
 * VAP-AT Assessment Portal
 * Main Application Script
 */

// ===== State =====
let criteriaData = null;
let scores = {};
let assessmentInfo = {
    orgName: '',
    systemName: '',
    assessorName: '',
    assessorEmail: '',
    notes: ''
};

// ===== Navigation =====
function navigateTo(page) {
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Update pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(page).classList.add('active');
    
    // Close mobile menu
    closeMobileMenu();
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update URL hash
    window.location.hash = page;
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    nav.classList.toggle('open');
    btn.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.querySelector('.mobile-menu-btn');
    if (nav && btn) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Handle hash navigation
function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    navigateTo(hash);
}

// ===== Criteria Loading =====
async function loadCriteria() {
    try {
        const response = await fetch('data/criteria.json');
        criteriaData = await response.json();
        renderCriteria();
    } catch (error) {
        console.error('Failed to load criteria:', error);
        // Fallback: use embedded data
        criteriaData = getEmbeddedCriteria();
        renderCriteria();
    }
}

function getEmbeddedCriteria() {
    // Fallback criteria data (abbreviated)
    return {
        version: "1.0",
        maxScore: 20,
        criteria: [
            { id: 1, name: "Third-Party Verifiability", shortName: "Verifiability", keyQuestion: "Can external parties independently verify audit trails?", regulatoryMapping: ["EU AI Act Art.12/19", "MiFID II"], scoringGuide: { "0": "No external verification capability.", "1": "Partial verification possible.", "2": "Full third-party verification with cryptographic proofs." }, evidenceExamples: ["Merkle tree root hashes", "Ed25519 signed logs", "Third-party API"] },
            { id: 2, name: "Tamper Evidence", shortName: "Tamper Evidence", keyQuestion: "Can unauthorized modifications be detected?", regulatoryMapping: ["SEC 17a-4"], scoringGuide: { "0": "No tamper detection.", "1": "Basic checksums present.", "2": "Hash chains or blockchain anchoring." }, evidenceExamples: ["Hash chain linking", "Blockchain anchoring", "Write-once storage"] },
            { id: 3, name: "Sequence Fixation", shortName: "Sequence", keyQuestion: "Is chronological order immutably recorded?", regulatoryMapping: ["MiFID II RTS 25"], scoringGuide: { "0": "No sequence guarantee.", "1": "Timestamps present but not fixed.", "2": "UUIDv7 or cryptographic sequence." }, evidenceExamples: ["UUIDv7 identifiers", "Monotonic sequence numbers", "Trusted timestamping"] },
            { id: 4, name: "Decision Provenance", shortName: "Provenance", keyQuestion: "Can decision inputs and rationale be traced?", regulatoryMapping: ["EU AI Act Art.12"], scoringGuide: { "0": "No decision tracking.", "1": "Partial input logging.", "2": "Full provenance trail." }, evidenceExamples: ["Input snapshots", "Model version logging", "Explainability metadata"] },
            { id: 5, name: "Responsibility Boundaries", shortName: "Responsibility", keyQuestion: "Are approvers and overriders clear?", regulatoryMapping: ["EU AI Act Art.14"], scoringGuide: { "0": "No attribution.", "1": "Partial attribution.", "2": "Full attribution with justification." }, evidenceExamples: ["User ID logging", "Approval workflows", "Exception handling trail"] },
            { id: 6, name: "Documentation Completeness", shortName: "Documentation", keyQuestion: "Is documentation complete and current?", regulatoryMapping: ["EU AI Act Annex IV"], scoringGuide: { "0": "No or outdated documentation.", "1": "Partial documentation.", "2": "Complete and version-controlled." }, evidenceExamples: ["Architecture docs", "Data flow diagrams", "Risk assessments"] },
            { id: 7, name: "Retention & Availability", shortName: "Retention", keyQuestion: "Is evidence retained for required periods?", regulatoryMapping: ["EU AI Act Art.19", "GDPR", "MiFID II"], scoringGuide: { "0": "No retention policy.", "1": "Partial compliance.", "2": "6+ months with verified retrieval." }, evidenceExamples: ["Retention policy", "Automated enforcement", "Retrieval SLA"] },
            { id: 8, name: "Time Synchronization", shortName: "Time Sync", keyQuestion: "Is system time synchronized?", regulatoryMapping: ["MiFID II RTS 25"], scoringGuide: { "0": "No synchronization.", "1": "Basic NTP.", "2": "High-precision PTP with monitoring." }, evidenceExamples: ["NTP/PTP config", "Drift monitoring", "Sync audit logs"] },
            { id: 9, name: "Failure & Recovery Logging", shortName: "Failure Logging", keyQuestion: "Are failures and recoveries logged?", regulatoryMapping: ["DORA"], scoringGuide: { "0": "No failure logging.", "1": "Basic error logging.", "2": "Comprehensive with root cause." }, evidenceExamples: ["Error framework", "Incident trail", "Post-incident reviews"] },
            { id: 10, name: "Right to Erasure Compatibility", shortName: "Erasure", keyQuestion: "Can GDPR erasure be supported?", regulatoryMapping: ["GDPR Art.17"], scoringGuide: { "0": "No erasure capability.", "1": "Basic erasure with gaps.", "2": "Crypto-shredding with audit integrity." }, evidenceExamples: ["Crypto-shredding", "Key management", "Erasure procedures"] }
        ],
        gradeThresholds: [
            { min: 16, max: 20, grade: "Strong", color: "#22c55e" },
            { min: 11, max: 15, grade: "Moderate", color: "#eab308" },
            { min: 6, max: 10, grade: "Limited", color: "#f97316" },
            { min: 0, max: 5, grade: "Inadequate", color: "#ef4444" }
        ],
        thresholdDesignations: [
            { minScore: 16, label: "EU AI Act Art.12/19 aligned", shortLabel: "EU AI Act Art.12/19 aligned" },
            { minScore: 14, label: "MiFID II RTS 25 aligned", shortLabel: "MiFID II RTS 25 aligned" },
            { minScore: 11, label: "Baseline Auditability", shortLabel: "Baseline Auditability" }
        ],
        disclaimer: "Threshold Designations are interpretive labels, not legal compliance guarantees."
    };
}

// ===== Render Criteria =====
function renderCriteria() {
    const container = document.getElementById('criteriaList');
    if (!container || !criteriaData) return;
    
    container.innerHTML = criteriaData.criteria.map(criterion => {
        // Get translated content
        const cKey = `c${criterion.id}`;
        const name = t(`criteria.${cKey}.name`) !== `criteria.${cKey}.name` 
            ? t(`criteria.${cKey}.name`) 
            : criterion.name;
        const question = t(`criteria.${cKey}.question`) !== `criteria.${cKey}.question`
            ? t(`criteria.${cKey}.question`)
            : criterion.keyQuestion;
        
        return `
        <div class="criterion-card" data-id="${criterion.id}">
            <div class="criterion-header" onclick="toggleCriterion(${criterion.id})">
                <div class="criterion-number">${criterion.id}</div>
                <div class="criterion-title">
                    <h4>${name}</h4>
                    <p>${criterion.regulatoryMapping.join(', ')}</p>
                </div>
                <span class="criterion-score-badge" id="badge-${criterion.id}">${t('assessment.notScored')}</span>
                <svg class="criterion-expand" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <div class="criterion-body">
                <div class="criterion-question">
                    <strong>${t('assessment.keyQuestion')}:</strong> ${question}
                </div>
                <div class="score-options">
                    ${[0, 1, 2].map(score => {
                        const scoreText = t(`criteria.${cKey}.s${score}`) !== `criteria.${cKey}.s${score}`
                            ? t(`criteria.${cKey}.s${score}`)
                            : criterion.scoringGuide[score];
                        return `
                        <label class="score-option" onclick="selectScore(${criterion.id}, ${score})">
                            <input type="radio" name="criterion-${criterion.id}" value="${score}">
                            <span class="score-dot score-${score}">${score}</span>
                            <span class="score-option-text">${scoreText}</span>
                        </label>
                    `}).join('')}
                </div>
                <div class="criterion-evidence">
                    <h5>${t('assessment.evidenceExamples')}</h5>
                    <ul>
                        ${criterion.evidenceExamples.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `}).join('');
}

function toggleCriterion(id) {
    const card = document.querySelector(`.criterion-card[data-id="${id}"]`);
    if (card) {
        card.classList.toggle('expanded');
    }
}

// ===== Scoring =====
function selectScore(criterionId, score) {
    scores[criterionId] = score;
    
    // Update UI
    const card = document.querySelector(`.criterion-card[data-id="${criterionId}"]`);
    const badge = document.getElementById(`badge-${criterionId}`);
    
    // Update score options
    card.querySelectorAll('.score-option').forEach((opt, idx) => {
        opt.classList.toggle('selected', idx === score);
    });
    
    // Update badge
    badge.textContent = `${t('assessment.score')}: ${score}`;
    badge.className = `criterion-score-badge score-${score}`;
    
    // Recalculate total
    updateTotalScore();
}

function updateTotalScore() {
    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const answered = Object.keys(scores).length;
    const maxScore = criteriaData ? criteriaData.maxScore : 20;
    const totalCriteria = criteriaData ? criteriaData.criteria.length : 10;
    
    // Update score display
    document.getElementById('totalScore').textContent = total;
    
    // Update mobile score
    const mobileScore = document.getElementById('mobileScore');
    if (mobileScore) mobileScore.textContent = total;
    
    // Update ring progress
    const progress = document.getElementById('scoreProgress');
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (total / maxScore) * circumference;
    progress.style.strokeDashoffset = offset;
    
    // Update grade
    const grade = getGrade(total);
    const gradeLabel = document.getElementById('gradeLabel');
    const translatedGrade = t(`grades.${grade.grade.toLowerCase()}`);
    const gradeText = translatedGrade !== `grades.${grade.grade.toLowerCase()}` ? translatedGrade : grade.grade;
    gradeLabel.textContent = gradeText;
    gradeLabel.className = `grade-badge grade-${grade.grade.toLowerCase()}`;
    
    // Update mobile grade
    const mobileGrade = document.getElementById('mobileGrade');
    if (mobileGrade) {
        mobileGrade.textContent = gradeText;
        mobileGrade.className = `mobile-score-grade grade-${grade.grade.toLowerCase()}`;
    }
    
    // Update progress bar
    const progressPercent = (answered / totalCriteria) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressCount').textContent = t('assessment.criteriaCount').replace('{0}', answered);
    
    // Update ring color
    progress.style.stroke = grade.color;
    
    // Update designations
    updateDesignations(total);
}

// Scroll to score panel (mobile)
function scrollToScorePanel() {
    const panel = document.querySelector('.score-panel');
    if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function getGrade(score) {
    if (!criteriaData) return { grade: 'Inadequate', color: '#ef4444' };
    
    for (const threshold of criteriaData.gradeThresholds) {
        if (score >= threshold.min && score <= threshold.max) {
            return threshold;
        }
    }
    return criteriaData.gradeThresholds[criteriaData.gradeThresholds.length - 1];
}

function updateDesignations(score) {
    const designationLabels = [
        { minScore: 16, key: 'euAiAct' },
        { minScore: 14, key: 'mifid' },
        { minScore: 11, key: 'baseline' }
    ];
    
    const listHtml = designationLabels.map(d => {
        const active = score >= d.minScore;
        const label = t(`designations.${d.key}`);
        return `
            <div class="designation-item ${active ? 'active' : 'inactive'}">
                <span class="designation-check">${active ? '✓' : '○'}</span>
                <span>${label} (${d.minScore}+)</span>
            </div>
        `;
    }).join('');
    
    document.getElementById('designationList').innerHTML = listHtml;
}

// ===== Report Generation =====
function generateReport() {
    collectAssessmentInfo();
    
    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const grade = getGrade(total);
    const designations = getAchievedDesignations(total);
    
    // Use jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('VAP-AT Score Report', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('VAP-AT Level 1 (Self-Assessment Tool)', 20, 32);
    
    // Assessment Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Assessment Information', 20, 50);
    
    doc.setFontSize(10);
    const infoY = 58;
    doc.text(`Organization: ${assessmentInfo.orgName || 'Not specified'}`, 20, infoY);
    doc.text(`System: ${assessmentInfo.systemName || 'Not specified'}`, 20, infoY + 6);
    doc.text(`Assessor: ${assessmentInfo.assessorName || 'Not specified'}`, 20, infoY + 12);
    doc.text(`Date: ${new Date().toISOString().split('T')[0]}`, 20, infoY + 18);
    doc.text(`Assessment ID: ${generateUUID()}`, 20, infoY + 24);
    
    // Score Summary
    doc.setFontSize(12);
    doc.text('Score Summary', 20, 95);
    
    doc.setFontSize(24);
    doc.setTextColor(grade.color.replace('#', '0x'));
    doc.text(`${total}/20`, 20, 108);
    
    doc.setFontSize(14);
    doc.text(`Grade: ${grade.grade}`, 60, 108);
    
    // Threshold Designations
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text('Threshold Designations:', 20, 120);
    
    if (designations.length > 0) {
        designations.forEach((d, i) => {
            doc.text(`✓ ${d.label}`, 25, 128 + (i * 6));
        });
    } else {
        doc.text('None achieved', 25, 128);
    }
    
    // Criteria Scores
    doc.setFontSize(12);
    doc.text('Criterion-by-Criterion Scores', 20, 150);
    
    doc.setFontSize(9);
    let y = 160;
    criteriaData.criteria.forEach((c, i) => {
        const score = scores[c.id] !== undefined ? scores[c.id] : '-';
        const scoreText = score === '-' ? 'Not scored' : `${score}/2`;
        doc.text(`${c.id}. ${c.name}`, 20, y);
        doc.text(scoreText, 170, y);
        y += 6;
        
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
    });
    
    // Disclaimer
    doc.setFontSize(8);
    doc.setTextColor(150);
    const disclaimerY = y + 15;
    doc.text('DISCLAIMER: This is VAP-AT Level 1 (Self-Assessment Tool). Results are preliminary and not', 20, disclaimerY);
    doc.text('independently verified. Threshold Designations are interpretive labels, not legal compliance', 20, disclaimerY + 4);
    doc.text('guarantees. This result does not constitute regulatory approval or conformity determination.', 20, disclaimerY + 8);
    
    // Footer
    doc.setFontSize(8);
    doc.text('VAP-AT Level 1 Self-Assessment Tool | veritaschain.org', 20, 290);
    
    // Save
    const filename = `VAP-AT_ScoreReport_${assessmentInfo.systemName || 'Assessment'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}

function getAchievedDesignations(score) {
    if (!criteriaData) return [];
    return criteriaData.thresholdDesignations.filter(d => score >= d.minScore);
}

// ===== Evidence Pack Download =====
function downloadEvidence() {
    collectAssessmentInfo();
    
    const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const grade = getGrade(total);
    const designations = getAchievedDesignations(total);
    
    const evidencePack = {
        // Evidence Pack v1.0 Schema
        "$schema": "https://veritaschain.org/schemas/evidence-pack-v1.0.json",
        "evidence_pack_version": "1.0",
        
        assessment: {
            type: "VAP-AT Level 1 (Self-Assessment Tool)",
            id: generateUUID(),
            timestamp: new Date().toISOString(),
            status: "Preliminary"
        },
        
        entity: {
            organization_name: assessmentInfo.orgName || null,
            system_name: assessmentInfo.systemName || null
        },
        
        assessor: {
            name: assessmentInfo.assessorName || null,
            email: assessmentInfo.assessorEmail || null,
            type: "Self-Assessment"
        },
        
        results: {
            total_score: total,
            max_score: 20,
            grade: grade.grade,
            threshold_designations: designations.map(d => ({
                label: d.label,
                min_score: d.minScore
            }))
        },
        
        criterion_scores: criteriaData.criteria.map(c => ({
            criterion_id: c.id,
            criterion_name: c.name,
            score: scores[c.id] !== undefined ? scores[c.id] : null,
            max_score: 2,
            regulatory_mapping: c.regulatoryMapping
        })),
        
        additional_notes: assessmentInfo.notes || null,
        
        legal: {
            disclaimer: "This is VAP-AT Level 1 (Self-Assessment Tool). Results are preliminary and not independently verified. Threshold Designations are interpretive labels, not legal compliance guarantees. This result is an assessment score and does not constitute regulatory approval or conformity determination.",
            license: "CC BY 4.0"
        },
        
        metadata: {
            tool_name: "VAP-AT Level 1 Self-Assessment Tool",
            tool_version: "1.0",
            criteria_version: criteriaData.version,
            issuer: "VeritasChain Standards Organization",
            issuer_url: "https://veritaschain.org"
        }
    };
    
    const dataStr = JSON.stringify(evidencePack, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `VAP-AT_EvidencePack_v1.0_${assessmentInfo.systemName || 'Assessment'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== Reset Assessment =====
function resetAssessment() {
    if (!confirm(t('confirm.reset'))) {
        return;
    }
    
    scores = {};
    assessmentInfo = { orgName: '', systemName: '', assessorName: '', assessorEmail: '', notes: '' };
    
    // Clear form inputs
    document.getElementById('orgName').value = '';
    document.getElementById('systemName').value = '';
    document.getElementById('assessorName').value = '';
    document.getElementById('assessorEmail').value = '';
    document.getElementById('assessmentNotes').value = '';
    
    // Reset criteria cards
    document.querySelectorAll('.criterion-card').forEach(card => {
        card.classList.remove('expanded');
        card.querySelectorAll('.score-option').forEach(opt => opt.classList.remove('selected'));
    });
    
    // Reset badges
    document.querySelectorAll('.criterion-score-badge').forEach(badge => {
        badge.textContent = t('assessment.notScored');
        badge.className = 'criterion-score-badge';
    });
    
    // Reset score display
    updateTotalScore();
}

// ===== Utility Functions =====
function collectAssessmentInfo() {
    assessmentInfo.orgName = document.getElementById('orgName')?.value || '';
    assessmentInfo.systemName = document.getElementById('systemName')?.value || '';
    assessmentInfo.assessorName = document.getElementById('assessorName')?.value || '';
    assessmentInfo.assessorEmail = document.getElementById('assessorEmail')?.value || '';
    assessmentInfo.notes = document.getElementById('assessmentNotes')?.value || '';
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// ===== Documentation Navigation =====
function initDocsNav() {
    document.querySelectorAll('.docs-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const docId = link.dataset.doc;
            
            // Update nav
            document.querySelectorAll('.docs-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update content
            document.querySelectorAll('.doc-article').forEach(a => a.classList.remove('active'));
            document.getElementById(`doc-${docId}`).classList.add('active');
        });
    });
}

// ===== Registry Filter =====
function initRegistryFilter() {
    document.querySelectorAll('.filter-chips .chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            // Filter logic would go here for real data
        });
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize language first
    initLanguage();
    
    // Load criteria
    loadCriteria();
    
    // Initialize navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.dataset.page);
        });
    });
    
    // Handle initial hash
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    // Initialize docs nav
    initDocsNav();
    
    // Initialize registry filter
    initRegistryFilter();
    
    // Initialize language selector
    initLangSelector();
    
    // Initialize score display
    updateTotalScore();
    
    // Apply initial translations
    applyTranslations();
});

// ===== Language Selector =====
function initLangSelector() {
    // Language option clicks
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            setLanguage(opt.dataset.lang);
            closeLangMenu();
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-selector')) {
            closeLangMenu();
        }
    });
}

function toggleLangMenu() {
    const menu = document.getElementById('langMenu');
    menu.classList.toggle('open');
}

function closeLangMenu() {
    const menu = document.getElementById('langMenu');
    menu.classList.remove('open');
}

function updateLangSelector() {
    const langNames = { en: 'EN', ja: 'JA', zh: 'ZH', es: 'ES' };
    document.getElementById('currentLangName').textContent = langNames[currentLang] || 'EN';
    
    // Update active state
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === currentLang);
    });
}

// ===== Apply Translations =====
function applyTranslations() {
    // Update HTML lang attribute
    document.documentElement.lang = t('meta.lang');
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.dataset.page;
        if (page) {
            link.textContent = t(`nav.${page}`);
        }
    });
    
    // Hero section
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.innerHTML = `${t('hero.title1')}<br><span class="gradient-text">${t('hero.title2')}</span>`;
    }
    
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.innerHTML = t('hero.subtitle');
    }
    
    // Hero buttons
    const startBtn = document.querySelector('.hero-actions .btn-primary');
    if (startBtn) {
        startBtn.innerHTML = `${t('hero.startBtn')} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    }
    
    const docsBtn = document.querySelector('.hero-actions .btn-secondary');
    if (docsBtn) {
        docsBtn.textContent = t('hero.docsBtn');
    }
    
    // Features
    const featureCards = document.querySelectorAll('.feature-card');
    const featureKeys = ['score', 'regulatory', 'evidence', 'threshold'];
    featureCards.forEach((card, i) => {
        if (featureKeys[i]) {
            const h3 = card.querySelector('h3');
            const p = card.querySelector('p');
            if (h3) h3.textContent = t(`features.${featureKeys[i]}.title`);
            if (p) p.textContent = t(`features.${featureKeys[i]}.desc`);
        }
    });
    
    // Philosophy
    const philosophyQuote = document.querySelector('.philosophy blockquote');
    if (philosophyQuote) {
        philosophyQuote.innerHTML = `<span class="quote-mark">"</span>${t('philosophy.quote')}<span class="quote-mark">"</span>`;
    }
    const philosophyDesc = document.querySelector('.philosophy p');
    if (philosophyDesc) {
        philosophyDesc.textContent = t('philosophy.desc');
    }
    
    // Assessment section
    const assessmentHeader = document.querySelector('.form-header h2');
    if (assessmentHeader) assessmentHeader.textContent = t('assessment.title');
    
    const assessmentSubtitle = document.querySelector('.form-header p');
    if (assessmentSubtitle) assessmentSubtitle.textContent = t('assessment.subtitle');
    
    // Form labels
    const formSections = document.querySelectorAll('.form-section h3');
    if (formSections[0]) formSections[0].textContent = t('assessment.systemInfo');
    if (formSections[1]) formSections[1].textContent = t('assessment.criteria');
    if (formSections[2]) formSections[2].textContent = t('assessment.notes');
    
    // Form inputs
    updateFormLabel('orgName', t('assessment.orgName'), t('assessment.orgPlaceholder'));
    updateFormLabel('systemName', t('assessment.systemName'), t('assessment.systemPlaceholder'));
    updateFormLabel('assessorName', t('assessment.assessorName'), t('assessment.assessorPlaceholder'));
    updateFormLabel('assessorEmail', t('assessment.assessorEmail'), t('assessment.emailPlaceholder'));
    
    const notesTextarea = document.getElementById('assessmentNotes');
    if (notesTextarea) {
        notesTextarea.placeholder = t('assessment.notesPlaceholder');
    }
    
    // Progress
    const progressLabel = document.querySelector('.progress-header span:first-child');
    if (progressLabel) progressLabel.textContent = t('assessment.progress');
    
    // Threshold designations title
    const designationsTitle = document.querySelector('.designations h4');
    if (designationsTitle) designationsTitle.textContent = t('assessment.thresholdDesignations');
    
    // Buttons
    const buttons = document.querySelectorAll('.score-actions .btn');
    if (buttons[0]) buttons[0].innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> ${t('assessment.generateReport')}`;
    if (buttons[1]) buttons[1].innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> ${t('assessment.downloadEvidence')}`;
    if (buttons[2]) buttons[2].textContent = t('assessment.reset');
    
    // Disclaimer
    const disclaimer = document.querySelector('.disclaimer p');
    if (disclaimer) disclaimer.innerHTML = `<strong>⚠️ Disclaimer:</strong> ${t('assessment.disclaimer')}`;
    
    // Registry
    const registryTitle = document.querySelector('.registry-header h2');
    if (registryTitle) registryTitle.textContent = t('registry.title');
    
    const registrySubtitle = document.querySelector('.registry-header p');
    if (registrySubtitle) registrySubtitle.textContent = t('registry.subtitle');
    
    const searchInput = document.getElementById('registrySearch');
    if (searchInput) searchInput.placeholder = t('registry.search');
    
    // Registry table headers
    const tableHeaders = document.querySelectorAll('.registry-table th');
    const headerKeys = ['organization', 'system', 'grade', 'level', 'cab', 'validUntil', 'status'];
    tableHeaders.forEach((th, i) => {
        if (headerKeys[i]) th.textContent = t(`registry.${headerKeys[i]}`);
    });
    
    // Registry note
    const registryNote = document.querySelector('.registry-note p');
    if (registryNote) registryNote.innerHTML = `📋 <strong>Note:</strong> ${t('registry.note')}`;
    
    // Filter chips
    const filterChips = document.querySelectorAll('.filter-chips .chip');
    const chipKeys = ['all', 'strong', 'moderate', 'limited'];
    filterChips.forEach((chip, i) => {
        if (chipKeys[i]) {
            chip.textContent = chipKeys[i] === 'all' ? t('registry.all') : t(`grades.${chipKeys[i]}`);
        }
    });
    
    // Docs sidebar
    const docsTitle = document.querySelector('.docs-sidebar h3');
    if (docsTitle) docsTitle.textContent = t('docs.title');
    
    const docsLinks = document.querySelectorAll('.docs-link');
    const docKeys = ['overview', 'scoring', 'levels', 'designations', 'governance', 'faq'];
    docsLinks.forEach((link, i) => {
        if (docKeys[i]) link.textContent = t(`docs.${docKeys[i]}`);
    });
    
    const downloadBtn = document.querySelector('.docs-download .btn');
    if (downloadBtn) downloadBtn.textContent = t('docs.download');
    
    // Footer
    const footerBy = document.querySelector('.footer-brand .text-muted');
    if (footerBy) footerBy.textContent = t('footer.by');
    
    const footerLinks = document.querySelectorAll('.footer-links a');
    if (footerLinks[1]) footerLinks[1].textContent = t('footer.contact');
    
    const footerCopyright = document.querySelector('.footer-legal p');
    if (footerCopyright) footerCopyright.textContent = t('footer.copyright');
    
    // Re-render criteria with translations
    if (criteriaData) {
        renderCriteria();
        // Restore scores
        Object.entries(scores).forEach(([id, score]) => {
            const card = document.querySelector(`.criterion-card[data-id="${id}"]`);
            if (card) {
                const badge = document.getElementById(`badge-${id}`);
                if (badge) {
                    badge.textContent = `${t('assessment.score')}: ${score}`;
                    badge.className = `criterion-score-badge score-${score}`;
                }
                card.querySelectorAll('.score-option').forEach((opt, idx) => {
                    opt.classList.toggle('selected', idx === score);
                });
            }
        });
        updateTotalScore();
    }
    
    // Update lang selector
    updateLangSelector();
}

function updateFormLabel(inputId, label, placeholder) {
    const input = document.getElementById(inputId);
    if (input) {
        const labelEl = input.previousElementSibling;
        if (labelEl && labelEl.tagName === 'LABEL') {
            labelEl.textContent = label;
        }
        input.placeholder = placeholder;
    }
}
