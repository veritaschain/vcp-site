# Regulatory outreach maps

The SVGs are data visualizations generated from Natural Earth country boundaries and the country/territory cards on the English homepage. They do not modify the former raster image.

- Cyan: the 18 individually recorded country contacts of 26 October 2026: FR, IT, NL, ES, IE, SE, DK, PT, CZ, SK, BE, HR, RO, LV, HU, IS, BG, GR. The first 17 were sent by email; Greece was submitted through the Bank of Greece form with receipt confirmed.
- Green: the remaining country and territory cards in the historical outreach list, still under reconciliation.
- Slate: areas not represented by an individual country/territory card.
- The EU card describes organization-level outreach. It does not mark every EU member state as contacted.
- Small historical jurisdictions use a point when the polygon is too small at this scale.
- Colors represent outreach records, not receipt, endorsement or approval. The map is illustrative, not a statement on sovereignty or borders.

## Rebuild

Source: Natural Earth 1:50m Admin 0 Countries, public domain.

Pinned GeoJSON: <https://raw.githubusercontent.com/nvkelso/natural-earth-vector/9380cca83db5f9aef52d5e762765100745f84b27/geojson/ne_50m_admin_0_countries.geojson>

SHA-256: `3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb`

Terms: <https://www.naturalearthdata.com/about/terms-of-use/>

Download that source, then run:

```sh
python3 scripts/build-outreach-map.py /path/to/ne_50m_admin_0_countries.geojson
```

The generator verifies the source checksum, checks that all listed countries/territories are represented, and checks the exact 18 new country codes against the homepage cards. It uses a Mercator projection with Antarctica omitted and simplifies boundaries in screen coordinates. The European inset includes Iceland and labels the 18 new countries with ISO two-letter codes.
