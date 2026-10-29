# -*- coding: utf-8 -*-
import re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from kaogu_data import *

ROOT = '/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群/DVM-note/大四上/豬病學'
os.chdir(ROOT)
TPL = open('期中總複習.html', encoding='utf-8').read()

# ---------- 1. 從各週頁撈出既有考古卡片 ----------
EXIST = {}
for f in ['week01_課程介紹與養豬產業.html', W2, W3, W6, W7]:
    s = open(f, encoding='utf-8').read()
    for m in re.finditer(r'(      <div class="quiz-item exam-card">.*?\n      </div>)\n', s, re.S):
        b = m.group(1)
        lab = re.search(r'<span class="quiz-type[^"]*">([^<]*)</span>', b).group(1)
        b = b.replace('href="#section-', f'href="{f}#section-')
        EXIST[lab] = (b, f)

def fig(img, cap):
    return (f'<div class="figure" style="margin:8px 0"><img src="img/期中考古/{img}.jpg" alt="{cap}" loading="lazy" '
            f'style="max-width:440px;width:100%"><div class="figure-caption">{cap}</div></div>')

def reuse(oldlab, newlab, img=None, cap=None):
    b, f = EXIST[oldlab]
    b = re.sub(r'(<span class="quiz-type[^"]*">)[^<]*(</span>)', lambda m: m.group(1) + newlab + m.group(2), b, count=1)
    if img:
        b = re.sub(r'(<div class="quiz-q">.*?</div>)', lambda m: m.group(1) + '\n        ' + fig(img, cap), b, count=1, flags=re.S)
    anc = '#section-kaogu' if 'id="section-kaogu"' in open(f, encoding='utf-8').read() else ''
    note = f'<p class="quiz-explain" style="margin-top:6px;font-size:.85em;color:var(--fg-muted)">本題詳解與 <a href="{f}{anc}">{f.split("_")[0].replace("week0","第 ")} 週頁面</a>相同。</p>'
    b = b.replace('        </details>', '          ' + note + '\n        </details>', 1)
    return b

def card(newlab, q, opts, ans, exp, img=None, cap=None, kind='mcq'):
    letters = 'ABCDE'
    h = [f'      <div class="quiz-item exam-card">', f'        <span class="quiz-type quiz-type-{kind}">{newlab}</span>',
         f'        <div class="quiz-q">{q}</div>']
    if img: h.append('        ' + fig(img, cap))
    if opts:
        h.append('        <ul class="quiz-options">')
        for i, o in enumerate(opts): h.append(f'          <li>({letters[i]}) {o}</li>')
        h.append('        </ul>')
    h.append('        <details class="quiz-reveal">\n          <summary></summary>')
    if ans is not None:
        h.append(f'          <div class="quiz-answer correct">答案：({ans})</div>' if not ans.startswith('⚠') else f'          <div class="quiz-answer">答案：{ans}</div>')
    h.append(f'          <div class="quiz-explain">{exp}</div>' if exp.lstrip().startswith('<p') or '<ol' in exp or '<ul' in exp else f'          <p class="quiz-explain">{exp}</p>')
    h.append('        </details>\n      </div>')
    return '\n'.join(h)

def new(d, n, lab):
    t = d[n]
    q, opts, ans, exp = t[:4]
    img, cap = (t[4], t[5]) if len(t) > 4 else (None, None)
    return card(lab, q, opts, ans, exp, img, cap)

def essay(lab, q, ans_html):
    return card(lab, q, None, None, ans_html, kind='saq')

def photos(names, n_label):
    imgs = ''.join(f'<img src="img/期中考古/{x}.jpg" alt="原卷照片" loading="lazy" style="width:100%;max-width:820px;display:block;margin:10px auto;border:1px solid var(--line,#ddd)">' for x in names)
    return (f'<details class="exam-photos" style="margin:10px 0 16px"><summary style="cursor:pointer;font-weight:700">原卷照片（{n_label}，姓名與學號已遮蓋）</summary>{imgs}</details>')

