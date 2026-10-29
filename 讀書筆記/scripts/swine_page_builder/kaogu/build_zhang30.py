# -*- coding: utf-8 -*-
# 張家宜老師範圍（第 2、3 週）預測題 30 題：python3 build_zhang30.py → 大四上/豬病學/張家宜30題.html
import os, re, subprocess
ROOT = '/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群/DVM-note/大四上/豬病學'
os.chdir(ROOT)
TPL = open('期中總複習.html', encoding='utf-8').read()
FLU = open('week05_豬流行性感冒.html', encoding='utf-8').read()

V1 = 'pdf/病毒性疾病I.pdf'; V2 = 'pdf/病毒性疾病II.pdf'
def p(f, n): return f'<a class="pdf-link" href="{f}#page={n}">p.{n}</a>'
def p1(n): return p(V1, n)
def p2(n): return p(V2, n)
SUP = '（補充）'

# 每題：(分組, 題幹, 答案選項(對或要選的那個), 其他三個選項, kind)
# 選項 = (文字, 理由)；kind 'T'＝問正確的，答案選項是對的敘述；'F'＝問錯誤的，答案選項是錯的敘述
Q = []
def q(group, stem, ans, others, kind='T', tag='單選'):
    Q.append(dict(group=group, stem=stem, ans=ans, others=others, kind=kind, tag=tag))

# ---------- ASF ----------
q('非洲豬瘟（ASF）', '下列何者是「<strong>唯一經節肢動物傳播的 DNA 病毒</strong>」？',
  ('非洲豬瘟病毒（ASFV）', f'ASFV（Asfarviridae）是唯一經節肢動物傳播的 DNA 病毒（{p1(19)}）；軟蜱 <em>Ornithodoros</em> 可經蛻皮、經卵與性傳播，終生感染（{p1(29)}）。'),
  [('豬瘟病毒（CSFV）', 'CSFV 是 RNA 病毒（Pestiviridae），傳播靠口、直接接觸、飛沫、精液與胎盤，不靠節肢動物。'),
   ('豬環狀病毒第 2 型（PCV2）', 'PCV2 雖然是 DNA 病毒，但傳播主要經口鼻、胎盤、乳汁與精液，沒有節肢動物傳播。'),
   ('日本腦炎病毒（JEV）', 'JEV 經 <em>Culex</em> 蚊傳播，但它是 <strong>RNA</strong> 病毒（Flaviviridae）。題幹限定「DNA」，所以不是它。')])
q('非洲豬瘟（ASF）', '下列有關 ASFV 環境抵抗力的敘述，何者<strong>正確</strong>？',
  ('在 4°C 的血液中可存活長達約 18 個月', f'講義的存活時間表：血液 4°C 最長 18 個月、鹽漬風乾火腿 &gt;140 天、冷凍屍體數年（{p1(23)}），所以對低溫特別有抵抗力。'),
  [('在室溫的糞便中可存活數個月', '糞便室溫只有「數日」；要數個月的是污染的豬舍。'),
   ('肉品加熱 70°C 約 5 分鐘即可不活化', '講義是 70°C（150°F）<strong>30 分鐘</strong>才能不活化肉品與組織。'),
   ('pH 在 5–9 之間最容易被不活化', f'不活化的條件是 pH &lt;3.9 或 &gt;11.5（有血清存在需更高，pH 13.4，{p1(24)}），中性範圍反而穩定。')])
q('非洲豬瘟（ASF）', '下列有關 ASF 的敘述，何者<strong>錯誤</strong>？',
  ('為人畜共通傳染病，人感染後會出現出血熱', f'錯：ASF <strong>非人畜共通</strong>，只感染家豬、野豬等豬科動物（{p1(10)}）。'),
  [('標的細胞是單核球與巨噬細胞', '對：原發複製在最靠近入侵點的淋巴結、扁桃腺與下頜淋巴結的單核球、巨噬細胞（' + p1(33) + '）。'),
   ('病毒血症通常在感染後 4–8 天開始', '對：講義寫進入後 4–8 天開始（' + p1(33) + '）。'),
   ('因缺乏完全中和抗體，病毒血症可持續數週至數月', '對：缺乏完全中和抗體是病毒血症拖很久的原因（' + p1(33) + '）。')], kind='F')
q('非洲豬瘟（ASF）', '有關 ASFV 的病毒分離與<strong>血球吸附試驗（HAD）</strong>，下列何者正確？',
  ('感染的巨噬細胞周圍會吸附豬紅血球形成「玫瑰花環」，專一性高', f'對：只有 ASFV 能在白血球培養中造成血球吸附，所以專一性高（{p1(52)}）。'),
  [('不需要初代細胞培養，一般細胞株即可', '錯：要用豬源感受性<strong>初代細胞</strong>（單核球、巨噬細胞）；每次都要取材，是這個試驗的缺點。'),
   ('所有 ASFV 毒株都會有血球吸附', '錯：講義寫「並非所有 ASFV 株都有血球吸附」。'),
   ('試驗可在 24 小時內完成', '錯：試驗時間約 3–10 天。')])
