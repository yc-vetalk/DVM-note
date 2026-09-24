#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把「藥品索引.html」裡某個主題所有還是「—」佔位符的機轉／標的欄，用一份 JSON 對照表填上真正的內容。

這是重建頁面後的固定收尾動作：頁面本身寫完只是一半，藥品索引的機轉欄不補齊，
使用者在索引表上還是只看得到「—」，等於那個主題「看起來」還沒做完。

JSON 對照表格式：{ "完整的 data-search 屬性字串": "機轉／標的文字", ... }
key 必須是該行 <tr> 的 data-search="..." 屬性「整串原文」，不要只取藥名，
因為部分藥物名稱重複出現在不同 data-search 字串前段（例如 "thiopental" 同時出現在
鎮靜與注射式兩個主題的 cross-listed 列），只取字首容易對錯行。
最快拿到這份原文的方法：
  grep -o 'data-search="[^"]*"' 藥品索引.html | grep <主題名>

用法：
  python3 fill_drug_index.py 藥品索引.html mechanisms.json
  python3 fill_drug_index.py 藥品索引.html mechanisms.json --dry-run   # 先預覽，不寫檔

跑完務必用 verify_page.py 或手動確認 <table>/<tr> 開合數沒有跑掉。
"""
import argparse
import json
import re


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('index_path')
    ap.add_argument('mapping_json', help='{"data-search 原文": "機轉／標的文字"} 的 JSON 檔')
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    with open(args.mapping_json, encoding='utf-8') as f:
        mech = json.load(f)

    with open(args.index_path, encoding='utf-8') as f:
        lines = f.readlines()

    count = 0
    unmatched_keys = set(mech.keys())
    already_filled = []

    for i, line in enumerate(lines):
        if 'data-search="' not in line:
            continue
        m = re.search(r'data-search="([^"]*)"', line)
        if not m:
            continue
        key = m.group(1)
        if key not in mech:
            continue
        unmatched_keys.discard(key)
        replacement_text = mech[key]

        def do_replace(mo):
            return mo.group(1) + replacement_text + mo.group(2)

        new_line, n = re.subn(
            r'(<td style="font-size:\.85em; color:var\(--fg-faint\);">)—(</td>)',
            do_replace,
            line,
            count=1,
        )
        if n == 0:
            already_filled.append(key)
            continue
        lines[i] = new_line
        count += 1

    print(f"填入：{count} 筆")
    if already_filled:
        print(f"已經有內容、跳過（不是 '—' 佔位符）：{len(already_filled)} 筆")
        for k in already_filled:
            print(f"  - {k}")
    if unmatched_keys:
        print(f"JSON 裡有、但在檔案中找不到對應 data-search 的 key：{len(unmatched_keys)} 筆"
              "（通常是原文複製打錯字，去對一下 grep 結果）")
        for k in sorted(unmatched_keys):
            print(f"  - {k}")

    if args.dry_run:
        print("（--dry-run，未寫入檔案）")
        return

    with open(args.index_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print(f"已寫回：{args.index_path}")


if __name__ == '__main__':
    main()
