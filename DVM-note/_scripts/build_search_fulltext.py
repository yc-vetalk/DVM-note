#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
產生全站全文搜尋索引 DVM-note/search-fulltext.js，給 assets/spotlight.js 使用。

內容：
  ・每一頁（略過 _scripts、考前重點、自我測驗的殼頁）依 id="section-xxx" 切成章節，
    章節內再依 <h3> 切成小節，存純文字
  ・各科「自我測驗」題庫（*/自我測驗/data/*.js）：每章一頁、每組一節、每題一小節
  ・頁面的科目／學期／週次沿用 search-index.js；沒有的依資料夾推斷

什麼時候要跑：新增或修改任何頁面、題庫之後（git pre-commit hook 也會自動跑）。
用法（在 repo 根目錄或任何地方）：
  python3 DVM-note/_scripts/build_search_fulltext.py
"""
import html
import json
import os
import re
import subprocess
import sys
from datetime import datetime

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(SITE, 'search-fulltext.js')
SKIP_FILES = {'考前重點.html', 'quiz.html'}

RE_DROP = re.compile(r'<script\b.*?</script>|<style\b.*?</style>|<header\b.*?</header>|<nav\b.*?</nav>|'
                     r'<div class="nav-panel"[^>]*>.*?</div>|<!--.*?-->|<span class="lv[^"]*">.*?</span>|'
                     r'<details class="quiz-reveal">\s*<summary>\s*</summary>', re.S | re.I)
RE_TAG = re.compile(r'<[^>]+>')
RE_WS = re.compile(r'\s+')
RE_SEC = re.compile(r'<div[^>]*\bid="section-([\w\-]+)"[^>]*>', re.I)
RE_H2 = re.compile(r'<h2\b[^>]*>(.*?)</h2>', re.S | re.I)
RE_H3 = re.compile(r'<h3\b[^>]*>(.*?)</h3>', re.S | re.I)


def text(s):
    s = re.sub(r'<(br|/p|/li|/tr|/td|/th|/div|/h\d)\b[^>]*>', ' ', s, flags=re.I)
    return RE_WS.sub(' ', html.unescape(RE_TAG.sub(' ', s))).strip()


def load_curated():
    js = os.path.join(SITE, 'search-index.js')
    code = 'const fs=require("fs");eval(fs.readFileSync(process.argv[1],"utf8")+";process.stdout.write(JSON.stringify(SEARCH_INDEX))")'
    out = subprocess.run(['node', '-e', code, js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def page_meta(rel, curated, folder_subject, raw):
    if rel in curated:
        e = curated[rel]
        return [e['subject'], e['semester'], e.get('week'), e['weekTitle']]
    parts = rel.split('/')
    title = ''
    m = re.search(r'class="(?:page-title|pagehead__title)"[^>]*>(.*?)</h1>', raw, re.S)
    if m:
        title = text(m.group(1))
    if not title:
        m = re.search(r'<title>(.*?)</title>', raw, re.S)
        title = text(m.group(1)).replace(' - yc._vetalk', '') if m else parts[-1]
    folder = '/'.join(parts[:-1])
    if len(parts) == 1:
        return ['網站首頁', '全站', None, title]
    subj = folder_subject.get(folder) or (parts[1] if len(parts) > 2 else parts[0])
    return [subj, parts[0], None, title]


def split_page(raw):
    body = raw
    m = re.search(r'<main\b[^>]*>(.*)</main>', raw, re.S | re.I)
    if m:
        body = m.group(1)
    body = RE_DROP.sub(' ', body)
    marks = list(RE_SEC.finditer(body))
    secs = []
    if not marks:
        t = text(body)
        if t:
            secs.append(['', '頁面內容', [['', t]]])
        return secs
    for i, mk in enumerate(marks):
        seg = body[mk.end(): marks[i + 1].start() if i + 1 < len(marks) else len(body)]
        h2 = RE_H2.search(seg)
        name = text(h2.group(1)) if h2 else mk.group(1)
        if h2:
            seg = seg[:h2.start()] + seg[h2.end():]
        blocks, last, title = [], 0, ''
        for h in RE_H3.finditer(seg):
            t = text(seg[last:h.start()])
            if t:
                blocks.append([title, t])
            title, last = text(h.group(1)), h.end()
        t = text(seg[last:])
        if t or title:
            blocks.append([title, t])
        secs.append([mk.group(1), name, blocks])
    return secs


def quiz_pages(curated_folder):
    pages, secs = [], []
    for root, dirs, files in os.walk(SITE):
        if '/_' in root.replace(SITE, ''):
            continue
        if os.path.basename(root) != 'data' or 'chapters.js' not in files:
            continue
        qdir = os.path.dirname(root)
        rel_q = os.path.relpath(qdir, SITE).replace(os.sep, '/')
        subj_folder = os.path.dirname(rel_q)
        subj, sem = curated_folder.get(subj_folder, (os.path.basename(subj_folder), rel_q.split('/')[0]))
        for f in sorted(files):
            if f == 'chapters.js' or not f.endswith('.js'):
                continue
            src = open(os.path.join(root, f), encoding='utf-8').read()
            m = re.search(r'=\s*(\{.*\})\s*;?\s*$', src, re.S)
            if not m:
                continue
            try:
                d = json.loads(m.group(1))
            except ValueError:
                continue
            cid = f[:-3]
            pi = len(pages)
            pages.append([rel_q + '/quiz.html?c=' + cid, subj, sem, None, '自我測驗・' + d.get('title', cid)])
            for g in d.get('groups', []):
                blocks = []
                for q in g.get('qs', []):
                    opts = ' '.join(q.get('o', []) or [])
                    blocks.append([RE_WS.sub(' ', str(q.get('q', '')))[:80], RE_WS.sub(' ', ' '.join([str(q.get('q', '')), opts, str(q.get('e', ''))]))])
                secs.append([pi, '', g.get('name', ''), blocks])
    return pages, secs


def main():
    cur_list = load_curated()
    curated, folder_subject, curated_folder = {}, {}, {}
    for e in cur_list:
        curated.setdefault(e['url'], e)
        folder = e['url'].rsplit('/', 1)[0]
        folder_subject.setdefault(folder, e['subject'])
        curated_folder.setdefault(folder, (e['subject'], e['semester']))
    pages, secs = [], []
    for root, dirs, files in os.walk(SITE):
        dirs[:] = sorted(d for d in dirs if not d.startswith('_') and d != 'data')
        for f in sorted(files):
            if not f.endswith('.html') or f in SKIP_FILES or f.startswith('_'):
                continue
            path = os.path.join(root, f)
            rel = os.path.relpath(path, SITE).replace(os.sep, '/')
            if '/自我測驗/' in '/' + rel:
                continue
            raw = open(path, encoding='utf-8').read()
            meta = page_meta(rel, curated, folder_subject, raw)
            pi = len(pages)
            pages.append([rel] + meta)
            for s in split_page(raw):
                secs.append([pi] + s)
    qp, qs = quiz_pages(curated_folder)
    off = len(pages)
    pages += qp
    secs += [[s[0] + off] + s[1:] for s in qs]
    data = {'built': datetime.now().strftime('%Y-%m-%d %H:%M'), 'pages': pages, 'secs': secs}
    js = ('/* 自動產生：python3 DVM-note/_scripts/build_search_fulltext.py（請勿手動編輯）\n'
          '   pages: [url, subject, semester, week, title]；secs: [pageIndex, sectionId, sectionName, [[h3, text], …]] */\n'
          'const SEARCH_FULLTEXT = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    old = open(OUT, encoding='utf-8').read() if os.path.exists(OUT) else ''
    if re.sub(r'"built":"[^"]*"', '', old) == re.sub(r'"built":"[^"]*"', '', js):
        print('search-fulltext.js 無變動')
        return
    open(OUT, 'w', encoding='utf-8').write(js)
    print(f'search-fulltext.js：{len(pages)} 頁（含 {len(qp)} 份題庫）、{len(secs)} 節、{len(js.encode()) / 1e6:.1f} MB')


if __name__ == '__main__':
    sys.exit(main())
