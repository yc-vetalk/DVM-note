# -*- coding: utf-8 -*-
"""產生 week06 的「講義所附國考題」與「期中考古題」題目卡片 HTML（含完整選項與逐選項詳解）。"""

def card(tag, stem, opts, ans, explain, fig=None, kind='mcq'):
    lis = '\n'.join(f'          <li>({"ABCDE"[i]}) {o}</li>' for i, o in enumerate(opts))
    f = f'\n        {fig}' if fig else ''
    return f'''      <div class="quiz-item exam-card">
        <span class="quiz-type quiz-type-{kind}">{tag}</span>
        <div class="quiz-q">{stem}</div>{f}
        <ul class="quiz-options">
{lis}
        </ul>
        <details class="quiz-reveal">
          <summary></summary>
          <div class="quiz-answer correct">答案：({ans})</div>
          <p class="quiz-explain">{explain}</p>
        </details>
      </div>
'''

def essay(tag, stem, answer):
    return f'''      <div class="quiz-item exam-card">
        <span class="quiz-type quiz-type-saq">{tag}</span>
        <div class="quiz-q">{stem}</div>
        <details class="quiz-reveal">
          <summary></summary>
          <div class="quiz-explain">{answer}</div>
        </details>
      </div>
'''

def ex(*parts):
    return '<br>'.join(parts)