def table(head, rows):
    h = '<div class="table-wrap"><table><thead><tr>' + ''.join(f'<th>{x}</th>' for x in head) + '</tr></thead><tbody>'
    for r in rows: h += '<tr>' + ''.join(f'<td>{x}</td>' for x in r) + '</tr>'
    return h + '</tbody></table></div>'

def alert(kind, label, body):
    return f'<div class="alert alert-{kind}"><div class="alert-label">{label}</div><p>{body}</p></div>'

SECTIONS = []
def section(sid, name, title, desc, body, src):
    SECTIONS.append((sid, name, title, desc, body, src))

# ---------- 2. 各節內容 ----------
ov = []
ov.append(alert('warn', '先看這裡', '本頁的答案<strong>都不是官方答案</strong>：來源是考卷上的圈選、學長姐的檢討與手寫答案，沒有標記的題目由本站依講義推得。每題詳解開頭都寫了答案來源；有疑問的標「⚠ 待確認」，彙整在<a href="#section-trust">第 9 節</a>。'))
ov.append('<h3>五場考試一覽</h3>')
ov.append(table(['場次', '老師', '題型與配分', '答案來源', '本頁'], [
    ['106 學年（2017）', '葉光勝（細菌）', '單選 30 題 × 2 分＋問答 4 題 × 10 分', '老師檢討投影片（紅字）＋學長姐檢討', '<a href="#section-ye106">第 5 節</a>'],
    ['合卷（年份未標）', '鄭益謙（病毒）＋葉光勝', 'Part A 問答 5 題 × 8 分；Part B 選擇 20 題 × 2 分＋問答（原卷寫 5 題 × 5 分，照片只有 4 題）', '考卷旁手寫答案；葉老師選擇題另有學長姐整理，兩者一致', '<a href="#section-zessay">第 4 節</a>、<a href="#section-yehj">第 6 節</a>'],
    ['2019（108 學年）', '鄭益謙', '複選 20 題 × 3 分（含誤選無分）＋問答 2 題 × 20 分＋加分題 20 分', '考卷藍筆圈選（已放大逐題核對）', '<a href="#section-z2019">第 2 節</a>'],
    ['2022（111 學年）', '鄭益謙', '同 2019（題目同一組，7 題題幹正反對調）', '照片沒有作答記號，答案由 2019 圈選反推', '<a href="#section-z2022">第 3 節</a>'],
    ['2022（111 學年）', '葉光勝', '單選 25 題 × 3 分＋問答 3 題（10＋10＋5 分）', '照片上零星批改記號＋本站推得', '<a href="#section-ye111">第 7 節</a>'],
]))
ov.append('<h3>出題特色（依考古推測）</h3><ul>'
 '<li><strong>鄭益謙（過去的病毒老師）</strong>：複選題，含誤選就沒分。<strong>2019 與 2022 用同一組 20 題，只把其中 7 題的題幹正反對調</strong>（「正確」改「不正確」），問答題兩年完全相同。問答反覆圍繞五個題目：口蹄疫、豬瘟基因結構與 DIVA、造成流產的病毒＋三種診斷原理、流感 mixing vessel、TGE 為何減少。</li>'
 '<li><strong>現在的病毒老師</strong>是張家宜、高啓霏，鄭老師的題目只能當題型與重點參考。學長姐 2023 年筆記：張家宜老師「考得簡單，把畫底線的地方看一看，都考最特別的地方」。</li>'
 '<li><strong>葉光勝（細菌）</strong>：單選題，題幹多是「臨床情境＋剖檢＋培養特性」再附照片。<strong>111 學年大量沿用 106 學年</strong>（李崇道、沙門氏菌錯誤敘述、3 日齡血便梭菌、萎縮性鼻炎、布氏桿菌、水腫病、Weil、在養頭數）。問答常客：APP 致病機制、大腸桿菌新生仔豬下痢、台灣養豬產業問題。</li>'
 '<li><strong>範圍</strong>：考古細菌題有不少是期末範圍（梭菌、螺旋體、黴漿菌、鉤端螺旋體、營養缺乏、胃潰瘍、行為），卡片上標 <span class="lv lv-skim">範圍外（期末）</span>，期中可以先略過。</li></ul>')
