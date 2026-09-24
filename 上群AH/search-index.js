/* ══════════════════════════════════════════════════════
   上群動物醫院 — 跨科別／跨主題搜尋索引
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
  {
    subject: "外科",
    week: null,
    weekTitle: "皮下輸尿管繞道系統（SUB）",
    url: "外科/SUB皮下輸尿管繞道系統.html",
    section: "evidence",
    sectionName: "文獻補充與參考資料",
    keywords: "SUB 沖洗時程 flushing schedule 術後照護 抗生素 marbofloxacin t-EDTA Berent 2025 Kulendra Vrijsen 獨立研究 SOP 尿培養 存活率",
    snippet: "各來源共識：出院前、約1個月、之後每3個月（原廠另有1週）；Berent 2025建議2年後每6個月；獨立研究重大併發症48%、感染26%；t-EDTA預防2%與治療4%濃度不同..."
  },

  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "overview",
    sectionName: "總覽與病理機轉",
    keywords: "diabetes mellitus 糖尿病 fructosamine HbA1c 壓力性高血糖 HST 肢端肥大症 iCatCare AAHA",
    snippet: "貓糖尿病沒有單一最好的治療方式；第二型糖尿病佔75-80%，肢端肥大症(HST)相關佔20-25%..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "choice",
    sectionName: "胰島素 vs SGLT2 抑制劑",
    keywords: "治療選擇 禁忌症 DKA eDKA 篩檢 BCS",
    snippet: "厭食嗜睡脫水先當DKA/eDKA處理；SGLT2抑制劑適合臨床穩定沒有禁忌症的貓..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "sglt2",
    sectionName: "SGLT2 抑制劑治療",
    keywords: "SGLT2 inhibitor Bexacat bexagliflozin Senvelgo velagliflozin 機轉 eDKA 正常血糖酮酸血症 近端小管 BHB 監測排程 腹瀉 嘔吐補藥",
    snippet: "只適用於未用過胰島素的新診斷貓；BHB>3.6mmol/L不應起始；Table6.1監測排程第2-3/7/14/30天與每3個月；eDKA發生率5-7%..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "insulin",
    sectionName: "胰島素治療",
    keywords: "insulin glargine U300 PZI ProZinc Vetsulin lente degludec 基礎胰島素 血糖目標 滴定 CGM",
    snippet: "胰島素配方沒有哪一種更優越；Glargine U100/PZI起始1U/cat q12h；Degludec與Glargine U300屬基礎（peakless）胰島素..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "monitor",
    sectionName: "居家與院內監測",
    keywords: "CGM FreeStyle Libre 血糖曲線 DCS diabetic clinical score 尿糖",
    snippet: "不再建議常規院內血糖曲線；CGM FreeStyle Libre可配戴14天，低血糖範圍準確度較低需謹慎判讀..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "special",
    sectionName: "特殊情境與併發症",
    keywords: "HST 肢端肥大症 IGF-1 hypophysectomy hypercortisolism Cushing 胰臟炎 DKA eDKA 葡萄糖輸液 低血糖 難以regulate 第二線診斷",
    snippet: "每3-5隻糖尿病貓就有1隻是HST；DKA輸液6-12hr矯正、鉀>3.0-3.5才給胰島素；難以regulate常見肥胖/牙科疾病/蹠行姿勢..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓糖尿病照護指南",
    url: "內科/貓糖尿病照護指南.html",
    section: "diet",
    sectionName: "飲食與緩解",
    keywords: "低碳水飲食 remission 緩解 體重管理 BCS DKA病史",
    snippet: "低碳水化合物飲食與較高緩解率相關；早期有效減重與緩解機率增加15倍相關；約25%於2-3個月內緩解、多數6個月內達成..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "overview",
    sectionName: "總覽與腎臟功能",
    keywords: "CKD chronic kidney disease 慢性腎病 iCatCare 2026 腎元 nephron",
    snippet: "CKD好發於7歲以上貓；腎臟代償能力強，喪失部分功能仍可能沒有明顯症狀..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "staging",
    sectionName: "IRIS 分期與分亞期",
    keywords: "IRIS staging creatinine SDMA UP/C 蛋白尿 proteinuria 血壓 hypertension substaging",
    snippet: "IRIS分期依creatinine/SDMA分1-4期，再依蛋白尿UP/C與血壓分亞期；貓Stage2 creatinine 1.6-2.8mg/dL..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "treatment",
    sectionName: "依分期治療原則",
    keywords: "腎臟處方飲食 治療原則 stage 磷結合劑 FGF23 維持輸液 IRIS 2023",
    snippet: "IRIS 2023治療建議：每期共通5步驟、依分期疊加重點、血磷目標隨分期放寬(1.5→1.6→1.9 mmol/L)、維持輸液配方..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "complications",
    sectionName: "常見併發症處置",
    keywords: "amlodipine telmisartan benazepril maropitant darbepoetin molidustat mirtazapine ondansetron omeprazole capromorelin cisapride PEG3350 psyllium 高血壓 蛋白尿 低血鉀 便秘 代謝性酸中毒 貧血 眼內出血",
    snippet: "高血壓目標理想<140、至少<160 mmHg；telmisartan治療蛋白尿1mg/kg與治療高血壓2mg/kg劑量不同；便秘用PEG3350／cisapride；貧血用darbepoetin或molidustat..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "comorbidities",
    sectionName: "常見共病與麻醉考量",
    keywords: "甲狀腺機能亢進 hyperthyroidism thiamazole NSAID DJD 慢性疼痛 gabapentin 糖尿病 SGLT2 麻醉 anesthesia MAP",
    snippet: "CKD併發甲亢比例15-51%，不應為保護腎臟而少治療甲亢；穩定期CKD才能謹慎使用NSAID；麻醉時調整輸液速率與腎排除藥物劑量..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "homecare",
    sectionName: "飲食與居家照護",
    keywords: "腎臟處方飲食 五大支柱 five pillars 皮下輸液 subcutaneous fluids 居家採尿",
    snippet: "腎臟處方飲食需漸進轉換1-2週；五大支柱居家環境調整；皮下輸液每1-3天一次..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "貓慢性腎病（CKD）照護指南",
    url: "內科/貓慢性腎病CKD照護指南.html",
    section: "monitoring",
    sectionName: "監測與預後",
    keywords: "回診頻率 monitoring prognosis 存活期 心腎症候群 cardiorenal syndrome BCS MCS",
    snippet: "診斷初期每2-4週回診，穩定後每3-6個月；病程穩定貓中位存活期894天，持續惡化者僅287天..."
  },

  {
    subject: "研討會",
    week: null,
    weekTitle: "犬淋巴瘤照護與診斷新趨勢",
    url: "研討會/犬淋巴瘤照護與診斷新趨勢.html",
    section: "diagnostics",
    sectionName: "診斷工具比較",
    keywords: "FNA biopsy IHC ICC PARR flow cytometry 免疫分型 淋巴瘤診斷",
    snippet: "FNA為第一線診斷；PARR特異度89-94%判讀10-14天；流式細胞儀特異度95-100%判讀3-5天..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬淋巴瘤照護與診斷新趨勢",
    url: "研討會/犬淋巴瘤照護與診斷新趨勢.html",
    section: "staging",
    sectionName: "分期與分亞期",
    keywords: "lymphoma staging substage stage migration 分期偏移 犬淋巴瘤五期",
    snippet: "Stage1單一淋巴結至Stage5骨髓/眼/CNS/肺/皮膚；substage a/b預後差異顯著；分期偏移現象..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬淋巴瘤照護與診斷新趨勢",
    url: "研討會/犬淋巴瘤照護與診斷新趨勢.html",
    section: "treatment",
    sectionName: "治療選擇比較",
    keywords: "CHOP Tanovea rabacfosadine Laverdia verdinexor prednisone 緩和治療 化療 生活品質",
    snippet: "CHOP多藥方案MST B細胞14個月/T細胞6-7個月；Laverdia口服每週兩次；化療多數不影響生活品質..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬淋巴瘤照護與診斷新趨勢",
    url: "研討會/犬淋巴瘤照護與診斷新趨勢.html",
    section: "liquidbiopsy",
    sectionName: "液態切片新工具",
    keywords: "IDEXX Cancer Dx 液態切片 liquid biopsy SEARCHER Nascimento 篩檢 陽性預測值",
    snippet: "特異度98.9%敏感度79.3%；SEARCHER篩檢研究中陽性後確診率僅約5/17；緩解後轉陰、復發時轉陽相關性..."
  },
];
