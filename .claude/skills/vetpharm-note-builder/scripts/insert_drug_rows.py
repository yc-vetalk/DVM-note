#!/usr/bin/env python3
"""把整段新的 <tr>...</tr> 藥品索引列，依藥名字母序插入 藥品索引.html。

用途：新主題頁寫完後，除了「只補機轉欄」（fill_drug_index.py）這種骨架已存在
的情境，還有大量「表格裡完全沒有這個藥」的情境，需要手寫完整新 <tr> 並插入
正確的字母序位置。這支腳本自動化插入這一步，插入依據是每個 <tr> 第一個
<td> 裡的藥名（忽略 <span class="tag..."> 常用標籤與換行後的中文名 <div>）。

輸入 JSON 格式：一個陣列，每個元素是 {"tr": "<tr data-topics=...>...</tr>"}
（每個 tr 就是一整段完整、格式正確的 HTML 字串，通常是單行）。

用法：
  python3 insert_drug_rows.py DVM-note/大三/獸醫藥理學/藥品索引.html /tmp/new_rows.json
"""
import argparse
import json
import re


def extract_name(tr_html: str) -> str:
    m = re.search(r"<td>(.*?)</td>", tr_html, re.S)
    if not m:
        return ""
    inner = m.group(1)
    inner = re.sub(r"<span[^>]*>.*?</span>", "", inner, flags=re.S)
    inner = inner.split("<div")[0]
    return inner.strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("index_file")
    ap.add_argument("rows_json")
    args = ap.parse_args()

    with open(args.index_file, encoding="utf-8") as f:
        content = f.read()
    with open(args.rows_json, encoding="utf-8") as f:
        new_rows = json.load(f)

    row_pattern = re.compile(r"<tr .*?</tr>", re.S)

    def scan():
        matches = list(row_pattern.finditer(content))
        return [(m.start(), m.end(), extract_name(m.group(0))) for m in matches]

    existing = scan()
    if not existing:
        raise SystemExit("找不到任何既有 <tr> 列，請確認 index_file 路徑正確")

    inserted = 0
    skipped = []
    for row in new_rows:
        tr_html = row["tr"].strip()
        name = extract_name(tr_html)
        if not name:
            skipped.append((tr_html[:60], "無法解析藥名"))
            continue
        key = name.lower()

        insert_pos = None
        for s, e, ename in existing:
            if ename.lower() > key:
                insert_pos = s
                break
        if insert_pos is None:
            insert_pos = existing[-1][1]

        content = content[:insert_pos] + "            " + tr_html + "\n" + content[insert_pos:]
        existing = scan()
        inserted += 1

    with open(args.index_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"已插入 {inserted} 筆")
    if skipped:
        print(f"跳過 {len(skipped)} 筆（無法解析藥名，請手動處理）：")
        for s, reason in skipped:
            print(f"  - {reason}: {s}")


if __name__ == "__main__":
    main()
