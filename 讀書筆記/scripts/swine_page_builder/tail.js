function showSection(id) {
  const el = document.getElementById('section-' + id);
  if (el) el.scrollIntoView({ block: 'start' });
  setActive(id);
}
function setActive(id) {
  document.querySelectorAll('nav.toc a').forEach(a => a.classList.remove('active'));
  const a = document.getElementById('nav-' + id);
  if (a) a.classList.add('active');
}
(function () {
  const secs = [...document.querySelectorAll('.section[id^="section-"]')];
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) setActive(e.target.id.replace('section-', '')); });
  }, { rootMargin: '-15% 0px -75% 0px' });
  secs.forEach(sec => io.observe(sec));
})();
function toggleTheme() {
  const html = document.documentElement, btn = document.getElementById('themeBtn');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  btn.textContent = isDark ? '🌙' : '☀️';
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}
(function(){ const t=localStorage.getItem('theme'); if(t){ document.documentElement.setAttribute('data-theme',t); document.getElementById('themeBtn').textContent = t==='dark'?'☀️':'🌙'; } })();

document.addEventListener('DOMContentLoaded', function () {
  if (location.hash && location.hash.indexOf('#section-') === 0) {
    const id = location.hash.replace('#section-', '');
    if (document.getElementById('section-' + id)) showSection(id);
  }
});

const SECTION_NAMES = {
/*SECTION_NAMES*/
};

document.addEventListener('click', function (e) {
  if (!e.target.closest('.search-wrap')) closeSearch();
});

function closeSearch() {
  document.getElementById('searchResults').classList.remove('open');
  document.getElementById('searchInput').classList.remove('has-results');
}

function doSearch(q) {
  const resultsBox = document.getElementById('searchResults');
  const input = document.getElementById('searchInput');
  q = q.trim();

  if (!q) { closeSearch(); resultsBox.innerHTML = ''; return; }

  const reg = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  const results = [];

  document.querySelectorAll('.section').forEach(section => {
    const sectionId = section.id.replace('section-', '');
    const sectionName = SECTION_NAMES[sectionId] || sectionId;

    section.querySelectorAll('td, li, p, h3, h4, .step-text, .card-title, .quiz-q, .quiz-explain, .figure-caption').forEach(el => {
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
  html += '<div class="sr-count">共 ' + total + ' 筆結果</div>';

  resultsBox.innerHTML = html;
  resultsBox.classList.add('open');
  input.classList.add('has-results');
}
