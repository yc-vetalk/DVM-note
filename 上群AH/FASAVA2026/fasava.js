/* FASAVA 2026 頁面邏輯：三天分頁、課表、科別卡片、詳情視窗。資料在 fasava-data.js */
(function () {
  // 講義、錄音、逐字稿都在 repo 外的 2026 Fasava/，經由 symlink 研討會講義/FASAVA2026/場次 連過去
  const FILE_BASE = '../../研討會講義/FASAVA2026/場次/';
  const SITE_BASE = '../';
  // PDF 不進 git，只有本機（直接開檔或本機伺服器）才放連結
  const IS_LOCAL = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const material = name => FASAVA_MATERIALS[name] || { notes: [] };
  const fileUrl = path => FILE_BASE + path.split('/').map(encodeURIComponent).join('/');
  const ALL_FILES = typeof FASAVA_FILES === 'undefined' ? {} : FASAVA_FILES;
  const KIND_LABEL = { pdf: '講義', audio: '錄音', text: '逐字稿' };

  /* 把課表攤平：每一節（日期＋廳＋第幾節）一筆 */
  const sessions = [];
  FASAVA_DAYS.forEach(day => {
    let slot = 0;
    day.rows.forEach(row => {
      if (!row.cells) return;
      slot++;
      row.cells.forEach((c, i) => {
        const key = day.id + '|' + FASAVA_ROOMS[i] + '|' + slot;
        sessions.push({ day, slot, key, time: row.time, room: FASAVA_ROOMS[i], spec: c[0], name: c[1], lang: c[2], files: ALL_FILES[key] || [] });
      });
    });
  });
  const sessionByKey = Object.fromEntries(sessions.map(s => [s.key, s]));
  const count = (files, kind) => files.filter(f => f[0] === kind).length;
  // 直接放在廳資料夾、沒分到節的檔案（例如 11/2 H 廳），歸給那天那個廳的講者
  const looseFiles = s => ALL_FILES[s.day.id + '|' + s.room + '|0'] || [];
  const hasSession = s => s.files.length + looseFiles(s).length + material(s.name).notes.length > 0;

  function badges(notes, files) {
    const out = [];
    if (notes) out.push('<span class="fas-badge fas-badge--note">筆記 ' + notes + '</span>');
    if (count(files, 'pdf')) out.push('<span class="fas-badge fas-badge--pdf">講義 ' + count(files, 'pdf') + '</span>');
    if (count(files, 'audio')) out.push('<span class="fas-badge">錄音</span>');
    if (count(files, 'text')) out.push('<span class="fas-badge">逐字稿</span>');
    return out.join('');
  }

  /* ---------- 課表 ---------- */
  function renderDay(id) {
    const day = FASAVA_DAYS.find(d => d.id === id) || FASAVA_DAYS[0];
    document.querySelectorAll('.fas-tab').forEach(t => {
      const on = t.dataset.day === day.id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    const head = '<div class="fas-row fas-row--head" aria-hidden="true"><div class="fas-time"></div>' +
      FASAVA_ROOMS.map(r => '<div class="fas-roomhead">' + r + '</div>').join('') + '</div>';
    const rows = day.rows.map(row => {
      if (!row.cells) {
        return '<div class="fas-row fas-row--note' + (row.event ? ' is-event' : '') + '"><div class="fas-time">' + esc(row.time) + '</div>' +
          '<div class="fas-notecell"><b>' + esc(row.note) + '</b>' + (row.sub ? '<span>' + esc(row.sub) + '</span>' : '') + '</div></div>';
      }
      return '<div class="fas-row"><div class="fas-time">' + esc(row.time) + '</div>' + row.cells.map((c, i) => {
        const s = sessions.find(x => x.day === day && x.time === row.time && x.room === FASAVA_ROOMS[i]);
        const sp = FASAVA_SPECIALTIES[c[0]], ok = hasSession(s);
        const inner = '<span class="fas-room">' + FASAVA_ROOMS[i] + ' 廳</span>' +
          '<span class="fas-spec">' + esc(sp[0]) + '</span><span class="fas-specen">' + esc(sp[1]) + '</span>' +
          '<span class="fas-name">' + esc(c[1]) + '</span><span class="fas-lang">' + esc(c[2]) + '</span>' +
          (ok ? '<span class="fas-badges">' + badges(material(c[1]).notes.length, s.files.concat(looseFiles(s))) + '</span>' : '');
        return ok
          ? '<button type="button" class="fas-cell has-material" data-key="' + esc(s.key) + '">' + inner + '</button>'
          : '<div class="fas-cell">' + inner + '</div>';
      }).join('') + '</div>';
    }).join('');
    document.getElementById('fasGrid').innerHTML = head + rows;
    document.getElementById('fasPanel').setAttribute('aria-labelledby', 'fasTab' + day.id);
  }

  /* ---------- 科別卡片：有筆記的排前面，再來是有講義的，其餘照課表順序 ---------- */
  function renderTopics() {
    const cards = Object.keys(FASAVA_SPECIALTIES).map((key, order) => {
      const names = [...new Set(sessions.filter(s => s.spec === key).map(s => s.name))];
      const notes = names.reduce((n, x) => n + material(x).notes.length, 0);
      const rooms = [...new Set(sessions.filter(s => s.spec === key).map(s => s.day.id + '|' + s.room + '|0'))];
      const pdfs = sessions.filter(s => s.spec === key).reduce((n, s) => n + count(s.files, 'pdf'), 0) +
        rooms.reduce((n, k) => n + count(ALL_FILES[k] || [], 'pdf'), 0);
      return { key, order, names, notes, pdfs };
    }).sort((a, b) => (b.notes - a.notes) || (b.pdfs - a.pdfs) || (a.order - b.order));
    document.getElementById('fasTopics').innerHTML = cards.map(c => {
      const sp = FASAVA_SPECIALTIES[c.key];
      const status = c.notes || c.pdfs
        ? (c.notes ? '<span class="fas-badge fas-badge--note">筆記 ' + c.notes + '</span>' : '') + (c.pdfs ? '<span class="fas-badge fas-badge--pdf">講義 ' + c.pdfs + '</span>' : '')
        : '<span class="fas-badge">尚無資料</span>';
      return '<li><button type="button" class="fas-topic' + (c.notes || c.pdfs ? '' : ' is-empty') + '" data-topic="' + c.key + '">' +
        '<span class="fas-topic__en">' + esc(sp[1]) + '</span><span class="fas-topic__zh">' + esc(sp[0]) + '</span>' +
        '<span class="fas-topic__names">' + c.names.map(esc).join('、') + '</span>' +
        '<span class="fas-badges">' + status + '</span></button></li>';
    }).join('');
  }

  /* ---------- 詳情視窗（點課表的格子或科別卡片都開這個） ---------- */
  function speakerLoose(name) {
    const seen = new Set(), out = [];
    sessions.filter(s => s.name === name).forEach(s => {
      const k = s.day.id + '|' + s.room;
      if (!seen.has(k)) { seen.add(k); out.push(...looseFiles(s)); }
    });
    return out;
  }

  function fileList(files) {
    if (!IS_LOCAL) {
      const n = Object.keys(KIND_LABEL).map(k => count(files, k) ? KIND_LABEL[k] + ' ' + count(files, k) : '').filter(Boolean).join('、');
      return '<p class="fas-empty">' + n + '，只存放在本機，這個網址打不開。</p>';
    }
    return '<ul class="fas-list">' + files.map(f => '<li><a href="' + fileUrl(f[2]) + '" target="_blank" rel="noopener">' + esc(f[1]) + '</a>' +
      (f[0] !== 'pdf' && !f[1].includes(KIND_LABEL[f[0]]) ? '<span class="fas-kind">' + KIND_LABEL[f[0]] + '</span>' : '') + '</li>').join('') + '</ul>';
  }

  // focus：從課表格子點進來時，那一節排最前面並標示
  function speakerBlock(name, focus) {
    const m = material(name);
    const times = sessions.filter(s => s.name === name);
    if (focus) times.sort((a, b) => (b.key === focus) - (a.key === focus));
    const lang = times[0] ? times[0].lang : '';
    let html = '<section class="fas-sp"><h3>' + esc(name) + '</h3>' + (lang ? '<p class="fas-sp__meta">' + esc(lang) + '</p>' : '');
    if (m.talks && m.talks.length) {
      html += '<h4>官網講題</h4><ul class="fas-list">' + m.talks.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>';
    }
    if (m.notes.length) {
      html += '<h4>筆記</h4><ul class="fas-list">' + m.notes.map(n => '<li><a href="' + encodeURI(SITE_BASE + n.url) + '">' + esc(n.title) + '</a>' +
        (n.status ? '<span class="fas-status">' + esc(n.status) + '</span>' : '') + '</li>').join('') + '</ul>';
    }
    times.forEach(t => {
      html += '<h4' + (t.key === focus ? ' class="is-focus"' : '') + '>' + esc(t.day.label + ' ' + t.time + '　' + t.room + ' 廳 第' + t.slot + '節') + '</h4>' +
        (t.files.length ? fileList(t.files) : '<p class="fas-empty">這一節的資料夾還沒有檔案。</p>');
    });
    const loose = speakerLoose(name);
    if (loose.length) html += '<h4>放在廳資料夾、還沒分到節</h4>' + fileList(loose);
    return html + '</section>';
  }

  function openDialog(title, sub, body) {
    const dlg = document.getElementById('fasDialog');
    dlg.querySelector('.fas-dlg__title').textContent = title;
    dlg.querySelector('.fas-dlg__sub').textContent = sub;
    dlg.querySelector('.fas-dlg__body').innerHTML = body;
    dlg.showModal();
    dlg.querySelector('.fas-dlg__body').scrollTop = 0;
  }

  function openSession(key) {
    const s = sessionByKey[key];
    const sp = FASAVA_SPECIALTIES[s.spec];
    openDialog(sp[0], sp[1], speakerBlock(s.name, key));
  }

  function openTopic(key) {
    const sp = FASAVA_SPECIALTIES[key];
    const names = [...new Set(sessions.filter(s => s.spec === key).map(s => s.name))];
    let extra = '';
    if (key === 'nutr') {
      extra = '<section class="fas-sp"><h3>Stanley Marks</h3><p class="fas-sp__meta">營養特別場 Nutrition Special Event：三天午餐時段（10/31 開幕典禮後 4F；11/1、11/2 為 7F Hall A）</p></section>';
    }
    openDialog(sp[0], sp[1], names.map(speakerBlock).join('') + extra);
  }

  /* ---------- 事件 ---------- */
  function isDayHash() { return FASAVA_DAYS.some(d => d.id === location.hash.replace('#', '')); }

  function dayFromHash() {
    const h = location.hash.replace('#', '');
    return FASAVA_DAYS.some(d => d.id === h) ? h : FASAVA_DAYS[0].id;
  }

  function init() {
    document.getElementById('fasTabs').innerHTML = FASAVA_DAYS.map(d =>
      '<button type="button" role="tab" class="fas-tab" id="fasTab' + d.id + '" data-day="' + d.id + '" aria-controls="fasPanel">' +
      '<b>' + esc(d.label) + '</b><span>' + esc(d.title) + '</span></button>').join('');

    const names = [...new Set(sessions.map(s => s.name))];
    const withPdf = sessions.filter(s => count(s.files.concat(looseFiles(s)), 'pdf')).length;
    const noteCount = names.reduce((n, x) => n + material(x).notes.length, 0);
    const pdfCount = Object.values(ALL_FILES).reduce((n, f) => n + count(f, 'pdf'), 0);
    document.getElementById('fasStats').textContent =
      sessions.length + ' 節課，' + withPdf + ' 節有講義（共 ' + pdfCount + ' 份），已做筆記 ' + noteCount + ' 頁';

    renderDay(dayFromHash());
    renderTopics();

    document.getElementById('fasTabs').addEventListener('click', e => {
      const t = e.target.closest('.fas-tab'); if (!t) return;
      history.replaceState(null, '', '#' + t.dataset.day);
      renderDay(t.dataset.day);
    });
    document.getElementById('fasTabs').addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const ids = FASAVA_DAYS.map(d => d.id);
      const cur = ids.indexOf(document.activeElement.dataset.day);
      if (cur < 0) return;
      const next = ids[(cur + (e.key === 'ArrowRight' ? 1 : ids.length - 1)) % ids.length];
      history.replaceState(null, '', '#' + next);
      renderDay(next);
      document.getElementById('fasTab' + next).focus();
    });
    // 從頂列下拉選單切換日期：關掉選單（nav.js 用 Esc 關）並捲到課表
    window.addEventListener('hashchange', () => {
      if (!isDayHash()) return;
      renderDay(dayFromHash());
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      document.getElementById('schedule').scrollIntoView();
    });
    if (isDayHash()) document.getElementById('schedule').scrollIntoView();

    document.getElementById('fasGrid').addEventListener('click', e => {
      const c = e.target.closest('[data-key]');
      if (c) openSession(c.dataset.key);
    });
    document.getElementById('fasTopics').addEventListener('click', e => {
      const c = e.target.closest('[data-topic]');
      if (c) openTopic(c.dataset.topic);
    });

    const dlg = document.getElementById('fasDialog');
    dlg.querySelector('.fas-dlg__close').addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
