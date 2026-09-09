/* ══════════════════════════════════════════════════════
   上群 網頁筆記 — 跨科目／跨週次搜尋索引
   每次新增或修改一週筆記時，請同步在這裡補上／更新對應條目。
   欄位說明：
     subject     科目名稱（需與資料夾名稱一致）
     semester    學期（例：大四上／大三）
     week        週次數字（無週次概念的筆記可省略或填 null）
     weekTitle   該篇筆記標題
     url         筆記檔案的相對路徑（相對於 網頁筆記/ 這一層）
     section     筆記內對應的分節 id（對應頁面 id="section-xxx"）
     sectionName 分節顯示名稱
     keywords    額外關鍵字（不會顯示，只用於比對）
     snippet     顯示用的摘要文字
   ══════════════════════════════════════════════════════ */

const SEARCH_INDEX = [
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "history", sectionName: "外科學簡史",
    keywords: "barber-surgeons 理髮師外科醫 古埃及 古印度 軍馬 生產性動物",
    snippet: "中世紀時人體解剖屬於禁忌，拔牙、腫瘤切除、截肢等手術由 barber 執行，是外科發展早期的歷史背景。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "evaluation", sectionName: "病患評估",
    keywords: "理學檢查 physical examination 電解質 皺胃 RDA RVA 酮症 ketosis BUN creatinine 腹腔液 colic PCV total protein 病歷紀錄",
    snippet: "電解質檢測用於右側皺胃疾病、尿液分析評估酮症、腹腔液分析用於剖腹探查前的腹絞痛病例。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "judgement", sectionName: "手術判斷",
    keywords: "手術三問 是否必要 轉診 refer 緊急病例 經濟效益 農場手術 on the farm 無塵手術室",
    snippet: "手術判斷三問：是否必要、不做會如何、能力設備是否足夠；超出能力應轉診，緊急病例則盡力而為。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "asepsis", sectionName: "無菌與抗菌原則",
    keywords: "SSI 手術部位感染 host defense 手術分類 clean clean-contaminated contaminated-dirty 抗生素 預防性給藥 hypoalbuminemia",
    snippet: "手術分類分為 Clean、Clean-contaminated、Contaminated-dirty 三級；抗生素絕不能用來彌補手術技術上的缺失。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "postop", sectionName: "術後照護",
    keywords: "術後給藥 術後餵食 術後追蹤 postoperative care",
    snippet: "術後照護三要項：術後給藥、術後餵食與管理、術後追蹤。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "ruminant", sectionName: "反芻動物麻醉風險",
    keywords: "瘤胃 脹氣 bloat 逆流 regurgitation 吸入性肺炎 aspiration pneumonia cuffed 氣管內管 口瘤胃管 禁食 禁水 小牛 深度鎮靜 橫膈 hypoventilation hypoxia hypercarbia 呼吸性酸中毒",
    snippet: "長時間躺臥導致瘤胃脹氣、逆流、吸入性肺炎；預防措施包含禁食、cuffed 氣管內管、口瘤胃管。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "sedation", sectionName: "鎮靜用藥",
    keywords: "α-2 agonist xylazine 希拉嗪 detomidine medetomidine dexmedetomidine romifidine 懷孕 子宮收縮 流產 yohimbine tolazoline 拮抗劑 butorphanol 瘤胃遲緩 ruminal atony ileus",
    snippet: "Xylazine 在早期妊娠母牛有類似催產素作用，會誘發子宮收縮，懷孕牛使用需特別謹慎；拮抗劑為 yohimbine 或 tolazoline。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "local", sectionName: "局部／區域麻醉",
    keywords: "lidocaine mepivacaine bupivacaine 利多卡因 直線浸潤麻醉 linear infiltration 劑量 3-5 mg/kg 硬膜外 epidural 神經周圍 perineural 腹外斜肌 腹內斜肌 腹橫肌",
    snippet: "Lidocaine 安全總劑量 3–5 mg/kg；Bupivacaine 心毒性高，僅限硬膜外或神經周圍給藥；牛腹壁浸潤麻醉需麻醉兩層肌肉。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "invertedl", sectionName: "倒 L 型阻斷",
    keywords: "inverted L block T13 L1 L2 剖腹產 caesarean section 瘤胃造口術 rumen fistulation 腰椎橫突",
    snippet: "倒 L 型阻斷阻斷 T13、L1、L2 神經支配區域，適用於剖腹產與瘤胃造口術。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試",
    snippet: "本週學習重點整理：手術分類、抗生素時機、反芻動物麻醉機轉鏈、xylazine 懷孕禁忌、局麻藥選擇邏輯等九項重點。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "術前考量與麻醉",
    url: "大四上/大動物外科手術及實習/week01_術前考量與麻醉.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案",
    snippet: "涵蓋本週各章節重點的練習題（是非題／選擇題／簡答題），點擊即可顯示答案與解析。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "overview", sectionName: "縫線材質總論",
    keywords: "suture material 理想縫線特性 absorbable non-absorbable 可吸收 不可吸收 minimal tissue reaction",
    snippet: "理想縫線需組織反應最小、不利細菌生長、打結牢固；可吸收縫線水解分解，不可吸收縫線需維持張力強度 60 天以上。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "structure", sectionName: "縫線結構",
    keywords: "multifilament monofilament 多股 單股 編織 braided twisted harbor bacteria capillarity",
    snippet: "多股編織線容易藏匿細菌加重感染；單股合成線組織反應與毛細作用較低。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "materials", sectionName: "材質比較表",
    keywords: "surgical gut polyglycolic acid dexon polyglactin 910 vicryl vicryl rapide polydioxanone PDS maxon polyglyconate 材質比較",
    snippet: "常見縫線材質比較：手術腸線、Dexon、Vicryl、Vicryl Rapide、PDS II、PDS Plus、Maxon 的成分與優缺點。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "choice", sectionName: "縫線的選擇",
    keywords: "choice of suture material crystalloid bladder urinary calculus infected wound chromic gut braided bacterial harboring 結晶尿 尿路結石 感染傷口",
    snippet: "膀胱等結晶尿部位需留意縫線是否誘發尿路結石；感染傷口應避免編織／多股線，Chromic gut 具局部吞噬細胞活性。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "size", sectionName: "縫線尺寸",
    keywords: "size does matter 縫線號數 gauge 最小直徑 tensile strength 張力強度",
    snippet: "使用足以固定組織的最小直徑縫線；縫線張力強度不應超過組織本身的張力強度。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "needle", sectionName: "縫合針",
    keywords: "needle conventional cutting reverse cutting taper point taper cut special K 針尖 circle 弧度 point body swag",
    snippet: "Taper point 圓針創傷最小適合腸胃道；Reverse cutting 是目前皮膚縫合最常用的切割針。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "label", sectionName: "判讀縫線包裝",
    keywords: "suture packaging label 縫線包裝標示 suture size suture type suture needle",
    snippet: "縫線包裝標示須核對尺寸、種類、編織/單股、天然/合成、可吸收/不可吸收與縫合針型號。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "patterns", sectionName: "縫合模式",
    keywords: "simple interrupted simple continuous horizontal mattress vertical mattress lambert cushing purse string transfix ligature 單純間斷 單純連續 水平褥式 垂直褥式 荷包縫合 貫穿結紮",
    snippet: "單純間斷縫合最常用；水平褥式減張效果最佳但影響血液供應；垂直褥式血液循環較佳；Transfix ligature 防止滑脫。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 1, weekTitle: "縫合材料與結紮技術（實習）",
    url: "大四上/大動物外科手術及實習/week01_縫合材料與結紮技術.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案",
    snippet: "涵蓋縫線材質、縫合針與縫合模式重點的練習題，點擊即可顯示答案與解析。"
  }
];
