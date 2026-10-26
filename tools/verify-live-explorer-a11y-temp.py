#!/usr/bin/env python3
"""Read-only HTTP byte comparison of an explicitly pinned first-party demo release."""
import hashlib
import json
import pathlib
import re
import sys
import time
import urllib.parse
import urllib.request

ORIGIN = "https://veritaschain.org"
ROOT = pathlib.Path("explorer/app")
OUT = pathlib.Path("live-observation")
OUT.mkdir(exist_ok=True)


def sha(data):
    return hashlib.sha256(data).hexdigest()


def get(path):
    assert path.startswith("/explorer/app/")
    url = ORIGIN + path
    req = urllib.request.Request(url, headers={
        "User-Agent": "VSO-Explorer-ReadOnly-PublicCheck/1.0",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
    })
    with urllib.request.urlopen(req, timeout=20) as reply:
        final = reply.geturl()
        assert urllib.parse.urlparse(final).hostname == "veritaschain.org", final
        data = reply.read(12_000_001)
        assert len(data) <= 12_000_000
        return {
            "path": path, "status": reply.status, "url": final, "bytes": len(data),
            "sha256": sha(data), "last_modified": reply.headers.get("Last-Modified"),
            "etag": reply.headers.get("ETag"),
        }, data


result = {
    "source_site_commit": "c11a1756a6a6afe0aa467915148eae0355f19763",
    "target": ORIGIN + "/explorer/app/",
    "observed_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "status": "INDETERMINATE",
    "checks": [],
    "scope": "GET only, same-host public HTML/JS/CSS; no server writes, no API requests",
}
try:
    old = (ROOT / "index.html").read_bytes()
    local_html = old.decode("utf-8")
    assert 'id="integrity-review-2026-10-24"' in local_html
    js_names = re.findall(r'/explorer/app/assets/index-[\w-]+\.js', local_html)
    css_names = re.findall(r'/explorer/app/assets/index-[\w-]+\.css', local_html)
    assert len(js_names) == 1 and len(css_names) == 1
    expected_paths = ["/explorer/app/", js_names[0], css_names[0]]
    for path in expected_paths:
        expected = ROOT / path.removeprefix("/explorer/app/")
        if path == "/explorer/app/":
            expected = ROOT / "index.html"
        content = expected.read_bytes()
        remote, raw = get(path)
        same = sha(content) == remote["sha256"]
        result["checks"].append({
            "path": path, "matches_source_bytes": same,
            "expected_sha256": sha(content), **remote,
        })
    result["status"] = (
        "PUBLIC_BYTES_VERIFIED"
        if len(result["checks"]) == 3 and all(x["matches_source_bytes"] for x in result["checks"])
        else "PUBLIC_BYTES_DIFFER"
    )
except Exception as e:
    result["error"] = type(e).__name__ + ": " + str(e)[:300]
    result["status"] = "UNREACHABLE_OR_INDETERMINATE"
(OUT / "http-comparison.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
sys.exit(0 if result["status"] == "PUBLIC_BYTES_VERIFIED" else 2)
