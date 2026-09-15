# 上群AH

把醫院的臨床知識與技術整理成可查詢、可複習的網頁知識庫。技術棧與風格延續 `../網頁筆記/`（純 HTML／CSS／JS，不用框架、不用打包工具，雙擊即可在瀏覽器開啟，不需要啟動伺服器），但**分類邏輯是「臨床科別」而不是「學期／週次」**，因為這裡放的是跨病例累積的知識點，不是課堂進度。

## 資料夾結構
```
上群AH/
├── index.html            ← 總覽首頁，依科別列出卡片，含跨科別搜尋框
├── search-index.js       ← 跨頁搜尋索引（SEARCH_INDEX 陣列），每新增/修改一份主題筆記務必同步更新
├── assets/
│   ├── style.css          ← 共用樣式，只給「總覽頁」（頂層 index.html／各科別 index.html）載入
│   ├── site.js             ← 共用基礎腳本（主題切換等），只給總覽頁載入
│   └── global-search.js   ← 跨頁搜尋邏輯，讀取 search-index.js 的 SEARCH_INDEX，只給總覽頁載入
└── <科別>/                ← 內科／外科／影像診斷／麻醉／急重症／臨床病理與血檢判讀／藥物治療與劑量／技術操作與SOP
    ├── index.html          ← 該科別總覽頁（主題卡片，未整理的科別目前是 empty-state）
    └── <主題>.html          ← 各主題筆記頁，檔名直接用主題中文（不用編號，例如「急性腎損傷.html」）
```

## 兩種頁面的樣式來源不同
- **總覽頁**（頂層 `index.html`、各科別 `index.html`）：外部引用 `assets/style.css`／`assets/site.js`／`assets/global-search.js` + `search-index.js`，元件用 `.subject-card`（頂層科別卡）、`.week-card`（科別內的主題卡，若某科主題變多可比照 `.week-card.multi` + `.week-doc-link` 處理同主題多份文件）。科別頁 `SITE_ROOT = "../"`（本站只有一層深度，不像 `網頁筆記/` 有 `大四上/科目/` 兩層）。
- **主題筆記頁**（`<科別>/<主題>.html`）：延續 `網頁筆記/` 的單檔自包含風格，**整份 CSS／JS 都是 inline，不載入 `assets/` 底下任何檔案**，側邊欄 nav 用 `showSection(id)` 切換分節（非捲動）。目前本站還沒有任何主題頁範例，**新增時直接複製 `../網頁筆記/` 底下任一份既有筆記頁**當模板整份複製修改（例如 `../網頁筆記/總複習/解剖生理學/骨骼系統.html` 或任一 `weekNN_*.html`），包含：CSS 全部 token/元件（`.card`/`.table-wrap`/`.alert-*`/`.tag-*`/`.step`/`.flow`/`.quiz-*` 等）、`<script>` 內的 `toggleTheme`/`showSection`/hash 路由（讓跨頁搜尋結果的 `#section-xxx` 連結可直接跳轉）/`SECTION_NAMES`/`doSearch`（頁內搜尋）。複製後記得把 breadcrumb、header badge、`<title>` 改成本站的科別／主題名稱。
- 練習題／自我檢核一律用 `<details class="quiz-reveal"><summary></summary>...</details>` 樣式，答案預設隱藏、點擊展開。

## 新增一份主題筆記時
1. 複製既有筆記頁當模板（見上）建立 `<科別>/<主題>.html`（自包含 inline 風格）
2. 更新該科別 `index.html`：把主題卡片從 `empty-state` 改成 `.week-grid` + `.week-card done` 連結（不需要週次編號，`week-num` 欄位可放科別相關 emoji + 「主題」字樣，比照 `網頁筆記/總複習/解剖生理學/index.html`）
3. 在 `search-index.js` 補上該份文件各分節的搜尋條目（`subject` 填科別名稱、`week` 固定填 `null`、`weekTitle` 填主題標題、其餘欄位比照檔案內註解說明）
4. 更新頂層 `index.html` 該科別卡片的「已整理 X 主題」進度文字（目前都是「尚無筆記」）

## 內容性質
這裡整理的是醫院真實病例累積下來的臨床知識與技術（診斷思路、用藥邏輯、技術操作 SOP 等），供住院醫師／實習生查詢複習用，**不作為正式診斷或用藥依據**，且內容可能涉及院內病患資料，注意保密、不外流。
