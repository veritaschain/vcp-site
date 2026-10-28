#!/usr/bin/env python3
"""Apply the reviewed analytics-only patch to a COPY of the VAP webroot."""
import hashlib, json, sys
from pathlib import Path
root=Path(sys.argv[1]); check='--check' in sys.argv[2:]
manifest=json.loads((Path(__file__).parent/'vap-manifest.json').read_text())
tag='<script defer src="https://veritaschain.org/assets/js/analytics.js?v=20261028"></script>'
changes=[]
for item in manifest['files']:
 p=root/item['path']; data=p.read_bytes()
 assert hashlib.sha256(data).hexdigest()==item['before_sha256'], 'before hash mismatch: '+item['path']
 s=data.decode()
 if item['path']=='tools/build.py':
  s=s.replace('h = f"""<meta charset=', 'h = f"""'+tag+'\n<meta charset=', 1)
 else:
  s=s.replace('<head>\n', '<head>\n'+tag+'\n', 1)
 result=s.encode()
 assert hashlib.sha256(result).hexdigest()==item['after_sha256'], 'after hash mismatch: '+item['path']
 changes.append((p,result))
if not check:
 for p,result in changes:p.write_bytes(result)
print(str(len(changes))+' files verified'+(' (check only)' if check else ' and patched'))
