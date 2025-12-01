#!/usr/bin/env python3
"""
SEO Optimization Script for VeritasChain website
- Add/update title with "VeritasChain Protocol (VCP) – Cryptographic Audit Standard"
- Add canonical tags
- Add hreflang tags for multilingual pages
"""

import os
import re
from pathlib import Path

# Base URL
BASE_URL = "https://veritaschain.org"

# Brand suffix for titles
BRAND_SUFFIX = " | VeritasChain Protocol (VCP) – Cryptographic Audit Standard"
BRAND_SUFFIX_SHORT = " | VCP – Cryptographic Audit Standard"

# Files to skip
SKIP_FILES = [
    'docs/',
    'index-old.html',
    'index-world-class.html',
]

# Multilingual page groups (base_path -> {lang: path})
def get_multilingual_groups():
    """Define multilingual page relationships"""
    groups = {}
    
    # Standard pattern: /path/, /path/ja/, /path/zh/
    standard_paths = [
        '',  # home
        'vso',
        'vso/policies',
        'certified',
        'certified/faq',
        'certified/apply',
        'propfirms',
        'vcp/developers',
        'vcp/explorer-api',
        'company',
        'solutions/exchanges',
        'support',
        'explorer',
        'media',
        'impressum',
        'privacy',
        'sec',
        'standardization',
        'terms',
        'use-cases',
        'what-is-vcp',
    ]
    
    for path in standard_paths:
        if path == '':
            groups[''] = {
                'en': '/',
                'ja': '/ja/',
                'zh': '/zh/',
            }
        else:
            groups[path] = {
                'en': f'/{path}/',
                'ja': f'/{path}/ja/',
                'zh': f'/{path}/zh/',
            }
    
    # Special pattern: /ja/path/, /zh/path/
    special_paths = [
        'company',
    ]
    
    for path in special_paths:
        if path not in groups:
            groups[path] = {}
        groups[path]['en'] = f'/{path}/'
        groups[path]['ja'] = f'/ja/{path}/'
        groups[path]['zh'] = f'/zh/{path}/'
    
    return groups


def get_canonical_url(filepath):
    """Generate canonical URL from filepath"""
    # Convert filepath to URL
    rel_path = filepath.replace('./','')
    
    if rel_path.endswith('/index.html'):
        url_path = '/' + rel_path.replace('/index.html', '/')
    elif rel_path == 'index.html':
        url_path = '/'
    else:
        url_path = '/' + rel_path
    
    return BASE_URL + url_path


def get_hreflang_for_file(filepath):
    """Get hreflang links for a file"""
    rel_path = filepath.replace('./', '').replace('/index.html', '').replace('index.html', '')
    
    groups = get_multilingual_groups()
    
    # Find which group this file belongs to
    for base_path, langs in groups.items():
        for lang, url_path in langs.items():
            check_path = url_path.strip('/')
            if rel_path == check_path or (rel_path == '' and check_path == ''):
                # Found the group
                return langs
    
    # Check for /ja/ or /zh/ prefixed paths
    if rel_path.startswith('ja/'):
        base = rel_path[3:]  # Remove 'ja/'
        if base in groups:
            return groups[base]
    elif rel_path.startswith('zh/'):
        base = rel_path[3:]  # Remove 'zh/'
        if base in groups:
            return groups[base]
    
    return None


def update_html_file(filepath):
    """Update a single HTML file with SEO improvements"""
    
    # Skip certain files
    for skip in SKIP_FILES:
        if skip in filepath:
            print(f"  ⏭️  Skipped: {filepath}")
            return False
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"  ❌ Error reading {filepath}: {e}")
        return False
    
    original_content = content
    changes = []
    
    # 1. Update/Add title with brand
    title_match = re.search(r'<title>([^<]+)</title>', content)
    if title_match:
        current_title = title_match.group(1)
        # Check if brand is already in title
        if 'VeritasChain Protocol' not in current_title and 'VCP' not in current_title:
            # Add brand suffix (use short version if title is long)
            if len(current_title) > 40:
                new_title = current_title + BRAND_SUFFIX_SHORT
            else:
                new_title = current_title + BRAND_SUFFIX
            content = content.replace(f'<title>{current_title}</title>', f'<title>{new_title}</title>')
            changes.append('title')
        elif 'Cryptographic Audit Standard' not in current_title:
            # Has VCP but not full brand
            if '|' in current_title:
                # Replace existing brand part
                parts = current_title.split('|')
                new_title = parts[0].strip() + BRAND_SUFFIX
                content = content.replace(f'<title>{current_title}</title>', f'<title>{new_title}</title>')
                changes.append('title')
    
    # 2. Update/Add meta description with brand mention
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', content)
    if desc_match:
        current_desc = desc_match.group(1)
        if 'VeritasChain' not in current_desc and 'VCP' not in current_desc:
            # Prepend brand context
            new_desc = f"VeritasChain Protocol (VCP) - {current_desc}"
            if len(new_desc) > 160:
                new_desc = new_desc[:157] + "..."
            content = re.sub(
                r'<meta\s+name=["\']description["\']\s+content=["\']' + re.escape(current_desc) + r'["\']',
                f'<meta name="description" content="{new_desc}"',
                content
            )
            changes.append('description')
    
    # 3. Add canonical tag if missing
    canonical_url = get_canonical_url(filepath)
    if '<link rel="canonical"' not in content:
        # Find </head> and insert before it
        canonical_tag = f'    <link rel="canonical" href="{canonical_url}" />\n'
        content = content.replace('</head>', canonical_tag + '</head>')
        changes.append('canonical')
    
    # 4. Add/Update hreflang tags
    hreflang_data = get_hreflang_for_file(filepath)
    if hreflang_data:
        # Check if hreflang tags already exist
        if 'hreflang=' not in content:
            # Build hreflang tags
            hreflang_tags = []
            for lang, url_path in hreflang_data.items():
                hreflang = 'zh-CN' if lang == 'zh' else lang
                hreflang_tags.append(f'    <link rel="alternate" hreflang="{hreflang}" href="{BASE_URL}{url_path}" />')
            hreflang_tags.append(f'    <link rel="alternate" hreflang="x-default" href="{BASE_URL}{hreflang_data.get("en", "/")}" />')
            
            hreflang_block = '\n'.join(hreflang_tags) + '\n'
            content = content.replace('</head>', hreflang_block + '</head>')
            changes.append('hreflang')
    
    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✅ Updated: {filepath} [{', '.join(changes)}]")
        return True
    else:
        print(f"  ⏭️  No changes: {filepath}")
        return False


def main():
    print("=" * 60)
    print("SEO Optimization for VeritasChain Website")
    print("=" * 60)
    
    # Find all HTML files
    html_files = []
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and docs
        if 'node_modules' in root or '/docs/' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                html_files.append(filepath)
    
    html_files.sort()
    
    print(f"\nFound {len(html_files)} HTML files\n")
    
    updated_count = 0
    for filepath in html_files:
        if update_html_file(filepath):
            updated_count += 1
    
    print("\n" + "=" * 60)
    print(f"Summary: Updated {updated_count} / {len(html_files)} files")
    print("=" * 60)


if __name__ == '__main__':
    main()
