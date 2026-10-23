"""用 .src 內容檔組裝一個內頁（禽病學 week10–12 就是這樣做的）。

用法（在 repo 根目錄執行）：python3 讀書筆記/scripts/course_tools/assemble_page.py <頁面.src>

.src 格式（範例見同資料夾 範例_傳染性華氏囊病.src）：
  @@meta dir=DVM-note/大四上/反芻動物疾病學        ← 科目資料夾
  @@meta template=week02_眼科疾病.html            ← 同資料夾任一既有內頁，借用 header／script（不動它）
  @@meta file=week03_仔牛疾病.html                ← 輸出檔名
  @@meta crumb=仔牛疾病                            ← 麵包屑
  @@meta title=反芻動物疾病學：仔牛疾病              ← <title>（省略時用 crumb）
  @@meta h1=……   @@meta subtitle=……   @@meta source=……（資料來源欄）   @@meta date=2026-10-22
  @@meta pdf=仔牛疾病.pdf                          ← pdf/ 底下的講義檔名（側欄用）
  @@meta pdfpages=40                               ← 講義總頁數，超出的 p.N 不做連結
  @@meta imgdir=week03_仔牛疾病  @@meta prefix=calf ← 圖檔在 img/<imgdir>/<prefix>_pNNN.jpg
  @@group 目錄分組名稱
  @@sec id|icon|目錄文字|h2 標題 HTML
  ……該節內容 HTML……
  [[F:頁碼|圖說]] → 自動展開成 .figure（含「來源：課程講義 p.N」）

功能：產生 section 與編號、左側目錄、SECTION_NAMES；內文「p.N」自動變成 PDF 側欄連結；
模板沒有 PDF 側欄時自動插入（pdfpanel.css／pdfpanel.html）；印出沒用到的圖檔。
跨講義引用（例如「CIA 講義 p.13」）會連到本頁的 PDF，組裝後要手動改 href。
"""
import re, sys, os, html
REPO = os.getcwd()
SB = os.path.join(REPO, '讀書筆記/scripts/swine_page_builder/')
src = open(sys.argv[1], encoding='utf-8').read()
meta = dict(re.findall(r'^@@meta (\w+)=(.*)$', src, re.M))
ROOT = os.path.join(REPO, meta['dir']) + '/'
tpl = open(ROOT + meta['template'], encoding='utf-8').read()
toc, secs, cur, n = [], [], None, 0
for ln in src.split('\n'):
    if ln.startswith('@@meta'): continue
    if ln.startswith('@@group '):
        toc.append(f'    <div class="section-label"{"" if not toc else " style=\"margin-top:8px;\""}>{ln[8:].strip()}</div>'); continue
    if ln.startswith('@@sec '):
        sid, icon, label, h2 = ln[6:].split('|', 3); n += 1
        cur = dict(id=sid, label=label, h2=h2, body=[], n=n); secs.append(cur)
        toc.append(f'    <a{" class=\"active\"" if n == 1 else ""} onclick="showSection(\'{sid}\')" id="nav-{sid}"><span class="nav-icon">{icon}</span> {label}</a>'); continue
    if cur is not None: cur['body'].append(ln)
imgdir, prefix, pdf = meta['imgdir'], meta['prefix'], meta['pdf']
maxpg = int(meta.get('pdfpages', 9999))
used = set()
def fig(m):
    p = int(m.group(1)); cap = m.group(2).strip()
    fn = f'img/{imgdir}/{prefix}_p{p:03d}.jpg'
    assert os.path.exists(ROOT + fn), '找不到圖檔 ' + fn
    used.add(fn); alt = re.sub(r'<[^>]+>', '', cap)[:60]
    return (f'<div class="figure"><img src="{fn}" alt="{html.escape(alt)}" loading="lazy">'
            f'<div class="figure-caption">{cap}</div><div class="figure-source">來源：課程講義 p.{p}</div></div>')
body = ''
for s in secs:
    b = re.sub(r'\[\[F:(\d+)\|(.*?)\]\]', fig, '\n'.join(s['body']).strip('\n'), flags=re.S)
    body += (f'\n    <!-- {s["id"].upper()} -->\n    <div class="section" id="section-{s["id"]}">\n'
             f'      <div class="section-head"><div class="section-num">{s["n"]}</div><h2>{s["h2"]}</h2></div>\n{b}\n    </div>\n')
