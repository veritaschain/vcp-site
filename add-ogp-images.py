#!/usr/bin/env python3
"""
Add OGP images to pages that don't have og:image meta tags.
"""

import os
import re

# Default OGP image URL
DEFAULT_OGP_IMAGE = "https://veritaschain.org/assets/OGP.png"

# Files to process (without og:image)
files_without_ogp = [
    "./vso/index.html",
    "./vso/policies/index.html",
    "./vso/policies/ja/index.html",
    "./vso/policies/zh/index.html",
    "./vso/ja/index.html",
    "./vso/zh/index.html",
    "./certified/index.html",
    "./certified/faq/index.html",
    "./certified/faq/ja/index.html",
    "./certified/faq/zh/index.html",
    "./certified/ja/index.html",
    "./certified/zh/index.html",
    "./certified/apply/index.html",
    "./certified/apply/ja/index.html",
    "./certified/apply/zh/index.html",
    "./certified/thanks.html",
    "./propfirms/index.html",
    "./propfirms/ja/index.html",
    "./propfirms/zh/index.html",
    "./vcp/specification/index.html",
    "./vcp/developers/index.html",
    "./vcp/developers/ja/index.html",
    "./vcp/developers/zh/index.html",
    "./vcp/explorer-api/index.html",
    "./vcp/explorer-api/ja/index.html",
    "./vcp/explorer-api/zh/index.html",
    "./company/index.html",
    "./ja/company/index.html",
    "./ja/certified/thanks.html",
    "./zh/company/index.html",
    "./zh/certified/thanks.html",
    "./solutions/exchanges/index.html",
    "./solutions/exchanges/ja/index.html",
    "./solutions/exchanges/zh/index.html",
    "./support/index.html",
    "./support/ja/index.html",
    "./support/zh/index.html",
    "./explorer/index.html",
    "./explorer/zh/index.html",
    "./explorer/app/index.html",
    "./explorer/ja/index.html",
    "./partners/index.html",
    "./legal/index.html",
    "./press/index-old.html",
    "./press/index-world-class.html",
]

def add_ogp_image(filepath):
    """Add OGP image meta tags to a file if not present."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if og:image already exists
        if 'og:image' in content:
            print(f"  SKIP: {filepath} (already has og:image)")
            return False
        
        # OGP meta tags to add
        ogp_tags = f'''    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:image" content="{DEFAULT_OGP_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{DEFAULT_OGP_IMAGE}">'''
        
        # Find insertion point - after <meta name="description"> or before </head>
        description_pattern = r'(<meta name="description"[^>]*>)'
        if re.search(description_pattern, content):
            # Insert after description meta tag
            content = re.sub(
                description_pattern,
                r'\1\n' + ogp_tags,
                content,
                count=1
            )
        else:
            # Insert before </head>
            content = content.replace('</head>', ogp_tags + '\n</head>')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  UPDATED: {filepath}")
        return True
        
    except Exception as e:
        print(f"  ERROR: {filepath} - {e}")
        return False

def main():
    print("=" * 60)
    print("Adding OGP Images to Pages")
    print("=" * 60)
    print(f"\nDefault OGP Image: {DEFAULT_OGP_IMAGE}")
    print(f"Files to process: {len(files_without_ogp)}")
    print("-" * 60)
    
    updated_count = 0
    skip_count = 0
    error_count = 0
    
    for filepath in files_without_ogp:
        if os.path.exists(filepath):
            result = add_ogp_image(filepath)
            if result:
                updated_count += 1
            else:
                skip_count += 1
        else:
            print(f"  NOT FOUND: {filepath}")
            error_count += 1
    
    print("-" * 60)
    print(f"\nSummary:")
    print(f"  Updated: {updated_count}")
    print(f"  Skipped: {skip_count}")
    print(f"  Errors:  {error_count}")
    print("=" * 60)

if __name__ == "__main__":
    main()