ov.append('<div class="lv-legend"><span><span class="lv lv-skim">範圍外（期末）</span>不在本次期中範圍</span><span><strong style="color:var(--amber-700)">⚠ 待確認</strong>答案有疑問</span></div>')
ov.append(alert('info', '怎麼用', '每題先自己作答，再點開看答案與詳解。題號、題型（單選／複選／問答）與配分照原卷；附圖題附上原卷照片裁切。重複出現的考點整理在<a href="#section-repeat">第 8 節</a>。各週頁面的「期中考古題」節保留不動，兩邊的詳解相同。'))
section('abstract', '總覽與出題特色', '總覽與出題特色', '五場期中考的題型、配分、答案來源，以及從考古看得出的出題習慣。', '\n'.join(ov), '整理自使用者提供的豬病學期中考古。')

# 2019 鄭益謙
z = []
z.append(table(['大題', '題型', '配分'], [['一', '複選 20 題（a–e），若未全部答對且不含誤選，依答對比例給分；含誤選無分', '60 分'], ['二', '問答 2 題', '40 分'], ['加分', '自由選答 1 題', '20 分']]))
z.append(photos(['y2019_p1', 'y2019_p2'], '2 張'))
z.append(alert('warn', '注意', '題幹有的問「正確」、有的問「不正確／錯誤／為非」，每題卡片上都標出來了。第 2 週頁面曾把 Q1 的答案看錯，這次全部重新放大原卷核對過。'))
OLD19 = {1: '2019 期中 Q1（複選，問「不正確」）', 2: '2019 期中 Q2（複選，問「正確」）', 3: '2019 期中 Q3（複選，問「正確」）', 4: '2019 期中 Q4（複選，問「錯誤」）',
         6: '2019 期中 Q6（複選）', 7: '2019 期中 Q7（複選）', 15: '2019 期中 Q15（複選）', 18: '2019 期中 Q18（複選，問「正確」）'}
POL19 = {1: '不正確', 2: '正確', 3: '正確', 4: '錯誤', 5: '為非', 6: '正確', 7: '排毒途徑', 8: '正確', 9: '臨床症狀', 10: '正確', 11: '正確', 12: '正確', 13: '敘述', 14: '正確', 15: '錯誤', 16: '為誤', 17: '正確', 18: '正確', 19: '尚未清除', 20: '正確'}
for n in range(1, 21):
    lab = f'2019 Q{n}（複選，問「{POL19[n]}」）' if POL19[n] in ('正確','不正確','錯誤','為非','為誤') else f'2019 Q{n}（複選）'
    z.append(reuse(OLD19[n], lab) if n in OLD19 else new(Z2019, n, lab))
section('z2019', '鄭益謙 2019 複選', '鄭益謙老師 2019（108 學年）複選題', '當時病毒由鄭益謙老師授課。答案依考卷藍筆圈選，已放大原卷逐題核對。', '\n'.join(z), '使用者提供的 2019 豬病學期中考（鄭益謙老師授課部分），考卷藍筆圈選；詳解依本站各週筆記。')

