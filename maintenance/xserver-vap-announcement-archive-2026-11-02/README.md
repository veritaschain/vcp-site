# VAP announcement archive — 2 November 2026

Website navigation and presentation only. Two homepages show three compact notices after the hero; nine full notices per language move to `/updates/` and `/ja/updates/`. Existing dated detail URLs and historical evidence remain intact. Unadopted status and independent reproduction not established remain visible. First-party CI is not independent fresh execution.

Before applying `update.patch` at the VAP site root, match every existing file against `manifest.json` and preserve an off-public-root backup. Stop on mismatches. Create the two new directories without replacing other content. After deployment, match public SHA-256 hashes and inspect PC/mobile views, filters and legacy fragment links.

The two homepages and two archives use the shared CSS/JS at `https://veritaschain.org/assets/css/news-archive.css` and `/assets/js/news-archive.js`; publish those assets first. `tools/build.py` reproduces all changed pages, sitemap and llms text. Its unchanged renderer is retained for all other pages.

The patch contains no normative, schema, research implementation, signed data, fixed distribution or K3 changes. No dates or results in the original notice bodies are rewritten. The source website backup and live-byte manifests are retained with the local publication record.
