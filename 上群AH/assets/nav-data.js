/* ══════════════════════════════════════════════════════
   上群動物醫院 — 頂列導覽選單資料
   每個科別一筆，topics 是該科別已整理的主題（用於下拉選單卡片）。
   新增一份主題筆記時，記得在對應科別的 topics 陣列補一筆
   { title, url, desc }（url 相對於網站根目錄，例如 "外科/xxx.html"）。
   這份資料同時也是 nav.js 建立頂列選單的唯一來源。
   ══════════════════════════════════════════════════════ */

const SITE_NAV = [
  {
    id: "內科",
    label: "內科",
    icon: "🩺",
    url: "內科/index.html",
    topics: [
      {
        title: "貓糖尿病照護指南",
        url: "內科/貓糖尿病照護指南.html",
        desc: "SGLT2 抑制劑時代的診斷、治療決策、居家監測與併發症整理"
      },
      {
        title: "貓慢性腎病（CKD）照護指南",
        url: "內科/貓慢性腎病CKD照護指南.html",
        desc: "IRIS 分期系統、依分期治療原則、常見併發症與共病處置、居家照護與監測預後"
      },
      {
        title: "犬化療照護與副作用管理指南",
        url: "內科/犬化療照護與副作用管理指南.html",
        desc: "CHOP 淋巴瘤方案、doxorubicin 心臟毒性監測、AGASACA／腸道腺癌化療實證、不良反應分級處置與腹瀉管理"
      }
    ]
  },
  {
    id: "外科",
    label: "外科",
    icon: "🏥",
    url: "外科/index.html",
    topics: [
      {
        title: "皮下輸尿管繞道系統（SUB）",
        url: "外科/SUB皮下輸尿管繞道系統.html",
        desc: "貓／犬輸尿管阻塞的手術繞道裝置：原理、置放步驟、術後照護"
      },
      {
        title: "貓口腔與牙科照護指南",
        url: "外科/貓口腔與牙科照護指南.html",
        desc: "牙周病分期、常見口腔疾病、麻醉前用藥調整、拔牙照護與抗生素使用原則"
      }
    ]
  },
  {
    id: "影像診斷",
    label: "影像診斷",
    icon: "🩻",
    url: "影像診斷/index.html",
    topics: []
  },
  {
    id: "麻醉",
    label: "麻醉",
    icon: "😴",
    url: "麻醉/index.html",
    topics: []
  },
  {
    id: "急重症",
    label: "急重症",
    icon: "🚨",
    url: "急重症/index.html",
    topics: []
  },
  {
    id: "臨床病理與血檢判讀",
    label: "臨床病理",
    icon: "🧪",
    url: "臨床病理與血檢判讀/index.html",
    topics: []
  },
  {
    id: "藥物治療與劑量",
    label: "藥物治療",
    icon: "💊",
    url: "藥物治療與劑量/index.html",
    topics: []
  },
  {
    id: "技術操作與SOP",
    label: "技術SOP",
    icon: "🛠️",
    url: "技術操作與SOP/index.html",
    topics: []
  },
  {
    id: "FASAVA 2026",
    label: "FASAVA 2026",
    icon: "🎤",
    url: "FASAVA2026/index.html",
    topics: [
      { title: "10/31（六）第一天", url: "FASAVA2026/index.html#1031", desc: "牙科、放射、腫瘤、中獸醫、營養、心臟外科（Mori）等" },
      { title: "11/1（日）第二天", url: "FASAVA2026/index.html#1101", desc: "心臟、腸胃、行為、疼痛、神經、內分泌、皮膚、腎臟、眼科（Jeong、Kobayashi）等" },
      { title: "11/2（一）第三天", url: "FASAVA2026/index.html#1102", desc: "急診、軟組織外科、行為、心臟、腸胃、輸血、呼吸、異寵（Hochleithner）等" }
    ]
  },
  {
    id: "研討會",
    label: "研討會",
    icon: "📝",
    url: "研討會/index.html",
    topics: [
      {
        title: "犬淋巴瘤照護與診斷新趨勢",
        url: "研討會/犬淋巴瘤照護與診斷新趨勢.html",
        desc: "診斷工具比較、分期與分亞期預後、治療選擇與液態切片新工具整理"
      },
      {
        title: "貓眼的獨特性：眼表、虹膜與眼底疾病",
        url: "研討會/貓眼的獨特性-眼表虹膜與眼底.html",
        desc: "FHV-1 角膜結膜炎、FDIM 虹膜黑色素瘤、高血壓視網膜剝離（FASAVA 2026）"
      },
      {
        title: "犬貓角膜顏色：診斷與治療",
        url: "研討會/犬貓角膜顏色診斷與治療.html",
        desc: "角膜顏色對應病理、色素性角膜炎、黑色壞死、內科或手術（FASAVA 2026 Jeong）"
      },
      {
        title: "柴犬的眼睛：白內障、青光眼與角膜內皮炎",
        url: "研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html",
        desc: "柴犬遺傳性白內障、PACG 青光眼、角膜內皮炎（FASAVA 2026 Kobayashi）"
      },
      {
        title: "鸚鵡醫學：幼雛、老年與腫瘤",
        url: "研討會/鸚鵡醫學-幼雛老年與腫瘤.html",
        desc: "幼雛嗉囊與病毒、老年關節與心血管、鳥類與異寵腫瘤（FASAVA 2026 預習）"
      },
      {
        title: "異寵超音波：從入門到進階",
        url: "研討會/異寵超音波-從入門到進階.html",
        desc: "鳥、爬蟲、小型哺乳類的超音波適應症、限制與檢查路徑（FASAVA 2026 預習）"
      },
      {
        title: "慢性疼痛評估與抗 NGF 單株抗體",
        url: "研討會/慢性疼痛評估與抗NGF單株抗體.html",
        desc: "OA 三步驟評估、犬貓慢性疼痛量表、bedinvetmab／frunevetmab 療效與骨重塑安全性（FASAVA 2026 Steagall）"
      },
      {
        title: "慢性疼痛藥物治療：證據整理",
        url: "研討會/慢性疼痛藥物治療-證據整理.html",
        desc: "NSAID、grapiprant、tramadol、gabapentin、amantadine 的證據與劑量，含圓桌問答（FASAVA 2026 Steagall）"
      }
    ]
  }
];