# 2022 鄭益謙 對照
rows = [
 (1, '不正確', '正確', 'B、D', 'A、C、E'), (2, '正確', '正確', 'A、D', 'A、D'), (3, '正確', '<strong>不正確</strong>', 'B、C、D', '<strong>A</strong>'),
 (4, '錯誤', '<strong>為真</strong>', 'C、D', 'A、B、E'), (5, '為非', '為非', 'C', 'C'), (6, '正確', '正確', 'A、B、C', 'A、B、C'), (7, '排毒途徑', '排毒途徑', 'A、B、C、D', 'A、B、C、D'),
 (8, '正確', '正確', 'C、D、E', 'C、D、E'), (9, '臨床症狀', '臨床症狀', 'A、B、D、E', 'A、B、D、E'), (10, '正確', '正確', 'A、B、D', 'A、B、D'), (11, '正確', '正確', 'B、C、D', 'B、C、D'),
 (12, '正確', '正確（(c) 改成「OIE listed」）', 'A、E', 'A、E'), (13, '敘述', '敘述', 'A、B、D', 'A、B、D'), (14, '正確', '<strong>錯誤</strong>', 'B、C、E', 'A、D'),
 (15, '錯誤', '<strong>正確</strong>', 'E', 'A、B、C、D'), (16, '為誤', '為誤', '⚠ 無記號', '⚠ 同左'), (17, '正確', '<strong>不正確</strong>', 'C、D、E', 'A、B'),
 (18, '敘述', '敘述', 'A、C、D', 'A、C、D'), (19, '尚未清除', '尚未清除', 'B、C、D', 'C、D？（見下）'), (20, '正確', '<strong>不正確</strong>（多一個 (e) Halothane 試驗）', 'A、C', 'B、D'),
]
z2 = []
z2.append(alert('warn', '重點', '2022 年的 20 題是 <strong>2019 年同一組題目</strong>，只把題幹的「正確／不正確」對調，問答題與加分題也完全相同。所以背題目要背「每個敘述本身是對還是錯」，不要背答案字母。'))
z2.append(photos(['y2022v_p1', 'y2022v_p2'], '2 張'))
z2.append(table(['題號', '2019 題幹問', '2022 題幹問', '2019 答案（考卷圈選）', '2022 答案（反推）'], [[f'Q{a}', b, c, d, e] for a, b, c, d, e in rows]))
z2.append(alert('info', '兩卷互相印證', '2019 Q3 的 (a)「Stamping out without vaccination 有助於迅速成為 free status」考卷沒有圈，原本不確定原因；2022 年把題幹改成「何者<strong>不</strong>正確」，學生把「不」圈起來，答案只剩 (a)。兩年一起看，(a) 被出題者當成錯誤敘述。'))
z2.append(alert('warn', '時間點', 'Q19「目前尚未清除」：台澎馬 2020 年 6 月已獲 WOAH 認定為不施打疫苗口蹄疫非疫區（第 4 週），所以 2022 年 (b) 口蹄疫可能已經不算「尚未清除」；題目寫「台、澎、金、馬」，金門的狀態講義沒有寫 ⚠ 待確認。Q8 (a)「台灣本島仍為疫區」在 2022 年同樣是錯的。'))
z2.append(alert('info', 'Q20 新增的 (e)', '「曾運用 Halothane Challenge Test 檢測表型」是正確敘述（補充；學長姐筆記也寫 PSS 用 halothane 試驗），所以「不正確」的仍是 (b)(d)。'))
section('z2022', '鄭益謙 2022 對照', '鄭益謙老師 2022（111 學年）：與 2019 對照', '照片上沒有作答記號，答案由 2019 年圈選依題幹正反反推。', '\n'.join(z2), '使用者提供的 2022 豬病學期中考（鄭益謙老師授課部分）照片。')

# 鄭益謙 問答
ze = []
ze.append(table(['題目', '合卷 Part A', '2019', '2022'], [
    ['口蹄疫：病原、流行病學／傳播、致病機制、症狀', 'Q1（8 分）', '—', '—'],
    ['豬瘟基因結構 → 新型疫苗與 DIVA 診斷構想', 'Q2（8 分）', '（複選 Q3 同概念）', '（複選 Q3）'],
    ['造成流產的病毒 ≥2 種＋實驗室診斷 ≥3 種（含原理）', 'Q3（8 分）', '二-1（20 分）', '二-1（20 分）'],
    ['豬是流感 mixing vessel：病毒結構＋流行病學', 'Q4（8 分）', '（複選 Q14）', '（複選 Q14）'],
    ['TGE 危害下降的原因與機制', 'Q5（8 分）', '二-2（20 分）', '二-2（20 分）'],
    ['加分題：日本 2018 CSF，FAT 與 RT-PCR 結果歧異', '—', '加分（20 分）', '加分（20 分）'],
]))
ze.append(photos(['hj_p1'], '合卷第 1 頁'))
ze.append(reuse('問答｜合卷 Part A Q1', '問答｜合卷 Part A Q1（8 分）'))
ze.append(reuse('問答｜合卷 Part A Q2', '問答｜合卷 Part A Q2（8 分）'))
ze.append(reuse('問答｜2019 期中 二-1', '問答｜合卷 Part A Q3（8 分）＝ 2019、2022 二-1（20 分）'))
ze.append(reuse('問答｜合卷 Part A Q4', '問答｜合卷 Part A Q4（8 分）'))
ze.append(essay('問答｜合卷 Part A Q5（8 分）＝ 2019、2022 二-2（20 分）', *ESSAY_TGE))
ze.append(essay('加分題｜2019、2022（20 分）', *ESSAY_CSF_BONUS))
section('zessay', '鄭益謙 問答題', '鄭益謙老師問答題（合卷、2019、2022）', '五個主題反覆出，2019 與 2022 的問答完全相同。', '\n'.join(ze), '使用者提供的期中考古（合卷 Part A、2019、2022）；答案骨架整理自學長姐答案與本站第 2–5 週筆記。')

