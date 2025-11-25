#!/usr/bin/env python3
"""
壊れたリンクを修正
"""

import re
from pathlib import Path

# リンク修正マッピング
LINK_REPLACEMENTS = {
    'href="/vcp-spec"': 'href="https://github.com/VeritasChain/vcp-spec"',
    "href='/vcp-spec'": "href='https://github.com/VeritasChain/vcp-spec'",
    'href="/sdk"': 'href="/vcp/developers/"',
    "href='/sdk'": "href='/vcp/developers/'",
    'href="/blog/"': 'href="/"',
    "href='/blog/'": "href='/'",
    'href="/blog"': 'href="/"',
    "href='/blog'": "href='/'",
    'href="/community"': 'href="/partners/"',
    "href='/community'": "href='/partners/'",
    'href="/faq"': 'href="/certified/faq/"',
    "href='/faq'": "href='/certified/faq/'",
    'href="/pilot-program"': 'href="/certified/apply"',
    "href='/pilot-program'": "href='/certified/apply'",
    'href="/downloads"': 'href="/support/"',
    "href='/downloads'": "href='/support/'",
    'href="/login"': 'href="/support/"',
    "href='/login'": "href='/support/'",
    'href="/repl"': 'href="/vcp/developers/"',
    "href='/repl'": "href='/vcp/developers/'",
}

def fix_broken_links(filepath):
    """ファイル内の壊れたリンクを修正"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = []
        
        # 各リンクを置換
        for old_link, new_link in LINK_REPLACEMENTS.items():
            if old_link in content:
                content = content.replace(old_link, new_link)
                changes_made.append(f"  {old_link} → {new_link}")
        
        # 変更があった場合のみ書き込み
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes_made
        
        return []
    
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return []

def find_and_fix_html_files(root_dir="."):
    """全HTMLファイルを検索して修正"""
    root_path = Path(root_dir)
    html_files = list(root_path.rglob("*.html"))
    
    # node_modules, .git を除外
    html_files = [f for f in html_files 
                  if 'node_modules' not in str(f) and '.git' not in str(f)]
    
    fixed_files = {}
    
    for html_file in html_files:
        changes = fix_broken_links(html_file)
        if changes:
            fixed_files[str(html_file)] = changes
    
    return fixed_files

if __name__ == "__main__":
    print("Fixing broken links in HTML files...\n")
    
    fixed_files = find_and_fix_html_files()
    
    if fixed_files:
        print(f"✓ Fixed {len(fixed_files)} file(s):\n")
        for filepath, changes in fixed_files.items():
            print(f"📄 {filepath}")
            for change in changes:
                print(change)
            print()
    else:
        print("ℹ No broken links found")
    
    print(f"{'='*60}")
    print(f"Total: {len(fixed_files)} file(s) fixed")
    print(f"{'='*60}")
