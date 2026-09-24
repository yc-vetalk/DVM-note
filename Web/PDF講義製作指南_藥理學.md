# PDF 講義製作指南 — yc._vetalk NTU 獸醫藥理學

> 適用範圍：每週上課 PDF 教材 → 三份衍生講義
> 工具：Python `reportlab`
> 字型：`/System/Library/Fonts/STHeiti Medium.ttc`

---

## 一、三份講義種類與定位

| 檔案類型 | 輸出檔名範例 | 定位 |
|---------|------------|------|
| **概念速覽** | `主題_概念速覽.pdf` | 快速掃描重點，考前10分鐘複習用 |
| **完整筆記** | `主題_完整筆記.pdf` | 系統性整理、含機制說明與比較表格 |
| **完整複習題庫** | `主題_完整複習題庫.pdf` | 出題練習，答案附在各題下方 |

每週的生成腳本命名：
- `generate_concept_notes_主題.py`
- `generate_notes_pdf_主題.py`
- `generate_review_bank_主題.py`

輸出路徑：`/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/NTU/大三下/獸醫藥理學/`

---

## 二、共用設定（三份均適用）

### 色彩系統

```python
NAVY  = colors.HexColor('#1B2D4F')   # 主標題 / 節標題 / 表頭
TEAL  = colors.HexColor('#2A6B72')   # 次標題 / 簡答框邊框
GOLD  = colors.HexColor('#B8952A')   # 節標題邊框 / 品牌色 / 金線
WINE  = colors.HexColor('#6B2333')   # 答案文字 / 陷阱框邊框
SLATE = colors.HexColor('#4A5568')   # 說明 / 解析 / 一般文字
LGRAY = colors.HexColor('#ECEAE6')   # 表格交替行
MIST  = colors.HexColor('#EEF4F8')   # 單選答案框 / 邏輯框背景
AMBER = colors.HexColor('#FEF8EC')   # 重點框背景
WARM  = colors.HexColor('#F7F5F0')   # 節標題背景 / 表格奇數行
SAGE  = colors.HexColor('#F1F7F2')   # 簡答答案框背景
CREAM = colors.HexColor('#FDFBF6')   # 是非題答案框背景
LAVND = colors.HexColor('#F4F0F9')   # 配對題答案框背景
DIV   = colors.HexColor('#D4C9B0')   # 分隔線
WHITE = colors.white
```

### 封面格式（白底）

```python
story.append(SP(1.5))
story.append(P('<b>主標題英文</b>',
               mk('cv_title', fontName='STH-B', fontSize=26, leading=34,
                 textColor=NAVY, alignment=TA_CENTER)))
story.append(SP(0.3))
story.append(P('副標題中文 English Subtitle',
               mk('cv_sub', fontSize=11, leading=16,
                 textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.2))
story.append(P('主題A  |  主題B  |  主題C  |  主題D',   # ★ | 前後各兩空格
               mk('cv_tags', fontSize=8.5, leading=14,
                 textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.2))
story.append(P('NTU 獸醫藥理學 2026',
               mk('cv_kw', fontSize=8.5, leading=12,
                 textColor=SLATE, alignment=TA_CENTER)))
story.append(SP(0.3))
story.append(P('<font color="#B8952A"><b>yc._vetalk</b></font>',
               mk('cv_br', fontSize=8.5, leading=12, alignment=TA_RIGHT)))
story.append(SP(0.15))
story.append(HR(GOLD, 1.5))
story.append(SP(0.4))
```

> **注意**：主題標籤列的分隔符 `|` 前後必須各有**兩個空格**，避免黏字。

### 頁尾格式

```python
def add_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('STH', 7)
    canvas.setFillColor(colors.HexColor('#BBBBBB'))
    canvas.drawString(1.6*cm, 1.1*cm, 'NTU 獸醫藥理學｜主題 講義類型')
    canvas.drawCentredString(PAGE_W / 2, 1.1*cm, str(doc.page))
    canvas.drawRightString(PAGE_W - 1.6*cm, 1.1*cm, 'yc._vetalk')
    canvas.restoreState()
```

`bottomMargin` 設為 `2.2*cm`。

---

## 三、概念速覽（generate_concept_notes_主題.py）

### 頁面設定
```python
doc = SimpleDocTemplate(output_path, pagesize=A4,
    leftMargin=1.6*cm, rightMargin=1.6*cm,
    topMargin=1.6*cm, bottomMargin=2.2*cm)
W = A4[0] - 3.2*cm
```

### 字型別名
```python
pdfmetrics.registerFont(TTFont('STH',   '/System/Library/Fonts/STHeiti Medium.ttc'))
pdfmetrics.registerFont(TTFont('STH-B', '/System/Library/Fonts/STHeiti Medium.ttc'))
```

