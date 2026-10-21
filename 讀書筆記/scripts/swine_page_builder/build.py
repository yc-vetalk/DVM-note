#!/usr/bin/env python3
"""把 .src 內容檔包成豬病學內頁（沿用 week02 模板的 header／toc／script）。
用法：python build.py page.src  → 輸出 HTML 到 meta 指定路徑，並印出 search-index 條目到 page.idx.js

.src 格式：
  開頭 meta 行：  key: value   （file, title, crumb, h1, subtitle, subject, source, updated, status, week, weekTitle）
  分節：          @@ id | toc群組 | icon | toc文字 | h2標題 | keywords | snippet
  練習題行：      Q|tf|題目|TRUE或FALSE|解析
                  Q|mcq|題目|選項1;;選項2;;選項3;;選項4|B|解析
                  Q|saq|題目|解析
"""
import sys, re, json, html, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

SCRIPT_TAIL = open(sys.argv[2], encoding='utf-8').read() if len(sys.argv) > 2 else ''

def quiz(line, n):
    p = line.split('|')
    kind = p[1]
    if kind == 'tf':
        q, ans, ex = p[2], p[3], p[4]
        cls = 'correct' if ans.upper() == 'TRUE' else 'false'
        return f'''      <div class="quiz-item">
        <span class="quiz-type quiz-type-tf">是非題</span>
        <div class="quiz-q">Q{n}. {q}</div>
        <details class="quiz-reveal">
          <summary></summary>
          <div class="quiz-answer {cls}">答案：{ans.upper()}</div>
          <p class="quiz-explain">{ex}</p>
        </details>
      </div>
'''
    if kind == 'mcq':
        q, opts, ans, ex = p[2], p[3].split(';;'), p[4], p[5]
        lis = '\n'.join(f'          <li>({"ABCDE"[i]}) {o}</li>' for i, o in enumerate(opts))
        return f'''      <div class="quiz-item">
        <span class="quiz-type quiz-type-mcq">選擇題</span>
        <div class="quiz-q">Q{n}. {q}</div>
        <ul class="quiz-options">
{lis}
        </ul>
        <details class="quiz-reveal">
          <summary></summary>
          <div class="quiz-answer correct">答案：({ans})</div>
          <p class="quiz-explain">{ex}</p>
        </details>
      </div>
'''
    if kind == 'vig':
        q, ex = p[2], p[3]
        return f'''      <div class="quiz-item"><span class="quiz-type quiz-type-vignette">臨床情境題</span>
        <div class="quiz-q">Q{n}.【臨床情境】{q}</div>
        <details class="quiz-reveal"><summary></summary><p class="quiz-explain">{ex}</p></details></div>

'''
    if kind == 'saq':
        q, ex = p[2], p[3]
        return f'''      <div class="quiz-item">
        <span class="quiz-type quiz-type-saq">簡答題</span>
        <div class="quiz-q">Q{n}. {q}</div>
        <details class="quiz-reveal">
          <summary></summary>
          <p class="quiz-explain">{ex}</p>
        </details>
      </div>
'''
    raise ValueError(line)

