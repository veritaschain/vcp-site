#!/usr/bin/env python3
"""Build outreach SVG maps from pinned Natural Earth data and homepage cards.

Usage: python3 scripts/build-outreach-map.py /path/to/ne_50m_admin_0_countries.geojson
Data source and checksum: assets/maps/README.md
"""
import hashlib
import html
import json
import math
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
SOURCE_SHA256 = "3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb"
NEW = {"FR", "IT", "NL", "ES", "IE", "SE", "DK", "PT", "CZ", "SK"}
COLORS = {"new": "#50d5f5", "historical": "#269b78", "other": "#283950"}


def simplify(points, tolerance=0.24):
    """Douglas–Peucker simplification in projected pixels."""
    if len(points) < 4:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    dx, dy = bx - ax, by - ay
    length = dx * dx + dy * dy
    best, index = 0, 0
    for i, (x, y) in enumerate(points[1:-1], 1):
        t = max(0, min(1, ((x - ax) * dx + (y - ay) * dy) / length)) if length else 0
        distance = (x - ax - t * dx) ** 2 + (y - ay - t * dy) ** 2
        if distance > best:
            best, index = distance, i
    if best > tolerance * tolerance:
        return simplify(points[:index + 1], tolerance)[:-1] + simplify(points[index:], tolerance)
    return [points[0], points[-1]]


def mercator(lat):
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(max(-84, min(84, lat))) / 2)))


def draw(features, listed, *, europe=False):
    width, height = (360, 480) if europe else (864, 480)
    west, east, south, north = (-13, 30, 34, 71) if europe else (-180, 180, -58, 84)
    ymin, ymax = mercator(south), mercator(north)
    scale = min((width - 24) / (east - west), (height - 24) / (ymax - ymin))
    ox = (width - (east - west) * scale) / 2
    oy = (height - (ymax - ymin) * scale) / 2

    def project(lon, lat):
        return ox + (lon - west) * scale, oy + (ymax - mercator(lat)) * scale

    title = "European outreach detail" if europe else "Regulatory outreach world map"
    parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">',
             f'<title id="title">{title}</title>',
             '<desc id="desc">Cyan: France, Italy, Netherlands, Spain, Ireland, Sweden, Denmark, Portugal, Czechia and Slovakia, contacted on 26 October 2026. Green: country and territory entries in the historical outreach list, still under review. Colors do not indicate regulatory receipt, approval or endorsement. EU-level outreach is listed separately on the page.</desc>',
             f'<defs><clipPath id="bounds"><rect x="1" y="1" width="{width - 2}" height="{height - 2}" rx="12"/></clipPath></defs>',
             f'<rect width="{width}" height="{height}" rx="12" fill="#101c2e"/>',
             '<g clip-path="url(#bounds)">']
    for lat in range(-60, 90, 30):
        _, y = project(0, lat)
        parts.append(f'<path d="M0 {y:.1f}H{width}" stroke="#1e2d42" stroke-width="0.5"/>')
    for lon in range(-180, 181, 30):
        x, _ = project(lon, 0)
        parts.append(f'<path d="M{x:.1f} 0V{height}" stroke="#1e2d42" stroke-width="0.5"/>')

    rendered, markers = set(), []
    for feature in features:
        p = feature["properties"]
        code = p.get("ISO_A2_EH", p["ISO_A2"])
        if code == "AQ":
            continue
        geom = feature["geometry"]
        polygons = [geom["coordinates"]] if geom["type"] == "Polygon" else geom["coordinates"]
        path, all_points = [], []
        for polygon in polygons:
            outer = polygon[0]
            # Clip whole remote polygons before projecting the European inset.
            if europe and (max(c[0] for c in outer) < west or min(c[0] for c in outer) > east or max(c[1] for c in outer) < south or min(c[1] for c in outer) > north):
                continue
            for ring in polygon:
                points = simplify([project(lon, lat) for lon, lat in ring])
                all_points.extend(points)
                path.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in points) + "Z")
        if not path:
            continue
        rendered.add(code)
        status = "new" if code in NEW else "historical" if code in listed else "other"
        label = html.escape(p["NAME_EN"])
        stroke = "#b7f0ff" if status == "new" else "#101c2e"
        parts.append(f'<path data-country="{code}" data-status="{status}" d="{"".join(path)}" fill="{COLORS[status]}" stroke="{stroke}" stroke-width="{0.65 if europe else 0.4}" stroke-linejoin="round" fill-rule="evenodd"><title>{label}</title></path>')
        if code in listed and code not in NEW:
            xs, ys = zip(*all_points)
            if (max(xs) - min(xs)) * (max(ys) - min(ys)) < 18:
                x, y = project(p["LABEL_X"], p["LABEL_Y"])
                markers.append(f'<circle data-country="{code}" cx="{x:.1f}" cy="{y:.1f}" r="2" fill="{COLORS[status]}" stroke="#101c2e" stroke-width="0.6"><title>{label}</title></circle>')
    parts.extend(markers)
    if europe:
        # Mainland label anchors keep abbreviations readable in small countries.
        labels = {"FR": (2.5, 46.5), "IT": (12.5, 42.7), "NL": (5.4, 52.3), "ES": (-3.6, 40.0), "IE": (-8.0, 53.3), "SE": (16.3, 63.0), "DK": (9.5, 56.0), "PT": (-8.1, 39.5), "CZ": (15.1, 49.8), "SK": (19.4, 48.8)}
        for code, (lon, lat) in labels.items():
            x, y = project(lon, lat)
            parts.append(f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="middle" dominant-baseline="central" fill="#071624" font-family="system-ui,sans-serif" font-size="10" font-weight="800">{code}</text>')
    parts.append('</g></svg>')
    assert NEW <= rendered, f"Missing new countries: {NEW - rendered}"
    if not europe:
        assert listed <= rendered, f"Missing listed countries: {listed - rendered}"
    return "\n".join(parts) + "\n"


def main():
    raw = Path(sys.argv[1]).read_bytes()
    assert hashlib.sha256(raw).hexdigest() == SOURCE_SHA256, "Unexpected Natural Earth version"
    features = json.loads(raw)["features"]
    homepage = (ROOT / "index.html").read_text()
    cards = homepage[homepage.index('<!-- World Map -->'):homepage.index('id="news-container"')]
    listed = set(re.findall(r'assets/nationalflag/([A-Z]{2})\.(?:png|svg)', cards)) - {"EU"}
    assert set(re.findall(r'data-outreach-date="2026-10-26" data-country="([A-Z]{2})"', cards)) == NEW
    output = ROOT / "assets/maps"
    output.mkdir(exist_ok=True)
    for name, europe in [("outreach-world-20261026.svg", False), ("outreach-europe-20261026.svg", True)]:
        svg = draw(features, listed, europe=europe)
        (output / name).write_text(svg)
        print(f"{name}: {len(svg):,} bytes, {len(NEW)} new countries")


if __name__ == "__main__":
    main()