APP = 'A. pleuropneumoniae'
# ---------------- 國考題 ----------------
NAT = {}
NAT['app'] = [
 card('114 年國考','下列有關豬放線桿菌胸膜肺炎之敘述，何者<strong>錯誤</strong>？',
  ['只發生於肥育期豬隻','造成出血性壞死性肺炎','病變主要由 Apx 毒素及 LPS 傷害所致','本病通常不感染人類'],'A',
  ex('(A) 錯，所以選它：APP 以生長肥育豬最常見，但「只發生」太絕對；講義寫感染場的仔豬會從帶菌母豬早期感染（p.11）。',
     '(B) 對：講義定義為纖維出血及壞死性胸膜肺炎（p.4）。',
     '(C) 對：致病第 4 階段「破壞組織」靠 Apx 毒素與 LPS（p.15）。',
     '(D) 對：宿主適應於豬，不是人畜共通病原（p.8）。')),
 card('110 年國考','下圖為一隻肥育豬隻，箭頭指示處顯示此斃死豬隻口鼻有泡沫樣血液流出。此豬隻死亡前有咳嗽、呼吸困難、發紺等臨床症狀，剖檢可見肺臟有水腫及出血。若從肺臟病灶分離出一種革蘭氏陰性細菌，CAMP test 為陽性，其最有可能是感染下列那一個病原？',
  ['<em>Pasteurella multocida</em>','<em>Actinobacillus pleuropneumoniae</em>','<em>Yersinia pestis</em>','<em>Escherichia coli</em>'],'B',
  ex('(B) 對：肥育豬＋口鼻泡沫血＋呼吸困難發紺＋肺出血水腫＋革蘭氏陰性＋<strong>CAMP 陽性</strong>，是 APP 的典型組合（講義 p.18、p.32）。',
     '(A) 錯：<em>P. multocida</em> 在本講義是萎縮性鼻炎（PAR）的病原，不以口鼻泡沫血、CAMP 陽性為特徵。',
     '(C) 錯：鼠疫桿菌不是豬的呼吸道病原。',
     '(D) 錯：<em>E. coli</em> 在豬造成下痢、水腫病、乳房炎、尿道感染，不造成胸膜肺炎。'),
  fig='[[F:36|110 年國考題附圖：斃死肥育豬口鼻流出泡沫樣血液（箭頭）。]]'),
 card('109 年國考','下列何者主要感染生長肥育豬隻，發生甚急性型感染時，豬隻呈現口鼻出血，並於短時間內死亡，剖檢以出血性或壞死性纖維素性胸膜肺炎為主要特徵？',
  ['<em>Mycoplasma hyopneumoniae</em>','<em>Actinobacillus pleuropneumoniae</em>','<em>Streptococcus suis</em>','<em>Brachyspira hyodysenteriae</em>'],'B',
  ex('(B) 對：甚急性型口鼻泡沫血、24–36 小時內死亡、纖維素出血壞死性胸膜肺炎（p.18、p.26）。',
     '(A) 錯：豬黴漿菌肺炎是慢性、乾咳的地方性肺炎，不會短時間內口鼻出血死亡（補充，屬之後的講義）。',
     '(C) 錯：豬鏈球菌主要造成保育豬腦膜炎、關節炎、敗血症（補充）。',
     '(D) 錯：豬赤痢的病原，病變在大腸，造成黏液血便（補充）。')),
 card('105 年國考','下列有關 <em>Actinobacillus pleuropneumoniae</em> RTX 毒素（repeats in the structural toxin）之描述，何者<strong>錯誤</strong>？',
  ['具有 ApxI、ApxII、ApxIII 與 ApxIV 四種','ApxIII 具有較強的溶血性','ApxII 具有弱溶血性','ApxI、ApxII、ApxIII 均具有細胞毒性'],'B',
  ex('(B) 錯，所以選它：講義 p.16 的表格中 ApxIII 的溶血性是 <strong>None</strong>，它只有強細胞毒性。',
     '(A) 對：表格列出 I–IV 四種。',
     '(C) 對：ApxII 溶血性 weak、細胞毒性 moderate。',
     '(D) 對：ApxI strong、ApxII moderate、ApxIII strong；ApxIV 的細胞毒性是 ND（未確定）。')),
 card('105 年國考','下列那一種豬隻病原<strong>不會</strong>感染人？',
  ['<em>Salmonella</em> Choleraesuis','<em>Brucella suis</em>','<em>Actinobacillus pleuropneumoniae</em>','<em>Erysipelothrix rhusiopathiae</em>'],'C',
  ex('(C) 對：APP 宿主適應於豬，不被視為人畜共通病原（p.8）。',
     '(A) 錯：S. Choleraesuis 在亞洲部分地區是人類侵襲性沙門氏菌症的重要原因（細菌性疾病 II）。',
     '(B) 錯：<em>B. suis</em> 是人類布氏桿菌症的主要來源之一（細菌性疾病 II）。',
     '(D) 錯：豬丹毒菌造成人類類丹毒（erysipeloid，fish handler\'s disease）（細菌性疾病 II）。')),
 card('104 年國考','下圖所示為位於山坡地區某一貫式豬場猝死肥育豬之症狀及病變，發病率約 6–9%，最有可能之疾病為何？',
  ['豬瘟','豬萎縮性鼻炎','豬放線桿菌胸膜肺炎','豬黴漿菌症'],'C',
  ex('(C) 對：圖中豬口鼻出血、肺臟暗紅出血病灶，肥育豬猝死，是 APP 最急性型。',
     '(A) 錯：豬瘟是全身出血性病毒病，主要病變在脾梗塞、淋巴結出血、迴盲瓣鈕扣狀潰瘍（第 2 週）。',
     '(B) 錯：萎縮性鼻炎病變限於鼻腔與頭骨，不會猝死。',
     '(D) 錯：黴漿菌肺炎是慢性、低死亡率。'),
  fig='[[F:40|104 年國考題附圖：左為口鼻出血的猝死肥育豬，右為出血性肺臟。]]'),
 card('103 年國考','胸膜肺炎放線桿菌（<em>Actinobacillus pleuropneumoniae</em>）所分泌的 APX 毒素，其作用機制最接近下列何者？',
  ['<em>Escherichia coli</em> 的 heat-labile enterotoxin','<em>Pseudomonas aeruginosa</em> 的 exotoxin A','<em>Clostridium tetani</em> 的 tetanus toxin','<em>Escherichia coli</em> 的 HlyA toxin'],'D',
  ex('(D) 對：Apx 與 <em>E. coli</em> 溶血素 HlyA 同屬 RTX 毒素家族，都是在細胞膜上形成孔洞造成溶血與細胞毒殺（補充：講義只寫 Apx 是 RTX 毒素，機制分類為延伸）。',
     '(A) 錯：LT 是活化 adenylate cyclase、升高 cAMP 的腸毒素（p.117）。',
     '(B) 錯：exotoxin A 抑制蛋白質合成（ADP-ribosylation of EF-2，補充）。',
     '(C) 錯：破傷風毒素阻斷抑制性神經傳導物質釋放（補充）。')),
 card('103 年國考','下列有關豬放線桿菌胸膜肺炎之敘述，何者正確？',
  ['單側性肺炎是主要的剖檢病灶','培養該病原菌時需添加 nicotinamide adenine dinucleotide（NAD）','臺灣經常爆發第四血清型','感染豬齡以哺乳豬最常見'],'B',
  ex('(B) 對：Biotype I 需要 NAD（V 因子），培養要用加 NAD 的血液培養基或 chocolate agar（p.6–7、p.32）。',
     '(A) 錯：講義寫 most <strong>bilateral</strong>（雙側）（p.26）。',
     '(C) 錯：台灣 2015–2022 年以血清型 15 最多，其次 5、1、7、2（p.6）。',
     '(D) 錯：主要是生長肥育豬。')),
 card('101 年國考','豬罹患放線桿菌胸膜肺炎，主要臨床症狀為下列何者？',
  ['急促腹式呼吸','神經症狀','下痢','嘔吐、食慾不振'],'A',
  ex('(A) 對：急性型嚴重呼吸症狀，呼吸困難、張口呼吸（p.19）。',
     '(B) 錯：APP 只感染呼吸道，不造成神經症狀。',
     '(C)(D) 錯：最急性型雖可能有「短暫」下痢、嘔吐（p.18），但不是主要症狀。')),
 card('100 年國考','下列有關豬罹患放線桿菌胸膜肺炎之敘述，何者正確？',
  ['剖檢可見大腸鈕扣狀潰瘍','肥育豬感染最為普遍','是造成哺乳豬下痢的主因','是造成氣腫疽的主因'],'B',
  ex('(B) 對：生長肥育豬最常見。',
     '(A) 錯：大腸鈕扣狀潰瘍是沙門氏菌症與豬瘟的病變。',
     '(C) 錯：哺乳豬下痢主因是 <em>E. coli</em>（ETEC）。',
     '(D) 錯：氣腫疽（blackleg）由 <em>Clostridium chauvoei</em> 引起，主要在反芻獸（補充）。')),
 card('97 年國考','自豬肺臟病灶分離 <em>Actinobacillus pleuropneumoniae</em> 所使用的培養基須添加下列何種成分？',
  ['lysine','neuraminidase','nicotinamide adenine dinucleotide','erythromycin'],'C',
  ex('(C) 對：NAD＝V 因子（p.6）。',
     '(A)(B)(D) 錯：離胺酸、神經胺酸酶、紅黴素都不是 APP 的生長需求。neuraminidase 是豬丹毒菌的毒力因子（細菌性疾病 II）。')),
 card('97 年國考','下列有關豬放線桿菌胸膜肺炎急性病例之敘述，何者正確？',
  ['臨床上可見口鼻滲血','哺乳豬的發生率最高','病原菌屬於革蘭氏陽性菌','病原菌屬於抗酸菌'],'A',
  ex('(A) 對：口鼻流出泡沫樣帶血液體（p.18、p.23）。',
     '(B) 錯：肥育豬最常見。',
     '(C) 錯：APP 是革蘭氏陰性（p.5）。',
     '(D) 錯：不是抗酸菌（抗酸菌如結核菌）。')),
 card('96 年國考','豬感染下列何種疾病，在臨床上可見口鼻出血？',
  ['豬流行性感冒','黴漿菌病','巴氏桿菌病','放線桿菌胸膜肺炎'],'D',
  ex('(D) 對：APP 的招牌症狀就是口鼻泡沫樣出血。',
     '(A) 錯：豬流感是高發病率、低死亡率的急性呼吸道病，咳嗽、流鼻水（第 5 週）。',
     '(B) 錯：黴漿菌病是慢性乾咳。',
     '(C) 錯：巴氏桿菌在本講義是萎縮性鼻炎；鼻出血可見於 PAR，但「口鼻出血」的經典答案是 APP。')),
]
NAT['ar'] = [
 card('115 年國考','下列何種病原所分泌的毒素為豬萎縮性鼻炎最主要之致病因子？',
  ['<em>Bordetella bronchiseptica</em>','<em>Staphylococcus aureus</em>','<em>Pasteurella multocida</em>','<em>Clostridium perfringens</em>'],'C',
  ex('(C) 對：產毒型 <em>P. multocida</em> 的 PMT 造成骨形成減少、骨吸收增加，導致<strong>永久性、進行性</strong>鼻甲骨萎縮（PAR）（p.51、p.63）。',
     '(A) 錯：<em>B. bronchiseptica</em> 的 DNT 也會傷骨，但只造成輕微、可逆的 NPAR，所以不是「最主要」。',
     '(B)(D) 錯：與萎縮性鼻炎無關。')),
 card('114 年國考','下列何者<strong>不是</strong> <em>Bordetella bronchiseptica</em> 造成豬隻呼吸道感染的致病因子？',
  ['filamentous hemagglutinin（FHA）','dermonecrotic toxin（DNT）','tracheal cytotoxin（TCT）','exfoliative toxins（EFT）'],'D',
  ex('(D) 不是，所以選它：表皮剝落毒素是 <em>Staphylococcus hyicus</em>（滲出性表皮炎）的毒素（細菌性疾病 II）。',
     '(A) 是：FHA 結合纖毛（p.61）。',
     '(B) 是：DNT 造成皮膚壞死、損害骨形成（p.61–62）。',
     '(C) 是：TCT 抑制纖毛運動、殺死纖毛細胞（p.61）。')),
 card('113 年國考','下圖為豬隻傳染病引起之病變，推測致病原因是 <em>Bordetella bronchiseptica</em>，其與下列何病原的感染最為相關？',
  ['<em>Salmonella</em> Typhimurium','<em>Escherichia coli</em>','<em>Pasteurella multocida</em>','<em>Staphylococcus aureus</em>'],'C',
  ex('(C) 對：<em>B. bronchiseptica</em> 讓 <em>P. multocida</em> 容易定殖上呼吸道，進而造成 PAR；推測 Pm 的 D 型莢膜以 Bb 的 FHA 為橋樑黏附（p.64）。',
     '(A)(B)(D) 錯：與萎縮性鼻炎無關。'),
  fig='[[F:79|113 年國考題附圖：鼻吻橫切面，兩側鼻甲骨萎縮。]]'),
 card('111 年國考','下列有關豬萎縮性鼻炎之敘述，何者正確？',
  ['因雙側鼻甲骨萎縮導致豬隻鼻吻部變短','患病豬隻眼窩下方污痕是因結膜炎所導致','於豬隻第一前臼齒處橫切面為觀察鼻甲骨萎縮最理想部位','本病尚無疫苗可用，防治策略以抗生素治療為主'],'A',
  ex('(A) 對（老師紅框）：鼻甲骨萎縮與骨重塑異常會讓上顎變短（上顎短顎症，p.55）。',
     '(B) 錯：眼下污痕是鼻腔病變影響鼻淚管、淚液外流沾灰塵形成（補充）；講義只寫「眼窩下有污痕」（p.67）。',
     '(C) 老師未框此選項：講義 p.73 分級圖寫「在第一與第二前臼齒<strong>之間</strong>」鋸開，與「第一前臼齒處」不同，可能是錯在位置。這點建議向老師確認。',
     '(D) 錯：母豬疫苗是主要防治手段，抗生素只在臨床上有正當理由時使用（p.75–76）。')),
 card('105 年國考','豬隻常見且易造成肺炎及萎縮性鼻炎之 <em>Pasteurella multocida</em> 血清型為何？',
  ['A、B','A、D','A、E','B、F'],'B',
  ex('(B) 對：豬的 <em>P. multocida</em> 以莢膜型 A、D 為主；講義本文提到 D 型莢膜與 Bb 的 FHA 結合（p.64）。',
     '（補充）B、E 型主要造成牛的出血性敗血症，F 型多見於禽類。')),
 card('104 年國考','下列有關 <em>Bordetella bronchiseptica</em> 的敘述，何者<strong>錯誤</strong>？',
  ['該菌為具運動性之革蘭氏陰性短桿菌','與 <em>Pasteurella multocida</em> 可引起萎縮性鼻炎','毒力株具有凝集血球能力','無法在 MacConkey 培養基上生長'],'D',
  ex('(D) 錯，所以選它：（補充）<em>B. bronchiseptica</em> 可以在 MacConkey 上生長（不發酵乳糖，菌落無色）。',
     '(A) 對：（補充）它有鞭毛、可運動。',
     '(B) 對：NPAR 與 PAR 的病原（p.50）。',
     '(C) 對：有絲狀血球凝集素 FHA（p.61）。')),
 card('104 年國考','<em>Pasteurella multocida</em> 依照細菌何種物質進行血清型分型為 A、B、D、E 與 F 等五種？',
  ['capsular polysaccharides','flagellum','pilus','peptidoglycan'],'A',
  ex('(A) 對：莢膜多醣體分型（補充：講義提到 D 型莢膜，p.64）。',
     '(B) 錯：<em>P. multocida</em> 不運動，沒有鞭毛。',
     '(C)(D) 錯：線毛與肽聚醣不是它的血清分型依據。')),
 card('102 年國考','<em>Pasteurella multocida</em> 與豬隻罹患下列何種疾病最具相關性？',
  ['多發性漿膜炎','萎縮性鼻炎','新生仔豬下痢','水腫病'],'B',
  ex('(B) 對：產毒型 Pm 造成 PAR。',
     '(A) 錯：多發性漿膜炎是 Glässer 病（<em>G. parasuis</em>）。',
     '(C)(D) 錯：都是 <em>E. coli</em>。')),
 card('98 年國考','<em>Bordetella bronchiseptica</em> 主要引起豬隻何種疾病？',
  ['萎縮性鼻炎','腸炎','心肌炎','腦膜炎'],'A',
  ex('(A) 對：NPAR，也與 Pm 共同造成 PAR。','(B)(C)(D) 錯：Bb 是上呼吸道病原，小豬（3–4 日齡）偶爾造成支氣管肺炎（p.65）。')),
 card('96 年國考','豬萎縮性鼻炎的主要症狀為下列何者？',
  ['迴旋、顫抖','打噴嚏、聳鼻','嘔吐、下痢','發燒、呼吸困難'],'B',
  ex('(B) 對：sneeze、snuffle、snort（p.65）。',
     '(A) 錯：神經症狀。','(C) 錯：腸道症狀。','(D) 錯：較像 APP 等下呼吸道病。')),
]
NAT['gp'] = [
 card('114 年國考','下列有關豬格拉瑟病（Glässer\'s disease）之敘述，何者正確？',
  ['致病原為消化道之常在菌叢','常發生在保育期仔豬','常見出血性炎症反應','不感染中樞神經系統'],'B',
  ex('(B) 對：保育舍主要的感染問題，臨床症狀主要在 4–8 週齡（p.88、p.95）。',
     '(A) 錯：是<strong>呼吸道</strong>（鼻腔）常在菌（p.92）。',
     '(C) 錯：特徵是<strong>纖維素性</strong>或纖維化膿性炎症（p.96）。',
     '(D) 錯：會造成腦膜炎與神經症狀（側躺、划水、顫抖）（p.95–96）。')),
 card('112 年國考','下列那一種病原會造成豬隻所謂的 Glässer\'s disease？',
  ['<em>Pasteurella multocida</em>','<em>Haemophilus parasuis</em>','<em>Salmonella</em> Typhimurium','<em>Erysipelothrix rhusiopathiae</em>'],'B',
  ex('(B) 對：<em>G. parasuis</em> 舊名 <em>H. parasuis</em>（p.87）。',
     '(A) 錯：萎縮性鼻炎。','(C) 錯：腸炎型沙門氏菌症。','(D) 錯：豬丹毒。')),
 card('111 年國考','下列何者為豬隻感染格拉瑟病（Glässer\'s disease）常見之病變？',
  ['腸炎','多發性漿膜炎','肝臟有粟粒狀大的壞死白點','滲出性表皮炎'],'B',
  ex('(B) 對。',
     '(A) 錯：Glässer 不造成腸炎。',
     '(C) 錯：肝臟粟粒狀壞死白點（副傷寒小節）是敗血型沙門氏菌症。',
     '(D) 錯：滲出性表皮炎是 <em>S. hyicus</em>。')),
 card('109 年國考','下圖病豬剖檢後可看到胸水及腹水，肺臟、心臟及腸管上均覆蓋多量白色纖維素，最有可能的致病原為下列何者？',
  ['<em>Bordetella bronchiseptica</em>','<em>Klebsiella pneumoniae</em>','<em>Salmonella</em> Typhimurium','<em>Haemophilus parasuis</em>'],'D',
  ex('(D) 對：胸腹腔積液＋多個臟器表面纖維素＝纖維素性多發性漿膜炎（p.96、p.100）。',
     '(A) 錯：萎縮性鼻炎。','(B) 錯：非本講義的豬重要病原。','(C) 錯：腸炎型沙門氏菌症。'),
  fig='[[F:106|109 年國考題附圖：胸腹腔臟器表面覆蓋白色纖維素。]]'),
 card('109 年國考','下列何者的培養並不需要 X 因子，但需要 V 因子？',
  ['<em>Mycoplasma hyopneumoniae</em>','<em>Erysipelothrix rhusiopathiae</em>','<em>Salmonella</em> Choleraesuis','<em>Haemophilus parasuis</em>'],'D',
  ex('(D) 對：講義 p.89 原句。',
     '(A) 錯：黴漿菌沒有細胞壁，培養需要特殊含血清培養基（補充）。',
     '(B)(C) 錯：一般培養基即可生長。')),
 card('102 年國考','下列何者與 Glässer\'s 氏病<strong>無關</strong>？',
  ['腹膜炎','關節炎','腦膜炎','肝炎'],'D',
  ex('(D) 無關，所以選它。','(A)(B)(C) 都有關：纖維素滲出物出現在胸膜、心包、腹膜、滑膜與腦膜（p.96）。')),
 card('101 年國考','下列有關豬多發性漿膜炎之敘述，何者<strong>錯誤</strong>？',
  ['由嗜血桿菌（<em>Haemophilus parasuis</em>）感染引起的疾病，又名 Glässer\'s 病','保育豬及肥育豬極少發生','感染豬隻有肺炎及關節炎之病症','感染豬隻有腹膜炎及肺炎之病症'],'B',
  ex('(B) 錯，所以選它：保育舍主要問題，也影響生長豬與母豬（p.88）。',
     '(A) 對。','(C)(D) 對：急性有咳嗽、腹式呼吸、關節炎、胸膜與腹膜炎。')),
 card('99 年國考','下列何者是豬 Glässer\'s disease 的病原？',
  ['<em>Haemophilus</em>','<em>Pasteurella</em>','Pseudorabies virus','Poxvirus'],'A',
  ex('(A) 對。','(B) 錯：萎縮性鼻炎。','(C) 錯：假性狂犬病（第 4 週）。','(D) 錯：豬痘（第 4 週）。')),
 card('98 年國考','豬的多發性漿膜炎由 <em>Haemophilus parasuis</em> 引起，又稱為什麼病？',
  ['Greasy 病','Glässer\'s 氏病','Johne 氏病','Heart water 病'],'B',
  ex('(B) 對。','(A) 錯：greasy pig disease＝滲出性表皮炎。','(C) 錯：Johne 病＝反芻獸副結核病。','(D) 錯：heartwater 是反芻獸的 <em>Ehrlichia ruminantium</em> 感染（補充）。')),
 card('96 年國考','下列何者又稱 Glässer\'s disease？',
  ['水腫病','放線桿菌胸膜肺炎','芽胞梭菌症','多發性漿膜炎'],'D',
  ex('(D) 對。','(A) 錯：<em>E. coli</em>。','(B) 錯：APP。','(C) 錯：梭菌（之後的講義）。')),
]
NAT['ec'] = [
 card('115 年國考','大腸桿菌所引起的豬原發性敗血症，好發於下列何種階段？',
  ['1–4 日齡','3–4 週齡','5–6 週齡','7–8 週齡'],'A',
  ex('(A) 對（老師紅框）。講義本文沒有談敗血症；（補充）新生仔豬未吃到足夠初乳時，<em>E. coli</em> 可直接侵入血流造成敗血症，所以落在出生後幾天內。',
     '(B)(C)(D) 錯：這些年齡已有初乳抗體或主動免疫，原發性敗血症少見。')),
 card('115 年國考','病原性大腸桿菌所產生的 heat-labile toxin，其作用機制最接近下列那一個毒素？',
  ['Shiga toxin','cholera toxin','listeriolysin','suilysin'],'B',
  ex('(B) 對：LT 活化 adenylate cyclase、升高 cAMP（p.117）；（補充）霍亂毒素作用方式相同，兩者結構也相近。',
     '(A) 錯：Shiga toxin（Stx2e）抑制蛋白質合成、傷害血管內皮（水腫病）。',
     '(C) 錯：李斯特菌溶血素，為孔洞形成毒素（補充）。',
     '(D) 錯：豬鏈球菌溶血素（補充）。')),
 card('115 年國考','下列何種病原可造成豬隻過度分泌型（hypersecretion）下痢？',
  ['<em>Brachyspira hyodysenteriae</em>','<em>Lawsonia intracellularis</em>','<em>Escherichia coli</em>','<em>Clostridium perfringens</em> Type C'],'C',
  ex('(C) 對：ETEC 的腸毒素讓腸細胞分泌電解質與水，不破壞黏膜（p.117–118）。',
     '(A) 錯：豬赤痢，大腸黏膜壞死、黏液血便（補充）。',
     '(B) 錯：增殖性腸病（補充）。',
     '(D) 錯：壞死性出血性腸炎（補充）。')),
 card('114 年國考','下列何種豬致病型大腸桿菌，會造成豬隻腸上皮細胞 attaching and effacing 病灶？',
  ['Enterotoxigenic <em>E. coli</em>（ETEC）','Enteropathogenic <em>E. coli</em>（EPEC）','Extraintestinal pathogenic <em>E. coli</em>（ExPEC）','Enteroaggregative <em>E. coli</em>（EAggEC）'],'B',
  ex('(B) 對：AEEC 就是類似人類 EPEC 的菌，緊密附著並抹除微絨毛（p.116、p.130）。',
     '(A) 錯：ETEC 只黏附、不破壞微絨毛。',
     '(C) 錯：腸道外致病型（如 UPEC、敗血症）。',
     '(D) 錯：聚集型，主要見於人類。')),
 card('113 年國考','利用鑑定 <em>Escherichia coli</em> 表面不同的 O、H、K 或 F 抗原，可用來進行血清分型，其中 H 代表那一種抗原？',
  ['線毛抗原','莢膜抗原','菌體抗原','鞭毛抗原'],'D',
  ex('(D) 對（補充：講義本文未列）。O＝菌體（LPS）、H＝鞭毛、K＝莢膜、F＝線毛（例如 F4 即 K88）。')),
 card('112 年國考','下列何種病原性大腸桿菌可造成剛離乳保育豬之水腫病？',
  ['enteroaggregative <em>E. coli</em>','enterotoxigenic <em>E. coli</em>','enteropathogenic <em>E. coli</em>','Shiga toxin-producing <em>E. coli</em>'],'D',
  ex('(D) 對：EDEC 也稱 STEC（p.116）。',
     '(B) 錯：ETEC 造成新生仔豬下痢與離乳後下痢。',
     '(C) 錯：EPEC（AEEC）造成離乳後下痢的 A/E 病灶。',
     '(A) 錯：與豬水腫病無關。')),
 card('112 年國考','大腸桿菌除線毛外，下列何種因子是造成豬水腫病的主要原因？',
  ['莢膜','毒素','脂多醣','鞭毛'],'B',
  ex('(B) 對：F18 線毛黏附＋Stx2e 毒素造成主要症狀與病變（p.136）。','(A)(C)(D) 錯。')),
 card('110 年國考','造成新生仔豬下痢的大腸桿菌通常是帶有 K88、K99 或 987P 抗原的 enterotoxigenic <em>Escherichia coli</em>。上述的抗原是細菌的何種構造或成分？',
  ['莢膜（capsule）','鞭毛（flagella）','孔蛋白（porin）','線毛（fimbriae）'],'D',
  ex('(D) 對：K88＝F4、K99＝F5、987P＝F6，都是線毛（p.117）。',
     '(A) 錯：名稱裡的「K」原本是莢膜抗原的命名方式，所以容易誤選；後來確認它們其實是線毛，才改名為 F4、F5（補充）。',
     '(B)(C) 錯。')),
 card('110 年國考','下圖為離乳後 1–3 週的豬隻，眼瞼水腫且剖檢後在胃壁的黏膜下層也看到膠樣水腫。可能造成此症狀及病變的病原為何？',
  ['<em>Staphylococcus hyicus</em>','<em>Escherichia coli</em>','<em>Streptococcus suis</em>','<em>Haemophilus parasuis</em>'],'B',
  ex('(B) 對：水腫病，離乳後、眼瞼水腫、胃黏膜下層水腫（p.136–143）。',
     '(A) 錯：滲出性表皮炎。','(C) 錯：腦膜炎、關節炎。','(D) 錯：多發性漿膜炎。'),
  fig='[[F:159|110 年國考題附圖：離乳後豬隻眼瞼水腫。]]'),
 card('107 年國考','下列有關 <em>Escherichia coli</em> 造成的新生仔豬下痢，何者正確？',
  ['由 enteropathogenic <em>Escherichia coli</em> strain 所造成','腸黏膜破壞嚴重，所以下痢便通常帶有血液及黏液','病原通常帶有線毛及腸毒素二個重要致病因子','通常發生在 1 週齡以上的仔豬'],'C',
  ex('(C) 對：線毛黏附＋腸毒素（p.117）。',
     '(A) 錯：新生仔豬下痢是 ETEC。',
     '(B) 錯：ETEC 不破壞黏膜，黏膜蒼白不發炎，不帶血。',
     '(D) 錯：最常見 0–4 日齡。')),
 card('107 年國考','下列何者為 0–4 日齡新生仔豬下痢最常見的病原？',
  ['<em>Salmonella</em> Typhimurium','<em>Isospora suis</em>','<em>Brachyspira hyodysenteriae</em>','<em>Escherichia coli</em>'],'D',
  ex('(D) 對（p.117）。',
     '(A) 錯：沙門氏菌症多在離乳後保育豬。',
     '(B) 錯：仔豬球蟲症多在 7–14 日齡（補充）。',
     '(C) 錯：豬赤痢在生長肥育豬（補充）。')),
 card('106 年國考','下列有關豬隻水腫病（edema disease）的敘述，何者正確？',
  ['常發生於一週齡以下仔豬','豬隻一旦發病，通常預後不佳，死亡率高','病原為 <em>Brucella suis</em>','致病機制主要是因為病原分泌一種造成細胞 cyclic AMP 上升的毒素所導致'],'B',
  ex('(B) 對：最急性毒血症，病程快（p.136、p.139）。',
     '(A) 錯：離乳後、快速生長的保育豬。',
     '(C) 錯：病原是溶血性 <em>E. coli</em>。',
     '(D) 錯：升高 cAMP 的是 LT（ETEC）；水腫病是 Stx2e 傷害血管內皮。')),
 card('105 年國考','腸毒素產生型大腸桿菌（ETEC）會造成新生仔豬下痢，最重要的致病因子是產生毒素以及下列何種抗原？',
  ['線毛抗原（fimbrial antigen）','莢膜抗原（capsular antigen）','鞭毛抗原（flagellar antigen）','體抗原（somatic antigen）'],'A',
  ex('(A) 對：沒有線毛就黏不上腸壁，毒素也無法作用（p.118）。','(B)(C)(D) 錯。')),
 card('104 年國考','下列有關豬隻大腸桿菌症之敘述，何者<strong>錯誤</strong>？',
  ['造成初生仔豬下痢','造成離乳豬下痢','造成保育豬水腫病','造成肥育豬血痢'],'D',
  ex('(D) 錯，所以選它：肥育豬血痢想到豬赤痢（<em>B. hyodysenteriae</em>）或增殖性出血性腸病（補充）。','(A)(B)(C) 對（p.114）。')),
 card('104 年國考','引起豬尿道感染的大腸桿菌最常看到帶有 P 線毛（P fimbriae）及下列那一種線毛？',
  ['F4','F5','curli','type 1'],'D',
  ex('(D) 對：type 1 與 P 線毛（p.148）。','(A)(B) 錯：腸道 ETEC 的線毛。','(C) 錯：curli 是生物膜相關纖維（補充）。')),
 card('103 年國考','下列有關豬隻水腫病（edema disease）的敘述，何者正確？',
  ['常發生於離乳前仔豬','水腫較常見於胃黏膜下層及腸繫膜','病原為 <em>Clostridium perfringens</em>','病原在 blood agar 上通常不具溶血性'],'B',
  ex('(B) 對（p.137）。','(A) 錯：離乳後。','(C) 錯：<em>E. coli</em>。','(D) 錯：水腫病的菌是<strong>溶血性</strong> <em>E. coli</em>（p.136）。')),
 card('101 年國考','有關水腫病（edema disease）的敘述，下列何者正確？',
  ['主要發生在豬，致病因子為大腸桿菌毒素','病原為梭狀桿菌，主要發生在羊','結腸與胃壁的水腫最不明顯','為台灣常見的疾病'],'A',
  ex('(A) 對。','(B) 錯：病原是 <em>E. coli</em>。','(C) 錯：胃黏膜下層與結腸繫膜水腫<strong>最明顯</strong>。','(D) 講義沒有寫台灣盛行情形；老師框的是 (A)。')),
 card('100 年國考','有關豬大腸桿菌症的敘述，下列何項<strong>錯誤</strong>？',
  ['易發生在出生至離乳後 2–3 週的仔豬','腸管絨毛嚴重萎縮','疾病發生無季節性','剖檢胃內常見凝乳塊，小腸失去彈性'],'B',
  ex('(B) 錯，所以選它：ETEC 不破壞絨毛；絨毛萎縮是病毒性下痢（TGE、PED、輪狀病毒）的特徵。',
     '(A) 對：新生仔豬下痢＋離乳後下痢。','(C) 對（補充）。','(D) 對：胃有凝乳、小腸壁薄透明（p.126–127）。')),
 card('99 年國考','下列有關豬水腫病的敘述，何者<strong>錯誤</strong>？',
  ['罹病後因毒素侵害血管內皮細胞而水腫','常發生於離乳後到保育期','罹病後有急性發熱現象','與溶血性大腸桿菌有關'],'C',
  ex('(C) 錯，所以選它：水腫病是毒素造成的血管傷害，通常不發燒（補充：講義沒寫體溫，答案依老師紅框）。','(A)(B)(D) 對（p.136–137）。')),
]

