/* ══════════════════════════════════════════════════════
   上群動物醫院 — 共用基礎腳本（主題切換 / 錨點路由）
   主題筆記頁與總覽頁皆載入此檔案
   ══════════════════════════════════════════════════════ */

// ── THEME ──
function toggleTheme() {
  const html = document.documentElement;
  const btn = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  });
})();

// ── WEEK-PAGE SECTION NAV ──
// 週次筆記頁使用：切換左側分節導覽
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById('section-' + id);
  const link = document.getElementById('nav-' + id);
  if (sec) sec.classList.add('active');
  if (link) link.classList.add('active');
}

// 支援從跨頁搜尋結果連結（例如 week01.html#section-sedation）直接跳到對應分節
document.addEventListener('DOMContentLoaded', function () {
  if (location.hash && location.hash.indexOf('#section-') === 0) {
    const id = location.hash.replace('#section-', '');
    if (document.getElementById('section-' + id)) showSection(id);
  }
});

// ── WEEK-PAGE IN-PAGE SEARCH ──
// 週次筆記頁使用：只搜尋本頁內容（各章節名稱由頁面自行提供 SECTION_NAMES 物件）
function closeSearch() {
  const box = document.getElementById('searchResults');
  const input = document.getElementById('searchInput');
  if (box) box.classList.remove('open');
  if (input) input.classList.remove('has-results');
}

document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-wrap')) closeSearch();
});

function doPageSearch(q, sectionNames) {
  const resultsBox = document.getElementById('searchResults');
  const input = document.getElementById('searchInput');
  q = q.trim();

  if (!q) { closeSearch(); resultsBox.innerHTML = ''; return; }

  const reg = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  const results = [];

  document.querySelectorAll('.section').forEach(section => {
    const sectionId = section.id.replace('section-', '');
    const sectionName = sectionNames[sectionId] || sectionId;

    section.querySelectorAll('td, li, p, h3, h4, .step-text, .card-title').forEach(el => {
      if (el.closest('script') || el.closest('style')) return;
      const text = el.textContent.trim();
      reg.lastIndex = 0;
      if (text && reg.test(text)) {
        reg.lastIndex = 0;
        const idx = text.search(reg);
        const start = Math.max(0, idx - 30);
        const end = Math.min(text.length, idx + 60);
        let snippet = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
        snippet = snippet.replace(reg, '<mark>$1</mark>');
        results.push({ sectionId, sectionName, snippet });
        reg.lastIndex = 0;
      }
    });
  });

  if (results.length === 0) {
    resultsBox.innerHTML = '<div class="sr-empty">找不到「' + q + '」相關結果</div>';
    resultsBox.classList.add('open');
    input.classList.add('has-results');
    return;
  }

  const bySection = {};
  results.forEach(r => {
    if (!bySection[r.sectionId]) bySection[r.sectionId] = { name: r.sectionName, items: [] };
    if (bySection[r.sectionId].items.length < 4) bySection[r.sectionId].items.push(r.snippet);
  });

  let html = '';
  let total = 0;
  Object.keys(bySection).forEach(sid => {
    const group = bySection[sid];
    total += group.items.length;
    html += '<div class="sr-header">' + group.name + '</div>';
    group.items.forEach(snippet => {
      html += '<div class="sr-item" onclick="showSection(\'' + sid + '\'); closeSearch();"><span class="sr-section">' + group.name + '</span><span class="sr-text">' + snippet + '</span></div>';
    });
  });
  html += '<div class="sr-count">共 ' + total + ' 筆結果（本頁內）</div>';

  resultsBox.innerHTML = html;
  resultsBox.classList.add('open');
  input.classList.add('has-results');
}
