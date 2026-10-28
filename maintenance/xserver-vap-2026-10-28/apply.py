#!/usr/bin/env python3
"""Apply the 28 October 2026 wording corrections to a copy of the vap.veritaschain.org files.

Usage:  python3 -I apply.py <site-root> [--check]

<site-root> is a local copy of the served directory (the files listed in
manifest.json at their served paths). The script:

1. checks every listed file against its "before" SHA-256 and stops on any
   difference (the server copy has changed since the package was prepared);
2. removes the company founding date: the JSON-LD "foundingDate" key and the
   "Founded" / 「設立」 table row, in rendered pages and generator sources;
3. removes the unregistered alias "VAP-WEB" for OAP;
4. checks every result against its "after" SHA-256.

The changes are made by key and pattern, so this package does not itself
contain the date. With --check, nothing is written.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
RULES = [
    (re.compile(r' "foundingDate": "[^"]*",'), ''),
    (re.compile(r'<tr><th scope="row">(?:Founded|設立)</th><td>[^<]*</td></tr>\n'), ''),
    (re.compile(r" <span class='alias'>\(VAP-WEB\)</span>"), ''),
    (re.compile(r'\(OAP/VAP-WEB\)'), '(OAP)'),
    (re.compile(r'（OAP/VAP-WEB）'), '（OAP）'),
    (re.compile(r'OAP \(VAP-WEB\)'), 'OAP'),
]


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> int:
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    root = Path(sys.argv[1])
    check_only = '--check' in sys.argv[2:]
    manifest = json.loads((HERE / 'manifest.json').read_text(encoding='utf-8'))
    results = []
    for entry in manifest['files']:
        path = root / entry['path']
        data = path.read_bytes()
        if sha(data) != entry['before_sha256']:
            print(f"STOP: {entry['path']} differs from the before hash; review the server copy first")
            return 1
        text = data.decode('utf-8')
        for pattern, replacement in RULES:
            text = pattern.sub(replacement, text)
        out = text.encode('utf-8')
        if sha(out) != entry['after_sha256']:
            print(f"STOP: {entry['path']} does not reproduce the after hash")
            return 1
        results.append((path, out))
    if not check_only:
        for path, out in results:
            path.write_bytes(out)
    print(f"{'checked' if check_only else 'updated'} {len(results)} files; all before/after hashes match")
    return 0


if __name__ == '__main__':
    sys.exit(main())
