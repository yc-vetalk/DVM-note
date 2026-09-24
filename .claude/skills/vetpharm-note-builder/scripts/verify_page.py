#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
每次改完藥理學頁面（或任何同款式的 DVM-note 內頁）後跑一次，一次檢查完所有常見錯誤：
  1. <div>/<table>/<ul> 開合是否配對
  2. 左側 TOC 的 showSection('id') 是否都對應到一個 id="section-id"（反之亦然）
  3. 若有給 --index，檢查藥品索引.html 裡所有指向這個頁面的錨點連結是否都存在

用法：
  python3 .claude/skills/vetpharm-note-builder/scripts/verify_page.py \
      DVM-note/大三/獸醫藥理學/鴉片類止痛藥.html \
      --index DVM-note/大三/獸醫藥理學/藥品索引.html

只給頁面路徑、不給 --index 也可以，會跳過第 3 項檢查。
結束碼：全部通過為 0，有任何錯誤為 1（方便串在腳本或 CI 裡）。
"""
import argparse
import re
import sys


def check_tag_balance(content, tag):
    open_count = len(re.findall(rf'<{tag}(?:\s|>)', content))
    close_count = content.count(f'</{tag}>')
    return open_count, close_count


def check_toc_sections(content):
    toc_ids = set(re.findall(r"showSection\('([a-zA-Z0-9_-]+)'\)", content))
    section_ids = set(re.findall(r'id="section-([a-zA-Z0-9_-]+)"', content))
    only_in_toc = toc_ids - section_ids
    only_in_sections = section_ids - toc_ids
    return only_in_toc, only_in_sections


def check_index_anchors(index_content, page_filename, page_content):
    pattern = re.escape(page_filename) + r'#([a-zA-Z0-9_-]+)'
    referenced = set(re.findall(pattern, index_content))
    missing = []
    for anchor_id in sorted(referenced):
        if f'id="{anchor_id}"' not in page_content:
            missing.append(anchor_id)
    return missing


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('page_path')
    ap.add_argument('--index', help='藥品索引.html 的路徑，會順便檢查指向此頁的錨點連結')
    args = ap.parse_args()

    with open(args.page_path, encoding='utf-8') as f:
        content = f.read()

    ok = True

    print(f"=== 結構檢查：{args.page_path} ===")
    for tag in ('div', 'table', 'ul'):
        o, c = check_tag_balance(content, tag)
        status = 'OK' if o == c else 'MISMATCH'
        if o != c:
            ok = False
        print(f"  <{tag}>: {o} 開 / {c} 合  [{status}]")

    only_toc, only_sections = check_toc_sections(content)
    if only_toc or only_sections:
        ok = False
        print("  TOC／章節 id 對不上：")
        for i in sorted(only_toc):
            print(f"    - TOC 有 showSection('{i}')，但找不到 id=\"section-{i}\"")
        for i in sorted(only_sections):
            print(f"    - 有 id=\"section-{i}\"，但 TOC 沒有對應的導覽連結")
    else:
        print("  TOC／章節 id：OK（互相對應）")

    if args.index:
        import os
        page_filename = os.path.basename(args.page_path)
        with open(args.index, encoding='utf-8') as f:
            index_content = f.read()
        missing = check_index_anchors(index_content, page_filename, content)
        if missing:
            ok = False
            print(f"  藥品索引.html 裡指向本頁、但頁面內找不到的錨點：")
            for m in missing:
                print(f"    - MISSING: #{m}")
        else:
            print("  藥品索引.html 錨點連結：OK（全部有效）")

    print()
    print("全部通過 ✓" if ok else "有錯誤，請修正後重跑 ✗")
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