q('非洲豬瘟（ASF）', '下列有關 ASF 預防與控制的敘述，何者<strong>錯誤</strong>？',
  ('已有全球公認安全有效的疫苗，非疫區可常規接種', f'錯：講義寫疫苗目前「尚無廣泛接受的全球性解決方案」，防控仍靠生物安全、早期偵測、移動管制與撲殺（{p1(58)}、{p1(63)}）。'),
  [('新購入的豬至少與豬群隔離 30 天', '對：預防直接傳播的措施（' + p1(58) + '）。'),
   ('不要餵未煮熟的豬肉製品（餿水、廚餘、垃圾）', '對：吃入受污染豬肉製品是重要傳播來源（' + p1(26) + '）。'),
   ('越南 2022 年 6 月核准全球首個商業 ASF 疫苗', '對：為基因刪除減毒活疫苗，已納入越南國家控制策略（' + p1(66) + '）。')], kind='F')

# ---------- CSF ----------
q('豬瘟（CSF）', '下列有關古典豬瘟病毒（CSFV）的敘述，何者<strong>正確</strong>？',
  ('屬 Pestiviridae（Orthopestivirus），有封套的 RNA 病毒，單一血清型、三個基因型', f'對：CSFV 與 BVDV、BDV、APPV 同屬瘟病毒屬（{p1(76)}、{p1(79)}）。'),
  [('屬 Asfarviridae，為雙股 DNA 病毒', '錯：這是 ASFV 的特徵；CSFV 是 RNA 病毒。'),
   ('有 7 個血清型，彼此無交叉保護', '錯：「7 個血清型」是口蹄疫（FMDV）。CSFV 只有一個血清型。'),
   ('無封套，對環境抵抗力極強', '錯：CSFV 有封套；4°C 存活 6 週，冷凍肉可數年，但仍可被有機溶劑、2% NaOH 不活化。')])
q('豬瘟（CSF）', '母豬於懷孕中期感染低毒力 CSFV，胎兒因免疫系統未成熟，無法辨識病原而不產生抗體，仔豬出生時外觀健康卻終生排毒。這種現象稱為？',
  ('免疫耐受（immunotolerance）', f'對：先天持續感染（late-onset CSF）的機轉。胎兒免疫系統尚未成熟，無法辨識病毒，所以驗不到抗體、疫苗效果差、終生排毒（{p1(102)}）。'),
  [('潛伏感染（latent infection）', '錯：潛伏是病毒不複製躲在細胞內（如疱疹病毒）；這裡病毒持續複製並排毒。'),
   ('母源抗體干擾（maternal antibody interference）', '錯：母源抗體干擾是母源抗體中和疫苗病毒；這裡是胎兒自己不產生抗體。'),
   ('抗原位移（antigenic shift）', '錯：抗原位移是分段基因病毒（流感）的基因重組，與 CSFV 無關。')])
q('豬瘟（CSF）', '下列何者<strong>不是</strong> CSF 的特徵性大體病變？',
  ('脾臟腫大、質脆、暗黑', f'這是 <strong>ASF</strong> 的特徵（{p1(45)}）。CSF 的脾臟是「邊緣梗塞」。'),
  [('脾臟邊緣梗塞', '是：CSF 的特徵病變（' + p1(107) + '）。'),
   ('淋巴結周邊出血', '是：淋巴結周邊紫黑色出血（' + p1(106) + '）。'),
   ('胃腸道黏膜鈕扣狀潰瘍（慢性型）', '是：慢性型的迴盲瓣與腸道鈕扣狀潰瘍（' + p1(113) + '–114）。')], kind='F')
q('豬瘟（CSF）', '有關 CSF 的抗體診斷，下列何者<strong>正確</strong>？',
  ('螢光抗體病毒中和試驗（FAVNT）是金標準，步驟繁瑣、需細胞培養與病毒操作，約 3 天', f'對：中和抗體效價以造成 50% 螢光抑制的血清最高稀釋倍數表示（{p1(123)}）。'),
  [('FAVNT 是抗原檢測，半天即可完成', '錯：FAVNT 偵測抗體；「半天」是 ELISA 的特點。'),
   ('ELISA 需要細胞培養與病毒操作', '錯：ELISA 步驟簡單、<strong>不需</strong>細胞培養與病毒操作，快速（約半天），但需評估與中和抗體的相關性。'),
   ('qRT-PCR 無法區分疫苗株與野外株', '錯：qRT-PCR 高敏感、高特異，可分基因型，也可區分疫苗株與野外株（' + p1(120) + '）。')])
