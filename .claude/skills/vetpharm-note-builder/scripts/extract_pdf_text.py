#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
從 PDF（課程講義或教科書）擷取全文，加上頁碼標記，存成 .txt 供 Read 工具逐段閱讀或用 grep 搜尋。

用法：
  ./.venv/bin/python .claude/skills/vetpharm-note-builder/scripts/extract_pdf_text.py \
      "大三上/獸醫藥理學/A6 CNS narcotic.pdf" \
      /tmp/pharm_extract/raw_narcotic.txt

  # 教科書這種大檔案，建議存到持久快取位置（不會被 /tmp 清掉），下次可直接 grep：
  ./.venv/bin/python .claude/skills/vetpharm-note-builder/scripts/extract_pdf_text.py \
      "textbook/Veterinary Pharmacology and Therapeutics, 10th Edition (VetBooks.ir)-1.pdf" \
      textbook/_extracted/VPT10_pages.txt

輸出格式：每頁以 "=====PAGE N=====" 分隔，N 為 1-based 頁碼（與 PDF 檢視器頁碼一致）。
"""
import argparse
import os
import sys

import fitz  # pymupdf


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf_path')
    ap.add_argument('out_path')
    args = ap.parse_args()

    doc = fitz.open(args.pdf_path)
    out = []
    for i, page in enumerate(doc):
        text = page.get_text()
        out.append(f"=====PAGE {i + 1}=====\n{text}")

    os.makedirs(os.path.dirname(args.out_path) or '.', exist_ok=True)
    with open(args.out_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(out))

    total_chars = sum(len(x) for x in out)
    print(f"頁數：{doc.page_count}")
    print(f"總字元數：{total_chars}")
    print(f"平均每頁：{total_chars // max(doc.page_count, 1)} 字元", file=sys.stderr)
    if doc.page_count and total_chars // doc.page_count < 300:
        print("⚠ 平均每頁字元數偏低，這份 PDF 可能是圖片投影片為主，"
              "內容理解務必搭配 extract_pdf_images.py 擷取關鍵頁面圖片來看，不能只讀文字。",
              file=sys.stderr)
    print(f"已寫入：{args.out_path}")


if __name__ == '__main__':
    main()
