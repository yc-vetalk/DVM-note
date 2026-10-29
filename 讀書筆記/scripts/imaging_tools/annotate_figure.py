#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""影像標注工具：在 X 光、超音波、CT／MRI 截圖上畫編號、箭頭、框、文字，並產出筆記用的 <figure> HTML。

為什麼這樣設計
- 座標一律用「圖寬、圖高的比例（0–1）」，不管圖片解析度多少，同一份規格都能重畫。
- 原圖不動：輸出 <原圖名>_a.jpg（燒入標注）；規格 JSON 存在原圖旁，之後要改只要改 JSON 重跑。
- 先用 grid 模式把「座標格線」疊在圖上，看著格線決定位置，比憑感覺估準得多。

用法（在 repo 根目錄執行）
  # 1) 疊座標格線（每 0.1 一條，標出比例），輸出到暫存資料夾後用 Read 看圖，決定標注位置
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/annotate_figure.py grid <圖片> [<輸出.png>]

  # 1b) 把講義整頁裁成只剩影像本體（比例座標：左 上 右 下），標注前先做這步，圖才夠大
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/annotate_figure.py crop <圖片> 0.14 0.21 0.83 0.65 <輸出.jpg>

  # 2) 依規格 JSON 畫標注
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/annotate_figure.py draw <規格.json>
     規格內 "image" 是原圖路徑（相對 repo 根目錄或規格檔）；輸出在同資料夾的 <原圖名>_a.jpg

  # 3) 由規格產生 <figure> HTML 片段（含編號圖例），貼進筆記頁
  ./.venv/bin/python 讀書筆記/scripts/imaging_tools/annotate_figure.py html <規格.json> [--src-prefix img/xxx/]