### 樣式輔助
```python
def mk(name, **kw):
    base = dict(fontName='STH', fontSize=9.5, leading=14.5, textColor=SLATE)
    base.update(kw)
    return ParagraphStyle(name, **base)
```

### 常用元件函式

```python
def section(story, text)          # 節標題（金色左邊框 4pt + WARM 背景）
def subsec(story, text)           # 小節（◆ 前綴，TEAL）
def B(story, text, star=0)        # 條列要點（•）+ 星號
def B2(story, text)               # 二級條列（◦）
def logic_box(story, lines, title)# 機制流程框（MIST 背景 + TEAL 邊框）
def star_box(story, items, title) # 重點框（AMBER 背景 + GOLD 邊框）
def warn_box(story, items, title) # 陷阱框（淡紅背景 + WINE 邊框）
def tbl(story, headers, rows, col_w)  # 比較表格
```

---

## 四、完整筆記（generate_notes_pdf_主題.py）

### 頁面設定
```python
doc = SimpleDocTemplate(output_path, pagesize=A4,
    leftMargin=1.8*cm, rightMargin=1.8*cm,
    topMargin=2*cm, bottomMargin=2.2*cm)
W = A4[0] - 3.6*cm
```

### 字型別名
```python
pdfmetrics.registerFont(TTFont('STHeiti',   '/System/Library/Fonts/STHeiti Medium.ttc'))
pdfmetrics.registerFont(TTFont('STHeiti-B', '/System/Library/Fonts/STHeiti Medium.ttc'))
```

### 跨頁排版（必用）

避免 section header 孤立在頁底，使用 `section_start()` / `subsec_start()` 模式：

```python
# Element-returning functions
def h1_el(text): ...  # returns list of flowables
def h2_el(text): ...
def tbl_el(headers, rows, col_w): ...
def pathway_el(lines, title): ...

# Grouping helpers（header + first content = KeepTogether）
def section_start(story, h1_text, first_el, h2_text=None):
    group = h1_el(h1_text)
    if h2_text:
        group += h2_el(h2_text)
    group += [first_el, SP(0.2)]
    story.append(KeepTogether(group))

def subsec_start(story, h2_text, first_el):
    group = h2_el(h2_text) + [first_el, SP(0.2)]
    story.append(KeepTogether(group))
```

---

## 五、完整複習題庫（generate_review_bank_主題.py）

### 題型配比

| 題型 | 題數 |
|------|------|
| 是非題（T/F） | 15 題 |
| 單選題（MCQ） | 30 題 |
| 配對題 | 2 組（各 7–10 對）|
| 簡答題 | 8 題 |
| 申論題 | 3 題 |

### 答案框顏色

| 題型 | 背景 | 左邊框 |
|------|------|--------|
| 是非題 | CREAM `#FDFBF6` | GOLD |
| 單選題 | MIST `#EEF4F8` | TEAL |
| 配對題 | LAVND `#F4F0F9` | TEAL |
| 簡答題 | SAGE `#F1F7F2` | TEAL |
| 申論題 | SAGE `#F1F7F2` | TEAL |

### 出題方向（藥理學通用）

1. 受體分型 → G protein 路徑 → 下游效應
2. 藥物分類（agonist / antagonist / partial agonist）
3. 物種差異與獸醫臨床適應症
4. 機制流程（synthesis → storage → release → metabolism）
5. 藥物副作用與例外情況
6. 比較同類藥物差異

---

## 六、製作流程 SOP

```
1. 讀取原始 PDF（按頁讀取截圖）
2. 整理章節大綱與核心表格
3. 先寫 generate_concept_notes_主題.py
4. 再寫 generate_notes_pdf_主題.py
5. 最後寫 generate_review_bank_主題.py
6. 執行三個腳本
```

---

## 七、常見錯誤速查

| 錯誤 | 解法 |
|------|------|
| 節標題孤立頁底 | 改用 `section_start()` / `subsec_start()` |
| 中文亂碼 | 確認字型路徑 `/System/Library/Fonts/STHeiti Medium.ttc` |
| 頁尾被內容蓋住 | `bottomMargin=2.2*cm` |
| 標籤列文字黏連 | `\|` 前後各兩空格：`主題A  |  主題B` |
| `TA_RIGHT` NameError | import 加 `TA_RIGHT` |
| 表格跨頁切斷 | 用 `KeepTogether([t])` 或 `tbl_el()` + `subsec_start()` |

---

## 八、已完成講義

| 主題 | 概念速覽 | 完整筆記 | 複習題庫 |
|------|---------|---------|---------|
| Autacoids & Histamine | ✓ | ✓ | ✓ |
| Serotonin (5-HT) & Antagonists | ✓ | ✓ | ✓ |
| GI Pharmacology | ✓ | ✓ | ✓ |
| NSAIDs | ✓ | ✓ | ✓ |
| Respiratory Pharmacology | ✓ | ✓ | ✓ |

---

*Made with yc._vetalk × Claude Code*