q('豬瘟（CSF）', '在使用 <strong>E2 次單位疫苗</strong>的地區，若要區分「野外感染」與「疫苗接種」，應檢測下列何者？',
  ('抗 Erns 抗體（CSFV Erns ELISA）', f'對：E2 次單位疫苗與 CP7_E2alf 嵌合疫苗都<strong>沒有 CSFV 的 Erns</strong>，所以驗到抗 Erns 抗體就是野外感染（{p1(137)}）。限制：敏感度與特異度差，與 BVDV、BDV 的 Erns 抗體會交叉反應，只適合族群篩檢。'),
  [('抗 E2 抗體', '錯：疫苗與野毒感染<strong>都</strong>會產生抗 E2 抗體，無法區分。'),
   ('中和抗體效價', '錯：疫苗與野毒感染都誘發中和抗體，無法區分。'),
   ('病毒分離', '錯：病毒分離是偵測病毒本身，用於確認感染，並不是用來區分抗體來源的 DIVA 檢驗。')])
q('豬瘟（CSF）', '下列有關台灣 CSF 的敘述，何者<strong>正確</strong>？',
  ('1996 年後田間病毒由基因型 3.4 轉為 2.1', f'對：2.1 與 3.4 都是中等毒力（{p1(141)}）。'),
  [('2006 年後田間仍持續有病毒流行', '錯：2006 年後田間<strong>未再檢出</strong>病毒。'),
   ('2023 年起全面恢復疫苗接種', '錯：2023 年起<strong>停止</strong>疫苗接種，是長期監測加階段性停打疫苗而成功根除的案例。'),
   ('LPC 疫苗只對 2.1 型有保護', '錯：LPC 疫苗對 2.1 與 3.4 兩種都有保護。')])

# ---------- JE / HEV ----------
q('日本腦炎（JE）與 E 型肝炎（HE）', '在日本腦炎病毒的傳播循環中，豬扮演的角色是？',
  ('增幅宿主（amplifier）', f'對：豬感染後有高效價病毒血症 2–4 天，足以感染蚊子，所以是增幅宿主（{p1(152)}）。'),
  [('終端宿主（dead-end host）', '錯：終端宿主是<strong>人與馬</strong>，被蚊叮咬感染但病毒量不足以再傳給蚊子（' + p1(148) + '）。'),
   ('唯一的自然保毒宿主', '錯：鷺科等野生鳥類也是重要的維持宿主，豬不是唯一。'),
   ('傳播媒介', '錯：傳播媒介是 <em>Culex</em> 蚊；豬是脊椎動物宿主。')])
q('日本腦炎（JE）與 E 型肝炎（HE）', '母豬感染日本腦炎病毒，何時感染才會造成流產、死產、木乃伊胎等生殖障礙？',
  ('妊娠 60–70 天以前', f'對：講義寫「妊娠 60–70 天以前感染才會發生生殖障礙」（{p1(157)}）。'),
  [('妊娠 70 天以後', '錯：懷孕後期感染通常對胎兒影響很小或沒有。'),
   ('配種前一天', '錯：講義的重點是妊娠階段，與配種前感染無關。'),
   ('任何懷孕階段影響都一樣', '錯：胎兒結果依感染時的妊娠階段而定，這是考點。')])
q('日本腦炎（JE）與 E 型肝炎（HE）', '下列有關日本腦炎對豬的影響，何者<strong>錯誤</strong>？',
  ('感染母豬常因腦炎而死亡', '錯：豬的 JEV 感染多為<strong>亞臨床</strong>；母豬的表現是流產、死產、木乃伊胎、虛弱仔豬，沒有特徵性病變，不是腦炎死亡（' + p1(157) + '）。'),
  [('公豬可出現睪丸水腫、精子活動力下降，且多為暫時性', '對：不孕影響通常暫時，大多數完全恢復。'),
   ('死產或虛弱仔豬常見腦水腫、小腦發育不全', '對：另有皮下水腫、脊髓髓鞘形成不全（' + p1(161) + '）。'),
   ('感染仔豬顯微可見非化膿性腦炎，神經元壞死與血管周圍袖套', '對：腦與脊髓的特徵病變（' + p1(161) + '）。')], kind='F')
q('日本腦炎（JE）與 E 型肝炎（HE）', 'E 型肝炎病毒（HEV）中，屬於<strong>人畜共通的重要基因型</strong>是？',
  ('HEV-3、HEV-4', f'對：可感染人、豬與其他物種（{p1(173)}）。'),
  [('HEV-1、HEV-2', '錯：僅限人類。'),
   ('HEV-5、HEV-6', '錯：感染野豬，人畜共通潛力未知。'),
   ('HEV-7、HEV-8', '錯：感染駱駝。')])
