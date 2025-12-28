// ============================================
// VCP Tamper-Evidence Demo - Core Implementation
// Uses Web Crypto API (crypto.subtle.digest)
// ============================================

const GENESIS_HASH = 'GENESIS';
let originalEvents = [];
let tamperedEvents = [];
let tamperInfo = null;

// DOM Elements
const btnGenerate = document.getElementById('btnGenerate');
const btnTamper = document.getElementById('btnTamper');
const btnVerify = document.getElementById('btnVerify');
const btnReset = document.getElementById('btnReset');
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

// Generate trace ID (shared across lifecycle)
function generateTraceId() {
    return 'trace-' + Math.random().toString(36).substring(2, 15);
}

// Canonical JSON stringify (sorted keys)
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
        { type: 'ACK', delay: 25, payload: { order_id: 'ORD001', status: 'ACCEPTED', venue: 'LP-A' } },
        { type: 'EXE', delay: 45, payload: { order_id: 'ORD001', exec_id: 'EXE001', quantity: '100000', price: '1.08523' } },
        { type: 'SIG', delay: 1000, payload: { signal: 'HOLD', symbol, confidence: '0.65', model: 'momentum-v3' } },
        { type: 'SIG', delay: 2500, payload: { signal: 'SELL', symbol, confidence: '0.82', model: 'momentum-v3' } },
        { type: 'ORD', delay: 2510, payload: { order_id: 'ORD002', symbol, side: 'SELL', quantity: '100000', price: '1.08590' } },
        { type: 'ACK', delay: 2525, payload: { order_id: 'ORD002', status: 'ACCEPTED', venue: 'LP-B' } },
        { type: 'EXE', delay: 2540, payload: { order_id: 'ORD002', exec_id: 'EXE002', quantity: '50000', price: '1.08588' } },
        { type: 'EXE', delay: 2555, payload: { order_id: 'ORD002', exec_id: 'EXE003', quantity: '50000', price: '1.08591' } },
        { type: 'SIG', delay: 5000, payload: { signal: 'BUY', symbol, confidence: '0.91', model: 'momentum-v3' } },
        { type: 'ORD', delay: 5010, payload: { order_id: 'ORD003', symbol, side: 'BUY', quantity: '200000', price: '1.08550' } },
        { type: 'ACK', delay: 5028, payload: { order_id: 'ORD003', status: 'ACCEPTED', venue: 'LP-A' } },
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
            event_hash: '' // Will be computed
        };
        
        event.event_hash = await computeEventHash(event, prevHash);
        events.push(event);
        prevHash = event.event_hash;
        
        // Small delay between ID generation to ensure uniqueness
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
                const original = tampered[exeIndex].payload.price;
                tampered[exeIndex].payload.price = '1.09999'; // Modified price
                info = {
                    type: 'Payload Modification',
                    index: exeIndex,
                    description: `Event #${exeIndex} (EXE): price changed from "${original}" to "1.09999"`
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
                    type: 'Event Deletion (Omission)',
                    index: ackIndex,
                    description: `Event #${ackIndex} (ACK) was deleted from the chain`
                };
            }
            break;
        }
        case 'swap': {
            // Swap two adjacent events
            const swapIndex = 2; // Swap events 2 and 3
            if (tampered.length > swapIndex + 1) {
                [tampered[swapIndex], tampered[swapIndex + 1]] = 
                [tampered[swapIndex + 1], tampered[swapIndex]];
                info = {
                    type: 'Event Order Swap',
                    index: swapIndex,
                    description: `Events #${swapIndex} and #${swapIndex + 1} were swapped`
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
        firstFailure: null
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

        results.checks.push({
            index: i,
            name: `Event #${i} prev_hash linkage`,
            pass: prevHashMatch,
            detail: prevHashMatch 
                ? `Links to ${i === 0 ? 'GENESIS' : 'Event #' + (i - 1)}`
                : `Expected: ${expectedPrevHash.substring(0, 16)}... Got: ${event.prev_hash.substring(0, 16)}...`
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

        results.checks.push({
            index: i,
            name: `Event #${i} hash integrity`,
            pass: hashMatch,
            detail: hashMatch 
                ? `Hash verified: ${event.event_hash.substring(0, 24)}...`
                : `Content was modified - hash mismatch`
        });
    }

    return results;
}

// ============================================
// UI Rendering
// ============================================

function renderEventLine(event, index, errorIndex = -1) {
    const isError = index === errorIndex;
    const json = JSON.stringify(event, null, 2);
    
    // Syntax highlighting
    const highlighted = json
        .replace(/"([^"]+)":/g, '<span class="key">"$1"</span>:')
        .replace(/: "([^"]+)"/g, ': <span class="string">"$1"</span>')
        .replace(/: (\d+)/g, ': <span class="number">$1</span>');

    return `<div class="event-line ${isError ? 'highlight-error' : ''}">${highlighted}</div>`;
}

function renderLog(container, events, errorIndex = -1) {
    if (events.length === 0) {
        container.innerHTML = '<p class="placeholder">No events</p>';
        return;
    }
    container.innerHTML = events.map((e, i) => renderEventLine(e, i, errorIndex)).join('');
}

function renderVerificationResult(result) {
    let html = '';

    if (result.valid) {
        html = `
            <div class="result-box success">
                <div class="result-title success">✅ CHAIN VALID</div>
                <div class="result-detail">All ${result.checks.length / 2} events verified successfully.</div>
                <div class="result-detail">Hash chain integrity confirmed. This log is tamper-evident.</div>
            </div>
        `;
    } else {
        const fail = result.firstFailure;
        html = `
            <div class="result-box failure">
                <div class="result-title failure">❌ TAMPERING DETECTED</div>
                <div class="result-detail"><strong>First failure at:</strong> Event #${fail.index}</div>
                <div class="result-detail"><strong>Reason:</strong> ${fail.reason}</div>
                <div class="result-detail"><strong>Expected hash:</strong></div>
                <div class="hash-display expected">${fail.expected}</div>
                <div class="result-detail"><strong>Actual hash:</strong></div>
                <div class="hash-display actual">${fail.actual}</div>
            </div>
        `;
    }

    // Add check details
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
        
        renderLog(originalLog, originalEvents);
        tamperedLog.innerHTML = '<p class="placeholder">Apply tampering to see modified log</p>';
        verifyResult.innerHTML = '<p class="placeholder">Click "Verify Chain" to check integrity</p>';
        
        btnTamper.disabled = false;
        btnVerify.disabled = true;
        btnReset.disabled = false;
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
    
    // Render with potential highlight
    let errorIndex = -1;
    if (tamperInfo.type === 'Payload Modification') {
        errorIndex = tamperInfo.index;
    }
    
    let html = `<div class="tamper-info"><strong>⚠️ ${tamperInfo.type}:</strong> ${tamperInfo.description}</div>`;
    tamperedLog.innerHTML = html;
    
    const logHtml = tamperedEvents.map((e, i) => renderEventLine(e, i, errorIndex)).join('');
    tamperedLog.innerHTML += logHtml;
    
    verifyResult.innerHTML = '<p class="placeholder">Click "Verify Chain" to check integrity</p>';
    btnVerify.disabled = false;
});

