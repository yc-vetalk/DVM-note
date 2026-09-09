# 上群 專案說明

## 使用者背景
- 獸醫系學生，目前在動物醫院實習／工作
- 會接觸住院動物與門診 Case，需要整理與深度理解病例

## 這個專案要做的事
1. **病例分析**：使用者會提供血檢報告、X 光、超音波等資料（PDF／圖片／影片截圖），需要協助：
   - 分析病況、鑑別診斷方向
   - 解釋醫師為什麼開立這些用藥（藥理機轉、適應症）
   - 逐項分析血檢數值（正常/異常、可能代表的意義）
   - 列出需要注意的事項、可能的併發症
   - 分析輸出請整理成結構清楚的病例摘要，方便日後複習
2. **讀書筆記整理**：使用者會提供研討會內容、上課筆記，需要協助：
   - 整理成易讀、易理解、易記憶的筆記格式
   - 解釋內容中的專業概念
   - 視情況可搭配 `VetPharm:製作藥理講義` 或 `後獸醫考古` 這兩個 skill

3. **網頁筆記建立**：使用者會需要建立操作筆記網頁（例如麻醉操作筆記、藥物比較表、課程週次筆記等），風格比照使用者過去做過的頁面（見 `/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/NTU/大三下/Mid Claude/Web/` 內的 `drug_table_combined_27_Anesthesia.html`、`vet_anesthesia_v*.html`）：淺色/深色雙主題（CSS variables + `data-theme`）、側邊欄分節導覽、卡片/表格/alert/tag 元件、頁內搜尋。純 HTML/CSS/JS，不用框架、不用打包工具，雙擊即可在瀏覽器開啟，不需要啟動伺服器。
   - **課程週次筆記**（會隨學期持續新增，不是一次性文件）：走 `網頁筆記/` 下的多檔案架構，見下方「網頁筆記資料夾結構」。
   - **一次性主題頁**（不屬於特定課程/週次，例如單一麻醉操作手冊、藥物比較表）：可沿用舊的單檔自包含模式（inline `<style>`/`<script>`），直接放在 `網頁筆記/` 根目錄。

