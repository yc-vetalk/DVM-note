"""下載考選部試卷（題目 Q、答案 S、更正 M）並產生 md，放到 國考專區/考科/<考科>/。
用法（在 repo 根目錄）：python3 讀書筆記/scripts/exam_scraper/fetch_subject.py <起始民國年> <結束民國年> <考科> [<考科> ...]
例：python3 讀書筆記/scripts/exam_scraper/fetch_subject.py 111 115 獸醫病理學 獸醫藥理學
資料來源 workdir/rows_all.json（q.py 抓的清單，只含獸醫師類科）。
輸出：原始試卷/<code>.pdf（題目）、<code>_答案.pdf、<code>_更正.pdf；試卷/<民國年>-<次>.md
md 規則：含圖題（題幹有「如圖」等字，或選項缺漏，或該頁有嵌入圖片）一律標「⚠ 本題含圖，請對照原卷第 N 頁」，讀題時務必回原卷看圖。
"""
import json, os, re, sys, subprocess, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import paths, parse as P, answers as A, pymupdf
y0, y1, subjects = int(sys.argv[1]), int(sys.argv[2]), sys.argv[3:]
BASE = 'https://wwwq.moex.gov.tw/exam/'
rows = json.load(open(os.path.join(HERE, 'workdir/rows_all.json')))
def norm(t):
    o = []
    for ch in t:
        c = ord(ch)
        if 0x2e80 <= c <= 0x2fdf or 0xf900 <= c <= 0xfaff: ch = unicodedata.normalize('NFKC', ch)
        elif ch == '﹖': ch = '？'
        elif 0x0700 <= c < 0x1000: ch = '□'
        o.append(ch)
    return ''.join(o)
def fetch(link, dest):
    if os.path.exists(dest) and os.path.getsize(dest) > 1000: return True
    subprocess.run(['curl', '-sL', '-A', 'Mozilla/5.0', '-o', dest, BASE + link], check=True)
    ok = os.path.exists(dest) and open(dest, 'rb').read(4) == b'%PDF'
    if not ok and os.path.exists(dest): os.remove(dest)
    return ok
def seq_answers(f):
    """新版答案 PDF（115 年前後）：標準答案以全形字母依題號順序直排（每欄 20 題），備註在「備　　註」之後。"""
    try: t = pymupdf.open(f)[0].get_text()
    except Exception: return None, None
    i = t.find('標準答案')
    head, _, tail = t[i:].partition('備')
    letters = re.findall(r'[ＡＢＣＤ＃#]', head)
    if len(letters) < 20: return None, None
    tr = {'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', '＃': '#'}
    ans = {k + 1: tr.get(c, c) for k, c in enumerate(letters)}
    note = ''
    m = re.search(r'註[：:]\s*(.*?)題號', tail, re.S)
    if m: note = re.sub(r'\s+', ' ', m.group(1)).strip()
    return ans, note
for subj in subjects:
    sdir = paths.subject_papers(subj); rdir = paths.subject_raw(subj)
    os.makedirs(sdir, exist_ok=True); os.makedirs(rdir, exist_ok=True)
    seen = set()
    for exam, cat, name, links in rows:
        if name != subj: continue
        m = re.match(r'(\d+)年第(.)次', exam)
        if not m or not (y0 <= int(m.group(1)) <= y1): continue
        qlink = next(l for l in links if 't=Q' in l); code = re.search(r'code=(\d+)', qlink).group(1)
        if code in seen: continue
        seen.add(code)
        pdf = os.path.join(rdir, code + '.pdf')
        assert fetch(qlink, pdf), 'download fail ' + qlink
        slink = next((l for l in links if 't=S' in l), None); mlink = next((l for l in links if 't=M' in l), None)
        apdf = os.path.join(rdir, code + '_答案.pdf'); ans = note = None
        if slink and fetch(slink, apdf):
            ans, note = seq_answers(apdf)
            if not ans:
                A.SUBJ = subj
                try: ans, note = A.get(apdf)
                except Exception as e: print(code, 'answers ERR', e)
        if mlink: fetch(mlink, os.path.join(rdir, code + '_更正.pdf'))
        qs = P.parse(pdf); doc = pymupdf.open(pdf)
        pages = [re.sub(r'\s', '', p.get_text()) for p in doc]
        imgpg = [len(p.get_images()) > 0 for p in doc]
        yr = int(m.group(1)); batch = {'一': '1', '二': '2'}.get(m.group(2), m.group(2))
        t = f"# 民國 {yr} 年第{m.group(2)}次專技高考・獸醫師・{subj}\n\n- 考試：{exam}\n- 題數：{len(qs)}（單選）\n- 官方答案：{'有' if ans else '尚未取得'}\n"
        note = (note or '').replace('備註:', '').strip()
        if note and '無更正' not in note: t += f"- 答案更正備註：{note}\n"
        if mlink and os.path.exists(os.path.join(rdir, code + '_更正.pdf')):
            mt = re.sub(r'\s+', ' ', ''.join(p.get_text() for p in pymupdf.open(os.path.join(rdir, code + '_更正.pdf'))))
            t += f"- 另有試題更正公告（`{paths.raw_pdf_hint(code, subj).replace('.pdf', '_更正.pdf')}`，**答案為一律給分或更正的題以此為準**）：{mt[:600]}\n"
        t += "\n---\n\n"
        nfig = 0
        for q in qs:
            q['q'] = norm(q['q']); q['opts'] = {k: norm(v) for k, v in q['opts'].items()}
            a = (ans or {}).get(q['n']) or q.get('ans') or ''
            flags = []
            if re.search(r'如圖|下圖|圖中|圖片|照片|附圖|圖\s*[一二三四五六七八九十\d]|如表|下表|表中', q['q']): flags.append('含圖')
            if len(q['opts']) < 4 or any(not v.strip() for v in q['opts'].values()): flags.append('選項缺漏')
            key = re.sub(r'\s', '', q['q'])[:14]; pg = next((i + 1 for i, s in enumerate(pages) if key in s), None)
            if not flags and pg and imgpg[pg - 1]: flags.append('該頁有嵌入圖片')
            t += f"### {q['n']}.\n\n{q['q']}\n\n"
            for k in 'ABCD': t += f"- {k}. {q['opts'].get(k, '')}\n"
            if ans or a:
                t += f"\n**官方答案：{'一律給分' if a == '#' else a}**\n" if a else "\n**官方答案：尚未取得**\n"
            else: t += "\n**官方答案：尚未取得**\n"
            if flags:
                nfig += 1
                t += f"\n> ⚠ 本題含圖或圖表（{'、'.join(flags)}），請對照原卷第 {pg or '?'} 頁（`{paths.raw_pdf_hint(code, subj)}`）\n"
            t += '\n'
        open(os.path.join(sdir, f"{yr}-{batch}.md"), 'w', encoding='utf-8').write(t)
        bad = [q['n'] for q in qs if len(q['opts']) != 4]
        print(subj, yr, batch, '題數', len(qs), '答案', len(ans or {}), '標圖', nfig, '選項異常', bad[:10])
