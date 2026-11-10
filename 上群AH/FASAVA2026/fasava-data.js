/* ══════════════════════════════════════════════════════
   FASAVA 2026 課表與講義資料（FASAVA2026/index.html 專用）
   課表抄自官網 Program 頁（使用者截圖，2026-11-04）。
   之後拿到新講義或做好筆記，只要改下面的 MATERIALS，頁面會自己更新。
   ══════════════════════════════════════════════════════ */

/* 科別：key → [中文, English]；順序不影響畫面（畫面依資料多寡排序） */
const FASAVA_SPECIALTIES = {
  dent:   ['牙科與口腔外科', 'Dentistry and Oral Surgery'],
  abx:    ['抗生素治療', 'Antibiotic therapy'],
  rad:    ['放射影像學', 'Radiology'],
  onc:    ['腫瘤學', 'Oncology'],
  tcvm:   ['中獸醫學', 'Chinese Veterinary Medicine'],
  nutr:   ['營養學', 'Nutrition'],
  card:   ['心臟學', 'Cardiology'],
  gi:     ['腸胃學', 'Gastroenterology'],
  cp:     ['臨床病理學', 'Clinical pathology'],
  beh:    ['行為學', 'Behavior'],
  pain:   ['疼痛管理', 'Pain management'],
  neuro:  ['神經學', 'Neurology'],
  oph:    ['眼科學', 'Ophthalmology'],
  endo:   ['內分泌學', 'Endocrinology'],
  derm:   ['皮膚學', 'Dermatology'],
  neph:   ['腎臟學', 'Nephrology'],
  ent:    ['耳鼻喉科', 'Otolaryngology'],
  er:     ['急診', 'Emergency'],
  sts:    ['軟組織外科', 'Soft tissue surgery'],
  tx:     ['輸血醫學', 'Transfusion medicine'],
  resp:   ['呼吸醫學', 'Respiratory medicine'],
  exo:    ['異寵醫學', 'Exotics animal medicine']
};

const FASAVA_ROOMS = ['A', 'B', 'C', 'D', 'F', 'G', 'H'];   // 官網沒有 E 廳

/* 講者的共用寫法，避免同一人在課表裡拼法不一致 */
const S = {
  gawor: ['dent', 'Jerzy Gawor', 'English'],
  wuYC: ['abx', 'Ying-Chen Wu', 'Mandarin'],
  heng: ['rad', 'Hock Gan Heng', 'English'],
  cheng: ['onc', 'Han-Yun (Hannah) Cheng', 'English'],
  xie: ['tcvm', 'Huisheng Xie', 'English'],
  chiang: ['nutr', 'Chih-Fan (Jeff) Chiang', 'Mandarin'],
  mori: ['card', 'Takuya Mori', 'English'],
  nakashima: ['gi', 'Ko Nakashima', 'Japanese–English'],
  lee: ['onc', 'Thomas Lee', 'English'],
  ishida: ['cp', 'Takuo Ishida', 'English'],
  hung: ['card', 'Yong-Wei Hung', 'Mandarin'],
  kim: ['gi', 'Hakhyun Kim', 'Korean–Mandarin'],
  fatjo: ['beh', 'Jaume Fatjo', 'English'],
  steagall: ['pain', 'Paulo Steagall', 'English'],
  hong: ['neuro', 'Hsuan-Ping (Sissy) Hong', 'English'],
  ho: ['onc', 'Rita Ho', 'Mandarin'],
  jeong: ['oph', 'Manbok Jeong', 'Korean–English'],
  song: ['onc', 'Woojin Song', 'Korean–Mandarin'],
  bowen: ['beh', 'Jon Bowen', 'English'],
  su: ['endo', 'Bi-Ling Su', 'Mandarin'],
  wuCY: ['derm', 'Chi-Yen Wu', 'English'],
  jank: ['neph', 'Michal Jank', 'English'],
  morissette: ['cp', 'Eric Morissette', 'English'],
  liu: ['ent', 'Nai-Chieh Liu', 'English'],
  kobayashi: ['oph', 'Yoshitaka Kobayashi', 'English'],
  yamashita: ['neph', 'Saori Kobayashi-Yamashita', 'Japanese–English'],
  boyd: ['er', 'Corrin Boyd', 'English'],
  lai: ['sts', 'Grace Peichun Lai', 'English'],
  mills: ['beh', 'Daniel S Mills', 'English'],
  cote: ['card', 'Etienne Côté', 'English'],
  simpson: ['gi', 'Kenneth W. Simpson', 'English'],
  chang: ['neuro', 'Ya-Pei Chang', 'Mandarin'],
  manfred: ['exo', 'Manfred Hochleithner', 'English'],
  baranidharan: ['tx', 'GR Baranidharan', 'English'],
  lin: ['resp', 'Chung-Hui (Joan) Lin', 'Mandarin'],
  claudia: ['exo', 'Claudia Hochleithner', 'English']
};