## 資料夾結構
- `病歷/`、`病歷紀錄/`、`影像記錄/`、`麻醉/`：既有的原始病例資料（PDF、圖片、影片），依動物/案例分資料夾
- `病例分析/`：存放針對個別 Case 的分析結果（建議每個 Case 一個 Markdown 或資料夾，檔名可比照病歷紀錄的命名方式，例如「病歷號+動物名-主訴」）
- `讀書筆記/`：存放整理過的上課/研討會筆記
- `網頁筆記/`：存放 HTML 筆記網頁，結構如下：
  ```
  網頁筆記/
  ├── index.html            ← 總覽首頁，依學期列出所有科目卡片，含跨科目/跨週次搜尋框
  ├── search-index.js       ← 跨頁搜尋索引（SEARCH_INDEX 陣列），每新增/修改一週筆記務必同步更新
  ├── assets/
  │   ├── style.css         ← 共用樣式，只給「總覽頁」（頂層 index.html／各科目 index.html）載入
  │   ├── site.js            ← 共用基礎腳本（主題切換等），只給總覽頁載入
  │   └── global-search.js  ← 跨頁搜尋邏輯，讀取 search-index.js 的 SEARCH_INDEX，只給總覽頁載入
  ├── 大四上/<科目名稱>/
  │   ├── index.html                    ← 該科目總覽頁（週次卡片，未整理的週次顯示灰色佔位卡）
  │   └── week01_<主題>.html            ← 各週筆記，檔名格式 weekNN_主題
  │       （同一週若有多份文件，例如「課堂」+「實習」，檔名各自加主題區分，
  │         如 week01_術前考量與麻醉.html、week01_縫合材料與結紮技術.html）
  └── 大三/<科目名稱>/        ← 大三科目不分上下學期，統一放同一層
      ├── index.html
      └── ...（依實際筆記類型命名，不一定有週次概念）
  ```
  - **兩種頁面的樣式來源不同**：
    - 總覽頁（頂層 `index.html`、各科目 `index.html`）：外部引用 `assets/style.css`／`assets/site.js`／`assets/global-search.js` + `search-index.js`，元件包含 `.subject-card`、`.week-card`（`.week-card.multi` + `.week-doc-link` 用於同一週有多份文件的情況）。
    - **週次筆記頁**（`weekNN_主題.html`）：延續原本單檔自包含風格，**整份 CSS／JS 都是 inline，不載入 `assets/` 底下任何檔案**，側邊欄 nav 用 `showSection(id)` 切換分節（非捲動）。新增時直接複製一份既有週次筆記（例如 `大四上/大動物外科手術及實習/week01_術前考量與麻醉.html`）當模板整份複製修改，包含：CSS 全部 token/元件（`.card`/`.table-wrap`/`.alert-*`/`.tag-*`/`.step`/`.flow`/`.quiz-*` 等）、`<script>` 內的 `toggleTheme`/`showSection`/hash 路由（讓跨頁搜尋結果的 `#section-xxx` 連結可直接跳轉）/`SECTION_NAMES`/`doSearch`（頁內搜尋）。
    - 練習題一律用 `<details class="quiz-reveal"><summary></summary>...</details>` 樣式，答案預設隱藏、點擊展開，不要用固定顯示的答案。
  - 目前科目：大四上＝大動物外科手術及實習（16 週）、禽病學、豬病學、反芻動物疾病學、伴侶動物復健及物理治療學、水產動物疾病學、獸醫臨床及影像診斷學；大三＝獸醫病理學及實習、獸醫臨床病理學及實習、獸醫藥理學、獸醫針灸學、獸醫麻醉學及實習、獸醫公共衛生。
  - **新增一週筆記時**：(1) 複製既有週次筆記當模板建立 `weekNN_主題.html`（自包含 inline 風格，見上）；(2) 更新該科目 `index.html`：若該週第一份文件，把週次卡片從 `.week-card.pending` 改成連結；若是該週第二份（或更多）文件，改成 `.week-card.multi` 並用多個 `.week-doc-link` 列出；(3) 在 `search-index.js` 補上該份文件各分節的搜尋條目（subject/semester/week/weekTitle/url/section/sectionName/keywords/snippet）。
  - 舊有「單檔自包含」風格的一次性主題頁（不屬於課程週次）維持原樣即可，不用套用這套多檔架構。

## 環境與工具
- 這個資料夾已是獨立的 git repository（與其他資料夾分開版控），`.gitignore` 已排除病例相關的大型圖片/影片/PDF 資料夾與 `.venv/`（那些由 iCloud 同步即可，不進 git）
- 網頁筆記走純 HTML/CSS/JS 單檔模式，不需要 Python、Node.js 或其他執行環境；若之後需要更複雜的網站（多頁面、需要打包），再另行評估是否導入 Node 專案
- 病例分析、筆記整理則是閱讀資料並產出分析文字，同樣不涉及程式碼執行
- **PDF 講義製作**：已在 `.venv/` 建立 Python 虛擬環境並安裝 `reportlab`，用於將研討會/上課 PDF 轉成整理過的 PDF 筆記。樣式規格見 `Web/PDF講義製作指南_藥理學.md`（三段色彩系統、封面/頁尾格式、`section_start`/`subsec_start` 跨頁排版技巧）。目前只做「完整筆記」單一格式（不含概念速覽、複習題庫），且內容需符合臨床獸醫師閱讀需求（比較表格、臨床思路框、用藥安全提醒），而非藥理學課程考試導向。範例腳本：`讀書筆記/scripts/generate_notes_pdf_LSA.py`，執行方式：`./.venv/bin/python 讀書筆記/scripts/generate_notes_pdf_<主題>.py`

## 注意事項
- 這裡的所有內容屬於個人學習與臨床病例資料，涉及真實動物病患，請注意內容僅供學習與院內討論使用，不作為正式診斷依據