# ---------------- 期中考古 ----------------
K = {}
K['106'] = [
 card('106 學年期中 Q2','若您今天到豬場，看到急性死亡的生長肥育豬隻有口鼻出血情形，您進行剖檢，見到纖維素性胸膜炎，肺臟呈現濕重且瀰漫性的出血水腫。後續追蹤，實驗室報告微生物分離可見革蘭氏陰性細菌，且 CAMP（Christie, Atkins, Munch-Petersen）reaction 為陽性反應，依此判斷，您覺得最有可能的致病原為以下何者？',
  ['<em>Salmonella</em> Choleraesuis','<em>Actinobacillus pleuropneumoniae</em>','<em>Bordetella bronchiseptica</em>','<em>Escherichia coli</em>'],'B',
  ex('(B) 對：與 110 年國考同一模式。','(A) 錯：敗血型沙門氏菌症是耳翼發紺、脾腫、肝壞死點。','(C) 錯：萎縮性鼻炎。','(D) 錯：腸道與泌尿道病原。')),
 card('106 學年期中 Q6','豬萎縮性鼻炎是由 <em>Bordetella bronchiseptica</em> 及下列哪一個病原的感染最有關？',
  ['<em>Salmonella</em> Typhimurium','<em>Pasteurella multocida</em>','<em>Haemophilus parasuis</em>','<em>Erysipelothrix rhusiopathiae</em>'],'B',
  ex('(B) 對（p.50）。','(C) 錯：Glässer 病。','(A)(D) 錯。')),
 card('106 學年期中 Q12','豬的多發性漿膜炎又稱之為 Glässer\'s disease，由下列何種病原所引起？',
  ['<em>Haemophilus parasuis</em>','<em>Pasteurella multocida</em>','<em>Salmonella</em> Typhimurium','<em>Bordetella bronchiseptica</em>'],'A',
  ex('(A) 對。','(B)(D) 錯：萎縮性鼻炎。','(C) 錯：腸炎型沙門氏菌症。')),
 card('106 學年期中 Q13','以下圖示的豬隻有鼻吻部變形的情形，我們可合理預期，臨床上這隻豬比較有可能會有以下何種症狀？（考卷附圖同講義 p.53 鼻吻部彎曲）',
  ['嘔吐及下痢','迴旋及顫抖','發燒及呼吸困難','打噴嚏及聳鼻'],'D',
  ex('(D) 對（p.65–66）。','(A)(B)(C) 錯：分別是腸道、神經、下呼吸道症狀。')),
 card('106 學年期中 Q24','豬的離乳後大腸桿菌下痢（postweaning <em>Escherichia coli</em> diarrhea）敘述，下列何者<strong>錯誤</strong>？',
  ['致病原通常會帶有 F4（K88）或 F18 fimbriae','主要是因為離乳後，移行抗體下降所造成','下痢便通常帶血及黏液','常分離的致病原屬 enterotoxigenic <em>Escherichia coli</em>（ETEC），但也可分離到 attaching and effacing <em>E. coli</em>'],'C',
  ex('(C) 錯，所以選它：<em>E. coli</em> 下痢不帶血。','(A) 對（p.130）。','(B) 對：離乳失去乳汁抗體（p.129）。','(D) 對（p.130）。')),
 card('106 學年期中 Q25','下列有關 <em>Actinobacillus pleuropneumoniae</em> 之描述，何者<strong>錯誤</strong>？',
  ['會造成豬隻纖維出血及壞死性胸膜肺炎','此細菌產生的 APX 毒素，目前已知共有 APXI、APXII、APXIII 三種毒素','目前已知有 15 種血清型','可以依照 nicotinamide adenine dinucleotide 的需求性區分為 biotype I 與 biotype II'],'B',
  ex('(B) 錯，所以選它（老師紅字）：已知 <strong>4 種</strong>（ApxI–IV）。',
     '(A) 對。','(C) 當年（2017）的說法；現在講義寫 <strong>19</strong> 種血清型，今年考試要寫 19。','(D) 對。')),
 card('106 學年期中 Q28','造成豬隻尿道感染的 <em>Escherichia coli</em>，最常會具有第一型線毛（type 1 fimbriae）以及哪一種線毛？',
  ['987P fimbriae','P fimbriae','curli fimbriae','F41 fimbriae'],'B',
  ex('(B) 對（p.148）。','(A)(D) 錯：ETEC 腸道線毛（F6、F41）。','(C) 錯。')),
]
K['111'] = [
 card('111 學年期中 Q2','若您今天到豬場，看到急性死亡的生長肥育豬隻有口鼻出血情形，您進行剖檢，見到纖維素性胸膜炎，肺臟呈現濕重且瀰漫性的出血水腫。後續追蹤，實驗室報告微生物分離可見革蘭氏陰性細菌，無法以血液培養基（blood agar）分離細菌，但利用巧克力培養基（chocolate agar）可分離得到此病原。請問以下相關敘述，何者正確？',
  ['為人畜共通傳染病原','此病原可耐惡劣環境，在環境存活時間很長','此病原靠豬隻近距離的接觸，藉飛沫傳播','此病原具有孢子（spore）'],'C',
  ex('病原是 APP（需要 NAD 所以要 chocolate agar）。',
     '(C) 對：主要傳播途徑是短距離的鼻對鼻直接接觸（p.10）。',
     '(A) 錯：不是人畜共通（p.8）。',
     '(B) 錯：環境存活時間短，尤其溫暖乾燥時（p.11）。',
     '(D) 錯：APP 不形成孢子（形成孢子的是梭菌、桿菌屬）。')),
 card('111 學年期中 Q8','如下圖所示，在剖檢的豬隻看到胸腔及腹腔的臟器有黃白色的纖維素性滲出物所沾黏，也就是一種多發性漿膜炎（polyserositis）的症狀，以下何者正確？（考卷附圖同講義 p.100）',
  ['應該是 <em>Salmonella</em> Choleraesuis 所造成的感染','保育豬及肥育豬極少發生（seldom occur in nursery and fattening pigs）','此病原在體外生長需要 X factor（hemin）','又稱為 Glässer disease'],'D',
  ex('(D) 對。','(A) 錯：病原是 <em>G. parasuis</em>。','(B) 錯：保育舍主要問題。','(C) 錯：需要 V 因子，<strong>不需要</strong> X 因子（p.89）。')),
 card('111 學年期中 Q9','豬萎縮性鼻炎（atrophic rhinitis, AR）是由 <em>Bordetella bronchiseptica</em> 及下列哪一個病原的感染最有關？',
  ['<em>Salmonella</em> Typhimurium','<em>Haemophilus parasuis</em>','<em>Pasteurella multocida</em>','<em>Erysipelothrix rhusiopathiae</em>'],'C',
  ex('(C) 對。','(B) 錯：Glässer 病。','(A)(D) 錯。')),
 card('111 學年期中 Q13','下列有關豬隻水腫病（edema disease）的敘述，何者正確？',
  ['致病原為 <em>Haemophilus parasuis</em>','通常發生在 1 週齡以下豬隻','發病後，利用抗生素治療，通常可以達到很好的療效','胃黏膜下層及腸繫膜（submucosa of stomach and mesocolon）是常見水腫的區域'],'D',
  ex('(D) 對（p.137）。','(A) 錯：溶血性 <em>E. coli</em>。','(B) 錯：離乳後保育豬。','(C) 錯：病程快，<strong>預防比治療重要</strong>（p.139）。')),
 card('111 學年期中 Q15','以下圖示的豬隻，剖檢可見鼻甲骨（turbinate）有破壞、變型等情形，我們可合理預期，臨床上這隻豬比較有可能會有以下何種症狀（symptoms）？（考卷附圖同講義 p.72）',
  ['嘔吐及下痢（vomiting and diarrhea）','打噴嚏、鼻塞及聳鼻（sneezing, snuffling and snorting）','發燒及呼吸困難（fever and dyspnea）','迴旋及顫抖（circling and tremor）'],'B',
  ex('(B) 對：講義原文 sneeze, snuffle, snort（p.65）。','(A)(C)(D) 錯。')),
 card('111 學年期中 Q16','下列有關胸膜肺炎放線桿菌（<em>Actinobacillus pleuropneumoniae</em>）之描述，何者正確？',
  ['造成豬隻多發性漿膜炎（polyserositis）的病原','可以依照 hemin（X factor）的需求性區分為 biotype I 與 biotype II','此細菌的 APX 毒素的作用機制類似大腸桿菌 heat labile toxin','此細菌產生的 APX 毒素，目前已知共有 APX I、APX II、APX III、APX IV 四種毒素'],'D',
  ex('(D) 對（p.16）。','(A) 錯：多發性漿膜炎是 Glässer 病。','(B) 錯：依 <strong>NAD（V 因子）</strong>區分。','(C) 錯：Apx 類似 HlyA（RTX），不是 LT（cAMP）。')),
 card('111 學年期中 Q17','大腸桿菌（<em>Escherichia coli</em>）的哪一種線毛（fimbriae）會造成豬隻由尿道上行感染至腎臟，造成腎盂腎炎（pyelonephritis）？',
  ['F6 fimbriae','P fimbriae','curli fimbriae','F41 fimbriae'],'B',
  ex('(B) 對（p.148、p.150）。','(A)(D) 錯：ETEC 腸道線毛。','(C) 錯。')),
 card('111 學年期中 Q19','有關 <em>Escherichia coli</em> 所造成的新生仔豬下痢（neonatal diarrhea），下列敘述，何者<strong>錯誤</strong>？',
  ['由 enterotoxigenic <em>E. coli</em>（ETEC）所造成','通常發生在 0–3 天左右的仔豬','下痢便帶有血液及黏液','病原通常帶有線毛及腸毒素二個重要的致病因子'],'C',
  ex('(C) 錯，所以選它：分泌性下痢，黃色水樣、不帶血。','(A)(B)(D) 對（p.117）。')),
 card('111 學年期中 Q24','以下為一隻年齡約離乳後（post weaning）豬隻的照片，注意眼皮（eyelids）的地方，假設這是一種因細菌感染（bacterial infection）所引起的症狀，請問以下敘述，何者正確？（考卷附圖：眼瞼水腫，同講義 p.140）',
  ['發現症狀後，利用抗生素治療應可達到治癒效果','應該是細菌分泌可以破壞蛋白質合成的毒素所造成','應該是 brucellosis','這種疾病又稱為 malignant edema'],'B',
  ex('病是水腫病。',
     '(B) 對：Stx2e 屬志賀毒素家族；（補充）志賀毒素會切斷核糖體 RNA、<strong>抑制蛋白質合成</strong>，使血管內皮細胞死亡。講義只寫「傷害血管內皮」。',
     '(A) 錯：病程快，預防比治療重要。',
     '(C) 錯：布氏桿菌症造成流產與睪丸炎。',
     '(D) 錯：malignant edema（惡性水腫）是 <em>Clostridium septicum</em> 等梭菌的傷口感染（補充）。')),
]
K['joint'] = [
 card('合卷 Part B Q5','若看到急性死亡的生長肥育豬隻有口鼻出血，剖檢可見纖維素性胸膜炎，肺臟呈現濕重且瀰漫性的出血水腫，微生物分離可見革蘭氏陰性桿菌，且 CAMP reaction 為陽性反應，最有可能的是該豬隻感染以下何種細菌？',
  ['<em>Salmonella</em> Choleraesuis','<em>Pasteurella multocida</em>','<em>Bordetella bronchiseptica</em>','<em>Actinobacillus pleuropneumoniae</em>'],'D',
  ex('(D) 對：與 106 學年 Q2、110 年國考同一題型。','(A)(B)(C) 錯。')),
 card('合卷 Part B Q10','<em>Bordetella bronchiseptica</em> 及 <em>Pasteurella multocida</em> 主要會引起豬隻那一種疾病？',
  ['腦膜炎','丹毒','萎縮性鼻炎','胃腸炎'],'C',ex('(C) 對。','(A) 錯：Glässer 病、豬鏈球菌。','(B) 錯：<em>E. rhusiopathiae</em>。','(D) 錯。')),
 card('合卷 Part B Q11','有一種疾病又稱為 Glässer\'s disease，剖檢豬隻可能看到纖維素性多發性漿膜炎（fibrinous polyserositis），請問是何種病原所造成？',
  ['<em>Escherichia coli</em>','<em>Lawsonia intracellularis</em>','<em>Mycoplasma hyorhinis</em>','<em>Haemophilus parasuis</em>'],'D',
  ex('(D) 對。','(C) 補充：<em>M. hyorhinis</em> 也會造成多發性漿膜炎與關節炎，但「Glässer\'s disease」專指 <em>H. parasuis</em>。','(A)(B) 錯。')),
 card('合卷 Part B Q15','0–4 日齡仔豬下痢，最常見的細菌性病原為何？',
  ['<em>Lawsonia intracellularis</em>','<em>Salmonella</em> Typhimurium','<em>Escherichia coli</em>','<em>Brachyspira hyodysenteriae</em>'],'C',ex('(C) 對（p.117）。','(A)(B)(D) 錯：好發年齡都較大。')),
 card('合卷 Part B Q19','有關豬隻水腫病（edema disease）的敘述，下列何者<strong>錯誤</strong>？',
  ['常發生於離乳前仔豬','致病原劃在 blood agar 通常可見溶血現象','常見胃及腸系膜黏膜下層水腫','致病原可分泌毒素傷害血管內皮細胞'],'A',
  ex('(A) 錯，所以選它：離乳<strong>後</strong>。','(B) 對：溶血性 <em>E. coli</em>。','(C) 對。','(D) 對：Stx2e。')),
]
ESSAY = [
 essay('問答｜106 學年 Q2、合卷 Q4','請說明胸膜肺炎放線桿菌（<em>Actinobacillus pleuropneumoniae</em>）的致病機制（pathogenesis）。',
  '<p>講義 p.15 的四個階段：</p><ol>'
  '<li><strong>定殖（colonization）</strong>：以線毛、LPS 黏附下呼吸道（肺泡與細支氣管末端上皮）。</li>'
  '<li><strong>營養攝取（nutrient uptake）</strong>：取得鐵、鎳。（補充：以 transferrin binding protein TbpA/TbpB 與宿主搶鐵；鎳是 urease 所需。）</li>'
  '<li><strong>逃避宿主清除</strong>：莢膜與 LPS 抵抗吞噬殺菌，並有抗氧化壓力防禦。（補充：SodC、DnaK。）</li>'
  '<li><strong>破壞宿主組織</strong>：Apx 毒素（ApxI 強溶血強細胞毒、ApxII 弱溶血中等細胞毒、ApxIII 不溶血強細胞毒、ApxIV 全部血清型都有）造成溶血與細胞毒殺；LPS 引起發炎、細胞激素與內毒素性休克。最終組織壞死，形成纖維素出血壞死性胸膜肺炎。</li></ol>'
  '<p>可加一句誘因：壓力（擁擠、通風差、溫差、混群）與 PR、PRRS 混合感染會加重病情（p.14）。</p>'),
 essay('問答｜106 學年 Q4、合卷 Q1','假設一個豬場正在爆發由大腸桿菌所造成的新生仔豬下痢，請敘述您預期會觀察到這些病死仔豬在外觀、剖檢，以及微生物特性等三個面向的情形（或：說明其致病機制）。',
  '<p><strong>外觀</strong>：0–4 日齡仔豬黃色水樣下痢、嚴重脫水、眼窩下陷、消瘦、毛粗、肋骨與骨盆突出，畏冷擠成一堆，會陰沾滿糞便（p.122–125）。</p>'
  '<p><strong>剖檢</strong>：小腸擴張、壁薄透明、腸腔積液；黏膜蒼白<strong>不發炎</strong>、絨毛不萎縮；胃內充滿乳汁，凝乳塊常呈層狀（p.123、p.126–127）。</p>'
  '<p><strong>微生物特性與致病機制</strong>：ETEC，革蘭氏陰性桿菌、腸內細菌科。以線毛 F4（K88）、F5（K99）、F6（987P）、F41 黏附小腸上皮（不侵入、不破壞微絨毛），分泌腸毒素：LT 活化 adenylate cyclase → cAMP↑；STa 活化 guanylate cyclase → cGMP↑（另有 STb）→ 碳酸氫根、鈉、氯與水分泌到腸腔 → 分泌性下痢 → 脫水、代謝性酸中毒 → 死亡（p.117–118）。</p>'),
 essay('問答｜111 學年 Q3','請你畫一個由胸膜肺炎放線桿菌（<em>Actinobacillus pleuropneumoniae</em>）所感染的豬隻肺臟，並說明在肉眼下，你會預期看到的主要病變特徵為何。',
  '<p>畫兩側肺（尖葉、心葉、橫膈葉），在<strong>兩側</strong>的心葉、尖葉與部分橫膈葉（特別是背側）畫出<strong>界線清楚、黑紅色、隆起</strong>的病灶，表面畫纖維素並標示與胸壁沾黏。標註：</p><ul>'
  '<li>雙側、局部且界線清楚的纖維素出血壞死性胸膜肺炎（p.26）。</li>'
  '<li>肺暗紅、質硬，切面流血（p.31）。</li>'
  '<li>纖維素性胸膜炎：肺與壁層胸膜沾黏；常伴隨纖維素性心包炎（p.26、p.31）。</li>'
  '<li>氣管與支氣管內泡沫樣帶血黏液；胸腔帶血液體（p.26）。</li>'
  '<li>慢性病例：纖維性胸膜沾黏（屠宰場所見，p.13、p.29）。</li></ul>'
  '<p>參考圖：講義 p.27（肺葉示意）與 p.29。</p>'),
 essay('問答｜111 學年 Q2','請敘述由 <em>Escherichia coli</em> 造成的新生仔豬下痢、<em>Salmonella</em> 所造成的下痢，以及由 <em>Clostridium perfringens</em> type C 所造成下痢，各有何特性？',
  '<p><strong><em>E. coli</em>（本講義）</strong>：0–4 日齡；ETEC 線毛＋腸毒素；黃色水樣、不帶血；腸道不發炎、絨毛不萎縮、胃有凝乳；脫水與酸中毒。</p>'
  '<p><strong>沙門氏菌</strong>：見下一講〈細菌性疾病 (II)〉。重點是離乳後保育豬、S. Typhimurium 造成黃色水樣下痢、壞死性結腸炎與盲腸炎、結腸<strong>鈕扣狀潰瘍</strong>。</p>'
  '<p><strong><em>C. perfringens</em> type C</strong>：不在這兩講的範圍。（補充，供參考）1 週齡內仔豬出血性下痢，小腸（空腸）出血壞死、黏膜下氣腫，β 毒素造成。</p>'),
]

