/* ══════════════════════════════════════════════════════
   上群 網頁筆記 — 頂列導覽選單邏輯
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
