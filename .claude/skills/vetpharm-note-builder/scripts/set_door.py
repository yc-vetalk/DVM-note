#!/usr/bin/env python3
"""把藥理學 index.html 中標題為 TITLE 的 pending 卡片換成連結卡片（或更新既有卡片的連結與描述）。

用法：python3 set_door.py index.html "卡片標題" "目標.html" "描述文字" [color]
"""
import re, sys

path, title, href, desc = sys.argv[1:5]
color = sys.argv[5] if len(sys.argv) > 5 else "amber"
s = open(path, encoding="utf-8").read()
lis = list(re.finditer(r"<li>.*?</li>", s, re.S))
for m in lis:
    block = m.group(0)
    if f'hero-door__title">{title}</h3>' not in block:
        continue
    idx = re.search(r'hero-door__index">(\d+)<', block).group(1)
    new = f'''<li>
      <a class="hero-door hero-door--{color}" href="{href}">
        <div class="hero-door__body">
          <span class="hero-door__index">{idx}</span>
          <h3 class="hero-door__title">{title}</h3>
          <p class="hero-door__desc">{desc}</p>
          <span class="hero-door__link">閱讀筆記 →</span>
        </div>
      </a>
    </li>'''
    s = s[:m.start()] + new + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)
    print("updated", title)
    break
else:
    sys.exit(f"找不到卡片：{title}")
