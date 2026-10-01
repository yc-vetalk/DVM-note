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
