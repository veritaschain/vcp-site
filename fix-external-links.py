#!/usr/bin/env python3
"""
Fix external links to include rel="noopener noreferrer" for security.
"""

import os
import re

def fix_external_links(filepath):
    """Add rel="noopener noreferrer" to external links with target="_blank"."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern to find target="_blank" that doesn't have rel attribute nearby
        # This is a simplified approach - we'll add rel after target="_blank"
        
        # Pattern 1: target="_blank" without rel (on same line or multi-line)
        # Match <a ... target="_blank" ... > where there's no rel= before >
        
        def add_rel_attribute(match):
            full_tag = match.group(0)
            # Check if rel= already exists in the tag
            if 'rel=' in full_tag:
                return full_tag
            # Add rel="noopener noreferrer" after target="_blank"
            return full_tag.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
        
        # Match anchor tags with target="_blank"
        # This pattern matches from <a to > capturing everything
        pattern = r'<a[^>]*target="_blank"[^>]*>'
        content = re.sub(pattern, add_rel_attribute, content)
        
        # Also handle cases where target is in a different format
        pattern2 = r"<a[^>]*target='_blank'[^>]*>"
        content = re.sub(pattern2, lambda m: add_rel_attribute(m), content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"  ERROR: {filepath} - {e}")
        return False

def main():
    print("=" * 60)
    print("Fixing External Links (adding rel='noopener noreferrer')")
    print("=" * 60)
    
    # Get all HTML files
    html_files = []
    for root, dirs, files in os.walk('.'):
        # Skip node_modules and .git
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'docs']]
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))
    
    print(f"\nFound {len(html_files)} HTML files")
    print("-" * 60)
    
    updated_count = 0
    for filepath in sorted(html_files):
        if fix_external_links(filepath):
            print(f"  UPDATED: {filepath}")
            updated_count += 1
    
    print("-" * 60)
    print(f"\nSummary: Updated {updated_count} files")
    print("=" * 60)

if __name__ == "__main__":
    main()
