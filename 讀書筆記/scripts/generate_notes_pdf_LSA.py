#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
完整筆記 — 犬淋巴瘤 Updates and Current Trends
來源：IDEXX CE, Pamela D. Jones DVM, DACVIM(Oncology)/DACVR, Sept 2026
規格依循 上群/Web/PDF講義製作指南_藥理學.md 的「完整筆記」樣式
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.platypus import (SimpleDocTemplate, Paragraph as P, Spacer,
    Table, TableStyle, KeepTogether, HRFlowable, PageBreak)
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont('STHeiti', '/System/Library/Fonts/STHeiti Medium.ttc'))
pdfmetrics.registerFont(TTFont('STHeiti-B', '/System/Library/Fonts/STHeiti Medium.ttc'))

NAVY  = colors.HexColor('#1B2D4F')
TEAL  = colors.HexColor('#2A6B72')
GOLD  = colors.HexColor('#B8952A')
WINE  = colors.HexColor('#6B2333')
SLATE = colors.HexColor('#4A5568')
LGRAY = colors.HexColor('#ECEAE6')
MIST  = colors.HexColor('#EEF4F8')
AMBER = colors.HexColor('#FEF8EC')
WARM  = colors.HexColor('#F7F5F0')
CREAM = colors.HexColor('#FBEAEA')
DIV   = colors.HexColor('#D4C9B0')
WHITE = colors.white

PAGE_W, PAGE_H = A4
W = PAGE_W - 3.6 * cm

OUTPUT_PATH = "/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群/讀書筆記/犬淋巴瘤_完整筆記.pdf"

_counter = {'n': 0}
def _uid():
    _counter['n'] += 1
    return f"s{_counter['n']}"

def mk(name, **kw):
    base = dict(fontName='STHeiti', fontSize=9.5, leading=14.5, textColor=SLATE)
    base.update(kw)
    return ParagraphStyle(name, **base)

def SP(h):
    return Spacer(1, h * cm)

def HR(color=GOLD, thickness=1.5):
    return HRFlowable(width='100%', thickness=thickness, color=color, spaceBefore=0, spaceAfter=0)

# ---------- 標題元件 ----------
def h1_el(text):
    uid = _uid()
    label = P(f'<b>{text}</b>', mk(f'h1_{uid}', fontName='STHeiti-B', fontSize=13.5, leading=18, textColor=NAVY))
    t = Table([[label]], colWidths=[W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WARM),
        ('LINEBEFORE', (0, 0), (0, 0), 4, GOLD),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return [t, SP(0.25)]

def h2_el(text):
    uid = _uid()
    return [P(f'◆ {text}', mk(f'h2_{uid}', fontName='STHeiti-B', fontSize=11, leading=15, textColor=TEAL)), SP(0.12)]

def section(story, text):
    story.extend(h1_el(text))

def subsec(story, text):
    story.extend(h2_el(text))

def B(story, text, star=0):
    uid = _uid()
    prefix = '★ ' if star else '• '
    story.append(P(prefix + text, mk(f'b_{uid}', leftIndent=8)))
    story.append(SP(0.06))

def B2(story, text):
    uid = _uid()
    story.append(P('◦ ' + text, mk(f'b2_{uid}', leftIndent=20, fontSize=9, textColor=SLATE)))
    story.append(SP(0.05))

# ---------- 表格 ----------
def tbl_el(headers, rows, col_w):
    uid = _uid()
    hdr_style = mk(f'th_{uid}', fontName='STHeiti-B', fontSize=8.8, leading=12, textColor=WHITE, alignment=TA_CENTER)
    cell_c = mk(f'tc_{uid}', fontSize=8.6, leading=12, alignment=TA_CENTER)
    cell_l = mk(f'tcl_{uid}', fontSize=8.6, leading=12, alignment=TA_LEFT)
    data = [[P(h, hdr_style) for h in headers]]
    for r in rows:
        row = []
        for i, c in enumerate(r):
            st = cell_l if i == 0 else cell_c
            row.append(P(str(c), st))
        data.append(row)
    t = Table(data, colWidths=col_w, repeatRows=1)
    style = [
        ('BACKGROUND', (0, 0), (-1, 0), NAVY),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, DIV),
    ]
    for i in range(1, len(data)):
        style.append(('BACKGROUND', (0, i), (-1, i), LGRAY if i % 2 == 0 else WARM))
    t.setStyle(TableStyle(style))
    return t

