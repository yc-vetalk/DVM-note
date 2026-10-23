"""幫科目資料夾內每一個有題庫的內頁加自我測驗入口（頁頂資訊列、左側目錄、頁尾大按鈕）。可重複執行。

用法（在 repo 根目錄執行）：
  python3 讀書筆記/scripts/course_tools/add_quiz_entries.py DVM-note/大四上/反芻動物疾病學
條件：自我測驗/data/<頁面檔名去掉 .html>.js 存在才加。
"""
import sys, os, glob, urllib.parse
d = sys.argv[1].rstrip('/') + '/'
for fn in sorted(glob.glob(d + 'week*.html')):
    cid = os.path.basename(fn)[:-5]
    if not os.path.exists(f'{d}自我測驗/data/{cid}.js'): print('沒有題庫，跳過', cid); continue
    url = f'自我測驗/quiz.html?c={urllib.parse.quote(cid)}'
    s = open(fn, encoding='utf-8').read(); ch = []
    if 'meta-label">自我測驗' not in s:
        a = '<div class="meta-item"><div class="meta-label">整理狀態</div>'; assert s.count(a) == 1, fn
        s = s.replace(a, f'<div class="meta-item"><div class="meta-label">自我測驗</div><div class="meta-value"><a href="{url}">做題 →</a></div></div>\n      ' + a); ch.append('頁頂')
    if 'nav-quiz-link' not in s:
        i = s.index('<nav class="toc">'); j = s.index('</nav>', i)
        s = s[:j] + f'''  <div class="section-label" style="margin-top:8px;">練習</div>
    <a href="{url}" id="nav-quiz-link"><span class="nav-icon">📝</span> 自我測驗</a>
  ''' + s[j:]; ch.append('目錄')
    if 'quiz-cta' not in s:
        k = s.rindex('<footer class="note-footer">')
        s = s[:k] + f'''<div class="quiz-cta" style="margin:2.5rem 0 1rem;padding:1.4rem 1.6rem;text-align:center;border:1px solid var(--line-soft);border-radius:var(--radius);background:var(--bg-soft)">
        <p style="margin:0 0 .8rem;font-weight:600;color:var(--accent-deep)">讀完了？用題目檢查一下這章</p>
        <a href="{url}" style="display:inline-block;padding:.6rem 1.6rem;border-radius:999px;background:var(--accent);color:var(--bg);font-weight:700;text-decoration:none">📝 做這章的自我測驗 →</a>
        <p style="margin:.7rem 0 0;font-size:.85em;color:var(--fg-muted)">每題作答後立即顯示解析；答錯的會進錯題本。</p>
      </div>
      ''' + s[k:]; ch.append('頁尾')
    open(fn, 'w', encoding='utf-8').write(s); print(cid, ch or '已有')
