#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""從講義 PDF 取影像：影像學的圖要「夠大、夠清楚」，所以優先取內嵌原圖或高 dpi 裁切，不要只用整頁縮圖。

用法（在 repo 根目錄執行）
  # 1) 列出某頁有哪些內嵌圖片（尺寸、位置），決定要取哪一張
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/pdf_figures.py list "<講義.pdf>" 46

  # 2) 取出該頁內嵌圖片的原檔（原始解析度，已排除太小的圖示與整頁背景）
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/pdf_figures.py embedded "<講義.pdf>" 46 <輸出資料夾> [--prefix gi] [--min 300]
      → <輸出資料夾>/<prefix>_p046_1.jpg 等；一頁有多張圖時依由左到右、由上到下編號

  # 3) 把某頁的一塊區域（比例座標：左 上 右 下）用高 dpi 裁出來；講義圖是向量或拼貼、取不到內嵌原圖時用
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/pdf_figures.py crop "<講義.pdf>" 46 0.14 0.21 0.83 0.65 <輸出.jpg> [--dpi 250]

選哪個
- 先 list：有一張大圖（例如 1500×1000 以上）就用 embedded，最清楚。
- 講義的箭頭、編號是疊在圖上的向量標注時，embedded 取出的圖會**沒有**那些標注；若要保留老師的標注，改用 crop（含標注）。
- 兩種都可以取，放在一起比較：沒標注的原圖拿去自己標注，含標注的拿來對照老師的標號。
"""
import sys, os, io
import pymupdf
from PIL import Image


def list_imgs(pdf, page):
    d = pymupdf.open(pdf); p = d[page - 1]
    W, H = p.rect.width, p.rect.height
    print(f'第 {page} 頁，頁面 {W:.0f}×{H:.0f} pt，內嵌圖片（只列可單獨取出、短邊 ≥ 120 px 者）：')
    shown = 0
    for i, info in enumerate(sorted(p.get_image_info(xrefs=True), key=lambda x: (round(x['bbox'][1] / 20), x['bbox'][0])), 1):
        b = info['bbox']
        if not info.get('xref') or min(info['width'], info['height']) < 120: continue   # 略過投影片背景、動畫殘影、小圖示
        shown += 1
        print(f'  #{i}  xref={info.get("xref")}  原始 {info["width"]}×{info["height"]} px  '
              f'位置(比例) 左{b[0]/W:.2f} 上{b[1]/H:.2f} 右{b[2]/W:.2f} 下{b[3]/H:.2f}')
    if not shown: print('  （沒有可單獨取出的內嵌圖片，請改用 crop）')


def embedded(pdf, page, outdir, prefix='fig', minpx=300):
    d = pymupdf.open(pdf); p = d[page - 1]
    W, H = p.rect.width, p.rect.height
    os.makedirs(outdir, exist_ok=True)
    infos = [x for x in p.get_image_info(xrefs=True) if x.get('xref')]
    infos.sort(key=lambda x: (round(x['bbox'][1] / 20), x['bbox'][0]))
    n = 0
    for info in infos:
        if min(info['width'], info['height']) < minpx: continue
        b = info['bbox']
        if (b[2] - b[0]) * (b[3] - b[1]) > 0.9 * W * H: continue          # 整頁背景
        data = d.extract_image(info['xref'])
        im = Image.open(io.BytesIO(data['image'])).convert('RGB')
        n += 1
        out = os.path.join(outdir, f'{prefix}_p{page:03d}_{n}.jpg')
        im.save(out, quality=90); print('已取出：', out, im.size)
    if n == 0: print('沒有符合條件的內嵌圖片（可能是整頁點陣或向量圖），請改用 crop。')


def crop(pdf, page, x0, y0, x1, y1, out, dpi=250):
    d = pymupdf.open(pdf); p = d[page - 1]; r = p.rect
    clip = pymupdf.Rect(r.x0 + r.width * x0, r.y0 + r.height * y0, r.x0 + r.width * x1, r.y0 + r.height * y1)
    pix = p.get_pixmap(dpi=dpi, clip=clip)
    Image.frombytes('RGB', (pix.width, pix.height), pix.samples).save(out, quality=90)
    print('已裁切：', out, f'{pix.width}×{pix.height}')


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    opt = lambda k, dv: type(dv)(a[a.index(k) + 1]) if k in a else dv
    if a[0] == 'list': list_imgs(a[1], int(a[2]))
    elif a[0] == 'embedded': embedded(a[1], int(a[2]), a[3], opt('--prefix', 'fig'), opt('--min', 300))
    elif a[0] == 'crop': crop(a[1], int(a[2]), *map(float, a[3:7]), a[7], opt('--dpi', 250))
    else: print(__doc__)
