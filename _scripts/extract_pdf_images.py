#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
從課程講義 PDF 擷取指定頁面存成 PNG 圖片，供網頁筆記的 <img> 使用。
用法：
  ./.venv/bin/python 網頁筆記/_scripts/extract_pdf_images.py \
      "獸醫總複習筆記/解剖學實習上/Skeleton of the head part1.pdf" \
      網頁筆記/總複習/解剖生理學/img/骨骼系統 \
      --pages 6,12,45 --prefix skull --dpi 220

--pages 為 1-based 頁碼（跟 PDF 檢視器顯示的頁碼一致），逗號分隔，可混用範圍如 6,10-12,45
輸出檔名格式：<prefix>_p<頁碼>.png
"""
import argparse
import os
import sys

import fitz  # pymupdf
from PIL import Image, ImageChops


def autocrop(png_path, pad=24, bg=(255, 255, 255)):
    """裁掉圖片四周的空白邊界，保留 pad px 的留白。"""
    im = Image.open(png_path).convert('RGB')
    bg_im = Image.new('RGB', im.size, bg)
    diff = ImageChops.difference(im, bg_im)
    diff = ImageChops.add(diff, diff, 2.0, -20)  # 濾掉極淡的雜訊差異
    bbox = diff.getbbox()
    if not bbox:
        return
    x0, y0, x1, y1 = bbox
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(im.width, x1 + pad)
    y1 = min(im.height, y1 + pad)
    im.crop((x0, y0, x1, y1)).save(png_path)


def parse_pages(spec):
    pages = []
    for part in spec.split(','):
        part = part.strip()
        if not part:
            continue
        if '-' in part:
            a, b = part.split('-')
            pages.extend(range(int(a), int(b) + 1))
        else:
            pages.append(int(part))
    return pages


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pdf_path')
    ap.add_argument('out_dir')
    ap.add_argument('--pages', required=True, help='1-based 頁碼，逗號分隔，可用範圍如 6,10-12')
    ap.add_argument('--prefix', default='fig', help='輸出檔名前綴')
    ap.add_argument('--dpi', type=int, default=220)
    ap.add_argument('--crop', default=None, help='選填，裁切比例 x0,y0,x1,y1（0~1 之間，相對頁面寬高）')
    ap.add_argument('--autocrop', action='store_true', help='自動裁掉頁面四周的空白邊界')
    args = ap.parse_args()

    os.makedirs(args.out_dir, exist_ok=True)
    doc = fitz.open(args.pdf_path)
    pages = parse_pages(args.pages)

    crop = None
    if args.crop:
        crop = [float(x) for x in args.crop.split(',')]

    for p in pages:
        idx = p - 1
        if idx < 0 or idx >= len(doc):
            print(f'跳過：頁碼 {p} 超出範圍（PDF 共 {len(doc)} 頁）', file=sys.stderr)
            continue
        page = doc[idx]
        rect = page.rect
        clip = None
        if crop:
            clip = fitz.Rect(
                rect.width * crop[0], rect.height * crop[1],
                rect.width * crop[2], rect.height * crop[3]
            )
        pix = page.get_pixmap(dpi=args.dpi, clip=clip)
        out_path = os.path.join(args.out_dir, f'{args.prefix}_p{p}.png')
        pix.save(out_path)
        if args.autocrop:
            autocrop(out_path)
        final = Image.open(out_path)
        print(f'已輸出：{out_path}（{final.width}x{final.height}）')


if __name__ == '__main__':
    main()
