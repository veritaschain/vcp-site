#!/usr/bin/env python3
"""
Add self-referencing hreflang tags to English-only pages.
"""

import re

# Pages that are English-only (no JA/ZH versions)
ENGLISH_ONLY_PAGES = {
    "./explorer/app/index.html": "https://veritaschain.org/explorer/app/",
    "./legal/index.html": "https://veritaschain.org/legal/",
    "./partners/index.html": "https://veritaschain.org/partners/",
    "./press/VCP_Fact_Sheet_Graphical.html": "https://veritaschain.org/press/VCP_Fact_Sheet_Graphical.html",
    "./press/index-old.html": "https://veritaschain.org/press/index-old.html",
    "./press/index-world-class.html": "https://veritaschain.org/press/index-world-class.html",
    "./press/index.html": "https://veritaschain.org/press/",
    "./press/vcp-fact-sheet.html": "https://veritaschain.org/press/vcp-fact-sheet.html",
    "./vcp/specification/index.html": "https://veritaschain.org/vcp/specification/",
}

def add_hreflang(filepath, canonical_url):
    """Add hreflang tags to an English-only page."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if hreflang already exists
        if 'hreflang' in content:
            print(f"  SKIP: {filepath} (already has hreflang)")
            return False
        
        # Create hreflang tags
        hreflang_tags = f'''    <!-- Language Alternates -->
    <link rel="alternate" hreflang="en" href="{canonical_url}" />
    <link rel="alternate" hreflang="x-default" href="{canonical_url}" />'''
        
        # Find insertion point - after canonical or before </head>
        canonical_pattern = r'(<link rel="canonical"[^>]*>)'
        if re.search(canonical_pattern, content):
            # Insert after canonical tag
            content = re.sub(
                canonical_pattern,
                r'\1\n' + hreflang_tags,
                content,
                count=1
            )
        else:
            # Insert before </head>
            content = content.replace('</head>', hreflang_tags + '\n</head>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  UPDATED: {filepath}")
        return True
        
    except Exception as e:
        print(f"  ERROR: {filepath} - {e}")
        return False

def main():
    print("=" * 60)
    print("Adding hreflang to English-only pages")
    print("=" * 60)
    print(f"\nPages to process: {len(ENGLISH_ONLY_PAGES)}")
    print("-" * 60)
    
    updated_count = 0
    
    for filepath, canonical_url in ENGLISH_ONLY_PAGES.items():
        if add_hreflang(filepath, canonical_url):
            updated_count += 1
    
    print("-" * 60)
    print(f"\nSummary: Updated {updated_count} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
