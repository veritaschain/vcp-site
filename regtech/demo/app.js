// ============================================
// VCP Tamper-Evidence Demo v2 - Enhanced Implementation
// Uses Web Crypto API (crypto.subtle.digest)
// ============================================

const GENESIS_HASH = 'GENESIS';
let originalEvents = [];
let tamperedEvents = [];
let tamperInfo = null;
let lastVerificationResult = null;
let verificationTarget = null; // 'original' or 'tampered'

// DOM Elements
const btnGenerate = document.getElementById('btnGenerate');
const btnTamper = document.getElementById('btnTamper');
const btnVerify = document.getElementById('btnVerify');
const btnVerifyOriginal = document.getElementById('btnVerifyOriginal');
const btnReset = document.getElementById('btnReset');
const btnEvidence = document.getElementById('btnEvidence');
const tamperType = document.getElementById('tamperType');
const originalLog = document.getElementById('originalLog');
const tamperedLog = document.getElementById('tamperedLog');
const verifyResult = document.getElementById('verifyResult');

// ============================================
// Utility Functions
// ============================================

// Generate UUIDv7-like ID (time-sortable)
function generateEventId() {
    const timestamp = Date.now();
    const hex = timestamp.toString(16).padStart(12, '0');
    const random = Array.from({ length: 4 }, () => 
        Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')
    ).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-7${random.slice(0, 3)}-${random.slice(3, 7)}-${random.slice(7, 19)}`;
}

// Generate trace ID
function generateTraceId() {
    return 'trace-' + Math.random().toString(36).substring(2, 15);
}

// Canonical JSON stringify (sorted keys) - deterministic hash input
function canonicalStringify(obj) {
    if (obj === null || typeof obj !== 'object') {
        return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
        return '[' + obj.map(canonicalStringify).join(',') + ']';
    }
    const sortedKeys = Object.keys(obj).sort();
    const pairs = sortedKeys.map(key => 
        JSON.stringify(key) + ':' + canonicalStringify(obj[key])
    );
    return '{' + pairs.join(',') + '}';
}

// SHA-256 using Web Crypto API
async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Compute event hash: hash(prev_hash + canonical_event_json)
async function computeEventHash(event, prevHash) {
    const eventForHash = {
        event_id: event.event_id,
        trace_id: event.trace_id,
        timestamp_ms: event.timestamp_ms,
        event_type: event.event_type,
        payload: event.payload
    };
    const canonical = canonicalStringify(eventForHash);
    const input = prevHash + canonical;
    return await sha256(input);
}

// ============================================
// Event Generation
// ============================================

async function generateEvents() {
    const traceId = generateTraceId();
    const baseTime = Date.now();
    const symbol = 'EUR/USD';
    
    const eventTemplates = [
        { type: 'SIG', delay: 0, payload: { signal: 'BUY', symbol, confidence: '0.87', model: 'momentum-v3' } },
        { type: 'ORD', delay: 10, payload: { order_id: 'ORD001', symbol, side: 'BUY', quantity: '100000', price: '1.08520' } },
        { type: 'ACK', delay: 25, payload: { order_id: 'ORD001', status: 'ACCEPTED', venue: 'LP-BANK-A' } },
        { type: 'EXE', delay: 45, payload: { order_id: 'ORD001', exec_id: 'EXE001', quantity: '100000', price: '1.08523' } },
        { type: 'SIG', delay: 1000, payload: { signal: 'HOLD', symbol, confidence: '0.65', model: 'momentum-v3' } },
        { type: 'SIG', delay: 2500, payload: { signal: 'SELL', symbol, confidence: '0.82', model: 'momentum-v3' } },
        { type: 'ORD', delay: 2510, payload: { order_id: 'ORD002', symbol, side: 'SELL', quantity: '100000', price: '1.08590' } },
        { type: 'ACK', delay: 2525, payload: { order_id: 'ORD002', status: 'ACCEPTED', venue: 'LP-BANK-B' } },
        { type: 'EXE', delay: 2540, payload: { order_id: 'ORD002', exec_id: 'EXE002', quantity: '50000', price: '1.08588' } },
        { type: 'EXE', delay: 2555, payload: { order_id: 'ORD002', exec_id: 'EXE003', quantity: '50000', price: '1.08591' } },
        { type: 'SIG', delay: 5000, payload: { signal: 'BUY', symbol, confidence: '0.91', model: 'momentum-v3' } },
        { type: 'ORD', delay: 5010, payload: { order_id: 'ORD003', symbol, side: 'BUY', quantity: '200000', price: '1.08550' } },
        { type: 'ACK', delay: 5028, payload: { order_id: 'ORD003', status: 'ACCEPTED', venue: 'LP-BANK-A' } },
        { type: 'EXE', delay: 5042, payload: { order_id: 'ORD003', exec_id: 'EXE004', quantity: '200000', price: '1.08552' } },
        { type: 'SIG', delay: 8000, payload: { signal: 'CLOSE', symbol, confidence: '0.78', model: 'risk-mgmt-v2' } }
    ];

    const events = [];
    let prevHash = GENESIS_HASH;

    for (const template of eventTemplates) {
        const event = {
            event_id: generateEventId(),
            trace_id: traceId,
            timestamp_ms: baseTime + template.delay,
            event_type: template.type,
            payload: template.payload,
            prev_hash: prevHash,
            event_hash: ''
        };
        
        event.event_hash = await computeEventHash(event, prevHash);
        events.push(event);
        prevHash = event.event_hash;
        
        await new Promise(r => setTimeout(r, 1));
    }

    return events;
}

// ============================================
// Tampering Functions
// ============================================

function applyTampering(events, type) {
    const tampered = JSON.parse(JSON.stringify(events));
    let info = {};

    switch (type) {
        case 'modify': {
            // Find an EXE event and modify the price
            const exeIndex = tampered.findIndex(e => e.event_type === 'EXE');
            if (exeIndex >= 0) {
                const originalPrice = tampered[exeIndex].payload.price;
                const newPrice = '1.09999';
                tampered[exeIndex].payload.price = newPrice;
                info = {
                    type: 'Post-hoc Edit',
                    auditTerm: 'payload modification',
                    index: exeIndex,
                    field: 'price',
                    originalValue: originalPrice,
                    newValue: newPrice,
                    description: `Event #${exeIndex} (EXE): price changed from "${originalPrice}" to "${newPrice}"`
                };
            }
            break;
        }
        case 'delete': {
            // Delete an ACK event
            const ackIndex = tampered.findIndex(e => e.event_type === 'ACK');
            if (ackIndex >= 0) {
                const deleted = tampered.splice(ackIndex, 1)[0];
                info = {
                    type: 'Omission',
                    auditTerm: 'event deletion',
                    index: ackIndex,
                    deletedEvent: deleted,
                    description: `Event #${ackIndex} (${deleted.event_type}) was removed from the chain`
                };
            }
            break;
        }
        case 'swap': {
            // Swap two adjacent events
            const swapIndex = 2;
            if (tampered.length > swapIndex + 1) {
                const event1Type = tampered[swapIndex].event_type;
                const event2Type = tampered[swapIndex + 1].event_type;
                [tampered[swapIndex], tampered[swapIndex + 1]] = 
                [tampered[swapIndex + 1], tampered[swapIndex]];
                info = {
                    type: 'Sequence Tampering',
                    auditTerm: 'event reordering',
                    index: swapIndex,
                    swappedIndices: [swapIndex, swapIndex + 1],
                    description: `Events #${swapIndex} (${event1Type}) and #${swapIndex + 1} (${event2Type}) were swapped`
                };
            }
            break;
        }
    }

    return { events: tampered, info };
}

