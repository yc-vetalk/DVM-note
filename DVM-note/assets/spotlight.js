/* ══════════════════════════════════════════════════════
   yc._vetalk — 全站搜尋（類似 macOS Spotlight）
   由 nav.js 自動載入，所有頁面都有。
   ・開啟：頁首「搜尋全站」按鈕、⌘K／Ctrl+K、或按 /
   ・資料：search-index.js 的 SEARCH_INDEX（第一次開啟時才載入）
   ・結果：依「科目 → 頁面（主題／疾病）→ 章節」分組成卡片，
     右側預覽目前選取的章節；↑↓ 移動、Enter 開啟、Esc 關閉
   ══════════════════════════════════════════════════════ */
(function () {
  if (window.__spotlight) return;
  window.__spotlight = true;

  var me = document.currentScript;
  var ROOT = me ? new URL('../', me.src).href : new URL('./', location.href).href;
  var RECENT_KEY = 'spotlight-recent-v1';
  var PAGE_LIMIT = 6;          // 每個科目先顯示幾頁，其餘按「顯示全部」
  var SEC_LIMIT = 4;           // 每張卡片先顯示幾個章節

  var CSS = [
    '.sl-trigger{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 10px 0 12px;border:1px solid var(--line);border-radius:999px;background:var(--bg-faint);color:var(--fg-faint);font:inherit;font-size:.88rem;cursor:pointer;white-space:nowrap;transition:border-color .15s,color .15s}',
    '.sl-trigger:hover{border-color:var(--accent);color:var(--fg)}',
    '.sl-trigger svg{flex:none}',
    '.sl-trigger kbd,.sl kbd{font:inherit;font-size:.75rem;padding:1px 6px;border:1px solid var(--line);border-radius:5px;background:var(--bg);color:var(--fg-faint)}',
    '.sl-trigger.wide{min-width:250px;justify-content:flex-start}.sl-trigger.wide kbd{margin-left:auto}',
    '@media (max-width:900px){.sl-trigger .sl-tlabel,.sl-trigger kbd{display:none}.sl-trigger{padding:0 10px}.sl-trigger.wide{min-width:0}}',
    '.sl{position:fixed;inset:0;z-index:3000;display:none}',
    '.sl.open{display:block}',
    '.sl-back{position:absolute;inset:0;background:rgba(20,16,12,.38);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}',
    '.sl-panel{position:relative;margin:9vh auto 0;width:min(1120px,94vw);max-height:82vh;display:flex;flex-direction:column;background:var(--bg);border:1px solid var(--line);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.28);overflow:hidden}',
    '.sl-bar{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--line)}',
    '.sl-bar svg{flex:none;color:var(--fg-faint)}',
    '.sl .sl-input{flex:1;min-width:0;width:auto;height:auto;border:0 !important;outline:0;box-shadow:none !important;border-radius:0;background:transparent !important;color:var(--fg);font:inherit;font-size:1.35rem;padding:4px 0}',
    'body.ah .sl .sl-input:focus-visible,.sl .sl-input:focus{outline:none !important}',
    '.sl-input::placeholder{color:var(--fg-dim)}',
    '.sl-close{border:0;background:none;color:var(--fg-faint);cursor:pointer;padding:4px}',
    '.sl-meta{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;padding:10px 18px;border-bottom:1px solid var(--line);font-size:.86rem;color:var(--fg-muted)}',
    '.sl-meta:empty{display:none}',
    '.sl-sum{margin-right:6px}.sl-sum b{color:var(--fg)}',
    '.sl-chip{font:inherit;font-size:.8rem;padding:3px 10px;border:1px solid var(--line);border-radius:999px;background:var(--bg);color:var(--fg-muted);cursor:pointer}',
    '.sl-chip.on{background:var(--accent);border-color:var(--accent);color:#fff}',
    '.sl-chip small{opacity:.7;margin-left:3px}',
    '.sl-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) 330px}',
    '.sl-list{overflow:auto;padding:14px 18px 22px}',
    '.sl-prev{overflow:auto;border-left:1px solid var(--line);background:var(--bg-faint);padding:18px}',
    '@media (max-width:860px){.sl-body{grid-template-columns:minmax(0,1fr)}.sl-bar{padding:12px 14px}.sl-list{padding:12px 14px 20px}.sl-meta{padding:8px 14px}.sl-input{font-size:1.15rem}.sl-prev{display:none}.sl-panel{margin-top:0;width:100vw;max-height:100vh;height:100vh;border-radius:0}}',
    '.sl-h{display:flex;align-items:baseline;gap:8px;margin:18px 0 8px;font-size:.95rem;font-weight:700;color:var(--accent-deep)}',
    '.sl-h:first-child{margin-top:0}',
    '.sl-h .sl-sem{font-size:.72rem;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--accent-tint);color:var(--accent)}',
    '.sl-h .sl-cnt{font-size:.78rem;font-weight:400;color:var(--fg-faint)}',
    '.sl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(270px,100%),1fr));gap:10px}',
    '.sl-card{border:1px solid var(--line);border-radius:12px;background:var(--bg);padding:11px 12px 8px;min-width:0}',
    '.sl-card.top{grid-column:1/-1;border-color:var(--accent);box-shadow:0 0 0 1px var(--accent) inset}',
    '.sl-card.top .sl-secs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr));column-gap:14px}',
    '.sl-ct{display:block;font-weight:700;color:var(--fg);text-decoration:none;line-height:1.4}',
    '.sl-ct:hover{color:var(--accent)}',
    '.sl-path{margin:2px 0 6px;font-size:.74rem;color:var(--fg-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sl-here{font-size:.7rem;padding:0 6px;margin-left:6px;border-radius:999px;background:var(--gold-100);color:var(--fg-muted);font-weight:600}',
    '.sl-sec{display:block;padding:5px 8px;margin:0 -6px;border-radius:7px;text-decoration:none;color:var(--fg-muted);font-size:.84rem;line-height:1.45}',
    '.sl-sec b{color:var(--fg);font-weight:600}',
    '.sl-sec i{font-style:normal;color:var(--fg-faint);font-size:.8rem}.sl-sec.act i{color:#fff}',
    '.sl-pv-l{font-size:.74rem;letter-spacing:.06em;color:var(--fg-faint);margin:4px 0 6px}',
    '.sl-pv-hit{padding:7px 10px;margin:0 0 6px;border:1px solid var(--line);border-radius:8px;background:var(--bg);font-size:.82rem;line-height:1.6;color:var(--fg-muted)}',
    '.sl-pv-hit b{display:block;color:var(--fg);font-size:.8rem}',
    '.sl-pv-hit + .sl-go,.sl-pv-k + .sl-go{margin-top:4px}',
    '.sl-sec span{display:block;font-size:.76rem;color:var(--fg-faint);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
    '.sl-sec.act{background:var(--accent);color:#fff}.sl-sec.act b,.sl-sec.act span{color:#fff}.sl-sec.act mark{background:rgba(255,255,255,.3);color:#fff}',
    '.sl-more{font:inherit;font-size:.78rem;border:0;background:none;color:var(--accent);cursor:pointer;padding:4px 2px}',
    '.sl mark{background:var(--gold-100);color:inherit;padding:0 1px;border-radius:2px}',
    '.sl-topl{font-size:.72rem;letter-spacing:.06em;color:var(--fg-faint);margin:0 0 6px}',
    '.sl-empty{padding:40px 10px;text-align:center;color:var(--fg-muted);line-height:1.9}',
    '.sl-recent{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 14px}',
    '.sl-subj{display:flex;justify-content:space-between;gap:8px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;text-decoration:none;color:var(--fg);font-size:.88rem}',
    '.sl-subj:hover{border-color:var(--accent)}.sl-subj small{color:var(--fg-faint)}',
    '.sl-pv-path{font-size:.76rem;color:var(--fg-faint);line-height:1.6;margin-bottom:8px}',
    '.sl-pv-t{font-size:1.1rem;font-weight:700;line-height:1.4;margin:0 0 4px}',
    '.sl-pv-s{font-size:.92rem;font-weight:600;color:var(--accent);margin:0 0 10px}',
    '.sl-pv-x{font-size:.9rem;line-height:1.75;color:var(--fg-muted);margin:0 0 12px}',
    '.sl-pv-k{display:flex;flex-wrap:wrap;gap:4px;margin:0 0 14px}',
    '.sl-pv-k span{font-size:.72rem;padding:1px 7px;border:1px solid var(--line);border-radius:999px;color:var(--fg-faint);background:var(--bg)}',
    '.sl-pv-k span.hit{border-color:var(--accent);color:var(--accent)}',
    '.sl-go{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;background:var(--accent);color:#fff !important;text-decoration:none !important;font-size:.88rem;font-weight:600}',
    '.sl-pv-o{margin-top:18px;font-size:.8rem;color:var(--fg-faint)}',
    '.sl-pv-o a{display:block;padding:3px 0;color:var(--fg-muted);text-decoration:none;font-size:.84rem}.sl-pv-o a:hover{color:var(--accent)}',
    '.sl-foot{display:flex;gap:16px;padding:8px 18px;border-top:1px solid var(--line);font-size:.76rem;color:var(--fg-faint)}',
    '@media (max-width:860px){.sl-foot{display:none}}'
  ].join('\n');

  var ICON = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="8.5" cy="8.5" r="6"/><path d="M13 13l5 5"/></svg>';
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  var el = {}, data = null, loading = false, state = { q: '', filter: '', expanded: {}, items: [], act: 0, res: null };

  /* ── 工具 ── */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function norm(s) {
    return String(s == null ? '' : s).replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xfee0); })
      .replace(/　/g, ' ').toLowerCase();
  }
  function terms(q) { return norm(q).split(/\s+/).filter(Boolean); }
  function hl(text, ts) {
    var s = esc(text);
    if (!ts.length) return s;
    var re = new RegExp('(' + ts.map(function (t) { return esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return s.replace(re, '<mark>$1</mark>');
  }
  function hrefOf(e) { return ROOT + e.url + (e.section ? '#section-' + e.section : ''); }
  function pageHref(e) { return ROOT + e.url; }
  function weekLabel(e) { return e.week ? '第 ' + e.week + ' 週' : ''; }
  function pathOf(e) { return [e.semester, e.subject, weekLabel(e)].filter(Boolean).join(' › '); }
  var here = decodeURIComponent(location.href.split('#')[0]);
  function isHere(e) { return decodeURIComponent(pageHref(e)) === here; }
  function getRecent() { try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) { return []; } }
  function addRecent(q) {
    q = q.trim(); if (!q) return;
    try { var a = getRecent().filter(function (x) { return x !== q; }); a.unshift(q); localStorage.setItem(RECENT_KEY, JSON.stringify(a.slice(0, 8))); } catch (e) {}
  }

  /* ── 資料 ──
     search-index.js（手寫的關鍵字與摘要）＋ search-fulltext.js（自動產生的全文，依章節／小節切開）
     兩者合併成一筆一章節；全文載入失敗時退回只用手寫索引。 */
  function rec(e, blocks, i) {
    var r = { e: e, i: i, t: norm(e.weekTitle), s: norm(e.sectionName), k: norm(e.keywords), x: norm(e.snippet),
              j: norm(e.subject + ' ' + e.semester), b: blocks || [], nh: [], nb: [], low: /(^|\/)index\.html$/.test(e.url) };
    for (var q = 0; q < r.b.length; q++) { r.nh.push(norm(r.b[q][0])); r.nb.push(norm(r.b[q][1])); }
    return r;
  }
  function prep() {
    var cur = typeof SEARCH_INDEX !== 'undefined' ? SEARCH_INDEX : [];   // eslint-disable-line no-undef
    var F = typeof SEARCH_FULLTEXT !== 'undefined' ? SEARCH_FULLTEXT : null;   // eslint-disable-line no-undef
    var byKey = {}, out = [], used = {};
    cur.forEach(function (e) { byKey[e.url + '#' + (e.section || '')] = e; });
    if (F) {
      F.secs.forEach(function (x) {
        var pg = F.pages[x[0]], key = pg[0] + '#' + x[1], c = byKey[key];
        var e = c || { subject: pg[1], semester: pg[2], week: pg[3], weekTitle: pg[4], url: pg[0], section: x[1], sectionName: x[2], keywords: '', snippet: '' };
        if (c) used[key] = 1;
        out.push(rec(e, x[3], out.length));
      });
    }
    cur.forEach(function (e) { var key = e.url + '#' + (e.section || ''); if (!used[key]) out.push(rec(e, null, out.length)); });
    return out;
  }
  function loadScript(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = function () { cb(true); }; s.onerror = function () { cb(false); }; document.head.appendChild(s); }
  function ensureData(cb) {
    if (data) return cb();
    if (loading) return;
    loading = true;
    el.list.innerHTML = '<div class="sl-empty">載入搜尋索引中…（第一次開啟需要幾秒）</div>';
    var need = [];
    if (typeof SEARCH_INDEX === 'undefined') need.push('search-index.js');   // eslint-disable-line no-undef
    if (typeof SEARCH_FULLTEXT === 'undefined') need.push('search-fulltext.js');   // eslint-disable-line no-undef
    (function next() {
      if (!need.length) { loading = false; data = prep(); return cb(); }
      loadScript(ROOT + need.shift(), next);
    })();
  }

  /* ── 比對與排序 ── */
  function score(d, ts) {
    var total = 0, hb = -1;
    for (var i = 0; i < ts.length; i++) {
      var t = ts[i], sc = 0, q;
      if (d.t.indexOf(t) >= 0) sc += d.t === t ? 30 : 14;
      if (d.s.indexOf(t) >= 0) sc += 9;
      if (d.k.indexOf(t) >= 0) sc += 4;
      if (d.x.indexOf(t) >= 0) sc += 3;
      if (d.j.indexOf(t) >= 0) sc += 2;
      for (q = 0; q < d.nh.length; q++) if (d.nh[q].indexOf(t) >= 0) { sc += 5; if (hb < 0) hb = q; break; }
      var cnt = 0;
      for (q = 0; q < d.nb.length && cnt < 4; q++) if (d.nb[q].indexOf(t) >= 0) { cnt++; if (hb < 0) hb = q; }
      sc += cnt ? 2 + cnt : 0;
      if (!sc) return null;            // 每個關鍵字都要出現（AND）
      total += sc;
    }
    if (d.low) total = Math.ceil(total / 2);   // 總覽頁排後面
    return { sc: total, hb: hb };
  }
  // 從全文中找出關鍵字前後的一小段，讓使用者看到「這個詞出現在什麼句子裡」
  function ctx(d, ts, bi) {
    var order = bi >= 0 ? [bi] : [];
    for (var q = 0; q < d.b.length; q++) if (q !== bi) order.push(q);
    for (var k = 0; k < order.length; k++) {
      var n = d.nb[order[k]], best = -1;
      ts.forEach(function (t) { var i = n.indexOf(t); if (i >= 0 && (best < 0 || i < best)) best = i; });
      if (best >= 0) {
        var raw = d.b[order[k]][1], st = Math.max(0, best - 28);
        return { sub: d.b[order[k]][0], text: (st > 0 ? '…' : '') + raw.slice(st, best + 72) + (best + 72 < raw.length ? '…' : '') };
      }
    }
    return null;
  }
  function snippetOf(d, ts, hb) {
    var x = d.x, has = ts.some(function (t) { return x.indexOf(t) >= 0; });
    if (d.e.snippet && (has || !d.b.length)) return { sub: hb >= 0 ? d.b[hb][0] : '', text: d.e.snippet };
    return ctx(d, ts, hb) || { sub: '', text: d.e.snippet || '' };
  }
  function search(q) {
    var ts = terms(q);
    if (!ts.length) return null;
    var subj = {}, order = [], nSec = 0, nPage = 0;
    data.forEach(function (d) {
      var r = score(d, ts); if (!r) return;
      nSec++;
      var key = d.e.subject;
      if (!subj[key]) { subj[key] = { name: key, sem: d.e.semester, pages: {}, porder: [], best: 0, n: 0 }; order.push(key); }
      var S = subj[key];
      if (!S.pages[d.e.url]) { S.pages[d.e.url] = { e: d.e, secs: [], best: 0 }; S.porder.push(d.e.url); nPage++; }
      var P = S.pages[d.e.url];
      P.secs.push({ d: d, sc: r.sc, hb: r.hb });
      if (r.sc > P.best) P.best = r.sc;
      S.n++;
    });
    var subjects = order.map(function (k) {
      var S = subj[k];
      S.list = S.porder.map(function (u) {
        var P = S.pages[u];
        P.secs.sort(function (a, b) { return b.sc - a.sc || a.d.i - b.d.i; });
        P.rank = P.best + Math.min(P.secs.length, 8);
        return P;
      }).sort(function (a, b) { return b.rank - a.rank; });
      S.best = S.list[0].rank;
      return S;
    }).sort(function (a, b) { return b.best - a.best; });
    var top = null;
    subjects.forEach(function (S) { if (!top || S.list[0].rank > top.rank) top = S.list[0]; });
    return { ts: ts, subjects: subjects, nSec: nSec, nPage: nPage, top: top };
  }

  /* ── 畫面 ── */
  function injectCSS() {
    if (document.querySelector('style[data-spotlight]')) return;
    var st = document.createElement('style'); st.setAttribute('data-spotlight', ''); st.textContent = CSS; document.head.appendChild(st);
  }
  function build() {
    injectCSS();
    var root = document.createElement('div');
    root.className = 'sl'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', '全站搜尋');
    root.innerHTML =
      '<div class="sl-back"></div>' +
      '<div class="sl-panel">' +
        '<div class="sl-bar">' + ICON +
          '<input class="sl-input" type="text" placeholder="搜尋全站：疾病、藥物、科目、章節…（空格分開可同時搜多個詞）" autocomplete="off" spellcheck="false">' +
          '<button type="button" class="sl-close" aria-label="關閉"><kbd>esc</kbd></button></div>' +
        '<div class="sl-meta"></div>' +
        '<div class="sl-body"><div class="sl-list"></div><aside class="sl-prev"></aside></div>' +
        '<div class="sl-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> 選擇章節</span><span><kbd>↵</kbd> 開啟</span><span><kbd>' + (isMac ? '⌘' : 'Ctrl') + '</kbd>+<kbd>↵</kbd> 新分頁</span><span><kbd>esc</kbd> 關閉</span></div>' +
      '</div>';
    document.body.appendChild(root);
    el.root = root; el.input = root.querySelector('.sl-input'); el.meta = root.querySelector('.sl-meta');
    el.list = root.querySelector('.sl-list'); el.prev = root.querySelector('.sl-prev');

    root.querySelector('.sl-back').addEventListener('click', close);
    root.querySelector('.sl-close').addEventListener('click', close);
    var t;
    el.input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = el.input.value; state.filter = ''; state.expanded = {}; render(); }, 60); });
    el.input.addEventListener('keydown', onKey);
    el.input.addEventListener('compositionstart', function () { composing = true; });
    el.input.addEventListener('compositionend', function () { setTimeout(function () { composing = false; }, 30); });
    el.meta.addEventListener('click', function (e) {
      var b = e.target.closest('.sl-chip'); if (!b) return;
      if (b.hasAttribute('data-recent')) { el.input.value = b.getAttribute('data-recent'); state.q = el.input.value; render(); el.input.focus(); return; }
      state.filter = b.getAttribute('data-f'); state.expanded = {}; render(); el.input.focus();
    });
    el.list.addEventListener('click', function (e) {
      var m = e.target.closest('.sl-more');
      if (m) { state.expanded[m.getAttribute('data-x')] = 1; render(true); return; }
      var r = e.target.closest('[data-recent]');
      if (r) { el.input.value = r.getAttribute('data-recent'); state.q = el.input.value; render(); el.input.focus(); return; }
      if (e.target.closest('a')) addRecent(state.q);
    });
    el.list.addEventListener('mousemove', function (e) {
      var a = e.target.closest('.sl-sec'); if (!a) return;
      var i = +a.getAttribute('data-n'); if (i !== state.act) setAct(i, false);
    });
    el.prev.addEventListener('click', function (e) { if (e.target.closest('a')) addRecent(state.q); });
  }

  function render(keepAct) {
    if (!data) return;
    var q = state.q.trim();
    if (!q) return renderEmpty();
    var res = search(q); state.res = res;
    if (!res || !res.subjects.length) {
      el.meta.innerHTML = '';
      el.list.innerHTML = '<div class="sl-empty">找不到「' + esc(q) + '」<br><small>試試英文名稱、縮寫，或拿掉一個關鍵字</small></div>';
      el.prev.innerHTML = ''; state.items = []; return;
    }
    var ts = res.ts;
    // 摘要列＋科目篩選
    var m = '<span class="sl-sum">「<b>' + esc(q) + '</b>」出現在 <b>' + res.subjects.length + '</b> 個科目、<b>' + res.nPage + '</b> 頁、<b>' + res.nSec + '</b> 個章節</span>';
    var nHere = 0;
    res.subjects.forEach(function (S) { S.list.forEach(function (P) { if (isHere(P.e)) nHere += P.secs.length; }); });
    if (state.filter === '§here' && !nHere) state.filter = '';
    if (res.subjects.length > 1 || nHere) {
      m += '<button type="button" class="sl-chip' + (state.filter ? '' : ' on') + '" data-f="">全部</button>';
      if (nHere) m += '<button type="button" class="sl-chip' + (state.filter === '§here' ? ' on' : '') + '" data-f="§here">只看本頁<small>' + nHere + '</small></button>';
      res.subjects.forEach(function (S) {
        m += '<button type="button" class="sl-chip' + (state.filter === S.name ? ' on' : '') + '" data-f="' + esc(S.name) + '">' + esc(S.name) + '<small>' + S.list.length + '</small></button>';
      });
    }
    el.meta.innerHTML = m;

    var items = [], h = '';
    function card(P, top) {
      var e = P.e, key = e.url, all = state.expanded[key] ? P.secs.length : Math.min(P.secs.length, SEC_LIMIT);
      var c = '<div class="sl-card' + (top ? ' top' : '') + '">' +
        '<a class="sl-ct" href="' + esc(hrefOf(P.secs[0].d.e)) + '">' + hl(e.weekTitle, ts) + (isHere(e) ? '<span class="sl-here">目前頁面</span>' : '') + '</a>' +
        '<div class="sl-path">' + esc(pathOf(e)) + '</div><div class="sl-secs">';
      for (var i = 0; i < all; i++) {
        var it = P.secs[i], d = it.d, n = items.length, sn = snippetOf(d, ts, it.hb);
        items.push({ d: d, P: P, hb: it.hb });
        c += '<a class="sl-sec" data-n="' + n + '" href="' + esc(hrefOf(d.e)) + '"><b>' + hl(d.e.sectionName, ts) + '</b>' +
          (sn.sub ? '<i> › ' + hl(sn.sub, ts) + '</i>' : '') + '<span>' + hl(sn.text, ts) + '</span></a>';
      }
      c += '</div>';
      if (P.secs.length > all) c += '<button type="button" class="sl-more" data-x="' + esc(key) + '">還有 ' + (P.secs.length - all) + ' 個章節 ▾</button>';
      return c + '</div>';
    }
    if (!state.filter && res.subjects.length > 1 && res.top) {
      h += '<div class="sl-topl">最佳結果</div><div class="sl-grid" style="margin-bottom:6px;">' + card(res.top, true) + '</div>';
    }
    res.subjects.forEach(function (S) {
      var onlyHere = state.filter === '§here';
      if (state.filter && !onlyHere && S.name !== state.filter) return;
      var pages = S.list.filter(function (P) { return onlyHere ? isHere(P.e) : (state.filter || res.subjects.length === 1 || P !== res.top); });
      if (!pages.length) return;
      var lim = state.expanded['§' + S.name] || state.filter ? pages.length : Math.min(pages.length, PAGE_LIMIT);
      h += '<div class="sl-h"><span class="sl-sem">' + esc(S.sem) + '</span>' + esc(S.name) + '<span class="sl-cnt">' + S.list.length + ' 頁・' + S.n + ' 個章節</span></div><div class="sl-grid">';
      for (var i = 0; i < lim; i++) h += card(pages[i], false);
      h += '</div>';
      if (pages.length > lim) h += '<button type="button" class="sl-more" data-x="§' + esc(S.name) + '">顯示這個科目全部 ' + pages.length + ' 頁 ▾</button>';
    });
    el.list.innerHTML = h;
    state.items = items;
    if (!keepAct) el.list.scrollTop = 0;
    setAct(keepAct ? Math.min(state.act, items.length - 1) : 0, false);
  }

  function renderEmpty() {
    state.items = []; state.res = null;
    var rec = getRecent();
    el.meta.innerHTML = rec.length ? '<span class="sl-sum">最近搜尋</span>' + rec.map(function (r) { return '<button type="button" class="sl-chip" data-recent="' + esc(r) + '">' + esc(r) + '</button>'; }).join('') : '';
    var subj = {}, order = [];
    data.forEach(function (d) {
      var k = d.e.subject;
      if (d.e.semester === '全站' || /\?/.test(d.e.url)) return;
      if (!subj[k]) { subj[k] = { sem: d.e.semester, pages: {}, first: d.e }; order.push(k); }
      subj[k].pages[d.e.url] = 1;
    });
    var h = '<div class="sl-h">瀏覽科目<span class="sl-cnt">輸入關鍵字，會列出它出現在哪些科目、頁面與章節</span></div><div class="sl-grid">';
    order.forEach(function (k) {
      var S = subj[k], n = Object.keys(S.pages).length;
      var idx = S.first.url.replace(/[^/]+$/, 'index.html');
      h += '<a class="sl-subj" href="' + esc(ROOT + idx) + '"><span>' + esc(k) + '</span><small>' + esc(S.sem) + '・' + n + ' 頁</small></a>';
    });
    el.list.innerHTML = h + '</div>';
    el.prev.innerHTML = '<div class="sl-pv-x">小技巧<br>・用空格同時搜多個詞，例如「<b>貓 牙周</b>」只列出兩個詞都出現的章節<br>・英文、縮寫都可以搜，例如「IBD」「ICPI」<br>・在任何頁面按 <kbd>' + (isMac ? '⌘' : 'Ctrl') + '</kbd>+<kbd>K</kbd> 或 <kbd>/</kbd> 都能叫出這個視窗</div>';
  }

  function setAct(i, scroll) {
    if (!state.items.length) { el.prev.innerHTML = ''; return; }
    if (i < 0) i = 0; if (i >= state.items.length) i = state.items.length - 1;
    state.act = i;
    el.list.querySelectorAll('.sl-sec.act').forEach(function (a) { a.classList.remove('act'); });
    var a = el.list.querySelector('.sl-sec[data-n="' + i + '"]');
    if (a) { a.classList.add('act'); if (scroll) a.scrollIntoView({ block: 'nearest' }); }
    preview(state.items[i]);
  }

  function preview(it) {
    var e = it.d.e, ts = state.res ? state.res.ts : [];
    var kws = String(e.keywords || '').split(/\s+/).filter(function (k) { return k.length > 1 || /[\w\u4e00-\u9fff]/.test(k); }).slice(0, 24);
    var h = '<div class="sl-pv-path">' + esc(pathOf(e)) + '</div>' +
      '<div class="sl-pv-t">' + hl(e.weekTitle, ts) + '</div>' +
      '<div class="sl-pv-s">§ ' + hl(e.sectionName, ts) + '</div>';
    if (e.snippet) h += '<p class="sl-pv-x">' + hl(e.snippet, ts) + '</p>';
    var d = it.d, hits = [];
    for (var q = 0; q < d.b.length && hits.length < 4; q++) {
      if (!ts.some(function (t) { return d.nb[q].indexOf(t) >= 0 || d.nh[q].indexOf(t) >= 0; })) continue;
      var c1 = ctx({ b: [d.b[q]], nb: [d.nb[q]] }, ts, 0);
      hits.push('<div class="sl-pv-hit">' + (d.b[q][0] ? '<b>' + hl(d.b[q][0], ts) + '</b>' : '') + '<span>' + hl(c1 ? c1.text : d.b[q][1].slice(0, 100), ts) + '</span></div>');
    }
    if (hits.length) h += '<div class="sl-pv-l">在這一節出現的位置</div>' + hits.join('');
    if (kws.length) h += '<div class="sl-pv-k">' + kws.map(function (k) {
      var nk = norm(k), hit = ts.some(function (t) { return nk.indexOf(t) >= 0; });
      return '<span' + (hit ? ' class="hit"' : '') + '>' + esc(k) + '</span>'; }).join('') + '</div>';
    h += '<a class="sl-go" href="' + esc(hrefOf(e)) + '">開啟這個章節 ↵</a>';
    var others = it.P.secs.filter(function (s) { return s.d !== it.d; });
    if (others.length) {
      h += '<div class="sl-pv-o">這一頁其他符合的章節（' + others.length + '）' + others.slice(0, 10).map(function (s) {
        return '<a href="' + esc(hrefOf(s.d.e)) + '">§ ' + hl(s.d.e.sectionName, ts) + '</a>'; }).join('') + '</div>';
    }
    el.prev.innerHTML = h;
  }

  function go(newTab) {
    var it = state.items[state.act]; if (!it) return;
    addRecent(state.q);
    var url = hrefOf(it.d.e);
    if (newTab) { window.open(url, '_blank'); return; }
    var samePage = decodeURIComponent(url.split('#')[0]) === here;
    close();
    if (samePage) { location.hash = url.split('#')[1] || ''; var id = it.d.e.section; if (id && typeof window.showSection === 'function') window.showSection(id); }
    else location.href = url;
  }

  // 中文／日文輸入法選字中：Enter 是確認選字、方向鍵是選候選字、Esc 是取消，都不能當成視窗的快捷鍵。
  // Safari 會先送 compositionend 再送 Enter 的 keydown（keyCode 229），所以結束後再保留一小段時間。
  var composing = false;
  function imeBusy(e) { return composing || e.isComposing || e.keyCode === 229; }
  function onKey(e) {
    if (imeBusy(e)) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setAct(state.act + 1, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(state.act - 1, true); }
    else if (e.key === 'Enter') { e.preventDefault(); go(e.metaKey || e.ctrlKey); }
  }

  /* ── 開關 ── */
  function open(q) {
    if (!el.root) build();
    el.root.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    if (typeof q === 'string' && q) el.input.value = q;
    el.input.focus(); el.input.select();
    ensureData(function () { state.q = el.input.value; render(); });
  }
  function close() {
    if (!el.root) return;
    el.root.classList.remove('open');
    document.documentElement.style.overflow = '';
  }
  function isOpen() { return el.root && el.root.classList.contains('open'); }
  window.openSpotlight = open;

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); if (isOpen()) close(); else open(); return; }
    if (isOpen()) {
      if (e.key === 'Escape' && !imeBusy(e)) { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      return;
    }
    if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      e.preventDefault(); open();
    }
  }, true);

  /* ── 頁首按鈕 ── */
  function mount() {
    var right = document.querySelector('header .header-right');
    if (!right || right.querySelector('.sl-trigger')) return;
    injectCSS();
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'sl-trigger'; b.title = '搜尋全站（' + (isMac ? '⌘' : 'Ctrl') + '+K）';
    b.innerHTML = ICON + '<span class="sl-tlabel">搜尋全站</span><kbd>' + (isMac ? '⌘' : 'Ctrl+') + 'K</kbd>';
    b.addEventListener('click', function () { open(); });
    // 頁首原本的搜尋框（總覽頁的跨科目搜尋、內頁的搜尋本頁）都改由這個視窗取代；
    // 只搜本頁請在視窗裡點「只看本頁」
    right.querySelectorAll('.search-wrap').forEach(function (old) { old.style.display = 'none'; });
    b.classList.add('wide'); b.querySelector('.sl-tlabel').textContent = '搜尋：疾病、藥物、章節…';
    var theme = right.querySelector('.theme-btn');
    right.insertBefore(b, theme || null);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
