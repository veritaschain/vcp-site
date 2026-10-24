# VSO SEO implementation — 24 October 2026

## Search intent and evidence

Google Trends Explore was read on 24 October 2026: past 12 months, all categories, web search, search terms (not Topics). Weekly table dates were 19 October 2025–18 October 2026. The JSON in this folder preserves the exact comparison URLs, methodology and caveats. The three CSVs are transcribed from the visible chart tables, **not Google native exports**.

Within the worldwide core comparison, displayed averages were AI governance 38, AI audit 25, AI provenance 3 and algorithmic trading 6. Within the Japan comparison, AIガバナンス 5, AI監査 4, AIエージェント 71 and 監査ログ 4. These are sampled, normalized indices, not search counts; indices from separate comparisons cannot be compared directly. A displayed zero does not establish zero searches. Worldwide English query wording is not an English-language audience filter. AI audit has mixed intent; unrelated related-query suggestions were excluded.

The resulting content connects governance and agent oversight questions to VSO's specific expertise: verifiable records. It does not position VAP or VCP as a complete governance system, certify AI decision quality, or claim regulatory endorsement.

## Implemented changes

- Search-oriented EN/JA/ZH home metadata; the existing Flight Recorder slogan remains visible.
- Four substantial English/Japanese guides on AI governance and AI audit trails, with examples, evaluation checklists, sources, static navigation, article/breadcrumb data and reciprocal language annotations.
- Static related-resource links on twelve main landing pages and localized shared-header guide links. Chinese navigation explicitly labels the English guides; nonexistent translations are not advertised.
- A human-readable directory at `/sitemap/`, generated from canonical public pages. All 341 canonical pages can now be reached from the homepage through source HTML anchors. The check does not rely on JavaScript navigation or inferred hreflang links.
- Default-theme Tailwind utilities precompiled for VAP, What is VCP, certification and use cases in EN/JA/ZH (12 pages). Other pages with separate layouts/configuration retain their existing delivery; no unmeasured Core Web Vitals improvement is claimed.
- Twelve specific obsolete paths mapped to existing relevant destinations, plus a bilingual 404 page. GitHub Pages uses immediate HTML meta refresh with destination canonical, not HTTP 301. Unknown/scanner paths retain 404 responses. Redirect aliases are excluded from the sitemap.
- Broker-page metadata aligned with audit-record capabilities in three languages. The obsolete duplicate WebPage block, including an inappropriate Product/zero-price Offer on the English protocol page, was removed. The remaining WebPage describes the protocol as a CreativeWork.
- New guide/directory entries and factual modification dates in the multilingual XML sitemap. Existing unrelated lastmod dates retained.
- CI checks for source-link reachability and legacy destinations; a navigation regression test covers Japanese guide routes and Chinese fallback.
- Removed inactive Cloudflare rules that would redirect the real blog to the homepage if that configuration were used. Production hosting was verified as GitHub Pages from `main`, repository root.

## Maintenance and validation

Run from the repository root after content changes:

```sh
python3 scripts/seo.py sitemap
python3 scripts/build-site-directory.py
python3 scripts/build-legacy-aliases.py build
python3 scripts/seo.py check
python3 scripts/build-legacy-aliases.py check
node --test tests/*.test.cjs
```

The sitemap remains an explicit allowlist. Add a new canonical page to XML first; do not add aliases, demos or drafts automatically. Update lastmod only when the page changes. Regenerate the directory after changing a page title; regenerate aliases after changing destination metadata.

Rebuild the twelve landing pages' stylesheet after changing their utility classes:

```sh
sh scripts/build-landing-css.sh
```

Validation at implementation: 341 canonical pages checked, 341 statically reachable, zero SEO/link errors, 12 valid aliases, 14 JavaScript tests passed. Browser checks covered the new Japanese guide at desktop/mobile widths, VAP desktop, and certification mobile; these are visual checks rather than a field-performance benchmark.

## Measurement and remaining external processing

Search Console baseline and account-specific evidence are retained privately outside the public repository. Compare the same 28-day main-site URL filter and search type after recrawling; do not compare property-level and page-filtered impression totals as equivalent. Track non-brand query impressions/clicks, guide indexing and guide-to-specification visits. Keep brand and ambiguous acronym queries separate. Low CTR alone does not establish a title problem.

Indexing, ranking, rich-result eligibility and actual Core Web Vitals are determined by Google and real users. Do not mark historic 404 reports or indexing exclusions resolved solely because code was deployed; some missing URLs are intentionally nonexistent. No ranking increase or traffic gain is asserted at release.

## Primary documentation

- [Google Trends normalization and sampling](https://support.google.com/trends/answer/4365533?hl=en)
- [Google title links](https://developers.google.com/search/docs/appearance/title-link)
- [Canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Sitemap and lastmod guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Useful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [AI search features: existing SEO foundations](https://developers.google.com/search/docs/appearance/ai-features)
