#!/usr/bin/env python3
"""驗證一份 上群AH 主題頁（<科別>/<主題>.html）的結構完整性。

檢查三件事：
1. HTML 標籤開合是否配對（div/table/tr/td/ul/li/details/summary/figure/svg/g）
2. 左側 TOC 的 showSection('id') 是否都對應到存在的 id="section-id"，
   反過來每個 section 是否都有對應的 TOC 連結
3. JS 裡的 SECTION_NAMES 物件 key 是否跟左側 TOC / section id 完全一致（不多不少）

用法：
    python3 verify_page.py 上群AH/<科別>/<主題>.html
"""
import re
import sys
from html.parser import HTMLParser


class TagChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.void = {"br", "img", "hr", "meta", "link", "input", "area", "base",
                     "col", "embed", "source", "track", "wbr"}
        self.errors = []

    def handle_starttag(self, tag, attrs):
        if tag not in self.void:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if not self.stack:
            self.errors.append(f"多餘的結束標籤 </{tag}>（沒有對應的開始標籤）")
            return
        if self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append(f"標籤不匹配：預期 </{self.stack[-1]}>，卻遇到 </{tag}>")
            if tag in self.stack:
                while self.stack and self.stack[-1] != tag:
                    self.errors.append(f"  （連帶自動關閉未結束的 <{self.stack.pop()}>）")
                if self.stack:
                    self.stack.pop()


def check_tags(html):
    c = TagChecker()
    c.feed(html)
    errors = list(c.errors)
    if c.stack:
        errors.append(f"檔案結尾仍有未關閉的標籤：{c.stack}")
    return errors


def check_toc_sections(html):
    errors = []
    toc_match = re.search(r'<nav class="toc">(.*?)</nav>', html, re.S)
    toc_ids = set(re.findall(r"showSection\('([a-zA-Z0-9_]+)'\)", toc_match.group(1))) if toc_match else set()
    section_ids = set(re.findall(r'<div class="section" id="section-([a-zA-Z0-9_]+)"', html))

    missing_section = toc_ids - section_ids
    missing_toc = section_ids - toc_ids
    if missing_section:
        errors.append(f"TOC 連結指向不存在的 section：{sorted(missing_section)}")
    if missing_toc:
        errors.append(f"以下 section 沒有對應的 TOC 連結：{sorted(missing_toc)}")

    names_match = re.search(r"const SECTION_NAMES\s*=\s*\{(.*?)\};", html, re.S)
    if names_match:
        names_keys = set(re.findall(r"(\w+):\s*'", names_match.group(1)))
        missing_names = section_ids - names_keys
        extra_names = names_keys - section_ids
        if missing_names:
            errors.append(f"SECTION_NAMES 漏掉這些 section：{sorted(missing_names)}")
        if extra_names:
            errors.append(f"SECTION_NAMES 有多餘、指向不存在 section 的 key：{sorted(extra_names)}")
    else:
        errors.append("找不到 SECTION_NAMES 物件（<script> 裡應該要有）")

    return errors


def check_section_numbering(html):
    errors = []
    nums = [int(n) for n in re.findall(r'<div class="section-num">(\d+)</div>', html)]
    expected = list(range(1, len(nums) + 1))
    if nums != expected:
        errors.append(f"section-num 編號不連續或有跳號：實際順序 {nums}，預期 {expected}")
    return errors


def main():
    if len(sys.argv) < 2:
        print("用法: python3 verify_page.py <html路徑>")
        sys.exit(1)

    path = sys.argv[1]
    with open(path, encoding="utf-8") as f:
        html = f.read()

    all_errors = []
    all_errors += [f"[標籤配對] {e}" for e in check_tags(html)]
    all_errors += [f"[TOC/SECTION_NAMES] {e}" for e in check_toc_sections(html)]
    all_errors += [f"[章節編號] {e}" for e in check_section_numbering(html)]

    if all_errors:
        print(f"✗ {path} 發現 {len(all_errors)} 個問題：\n")
        for e in all_errors:
            print(" -", e)
        sys.exit(1)
    else:
        print(f"✓ {path} 全部通過")


if __name__ == "__main__":
    main()