// ============================================
// Verification
// ============================================

async function verifyChain(events) {
    const results = {
        valid: true,
        checks: [],
        firstFailure: null,
        passCount: 0,
        failCount: 0,
        totalEvents: events.length
    };

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        
        // Check 1: prev_hash linkage
        const expectedPrevHash = i === 0 ? GENESIS_HASH : events[i - 1].event_hash;
        const prevHashMatch = event.prev_hash === expectedPrevHash;
        
        if (!prevHashMatch && !results.firstFailure) {
            results.valid = false;
            results.firstFailure = {
                index: i,
                reason: 'prev_hash mismatch',
                expected: expectedPrevHash,
                actual: event.prev_hash
            };
        }

        if (prevHashMatch) results.passCount++; else results.failCount++;

        results.checks.push({
            index: i,
            name: `Event #${i} prev_hash linkage`,
            pass: prevHashMatch,
            detail: prevHashMatch 
                ? `Links to ${i === 0 ? 'GENESIS' : 'Event #' + (i - 1)}`
                : `Chain broken: expected ${expectedPrevHash.substring(0, 16)}...`
        });

        // Check 2: event_hash integrity
        const recomputed = await computeEventHash(event, event.prev_hash);
        const hashMatch = event.event_hash === recomputed;

        if (!hashMatch && !results.firstFailure) {
            results.valid = false;
            results.firstFailure = {
                index: i,
                reason: 'event_hash mismatch (content modified)',
                expected: recomputed,
                actual: event.event_hash
            };
        }

        if (hashMatch) results.passCount++; else results.failCount++;

        results.checks.push({
            index: i,
            name: `Event #${i} hash integrity`,
            pass: hashMatch,
            detail: hashMatch 
                ? `Hash verified: ${event.event_hash.substring(0, 24)}...`
                : `Content modified - hash mismatch`
        });
    }

    return results;
}