def main(src_path):
    raw = open(src_path, encoding='utf-8').read().split('\n')
    meta, i = {}, 0
    while i < len(raw) and not raw[i].startswith('@@'):
        if ':' in raw[i]:
            k, v = raw[i].split(':', 1); meta[k.strip()] = v.strip()
        i += 1
    meta.setdefault('imgdir','img/_none'); meta.setdefault('imgprefix','x')
    sections, cur = [], None
    qn = 0
    for line in raw[i:]:
        if line.startswith('@@'):
            f = [x.strip() for x in line[2:].split('|')]
            cur = dict(id=f[0], group=f[1], icon=f[2], toc=f[3], h2=f[4], kw=f[5], snip=f[6], body=[])
            sections.append(cur)
        elif line.startswith('X|') or line.startswith('E|'):
            import exam06
            p = line.split('|')
            if p[0] == 'X':
                exp = '<br>'.join(x.strip() for x in p[5].split('//'))
                fig = p[6] if len(p) > 6 and p[6].strip() else None
                cur['body'].append(exam06.card(p[1], p[2], p[3].split(';;'), p[4], exp, fig=fig))
            else:
                cur['body'].append(exam06.essay(p[1], p[2], p[3]))
        elif line.startswith('Q|'):
            qn += 1; cur['body'].append(quiz(line, qn))
        else:
            cur['body'].append(line + '\n')

    import os, glob
    used = set()
    def fig(m):
        pg, cap = int(m.group(1)), m.group(2)
        fn = f"{meta['imgdir']}/{meta['imgprefix']}_p{pg:03d}.jpg"
        assert os.path.exists(os.path.join(os.path.dirname(meta['file']), fn)), fn
        used.add(fn)
        alt = re.sub('<[^>]+>', '', cap).split('：')[0][:40]
        return f'<div class="figure"><img src="{fn}" alt="{html.escape(alt)}" loading="lazy"><div class="figure-caption">{cap}</div><div class="figure-source">來源：課程講義 p.{pg}</div></div>'
    for sct in sections:
        sct['body'] = [re.sub(r'\[\[F:(\d+)\|(.*?)\]\]', fig, b) for b in sct['body']]
    allimgs = {meta['imgdir'] + '/' + os.path.basename(x) for x in glob.glob(os.path.join(os.path.dirname(meta['file']), meta['imgdir'], '*.jpg'))}
    if allimgs - used: print('UNUSED IMAGES:', sorted(allimgs - used))
    toc, last_group = [], None
    for k, s in enumerate(sections):
        if s['group'] != last_group:
            style = '' if k == 0 else ' style="margin-top:8px;"'
            toc.append(f'    <div class="section-label"{style}>{s["group"]}</div>')
            last_group = s['group']
        act = ' class="active"' if k == 0 else ''
        toc.append(f'    <a{act} onclick="showSection(\'{s["id"]}\')" id="nav-{s["id"]}">\n      <span class="nav-icon">{s["icon"]}</span> {s["toc"]}\n    </a>')

    body = []
    for k, s in enumerate(sections):
        content = ''.join(s['body']).rstrip() + '\n'
        if k == len(sections) - 1:
            content += '\n      <footer class="note-footer">本頁為個人課堂筆記整理，僅供學習與複習使用，不作為正式診斷依據。</footer>\n'
        body.append(f'''    <!-- {s["id"].upper()} -->
    <div class="section" id="section-{s["id"]}">
      <div class="section-head"><div class="section-num">{k+1}</div><h2>{s["h2"]}</h2></div>
{content}    </div>
''')

    names = ',\n'.join(f"  '{s['id']}': '{s['toc']}'" for s in sections)

    out = f'''<!DOCTYPE html>
<html lang="zh-TW" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{meta["title"]} - yc._vetalk</title>
<link rel="stylesheet" href="../../assets/nav.css">
<link rel="stylesheet" href="../../assets/ah.css?v=4">
</head>
<body class="ah">

<header>
  <a class="header-brand" href="../../index.html">
    <h1>yc._vetalk</h1>
    <div class="subtitle">DVM Course Notes · 大一～大四</div>
  </a>
  <div class="site-nav" id="siteNav" data-base="../../" data-current="大四"></div>
  <div class="header-right">
    <div class="search-wrap">
      <span class="search-icon">🔍</span>
      <input type="text" id="searchInput" placeholder="搜尋本頁內容..." oninput="doSearch(this.value)" autocomplete="off">
      <div id="searchResults" class="search-results"></div>
    </div>
    <button class="theme-btn" id="themeBtn" onclick="toggleTheme()" title="切換深色/淺色模式">🌙</button>
  </div>
</header>
<div class="nav-panel" id="navPanel"></div>

<section class="pagehead">
  <div class="pagehead__inner">
    <div class="breadcrumb">
      <a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="index.html">豬病學</a><span class="sep">›</span><span class="current">{meta["crumb"]}</span>
    </div>
    <div class="page-head">
      <h1 class="page-title">{meta["h1"]}</h1>
      <p class="page-subtitle">{meta["subtitle"]}</p>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">{meta["subject"]}</div></div>
      <div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">{meta["source"]}</div></div>
      <div class="meta-item"><div class="meta-label">最後更新</div><div class="meta-value">{meta["updated"]}</div></div>
      <div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">{meta["status"]}</div></div>
    </div>
  </div>
</section>

<div class="pagewrap">
  <nav class="toc">
{chr(10).join(toc)}
  </nav>

  <main class="pagebody" id="mainContent">

{chr(10).join(body)}
  </main>
</div>

<script>
{SCRIPT_TAIL.replace('/*SECTION_NAMES*/', names)}
</script>
<script src="../../assets/nav-data.js"></script>
<script src="../../assets/nav.js"></script>
<script>
initSiteNav('siteNav', 'navPanel');
</script>

</body>
</html>
'''
    if meta.get('pdf'):
        pdf = meta['pdf']
        out = out.replace('<div class="meta-item"><div class="meta-label">整理狀態</div>',
            f'<div class="meta-item"><div class="meta-label">講義 PDF</div><div class="meta-value"><a class="pdf-open-link" href="{pdf}#page=1">在右側開啟講義</a></div></div>\n      <div class="meta-item"><div class="meta-label">整理狀態</div>', 1)
        m0 = out.index('<main'); m1 = out.index('</main>')
        body = out[m0:m1]
        parts = re.split(r'(<a\b.*?</a>|<[^>]+>)', body, flags=re.S)
        def link(t):
            return re.sub(r'p\.(\d+)((?:[–-]\d+)?)', lambda m: f'<a class="pdf-link" href="{pdf}#page={m.group(1)}">p.{m.group(1)}{m.group(2)}</a>', t)
        body = ''.join(x if x.startswith('<') else link(x) for x in parts)
        out = out[:m0] + body + out[m1:]
        out = out.replace('</head>', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pdfpanel.css'), encoding='utf-8').read() + '\n</head>', 1)
        out = out.replace('<script src="../../assets/nav-data.js"></script>', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pdfpanel.html'), encoding='utf-8').read() + '\n<script src="../../assets/nav-data.js"></script>', 1)
    open(meta['file'], 'w', encoding='utf-8').write(out)

    idx = []
    for s in sections:
        idx.append(f'''  {{
    subject: "豬病學", semester: "大四上", week: {meta["week"]}, weekTitle: "{meta["weekTitle"]}",
    url: "大四上/豬病學/{meta["file"].split("/")[-1]}",
    section: "{s["id"]}", sectionName: "{s["toc"]}",
    keywords: {json.dumps(s["kw"], ensure_ascii=False)},
    snippet: {json.dumps(s["snip"], ensure_ascii=False)}
  }}''')
    open(src_path.replace('.src', '.idx.js'), 'w', encoding='utf-8').write(',\n'.join(idx) + ',\n')
    print('wrote', meta['file'], len(sections), 'sections', qn, 'quiz')

main(sys.argv[1])
