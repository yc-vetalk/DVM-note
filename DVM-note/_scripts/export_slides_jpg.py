#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把講義指定頁整頁輸出成 JPEG（裁白邊、最寬 1300 px、品質 78），給網頁筆記的 .figure 用。
比 extract_pdf_images.py（PNG）檔案小很多，適合一份講義要放幾十到上百張圖的情況。
輸出檔名：<prefix>_pNNN.jpg（頁碼補零三位）。
用法：
  ./.venv/bin/python DVM-note/_scripts/export_slides_jpg.py "<講義.pdf>" <img資料夾> \
      --pages 3,9-19,21 --prefix ch
"""
import argparse
import os

import pymupdf
from PIL import Image, ImageChops


def parse_pages(spec):
    out = []
    for part in spec.split(','):
        part = part.strip()
        if '-' in part:
            a, b = part.split('-')
            out.extend(range(int(a), int(b) + 1))
        elif part:
            out.append(int(part))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf')
    ap.add_argument('out')
    ap.add_argument('--pages', required=True)
    ap.add_argument('--prefix', default='p')
    ap.add_argument('--dpi', type=int, default=150)
    ap.add_argument('--width', type=int, default=1300)
    ap.add_argument('--quality', type=int, default=78)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    d = pymupdf.open(a.pdf)
    total = 0
    pages = parse_pages(a.pages)
    for p in pages:
        pix = d[p - 1].get_pixmap(dpi=a.dpi)
        im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        diff = ImageChops.difference(im, Image.new('RGB', im.size, (255, 255, 255)))
        bb = diff.convert('L').point(lambda v: 255 if v > 18 else 0).getbbox()
        if bb:
            pad = 12
            im = im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad),
                          min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))
        if im.width > a.width:
            im = im.resize((a.width, round(im.height * a.width / im.width)), Image.LANCZOS)
        fn = os.path.join(a.out, f'{a.prefix}_p{p:03d}.jpg')
        im.save(fn, quality=a.quality, optimize=True, progressive=True)
        total += os.path.getsize(fn)
    print(f'{len(pages)} 張，共 {total / 1e6:.1f} MB')


if __name__ == '__main__':
    main()
