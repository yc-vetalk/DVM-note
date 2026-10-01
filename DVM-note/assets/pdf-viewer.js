/* 本機 PDF 看圖面板：點 a.fig-link（href="xxx.pdf#page=N"）時，在右側開啟可連續捲動、附目錄的 PDF 檢視器。
   PDF 由使用者本機檔案即時讀取顯示，不複製任何內容。需透過本機伺服器（開啟筆記網站.command）開啟網站。
   依賴 pdf.js 3.x（window['pdfjs-dist/build/pdf']）。 */
(function () {
  const lib = window['pdfjs-dist/build/pdf'];
  if (lib) lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

  const css = `
.fig-link{color:var(--accent,#9a5b2e);text-decoration:underline dotted;white-space:nowrap;cursor:pointer}
.fig-link.active{background:#f3d9b1;border-radius:3px}
#pv{position:fixed;top:0;right:0;width:50vw;height:100vh;background:var(--bg,#fff);border-left:1px solid var(--line,#ddd);z-index:900;display:none;flex-direction:column;font-size:14px}
#pv.open{display:flex}
body.pv-open .pagewrap{margin-right:50vw}
#pv .pv-bar{display:flex;align-items:center;gap:6px;padding:6px 10px;border-bottom:1px solid var(--line,#ddd);flex-wrap:wrap}
#pv .pv-bar .sp{flex:1}
#pv button{border:1px solid var(--line,#ccc);background:none;border-radius:4px;padding:2px 9px;cursor:pointer;color:inherit;font-size:13px}
#pv button.on{background:var(--bg-faint,#eee)}
#pv input{width:52px;padding:2px 4px;border:1px solid var(--line,#ccc);border-radius:4px;background:none;color:inherit;text-align:center}
#pv .pv-main{flex:1;display:flex;min-height:0}
#pv .pv-side{width:230px;overflow:auto;border-right:1px solid var(--line,#ddd);padding:6px 0;display:none;flex-shrink:0}
#pv .pv-side.open{display:block}
#pv .pv-side h5{margin:10px 12px 4px;font-size:12px;color:var(--fg-faint,#888);letter-spacing:.05em}
#pv .pv-side a{display:block;padding:3px 12px;color:inherit;text-decoration:none;cursor:pointer;line-height:1.35;font-size:13px}
#pv .pv-side a:hover{background:var(--bg-faint,#f2f2f2)}
#pv .pv-side a.cur{background:#f3d9b1}
#pv .pv-side .lv1{font-weight:600}
#pv .pv-side .lv2{padding-left:24px}
#pv .pv-side .lv3{padding-left:36px;font-size:12px}
#pv .pv-figs{display:flex;flex-wrap:wrap;gap:4px;padding:2px 12px 8px}
#pv .pv-figs a{padding:1px 6px;border:1px solid var(--line,#ddd);border-radius:3px;font-size:12px}
#pv .pv-scroll{flex:1;overflow:auto;background:#555;position:relative}
#pv .pv-page{margin:10px auto;background:#fff;position:relative;box-shadow:0 1px 4px rgba(0,0,0,.4)}
#pv .pv-page canvas{display:block;width:100%;height:100%}
#pv .pv-page .pv-num{position:absolute;top:4px;right:6px;font-size:11px;color:#999}
#pv .pv-msg{color:#fff;padding:24px;line-height:1.7}
@media (max-width:900px){#pv{width:100vw}body.pv-open .pagewrap{margin-right:0}#pv .pv-side{position:absolute;z-index:2;background:var(--bg,#fff);height:calc(100% - 42px)}}
`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const pv = document.createElement('div'); pv.id = 'pv';
  pv.innerHTML = `<div class="pv-bar">
      <button id="pvToc" class="on" title="顯示／隱藏目錄">☰ 目錄</button>
      <button id="pvOut">－</button><button id="pvIn">＋</button>
      <span>第 <input id="pvPg" type="text"> / <span id="pvTot">–</span> 頁</span>
      <span class="sp"></span><b id="pvLabel" style="font-weight:600"></b>
      <button id="pvClose">關閉 ✕</button></div>
    <div class="pv-main"><div class="pv-side open" id="pvSide"></div><div class="pv-scroll" id="pvScroll"></div></div>`;
  document.body.appendChild(pv);
  const $ = id => document.getElementById(id);
  const scroller = $('pvScroll'), side = $('pvSide');

  const docCache = {};
  function loadDoc(url) { if (!docCache[url]) docCache[url] = lib.getDocument(url).promise; return docCache[url]; }
  let doc = null, docUrl = '', scale = 1, pages = [], ratio = 1.3, rendered = new Map(), io = null, outlineLinks = [];

  function msg(t) { scroller.innerHTML = `<div class="pv-msg">${t}</div>`; }
  function baseWidth() { return Math.max(200, scroller.clientWidth - 24); }

  function buildPages() {
    scroller.innerHTML = ''; pages = []; rendered.clear();
    if (io) io.disconnect();
    io = new IntersectionObserver(onIntersect, { root: scroller, rootMargin: '800px 0px' });
    const w = baseWidth() * scale;
    for (let i = 1; i <= doc.numPages; i++) {
      const d = document.createElement('div'); d.className = 'pv-page'; d.dataset.p = i;
      d.style.width = w + 'px'; d.style.height = (w * ratio) + 'px';
      d.innerHTML = `<span class="pv-num">${i}</span>`;
      scroller.appendChild(d); pages.push(d); io.observe(d);
    }
  }
  async function renderPage(d) {
    const i = +d.dataset.p; if (rendered.has(i)) return; rendered.set(i, true);
    const pg = await doc.getPage(i);
    const v1 = pg.getViewport({ scale: 1 });
    const w = baseWidth() * scale; const r = v1.height / v1.width;
    d.style.width = w + 'px'; d.style.height = (w * r) + 'px';
    const dpr = window.devicePixelRatio || 1;
    const vp = pg.getViewport({ scale: (w / v1.width) * dpr });
    const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
    await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    if (!rendered.has(i)) return;
    d.querySelectorAll('canvas').forEach(x => x.remove()); d.prepend(c);
  }
  function unrender(d) {
    const i = +d.dataset.p; if (!rendered.has(i)) return; rendered.delete(i);
    d.querySelectorAll('canvas').forEach(x => { x.width = 0; x.height = 0; x.remove(); });
  }
  function onIntersect(entries) { entries.forEach(e => e.isIntersecting ? renderPage(e.target) : unrender(e.target)); }

  function goto(p, smooth) {
    const d = pages[Math.min(doc.numPages, Math.max(1, p)) - 1]; if (!d) return;
    scroller.scrollTo({ top: d.offsetTop - 10, behavior: smooth ? 'smooth' : 'auto' });
    if (!smooth) updateCur();
  }
  function currentPage() {
    const y = scroller.scrollTop + scroller.clientHeight * 0.3;
    let lo = 0, hi = pages.length - 1;
    while (lo < hi) { const m = (lo + hi + 1) >> 1; if (pages[m].offsetTop <= y) lo = m; else hi = m - 1; }
    return lo + 1;
  }
  function updateCur() {
    if (!doc || !pages.length) return; const p = currentPage();
    if (document.activeElement !== $('pvPg')) $('pvPg').value = p;
    let cur = null; outlineLinks.forEach(o => { if (o.page <= p) cur = o; });
    outlineLinks.forEach(o => o.el.classList.toggle('cur', o === cur));
    if (cur && side.classList.contains('open')) { const r = cur.el.getBoundingClientRect(), sr = side.getBoundingClientRect(); if (r.top < sr.top || r.bottom > sr.bottom) cur.el.scrollIntoView({ block: 'center' }); }
  }
  scroller.addEventListener('scroll', updateCur);

  async function resolveDest(dest) {
    try {
      const d = typeof dest === 'string' ? await doc.getDestination(dest) : dest;
      if (!d) return null; return (await doc.getPageIndex(d[0])) + 1;
    } catch (e) { return null; }
  }
  async function buildSide() {
    side.innerHTML = '';
    const figs = [...document.querySelectorAll('a.fig-link')].reduce((m, a) => {
      if (a.getAttribute('href').split('#page=')[0] === docUrl && !m.has(a.textContent)) m.set(a.textContent, +a.getAttribute('href').split('#page=')[1]); return m; }, new Map());
    if (figs.size) {
      side.insertAdjacentHTML('beforeend', '<h5>本頁引用的圖號</h5>');
      const box = document.createElement('div'); box.className = 'pv-figs';
      [...figs].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true })).forEach(([f, p]) => {
        const a = document.createElement('a'); a.textContent = f; a.title = 'PDF 第 ' + p + ' 頁';
        a.onclick = () => { $('pvLabel').textContent = 'Fig. ' + f; goto(p, true); }; box.appendChild(a); });
      side.appendChild(box);
    }
    const outline = await doc.getOutline();
    if (!outline) return;
    side.insertAdjacentHTML('beforeend', '<h5>書本目錄</h5>');
    outlineLinks = [];
    const walk = async (items, lv) => {
      for (const it of items) {
        const a = document.createElement('a'); a.className = 'lv' + Math.min(lv, 3); a.textContent = it.title;
        side.appendChild(a);
        const p = await resolveDest(it.dest);
        if (p) { a.onclick = () => { $('pvLabel').textContent = it.title; goto(p, false); }; outlineLinks.push({ el: a, page: p }); }
        if (it.items && it.items.length && lv < 3) await walk(it.items, lv + 1);
      }
    };
    await walk(outline, 1);
    outlineLinks.sort((a, b) => a.page - b.page);
    updateCur();
  }

  async function open(url, page, label) {
    pv.classList.add('open'); document.body.classList.add('pv-open');
    $('pvLabel').textContent = label ? 'Fig. ' + label : '';
    try {
      if (!doc || docUrl !== url) {
        msg('載入原書PDF中…（第一次需要幾秒）');
        doc = await loadDoc(url); docUrl = url;
        const v = (await doc.getPage(1)).getViewport({ scale: 1 }); ratio = v.height / v.width;
        $('pvTot').textContent = doc.numPages;
        buildPages(); buildSide();
      }
      requestAnimationFrame(() => goto(page, false));
    } catch (e) {
      doc = null;
      msg('無法讀取本機PDF。<br><br>請用「上群」資料夾裡的「開啟筆記網站.command」開啟網站（雙擊即可），並確認 textbook 資料夾中有這本PDF。');
    }
  }
  function rezoom(d) {
    if (!doc) return; const p = currentPage();
    scale = Math.min(3, Math.max(0.5, scale + d * 0.25)); buildPages(); requestAnimationFrame(() => goto(p, false));
  }

  $('pvIn').onclick = () => rezoom(1); $('pvOut').onclick = () => rezoom(-1);
  $('pvClose').onclick = () => { pv.classList.remove('open'); document.body.classList.remove('pv-open'); };
  $('pvToc').onclick = () => { side.classList.toggle('open'); $('pvToc').classList.toggle('on'); if (doc) { const p = currentPage(); buildPages(); requestAnimationFrame(() => goto(p, false)); } };
  $('pvPg').addEventListener('keydown', e => { if (e.key === 'Enter' && doc) { goto(parseInt(e.target.value, 10) || 1, false); e.target.blur(); } });

  /* 內嵌原書頁面：<details class="pdf-inline" data-src="x.pdf" data-pages="314,315" data-label="p303–304"> */
  const icss = document.createElement('style');
  icss.textContent = `.pdf-inline{margin:14px 0;border:1px solid var(--line,#ddd);border-radius:6px;background:var(--bg-faint,#f7f7f7)}
.pdf-inline>summary{cursor:pointer;padding:9px 12px;font-weight:600;list-style:none}
.pdf-inline>summary::-webkit-details-marker{display:none}
.pdf-inline>summary:before{content:'▶ ';font-size:.8em}
.pdf-inline[open]>summary:before{content:'▼ '}
.pdf-inline .pi-body{padding:0 10px 10px;background:#555;border-radius:0 0 6px 6px}
.pdf-inline canvas{display:block;width:100%;height:auto;margin:10px 0 0;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.pdf-inline .pi-cap{color:#ddd;font-size:12px;padding:4px 2px 0}
.pdf-inline .pi-msg{color:#fff;padding:14px;line-height:1.6;font-size:.9em}`;
  document.head.appendChild(icss);
  async function renderInline(el) {
    if (el.dataset.done) return; el.dataset.done = '1';
    const body = document.createElement('div'); body.className = 'pi-body'; el.appendChild(body);
    body.innerHTML = '<div class="pi-msg">載入原書頁面中…</div>';
    try {
      const d = await loadDoc(el.dataset.src);
      body.innerHTML = '';
      for (const n of el.dataset.pages.split(',').map(x => parseInt(x, 10))) {
        const pg = await d.getPage(n);
        const v1 = pg.getViewport({ scale: 1 });
        const w = Math.max(300, body.clientWidth - 20), dpr = window.devicePixelRatio || 1;
        const vp = pg.getViewport({ scale: (w / v1.width) * dpr });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
        body.appendChild(c);
        const cap = document.createElement('div'); cap.className = 'pi-cap'; cap.textContent = 'PDF 第 ' + n + ' 頁'; body.appendChild(cap);
        await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      }
    } catch (e) {
      el.dataset.done = '';
      body.innerHTML = '<div class="pi-msg">無法讀取本機PDF。<br>請到「上群」資料夾雙擊「開啟筆記網站.command」開啟網站，再回到這一頁。</div>';
    }
  }

  if (location.protocol === 'file:' && (document.querySelector('a.fig-link') || document.querySelector('details.pdf-inline'))) {
    const b = document.createElement('div');
    b.style.cssText = 'background:#fff3cd;color:#664d03;border:1px solid #ffe69c;padding:10px 14px;margin:0 0 14px;border-radius:6px;font-size:.92em;line-height:1.6';
    b.innerHTML = '⚠️ 目前是直接開啟檔案，原書頁面無法顯示。請到「上群」資料夾雙擊 <b>開啟筆記網站.command</b> 開啟網站，再回到這一頁。';
    const m = document.querySelector('main.pagebody') || document.body; m.prepend(b);
  }
  document.querySelectorAll('details.pdf-inline').forEach(el => {
    el.addEventListener('toggle', () => { if (el.open) renderInline(el); });
    if (el.open) renderInline(el);
  });

  document.addEventListener('click', e => {
    const a = e.target.closest('a.fig-link'); if (!a) return;
    e.preventDefault();
    document.querySelectorAll('a.fig-link.active').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    const [url, p] = a.getAttribute('href').split('#page=');
    open(url, parseInt(p, 10), a.textContent);
  });
})();