// ============================================
// UI Rendering
// ============================================

function renderEventLine(event, index, options = {}) {
    const { errorIndex = -1, modifiedIndex = -1, swappedIndices = [], isVerified = false } = options;
    
    let classes = ['event-line'];
    if (index === errorIndex) classes.push('highlight-error');
    if (index === modifiedIndex) classes.push('highlight-modified');
    if (isVerified) classes.push('verified');
    if (swappedIndices.includes(index)) {
        classes.push(swappedIndices[0] === index ? 'swapped-down' : 'swapped-up');
    }

    let json = JSON.stringify(event, null, 2);
    
    // Highlight modified field if applicable
    if (options.highlightField && index === modifiedIndex) {
        const fieldPattern = new RegExp(`("${options.highlightField}":\\s*)"([^"]+)"`, 'g');
        json = json.replace(fieldPattern, `$1"<span class="new-value">$2</span>"`);
    }
    
    // Syntax highlighting
    const highlighted = json
        .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
        .replace(/: "([^"<][^"]*)"(?!<\/span>)/g, ': <span class="string">"$1"</span>')
        .replace(/: (\d+)(?![^<]*>)/g, ': <span class="number">$1</span>');

    return `<div class="${classes.join(' ')}">${highlighted}</div>`;
}

function renderDeletedPlaceholder(deletedEvent, index) {
    return `
        <div class="deleted-placeholder">
            ⛔ DELETED EVENT #${index}
            <div class="deleted-type">${deletedEvent.event_type} (${deletedEvent.event_id.substring(0, 8)}...)</div>
        </div>
    `;
}

function renderLog(container, events, options = {}) {
    if (events.length === 0) {
        container.innerHTML = '<p class="placeholder">No events</p>';
        return;
    }
    container.innerHTML = events.map((e, i) => renderEventLine(e, i, options)).join('');
}

function renderTamperedLog(events, info) {
    let html = `<div class="tamper-info">
        <strong>⚠️ ${info.type} (${info.auditTerm}):</strong><br>
        ${info.description}
    </div>`;

    if (info.type === 'Omission') {
        // Show deleted placeholder in the right position
        const deletedIndex = info.index;
        for (let i = 0; i < events.length; i++) {
            if (i === deletedIndex) {
                html += renderDeletedPlaceholder(info.deletedEvent, deletedIndex);
            }
            html += renderEventLine(events[i], i + (i >= deletedIndex ? 1 : 0), {});
        }
        if (deletedIndex === events.length) {
            html += renderDeletedPlaceholder(info.deletedEvent, deletedIndex);
        }
    } else if (info.type === 'Post-hoc Edit') {
        html += events.map((e, i) => renderEventLine(e, i, {
            modifiedIndex: info.index,
            highlightField: info.field
        })).join('');
    } else if (info.type === 'Sequence Tampering') {
        html += events.map((e, i) => renderEventLine(e, i, {
            swappedIndices: info.swappedIndices
        })).join('');
    } else {
        html += events.map((e, i) => renderEventLine(e, i, {})).join('');
    }

    tamperedLog.innerHTML = html;
}

