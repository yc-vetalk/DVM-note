/* ══════════════════════════════════════════════════════
   上群AH — 跨科別／跨主題搜尋索引
   每新增/修改一份主題筆記，務必在此補上對應分節的搜尋條目。
   欄位說明：
     subject     科別名稱（例如「內科」「麻醉」）
     week        本站不分週次，固定填 null
     weekTitle   主題標題（例如「休克的初步處置」）
     url         相對於本檔案（網站根目錄）的頁面路徑
     section     頁面內對應的 section id（不含 "section-" 前綴）
     sectionName 該分節在側欄顯示的名稱
     keywords    額外關鍵字（空白分隔），提高搜尋命中率
     snippet     內容摘要，會顯示在搜尋結果中
   ══════════════════════════════════════════════════════ */

const SEARCH_INDEX = [
  // 範例（新增主題頁時比照此格式補上，完成後可刪除此範例）：
  // {
  //   subject: "內科",
  //   week: null,
  //   weekTitle: "急性腎損傷（AKI）",
  //   url: "內科/急性腎損傷.html",
  //   section: "overview",
  //   sectionName: "總覽",
  //   keywords: "AKI 腎功能 BUN creatinine SDMA",
  //   snippet: "急性腎損傷的分期、常見病因與初步處置原則..."
  // },

  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "overview",
    sectionName: "SUB 系統總覽",
    keywords: "SUB subcutaneous ureteral bypass 輸尿管阻塞 腎造廔 膀胱造廔 Y-connector X-connector SwirlPort Berent Weisse",
    snippet: "SUB 是治療貓（少數犬）輸尿管阻塞的介入性裝置，利用腎造廔導管、膀胱造廔導管與皮下注射座建立人工輸尿管..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "prep",
    sectionName: "適應症與器材準備",
    keywords: "SUB3-2001K SUB3-2002K SUB3-3001K 套組 locking loop catheter 適應症 結石 狹窄 腫瘤",
    snippet: "功能性輸尿管阻塞（結石、狹窄、腫瘤）不論位置大小數量皆可考慮 SUB；套組型號依貓／小型犬／大型犬／雙側選擇..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "procedure",
    sectionName: "手術步驟",
    keywords: "Seldinger technique 腎造廔導管 膀胱造廔導管 Y-connector 鎖繩 pigtail 剖腹 螢光透視 guidewire",
    snippet: "改良式 Seldinger 技術放置腎造廔導管：18G留置針穿刺腎盂、導絲、6.5F導管沿導絲推進形成pigtail、Dacron環固定..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "flushing",
    sectionName: "術後沖洗與照護",
    keywords: "SUB flush kit t-EDTA T-FloLoc Huber needle 沖洗 超音波導引 腎盂過度擴張",
    snippet: "術後出院前、1週、1個月、之後每3個月沖洗一次；超音波導引下以0.25-0.5mL脈衝注入生理食鹽水與t-EDTA，監測腎盂避免過度擴張..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "complications",
    sectionName: "併發症與預後",
    keywords: "kinking leakage 血塊阻塞 mineralization 礦化 TPA 存活率 creatinine",
    snippet: "SUB 3.0 扭結率降至0%；出院存活率>93%；裝置內血塊約8%可用TPA溶解；常規t-EDTA沖洗使礦化率24.5%降至12.7%、慢性UTI由8%降至0%..."
  },
];
