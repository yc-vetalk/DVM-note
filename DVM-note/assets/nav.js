/* ══════════════════════════════════════════════════════
   yc._vetalk — 頂列導覽選單邏輯
   讀取 nav-data.js 的 SITE_NAV，建立頂列學期分頁；有科目的
   學期點擊展開下拉卡片選單，沒有科目的學期直接是一般連結。
   使用頁面需先放一個容器：
     <div id="siteNav" class="site-nav" data-base="../../" data-current="大四"></div>
   data-base：回網站根目錄的相對路徑（頂層 "" ／科目頁 "../" ／週次或主題頁 "../../"）
   data-current：目前所在學期的 id（不在任何學期時留空）
   還需要一個 <div id="navPanel" class="nav-panel"></div>
   放在 header 之後（誰包含它不重要，此檔案用 fixed 定位）。
   ══════════════════════════════════════════════════════ */

function initSiteNav(containerId, panelId) {
  const container = document.getElementById(containerId);
  const panel = document.getElementById(panelId);
  if (!container || !panel || typeof SITE_NAV === 'undefined') return;

  const base = container.getAttribute('data-base') || '';
  const current = container.getAttribute('data-current') || '';
  let openId = null;

  function closePanel() {
    panel.classList.remove('open');
    panel.innerHTML = '';
    container.querySelectorAll('.site-nav-tab').forEach(t => t.classList.remove('is-open'));
    openId = null;
  }

  function renderPanel(cat) {
    let body;
    if (!cat.topics.length) {
      body = '<div class="nav-panel-empty">尚無主題筆記，之後會依實習進度陸續補上。</div>';
    } else {
      body = '<div class="nav-panel-grid">' + cat.topics.map(function (t) {
        return '<a class="nav-panel-card" href="' + base + t.url + '">' +
                 '<span class="icon">' + cat.icon + '</span>' +
                 '<span class="txt"><h4>' + t.title + '</h4><p>' + t.desc + '</p></span>' +
               '</a>';
      }).join('') + '</div>';
    }
    panel.innerHTML =
      '<div class="nav-panel-inner">' +
        '<div class="nav-panel-head">' +
          '<h3>' + cat.icon + ' ' + cat.id + '</h3>' +
          '<a href="' + base + cat.url + '">查看科別頁 →</a>' +
        '</div>' +
        body +
      '</div>';
    panel.classList.add('open');
  }

  SITE_NAV.forEach(function (cat) {
    const hasTopics = cat.topics && cat.topics.length > 0;
    const tab = document.createElement(hasTopics ? 'button' : 'a');
    tab.className = 'site-nav-tab';
    if (cat.id === current) tab.classList.add('is-current');

    if (hasTopics) {
      tab.type = 'button';
      tab.innerHTML = cat.label + ' <span class="chev">▾</span>';
      tab.addEventListener('click', function (e) {
        e.stopPropagation();
        if (openId === cat.id) { closePanel(); return; }
        container.querySelectorAll('.site-nav-tab').forEach(function (t) { t.classList.remove('is-open'); });
        tab.classList.add('is-open');
        openId = cat.id;
        renderPanel(cat);
      });
    } else {
      tab.href = base + cat.url;
      tab.textContent = cat.label;
    }
    container.appendChild(tab);
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-panel') && !e.target.closest('.site-nav')) closePanel();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
  });
}

/* 圖片載入失敗時（公開網站上不收錄的教科書／講義截圖），改顯示佔位卡，
   標出「這裡本來有圖」並保留說明文字；本機版圖片存在時不受影響。 */
