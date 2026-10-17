/* 出處連結：把頁面中的「VPT10 Ch.14」「HBK Ch.19」「SAIM6 Ch.82」「講義 A6」等出處文字，
   變成可點的連結（連到站上對應的獸醫藥理學筆記頁），滑鼠移上去會顯示書名與章名。
   沒有對應筆記頁的章節只顯示說明（虛線底線），不加連結。
   用法：<script src="../assets/cite-links.js" data-base="../"></script>（data-base＝到 DVM-note/ 的相對路徑） */
(function () {
  var me = document.currentScript;
  var BASE = (me && me.getAttribute('data-base')) || '../';
  var P = BASE + '大三/獸醫藥理學/';

  var BOOKS = {
    VPT10: { name: 'Veterinary Pharmacology and Therapeutics, 10th ed.（Riviere & Papich 編，獸醫藥理學教科書）', ch: {
      7: 'Adrenergic Receptor Agonists and Antagonists', 10: 'Neuromuscular Blocking Agents', 11: 'Inhalation Anesthetics',
      12: 'Injectable Anesthetic Agents', 13: 'Opioid Analgesic Drugs', 14: 'Sedatives and Tranquilizers', 15: 'Local Anesthetics',
      17: 'Anticonvulsant Drugs', 18: 'Drugs Affecting Animal Behavior', 19: 'Histamine, Serotonin, and their Antagonists',
      20: 'Analgesic, Antiinflammatory, Antipyretic Drugs', 21: 'Digitalis, Positive Inotropes, and Vasodilators', 22: 'Antiarrhythmic Agents',
      24: 'Diuretics and Renal Pharmacology', 25: 'Anticoagulant, Antiplatelet, and Hemostatic Drugs', 26: 'Hypothalamic and Pituitary Hormones',
      27: 'Hormones Affecting Reproduction', 28: 'Thyroid Hormone and Antithyroid Drugs', 29: 'Glucocorticoids, Mineralocorticoids, and Adrenolytic Drugs',
      30: 'Drugs Influencing Glucose Metabolism', 31: 'Antiseptics and Disinfectants', 32: 'Sulfonamides and Potentiated Sulfonamides',
      33: 'β-Lactam Antibiotics: Penicillins, Cephalosporins, and Related Drugs', 34: 'Tetracycline Antibiotics', 35: 'Aminoglycoside Antibiotics',
      36: 'Chloramphenicol and Derivatives, Macrolides, Lincosamides, and Miscellaneous Antimicrobials', 37: 'Fluoroquinolone Antimicrobial Drugs',
      38: 'Antifungal and Antiviral Drugs', 42: 'Antiprotozoan Drugs', 44: 'Chemotherapy of Neoplastic Diseases', 46: 'Drugs for Treating Gastrointestinal Diseases',
      48: 'Drugs that Affect the Respiratory System' },
      link: { 7: '降血壓藥物', 10: '抗膽鹼與神經肌肉阻斷劑', 11: '吸入性麻醉藥', 12: '注射式麻醉藥', 13: '鴉片類止痛藥', 14: '鎮靜與術前用藥',
        15: '局部麻醉藥', 17: '抗癲癇藥物', 18: '中樞神經藥理總論', 19: '組織胺與抗組織胺藥物', 20: 'NSAID非類固醇消炎藥', 21: '強心配糖體',
        22: '抗心律不整藥物', 24: '利尿劑', 25: '凝血相關藥物', 26: '腦下垂體荷爾蒙', 27: '性腺與生殖賀爾蒙藥物', 28: '腦下垂體荷爾蒙',
        29: '類固醇藥理', 30: '腦下垂體荷爾蒙', 31: '消毒劑與防腐劑', 32: '磺胺與喹諾酮類', 33: 'Beta-Lactam類抗生素',
        34: '胺基配醣體四環黴素與氯黴素類', 35: '胺基配醣體四環黴素與氯黴素類', 36: '胺基配醣體四環黴素與氯黴素類',
        37: '磺胺與喹諾酮類', 38: '抗黴菌藥物', 44: '抗癌藥物', 46: '腸胃道用藥', 48: '呼吸道用藥' } },
    HBK: { name: 'Handbook of Veterinary Pharmacology（Hsu 編，獸醫藥理學手冊）', ch: {
      1: 'Principles of Drug Absorption, Drug Disposition, and Drug Action', 2: 'Drugs Affecting Peripheral Nervous System',
      3: 'Autacoids and Their Pharmacological Modulators', 4: 'Drugs Acting on the Central Nervous System', 5: 'Behavior-Modifying Drugs',
      6: 'Anesthetics', 7: 'Nonsteroidal Anti-inflammatory Drugs', 8: 'Drugs Acting on the Cardiovascular System', 9: 'Diuretics',
      10: 'Respiratory Pharmacology', 11: 'Drugs Acting on the Gastrointestinal Tract', 12: 'Endocrine Pharmacology',
      13: 'Topical Dermatology Therapy', 14: 'Ocular Pharmacology', 15: 'Antimicrobial Drugs', 16: 'Antiparasitic Agents',
      17: 'Antineoplastic Drugs', 18: 'Fluid and Blood Therapy', 19: 'Drug Interactions and Adverse Drug Reactions' },
      link: { 1: '藥理學總論', 4: '中樞神經藥理總論', 7: 'NSAID非類固醇消炎藥', 8: '強心配糖體', 9: '利尿劑', 10: '呼吸道用藥',
        11: '腸胃道用藥', 16: '抗寄生蟲藥物', 17: '抗癌藥物' },
      special: { 19: BASE + '上群/2026-10-11_專題-常見藥物交互作用.html' } },
    SAIM6: { name: 'Small Animal Internal Medicine, 6th ed.（Nelson & Couto，小動物內科學）', ch: {
      27: 'Diagnostic Tests for the Alimentary Tract', 28: 'General Therapeutic Principles',
      41: 'Acute Kidney Injury and Chronic Kidney Disease', 82: 'Anemia' }, link: {} }
  };
  var PDF = {"VPT10": {"file": "Veterinary%20Pharmacology%20and%20Therapeutics%2C%2010th%20Edition%20%28VetBooks.ir%29-1.pdf", "p": {"1": 27, "2": 32, "3": 65, "4": 89, "5": 111, "6": 137, "7": 155, "8": 175, "9": 191, "10": 218, "11": 240, "12": 271, "13": 305, "14": 348, "15": 393, "16": 411, "17": 419, "18": 440, "19": 475, "20": 491, "21": 527, "22": 561, "23": 579, "24": 617, "25": 649, "26": 673, "27": 698, "28": 715, "29": 753, "30": 787, "31": 805, "32": 820, "33": 850, "34": 882, "35": 901, "36": 927, "37": 977, "38": 1012, "39": 1059, "40": 1105, "41": 1126, "42": 1152, "43": 1190, "44": 1215, "45": 1250, "46": 1269, "47": 1302, "48": 1326, "49": 1345, "50": 1356, "51": 1369, "52": 1382, "53": 1397, "54": 1419, "55": 1431, "56": 1451, "57": 1463, "58": 1472, "59": 1483, "60": 1489, "61": 1493}}, "HBK": {"file": "Handbook%20of%20Veterinary%20Pharmacology%20%28VetBooks.ir%29.pdf", "p": {"1": 15, "2": 43, "3": 73, "4": 95, "5": 123, "6": 145, "7": 167, "8": 185, "9": 221, "10": 235, "11": 249, "12": 275, "13": 309, "14": 335, "15": 361, "16": 393, "17": 431, "18": 451, "19": 475, "20": 485}}, "SAIM6": {"file": "Small%20Animal%20Internal%20Medicine%2C%206th%20Edition%20%28VetBooks.ir%29.pdf", "p": {"27": 442, "28": 462, "41": 716, "82": 1370}}};
  // 公開網站（GitHub Pages）沒有教科書 PDF，不顯示「原文」連結
  var SHOW_PDF = !/github\.io$/.test(location.hostname);
  var TB = BASE + '../textbook/';
  var LECT = {
    'A2': ['A2 CNS Sedatives', '鎮靜與術前用藥'], 'A3': ['A3 Injectable Anesthetics', '注射式麻醉藥'],
    'A5': ['A5 CNS Antipsychotic（α2 促效劑等）', '鎮靜與術前用藥'], 'A6': ['A6 CNS Narcotic', '鴉片類止痛藥'],
    'A9': ['A9 CNS Anticonvulsant', '抗癲癇藥物'], 'ANS 1': ['ANS 1 handout（腎上腺素性）', '腎上腺素性藥物'],
    'ANS 2': ['ANS 2 handout（膽鹼性）', '膽鹼性藥物'], 'Autacoid 1 Histamine': ['Handout Autacoid 1 Histamine', '組織胺與抗組織胺藥物'],
    'Autacoid 2 5-HT': ['Handout Autacoid 2 5-HT', '血清素受體藥物'], 'Autacoid 3 GI': ['Handout Autacoid 3 GI', '腸胃道用藥'],
    'Autacoid 4 NSAID': ['Handout Autacoid 4 NSAID', 'NSAID非類固醇消炎藥'], 'CV1': ['Handout CV1 Cardiac glycoside', '強心配糖體'],
    'CV5': ['Handout CV5 Antianemics', '抗貧血藥物'], 'Antimicrobial 1': ['Antimicrobial 1 Sulfa／Quinolone', '磺胺與喹諾酮類'],
    'Antimicrobial 2': ['Antimicrobial 2 β-lactam', 'Beta-Lactam類抗生素'], 'Antimicrobial 3': ['Antimicrobial 3 Aminoglycoside（含四環黴素、氯黴素、巨環內酯）', '胺基配醣體四環黴素與氯黴素類'],
    'Antimicrobial 4': ['Antimicrobial 4 Lincosamide（含 Metronidazole）', 'Lincosamide與其他抗生素']
  };
  var LKEYS = Object.keys(LECT).sort(function (a, b) { return b.length - a.length; });

  function el(tag, text, title, href) {
    var n = document.createElement(href ? 'a' : 'abbr');
    n.className = 'cite-ref' + (href ? '' : ' cite-nolink');
    n.textContent = text; n.title = title;
    if (href) n.href = href;
    return n;
  }
  function bookNode(book, chText, num) {
    var b = BOOKS[book], t = b.name + '\nCh.' + num + (b.ch[num] ? ' ' + b.ch[num] : '');
    var href = (b.special && b.special[num]) || (b.link[num] ? P + b.link[num] + '.html' : null);
    if (href) t += '\n→ 點擊前往站上筆記：' + ((b.special && b.special[num]) ? '專題：常見藥物交互作用' : b.link[num]);
    return el('a', chText, t, href);
  }

  var RE_BOOK = /(VPT10|HBK|SAIM6)(\s*)((?:Ch\.\s?\d+)(?:\s*[、，,]\s*Ch\.\s?\d+)*)/g;

  function process(text, allowPdf) {
    var frag = document.createDocumentFragment(), last = 0, m, any = false;
    // 1) 教科書
    var parts = [];
    RE_BOOK.lastIndex = 0;
    while ((m = RE_BOOK.exec(text))) { parts.push({ i: m.index, len: m[0].length, m: m }); }
    // 2) 講義：在「講義」之後、到下一個 ；）。 之前的片段中找講義代號
    var re2 = /講義/g, k;
    while ((k = re2.exec(text))) {
      var start = k.index + 2, end = text.length;
      ['；', '）', '。', '\n'].forEach(function (c) { var j = text.indexOf(c, start); if (j >= 0 && j < end) end = j; });
      var seg = text.slice(start, end), pos = 0;
      while (pos < seg.length) {
        var hit = null;
        for (var x = 0; x < LKEYS.length; x++) {
          var key = LKEYS[x], j = seg.indexOf(key, pos);
          if (j < 0) continue;
          var before = seg.charAt(j - 1), after = seg.charAt(j + key.length);
          if (/[A-Za-z0-9]/.test(before) || /[A-Za-z0-9–\-]/.test(after)) continue;
          if (!hit || j < hit.j) hit = { j: j, key: key };
        }
        if (!hit) break;
        parts.push({ i: start + hit.j, len: hit.key.length, lect: hit.key });
        pos = hit.j + hit.key.length;
      }
    }
    if (!parts.length) return null;
    parts.sort(function (a, b) { return a.i - b.i; });
    parts.forEach(function (p) {
      if (p.i < last) return;
      frag.appendChild(document.createTextNode(text.slice(last, p.i)));
      if (p.lect) {
        var L = LECT[p.lect];
        frag.appendChild(el('a', p.lect, 'NTU 獸醫藥理學課程講義：' + L[0] + '\n→ 點擊前往站上筆記：' + L[1], P + L[1] + '.html'));
      } else {
        var mm = p.m, book = mm[1];
        var bn = document.createElement('abbr'); bn.className = 'cite-book'; bn.textContent = book; bn.title = BOOKS[book].name;
        frag.appendChild(bn); frag.appendChild(document.createTextNode(mm[2]));
        var chs = mm[3], re3 = /Ch\.\s?(\d+)/g, c, l3 = 0;
        while ((c = re3.exec(chs))) {
          frag.appendChild(document.createTextNode(chs.slice(l3, c.index)));
          frag.appendChild(bookNode(book, c[0], +c[1]));
          var pg = PDF[book] && PDF[book].p[c[1]];
          if (SHOW_PDF && allowPdf && pg) {
            var o = document.createElement('a'); o.className = 'fig-link cite-pdf'; o.textContent = '原文';
            o.href = TB + PDF[book].file + '#page=' + pg;
            o.title = '在右側面板開啟原書：' + book + ' Ch.' + c[1] + '（PDF 第 ' + pg + ' 頁）\n需用「開啟筆記網站」開啟網站才讀得到本機 PDF';
            o.dataset.label = book + ' Ch.' + c[1] + (BOOKS[book].ch[c[1]] ? ' ' + BOOKS[book].ch[c[1]] : '');
            frag.appendChild(o);
          }
          l3 = c.index + c[0].length;
        }
        frag.appendChild(document.createTextNode(chs.slice(l3)));
      }
      last = p.i + p.len; any = true;
    });
    frag.appendChild(document.createTextNode(text.slice(last)));
    return any ? frag : null;
  }

  function run() {
    var roots = document.querySelectorAll('.pagehead, main.pagebody');
    roots.forEach(function (root) {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          var p = n.parentNode;
          if (!p || p.closest('a, script, style, abbr, nav.toc, .search-results, #pv')) return NodeFilter.FILTER_REJECT;
          return /VPT10|HBK|SAIM6|講義/.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      var nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
      var allowPdf = !root.classList.contains('pagehead');   // 頁首資料來源列只放章節連結，不放「原文」按鈕
      nodes.forEach(function (n) { var f = process(n.nodeValue, allowPdf); if (f) n.parentNode.replaceChild(f, n); });
    });
  }

  var st = document.createElement('style');
  st.textContent = 'a.cite-ref{color:inherit;text-decoration:underline;text-decoration-color:var(--accent-mid,#a8886e);text-underline-offset:2px}' +
    'a.cite-ref:hover{color:var(--accent-deep,#5a3a22)}abbr.cite-book,abbr.cite-nolink{text-decoration:underline dotted;text-underline-offset:2px;cursor:help}' +
    'a.cite-pdf{display:inline-block;margin:0 2px 0 3px;padding:0 5px;font-size:.78em;line-height:1.45;border:1px solid var(--line-soft,#ddd);border-radius:999px;text-decoration:none;color:var(--accent,#9a5b2e);vertical-align:1px;white-space:nowrap}a.cite-pdf:hover{background:var(--accent-tint,#f3e8dc)}';
  document.head.appendChild(st);
  window.linkCitations = run;   // 動態重畫內容後可再呼叫一次（已是連結的不會重複處理）
  if (document.querySelector('main.pagebody')) run(); else document.addEventListener('DOMContentLoaded', run);
})();