function renderVerificationResult(result, target) {
    verificationTarget = target;
    lastVerificationResult = result;
    
    let html = '';

    // Stats bar
    html += `
        <div class="verify-stats">
            <div class="stat-box">
                <div class="stat-value">${result.totalEvents}</div>
                <div class="stat-label">Events</div>
            </div>
            <div class="stat-box">
                <div class="stat-value success">${result.passCount}</div>
                <div class="stat-label">Checks Passed</div>
            </div>
            <div class="stat-box">
                <div class="stat-value ${result.failCount > 0 ? 'failure' : 'success'}">${result.failCount}</div>
                <div class="stat-label">Checks Failed</div>
            </div>
        </div>
    `;

    if (result.valid) {
        html += `
            <div class="result-box success">
                <div class="result-title success">✅ CHAIN VALID</div>
                <div class="result-detail">All ${result.totalEvents} events verified successfully.</div>
                <div class="result-detail">Hash chain integrity confirmed. This log is <strong>tamper-evident</strong>.</div>
            </div>
            <div class="killer-statement">
                <strong>💡 Key Insight:</strong> Any regulator or third-party auditor can independently verify this chain without trusting the log producer.
            </div>
        `;
    } else {
        const fail = result.firstFailure;
        html += `
            <div class="result-box failure">
                <div class="result-title failure">❌ TAMPERING DETECTED</div>
                <div class="result-detail"><strong>First failure:</strong> Event #${fail.index}</div>
                <div class="result-detail"><strong>Reason:</strong> ${fail.reason}</div>
                <div class="result-detail"><strong>Expected:</strong></div>
                <div class="hash-display expected">${fail.expected}</div>
                <div class="result-detail"><strong>Actual:</strong></div>
                <div class="hash-display actual">${fail.actual}</div>
            </div>
            <div class="killer-statement">
                <strong>💡 Key Insight:</strong> Regulators and Tier-1 clients can independently detect log tampering <em>without trusting the producer</em>. This is cryptographic proof, not assertion.
            </div>
        `;
    }

    // Check details (collapsed)
    html += '<h3 style="margin: 1rem 0 0.5rem; font-size: 0.9rem;">Verification Steps:</h3>';
    
    for (const check of result.checks) {
        html += `
            <div class="check-item ${check.pass ? 'pass' : 'fail'}">
                <span class="check-icon">${check.pass ? '✓' : '✗'}</span>
                <div class="check-content">
                    <div class="check-title">${check.name}</div>
                    <div class="check-detail">${check.detail}</div>
                </div>
            </div>
        `;
    }

    verifyResult.innerHTML = html;
    btnEvidence.disabled = false;
}

// ============================================
// Evidence Pack Download (ZIP)
// ============================================

