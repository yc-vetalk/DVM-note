#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
院內簡報 — 經顱光生物調節（tPBMT）用於犬認知功能障礙症候群（CCDS）
來源：Winkler & Miller (eds.), Laser Therapy in Veterinary Medicine: Photobiomodulation, 2nd ed., Wiley 2025, Ch.16
原文截圖直接從 textbook/ 的書 PDF 裁切（書頁 pp.200–202）。
配色與字型依循 上群/Web/PDF講義製作指南_藥理學.md
執行：./.venv/bin/python 讀書筆記/scripts/generate_pdf_tPBMT_CCDS.py
"""
import io
import pymupdf
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (SimpleDocTemplate, Paragraph as P, Spacer, Table, TableStyle,
                                KeepTogether, HRFlowable, PageBreak, Image)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = "/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群"
BOOK = BASE + "/textbook/Laser Therapy in Veterinary Medicine, Photobiomodulation, 2nd Edition (VetBooks.ir).pdf"
OUTPUT_PATH = BASE + "/讀書筆記/tPBMT_犬認知功能障礙_院內簡報.pdf"

pdfmetrics.registerFont(TTFont('STH', '/System/Library/Fonts/STHeiti Medium.ttc'))
pdfmetrics.registerFont(TTFont('STH-B', '/System/Library/Fonts/STHeiti Medium.ttc'))

NAVY = colors.HexColor('#1B2D4F'); TEAL = colors.HexColor('#2A6B72'); GOLD = colors.HexColor('#B8952A')
WINE = colors.HexColor('#6B2333'); SLATE = colors.HexColor('#4A5568'); LGRAY = colors.HexColor('#ECEAE6')
MIST = colors.HexColor('#EEF4F8'); AMBER = colors.HexColor('#FEF8EC'); WARM = colors.HexColor('#F7F5F0')
SAGE = colors.HexColor('#F1F7F2'); DIV = colors.HexColor('#D4C9B0'); WHITE = colors.white

PAGE_W, PAGE_H = A4
W = PAGE_W - 3.2 * cm
_n = {'n': 0}


def mk(name, **kw):
    base = dict(fontName='STH', fontSize=9.5, leading=14.5, textColor=SLATE, wordWrap='CJK')
    base.update(kw)
    return ParagraphStyle(name, **base)


def SP(h): return Spacer(1, h * cm)
def HR(color=GOLD, t=1.5): return HRFlowable(width='100%', thickness=t, color=color, spaceBefore=0, spaceAfter=0)
def uid():
    _n['n'] += 1
    return f"s{_n['n']}"


def txt(s, **kw): return P(s, mk(uid(), **kw))


def section(text):
    t = Table([[txt(f'<b>{text}</b>', fontName='STH-B', fontSize=13.5, leading=18, textColor=NAVY)]], colWidths=[W])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), WARM), ('LINEBEFORE', (0, 0), (0, 0), 4, GOLD),
                           ('LEFTPADDING', (0, 0), (-1, -1), 12), ('TOPPADDING', (0, 0), (-1, -1), 6),
                           ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]))
    return [t, SP(0.3)]


def box(content, bg=AMBER, border=GOLD, title=None):
    rows = []
    if title:
        rows.append([txt(f'<b>{title}</b>', fontName='STH-B', fontSize=10, textColor=border)])
    rows.append([content if not isinstance(content, str) else txt(content)])
    t = Table(rows, colWidths=[W])
    t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), bg), ('LINEBEFORE', (0, 0), (0, -1), 3, border),
                           ('LEFTPADDING', (0, 0), (-1, -1), 12), ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                           ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5)]))
    return t


def grid(data, widths, header=True, font=8.8):
    rows = []
    for ri, r in enumerate(data):
        cells = []
        for ci, c in enumerate(r):
            if header and ri == 0:
                cells.append(txt(f'<b>{c}</b>', fontName='STH-B', fontSize=font, leading=font + 4, textColor=WHITE))
            else:
                cells.append(txt(c, fontSize=font, leading=font + 4.5, textColor=(NAVY if ci == 0 else SLATE)))
        rows.append(cells)
    t = Table(rows, colWidths=widths, repeatRows=1 if header else 0)
    st = [('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 6), ('RIGHTPADDING', (0, 0), (-1, -1), 6),
          ('TOPPADDING', (0, 0), (-1, -1), 4), ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
          ('LINEBELOW', (0, 0), (-1, -1), 0.4, DIV)]
    if header:
        st += [('BACKGROUND', (0, 0), (-1, 0), NAVY)]
    for i in range(1, len(rows)):
        if i % 2 == 0:
            st.append(('BACKGROUND', (0, i), (-1, i), WARM))
    t.setStyle(TableStyle(st))
    return t


# ---------- 原文截圖：用書頁的文字座標自動定位（頁面索引 0 起算）----------
# 每項 = (頁面索引, 欄位 'L'／'R', 欄位分界 x, 起點片語或 None=欄頂, 終點片語或 None=欄底)
CROPS = {
    'mech':  (217, 'R', 300, None, 'Tao et al., 2021).'),                       # 書 p.200 右欄整欄：病理＋4–6 週＋PBMT 機轉
    'evid':  (218, 'L', 315, None, 'basis of where to start'),                  # 書 p.201 左欄上：無獸醫研究、參數未確立
    'param': (218, 'R', 315, 'In a recent literature review', 'area if using'),  # 書 p.201 右欄：劑量、接觸、輻照度、總焦耳
    'sched': (219, 'L', 297, 'a fluence of 20', 'Figure 16.6.'),                # 書 p.202 左欄：療程頻率
    'tbi':   (219, 'R', 297, None, 'should not be used.'),                      # 書 p.202 右欄上：顱內出血禁忌
}
_book = pymupdf.open(BOOK)


def crop_rect(key):
    pg, col, mid, start, end = CROPS[key]
    page = _book[pg]
    words = [w for w in page.get_text("words") if (w[0] < mid if col == 'L' else w[0] >= mid)]
    # 排除頁首／頁尾的頁碼與章節標題列
    words = [w for w in words if 60 < w[1] < 735]
    y0 = min(w[1] for w in words)
    y1 = max(w[3] for w in words)
    if start:
        hits = [r for r in page.search_for(start) if (r.x0 < mid if col == 'L' else r.x0 >= mid)]
        y0 = min(r.y0 for r in hits)
    if end:
        hits = [r for r in page.search_for(end) if (r.x0 < mid if col == 'L' else r.x0 >= mid)]
        y1 = max(r.y1 for r in hits)
        if key == 'sched':   # 「Figure 16.6.」在段落最後一行，取最先出現的一筆
            y1 = min(r.y1 for r in hits)
    sel = [w for w in words if w[1] >= y0 - 1 and w[3] <= y1 + 1]
    x0 = min(w[0] for w in sel); x1 = max(w[2] for w in sel)
    return pymupdf.Rect(x0 - 5, y0 - 3, x1 + 5, y1 + 1)


def crop_img(key, width_cm):
    pg = CROPS[key][0]
    pix = _book[pg].get_pixmap(dpi=230, clip=crop_rect(key))
    buf = io.BytesIO(pix.tobytes("png"))
    w = width_cm * cm
    h = w * pix.height / pix.width
    im = Image(buf, width=w, height=h)
    t = Table([[im]], colWidths=[w + 4])
    t.setStyle(TableStyle([('BOX', (0, 0), (-1, -1), 0.6, DIV), ('LEFTPADDING', (0, 0), (-1, -1), 1),
                           ('RIGHTPADDING', (0, 0), (-1, -1), 1), ('TOPPADDING', (0, 0), (-1, -1), 1),
                           ('BOTTOMPADDING', (0, 0), (-1, -1), 1)]))
    return t


def excerpt(key, title, page_note, points, img_w=8.8):
    """左：原文截圖；右：中文重點。"""
    left = crop_img(key, img_w)
    right_items = [txt(f'<b>{title}</b>', fontName='STH-B', fontSize=11, leading=16, textColor=NAVY),
                   txt(page_note, fontSize=8, leading=11, textColor=colors.HexColor('#888888')), SP(0.2)]
    for p in points:
        right_items.append(txt('• ' + p, fontSize=9.2, leading=14.5))
        right_items.append(SP(0.12))
    t = Table([[left, right_items]], colWidths=[img_w * cm + 8, W - img_w * cm - 8])
    t.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (0, 0), 0),
                           ('LEFTPADDING', (1, 0), (1, 0), 14), ('RIGHTPADDING', (0, 0), (-1, -1), 0)]))
    return t


def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('STH', 7)
    canvas.setFillColor(colors.HexColor('#BBBBBB'))
    canvas.drawString(1.6 * cm, 1.1 * cm, 'tPBMT 與犬認知功能障礙｜院內參考')
    canvas.drawCentredString(PAGE_W / 2, 1.1 * cm, str(doc.page))
    canvas.drawRightString(PAGE_W - 1.6 * cm, 1.1 * cm, 'yc._vetalk')
    canvas.restoreState()


story = []

# ================= 第 1 頁：封面＋結論＋Protocol =================
story += [SP(0.2),
          txt('<b>經顱光生物調節（tPBMT）</b>', fontName='STH-B', fontSize=22, leading=30, textColor=NAVY, alignment=TA_CENTER),
          txt('<b>用於犬認知功能障礙症候群（CCDS）</b>', fontName='STH-B', fontSize=16, leading=24, textColor=NAVY, alignment=TA_CENTER),
          SP(0.15),
          txt('建議 Protocol、設定依據（Why）與作用原理', fontSize=11, leading=16, alignment=TA_CENTER),
          SP(0.1),
          txt('Transcranial Photobiomodulation Therapy for Canine Cognitive Dysfunction Syndrome', fontSize=8.5, leading=12, alignment=TA_CENTER),
          SP(0.15),
          txt('<font color="#B8952A"><b>yc._vetalk</b></font>　院內參考　2026-10', fontSize=8.5, leading=12, alignment=TA_RIGHT),
          SP(0.1), HR(GOLD, 1.5), SP(0.35)]

story.append(box(
    '書上的建議只有一行：<b>810 nm 近紅外線，手持件接觸頭頂（左右大腦半球都照），全程移動；'
    '皮膚表面輻照度 0.25–1.5 W/cm²、約 20 J/cm²；總能量 = 面積 × 20 J/cm²；'
    '第 1 週 2–3 次，再逐步減為每 2–3 週維持。</b>',
    bg=SAGE, border=TEAL, title='結論'))
story.append(SP(0.25))
story.append(box(
    '<b>目前沒有已發表的獸醫研究證實 tPBMT 對 CCDS 有效，理想參數也尚未確立。</b>'
    '書中數字是從囓齒類與人類阿茲海默症研究外推，再加上作者群的臨床經驗'
    '（「多數病例 4–6 週內症狀改善」是作者觀察，不是對照試驗）。建議向飼主說明這是外推、非標準的用法。',
    bg=AMBER, border=GOLD, title='證據等級（請先看這裡）'))
story.append(SP(0.4))

story += section('建議 Protocol 與設定依據')
proto = [
    ['項目', '建議設定', 'Why：為什麼這樣設'],
    ['治療部位', '頭頂（顱骨背側），左右大腦半球都照，手持件<b>接觸</b>皮膚',
     '皮膚是光穿透的最大障礙；書中犬遺體研究顯示接觸式比離開皮膚到達深部的光更多'],
    ['波長', '810 nm（本院 GBOX 的 810 nm 通道；980 nm 設 0 W）',
     '書中貓的示範用 810 nm；660／810／980／1064 nm 都有人研究，但各波長穿透力不同（受色素與顱骨上方肌肉厚度影響）'],
    ['模式', 'CW（連續波）',
     '書上以 CW 為基準；alpha（10 Hz）／gamma（40 Hz）脈衝有理論依據，但書中說好處尚待證實；若用 50% duty cycle，時間要加倍'],
    ['輻照度<br/>（皮膚表面）', '0.25–1.5 W/cm²<br/>= 功率 ÷ 光斑面積',
     '目的是讓到達皮質的輻照度重現在人類身上安全有效的範圍；範圍上限同時避免皮膚過熱'],
    ['劑量<br/>（皮膚表面）', '約 20 J/cm²',
     '光穿過頭皮、肌肉、顱骨會呈指數衰減，人類研究中頭皮 60 J/cm² 約只有 3.7% 到達硬腦膜；而皮質需要至少 5–10 J/cm²，所以表面要給得更多'],
    ['總能量', '治療面積 × 20 J/cm²<br/>小型犬（約 20–25 cm²）約 400–500 J<br/>中大型犬（50–70 cm²）1000–1400 J',
     '書上中大型犬的數字；較小的病患依面積等比例縮小（小型犬面積為估計值，需實測）'],
    ['操作', '手持件<b>持續移動</b>；病患與操作者戴對應 810 nm 的護目鏡',
     '四級雷射或高輻照度時，持續移動可避免單點過熱；810 nm 為不可見光，視網膜風險高'],
    ['療程', '第 1 週 2–3 次 → 每週 2 次 → 每週 1 次 → 每 2–3 週維持',
     'CCDS 是慢性退化性疾病，先密集啟動、再逐步減量維持；書上另說每兩個月的維持治療有最好的持續效果'],
    ['不適用', '懷疑顱內持續出血、亞急性頭部外傷',
     'PBMT 可能造成血流短暫增加，有顱內出血的風險'],
]
story.append(grid(proto, [2.4 * cm, 5.6 * cm, W - 8.0 * cm], font=8.4))
story.append(PageBreak())

# ================= 第 2 頁：劑量計算與 GBOX 設定 =================
story += section('劑量怎麼算：用「水龍頭澆花」來想')
story.append(txt('功率是水龍頭開多大，能量是總共澆了多少水，光斑是手持件「印章」的大小，'
                 '治療面積是整張「紙」，輻照度是印章下水噴得多猛，劑量是紙上每一小塊累積了多少水。', fontSize=9.5))
story.append(SP(0.25))
flow = Table([[txt('<b>總能量（J）</b><br/>= 治療面積 × 20 J/cm²', fontSize=9.5, alignment=TA_CENTER, textColor=NAVY),
               txt('→', fontSize=16, alignment=TA_CENTER, textColor=GOLD),
               txt('<b>時間（s）</b><br/>= 總能量 ÷ 功率', fontSize=9.5, alignment=TA_CENTER, textColor=NAVY),
               txt('→', fontSize=16, alignment=TA_CENTER, textColor=GOLD),
               txt('<b>檢查輻照度</b><br/>= 功率 ÷ 光斑面積<br/>要在 0.25–1.5 W/cm²', fontSize=9.5, alignment=TA_CENTER, textColor=NAVY)]],
             colWidths=[W * 0.29, W * 0.06, W * 0.29, W * 0.06, W * 0.30])
flow.setStyle(TableStyle([('BACKGROUND', (0, 0), (0, 0), MIST), ('BACKGROUND', (2, 0), (2, 0), MIST), ('BACKGROUND', (4, 0), (4, 0), MIST),
                          ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'), ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 8)]))
story += [flow, SP(0.3)]
story.append(box('輻照度管<b>安不安全</b>（太高會燙），劑量管<b>夠不夠</b>（太低效果不足）。兩個檢查缺一不可：'
                 '先用輻照度決定功率，再用劑量決定時間。', bg=SAGE, border=TEAL, title='兩個檢查'))
story.append(SP(0.4))

story += section('範例：不同體型怎麼設（GBOX，810 nm、CW）')
ex = [
    ['體型', '治療面積', '總能量（20 J/cm²）', '範例設定', '時間'],
    ['小型犬（約 4.5 kg）', '約 22 cm²（估計，需實測）', '約 440 J', '1.5 W', '約 293 s（約 5 分鐘）'],
    ['中大型犬', '50–70 cm²（書上）', '1000–1400 J', '4 W（光斑 ≥ 約 2.7 cm² 才不超過 1.5 W/cm²）', '約 250–350 s'],
]
story.append(grid(ex, [3.2 * cm, 3.6 * cm, 3.1 * cm, W - 3.2 * cm - 3.6 * cm - 3.1 * cm - 3.3 * cm, 3.3 * cm], font=8.4))
story.append(SP(0.15))
story.append(txt('※ 時間 = 總能量 ÷ 功率。300 s 可平均分給左右兩側各約 150 s。小型犬面積為我的估計值；功率與時間都要等手持件光斑面積確認後才能定案。',
                 fontSize=8.2, leading=12))
story.append(SP(0.35))

story += section('GBOX 面板設定對照')
gb = [
    ['面板欄位', '設定', '說明'],
    ['810 nm POWER', '依光斑面積決定（例：1.5 W）', '功率範圍 = 光斑面積 × 0.25 到 × 1.5'],
    ['980 nm POWER', '0.0 W', '不使用'],
    ['LASER EMISSION MODES', 'CW', '書上基準；脈衝（Repeat）的 Power 定義與單位需先看手冊'],
    ['Time', '總能量 ÷ 功率', '例：440 J ÷ 1.5 W ≈ 293 s'],
]
story.append(grid(gb, [4.0 * cm, 5.2 * cm, W - 9.2 * cm], font=8.6))
story.append(SP(0.35))
story.append(box(
    '① <b>手持件光斑面積</b>：決定功率可用範圍（例：30 mm 鏡頭約 7.1 cm² → 約 1.8–10.6 W；10 mm 鏡頭約 0.79 cm² → 約 0.2–1.2 W；以上為鏡頭直徑換算，非原廠數字）。<br/>'
    '② <b>本機規格（Device Settings 畫面）</b>：Model Gbox、810 + 980 nm、最大 30 W、瞄準光 650 nm（&lt; 5 mW）、脈衝 25 µs–6 s、1 Hz–20 kHz（可設 10／40 Hz）。功率上限不是限制，真正缺的是光斑面積。<br/>'
    '③ 機器內建 "Canine Cognitive Dysfunction…" 預設內容（面板名稱被截斷）。<br/>'
    '④ 建議：向飼主說明證據等級與同意事項，並在病歷記錄每次的功率、時間、總能量與反應。',
    bg=AMBER, border=WINE, title='定案前需要確認'))
story.append(PageBreak())

# ================= 第 3 頁：原理 =================
story += section('認知功能障礙為什麼可能改善？')
story.append(txt('CCDS 是自然發生的退化性腦病，與人類阿茲海默症相似。書的邏輯是：'
                 '<b>血流受損、粒線體功能障礙、氧化壓力與發炎，正是這個疾病的核心，也剛好是光生物調節（PBMT）最擅長處理的環節。</b>',
                 fontSize=9.8, leading=15.5))
story.append(SP(0.3))

col_h = lambda s, c: txt(f'<b>{s}</b>', fontName='STH-B', fontSize=11, leading=15, textColor=c, alignment=TA_CENTER)
L = [col_h('① 腦裡發生了什麼', WINE),
     txt('• 血管受損 → <b>腦血流不足</b><br/>• 神經元<b>粒線體功能障礙</b> → 能量（ATP）不足<br/>'
         '• <b>β-類澱粉蛋白（Aβ）</b>沉積在血管與神經元周圍<br/>• <b>發炎、氧化壓力</b>、腦中甲醛（FA）升高<br/>'
         '• 彼此加重，形成<b>惡性循環</b><br/>→ 樹突、突觸、神經元逐漸流失 → 認知退化', fontSize=9, leading=14.5)]
M = [col_h('② PBMT 做了什麼', TEAL),
     txt('• 光被粒線體的<b>細胞色素 c 氧化酶（CCO）</b>吸收 → <b>ATP 增加</b>、粒線體功能恢復<br/>'
         '• 抑制 β-secretase、刺激降解 Aβ 的酵素 → <b>Aβ 解聚</b>（囓齒類）<br/>'
         '• 微膠細胞偏向<b>抗發炎、神經保護的 M2 型</b><br/>• 腦血管密度增加、發炎因子與 FA 下降（囓齒類）', fontSize=9, leading=14.5)]
R = [col_h('③ 預期結果', NAVY),
     txt('• 打斷「血流↓ → 粒線體↓ → Aβ／發炎↑」的惡性循環<br/>• 神經元的能量與環境改善<br/>'
         '• 臨床上：定向力、睡眠週期、焦慮、夜間踱步等症狀改善<br/>'
         '<br/><b>作者觀察：</b>症狀常在前 1–2 次治療內開始緩解，多數病例 4–6 週內改善', fontSize=9, leading=14.5)]
cols = Table([[L, '→', M, '→', R]], colWidths=[W * 0.30, W * 0.045, W * 0.31, W * 0.045, W * 0.30])
cols.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'),
                          ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#FBEFEF')), ('BACKGROUND', (2, 0), (2, 0), SAGE), ('BACKGROUND', (4, 0), (4, 0), MIST),
                          ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                          ('TOPPADDING', (0, 0), (-1, -1), 8), ('BOTTOMPADDING', (0, 0), (-1, -1), 10)]))
# 箭頭欄置中
cols._cellvalues[0][1] = txt('→', fontSize=16, alignment=TA_CENTER, textColor=GOLD)
cols._cellvalues[0][3] = txt('→', fontSize=16, alignment=TA_CENTER, textColor=GOLD)
cols.setStyle(TableStyle([('BACKGROUND', (1, 0), (1, 0), WHITE), ('BACKGROUND', (3, 0), (3, 0), WHITE), ('VALIGN', (1, 0), (1, 0), 'MIDDLE'), ('VALIGN', (3, 0), (3, 0), 'MIDDLE')]))
story += [cols, SP(0.4)]

story.append(box(
    '上面「PBMT 做了什麼」大多來自<b>囓齒類與機轉層級</b>的研究，不是犬的臨床對照試驗。'
    '人類方面，書中提到近年有 tPBM 用於阿茲海默症、帕金森氏症、創傷性腦損傷等的研究，'
    'NEST 試驗（超過 1400 位患者）顯示 tPBM 安全，但療效結果不一致，原因是疾病不同與劑量不一致。'
    '所以：機轉合理、安全性資料良好，但<b>犬 CCDS 的療效仍需要更多證據</b>。',
    bg=AMBER, border=GOLD, title='請注意：這是「合理的推測」，不是已證實的療效'))
story.append(SP(0.3))
story.append(box(
    'CCDS 目前的處置（L-deprenyl、SAMe、抗氧化與粒線體輔因子飲食、必需脂肪酸、環境調整）可以和 tPBMT 並行；'
    '書中把 PBMT 定位為這些方法之外的選項，不是取代。',
    bg=MIST, border=TEAL, title='補充'))
story.append(PageBreak())

# ================= 第 4 頁：原文 A + B =================
story += section('原文佐證（1）作用原理')
story.append(txt('以下為書中相關段落的截圖，附中文重點，方便核對。出處：Winkler &amp; Miller (eds.), <i>Laser Therapy in Veterinary Medicine: Photobiomodulation</i>, 2nd ed., Wiley 2025, Ch.16。',
                 fontSize=8.2, leading=12))
story.append(SP(0.25))
story.append(excerpt('mech', '作用原理（病理＋PBMT 機轉）', '書 p.200 右欄',
                     ['CCDS 的病理是多因子的：血管受損、粒線體功能障礙、發炎、氧化壓力、Aβ 沉積。',
                      '作者與同儕觀察到 tPBMT 在多數病例 4–6 週內改善症狀（作者觀察）。',
                      '核心邏輯：血流、粒線體、氧化壓力、發炎，正是 PBMT 擅長處理的地方。',
                      '血管受損與發炎 → Aβ 堆積 → ROS 與促發炎細胞激素↑、神經元凋亡、甲醛↑，並與粒線體功能障礙互相加重（惡性循環）。',
                      'PBMT 可使 Aβ 解聚、促使微膠細胞偏向 M2 型；囓齒類研究見 Aβ 下降、認知測試改善、腦血管密度增加、甲醛下降。'],
                     img_w=8.2))
story.append(PageBreak())

# ================= 第 5 頁：原文 C =================
story += section('原文佐證（2）證據等級與建議參數')
story.append(excerpt('evid', '證據等級', '書 p.201 左欄上段',
                     ['<b>沒有已發表的獸醫研究</b>探討 tPBMT 治療 CCDS 的療效。',
                      '<b>理想參數尚未確立</b>；可從囓齒類與人類阿茲海默症試驗外推。',
                      '660、810、980、1064 nm 都被研究過，但穿透力不同，犬顱骨上方肌肉比囓齒類與人類厚。'],
                     img_w=8.6))
story.append(SP(0.35))
story.append(excerpt('param', '劑量、接觸方式、輻照度與總能量', '書 p.201 右欄',
                     ['<b>皮質層</b>最低有效劑量 5–10 J/cm²（Enengl 等人 2020，人類文獻回顧）。',
                      '經顱能量呈指數衰減，人類頭皮建議 <b>20–60 J/cm²</b>，大型到超大型犬可相似。',
                      'alpha／gamma 脈衝可能有額外益處；<b>50% duty cycle 時間要加倍</b>。',
                      '手持件<b>接觸</b>顱骨背側，<b>左右半球</b>都治療；建議為病患配戴護目鏡。',
                      '高功率或輻照度在高端時，治療頭要<b>全程持續移動</b>；三級 B 雷射可逐點定位。',
                      '皮膚表面輻照度 <b>0.250–1.5 W/cm²</b>；必須知道光斑面積、功率與 duty cycle 才能計算劑量。',
                      '中大型犬頭頂 50–70 cm²，以 20 J/cm² 計算，總劑量約 <b>1000–1400 J</b>（下一頁接續）。'],
                     img_w=8.6))
story.append(PageBreak())

# ================= 第 6 頁：原文 D + E =================
story += section('原文佐證（3）療程頻率與安全')
story.append(excerpt('sched', '療程頻率與耐受性', '書 p.202 左欄',
                     ['接續上頁：以 20 J/cm² 計算，<b>較小的病患依面積縮小</b>。',
                      '慢性退化性疾病：<b>第 1 週 2–3 次</b>，之後減為每週 2 次、每週 1 次，再<b>每 2–3 週</b>維持，以症狀最小化為準。',
                      '治療<b>無痛、耐受良好</b>；部分病患前 24 小時可能稍微疲倦。',
                      '症狀通常在前 1–2 次治療內開始緩解，第一個月逐步進步。',
                      '<b>每兩個月</b>的維持治療最有機會持續維持療效。']))
story.append(SP(0.4))
story.append(excerpt('tbi', '不要用的情況', '書 p.202 右欄上段（創傷性腦損傷一節）',
                     ['創傷性腦損傷可使用與 CCDS 相同的參數，頻率每 12–24 小時一次。',
                      '<b>不建議亞急性頭部外傷使用</b>：PBMT 可能造成血流短暫增加，有顱內出血的風險。',
                      '<b>只要有理由懷疑顱內持續出血，就不應使用 PBMT。</b>']))
story.append(SP(0.4))
story.append(box(
    'Winkler CJ, Miller LA (eds.). Laser Therapy in Veterinary Medicine: Photobiomodulation. 2nd ed. Hoboken: John Wiley &amp; Sons; 2025. Ch.16 Neurological Conditions, pp.198–203。'
    '書中引用的 CCDS 原始文獻包括 Dewey et al. 2022（Open Vet J 12:256–263）、Enengl et al. 2020、Schiffer et al. 2009、Piao et al. 2017，本簡報未逐篇核對原文。<br/>'
    '原文截圖來自版權教材，<b>僅供院內參考，請勿對外散布或公開張貼</b>。本簡報為個人整理，不作為正式診斷或治療依據；實際設定以原廠說明與主治醫師指示為準。',
    bg=WARM, border=SLATE, title='資料來源與使用說明'))

doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=A4, leftMargin=1.6 * cm, rightMargin=1.6 * cm,
                        topMargin=1.6 * cm, bottomMargin=2.2 * cm,
                        title='tPBMT 與犬認知功能障礙｜院內簡報', author='yc._vetalk')
doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
print('OK ->', OUTPUT_PATH)