/* 每個 session 列依序對應 FASAVA_ROOMS：A B C D F G H */
const FASAVA_DAYS = [
  {
    id: '1031', label: '10/31（六）', en: 'Sat', title: '第一天',
    rows: [
      { time: '09:00–10:00', cells: [S.gawor, S.wuYC, S.heng, S.cheng, S.xie, S.chiang, S.mori] },
      { time: '10:00–10:15', note: '休息' },
      { time: '10:15–11:15', cells: [S.gawor, S.wuYC, S.heng, S.cheng, S.xie, S.chiang, S.mori] },
      { time: '11:15–11:30', note: '休息' },
      { time: '11:30–12:30', note: '開幕典禮 Opening Ceremony', sub: 'TaiNEX 2，4F', event: true },
      { time: '12:30–14:00', note: '午餐 · 營養特別場 Nutrition Special Event', sub: 'Stanley Marks，開幕典禮後 4F', event: true },
      { time: '14:00–15:30', cells: [S.gawor, S.nakashima, S.heng, S.lee, S.ishida, S.chiang, S.mori] },
      { time: '15:30–16:00', note: '休息' },
      { time: '16:00–17:30', cells: [S.gawor, S.nakashima, S.heng, S.lee, S.ishida, S.chiang, S.mori] },
      { time: '18:00–20:00', note: '歡迎晚會 Welcome Party', sub: 'TaiNEX 2，4F', event: true }
    ]
  },
  {
    id: '1101', label: '11/1（日）', en: 'Sun', title: '第二天',
    rows: [
      { time: '09:00–10:30', cells: [S.hung, S.kim, S.fatjo, S.steagall, S.hong, S.ho, S.jeong] },
      { time: '10:30–11:00', note: '休息' },
      { time: '11:00–12:30', cells: [S.hung, S.song, S.bowen, S.steagall, S.hong, S.ho, S.jeong] },
      { time: '12:30–14:00', note: '午餐 · 營養特別場 Nutrition Special Event', sub: 'Stanley Marks，7F Hall A', event: true },
      { time: '14:00–15:30', cells: [S.su, S.wuCY, S.jank, S.morissette, S.liu, S.ho, S.kobayashi] },
      { time: '15:30–16:00', note: '休息' },
      { time: '16:00–17:30', cells: [S.su, S.wuCY, S.yamashita, S.morissette, S.liu, S.ho, S.kobayashi] },
      { time: '18:30–21:30', note: '晚宴 Gala Dinner', sub: 'TaiNEX 2，4F', event: true }
    ]
  },
  {
    id: '1102', label: '11/2（一）', en: 'Mon', title: '第三天',
    rows: [
      { time: '09:00–10:30', cells: [S.boyd, S.lai, S.mills, S.cote, S.simpson, S.chang, S.manfred] },
      { time: '10:30–11:00', note: '休息' },
      { time: '11:00–12:30', cells: [S.boyd, S.lai, S.mills, S.cote, S.simpson, S.chang, S.manfred] },
      { time: '12:30–14:00', note: '午餐 · 營養特別場 Nutrition Special Event', sub: 'Stanley Marks，7F Hall A', event: true },
      { time: '14:00–15:30', cells: [S.boyd, S.lai, S.mills, S.cote, S.baranidharan, S.lin, S.claudia] },
      { time: '15:30–16:00', note: '休息' },
      { time: '16:00–17:30', cells: [S.boyd, S.lai, S.mills, S.cote, S.baranidharan, S.lin, S.claudia] },
      { time: '17:30–18:00', note: '閉幕典禮 Closing Ceremony', sub: 'TaiNEX 2，4F', event: true }
    ]
  }
];

/* 講義與筆記，用講者英文名當 key。
   notes：已做好的筆記頁；status 不填代表已依講義整理完。
   講義／錄音／逐字稿不寫在這裡：放進 DVM/2026 Fasava/ 對應的節資料夾後，
   跑 python3 DVM-note/_scripts/build_fasava_files.py 重建 fasava-files.js。
   talks：官網列出的講題（有抄到才填）。 */
const FASAVA_MATERIALS = {
  'Takuya Mori': {
    talks: [
      '10/31 09:00 獸醫心臟外科概況與現況：體外循環、心肌保護、麻醉考量',
      '10/31 10:15 進階技術：體外循環實務與圍手術期管理',
      '10/31 14:00 犬二尖瓣成形術：手術技巧、策略與臨床結果',
      '10/31 16:00 術後管理與長期預後：先天性心臟病手術、貓的心臟手術、未來展望'
    ],
    notes: []
  },
  'Manbok Jeong': {
    notes: [
      { title: '犬貓角膜顏色：診斷與治療', url: '研討會/犬貓角膜顏色診斷與治療.html', status: '初稿：只有大會摘要，沒有投影片' }
    ]
  },
  'Yoshitaka Kobayashi': {
    notes: [
      { title: '貓眼的獨特性：眼表、虹膜與眼底疾病', url: '研討會/貓眼的獨特性-眼表虹膜與眼底.html' },
      { title: '柴犬的眼睛：白內障、青光眼與角膜內皮炎', url: '研討會/柴犬眼科-白內障青光眼與角膜內皮炎.html' }
    ]
  },
  'Manfred Hochleithner': {
    notes: [
      { title: '鸚鵡醫學：幼雛、老年與腫瘤', url: '研討會/鸚鵡醫學-幼雛老年與腫瘤.html', status: '預習版：課後未補' },
      { title: '異寵超音波：從入門到進階', url: '研討會/異寵超音波-從入門到進階.html', status: '預習版：課後未補' }
    ]
  },
  'Claudia Hochleithner': {
    notes: []
  },
  'Paulo Steagall': {
    notes: [
      { title: '慢性疼痛評估與抗 NGF 單株抗體（第 1 節）', url: '研討會/慢性疼痛評估與抗NGF單株抗體.html' },
      { title: '慢性疼痛藥物治療：證據整理（第 2 節）', url: '研討會/慢性疼痛藥物治療-證據整理.html' }
    ]
  }
};
