/* ══════════════════════════════════════════════════════
   上群AH — 頂列導覽選單資料
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
    topics: []
  },
  {
    id: "外科",
    label: "外科",
    icon: "🔪",
    url: "外科/index.html",
    topics: [
      {
        title: "皮下輸尿管繞道系統（SUB）",
        url: "外科/SUB皮下輸尿管繞道系統.html",
        desc: "貓／犬輸尿管阻塞的手術繞道裝置：原理、置放步驟、術後照護"
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
  }
];
