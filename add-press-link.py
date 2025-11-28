#!/usr/bin/env python3
"""
全HTMLファイルのAboutメニューにPressリンクを追加
"""

import re
from pathlib import Path

# 言語別のPressテキスト
PRESS_LINKS = {
    'en': '<a href="https://veritaschain.org/press/" class="dropdown-item" target="_blank" rel="noopener">Press Kit</a>',
    'ja': '<a href="https://veritaschain.org/press/" class="dropdown-item" target="_blank" rel="noopener">プレスキット</a>',
    'zh': '<a href="https://veritaschain.org/press/" class="dropdown-item" target="_blank" rel="noopener">新闻资料</a>',
}

def detect_language(filepath, content):
    """ファイルの言語を検出"""
    filepath_str = str(filepath)
    if '/ja/' in filepath_str or filepath_str.endswith('/ja/index.html'):
        return 'ja'
    elif '/zh/' in filepath_str or filepath_str.endswith('/zh/index.html'):
        return 'zh'
    return 'en'

def add_press_link(filepath):
    """AboutメニューにPressリンクを追加"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 既にPressリンクがあるか確認
        if '/press/' in content and 'dropdown-item' in content:
            return False, "Already has Press link"
        
        # Aboutメニュー内のEcosystem Partners の後にPressを追加
        # パターン: Ecosystem Partners</a> の後
        lang = detect_language(filepath, content)
        press_link = PRESS_LINKS.get(lang, PRESS_LINKS['en'])
        
        # 複数パターンで試行
        patterns = [
            # パターン1: Ecosystem Partners の後
            (r'(<a href="[^"]*partners/?"[^>]*>[^<]*</a>)',
             r'\1\n                        ' + press_link),
            # パターン2: 生态合作伙伴 の後 (中国語)
            (r'(<a href="[^"]*partners/?"[^>]*>生态合作伙伴</a>)',
             r'\1\n                        ' + press_link),
            # パターン3: エコシステムパートナー の後 (日本語)
            (r'(<a href="[^"]*partners/?"[^>]*>エコシステムパートナー</a>)',
             r'\1\n                        ' + press_link),
        ]
        
        original_content = content
        for pattern, replacement in patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content, count=1)
                break
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, f"Added Press link ({lang})"
        
        return False, "Pattern not found"
    
    except Exception as e:
        return False, f"Error: {e}"

def find_and_update_html_files(root_dir="."):
    """全HTMLファイルを検索して更新"""
    root_path = Path(root_dir)
    html_files = list(root_path.rglob("*.html"))
    
    # node_modules, .git, press/ を除外
    html_files = [f for f in html_files 
                  if 'node_modules' not in str(f) 
                  and '.git' not in str(f)
                  and '/press/' not in str(f)]
    
    updated = []
    skipped = []
    
    for html_file in html_files:
        # ナビゲーションがあるファイルのみ処理
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'dropdown-menu' in content and 'partners' in content.lower():
            success, message = add_press_link(html_file)
            if success:
                updated.append((str(html_file), message))
            else:
                skipped.append((str(html_file), message))
    
    return updated, skipped

if __name__ == "__main__":
    print("Adding Press link to About menu in all HTML files...\n")
    
    updated, skipped = find_and_update_html_files()
    
    if updated:
        print(f"✓ Updated {len(updated)} file(s):\n")
        for filepath, message in updated:
            print(f"  📄 {filepath} - {message}")
    
    if skipped:
        print(f"\nℹ Skipped {len(skipped)} file(s):")
        for filepath, message in skipped[:10]:  # 最初の10件のみ表示
            print(f"  ⏭ {filepath} - {message}")
        if len(skipped) > 10:
            print(f"  ... and {len(skipped) - 10} more")
    
    print(f"\n{'='*60}")
    print(f"Total: {len(updated)} updated, {len(skipped)} skipped")
    print(f"{'='*60}")