def section_nat():
    out = ['      <p class="section-desc">講義每個疾病後面附了歷屆國考題，<strong>答案是講義上老師用紅框標出的選項</strong>。每題都列出完整選項，先自己作答，再點「顯示答案」看詳解；詳解會逐一說明每個選項為什麼對或錯，並附講義頁碼。標「補充」的是講義沒寫、為了解釋選項而延伸的內容。</p>']
    for key, title in [('app','胸膜肺炎放線桿菌（13 題）'),('ar','萎縮性鼻炎（10 題）'),('gp','Glässer 病（10 題）'),('ec','大腸桿菌感染（19 題）')]:
        out.append(f'      <h3>{title}<span class="lv lv-must">必考</span></h3>')
        out.extend(NAT[key])
    out.append('      <footer class="note-footer">資料來源：課程講義〈細菌性疾病 (I)〉p.35–47、77–86、103–112、151–169；答案為講義紅框標示。</footer>')
    return '\n'.join(out) + '\n'

def section_kaogu():
    out = ['      <p class="section-desc">你提供的期中考古中，屬於本講義範圍的題目。答案來源：106 學年為老師紅字、111 學年為考卷上的批改記號、合卷為考卷旁手寫答案。題號依原考卷；有附圖的題目註明對應的講義圖頁。</p>',
           '      <div class="alert alert-warn"><div class="alert-label">注意</div><p>考古題照片為手機翻拍，題目文字依可辨識內容整理。「合卷」是考古融合中鄭益謙（Part A）與葉光勝（Part B）的合卷，年份不明。</p></div>',
           '      <h3>問答題<span class="lv lv-must">必考</span></h3>']
    out.extend(ESSAY)
    for key, title in [('106','106 學年期中考（葉光勝老師部分）'),('111','111 學年期中考（2022，葉光勝老師部分）'),('joint','合卷（Part B 葉光勝老師部分）')]:
        out.append(f'      <h3>{title}<span class="lv lv-must">必考</span></h3>')
        out.extend(K[key])
    out.append('      <footer class="note-footer">資料來源：使用者提供的豬病學期中考古（106、111 學年、考古融合）。</footer>')
    return '\n'.join(out) + '\n'

if __name__ == '__main__':
    import re, sys
    p = sys.argv[1]
    s = open(p, encoding='utf-8').read()
    def repl(sec, body):
        global s
        i = s.index(f'@@ {sec} |'); j = s.index('\n', i) + 1; k = s.index('\n@@ ', j) + 1
        s = s[:j] + body + '\n' + s[k:]
    repl('natexam', section_nat())
    repl('kaogu', section_kaogu())
    s = s.replace('@@ kaogu | 比較與考試 | 📜 | 期中考古對應 | 期中考古對應 Past Midterm Questions |',
                  '@@ kaogu | 比較與考試 | 📜 | 期中考古題 | 期中考古題 Past Midterm Questions |')
    open(p, 'w', encoding='utf-8').write(s)
    n = sum(len(v) for v in NAT.values()); m = sum(len(v) for v in K.values())
    print('national', n, 'midterm mcq', m, 'essay', len(ESSAY))