q('日本腦炎（JE）與 E 型肝炎（HE）', '下列有關豬 E 型肝炎的敘述，何者<strong>正確</strong>？',
  ('豬通常無症狀，但顯微可見輕至中度淋巴漿細胞性肝炎，且是人畜共通 HEV 的重要保毒庫', f'對：豬肝的 HEV RNA 陽性率最高（24%），豬農抗體陽性率 29.5% 對一般人 11.5%（{p1(177)}、{p1(179)}）。'),
  [('豬感染後出現黃疸與肝衰竭', '錯：自然與實驗感染豬都<strong>無症狀</strong>。'),
   ('主要經蚊傳播', '錯：豬之間是<strong>糞口</strong>傳播；人經職業接觸或吃未煮熟的豬肉、豬肝感染。'),
   ('豬肝中的 HEV 經適當烹煮仍不會被不活化', '錯：商業豬肝中的豬 HEV 經適當烹煮可完全不活化；但 56°C 1 小時不夠。')])

# ---------- PCVAD ----------
q('豬環狀病毒相關疾病（PCVAD）', '有關 PCV2 的病毒特性，下列何者<strong>正確</strong>？',
  ('無封套，含約 1.7 kb 單股環狀 DNA，對熱與酸極耐受（56°C 1 小時、pH &lt;2 仍有活性）', f'對：PCV2 小、無封套、超級耐，環境中很難清除；消毒劑以氧化劑、醛類加四級銨複方效果最好（{p2(6)}、{p2(7)}）。'),
  [('有封套的雙股 DNA 病毒', '錯：PCV2 無封套、單股環狀。'),
   ('56°C 1 小時即可被不活化', '錯：講義寫 56°C 1 小時、75°C 15 分鐘都不會被不活化。'),
   ('ORF1 編碼衣殼蛋白，是次單位疫苗的標的', '錯：衣殼蛋白由 <strong>ORF2</strong> 編碼，是次單位疫苗抗原；ORF1 編碼複製酶 Rep（補充）。')])
q('豬環狀病毒相關疾病（PCVAD）', '下列何者<strong>不屬於</strong> PCVAD 的臨床表現？',
  ('豬生殖與呼吸綜合症（PRRS，藍耳病）', '不屬於：PRRS 是 Arteriviridae 的另一種病毒病。PCVAD 的四種表現是 PCV2-SD、PCV2-RD、PDNS、PCV2-SI（亞臨床）（' + p2(5) + '）。國考 111 年第二次出過類似題。'),
  [('PCV2 全身性疾病（PCV2-SD，舊稱 PMWS）', '屬於：消耗、淋巴耗竭。'),
   ('PCV2 生殖疾病（PCV2-RD）', '屬於：晚期流產死產、早期規律返情。'),
   ('豬皮膚炎腎病症候群（PDNS）', '屬於：PDNS 被歸在 PCVAD 底下。')], kind='F')
q('豬環狀病毒相關疾病（PCVAD）', '下列何者最符合 <strong>PDNS</strong> 的診斷依據？',
  ('出血壞死性皮膚病灶（後肢、會陰）和／或腎腫大蒼白伴皮質點狀出血，加上全身性壞死性血管炎與壞死性纖維素性腎絲球腎炎；驗到 PCV2 不是必要條件', f'對：PDNS 診斷看皮膚與腎臟的血管炎病變（{p2(50)}）。傷害來自免疫反應，病變出現時病灶內病毒可能很少（補充）。'),
  [('必須在病灶內驗到中到大量 PCV2', '錯：這是 <strong>PCV2-SD</strong> 的診斷條件（' + p2(47) + '）。'),
   ('只要 PCR 驗到 PCV2 即可確診', '錯：PCR 陽性不能單獨確認 PCV2 相關疾病（' + p2(51) + '）；PCV2 在豬場很普遍，很多豬帶毒不發病。'),
   ('以淋巴組織的淋巴耗竭為主要診斷依據', '錯：這是 PCV2-SD 的病變；PDNS 看皮膚與腎。')])
q('豬環狀病毒相關疾病（PCVAD）', '下列有關 PCV2 基因型與疫苗的敘述，何者<strong>正確</strong>？',
  ('2012 年後全球多轉為 PCV2d，部分疫苗失敗病例中可驗到', f'對：第二次基因型轉換 2b → 2d（{p2(12)}、{p2(13)}）；第一次是 2003 年後 2a → 2b，伴隨更嚴重的臨床爆發。'),
  [('PCV2 有多個血清型，各基因型間無交叉保護', '錯：各 PCV2 株間沒有重大抗原差異，一般視為<strong>單一血清型</strong>。'),
   ('PCV2 疫苗可預期同時保護 PCV3 與 PCV4', '錯：PCV2 疫苗不預期保護 PCV3、PCV4。'),
   ('PCV1 是造成 PMWS 的主要病原', '錯：PCV1 對豬不致病，最初是 PK-15 細胞的污染物；最重要的致病型是 PCV2。')])

