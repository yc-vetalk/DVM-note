#!/usr/bin/env python3
"""把 search-index.js 中某個 url 的所有條目換成新條目（沒有就直接加在陣列最後）。

用法：python3 replace_search_entries.py DVM-note/search-index.js entries.json
entries.json 格式：
{"url": "大三/獸醫藥理學/藥理學總論.html", "subject": "獸醫藥理學", "semester": "大三",
 "week": null, "weekTitle": "藥理學總論",
 "sections": [["abstract","重點摘要","關鍵字","摘要"], ...]}
"""
import json, re, sys

path, spec = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
s = open(path, encoding="utf-8").read()
url = spec["url"]
pat = re.compile(r'\n  \{\n(?:    [^\n]*\n)*?    url: "' + re.escape(url) + r'",\n(?:    [^\n]*\n)*?  \},?', re.S)
s, removed = pat.subn("", s)
week = "null" if spec.get("week") is None else str(spec["week"])
def q(x): return json.dumps(x, ensure_ascii=False)
entries = ",\n".join(
    f'  {{\n    subject: {q(spec["subject"])}, semester: {q(spec["semester"])}, week: {week}, weekTitle: {q(spec["weekTitle"])},\n'
    f'    url: {q(url)},\n    section: {q(a)}, sectionName: {q(b)},\n    keywords: {q(c)},\n    snippet: {q(d)}\n  }}'
    for a, b, c, d in spec["sections"])
s = s.rstrip()
assert s.endswith("];"), "search-index.js 結尾不是 ];"
body = s[:-2].rstrip()
if body.endswith("["): sep = "\n"
else: body = body.rstrip(","); sep = ",\n"
s = body + sep + entries + "\n];\n"
open(path, "w", encoding="utf-8").write(s)
print(f"removed {removed}, added {len(spec['sections'])}")
