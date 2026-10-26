#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 repo 根目錄的 _worklog.md（各對話框的改動日誌）轉成時間軸網頁 DVM-note/logbook.html（Logbook）。
這一頁只在本機使用（已列入 .gitignore，不會 push 到網站）。

什麼時候跑：每次寫完 _worklog.md 之後（git pre-commit hook 也會順便跑）。
用法：python3 DVM-note/_scripts/build_changelog.py
"""
import html
import json
import os
import re
from datetime import datetime

SITE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPO = os.path.dirname(SITE)
SRC = os.path.join(REPO, '_worklog.md')
OUT = os.path.join(SITE, 'logbook.html')


def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)

    def code(m):
        t = m.group(1)
        p = t.split('#')[0]
        if p.startswith('DVM-note/') and p.endswith('.html') and os.path.exists(os.path.join(REPO, p)):
            return '<a href="' + html.escape(t[len('DVM-note/'):], quote=True) + '"><code>' + t + '</code></a>'
        return '<code>' + t + '</code>'
    s = re.sub(r'`([^`]+)`', code, s)
    s = re.sub(r'(https?://[^\s<）)]+)', r'<a href="\1" target="_blank" rel="noopener">\1</a>', s)
    return s


def to_html(lines):
    """把「- 項目」與縮排的「  - 子項目」轉成巢狀清單。"""
    out, depth = [], -1
    for raw in lines:
        if not raw.strip():
            continue
        m = re.match(r'^(\s*)[-*]\s+(.*)$', raw)
        if not m:
            if out and out[-1].endswith('</li>'):
                out[-1] = out[-1][:-5] + ' ' + inline(raw.strip()) + '</li>'
            else:
                out.append('<p>' + inline(raw.strip()) + '</p>')
            continue
        d = len(m.group(1).replace('\t', '  ')) // 2
        while depth < d:
            out.append('<ul>'); depth += 1
        while depth > d:
            out.append('</ul>'); depth -= 1
        text = inline(m.group(2))
        text = re.sub(r'^(改了並 push|改了|新增|原因|牽連|push|注意|未做|未完成|另|測試)(（[^）]*）)?[：:]',
                      lambda k: '<b class="k">' + k.group(0)[:-1] + '</b>', text)
        out.append('<li>' + text + '</li>')
    while depth >= 0:
        out.append('</ul>'); depth -= 1
    return ''.join(out)


def parse():
    txt = open(SRC, encoding='utf-8').read()
    handoff = ''
    m = re.search(r'^## 待交接\s*\n(.*?)^## ', txt, re.S | re.M)
    if m:
        items = [l for l in m.group(1).splitlines() if l.startswith('- ')]
        handoff = to_html(items)
    body = txt[txt.find('## 紀錄'):] if '## 紀錄' in txt else txt
    entries = []
    for block in re.split(r'^### ', body, flags=re.M)[1:]:
        head, _, rest = block.partition('\n')
        hm = re.match(r'(\d{4}-\d{2}-\d{2})(?:\s+(\d{1,2}:\d{2}))?([^｜|]*)[｜|]\s*(.+)$', head.strip())
        if not hm:
            continue
        date, tm, note, who = hm.group(1), hm.group(2) or '', hm.group(3).strip(), hm.group(4).strip()
        lines = rest.rstrip().splitlines()
        plain = re.sub(r'\s+', ' ', re.sub(r'[`*]', '', rest))
        kind = 'push' if re.search(r'^\s*-\s*(push|改了並 push)', rest, re.M) or 'commit `' in rest else 'edit'
        entries.append({'d': date, 't': tm, 'note': note, 'who': who, 'base': re.sub(r'（.*）', '', who),
                        'html': to_html(lines), 'q': (head + ' ' + plain).lower(), 'kind': kind})
    entries.sort(key=lambda e: (e['d'], e['t'] or '00:00'), reverse=True)
    return entries, handoff


TEMPLATE = r'''<!DOCTYPE html>
<html lang="zh-TW" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Logbook - yc._vetalk</title>
<link rel="stylesheet" href="assets/nav.css">
<link rel="stylesheet" href="assets/ah.css?v=5">
</head>
<body class="ah" data-page="review">
<header>
  <a class="header-brand" href="index.html"><h1>yc._vetalk</h1><div class="subtitle">DVM Course Notes · 大一～大四</div></a>
  <div class="site-nav" id="siteNav" data-base="" data-current=""></div>
  <div class="header-right"><button class="theme-btn" id="themeBtn" onclick="toggleTheme()" title="切換深色/淺色模式">🌙</button></div>
</header>
<div class="nav-panel" id="navPanel"></div>

<section class="pagehead">
  <div class="pagehead__inner">
    <div class="breadcrumb"><a href="index.html">網頁筆記首頁</a><span class="sep">›</span><span class="current">Logbook</span></div>
    <div class="page-head">
      <h1 class="page-title">Logbook</h1>
      <p class="page-subtitle">每一次修改的時間、由哪個對話框做的、改了什麼。資料來自 repo 根目錄的 <code>_worklog.md</code>，只在本機顯示，不會上傳到網站。</p>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><div class="meta-label">紀錄筆數</div><div class="meta-value">__N__ 筆（__RANGE__）</div></div>
      <div class="meta-item"><div class="meta-label">頁面產生時間</div><div class="meta-value">__BUILT__</div></div>
      <div class="meta-item"><div class="meta-label">怎麼更新</div><div class="meta-value"><code>python3 DVM-note/_scripts/build_changelog.py</code>（commit 時也會自動跑）</div></div>
    </div>
  </div>
</section>

<div class="pagewrap">
  <nav class="toc" id="clToc"><div class="section-label">日期</div></nav>
  <main class="pagebody" id="mainContent">
    <div class="cl-bar">
      <input type="search" id="clQ" placeholder="搜尋紀錄內容：頁面名稱、科目、關鍵字…" autocomplete="off">
      <div class="cl-chips" id="clChips"></div>
    </div>
    __HANDOFF__
    <div id="clList"></div>
    <footer class="note-footer">本頁由 _worklog.md 自動產生，請勿手動編輯；要修正內容請改 _worklog.md 後重新產生。</footer>
  </main>
</div>

<style>
.cl-bar { position: sticky; top: var(--nav-h); z-index: 5; background: var(--bg); padding: 10px 0 12px; margin-bottom: 8px; border-bottom: 1px solid var(--line); }
#clQ { width: 100%; font: inherit; font-size: 1rem; padding: 9px 14px; border: 1px solid var(--line); border-radius: 999px; background: var(--bg-faint); color: var(--fg); }
#clQ:focus { outline: none; border-color: var(--accent); background: var(--bg); }
.cl-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.cl-chips button { font: inherit; font-size: .84em; padding: 4px 12px; border: 1px solid var(--line); border-radius: 999px; background: var(--bg); color: var(--fg-muted); cursor: pointer; }
.cl-chips button.on { background: var(--accent); border-color: var(--accent); color: #fff; }
.cl-chips small { opacity: .7; margin-left: 3px; }
.cl-day { margin: 26px 0 6px; font-size: var(--text-h3); font-weight: 700; color: var(--accent-deep); scroll-margin-top: calc(var(--nav-h) + 110px); }
.cl-day small { font-size: .7em; font-weight: 400; color: var(--fg-faint); margin-left: 8px; }
.cl-tl { position: relative; margin-left: 8px; padding-left: 22px; border-left: 2px solid var(--line); }
.cl-e { position: relative; margin: 0 0 14px; padding: 12px 16px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--bg); }
.cl-e::before { content: ''; position: absolute; left: -30px; top: 16px; width: 12px; height: 12px; border-radius: 50%; background: var(--bg); border: 2px solid var(--accent-mid); }
.cl-e.push::before { background: var(--green-700); border-color: var(--green-700); }
.cl-h { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 10px; margin-bottom: 6px; }
.cl-time { font-family: var(--mono); font-size: .9em; color: var(--fg-muted); }
.cl-who { font-size: .78em; font-weight: 600; padding: 1px 9px; border-radius: 999px; background: var(--accent-tint); color: var(--accent); }
.cl-push { font-size: .74em; font-weight: 600; padding: 1px 8px; border-radius: 999px; background: var(--green-100); color: var(--green-700); }
.cl-note { font-size: .8em; color: var(--fg-faint); }
.cl-e ul { margin: 0; padding-left: 1.15em; line-height: 1.75; font-size: .93em; }
.cl-e ul ul { margin: 2px 0; }
.cl-e li { overflow-wrap: anywhere; }
.cl-e b.k { color: var(--fg); margin-right: 2px; }
.cl-e code { font-size: .86em; padding: 0 4px; border-radius: 4px; background: var(--bg-faint); border: 1px solid var(--line); }
.cl-e a code { color: var(--accent); }
.cl-e mark { background: var(--gold-100); color: inherit; }
.cl-empty { padding: 40px; text-align: center; color: var(--fg-muted); }
details.cl-handoff { margin: 6px 0 18px; }
details.cl-handoff ul { margin: 8px 0 0; padding-left: 1.2em; line-height: 1.75; font-size: .92em; }
.toc a small { color: var(--fg-faint); margin-left: 4px; }
</style>
<script>const CHANGELOG = __DATA__;</script>
<script src="assets/nav-data.js"></script>
<script src="assets/nav.js"></script>
<script>
initSiteNav('siteNav', 'navPanel');
function toggleTheme() {
  var h = document.documentElement, b = document.getElementById('themeBtn'), d = h.getAttribute('data-theme') === 'dark';
  h.setAttribute('data-theme', d ? 'light' : 'dark'); b.textContent = d ? '🌙' : '☀️';
  try { localStorage.setItem('theme', d ? 'light' : 'dark'); } catch (e) {}
}
(function () { try { var t = localStorage.getItem('theme'); if (t) { document.documentElement.setAttribute('data-theme', t); document.getElementById('themeBtn').textContent = t === 'dark' ? '☀️' : '🌙'; } } catch (e) {} })();
(function () {
  var who = '', q = '';
  var list = document.getElementById('clList'), toc = document.getElementById('clToc'), chips = document.getElementById('clChips');
  var W = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(h, terms) {
    if (!terms.length) return h;
    var re = new RegExp('(' + terms.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return h.split(/(<[^>]+>)/).map(function (p) { return p.charAt(0) === '<' ? p : p.replace(re, '<mark>$1</mark>'); }).join('');
  }
  function render() {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var rows = CHANGELOG.filter(function (e) {
      return (!who || (who === '§push' ? e.kind === 'push' : e.base === who)) && terms.every(function (t) { return e.q.indexOf(t) >= 0; });
    });
    var counts = {}, order = [];
    CHANGELOG.forEach(function (e) { if (!counts[e.base]) { counts[e.base] = 0; order.push(e.base); } counts[e.base]++; });
    var np = CHANGELOG.filter(function (e) { return e.kind === 'push'; }).length;
    chips.innerHTML = '<button type="button" data-w=""' + (who ? '' : ' class="on"') + '>全部<small>' + CHANGELOG.length + '</small></button>' +
      '<button type="button" data-w="§push"' + (who === '§push' ? ' class="on"' : '') + '>已 commit／push<small>' + np + '</small></button>' +
      order.map(function (w) { return '<button type="button" data-w="' + esc(w) + '"' + (who === w ? ' class="on"' : '') + '>' + esc(w) + '<small>' + counts[w] + '</small></button>'; }).join('');
    if (!rows.length) { list.innerHTML = '<div class="cl-empty">沒有符合的紀錄</div>'; toc.innerHTML = '<div class="section-label">日期</div>'; return; }
    var h = '', t = '<div class="section-label">日期（' + rows.length + ' 筆）</div>', day = '', n = 0;
    rows.forEach(function (e) {
      if (e.d !== day) {
        if (day) h += '</div>';
        day = e.d; n++;
        var cnt = rows.filter(function (x) { return x.d === day; }).length;
        var wd = W[new Date(day + 'T00:00:00').getDay()];
        h += '<h2 class="cl-day" id="d' + n + '">' + day + '<small>' + wd + '・' + cnt + ' 筆</small></h2><div class="cl-tl">';
        t += '<a href="#d' + n + '">' + day.slice(5) + ' ' + wd + '<small>' + cnt + '</small></a>';
      }
      h += '<div class="cl-e' + (e.kind === 'push' ? ' push' : '') + '"><div class="cl-h"><span class="cl-time">' + (e.t || '—') + '</span><span class="cl-who">' + esc(e.who) + '</span>' +
        (e.kind === 'push' ? '<span class="cl-push">commit／push</span>' : '') + (e.note ? '<span class="cl-note">' + esc(e.note) + '</span>' : '') + '</div>' + mark(e.html, terms) + '</div>';
    });
    list.innerHTML = h + '</div>'; toc.innerHTML = t;
  }
  chips.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; who = b.getAttribute('data-w'); render(); });
  var tm; document.getElementById('clQ').addEventListener('input', function () { var v = this.value; clearTimeout(tm); tm = setTimeout(function () { q = v; render(); }, 80); });
  render();
})();
</script>
</body>
</html>
'''


def main():
    entries, handoff = parse()
    days = sorted({e['d'] for e in entries})
    ho = ('<details class="alert alert-warn cl-handoff"><summary><strong>待交接事項</strong>（其他對話框留下、還沒處理的待辦）</summary>' + handoff + '</details>') if handoff else ''
    page = (TEMPLATE.replace('__N__', str(len(entries)))
            .replace('__RANGE__', (days[0] + ' ～ ' + days[-1]) if days else '—')
            .replace('__BUILT__', datetime.now().strftime('%Y-%m-%d %H:%M'))
            .replace('__HANDOFF__', ho)
            .replace('__DATA__', json.dumps(entries, ensure_ascii=False).replace('</', '<\\/')))
    open(OUT, 'w', encoding='utf-8').write(page)
    print(f'logbook.html：{len(entries)} 筆、{len(days)} 天')


if __name__ == '__main__':
    main()
