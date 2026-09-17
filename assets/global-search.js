/* ══════════════════════════════════════════════════════
   yc._vetalk — 跨科目／跨週次搜尋
   讀取 search-index.js 提供的 SEARCH_INDEX 陣列。
   使用此檔案的頁面須先定義全域變數 SITE_ROOT，
   例如頂層 index.html 用 ""，科目總覽頁用 "../../"。
   ══════════════════════════════════════════════════════ */

function initGlobalSearch(inputId, resultsId) {
  const input = document.getElementById(inputId);
  const resultsBox = document.getElementById(resultsId);
  if (!input || !resultsBox) return;

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-wrap')) {
      resultsBox.classList.remove('open');
      input.classList.remove('has-results');
    }
  });

  input.addEventListener('input', function () {
    runGlobalSearch(input.value, input, resultsBox);
  });
}

function runGlobalSearch(q, input, resultsBox) {
  q = q.trim();
  const root = typeof SITE_ROOT !== 'undefined' ? SITE_ROOT : '';
  const index = typeof SEARCH_INDEX !== 'undefined' ? SEARCH_INDEX : [];

  if (!q) {
    resultsBox.classList.remove('open');
    input.classList.remove('has-results');
    resultsBox.innerHTML = '';
    return;
  }

  const reg = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  const matched = [];

  index.forEach(item => {
    const haystack = [item.subject, item.weekTitle, item.sectionName, item.keywords, item.snippet].join(' ');
    reg.lastIndex = 0;
    if (reg.test(haystack)) {
      matched.push(item);
    }
  });

  if (matched.length === 0) {
    resultsBox.innerHTML = '<div class="sr-empty">找不到「' + q + '」相關結果</div>';
    resultsBox.classList.add('open');
    input.classList.add('has-results');
    return;
  }

  // 依 科目 > 週次 分組
  const groups = {};
  const order = [];
  matched.forEach(item => {
    const key = item.subject;
    if (!groups[key]) { groups[key] = []; order.push(key); }
    if (groups[key].length < 6) groups[key].push(item);
  });

  let html = '';
  let total = 0;
  order.forEach(subject => {
    html += '<div class="sr-header">' + subject + '</div>';
    groups[subject].forEach(item => {
      total++;
      let snippet = item.snippet;
      reg.lastIndex = 0;
      snippet = snippet.replace(reg, '<mark>$1</mark>');
      const href = root + item.url + (item.section ? ('#section-' + item.section) : '');
      const weekLabel = item.week ? ('第 ' + item.week + ' 週　' + item.weekTitle) : item.weekTitle;
      html += '<a class="sr-item" href="' + href + '">' +
                '<span class="sr-section">' + weekLabel + (item.sectionName ? ('　·　' + item.sectionName) : '') + '</span>' +
                '<span class="sr-text">' + snippet + '</span>' +
              '</a>';
    });
  });
  html += '<div class="sr-count">共 ' + total + ' 筆結果（跨科目／週次）</div>';

  resultsBox.innerHTML = html;
  resultsBox.classList.add('open');
  input.classList.add('has-results');
}
