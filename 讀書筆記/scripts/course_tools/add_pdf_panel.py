"""幫「已經手寫好」的內頁加上 PDF 側欄：頁頂「講義 PDF」、內文 p.N 變成可點連結、插入側欄元件。可重複執行（已有側欄就跳過）。

用法（在 repo 根目錄執行）：
  python3 讀書筆記/scripts/course_tools/add_pdf_panel.py <頁面.html> <pdf/ 底下檔名> <講義總頁數>
例：
  python3 讀書筆記/scripts/course_tools/add_pdf_panel.py DVM-note/大四上/反芻動物疾病學/week02_眼科疾病.html 臨床檢查與眼科疾病.pdf 60

注意：
- 頁碼要對得上 PDF 實際頁序（先抽查：投影片頁尾的頁碼通常＝PDF 第幾頁）。
- 超過總頁數的 p.N 不做連結。
- 內文若引用「別份講義的 p.N」，會被連到本頁的 PDF，執行後要手動改那幾個 href（腳本會印出疑似跨講義引用的數量供檢查）。
"""
import re, sys, os
REPO = os.getcwd()
SB = os.path.join(REPO, '讀書筆記/scripts/swine_page_builder/')
page, pdf, maxpg = sys.argv[1], sys.argv[2], int(sys.argv[3])
s = open(page, encoding='utf-8').read()
if 'id="pdfPanel"' in s: print('已有側欄，跳過', page); sys.exit()
a = '<div class="meta-item"><div class="meta-label">整理狀態</div>'
assert s.count(a) == 1, '找不到「整理狀態」資訊列'
s = s.replace(a, f'<div class="meta-item"><div class="meta-label">講義 PDF</div><div class="meta-value"><a class="pdf-open-link" href="pdf/{pdf}#page=1">在右側開啟講義</a></div></div>\n      ' + a)
m0, m1 = s.index('<main'), s.index('</main>')
parts = re.split(r'(<a\b.*?</a>|<script\b.*?</script>|<[^>]+>)', s[m0:m1], flags=re.S)
cnt = [0, 0, 0]
def link(t):
    def r(m):
        ctx = t[max(0, m.start() - 20):m.start()]
        if re.search(r'講義\s*〈?[^〈p]*$', ctx) and '課程講義' not in ctx: cnt[2] += 1
        if int(m.group(1)) > maxpg: cnt[1] += 1; return m.group(0)
        cnt[0] += 1
        return f'<a class="pdf-link" href="pdf/{pdf}#page={m.group(1)}">p.{m.group(1)}{m.group(2)}</a>'
    return re.sub(r'(?<![A-Za-z])p\.(\d+)((?:[–-]\d+)?)', r, t)
s = s[:m0] + ''.join(x if x.startswith('<') else link(x) for x in parts) + s[m1:]
s = s.replace('</head>', open(SB + 'pdfpanel.css', encoding='utf-8').read() + '\n</head>', 1)
b = '<script src="../../assets/nav-data.js"></script>'
assert s.count(b) == 1
s = s.replace(b, open(SB + 'pdfpanel.html', encoding='utf-8').read() + '\n' + b)
open(page, 'w', encoding='utf-8').write(s)
print(page, '連結', cnt[0], '超出頁數', cnt[1], '疑似跨講義引用（請人工檢查）', cnt[2])
