/* ══════════════════════════════════════════════════════
   上群動物醫院 — 頂列導覽選單邏輯
   讀取 nav-data.js 的 SITE_NAV，建立頂列科別分頁；有主題的
   科別點擊展開下拉卡片選單，沒有主題的科別直接是一般連結。
   使用頁面需先放一個容器：
     <div id="siteNav" class="site-nav" data-base="../" data-current="外科"></div>
   data-base：回網站根目錄的相對路徑（頂層 "" ／科別或主題頁 "../"）
   data-current：目前所在科別的 id（不在任何科別時留空）
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
