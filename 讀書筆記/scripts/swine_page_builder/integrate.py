# -*- coding: utf-8 -*-
"""把豬病學頁面接進站台：科目 index 的 door、頂層 index 卡片 topics、nav-data desc、search-index。
用法：python integrate.py <scratchpad 的 .idx.js 檔，可多個>
頁面清單與 door 文字寫在 PAGES；只列出「檔案已存在」的頁面。讀改寫在同一次執行內完成。"""
import os, re, sys

ROOT = '/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群/DVM-note/'
SUB = ROOT + '大四上/豬病學/'

# (排序鍵, 檔名, 週次顯示, door 標題, door 描述)
PAGES = [
 (1.0, 'week01_課程介紹與養豬產業.html', '01', '課程介紹與養豬產業', '授課、評分、養豬產業現況、豬的一生與品種、台灣豬病防治史。'),
 (1.1, 'week01_細菌抗藥性.html', '01', '細菌抗藥性', '國家因應細菌抗藥性行動方案、六 R 原則、HPCIA、謹慎用藥四步驟、全基因體定序。'),
 (2.0, 'week02_豬病毒性疾病I.html', '02', '豬病毒性疾病 (I)', '非洲豬瘟、古典豬瘟、日本腦炎、E 型肝炎，含 ASF vs CSF 鑑別。'),
 (3.0, 'week03_豬病毒性疾病II.html', '03', '豬病毒性疾病 (II)', 'PCVAD、PRRS、豬小病毒、輪狀病毒與豬用疫苗。'),
 (4.0, 'week04_豬疱疹病毒病.html', '04', '豬疱疹病毒病', '假性狂犬病（DIVA、潛伏）與豬巨細胞病毒（包含體鼻炎）。'),
 (4.1, 'week04_小RNA病毒科疾病.html', '04', '小 RNA 病毒科疾病', '口蹄疫、豬水疱病、矽尼卡谷病毒，水疱性疾病鑑別。'),
 (4.2, 'week04_豬痘.html', '04', '豬痘', '豬痘病毒：豬蝨傳播、皮膚痘疹、嗜酸性質內包涵體。'),
 (5.0, 'week05_豬流行性感冒.html', '05', '豬流行性感冒', 'Mixing vessel、受體分布、臨床與診斷。'),
 (5.1, 'week05_豬冠狀病毒病.html', '05', '豬冠狀病毒病', 'TGE／PRCV、PED、血球凝集腦脊髓炎、PDCoV、SADS-CoV。'),
 (6.0, 'week06_細菌性疾病I.html', '06', '細菌性疾病 (I)', '胸膜肺炎放線桿菌、萎縮性鼻炎、Glässer 病、大腸桿菌感染，附 52 題國考題。'),
 (7.0, 'week07_細菌性疾病II.html', '07', '細菌性疾病 (II)', '豬丹毒、沙門氏菌症、滲出性表皮炎、布氏桿菌症，附 53 題國考題。'),
 (8.0, '期中總複習.html', '08', '期中總複習', '跨講義鑑別表與考古題總整理。'),
]

def main(idx_files):
    have = [p for p in PAGES if os.path.exists(SUB + p[1])]

    # 1 科目 index：同一週多份文件用 .hero-door--multi
    p = SUB + 'index.html'; s = open(p, encoding='utf-8').read()
    weeks = {}
    for k, f, w, t, d in have: weeks.setdefault(w, []).append((f, t, d))
    lis = []
    for w in sorted(weeks):
        docs = weeks[w]
        if len(docs) == 1:
            f, t, d = docs[0]
            lis.append(f'''    <li>
      <a class="hero-door hero-door--amber" href="{f}">
        <div class="hero-door__body">
          <span class="hero-door__index">{w}</span>
          <h3 class="hero-door__title">{t}</h3>
          <p class="hero-door__desc">{d}</p>
          <span class="hero-door__link">閱讀筆記 →</span>
        </div>
      </a>
    </li>''')
        else:
            items = '\n'.join(f'            <a class="hero-door__doc" href="{f}">{t}<span style="display:block;font-weight:400;font-size:.9em;color:var(--fg-muted);margin-top:2px;">{d}</span></a>' for f, t, d in docs)
            lis.append(f'''    <li>
      <div class="hero-door hero-door--amber hero-door--multi">
        <div class="hero-door__body">
          <span class="hero-door__week">WEEK {w}</span>
          <h3 class="hero-door__title">{('第 '+str(int(w))+' 週') if w.isdigit() else w}（{len(docs)} 份講義）</h3>
          <div class="hero-door__doclist">
{items}
          </div>
        </div>
      </div>
    </li>''')
    a = s.index('<ul class="hero-doors hero-doors--topics">', s.index('<h2>週次筆記</h2>')); b = s.index('</ul>', a)
    s = s[:a] + '<ul class="hero-doors hero-doors--topics">\n' + '\n'.join(lis) + '\n  ' + s[b:]
    open(p, 'w', encoding='utf-8').write(s)

    # 2 頂層 index：豬病學卡片 topics
    p = ROOT + 'index.html'; s = open(p, encoding='utf-8').read()
    i = s.index('<h3 class="hero-door__title">豬病學</h3>')
    a = s.index('<ul class="hero-door__topics">', i); b = s.index('</ul>', a)
    tops = '\n'.join(f'            <li>{("Week "+str(int(w))) if w.isdigit() else w}：{"、".join(t for f, t, d in weeks[w])}</li>' for w in sorted(weeks))
    s = s[:a] + '<ul class="hero-door__topics">\n' + tops + '\n          ' + s[b:]
    open(p, 'w', encoding='utf-8').write(s)

    # 3 nav-data
    p = ROOT + 'assets/nav-data.js'; s = open(p, encoding='utf-8').read()
    s2 = re.sub(r'(\{ title: "豬病學", url: "大四上/豬病學/index.html", desc: ")[^"]*(" \})',
                lambda m: m.group(1) + f'已整理 {len(have)} 份講義（第 {"、".join(str(int(w)) for w in sorted(weeks) if w.isdigit())} 週）' + m.group(2), s)
    assert s2 != s or 'desc: "已整理' in s
    open(p, 'w', encoding='utf-8').write(s2)

    # 4 search-index：每份 idx 先刪同 url 舊條目，再插到最後一筆豬病學後
    p = ROOT + 'search-index.js'; s = open(p, encoding='utf-8').read()
    for fn in idx_files:
        add = open(fn, encoding='utf-8').read()
        url = re.search(r'url: "([^"]+)"', add).group(1)
        s = re.sub(r'  \{\n    subject: "豬病學"[^{}]*?url: "' + re.escape(url) + r'"[^{}]*?\n  \},\n', '', s)
        i = s.rindex('subject: "豬病學"'); j = s.index('\n  },\n', i) + len('\n  },\n')
        s = s[:j] + add + s[j:]
    open(p, 'w', encoding='utf-8').write(s)
    print('pages', len(have), 'weeks', sorted(weeks))

main(sys.argv[1:])
