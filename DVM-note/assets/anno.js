/* 標注圖的顯示／隱藏切換（影像判讀自我測驗用）
   用法：<div class="figure anno" data-orig="原圖" data-anno="標注圖"><img src="標注圖">…<ul class="anno-legend">…</ul>…</div>
   - 每張圖的圖說開頭一個按鈕（不蓋住影像）；右下角一個「全部」按鈕。
   - 隱藏時換成原圖、收起編號圖例；選擇記在 localStorage（每頁一個設定）。
   - nav.js 偵測到頁面有 .figure.anno 才會載入本檔。 */
(function () {
  var figs = document.querySelectorAll('.figure.anno');
  if (!figs.length) return;
  var css =
    '.anno-btn { float: right; margin: 0 0 4px 8px; font: inherit; font-size: .82em; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--line, rgba(0,0,0,.25)); background: var(--bg, #fff); color: var(--fg, #333); cursor: pointer; }' +
    '.anno-btn:hover { border-color: var(--accent, #8a5a2b); }' +
    '.figure.anno.anno-off .anno-legend { display: none; }' +
    '.figure.anno .anno-hint { display: none; font-size: .92em; color: var(--fg-muted, #777); margin: .35rem 0 0; }' +
    '.figure.anno.anno-off .anno-hint { display: block; }' +
    '.anno-all { position: fixed; right: 16px; bottom: 16px; z-index: 50; font: inherit; font-size: .85em; padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(0,0,0,.2); background: var(--accent, #8a5a2b); color: #fff; box-shadow: 0 2px 8px rgba(0,0,0,.2); cursor: pointer; }' +
    '@media print { .anno-btn, .anno-all { display: none; } }';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var KEY = 'anno-off:' + location.pathname;
  function getOff() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function setOff(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }

  function apply(fig, off) {
    var img = fig.querySelector('img');
    img.src = off ? fig.getAttribute('data-orig') : fig.getAttribute('data-anno');
    fig.classList.toggle('anno-off', off);
    fig.querySelector('.anno-btn').textContent = off ? '顯示標注' : '隱藏標注';
  }
  Array.prototype.forEach.call(figs, function (fig) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'anno-btn';
    b.addEventListener('click', function (e) { e.stopPropagation(); apply(fig, !fig.classList.contains('anno-off')); });
    var cap = fig.querySelector('.figure-caption') || fig; cap.insertBefore(b, cap.firstChild);
    var legend = fig.querySelector('.anno-legend');
    if (legend && !fig.querySelector('.anno-hint')) {
      var h = document.createElement('p'); h.className = 'anno-hint';
      h.textContent = '標注已隱藏：先自己在圖上找出 ' + legend.querySelectorAll('li').length + ' 個標注點，再按「顯示標注」核對。';
      legend.parentNode.insertBefore(h, legend);
    }
  });
  var all = document.createElement('button');
  all.type = 'button'; all.className = 'anno-all';
  function setAll(off) {
    Array.prototype.forEach.call(figs, function (f) { apply(f, off); });
    all.textContent = off ? '顯示全部標注' : '隱藏全部標注（自我測驗）';
    setOff(off);
  }
  all.addEventListener('click', function () { setAll(!getOff()); });
  document.body.appendChild(all);
  setAll(getOff());
})();