(function () {
  function placeholder(img) {
    if (img.dataset.missingHandled) return;
    img.dataset.missingHandled = '1';
    var fig = img.closest('.figure, .fig');
    var cap = fig ? fig.querySelector('.figure-caption, figcaption') : null;
    var src = fig ? fig.querySelector('.figure-source') : null;
    var box = document.createElement('div');
    box.className = 'figure-missing';
    box.innerHTML =
      '<div class="figure-missing__label">📖 此處有圖（教科書／講義截圖）</div>' +
      '<div class="figure-missing__desc"></div>' +
      '<div class="figure-missing__hint">版權因素未放上公開網站，請用本機版開啟查看' +
      (src ? '（' + src.textContent.replace(/^來源[:：]\s*/, '') + '）' : '') + '</div>';
    box.querySelector('.figure-missing__desc').textContent = img.alt || (cap ? cap.textContent : '');
    img.replaceWith(box);
  }
  window.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG') placeholder(t);
  }, true);
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('img').forEach(function (img) {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
        var probe = new Image();               // SVG 的 naturalWidth 可能是 0，重新載入一次確認真的失敗
        probe.onerror = function () { placeholder(img); };
        probe.src = img.src;
      }
    });
  });
})();

/* 圖片點開放大：內容區的圖片點一下全螢幕檢視。
   - 左右鍵、畫面上的箭頭或手機左右滑動：切換同一頁的上一張／下一張
   - 點圖片：在「符合畫面」與「原始大小」之間切換（原始大小可拖曳捲動）
   - Esc、右上角 ×、點黑色背景：關閉
   樣式由這段程式自己插入，不必改各頁的 CSS。
   不想被放大的圖片加 data-no-zoom；包在連結裡的圖片維持原本的連結行為。 */