btnVerify.addEventListener('click', async () => {
    btnVerify.disabled = true;
    btnVerify.textContent = 'Verifying...';
    
    try {
        const result = await verifyChain(tamperedEvents);
        renderVerificationResult(result);
        
        // Highlight error in tampered log
        if (!result.valid) {
            const errorIndex = result.firstFailure.index;
            const tamperHtml = tamperedLog.querySelector('.tamper-info')?.outerHTML || '';
            tamperedLog.innerHTML = tamperHtml + tamperedEvents.map((e, i) => 
                renderEventLine(e, i, errorIndex)
            ).join('');
        }
    } finally {
        btnVerify.disabled = false;
        btnVerify.textContent = 'Verify Chain';
    }
});

btnReset.addEventListener('click', () => {
    originalEvents = [];
    tamperedEvents = [];
    tamperInfo = null;
    
    originalLog.innerHTML = '<p class="placeholder">Click "Generate Events" to create sample log</p>';
    tamperedLog.innerHTML = '<p class="placeholder">Apply tampering to see modified log</p>';
    verifyResult.innerHTML = '<p class="placeholder">Click "Verify Chain" to check integrity</p>';
    
    btnTamper.disabled = true;
    btnVerify.disabled = true;
    btnReset.disabled = true;
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

// Make functions globally available for inline handlers
window.copyLog = copyLog;
window.downloadLog = downloadLog;