# 葉光勝 106
y = []
y.append(table(['大題', '題型', '配分'], [['一', '單選 30 題', '每題 2 分，共 60 分'], ['二', '問答 4 題', '每題 10 分，共 40 分']]))
y.append(photos(['y106_p1', 'y106_p2', 'y106_p3', 'y106_p4', 'y106_p5'], '5 張，翻拍上課檢討投影片'))
y.append(alert('warn', '照片限制', '原卷照片是翻拍投影幕，Q20 與 Q27 的題幹沒拍到，依學長姐檢討整理。'))
IMG106 = {11: ('q106_11', '原卷附圖'), 13: ('q106_13', '原卷附圖')}
for n in range(1, 31):
    lab = f'106 學年 Q{n}（單選）'
    old = f'106 學年期中 Q{n}'
    if old in EXIST:
        y.append(reuse(old, lab, *IMG106.get(n, (None, None))))
    else:
        y.append(new(Y106, n, lab))
y.append('<h3>問答題</h3>')
y.append(essay('問答｜106 學年 Q1（10 分）＝ 111 學年 Q1', *ESSAY_INDUSTRY))
y.append(reuse('問答｜106 學年 Q2、合卷 Q4', '問答｜106 學年 Q2（10 分）＝ 合卷 Part B Q4'))
y.append(essay('問答｜106 學年 Q3（10 分）', *ESSAY_MPS))
y.append(reuse('問答｜106 學年 Q4、合卷 Q1', '問答｜106 學年 Q4（10 分）＝ 合卷 Part B Q1'))
section('ye106', '葉光勝 106 學年', '葉光勝老師 106 學年（2017）', '單選 30 題＋問答 4 題。答案依老師檢討投影片與學長姐檢討。', '\n'.join(y), '使用者提供的 106 學年豬病學期中考照片與學長姐檢討（考古融合檔）。')

# 葉光勝 合卷 Part B
h = []
h.append(table(['大題', '題型', '配分'], [['選擇', '單選 20 題', '每題 2 分，共 40 分'], ['問答', '原卷寫 5 題 × 5 分，照片只有 4 題', '20 分']]))
h.append(photos(['hj_p2', 'hj_p3', 'hj_p4'], '3 張'))
for n in range(1, 21):
    lab = f'合卷 Part B Q{n}（單選）'
    old = f'合卷 Part B Q{n}'
    h.append(reuse(old, lab) if old in EXIST else new(HJ, n, lab))
h.append('<h3>問答題</h3>')
h.append(reuse('問答｜106 學年 Q4、合卷 Q1', '問答｜合卷 Part B Q1（5 分）＝ 106 學年 Q4'))
h.append(essay('問答｜合卷 Part B Q2（5 分）', *ESSAY_ULCER))
h.append(essay('問答｜合卷 Part B Q3（5 分）', *ESSAY_BEHAVIOR))
h.append(reuse('問答｜106 學年 Q2、合卷 Q4', '問答｜合卷 Part B Q4（5 分）＝ 106 學年 Q2'))
section('yehj', '葉光勝 合卷', '葉光勝老師 合卷 Part B（年份未標）', '和鄭益謙老師 Part A 印在同一份考卷。答案依考卷旁手寫答案。', '\n'.join(h), '使用者提供的考古融合檔與 lo/豬病期中考古整理.pdf（同一份考卷）。')