(function () {
  var CSS =
    '.pagebody img:not([data-no-zoom]), .homewrap img:not([data-no-zoom]) { cursor: zoom-in; }' +
    '.lb { position: fixed; inset: 0; z-index: 1000; display: none; flex-direction: column; background: rgba(12,10,8,.94); color: #f2ede8; }' +
    '.lb.open { display: flex; }' +
    '.lb__bar { display: flex; align-items: center; gap: 12px; padding: 10px 14px; font-size: 14px; flex: none; }' +
    '.lb__count { opacity: .75; font-variant-numeric: tabular-nums; }' +
    '.lb__hint { opacity: .55; font-size: 12px; margin-left: auto; }' +
    '.lb__btn { font: inherit; width: 40px; height: 40px; border: 0; border-radius: 50%; background: rgba(255,255,255,.12); color: #fff; font-size: 22px; line-height: 40px; cursor: pointer; flex: none; }' +
    '.lb__btn:hover { background: rgba(255,255,255,.24); }' +
    '.lb__stage { position: relative; flex: 1; min-height: 0; overflow: auto; display: flex; align-items: center; justify-content: center; }' +
    '.lb__img { max-width: 96vw; max-height: 100%; object-fit: contain; cursor: zoom-in; background: #fff; border-radius: 6px; user-select: none; -webkit-user-drag: none; }' +
    '.lb.zoomed .lb__stage { display: block; }' +
    '.lb.zoomed .lb__img { max-width: none; max-height: none; cursor: zoom-out; border-radius: 0; margin: auto; }' +
    '.lb__nav { position: absolute; top: 50%; transform: translateY(-50%); }' +
    '.lb__prev { left: 10px; } .lb__next { right: 10px; }' +
    '.lb.zoomed .lb__nav, .lb.single .lb__nav { display: none; }' +
    '.lb__cap { flex: none; max-height: 28vh; overflow: auto; padding: 10px 18px 16px; font-size: 14px; line-height: 1.6; text-align: center; opacity: .9; }' +
    '.lb__cap:empty { display: none; }' +
    '@media (max-width: 720px) { .lb__hint { display: none; } .lb__nav { width: 34px; height: 34px; line-height: 34px; font-size: 18px; } .lb__cap { font-size: 13px; } }';

  var box, img, cap, count, list = [], idx = 0, lastFocus = null, touchX = null;

  function eligible(el) {
    if (!el || el.tagName !== 'IMG' || el.hasAttribute('data-no-zoom')) return false;
    if (el.closest('a, button, .lb, header, .nav-panel')) return false;
    if (!el.closest('.pagebody, .homewrap, main')) return false;
    return el.naturalWidth === 0 || el.naturalWidth >= 80;
  }
  function captionFor(el) {
    var fig = el.closest('.figure, .fig, figure');
    var c = fig && fig.querySelector('.figure-caption, figcaption');
    var s = fig && fig.querySelector('.figure-source');
    var text = c ? c.textContent.trim() : (el.alt || '');
    if (s) text += (text ? '\n' : '') + s.textContent.trim();
    return text;
  }
  function build() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    box = document.createElement('div');
    box.className = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', '圖片放大檢視');
    box.innerHTML =
      '<div class="lb__bar"><span class="lb__count"></span><span class="lb__hint">點圖片看原始大小　←／→ 切換　Esc 關閉</span>' +
      '<button type="button" class="lb__btn lb__close" aria-label="關閉">×</button></div>' +
      '<div class="lb__stage"><button type="button" class="lb__btn lb__nav lb__prev" aria-label="上一張">‹</button>' +
      '<img class="lb__img" alt=""><button type="button" class="lb__btn lb__nav lb__next" aria-label="下一張">›</button></div>' +
      '<div class="lb__cap"></div>';
    document.body.appendChild(box);
    img = box.querySelector('.lb__img'); cap = box.querySelector('.lb__cap'); count = box.querySelector('.lb__count');
    box.querySelector('.lb__close').addEventListener('click', close);
    box.querySelector('.lb__prev').addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    box.querySelector('.lb__next').addEventListener('click', function (e) { e.stopPropagation(); go(1); });
    img.addEventListener('click', function (e) { e.stopPropagation(); box.classList.toggle('zoomed'); });
    box.querySelector('.lb__stage').addEventListener('click', function (e) { if (e.target === this) close(); });
    box.addEventListener('touchstart', function (e) { touchX = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (touchX === null || box.classList.contains('zoomed')) return;
      var dx = e.changedTouches[0].clientX - touchX; touchX = null;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    });
  }
  function show(i) {
    idx = (i + list.length) % list.length;
    var el = list[idx];
    box.classList.remove('zoomed');
    img.src = el.currentSrc || el.src; img.alt = el.alt || '';
    cap.textContent = captionFor(el);
    cap.style.whiteSpace = 'pre-line';
    count.textContent = list.length > 1 ? (idx + 1) + ' / ' + list.length : '';
    box.classList.toggle('single', list.length < 2);
  }
  function go(d) { if (list.length > 1) show(idx + d); }
  function open(el) {
    if (!box) build();
    list = Array.prototype.filter.call(document.querySelectorAll('img'), function (x) { return eligible(x) && x.naturalWidth > 0; });
    var i = list.indexOf(el); if (i < 0) { list = [el]; i = 0; }
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    box.querySelector('.lb__close').focus();
  }
  function close() {
    box.classList.remove('open', 'zoomed');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var el = e.target;
    if (eligible(el) && el.naturalWidth > 0) { e.preventDefault(); open(el); }
  });
  document.addEventListener('keydown', function (e) {
    if (!box || !box.classList.contains('open')) return;
    if (e.key === 'Escape') { if (box.classList.contains('zoomed')) box.classList.remove('zoomed'); else close(); }
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });
  window.openImageViewer = open;   // 讓其他腳本也能叫出檢視器
})();