async function downloadEvidencePack() {
    if (!lastVerificationResult) {
        alert('No verification result available');
        return;
    }

    // Build verification report
    const report = {
        vcp_demo_version: '2.0',
        generated_at: new Date().toISOString(),
        verification_target: verificationTarget,
        result: {
            status: lastVerificationResult.valid ? 'VALID' : 'TAMPERING_DETECTED',
            total_events: lastVerificationResult.totalEvents,
            checks_passed: lastVerificationResult.passCount,
            checks_failed: lastVerificationResult.failCount
        },
        first_failure: lastVerificationResult.firstFailure || null,
        tampering_applied: tamperInfo ? {
            type: tamperInfo.type,
            audit_term: tamperInfo.auditTerm,
            description: tamperInfo.description
        } : null,
        verification_steps: lastVerificationResult.checks.map(c => ({
            event_index: c.index,
            check: c.name,
            result: c.pass ? 'PASS' : 'FAIL',
            detail: c.detail
        }))
    };

    const readme = `VCP Tamper-Evidence Demo - Evidence Pack
=========================================

Generated: ${new Date().toISOString()}

Contents:
- original.jsonl    : Original event chain (untampered)
- tampered.jsonl    : Tampered event chain (if applicable)
- verification.json : Detailed verification report

Verification Steps:
1. Load original.jsonl and tampered.jsonl in any JSONL parser
2. For each event, verify:
   a) prev_hash matches previous event's event_hash (or "GENESIS" for first)
   b) event_hash = SHA-256(prev_hash + canonical_json(event_core_fields))
3. canonical_json uses sorted keys and stable stringify

Hash Algorithm: SHA-256
Canonicalization: JSON with sorted keys (alphabetical)

Result: ${lastVerificationResult.valid ? 'VALID - Chain integrity verified' : 'TAMPERING DETECTED - See verification.json for details'}

For more information: https://veritaschain.org
`;

    // Create files content
    const files = [
        { name: 'original.jsonl', content: originalEvents.map(e => JSON.stringify(e)).join('\n') },
        { name: 'tampered.jsonl', content: tamperedEvents.map(e => JSON.stringify(e)).join('\n') },
        { name: 'verification_report.json', content: JSON.stringify(report, null, 2) },
        { name: 'README.txt', content: readme }
    ];

    // Simple ZIP implementation (uncompressed for compatibility)
    const zip = await createSimpleZip(files);
    
    const blob = new Blob([zip], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vcp-evidence-pack-${Date.now()}.zip`;
    a.click();
    URL.revokeObjectURL(url);
}

// Simple ZIP creator (no external dependencies)
async function createSimpleZip(files) {
    const encoder = new TextEncoder();
    let offset = 0;
    const centralDirectory = [];
    const localHeaders = [];

    for (const file of files) {
        const content = encoder.encode(file.content);
        const nameBytes = encoder.encode(file.name);
        
        // Local file header
        const localHeader = new Uint8Array(30 + nameBytes.length);
        const view = new DataView(localHeader.buffer);
        
        view.setUint32(0, 0x04034b50, true); // signature
        view.setUint16(4, 20, true); // version needed
        view.setUint16(6, 0, true); // flags
        view.setUint16(8, 0, true); // compression (none)
        view.setUint16(10, 0, true); // mod time
        view.setUint16(12, 0, true); // mod date
        view.setUint32(14, await crc32(content), true); // crc32
        view.setUint32(18, content.length, true); // compressed size
        view.setUint32(22, content.length, true); // uncompressed size
        view.setUint16(26, nameBytes.length, true); // name length
        view.setUint16(28, 0, true); // extra length
        localHeader.set(nameBytes, 30);

        localHeaders.push({ header: localHeader, content, name: nameBytes, offset });
        offset += localHeader.length + content.length;
    }

    // Central directory
    let cdOffset = offset;
    for (const item of localHeaders) {
        const cdHeader = new Uint8Array(46 + item.name.length);
        const view = new DataView(cdHeader.buffer);
        
        view.setUint32(0, 0x02014b50, true); // signature
        view.setUint16(4, 20, true); // version made by
        view.setUint16(6, 20, true); // version needed
        view.setUint16(8, 0, true); // flags
        view.setUint16(10, 0, true); // compression
        view.setUint16(12, 0, true); // mod time
        view.setUint16(14, 0, true); // mod date
        view.setUint32(16, await crc32(item.content), true); // crc32
        view.setUint32(20, item.content.length, true); // compressed size
        view.setUint32(24, item.content.length, true); // uncompressed size
        view.setUint16(28, item.name.length, true); // name length
        view.setUint16(30, 0, true); // extra length
        view.setUint16(32, 0, true); // comment length
        view.setUint16(34, 0, true); // disk start
        view.setUint16(36, 0, true); // internal attr
        view.setUint32(38, 0, true); // external attr
        view.setUint32(42, item.offset, true); // local header offset
        cdHeader.set(item.name, 46);

        centralDirectory.push(cdHeader);
        offset += cdHeader.length;
    }

    // End of central directory
    const eocd = new Uint8Array(22);
    const eocdView = new DataView(eocd.buffer);
    const cdSize = offset - cdOffset;
    
    eocdView.setUint32(0, 0x06054b50, true); // signature
    eocdView.setUint16(4, 0, true); // disk number
    eocdView.setUint16(6, 0, true); // cd disk
    eocdView.setUint16(8, files.length, true); // entries on disk
    eocdView.setUint16(10, files.length, true); // total entries
    eocdView.setUint32(12, cdSize, true); // cd size
    eocdView.setUint32(16, cdOffset, true); // cd offset
    eocdView.setUint16(20, 0, true); // comment length

    // Combine all parts
    const totalSize = offset + 22;
    const result = new Uint8Array(totalSize);
    let pos = 0;
    
    for (const item of localHeaders) {
        result.set(item.header, pos);
        pos += item.header.length;
        result.set(item.content, pos);
        pos += item.content.length;
    }
    
    for (const cd of centralDirectory) {
        result.set(cd, pos);
        pos += cd.length;
    }
    
    result.set(eocd, pos);
    
    return result;
}

// CRC32 for ZIP
async function crc32(data) {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c;
    }
    
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
        crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
}

// ============================================
// Event Handlers
// ============================================

btnGenerate.addEventListener('click', async () => {
    btnGenerate.disabled = true;
    btnGenerate.textContent = 'Generating...';
    
    try {
        originalEvents = await generateEvents();
        tamperedEvents = [];
        tamperInfo = null;
        lastVerificationResult = null;
        
        renderLog(originalLog, originalEvents);
        tamperedLog.innerHTML = '<p class="placeholder">Apply tampering to see modified log</p>';
        verifyResult.innerHTML = '<p class="placeholder">Click "Verify Original" to validate, or apply tampering first</p>';
        
        btnTamper.disabled = false;
        btnVerify.disabled = true;
        btnVerifyOriginal.disabled = false;
        btnReset.disabled = false;
        btnEvidence.disabled = true;
    } finally {
        btnGenerate.disabled = false;
        btnGenerate.textContent = 'Generate Events';
    }
});

btnTamper.addEventListener('click', () => {
    const type = tamperType.value;
    const result = applyTampering(originalEvents, type);
    tamperedEvents = result.events;
    tamperInfo = result.info;
    
    renderTamperedLog(tamperedEvents, tamperInfo);
    verifyResult.innerHTML = '<p class="placeholder">Click "Verify Tampered" to check integrity</p>';
    btnVerify.disabled = false;
    btnEvidence.disabled = true;
});

btnVerifyOriginal.addEventListener('click', async () => {
    btnVerifyOriginal.disabled = true;
    btnVerifyOriginal.textContent = 'Verifying...';
    
    try {
        const result = await verifyChain(originalEvents);
        renderVerificationResult(result, 'original');
        
        // Highlight verified events
        renderLog(originalLog, originalEvents, { isVerified: true });
    } finally {
        btnVerifyOriginal.disabled = false;
        btnVerifyOriginal.textContent = 'Verify Original';
    }
});

btnVerify.addEventListener('click', async () => {
    btnVerify.disabled = true;
    btnVerify.textContent = 'Verifying...';
    
    try {
        const result = await verifyChain(tamperedEvents);
        renderVerificationResult(result, 'tampered');
        
        // Re-render tampered log with error highlight
        if (!result.valid && tamperInfo) {
            let html = `<div class="tamper-info">
                <strong>⚠️ ${tamperInfo.type} (${tamperInfo.auditTerm}):</strong><br>
                ${tamperInfo.description}
            </div>`;
            
            const errorIndex = result.firstFailure.index;
            
            if (tamperInfo.type === 'Omission') {
                const deletedIndex = tamperInfo.index;
                for (let i = 0; i < tamperedEvents.length; i++) {
                    if (i === deletedIndex) {
                        html += renderDeletedPlaceholder(tamperInfo.deletedEvent, deletedIndex);
                    }
                    const displayIndex = i + (i >= deletedIndex ? 1 : 0);
                    html += renderEventLine(tamperedEvents[i], displayIndex, {
                        errorIndex: errorIndex
                    });
                }
            } else {
                html += tamperedEvents.map((e, i) => renderEventLine(e, i, {
                    errorIndex: errorIndex,
                    modifiedIndex: tamperInfo.type === 'Post-hoc Edit' ? tamperInfo.index : -1,
                    highlightField: tamperInfo.field,
                    swappedIndices: tamperInfo.swappedIndices || []
                })).join('');
            }
            
            tamperedLog.innerHTML = html;
        }
    } finally {
        btnVerify.disabled = false;
        btnVerify.textContent = 'Verify Tampered';
    }
});

btnReset.addEventListener('click', () => {
    originalEvents = [];
    tamperedEvents = [];
    tamperInfo = null;
    lastVerificationResult = null;
    
    originalLog.innerHTML = '<p class="placeholder">Click "Generate Events" to create sample log</p>';
    tamperedLog.innerHTML = '<p class="placeholder">Apply tampering to see modified log</p>';
    verifyResult.innerHTML = '<p class="placeholder">Click "Verify Original" or "Verify Tampered" to check integrity</p>';
    
    btnTamper.disabled = true;
    btnVerify.disabled = true;
    btnVerifyOriginal.disabled = true;
    btnReset.disabled = true;
    btnEvidence.disabled = true;
});

// ============================================
// Copy & Download Functions
// ============================================

function copyLog(type) {
    const events = type === 'original' ? originalEvents : tamperedEvents;
    if (events.length === 0) {
        alert('No events to copy');
        return;
    }
    const jsonl = events.map(e => JSON.stringify(e)).join('\n');
    navigator.clipboard.writeText(jsonl).then(() => {
        alert('Copied to clipboard!');
    });
}

function downloadLog(type) {
    const events = type === 'original' ? originalEvents : tamperedEvents;
    if (events.length === 0) {
        alert('No events to download');
        return;
    }
    const jsonl = events.map(e => JSON.stringify(e)).join('\n');
    const blob = new Blob([jsonl], { type: 'application/x-ndjson' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vcp-${type}-events.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
}

// Make functions globally available
window.copyLog = copyLog;
window.downloadLog = downloadLog;
window.downloadEvidencePack = downloadEvidencePack;