# ---------- PRRS ----------
q('豬生殖與呼吸綜合症（PRRS）', '下列有關 PRRSV 的敘述，何者<strong>錯誤</strong>？',
  ('PRRSV-1（歐洲型）與 PRRSV-2（北美型）的全基因體核苷酸相似度高達 95%', f'錯：兩者全基因體相似度只有約 <strong>50–70%</strong>（{p2(73)}）。'),
  [('屬 Arteriviridae，有封套的單股正股 RNA 病毒', '對。'),
   ('GP5、M、N 是病毒顆粒中一定找得到的三個主要蛋白，GP5 是最重要的結構蛋白之一', '對：ORF6 編碼 M、ORF7 編碼 N 核衣殼蛋白。'),
   ('台灣 2019–2020 年檢測以 PRRSV-2 為主（約 96%）', '對：PRRSV-1 約 3%，2018 年底首次爆發。')], kind='F')
q('豬生殖與呼吸綜合症（PRRS）', '有關 PRRSV 感染後的體液免疫，下列何者<strong>正確</strong>？',
  ('非中和抗體約 7–14 天出現高效價，主要針對 N 蛋白；中和抗體 3–4 週才出現且效價低，主要針對 GP5 等封套醣蛋白', f'對：這就是 PRRS 難纏的原因之一（{p2(94)}）。'),
  [('中和抗體 7–14 天即出現高效價', '錯：是<strong>非中和</strong>抗體先出現；中和抗體要 3–4 週。'),
   ('ELISA 抗體陽性代表豬已有保護力', '錯：ELISA 驗到的多半是早期的非中和抗體，陽性不代表有保護（補充）。'),
   ('早期抗體主要針對 GP5，並具有中和能力', '錯：早期抗體主要針對 N，沒有中和能力；有中和力的是較晚出現的抗 GP5 等。')])
q('豬生殖與呼吸綜合症（PRRS）', '某豬群檢測結果為 <strong>RT-PCR 陽性、ELISA 陰性</strong>，最可能的情況是？',
  ('剛感染或剛打疫苗（&lt;14 天），還沒血清轉陽', '對：以 14 天為界：PCR 看「現在有沒有病毒」，ELISA 看「過去有沒有接觸」（補充）。'),
  [('已清除感染且抗體轉陰（感染後 ≥6–12 個月）', '錯：這是 RT-PCR 陰性、ELISA 陰性的情境。'),
   ('未感染的仔豬帶有初乳抗體', '錯：這是 RT-PCR 陰性、ELISA 陽性的情境。'),
   ('已有前次感染或疫苗抗體的豬再感染', '錯：這是 RT-PCR 陽性、ELISA 陽性的情境。')])
q('豬生殖與呼吸綜合症（PRRS）', '下列有關 PRRSV 持續感染與演化的敘述，何者<strong>錯誤</strong>？',
  ('持續 RT-PCR 陽性一定代表仍有具感染力的病毒血症', '錯：講義明確寫「持續 PCR 陽性不一定代表仍有感染力的病毒血症」；有感染力的病毒血症約 4 週後明顯下降，但扁桃腺等淋巴組織可持續帶毒數月（' + p2(82) + '）。'),
  [('演化速度約 10⁻² substitutions/site/year，比許多 RNA 病毒快 1–3 個數量級', '對：原因可能是複製更頻繁，而非錯誤率較高。'),
   ('以準種（quasispecies）形式存在，一頭豬內可同時有多個變異株', '對（' + p2(102) + '）。'),
   ('扁桃腺與其他淋巴組織可持續帶毒數個月', '對：感染可延長或持續數個月，排毒可能間歇性。')], kind='F')
q('豬生殖與呼吸綜合症（PRRS）', '下列有關 PRRSV 傳播的敘述，何者<strong>正確</strong>？',
  ('非經口（打針、咬傷、剪耳）感染所需最低病毒量遠低於經口；精液病毒濃度最高', f'對：非經口 10–10²·² TCID₅₀、經口 10⁵·³；精液約 10⁶·⁰，所以針頭共用、外傷、人工授精很有效率，種公豬精液監測很重要（{p2(79)}）。'),
  [('主要靠空氣遠距離傳播，不需動物接觸', '錯：主要經感染豬與易感豬的<strong>近距離接觸</strong>，有封套、怕乾怕熱，環境存活短（補充）。'),
   ('外觀正常的豬不會排毒', '錯：外觀正常的豬可能是帶毒者與排毒者；引進離乳豬與更新種豬是場間傳播的重要風險因子。'),
   ('經口感染所需病毒量最低', '錯：經口反而最高（10⁵·³）。')])