規格 JSON 範例（讀書筆記/scripts/imaging_tools/範例_標注規格.json）
{
  "image": "DVM-note/大四上/獸醫臨床及影像診斷學/img/X光學基礎/xr_p10.jpg",
  "title": "犬側位胸腔 X 光（右側位）",              ← 圖說第一句：這是什麼檢查、什麼擺位
  "caption": "…看到什麼、診斷意義（可含 HTML）",      ← 圖說主文
  "source": "課程講義 p.10",
  "alt": "犬側位胸腔 X 光",
  "marks": [
    {"type": "marker", "n": 1, "x": 0.42, "y": 0.35, "label": "氣管（正常向下傾斜）"},
    {"type": "arrow",  "n": 2, "from": [0.70, 0.20], "to": [0.55, 0.38], "label": "心臟輪廓增大"},
    {"type": "box",    "n": 3, "x": 0.30, "y": 0.50, "w": 0.20, "h": 0.15, "label": "肺葉間質浸潤"},
    {"type": "ellipse","n": 4, "x": 0.60, "y": 0.60, "w": 0.18, "h": 0.14, "label": "…"},
    {"type": "text",   "x": 0.05, "y": 0.95, "text": "R"}                 ← 直接寫在圖上的文字（左右標記等）
  ],
  "color": "yellow"                                  ← yellow（預設）｜cyan｜red｜lime，灰階影像用 yellow 或 cyan 最清楚
}
- marker：編號圓點（x、y 是圓心）；arrow：箭頭尖端指向 "to"，編號放在箭尾；box／ellipse：x、y 是左上角。
- 每個有 "n" 的標注會進圖例清單（HTML 模式輸出「① 氣管…」）。沒有 "label" 的只畫不列。
"""
import json, os, sys, math, html as H
from PIL import Image, ImageDraw, ImageFont

FONTS = ['/System/Library/Fonts/PingFang.ttc', '/System/Library/Fonts/STHeiti Medium.ttc',
         '/System/Library/Fonts/Hiragino Sans GB.ttc', '/Library/Fonts/Arial Unicode.ttf']
COLORS = {'yellow': (255, 214, 0), 'cyan': (0, 220, 255), 'red': (255, 60, 60), 'lime': (120, 255, 60)}
CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'


def font(size):
    for f in FONTS:
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            continue
    return ImageFont.load_default()


def circ(n):
    return CIRC[n - 1] if 1 <= n <= len(CIRC) else f'({n})'


def outlined_text(d, xy, text, f, fill, stroke=(0, 0, 0), sw=3, anchor='mm'):
    d.text(xy, text, font=f, fill=fill, stroke_width=sw, stroke_fill=stroke, anchor=anchor)


def arrow(d, p0, p1, col, w):
    d.line([p0, p1], fill=(0, 0, 0), width=w + 4)
    d.line([p0, p1], fill=col, width=w)
    ang = math.atan2(p1[1] - p0[1], p1[0] - p0[0]); L = w * 5.5; sp = math.radians(26)
    pts = [p1, (p1[0] - L * math.cos(ang - sp), p1[1] - L * math.sin(ang - sp)),
           (p1[0] - L * math.cos(ang + sp), p1[1] - L * math.sin(ang + sp))]
    d.polygon(pts, fill=col, outline=(0, 0, 0))


def badge(d, c, n, col, r, f):
    d.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], fill=col, outline=(0, 0, 0), width=max(2, r // 7))
    d.text(c, str(n), font=f, fill=(0, 0, 0), anchor='mm')


def grid(src, out=None):
    im = Image.open(src).convert('RGB'); W, H_ = im.size
    d = ImageDraw.Draw(im, 'RGBA'); f = font(max(14, W // 60))
    for i in range(1, 10):
        x = int(W * i / 10); y = int(H_ * i / 10)
        d.line([(x, 0), (x, H_)], fill=(255, 0, 255, 150), width=max(1, W // 700))
        d.line([(0, y), (W, y)], fill=(255, 0, 255, 150), width=max(1, W // 700))
        outlined_text(d, (x, 12), f'{i/10:.1f}', f, (255, 255, 255), sw=2, anchor='mt')
        outlined_text(d, (12, y), f'{i/10:.1f}', f, (255, 255, 255), sw=2, anchor='lm')
    out = out or os.path.splitext(src)[0] + '_grid.png'
    im.save(out); print('格線圖：', out, f'({W}x{H_})')


def crop(src, x0, y0, x1, y1, out):
    im = Image.open(src).convert('RGB'); W, H_ = im.size
    im.crop((int(W * x0), int(H_ * y0), int(W * x1), int(H_ * y1))).save(out, quality=90)
    print('裁切：', out)


def load(spec_path):
    spec = json.load(open(spec_path, encoding='utf-8'))
    img = spec['image']
    if not os.path.isabs(img) and not os.path.exists(img):
        img = os.path.join(os.path.dirname(os.path.abspath(spec_path)), img)
    spec['_img'] = img
    root, ext = os.path.splitext(img)
    spec['_out'] = root + '_a.jpg'
    return spec


def draw(spec_path):
    spec = load(spec_path)
    im = Image.open(spec['_img']).convert('RGB'); W, H_ = im.size
    d = ImageDraw.Draw(im)
    col = COLORS.get(spec.get('color', 'yellow'), COLORS['yellow'])
    u = max(W, H_)
    lw = max(3, u // 260); r = max(14, u // 55); fn = font(max(14, int(r * 1.15))); ft = font(max(16, u // 45))
    for m in spec['marks']:
        t = m['type']; n = m.get('n')
        if t == 'marker':
            c = (m['x'] * W, m['y'] * H_); badge(d, c, n, col, r, fn)
        elif t == 'arrow':
            p0 = (m['from'][0] * W, m['from'][1] * H_); p1 = (m['to'][0] * W, m['to'][1] * H_)
            arrow(d, p0, p1, col, lw)
            if n: badge(d, p0, n, col, r, fn)
        elif t in ('box', 'ellipse'):
            x0, y0 = m['x'] * W, m['y'] * H_; x1, y1 = x0 + m['w'] * W, y0 + m['h'] * H_
            fnc = d.rectangle if t == 'box' else d.ellipse
            fnc([x0, y0, x1, y1], outline=(0, 0, 0), width=lw + 3)
            fnc([x0, y0, x1, y1], outline=col, width=lw)
            if n: badge(d, (x0, y0), n, col, r, fn)
        elif t == 'text':
            outlined_text(d, (m['x'] * W, m['y'] * H_), m['text'], ft, col, anchor='lm')
    im.save(spec['_out'], quality=88, optimize=True); print('標注圖：', spec['_out'])


def make_html(spec_path, prefix=''):
    spec = load(spec_path)
    rel = prefix + os.path.basename(spec['_out'])
    orig = prefix + os.path.basename(spec['_img'])
    items = [m for m in spec['marks'] if m.get('n') and m.get('label')]
    items.sort(key=lambda m: m['n'])
    legend = ''.join(f'<li><strong>{circ(m["n"])}</strong> {m["label"]}</li>' for m in items)
    t = spec.get('title', '')
    cap = (f'<strong>{t}</strong>　' if t else '') + spec.get('caption', '')
    # class="anno" + data-orig／data-anno：assets/anno.js 會加上「隱藏／顯示標注」按鈕（隱藏時換回原圖並收起圖例）
    out = (f'<div class="figure anno" data-orig="{orig}" data-anno="{rel}"><img src="{rel}" alt="{H.escape(spec.get("alt", t))}" loading="lazy">'
           f'<div class="figure-caption">{cap}'
           + (f'<ul class="anno-legend" style="margin:.4rem 0 0;padding-left:0;list-style:none;font-size:.95em;">{legend}</ul>' if legend else '')
           + f'</div><div class="figure-source">來源：{spec.get("source", "")}（箭頭與編號為整理者標注）</div></div>')
    print(out)


if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    if a[0] == 'grid': grid(a[1], a[2] if len(a) > 2 else None)
    elif a[0] == 'crop': crop(a[1], *map(float, a[2:6]), a[6])
    elif a[0] == 'draw': draw(a[1])
    elif a[0] == 'html':
        pre = a[a.index('--src-prefix') + 1] if '--src-prefix' in a else ''
        make_html(a[1], pre)
    else: print(__doc__)
