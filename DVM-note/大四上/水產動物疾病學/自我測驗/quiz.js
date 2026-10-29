/* 水產動物疾病學自我測驗引擎：資料在 data/<章節>.js，進度只存在這個瀏覽器的 localStorage */
(function () {
  var KEY = 'aquatic-quiz-v1';
  var P = new URLSearchParams(location.search);
  var cid = P.get('c'), wrongOnly = P.get('m') === 'wrong', quick = P.get('m') === 'quick';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
  function srcHtml(s) {
    if (!s) return '';
    var h = '<p class="qz-from">出處：' + esc(s.l) + ' <a href="../pdf/' + encodeURI(s.pdf) + '#page=' + s.p + '" target="_blank">p.' + s.p + '</a>';
    if (s.pg) { h += '｜本站：' + s.pg.map(function (x) { return '<a href="../' + encodeURI(x.f) + (x.sec ? '#section-' + x.sec : '') + '">' + esc(x.n) + '</a>'; }).join('、'); }
    return h + '</p>';
  }
  function el(h) { var d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild; }
  function script(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; s.onerror = cb; document.head.appendChild(s); }
  window.toggleTheme = function () {
    var html = document.documentElement, btn = document.getElementById('themeBtn');
    var dark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', dark ? 'light' : 'dark'); btn.textContent = dark ? '🌙' : '☀️';
    try { localStorage.setItem('theme', dark ? 'light' : 'dark'); } catch (e) {}
  };
  try { var t = localStorage.getItem('theme'); if (t) { document.documentElement.setAttribute('data-theme', t); document.getElementById('themeBtn').textContent = t === 'dark' ? '☀️' : '🌙'; } } catch (e) {}

  var root = document.getElementById('qz-root');
  var LIST = window.SWINE_QUIZ_LIST || [];
  window.SWINE_QUIZ = window.SWINE_QUIZ || {};

  function loadData(ids, cb) {
    var i = 0;
    (function next() { if (i >= ids.length) return cb(); var id = ids[i++]; if (window.SWINE_QUIZ[id]) return next(); script('data/' + id + '.js', next); })();
  }

  function renderIndex() {
    var st = load(), h = '<div class="qz-chap">', totalWrong = 0;
    LIST.forEach(function (c) {
      var w = (st.wrong && st.wrong[c.id] || []).length; totalWrong += w;
      var best = st.best && st.best[c.id];
      h += '<a href="quiz.html?c=' + encodeURIComponent(c.id) + '"><span><strong>' + esc(c.title) + '</strong></span><span class="meta">' + c.n + ' 題' + (best != null ? '　上次 ' + best + ' 分' : '') + (w ? '　錯題 ' + w : '') + '</span></a>';
    });
    h += '</div><p style="margin-top:1.5rem"><a class="qz-btn primary" style="text-decoration:none" href="quiz.html?c=all&m=wrong">錯題本（' + totalWrong + ' 題）</a></p>';
    root.innerHTML = h;
  }

  function renderQuiz() {
    var ids = cid === 'all' ? LIST.map(function (c) { return c.id; }) : [cid];
    loadData(ids, function () {
      var st = load(); st.wrong = st.wrong || {}; st.best = st.best || {};
      var groups = [], title = '';
      ids.forEach(function (id) {
        var d = window.SWINE_QUIZ[id]; if (!d) return;
        if (cid !== 'all') title = d.title;
        d.groups.forEach(function (g) {
          var qs = g.qs.filter(function (q) { return !wrongOnly || (st.wrong[id] || []).indexOf(q.id) >= 0; }).map(function (q) { return { q: q, chap: id }; });
          if (qs.length) groups.push({ name: g.name, note: g.note, qs: qs });
        });
      });
      if (quick) {
        var flat = [];
        groups.forEach(function (g, gi) { g.qs.forEach(function (it) { flat.push([gi, it]); }); });
        var pick = flat.map(function (x, i) { return [Math.random(), i]; }).sort(function (a, b) { return a[0] - b[0]; }).slice(0, 25).map(function (x) { return x[1]; }).sort(function (a, b) { return a - b; });
        var keep = {}; pick.forEach(function (i) { keep[i] = 1; });
        var idx = 0; groups.forEach(function (g) { g.qs = g.qs.filter(function () { return keep[idx++]; }); });
        groups = groups.filter(function (g) { return g.qs.length; });
        title += '（隨機 25 題）';
      }
      if (cid === 'all') title = '錯題本';
      document.getElementById('qz-title').textContent = title + (wrongOnly && cid !== 'all' ? '（只做錯題）' : '');
      var total = groups.reduce(function (n, g) { return n + g.qs.length; }, 0);
      if (!total) { root.innerHTML = '<p>' + (wrongOnly ? '目前沒有錯題，繼續保持！' : '找不到這個章節的題目。') + '</p><p><a href="index.html">← 回測驗列表</a></p>'; return; }
      var answered = 0, correct = 0, wrongs = [];
      var bar = el('<div class="qz-bar"><span id="qz-count">已答 0 / ' + total + '</span><div class="qz-prog"><i></i></div><span id="qz-score">答對 0</span><button class="qz-btn" id="qz-reset">重做</button></div>');
      root.innerHTML = ''; root.appendChild(bar);
      var n = 0;
      groups.forEach(function (g) {
        root.appendChild(el('<h2 class="qz-group">' + esc(g.name) + (g.note ? '<small>' + esc(g.note) + '</small>' : '') + '</h2>'));
        g.qs.forEach(function (it) {
          n++; var q = it.q;
          var opts = q.t === 'tf' ? ['對', '錯'] : (q.t === 'sa' ? [] : q.o);
          var ans = q.t === 'tf' ? (q.a ? 0 : 1) : q.a;
          var card = el('<div class="qz-card"><p class="qz-q"><span class="n">' + n + '.</span>' + fmt(q.q) + '<span class="qz-tag">' + (q.t === 'tf' ? '是非' : (q.t === 'sa' ? '簡答' : '選擇')) + '</span></p>' + srcHtml(q.s) + '<div class="qz-opts"></div><div class="qz-exp"></div></div>');
          var box = card.querySelector('.qz-opts');
          opts.forEach(function (o, i) {
            var b = el('<button type="button" class="qz-opt">' + (q.t === 'tf' ? '' : '(' + 'ABCDE'[i] + ') ') + fmt(o) + '</button>');
            b.onclick = function () {
              if (card.classList.contains('done')) return;
              card.classList.add('done');
              [].forEach.call(box.children, function (c, j) { c.disabled = true; if (j === ans) c.classList.add('right'); });
              var ok = i === ans;
              if (!ok) b.classList.add('wrong');
              card.classList.add(ok ? 'ok' : 'no');
              card.querySelector('.qz-exp').innerHTML = (ok ? '✓ 答對。' : '✗ 答錯，正解是 ' + (q.t === 'tf' ? (q.a ? '對' : '錯') : '(' + 'ABCDE'[ans] + ')') + '。') + fmt(q.e || '') + (q.p ? '<span class="src">' + (q.p.indexOf('p.') === 0 ? '講義 ' : '') + esc(q.p) + '</span>' : '');
              answered++; if (ok) correct++; else wrongs.push({ n: n_of(card), q: q });
              var w = st.wrong[it.chap] = st.wrong[it.chap] || [], k = w.indexOf(q.id);
              if (ok && k >= 0) w.splice(k, 1); if (!ok && k < 0) w.push(q.id);
              save(st); upd();
            };
            box.appendChild(b);
          });
          if (q.t === 'sa') {
            var rv = el('<button type="button" class="qz-btn primary">看老師建議答案</button>');
            box.appendChild(rv);
            rv.onclick = function () {
              rv.style.display = 'none';
              var gr = el('<div class="qz-grade"><span>先自己答，再對照：</span></div>');
              [['我答對了', true], ['需要加強', false]].forEach(function (g) {
                var bt = el('<button type="button" class="qz-btn">' + g[0] + '</button>');
                bt.onclick = function () {
                  if (card.classList.contains('done')) return;
                  card.classList.add('done'); [].forEach.call(gr.children, function (c) { c.disabled = true; });
                  var ok = g[1]; card.classList.add(ok ? 'ok' : 'no');
                  answered++; if (ok) correct++; else wrongs.push({ n: n_of(card), q: q });
                  var w = st.wrong[it.chap] = st.wrong[it.chap] || [], k = w.indexOf(q.id);
                  if (ok && k >= 0) w.splice(k, 1); if (!ok && k < 0) w.push(q.id);
                  save(st); upd();
                };
                gr.appendChild(bt);
              });
              box.appendChild(gr);
              var ex = card.querySelector('.qz-exp'); ex.style.display = 'block';
              ex.innerHTML = '<strong>老師建議答案：</strong>' + fmt(q.ans) + '<br>' + fmt(q.e || '') + (q.p ? '<span class="src">' + (q.p.indexOf('p.') === 0 ? '講義 ' : '') + esc(q.p) + '</span>' : '');
            };
          }
          card.dataset.n = n; root.appendChild(card);
        });
      });
      function n_of(c) { return c.dataset.n; }
      var resBox = el('<div class="qz-result" style="display:none"></div>'); root.appendChild(resBox);
      function upd() {
        document.getElementById('qz-count').textContent = '已答 ' + answered + ' / ' + total;
        document.getElementById('qz-score').textContent = '答對 ' + correct;
        bar.querySelector('.qz-prog i').style.width = (answered / total * 100) + '%';
        if (answered === total) {
          var score = Math.round(correct / total * 100);
          if (cid !== 'all' && !wrongOnly && !quick) { st.best[cid] = score; save(st); }
          resBox.style.display = 'block';
          resBox.innerHTML = '<h2>' + correct + ' / ' + total + '（' + score + ' 分）</h2>' + (wrongs.length ? '<p>答錯的題目：第 ' + wrongs.map(function (w) { return w.n; }).join('、') + ' 題。已加入錯題本。</p>' : '<p>全部答對！</p>') +
            '<p>' + (cid !== 'all' ? '<a class="qz-btn primary" style="text-decoration:none" href="quiz.html?c=' + encodeURIComponent(cid) + '&m=wrong">只重做錯題</a> ' : '') + '<a class="qz-btn" style="text-decoration:none" href="index.html">回測驗列表</a></p>';
          resBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      document.getElementById('qz-reset').onclick = function () { location.reload(); };
    });
  }

  if (document.body.dataset.page === 'index') renderIndex(); else renderQuiz();
})();