# ---------- PPV / RV ----------
q('豬小病毒（PPV）與輪狀病毒（RV）', '母豬在<strong>懷孕第 35–70 天</strong>感染 PPV1，胎兒最可能的結果是？',
  ('胎兒死亡並木乃伊化', f'對：35 天後胎兒開始骨化，死了吸收不掉，就變成木乃伊（{p2(130)}）。'),
  [('胚胎死亡並被吸收，母豬返情', '錯：這是<strong>第 35 天前</strong>感染的結果（還沒骨化，軟組織被吸收）。'),
   ('胎兒存活並帶有抗 PPV1 抗體出生', '錯：這是<strong>第 70 天後</strong>感染的結果，約第 70 天胎兒有免疫勝任能力（' + p2(131) + '）。'),
   ('胎兒完全不受影響，母豬無任何表現', '錯：生殖障礙是 PPV1 唯一確立的主要臨床後果；母豬本身無症狀，但胎兒結果取決於懷孕階段。')])
q('豬小病毒（PPV）與輪狀病毒（RV）', '有關 PPV1 的診斷，下列何者<strong>正確</strong>？',
  ('木乃伊胎、死產仔豬、流產胎兒是主要診斷樣本，PCR 是最實用的方法', '對：同窩有正常仔豬與大小不一的木乃伊胎高度提示 PPV1；IF 可驗胎兒組織抗原。'),
  [('主要診斷樣本是成年母豬的血液', '錯：母豬血清只做血清學（配對血清證明近期感染），主要樣本是胎兒。'),
   ('血球凝集抑制試驗（HI）用來偵測病毒抗原', '錯：HI 用來偵測並定量 PPV1 <strong>抗體</strong>。'),
   ('成年母豬通常有明顯的全身症狀', '錯：PPV1 在成豬一般沒有臨床症狀。')])
q('豬小病毒（PPV）與輪狀病毒（RV）', '下列有關 PPV1 控制的敘述，何者<strong>最適當</strong>？',
  ('在配種前建立保護性免疫，以不活化疫苗為主', '對：講義 Take-home：有效控制在配種前建立保護性免疫；疫苗不活化為主，更新女豬與種母豬要例行接種。'),
  [('等母豬懷孕後再開始接種', '錯：感染結果取決於懷孕階段，要在配種前先有免疫。'),
   ('以改良活毒疫苗為首選', '錯：改良活毒疫苗（MLV）免疫強而持久，但因安全疑慮使用受限。'),
   ('成豬無症狀，所以不需接種', '錯：問題在懷孕母豬的胎兒；仔豬母源抗體可持續約 14–26 週，也會影響後續接種時機。')])
q('豬小病毒（PPV）與輪狀病毒（RV）', '有關豬輪狀病毒的致病機制與病變，下列何者<strong>正確</strong>？',
  ('感染空腸與迴腸的成熟腸細胞，造成絨毛萎縮，下痢來自吸收不良加上病毒蛋白造成的分泌作用', f'對：病變限於小腸，肉眼為腸壁薄、水樣黃到灰色內容物，胃可能有未消化乳；主要感染成熟腸細胞（{p2(157)}）。'),
  [('主要感染腺窩細胞，造成腺窩壞死', '錯：感染的是絨毛上的<strong>成熟腸細胞</strong>；腺窩是修復來源。腺窩壞死是犬小病毒的特色（補充）。'),
   ('病變主要在大腸', '錯：病變侷限於小腸（空腸、迴腸）。'),
   ('純粹分泌性下痢，絨毛不萎縮', '錯：這是 ETEC（大腸桿菌）的特徵；輪狀病毒絨毛會萎縮。')])
q('豬小病毒（PPV）與輪狀病毒（RV）', '下列有關豬輪狀病毒的敘述，何者<strong>正確</strong>？',
  ('RVA 是人畜共通潛力最大的型別，台灣豬 RVA 與兒童中不尋常的 RVA 株遺傳相似度高', f'對：人類身上驗到類豬株與人豬重組 RVA，豬可能是新 RVA 基因的保毒庫（{p2(150)}、{p2(155)}）。'),
  [('有封套，用酒精即可迅速殺滅', '錯：無封套、分段 dsRNA，環境非常穩定；有效消毒劑是含氯化合物與戊二醛。'),
   ('為單股環狀 DNA 病毒', '錯：輪狀病毒是分段雙股 RNA（11 段），單股環狀 DNA 是 PCV。'),
   ('需要大量病毒（約 10⁶ 顆）才能讓仔豬下痢', '錯：感染力極高，少至 <strong>90 個</strong>病毒顆粒就能讓未吃初乳的仔豬下痢（' + p2(156) + '）。')])