def tbl(story, headers, rows, col_w):
    story.append(tbl_el(headers, rows, col_w))
    story.append(SP(0.2))

# ---------- 提示框 ----------
def _box(content_list, bg, border_color, accent_width=4):
    t = Table([[content_list]], colWidths=[W])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), bg),
        ('BOX', (0, 0), (-1, -1), 0.8, border_color),
        ('LINEBEFORE', (0, 0), (0, 0), accent_width, border_color),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    return t

def logic_box(story, lines, title=None):
    story.append(_logic_box_el(lines, title))
    story.append(SP(0.2))

def _logic_box_el(lines, title=None):
    uid = _uid()
    content = []
    if title:
        content.append(P(f'<b>{title}</b>', mk(f'lbt_{uid}', fontName='STHeiti-B', fontSize=9.5, textColor=TEAL)))
        content.append(SP(0.08))
    for ln in lines:
        content.append(P('→ ' + ln, mk(f'lb_{uid}', fontSize=9, leading=13.5)))
    return _box(content, MIST, TEAL)

def star_box(story, items, title='臨床重點'):
    story.append(_star_box_el(items, title))
    story.append(SP(0.2))

def _star_box_el(items, title='臨床重點'):
    uid = _uid()
    content = [P(f'<b>★ {title}</b>', mk(f'sbt_{uid}', fontName='STHeiti-B', fontSize=9.5, textColor=GOLD))]
    content.append(SP(0.08))
    for it in items:
        content.append(P('• ' + it, mk(f'sb_{uid}', fontSize=9, leading=13.5)))
    return _box(content, AMBER, GOLD)

def warn_box(story, items, title='注意事項'):
    story.append(_warn_box_el(items, title))
    story.append(SP(0.2))

def _warn_box_el(items, title='注意事項'):
    uid = _uid()
    content = [P(f'<b>⚠ {title}</b>', mk(f'wbt_{uid}', fontName='STHeiti-B', fontSize=9.5, textColor=WINE))]
    content.append(SP(0.08))
    for it in items:
        content.append(P('• ' + it, mk(f'wb_{uid}', fontSize=9, leading=13.5)))
    return _box(content, CREAM, WINE)

# ---------- 跨頁分組 ----------
def section_start(story, h1_text, first_el, h2_text=None):
    group = h1_el(h1_text)
    if h2_text:
        group += h2_el(h2_text)
    group += [first_el, SP(0.2)]
    story.append(KeepTogether(group))

def subsec_start(story, h2_text, first_el):
    group = h2_el(h2_text) + [first_el, SP(0.2)]
    story.append(KeepTogether(group))

# ---------- 頁尾 ----------
def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('STHeiti', 7)
    canvas.setFillColor(colors.HexColor('#BBBBBB'))
    canvas.drawString(1.8 * cm, 1.1 * cm, '犬淋巴瘤 Updates and Current Trends｜完整筆記')
    canvas.drawCentredString(PAGE_W / 2, 1.1 * cm, str(doc.page))
    canvas.drawRightString(PAGE_W - 1.8 * cm, 1.1 * cm, '上群 動物醫院')
    canvas.restoreState()

# ================= 內容 =================
story = []

