/* ══════════════════════════════════════════════════════
   yc._vetalk — 頂列導覽選單資料
   每個年級一筆，topics 是該年級底下的科目（用於下拉選單卡片）。
   新增一個科目時，記得在對應年級的 topics 陣列補一筆
   { title, url, desc }（url 相對於網站根目錄，例如 "大四上/禽病學/index.html"）。
   這份資料同時也是 nav.js 建立頂列選單的唯一來源。
   ══════════════════════════════════════════════════════ */

const SITE_NAV = [
  {
    id: "上群",
    label: "上群",
    icon: "📋",
    url: "index.html",
    topics: [
      { title: "病例筆記", url: "上群/index.html", desc: "住院／門診期間之病例回顧，與臨床推理及決策過程紀錄" }
    ]
  },
  {
    id: "大四",
    label: "大四",
    icon: "🩺",
    url: "index.html",
    topics: [
      { title: "大動物外科手術及實習", url: "大四上/大動物外科手術及實習/index.html", desc: "術前考量與麻醉、縫合技術、腹腔手術（瘤胃／皺胃）等週次筆記" },
      { title: "禽病學", url: "大四上/禽病學/index.html", desc: "已整理第2週：新城病(ND)、第3週：傳染性支氣管炎(IB)" },
      { title: "豬病學", url: "大四上/豬病學/index.html", desc: "已整理第2週：豬病毒性疾病(I)（ASF／CSF／JEV／HEV）" },
      { title: "反芻動物疾病學", url: "大四上/反芻動物疾病學/index.html", desc: "尚無筆記" },
      { title: "伴侶動物復健及物理治療學", url: "大四上/伴侶動物復健及物理治療學/index.html", desc: "已整理 1 週：常見神經科疾病復健" },
      { title: "水產動物疾病學", url: "大四上/水產動物疾病學/index.html", desc: "尚無筆記" },
      { title: "獸醫臨床及影像診斷學", url: "大四上/獸醫臨床及影像診斷學/index.html", desc: "已整理第2週：超音波診斷入門；第3週X光學：X光學基礎、脊椎影像判讀、脊椎影像解剖圖譜；第4週：CT與MRI原理" }
    ]
  },
  {
    id: "大三",
    label: "大三",
    icon: "💉",
    url: "index.html",
    topics: [
      { title: "獸醫病理學及實習", url: "大三/獸醫病理學及實習/index.html", desc: "尚無筆記" },
      { title: "獸醫臨床病理學及實習", url: "大三/獸醫臨床病理學及實習/index.html", desc: "尚無筆記" },
      { title: "獸醫藥理學", url: "大三/獸醫藥理學/index.html", desc: "已整理 17 / 約27 主題：總論、腸胃道、NSAID、抗生素四類、鴉片類止痛藥、麻醉用藥四類、抗癲癇藥物、自主神經三類（膽鹼性／抗膽鹼與NMJ／腎上腺素性）、強心配糖體" },
      { title: "獸醫針灸學", url: "大三/獸醫針灸學/index.html", desc: "尚無筆記" },
      { title: "獸醫麻醉學及實習", url: "大三/獸醫麻醉學及實習/index.html", desc: "尚無筆記" },
      { title: "獸醫公共衛生", url: "大三/獸醫公共衛生/index.html", desc: "尚無筆記" }
    ]
  },
  {
    id: "大二",
    label: "大二",
    icon: "📝",
    url: "index.html",
    topics: [
      { title: "獸醫生理學", url: "總複習/獸醫生理學/index.html", desc: "已整理 22 / 22 主題：全部完成" }
    ]
  },
  {
    id: "大一",
    label: "大一",
    icon: "📔",
    url: "index.html",
    topics: [
      { title: "獸醫解剖學", url: "總複習/解剖生理學/index.html", desc: "已整理 11 / 11 主題：骨骼、關節、肌肉（含四肢）、神經、特殊感覺、生殖、禽類解剖、循環、消化、呼吸、泌尿系統" }
    ]
  },
  {
    id: "Textbook",
    label: "Textbook",
    icon: "📚",
    url: "index.html",
    topics: [
      { title: "犬貓正常影像解剖圖譜", url: "Textbook/犬貓正常影像解剖圖譜/index.html", desc: "Atlas of Normal Radiographic Anatomy and Anatomic Variants in the Dog and Cat, 3rd Ed.（Thrall & Robertson）依章節整理，已完成第3章：脊椎" }
    ]
  }
];