assert len(Q) == 30, len(Q)

# ---------- 組卡片：答案位置輪替 ----------
POS = [1, 3, 0, 2, 2, 0, 3, 1]
LET = 'ABCD'
def card(i, d):
    pos = POS[(i - 1) % len(POS)]
    opts = [None] * 4
    opts[pos] = ('ans', d['ans'])
    rest = iter(d['others']);
    for k in range(4):
        if opts[k] is None: opts[k] = ('oth', next(rest))
    lis = ''.join(f'          <li>({LET[k]}) {o[1][0]}</li>\n' for k, o in enumerate(opts))
    ex = []
    for k, (kind, (txt, why)) in enumerate(opts):
        if kind == 'ans':
            lead = '錯誤，所以選它：' if d['kind'] == 'F' else '對：'
            if d['kind'] == 'F': why = re.sub(r'^錯：', '', why)
            else: why = re.sub(r'^對：', '', why)
            ex.append(f'({LET[k]}) {lead}{why}')
        else:
            ex.append(f'({LET[k]}) {why}')
    ans = LET[pos]
    return (f'      <div class="quiz-item exam-card">\n        <span class="quiz-type quiz-type-mcq">Q{i}（{d["tag"]}）</span>\n'
            f'        <div class="quiz-q">{d["stem"]}</div>\n        <ul class="quiz-options">\n{lis}        </ul>\n'
            f'        <details class="quiz-reveal">\n          <summary></summary>\n          <div class="quiz-answer correct">答案：({ans})</div>\n'
            f'          <p class="quiz-explain">{"<br>".join(ex)}</p>\n        </details>\n      </div>\n'), ans

groups = []
for d in Q:
    if not groups or groups[-1][0] != d['group']: groups.append((d['group'], []))
    groups[-1][1].append(d)

body_sections = []
idx = 0
ans_list = []
GID = {'非洲豬瘟（ASF）': 'asf', '豬瘟（CSF）': 'csf', '日本腦炎（JE）與 E 型肝炎（HE）': 'jehe', '豬環狀病毒相關疾病（PCVAD）': 'pcv',
       '豬生殖與呼吸綜合症（PRRS）': 'prrs', '豬小病毒（PPV）與輪狀病毒（RV）': 'ppvrv'}
LINK = {'asf': '../week02_豬病毒性疾病I.html#section-asf-a'.replace('../', ''), }
for gi, (g, items) in enumerate(groups):
    cards = []
    for d in items:
        idx += 1; c, a = card(idx, d); cards.append(c); ans_list.append((idx, a))
    first, last = idx - len(items) + 1, idx
    body_sections.append((GID[g], g, f'Q{first}–Q{last}', ''.join(cards)))

SECTIONS = []
intro = ('<div class="alert alert-warn"><div class="alert-label">先看這裡</div><p><strong>這 30 題是我依講義整理的預測題，不是真題，也不保證會考。</strong>'
 '沒有張家宜老師的考古題可以對照（過去的病毒考卷是鄭益謙老師出的）。選題依據有兩個：①第 2、3 週講義畫底線、本站標成「必考」的內容；②學長姐說張老師「考最特別的地方，畫底線的看一看就好」。答案與詳解依講義與本站各週筆記，頁碼可點開側欄對照，講義以外標「補充」。</p></div>'
 '<h3>張家宜老師的範圍</h3><p>第 2 週〈Swine viral diseases (I)〉：非洲豬瘟、豬瘟、日本腦炎、E 型肝炎；第 3 週〈Swine viral diseases (II)〉：PCVAD、PRRS、PPV、輪狀病毒、豬隻疫苗接種。第 4、5 週（口蹄疫、冠狀病毒、流感、疱疹）是高啓霏老師。</p>'
 '<h3>題目分配</h3><div class="table-wrap"><table><thead><tr><th>疾病</th><th>題數</th><th>題號</th></tr></thead><tbody>'
 + ''.join(f'<tr><td>{g}</td><td>{len(items)}</td><td>{rng}</td></tr>' for (gid, g, rng, _), (g2, items) in zip(body_sections, groups))
 + '</tbody></table></div>'
 '<h3>被問到的那一題：「唯一靠節肢動物傳播的病毒」</h3><p>答案是<strong>非洲豬瘟病毒（ASFV）</strong>，講義寫的是「<strong>唯一經節肢動物傳播的 <u>DNA</u> 病毒</strong>」（<a class="pdf-link" href="pdf/病毒性疾病I.pdf#page=19">p.19</a>）。注意「DNA」兩個字：日本腦炎病毒也靠蚊子傳播，但它是 RNA 病毒。這句話在講義是重點，所以放在 Q1；但是不是「一定會考」，我無法保證。</p>'
 '<details style="margin:10px 0"><summary style="cursor:pointer;font-weight:700">答案速查（先自己作答再打開）</summary><p>' + '　'.join(f'Q{n} {a}' for n, a in ans_list) + '</p></details>')
