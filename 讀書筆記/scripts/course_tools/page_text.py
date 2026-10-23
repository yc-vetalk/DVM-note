"""把一個內頁轉成精簡純文字（出題、寫詳解前快速讀頁面內容，比讀 HTML 省 token）。

用法：python3 讀書筆記/scripts/course_tools/page_text.py <頁面.html>
會略過圖片、腳本、讀書補充Note，以及「考試方向」之後的節。
"""
import re, html, sys
s = open(sys.argv[1], encoding='utf-8').read()
b = s[s.index('<main'):s.index('id="section-exam"') if 'id="section-exam"' in s else s.index('</main>')]
b = re.sub(r'<script.*?</script>|<style.*?</style>|<details class="alert.*?</details>', '', b, flags=re.S)
b = re.sub(r'<div class="figure">.*?</div></div>', '', b, flags=re.S)
b = re.sub(r'<(h2|h3|tr|li|p|dd|dt)[^>]*>', '\n', b)
b = re.sub(r'<td[^>]*>', ' | ', b)
t = html.unescape(re.sub(r'<[^>]+>', '', b))
t = re.sub(r'本頁為個人課堂筆記整理[^\n]*', '', t)
t = re.sub(r'[ \t]+', ' ', t); t = re.sub(r'\n\s*\n+', '\n', t)
print(t)