// 目錄捲動：目前高亮的項目若在目錄可視範圍外，自動把目錄捲過去（只捲目錄本身，不動整頁）
(function () {
  function keepVisible(toc) {
    var a = toc.querySelector('a.active, a.is-active');
    if (!a || toc.scrollHeight <= toc.clientHeight) return;
    var top = a.getBoundingClientRect().top - toc.getBoundingClientRect().top + toc.scrollTop, bottom = top + a.offsetHeight;
    if (top < toc.scrollTop + 24) toc.scrollTop = Math.max(0, top - 48);
    else if (bottom > toc.scrollTop + toc.clientHeight - 24) toc.scrollTop = bottom - toc.clientHeight + 48;
  }
  function init() {
    document.querySelectorAll('nav.toc').forEach(function (toc) {
      new MutationObserver(function () { keepVisible(toc); }).observe(toc, { subtree: true, attributes: true, attributeFilter: ['class'] });
      keepVisible(toc);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();

/* 考前重點收藏：內頁的表格、提示框、圖、流程、卡片組、練習題右上角有 ☆，
   點一下就把那一塊的「當下內容」存進這台裝置的瀏覽器（localStorage），
   集中顯示在網站根目錄的 考前重點.html。
   存的是內容快照，原頁之後改版不會影響已收藏的內容；要更新就到原頁重新收藏。 */
(function () {
  var KEY = 'review-pins-v1';
  var SEL = '.pagebody .table-wrap, .pagebody .alert, .pagebody .figure, .pagebody .flow, .pagebody .overview, ' +
            '.pagebody .grid-2, .pagebody .grid-3, .pagebody .grid-4, .pagebody .quiz-item';
  var CSS =
    '.pin-host { position: relative; }' +
    '.pin-btn { position: absolute; top: 6px; right: 6px; z-index: 5; width: 30px; height: 30px; padding: 0; border: 1px solid var(--line, #ddd); border-radius: 50%;' +
    ' background: var(--bg, #fff); color: var(--fg-faint, #999); font-size: 16px; line-height: 28px; text-align: center; cursor: pointer; opacity: .35; transition: opacity .15s, color .15s, background .15s; }' +
    '.pin-host:hover > .pin-btn, .pin-btn:focus-visible { opacity: 1; }' +
    '.pin-btn.on { opacity: 1; color: #fff; background: var(--accent, #7a5c45); border-color: var(--accent, #7a5c45); }' +
    '@media (hover: none) { .pin-btn { opacity: .6; } }' +
    '.pin-wrap { position: relative; }' +
    '.pin-wrap > .pin-btn { top: -14px; right: 4px; }' +
    '.pin-fab { position: fixed; right: 16px; bottom: 16px; z-index: 900; display: none; padding: 9px 14px; border-radius: 999px; background: var(--accent, #7a5c45); color: #fff !important;' +
    ' font-size: 14px; font-weight: 700; text-decoration: none !important; box-shadow: 0 6px 20px rgba(0,0,0,.18); }' +
    '.pin-fab.show { display: inline-block; }' +
    '.pin-toast { position: fixed; left: 50%; bottom: 70px; z-index: 950; transform: translateX(-50%); padding: 8px 16px; border-radius: 999px; background: rgba(30,25,20,.9); color: #fff;' +
    ' font-size: 14px; opacity: 0; transition: opacity .2s; pointer-events: none; }' +
    '.pin-toast.show { opacity: 1; }';

  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); return true; } catch (e) { return false; } }
  window.ReviewPins = { KEY: KEY, load: load, save: save };

  function rootHref() {
    var nav = document.getElementById('siteNav');
    var base = nav ? (nav.getAttribute('data-base') || '') : '';
    return new URL(base || './', location.href).href;
  }
  function relToRoot(href, root) {
    try { var a = new URL(href, location.href).href; return a.indexOf(root) === 0 ? a.slice(root.length) : a; } catch (e) { return href; }
  }
  function text(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }

  function init() {
    if (!document.querySelector('.pagebody') || document.body.getAttribute('data-page') === 'review') { fab(); return; }
    var st = document.createElement('style'); st.setAttribute('data-pin', ''); st.textContent = CSS; document.head.appendChild(st);
    var root = rootHref();
    var page = relToRoot(location.href.split('#')[0], root);
    var pageTitle = text(document.querySelector('.page-title')) || document.title;
    var crumbs = document.querySelectorAll('.breadcrumb a');
    var subject = crumbs.length > 1 ? text(crumbs[crumbs.length - 1]) : '';
    var counter = {};
    var blocks = [].filter.call(document.querySelectorAll(SEL), function (el) {
      // 外層已經可收藏時，內層不再加星號（例如提示框裡的表格、卡片組裡的圖）
      var p = el.parentElement;
      while (p && !p.classList.contains('pagebody')) { if (p.matches && p.matches(SEL)) return false; p = p.parentElement; }
      return true;
    });
    blocks.forEach(function (el) {
      var sec = el.closest('.section');
      var secId = sec ? sec.id : '';
      counter[secId] = (counter[secId] || 0) + 1;
      var id = page + '#' + secId + '#' + counter[secId] + '#' + text(el).slice(0, 24);
      var host = el;
      if (el.classList.contains('table-wrap')) {
        var w = document.createElement('div'); w.className = 'pin-wrap';
        el.parentNode.insertBefore(w, el); w.appendChild(el); host = w;
      } else el.classList.add('pin-host');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pin-btn'; b.textContent = '☆';
      b.setAttribute('aria-label', '加入考前重點'); b.title = '加入考前重點';
      host.appendChild(b);
      function paint(on) { b.classList.toggle('on', on); b.textContent = on ? '★' : '☆'; b.title = on ? '已在考前重點（再點一次移除）' : '加入考前重點'; }
      paint(load().some(function (x) { return x.id === id; }));
      b.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var a = load(), i = -1;
        a.forEach(function (x, k) { if (x.id === id) i = k; });
        if (i >= 0) { a.splice(i, 1); save(a); paint(false); toast('已從考前重點移除'); fab(); return; }
        var c = el.cloneNode(true);
        c.querySelectorAll('.pin-btn').forEach(function (x) { x.remove(); });
        c.classList.remove('pin-host');
        c.querySelectorAll('[src]').forEach(function (x) { x.setAttribute('src', relToRoot(x.getAttribute('src'), root)); });
        c.querySelectorAll('a[href]').forEach(function (x) {
          var h = x.getAttribute('href');
          if (h.charAt(0) === '#') x.setAttribute('href', page + h); else if (!/^[a-z]+:/i.test(h)) x.setAttribute('href', relToRoot(h, root));
        });
        c.querySelectorAll('[onclick]').forEach(function (x) { x.removeAttribute('onclick'); });
        c.querySelectorAll('details').forEach(function (x) { x.removeAttribute('open'); });
        var h2 = sec ? sec.querySelector('.section-head h2') : null;
        var h2t = h2 ? h2.cloneNode(true) : null;
        if (h2t) h2t.querySelectorAll('.lv, .tag').forEach(function (x) { x.remove(); });
        var prevH = null, n = el;
        while (n && n !== sec) { var s = n.previousElementSibling; while (s) { if (/^H[34]$/.test(s.tagName)) { prevH = s; break; } s = s.previousElementSibling; } if (prevH) break; n = n.parentElement; }
        var sub = prevH ? prevH.cloneNode(true) : null;
        if (sub) sub.querySelectorAll('.lv, .tag').forEach(function (x) { x.remove(); });
        a.push({ id: id, page: page, anchor: secId, pageTitle: pageTitle, subject: subject,
                 section: text(h2t), sub: text(sub), html: c.outerHTML, savedAt: new Date().toISOString() });
        if (!save(a)) { toast('儲存空間不足，無法收藏'); return; }
        paint(true); toast('已加入考前重點'); fab();
      });
    });
    fab();
  }
  function fab() {
    if (document.body.getAttribute('data-page') === 'review') return;
    var f = document.querySelector('.pin-fab');
    if (!f) {
      if (!document.querySelector('style[data-pin]')) { var st = document.createElement('style'); st.setAttribute('data-pin', ''); st.textContent = CSS; document.head.appendChild(st); }
      f = document.createElement('a'); f.className = 'pin-fab'; f.href = rootHref() + '考前重點.html'; document.body.appendChild(f);
    }
    var n = load().length;
    f.textContent = '★ 考前重點 ' + n;
    f.classList.toggle('show', n > 0);
  }
  var tt;
  function toast(msg) {
    var t = document.querySelector('.pin-toast');
    if (!t) { t = document.createElement('div'); t.className = 'pin-toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 1400);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