SECTIONS.append(('abstract', '怎麼用這一頁', '怎麼用這一頁', '張家宜老師範圍（第 2、3 週）30 題預測題。', intro, '整理自第 2、3 週講義與本站筆記。'))
for gid, g, rng, cards in body_sections:
    SECTIONS.append((gid, f'{g} {rng}', f'{g}（{rng}）', '先自己作答，再點開看答案與詳解。', cards, '課程講義〈Swine viral diseases (I)(II)〉；詳解頁碼見各選項。'))

# ---------- 組頁面 ----------
head_end = TPL.index('<section class="pagehead">'); script_start = TPL.index('<script>\nfunction showSection')
# PDF 側欄（取自第 5 週豬流感頁）
css = re.search(r'<style>.*?</style>', FLU, re.S).group(0)
panel = FLU[FLU.index('<div id="pdfPanel"'):]
panel_html = panel[:panel.index('</script>') + len('</script>')]
head = TPL[:head_end].replace('<title>豬病學期中總複習 - yc._vetalk</title>', '<title>豬病學：張家宜老師範圍 30 題 - yc._vetalk</title>').replace('</head>', css + '\n</head>', 1)
date = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
pagehead = f'''<section class="pagehead">
  <div class="pagehead__inner">
    <div class="breadcrumb">
      <a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="index.html">豬病學</a><span class="sep">›</span><span class="current">張家宜老師範圍 30 題</span>
    </div>
    <div class="page-head">
      <h1 class="page-title">張家宜老師範圍 30 題</h1>
      <p class="page-subtitle">Predicted Questions · 第 2、3 週（ASF、CSF、JE、HEV、PCVAD、PRRS、PPV、輪狀病毒）預測題與詳解</p>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">豬病學（大四上・期中範圍第 2、3 週）</div></div>
      <div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">第 2、3 週講義與本站筆記；題目為預測，非真題</div></div>
      <div class="meta-item"><div class="meta-label">最後更新</div><div class="meta-value">{date}</div></div>
      <div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">30 題含逐選項詳解</div></div>
    </div>
  </div>
</section>
'''
ICON = {'abstract': '⭐', 'asf': '🦟', 'csf': '🩸', 'jehe': '🧬', 'pcv': '🔬', 'prrs': '🫁', 'ppvrv': '🐖'}
toc = ['<div class="pagewrap">', '  <nav class="toc">']
for i, (sid, name, *_r) in enumerate(SECTIONS):
    if i == 0: toc.append('    <div class="section-label">總覽</div>')
    if i == 1: toc.append('    <div class="section-label" style="margin-top:8px;">題目</div>')
    act = ' class="active"' if i == 0 else ''
    toc.append(f'    <a{act} onclick="showSection(\'{sid}\')" id="nav-{sid}">\n      <span class="nav-icon">{ICON[sid]}</span> {name}\n    </a>')
toc.append('  </nav>\n\n  <main class="pagebody" id="mainContent">\n')
body = []
for i, (sid, name, title, desc, content, src) in enumerate(SECTIONS):
    body.append(f'    <div class="section" id="section-{sid}">\n      <div class="section-head"><div class="section-num">{i+1}</div><h2>{title}</h2></div>\n'
                f'      <p class="section-desc">{desc}</p>\n{content}\n      <footer class="note-footer">資料來源：{src}</footer>\n    </div>\n')
body.append('    <footer class="note-footer">本頁為個人課堂筆記整理，僅供學習與複習使用，不作為正式診斷依據。</footer>\n  </main>\n</div>\n\n')
script = TPL[script_start:]
names = ',\n'.join(f"  '{sid}': '{name}'" for sid, name, *_r in SECTIONS)
script = re.sub(r'const SECTION_NAMES = \{.*?\};', 'const SECTION_NAMES = {\n' + names + '\n};', script, flags=re.S)
html = head + pagehead + '\n' + '\n'.join(toc) + '\n'.join(body) + script.replace('<script src="../../assets/nav-data.js">', panel_html + '\n<script src="../../assets/nav-data.js">', 1)
open('張家宜30題.html', 'w', encoding='utf-8').write(html)
print('ok', len(html), 'answers', ''.join(a for _, a in ans_list))
