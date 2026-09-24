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
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 脅腹剖腹術 瘤胃切開術 瘤胃瘻管 皺胃移位 LDA RDA 大網膜固定術",
    snippet: "六個臨床重點：左右脅腹適應症分類、瘤胃雙層縫合、污染器械隔離、LDA兩階段機轉、ping sound診斷、四種皺胃固定術取捨。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "flanklaparotomy", sectionName: "脅腹剖腹術總論",
    keywords: "Flank laparotomy 左脅腹 右脅腹 直線浸潤麻醉 腹外斜肌 腹內斜肌 腹橫肌 垂直切口",
    snippet: "左脅腹用於瘤胃相關手術、右脅腹用於大網膜固定與剖腹產；備皮麻醉標準流程、進刀層次與縫合方式。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "rumenotomy", sectionName: "瘤胃切開術",
    keywords: "Rumenotomy 瘤胃異物 Cushing縫合 雙層縫合 內翻縫合 污染器械",
    snippet: "移除瘤胃網胃異物；Cushing pattern錨定瘤胃；雙層縫合關閉（單純連續＋內翻縫合）；污染器械分開存放。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "rumenfistulation", sectionName: "瘤胃瘻管造口術",
    keywords: "Rumen fistulation 營養試驗 慢性脹氣 瘤胃液移植 瘤胃瘻管拆線",
    snippet: "營養試驗、慢性脹氣治療、瘤胃液移植；3/6/9/12點鐘位置縫合固定；術後14天更換瘻管流程。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "abomasaldisplacement", sectionName: "皺胃移位：病因與診斷",
    keywords: "Displacement of abomasum DA LDA RDA 皺胃解剖 病因 atony ping sound 聽診叩診",
    snippet: "皺胃正常解剖位置；分娩＋皺胃張力不足兩階段病因機轉；高音調ping sound聽診叩診診斷。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "abomasopexy", sectionName: "皺胃固定術式比較",
    keywords: "Right-flank omentopexy 大網膜固定術 Toggle-pin 套鎖針固定術 Laparoscopic abomasopexy 腹腔鏡固定術 Ventral paramedian 腹旁中線固定術",
    snippet: "右脅腹大網膜固定術（首選）、套鎖針固定術（經濟快速但盲目）、腹腔鏡固定術（併發症最少）、腹旁中線固定術（皺胃潰瘍沾黏適用）四種術式比較。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 腹腔手術 瘤胃 皺胃移位 國考",
    snippet: "七點總複習：左右脅腹分類、進刀縫合順序、瘤胃雙層縫合、瘤胃切開vs瘻管差異、LDA機轉、ping sound、四種皺胃固定術取捨。"
  },
  {
    subject: "大動物外科手術及實習", semester: "大四上", week: 3, weekTitle: "腹腔手術",
    url: "大四上/大動物外科手術及實習/week03_腹腔手術.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 腹腔手術 皺胃移位",
    snippet: "涵蓋脅腹剖腹適應症、瘤胃縫合、LDA機轉、皺胃固定術式選擇的練習題（共7題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "overview", sectionName: "骨骼系統總論",
    keywords: "骨骼分類 長骨 短骨 扁平骨 不規則骨 籽骨 含氣骨 方位術語 cranial caudal dorsal ventral medial lateral proximal distal palmar plantar rostral 骨骼表面標記 process tubercle tuberosity trochanter crest fossa foramen notch fovea condyle epicondyle trochlea",
    snippet: "骨骼分類（長骨/短骨/扁平骨/不規則骨/籽骨）與全身通用的方位術語、骨骼表面標記術語對照表，是後面各部位骨骼小節共用的基礎語彙。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "skull", sectionName: "頭骨",
    keywords: "skull neurocranium viscerocranium 神經顱 顏面顱 枕骨 occipital 蝶骨 sphenoid 顳骨 temporal 額骨 frontal 頂骨 parietal 篩骨 ethmoid 切齒骨 上頜骨 maxilla 鼻骨 淚骨 顴骨 zygomatic 腭骨 翼骨 犁骨 下頜骨 mandible foramen magnum 枕骨大孔 顳頜關節 TMJ 舌骨器 hyoid 咀嚼肌 顳肌 咬肌 masseter 翼肌",
    snippet: "神經顱（枕骨/蝶骨/顳骨/額骨/頂骨/篩骨）與顏面顱（切齒骨/上頜骨/鼻骨/淚骨/顴骨/腭骨/翼骨/犁骨/下頜骨）重要構造整理，含舌骨器與咀嚼肌群。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "vertebral", sectionName: "脊柱與胸廓",
    keywords: "vertebral column 脊柱 頸椎 cervical 胸椎 thoracic 腰椎 lumbar 薦椎 sacral 尾椎 caudal 脊柱公式 C7T13L7S3Cd 寰椎 atlas 樞椎 axis dens 齒突 寰樞關節不穩定 atlantoaxial instability anticlinal vertebra T11 肋椎關節 costovertebral 肋骨 ribs 胸骨 sternum 椎間盤突出 IVDD 腰薦間隙 L7-S1 硬膜外麻醉 epidural 腦脊髓液採集 cisternal puncture",
    snippet: "犬脊柱公式 C7T13L7S3Cd20-23、椎骨共同構造、寰椎/樞椎特化構造與寰樞不穩定、T11 anticlinal vertebra、薦椎、肋骨胸骨、臨床穿刺定位地標、IVDD。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "forelimb", sectionName: "前肢骨骼",
    keywords: "thoracic limb forelimb 肩胛骨 scapula 鎖骨 clavicle 肱骨 humerus 大結節 小結節 結節間溝 橈骨 radius 尺骨 ulna 鷹嘴 olecranon 肘突 anconeal process 冠狀突 coronoid process 肘關節發育不良 elbow dysplasia FCP UAP 腕骨 carpal 掌骨 metacarpal 指骨 phalanges 懸爪 dewclaw 斷爪 declaw onychectomy",
    snippet: "肩胛骨（鎖骨退化）、肱骨、橈尺骨（肘關節發育不良 FCP/UAP）、腕掌指骨（7塊腕骨）構造整理，含斷爪手術倫理提醒。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "hindlimb", sectionName: "後肢骨骼",
    keywords: "pelvic limb 骨盆 pelvis 髂骨 ilium 坐骨 ischium 恥骨 pubis 髖臼 acetabulum 閉孔 obturator foramen 髖關節脫臼 hip luxation 髖關節發育不良 hip dysplasia Ortolani test FHO 股骨 femur 轉子 trochanter 膝關節 stifle 十字韌帶 cruciate ligament 前抽屜試驗 cranial drawer test 髕骨脫臼 patellar luxation 腓骨 fibula 跗骨 tarsal 蹠骨 metatarsal 跟腱斷裂 plantigrade",
    snippet: "骨盆三骨（髂骨/坐骨/恥骨）與髖臼、髖關節脫臼/發育不良、股骨、膝關節（十字韌帶/髕骨脫臼）、跗蹠趾骨，含跟腱斷裂的蹠行步態。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 骨骼系統",
    snippet: "10點考試/臨床導向整理：方位術語、脊柱公式、寰樞椎、肋椎關節、肩胛骨懸吊結構、肘髖關節疾病、膝關節臨床重點、腕跗骨組成、臨床定位地標、髕骨/豆骨籽骨辨識。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 骨骼系統",
    snippet: "涵蓋骨骼系統總論到後肢各章節重點的練習題（是非/選擇/簡答，共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "overview", sectionName: "中樞神經系統總論",
    keywords: "CNS PNS 中樞神經系統 周邊神經系統 cranial nerves spinal nerves ganglia 感覺傳入 運動傳出 somatic autonomic sympathetic parasympathetic 灰質 grey matter 白質 white matter oligodendroglia myelin tract lemniscus decussation funiculus fasciculus commissura 胚胎發育 telencephalon diencephalon mesencephalon metencephalon myelencephalon 腦室",
    snippet: "CNS（腦＋脊髓）與PNS（顱神經/脊神經/神經節）的區分、神經系統三大功能、灰質白質組成原則、腦部胚胎發育五分區與對應腦室。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "forebrain", sectionName: "前腦：大腦與間腦",
    keywords: "forebrain cerebrum telencephalon diencephalon 大腦 端腦 間腦 額葉 頂葉 顳葉 枕葉 frontal parietal temporal occipital lobe cruciate sulcus 十字溝 basal nuclei 基底核 caudate putamen globus pallidus striatum 紋狀體 substantia nigra corticospinal tract 內囊 internal capsule corona radiata limbic system 邊緣系統 cingulate gyrus hippocampus fornix amygdala thalamus 視丘 hypothalamus 下視丘 epithalamus habenular pineal gland mammillary body lamina terminalis OVLT tuber cinereum pituitary gland adenohypophysis neurohypophysis",
    snippet: "大腦皮質分葉與功能區、基底核（尾核/被殼/蒼白球）與巴金森氏症、邊緣系統、視丘與下視丘、上視丘（松果腺）、腦下垂體前後葉。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "midbrain", sectionName: "中腦",
    keywords: "mesencephalon midbrain 中腦 tectum 頂蓋 corpora quadrigemina 四疊體 rostral colliculus caudal colliculus 前丘 後丘 superior inferior colliculus tegmentum 被蓋 red nucleus 紅核 substantia nigra 黑質 reticular formation 網狀結構 periaqueductal gray PAG pretectal region 頂蓋前區 crus cerebri 大腦腳 pupillary light reflex 瞳孔光反射 oculomotor trochlear nerve",
    snippet: "中腦三分區（頂蓋/被蓋/大腦腳）、前丘後丘視聽覺反射、紅核黑質網狀結構、瞳孔光反射路徑、CN III IV起源。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "hindbrain", sectionName: "後腦：橋腦、延腦、小腦",
    keywords: "pons 橋腦 medulla oblongata 延腦 myelencephalon cerebellum 小腦 metencephalon vermis 蚓部 flocculonodular lobe 絨球小結葉 primary fissure cerebellar peduncle 小腦腳 superior middle inferior pyramids 錐體 decussation of pyramids 錐體交叉 trapezoid body 斜方體 olivary nucleus 橄欖核 vital centers 生命中樞 ataxia dysmetria intention tremor 共濟失調 辨距不良 意向性震顫",
    snippet: "橋腦連結大腦小腦、小腦分層分葉與三對小腦腳、延腦錐體交叉與生命中樞、小腦病灶不造成無力的臨床觀念。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "spinal", sectionName: "脊髓",
    keywords: "spinal cord 脊髓 cervical thoracic lumbar sacral caudal intumescence 頸膨大 腰膨大 cauda equina 馬尾 conus medullaris 脊髓圓錐 dorsal horn ventral horn lateral horn 背角 腹角 外側角 dorsal funiculus lateral funiculus ventral funiculus dorsal column medial lemniscus fasciculus gracilis fasciculus cuneatus spinothalamic tract spinocerebellar tract corticospinal tract rubrospinal reticulospinal vestibulospinal UMN LMN upper motor neuron lower motor neuron hyperreflexia hyporeflexia epidural anesthesia myelography",
    snippet: "各物種脊髓節段數比較、灰質白質構造、上行徑（本體感覺/痛溫覺/非意識性本體感覺）與下行徑（錐體/錐體外系統）、UMN/LMN鑑別、臨床穿刺定位。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "meninges", sectionName: "腦膜與腦脊髓液",
    keywords: "meninges 腦脊髓膜 dura mater 硬膜 arachnoid mater 蛛網膜 pia mater 軟膜 epidural space 硬膜上腔 subdural space 硬膜下腔 subarachnoid space 蛛網膜下腔 CSF 腦脊髓液 choroid plexus 脈絡叢 lateral ventricle third ventricle fourth ventricle mesencephalic aqueduct central canal arachnoid villi 蛛網膜絨毛 cisternal puncture lumbar puncture hydrocephalus 水腦症 meningitis 腦膜炎",
    snippet: "腦脊髓膜三層構造、腦室系統、CSF由脈絡叢產生到蛛網膜絨毛回收的完整循環路徑、CSF採集與水腦症/腦膜炎臨床應用。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "cranial", sectionName: "12對顱神經",
    keywords: "cranial nerves 顱神經 olfactory optic oculomotor trochlear trigeminal abducens facial vestibulocochlear glossopharyngeal vagus accessory hypoglossal 嗅神經 視神經 動眼神經 滑車神經 三叉神經 外展神經 顏面神經 前庭耳蝸神經 舌咽神經 迷走神經 副神經 舌下神經 head tilt nystagmus 頭傾 眼球震顫 neurolocalization 神經定位",
    snippet: "12對顱神經功能簡表、腦幹起源分布（中腦/橋腦/延腦）、神經定位診斷概念、顏面神經與前庭耳蝸神經常見臨床異常。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 神經系統 CNS",
    snippet: "11點考試/臨床導向整理：CNS/PNS分類、灰質白質、腦部發育五分區、基底核與黑質、邊緣系統、下視丘垂體、中腦四疊體、小腦協調功能、延腦生命中樞與UMN/LMN、CSF循環與腦膜、顱神經定位。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 神經系統 CNS",
    snippet: "涵蓋CNS總論到顱神經各章節重點的練習題（是非/選擇/簡答，共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "overview", sectionName: "關節總論",
    keywords: "arthrology 關節學 韌帶學 syndesmology 纖維關節 fibrous joint 縫合 suture syndesmosis gomphosis 嵌合 軟骨關節 cartilaginous joint synchondrosis symphysis 半動關節 amphiarthrosis 滑液關節 synovial joint diarthrosis 關節腔 關節軟骨 articular cartilage 關節囊 articular capsule 纖維層 滑液層 synovial fluid 韌帶 ligament 半月板 meniscus 關節盤 articular disc 關節唇 labrum glenoidale 滑液囊 bursa 腱鞘 tendon sheath",
    snippet: "關節三大分類（纖維/軟骨/滑液關節）與次分類（縫合、syndesmosis、synchondrosis、symphysis），滑液關節構造（關節囊、滑液、韌帶、半月板、關節唇）整理。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "movement", sectionName: "運動方式與分類",
    keywords: "gliding movement 滑動 angular movement 角度運動 flexion extension adduction abduction 屈曲 伸展 內收 外展 rotary movement circumduction rotation 迴旋 旋轉 pronation supination 旋前 旋後 plane joint 平面關節 hinge joint ginglymus 鉸鏈關節 pivot joint trochoid 車軸關節 condyloid ellipsoid joint 髁狀關節 saddle joint 鞍狀關節 ball-and-socket joint 球窩關節 cotylic joint 杵臼關節 單軸 雙軸 多軸 uniaxial biaxial multiaxial",
    snippet: "滑液關節運動方式（滑動/角度/迴旋運動）與依軸心數目分類的七種關節類型（平面/鉸鏈/車軸/髁狀/鞍狀/球窩/杵臼關節）對照表。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "forelimb", sectionName: "前肢關節",
    keywords: "shoulder joint glenohumeral joint 肩關節 glenoid cavity 關節盂 glenohumeral ligament 盂肱韌帶 intertubercular groove 結節間溝 biceps brachii tendon transverse humeral retinaculum elbow joint 肘關節 hinge joint humeral condyle trochlear notch coronoid process anconeal process collateral ligament annular ligament interosseous ligament carpal joint 腕關節 radiocarpal joint intercarpal joint carpometacarpal joint",
    snippet: "肩關節（球窩關節，盂肱韌帶與結節間溝二頭肌腱穩定）、肘關節（鉸鏈關節）、腕關節（橈腕/腕骨間/腕掌三層關節）構造與韌帶整理。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "hindlimb", sectionName: "後肢關節",
    keywords: "hip joint coxal joint 髖關節 cotylic joint 杵臼關節 acetabulum 髖臼 ligament of femoral head 股骨頭韌帶 圓韌帶 ligamentum teres transverse acetabular ligament 髖臼橫韌帶 stifle joint 膝關節 femorotibial joint 股脛關節 femoropatellar joint 股髕關節 meniscus 半月板 cranial cruciate ligament caudal cruciate ligament 前十字韌帶 後十字韌帶 patellar ligament tibiofibular joint 脛腓關節 tarsal joint 跗關節 tibiotarsal joint intertarsal joint tarsometatarsal joint calcanean tendon",
    snippet: "髖關節（杵臼關節，股骨頭韌帶與髖臼橫韌帶）、膝關節（股脛關節十字韌帶半月板＋股髕關節）、跗關節（脛跗/跗骨間/跗蹠三層關節）整理。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "axial", sectionName: "中軸骨關節",
    keywords: "skull suture 顱骨縫合線 sutura serrata squamosa plana foliata temporomandibular joint TMJ 顳頜關節 articular disc 關節盤 intervertebral joint 椎體間關節 articular process joint zygapophyseal joint 關節突關節 atlanto-occipital joint 寰枕關節 atlantoaxial joint 寰樞關節 nuchal ligament 項韌帶 supraspinous ligament 棘上韌帶 interspinous ligament 棘間韌帶 yellow ligament ligamentum flavum 黃韌帶 longitudinal ligament 縱韌帶 costovertebral joint 肋椎關節 radiate ligament costotransverse ligament sternocostal joint costochondral junction symphysis pelvis 骨盆聯合 sacroiliac joint 薦髂關節 sacrotuberous ligament",
    snippet: "顱骨縫合線、顳頜關節（含關節盤）、脊柱關節（椎體間關節、關節突關節、寰枕/寰樞關節）與周邊韌帶、肋椎關節、骨盆聯合與薦髂關節整理。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 關節系統",
    snippet: "10點考試/臨床導向整理：三大關節分類、滑液關節構造口訣、運動軸心數目分類、肩髖膝肘關節類型、腕跗三層關節、脊柱雙重關節系統、同骨不同關節類型的例子。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 關節系統",
    snippet: "涵蓋關節總論到中軸骨關節各章節重點的練習題（是非/選擇/簡答，共15題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 肌肉系統 命名原則 肩胛懸吊 軸上肌 呼吸肌 腹壁 白線 橈神經 坐骨神經 股神經 跟總腱 髕骨",
    snippet: "九個臨床與國考重點：命名邏輯、肩胛懸吊肌、軸上三系統、呼吸肌方向、前後肢神經支配地圖、橈神經麻痺、跟總腱、股四頭肌與髕骨。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "overview", sectionName: "肌肉學總論",
    keywords: "肌肉分類 骨骼肌 平滑肌 心肌 skeletal smooth cardiac 構造層次 epimysium perimysium endomysium sarcolemma myofibril sarcomere myosin actin 起點 origin 止點 insertion 肌腱 tendon 腱膜 aponeurosis 韌帶 ligament 肌膜 fascia 肌束排列 fusiform pennate unipennate bipennate multipennate circular sphincter 肌肉命名原則",
    snippet: "肌肉三種類型、骨骼肌結締組織構造層次（epimysium/perimysium/endomysium）、起止點與肌腱腱膜、肌束排列型態、肌肉命名七大原則整理。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "girdle", sectionName: "肩胛懸吊與胸肌群",
    keywords: "外在肌 extrinsic 斜方肌 trapezius 菱形肌 rhomboideus 闊背肌 latissimus dorsi 腹鋸肌 serratus ventralis 肩胛橫突肌 omotransversarius 臂頭肌 brachiocephalicus 淺胸肌 深胸肌 pectoral 鎖骨間隔 clavicular intersection",
    snippet: "肩胛骨懸吊肌群（斜方肌/菱形肌/闊背肌/腹鋸肌/肩胛橫突肌）與臂頭肌、淺深胸肌整理，前肢外在肌完整表。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "epaxial", sectionName: "軸上肌群",
    keywords: "軸上肌 epaxial 髂肋肌 iliocostalis 最長肌 longissimus 橫脊肌 transversospinalis 半棘肌 多裂肌 棘肌",
    snippet: "軸上肌三系統由外至內排列：髂肋肌系統、最長肌系統、橫脊肌系統，脊柱伸展與側向運動。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "ventralneck", sectionName: "頸部腹側肌群",
    keywords: "頸部腹側肌 胸頭肌 sternocephalicus 胸舌骨肌 胸甲狀肌 頭長肌 頸長肌 斜角肌 scalenus 頸動脈鞘 carotid sheath",
    snippet: "頸部腹側肌群（胸頭肌/胸舌骨肌/胸甲狀肌/頭長肌/頸長肌/斜角肌）與頸動脈鞘解剖概念。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "thoracicwall", sectionName: "胸壁與呼吸肌群",
    keywords: "胸壁肌 呼吸肌 respiratory muscle 外肋間肌 內肋間肌 intercostal 肋舉肌 胸直肌 胸橫肌 背鋸肌 serratus dorsalis 橫膈 diaphragm",
    snippet: "吸氣肌與呼氣肌分工：外肋間肌拉肋骨向前吸氣、內肋間肌拉肋骨向後呼氣，含斜角肌、背鋸肌、胸橫肌。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "abdominalwall", sectionName: "腹壁肌群與白線",
    keywords: "腹壁 abdominal wall 腹外斜肌 腹內斜肌 腹橫肌 腹直肌 白線 linea alba 腹股溝管 inguinal canal 腹股溝疝氣 剖腹手術 laparotomy",
    snippet: "腹壁四層肌（腹外斜肌/腹內斜肌/腹橫肌/腹直肌）、白線與腹股溝管，剖腹手術入路與腹股溝疝氣解剖基礎。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "tail", sectionName: "尾部肌群",
    keywords: "尾部肌群 tail muscle sacrocaudalis 舉尾肌 馬尾症候群",
    snippet: "尾部軸上與軸下肌群，與情緒表現、排便姿勢及會陰手術相關。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "headneck", sectionName: "頭頸部肌肉簡介",
    keywords: "頭部肌肉 皮肌 cutaneous muscle 頸闊肌 platysma 面部淺層肌肉 口輪匝肌 orbicularis oris 頰肌 buccinator 眼輪匝肌 orbicularis oculi 咀嚼肌",
    snippet: "頭部肌肉六大分區與神經支配、皮肌與面部淺層肌肉整理；咀嚼肌詳見骨骼系統頁面，避免重複。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "shoulderarm", sectionName: "肩胛與上臂肌群",
    keywords: "內在肌 intrinsic 三角肌 deltoideus 棘下肌 infraspinatus 小圓肌 teres minor 棘上肌 supraspinatus 肩胛下肌 subscapularis 大圓肌 teres major 喙肱肌 coracobrachialis 肱肌 brachialis 肱二頭肌 biceps brachii 前臂筋膜張肌 肱三頭肌 triceps brachii 肘肌 anconeus 肩胛上神經 腋神經 肌皮神經 橈神經 橈神經麻痺",
    snippet: "肩胛外側/內側肌群與上臂前側(屈肘)/後側(伸肘)肌群，神經支配地圖與橈神經麻痺臨床表現。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "forearm", sectionName: "前臂肌群",
    keywords: "前臂 antebrachium 橈側腕伸肌 指總伸肌 指外側伸肌 尺外側肌 後旋肌 supinator 旋前圓肌 pronator 橈側腕屈肌 淺指屈肌 深指屈肌 尺側腕屈肌 flexor manica 屈肌領 支持帶 retinaculum 正中神經 尺神經",
    snippet: "前臂背外側伸肌群(橈神經)與掌內側屈肌群(正中/尺神經)，指伸屈肌止點層次與屈肌領。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "pelvis", sectionName: "骨盆與臀部肌群",
    keywords: "闊筋膜張肌 tensor fasciae latae 臀淺肌 臀中肌 臀深肌 gluteal 內閉孔肌 孖肌 gemelli 股方肌 quadratus femoris 外閉孔肌 obturator 坐骨神經 sciatic nerve 臀前神經 臀後神經",
    snippet: "外側臀部肌群(臀前/臀後神經)與尾側深層外旋肌群(坐骨神經/閉孔神經)，肌肉注射避開部位。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "thigh", sectionName: "大腿肌群",
    keywords: "股二頭肌 biceps femoris 半腱肌 semitendinosus 半膜肌 semimembranosus 膕旁肌 hamstring 縫匠肌 sartorius 股薄肌 gracilis 恥骨肌 pectineus 內收肌 adductor 股四頭肌 quadriceps femoris 股直肌 rectus femoris 股外側肌 股中間肌 股內側肌 vastus 腰大肌 iliopsoas 股神經 femoral nerve 髕骨 patella 髕骨脫位 patellar luxation",
    snippet: "大腿後側膕旁肌群(坐骨神經)、內側內收肌群(閉孔神經)、前側股四頭肌與腰大肌(股神經)，股神經受損無法負重。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "leg", sectionName: "小腿肌群",
    keywords: "脛前肌 cranial tibial 腓骨長肌 腓骨短肌 fibularis 趾長伸肌 趾短伸肌 指外側伸肌 拇長伸肌 腓神經 fibular nerve peroneal nerve 腓腸肌 gastrocnemius 淺指屈肌 深指屈肌 膕肌 popliteus 脛神經 tibial nerve 跟總腱 common calcanean tendon 跗關節下垂 dropped hock knuckling",
    snippet: "小腿前外側伸肌群(腓神經)與後側屈肌群(脛神經)，跟總腱組成與斷裂後跗關節下垂步態。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 肌肉系統 前肢後肢神經支配",
    snippet: "十六點肌肉系統總複習：構造層次、命名規則、肩胛骨懸吊、軸上肌排列、呼吸肌分工、腹壁層次、前後肢神經支配地圖、橈神經麻痺、跟總腱、髕骨等考試重點。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 肌肉系統 前肢 後肢 神經支配",
    snippet: "涵蓋肌肉構造、命名、軀幹懸吊肌、軸上肌、呼吸肌、腹壁層次、前肢與後肢肌群神經支配等重點的練習題（共16題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "overview", sectionName: "特殊感覺總論",
    keywords: "一般感覺 general senses 特殊感覺 special senses 視覺 聽覺 平衡 嗅覺 味覺",
    snippet: "區分一般感覺與特殊感覺，總覽視覺、聽覺與平衡、嗅覺味覺、相關腦神經各章節架構。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "general", sectionName: "一般感覺受器",
    keywords: "痛覺 溫度覺 機械覺 觸覺受器 化學覺 chemoreceptor 路氏小體 Ruffini corpuscle 頸動脈體 主動脈體",
    snippet: "痛覺/溫度覺/機械覺（未包覆與包覆型觸覺受器）/化學覺受器分類，作為特殊感覺的背景知識。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "vision", sectionName: "視覺系統（眼）",
    keywords: "eye orbit 眼眶 視神經管 optic canal 眶裂 orbital fissure 眼鞘 periorbita 眼瞼 third eyelid 第三眼瞼 淚器 lacrimal apparatus 眼外肌 extrinsic muscles rectus oblique retractor bulbi 鞏膜 sclera 角膜 cornea 虹膜 iris 睫狀體 ciliary body 脈絡膜 choroid 視網膜 retina 瞳孔 pupil 瞳孔對光反射 PLR CN III CN IV CN VI",
    snippet: "眼眶三孔洞、眼鞘、眼瞼淚器、眼外肌與支配腦神經、眼球三層構造（纖維膜/血管膜/視網膜）、瞳孔自主神經調控、視覺路徑。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "hearing", sectionName: "聽覺與平衡系統（耳）",
    keywords: "ear 外耳 中耳 內耳 聽小骨 ossicles malleus incus stapes 耳蝸 cochlea 螺旋器官 organ of Corti 前庭系統 vestibular 聽斑 macula 壺腹嵴 crista ampullaris 半規管 semicircular canal 毛細胞 hair cell 前庭核 nystagmus 眼球震顫",
    snippet: "外中內耳三區域、聽小骨傳導、耳蝸與螺旋器官、聽覺路徑、前庭系統（聽斑與壺腹嵴）、毛細胞機轉。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "chemosense", sectionName: "嗅覺與味覺",
    keywords: "olfaction 嗅覺 嗅覺上皮 olfactory epithelium 犁鼻器 vomeronasal organ Jacobson's organ gustation 味覺 舌乳頭 papillae CN VII CN IX CN X",
    snippet: "嗅覺上皮三細胞、嗅覺傳導路徑（不經丘腦）、犁鼻器、舌乳頭六分類、味覺依舌部位對應 CN VII/IX/X。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "nerves", sectionName: "特殊感覺相關腦神經",
    keywords: "cranial nerves 腦神經 CN I CN II CN III CN IV CN V CN VI CN VII CN VIII CN IX CN X 三叉神經 trigeminal 顏面神經 facial nerve",
    snippet: "CN I–X 完整運動/感覺/副交感功能表，眼相關孔洞地標，耳相關 CN VII 與 CN VIII 走行關係。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 特殊感覺",
    snippet: "十點特殊感覺總複習，涵蓋視覺、聽覺平衡、嗅覺味覺、相關腦神經各章節臨床考點。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 特殊感覺",
    snippet: "涵蓋視覺、聽覺平衡、嗅覺味覺、腦神經等重點的練習題（共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "overview", sectionName: "禽類解剖總論",
    keywords: "avian anatomy 禽類解剖 哺乳類差異 羽毛 feather 含氣骨骼 pneumatic bone 單向呼吸 air sac 無膀胱 生殖器官季節性",
    snippet: "哺乳類與禽類七大解剖生理差異總表：羽毛、含氣骨骼、高效消化、無膀胱、生殖器官季節性縮小、單向呼吸、高心臟體重比。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "integument", sectionName: "外皮系統",
    keywords: "喙 beak rhamphotheca rhinotheca gnathotheca 蠟膜 cere 羽毛 feather 正羽 contour feather 羽軸 羽枝 羽小枝 腿足鱗片 尾脂腺 uropygial gland",
    snippet: "體表區域命名、喙的分部、蠟膜、羽毛構造與種類、腿足鱗片、皮膚特性與唯一皮膚腺體尾脂腺。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "muscular", sectionName: "肌肉系統：飛行肌",
    keywords: "pectoralis thoracicus supracoracoideus 飛行肌 下擊 上擊 礦化肌腱 斷翼術 肌肉注射",
    snippet: "兩大飛行肌 pectoralis thoracicus（下擊）與 supracoracoideus（上擊）、礦化肌腱、外科斷翼術、臨床肌肉注射部位。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "digestive", sectionName: "消化系統",
    keywords: "嗉囊 crop 鴿嗉囊乳 crop milk 腺胃 proventriculus 肌胃 gizzard koilin 十二指腸 胰臟 肝臟 盲腸 泄殖腔 cloaca",
    snippet: "嗉囊依食性分型、腺胃/肌胃分工與 koilin 保護層、十二指腸胰臟肝臟、盲腸退化型態、泄殖腔三段構造。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "respiratory", sectionName: "呼吸系統：氣囊系統",
    keywords: "air sac 氣囊 單向氣流 unidirectional airflow 含氣肱骨 無橫膈",
    snippet: "6–9個氣囊分前後兩群、單向氣流機制（空氣通過肺兩次）、無橫膈靠肋骨胸骨運動呼吸。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "urogenital", sectionName: "泌尿生殖系統",
    keywords: "無膀胱 泄殖腔 cloaca 卵巢 輸卵管 左側發育 精子儲存小管 SST",
    snippet: "無膀胱、公鳥交配器官多僅為泄殖腔黏膜皺褶、多數禽類僅左側卵巢輸卵管發育、輸卵管五段分泌時程、精子儲存小管。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "circulation", sectionName: "循環系統",
    keywords: "四腔心 翼靜脈 頸靜脈 蹠靜脈 心臟穿刺 靜脈採血",
    snippet: "四腔心與哺乳類相同、動靜脈系統分支、臨床心臟穿刺與靜脈採血部位（翼靜脈/頸靜脈/蹠靜脈）。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "immune", sectionName: "免疫系統",
    keywords: "胸腺 thymus 法氏囊 bursa of Fabricius B細胞 T細胞 脾臟 淋巴結",
    snippet: "胸腺（T細胞來源）與法氏囊（禽類特有、B細胞來源）、脾臟位置、雞火雞缺乏淋巴結。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "sensory", sectionName: "神經與感覺系統",
    keywords: "鞏膜骨小板 scleral ossicles 色彩辨識 坐骨神經 馬立克氏病 Marek's disease 耳缺耳廓",
    snippet: "整體與哺乳類無顯著差異、耳缺耳廓、眼睛含鞏膜骨小板具色彩辨識、坐骨神經與馬立克氏病關聯。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "endocrine", sectionName: "內分泌系統",
    keywords: "甲狀腺 副甲狀腺 頸動脈體 後鰓體 ultimobranchial body 降鈣素 calcitonin 腎上腺",
    snippet: "甲狀腺/副甲狀腺/頸動脈體/後鰓體（分泌降鈣素）/腎上腺的頸部與腎臟相對位置。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 禽類解剖",
    snippet: "十點整合各系統「輕量化/高效率化以利飛行」核心邏輯的複習重點。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 禽類解剖",
    snippet: "涵蓋外皮到內分泌全部章節重點的練習題（共13題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "overview", sectionName: "生殖系統總論",
    keywords: "reproductive system 生殖系統總論 gametogenic endocrine 管狀生殖道 mucosa muscularis serosa stallion mare bull cow ram ewe boar sow rooster hen dog bitch tom queen",
    snippet: "公畜母畜生殖道共通的三層組織構造（黏膜/肌層/漿膜）、配子生成與內分泌雙重功能、各物種公母術語對照表。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "maletract", sectionName: "睪丸、副睪與輸精管",
    keywords: "testis epididymis ductus deferens vas deferens 睪丸 副睪 輸精管 陰囊 scrotum tunica vaginalis albuginea cremaster pampiniform plexus 蔓狀靜脈叢 熱交換 seminiferous tubule Sertoli Leydig cells 隱睪症 cryptorchidism 睪丸下降 testes descent 睪丸位置 perineal inguinal intermediate testicond 腹股溝疝氣 inguinal hernia",
    snippet: "陰囊分層、睪丸組織構造（曲細精管/Sertoli/Leydig）、副睪五大功能、精索熱交換機轉、睪丸下降與隱睪症、各物種睪丸位置比較。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "maleaccessory", sectionName: "副性腺、陰莖與包皮",
    keywords: "accessory sex gland seminal vesicle 儲精囊 prostate 前列腺 bulbourethral gland Cowper's gland 尿道球腺 cremaster urethralis bulbospongiosus ischiocavernosus retractor penis muscle 陰莖 penis 包皮 prepuce fibroelastic musculocavernous sigmoid flexure 乙狀彎曲 os penis 陰莖骨 bulbus glandis copulatory tie 交配栓結 preputial diverticulum 包皮憩室 penile spines 陰莖棘",
    snippet: "副性腺物種差異（犬貓無儲精囊、犬無尿道球腺）、生殖器肌肉、陰莖類型（纖維彈性型vs肌肉海綿型）與各物種陰莖包皮特化構造、犬交配栓結。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "femaleovary", sectionName: "卵巢與輸卵管",
    keywords: "ovary 卵巢 germinal epithelium tunica albuginea cortex medulla theca interna granulosa corpus hemorrhagicum corpus luteum corpus albicans 黃體 estrogen progesterone oviduct uterine tube salpinx infundibulum fimbriae ampulla isthmus utero-tubal junction 受精 fertilization 排卵窩 ovulation fossa mare ovary broad ligament mesovarium ovarian bursa 卵巢囊",
    snippet: "卵巢構造與內分泌（濾泡→黃體→白體）、馬卵巢排卵窩特殊構造、各物種卵巢側別活性差異、輸卵管分區與受精部位、卵巢懸吊韌帶。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "femaleuterus", sectionName: "子宮、子宮頸與陰道",
    keywords: "uterus 子宮 simplex bicornuate duplex 單子宮 雙角子宮 重複子宮 cervix 子宮頸 annular ring interdigitating pad fornix vagina 陰道 vestibule vulva 外陰部 PGF2α capacitation 精子獲能 mammary gland teat 乳腺 乳頭 乳管",
    snippet: "子宮型態三分類與物種差異、子宮/子宮頸/陰道功能、牛豬馬子宮頸構造與精子屏障差異、乳腺乳頭跨物種比較。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 生殖系統",
    snippet: "十點公畜母畜生殖系統總複習，涵蓋睪丸溫度調節、副性腺物種差異、陰莖類型、卵巢構造、輸卵管受精部位、子宮型態、子宮頸屏障、乳腺比較。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 生殖系統",
    snippet: "涵蓋公畜母畜生殖系統各章節重點的練習題（共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "overview", sectionName: "生理學總論與身體組成",
    keywords: "physiology 生理學 physis logos 細胞 tissue 組織 organ 器官 system 系統 cardiovascular respiratory urinary GI musculoskeletal endocrine reproductive excitable tissue 興奮性組織 hemopoiesis",
    snippet: "生理學定義與身體組成層級（細胞→組織→器官→系統）、主要身體系統一覽表、興奮性組織概念。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "compartments", sectionName: "體液與體液區隔",
    keywords: "body fluid 體液 intracellular fluid ICF 細胞內液 interstitial fluid ISF 間質液 plasma 血漿 extracellular fluid ECF 細胞外液 internal environment external environment extracellular matrix ECM collagen elastin",
    snippet: "細胞內液67%／間質液26%／血漿7%體液區隔占比、細胞外液組成、體液區隔間交換關係、細胞外基質ECM。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "homeostasis", sectionName: "恆定狀態與回饋機制",
    keywords: "homeostasis 恆定 dynamic constancy set point 設定點 sensor integrating center effector 感受器 整合中樞 效應器 reflex arc 反射弧 negative feedback 負回饋 positive feedback 正回饋 intrinsic extrinsic regulation 內在調節 外在調節 血糖 體溫調節 thermoregulation 凝血 clotting oxytocin 催產素 LH surge 排卵",
    snippet: "恆定動態本質、回饋迴路三元件（感受器/整合中樞/效應器）、負回饋（體溫/血糖）與正回饋（凝血/分娩/排卵）代表例子、恆定控制系統通則。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "communication", sectionName: "細胞間溝通方式",
    keywords: "cell communication 細胞溝通 simple neural reflex neuroendocrine reflex 神經內分泌反射 hypothalamus 下視丘 endocrine paracrine autocrine juxtacrine contact-dependent 內分泌 旁分泌 自分泌 接觸依賴性 gap junction 間隙連結 neurotransmitter non-nerve reflex local homeostatic response",
    snippet: "神經反射vs.神經內分泌反射差異、五種化學訊息傳遞形式（內分泌/旁分泌/自分泌/神經傳導/接觸依賴性）、間隙連結、非神經性反射。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "concepts", sectionName: "適應、生理節律與物質平衡",
    keywords: "adaptation 適應 acclimatization 馴化 習服 biological rhythm circadian rhythm 晝夜節律 cortisol balance 平衡 pool concept negative balance positive balance stable balance 物質池 general principles of physiology",
    snippet: "適應（不可逆演化尺度）vs.馴化（可逆個體尺度）、晝夜節律與皮質醇、物質平衡三狀態（負/正/穩定平衡）、生理學通用原則。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 生理學總論 恆定 回饋機制",
    snippet: "八點生理學總論複習：恆定動態本質、回饋三元件、正負回饋、內外在調節、五種化學溝通、神經內分泌反射、體液分布、適應vs馴化。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "總論與生理恆定",
    url: "總複習/獸醫生理學/總論與生理恆定.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 生理學總論 恆定",
    snippet: "涵蓋總論、體液區隔、恆定回饋、細胞溝通、生理節律等章節重點的練習題（共8題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "structure", sectionName: "細胞構造總覽",
    keywords: "cell structure 細胞構造 cytosol cytoplasm 細胞質 nucleus 內質網 ER Golgi apparatus 高基氏體 endosome lysosome 溶體 peroxisome 過氧化體 mitochondria 粒線體 cytoskeleton 細胞骨架 actin filament 微絲 intermediate filament 中間絲 microtubule 微管",
    snippet: "細胞質分區、主要胞器功能一覽（內質網/高基氏體/溶體/過氧化體/粒線體）、細胞骨架三大纖維系統（微絲/中間絲/微管）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "junction", sectionName: "細胞膜與膜接合構造",
    keywords: "cell membrane 細胞膜 integrin 整合素 proteoglycan 蛋白聚醣 tight junction 緊密接合 anchoring junction desmosome 橋粒 cadherin 鈣黏素 gap junction 間隙接合 connexin 心肌 功能性合胞體",
    snippet: "膜的四大功能、整合素與細胞外基質、三種細胞間接合構造（緊密接合/橋粒/間隙接合），心肌間隙接合與同步收縮。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "protein", sectionName: "蛋白質合成、分泌與降解",
    keywords: "protein synthesis 蛋白質合成 transcription translation splicing 剪接 ubiquitin 泛素 proteasome 蛋白酶體 degradation 降解 mutation 突變",
    snippet: "蛋白質合成路徑（轉錄→轉譯→修飾→分泌）、泛素-蛋白酶體降解路徑、DNA突變對蛋白質結構的影響。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "binding", sectionName: "配體結合特性與酵素動力學",
    keywords: "ligand binding 配體結合 chemical specificity 專一性 affinity 親和力 saturation 飽和度 competition 競爭 allosteric modulation 異位調節 covalent modulation 共價調節 phosphorylation 磷酸化 enzyme 酵素 cofactor coenzyme 輔酶 catabolism anabolism",
    snippet: "配體結合四特性（專一性/親和力/飽和度/競爭）、異位調節vs共價調節、酵素動力學、輔因子輔酶、細胞能量代謝總覽。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "diffusion", sectionName: "擴散與離子通道",
    keywords: "diffusion 擴散 flux 通量 Fick's law 費克定律 ion channel 離子通道 ligand-gated voltage-gated mechanically gated 配體閘門 電壓閘門 機械閘門 membrane potential 膜電位",
    snippet: "擴散基本原理、費克擴散定律（J=PA(C0-Ci)）、三種閘門離子通道分類、膜電位概念。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "transport", sectionName: "媒介性運輸與主動運輸",
    keywords: "mediated transport 媒介性運輸 facilitated diffusion 促進性擴散 active transport 主動運輸 Na-K-ATPase Ca-ATPase H-ATPase 質子幫浦 secondary active transport symporter antiporter 共同運輸體 反向運輸體 digoxin PPI",
    snippet: "促進性擴散、四大初級主動運輸幫浦（Na/K-ATPase等）、次級主動運輸（共同運輸體/反向運輸體），毛地黃與PPI藥理連結。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "osmosis", sectionName: "滲透壓、張力與上皮運輸",
    keywords: "osmosis 滲透壓 aquaporin 水通道 tonicity 張力 isotonic hypotonic hypertonic 等張 低張 高張 paracellular transcellular 細胞旁路徑 跨細胞路徑 epithelial transport 上皮運輸",
    snippet: "滲透與水通道、張力三分類（等張/低張/高張）與滲透壓的差異、上皮運輸細胞旁/跨細胞兩路徑。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞生理學與膜運輸",
    url: "總複習/獸醫生理學/細胞生理學與膜運輸.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 細胞生理學 膜運輸",
    snippet: "涵蓋細胞構造、膜接合、蛋白質代謝、配體結合、跨膜運輸、滲透壓等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "membrane", sectionName: "水溶性訊息與膜受體家族",
    keywords: "receptor 受體 ligand-gated ion channel GPCR G蛋白偶聯受體 receptor tyrosine kinase 酪胺酸激酶 EGFR JAK STAT cytokine receptor 細胞激素受體",
    snippet: "膜受體四大家族（配體閘門通道/GPCR/本質激酶受體/酵素偶聯受體）、EGFR、JAK-STAT路徑與細胞激素訊號。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "gprotein", sectionName: "G蛋白偶聯受體總論",
    keywords: "G protein G蛋白 Gs Gi Gq adenylyl cyclase 腺苷酸環化酶 phospholipase C 磷脂酶C adrenergic receptor 腎上腺素受體",
    snippet: "G蛋白活化循環、Gs/Gi/Gq三亞型對效應酵素的作用、G蛋白對離子通道的直接/間接調控。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "camp", sectionName: "cAMP／PKA路徑",
    keywords: "cAMP PKA adenylyl cyclase phosphodiesterase 磷酸二酯酶 caffeine theophylline 咖啡因 茶鹼 signal amplification 訊號放大 epinephrine 腎上腺素",
    snippet: "cAMP/PKA路徑機轉、同路徑不同組織不同效應、咖啡因茶鹼抑制磷酸二酯酶、訊號放大（一分子產生10^8產物）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "ip3", sectionName: "IP₃／DAG／PKC路徑與Ca²⁺",
    keywords: "IP3 DAG PKC phospholipase C calcium 鈣離子 calmodulin 鈣調蛋白 calcium induced calcium release 鈣誘發鈣釋放 troponin",
    snippet: "PLC分解PIP2產生DAG與IP3、IP3釋放內質網鈣、鈣調蛋白系統、鈣誘發鈣釋放放大機制。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "cgmp", sectionName: "cGMP／PKG路徑",
    keywords: "cGMP PKG guanylyl cyclase 鳥苷酸環化酶 nitric oxide NO 一氧化氮 sildenafil PDE5 血管擴張",
    snippet: "cGMP/PKG路徑機轉、膜結合型與可溶型鳥苷酸環化酶、NO/cGMP血管擴張機轉與PDE5抑制劑藥理連結。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "細胞訊息傳遞",
    url: "總複習/獸醫生理學/細胞訊息傳遞.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 細胞訊息傳遞 訊號傳導",
    snippet: "涵蓋受體分類、G蛋白系統、第二訊息傳遞路徑、訊號終止等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "classes", sectionName: "激素的化學分類",
    keywords: "hormone 激素 amine steroid peptide protein 胺類 類固醇 胜肽 prohormone prehormone 前驅激素 前激素 proinsulin T4 T3",
    snippet: "激素三大化學分類（胺類/類固醇/胜肽蛋白質）、前驅激素vs前激素（proinsulin、T4→T3）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "regulation", sectionName: "分泌調控與激素交互作用",
    keywords: "tropic hormone 促激素 negative feedback 負回饋 additive complementary permissive antagonistic 相加 互補 容許 拮抗 hyposecretion hypersecretion 分泌不足 分泌過多 hyporesponsiveness",
    snippet: "三種內分泌腺刺激類型、激素釋放調控模式、四種激素交互作用（相加/互補/容許/拮抗）、內分泌疾病分類。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "axis", sectionName: "HP軸總論",
    keywords: "hypothalamus 下視丘 pituitary 腦垂體 hypothalamic-pituitary axis HP axis 神經垂體 腺垂體 hypophysiotropic hormone 促垂體激素 portal vessel 門脈系統",
    snippet: "下視丘與腦垂體神經連結（後葉）vs血管連結（前葉）、促垂體激素、脈衝式釋放的生理意義。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "posterior", sectionName: "腦垂體後葉：ADH與催產素",
    keywords: "ADH antidiuretic hormone 抗利尿激素 vasopressin V1 V2 aquaporin AQP2 SIADH diabetes insipidus 尿崩症 oxytocin 催產素 milk ejection parturition 分娩",
    snippet: "ADH三受體（V1A/V1B/V2）與AQP2、SIADH與尿崩症、催產素正回饋（排乳反射、分娩）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "anterior", sectionName: "腦垂體前葉：GH與PRL",
    keywords: "prolactin PRL 泌乳素 dopamine 多巴胺 hyperprolactinemia growth hormone GH 生長激素 IGF-1 somatomedin ghrelin acromegaly gigantism 肢端肥大症 巨人症",
    snippet: "泌乳素與多巴胺抑制、高泌乳素血症、GH分泌調控（GHRH/somatostatin/ghrelin）、GH異常（巨人症/肢端肥大症）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 I",
    url: "總複習/獸醫生理學/內分泌生理I.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 內分泌生理 下視丘腦垂體軸",
    snippet: "涵蓋激素分類、作用機轉、HP軸、ADH/催產素、GH/PRL等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "thyroidsyn", sectionName: "甲狀腺激素合成",
    keywords: "thyroid 甲狀腺 NIS TPO methimazole T3 T4 iodine 碘 thyroglobulin",
    snippet: "甲狀腺激素合成路徑：NIS碘攝取、TPO催化、methimazole作用機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "thyroiddisease", sectionName: "甲狀腺疾病",
    keywords: "hyperthyroidism hypothyroidism 甲狀腺機能亢進 甲狀腺機能低下 feline 貓 Graves disease 貓甲狀腺功能亢進症",
    snippet: "甲亢vs甲低比較表、貓甲狀腺機能亢進臨床重點、Graves氏病。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "calcium", sectionName: "副甲狀腺與鈣磷恆定",
    keywords: "PTH parathyroid 副甲狀腺 vitamin D 維生素D calcitonin 降鈣素 calcium phosphorus 鈣磷恆定",
    snippet: "PTH合成與作用、維生素D活化路徑、降鈣素功能。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "bone", sectionName: "骨骼生理",
    keywords: "osteoblast osteocyte osteoclast 蝕骨細胞 造骨細胞 骨細胞 bone remodeling 骨重塑",
    snippet: "造骨細胞/骨細胞/蝕骨細胞功能、骨重塑速率、激素對骨骼的作用。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "medulla", sectionName: "腎上腺髓質",
    keywords: "adrenal medulla 腎上腺髓質 catecholamine 兒茶酚胺 epinephrine norepinephrine PNMT cortisol",
    snippet: "兒茶酚胺合成路徑、PNMT需皮質醇協同活化。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "cortexsyn", sectionName: "腎上腺皮質合成與HPA軸",
    keywords: "adrenal cortex 腎上腺皮質 StAR HPA axis zona glomerulosa fasciculata reticularis 球狀帶 束狀帶 網狀帶",
    snippet: "StAR蛋白、HPA軸、腎上腺皮質三層（球狀帶/束狀帶/網狀帶）分工。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "glucocorticoid", sectionName: "糖皮質素與Cushing氏症",
    keywords: "glucocorticoid 糖皮質素 cortisol Cushing 庫欣氏症 trilostane metyrapone",
    snippet: "糖皮質素作用、Cushing氏症、trilostane/metyrapone藥理機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "mineralocorticoid", sectionName: "礦物皮質素與RAAS",
    keywords: "mineralocorticoid 礦物皮質素 aldosterone 醛固酮 RAAS Addison disease 愛迪生氏症 hyperkalemia 高血鉀",
    snippet: "醛固酮與RAAS、Addison氏症、高血鉀風險。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "內分泌生理 II",
    url: "總複習/獸醫生理學/內分泌生理II.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 內分泌生理II 甲狀腺 副甲狀腺 腎上腺",
    snippet: "涵蓋甲狀腺、副甲狀腺、骨骼、腎上腺髓質皮質等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "overview", sectionName: "神經系統分類",
    keywords: "CNS PNS 中樞神經 周邊神經 somatic autonomic 自主神經 enteric 腸神經系統",
    snippet: "CNS/PNS分類、體神經／自主神經（含腸神經系統）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "cells", sectionName: "神經元與神經膠質細胞",
    keywords: "neuron glia oligodendrocyte astrocyte microglia ependymal Schwann axonal transport Wallerian degeneration 華勒氏變性",
    snippet: "神經膠質細胞分類、軸突運輸、華勒氏變性。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "potential", sectionName: "靜止電位與動作電位",
    keywords: "resting potential action potential 靜止膜電位 動作電位 Goldman equation saltatory conduction 跳躍式傳導 local anesthetic 局部麻醉藥",
    snippet: "Goldman方程式、跳躍式傳導、局部麻醉藥作用機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "synapse", sectionName: "突觸傳遞",
    keywords: "synapse SNARE NSF EPSP IPSP presynaptic inhibition facilitation 突觸前抑制 促進",
    snippet: "SNARE複合體、EPSP/IPSP、突觸前抑制與促進。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "neurotransmitter", sectionName: "神經傳導物質",
    keywords: "acetylcholine ACh AChE sarin 沙林毒氣 catecholamine serotonin glutamate GABA LTP 長期增益作用",
    snippet: "ACh/AChE與沙林毒氣、兒茶酚胺、血清素、麩胺酸/GABA與長期增益作用。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "brain", sectionName: "腦部構造",
    keywords: "cerebral lobes 腦葉 limbic system 邊緣系統 cerebellum 小腦 brainstem reticular formation 腦幹 網狀結構",
    snippet: "四大腦葉、邊緣系統、小腦、腦幹網狀結構。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "spinalans", sectionName: "脊髓與自主神經系統",
    keywords: "spinal cord 脊髓 sympathetic parasympathetic 交感 副交感 thoracolumbar craniosacral",
    snippet: "脊髓節段、交感（胸腰）vs副交感（顱薦）自主神經系統。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "bbb", sectionName: "血腦障壁與腦脊髓液",
    keywords: "blood-brain barrier BBB 血腦障壁 CSF 腦脊髓液 hydrocephalus 水腦症",
    snippet: "血腦障壁構造、CSF循環、水腦症。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "神經元訊號與神經系統構造",
    url: "總複習/獸醫生理學/神經元訊號與神經系統構造.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 神經元 動作電位 突觸",
    snippet: "涵蓋神經元構造、動作電位、突觸傳遞、腦部構造等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "overview", sectionName: "受器類型與訊息編碼",
    keywords: "receptor 受器 modality intensity duration adaptation 適應 感覺編碼",
    snippet: "感覺受器分類、訊息編碼四要素（模式/強度/位置/時間）、受器適應。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "pain", sectionName: "痛覺與溫度覺",
    keywords: "pain referred pain 轉移痛 gate control theory 閘門控制理論 anterolateral dorsal column 脊髓丘腦徑 背柱徑",
    snippet: "轉移痛、閘門控制理論、脊髓丘腦徑vs背柱徑。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "visionoptics", sectionName: "視覺光學",
    keywords: "accommodation 調節 myopia hyperopia presbyopia astigmatism cataract glaucoma 近視 遠視 老花 散光 白內障 青光眼",
    snippet: "眼球調節機轉、屈光異常（近視/遠視/老花/散光）、白內障、青光眼。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "visiontransduction", sectionName: "視覺光轉導",
    keywords: "phototransduction 光轉導 rod cone 桿細胞 錐細胞 bipolar cell 雙極細胞 receptive field 感受域 color vision 色覺",
    snippet: "光轉導的暗去極化/光過極化邏輯、on/off雙極細胞、感受域、色覺。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "hearing", sectionName: "聽覺與前庭覺",
    keywords: "cochlea 耳蝸 hair cell 毛細胞 semicircular canal 半規管 otolith organ 耳石器 nystagmus 眼球震顫 caloric test COWS",
    snippet: "耳蝸毛細胞轉導、半規管vs耳石器、眼球震顫與冷熱試驗COWS。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "taste", sectionName: "味覺轉導",
    keywords: "taste 味覺 ion channel GPCR sweet bitter umami salty sour 鹹 酸 甜 苦 鮮味",
    snippet: "離子通道直接轉導（鹹/酸）vs GPCR路徑（甜/苦/鮮味）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "感覺生理學",
    url: "總複習/獸醫生理學/感覺生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 感覺生理學 視覺 聽覺 味覺",
    snippet: "涵蓋受器編碼、痛覺、視覺、聽覺前庭、味覺等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "eeg", sectionName: "腦電圖 EEG",
    keywords: "EEG 腦電圖 alpha beta theta delta wave evoked potential seizure 癲癇",
    snippet: "電極放置、alpha/beta/theta/delta波、誘發電位、癲癇腦波記錄。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "sleep", sectionName: "睡眠分期概論",
    keywords: "sleep stage REM 快速動眼期 delta sleep process S process C",
    snippet: "睡眠分期概覽、process S vs process C（詳見睡眠生理與腦波節律章節）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "coma", sectionName: "昏迷與腦死",
    keywords: "coma 昏迷 brain death 腦死",
    snippet: "昏迷程度分級、腦死判定概念。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "psychiatric", sectionName: "精神藥理與行為",
    keywords: "mood affect schizophrenia D2 receptor acepromazine metoclopramide 精神分裂 多巴胺受體 阿保待因 metoclopramide",
    snippet: "情緒vs情感、思覺失調症與D2受體、acepromazine/metoclopramide臨床連結。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "dominance", sectionName: "大腦優勢半球與失語症",
    keywords: "cerebral dominance 大腦優勢 aphasia 失語症 Broca Wernicke",
    snippet: "大腦優勢半球、Broca氏區vs Wernicke氏區失語症。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "意識、腦與行為",
    url: "總複習/獸醫生理學/意識腦與行為.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 意識 腦電圖 睡眠",
    snippet: "涵蓋意識狀態、EEG、睡眠分期、精神藥理等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖生理總論",
    url: "總複習/獸醫生理學/生殖生理總論.html",
    section: "spermatogenesis", sectionName: "精子生成",
    keywords: "spermatogenesis 精子生成 Sertoli cell 賽托利氏細胞 blood-testis barrier 血睪障壁 spermiogenesis",
    snippet: "精子生成三階段、賽托利氏細胞與血睪障壁、精子形成四階段。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖生理總論",
    url: "總複習/獸醫生理學/生殖生理總論.html",
    section: "oogenesis", sectionName: "卵子生成",
    keywords: "oogenesis 卵子生成 dictyate arrest 雙線期停滯 MPF OMI 減數分裂停滯",
    snippet: "卵母細胞減數分裂雙線期停滯、LH surge恢復機轉、MII停滯物種比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖生理總論",
    url: "總複習/獸醫生理學/生殖生理總論.html",
    section: "ovulation", sectionName: "排卵機轉與類型",
    keywords: "ovulation 排卵 spontaneous induced ovulator 自發性排卵 誘導性排卵",
    snippet: "排卵局部機轉、自發性vs誘導性排卵物種分類。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖生理總論",
    url: "總複習/獸醫生理學/生殖生理總論.html",
    section: "fertilization", sectionName: "受精機轉",
    keywords: "fertilization capacitation 獲能 acrosome reaction 頂體反應 polyspermy 多精阻斷 cortical reaction",
    snippet: "獲能、頂體反應、透明帶穿透、皮質反應與多精阻斷。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖生理總論",
    url: "總複習/獸醫生理學/生殖生理總論.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 生殖生理 精子生成 卵子生成 受精",
    snippet: "涵蓋公畜母畜生殖功能、精卵生成、排卵類型、受精機轉等章節重點的練習題（共5題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "hpgaxis", sectionName: "HPG軸與回饋調控",
    keywords: "HPG axis GnRH LH FSH long-loop short-loop feedback 長迴路 短迴路 回饋",
    snippet: "GnRH脈衝頻率決定LH/FSH比例、長短超短迴路回饋、抑制素活化素。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "puberty", sectionName: "青春期",
    keywords: "puberty 青春期 gonadostat tonic center cyclic center 緊張性中樞 週期性中樞",
    snippet: "青春期核心機轉為下視丘負回饋敏感度下降、性別二型性GnRH中樞。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "cycletypes", sectionName: "動情週期分類與階段",
    keywords: "estrous cycle 動情週期 proestrus estrus metestrus diestrus 動情前期 動情期 動情後期 動情間期 polyestrous monoestrous",
    snippet: "動情週期四期、多情期vs單情期分類、各物種週期長度比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "follicular", sectionName: "卵泡波與募集選拔",
    keywords: "follicular wave 卵泡波 recruitment selection dominance 募集 選拔 優勢化",
    snippet: "卵泡波募集/選拔/優勢化三階段、超排卵誘導原理。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "luteolysis", sectionName: "黃體溶解機轉",
    keywords: "luteolysis 黃體溶解 PGF2alpha counter-current transfer 子宮卵巢逆流轉運 hysterectomy 子宮切除",
    snippet: "PGF2α子宮-卵巢逆流轉運、子宮切除實驗物種差異、催產素放大迴路。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "生殖內分泌與動情週期",
    url: "總複習/獸醫生理學/生殖內分泌與動情週期.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 動情週期 HPG軸 黃體溶解",
    snippet: "涵蓋HPG軸回饋、青春期機轉、動情週期階段、黃體溶解等章節重點的練習題（共5題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "recognition", sectionName: "妊娠辨識",
    keywords: "maternal recognition of pregnancy 妊娠辨識 interferon-tau IFN-tau hCG 妊娠母體辨識",
    snippet: "各物種妊娠辨識機轉比較：IFN-tau（牛羊）、雌激素改道（豬）、胚胎移動（馬）、hCG（人）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "placenta", sectionName: "胎盤分類與功能",
    keywords: "placenta 胎盤 epitheliochorial endotheliochorial hemochorial 上皮絨毛膜 內皮絨毛膜 血絨毛膜 diffuse cotyledonary zonary",
    snippet: "胎盤雙重分類系統（外觀形狀＋組織學接觸層數）、免疫球蛋白胎盤傳輸差異。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "parturitiontrigger", sectionName: "分娩觸發機轉",
    keywords: "parturition 分娩 fetal cortisol 胎兒皮質醇 HPA axis 分娩觸發",
    snippet: "分娩由胎兒HPA軸成熟觸發、雌激素黃體素比值逆轉、PGF2α與催產素級聯。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "stages", sectionName: "分娩三階段",
    keywords: "stages of labor 分娩三階段 dystocia 難產 Ferguson reflex 費格森反射",
    snippet: "子宮頸擴張期、胎兒娩出期、胎盤娩出期，各物種時間比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "lactation", sectionName: "泌乳反射與排乳",
    keywords: "milk ejection reflex 排乳反射 oxytocin 催產素 myoepithelial cell 肌上皮細胞 prolactin reflex FIL",
    snippet: "泌乳素反射vs排乳反射、肌上皮細胞收縮、FIL局部負回饋機制。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "colostrum", sectionName: "初乳與被動免疫",
    keywords: "colostrum 初乳 passive transfer 被動轉移 gut closure 腸道關閉 FPT immunoglobulin",
    snippet: "初乳免疫球蛋白吸收窗口、腸道關閉時間物種比較、被動轉移失敗(FPT)。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "妊娠、分娩與泌乳生理",
    url: "總複習/獸醫生理學/妊娠分娩與泌乳生理.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 妊娠 分娩 泌乳 初乳",
    snippet: "涵蓋妊娠辨識、胎盤分類、分娩機轉、泌乳生理等章節重點的練習題（共5題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "structure", sectionName: "骨骼肌構造層級",
    keywords: "skeletal muscle sarcomere T-tubule triad 橫小管 三聯體 肌小節 sarcoplasmic reticulum 肌漿網",
    snippet: "骨骼肌構造層級、橫小管-肌漿網三聯體、肌小節A帶I帶H區。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "eccoupling", sectionName: "興奮收縮偶聯 EC Coupling",
    keywords: "excitation-contraction coupling EC coupling DHP receptor ryanodine receptor RyR mechanical coupling CICR 鈣誘發鈣釋放 機械偶聯",
    snippet: "骨骼肌DHP-RyR直接機械偶聯vs心肌鈣誘發鈣釋放CICR的關鍵差異。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "crossbridge", sectionName: "橫橋循環",
    keywords: "cross-bridge cycle 橫橋循環 myosin actin power stroke rigor mortis 屍僵",
    snippet: "橫橋循環步驟、power stroke動力衝程、屍僵機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "mechanics", sectionName: "單纖維收縮力學",
    keywords: "isotonic isometric twitch summation tetanus 等張 等長 加成 強直收縮 optimal length titin 肌聯蛋白",
    snippet: "等張/等長收縮、加成與強直收縮、最佳長度與肌聯蛋白。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "metabolism", sectionName: "能量代謝與肌纖維類型",
    keywords: "muscle fiber type slow-oxidative fast-glycolytic Type I Type IIA Type IIX 慢氧化型 快糖解型 肌肉疲勞",
    snippet: "三型骨骼肌纖維（慢氧化/快氧化糖解/快糖解）與肌肉疲勞機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "smooth", sectionName: "平滑肌生理",
    keywords: "smooth muscle 平滑肌 MLCK MLCP calmodulin 鈣調素 single-unit multi-unit 單一單位型 多單位型",
    snippet: "平滑肌MLCK/MLCP磷酸化開關、單一單位型vs多單位型分類。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "cardiac", sectionName: "心肌生理與三型比較",
    keywords: "cardiac muscle 心肌 intercalated disc 間盤 gap junction desmosome autorhythmicity 自動性 refractory period 不反應期",
    snippet: "心肌間盤（橋粒＋間隙接合）、自動性、長不反應期、三型肌肉綜合比較表。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "肌肉生理學",
    url: "總複習/獸醫生理學/肌肉生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 肌肉生理 橫橋循環 EC coupling",
    snippet: "涵蓋骨骼肌構造、EC coupling、橫橋循環、收縮力學、平滑肌心肌等章節重點的練習題（共5題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "hierarchy", sectionName: "運動控制階層",
    keywords: "motor control hierarchy 運動控制階層 voluntary involuntary 隨意 非隨意 motor program 運動程式",
    snippet: "運動控制階層架構（脊髓局部迴路/腦幹運動皮質/聯合皮質小腦）、隨意非隨意運動分類。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "proprioceptors", sectionName: "本體感覺受器",
    keywords: "proprioception 本體感覺 muscle spindle 肌梭 Golgi tendon organ 高爾基腱器官 nuclear chain nuclear bag",
    snippet: "肌梭（長度監測）與高爾基腱器官（張力監測）功能比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "stretchreflex", sectionName: "牽張反射與α-γ共活化",
    keywords: "stretch reflex 牽張反射 knee-jerk 膝跳反射 monosynaptic 單突觸反射 alpha-gamma coactivation reciprocal innervation 交互支配",
    snippet: "膝跳反射單突觸迴路、α-γ共活化機轉、交互支配抑制拮抗肌。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "withdrawal", sectionName: "屈曲反射與交叉伸肌反射",
    keywords: "withdrawal reflex 屈曲反射 crossed-extensor reflex 交叉伸肌反射 ipsilateral contralateral",
    snippet: "同側屈曲反射與對側交叉伸肌反射的協同保護機制。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "descending", sectionName: "下行徑路：皮質脊髓vs腦幹徑",
    keywords: "corticospinal pathway 皮質脊髓徑 錐體徑 pyramidal brainstem pathway 腦幹徑 錐體外系統 extrapyramidal",
    snippet: "皮質脊髓徑（多數交叉，精細動作）vs腦幹徑（多數不交叉，軀幹姿勢）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "cerebellum", sectionName: "小腦與姿勢平衡",
    keywords: "cerebellum 小腦 ataxia 動作不協調 dysmetria 辨距不良 timing planning error correction",
    snippet: "小腦時序協調/動作規劃/誤差校正三大功能、小腦病變臨床表現。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "身體運動的控制",
    url: "總複習/獸醫生理學/身體運動控制.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 運動控制 牽張反射 小腦",
    snippet: "涵蓋運動控制階層、本體感覺受器、脊髓反射、下行徑路、小腦功能等章節重點的練習題（共5題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心臟生理學",
    url: "總複習/獸醫生理學/心臟生理學.html",
    section: "conduction", sectionName: "傳導系統與節律點自動性",
    keywords: "SA node AV node Purkinje fiber 竇房結 房室結 蒲金氏纖維 pacemaker potential 節律點電位 funny channel automaticity 自動性",
    snippet: "心臟傳導路徑SA結→AV結→希氏束→蒲金氏纖維、竇房結節律點電位F型通道機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心臟生理學",
    url: "總複習/獸醫生理學/心臟生理學.html",
    section: "ecg", sectionName: "心電圖 ECG",
    keywords: "ECG P wave QRS complex T wave 心房去極化 心室去極化 心室再極化 mean electrical axis 平均電軸",
    snippet: "ECG波形P-QRS-T對應生理事件、平均電軸概念。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心臟生理學",
    url: "總複習/獸醫生理學/心臟生理學.html",
    section: "arrhythmia", sectionName: "心律不整與傳導阻滯",
    keywords: "arrhythmia fibrillation 心房顫動 心室顫動 heart block AV block 傳導阻滯 ARVC 拳師犬 Sotalol Mexiletine",
    snippet: "心房/心室顫動、房室傳導阻滯分級、犬ARVC臨床案例。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心臟生理學",
    url: "總複習/獸醫生理學/心臟生理學.html",
    section: "output", sectionName: "心輸出量、每搏量與Frank-Starling",
    keywords: "cardiac output stroke volume ejection fraction Frank-Starling preload afterload 心輸出量 每搏量 射出分率 前負荷 後負荷",
    snippet: "CO=HR×SV、EF=SV/EDV、Frank-Starling機轉、前負荷後負荷。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心臟生理學",
    url: "總複習/獸醫生理學/心臟生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 心臟生理 傳導系統 心動週期",
    snippet: "涵蓋心臟傳導、ECG判讀、心動週期、心輸出量調控、心律不整等章節重點的練習題（共12題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "hemodynamics", sectionName: "壓力、流量、阻力",
    keywords: "hemodynamics Poiseuille equation resistance 血液動力學 阻力 血管半徑 viscosity 黏滯度",
    snippet: "F=ΔP/R、Poiseuille方程式、血管半徑4次方關係決定阻力。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "arterial", sectionName: "動脈壓與脈搏壓",
    keywords: "mean arterial pressure MAP pulse pressure 平均動脈壓 脈搏壓 compliance 順應性 dicrotic notch",
    snippet: "MAP計算公式、脈搏壓決定因子、動脈順應性、dicrotic notch。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "autoregulation", sectionName: "血流自我調節",
    keywords: "autoregulation active hyperemia myogenic response 主動充血 肌源性反應 自我調節",
    snippet: "代謝性主動充血因子與肌源性反應機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "capillary", sectionName: "微循環與微血管交換",
    keywords: "microcirculation capillary precapillary sphincter net filtration pressure NFP 微循環 前微血管括約肌 淨過濾壓 水腫 edema",
    snippet: "微循環構造、NFP公式、低白蛋白血症與水腫成因。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "venous", sectionName: "靜脈系統與靜脈回流",
    keywords: "capacitance vessel 容量血管 skeletal muscle pump respiratory pump 肌肉幫浦 呼吸幫浦 varicose veins 靜脈曲張",
    snippet: "靜脈容量血管特性、肌肉幫浦與呼吸幫浦、靜脈曲張。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "血管生理學",
    url: "總複習/獸醫生理學/血管生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 血管生理 血液動力學 微循環",
    snippet: "涵蓋血液動力學、動脈壓、局部調控、微血管交換、靜脈回流等章節重點的練習題（共10題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "map", sectionName: "全身動脈壓的決定因子",
    keywords: "MAP CO TPR mean arterial pressure cardiac output total peripheral resistance 全身動脈壓 心輸出量 總周邊阻力",
    snippet: "MAP=CO×TPR核心整合公式與完整因子網絡。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "baroreflex", sectionName: "壓力感受反射",
    keywords: "baroreceptor reflex 壓力感受反射 carotid sinus aortic arch 頸動脈竇 主動脈弓",
    snippet: "壓力感受器位置、壓力感受反射完整效果鏈。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "medulla", sectionName: "延腦心血管中樞",
    keywords: "NTS RVLM AMB CVLM 孤束核 延腦心血管中樞 IML PVN 室旁核",
    snippet: "NTS/RVLM/AMB/CVLM四核團分工、脊髓IML、下視丘PVN。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "raas", sectionName: "RAAS與長期血壓調控",
    keywords: "renin angiotensin aldosterone system RAAS ACE vasopressin ADH V1A V2 腎素 血管收縮素 醛固酮",
    snippet: "RAAS完整路徑、Angiotensin II雙重作用、ADH雙重效果、保鉀利尿劑機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "hemorrhage", sectionName: "出血的代償反應",
    keywords: "hemorrhage 出血 autotransfusion 自體輸血機轉 hemorrhagic shock 出血性休克代償",
    snippet: "出血代償時序、自體輸血機轉NFP偏移。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "shock", sectionName: "循環休克",
    keywords: "circulatory shock hypovolemic low-resistance cardiogenic 低血容性休克 低阻力性休克 心因性休克 anaphylactic septic",
    snippet: "循環休克三分類：低血容性、低阻力性、心因性。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "hypertension", sectionName: "高血壓",
    keywords: "hypertension 高血壓 primary secondary 原發性 續發性 pheochromocytoma 嗜鉻細胞瘤",
    snippet: "原發性vs續發性高血壓、長期器官損害。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "心血管功能整合",
    url: "總複習/獸醫生理學/心血管功能整合.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 心血管整合 壓力感受反射 RAAS 休克",
    snippet: "涵蓋MAP整合、壓力感受反射、RAAS、出血代償、循環休克等章節重點的練習題（共10題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "mechanics", sectionName: "通氣力學與壓力變化",
    keywords: "ventilation Boyle's law transpulmonary pressure 跨肺壓 pneumothorax 氣胸 intrapleural pressure",
    snippet: "波以耳定律、肺泡壓/肋膜腔壓/跨肺壓定義、氣胸機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "compliance", sectionName: "肺順應性與表面張力",
    keywords: "lung compliance surfactant 表面張力素 surface tension 新生兒呼吸窘迫",
    snippet: "肺順應性決定因子、表面張力素降低表面張力、早產新生兒呼吸窘迫。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "volumes", sectionName: "肺容積與肺容量",
    keywords: "tidal volume TV IRV ERV RV vital capacity VC FRC TLC 潮氣容積 肺活量 肺總容量",
    snippet: "四肺容積與四肺容量定義、VC/IC/FRC/TLC組成公式。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "deadspace", sectionName: "通氣、死腔與灌流配合",
    keywords: "dead space 死腔 alveolar ventilation minute ventilation V/Q matching shunt 分流 hypoxic pulmonary vasoconstriction 缺氧性肺血管收縮",
    snippet: "肺泡換氣量公式、分流、缺氧性肺血管收縮與V/Q配合。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "diffusion", sectionName: "氣體擴散",
    keywords: "Fick's law diffusion alveolar-capillary barrier perfusion-limited diffusion-limited DLCO 擴散限制 灌流限制",
    snippet: "Fick擴散定律、灌流限制vs擴散限制氣體交換、DLCO測試。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "oxygen", sectionName: "氧氣運輸與血紅素飽和",
    keywords: "hemoglobin oxygen dissociation curve Bohr effect DPG 血紅素 氧解離曲線 波爾效應",
    snippet: "血紅素S形飽和曲線、右移四因子（PCO2/H+/溫度/DPG）、高海拔適應。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "co2", sectionName: "二氧化碳運輸",
    keywords: "CO2 transport bicarbonate chloride shift carbonic anhydrase 碳酸氫根 氯轉移 碳酸酐酶",
    snippet: "CO2三種運輸形式占比、氯轉移機轉、H+緩衝運輸。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "control", sectionName: "呼吸中樞調控",
    keywords: "medullary respiratory center Hering-Breuer reflex chemoreceptor carotid body aortic body COPD 中樞化學感受器 周邊化學感受器",
    snippet: "延腦呼吸中樞、Hering-Breuer反射、中樞vs周邊化學感受器、COPD給氧風險。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "clinical", sectionName: "臨床連結與肺的其他功能",
    keywords: "carbon monoxide poisoning CO中毒 cherry red 櫻桃紅 no cyanosis 不發紺 lung filter reservoir",
    snippet: "CO中毒機轉與臨床特徵、肺臟過濾/儲血/代謝等非氣體交換功能。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "呼吸生理學",
    url: "總複習/獸醫生理學/呼吸生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 呼吸生理 肺容積 氣體運輸",
    snippet: "涵蓋通氣力學、肺容積容量、氣體擴散、氧氣二氧化碳運輸、呼吸調控等章節重點的練習題（共10題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "nephron", sectionName: "腎元構造",
    keywords: "nephron 腎元 cortical juxtamedullary 皮質腎元 近髓腎元 glomerulus Bowman's capsule 腎絲球 鮑氏囊",
    snippet: "腎元三大功能（過濾/再吸收/分泌）、皮質腎元vs近髓腎元、兩套微血管系統。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "jga", sectionName: "腎絲球旁器",
    keywords: "juxtaglomerular apparatus JGA macula densa podocyte mesangial cell 腎絲球旁器 緻密斑 足細胞 系膜細胞",
    snippet: "JG細胞、緻密斑、足細胞、系膜細胞功能與管絲反饋感應站。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "filtration", sectionName: "腎絲球過濾與GFR",
    keywords: "GFR glomerular filtration rate filtration fraction FF proteinuria 腎絲球過濾率 過濾分率 蛋白尿",
    snippet: "GFR≈125mL/min、FF≈19-20%、淨過濾壓三力組成。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "clearance", sectionName: "腎清除率",
    keywords: "renal clearance inulin PAH creatinine 清除率 菊糖 肌酸酐",
    snippet: "C=UV/P公式、清除率與GFR大小關係判讀（菊糖/PAH/葡萄糖）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "concentration", sectionName: "對流倍增與尿液濃縮",
    keywords: "countercurrent multiplier loop of Henle vasa recta ADH aquaporin AQP2 對流倍增 亨利氏環 直血管",
    snippet: "亨利氏環通透性差異、髓質滲透壓梯度、ADH調控AQP2、必要水分流失量。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "diuretics", sectionName: "利尿劑分類",
    keywords: "diuretics mannitol furosemide loop diuretic thiazide spironolactone 利尿劑 保鉀利尿劑",
    snippet: "滲透性/環利尿劑/Thiazide/保鉀利尿劑作用部位比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "腎臟生理學基礎",
    url: "總複習/獸醫生理學/腎臟生理學基礎.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 腎臟生理 腎絲球過濾 清除率",
    snippet: "涵蓋腎元構造、腎絲球過濾、清除率、對流倍增、電解質調控等章節重點的練習題（共7題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "compartments", sectionName: "體液區隔與體液平衡",
    keywords: "body fluid compartment ICF ECF 細胞內液 細胞外液 interstitial fluid plasma",
    snippet: "ICF約63%、ECF約37%、水分獲得流失調控槓桿。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "osmosis", sectionName: "滲透壓與水分子移動規則",
    keywords: "osmolarity water follows salt protein glucose 滲透壓 water intoxication 水中毒",
    snippet: "Water follows Salt/Protein/Glucose口訣、細胞腫脹皺縮、水中毒。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "shifts", sectionName: "體液移位的臨床情境",
    keywords: "third spacing exudate transudate ascites pleural effusion 第三空間 滲出液 漏出液 腹水",
    snippet: "第三空間效應、滲出液vs漏出液、腹水與肋膜積液成因。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "electrolytes", sectionName: "主要電解質總論",
    keywords: "sodium potassium calcium phosphate magnesium chloride bicarbonate 鈉 鉀 鈣 磷 鎂 氯",
    snippet: "七大電解質分布、功能與調控激素總表。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "buffers", sectionName: "化學緩衝系統",
    keywords: "buffer system protein bicarbonate phosphate 蛋白質緩衝 碳酸氫根緩衝 磷酸鹽緩衝",
    snippet: "三大化學緩衝系統、呼吸vs腎臟緩衝速度容量比較。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "renalacid", sectionName: "腎臟酸鹼調節機轉",
    keywords: "hydrogen ion secretion bicarbonate reabsorption ammonium titratable acid 氫離子分泌 銨離子 可滴定酸",
    snippet: "H+分泌、HCO3-再吸收、磷酸鹽與銨離子緩衝機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "imbalance", sectionName: "酸鹼失衡分類與代償",
    keywords: "respiratory acidosis alkalosis metabolic acidosis alkalosis 呼吸性酸中毒 代謝性酸中毒 代償",
    snippet: "酸鹼失衡四分類、常見病因、呼吸與腎臟代償方向。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "metabolism", sectionName: "能量代謝與基礎代謝率",
    keywords: "basal metabolic rate BMR thyroid hormone epinephrine calorigenic 基礎代謝率 產熱效應",
    snippet: "BMR四大決定因子（甲狀腺素/腎上腺素/食物誘導產熱/肌肉活動）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "thermoregulation", sectionName: "體溫調節",
    keywords: "thermoregulation core body temperature shivering non-shivering fever hyperthermia 顫抖性產熱 發燒 體溫過高",
    snippet: "晝夜體溫節律、顫抖/非顫抖產熱、發燒vs體溫過高機轉差異。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "體液、電解質與體溫調節",
    url: "總複習/獸醫生理學/體液電解質與體溫調節.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 體液電解質 酸鹼 體溫調節",
    snippet: "涵蓋體液區隔、電解質、酸鹼緩衝與失衡、能量代謝、體溫調節等章節重點的練習題（共7題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "overview", sectionName: "發酵消化總論：前胃vs後腸",
    keywords: "forestomach hindgut fermentation 前胃 後腸 rumen reticulum omasum abomasum 瘤胃 網胃 瓣胃 皺胃",
    snippet: "發酵消化vs一般消化差異、前胃發酵與後腸發酵物種分類。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "microbes", sectionName: "瘤胃微生物生態",
    keywords: "rumen bacteria protozoa fungi 瘤胃細菌 原蟲 真菌 cross-feeding 交叉餵養",
    snippet: "細菌原蟲真菌三大類微生物、交叉餵養協同分工。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "vfa", sectionName: "VFA生成與代謝路徑",
    keywords: "volatile fatty acid VFA acetate propionate butyrate methane 揮發性脂肪酸 乙酸 丙酸 丁酸 甲烷",
    snippet: "醣類經糖解厭氧代謝產生VFA、乙酸丙酸與產甲烷關係、飼糧對VFA比例影響。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "protein", sectionName: "蛋白質發酵與尿素再循環",
    keywords: "urea recycling ammonia microbial protein 尿素再循環 微生物蛋白 非蛋白氮",
    snippet: "蛋白質發酵路徑、微生物蛋白合成、尿素再循環機制。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "motility", sectionName: "網胃瘤胃蠕動與反芻",
    keywords: "reticulorumen motility mixing eructation regurgitation rumination cud chewing 混合收縮 噯氣 反芻",
    snippet: "混合/噯氣/逆嘔三種收縮型式、反芻機轉、迷走神經調控。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "absorption", sectionName: "VFA吸收機轉",
    keywords: "VFA absorption rumen epithelium stratified squamous beta-hydroxybutyrate 瘤胃上皮 複層鱗狀上皮 β-羥丁酸",
    snippet: "VFA解離態與游離態轉換、瘤胃上皮吸收機轉、丁酸轉β-羥丁酸。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "hindgut", sectionName: "馬屬後腸發酵比較",
    keywords: "equine hindgut cecum colon pelvic flexure 馬 盲腸 結腸 骨盆曲 colon impaction 結腸阻塞",
    snippet: "馬盲腸結腸發酵、與瘤胃發酵效率差異、骨盆曲阻塞好發。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "反芻動物消化生理學",
    url: "總複習/獸醫生理學/反芻動物消化生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 反芻動物消化 VFA 瘤胃",
    snippet: "涵蓋瘤胃微生物、VFA代謝、瘤胃蠕動與反芻、VFA吸收、後腸發酵比較等章節重點的練習題（共6題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "overview", sectionName: "消化道總論與調控系統",
    keywords: "enteric nervous system ENS gut hormone secretin gastrin CCK GIP motilin 腸神經系統 腸道激素",
    snippet: "ENS兩套神經叢、卡哈爾間質細胞、五大腸道激素總表。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "motility", sectionName: "胃腸道蠕動型態",
    keywords: "receptive relaxation enterogastric reflex segmentation MMC migrating motility complex 容受性舒張 腸胃反射 分節收縮",
    snippet: "胃近端儲存遠端研磨、腸胃反射抑制排空、小腸分節收縮與MMC。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "gastric", sectionName: "胃液分泌",
    keywords: "gastric juice parietal cell chief cell HCl pepsinogen cephalic gastric intestinal phase 壁細胞 主細胞 頭期 胃期 腸期",
    snippet: "胃腺細胞分泌總表、胃酸分泌三期調控、鹼潮。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "pancreas", sectionName: "胰臟外分泌",
    keywords: "pancreatic zymogen trypsinogen enterokinase acinar cell 胰蛋白酶原 腸激酶 腺泡細胞",
    snippet: "胰酵素原活化級聯、secretin/CCK對胰液不同成分的調控。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "liver", sectionName: "肝臟膽汁與腸肝循環",
    keywords: "bile acid enterohepatic circulation gallbladder 膽酸 腸肝循環 膽囊 黃疸 jaundice",
    snippet: "膽酸腸肝循環、膽囊物種差異、溶血性vs阻塞性黃疸。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "fat", sectionName: "脂肪消化吸收",
    keywords: "emulsification micelle chylomicron lipase co-lipase 乳化 微胞 乳糜微粒 postprandial lipemia 餐後脂血症",
    snippet: "脂肪消化吸收四階段、長短鏈脂肪酸吸收路徑分歧、餐後脂血症。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "neonate", sectionName: "新生兒消化特殊性",
    keywords: "colostrum intact protein absorption lactase maltase 初乳 完整蛋白質吸收 乳糖酶 麥芽糖酶",
    snippet: "新生兒延遲胃酸胰酵素發育、完整吸收初乳抗體、雙醣酶成熟轉換。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "postabsorptive", sectionName: "吸收後期代謝",
    keywords: "gluconeogenesis glycogenolysis HSL CPT-1 malonyl-CoA ketogenesis alanine cycle 糖質新生 酮體生成 丙胺酸循環",
    snippet: "胰島素/升糖素比值切換、HSL脂肪動員、CPT-1酮體生成限速步驟、糖尿病酮酸中毒機轉。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "ruminantfuel", sectionName: "反芻動物燃料代謝比較",
    keywords: "ruminant fuel propionate gluconeogenesis acetate fatty acid synthesis 反芻動物燃料代謝 丙酸生糖",
    snippet: "反芻動物永久糖質新生狀態、丙酸為唯一生糖VFA、脂肪酸合成原料為乙酸。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "單胃動物消化生理學",
    url: "總複習/獸醫生理學/單胃動物消化生理學.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 單胃消化 吸收後代謝 酮體",
    snippet: "涵蓋消化道調控、分泌機轉、三大營養素消化吸收、吸收後代謝等章節重點的練習題（共7題）。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "eeg", sectionName: "EEG腦波紀錄與波型分類",
    keywords: "EEG alpha beta theta delta wave 10-20 system synchronized desynchronized 腦波 同步化 去同步化",
    snippet: "10-20電極系統、alpha/beta/theta/delta波型頻率與特徵。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "stages", sectionName: "NREM與REM睡眠分期",
    keywords: "NREM REM sleep stage delta sleep slow wave sleep 慢波睡眠 睡眠分期",
    snippet: "睡眠五分期特徵、δ睡眠為最深層恢復性睡眠。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "wake", sectionName: "覺醒系統神經傳導物質",
    keywords: "acetylcholine norepinephrine histamine serotonin dopamine orexin hypocretin narcolepsy 食慾素 猝睡症",
    snippet: "ACh/NE/組織胺/血清素/多巴胺/食慾素在清醒NREM REM的活性變化。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "rem", sectionName: "REM睡眠調控系統",
    keywords: "REM-on cholinergic atonia glycine REM sleep behavior disorder 膽鹼性神經元 肌肉張力喪失",
    snippet: "REM-on膽鹼性神經元去抑制機轉、甘胺酸介導的atonia。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "twoprocess", sectionName: "兩歷程模型",
    keywords: "two-process model process S process C Borbely homeostatic circadian 恆定歷程 晝夜歷程",
    snippet: "Process S恆定歷程與Process C晝夜歷程、睡眠剝奪不對稱效應。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "circadian", sectionName: "生理時鐘與退黑激素",
    keywords: "SCN suprachiasmatic nucleus melatonin clock gene Period Cryptochrome 視交叉上核 退黑激素 時鐘基因",
    snippet: "SCN主節律點、退黑激素分泌調控、Period/Cryptochrome時鐘基因。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "deprivation", sectionName: "睡眠剝奪的影響",
    keywords: "sleep deprivation glymphatic system amyloid-beta pERK2 memory 類淋巴系統 類澱粉蛋白 記憶編碼",
    snippet: "睡眠剝奪對記憶編碼的影響、類淋巴系統清除類澱粉蛋白。"
  },
  {
    subject: "獸醫生理學", semester: "總複習", week: null, weekTitle: "睡眠生理與腦波節律",
    url: "總複習/獸醫生理學/睡眠生理與腦波節律.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 睡眠生理 腦波 晝夜節律",
    snippet: "涵蓋EEG波型、睡眠分期、神經傳導物質調控、兩歷程模型、晝夜節律等章節重點的練習題（共6題）。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 ASF CSF JEV HEV 非洲豬瘟 古典豬瘟 日本腦炎 E型肝炎 國考重點",
    snippet: "七個臨床與國考重點：ASF vs CSF鑑別診斷、環境抵抗力、CSF先天型與產後持續感染型、台灣CSF根除史、代表性病變、JEV增幅宿主概念、HEV食品安全。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "asf-overview", sectionName: "病毒學與環境抵抗力(ASF)",
    keywords: "ASF Asfarviridae Asfivirus DNA virus 非洲豬瘟 基因型 genotype 環境抵抗力 去活化 疣豬 warthog",
    snippet: "ASFV為唯一經節肢動物傳播的DNA病毒，24種基因型，環境抵抗力極強（血液4°C可達18個月）。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "asf-transmission", sectionName: "傳播與致病機轉(ASF)",
    keywords: "ASF transmission Ornithodoros 軟蜱 tick 傳播途徑 致病機轉 pathogenesis 病毒血症 viremia",
    snippet: "ASF經直接接觸、餿水餵食、介質、軟蜱等途徑傳播；致病機轉：扁桃腺初期複製→血液淋巴次級複製。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "asf-clinical", sectionName: "臨床症狀與病理病變(ASF)",
    keywords: "ASF clinical signs peracute acute subacute chronic 脾臟 腫大 質脆 暗紅 spleen enlarged friable darkened",
    snippet: "最急性／急性／亞急性／慢性四種病程；脾臟腫大質脆暗紅為代表性大體病變。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "asf-dx", sectionName: "鑑別診斷、診斷與防治(ASF)",
    keywords: "ASF differential diagnosis HAD hemadsorption PCR ELISA vaccine 基因刪除減毒活疫苗 越南 生物安全",
    snippet: "病毒分離+HAD確診、PCR快篩；基因刪除減毒活疫苗於越南等國核准使用；防治核心為生物安全與撲殺。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "csf-overview", sectionName: "病毒學與環境抵抗力(CSF)",
    keywords: "CSF Pestiviridae Orthopestivirus RNA virus 古典豬瘟 基因型 genotype 甲類傳染病 荷蘭疫情",
    snippet: "CSFV屬Pestiviridae科RNA病毒，三種基因型，台灣為CSF清淨國；1997-98荷蘭疫情損失23億美元。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "csf-clinical", sectionName: "致病機轉與臨床型式(CSF)",
    keywords: "CSF pathogenesis 免疫耐受 immunotolerance late-onset 先天持續感染 congenital postnatal 持續性病毒血症",
    snippet: "CSF四種臨床型式：急性、慢性、先天型、產後持續感染型；late-onset CSF因免疫耐受終生排毒。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "csf-lesions", sectionName: "病理病變與鑑別診斷(CSF)",
    keywords: "CSF button ulcers 鈕扣狀潰瘍 splenic infarction 脾臟梗塞 differential diagnosis 鑑別診斷",
    snippet: "脾臟梗塞、腸胃道黏膜鈕扣狀潰瘍為代表病變；ASF與CSF臨床症狀高度重疊須靠實驗室確診。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "csf-dx", sectionName: "診斷、防治與台灣根除史(CSF)",
    keywords: "CSF diagnosis RT-PCR ELISA FAVNT DIVA marker vaccine 台灣 根除 停止疫苗 2023 基因型2.1 3.4",
    snippet: "RT-PCR/FAVNT/ELISA診斷；DIVA標記疫苗；台灣CSF根除史：1996基因型轉變、2006無病例、2023停止疫苗接種。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "compare", sectionName: "ASF vs CSF 比較",
    keywords: "ASF CSF comparison 比較表 鑑別診斷 病毒科屬 環境抵抗力 代表病變 臨床型式",
    snippet: "ASF與CSF病毒科屬、病媒、環境抵抗力、代表病變、臨床型式、台灣現況、疫苗之綜合比較表。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "jev", sectionName: "日本腦炎",
    keywords: "JEV Japanese encephalitis Flaviviridae Culex 增幅宿主 amplifying host dead-end host 生殖障礙 流產 睪丸炎",
    snippet: "JEV為蚊媒黃病毒，豬為增幅宿主、人馬為終端宿主；妊娠60-70天前感染致生殖障礙，公豬暫時性不孕。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "hev", sectionName: "E型肝炎",
    keywords: "HEV Hepatitis E Hepeviridae 人畜共通 zoonotic genotype 3 4 豬肝 食品安全 糞口傳播",
    snippet: "HEV-3、HEV-4為人畜共通基因型，豬感染多無症狀；糞口途徑傳播，豬肝HEV RNA陽性率24%，須徹底煮熟。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "學習重點整理 summary ASF CSF JEV HEV 複習",
    snippet: "整理ASF、CSF、JEV、HEV病毒學、致病機轉、病變與防治要點，供考前快速複習。"
  },
  {
    subject: "豬病學", semester: "大四上", week: 2, weekTitle: "豬病毒性疾病 (I)",
    url: "大四上/豬病學/week02_豬病毒性疾病I.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 ASF CSF JEV HEV",
    snippet: "涵蓋ASF、CSF、JEV、HEV病毒學、臨床型式、鑑別診斷、台灣根除史等章節重點的練習題（共10題）。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 循環系統 心臟 冠狀循環 動脈 靜脈 淋巴 觸診淋巴結",
    snippet: "八個臨床與國考重點：心臟定位、瓣膜強度規則、傳導系統與迷走神經、冠狀循環物種差異、主動脈弓分支、腹主動脈內臟枝分段、臨床採血部位、觸診淋巴結。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "heartposition", sectionName: "心臟位置與大血管開口",
    keywords: "心臟位置 heart position 肋間 intercostal 主動脈開口 肺動脈幹開口 X光 radiography 縱溝 longitudinal groove 冠狀溝 coronary groove",
    snippet: "犬心臟位於第3/4-6/7肋間，主動脈開口第3肋、肺動脈幹開口第4肋；馬牛心臟位置比較；X光心臟結構辨識。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "heartchambers", sectionName: "心臟四腔與瓣膜構造",
    keywords: "心房 心室 atrium ventricle 三尖瓣 tricuspid 二尖瓣 mitral bicuspid 主動脈瓣 aortic valve 肺動脈瓣 pulmonary valve 卵圓窩 oval fossa 調節束 moderator band 心包膜 pericardium 心臟骨骼 ossa cordis",
    snippet: "房中膈室中膈、四腔構造、瓣膜強厚規則（左側強於右側）、心包膜構造與功能、心臟骨骼。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "conduction", sectionName: "心臟傳導系統與神經支配",
    keywords: "竇房結 SA node 房室結 AV node His bundle 傳導系統 conduction system 交感神經 副交感神經 迷走神經 vagus 正變時 正變力",
    snippet: "SA node→AV node→His bundle→左右分支傳導路徑；交感/副交感神經支配範圍差異，迷走神經不直接作用心室肌。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "coronary", sectionName: "冠狀循環",
    keywords: "冠狀循環 coronary circulation 左冠狀動脈 右冠狀動脈 迴旋枝 circumflex 室間枝 interventricular 大心靜脈 great cardiac vein",
    snippet: "左右冠狀動脈分支與物種差異：犬貓反芻動物右室間枝來自左冠狀動脈迴旋枝，馬豬則由右冠狀動脈直接發出。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "arteryoverview", sectionName: "主動脈總覽與主動脈弓分支",
    keywords: "主動脈 aorta 主動脈弓 aortic arch 膊頭動脈 brachiocephalic 總頸動脈 common carotid 鎖骨下動脈 subclavian 動脈壁 側枝循環 collateral circulation 物種比較",
    snippet: "動脈壁三層構造、側枝循環、主動脈弓分支物種差異：犬貓兔左鎖骨下動脈單獨發出，反芻動物馬豬四條血管同源一幹。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "headneckartery", sectionName: "頭頸部與前肢動脈",
    keywords: "內頸動脈 internal carotid 外頸動脈 external carotid 腦動脈輪 arterial circle of brain 椎動脈 vertebral artery 肋頸動脈 腋窩動脈 axillary 肱動脈 brachial artery",
    snippet: "總頸動脈分內外頸動脈，內頸供應腦部、外頸供應頭部淺層；鎖骨下動脈經腋窩動脈延續為肱動脈（前肢脈搏觸診點）。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "abdominalartery", sectionName: "腹主動脈與內臟動脈分支",
    keywords: "腹主動脈 abdominal aorta 腹腔動脈 celiac 前腸繫膜動脈 cranial mesenteric 後腸繫膜動脈 caudal mesenteric 腎動脈 renal artery 腰動脈 lumbar 前腸中腸後腸",
    snippet: "未成對內臟動脈依前中後腸分三段：腹腔動脈(胃肝脾)、前腸繫膜動脈(小腸大腸)、後腸繫膜動脈(降結腸直腸)。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "pelvicartery", sectionName: "骨盆與後肢動脈",
    keywords: "內腸骨動脈 internal iliac 外腸骨動脈 external iliac 股動脈 femoral artery 膕動脈 popliteal 背側足動脈 dorsal pedal artery 脈搏觸診",
    snippet: "外腸骨動脈→股動脈→膕動脈→背側足動脈；股動脈與背側足動脈是後肢理學檢查脈搏觸診部位。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "vein", sectionName: "靜脈系統與臨床採血部位",
    keywords: "頭靜脈 cephalic vein 內隱靜脈 外隱靜脈 medial lateral saphenous vein 頸靜脈 jugular vein 肝門靜脈 hepatic portal vein 採血 靜脈留置 venipuncture",
    snippet: "頭靜脈(前肢)、內外側隱靜脈(後肢)、頸靜脈為臨床採血留置導管部位；肝門靜脈系統與首渡效應。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "lymph", sectionName: "淋巴系統與觸診淋巴結",
    keywords: "淋巴系統 lymphatic system 淋巴結 lymph node 觸診淋巴結 palpable lymph node 下頜 淺頸 腋下 腹股溝 膕窩 mandibular axillary inguinal popliteal 胸管 thoracic duct 乳糜池",
    snippet: "犬貓觸診淋巴結圖解，五大觸診淋巴結：下頜、淺頸、腋下、淺腹股溝、膕窩；胸管與乳糜池、無淋巴管組織清單。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 循環系統",
    snippet: "十一點循環系統總複習：心臟定位、瓣膜規則、傳導系統、冠狀循環、主動脈弓分支、內臟動脈分段、後肢動脈、靜脈採血部位、門靜脈、觸診淋巴結。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "循環系統",
    url: "總複習/解剖生理學/循環系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 循環系統 心臟 動脈 靜脈 淋巴",
    snippet: "涵蓋心臟構造、傳導系統、冠狀循環、動脈靜脈分支、觸診淋巴結等重點的練習題（共10題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 消化系統 反芻胃 瘤胃 十二指腸 肝臟 胰臟 腹膜",
    snippet: "八個臨床與國考重點：消化道四層構造、攝食方式、反芻動物前胃、網胃溝、胰膽開口物種差異、肝臟6葉與PSS、結腸盤繞物種差異、網膜孔。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "overview", sectionName: "消化道基本構造與攝食方式",
    keywords: "消化道 digestive tract 黏膜 mucosa 黏膜下層 submucosa 肌層 muscular 漿膜 serosa 攝食 prehension 咀嚼 mastication 腸繫膜 mesentery",
    snippet: "消化道五大功能、攝食方式物種差異（牛舌馬唇羊兼用犬齒雞喙）、消化道四層通用組織構造。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "mouth", sectionName: "口腔",
    keywords: "口腔 mouth oral cavity 前庭 vestibule 舌 tongue 舌乳頭 papillae Lyssa 牙齒 teeth 齒式 dental formula 唾液腺 salivary gland 腮腺 parotid 下頜腺 mandibular 舌下腺 sublingual 顴腺 zygomatic 唾液黏液囊腫 mucocele 浮動齒 floating teeth 犁鼻器 vomeronasal flehmen 軟顎 硬顎 口咽",
    snippet: "口腔前庭、舌與Lyssa、齒式與浮動齒、四對唾液腺與唾液黏液囊腫、硬顎犁鼻器與Flehmen反應、軟顎口咽。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "esophagus", sectionName: "食道",
    keywords: "食道 esophagus 賁門 cardia 巨食道症 megaesophagus 持續性右主動脈弓 PRAA 嘔吐",
    snippet: "食道無消化吸收功能，馬兔無法嘔吐；巨食道症與持續性右主動脈弓(PRAA)臨床重點。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "monogastric", sectionName: "單胃動物的胃",
    keywords: "單胃 monogastric stomach 賁門 cardia 胃底 fundus 胃體 body 幽門 pylorus 幽門竇 pyloric antrum 小彎 大彎 皺褶 rugae",
    snippet: "單胃動物胃分四區：賁門、胃底、胃體、幽門部；小彎大彎與胃內皺褶。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "ruminant", sectionName: "反芻動物的胃",
    keywords: "反芻胃 rumen 瘤胃 reticulum 蜂巢胃 omasum 重瓣胃 abomasum 皺胃 前胃 forestomach 瘤胃臌脹 bloat 創傷性網胃炎 hardware disease 網胃溝 reticular groove",
    snippet: "四個胃室只有皺胃是真胃；瘤胃臌脹、蜂巢胃創傷性網胃炎為牛經典急症；網胃溝吸吮反射使奶汁繞過瘤胃。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "smallintestine", sectionName: "小腸",
    keywords: "小腸 small intestine 十二指腸 duodenum 空腸 jejunum 迴腸 ileum 絨毛 villi 十二指腸大乳頭 major duodenal papilla 小乳頭 minor duodenal papilla 犬小病毒 parvovirus 傳染性胃腸炎 TGE",
    snippet: "十二指腸走行與乳突開口、空腸迴腸特徵；小腸絨毛病毒性腸炎（犬小病毒、豬TGE）。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "largeintestine", sectionName: "大腸、直腸與肛門",
    keywords: "大腸 large intestine 盲腸 cecum 結腸 colon 升結腸 橫結腸 降結腸 結腸曲 colic flexure 直腸 rectum 肛門 anus 肛門囊 anal sac 馬疝痛 colic",
    snippet: "盲腸結腸物種差異、結腸盤繞模式比較（肉食/反芻/豬/馬），馬疝痛解剖基礎；直腸肛門與肛門囊。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "liver", sectionName: "肝臟與膽囊",
    keywords: "肝臟 liver 肝葉 hepatic lobe 肝門靜脈 hepatic portal system 先天性門脈分流 portosystemic shunt PSS 肝內分流 IHPSS 肝外分流 EHPSS 膽囊 gallbladder 膽管 bile duct",
    snippet: "犬貓肝臟6葉；肝門靜脈系統；先天性PSS肝內型(大型犬)與肝外型(玩具犬)；馬無膽囊，貓膽胰共同開口。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "pancreas", sectionName: "胰臟",
    keywords: "胰臟 pancreas 外分泌 exocrine 內分泌 endocrine 澱粉酶 蛋白酶 脂肪酶 胰島素 insulin 升糖素 glucagon 主胰管 副胰管 accessory pancreatic duct",
    snippet: "胰臟外分泌(澱粉酶/蛋白酶/脂肪酶)與內分泌(胰島素/升糖素)功能；犬主副兩胰管、貓單一胰管與膽管匯合。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "peritoneum", sectionName: "腹膜與腸繫膜",
    keywords: "腹膜 peritoneum 壁層腹膜 臟層腹膜 腸繫膜 mesentery 網膜 omentum 大網膜 小網膜 網膜囊 omental bursa 網膜孔 epiploic foramen 鐮狀韌帶 falciform ligament 冠狀韌帶 coronary ligament 貓傳染性腹膜炎 FIP 腹膜透析",
    snippet: "腹膜三分類、大小網膜與網膜孔（門脈分流手術地標）、鐮狀韌帶與冠狀韌帶；FIP與腹膜透析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 消化系統",
    snippet: "十點消化系統總複習：消化道四層構造、反芻胃、網胃溝、十二指腸、結腸盤繞、肝臟PSS、膽胰物種差異、網膜孔。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "消化系統",
    url: "總複習/解剖生理學/消化系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 消化系統 反芻胃 十二指腸 肝臟 胰臟",
    snippet: "涵蓋反芻胃、十二指腸、肝膽胰物種差異、腹膜等重點的練習題（共10題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 呼吸系統 喉 短吻犬綜合症 氣管塌陷 肺葉 橫膈 禽類呼吸",
    snippet: "八個臨床與國考重點：咽腔互換位置、真假聲帶、短吻犬綜合症三異常、貓喉痙攣、氣管塌陷、肺葉物種差異、橫膈三裂孔、禽類單向氣流。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "overview", sectionName: "呼吸系統總論與組織學",
    keywords: "上呼吸道 upper respiratory tract 下呼吸道 lower respiratory tract 纖毛 cilia 發聲 體溫調節 酸鹼平衡",
    snippet: "上下呼吸道分段、纖毛黏液清除機制、呼吸系統主要功能(氣體交換)與次要功能(發聲/體溫/酸鹼/嗅覺)。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "nasal", sectionName: "鼻腔",
    keywords: "鼻腔 nasal cavity 鼻孔 nostrils 鼻道 nasal passages 鼻甲骨 turbinates 鼻竇 sinus 額竇 frontal sinus 上頜竇 maxillary sinus",
    snippet: "鼻孔軟骨支撐、鼻甲骨溫暖濕潤過濾功能、額竇與上頜竇。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "pharynx", sectionName: "咽",
    keywords: "咽 pharynx 鼻咽 nasopharynx 口咽 oropharynx 喉咽 laryngopharynx 軟顎 soft palate 會厭 epiglottis 吞嚥 swallowing 嗆咳",
    snippet: "鼻咽口咽喉咽分區，咽部呼吸消化通道互換位置，吞嚥會厭反射與嗆咳機轉。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "larynx", sectionName: "喉",
    keywords: "喉 larynx 會厭 epiglottis 杓狀軟骨 arytenoid 甲狀軟骨 thyroid cartilage 環狀軟骨 cricoid cartilage 聲帶 vocal fold 前庭皺襞 vestibular fold 聲門 glottis 咳嗽 短吻犬綜合症 brachycephalic syndrome 鼻孔狹窄 stenotic nares 軟顎過長 elongated soft palate 喉囊外翻 everted laryngeal saccules 氣管內插管 endotracheal intubation 喉痙攣 laryngospasm 絕對經鼻呼吸 obligate nasal breathing",
    snippet: "喉部四大軟骨、真假聲帶、短吻犬綜合症三異常、貓喉痙攣插管技巧、馬兔囓齒類絕對經鼻呼吸。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "trachea", sectionName: "氣管與支氣管",
    keywords: "氣管 trachea C形軟骨環 C-shaped cartilage 氣管隆嵴 carina 氣管塌陷 tracheal collapse 支氣管 bronchus 細支氣管 bronchiole 肺泡 alveoli",
    snippet: "氣管C形軟骨環、氣管隆嵴、玩具犬氣管塌陷；支氣管樹軟骨由近至遠逐漸消失。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "lungs", sectionName: "肺臟",
    keywords: "肺臟 lungs 肺葉 lung lobes 肺門 hilus 胎兒肺 asthma 氣喘",
    snippet: "肺葉分佈物種差異(犬貓牛豬羊左2右4，馬左1右2)、肺門、胎兒肺浮沉試驗、貓氣喘。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "thorax", sectionName: "胸腔、胸膜與橫膈",
    keywords: "胸腔 thorax 胸膜 pleura 臟層胸膜 壁層胸膜 縱膈 mediastinum 心包膜 pericardium 心包積液 pericardial effusion 橫膈 diaphragm 中央腱 central tendon 腔靜脈孔 caval foramen 食道裂孔 esophageal hiatus 主動脈裂孔 aortic hiatus 膈神經 phrenic nerve 迷走神經 vagus nerve",
    snippet: "臟壁層胸膜與縱膈、心包膜層次；橫膈三裂孔與通過構造，膈神經與迷走神經支配區分。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "avian", sectionName: "禽類呼吸系統",
    keywords: "禽類呼吸系統 avian respiratory system 內鼻孔 choanae 鳴管 syrinx 氣囊 air sacs 單向氣流 unidirectional airflow",
    snippet: "禽類無軟顎無會厭、喉不發聲改由鳴管發聲；9對氣囊形成單向氣流，無橫膈。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 呼吸系統",
    snippet: "九點呼吸系統總複習：咽部分區、喉部軟骨與短吻犬綜合症、氣管塌陷、肺葉物種差異、橫膈裂孔、禽類單向氣流。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "呼吸系統",
    url: "總複習/解剖生理學/呼吸系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 呼吸系統 喉 氣管 肺臟 禽類",
    snippet: "涵蓋咽喉、短吻犬綜合症、氣管支氣管、肺葉、橫膈、禽類呼吸等重點的練習題（共10題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 泌尿系統 腎臟 單乳頭腎 多乳頭腎 尿道阻塞",
    snippet: "七個臨床與國考重點：右腎較前側(豬例外)、單多乳頭腎物種差異、牛無腎盂、輸尿管防逆流、膀胱位置、公貓尿道阻塞、禽類無腎盂。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "overview", sectionName: "泌尿系統總論",
    keywords: "泌尿系統 urinary system 腎臟 kidney 輸尿管 ureter 膀胱 urinary bladder 尿道 urethra nephro reno",
    snippet: "泌尿系統四構成(2腎2輸尿管1膀胱1尿道)，腎臟位置右腎較前側，豬為例外。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "kidneyexternal", sectionName: "腎臟外觀與物種差異",
    keywords: "腎臟外觀 kidney external 纖維囊 fibrous capsule 豆狀 bean-shaped 腎葉 分葉 lobulation 牛腎 豬腎 犬腎",
    snippet: "腎臟表面型態物種比較：犬貓馬豬平滑，牛不平滑有外部分葉(約12葉)。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "kidneyinternal", sectionName: "腎臟內部構造",
    keywords: "腎臟內部構造 皮質 cortex 髓質 medulla 弓狀血管 arcuate vessels 腎乳頭 renal papilla 腎錐體 pyramid 單乳頭腎 unipyramidal 多乳頭腎 multipyramidal 腎門 hilus 腎盂 renal pelvis 腎盞 calyx 腎盂隱窩 pelvic recess",
    snippet: "皮質髓質構造，單乳頭腎(犬貓馬)vs多乳頭腎(豬牛)物種比較，牛無腎盂，腎盂系統構造。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "ureter", sectionName: "輸尿管",
    keywords: "輸尿管 ureter 斜角 oblique angle 防逆流 上行性感染",
    snippet: "輸尿管以斜角穿入膀胱壁，形成防逆流被動瓣膜機制。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "bladder", sectionName: "膀胱",
    keywords: "膀胱 urinary bladder 三角區 trigone 骨盆腔 恥骨 pubic bone",
    snippet: "膀胱三角區、空虛時位於骨盆腔貼靠恥骨、充盈時前移入腹腔。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "urethra", sectionName: "尿道",
    keywords: "尿道 urethra 攝護腺部 prostatic portion 膜部 membranous portion 陰莖部 penile portion 陰莖骨 os penis 公貓泌尿道阻塞 尿道栓塞",
    snippet: "公犬貓尿道三段，陰莖部最狹窄是公貓泌尿道阻塞好發部位；母犬貓尿道短而直。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "avian", sectionName: "禽類泌尿系統",
    keywords: "禽類泌尿系統 avian urinary system 合薦骨 synsacrum 尿酸鹽 urate 泄殖腔 cloaca 痛風 gout",
    snippet: "禽類腎臟細長分三葉、無腎盂、嵌入合薦骨；含氮廢物以尿酸鹽形式經泄殖腔排出。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 泌尿系統",
    snippet: "七點泌尿系統總複習：腎臟物種差異、單多乳頭腎、牛無腎盂、輸尿管防逆流、膀胱位置、尿道阻塞、禽類泌尿系統。"
  },
  {
    subject: "獸醫解剖學", semester: "總複習", week: null, weekTitle: "泌尿系統",
    url: "總複習/解剖生理學/泌尿系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 泌尿系統 腎臟 尿道",
    snippet: "涵蓋腎臟物種差異、輸尿管、膀胱、尿道阻塞、禽類泌尿系統等重點的練習題（共8題），點擊即可顯示答案與解析。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 IB 傳染性支氣管炎 病原型 血清型 false layer syndrome 親腎型 國考重點",
    snippet: "八個臨床與國考重點：高發病率低死亡率、五種病原型、血清型決定疫苗保護、感染日齡與輸卵管永久損傷、產蛋損失、胚胎矮小化、多型別輪替疫苗。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "virology", sectionName: "病原學與基因型／血清型",
    keywords: "IBV Coronaviridae group 3 coronavirus ssRNA 基因型 genotype S1基因 血清型 serotype 麻州 Mass 康州 Conn 阿肯色 Ark 台灣第七型",
    snippet: "IBV屬冠狀病毒科Group 3，S1基因分32基因型(台灣第七型)；血清型依中和反應分類，決定疫苗保護力。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "pathotype", sectionName: "病原型分類",
    keywords: "病原型 pathotype 親呼吸道型 respirotropic M41 Ark99 親腎型 nephrotropic 親輸卵管型 oviducttropic 親腺胃型 proventriculotropic QX-IBV 793B 胸肌壞死",
    snippet: "五種病原型：親呼吸道型、親腎型(多數台灣分離株)、親輸卵管型(致false layer)、親腺胃型(QX-IBV)、793B致胸肌壞死。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "clinical", sectionName: "臨床症狀",
    keywords: "IB臨床症狀 潛伏期 發病率 死亡率 氣管囉音 產蛋下降 軟殼蛋 cystic oviduct D388 QX-IBV",
    snippet: "潛伏期1-3天，發病率近100%但死亡率低；產蛋雞感染後產蛋下降可達50%，6-8週後回升但多數無法恢復正常。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "lesions", sectionName: "病理病變",
    keywords: "IB病變 氣管纖毛脫落 氣囊混濁 支氣管肺炎 腎臟腫脹 尿酸鹽沉積 urate deposition 間質性腎炎 腺胃黏膜增厚 輸卵管永久傷害",
    snippet: "氣管纖毛脫落、腎臟尿酸鹽沉積與間質性腎炎、輸卵管病變依感染日齡決定是否永久損傷。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "epidemiology", sectionName: "傳播與台灣流行病學",
    keywords: "IB傳播 空氣傳播 排毒 台灣IB TW-I TW-II 1958 1964 屠宰場監測 基因重組",
    snippet: "傳播力強(R=19.95)、排毒可達數月；台灣1958首例、1964分離病毒，本土株分TW-I/TW-II兩型，持續有重組株出現。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "diagnosis", sectionName: "診斷",
    keywords: "IB診斷 RT-PCR 病毒分離 SPF雞胚 allantoic cavity 尿囊腔 胚胎矮小化 dwarfing curling IFA IHC ELISA HI VN",
    snippet: "病毒分離接種9-11日齡SPF雞胚尿囊腔，陽性見胚胎矮小化捲曲；抗體偵測ELISA/IFA/HI/VN具血清型特異性。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "vaccine", sectionName: "疫苗與免疫計畫",
    keywords: "IB疫苗 活毒疫苗 H120 死毒疫苗 肉雞接種計畫 蛋雞接種計畫 種雞接種計畫 交叉保護 多型別輪替 圓桌會議",
    snippet: "肉雞與蛋雞/種雞接種計畫比較、活毒與死毒併用優缺點、交叉保護不佳須多型別輪替接種。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "control", sectionName: "疫苗品管與場內處置",
    keywords: "IB疫苗品管 EID50 力價試驗 安全試驗 場內處置 糖水 電解質 酸血症 消毒 福馬林 紫外線",
    snippet: "疫苗法定品管要點；場內支持性照護：保溫防擁擠、糖水降尿酸、徹底消毒同進同出，病毒對紫外線敏感。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 IB 傳染性支氣管炎",
    snippet: "九點IB總複習：病毒分類、病原型、臨床症狀死亡率對比、輸卵管年齡依賴損傷、腎病機轉、流行病學、診斷、疫苗策略、場內處置。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 3, weekTitle: "傳染性支氣管炎 (IB)",
    url: "大四上/禽病學/week03_傳染性支氣管炎.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 IB 傳染性支氣管炎 國考",
    snippet: "涵蓋病原學、病原型、臨床病理、流行病學、診斷、疫苗計畫等重點的練習題（共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 ND 新城病 APMV-1 病原型 F蛋白 ICPI 國考重點",
    snippet: "八個臨床與國考重點：甲類傳染病宿主範圍廣、單一血清型五病原型、F蛋白切位毒力機轉、WOAH判定標準、內臟型神經型病程、台灣三次大流行、免疫策略、人畜共通輕微。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "virology", sectionName: "病原學：病毒分類與病原型",
    keywords: "NDV APMV-1 Paramyxoviridae Avulavirus ssRNA HN蛋白 F蛋白 病原型 vvND nvND mesogenic lentogenic 內臟強毒型 神經強毒型 中間毒型 弱毒型",
    snippet: "NDV屬副黏液病毒科Avulavirus屬，單一血清型五種病原型：vvND、nvND、中間毒型、弱毒型、無病原性型。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "pathogenesis", sectionName: "致病機轉：F蛋白切位與毒力",
    keywords: "F0蛋白 F1 F2 cleavage site 鹼性胺基酸 trypsin furin 病毒血症 WOAH ICPI intracerebral pathogenicity index phenylalanine 117",
    snippet: "強毒株F0切位多鹼性胺基酸可被廣泛蛋白酶切開全身感染；弱毒株只能被trypsin切開侷限呼吸消化道；WOAH新城病判定標準。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "epidemiology", sectionName: "宿主、傳播與台灣流行病學",
    keywords: "ND宿主 250種鳥類 鴨感受性低 空氣傳染 介蛋傳染 垂直傳播 台灣ND 1968 1984 1994 大流行 甲類動物傳染病",
    snippet: "宿主範圍達250種以上鳥類，鴨感受性最低；台灣三次大流行(1968-69/1984-85/1994-95)具體死亡數字。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "clinical", sectionName: "臨床症狀與病理病變",
    keywords: "ND臨床症狀 潛伏期 綠色下痢便 扭頸 神經症狀 內臟型 神經型 腺胃出血 腸道潰瘍出血壞死 非化膿性腦膜腦炎 perivascular cuffing",
    snippet: "潛伏期5-6天，綠色下痢便；內臟型腸道出血猝死，神經型先呼吸症狀後扭頸；腺胃出血需與AI鑑別。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "diagnosis", sectionName: "診斷",
    keywords: "ND診斷 ICPI intracerebral pathogenicity index HI 血球凝集抑制試驗 VN ELISA IFA 血清學監測",
    snippet: "病原性鑑定用ICPI(≥0.7判定強毒)；血清學HI最常用，未疫苗地區主動監測、疫苗地區監測抗體。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "vaccine", sectionName: "疫苗與免疫計畫",
    keywords: "ND疫苗 B1 La Sota clone 30 點眼接種 噴霧接種 肉雞接種計畫 蛋雞種雞接種計畫 活毒死毒併用 載體疫苗 vector vaccine 疫苗接種後不良反應",
    snippet: "單一血清型使弱毒疫苗廣效保護；點眼接種優於噴霧；肉雞與蛋雞/種雞各三種接種計畫比較。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "zoonotic", sectionName: "人畜共通與公衛",
    keywords: "ND人畜共通 zoonotic 結膜炎 conjunctivitis 實驗室工作人員 屠宰場 疫苗施用者 HI抗體陰性",
    snippet: "人類感染輕微，多為職業暴露，通常僅3-4天結膜炎、1-2週痊癒，HI抗體通常陰性。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 ND 新城病",
    snippet: "八點ND總複習：病毒分類、F蛋白毒力機轉、WOAH定義、內臟型神經型對比、鑑別診斷、台灣流行史、疫苗策略、人畜共通。"
  },
  {
    subject: "禽病學", semester: "大四上", week: 2, weekTitle: "新城病 (ND)",
    url: "大四上/禽病學/week02_新城病.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 ND 新城病 國考",
    snippet: "涵蓋病原學、致病機轉、流行病學、臨床病理、診斷、疫苗計畫等重點的練習題（共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 超音波 ultrasonography 迴音強度 echogenicity 探頭 偽像 POCUS 心臟切面 都卜勒 肝膽 腸胃道 腎臟",
    snippet: "八個臨床與國考重點：迴音強度三分類、探頭頻率取捨、五種偽像、胸腔POCUS glide sign／B-line、心臟五切面與都卜勒、肝膽膽囊mucocele、腸道五層構造與腸套疊、腎臟膀胱病灶鑑別。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "basics", sectionName: "成像原理、探頭與都卜勒",
    keywords: "超音波原理 transducer 探頭 convex linear 凸陣 線陣 增益 gain setting 都卜勒效應 Doppler effect 脈衝波都卜勒 spectral Doppler 迴音強度 hyperechoic hypoechoic anechoic",
    snippet: "探頭頻率3-12MHz，聲波於不同聲阻抗界面產生回音；迴音強度分高迴音／低迴音／無迴音；都卜勒效應決定彩色血流紅藍判色。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "artifacts", sectionName: "常見偽像",
    keywords: "超音波偽像 artifact 聲影 acoustic shadowing 乾淨聲影 髒聲影 邊緣聲影 edge shadowing 後方回音增強 acoustic enhancement 多重反射 reverberation 鏡像偽像 mirror image",
    snippet: "五種常見偽像：聲影（乾淨／髒）、邊緣聲影、後方回音增強、多重反射、鏡像偽像，各自對應特定成因與影像特徵。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "thorax", sectionName: "胸腔超音波（POCUS）",
    keywords: "胸腔超音波 POCUS chest tube site pericardial site diaphragmatico-hepatic gator sign glide sign A-line B-line lung rocket 肺葉扭轉 氣胸 pneumothorax step sign 肋膜積液",
    snippet: "三個標準部位CTS／PCS／DH；glide sign＋A-line＝正常乾肺，B-line＝肺水腫或挫傷，A-line無glide sign＝氣胸，step sign為胸壁肋膜病變。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "echoviews", sectionName: "心臟超音波：方位與五種標準切面",
    keywords: "心臟超音波 echocardiography 右胸骨旁長軸 短軸 右心尖 左心尖 左胸骨旁 劍突下 subcostal M-mode motion mode 乳突肌 mushroom view RVID IVS LVID LVPW LVIDd LVIDs FS 短軸縮短率 fractional shortening DCM HCM",
    snippet: "五種標準切面：右胸骨旁長軸／短軸、左心尖、左胸骨旁、劍突下；M-mode於乳突肌層級取樣線需置於兩乳突肌中間，找5個交界點測RVID/IVS/LVID/LVPW，計算FS%評估收縮功能。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "dopplerdisease", sectionName: "都卜勒心臟超音波與常見心臟病",
    keywords: "PWD CWD 脈衝波都卜勒 連續波都卜勒 velocity 流速判讀 CDVD 慢性退化性瓣膜病 二尖瓣逆流 mitral regurgitation DCM 擴張型心肌病 HCM 肥厚型心肌病 心絲蟲 heartworm 心包積液 pericardial effusion tamponade",
    snippet: "PWD精確定點有流速上限，CWD無上限但無法定位；CDVD二尖瓣逆流、DCM心室擴張、HCM心室壁增厚、心絲蟲右心線狀構造、心包填塞為急症。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "liverbiliary", sectionName: "肝臟與膽道系統、脾臟",
    keywords: "肝臟六葉 caudate right lateral right medial quadrate left lateral left medial 膽囊 gallbladder teardrop 膽泥 sludge 膽囊黏液囊腫 mucocele kiwifruit stellate 脾臟 spleen",
    snippet: "肝臟分六葉；膽囊呈無迴音淚滴狀，壁厚小於1mm；膽囊黏液囊腫呈奇異果樣或星狀圖案，是需緊急評估手術的重要所見。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "gi", sectionName: "腸胃道",
    keywords: "腸胃道超音波 腸壁五層構造 mucosa submucosa muscularis serosa 腸壁厚度 腸套疊 intussusception target sign 靶樣徵象 異物 foreign body 黏膜迴音增強 蛋白質流失性腸病",
    snippet: "正常腸壁五層交替高低迴音；腸套疊橫切面呈靶樣徵象；常見異物包含玩具球、橡皮筋、線狀異物，各有不同聲影特徵。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "renal", sectionName: "胰臟、腎臟、膀胱與腎上腺",
    keywords: "胰臟 pancreas 腎臟 kidney 皮質 髓質 慢性腎病 CKD 多囊腎 polycystic kidney 阻塞性水腎 hydronephrosis 輸尿管擴張 hydroureter 膀胱 bladder 膀胱炎 cystitis 移形上皮癌 TCC 腎上腺 adrenal gland",
    snippet: "慢性腎病皮髓質分界模糊、皮質迴音增強；多囊腎多發無迴音囊泡；TCC好發膀胱三角區，呈向腔內突出的不規則腫塊。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 超音波 國考",
    snippet: "八點超音波總複習：迴音強度與探頭選擇、五種偽像、胸腔POCUS判讀邏輯、心臟五切面與都卜勒工具組、常見心臟病影像、肝膽膽囊病灶、腸道構造與腸套疊、腎臟膀胱病灶鑑別。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 2, weekTitle: "超音波診斷入門",
    url: "大四上/獸醫臨床及影像診斷學/week02_超音波診斷入門.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 超音波 國考",
    snippet: "涵蓋成像原理、偽像、胸腔心臟腹腔超音波各章節重點的練習題（共16題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 GI pharmacology 腸胃道用藥 胃酸 消化性潰瘍 促腸蠕動 止吐 止瀉 IBD 食慾促進",
    snippet: "八個臨床與國考重點：PPI/H2blocker/Antacids抑酸效力排序、Famotidine與Cimetidine反比關係、Misoprostol NSAID潰瘍預防首選、促腸蠕動藥受體邏輯、止吐藥四條路徑選藥、犬貓催吐物種差異、Opioid止瀉禁忌、NSAID雙重潰瘍機轉。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "acid", sectionName: "胃酸分泌與消化性潰瘍用藥",
    keywords: "H2 blocker Cimetidine Ranitidine Famotidine Nizatidine PPI Omeprazole 質子幫浦抑制劑 Misoprostol PGE1 Sucralfate 硫糖鋁 Bismuth subsalicylate H.pylori 三聯療法 四聯療法 制酸劑 Antacid 抗膽鹼 Darbazine",
    snippet: "H2 blocker效力排序Famotidine>Nizatidine>Ranitidine>Cimetidine；PPI不可逆結合H+/K+-ATPase；Misoprostol為NSAID潰瘍預防首選；H.pylori三聯/四聯療法根除率。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "nsaidgastric", sectionName: "NSAID 誘發胃黏膜損傷機轉",
    keywords: "NSAID 胃潰瘍 COX PGE1 PGE2 黏膜保護 前列腺素 gastric erosion",
    snippet: "NSAID抑制COX使PGE↓，喪失黏液分泌/HCO3分泌/黏膜血流/抑酸四項保護，雙重機制（全身性+局部）解釋為何注射劑型仍有潰瘍風險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "laxatives", sectionName: "瀉劑與緩瀉劑",
    keywords: "瀉劑 laxative cathartic Mineral oil Psyllium Lactulose Castor oil 蓖麻油 Bisacodyl Anthraquinones 蒽醌 滲透性 刺激性 潤滑性 膨脹性",
    snippet: "四類瀉劑：潤滑（Mineral oil）、膨脹（Psyllium）、滲透（Lactulose，脫水動物禁用）、刺激（Castor oil、Anthraquinones，長期用致腸肌叢退化）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "prokinetics", sectionName: "促腸蠕動藥",
    keywords: "促腸蠕動 prokinetic Metoclopramide Domperidone Cisapride Erythromycin motilin Bethanechol D2 5-HT4 EPS 錐體外症狀",
    snippet: "Metoclopramide（穿BBB→EPS）vs Domperidone（不穿→無EPS）；Cisapride為5-HT4主要機制；Erythromycin低劑量作為motilin agonist。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "antidiarrheal", sectionName: "止瀉藥",
    keywords: "止瀉藥 Opioid Diphenoxylate Loperamide Imodium Lomotil Kaolin-pectin Bismuth subsalicylate 感染性腹瀉禁用",
    snippet: "Opioid為最有效止瀉藥但感染性腹瀉禁用；Loperamide不穿BBB為OTC，Diphenoxylate穿BBB為處方藥；Lomotil含atropine降低濫用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "antiemetics", sectionName: "嘔吐路徑與止吐藥",
    keywords: "嘔吐 emesis CTZ vestibular NST Maropitant Cerenia NK1 Ondansetron 5-HT3 化療嘔吐 Substance P antiemetic",
    snippet: "嘔吐四條路徑：前庭(M/H1)、CTZ、NST、emetic center(NK1)；Maropitant廣效止吐；Ondansetron化療誘發嘔吐最有效。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "emetics", sectionName: "催吐藥",
    keywords: "催吐藥 emetic Apomorphine Xylazine 犬催吐 貓催吐 D2 alpha2 CTZ",
    snippet: "Apomorphine（D2 agonist）犬首選催吐劑，不可重複給藥；Xylazine（α2 agonist）貓首選催吐劑。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "ibd", sectionName: "IBD 用藥",
    keywords: "IBD 發炎性腸病 Sulfasalazine 5-ASA Olsalazine Metronidazole Tylosin Azathioprine Prednisolone",
    snippet: "Sulfasalazine經腸道菌分解為Sulfapyridine+5-ASA抗炎；Olsalazine無磺胺基毒性較低；貓需監測水楊酸毒性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "appetite", sectionName: "食慾促進劑與抗肥胖藥",
    keywords: "食慾促進 Mirtazapine Cyproheptadine Diazepam 抗肥胖 Dirlotapide Slentrol MTP 消脹氣 Poloxalene",
    snippet: "Mirtazapine為貓食慾促進+止吐首選；Dirlotapide（Slentrol）為第一個FDA核准犬用抗肥胖藥，抑制MTP。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 GI 腸胃道 國考",
    snippet: "八點腸胃道用藥總複習：抑酸效力排序、H2blocker比較、Misoprostol禁忌、H.pylori治療、促腸蠕動受體差異、止吐藥選擇、催吐物種差異、IBD與食慾促進藥物。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腸胃道用藥",
    url: "大三/獸醫藥理學/腸胃道用藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 GI 腸胃道 國考",
    snippet: "涵蓋胃酸抑制、瀉劑、促腸蠕動、止吐、催吐、止瀉、IBD、食慾促進的練習題（共11題，含2題臨床情境整合題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥品索引",
    url: "大三/獸醫藥理學/藥品索引.html",
    section: "index", sectionName: "藥品索引",
    keywords: "藥品索引 drug index 查藥 藥名 藥理學 全站藥品",
    snippet: "全站藥品依英文學名字母排序索引，可依英文/中文/商品名篩選查找，每個藥品連結至對應主題頁段落。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 藥理學總論 general pharmacology CYP450 受體 ADME 生體可用率 半衰期",
    snippet: "六個貫穿全科的基礎重點：CYP450抑制誘導、四大受體家族、生體可用率F值計算、一級動力學半衰期公式、血漿蛋白結合、給藥途徑起效速度。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "cyp450", sectionName: "CYP450 藥物代謝系統",
    keywords: "CYP450 P450 cytochrome 藥物代謝 Phase I Phase II biotransformation glucuronidation 誘導 抑制 induction inhibition prodrug 前藥",
    snippet: "CYP450是肝臟主要藥物代謝酵素家族；Phase I氧化還原水解使藥物失活，Phase II結合反應增加水溶性利排除；抑制CYP450使其他藥物濃度上升，誘導則使濃度下降。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "receptors", sectionName: "受體分類與訊息傳遞總論",
    keywords: "受體分類 GPCR 離子通道 核內受體 酵素活性受體 receptor classification 反應速度",
    snippet: "四大受體家族：配體閘門離子通道（最快）、GPCR、本質酵素活性受體、核內受體（最慢最持久），反應速度與受體種類高度相關。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "pkbasics", sectionName: "ADME 與藥動學基礎公式",
    keywords: "ADME 生體可用率 bioavailability AUC 一級動力學 first-order kinetics 半衰期 half-life Ke 血漿蛋白結合 計算題",
    snippet: "F=(AUC)口服÷(AUC)靜脈，IV定義F=100%；一級動力學Cp=Cp0e^-Ket，t½=0.693/Ke，半衰期與起始濃度無關，含計算範例。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "routes", sectionName: "給藥途徑與劑型基礎",
    keywords: "給藥途徑 route of administration ROA 腸道 enteral 腸道外 parenteral 劑型 dosage form 賦形劑 excipients",
    snippet: "給藥途徑分腸道（口服等，起效較慢）與腸道外（IV/IM/SC，起效快）；起效速度由途徑決定，作用時間可由劑型設計獨立延長。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 藥理學總論 國考",
    snippet: "六點總複習：CYP450代謝兩階段、誘導抑制方向、四大受體速度排序、F值公式、一級動力學計算、蛋白結合交互作用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "藥理學總論",
    url: "大三/獸醫藥理學/藥理學總論.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 計算題 quiz 自我測驗 藥理學總論 國考",
    snippet: "涵蓋CYP450、受體分類、生體可用率、一級動力學計算的練習題（共5題，含1題完整計算題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 NSAID 非類固醇消炎藥 COX 花生四烯酸 前列腺素 消炎止痛",
    snippet: "八個臨床與國考重點：COX-1/COX-2功能區分、Coxibs心血管風險、Aspirin不可逆抑制機轉、Acetaminophen貓禁用、物種T½差異、術前7天停藥、物種特化用藥。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "inflammation", sectionName: "發炎反應與花生四烯酸代謝",
    keywords: "花生四烯酸 arachidonic acid COX LOX pathway PGE2 PGF2a LTB4 LTC4 SRS-A 發炎介質 histamine bradykinin",
    snippet: "花生四烯酸經COX路徑（PGs/TXA2/PGI2）與LOX路徑（LTB4趨化、LTC4/D4/E4=SRS-A支氣管收縮1000倍histamine）代謝。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "cox", sectionName: "COX 亞型與前列腺素生理作用",
    keywords: "COX-1 COX-2 COX-3 構成型 誘導型 前列腺素生理作用 PGI2 TXA2 EP3 IP TP receptor",
    snippet: "COX-1構成型維持胃黏膜/腎/血小板生理功能，COX-2誘導型介導發炎；PGI2內皮抗血栓vs TXA2血小板促血栓動態平衡。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "mechanism", sectionName: "NSAID 藥理效果與機制",
    keywords: "退燒 antipyretic 止痛 analgesic 抗血小板 antiplatelet hyperalgesia 致敏 傷害性感受器",
    snippet: "退燒：抑制下視丘PGE2；止痛：降低nociceptor致敏；抗血小板：低劑量Aspirin選擇性抑制血小板TXA2。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "classification", sectionName: "NSAID 分類",
    keywords: "NSAID分類 Salicylate Propionic acid Oxicam Pyrazolone Fenamate Coxib 化學結構分類",
    snippet: "依化學結構分類：Salicylate（Aspirin）、Propionic acid（Ibuprofen/Carprofen）、Oxicam（Meloxicam）、Coxibs選擇性COX-2。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "keydrugs", sectionName: "個別藥物詳述",
    keywords: "Aspirin Acetaminophen Phenylbutazone Flunixin Dipyrone Ketoprofen Meloxicam Naproxen Diclofenac Tepoxalin NAPQI 貓禁用 禿鷹",
    snippet: "Aspirin不可逆乙醯化COX；Acetaminophen貓絕對禁用（NAPQI毒性）；Phenylbutazone馬最常用；Flunixin馬腸絞痛首選；Diclofenac禿鷹生態事件。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "coxibs", sectionName: "COX-2 選擇性藥物（Coxibs）",
    keywords: "Coxibs Carprofen Firocoxib Robenacoxib Deracoxib Meloxicam Rofecoxib Vioxx 心血管風險 CVS toxicity",
    snippet: "COX-2選擇性藥物降低GI副作用但增加心血管血栓風險；Rofecoxib因VIGOR試驗心肌梗塞風險增4倍而下市；獸醫Coxibs比較表。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "toxicity", sectionName: "副作用與毒性",
    keywords: "NSAID副作用 GI毒性 腎毒性 抗凝血 肝毒性 骨髓抑制 salicylate酸鹼失衡 呼吸性鹼中毒",
    snippet: "六大副作用系統：GI（最常見）、腎毒性、抗凝血（術前7天停藥）、肝毒性、骨髓抑制、Salicylate酸鹼失衡（治療量鹼中毒/毒性量酸中毒）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "pk", sectionName: "藥物動力學與物種差異",
    keywords: "NSAID半衰期 物種T½差異 貓 犬 馬 蛋白結合 protein binding warfarin交互作用",
    snippet: "物種T½差異極大：貓Salicylate 22-45h（需q48h）、Meloxicam貓37h vs犬12-36h；NSAID高蛋白結合競爭甲狀腺素/warfarin。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "contraindications", sectionName: "禁忌症與 FDA 核准概覽",
    keywords: "NSAID禁忌症 消化性潰瘍 FDA核准 獸醫NSAID一覽表",
    snippet: "消化性潰瘍禁用、warfarin併用出血風險、術前7天停藥、貓用藥困難；FDA核准獸醫NSAID完整清單。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 NSAID 國考",
    snippet: "八點NSAID總複習：致敏PG三種、Aspirin機轉、Acetaminophen貓禁用、Phenylbutazone物種差異、Coxibs心血管風險、貓犬用藥選擇。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "NSAID 非類固醇消炎藥",
    url: "大三/獸醫藥理學/NSAID非類固醇消炎藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 NSAID 國考",
    snippet: "涵蓋COX機轉、個別藥物、Coxibs、毒性、物種藥動學的練習題（共8題，含2題臨床情境整合題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 Beta-Lactam 抗生素 penicillin cephalosporin PBP MRSA",
    snippet: "八個臨床與國考重點：青黴素結構5位點、五分類邏輯、MRSA的PBP2a機制、Procaine物種與情境禁忌、頭孢五代規律、Ceftiofur/Cefovecin、Carbapenem的Cilastatin機轉、Aztreonam。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "penchem", sectionName: "化學結構與作用機轉",
    keywords: "β-lactam環 thiazolidone PBP transpeptidase 6-APA amidase 細胞壁合成",
    snippet: "青黴素結構5位點（thiazolidone環/β-lactam環/酶作用位/amidase切割位→6-APA/羧基）；抑制transpeptidase阻斷細胞壁合成最後一步，殺菌性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "penuses", sectionName: "獸醫治療用途五分類",
    keywords: "天然青黴素 耐酶 廣譜 Aminopenicillin Piperacillin Carboxypenicillin Hetacillin Potentiated 長效 Procaine Benzathine",
    snippet: "青黴素五分類：天然、耐酶、廣譜（Aminopenicillins/Piperacillin/Carboxypenicillins/Hetacillin）、Potentiated（+β-lactamase抑制劑）、長效（Procaine 24h/Benzathine 48-72h）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "penpk", sectionName: "給藥、抗藥性、藥動學與不良反應",
    keywords: "耐酸口服 MRSA PBP2a penicilloic acid 抗原決定基 Procaine毒性 母豬流產 賽馬 高鉀血症",
    snippet: "MRSA機轉為PBP2a；90%以上經腎排泄，殘餘形成penicilloic acid（過敏抗原）；Procaine禁忌鳥/蛇/龜/天竺鼠/絨鼠、賽馬賽前30天、母豬流產；K⁺鹽致高鉀血症與馬腹瀉。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "cephgen", sectionName: "化學結構與五代分類",
    keywords: "頭孢菌素 7-ACA 五代比較 Ceftiofur Cefovecin Cefquinome 獸醫專用",
    snippet: "頭孢菌素五代表（G+/G-/酶穩定性）；1-2代基礎、3代Ceftiofur（不宜Staph）與Cefovecin（7天長效）為獸醫要角、4-5代人醫專用（僅Cefquinome供動物）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "cephpk", sectionName: "給藥、藥動學與不良反應",
    keywords: "Cephalothin Cephapirin UTI t半 爬蟲類 Ceftazidime 血液學效應 骨髓抑制",
    snippet: "Cephalothin不可治UTI、Cephapirin可；多數t½1-2h，Cefixime犬7h、Ceftiofur牛IM 8-12h；爬蟲類拉長間隔；長期高劑量致貧血與骨髓抑制。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "carbapenems", sectionName: "Carbapenems",
    keywords: "Carbapenem Imipenem Cilastatin Meropenem Ertapenem DHP dehydropeptidase 腹膜炎 ESBL Carbapenemase",
    snippet: "抗菌譜最廣，用於腹膜炎等極嚴重感染；Imipenem經腎DHP代謝為腎毒性代謝物需併用Cilastatin；Meropenem/Ertapenem對DHP穩定；Ertapenem對Pseudomonas無效。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "monobactams", sectionName: "Monobactams",
    keywords: "Aztreonam Monobactam G(-) 無交叉過敏 取代Aminoglycoside",
    snippet: "Aztreonam僅對G(-)需氧菌有效、對多數β-lactamase有抵抗性，與Penicillin/Cephalosporin無交叉過敏；人醫用於取代毒性較高的Aminoglycoside併用情境。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 Beta-Lactam 國考",
    snippet: "依講義順序的Beta-Lactam總複習：結構5位點、五分類、Procaine禁忌、頭孢五代、PK特例、Carbapenem機轉、Monobactam、MRSA。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Beta-Lactam 類抗生素",
    url: "大三/獸醫藥理學/Beta-Lactam類抗生素.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 Beta-Lactam 國考",
    snippet: "涵蓋6-APA、頭孢4/5代定位、Imipenem-Cilastatin機轉的練習題（共4題，含1題臨床情境整合題：賽馬與母豬Procaine禁忌），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 Aminoglycoside Tetracycline Phenicol Macrolide 胺基配醣體 四環黴素 氯黴素 巨環內酯 30S 50S核糖體",
    snippet: "九個臨床與國考重點：AG不可逆殺菌vs TC可逆靜菌、無細胞壁病原邏輯、L-form膿瘍、貢丸氯黴素事件、Florfenicol結構修飾、Macrolide結合位重疊、MLSB、Tilmicosin心毒性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "agmech", sectionName: "AG化學、機轉與活性影響因素",
    keywords: "AG結構 30S核糖體 不可逆結合 concentration-dependent PAE 厭氧菌無效 pH 陽離子",
    snippet: "AG不可逆結合30S核糖體，殺菌、濃度依賴、有PAE；穿透需氧依賴能量步驟，厭氧菌天生抵抗；pH/細胞碎片/氧氣/陽離子影響活性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "agclinical", sectionName: "AG治療用途、給藥與藥動學",
    keywords: "Gentamicin Amikacin Tobramycin Neomycin Streptomycin Apramycin Pulse therapy 關節腔注射 區域肢體灌注",
    snippet: "Gentamicin/Amikacin廣譜含Pseudomonas；Neomycin不可全身給藥；Pulse therapy SID降低毒性；關節腔注射與區域肢體灌注治馬感染。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "agtox", sectionName: "AG三大不良反應",
    keywords: "耳毒性 腎毒性 神經肌肉阻斷 ototoxicity nephrotoxicity GGT Calcium gluconate 鼓膜",
    snippet: "AG三大毒性：耳毒性（鼓膜完整性）、腎毒性（GGT:Cr比值監測、SID降低風險）、神經肌肉阻斷（Calcium gluconate治療）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "tcmech", sectionName: "TC化學結構與作用機轉",
    keywords: "Tetracycline 兩性 螯合陽離子 30S可逆結合 bacteriostatic",
    snippet: "TC剛性多環結構，兩性、螯合陽離子累積於骨骼牙齒；可逆結合30S核糖體，靜菌性廣譜，攝取需氧故對厭氧菌穿透差。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "tcclinical", sectionName: "TC獸醫治療用途",
    keywords: "無細胞壁病原 Mycoplasma Doxycycline 蜱媒 Wolbachia心絲蟲 L-form膿瘍 馬駒攣縮肌腱 歐羅肥",
    snippet: "TC對無細胞壁病原（Mycoplasma、L-form）有效，β-lactam則無效；Doxycycline蜱媒感染首選、犬心絲蟲輔助；OTC治馬駒攣縮肌腱；台灣歐羅肥＝Chlortetracycline。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "tcpk", sectionName: "TC藥動學、抗藥性與不良反應",
    keywords: "金屬離子螯合 Doxycycline腸道排泄 UTI不適用 馬匹禁忌 牙齒染色 外流泵",
    snippet: "TC與Ca/Mg/Fe/Al螯合降低吸收；Doxycycline 75%腸道排泄不適合UTI；馬匹口服/注射TC禁忌；幼齡動物牙齒染色（Doxy/Mino較少見）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "phenicol", sectionName: "Phenicols化學、機轉、用途與不良反應",
    keywords: "Chloramphenicol Florfenicol Thiamphenicol 50S核糖體 貢丸 再生不良性貧血 台灣禁用",
    snippet: "結合50S抑制胜肽鍵形成；Chloramphenicol台灣禁用食品動物（2012貢丸氯黴素事件）；Florfenicol氟取代-NO2消除再生不良性貧血風險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "macromech", sectionName: "Macrolides化學、機轉與抗藥性",
    keywords: "Macrolide 50S核糖體 可逆結合 MLSB 結合位重疊 Lincosamide Streptogramin",
    snippet: "Macrolide可逆結合50S，靜菌；與Phenicol/Streptogramin/Lincosamide結合位重疊不可併用；抗藥性主因核糖體甲基化，葡萄球菌MLSB交叉抗藥。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "macroclinical", sectionName: "Macrolides個別藥物治療用途",
    keywords: "Erythromycin Azithromycin Clarithromycin Tylosin Tilmicosin Tulathromycin 馬駒Rhodococcus equi",
    snippet: "馬駒Rhodococcus equi肺炎用Erythromycin/Azithromycin/Clarithromycin+Rifampin；Tylosin牛羊豬Mycoplasma與犬貓IBD；Tilmicosin牛呼吸道疾病。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "macropk", sectionName: "Macrolides給藥、藥動學與不良反應",
    keywords: "呼吸道分泌物濃縮 白血球 肺組織 Tilmicosin心臟毒性 反芻動物腹瀉 馬腹瀉",
    snippet: "Macrolide濃縮於呼吸道分泌物/乳汁/白血球；Tilmicosin對牛以外物種心臟毒性；成年反芻動物口服Erythromycin、成年馬Tylosin可致嚴重腹瀉。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 AG TC Phenicol Macrolide 國考",
    snippet: "依講義順序總複習：AG三大毒性、TC無細胞壁邏輯、Doxycycline特例、Phenicol貢丸事件與Florfenicol修飾、Macrolide結合位重疊、馬駒Rhodococcus。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "胺基配醣體、四環黴素、氯黴素與巨環內酯類",
    url: "大三/獸醫藥理學/胺基配醣體四環黴素與氯黴素類.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 AG TC Phenicol Macrolide 國考",
    snippet: "涵蓋L-form膿瘍機轉、Florfenicol結構修飾、Macrolide結合位重疊、Tilmicosin誤用的練習題（共4題，含1題臨床情境整合題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 磺胺 喹諾酮 Sulfonamide Fluoroquinolone TMP DNA gyrase 視網膜退化",
    snippet: "八個臨床與國考重點：磺胺假冒PABA機轉、膿瘍與立克次體禁忌、犬不乙醯化、TMP前列腺離子陷阱、FQ抑制DNA gyrase、Enrofloxacin小型哺乳類安全性、MPC、貓視網膜退化。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfahistory", sectionName: "歷史與相關化合物",
    keywords: "Prontosil Sulfanilamide Domagk 諾貝爾獎 Glipizide Thiazides Celecoxib",
    snippet: "1906年合成Sulfanilamide；Prontosil經動物實驗證實有效，Domagk獲1939年諾貝爾獎；磺胺結構也見於Glipizide、利尿劑、Celecoxib等非抗菌藥。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfamech", sectionName: "作用機轉與侷限性",
    keywords: "PABA dihydropteroate synthase 葉酸合成 膿性環境 厭氧菌 Enterococcus 靜止期細菌",
    snippet: "磺胺藥競爭性抑制dihydropteroate synthase阻斷葉酸合成；哺乳細胞與利用預成型葉酸的細菌不受影響；膿性環境與厭氧感染效果較差。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfachem", sectionName: "化學結構與特性",
    keywords: "p-amino group 弱酸 獨立溶解度定律 Triple-sulfa 結晶尿",
    snippet: "#4位p-amino group須游離；弱酸低水溶性；獨立溶解度定律是Triple-sulfa複方設計原理，降低結晶尿風險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfauses", sectionName: "治療用途十二分類",
    keywords: "Sulfamethazine Sulfadimethoxine Sulfamethoxazole Sulfasalazine Sulfaguanidine 長效 快速排泄 腸道型 外用型 球蟲病",
    snippet: "磺胺藥十二分類：長效（牛羊豬）、快速排泄/眼用（UTI）、腸道型（IBD）、外用（燒傷）、球蟲病/弓蟲症。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "potentiated", sectionName: "Potentiated Sulfonamides",
    keywords: "Trimethoprim Ormetoprim 序列雙重阻斷 離子陷阱 犬前列腺炎",
    snippet: "TMP/Ormetoprim抑制DHFR與磺胺藥序列雙重阻斷達殺菌效果；TMP有機鹼於酸性前列腺液離子陷阱濃縮，是犬前列腺炎首選。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfaresist", sectionName: "抗藥性機制",
    keywords: "交叉抗藥 PABA生產 外流泵 Enterococcus外源性葉酸 potentiated抗藥性較少",
    snippet: "對一種磺胺抗藥即對所有磺胺抗藥；Enterococcus體外敏感體內無效因利用外源性葉酸；Potentiated抗藥性較單用少見。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfapk", sectionName: "藥動學",
    keywords: "犬不乙醯化 acetylation glucuronide oxidation quinone代謝物 Vd T大於S 乳汁",
    snippet: "犬不進行N4乙醯化，改走氧化路徑產生quinone代謝物；TMP的Vd大於磺胺藥（離子陷阱）；磺胺藥乳汁濃度低不利治療。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "sulfaadverse", sectionName: "不良反應與禁忌症",
    keywords: "結晶尿 KCS Doberman關節炎 延遲過敏 立克次體禁忌 精子數減少 假性甲低",
    snippet: "七大不良反應：結晶尿、KCS、凝血異常、Doberman關節炎/延遲過敏、精子數減少、TMP致假性甲低；禁忌症含膿瘍與立克次體感染。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "fqchem", sectionName: "化學、機轉與抗菌譜",
    keywords: "N7-piperazine DNA gyrase Novobiocin Nalidixic acid Pseudomonas Staphylococci Pradofloxacin",
    snippet: "N7-piperazine增加抗Pseudomonas活性；抑制DNA gyrase殺菌濃度依賴；G(-)活性佳、G(+)較弱；第三代Pradofloxacin對G(+)厭氧菌增強。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "fquses", sectionName: "獸醫治療用途",
    keywords: "Enrofloxacin 小型哺乳類 Clostridium腸炎 爬蟲類 Danofloxacin Difloxacin",
    snippet: "Enrofloxacin不覆蓋厭氧菌，不誘發小型哺乳類Clostridium腸炎；Danofloxacin牛呼吸道不得用於乳牛；爬蟲類消除慢需拉長間隔。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "fqpk", sectionName: "給藥與藥動學",
    keywords: "AUC/MIC 濃度依賴 半衰期 爬蟲類36-55小時 抗生素後效應",
    snippet: "FQ屬AUC/MIC依賴型；犬口服吸收快；爬蟲類t½極長（蜥蜴36h、短吻鱷55h）；對G(+)有抗生素後效應。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "fqresist", sectionName: "抗藥性與MPC概念",
    keywords: "gyrA parC突變 Campylobacter jejuni 家禽禁用 Mutant Prevention Concentration MPC 次治療劑量",
    snippet: "gyrA/parC基因突變致抗藥；Campylobacter抗藥性致美國禁FQ用於家禽；MPC=8-10倍MIC，次治療劑量最危險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "fqadverse", sectionName: "不良反應",
    keywords: "貓視網膜退化 Orbifloxacin Marbofloxacin Pradofloxacin 軟骨侵蝕 肌腱斷裂 phenobarbital癲癇",
    snippet: "貓急性不可逆視網膜退化，Orbi/Marbo毒性最低、Prado無毒性；幼齡動物軟骨侵蝕可逆；Enrofloxacin可能誘發服用phenobarbital犬的癲癇發作。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 磺胺 喹諾酮 國考",
    snippet: "依講義順序總複習：磺胺機轉與禁忌、犬乙醯化缺陷、TMP離子陷阱、FQ機轉、Enrofloxacin小型哺乳類安全性、MPC、貓視網膜退化。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "磺胺與喹諾酮類",
    url: "大三/獸醫藥理學/磺胺與喹諾酮類.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 磺胺 喹諾酮 國考",
    snippet: "涵蓋Enrofloxacin小型哺乳類安全性、立克次體禁忌、MPC概念的練習題（共4題，含1題臨床情境整合題：貓Enrofloxacin視網膜風險），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 Lincosamide Vancomycin Ionophore MLSB MIC breakpoint 選藥原則 抗藥性機制",
    snippet: "九個臨床與國考重點：Lincosamide禁忌與MLSB、Vancomycin/Tylosin抗藥基因連鎖、Ionophore馬毒性、粒線體毒性統整、Time/Concentration-dependent killing、選藥八問、MRSA演化史。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "lincomech", sectionName: "Lincosamides化學、機轉與抗菌譜",
    keywords: "Lincomycin Clindamycin Pirlimycin 50S核糖體 MLSB 厭氧菌",
    snippet: "結合50S核糖體，與Phenicol/Streptogramin/Macrolide共用結合位；對G(+)需氧菌與專性厭氧菌有效，G(-)天生抵抗。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "lincouses", sectionName: "Lincosamides治療用途、給藥與藥動學",
    keywords: "豬痢疾 牛乳腺炎 MRSA軟組織 Toxoplasmosis Neosporosis 骨骼穿透 乳汁殘留",
    snippet: "Lincomycin豬痢疾；Pirlimycin牛乳腺炎乳管灌注；Clindamycin MRSA軟組織/犬貓Toxoplasmosis；骨骼軟組織穿透優異，酸性組織累積致乳汁殘留。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "lincoresist", sectionName: "Lincosamides抗藥性與不良反應",
    keywords: "MLSB交叉抗藥 轉譯後甲基化 馬兔倉鼠天竺鼠 C. difficile Metronidazole併用",
    snippet: "50S核糖體轉譯後甲基化致MLSB交叉抗藥；禁用馬兔倉鼠天竺鼠（C. difficile致命腸炎）；Metronidazole常與Clindamycin併用預防偽膜性腸炎。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "spectinometro", sectionName: "Spectinomycin與Metronidazole",
    keywords: "Spectinomycin aminocyclitol Metronidazole nitroimidazole Giardia Trichomoniasis 神經毒性",
    snippet: "Spectinomycin結合30S但靜菌無顯著毒性；Metronidazole被厭氧菌/原蟲還原為細胞毒性代謝物，高劑量致眼震/共濟失調/癲癇。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "rifampin", sectionName: "Rifampin",
    keywords: "Rifampin RNA polymerase 馬駒Rhodococcus equi 紅橙色尿 肝酵素誘導",
    snippet: "抑制DNA-dependent RNA polymerase；馬駒Rhodococcus equi肺炎標準合併治療（+Erythromycin）；誘導肝微粒體酵素；無害紅橙色尿。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "tiamulin", sectionName: "Tiamulin",
    keywords: "Tiamulin 豬 Haemophilus 痢疾 Valnemulin",
    snippet: "結合50S核糖體機轉類似Macrolides；豬Haemophilus肺炎與痢疾；豬群過度擁擠可能致皮膚炎。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "vancomycin", sectionName: "Vancomycin",
    keywords: "Vancomycin D-Ala-D-Ala MRSA Tylosin抗藥基因連鎖 Avoparcin 食品動物禁用",
    snippet: "結合peptidoglycan前驅物D-Ala-D-Ala非PBP機轉，MRSA仍有效；Tylosin抗藥基因與Vancomycin抗藥基因同一質體；儲備抗生素，食品動物禁用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "bacpoly", sectionName: "Bacitracin與Polymyxins",
    keywords: "Bacitracin 細胞壁合成第二步 Polymyxin B Colistin 三聯抗生素軟膏 馬內毒素血症",
    snippet: "Bacitracin抑制細胞壁合成第二步，三聯軟膏成分；Polymyxin B/Colistin陽離子多胜肽破壞G(-)外膜，馬緩慢IV治內毒素血症。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "nitronovo", sectionName: "Nitrofurans與Novobiocin",
    keywords: "Nitrofurantoin UTI酸性尿液 致癌 Novobiocin DNA gyrase ATP Tetracycline協同",
    snippet: "Nitrofurantoin犬貓UTI酸性尿液效果最佳，食品動物禁用（致癌）；Novobiocin阻斷ATP與DNA gyrase結合，與Tetracycline協同治犬感染。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "streptoiono", sectionName: "Streptogramins與Ionophores",
    keywords: "Synercid Virginiamycin VISA VRSA Monensin 離子載體 馬匹中毒 粒線體毒性",
    snippet: "Synercid（Dalfopristin+Quinupristin）治VRE/MRSA；Virginiamycin用途與Synercid抗藥性關聯；Monensin馬匹最易中毒，粒線體毒性統整AG/CAP/FQ機轉。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "selectbasics", sectionName: "抗菌譜、MIC與殺菌動力學",
    keywords: "體質性抗藥性 MIC breakpoint Time-dependent Concentration-dependent Peak/MIC AUC/MIC",
    snippet: "MIC≤breakpoint為敏感；Time-dependent killing（β-lactam/Clindamycin/Vancomycin）vs Concentration-dependent（FQ/AG，Peak/MIC、AUC/MIC）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "selectquestions", sectionName: "選藥八問與其他考量",
    keywords: "選藥八問 停藥期 免疫力低下 殺菌性優先 抑菌性藥物清單",
    snippet: "選抗生素前的八個問題（需要嗎、病原、PK能否達MIC、breakpoint、劑量療程）；免疫力低下優先殺菌性藥物；食品動物停藥期考量。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "resistmech", sectionName: "抗藥性機制與MRSA演化史",
    keywords: "酵素去活化 標的修飾 外流泵 突變 接合 轉導 轉型 MRSA CRE VRE VISA VRSA演化史",
    snippet: "五大抗藥機轉與四種獲得方式（突變/接合/轉導/轉型）；金黃色葡萄球菌1940青黴素→1970 MRSA→1997 VISA→2002 VRSA演化史；WHO 2050超級細菌預測。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 Lincosamide Vancomycin 選藥原則 國考",
    snippet: "八點總複習：Lincosamide禁忌、Vancomycin/Tylosin基因連鎖、Ionophore馬毒性、MIC/breakpoint、選藥八問、抗藥性機轉、MRSA演化史。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "Lincosamide、其他抗生素與選藥原則",
    url: "大三/獸醫藥理學/Lincosamide與其他抗生素.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 Lincosamide 選藥原則 國考",
    snippet: "涵蓋Tylosin/Vancomycin抗藥基因連鎖、突變選擇壓力、Concentration-dependent給藥策略的練習題（共4題，含1題臨床情境整合題），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 Opioid 鴉片類 Morphine Fentanyl 受體 mu kappa delta",
    snippet: "八個臨床與國考重點：μ/κ受體功能分工、物種CNS抑制vs興奮、Neuroleptanalgesia組合、Fentanyl效力100倍、Buprenorphine天花板效應、Naloxone逆轉。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "painphysiology", sectionName: "疼痛生理與Gate Control理論",
    keywords: "Nociception Gate Control Theory 疼痛介質 Substance P PGE hyperalgesia 四步驟",
    snippet: "Gate control理論描述脊髓層級痛覺閘門調控；Nociception四步驟（Transduction/Transmission/Modulation/Perception）與對應藥物介入點。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "opioidreceptors", sectionName: "鴉片受體與細胞機轉",
    keywords: "mu kappa delta受體 G-protein coupled receptor Gi cAMP K+通道 Ca2+通道",
    snippet: "μ受體脊髓上鎮痛/愉悅感，κ受體脊髓鎮痛/煩躁感；G-protein coupled機轉：突觸前關Ca2+通道、突觸後開K+通道過極化。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "classification", sectionName: "藥物分類與效力比較",
    keywords: "Full agonist Partial agonist Mixed agonist antagonist 效力比較表",
    snippet: "Opioid四大分類（Full/Partial/Mixed/Antagonist）與效力比較表：Fentanyl(100)>Buprenorphine(25)>Oxymorphone(10-15)>Morphine(1)。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "pharmacology", sectionName: "藥理作用與物種差異",
    keywords: "CNS抑制興奮 物種差異 縮瞳散瞳 體溫調節 呼吸抑制 心血管效應",
    snippet: "貓馬豬羊牛易CNS興奮，人犬兔猴CNS抑制；縮瞳（犬鼠兔人）vs散瞳（貓羊馬猴）；所有型Agonist皆抑制呼吸，過量致死主因。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "clinicaluse", sectionName: "臨床用途與Neuroleptanalgesia",
    keywords: "Neuroleptanalgesia 神經安定鎮痛 Innovar-Vet Fentanyl Droperidol Oxymorphone Acepromazine",
    snippet: "Neuroleptanalgesia是Opioid+Tranquilizer組合，常見配方Fentanyl+Droperidol、Oxymorphone/Morphine+Acepromazine、Butorphanol+Xylazine。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "fullagonists", sectionName: "完全與部分Agonist個論",
    keywords: "Codeine Oxymorphone Hydromorphone Meperidine Tramadol Methadone",
    snippet: "Codeine口服輕度疼痛；Oxymorphone效力10倍Morphine；Meperidine馬腸絞痛；Tramadol三重機轉；Methadone犬貓馬Morphine替代品。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "fentanylfamily", sectionName: "Fentanyl家族與野生動物用藥",
    keywords: "Fentanyl Remifentanil Sufentanil Alfentanil Carfentanil Etorphine Diprenorphine 野生動物保定",
    snippet: "Fentanyl效力100倍Morphine，貼片維持72小時；Carfentanil限大型野生動物禁用於馬；Etorphine效力4000-10000倍Morphine需備Diprenorphine。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "mixedantagonists", sectionName: "混合型與拮抗劑",
    keywords: "Butorphanol Nalbuphine Buprenorphine Nalorphine Naloxone Naltrexone 天花板效應 ceiling effect",
    snippet: "Butorphanol馬匹偏好使用；Buprenorphine天花板效應治療指數極高；Naloxone純拮抗逆轉呼吸抑制但失去鎮痛，對Carfentanil無效需用Naltrexone。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "pktoxtolerance", sectionName: "藥動學、毒性與耐受性",
    keywords: "Vd大 血腦屏障 新生動物敏感 幼豬敏感 耐受性 身體依賴 戒斷症候群 tachyphylaxis",
    snippet: "Opioid高Vd（>1L/kg）鹼性生物鹼；新生動物BBB未成熟更敏感；幼豬對Morphine興奮性作用特別敏感；耐受性發展不均，縮瞳便秘幾乎不產生耐受。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "otheranalgesics", sectionName: "其他鎮痛輔助藥物",
    keywords: "Apomorphine Phenothiazines Ketamine Amantadine Gabapentin Amitriptyline Lidocaine patch",
    snippet: "Apomorphine犬催吐劑（D2 agonist）；Gabapentin結合α2δ次單元降低Glutamate釋放，用於神經性疼痛；Lidocaine patch局部鎮痛12-24h。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 Opioid 鴉片類 國考",
    snippet: "八點鴉片類止痛藥總複習：受體分工、物種CNS反應、藥物分類效力、Neuroleptanalgesia、Fentanyl家族、Buprenorphine特性、逆轉劑選擇、耐受性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鴉片類止痛藥",
    url: "大三/獸醫藥理學/鴉片類止痛藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 臨床情境題 quiz 自我測驗 Opioid 鴉片類 國考",
    snippet: "涵蓋馬匹Opioid選藥、Buprenorphine天花板效應、Carfentanil逆轉劑、Naloxone逆轉機轉的練習題（共5題，含1題臨床情境整合題：新生幼犬與幼豬Opioid敏感性），點擊即可顯示答案與解析。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 鎮靜 術前用藥 Barbiturate Benzodiazepine GABA",
    snippet: "八個重點：GABAA機轉、Barbiturates三級分類、Sighthound禁忌、BZD安全性、Flumazenil、Phenothiazines、Buspirone。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "cnsdepression", sectionName: "CNS抑制光譜與GABAA機轉",
    keywords: "CNS抑制光譜 全光譜 GABAA 氯離子通道 β次單元 γ次單元",
    snippet: "Barbiturates/酒精全光譜可致死，BZD有限光譜；Barbiturates結合β次單元增加開啟時間，BZD結合γ次單元增加開啟頻率且需GABA。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "barbiturates", sectionName: "Barbiturates（巴比妥類）",
    keywords: "Thiopental Methohexital Pentobarbital Phenobarbital 再分佈 Greyhound Sighthound",
    snippet: "超短效/短效/長效三級；麻醉終止靠再分佈；瘦體型犬種恢復延長，改用Methohexital或Propofol。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "benzodiazepines", sectionName: "Benzodiazepines（BZD）",
    keywords: "Diazepam Midazolam Flumazenil 癲癇重積 貓反常興奮 馬",
    snippet: "BZD不造成全身麻醉；Diazepam癲癇首選；貓反常興奮與肝毒性、馬效果差；Flumazenil拮抗。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "tranquilizers", sectionName: "Phenothiazines、Butyrophenones與α2 Agonists",
    keywords: "Acepromazine Chlorpromazine Azaperone Droperidol Xylazine Detomidine Medetomidine Atipamezole Yohimbine Tolazoline epinephrine reversal α2D 主要鎮定劑",
    snippet: "Phenothiazines阻斷D2與α1、無鎮痛、不可併用Epinephrine；Butyrophenones；α2 agonists雙相血壓、心輸出量↓約50%、反芻動物α2D敏感，Atipamezole/Yohimbine/Tolazoline拮抗。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "otherpremed", sectionName: "其他鎮靜輔助藥物",
    keywords: "Chloral hydrate Buspirone 5-HT1A Ethanol Disulfiram",
    snippet: "Chloral hydrate大動物術前用藥；Buspirone不作用GABA用於行為治療；Disulfiram抑制Aldehyde dehydrogenase。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 鎮靜 術前用藥 國考",
    snippet: "八點總複習：CNS光譜、GABAA機轉、Barbiturates三級、Sighthound、BZD安全性、Phenothiazines、α2 agonists、Buspirone。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "鎮靜與術前用藥",
    url: "大三/獸醫藥理學/鎮靜與術前用藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 臨床情境題 鎮靜 術前用藥",
    snippet: "涵蓋GABAA機轉、Sighthound Thiopental、Flumazenil、貓口服Diazepam肝壞死、Xylazine反芻動物α2D的練習題（共6題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 注射式麻醉藥 再分佈 Propofol Ketamine",
    snippet: "八個重點：再分佈終止效果、Sighthound禁忌、Propofol不蓄積、Etomidate心血管穩定、Ketamine NMDA拮抗。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "terminology", sectionName: "麻醉名詞學與麻醉分期",
    keywords: "平衡麻醉 解離性麻醉 術前 誘導 維持 恢復",
    snippet: "全身麻醉、平衡麻醉、解離性麻醉定義；麻醉四分期（鎮痛/興奮/外科麻醉/延腦抑制）；術前/誘導/維持/恢復各階段用藥。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "pkprinciples", sectionName: "藥動學原理：再分佈",
    keywords: "再分佈 redistribution 脂溶性 蓄積 恢復延長",
    snippet: "麻醉效果終止靠藥物從CNS再分佈到肌肉/脂肪而非代謝；重複注射致蓄積、肝功能不佳恢復延長。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "barbiturateIA", sectionName: "超短效Barbiturates",
    keywords: "Thiopental Methohexital Greyhound Sighthound 顱內壓 癲癇",
    snippet: "Thiopental vs Methohexital比較；Greyhound缺代謝酵素、瘦體型犬種脂肪少，改用Methohexital。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "nonbarbiturate", sectionName: "Propofol與Etomidate",
    keywords: "Propofol Etomidate Heinz body 腎上腺抑制 心血管穩定",
    snippet: "Propofol快速代謝不蓄積但貓連續使用致Heinz body；Etomidate心血管穩定但腎上腺抑制。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "dissociatives", sectionName: "解離性麻醉藥",
    keywords: "Ketamine Tiletamine NMDA 解離性麻醉 Telazol 僵直",
    snippet: "Ketamine非競爭性NMDA拮抗；眼睛張開肌張力增加；不可單獨使用，馬單用恢復期譫妄。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "otheragents", sectionName: "其他輔助藥物",
    keywords: "Guaifenesin Alphaxalone Saffan Cremophor",
    snippet: "Guaifenesin中樞肌肉鬆弛；Alphaxalone GABAA致效劑，舊賦形劑致過敏已改良。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "comparison", sectionName: "藥物比較與臨床組合",
    keywords: "CBF ICP MAP 心肺效應 犬麻醉組合",
    snippet: "Ketamine唯一升高CBF/ICP/HR/CO；Etomidate對MAP與CO影響最小；犬常見麻醉搭配範例。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 注射式麻醉 國考",
    snippet: "八點總複習：再分佈、Sighthound、Propofol、Etomidate、Ketamine機轉、Telazol、Saffan。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "注射式麻醉藥",
    url: "大三/獸醫藥理學/注射式麻醉藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 臨床情境題 注射式麻醉",
    snippet: "涵蓋顱內壓病患選藥、Ketamine單用禁忌、Propofol優勢、Greyhound與貓Propofol的練習題（共4題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 吸入性麻醉 MAC 血液溶解度 Isoflurane Sevoflurane",
    snippet: "八個重點：血液溶解度、MAC、第二氣體效應、Iso/Sevo主流、Halothane風險、惡性高燒、Methoxyflurane淘汰。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "uptake", sectionName: "吸收動力學與血液溶解度",
    keywords: "血液氣體分配係數 blood gas partition 第二氣體效應 second gas effect",
    snippet: "血液溶解度越低誘導恢復越快：Desflurane 0.42最快、Methoxyflurane 13極慢；N2O第二氣體效應。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "mac", sectionName: "MAC（效力）概念",
    keywords: "MAC 最低肺泡濃度 Meyer-Overton 降低MAC 升高MAC",
    snippet: "MAC使50%無反應的肺泡濃度，越低越強；手術用1.2-1.5倍MAC；術前用藥降低MAC。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "agents", sectionName: "個別藥物比較",
    keywords: "Isoflurane Sevoflurane Desflurane Halothane Enflurane Methoxyflurane Nitrous oxide 擴散性缺氧",
    snippet: "各吸入藥血液溶解度、代謝比例、特色；N2O擴散性缺氧；Methoxyflurane腎毒性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "toxicity", sectionName: "副作用與惡性高燒",
    keywords: "惡性高燒 Malignant Hyperthermia Dantrolene Halothane肝炎 Succinylcholine",
    snippet: "惡性高燒由吸入藥與Succinylcholine觸發SR Ca2+失控釋放；Dantrolene+降溫+純氧。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "clinicaluse", sectionName: "誘導與維持策略",
    keywords: "面罩誘導 腔室誘導 維持 氣道保護",
    snippet: "Sevoflurane最適合面罩誘導；腔室誘導用於難保定小動物；吸入維持氣道保護深度易控制。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 吸入性麻醉 國考",
    snippet: "八點總複習：血液溶解度、MAC、N2O、Iso/Sevo、Halothane、惡性高燒。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "吸入性麻醉藥",
    url: "大三/獸醫藥理學/吸入性麻醉藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 臨床情境題 吸入性麻醉",
    snippet: "涵蓋血液溶解度、MAC影響因素、惡性高燒、誘導策略的練習題（共4題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 局部麻醉藥 Na通道 Ester Amide Lidocaine Bupivacaine",
    snippet: "八個重點：Na+通道阻斷、Ester/Amide、pKa與感染、Epinephrine、CNS先於心血管毒性、Prilocaine、PABA。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "mechanism", sectionName: "作用機轉",
    keywords: "Na通道阻斷 動作電位 痛覺溫覺觸覺壓覺運動 神經纖維",
    snippet: "局部麻醉藥阻斷Na+通道；阻斷順序：痛→溫→觸→壓→運動。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "classification", sectionName: "分類與影響因素",
    keywords: "Ester Amide 短效 中效 長效 pKa 感染 Epinephrine",
    snippet: "Ester由血漿膽鹼酯酶水解、Amide肝臟代謝；pKa接近7.4起效快；感染酸性環境效果減弱。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "types", sectionName: "局部麻醉種類",
    keywords: "表面麻醉 浸潤 神經阻斷 硬脊膜外 脊髓 靜脈區域阻斷",
    snippet: "八種局部麻醉技術；硬脊膜外可用Opioid、局麻藥、α2 agonist。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "drugs", sectionName: "個別藥物",
    keywords: "Procaine Proparacaine Benzocaine Lidocaine Prilocaine EMLA Bupivacaine Ropivacaine MS-222",
    snippet: "Ester與Amide各藥特性；Procaine代謝為PABA干擾磺胺；Bupivacaine效力4倍Lidocaine。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "toxicity", sectionName: "毒性與處置",
    keywords: "CNS毒性 心血管毒性 變性血紅素血症 Diazepam 抽搐",
    snippet: "CNS毒性先於心血管毒性；Diazepam+氧氣處置；Prilocaine/Benzocaine致變性血紅素血症。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 局部麻醉 國考",
    snippet: "八點總複習：機轉、Ester/Amide、pKa、Epinephrine、毒性順序、Prilocaine、Bupivacaine。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "局部麻醉藥",
    url: "大三/獸醫藥理學/局部麻醉藥.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 臨床情境題 局部麻醉",
    snippet: "涵蓋感染組織效果、毒性時序、Prilocaine、Procaine與磺胺的練習題（共4題）。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 病灶定位 四階段復健 深層痛覺 前庭疾病 退化性脊髓病 針灸",
    snippet: "七個臨床重點：病灶定位表、四階段復健框架、Compressive/Non-compressive分類、深層痛覺、前庭疾病、針灸處方、DM存活期實證。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "anatomy", sectionName: "解剖學與病灶定位",
    keywords: "本體感覺路徑 步態產生 病灶定位表 UMN LMN C1-C5 C6-T2 T3-L3 L4-S1 神經功能恢復順序 NDS",
    snippet: "依前後肢UMN/LMN組合與步態反推病灶位置；雙引擎步態對應C6-T2；神經功能恢復順序側躺→趴正→坐立→站立→行走。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "rehabphases", sectionName: "復健四階段框架",
    keywords: "急性期 增生期 鞏固期 組織期 四階段 復健時間軸",
    snippet: "急性期1-5天、增生期5-21天、鞏固期21-60天、組織期61天以後，是幾乎所有神經疾病復健方案的通用骨架。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "diseases", sectionName: "常見神經科疾病復健方案",
    keywords: "A/A不穩定 CCSM Wobbler IVDD type I type II ANNPE HNPE FCE 臂神經叢撕裂 馬尾部症候群 脊椎病 浣熊犬麻痺症 坐骨神經損傷 前庭疾病",
    snippet: "13種常見神經疾病的病因、診斷、是否手術與復健特色整理，含Compressive/Non-compressive分類與2025回溯性研究。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "paralysis", sectionName: "癱瘓總論：分級與診斷流程",
    keywords: "paresis plegia paralysis tetra hemi para 深層痛覺 CNS PNS NMJ 病灶定位",
    snippet: "輕癱/截癱/癱瘓程度分級；無深層痛覺表示預後不佳；神經學檢查→病灶定位→鑑別診斷→確定診斷流程。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "modalities", sectionName: "輔助治療模式",
    keywords: "針灸 Acupuncture EAP 雷射 Laser tPEMF HBOT 高壓氧 穴位 JJJ HTJJ",
    snippet: "四肢癱瘓與後軀癱瘓針灸處方（由簡入繁四選項）；雷射與tPEMF實證研究；HBOT神經保護機轉。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "exercise", sectionName: "肢體復健運動與輔具",
    keywords: "PROM 按摩 PNF 神經抑制術 運動復健 輔具 UWTM 水中跑步機 居家環境調整",
    snippet: "PROM/按摩/伸展頻率；PNF（促進）vs神經抑制術（放鬆）；運動復健項目；A-Frame/Cart/Toe grip等輔具。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "dm", sectionName: "退化性脊髓病深入",
    keywords: "Degenerative Myelopathy DM SOD1基因 髓鞘脫失 分期 Kathmann 存活期 游泳 UWTM 雷射",
    snippet: "SOD1基因突變機轉、Stage 1-3分期、Kathmann 2006存活期實證（55/130/255天）、雷射劑量與存活期研究。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 神經科復健 國考",
    snippet: "十點總複習：病灶定位、四階段框架、深層痛覺、椎間盤分類、浣熊犬麻痺症、坐骨神經損傷、前庭疾病、針灸邏輯、DM實證、雷射tPEMF研究。"
  },
  {
    subject: "伴侶動物復健及物理治療學", semester: "大四上", week: 1, weekTitle: "常見神經科疾病復健",
    url: "大四上/伴侶動物復健及物理治療學/week01_神經科疾病復健.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 神經科復健",
    snippet: "涵蓋病灶定位、椎間盤分類、坐骨神經損傷、前庭疾病、PNF、DM分期的練習題（共9題，含2題臨床情境整合題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 抗癲癇 癲癇 GABAA Na通道 Phenobarbital 癲癇重積症",
    snippet: "七個臨床重點：控制不治癒、兩大機轉框架、Phenobarbital第一線、Diazepam重積症首選、KBr貓禁忌、物種SE策略、Xylazine禁忌。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "nomenclature", sectionName: "癲癇定義、分類與病因",
    keywords: "Epilepsy Seizure 全腦性發作 局部性發作 grand mal petit mal 顱內顱外病因 SCN1A基因",
    snippet: "全腦性vs局部性發作分類；顱內（特發性/遺傳性/後天性）vs顱外病因；SCN1A基因與Na⁺通道；犬發作誘因。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "mechanisms", sectionName: "兩大細胞作用機轉",
    keywords: "GABAA受體 Cl通道 電壓依賴性Na通道 Na channel三態模型",
    snippet: "促進GABAA/Cl⁻通道開啟（Phenobarbital/Primidone/BZD）vs阻斷電壓依賴性Na⁺通道（Phenytoin/Carbamazepine/Valproate）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "olderdrugs", sectionName: "老藥個論",
    keywords: "Phenobarbital Primidone Diazepam Clonazepam Midazolam Lorazepam Phenytoin Imepitoin Pexion Carbamazepine Valproic acid Ethosuximide Potassium Bromide KBr",
    snippet: "Phenobarbital為犬貓第一線；BZD類比較表；Phenytoin犬貓皆不建議；Imepitoin歐洲核准；KBr貓禁用（氣喘樣疾病）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "statusepilepticus", sectionName: "癲癇重積症與臨床用藥禁忌",
    keywords: "Status Epilepticus 癲癇重積症 群發性癲癇 Xylazine禁忌 降低癲癇閾值藥物 Pentobarbital",
    snippet: "SE定義持續>5分鐘；犬先BZD後barbiturate，貓用Diazepam；降低癲癇閾值藥物黑名單；Xylazine明確禁忌。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "newerdrugs", sectionName: "新藥個論",
    keywords: "Gabapentin Pregabalin Levetiracetam Felbamate Zonisamide 難治型癲癇 SV2A α2δ次單元",
    snippet: "Levetiracetam難治型癲癇優先選用（不誘導P450）；Gabapentin結合Ca²⁺通道α2δ次單元；Felbamate雙機轉需監測肝功能。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 抗癲癇 癲癇 國考",
    snippet: "八點總複習：控制不治癒、兩大機轉、Phenobarbital/Diazepam定位、Phenytoin/KBr禁忌、Imepitoin、SE策略、用藥黑名單、新藥特色。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗癲癇藥物",
    url: "大三/獸醫藥理學/抗癲癇藥物.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 抗癲癇 癲癇重積症",
    snippet: "涵蓋機轉分類、Diazepam犬適用性、KBr貓禁忌、Phenytoin藥動學、重積症處置的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 膽鹼性藥物 Nicotinic Muscarinic 抗膽鹼酯酶 有機磷中毒",
    snippet: "六個臨床重點：受體地圖、抗ChE三機轉、Physostigmine/Neostigmine穿BBB差異、OP解毒雙管齊下、擬菸鹼驅蟲藥、神經節阻斷劑不實用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "receptors", sectionName: "菸鹼型與蕈毒鹼型受體",
    keywords: "Nicotinic receptor NM NN Muscarinic M1 M2 M3 M4 M5 Gq Gi",
    snippet: "菸鹼型NM(NMJ)/NN(神經節+CNS)為陽離子通道；蕈毒鹼型M1/M3/M5偶聯Gq，M2/M4偶聯Gi/o。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "directagonists", sectionName: "直接型膽鹼性致效劑",
    keywords: "Acetylcholine ACh Carbachol Bethanechol Methacholine Pilocarpine 縮瞳青光眼",
    snippet: "ACh無臨床用途；Carbachol/Bethanechol四級銨不穿BBB；Pilocarpine三級胺穿BBB，眼科縮瞳治青光眼。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "anticholinesterase", sectionName: "抗膽鹼酯酶藥物",
    keywords: "Physostigmine Neostigmine Edrophonium Pyridostigmine Demecarium Carbamylation Phosphorylation 青光眼用藥",
    snippet: "三種抑制機轉可逆性/Carbamylation/Phosphorylation；Physostigmine穿BBB、Neostigmine不穿；青光眼用藥總覽。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "optoxicity", sectionName: "有機磷中毒與解毒",
    keywords: "Organophosphate OP中毒 Echothiophate Atropine 2-PAM Pralidoxime aging老化",
    snippet: "OP中毒臨床徵象；Atropine緩解蕈毒鹼症狀＋2-PAM重新活化AChE（須24小時內、不穿BBB）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "ganglionic", sectionName: "神經節菸鹼型藥物與驅蟲藥",
    keywords: "Levamisole Pyrantel Morantel Hexamethonium 擬菸鹼驅蟲藥 神經節阻斷劑",
    snippet: "Levamisole/Pyrantel/Morantel擬菸鹼驅蟲藥，先興奮後麻痺線蟲；神經節阻斷劑非選擇性獸醫不用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 膽鹼性藥物 國考",
    snippet: "六點總複習：受體地圖、直接致效劑、抗ChE三機轉、OP解毒、擬菸鹼驅蟲藥、神經節阻斷劑。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "膽鹼性藥物",
    url: "大三/獸醫藥理學/膽鹼性藥物.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 膽鹼性藥物 有機磷中毒",
    snippet: "涵蓋Physostigmine/Neostigmine差異、OP中毒解毒、2-PAM時效、擬菸鹼驅蟲藥的練習題（共4題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 抗膽鹼藥物 Atropine 神經肌肉阻斷劑 NMJ 去極化 競爭性",
    snippet: "七個臨床重點：Atropine vs Glycopyrrolate穿BBB差異、NMJ阻斷不影響痛覺、逆轉方式、組織胺釋放、SuCh延長麻痺風險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "atropine", sectionName: "Atropine 與生物鹼類",
    keywords: "Atropine Belladonna alkaloid Scopolamine Hyoscine Hyoscyamine 散瞳 睫狀肌麻痺",
    snippet: "Atropine為所有抗蕈毒鹼藥物原型；散瞳、心搏過速（高劑量）、↓分泌；Scopolamine控制暈動症、馬腸絞痛。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "syntheticantimuscarinics", sectionName: "合成型抗蕈毒鹼藥物",
    keywords: "Propantheline Glycopyrrolate Ipratropium Tropicamide Aminopentamide Oxybutynin",
    snippet: "與Atropine比較：Glycopyrrolate不穿BBB術前用藥；Tropicamide作用較短眼科散瞳；Aminopentamide犬貓腹痛。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "nmbmechanism", sectionName: "神經肌肉阻斷機轉",
    keywords: "Neuromuscular blocking 去極化 Depolarizing Succinylcholine 競爭性 Competitive Tubocurarine 逆轉",
    snippet: "去極化型(SuCh持續去極化致麻痺無好拮抗劑) vs競爭性型(Tubocurarine等可用抗ChE藥物逆轉)。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "nmbdrugs", sectionName: "個別藥物與藥動學",
    keywords: "Succinylcholine PChE Tubocurarine Pancuronium Atracurium Vecuronium Hoffman elimination",
    snippet: "SuCh經PChE水解，犬延長麻痺風險；Atracurium經Hoffman elimination不經肝腎，肝腎疾病首選。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "nmbadverse", sectionName: "不良反應與影響因子",
    keywords: "組織胺釋放 histamine 痛覺 nociception 有機磷暴露史 吸入性麻醉藥交互作用",
    snippet: "NMJ阻斷劑不影響痛覺；Tubocurarine犬貓易組織胺釋放；30天內OP暴露延長SuCh作用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "dantrolene", sectionName: "Dantrolene",
    keywords: "Dantrolene 惡性高熱 Malignant Hyperthermia Ryanodine receptor 肌漿網Ca釋放",
    snippet: "直接抑制肌漿網Ca²⁺釋放；治惡性高熱、犬貓尿道張力過高、馬麻醉後肌炎。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 抗膽鹼 神經肌肉阻斷劑 國考",
    snippet: "七點總複習：Atropine原型、NMJ兩大機轉、痛覺安全觀念、組織胺釋放、SuCh風險因子、麻醉藥交互作用、Dantrolene。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "抗膽鹼與神經肌肉阻斷劑",
    url: "大三/獸醫藥理學/抗膽鹼與神經肌肉阻斷劑.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 抗膽鹼 神經肌肉阻斷劑",
    snippet: "涵蓋Atropine/Glycopyrrolate選擇、NMJ痛覺觀念、逆轉方式、SuCh風險的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "abstract", sectionName: "核心結論",
    keywords: "Hana PCV HCT DPO Darbepoetin 貧血 SUB 輸尿管阻塞",
    snippet: "PCV一天掉6點是抽血時間差造成的稀釋假象非真貧血惡化；9/21當下就不該給DPO（給藥前RETIC已153.7）；不建議繼續給藥。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "basics", sectionName: "基礎知識：EPO／DPO／鐵劑",
    keywords: "EPO Erythropoietin 紅血球生成素 DPO Darbepoetin alfa 鐵劑 功能性缺鐵 CHr 腎性貧血",
    snippet: "EPO是腎臟發的造血訊號，DPO是人工補訊號，鐵劑是造血原料；三者處理不同層級問題，Hana骨髓從未缺訊號故DPO指徵不成立。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "dilution", sectionName: "關鍵發現：抽血時間決定數字",
    keywords: "稀釋 dilution 血容積計算 抽血時間 輸液速率 TP Alb",
    snippet: "血容積計算預期HCT與實測幾乎吻合；RBC/HCT/RETIC三項同步下降是稀釋而非出血溶血的指紋。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "regenerative", sectionName: "再生性貧血怎麼判斷",
    keywords: "RETIC reticulocyte 絕對值 MCV RDW CHr 貓 再生性貧血分級",
    snippet: "RETIC看絕對值不看百分比；貓的aggregate reticulocyte分級表；MCV/RDW上升+CHr正常=典型再生性型態。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "dpotiming", sectionName: "DPO：適應症與時間尺度",
    keywords: "DPO Darbepoetin 腎性貧血 EPO缺乏 高血壓 PRCA 治療時間尺度",
    snippet: "DPO給藥到RETIC反應需3-7天、PCV上升需2-4週，時間軸對不上；風險為高血壓與PRCA。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "differential", sectionName: "急性PCV下降鑑別流程",
    keywords: "PCV下降鑑別 稀釋 出血 溶血 TP Albumin 貓輸血觸發點",
    snippet: "急性PCV下降三個機轉鑑別表；關鍵是TP/Albumin不是CBC；貓輸血觸發點PCV<15-18%或有症狀。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "retrospective", sectionName: "回顧：9/21 決策複盤",
    keywords: "決策複盤 retrospective RETIC 153.7 時間尺度 EPO缺乏 鑑別診斷順序",
    snippet: "9/21當下已有4個訊號指向不該給DPO：給藥前RETIC已153.7、時間尺度不符、EPO缺乏機轉不成立、未先排除稀釋。問題是順序錯了不是選錯藥。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "decision", sectionName: "9/23 決策",
    keywords: "DPO停用 鐵劑繼續 臨床決策 行動項目",
    snippet: "整合分析後決定：DPO不繼續（PCV已達標、時間軸對不上、風險反轉），鐵劑因加速造血消耗繼續給予。"
  },
  {
    subject: "上群病例筆記", semester: "上群", week: null, weekTitle: "Hana：PCV 判讀與 DPO 決策",
    url: "上群/2026-09-24_Hana-PCV判讀與DPO決策.html",
    section: "lessons", sectionName: "學習重點",
    keywords: "複習 重點整理 PCV HCT 濃度 稀釋 臨床推理",
    snippet: "六點總複習：PCV是濃度非總量、數字先驗證再反應、處置時間尺度對齊、固定抽血時段、PCV配TP、RETIC看絕對值。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 腎上腺素性藥物 α受體 β受體 兒茶酚胺",
    snippet: "七個臨床重點：受體訊息傳遞方向、Xylazine物種受體差異、Epinephrine雙相效應、Dopamine劑量切換、Clenbuterol食安、逆轉劑邏輯、β-blocker心臟選擇性。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "receptors", sectionName: "腎上腺素性受體與訊息傳遞",
    keywords: "α1 α2 β1 β2 β3 Gq Gi Gs 突觸前自體受體 presynaptic",
    snippet: "α1偶聯Gq、α2偶聯Gi/o（含突觸前負回饋）、β1/β2/β3皆偶聯Gs；α2受體雙重身分：突觸前負回饋與多重生理效應。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "catecholaminepk", sectionName: "兒茶酚胺生合成與代謝",
    keywords: "Dopamine Norepinephrine Epinephrine 生合成 MAO COMT 再回收 reuptake Cocaine",
    snippet: "生合成路徑Dopamine→NE→Epi；去活化機轉：突觸前再回收（MAO代謝87%）、效應細胞攝取、肝腎代謝；口服兒茶酚胺無效。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "speciesvariation", sectionName: "物種藥效差異",
    keywords: "Xylazine α2D α2A 反芻動物 Morphine貓犬劑量差異",
    snippet: "反芻動物α2D受體、非反芻動物α2A受體，Xylazine對α2D親和力較高故牛鎮靜效果更強。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "catecholamines", sectionName: "內生性兒茶酚胺",
    keywords: "Epinephrine Norepinephrine Dopamine 過敏性休克 心肺復甦 敗血性休克 D1受體",
    snippet: "Epinephrine劑量依賴雙相效應；NE不適用多數休克；Dopamine低劑量D1血管舒張、高劑量α+β1血管收縮。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "syntheticagonists", sectionName: "合成擬交感神經藥物",
    keywords: "Isoproterenol Phenylephrine Dobutamine Ephedrine PPA 尿失禁 氣喘",
    snippet: "Isoproterenol非選擇性β；Phenylephrine氣體麻醉升壓首選；Dobutamine短期心衰竭；PPA犬貓尿失禁最常用。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "betaagonistfood", sectionName: "β-Agonist 食品安全議題",
    keywords: "Terbutaline Albuterol Clenbuterol 克崙特羅 Isoxsuprine Ractopamine Zilpaterol 瘦肉精 西班牙食物中毒",
    snippet: "Clenbuterol代謝緩慢易殘留，1992西班牙113例食物中毒；Ractopamine/Zilpaterol合法體組成改變劑有停藥期規範。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "alphablockers", sectionName: "α-受體阻斷劑",
    keywords: "Phenoxybenzamine Prazosin Phentolamine Yohimbine Tolazoline Atipamezole 逆轉α2agonist",
    snippet: "α1-blocker（Phenoxybenzamine/Prazosin/Phentolamine）降周邊阻力；α2-blocker逆轉α2 agonist鎮定劑效果。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "betablockers", sectionName: "β-受體阻斷劑",
    keywords: "Propranolol Metoprolol Atenolol Esmolol Sotalol Carvedilol 心臟選擇性 氣喘禁忌",
    snippet: "非選擇性（Propranolol）氣喘禁忌；β1選擇性（Metoprolol/Atenolol/Esmolol）較安全；貓心搏過速首選β-blocker。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 腎上腺素性藥物 國考",
    snippet: "七點總複習：受體訊息傳遞、Xylazine物種差異、Epi/Dopamine劑量效應、β-agonist食安、α2拮抗劑逆轉、β-blocker選擇性、停藥反彈。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "腎上腺素性藥物",
    url: "大三/獸醫藥理學/腎上腺素性藥物.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 腎上腺素性藥物",
    snippet: "涵蓋Xylazine物種差異、Clenbuterol食安、β-blocker選擇性、逆轉劑選用的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 強心配糖體 Digoxin Cardiac Glycoside CHF",
    snippet: "七個重點：CHF代償惡性循環、Digoxin抑制Na/K-ATPase機轉、正性肌力與心律不整雙面刃、低血鉀增毒性、貓敏感、Digibind劑量單位、Pimobendan取代地位。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "cardiacfunction", sectionName: "心臟功能與CHF病理生理",
    keywords: "CO HR SV Preload Afterload Frank-Starling CHF 代償機轉 惡性循環",
    snippet: "CO=HR×SV，SV由preload/afterload/inotropy決定；CHF代償機轉（SNS/RAS活化、水鈉滯留）長期反而加速心臟衰竭。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "digoxinmechanism", sectionName: "Digoxin：機轉與藥理效果",
    keywords: "Digoxin Na K ATPase 正性肌力 SA node AV node 電生理",
    snippet: "抑制Na⁺/K⁺-ATPase→細胞內Ca²⁺↑→正性肌力；同時心率↓、AV傳導↓；自主性上升致心律不整風險。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "digoxinpk", sectionName: "Digoxin：藥動學與給藥",
    keywords: "Digoxin Digitoxin Ouabain 藥動學比較 治療濃度 給藥劑量 貓維持劑量",
    snippet: "Digoxin治療窗0.8-2.0 ng/mL；貓維持劑量0.004-0.005 mg/kg/12h口服；負荷劑量IV或口服為優先。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "digoxintoxicity", sectionName: "副作用與中毒處置",
    keywords: "Digoxin中毒 低血鉀 Digibind Digoxin Immune FAB 38mg 500微克",
    snippet: "低血鉀增加中毒風險；GI症狀為最早徵象；Digibind 38mg中和500微克（非奈克）Digoxin，教科書核對修正單位。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "otherinotropes", sectionName: "其他正性肌力藥物",
    keywords: "Dobutamine Dopamine Amrinone Milrinone Pimobendan PDE III inodilator",
    snippet: "Dobutamine/Dopamine皆IV短期用；PDE III抑制劑（Pimobendan口服0.25mg/kg BID）已大幅取代Digoxin成犬CHF首選。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "shock", sectionName: "休克分類與用藥",
    keywords: "休克分類 低血容性 心因性 過敏性 敗血性 Sildenafil 肺高血壓",
    snippet: "五類休克對應不同用藥邏輯：低血容IV輸液、心因性正性肌力藥、過敏性Epinephrine、敗血性Norepinephrine。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 強心配糖體 Digoxin Pimobendan 國考",
    snippet: "七點總複習：CO公式、Digoxin機轉雙面性、治療窗與貓劑量、中毒處置流程、其他正性肌力藥、Pimobendan地位、休克分類用藥。"
  },
  {
    subject: "獸醫藥理學", semester: "大三", week: null, weekTitle: "強心配糖體",
    url: "大三/獸醫藥理學/強心配糖體.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 強心配糖體 Digoxin",
    snippet: "涵蓋Digoxin機轉、低血鉀交互作用、Digibind劑量換算、Pimobendan取代邏輯的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 X光 radiology X-ray 光電效應 對比度 二維限制 投照 擺位",
    snippet: "八個臨床與國考重點：X光管mA/kVp/mAs、光電效應與Z³/1/E³比例關係、準直儀、對比度四因子、二維影像五限制、投照命名、標準擺位重要性。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "production", sectionName: "X光的產生",
    keywords: "X光管 X-ray tube 鎢靶 tungsten target 熱陰極燈絲 hot cathode filament mA mAs kVp 旋轉陽極",
    snippet: "高速電子撞擊鎢靶產生X光；mA決定電子數量、kVp決定X光能量、mAs為X光管實際輸出總輻射量。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "interaction", sectionName: "輻射與物質的交互作用",
    keywords: "光電效應 photoelectric effect absorption 原子序 atomic number 光子能量 photon energy Z3",
    snippet: "光電效應是形成影像的主要機轉，吸收量與原子序三次方成正比、與光子能量三次方成反比，kVp越高對比度越低。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "basics", sectionName: "攝影基本概念",
    keywords: "準直儀 collimator collimation 底片黑化度 film blackness opacity 鹵化銀 silver halide fogging",
    snippet: "準直儀限制主要射束範圍避免非必要輻射；底片黑化程度與到達底片的X光數量直接相關，mAs與kVp皆影響曝光量。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "contrast", sectionName: "影響對比度的因素",
    keywords: "對比度 radiographic contrast 物理密度 physical density 原子序 厚度 thickness kVp mAs 軟組織不透光度 soft-tissue radiopacity 胸腔攝影 動作模糊 motion blur",
    snippet: "對比度取決於物理密度、原子序、厚度、X光能量四因子；胸腔攝影宜高kVp呈現肺血管細節、低mAs縮短曝光時間避免呼吸心跳造成動作模糊。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "twodim", sectionName: "二維影像的先天限制",
    keywords: "放大 magnification 變形 distortion 不熟悉的影像 unfamiliar image 失去深度感 depth perception 疊加訊號 summation sign 輪廓消失效應 silhouette effect border effacement 吸飽氣 full inspiration 塌陷肺泡 atelectatic",
    snippet: "二維影像五限制：放大變形、不熟悉的影像、失去深度感、疊加訊號（正向/負向）、輪廓消失效應；拍胸腔須吸飽氣，否則塌陷肺泡會掩蓋病灶邊界。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "projections", sectionName: "攝影投照與擺位",
    keywords: "投照 projection DV VD dorsoventral ventrodorsal craniocaudal caudocranial 外側位 lateral 標準擺位 standard position 解剖學方位術語 rostral caudal dorsal ventral palmar plantar 依賴側 non-dependent 右側躺 左側肺葉",
    snippet: "投照方向依X光進出方向命名：DV腹側臥/VD背側臥、CrCd/CdCr、外側位依躺臥側命名；標準擺位不正會使脊椎偏移、心臟輪廓失真；想看左肺要右側躺（非依賴側較不塌陷）。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "procedure", sectionName: "攝影流程",
    keywords: "攝影流程 procedure 病患保定 restraint 化學保定 機械式保定 干擾物 重疊 overlap",
    snippet: "選定部位→至少兩個互相垂直投照方向→減少外部物體與病患自身構造重疊→標準擺位→有效保定→X光曝光設定。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 X光學基礎 radiology 國考",
    snippet: "七點總複習：X光管機轉、光電效應比例關係、準直儀與底片黑化、對比度四因子、二維五限制、投照命名、標準擺位重要性。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "X光學基礎",
    url: "大四上/獸醫臨床及影像診斷學/week03_X光學基礎.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 X光學基礎 radiology",
    snippet: "涵蓋kVp與對比度關係、軟組織不透光度、疊加訊號、雙投照方向必要性的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "重點摘要 CT MRI computed tomography magnetic resonance imaging",
    snippet: "九個臨床與國考重點：CT/MRI構造別顯影能力差異、切面自由度、Hounsfield unit、窗寬窗位、顯影劑腎毒性、MRI磁場安全禁忌、脈衝序列邏輯、有意義病灶vs偶然發現。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "overview", sectionName: "CT 與 MRI 的差異",
    keywords: "CT vs MRI 構造 骨骼 軟組織 腦部 胸腔 影像切面 sagittal transverse dorsal reconstruction",
    snippet: "CT對骨骼/胸腔最強，MRI對腦部/肌肉最強，MRI幾乎不能用於肺部；CT僅直接取橫切面其餘靠重組，MRI任何切面皆可直接掃描。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "ctphysics", sectionName: "CT 成像原理與機型",
    keywords: "CT掃描原理 X光管 偵測器 gantry 單切CT 螺旋CT 多切CT single slice spiral helical multislice",
    snippet: "X光源與偵測器繞病患旋轉取得投影資料，電腦重建影像；CT機型分單切、螺旋、多切三種，多切螺旋CT是現代主流。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "hounsfield", sectionName: "Hounsfield Unit 與窗寬窗位",
    keywords: "Hounsfield unit HU CT number 矩陣 pixel voxel windowing window level width WL WW 骨窗 軟組織窗 肺窗 人眼灰階 肝臟胃壁",
    snippet: "HU以水為0基準，骨骼+1000、空氣-1000；人眼分辨不出2000級灰階，windowing把細微HU差異拉開成看得出來的對比，如肝臟與胃壁HU相近可靠調窗區分。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "reconstruction", sectionName: "影像重組",
    keywords: "影像重組 image reconstruction 矢狀面重組 3D立體重建 volume rendering",
    snippet: "橫切面資料可重組出矢狀面/背側面影像與3D立體重建，多切薄層掃描使重組影像更平滑，常用於術前規劃。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "contrast", sectionName: "顯影劑與腎毒性",
    keywords: "碘顯影劑 iodinated contrast media 顯影強化 enhancement 血腦屏障 CT angiography CT urography 腎毒性 nephrotoxicity 顯影劑不良反應 ring enhancement 脾梗塞 腎梗塞 椎間盤炎 骨髓炎",
    snippet: "IV碘顯影劑找兩種異常：不該顯影卻顯影（如BBB破壞、椎間盤炎、骨髓炎）、該顯影卻不顯影（如脾梗塞、腎梗塞、腫瘤壞死呈環狀強化）；經腎絲球過濾排除須注意腎毒性。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "ctartifacts", sectionName: "CT 偽像",
    keywords: "CT偽像 CT artifacts 動作偽像 motion 射束硬化 beam hardening 部分容積效應 partial volume averaging",
    snippet: "CT常見偽像四類：動作偽像、射束硬化偽像、部分容積效應、其他，皆與掃描技術及病患配合度相關。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "mriphysics", sectionName: "MRI 物理基礎",
    keywords: "氫質子 hydrogen proton 磁場 magnetic field M0 tesla 磁場強度 high field low field",
    snippet: "氫質子帶正電荷且自旋產生磁場，無外加磁場時方向隨機排列淨磁化M0=0；臨床磁場0.5-3T，高磁場1-3T多數人醫院使用。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "mrisafety", sectionName: "MRI 安全性",
    keywords: "MRI安全 飛彈效應 missile effect 金屬物體 心臟節律器 pacemaker 金屬植入物 影像扭曲 distortion",
    snippet: "磁場對金屬物體是絕對禁忌，飛彈效應可致嚴重傷亡；心臟節律器/金屬植入物/項圈/監測設備禁止進入磁場室；金屬也致局部影像扭曲。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "pulsesequences", sectionName: "常見脈衝序列",
    keywords: "T1W T2W FLAIR GE gradient echo SWI susceptibility weighted STIR short T1 inversion recovery 脂肪抑制 fat signal suppression 反轉回復 null point 零點 TI inversion time 化學脂肪飽和 chemical fat saturation 淋巴瘤 lymphoma 骨髓病灶 Gadolinium 顯影劑 signal void",
    snippet: "T1W解剖佳、T2W病灶敏感；FLAIR消除純液體訊號；GE/SWI對磁化率敏感呈訊號流失（出血/鈣化/金屬）；STIR用180°反轉脈衝使脂肪Mz在TI時通過零點訊號歸零，凸顯骨髓病灶/淋巴瘤等富含水分的病灶。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "practical", sectionName: "臨床操作與判讀要點",
    keywords: "MRI擺位 coil 線圈 有意義病灶 偶然發現 incidental findings",
    snippet: "感興趣部位應靠近線圈中心且擺位端正；判讀須區分有意義病灶與偶然發現，結合病史與神經學定位綜合判斷。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 CT MRI 國考",
    snippet: "八點總複習：CT/MRI構造選擇、HU與窗寬窗位、影像重組與顯影劑、CT偽像、MRI物理與安全、脈衝序列、擺位與判讀思維。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 4, weekTitle: "CT與MRI原理",
    url: "大四上/獸醫臨床及影像診斷學/week04_CT與MRI原理.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 CT MRI",
    snippet: "涵蓋構造選擇邏輯、窗寬窗位應用、MRI磁場安全性、脈衝序列辨識的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "脊椎影像 spine imaging A SPINE 系統性判讀 神經學檢查 病灶定位 significant insignificant",
    snippet: "影像工具選擇思路、脊椎攝影技術、A SPINE系統性判讀架構、依異常特徵分類的鑑別診斷、常見脊椎疾病影像特徵整理。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "approach", sectionName: "影像工具選擇",
    keywords: "影像工具選擇 which one to choose radiography myelography CT MRI 神經學檢查 病灶定位 imaging is not everything significant insignificant",
    snippet: "神經學檢查定位病灶先於選擇影像工具；CNS本體（腦、脊髓）靠MRI/CT，脊椎周邊構造靠X光；imaging不能取代神經學定位。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "technique", sectionName: "脊椎攝影技術與擺位",
    keywords: "脊椎攝影技術 擺位 positioning restraint 投照方向 projection lateral VD 減少疊加結構 攝影中心 center 頸椎 胸椎 腰椎",
    snippet: "脊椎節區解剖總覽、良好攝影五要素、病患擺位、標準投照方向、減少疊加結構技巧、各區域攝影中心對照表。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "interpretation", sectionName: "系統性判讀與鑑別診斷",
    keywords: "A SPINE alignment soft tissues processes interior nerves exterior 鑑別診斷 排列 形狀 密度 椎間孔 椎間盤空間 VITAMIN D DAMNIT V",
    snippet: "A SPINE判讀口訣；依排列、形狀、椎體密度、椎間孔大小與密度、椎間盤寬度與密度六個維度分類的鑑別診斷表。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "diseases", sectionName: "常見脊椎疾病影像特徵",
    keywords: "先天性脊椎異常 congenital transitional vertebrae block vertebra hemivertebrae butterfly vertebra spina bifida 脊椎黏連性關節病 spondylosis deformans 椎間盤感染 discospondylitis 脊椎腫瘤 neoplasia 創傷 trauma fracture luxation 退化性椎間盤突出 IVDD ANNPE 急性非壓迫性髓核突出",
    snippet: "先天性異常、脊椎黏連性關節病、椎間盤感染（影像變化落後臨床症狀）、脊椎腫瘤、創傷、退化性IVDD vs. ANNPE比較表。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 脊椎影像 A SPINE 鑑別診斷 discospondylitis ANNPE",
    snippet: "七點總複習：神經學定位、攝影技術、A SPINE、六維度鑑別診斷、discospondylitis、脊椎腫瘤、退化性IVDD vs. ANNPE。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像判讀",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像判讀.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 簡答題 臨床情境題 脊椎 discospondylitis ANNPE",
    snippet: "涵蓋影像工具選擇、A SPINE、鑑別診斷分類、discospondylitis與ANNPE辨識的練習題（共5題，含1題臨床情境整合題）。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "abstract", sectionName: "使用說明",
    keywords: "脊椎影像解剖圖譜 atlas radiographic anatomy 標記辨識 小考",
    snippet: "犬脊椎X光片標準投照上的解剖標記圖譜使用說明，供圖譜標記小考複習使用。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "cervical", sectionName: "頸椎 C1–C6 外側位",
    keywords: "頸椎 cervical C1 寰椎 atlas C2 樞椎 axis 關節突關節 articular process joint 椎間孔 intervertebral foramen 椎間盤空間 棘突 spinous process",
    snippet: "C1–C6頸椎外側位標記圖，含寰樞椎區、中頸椎區標記，以及C4-C5 CT 3D重組立體參考。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "thoracic", sectionName: "頸胸交界至前胸椎 C7–T10 外側位",
    keywords: "胸椎 thoracic C7 T1 肩胛骨 scapula 棘突 spinous process 椎間孔 椎間盤空間 辨識技巧 計數",
    snippet: "C7–T10頸胸交界至前胸椎外側位標記圖，含肩胛棘重疊區辨識技巧與胸椎計數方法。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "lumbar", sectionName: "腰椎與腰薦交界 L2–L7 外側位",
    keywords: "腰椎 lumbar 副突 accessory process 橫突 transverse process 關節突關節 椎間孔 髂骨嵴 iliac crest CT 3D重組",
    snippet: "L2–L7腰椎與腰薦交界外側位標記圖，含副突與橫突辨識技巧，以及胸腰椎CT 3D重組立體參考。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "sacrum", sectionName: "腰薦交界／薦椎 VD",
    keywords: "腰薦 lumbosacral 薦椎 sacrum VD 薦骨翼 wing of sacrum 髂薦關節 iliosacral junction 薦孔 sacral foramen 陰莖骨 os penis",
    snippet: "腰薦交界／薦椎VD投照標記圖，含薦骨翼、髂薦關節、薦孔辨識，與腰薦椎不穩定好發位置提醒。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "ct3d", sectionName: "CT 3D 重組參考",
    keywords: "CT 3D重組 立體參考 關節突關節 椎間孔 副突",
    snippet: "CT 3D重組影像總覽，輔助理解平面X光片上容易疊加混淆的立體構造。"
  },
  {
    subject: "獸醫臨床及影像診斷學", semester: "大四上", week: 3, weekTitle: "脊椎影像解剖圖譜",
    url: "大四上/獸醫臨床及影像診斷學/week03_脊椎影像解剖圖譜.html",
    section: "checklist", sectionName: "小考前自我檢核",
    keywords: "小考 自我檢核 複習 checklist",
    snippet: "小考前自我檢核清單，逐項確認頸椎、關節突關節、椎間孔、副突、腰薦交界等標記是否都能獨立指認。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "abstract", sectionName: "重點摘要",
    keywords: "Atlas of Normal Radiographic Anatomy Thrall Robertson 正常影像解剖 fakeout 判讀陷阱 正常變異",
    snippet: "原文教科書第3章脊椎整理，核心是「正常長什麼樣」與常見容易誤判為病灶的正常解剖變異（fakeouts）。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "general", sectionName: "攝影原則與椎骨基本構造",
    keywords: "脊椎攝影原則 泡棉墊 positioning pad X光束發散 beam divergence 多中心點 椎骨基本構造 椎體 body 橫突 transverse process 椎弓根 pedicle 椎板 lamina 棘突 spinous process 關節突關節 articular process joint 顱側關節突 cranial articular process 尾側關節突 caudal articular process 副突 accessory process 椎間孔 intervertebral foramen 椎管 vertebral canal 椎間盤 intervertebral disc 椎體骨骺 physis 橫突孔 transverse foramen 肋骨關節面 costal fovea 薦骨翼 wing of sacrum 薦孔 sacral foramen 脈弓骨 hemal arch 五節區比較 示意圖",
    snippet: "脊椎攝影擺位原則與椎骨共同基本構造標記；自製示意圖：椎間孔如何形成、頸胸腰薦尾五節區Process與Foramen比較。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "cervical", sectionName: "頸椎",
    keywords: "頸椎 cervical spine C1 寰椎 atlas C2 樞椎 axis 齒突 dens 寰樞椎不穩定 atlantoaxial instability intercentrum 血管通道 C6 大橫突 transverse process 癒合椎 block vertebra 頸肋 cervical rib",
    snippet: "C1-C7逐節標記圖；寰樞椎排列評估方法、幼犬C1未癒合骨碎片、C2血管通道與粗糙骨小樑、C6大橫突地標、癒合椎。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "thoracic", sectionName: "胸椎",
    keywords: "胸椎 thoracic spine 肋骨頭分葉狀 lobular rib head anticlinal vertebra 轉折椎 副突 accessory process T13過渡性異常 半椎體 hemivertebrae 脊柱後凸 kyphosis screw-tail 貓頸椎橫突腹側延伸 spondylosis fakeout",
    snippet: "胸椎標記圖、肋骨頭分葉狀易誤判膨脹性病灶、anticlinal vertebra地標、T13過渡異常、半椎體與screw-tail品種。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "lumbar", sectionName: "腰椎",
    keywords: "腰椎 lumbar spine L3 L4腹側皮質不明顯 supernumerary vertebra 腰薦關節活動度 lumbosacral motion L7薦化 sacralization 腰薦椎不穩定",
    snippet: "腰椎標記圖、L3/L4腹側皮質正常變異、腰椎計數陷阱、腰薦關節活動度評估、L7薦化與其對L7-S1及髖關節的影響。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "sacral", sectionName: "薦椎",
    keywords: "薦椎 sacral spine 薦髂關節面 auricular surface 薦椎腹側緣角度轉折 薦椎骨折fakeout 糞便氣體影像 fecal gas artifact 曼島貓 Manx cat 薦尾椎發育不良",
    snippet: "薦椎標記圖、薦髂關節面重疊假影、薦椎腹側緣正常角度轉折易誤判骨折、糞便氣體假影、曼島貓薦尾椎特徵。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "caudal", sectionName: "尾椎",
    keywords: "尾椎 caudal spine 椎弓消失 vertebral arch 脈弓骨 hemal arch screw-tail 多發性半椎體",
    snippet: "尾椎椎弓約自Cd4消失、脈弓骨保護尾正中動脈、形狀漸進變化，以及screw-tail品種多發性半椎體的解剖基礎。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 脊椎 正常變異 fakeout",
    snippet: "八點總複習：依節區整理全章「正常但容易被誤判為異常」的清單，考前快速複習用。"
  },
  {
    subject: "犬貓正常影像解剖圖譜", semester: "Textbook", week: null, weekTitle: "第3章：脊椎",
    url: "Textbook/犬貓正常影像解剖圖譜/ch03_脊椎.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 選擇題 是非題 臨床情境題 脊椎",
    snippet: "涵蓋寰樞椎判讀、貓種間差異、anticlinal vertebra、糞便假影辨識的練習題（共5題，含1題臨床情境整合題）。"
  }
];
