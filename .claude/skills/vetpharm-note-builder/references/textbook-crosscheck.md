# 教科書核對工作流程

## 為什麼要有這一步

這條規則的起源：曾經在頁尾寫過「參照 Veterinary Pharmacology and Therapeutics (10th ed.)」，但其實從沒打開過那本書。使用者發現後，明確要求「不能只有上網抓，講義的資料一定要為主」，並且要求教科書引用必須是真的讀過、grep 過的內容。

所以這裡唯一的硬性規則是：**任何寫進頁面的教科書引用，都必須是你這次對話裡真的 grep/read 過的原文，不能是憑記憶或訓練資料裡的印象寫出來的。** 記憶裡對這些教科書內容的印象可能是對的，但「可能是對的」跟「剛剛核對過」是兩回事，使用者要的是後者。

## 兩本教科書在哪裡

```
textbook/Handbook of Veterinary Pharmacology (VetBooks.ir).pdf
textbook/Veterinary Pharmacology and Therapeutics, 10th Edition (VetBooks.ir)-1.pdf
```

（路徑相對於 repo 根目錄，也就是這個 skill 所在的 `.claude/` 的上一層。）

## 一次性建立文字快取

這兩本書很大（10th ed. 有 1500+ 頁），直接用 Read 工具開會被拒絕（超過分頁上限），也不適合每次都重新轉一次文字。第一次使用時，用 `scripts/extract_pdf_text.py` 轉成純文字、存到持久位置（不要放 `/tmp`，因為 `/tmp` 在系統重啟或一段時間後可能被清掉，重轉一次教科書要幾秒鐘不算貴，但沒必要每個 session 都做）：

```bash
./.venv/bin/python .claude/skills/vetpharm-note-builder/scripts/extract_pdf_text.py \
  "textbook/Handbook of Veterinary Pharmacology (VetBooks.ir).pdf" \
  textbook/_extracted/HBK_pages.txt

./.venv/bin/python .claude/skills/vetpharm-note-builder/scripts/extract_pdf_text.py \
  "textbook/Veterinary Pharmacology and Therapeutics, 10th Edition (VetBooks.ir)-1.pdf" \
  textbook/_extracted/VPT10_pages.txt
```

跑之前先檢查 `textbook/_extracted/` 底下是不是已經有這兩個檔案——有的話直接用，不用重轉。這兩個檔案應該加進 `.gitignore`（它們是從教科書 PDF 衍生出來的大量原文文字，不適合進版控），如果 `.gitignore` 裡還沒有 `textbook/_extracted/`，順手加上去。

## 核對的操作方式

不要整份 Read 這兩個 txt（HBK 約 1.6MB、VPT10 約 7.1MB，會塞爆 context）。用 `grep -n -i` 找關鍵字定位，抓到行號後只 `sed -n 'start,endp'` 或用 Read 的 `offset`/`limit` 讀那一小段上下文：

```bash
grep -n -i "buprenorphine" textbook/_extracted/VPT10_pages.txt | grep -i "ceiling\|therapeutic index"
sed -n '32395,32430p' textbook/_extracted/VPT10_pages.txt
```

## 什麼時候該做這件事、做到什麼程度

不是每一句話都要核對——那樣不可行，也不是重點。核對的優先順序：

1. **講義裡的具體數字**（劑量、半衰期、效力倍數、治療指數之類）——這些最容易被記錯，也最值得核對，核對到之後如果數字吻合，直接在旁邊寫「核對無誤」順便補充教科書給的更多細節（例如 buprenorphine 那次，教科書除了確認 464/12,313 這兩個數字外，還多給了犬的 LD50 和臨床劑量範圍，這種「順便撿到的額外資訊」比單純確認對錯更有價值）。
2. **講義沒講但教科書有、且臨床上重要的內容**——例如某藥物在某物種的療效其實有爭議（tramadol 在犬的鎮痛實證薄弱）、或某個反轉劑的建議劑量比例，這種東西要另外用「教科書補充」的 alert 框標出來，不要混進講義原文段落裡分不清楚來源。
3. **講義跟教科書有出入的地方**——兩者都寫，並標明「（講義）...教科書：...」，讓讀者自己判斷，不要自作主張選一邊刪掉另一邊。

如果 grep 兩本書都找不到某個講義的說法，**不代表這句話是錯的**——教科書不是萬能索引，可能是課程另外引用了特定研究。這種情況下不要動講義原文，也不要假裝已經核對過；如果剛好記得這個主張的性質存疑，可以口頭跟使用者提一句，但不要單方面刪除或加註「未經證實」。

## 每頁完成後的誠實揭露

`meta-bar` 的「資料來源」欄跟每個 section 結尾的 `<footer class="note-footer">` 都要如實反映：

- 還沒做教科書核對：`NTU 獸醫藥理學課程講義（{{教師}}）（依課程提供之完整筆記整理；教科書交叉核對尚未完成）`
- 核對完成：`NTU 獸醫藥理學課程講義（{{教師}}，{{講義編號}}）為主；教科書核對：{{實際查過的書和章節}}`

不要在核對只做了一部分的時候就寫成「已完成」；也不要因為想讓頁面看起來更有份量，就寫上根本沒讀過的書名。
