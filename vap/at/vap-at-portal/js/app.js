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
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update URL hash
    window.location.hash = page;
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
            { minScore: 16, label: "EU AI Act Art.12/19 aligned", shortLabel: "EU AI Act Aligned" },
            { minScore: 14, label: "MiFID II RTS 25 aligned", shortLabel: "MiFID II Aligned" },
            { minScore: 11, label: "Baseline Auditability", shortLabel: "Baseline" }
        ],
        disclaimer: "Threshold Designations are interpretive labels, not legal compliance guarantees."
    };
}

// ===== Render Criteria =====
function renderCriteria() {
    const container = document.getElementById('criteriaList');
    if (!container || !criteriaData) return;
    
    container.innerHTML = criteriaData.criteria.map(criterion => `
        <div class="criterion-card" data-id="${criterion.id}">
            <div class="criterion-header" onclick="toggleCriterion(${criterion.id})">
                <div class="criterion-number">${criterion.id}</div>
                <div class="criterion-title">
                    <h4>${criterion.name}</h4>
                    <p>${criterion.regulatoryMapping.join(', ')}</p>
                </div>
                <span class="criterion-score-badge" id="badge-${criterion.id}">Not Scored</span>
                <svg class="criterion-expand" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <div class="criterion-body">
                <div class="criterion-question">
                    <strong>Key Question:</strong> ${criterion.keyQuestion}
                </div>
                <div class="score-options">
                    ${[0, 1, 2].map(score => `
                        <label class="score-option" onclick="selectScore(${criterion.id}, ${score})">
                            <input type="radio" name="criterion-${criterion.id}" value="${score}">
                            <span class="score-dot score-${score}">${score}</span>
                            <span class="score-option-text">${criterion.scoringGuide[score]}</span>
                        </label>
                    `).join('')}
                </div>
                <div class="criterion-evidence">
                    <h5>Evidence Examples</h5>
                    <ul>
                        ${criterion.evidenceExamples.map(ex => `<li>${ex}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `).join('');
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
    badge.textContent = `Score: ${score}`;
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
    
    // Update ring progress
    const progress = document.getElementById('scoreProgress');
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (total / maxScore) * circumference;
    progress.style.strokeDashoffset = offset;
    
    // Update grade
    const grade = getGrade(total);
    const gradeLabel = document.getElementById('gradeLabel');
    gradeLabel.textContent = grade.grade;
    gradeLabel.className = `grade-badge grade-${grade.grade.toLowerCase()}`;
    
    // Update progress bar
    const progressPercent = (answered / totalCriteria) * 100;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;
    document.getElementById('progressCount').textContent = `${answered}/${totalCriteria} criteria`;
    
    // Update ring color
    progress.style.stroke = grade.color;
    
    // Update designations
    updateDesignations(total);
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
    const designations = criteriaData ? criteriaData.thresholdDesignations : [];
    const listHtml = designations.map(d => {
        const active = score >= d.minScore;
        return `
            <div class="designation-item ${active ? 'active' : 'inactive'}">
                <span class="designation-check">${active ? '✓' : '○'}</span>
                <span>${d.shortLabel} (${d.minScore}+)</span>
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
    doc.text('VAP-AT Assessment Report', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Verifiable AI Provenance - Assessment Test (Level 1: Self)', 20, 32);
    
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
    doc.text('DISCLAIMER: This is a self-assessment (VAP-AT Level 1). Results are preliminary and not', 20, disclaimerY);
    doc.text('independently verified. Threshold Designations are interpretive labels within the VAP-AT', 20, disclaimerY + 4);
    doc.text('scheme and are NOT guarantees of legal compliance.', 20, disclaimerY + 8);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Generated by VAP-AT Assessment Portal | veritaschain.org', 20, 290);
    
    // Save
    const filename = `VAP-AT_Report_${assessmentInfo.systemName || 'Assessment'}_${new Date().toISOString().split('T')[0]}.pdf`;
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
        schema_version: "1.0",
        assessment_type: "VAP-AT Level 1 (Self-Assessment)",
        assessment_id: generateUUID(),
        timestamp: new Date().toISOString(),
        status: "Preliminary",
        
        organization: {
            name: assessmentInfo.orgName || null,
            system_name: assessmentInfo.systemName || null
        },
        
        assessor: {
            name: assessmentInfo.assessorName || null,
            email: assessmentInfo.assessorEmail || null,
            type: "Self"
        },
        
        score_summary: {
            total_score: total,
            max_score: 20,
            grade: grade.grade,
            threshold_designations: designations.map(d => d.label)
        },
        
        criterion_scores: criteriaData.criteria.map(c => ({
            id: c.id,
            name: c.name,
            score: scores[c.id] !== undefined ? scores[c.id] : null,
            max_score: 2,
            regulatory_mapping: c.regulatoryMapping
        })),
        
        notes: assessmentInfo.notes || null,
        
        disclaimer: criteriaData.disclaimer,
        
        metadata: {
            portal_version: "1.0",
            criteria_version: criteriaData.version,
            generated_by: "VAP-AT Assessment Portal",
            organization: "VeritasChain Standards Organization"
        }
    };
    
    const dataStr = JSON.stringify(evidencePack, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `VAP-AT_Evidence_${assessmentInfo.systemName || 'Assessment'}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== Reset Assessment =====
function resetAssessment() {
    if (!confirm('Are you sure you want to reset all scores? This cannot be undone.')) {
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
        badge.textContent = 'Not Scored';
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
    
    // Initialize score display
    updateTotalScore();
});
