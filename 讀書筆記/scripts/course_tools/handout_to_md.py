"""講義 PDF → 逐頁 md（省 token 用），有圖的頁面自動標【含圖】並註明回看原 PDF 第幾頁。

用法（在 repo 根目錄執行）：
  ./.venv/bin/python 讀書筆記/scripts/course_tools/handout_to_md.py <輸出資料夾> <網站PDF資料夾> "<原始PDF路徑>|<md檔名>|<網站PDF檔名>" ...
例：
  ./.venv/bin/python 讀書筆記/scripts/course_tools/handout_to_md.py 讀書筆記/講義文字/反芻動物疾病學 DVM-note/大四上/反芻動物疾病學/pdf \
    "$NTU/反芻動物疾病學/3_仔牛疾病講義.pdf|03_仔牛疾病|仔牛疾病"

- 可重複執行：已存在的 md 會保留「【看圖補記】」行，只重寫文字與【含圖】標記。
- 判斷有圖：圖片面積佔頁面 2%–95%（排除整頁背景與小圖示），或向量繪圖數比該份講義中位數多 5 以上（圖表、表格）。
- 看過投影片後，可在該頁加一行「【看圖補記】……」寫下圖中重點。
"""
import sys, re, os, statistics
import pymupdf

out_dir, web_pdf_dir, *items = sys.argv[1:]
os.makedirs(out_dir, exist_ok=True)
for it in items:
    src, md, webname = it.split('|')
    d = pymupdf.open(src)
    f = os.path.join(out_dir, md + '.md')
    notes = {}
    if os.path.exists(f):  # 保留舊的看圖補記
        old = open(f, encoding='utf-8').read()
        for pg, body in re.findall(r'^## p\.(\d+)\n(.*?)(?=^## p\.|\Z)', old, re.S | re.M):
            n = re.findall(r'^【看圖補記】.*$', body, re.M)
            if n: notes[int(pg)] = n
    dr = [len(p.get_drawings()) for p in d]
    base = statistics.median(dr) if dr else 0
    title = re.sub(r'^\d+_', '', md)
    out = [f'# {title}（講義文字擷取）\n',
           f'> 來源：`{src}`，共 {d.page_count} 頁。PyMuPDF 自動擷取文字；標「（本頁沒有可擷取的文字）」的頁面資訊只在圖裡。\n',
           '> 標「【含圖】」的頁面有圖片或圖表，md 沒有圖中資訊，讀到時要回看原 PDF 對應頁；「【看圖補記】」是整理者看過投影片後補的摘要。\n']
    nimg = 0
    for i, p in enumerate(d):
        t = p.get_text().strip()
        t = re.sub(r'\n?\s*\d+\s*$', '', t)          # 去掉頁尾頁碼
        t = re.sub(r'[ \t]+', ' ', t)
        if len(t) < 8: t = '（本頁沒有可擷取的文字）'
        A = p.rect.width * p.rect.height
        k = sum(1 for x in p.get_image_info() if 0.02 <= abs(pymupdf.Rect(x['bbox']) & p.rect) / A <= 0.95)
        vec = dr[i] - base >= 5
        lines = [t] + notes.get(i + 1, [])
        if k or vec:
            nimg += 1
            what = (f' {k} 張圖片' if k else '') + ('、' if k and vec else '') + ('向量圖表或表格' if vec else '')
            lines.append(f'【含圖】本頁有{what}，md 只有文字，圖中資訊（照片、箭頭標註、表格、圖表）請回看原 PDF：`{web_pdf_dir}/{webname}.pdf` 第 {i+1} 頁')
        out.append(f'\n## p.{i+1}\n\n' + '\n'.join(lines) + '\n')
    open(f, 'w', encoding='utf-8').write(''.join(out))
    print(md, d.page_count, '頁，含圖', nimg, '頁')