# 葉光勝 111
y1 = []
y1.append(table(['大題', '題型', '配分'], [['I', '單選 25 題', '每題 3 分，共 75 分'], ['II', '問答 3 題', '10＋10＋5 分，共 25 分']]))
y1.append(photos(['y2022b_p1', 'y2022b_p2', 'y2022b_p3', 'y2022b_p4', 'y2022b_p5', 'y2022b_p6'], '6 張'))
IMG111 = {1: ('q111_01', '原卷附圖'), 7: ('q111_07', '原卷附圖'), 8: ('q111_08', '原卷附圖：胸腔與腹腔臟器表面有黃白色纖維素性滲出物'),
          11: ('q111_11', '原卷附圖'), 14: ('q111_14', '原卷附圖：Panel A 耳朵發紺、Panel B 脾腫大、Panel C 肝臟壞死點與副傷寒小結節'),
          15: ('q111_15', '原卷附圖：鼻甲骨剖面'), 24: ('q111_24', '原卷附圖：眼瞼水腫')}
for n in range(1, 26):
    lab = f'111 學年 Q{n}（單選）'
    old = f'111 學年期中 Q{n}'
    if old in EXIST:
        y1.append(reuse(old, lab, *IMG111.get(n, (None, None))))
    else:
        y1.append(new(Y111, n, lab))
y1.append('<h3>問答題</h3>')
y1.append(essay('問答｜111 學年 Q1（10 分）＝ 106 學年 Q1', *ESSAY_INDUSTRY))
y1.append(reuse('問答｜111 學年 Q2', '問答｜111 學年 Q2（10 分）'))
y1.append(reuse('問答｜111 學年 Q3', '問答｜111 學年 Q3（5 分）'))
section('ye111', '葉光勝 111 學年', '葉光勝老師 111 學年（2022）', '單選 25 題＋問答 3 題。沒有批改記號的題目，答案由本站依講義推得。', '\n'.join(y1), '使用者提供的 111 學年豬病學期中考照片。')