# ---- 封面 ----
story.append(SP(1.5))
story.append(P('<b>Canine Lymphoma</b>', mk('cv_t1', fontName='STHeiti-B', fontSize=26, leading=34, textColor=NAVY, alignment=TA_CENTER)))
story.append(SP(0.1))
story.append(P('<b>Updates and Current Trends 犬淋巴瘤最新趨勢</b>', mk('cv_t2', fontName='STHeiti-B', fontSize=15.5, leading=22, textColor=NAVY, alignment=TA_CENTER)))
story.append(SP(0.3))
story.append(P('診斷分期、免疫分型、治療選擇與 IDEXX Cancer Dx 液態切片監測應用整理', mk('cv_sub', fontSize=11, leading=16, textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.2))
story.append(P('診斷分期  |  免疫分型  |  治療選擇  |  液態切片與監測', mk('cv_tags', fontSize=8.5, leading=14, textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.2))
story.append(P('資料來源：IDEXX Laboratories CE — Pamela D. Jones, DVM, DACVIM(Oncology), DACVR(Radiation Oncology)｜Sept 2026', mk('cv_kw', fontSize=8.5, leading=12, textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.3))
story.append(P('<font color="#B8952A"><b>上群 動物醫院｜臨床參考筆記</b></font>', mk('cv_br', fontSize=8.5, leading=12, alignment=TA_RIGHT)))
story.append(SP(0.15))
story.append(HR(GOLD, 1.5))
story.append(SP(0.5))
B(story, '本筆記整理自 IDEXX 研討會投影片，供院內醫師快速掌握本次演講重點；臨床決策仍應以病患完整病史、理學檢查與檢驗結果綜合判斷為準。')
story.append(PageBreak())

# ---- 一、疾病基礎與分型 ----
section_start(story, '一、疾病基礎與分型',
    P('淋巴瘤（Lymphoma）為血液系統惡性腫瘤，係體內淋巴球的惡性增生。多中心型（multicentric）是最常見型態，具多個原發中心，理學檢查最常發現於周邊淋巴結。',
      mk('t1', leading=15)))

subsec(story, '常見解剖分型')
B(story, '多中心型（Multicentric）——最常見，周邊淋巴結腫大')
B(story, '縱膈型（Mediastinal）——胸腔前縱膈腫塊，約 97% 為 T 細胞來源')
B(story, '腸胃型（Alimentary）——腸壁層次結構消失/改變')
B(story, '肝脾型（Hepatosplenic）')
B(story, '皮膚型（Cutaneous）——分期方式與其他型不同，不適用 Stage 5 系統')
story.append(SP(0.15))

subsec(story, '亞型分布（犬淋巴瘤，約80%屬侵襲性 DLBCL/DLTCL）')
tbl(story, ['亞型', '縮寫', '約占比'],
    [['瀰漫性大B細胞淋巴瘤', 'DLBCL', '52%'],
     ['周邊T細胞淋巴瘤，未分類', 'PTCL, NOS', '15%'],
     ['其他T細胞淋巴瘤', 'Other T', '7%'],
     ['結節性邊緣區淋巴瘤', 'NMZL', '8%'],
     ['其他B細胞淋巴瘤', 'Other B', '6%'],
     ['T區淋巴瘤（惰性）', 'TZL', '4%'],
     ['T淋巴母細胞淋巴瘤', 'T-LBL', '3%'],
     ['套細胞淋巴瘤', 'MCL', '2%'],
     ['其他', 'Other', '3%']],
    [6.5*cm, 3.5*cm, 3.5*cm])

star_box(story, [
    'T 區淋巴瘤（T-zone）與邊緣區淋巴瘤（marginal zone）屬惰性（indolent），建議 active surveillance（定期監測），邊緣區淋巴瘤建議先手術切除後再監測，不宜直接視同侵襲性淋巴瘤積極化療。',
    '其餘約 80% 屬侵襲性，建議傳統化療（結果依疾病分布而異）。'
], title='分型影響治療決策')

subsec(story, '轉診流程觀察')
logic_box(story, [
    '基層獸醫師（GP）處理約 96% 的表淺淋巴瘤（FNA ± biopsy）',
    '轉診至專科／急診／內科等待時間約 3-8 週',
    '確診後 75-83% 非緩和治療病例會被轉診至腫瘤科',
    '主訴：健康犬「觸摸到腫大淋巴結」；生病犬則常伴隨器官腫大、嗜睡、發燒、腸胃不適、多渴多尿等較難診斷之非特異症狀'
], title='臨床路徑：Diagnose/Rule Out → Confirm/Characterize → Treat → Monitor')

story.append(PageBreak())

# ---- 二、診斷工具 ----
section(story, '二、診斷工具比較')
subsec(story, '五種常用診斷/分型工具')
tbl(story, ['工具', '檢體', '特點'],
    [['細針抽吸（FNA）', '細胞學玻片', '最常用第一線診斷方式，22G針+6mL針筒；結果不具診斷性時可考慮重新抽吸或改做切片'],
     ['切片（Biopsy）', '組織', 'FNA無法確診時的次選；可觀察組織架構，判斷特定亞型需要切片'],
     ['免疫組織化學（IHC）', '切片組織', '對切片樣本加做，提供額外預後資訊，犬淋巴瘤免疫分型金標準；標記CD20/CD21/CD79a(B)、CD3(T)'],
     ['免疫細胞化學（ICC）', '細胞學玻片', '對確診/疑似細胞學案例加做，由臨床病理師判讀，同樣以 CD20(B)/CD3(T) 分型'],
     ['PARR（抗原受體重排PCR）', '玻片上細胞', '判斷細胞株clonality，鑑別發炎 vs 腫瘤族群，亦提供預後資訊'],
     ['流式細胞儀（Flow cytometry）', '存活細胞（生理食鹽水+血清懸浮）', '依細胞表面標記與大小分選淋巴球，資訊最完整但需特殊處理與運送']],
    [4.6*cm, 4.4*cm, 8.4*cm])

subsec(story, 'PARR 與 Flow cytometry 詳細比較')
tbl(story, ['項目', 'PARR', 'Flow Cytometry'],
    [['核心問題', '這隻病患是否真的有淋巴瘤？', '這隻病患是哪一種淋巴瘤？'],
     ['優點', '可用較低細胞量樣本、不需特殊處理', '提供最完整的免疫分型資訊'],
     ['TAT', '10-14 個工作天', '3-5 個工作天'],
     ['Specificity', '89-94%', '95-100%'],
     ['特殊處理', '不需要', '需要（低溫保存並儘速送檢）']],
    [3.5*cm, 6.9*cm, 6.9*cm])

star_box(story, [
    '免疫分型（B cell vs T cell）直接影響預後判斷與治療選擇——T 細胞淋巴瘤預後通常較差、對 CHOP 反應率較低，但對 Laverdia、Tanovea 等藥物反應率相對較高。',
    'IHC 為金標準；ICC/PARR/Flow cytometry 皆為取得免疫分型的替代或輔助方式，可依樣本可得性、時間與預算彈性選用。'
], title='為什麼免疫分型很重要')

story.append(PageBreak())

# ---- 三、分期與次分期 ----
section(story, '三、分期（Staging）與次分期（Substaging）')
subsec(story, '犬淋巴瘤分期系統')
tbl(story, ['Stage', '病灶範圍', '偵測方式'],
    [['1', '單一淋巴結', '理學檢查／細胞學'],
     ['2', '多個淋巴結，侷限於橫膈一側', '理學檢查／細胞學'],
     ['3', '瀰漫性淋巴結腫大', '理學檢查／細胞學'],
     ['4', '肝臟和／或脾臟侵犯', '腹部超音波'],
     ['5', '骨髓、眼睛、中樞神經、肺、皮膚*', '胸腔X光、骨髓抽吸']],
    [2.2*cm, 8.4*cm, 6.8*cm])
B2(story, '＊皮膚型淋巴瘤分期方式不同，不套用 Stage 5 系統')

subsec(story, '完整分期建議項目')
tbl(story, ['項目', '內容'],
    [['基礎檢驗', 'CBC、血清生化、傳染病篩檢、尿液分析'],
     ['胸腔X光', '三視角胸片；依臨床症狀考慮加照其他部位'],
     ['腹部超音波', '完整腹腔掃描，視情況加做器官細針抽吸'],
     ['骨髓抽吸', '取材部位：肱骨或髂骨；可能合併或不合併骨髓核心切片']],
    [4.5*cm, 12.9*cm])

logic_box(story, [
    '研究顯示：檢查項目越完整（理學檢查 → 加胸片/腹超 → 加肝脾細胞學 → 加骨髓細胞學），越多病例被歸類為 Stage III-V（stage migration）',
    '骨髓抽吸實務上少做：需重度鎮靜或麻醉、侵入性高、耗費病患與醫師的時間與費用',
    '骨髓侵犯 = Stage 5 疾病；可用「血小板低下 + 淋巴球 >10%」作為骨髓侵犯的替代篩檢指標（敏感度80%、特異度89%），非必要不一定需要直接做骨髓抽吸'
], title='分期方法選擇的臨床考量')

subsec(story, '縱膈淋巴瘤特點')
B(story, '胸片可見前縱膈腫塊，約 70% 併發高血鈣')
B(story, '約 97% 為 T 細胞來源，中位存活時間（MST）183 天')
B(story, '氣管支氣管淋巴結腫大不易取樣，可能需支氣管鏡；亦有考慮 L-asparaginase 治療性嘗試')
story.append(SP(0.1))

subsec(story, '腹部超音波診斷準確度')
tbl(story, ['偵測目標', 'Sensitivity', 'Specificity'],
    [['肝臟淋巴瘤浸潤', '16.7%', '91.0%'],
     ['脾臟淋巴瘤浸潤', '73.1%', '93.9%']],
    [8.7*cm, 4.35*cm, 4.35*cm])
star_box(story, [
    '超音波下肝臟正常，通常代表無浸潤（陰性預測力高）；但敏感度低，「正常」不能完全排除輕微浸潤。',
    '「豹紋狀」脾臟＋脾腫大提示浸潤；豹紋狀脾臟型態與 B 細胞淋巴瘤相關。'
], title='腹超判讀重點')

subsec_start(story, '次分期（Substage）與預後',
    tbl_el(['次分期', '犬數', 'MST（週）', '緩解期（週）'],
        [['a（無臨床症狀）', '31', '69', '44'],
         ['b（有臨床症狀）', '24', '28', '18']],
        [5.8*cm, 3.9*cm, 3.9*cm, 3.9*cm]))
B2(story, 'P = 0.001（存活）、P = 0.040（緩解期）—— 統計上具顯著差異')
story.append(SP(0.1))
B(story, 'Substage b 常見症狀：食慾不振、嘔吐、腹瀉、呼吸困難、精神/活力改變、虛弱')
warn_box(story, [
    '次分期 b（有臨床症狀）病患預後明顯較差，衛教時務必納入考量，並與飼主討論預後與治療強度選擇。'
], title='與飼主溝通重點')

story.append(PageBreak())

# ---- 四、血檢判讀臨床範例 ----
section(story, '四、血檢異常判讀：臨床思路範例')
subsec(story, '範例一：雙血球減少（Bicytopenia）')
logic_box(story, [
    '異常：嗜中性球低下（Neutrophils 2.10）＋ 血小板低下（Platelets 43）',
    '鑑別診斷：骨髓侵犯 vs 續發性免疫媒介性破壞',
    '臨床判斷：嗜中性球低下＋血小板低下併存，較傾向懷疑骨髓侵犯（而非單純免疫媒介性血小板減少）'
], title='臨床思路')

subsec(story, '範例二：高血鈣併氮血症')
logic_box(story, [
    '異常：Calcium 13.8（高）、Creatinine 3.6（高）、BUN 45（高）',
    '高血鈣常續發於惡性腫瘤（淋巴瘤與肛門腺腺癌 AGASACA 最常見）',
    '氮血症鑑別：腎前性（脫水）／腎性／腎後性（阻塞）——此情境下氮血症較可能是續發於高血鈣造成的腎損傷（腎性）'
], title='臨床思路')

star_box(story, [
    '看到高血鈣，務必將淋巴瘤與 AGASACA 列入鑑別診斷首位，並安排相應的淋巴結／肛門腺檢查。',
    '雙血球或全血球減少合併淋巴瘤病史，應提高對骨髓侵犯（Stage 5）的懷疑度。'
], title='總結')

story.append(PageBreak())

# ---- 五、治療選擇 ----
section(story, '五、治療選擇')
subsec(story, '四種治療策略比較')
tbl(story, ['方案', '療程', 'MST（B細胞／T細胞）', '費用（療程）'],
    [['CHOP 多藥合併', '25週；Doxo/CTX/Vinc/Pred，可替換 CCNU、Tanovea', '14個月／6-7個月', '約 $3000-9000+'],
     ['單一藥物方案', '15週；Doxorubicin、Tanovea、D+T交替、CCNU，每3週一次', '7-9個月／4-5個月', '約 $3000-6000+'],
     ['口服 Laverdia', '未知，每週兩次口服', '較常見於資料有限，T細胞反應率較高', '每月約 $160+'],
     ['緩和 Prednisone', '未知，每日1-2次', '2-4個月（不分免疫表現型）', '每月約 $30-200']],
    [3.6*cm, 5.8*cm, 4.3*cm, 3.7*cm])

B(story, '多數犬接受化療皆可進入緩解，但治癒率低於 5%——需與飼主明確溝通「緩解」與「治癒」的差異。')
story.append(SP(0.1))

subsec(story, '重點藥物／技術')
tbl(story, ['項目', '重點內容'],
    [['ImpriMed', '化療敏感度預測（AI模型），提供CHOP及單一藥物反應預測分數；檢體：淋巴瘤FNA×2+EDTA血2mL，白血病僅需EDTA血2mL；治療前（含首次與復發時）採檢'],
     ['Tanovea（Rabacfosadine）', 'DNA聚合酶抑制劑；IV輸注30分鐘，每3週一次，共5次治療；ORR 83%，緩解病例中位無惡化存活期(PFS)約6個月'],
     ['Laverdia-CA1（Verdinexor）', '口服核輸出選擇性抑制劑（SINE，抑制XPO1）；犬淋巴瘤有條件核准；1.25 mg/kg 口服，每週兩次；整體反應率37%，T細胞淋巴瘤反應率達71%，耐受性佳']],
    [4.2*cm, 13.2*cm])

warn_box(story, [
    'Tanovea 常見副作用：嘔吐、腹瀉、食慾不振、嗜睡。',
    '特殊毒性警示：西高地白㹴（West Highland White Terrier）使用 Tanovea 有發生肺纖維化的獨特風險，用藥前應審慎評估品種風險。'
], title='用藥安全提醒')

subsec(story, '化療與生活品質（QOL）')
B(story, '約 50% 犬隻在化療過程中生活品質改善，僅約 20% 出現 QOL 下降')
B(story, '約 75% 的飼主表示若復發願意再次接受化療；延長存活時間是飼主重視的關鍵因素')
B(story, '單一藥物 vs 多藥合併方案，兩者對飼主感受到的生活品質沒有顯著差異——治療強度的選擇可更聚焦於預後預期與經濟考量，而非單純「越強效QOL越差」的預設')

story.append(PageBreak())

# ---- 六、追蹤監測 SOP ----
section(story, '六、治療後監測建議')
tbl(story, ['項目', '頻率／內容'],
    [['飼主居家觀察', '生活品質、行為、淋巴結大小變化——飼主常是最早發現復發的第一線'],
     ['理學檢查＋淋巴結觸診', '每 1-3 個月一次；淋巴結腫大常是緩解後復發的最早徵象'],
     ['CBC／生化／尿液分析', '依病患情況、疾病分期與先前檢驗結果決定頻率；例如初診高血鈣者建議每月追蹤血鈣'],
     ['影像追蹤（腹超／胸片）', 'Stage IV 或腸胃道侵犯病患可能需定期腹超；縱膈型病患可能需定期胸片']],
    [4.6*cm, 12.8*cm])

story.append(PageBreak())

# ---- 七、IDEXX Cancer Dx ----
section(story, '七、IDEXX Cancer Dx™（液態切片）新技術')
subsec(story, '什麼是液態切片（Liquid Biopsy）？')
B(story, '一種微創檢測，分析體液樣本以偵測疾病訊號；最常見樣本為血液，其他包括尿液、腦脊髓液、體腔液')

subsec(story, 'IDEXX Cancer Dx™ 開發要求')
tbl(story, ['要求', '說明'],
    [['血液基礎檢測', '可於例行健檢採血時同步取得，不影響就診流程'],
     ['所需檢體量少', '不改變原有預約流程或工作模式'],
     ['生物標記穩定', '運送與保存過程中仍能維持完整性，可於實驗室加做'],
     ['高特異性', '所選生物標記須能與蟲媒疾病、自體免疫疾病及其他癌症區別']],
    [3.6*cm, 13.8*cm])

subsec(story, '驗證與驗證數據')
tbl(story, ['指標', '數值'],
    [['LSA 特異度（Specificity）', '98.9%'],
     ['LSA 敏感度（Sensitivity）', '79.3%'],
     ['T 細胞免疫分型特異度', '98.8%'],
     ['B 細胞免疫分型特異度', '91.3%']],
    [8.7*cm, 8.7*cm])
B2(story, '偽陽性主要來源：轉移性肥大細胞病、PARR判讀為B細胞的脾臟圓細胞瘤（疑似漿細胞來源）')
B2(story, '56% 的 IDEXX Cancer Dx 結果包含免疫分型結果，且不額外收費')
story.append(SP(0.1))

subsec(story, '與現有診斷工具比較')
tbl(story, ['指標', 'Cancer Dx', '細胞學', 'PARR'],
    [['Sensitivity', '79%', '92.6%', '75-92%'],
     ['Specificity', '99%', '89.4%', '94-98.7%'],
     ['TAT', '2-3天', '1-5天', '10-14天'],
     ['檢體', '血清/血液', '病灶細胞', '病灶細胞'],
     ['費用', '$', '$$', '$$$']],
    [4.4*cm, 4.3*cm, 4.3*cm, 4.4*cm])

subsec(story, '臨床決策路徑')
logic_box(story, [
    '【生病中的犬隻】結果符合淋巴瘤 → 進一步做病灶細胞學/切片＋分期影像確診並指導治療；可考慮腫瘤科諮詢',
    '【生病中的犬隻】結果不符合淋巴瘤但高度懷疑 → 仍建議淋巴結細胞學/切片＋影像檢查，陰性結果不能排除淋巴瘤',
    '【健康犬隻篩檢】結果符合淋巴瘤 → 完整病史、理學檢查、血檢，考慮切片/影像/血液淋巴球增多時加做流式細胞儀確認',
    '【健康犬隻篩檢】結果不符合淋巴瘤 → 支持目前無可偵測淋巴瘤，於下次例行健檢時再評估（AAHA建議：高齡犬每半年一次，其餘每年一次）'
], title='陽性/陰性結果的下一步')

warn_box(story, [
    'Cancer Dx 為篩檢與輔助診斷工具，陰性結果不能完全排除淋巴瘤——臨床高度懷疑時仍應完成傳統診斷流程（細胞學/切片/影像）。'
], title='解讀限制')

story.append(PageBreak())

subsec(story, '案例分享')
tbl(story, ['案例', '重點經過'],
    [['Blaze（5歲黃金獵犬）', '呼吸急促＋胸腔積液，胸腹超音波見縱膈腫塊及腹腔淋巴結腫大；血檢+Cancer Dx於第2天即顯示淋巴瘤、T細胞表現型，第8天外部流式細胞儀證實T細胞淋巴瘤——Cancer Dx提前提供分型方向'],
     ['Evie（15歲馬爾濟斯）', '反覆兩次細胞學皆因細胞裂解/低細胞量而無法確診；第14天加做Cancer Dx顯示「符合淋巴瘤」但表現型未定，最終切片（Day 25）確診高惡性度淋巴瘤，IHC（Day 28）證實為B細胞——Cancer Dx在細胞學卡關時提供關鍵佐證'],
     ['Rose（11歲大丹犬）', '例行健檢時Cancer Dx即顯示符合淋巴瘤，但當時理學檢查與血檢皆正常；約3個月後（2/23）出現厭食、體重下降、淋巴結腫大，細胞學證實中/大細胞淋巴瘤——顯示可提前數月偵測'],
     ['Ruger（10歲澳洲牧羊犬）', '例行健檢Cancer Dx符合淋巴瘤（表現型未定），理學檢查與血檢皆正常；經追加觸診「正常」淋巴結細胞學竟已顯示淋巴瘤，腹超見腸繫膜淋巴結病變——若無Cancer Dx此案例將無法於理學檢查或常規血檢中被發現']],
    [3.4*cm, 14*cm])

subsec(story, 'SEARCHER 大型篩檢研究')
logic_box(story, [
    '設計：66家基層診所，納入接受健檢的病患，執行CBC、Chemistry 25/27、IDEXX Cancer Dx',
    '排除條件：1個月內接受免疫抑制劑/類固醇治療；1年內曾罹癌或曾有淋巴瘤病史',
    '結果：2025/4/1-12/31間納入3305隻犬，23隻「符合淋巴瘤」，17隻完成後續工作；中位工作天數20天（範圍4-71天）',
    '17隻中：5隻確診淋巴樣腫瘤、4隻推定為腫瘤、8隻工作後未見腫瘤證據'
], title='研究重點')

subsec(story, '縱向監測研究（Nascimento et al., BMC Vet Res 2026）')
B(story, '10隻接受化療的多中心淋巴瘤犬（B細胞9隻、T細胞1隻），於首診與後續回診採血追蹤')
B(story, '10/10 隻犬達到完全緩解（CR）時，Cancer Dx 結果轉為陰性；其中8隻於CHOP第5週前轉陰，2隻延遲至第6-7週')
B(story, '7隻犬於研究期間確診復發，其中5隻在復發／疾病惡化當下 Cancer Dx 為陽性；3隻未復發者則持續維持陰性')
star_box(story, [
    'Cancer Dx 有潛力用於治療反應監測與早期復發偵測，可作為理學檢查與傳統影像追蹤之外的輔助工具，但仍為觀察性研究結果，需更大規模驗證。'
], title='監測應用意義')

story.append(PageBreak())

# ---- 八、臨床應用重點整理 ----
section(story, '八、臨床應用重點整理')
star_box(story, [
    '早期偵測仍是最大缺口：人類非何杰金氏淋巴瘤約35%於Stage 1-2確診，犬僅約10%或更低——多數犬淋巴瘤發現時已是Stage 3-5。',
    '次分期（substage a/b）與存活期高度相關，問診與理學檢查時應主動評估全身性症狀。',
    '免疫分型（B vs T）會實質影響預後預測與藥物選擇，有條件時建議盡量取得分型資訊。',
    '高血鈣、雙/全血球減少等血檢異常，應主動聯想淋巴瘤與骨髓侵犯的可能性。',
    'IDEXX Cancer Dx 定位為篩檢／輔助診斷／治療監測工具，非取代傳統細胞學、切片、PARR、流式細胞儀等確診工具；陰性結果不能排除淋巴瘤。',
    '高風險犬（≥7歲，或高風險品種≥4歲）可考慮於年度健檢中納入 Cancer Dx 篩檢，作為早期發現的輔助手段。'
], title='本次研討會核心結論')

B(story, '本筆記為研討會投影片之整理，實際用藥劑量、適應症與禁忌症請以藥品仿單及主治醫師臨床判斷為準。')

# ================= 產生 PDF =================
doc = SimpleDocTemplate(OUTPUT_PATH, pagesize=A4,
    leftMargin=1.8 * cm, rightMargin=1.8 * cm,
    topMargin=2 * cm, bottomMargin=2.2 * cm,
    title='犬淋巴瘤 Updates and Current Trends - 完整筆記')

doc.build(story, onFirstPage=add_footer, onLaterPages=add_footer)
print(f"已產生：{OUTPUT_PATH}")
