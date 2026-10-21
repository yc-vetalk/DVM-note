#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把講義 PDF 每 12 頁拼成一張縮圖總覽（3×4，左上角標頁碼），用來快速看完整份講義的圖，
決定大綱與要放哪些圖。輸出在 out_dir/s00.jpg、s01.jpg…，用 Read 工具直接看圖。
用法：
  ./.venv/bin/python DVM-note/_scripts/pdf_contact_sheet.py "<講義.pdf>" <out_dir>
"""
import os
import sys

import pymupdf
from PIL import Image, ImageDraw

W, H, COLS, ROWS = 480, 270, 3, 4


def main(pdf, out):
    os.makedirs(out, exist_ok=True)
    d = pymupdf.open(pdf)
    n = len(d)
    per = COLS * ROWS
    for s in range(0, n, per):
        sheet = Image.new('RGB', (W * COLS, (H + 20) * ROWS), 'white')
        dr = ImageDraw.Draw(sheet)
        for k in range(per):
            i = s + k
            if i >= n:
                break
            p = d[i]
            z = W / p.rect.width
            pix = p.get_pixmap(matrix=pymupdf.Matrix(z, z))
            im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples).resize((W, H))
            x, y = (k % COLS) * W, (k // COLS) * (H + 20)
            sheet.paste(im, (x, y + 20))
            dr.text((x + 4, y + 3), f'p{i + 1}', fill='red')
        sheet.save(os.path.join(out, f's{s // per:02d}.jpg'), quality=80)
    print(f'{n} 頁 → {(n + per - 1) // per} 張總覽')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