# 重複考點
rep = table(['考點', '出現的題目', '本站對應'], [
 ['APP 致病機制（問答）', '106 問答 2、合卷 B 問答 4、111 問答 3（畫肺）', L(W6, 'app-path', '第 6 週 APP')],
 ['APP 臨床情境（CAMP 陽性、chocolate agar、Apx 分型）', '106 Q2、Q25；合卷 Q5；111 Q2、Q16', L(W6, 'app-dx', '第 6 週 APP')],
 ['大腸桿菌新生仔豬下痢（問答）', '106 問答 4、合卷 B 問答 1、111 問答 2', L(W6, 'ec-neo', '第 6 週大腸桿菌')],
 ['水腫病、離乳後下痢', '106 Q20、Q24；合卷 Q15、Q19；111 Q13、Q19、Q24', L(W6, 'ec-pwd', '第 6 週')],
 ['大腸桿菌尿道感染 P fimbriae', '106 Q28、111 Q17', L(W6, 'ec-other', '第 6 週')],
 ['萎縮性鼻炎（<em>B. bronchiseptica</em>＋<em>P. multocida</em>）', '106 Q6、Q13；合卷 Q10；111 Q9、Q15', L(W6, 'ar-agent', '第 6 週')],
 ['Glässer disease（<em>H. parasuis</em>）', '106 Q12；合卷 Q11；111 Q8', L(W6, 'gp-agent', '第 6 週')],
 ['豬丹毒（菱形疹、penicillin、fish handler）', '106 Q7、Q11；合卷 Q1；111 Q3、Q7、Q23', L(W7, 'se-agent', '第 7 週')],
 ['沙門氏菌（錯誤敘述、紅耳朵、T3SS、副傷寒小結節）', '106 Q4、Q9、Q30；合卷 Q2、Q12；111 Q5、Q14', L(W7, 'sal-agent', '第 7 週')],
 ['滲出性表皮炎', '106 Q8；合卷 Q3、Q17；111 Q11', L(W7, 'ee', '第 7 週')],
 ['布氏桿菌', '106 Q14、Q22；合卷 Q20；111 Q10', L(W7, 'br', '第 7 週')],
 ['李崇道與 LPC 疫苗、在養頭數、品種', '106 Q1、Q3、Q29；111 Q1、Q4、Q12、Q18', L(W1, 'history', '第 1 週')],
 ['初乳吸收與懷孕期', '106 Q10；合卷 Q20；2019 Q15', L(W1, 'life', '第 1 週')],
 ['台灣養豬產業問題（問答）', '106 問答 1、111 問答 1', L(W1, 'industry', '第 1 週')],
 ['豬瘟：流行病學、DIVA、E2 次單位＋Erns', '合卷 A2；2019／2022 Q1–Q3、Q14', L(W2, 'csf-c', '第 2 週')],
 ['流產病毒＋三種診斷原理（問答）', '合卷 A3；2019、2022 二-1', L(W3, 'kaogu', '第 3 週')],
 ['口蹄疫、豬水疱病、SVV', '合卷 A1；2019／2022 Q8–Q10、Q19', L(W4, 'fmd-a', '第 4 週')],
 ['流感 mixing vessel', '合卷 A4；2019／2022 Q11、Q14', L(W5F, 'mixing', '第 5 週豬流感')],
 ['TGE 與 PRCV（問答）', '合卷 A5；2019、2022 二-2', L(W5C, 'tge-a', '第 5 週')],
 ['<span class="lv lv-skim">範圍外</span> 梭菌', '106 Q5、Q19；合卷 Q4、Q18；111 Q6、Q20、Q22', '期末'],
 ['<span class="lv lv-skim">範圍外</span> 鉤端螺旋體', '106 Q18；合卷 Q13；111 Q21、Q25', '期末'],
 ['<span class="lv lv-skim">範圍外</span> 豬赤痢、增生性腸病', '106 Q15、Q17、Q21、Q23；合卷 Q7、Q8', '期末'],
])
section('repeat', '重複考點表', '重複考點表', '同一個考點在不同年份出現的位置。出現越多次，越要熟。', rep, '整理自本頁各卷。')

# 可信度
tr = '<ul>' \
 '<li><strong>答案來源</strong>：2019 鄭益謙＝考卷藍筆圈選；2022 鄭益謙＝由 2019 反推；106 學年＝老師檢討投影片紅字與學長姐檢討；合卷＝考卷旁手寫答案；111 學年葉光勝＝考卷零星批改記號，其餘由本站推得。都不是官方答案。</li>' \
 '<li><strong>⚠ 待確認</strong>：' \
 '<ul><li>2019 Q9 (c)「naïve 哺乳仔豬發高燒，24–48 小時內死亡」考卷沒圈，原因不明。</li>' \
 '<li>2019 Q16 Nipah：考卷沒有作答記號；依常識四個敘述都對，會選 (E)。範圍外。</li>' \
 '<li>2019／2022 Q19 (b) 口蹄疫：答案會隨出題年份改變（2020 年台澎馬成為非疫區），金門狀態講義未寫。</li>' \
 '<li>2019 Q20 (b) ryanodine receptor：考卷紅筆打叉，推測錯在「細胞膜」（應為肌漿網）。範圍外。</li>' \
 '<li>2019 Q3 (a) stamping out：2022 年題幹改問「不正確」時，(a) 是唯一答案，兩卷互相印證；但講義沒有說明為什麼算錯，可以問老師。</li></ul></li>' \
 '<li><strong>照片限制</strong>：106 學年是翻拍投影幕，Q20、Q27 題幹沒拍到；合卷葉老師問答原卷寫 5 題，照片只有 4 題。</li>' \
 '<li><strong>合卷的年份</strong>：考卷上沒有年份；同學整理檔建立於 2021 年以前。</li>' \
 '<li><strong>來源檔案</strong>：<code>NTU/考古+國考/大四上考古 from 林/期中/豬/</code>（考古融合 PDF、2022 PDF、lo 資料夾為同一批考卷的另一份）。學長姐 2023 年的張家宜老師講義筆記不是考卷，本頁沒有收。</li></ul>'