parts = re.split(r'(<a\b.*?</a>|<[^>]+>)', body, flags=re.S)
def link(t):
    def r(m):
        if int(m.group(1)) > maxpg: return m.group(0)
        return f'<a class="pdf-link" href="pdf/{pdf}#page={m.group(1)}">p.{m.group(1)}{m.group(2)}</a>'
    return re.sub(r'(?<![A-Za-z])p\.(\d+)((?:[–-]\d+)?)', r, t)
body = ''.join(x if x.startswith('<') else link(x) for x in parts)
out = tpl
i = out.index('<main class="pagebody" id="mainContent">') + len('<main class="pagebody" id="mainContent">')
out = out[:i] + '\n' + body + '\n' + out[out.index('  </main>'):]
i = out.index('<nav class="toc">') + len('<nav class="toc">'); j = out.index('</nav>', i)
out = out[:i] + '\n' + '\n'.join(toc) + '\n  ' + out[j:]
sub = lambda pat, rep: re.sub(pat, rep, out, count=1, flags=re.S)
out = sub(r'<title>.*?</title>', f'<title>{meta.get("title", meta["crumb"])} - yc._vetalk</title>')
out = sub(r'<span class="current">.*?</span>', f'<span class="current">{meta["crumb"]}</span>')
out = sub(r'<h1 class="page-title">.*?</h1>', f'<h1 class="page-title">{meta["h1"]}</h1>')
out = sub(r'<p class="page-subtitle">.*?</p>', f'<p class="page-subtitle">{meta["subtitle"]}</p>')
out = re.sub(r'(<div class="meta-label">資料來源</div><div class="meta-value">).*?(</div>)', lambda m: m.group(1) + meta['source'] + m.group(2), out, count=1)
out = re.sub(r'(<div class="meta-label">最後更新</div><div class="meta-value">).*?(</div>)', lambda m: m.group(1) + meta['date'] + m.group(2), out, count=1)
# 模板若帶自我測驗入口，先移除（之後用 add_quiz_entries.py 重加）
out = re.sub(r'<div class="meta-item"><div class="meta-label">自我測驗</div>.*?</div></div>\n\s*', '', out, flags=re.S)
out = re.sub(r'\s*<div class="section-label" style="margin-top:8px;">練習</div>\s*<a href="[^"]*" id="nav-quiz-link">.*?</a>', '', out, flags=re.S)
if 'id="pdfPanel"' in out:
    out = re.sub(r'href="pdf/[^"#]*\.pdf#page=1">在右側開啟講義', f'href="pdf/{pdf}#page=1">在右側開啟講義', out, count=1)
else:
    a = '<div class="meta-item"><div class="meta-label">整理狀態</div>'
    out = out.replace(a, f'<div class="meta-item"><div class="meta-label">講義 PDF</div><div class="meta-value"><a class="pdf-open-link" href="pdf/{pdf}#page=1">在右側開啟講義</a></div></div>\n      ' + a, 1)
    out = out.replace('</head>', open(SB + 'pdfpanel.css', encoding='utf-8').read() + '\n</head>', 1)
    out = out.replace('<script src="../../assets/nav-data.js"></script>', open(SB + 'pdfpanel.html', encoding='utf-8').read() + '\n<script src="../../assets/nav-data.js"></script>', 1)
sn = '\n'.join(f"  {s['id']}: {repr(s['label'])}," for s in secs)
out = re.sub(r'const SECTION_NAMES = \{.*?\};', 'const SECTION_NAMES = {\n' + sn + '\n};', out, count=1, flags=re.S)
open(ROOT + meta['file'], 'w', encoding='utf-8').write(out)
allimg = {f'img/{imgdir}/{f}' for f in os.listdir(ROOT + 'img/' + imgdir)} if os.path.isdir(ROOT + 'img/' + imgdir) else set()
print('sections', n, 'figs', len(used), 'unused', sorted(allimg - used))
