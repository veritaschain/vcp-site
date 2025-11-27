#!/usr/bin/env python3
"""
全HTMLファイルのVCPメニューにLaunch Explorerリンクを追加
"""

import re
from pathlib import Path

# 言語別のLaunch Explorerテキスト
LAUNCH_EXPLORER_LINKS = {
    'en': '<a href="https://veritaschain.org/explorer/app/" class="dropdown-item dropdown-item-highlight" target="_blank" rel="noopener">🚀 Launch Explorer</a>',
    'ja': '<a href="https://veritaschain.org/explorer/app/" class="dropdown-item dropdown-item-highlight" target="_blank" rel="noopener">🚀 Explorerを起動</a>',
    'zh': '<a href="https://veritaschain.org/explorer/app/" class="dropdown-item dropdown-item-highlight" target="_blank" rel="noopener">🚀 启动浏览器</a>',
}

def detect_language(filepath):
    """ファイルの言語を検出"""
    filepath_str = str(filepath)
    if '/ja/' in filepath_str or filepath_str == 'ja/index.html':
        return 'ja'
    elif '/zh/' in filepath_str or filepath_str == 'zh/index.html':
        return 'zh'
    return 'en'

def add_launch_explorer(filepath):
    """VCPメニューにLaunch Explorerリンクを追加"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 既にLaunch Explorerリンクがあるか確認
        if '/explorer/app' in content:
            return False, "Already has Launch Explorer link"
        
        # VCPメニュー内のExplorer の後にLaunch Explorerを追加
        lang = detect_language(filepath)
        launch_link = LAUNCH_EXPLORER_LINKS.get(lang, LAUNCH_EXPLORER_LINKS['en'])
        
        # パターン: Explorer</a> の後（VCPメニュー内）
        pattern = r'(<a href="https://veritaschain\.org/explorer/" class="dropdown-item"[^>]*>Explorer</a>)'
        replacement = r'\1\n                        ' + launch_link
        
        original_content = content
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content, count=1)
        
        # 日本語パターン
        if content == original_content:
            pattern_ja = r'(<a href="https://veritaschain\.org/explorer/" class="dropdown-item"[^>]*>エクスプローラー</a>)'
            if re.search(pattern_ja, content):
                content = re.sub(pattern_ja, r'\1\n                        ' + launch_link, content, count=1)
        
        # 中国語パターン
        if content == original_content:
            pattern_zh = r'(<a href="https://veritaschain\.org/explorer/" class="dropdown-item"[^>]*>浏览器</a>)'
            if re.search(pattern_zh, content):
                content = re.sub(pattern_zh, r'\1\n                        ' + launch_link, content, count=1)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, f"Added Launch Explorer ({lang})"
        
        return False, "Pattern not found"
    
    except Exception as e:
        return False, f"Error: {e}"

def find_and_update_html_files(root_dir="."):
    """全HTMLファイルを検索して更新"""
    root_path = Path(root_dir)
    html_files = list(root_path.rglob("*.html"))
    
    # node_modules, .git を除外
    html_files = [f for f in html_files 
                  if 'node_modules' not in str(f) 
                  and '.git' not in str(f)]
    
    updated = []
    skipped = []
    
    for html_file in html_files:
        # ナビゲーションがあるファイルのみ処理
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'dropdown-menu' in content and 'veritaschain.org/explorer/' in content:
            success, message = add_launch_explorer(html_file)
            if success:
                updated.append((str(html_file), message))
            else:
                skipped.append((str(html_file), message))
    
    return updated, skipped

if __name__ == "__main__":
    print("Adding Launch Explorer link to VCP menu in all HTML files...\n")
    
    updated, skipped = find_and_update_html_files()
    
    if updated:
        print(f"✓ Updated {len(updated)} file(s):\n")
        for filepath, message in updated:
            print(f"  📄 {filepath} - {message}")
    
    if skipped:
        print(f"\nℹ Skipped {len(skipped)} file(s):")
        for filepath, message in skipped[:10]:
            print(f"  ⏭ {filepath} - {message}")
        if len(skipped) > 10:
            print(f"  ... and {len(skipped) - 10} more")
    
    print(f"\n{'='*60}")
    print(f"Total: {len(updated)} updated, {len(skipped)} skipped")
    print(f"{'='*60}")
