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
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "overview", sectionName: "骨骼系統總論",
    keywords: "骨骼分類 長骨 短骨 扁平骨 不規則骨 籽骨 含氣骨 方位術語 cranial caudal dorsal ventral medial lateral proximal distal palmar plantar rostral 骨骼表面標記 process tubercle tuberosity trochanter crest fossa foramen notch fovea condyle epicondyle trochlea",
    snippet: "骨骼分類（長骨/短骨/扁平骨/不規則骨/籽骨）與全身通用的方位術語、骨骼表面標記術語對照表，是後面各部位骨骼小節共用的基礎語彙。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "skull", sectionName: "頭骨",
    keywords: "skull neurocranium viscerocranium 神經顱 顏面顱 枕骨 occipital 蝶骨 sphenoid 顳骨 temporal 額骨 frontal 頂骨 parietal 篩骨 ethmoid 切齒骨 上頜骨 maxilla 鼻骨 淚骨 顴骨 zygomatic 腭骨 翼骨 犁骨 下頜骨 mandible foramen magnum 枕骨大孔 顳頜關節 TMJ 舌骨器 hyoid 咀嚼肌 顳肌 咬肌 masseter 翼肌",
    snippet: "神經顱（枕骨/蝶骨/顳骨/額骨/頂骨/篩骨）與顏面顱（切齒骨/上頜骨/鼻骨/淚骨/顴骨/腭骨/翼骨/犁骨/下頜骨）重要構造整理，含舌骨器與咀嚼肌群。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "vertebral", sectionName: "脊柱與胸廓",
    keywords: "vertebral column 脊柱 頸椎 cervical 胸椎 thoracic 腰椎 lumbar 薦椎 sacral 尾椎 caudal 脊柱公式 C7T13L7S3Cd 寰椎 atlas 樞椎 axis dens 齒突 寰樞關節不穩定 atlantoaxial instability anticlinal vertebra T11 肋椎關節 costovertebral 肋骨 ribs 胸骨 sternum 椎間盤突出 IVDD 腰薦間隙 L7-S1 硬膜外麻醉 epidural 腦脊髓液採集 cisternal puncture",
    snippet: "犬脊柱公式 C7T13L7S3Cd20-23、椎骨共同構造、寰椎/樞椎特化構造與寰樞不穩定、T11 anticlinal vertebra、薦椎、肋骨胸骨、臨床穿刺定位地標、IVDD。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "forelimb", sectionName: "前肢骨骼",
    keywords: "thoracic limb forelimb 肩胛骨 scapula 鎖骨 clavicle 肱骨 humerus 大結節 小結節 結節間溝 橈骨 radius 尺骨 ulna 鷹嘴 olecranon 肘突 anconeal process 冠狀突 coronoid process 肘關節發育不良 elbow dysplasia FCP UAP 腕骨 carpal 掌骨 metacarpal 指骨 phalanges 懸爪 dewclaw 斷爪 declaw onychectomy",
    snippet: "肩胛骨（鎖骨退化）、肱骨、橈尺骨（肘關節發育不良 FCP/UAP）、腕掌指骨（7塊腕骨）構造整理，含斷爪手術倫理提醒。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "hindlimb", sectionName: "後肢骨骼",
    keywords: "pelvic limb 骨盆 pelvis 髂骨 ilium 坐骨 ischium 恥骨 pubis 髖臼 acetabulum 閉孔 obturator foramen 髖關節脫臼 hip luxation 髖關節發育不良 hip dysplasia Ortolani test FHO 股骨 femur 轉子 trochanter 膝關節 stifle 十字韌帶 cruciate ligament 前抽屜試驗 cranial drawer test 髕骨脫臼 patellar luxation 腓骨 fibula 跗骨 tarsal 蹠骨 metatarsal 跟腱斷裂 plantigrade",
    snippet: "骨盆三骨（髂骨/坐骨/恥骨）與髖臼、髖關節脫臼/發育不良、股骨、膝關節（十字韌帶/髕骨脫臼）、跗蹠趾骨，含跟腱斷裂的蹠行步態。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 骨骼系統",
    snippet: "10點考試/臨床導向整理：方位術語、脊柱公式、寰樞椎、肋椎關節、肩胛骨懸吊結構、肘髖關節疾病、膝關節臨床重點、腕跗骨組成、臨床定位地標、髕骨/豆骨籽骨辨識。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "骨骼系統",
    url: "總複習/解剖生理學/骨骼系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 骨骼系統",
    snippet: "涵蓋骨骼系統總論到後肢各章節重點的練習題（是非/選擇/簡答，共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "overview", sectionName: "中樞神經系統總論",
    keywords: "CNS PNS 中樞神經系統 周邊神經系統 cranial nerves spinal nerves ganglia 感覺傳入 運動傳出 somatic autonomic sympathetic parasympathetic 灰質 grey matter 白質 white matter oligodendroglia myelin tract lemniscus decussation funiculus fasciculus commissura 胚胎發育 telencephalon diencephalon mesencephalon metencephalon myelencephalon 腦室",
    snippet: "CNS（腦＋脊髓）與PNS（顱神經/脊神經/神經節）的區分、神經系統三大功能、灰質白質組成原則、腦部胚胎發育五分區與對應腦室。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "forebrain", sectionName: "前腦：大腦與間腦",
    keywords: "forebrain cerebrum telencephalon diencephalon 大腦 端腦 間腦 額葉 頂葉 顳葉 枕葉 frontal parietal temporal occipital lobe cruciate sulcus 十字溝 basal nuclei 基底核 caudate putamen globus pallidus striatum 紋狀體 substantia nigra corticospinal tract 內囊 internal capsule corona radiata limbic system 邊緣系統 cingulate gyrus hippocampus fornix amygdala thalamus 視丘 hypothalamus 下視丘 epithalamus habenular pineal gland mammillary body lamina terminalis OVLT tuber cinereum pituitary gland adenohypophysis neurohypophysis",
    snippet: "大腦皮質分葉與功能區、基底核（尾核/被殼/蒼白球）與巴金森氏症、邊緣系統、視丘與下視丘、上視丘（松果腺）、腦下垂體前後葉。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "midbrain", sectionName: "中腦",
    keywords: "mesencephalon midbrain 中腦 tectum 頂蓋 corpora quadrigemina 四疊體 rostral colliculus caudal colliculus 前丘 後丘 superior inferior colliculus tegmentum 被蓋 red nucleus 紅核 substantia nigra 黑質 reticular formation 網狀結構 periaqueductal gray PAG pretectal region 頂蓋前區 crus cerebri 大腦腳 pupillary light reflex 瞳孔光反射 oculomotor trochlear nerve",
    snippet: "中腦三分區（頂蓋/被蓋/大腦腳）、前丘後丘視聽覺反射、紅核黑質網狀結構、瞳孔光反射路徑、CN III IV起源。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "hindbrain", sectionName: "後腦：橋腦、延腦、小腦",
    keywords: "pons 橋腦 medulla oblongata 延腦 myelencephalon cerebellum 小腦 metencephalon vermis 蚓部 flocculonodular lobe 絨球小結葉 primary fissure cerebellar peduncle 小腦腳 superior middle inferior pyramids 錐體 decussation of pyramids 錐體交叉 trapezoid body 斜方體 olivary nucleus 橄欖核 vital centers 生命中樞 ataxia dysmetria intention tremor 共濟失調 辨距不良 意向性震顫",
    snippet: "橋腦連結大腦小腦、小腦分層分葉與三對小腦腳、延腦錐體交叉與生命中樞、小腦病灶不造成無力的臨床觀念。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "spinal", sectionName: "脊髓",
    keywords: "spinal cord 脊髓 cervical thoracic lumbar sacral caudal intumescence 頸膨大 腰膨大 cauda equina 馬尾 conus medullaris 脊髓圓錐 dorsal horn ventral horn lateral horn 背角 腹角 外側角 dorsal funiculus lateral funiculus ventral funiculus dorsal column medial lemniscus fasciculus gracilis fasciculus cuneatus spinothalamic tract spinocerebellar tract corticospinal tract rubrospinal reticulospinal vestibulospinal UMN LMN upper motor neuron lower motor neuron hyperreflexia hyporeflexia epidural anesthesia myelography",
    snippet: "各物種脊髓節段數比較、灰質白質構造、上行徑（本體感覺/痛溫覺/非意識性本體感覺）與下行徑（錐體/錐體外系統）、UMN/LMN鑑別、臨床穿刺定位。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "meninges", sectionName: "腦膜與腦脊髓液",
    keywords: "meninges 腦脊髓膜 dura mater 硬膜 arachnoid mater 蛛網膜 pia mater 軟膜 epidural space 硬膜上腔 subdural space 硬膜下腔 subarachnoid space 蛛網膜下腔 CSF 腦脊髓液 choroid plexus 脈絡叢 lateral ventricle third ventricle fourth ventricle mesencephalic aqueduct central canal arachnoid villi 蛛網膜絨毛 cisternal puncture lumbar puncture hydrocephalus 水腦症 meningitis 腦膜炎",
    snippet: "腦脊髓膜三層構造、腦室系統、CSF由脈絡叢產生到蛛網膜絨毛回收的完整循環路徑、CSF採集與水腦症/腦膜炎臨床應用。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "cranial", sectionName: "12對顱神經",
    keywords: "cranial nerves 顱神經 olfactory optic oculomotor trochlear trigeminal abducens facial vestibulocochlear glossopharyngeal vagus accessory hypoglossal 嗅神經 視神經 動眼神經 滑車神經 三叉神經 外展神經 顏面神經 前庭耳蝸神經 舌咽神經 迷走神經 副神經 舌下神經 head tilt nystagmus 頭傾 眼球震顫 neurolocalization 神經定位",
    snippet: "12對顱神經功能簡表、腦幹起源分布（中腦/橋腦/延腦）、神經定位診斷概念、顏面神經與前庭耳蝸神經常見臨床異常。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 神經系統 CNS",
    snippet: "11點考試/臨床導向整理：CNS/PNS分類、灰質白質、腦部發育五分區、基底核與黑質、邊緣系統、下視丘垂體、中腦四疊體、小腦協調功能、延腦生命中樞與UMN/LMN、CSF循環與腦膜、顱神經定位。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "神經系統",
    url: "總複習/解剖生理學/神經系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 神經系統 CNS",
    snippet: "涵蓋CNS總論到顱神經各章節重點的練習題（是非/選擇/簡答，共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "overview", sectionName: "關節總論",
    keywords: "arthrology 關節學 韌帶學 syndesmology 纖維關節 fibrous joint 縫合 suture syndesmosis gomphosis 嵌合 軟骨關節 cartilaginous joint synchondrosis symphysis 半動關節 amphiarthrosis 滑液關節 synovial joint diarthrosis 關節腔 關節軟骨 articular cartilage 關節囊 articular capsule 纖維層 滑液層 synovial fluid 韌帶 ligament 半月板 meniscus 關節盤 articular disc 關節唇 labrum glenoidale 滑液囊 bursa 腱鞘 tendon sheath",
    snippet: "關節三大分類（纖維/軟骨/滑液關節）與次分類（縫合、syndesmosis、synchondrosis、symphysis），滑液關節構造（關節囊、滑液、韌帶、半月板、關節唇）整理。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "movement", sectionName: "運動方式與分類",
    keywords: "gliding movement 滑動 angular movement 角度運動 flexion extension adduction abduction 屈曲 伸展 內收 外展 rotary movement circumduction rotation 迴旋 旋轉 pronation supination 旋前 旋後 plane joint 平面關節 hinge joint ginglymus 鉸鏈關節 pivot joint trochoid 車軸關節 condyloid ellipsoid joint 髁狀關節 saddle joint 鞍狀關節 ball-and-socket joint 球窩關節 cotylic joint 杵臼關節 單軸 雙軸 多軸 uniaxial biaxial multiaxial",
    snippet: "滑液關節運動方式（滑動/角度/迴旋運動）與依軸心數目分類的七種關節類型（平面/鉸鏈/車軸/髁狀/鞍狀/球窩/杵臼關節）對照表。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "forelimb", sectionName: "前肢關節",
    keywords: "shoulder joint glenohumeral joint 肩關節 glenoid cavity 關節盂 glenohumeral ligament 盂肱韌帶 intertubercular groove 結節間溝 biceps brachii tendon transverse humeral retinaculum elbow joint 肘關節 hinge joint humeral condyle trochlear notch coronoid process anconeal process collateral ligament annular ligament interosseous ligament carpal joint 腕關節 radiocarpal joint intercarpal joint carpometacarpal joint",
    snippet: "肩關節（球窩關節，盂肱韌帶與結節間溝二頭肌腱穩定）、肘關節（鉸鏈關節）、腕關節（橈腕/腕骨間/腕掌三層關節）構造與韌帶整理。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "hindlimb", sectionName: "後肢關節",
    keywords: "hip joint coxal joint 髖關節 cotylic joint 杵臼關節 acetabulum 髖臼 ligament of femoral head 股骨頭韌帶 圓韌帶 ligamentum teres transverse acetabular ligament 髖臼橫韌帶 stifle joint 膝關節 femorotibial joint 股脛關節 femoropatellar joint 股髕關節 meniscus 半月板 cranial cruciate ligament caudal cruciate ligament 前十字韌帶 後十字韌帶 patellar ligament tibiofibular joint 脛腓關節 tarsal joint 跗關節 tibiotarsal joint intertarsal joint tarsometatarsal joint calcanean tendon",
    snippet: "髖關節（杵臼關節，股骨頭韌帶與髖臼橫韌帶）、膝關節（股脛關節十字韌帶半月板＋股髕關節）、跗關節（脛跗/跗骨間/跗蹠三層關節）整理。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "axial", sectionName: "中軸骨關節",
    keywords: "skull suture 顱骨縫合線 sutura serrata squamosa plana foliata temporomandibular joint TMJ 顳頜關節 articular disc 關節盤 intervertebral joint 椎體間關節 articular process joint zygapophyseal joint 關節突關節 atlanto-occipital joint 寰枕關節 atlantoaxial joint 寰樞關節 nuchal ligament 項韌帶 supraspinous ligament 棘上韌帶 interspinous ligament 棘間韌帶 yellow ligament ligamentum flavum 黃韌帶 longitudinal ligament 縱韌帶 costovertebral joint 肋椎關節 radiate ligament costotransverse ligament sternocostal joint costochondral junction symphysis pelvis 骨盆聯合 sacroiliac joint 薦髂關節 sacrotuberous ligament",
    snippet: "顱骨縫合線、顳頜關節（含關節盤）、脊柱關節（椎體間關節、關節突關節、寰枕/寰樞關節）與周邊韌帶、肋椎關節、骨盆聯合與薦髂關節整理。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 關節系統",
    snippet: "10點考試/臨床導向整理：三大關節分類、滑液關節構造口訣、運動軸心數目分類、肩髖膝肘關節類型、腕跗三層關節、脊柱雙重關節系統、同骨不同關節類型的例子。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "關節系統",
    url: "總複習/解剖生理學/關節系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 關節系統",
    snippet: "涵蓋關節總論到中軸骨關節各章節重點的練習題（是非/選擇/簡答，共15題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "overview", sectionName: "肌肉學總論",
    keywords: "肌肉分類 骨骼肌 平滑肌 心肌 skeletal smooth cardiac 構造層次 epimysium perimysium endomysium sarcolemma myofibril sarcomere myosin actin 起點 origin 止點 insertion 肌腱 tendon 腱膜 aponeurosis 韌帶 ligament 肌膜 fascia 肌束排列 fusiform pennate unipennate bipennate multipennate circular sphincter 肌肉命名原則",
    snippet: "肌肉三種類型、骨骼肌結締組織構造層次（epimysium/perimysium/endomysium）、起止點與肌腱腱膜、肌束排列型態、肌肉命名七大原則整理。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "trunk", sectionName: "軀幹肌群",
    keywords: "軀幹肌群 斜方肌 trapezius 菱形肌 rhomboideus 闊背肌 latissimus dorsi 腹鋸肌 serratus ventralis 軸上肌 epaxial 髂肋肌 iliocostalis 最長肌 longissimus 橫脊肌 transversospinalis 臂頭肌 brachiocephalicus 胸肌 pectoralis 肋間肌 intercostal 背鋸肌 serratus dorsalis 腹壁 abdominal wall 腹外斜肌 腹內斜肌 腹橫肌 腹直肌 白線 linea alba 腹股溝管 inguinal canal 尾部肌群",
    snippet: "軀幹肌群完整整理：肩胛骨懸吊肌、軸上肌三系統、頸動脈鞘、臂頭肌與胸肌群、呼吸肌、腹壁四層肌與白線/腹股溝管、尾部肌群。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "headneck", sectionName: "頭頸部肌肉簡介",
    keywords: "頭部肌肉 皮肌 cutaneous muscle 頸闊肌 platysma 面部淺層肌肉 口輪匝肌 orbicularis oris 頰肌 buccinator 眼輪匝肌 orbicularis oculi 咀嚼肌",
    snippet: "頭部肌肉六大分區與神經支配、皮肌與面部淺層肌肉整理；咀嚼肌詳見骨骼系統頁面，避免重複。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 肌肉系統",
    snippet: "十點肌肉系統總複習：構造層次、命名規則、肩胛骨懸吊、軸上肌排列、呼吸肌分工、腹壁層次、腹股溝管、臂頭肌、頸動脈鞘等考試重點。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "肌肉系統",
    url: "總複習/解剖生理學/肌肉系統.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 肌肉系統",
    snippet: "涵蓋肌肉構造、命名、軀幹懸吊肌、軸上肌、呼吸肌、腹壁層次等重點的練習題（共12題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "overview", sectionName: "特殊感覺總論",
    keywords: "一般感覺 general senses 特殊感覺 special senses 視覺 聽覺 平衡 嗅覺 味覺",
    snippet: "區分一般感覺與特殊感覺，總覽視覺、聽覺與平衡、嗅覺味覺、相關腦神經各章節架構。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "general", sectionName: "一般感覺受器",
    keywords: "痛覺 溫度覺 機械覺 觸覺受器 化學覺 chemoreceptor 路氏小體 Ruffini corpuscle 頸動脈體 主動脈體",
    snippet: "痛覺/溫度覺/機械覺（未包覆與包覆型觸覺受器）/化學覺受器分類，作為特殊感覺的背景知識。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "vision", sectionName: "視覺系統（眼）",
    keywords: "eye orbit 眼眶 視神經管 optic canal 眶裂 orbital fissure 眼鞘 periorbita 眼瞼 third eyelid 第三眼瞼 淚器 lacrimal apparatus 眼外肌 extrinsic muscles rectus oblique retractor bulbi 鞏膜 sclera 角膜 cornea 虹膜 iris 睫狀體 ciliary body 脈絡膜 choroid 視網膜 retina 瞳孔 pupil 瞳孔對光反射 PLR CN III CN IV CN VI",
    snippet: "眼眶三孔洞、眼鞘、眼瞼淚器、眼外肌與支配腦神經、眼球三層構造（纖維膜/血管膜/視網膜）、瞳孔自主神經調控、視覺路徑。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "hearing", sectionName: "聽覺與平衡系統（耳）",
    keywords: "ear 外耳 中耳 內耳 聽小骨 ossicles malleus incus stapes 耳蝸 cochlea 螺旋器官 organ of Corti 前庭系統 vestibular 聽斑 macula 壺腹嵴 crista ampullaris 半規管 semicircular canal 毛細胞 hair cell 前庭核 nystagmus 眼球震顫",
    snippet: "外中內耳三區域、聽小骨傳導、耳蝸與螺旋器官、聽覺路徑、前庭系統（聽斑與壺腹嵴）、毛細胞機轉。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "chemosense", sectionName: "嗅覺與味覺",
    keywords: "olfaction 嗅覺 嗅覺上皮 olfactory epithelium 犁鼻器 vomeronasal organ Jacobson's organ gustation 味覺 舌乳頭 papillae CN VII CN IX CN X",
    snippet: "嗅覺上皮三細胞、嗅覺傳導路徑（不經丘腦）、犁鼻器、舌乳頭六分類、味覺依舌部位對應 CN VII/IX/X。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "nerves", sectionName: "特殊感覺相關腦神經",
    keywords: "cranial nerves 腦神經 CN I CN II CN III CN IV CN V CN VI CN VII CN VIII CN IX CN X 三叉神經 trigeminal 顏面神經 facial nerve",
    snippet: "CN I–X 完整運動/感覺/副交感功能表，眼相關孔洞地標，耳相關 CN VII 與 CN VIII 走行關係。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 特殊感覺",
    snippet: "十點特殊感覺總複習，涵蓋視覺、聽覺平衡、嗅覺味覺、相關腦神經各章節臨床考點。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "特殊感覺",
    url: "總複習/解剖生理學/特殊感覺.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 特殊感覺",
    snippet: "涵蓋視覺、聽覺平衡、嗅覺味覺、腦神經等重點的練習題（共14題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "overview", sectionName: "禽類解剖總論",
    keywords: "avian anatomy 禽類解剖 哺乳類差異 羽毛 feather 含氣骨骼 pneumatic bone 單向呼吸 air sac 無膀胱 生殖器官季節性",
    snippet: "哺乳類與禽類七大解剖生理差異總表：羽毛、含氣骨骼、高效消化、無膀胱、生殖器官季節性縮小、單向呼吸、高心臟體重比。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "integument", sectionName: "外皮系統",
    keywords: "喙 beak rhamphotheca rhinotheca gnathotheca 蠟膜 cere 羽毛 feather 正羽 contour feather 羽軸 羽枝 羽小枝 腿足鱗片 尾脂腺 uropygial gland",
    snippet: "體表區域命名、喙的分部、蠟膜、羽毛構造與種類、腿足鱗片、皮膚特性與唯一皮膚腺體尾脂腺。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "muscular", sectionName: "肌肉系統：飛行肌",
    keywords: "pectoralis thoracicus supracoracoideus 飛行肌 下擊 上擊 礦化肌腱 斷翼術 肌肉注射",
    snippet: "兩大飛行肌 pectoralis thoracicus（下擊）與 supracoracoideus（上擊）、礦化肌腱、外科斷翼術、臨床肌肉注射部位。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "digestive", sectionName: "消化系統",
    keywords: "嗉囊 crop 鴿嗉囊乳 crop milk 腺胃 proventriculus 肌胃 gizzard koilin 十二指腸 胰臟 肝臟 盲腸 泄殖腔 cloaca",
    snippet: "嗉囊依食性分型、腺胃/肌胃分工與 koilin 保護層、十二指腸胰臟肝臟、盲腸退化型態、泄殖腔三段構造。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "respiratory", sectionName: "呼吸系統：氣囊系統",
    keywords: "air sac 氣囊 單向氣流 unidirectional airflow 含氣肱骨 無橫膈",
    snippet: "6–9個氣囊分前後兩群、單向氣流機制（空氣通過肺兩次）、無橫膈靠肋骨胸骨運動呼吸。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "urogenital", sectionName: "泌尿生殖系統",
    keywords: "無膀胱 泄殖腔 cloaca 卵巢 輸卵管 左側發育 精子儲存小管 SST",
    snippet: "無膀胱、公鳥交配器官多僅為泄殖腔黏膜皺褶、多數禽類僅左側卵巢輸卵管發育、輸卵管五段分泌時程、精子儲存小管。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "circulation", sectionName: "循環系統",
    keywords: "四腔心 翼靜脈 頸靜脈 蹠靜脈 心臟穿刺 靜脈採血",
    snippet: "四腔心與哺乳類相同、動靜脈系統分支、臨床心臟穿刺與靜脈採血部位（翼靜脈/頸靜脈/蹠靜脈）。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "immune", sectionName: "免疫系統",
    keywords: "胸腺 thymus 法氏囊 bursa of Fabricius B細胞 T細胞 脾臟 淋巴結",
    snippet: "胸腺（T細胞來源）與法氏囊（禽類特有、B細胞來源）、脾臟位置、雞火雞缺乏淋巴結。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "sensory", sectionName: "神經與感覺系統",
    keywords: "鞏膜骨小板 scleral ossicles 色彩辨識 坐骨神經 馬立克氏病 Marek's disease 耳缺耳廓",
    snippet: "整體與哺乳類無顯著差異、耳缺耳廓、眼睛含鞏膜骨小板具色彩辨識、坐骨神經與馬立克氏病關聯。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "endocrine", sectionName: "內分泌系統",
    keywords: "甲狀腺 副甲狀腺 頸動脈體 後鰓體 ultimobranchial body 降鈣素 calcitonin 腎上腺",
    snippet: "甲狀腺/副甲狀腺/頸動脈體/後鰓體（分泌降鈣素）/腎上腺的頸部與腎臟相對位置。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 禽類解剖",
    snippet: "十點整合各系統「輕量化/高效率化以利飛行」核心邏輯的複習重點。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "禽類解剖",
    url: "總複習/解剖生理學/禽類解剖.html",
    section: "quiz", sectionName: "練習題",
    keywords: "練習題 是非題 選擇題 簡答題 quiz 自我測驗 顯示答案 禽類解剖",
    snippet: "涵蓋外皮到內分泌全部章節重點的練習題（共13題），點擊即可顯示答案與解析。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "overview", sectionName: "生殖系統總論",
    keywords: "reproductive system 生殖系統總論 gametogenic endocrine 管狀生殖道 mucosa muscularis serosa stallion mare bull cow ram ewe boar sow rooster hen dog bitch tom queen",
    snippet: "公畜母畜生殖道共通的三層組織構造（黏膜/肌層/漿膜）、配子生成與內分泌雙重功能、各物種公母術語對照表。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "maletract", sectionName: "睪丸、副睪與輸精管",
    keywords: "testis epididymis ductus deferens vas deferens 睪丸 副睪 輸精管 陰囊 scrotum tunica vaginalis albuginea cremaster pampiniform plexus 蔓狀靜脈叢 熱交換 seminiferous tubule Sertoli Leydig cells 隱睪症 cryptorchidism 睪丸下降 testes descent 睪丸位置 perineal inguinal intermediate testicond 腹股溝疝氣 inguinal hernia",
    snippet: "陰囊分層、睪丸組織構造（曲細精管/Sertoli/Leydig）、副睪五大功能、精索熱交換機轉、睪丸下降與隱睪症、各物種睪丸位置比較。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "maleaccessory", sectionName: "副性腺、陰莖與包皮",
    keywords: "accessory sex gland seminal vesicle 儲精囊 prostate 前列腺 bulbourethral gland Cowper's gland 尿道球腺 cremaster urethralis bulbospongiosus ischiocavernosus retractor penis muscle 陰莖 penis 包皮 prepuce fibroelastic musculocavernous sigmoid flexure 乙狀彎曲 os penis 陰莖骨 bulbus glandis copulatory tie 交配栓結 preputial diverticulum 包皮憩室 penile spines 陰莖棘",
    snippet: "副性腺物種差異（犬貓無儲精囊、犬無尿道球腺）、生殖器肌肉、陰莖類型（纖維彈性型vs肌肉海綿型）與各物種陰莖包皮特化構造、犬交配栓結。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "femaleovary", sectionName: "卵巢與輸卵管",
    keywords: "ovary 卵巢 germinal epithelium tunica albuginea cortex medulla theca interna granulosa corpus hemorrhagicum corpus luteum corpus albicans 黃體 estrogen progesterone oviduct uterine tube salpinx infundibulum fimbriae ampulla isthmus utero-tubal junction 受精 fertilization 排卵窩 ovulation fossa mare ovary broad ligament mesovarium ovarian bursa 卵巢囊",
    snippet: "卵巢構造與內分泌（濾泡→黃體→白體）、馬卵巢排卵窩特殊構造、各物種卵巢側別活性差異、輸卵管分區與受精部位、卵巢懸吊韌帶。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "femaleuterus", sectionName: "子宮、子宮頸與陰道",
    keywords: "uterus 子宮 simplex bicornuate duplex 單子宮 雙角子宮 重複子宮 cervix 子宮頸 annular ring interdigitating pad fornix vagina 陰道 vestibule vulva 外陰部 PGF2α capacitation 精子獲能 mammary gland teat 乳腺 乳頭 乳管",
    snippet: "子宮型態三分類與物種差異、子宮/子宮頸/陰道功能、牛豬馬子宮頸構造與精子屏障差異、乳腺乳頭跨物種比較。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
    url: "總複習/解剖生理學/生殖系統.html",
    section: "summary", sectionName: "學習重點整理",
    keywords: "複習 重點整理 考試 生殖系統",
    snippet: "十點公畜母畜生殖系統總複習，涵蓋睪丸溫度調節、副性腺物種差異、陰莖類型、卵巢構造、輸卵管受精部位、子宮型態、子宮頸屏障、乳腺比較。"
  },
  {
    subject: "解剖生理學", semester: "總複習", week: null, weekTitle: "生殖系統",
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
  }
];