section('trust', '資料可信度', '資料可信度與待確認', '答案從哪裡來、哪些題目還有疑問。', tr, '本節為個人整理。')

# ---------- 3. 組頁面 ----------
head_end = TPL.index('<section class="pagehead">')
script_start = TPL.index('<script>\nfunction showSection')
page_head = TPL[:head_end].replace('<title>豬病學期中總複習 - yc._vetalk</title>', '<title>豬病學：期中考古 - yc._vetalk</title>')
pagehead = '''<section class="pagehead">
  <div class="pagehead__inner">
    <div class="breadcrumb">
      <a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="index.html">豬病學</a><span class="sep">›</span><span class="current">期中考古</span>
    </div>
    <div class="page-head">
      <h1 class="page-title">豬病學期中考古</h1>
      <p class="page-subtitle">Past Midterm Exams · 鄭益謙（2019、2022、合卷）與葉光勝（106、111 學年、合卷）原卷題型＋詳解</p>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">豬病學（大四上・期中考）</div></div>
      <div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">學長姐流傳的考卷照片與檢討；答案非官方</div></div>
      <div class="meta-item"><div class="meta-label">最後更新</div><div class="meta-value">__DATE__</div></div>
      <div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">五場考試全數整理</div></div>
    </div>
  </div>
</section>
'''
ICONS = {'abstract': '⭐', 'z2019': '🧬', 'z2022': '🔁', 'zessay': '✍️', 'ye106': '🦠', 'yehj': '📄', 'ye111': '🦠', 'repeat': '📊', 'trust': '🔎'}
GROUPS = {'abstract': '總覽', 'z2019': '鄭益謙（病毒）', 'ye106': '葉光勝（細菌）', 'repeat': '整理'}
toc = ['<div class="pagewrap">', '  <nav class="toc">']
for i, (sid, name, *_ ) in enumerate(SECTIONS):
    if sid in GROUPS:
        mt = ' style="margin-top:8px;"' if i else ''
        toc.append(f'    <div class="section-label"{mt}>{GROUPS[sid]}</div>')
    act = ' class="active"' if i == 0 else ''
    toc.append(f'    <a{act} onclick="showSection(\'{sid}\')" id="nav-{sid}">\n      <span class="nav-icon">{ICONS[sid]}</span> {name}\n    </a>')
toc.append('  </nav>\n\n  <main class="pagebody" id="mainContent">\n')
body = []
for i, (sid, name, title, desc, content, src) in enumerate(SECTIONS):
    body.append(f'    <div class="section" id="section-{sid}">\n      <div class="section-head"><div class="section-num">{i+1}</div><h2>{title}</h2></div>\n'
                f'      <p class="section-desc">{desc}</p>\n{content}\n      <footer class="note-footer">資料來源：{src}</footer>\n    </div>\n')
body.append('    <footer class="note-footer">本頁為個人課堂筆記整理，僅供學習與複習使用，不作為正式診斷依據。</footer>\n  </main>\n</div>\n\n')
script = TPL[script_start:]
names = ',\n'.join(f"  '{sid}': '{name}'" for sid, name, *_ in SECTIONS)
script = re.sub(r'const SECTION_NAMES = \{.*?\};', 'const SECTION_NAMES = {\n' + names + '\n};', script, flags=re.S)
import subprocess
date = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
FLU = open('week05_豬流行性感冒.html', encoding='utf-8').read()
_css = re.search(r'<style>.*?</style>', FLU, re.S).group(0)
_panel = FLU[FLU.index('<div id="pdfPanel"'):]
_panel = _panel[:_panel.index('</script>') + len('</script>')]
page_head = page_head.replace('</head>', _css + '\n</head>', 1)
html = page_head + pagehead.replace('__DATE__', date) + '\n' + '\n'.join(toc) + '\n'.join(body) + script.replace('<script src="../../assets/nav-data.js">', _panel + '\n<script src="../../assets/nav-data.js">', 1)
open('期中考古.html', 'w', encoding='utf-8').write(html)
print('cards', html.count('class="quiz-item exam-card"'), 'reused', html.count('週頁面</a>相同'), 'len', len(html))
