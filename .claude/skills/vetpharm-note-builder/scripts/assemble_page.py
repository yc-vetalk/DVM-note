#!/usr/bin/env python3
"""以既有頁面的 header／scripts 為外殼，組裝新的藥理學主題頁。

用法：python3 assemble_page.py BODY.html OUT.html "頁面標題" [--pdfviewer]
- BODY.html：從 <section class="pagehead"> 開始到 </div>（pagewrap 結束）為止的內容
- SECTION_NAMES 由 BODY 中 nav.toc 的 onclick="showSection('id')" 與連結文字自動產生
- 外殼取自同資料夾的 降血壓藥物.html
"""
import json, re, sys
from pathlib import Path

body_path, out_path, title = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
shell = (out_path.parent / "降血壓藥物.html").read_text(encoding="utf-8")
head = shell[:shell.index('<section class="pagehead">')]
head = re.sub(r"<title>.*?</title>", f"<title>獸醫藥理學：{title} - yc._vetalk</title>", head)
script = shell[shell.index("<script>\nfunction showSection"):]
body = Path(body_path).read_text(encoding="utf-8")
toc = body[body.index('<nav class="toc">'):body.index("</nav>")]
names = {}
for sid, label in re.findall(r"showSection\('([^']+)'\)[^>]*>(.*?)</a>", toc, re.S):
    names[sid] = re.sub(r"<[^>]+>", "", label).strip()
js = "const SECTION_NAMES = " + json.dumps(names, ensure_ascii=False, indent=2) + ";"
script, n = re.subn(r"const SECTION_NAMES = \{.*?\};", lambda m: js, script, flags=re.S)
assert n == 1
if "--pdfviewer" in sys.argv:
    script = script.replace("</body>", '<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>\n<script src="../../assets/pdf-viewer.js"></script>\n</body>', 1)
out_path.write_text(head + body + "\n\n" + script, encoding="utf-8")
print("written", out_path, "sections:", len(names))
