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
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "chop",
    sectionName: "淋巴瘤化療：CHOP-19 方案",
    keywords: "CHOP UW-Madison lymphoma 淋巴瘤 vincristine cyclophosphamide doxorubicin prednisone furosemide 週次劑量",
    snippet: "UW-Madison CHOP-19方案每週用藥：vincristine 0.5-0.7mg/m² IV、cyclophosphamide 250mg/m² PO搭配furosemide 1mg/kg、doxorubicin 30mg/m² IV..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "mdr1",
    sectionName: "MDR1 基因型與毒性放大",
    keywords: "MDR1 ABCB1 P-glycoprotein P-gp Collie 柯利犬 Australian Shepherd 澳洲牧羊犬 牧羊犬 基因檢測 vincristine doxorubicin loperamide 中樞神經毒性",
    snippet: "Collie帶因率約70%、Australian Shepherd約50%；帶ABCB1突變犬vincristine標準劇量下嗜中性球低下75% vs野生型11.5%(P=.0005)；doxorubicin腸道暴露量增加約174%..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "doxorubicin",
    sectionName: "Doxorubicin：劑量、給藥與心臟毒性",
    keywords: "doxorubicin 心臟毒性 cardiotoxicity Boxer 外滲 extravasation dexrazoxane EF ejection fraction vesicant 小型犬劑量",
    snippet: "doxorubicin ≥15kg用30mg/m²、<15kg改1mg/kg；Boxer犬心臟毒性15.4% vs其他品種3.0%；外滲3-6小時內給dexrazoxane解毒..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "carboplatin",
    sectionName: "腺癌化療實證：AGASACA 與腸道腺癌",
    keywords: "carboplatin AGASACA 肛門腺腺癌 anal sac adenocarcinoma Wouda 輔助化療 存活期 腸道腺癌 intestinal adenocarcinoma 5-FU 5-fluorouracil gemcitabine",
    snippet: "Wouda 2016研究n=74：手術+carboplatin組723天 vs單純手術581天存活期,P=.174無統計顯著差異；腸道腺癌目前無良好對照試驗支持任何化療方案，單純手術中位存活期僅2-4個月..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "grading",
    sectionName: "不良反應分級與處置流程",
    keywords: "VCOG-CTCAE 分級 grading 嗜中性球低下 neutropenia ANC 血小板低下 thrombocytopenia 嘔吐 腹瀉 vomiting diarrhea 劑量調整",
    snippet: "VCOG-CTCAE Grade1-5通用分級；嗜中性球ANC<500為Grade4；CHOP-19依ANC門檻決定照常給藥/暫緩/住院給抗生素..."
  },
  {
    subject: "內科",
    week: null,
    weekTitle: "犬化療照護與副作用管理指南",
    url: "內科/犬化療照護與副作用管理指南.html",
    section: "supportive",
    sectionName: "支持性照護",
    keywords: "maropitant 止吐 禁食 fasting G-CSF 嗜中性球 出血性膀胱炎 hemorrhagic cystitis furosemide vincristine 便秘 腹瀉 diarrhea CID smectite 蒙脫石 crofelemer Canalevia metronidazole loperamide Imodium 禁忌 MDR1",
    snippet: "禁食24小時降低doxorubicin延遲性嘔吐67%→10%；smectite 0.5g/kg PO縮短CID緩解時間19.5小時vs對照53小時；crofelemer為FDA核准CID專用藥；loperamide因MDR1風險不建議作常規止瀉選擇..."
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

  {
    subject: "外科",
    week: null,
    weekTitle: "貓口腔與牙科照護指南",
    url: "外科/貓口腔與牙科照護指南.html",
    section: "periodontal",
    sectionName: "牙周病與分期系統",
    keywords: "periodontal disease PD0 PD1 PD2 PD3 PD4 牙周病分期 附著喪失 attachment loss 牙菌斑指數 牙結石指數 牙齦指數 根分岔 furcation 動搖度",
    snippet: "牙周病須逐牙評估分期，PD2<25%附著喪失、PD3為25-50%、PD4>50%；完整評估含六點探診、根分岔與動搖度..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "貓口腔與牙科照護指南",
    url: "外科/貓口腔與牙科照護指南.html",
    section: "otherdisease",
    sectionName: "其他常見口腔疾病",
    keywords: "FCGS 貓慢性齒齦口腔炎 齒根吸收 tooth resorption TR Type1 Type2 Type3 咬合不正 malocclusion MAL 口腔腫瘤 SCC 鱗狀細胞癌 MRONJ FOPS 口面部疼痛",
    snippet: "FCGS共識為及早手術，全口或後段拔牙；TR無法預防、依型態拔除或截冠術，確診後建議每年複查；口腔病灶68%為惡性..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "貓口腔與牙科照護指南",
    url: "外科/貓口腔與牙科照護指南.html",
    section: "anesthesia",
    sectionName: "麻醉前用藥與麻醉照護",
    keywords: "ACEI ARB benazepril telmisartan amlodipine 胰島素 insulin 麻醉前用藥 停藥 continue discontinue 輸液 fluid rate IRIS 區域神經阻斷 nerve block",
    snippet: "ACEI/ARB術前至少24小時停用，amlodipine例外要繼續；胰島素依血糖給全劑量/半劑量/不給；IRIS≥Stage3輸液3-5mL/kg/h..."
  },
  {
    subject: "外科",
    week: null,
    weekTitle: "貓口腔與牙科照護指南",
    url: "外科/貓口腔與牙科照護指南.html",
    section: "postop",
    sectionName: "術後止痛、營養與抗生素原則",
    keywords: "抗生素 antibiotics 牙周病 拔牙 antimicrobial stewardship Feline Grimace Scale 止痛 食道造口管 esophagostomy tube",
    snippet: "常規牙周治療與拔牙術後多不需抗生素，僅免疫抑制或高感染風險考慮；多模式止痛3-7天，以Feline Grimace Scale追蹤..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "overview",
    sectionName: "貓眼的三個臨床陷阱",
    keywords: "貓 狗 差異 鑑別 FHV-1 FDIM 視網膜剝離 高血壓 Kobayashi FASAVA 2026",
    snippet: "持續性角膜炎狗找局部原因、貓先想FHV-1；虹膜變黑貓進展預後差；視網膜剝離貓先想高血壓..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "fhv",
    sectionName: "角膜結膜炎與 FHV-1",
    keywords: "貓疱疹病毒 FHV-1 樹枝狀潰瘍 dendritic 角膜黑色壞死 sequestrum 嗜酸性角膜炎 短頭 披衣菌 內翻",
    snippet: "沒有樹枝狀潰瘍不能排除FHV-1；短頭貓潰瘍OR 3.0、黑色壞死OR 9.0；需排除披衣菌、內翻、淚膜異常..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "fhv-tx",
    sectionName: "FHV-1 治療與復發",
    keywords: "famciclovir 90 mg/kg idoxuridine IDU 玻尿酸 益生菌 SF68 L-lysine 干擾素 潛伏 三叉神經節 PACK-CXL",
    snippet: "famciclovir 90 mg/kg PO q12h；IDU 每日6次；玻尿酸與益生菌為講者首選；病毒潛伏、緩解後不減量..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "cases-ocular",
    sectionName: "眼表病例：Lyli 與 Neko",
    keywords: "Lyli Neko 淋巴瘤 化療 類固醇 NSAID 眼藥 防腐劑 第三眼瞼糜爛 免疫抑制",
    snippet: "FHV-1合併免疫抑制與不當消炎眼藥導致惡化；免疫支持是關鍵..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "fdim",
    sectionName: "瀰漫性虹膜黑色素瘤 FDIM",
    keywords: "FDIM 虹膜黑色素瘤 melanosis 轉移 19-63% Kayes 摘除時機 Gregorio Moco 青光眼",
    snippet: "FDIM轉移率19-63%；基質侵犯定義惡性；晚期存活顯著較短；摘除時機的新資料僅為假說..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "fdim-dx",
    sectionName: "FDIM 診斷與雷射",
    keywords: "虹膜切片 iris biopsy AS-OCT 前眼節OCT PN比值 二極體雷射 diode laser Fuchs Popo Featherstone Beetz",
    snippet: "切片陽性支持摘除、陰性不能安心等；OCT輔助不確診；雷射1年存活96%，術後青光眼5%..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "rd",
    sectionName: "視網膜剝離鑑別",
    keywords: "視網膜剝離 retinal detachment 滲出性 孔源性 FIP 弓形蟲 隱球菌 淋巴瘤 GS-441524 急性失明 量血壓",
    snippet: "貓以滲出性剝離為主；老貓急性雙側失明先量血壓；年輕貓想FIP、流浪貓想弓形蟲隱球菌、老貓排除淋巴瘤..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "貓眼的獨特性：眼表、虹膜與眼底疾病",
    url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
    section: "htn",
    sectionName: "高血壓脈絡視網膜病變",
    keywords: "高血壓 hypertension amlodipine 0.625 mg ACVIM 2018 TOD 脈絡膜 CKD 甲狀腺機能亢進 benazepril telmisartan Young 2019",
    snippet: "視網膜剝離即TOD不必等重複測量；amlodipine 0.625 mg/cat q24h起始；失明貓57.6%恢復視力..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬貓角膜顏色：診斷與治療",
    url: "研討會/犬貓角膜顏色診斷與治療.html",
    section: "talks",
    sectionName: "講者與兩場演講",
    keywords: "Manbok Jeong 全南大學 角膜顏色 corneal color 診斷 治療 FASAVA 2026 DAiCVO",
    snippet: "Jeong醫師兩場演講大會摘要：角膜白藍紅褐黑顏色對應病理與治療選擇..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬貓角膜顏色：診斷與治療",
    url: "研討會/犬貓角膜顏色診斷與治療.html",
    section: "colors",
    sectionName: "角膜顏色對照表",
    keywords: "角膜 顏色 水腫 edema 內皮失養 sequestrum 黑色壞死 pannus 血管翳 脂質 礦物質 色素 melanocytoma",
    snippet: "藍灰=水腫，白=浸潤或沉積，紅=血管新生，褐=色素，黑=貓黑色壞死..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬貓角膜顏色：診斷與治療",
    url: "研討會/犬貓角膜顏色診斷與治療.html",
    section: "details",
    sectionName: "重點病灶說明",
    keywords: "色素性角膜炎 pigmentary keratitis 巴哥犬 cyclosporine tacrolimus descemetocele 結膜瓣 conjunctival graft sequestrum",
    snippet: "色素性角膜炎先處理誘因再局部免疫調節；descemetocele需手術..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "犬貓角膜顏色：診斷與治療",
    url: "研討會/犬貓角膜顏色診斷與治療.html",
    section: "treatment",
    sectionName: "內科或手術",
    keywords: "內科 手術 角膜潰瘍 descemetocele 轉診 穿孔",
    snippet: "單純潰瘍內科、深層潰瘍與黑色壞死傾向手術，術前術後仍需內科..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "cataract",
    sectionName: "白內障基礎與併發症",
    keywords: "柴犬 Shiba Inu 白內障 cataract LIU 水晶體誘發葡萄膜炎 phacolytic phacoclastic 水晶體脫位 糖尿病 分期",
    snippet: "柴犬白內障手術年齡中位2.1歲；LIU未成熟也可能發生；併發症造成疼痛..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "cataract-shiba",
    sectionName: "柴犬白內障：資料與篩檢",
    keywords: "柴犬 手術年齡 2.1歲 8.4歲 phaco 後照法 retroillumination 87.7% 視力保留 轉診",
    snippet: "柴犬 vs 其他品種手術年齡與術後視力；後照法篩檢與轉診前檢查..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "pacg",
    sectionName: "PACG：認識與診斷",
    keywords: "原發性隅角閉鎖青光眼 PACG 柴犬 隅角鏡 gonioscopy 眼壓 Kato 2006 80.6%",
    snippet: "柴犬占日本青光眼33%；隅角鏡是風險分級不是診斷；瞇眼當天量眼壓..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "pacg-tx",
    sectionName: "PACG：治療、病例與預防",
    keywords: "latanoprost 前列腺素 CAI timolol mannitol Ahmed valve AGV 72小時 對側眼預防 SRBD1 SIX6",
    snippet: "72小時內就診86.7%有視力；Ahmed閥12個月視力69.2% vs 藥物7.7%；對側眼預防..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "endo",
    sectionName: "角膜內皮疾病與內皮炎",
    keywords: "角膜內皮炎 endotheliitis PCED 柴犬 地圖狀內皮混濁 局部類固醇 ripasudil 鏡面顯微鏡 CAV-1 藍眼",
    snippet: "柴犬角膜內皮炎對類固醇有反應但會復發；緩解不等於內皮恢復..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
    url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
    section: "endo-case",
    sectionName: "病例 3：35 個月追蹤",
    keywords: "內皮炎 病例 betamethasone ripasudil 內皮細胞密度 cells/mm2 鏡面顯微鏡",
    snippet: "病例3：右眼細胞密度1511→595，加ripasudil後35個月緩解維持..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "鸚鵡醫學：幼雛、老年與腫瘤",
    url: "研討會/鸚鵡醫學-幼雛老年與腫瘤.html",
    section: "juvenile",
    sectionName: "幼雛與青年鸚鵡",
    keywords: "鸚鵡 幼雛 嗉囊停滯 crop stasis 酸嗉囊 禽波納病毒 ABV PDD PBFD 喙羽病 多瘤病毒 APV 念珠菌 嗉囊燒傷 代謝性骨病",
    snippet: "幼雛嗉囊排空延遲是紅旗；先查飼養管理；每天秤重；嗉囊與糞便細胞學最快..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "鸚鵡醫學：幼雛、老年與腫瘤",
    url: "研討會/鸚鵡醫學-幼雛老年與腫瘤.html",
    section: "geriatric",
    sectionName: "老年鸚鵡",
    keywords: "老年鸚鵡 骨關節炎 動脈粥樣硬化 腎病 痛風 白內障 麻醉 meloxicam pimobendan",
    snippet: "老年鸚鵡多系統評估；鳥的疼痛隱晦；環境調整就是治療；麻醉前先給氧..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "鸚鵡醫學：幼雛、老年與腫瘤",
    url: "研討會/鸚鵡醫學-幼雛老年與腫瘤.html",
    section: "oncology",
    sectionName: "鳥類腫瘤",
    keywords: "鳥類腫瘤 鱗狀細胞癌 SCC 淋巴瘤 垂體腺瘤 黃瘤 脂肪瘤 化療 carboplatin 光動力 PDT 細胞學",
    snippet: "鳥類腫瘤沒有標準治療；細胞學與組織病理一致率72.8%；惡性87.5%、良性55.6%..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "鸚鵡醫學：幼雛、老年與腫瘤",
    url: "研討會/鸚鵡醫學-幼雛老年與腫瘤.html",
    section: "other",
    sectionName: "爬蟲與小型哺乳類腫瘤",
    keywords: "兔 子宮腺癌 天竺鼠 脂肪瘤 雪貂 腎上腺 胰島素瘤 蛇 軟組織肉瘤 爬蟲腫瘤",
    snippet: "未結紮母兔子宮腺癌5歲前可達80%；雪貂腎上腺腫瘤內科治療無病期較長..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "異寵超音波：從入門到進階",
    url: "研討會/異寵超音波-從入門到進階.html",
    section: "overview",
    sectionName: "設備、保定與檢查路徑",
    keywords: "異寵 超音波 探頭 5-11 MHz 線性 24 MHz 保定 isoflurane 檢查路徑 蛇 心臟",
    snippet: "鳥麻醉下檢查；呼吸窘迫不麻醉；蛇從心臟往尾側，其他從肝與膽囊開始..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "異寵超音波：從入門到進階",
    url: "研討會/異寵超音波-從入門到進階.html",
    section: "bird",
    sectionName: "鳥類超音波",
    keywords: "鳥 超音波 氣囊 air sac 聲窗 劍突 腹水 卵阻塞 心血管 動脈粥樣硬化 心衰竭",
    snippet: "氣囊反射超音波；4個聲窗；腹水是最佳對比；心衰竭是老鳥主因..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "異寵超音波：從入門到進階",
    url: "研討會/異寵超音波-從入門到進階.html",
    section: "reptile",
    sectionName: "爬蟲超音波",
    keywords: "爬蟲 超音波 蛻皮 ecdysis 卵泡停滯 卵阻塞 egg binding 異物 肛囊",
    snippet: "蛻皮前後不能掃；生殖道最重要；可區分卵阻塞與卵泡停滯..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "異寵超音波：從入門到進階",
    url: "研討會/異寵超音波-從入門到進階.html",
    section: "mammal",
    sectionName: "小型哺乳類超音波",
    keywords: "天竺鼠 兔 雪貂 卵巢囊腫 腸氣 結石 懷孕 腎上腺",
    snippet: "小型哺乳類像狗貓，限制為腸氣；生殖道為首選；雪貂腎上腺腫瘤..."
  },
  {
    subject: "FASAVA 2026",
    week: null,
    weekTitle: "FASAVA 2026 三天課表",
    url: "FASAVA2026/index.html",
    section: "",
    sectionName: "課表與依科別瀏覽",
    keywords: "FASAVA 2026 課表 program 講者 Gawor Heng Xie Mori Nakashima Ishida Steagall Fatjo Bowen Mills Jeong Kobayashi Jank Morissette Boyd Côté Simpson Baranidharan Hochleithner Stanley Marks",
    snippet: "10/31–11/2 三天課表，可依日期或科別查看講者、講義與筆記..."
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "abstract",
    sectionName: "重點摘要",
    keywords: "骨關節炎 OA 慢性疼痛 Steagall FASAVA 重點",
    snippet: "OA 不是老狗的病；X 光無法告訴你多痛；抗 NGF 單抗與 APBR 安全訊號"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "concept",
    sectionName: "急性與慢性疼痛",
    keywords: "適應性 非適應性 中樞敏感化 wind-up 持續性術後疼痛 PPSP 眼睛疼痛 FCGS 去爪 感覺過敏症候群 配合度 compliance",
    snippet: "慢性疼痛是神經系統的改變；常見原因；多重用藥讓配合度下降"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "assess",
    sectionName: "OA 的三步驟臨床評估",
    keywords: "病史 飼主參與 家中影片 兔跳 bunny hop 理學檢查 X 光 34% 危險因子",
    snippet: "病史與飼主參與、低壓力理學檢查、X 光只能確認不能告訴你多痛"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "scales",
    sectionName: "慢性疼痛量表",
    keywords: "CBPI HCPI LOAD COAST Feline MiPSC FMPI-sf CSOM 量表 篩檢清單 Gober",
    snippet: "慢性量表沒有給藥切點、要同一位飼主填；貓三步驟量表"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "ngf",
    sectionName: "OA 疼痛與 NGF 機轉",
    keywords: "NGF TrkA 神經性發炎 neurogenic inflammation QST 安慰劑 NSAID 不良反應 厭食",
    snippet: "NGF 結合發炎細胞 TrkA，釋放介質與更多 NGF，促進並延續慢性疼痛"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "mab",
    sectionName: "Bedinvetmab 與 frunevetmab",
    keywords: "bedinvetmab frunevetmab Librela Solensia 單株抗體 起效 第 2 劑 每 4 週 SC",
    snippet: "物種專一抗 NGF 單抗，最早 2 週見效，第 2 劑後達最大效果"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "safety",
    sectionName: "安全性與藥物警戒",
    keywords: "藥物警戒 pharmacovigilance VMD FDA APBR 骨重塑 Budsberg 肘 跗 NSAID 併用 RPOA tanezumab Farrell",
    snippet: "9.48 件／萬劑屬罕見；186 隻狗 APBR；不建議與 NSAID 併用；關節腫脹拍 X 光考慮停藥"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛評估與抗 NGF 單株抗體",
    url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
    section: "quiz",
    sectionName: "練習題",
    keywords: "練習題 情境 Librela carprofen 併用 關節腫脹",
    snippet: "7 題臨床情境問答"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "abstract",
    sectionName: "重點摘要",
    keywords: "慢性疼痛 治療 證據 Steagall 輔助止痛藥",
    snippet: "第一線 NSAID 與抗 NGF 單抗；tramadol 狗無效；gabapentin CKD 貓減量"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "overview",
    sectionName: "課程架構與劑量總表",
    keywords: "劑量 grapiprant paracetamol tramadol gabapentin pregabalin amitriptyline amantadine mg/kg PO",
    snippet: "輔助止痛藥與抗發炎藥的劑量、途徑、物種與證據一覽"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "screen",
    sectionName: "篩檢的新證據",
    keywords: "Wright 2022 篩檢清單 carprofen 年輕狗 Enomoto 39.8% 盛行率",
    snippet: "37.6% 確認 OA；4 歲以下的狗 39.8% 有 X 光 OA 但幾乎沒治療"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "plan",
    sectionName: "治療計畫與止痛試驗",
    keywords: "止痛試驗 analgesic challenge 4-6 週 照顧者負擔 金字塔 嚴重度 安樂死",
    snippet: "止痛試驗 4–6 週是專家共識；依 OA 嚴重度逐層加藥"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "nsaid",
    sectionName: "NSAID",
    keywords: "NSAID 禁忌 厭食 嘔吐 5% 監測 washout 48 小時 robenacoxib meloxicam carprofen CKD",
    snippet: "一種 NSAID 禁忌通常全部禁忌；換藥 washout 約 48 小時；厭食是最早徵兆"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "other",
    sectionName: "其他抗發炎藥與比較試驗",
    keywords: "grapiprant EP4 paracetamol 貓禁忌 bedinvetmab meloxicam Innes COI 不良事件",
    snippet: "Grapiprant 2 mg/kg PO q24h；bedinvetmab 與 meloxicam 一樣有效、不良事件較少"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "tramadol",
    sectionName: "Tramadol",
    keywords: "tramadol O-desmethyltramadol M1 血清素 狗無效 貓 2-5 mg/kg",
    snippet: "狗幾乎不產生活性代謝物；貓 2–5 mg/kg PO q8–12h"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "gaba",
    sectionName: "Gabapentin 與 pregabalin",
    keywords: "gabapentin pregabalin CKD 貓 減量 Quimby 運送焦慮 鎮靜 急性疼痛 麻醉減量",
    snippet: "5–10 mg/kg PO q8–12h；CKD 貓減量；不建議用於急性疼痛"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "nmda",
    sectionName: "Amitriptyline、amantadine 與 ketamine",
    keywords: "amitriptyline amantadine NMDA ketamine 皮下 FIC 骨肉瘤 Lascelles",
    snippet: "Amantadine 3–5 mg/kg PO q24h 有證據；amitriptyline 證據不足；每月皮下 ketamine 沒有證據"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "qa",
    sectionName: "圓桌問答",
    keywords: "保健品 葡萄糖胺 軟骨素 pentosan omega-3 FCGS 齦口炎 CKD 貓 肌少症 監測頻率",
    snippet: "關節保健品證據弱；CKD＋OA 貓首選抗 NGF 單抗；FCGS 先做口腔處置"
  },
  {
    subject: "研討會",
    week: null,
    weekTitle: "慢性疼痛藥物治療：證據整理",
    url: "研討會/慢性疼痛藥物治療-證據整理.html",
    section: "quiz",
    sectionName: "練習題",
    keywords: "練習題 情境 tramadol gabapentin 保健品 meloxicam",
    snippet: "7 題臨床情境問答"
  },
];
