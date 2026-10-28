#!/usr/bin/env python3
"""Apply the six reviewed metadata changes to a copy of the served VAP root.

Usage: python3 -I apply.py SERVED_ROOT [--check]
All before and after hashes are checked before any file is written.
"""

import hashlib
import html
import json
from pathlib import Path
import sys


def digest(data):
    return hashlib.sha256(data).hexdigest()


def main():
    if len(sys.argv) not in (2, 3) or (len(sys.argv) == 3 and sys.argv[2] != '--check'):
        print(__doc__)
        return 2
    root = Path(sys.argv[1]).resolve()
    manifest = json.loads(Path(__file__).with_name('manifest.json').read_text())
    pending = []
    for entry in manifest['files']:
        path = entry['path']
        target = root / path
        data = target.read_bytes()
        if digest(data) != entry['before_sha256']:
            raise ValueError(f'{path}: current bytes differ from the reviewed before hash')
        text = data.decode('utf-8')
        if path.startswith('tools/'):
            changes = [c for c in manifest['field_changes'] if c['path'] == path]
            expected_occurrences = 1
        else:
            source = 'tools/content_ja.py' if path.startswith('ja/') else 'tools/content_en.py'
            group = 'home.' if path in ('index.html', 'ja/index.html') else 'profiles.'
            changes = [c for c in manifest['field_changes']
                       if c['path'] == source and c['field'].startswith(group)]
            expected_occurrences = 3
        for change in changes:
            before, after = change['before'], change['after']
            if not path.startswith('tools/'):
                before, after = html.escape(before, quote=True), html.escape(after, quote=True)
            if text.count(before) != expected_occurrences:
                raise ValueError(f'{path}: unexpected count for {change["field"]}')
            text = text.replace(before, after)
        output = text.encode('utf-8')
        if digest(output) != entry['after_sha256']:
            raise ValueError(f'{path}: transformation does not reproduce the reviewed after hash')
        pending.append((target, output))
    if len(sys.argv) == 2:
        for target, output in pending:
            target.write_bytes(output)
    print(f'Checked {len(pending)} before/after hashes; ' +
          ('no files written' if len(sys.argv) == 3 else 'updated local copy'))
    return 0


if __name__ == '__main__':
    sys.exit(main())
