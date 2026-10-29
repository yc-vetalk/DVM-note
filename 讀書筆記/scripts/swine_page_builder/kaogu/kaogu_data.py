# -*- coding: utf-8 -*-
# 豬病學期中考古頁：新寫的題目卡片資料（各週頁已有詳解的題目在 build 時直接重用）
# 格式：(label, 題幹, [選項], 答案, 詳解HTML, 圖檔或None, 圖說)

W1 = 'week01_課程介紹與養豬產業.html'
W2 = 'week02_豬病毒性疾病I.html'
W3 = 'week03_豬病毒性疾病II.html'
W4 = 'week04_小RNA病毒科疾病.html'
W5C = 'week05_豬冠狀病毒病.html'
W5F = 'week05_豬流行性感冒.html'
W6 = 'week06_細菌性疾病I.html'
W7 = 'week07_細菌性疾病II.html'
HV = 'pdf/豬疱疹病毒病.pdf'

def L(page, sec, text):
    return f'<a href="{page}#section-{sec}">{text}</a>'

OUT = '<span class="lv lv-skim">範圍外（期末）</span> '

# ---------- 鄭益謙 2019（108 學年）複選：新卡片 ----------
Z2019 = {
 5: ('PRV 的感染症狀何者為非？',
     ['若孕期即遭感染，出生仔豬會有神經症狀', '仔豬發燒體溫 &gt; 40°C', 'respiratory distress 使仔豬出現「sitting dog」姿勢',
      '肥育豬／grower 以呼吸道症狀為主，死亡率低', '以上皆非'],
     'C',
     '〔答案來源：考卷上 (c) 被螢光筆畫起來，沒有圈選記號〕<br>(C) 錯（所以選它）：犬坐姿勢（dog-sitting position）是 PRV 的<strong>神經症狀</strong>，講義和顫抖、運動失調、划水並列，不是呼吸窘迫造成的（<a class="pdf-link" href="pdf/豬疱疹病毒病.pdf#page=33">疱疹講義 p.33</a>）。<br>(A) 對：病毒可經胎盤感染，存活的仔豬出生後出現神經症狀。<br>(B) 對：仔豬高燒（p.33）。<br>(D) 對：較大的豬以呼吸道症狀為主，死亡率低（p.33）。'),
 8: ('關於 FMDV 之敘述何者正確？',
     ['台灣本島仍為疫區，持續使用疫苗免疫以控制疾病', '口蹄疫疫苗多為活毒', '1997 年台灣爆發的疫情屬於 O 型',
      '族群總預防注射率超過 80% 時視為具群體保護效力', '豬水疱病／Swine vesicular disease [SVD] 病毒分類與其歸屬同一 Family'],
     'C、D、E',
     '〔答案來源：考卷藍筆圈選〕<br>(A) 錯：台灣 2018 年 7 月停止施打口蹄疫疫苗，2020 年 6 月台澎馬獲 WOAH 認定為不施打疫苗非疫區（' + L(W4,'fmd-a','第 4 週') + '）。<br>(B) 錯：口蹄疫疫苗是不活化疫苗（補充）。<br>(C) 對：1997 年 O/Taiwan/97，親豬型（第 4 週）。<br>(D) 對：考卷圈選；群體免疫覆蓋率的概念（補充）。<br>(E) 對：SVDV（腸病毒屬）與 FMDV（Aphthovirus）都是小 RNA 病毒科（Picornaviridae）。'),
 9: ('口蹄疫的臨床症狀：',
     ['成豬口、鼻、蹄部出現水疱', '哺乳母豬乳房皮膚出現水疱', 'naïve 哺乳仔豬發高燒，24–48 小時內死亡',
      '哺乳仔豬死亡率超過 50%', '成豬少見死亡'],
     'A、B、D、E',
     '〔答案來源：考卷藍筆圈選〕<br>(A)(B) 對：口鼻蹄冠、乳房水疱。<br>(D) 對：仔豬因心肌炎（虎斑心）猝死，死亡率高。<br>(E) 對：發病率高、成豬死亡率低（' + L(W4,'fmd-path','第 4 週') + '）。<br>(C) 考卷沒有圈：仔豬多半是心肌炎<strong>猝死</strong>，不一定先有高燒；考卷為什麼不算，講義沒有直接說明 <strong style="color:var(--amber-700)">⚠ 待確認</strong>。'),
 10: ('關於豬水疱病／Swine vesicular disease [SVD] 敘述何者正確？',
      ['台灣是疫區', '病毒在環境中不易被一般消毒劑清除，故使其被名為「pen disease」', '會造成豬以外偶蹄類動物發病',
       '臨床症狀不易與口蹄疫區分', '有如口蹄疫，可使用疫苗免疫控制疫情'],
      'A、B、D',
      '〔答案來源：考卷藍筆圈選〕<br>(A) 對：台灣尚未清除 SVD（同卷 Q19）。<br>(B) 對：SVDV 抵抗力強，經圈欄間傳播（' + L(W4,'svd','第 4 週') + '）。<br>(C) 錯：SVD 只造成豬發病。<br>(D) 對：水疱外觀和 FMD 無法區分，要實驗室鑑別。<br>(E) 錯：SVD、SVV 都沒有商業疫苗（第 4 週）。'),
 11: ('關於豬流行性感冒／swine influenza [SI] 敘述何者正確？',
      ['對豬造成呼吸道與生殖道的症狀', '可造成豬呼吸道 bronchointerstitial pneumonia', 'H1, H3 subtypes 為主',
       'N1, N2 subtypes 為主', 'SI 病毒造成的 viremia 時間長、力價高，故容易從血中偵測 SI 病毒'],
      'B、C、D',
      '〔答案來源：考卷藍筆圈選〕<br>(B) 對：支氣管間質性肺炎。<br>(C)(D) 對：豬的三大型別 H1N1、H1N2、H3N2（' + L(W5F,'agent','第 5 週豬流感') + '）。<br>(A) 錯：豬流感是呼吸道疾病。<br>(E) 錯：病毒血症少見且短，要採鼻拭子或肺組織，不從血液偵測（補充）。'),
 12: ('關於 PEDV 下列何者敘述正確？',
      ['2013–2014 台灣因 PEDV 疫情損失數十萬頭仔豬', '2010 年後流行於全球各地的 PEDV 病原性與 2000 年前所見者同',
       '現為 OIE notifiable disease', '為 zoonosis', '臨床症狀與 TGE 無法區分'],
      'A、E',
      '〔答案來源：考卷藍筆圈選〕<br>(A) 對：台灣 2014 年 PED 大流行（' + L(W5C,'ped','第 5 週') + '）。<br>(B) 錯：2010 年後的新型株致病力比過去高。<br>(C) 錯：考卷沒圈；PED 不是 WOAH 法定通報疾病（補充）。<br>(D) 錯：不是人畜共通。<br>(E) 對：臨床上和 TGE 無法區分，要靠實驗室診斷。'),
 13: ('日本腦炎／Japanese Encephalitis [JE]：',
      ['為我國乙類動物傳染病', '藉蚊媒傳播', '感染母豬常造成腦炎死亡', '為人畜共通傳染病／zoonoses', '遭感染豬再藉互相接觸傳給健康豬'],
      'A、B、D',
      '〔答案來源：考卷藍筆圈選〕<br>(B)(D) 對：蚊媒、人畜共通（' + L(W2,'jev','第 2 週') + '）。<br>(A) 對：考卷圈選。<br>(C) 錯：母豬感染多表現為流產、死產、木乃伊胎，不是腦炎死亡。<br>(E) 錯：豬是增幅宿主，靠蚊子傳播，不靠豬隻互相接觸。'),
 14: ('下列何者敘述正確？',
      ['豬被視為口蹄疫病毒的「mixing vessel」', '豬不是口蹄疫病毒的「persistent carrier」',
       '日本腦炎病毒由媒蚊傳予人的過程中，豬被視為「amplifier」', '豬被視為流行性感冒病毒的「opportunistic reservoir」',
       '豬為豬瘟病毒唯一「natural reservoir」'],
      'B、C、E',
      '〔答案來源：考卷藍筆圈選〕<br>(A) 錯：mixing vessel 是豬對<strong>流感</strong>的角色。<br>(B) 對：豬是 FMD 的增幅者（amplifier，呼出大量病毒）；持續帶原者是反芻獸（牛）。<br>(C) 對：JE 的增幅宿主（第 2 週）。<br>(D) 錯：流感是 mixing vessel。<br>(E) 對：與同卷 Q1 (A)「CSFV natural reservoirs 僅有家豬與野豬」一致。'),
 16: ('關於 Nipah virus 之敘述何者為誤？',
      ['Zoonotic virus', '野生蝙蝠為其自然宿主，跨物種感染豬致病', '1998 年在東南亞造成受感染豬再傳給人的疫情', '感染豬與人出現神經系統症狀', '以上皆非'],
      '⚠ 考卷無作答記號',
      OUT + '考卷上這題題號被打了叉，選項沒有圈，學長姐的答案不明 <strong style="color:var(--amber-700)">⚠ 待確認</strong>。<br>（補充）四個敘述看起來都對：Nipah 是人畜共通病毒，果蝠是自然宿主，1998–1999 年馬來西亞豬傳人疫情，豬有呼吸道與神經症狀、人以腦炎為主。照這樣判斷會選 (E)。今年第 2、3 週講義沒有 Nipah（見' + '<a href="期中總複習.html#section-gap">期中總複習・範圍外</a>）。'),
 17: ('關於非洲豬瘟病毒的預防控制何者正確？',
      ['容易誘發感染宿主的中和抗體', '已有效果良好的疫苗', '非疫區應以銷毀方式處理源自疫區的廚餘', '嚴格管制來自疫區的具感受性動物移動', '疑似病例應立即診斷'],
      'C、D、E',
      '〔答案來源：考卷藍筆圈選〕<br>(A) 錯：ASFV 不易誘發完全中和抗體（' + L(W2,'asf-b','第 2 週') + '）。<br>(B) 錯（2019 年時）：當時沒有核准疫苗；越南 2022 年 6 月才核准全球第一支商業 ASF 疫苗（' + L(W2,'asf-d','第 2 週') + '）。<br>(C)(D)(E) 對：廚餘、動物移動管制、早期診斷。'),
 19: ('台灣［台、澎、金、馬］目前有哪些水疱性疾病在豬群內尚未清除？',
      ['豬水疱疹［VES］', '口蹄疫［FMD］', '豬水疱病［SVD］', '矽尼卡谷病毒［SVV］感染症', '水疱性口炎［VS］'],
      'B、C、D',
      '〔答案來源：考卷藍筆圈選，2019 年〕<br>(C)(D) 對：SVD、SVV 台灣仍有（' + L(W4,'svv','第 4 週') + '）。<br>(B) 2019 年出題時算對：台澎馬 2020 年 6 月才獲認定為不施打疫苗非疫區；題目寫「台、澎、金、馬」，金門的認定時間我沒有查到講義資料 <strong style="color:var(--amber-700)">⚠ 待確認</strong>。今年再考要注意時間點。<br>(A)(E) 錯：VES、VS 台灣沒有（補充）。'),
 20: ('有關 Porcine Stress Syndrome [PSS] 之敘述何者正確？',
      ['具遺傳特性，且與豬屠體瘦肉率有關', '與肌肉細胞膜上調控鈣離子進出的 ryanodine receptor 異常有關', '與豬屠體肌肉呈水樣性／exudative 有關',
       '致病之 ryr-1 基因為 dominant', '以上皆非'],
      'A、C',
      OUT + '〔答案來源：考卷藍筆圈 (a)(c)，(b)(d) 紅筆打叉〕<br>(A)(C) 對：遺傳性、與瘦肉率有關；屠體呈 PSE（蒼白、柔軟、滲出）肉（補充）。<br>(D) 錯：ryr-1（halothane 基因）是<strong>隱性</strong>遺傳（補充）。<br>(B) 被打叉：RyR1 是<strong>肌漿網</strong>上的鈣離子釋放通道，題目寫「肌肉細胞膜」可能就是錯的地方（推測） <strong style="color:var(--amber-700)">⚠ 待確認</strong>。PSS 屬營養與其他疾病，不在本次範圍。'),
}

# ---------- 葉光勝 106 學年：新卡片 ----------
Y106 = {
 1: ('請問以下所示為哪一種豬？此豬體軀呈長方形，頸部至背部有剛毛，顏面平廣且皺裂顯著。',
     ['Yokshire', 'Taoyuan pig', 'Landrace', 'Duroc'], 'B',
     '〔答案來源：學長姐檢討「是桃園豬」〕桃園豬是黑色本地土種，顏面皺褶多（' + L(W1,'breed','第 1 週台灣的豬種') + '）。藍瑞斯是白色大垂耳、杜洛克是紅棕色、約克夏是白色立耳。',
     'q106_01', '原卷附圖（翻拍投影，較模糊）'),
 3: ('民國 41 年，李崇道博士由菲律賓引進哪一種疾病病原的弱毒株，加以改良，後來在台灣發展出安全及免疫效果良好的疫苗株，並由李博士命名為 LPC-China strain？',
     ['pseudorabies', 'hog cholera', 'foot and mouth disease', 'swine influenza'], 'B',
     '〔答案來源：學長姐檢討〕LPC＝Lapinized Philippines Coronel，兔化豬瘟弱毒疫苗株（' + L(W1,'history','第 1 週防治史') + '）。111 學年 Q4 把題目改成問「哪位學者」。'),
 5: ('假設您觀察到 3 日齡的豬隻有腹瀉，糞便帶血的情形。組織病理鏡檢下有小腸黏膜壞死及肌纖維層及黏膜下層的氣腫（emphysema），且在小腸黏膜吸附有染成革蘭氏陽性的桿菌，您覺得這豬隻最有可能感染以下何種病原？',
     ['<em>Salmonella</em> Typhimurium', '<em>Clostridium perfringens</em>', '<em>Clostridium septicum</em>', '<em>Clostridium novyi</em>'], 'B',
     OUT + '〔答案來源：學長姐檢討〕新生仔豬出血性壞死性腸炎＋氣腫＋革蘭氏陽性大桿菌 → <em>C. perfringens</em>（type C，補充）。<em>C. septicum</em> 是惡性水腫，<em>C. novyi</em> 是猝死、屍體膨脹。111 學年 Q6 同題改成區分 type A／type C。'),
 10: ('有關下列的敘述，何者錯誤？',
      ['仔豬出生後約 24–36 小時，其腸道即失去吸收初乳的功能', '豬隻的懷孕期（pregnant period）約 114–115 天',
       '新生仔豬腸上皮細胞有 FcRn，可與初乳內的免疫球蛋白結合', '豬隻初乳內免疫球蛋白主要是以 IgA 為主'], 'D',
     '〔答案來源：學長姐檢討〕初乳以 <strong>IgG</strong> 為主；IgA 是常乳的主要抗體（補充）。(A)(B)(C) 對：腸道閉鎖約 24–36 小時、懷孕期 114–115 天（' + L(W1,'life','第 1 週') + '）。'),
 15: ('假設您在保育及肥育豬舍，看到豬隻有消瘦、下痢情形，下痢便較黏稠，色澤不一，看起來有鮮紅、暗紅或灰暗色澤，而且含多量黏液及纖維素及壞死黏膜碎片，請問下列診斷何者最接近？',
      ['swine erysipelas', 'swine brucellosis', 'greasy pig disease', 'swine dysentery'], 'D',
      OUT + '〔答案來源：學長姐檢討〕保育、肥育豬的黏液出血性下痢＝豬赤痢（<em>Brachyspira hyodysenteriae</em>），病變在大腸（同卷 Q23）。'),
 16: ('下列何種 <em>Mycoplasma</em> 可引起豬的關節炎？',
      ['<em>M. hyopneumoniae</em> and <em>M. hyosynoviae</em>', '<em>M. hyosynoviae</em> and <em>M. hyorhinis</em>',
       '<em>M. hyosynoviae</em> and <em>M. flocculare</em>', '<em>M. hyopneumoniae</em> and <em>M. hyorhinis</em>'], 'B',
      OUT + '〔答案來源：學長姐檢討〕<em>M. hyosynoviae</em>（關節炎）、<em>M. hyorhinis</em>（多發性漿膜炎與關節炎）；<em>M. hyopneumoniae</em> 是地方性肺炎，<em>M. flocculare</em> 不致病（補充）。'),
 17: ('<em>Lawsonia intracellularis</em> 會利用宿主細胞粒線體 ATP 為能量來源，是一種絕對的細胞內細菌（obligately intracellular bacterium），請問以下的選項，何者與此病原最無相關？',
      ['regional ileitis', 'arthritis', 'hose pipe gut', 'proliferative intestinal adenomatosis'], 'B',
      OUT + '〔答案來源：學長姐檢討〕增生性腸病的各種名稱：區域性迴腸炎、水管腸、增生性腸腺瘤病；和關節炎無關。'),
 18: ('造成人類 Weil disease 的病原體，在人類嚴重的病例會有黃疸、腎衰竭等現象，在不同動物種別，有其特定的血清型感染，一般文獻報導，豬隻感染此病原體後，可能發生下列哪一種症狀？',
      ['呼吸道症狀', '表皮發炎', '流、死產現象', '腸炎'], 'C',
      OUT + '〔答案來源：學長姐檢討〕鉤端螺旋體症在豬主要是繁殖障礙（流產、死產、弱仔）。111 學年 Q25 直接問 Weil syndrome 的病原。'),
 19: ('下列何種病原可感染 1–7 日齡的仔豬，造成腸繫膜水腫、糊狀至水樣狀的黃色便，而這個細菌也會造成人類腸胃道的感染，涵蓋範圍可能從無症狀的移生（colonization）或輕微無併發症的腹瀉，到嚴重的腹瀉、偽膜性大腸炎等症狀？',
      ['<em>Clostridium botulinum</em>', '<em>Clostridium difficile</em>', '<em>Clostridium septicum</em>', '<em>Clostridium tetani</em>'], 'B',
      OUT + '〔答案來源：學長姐檢討〕關鍵字：腸繫膜水腫、人類偽膜性大腸炎 → <em>C. difficile</em>。111 學年 Q22 幾乎同題。'),
 20: ('有關豬隻水腫病（edema disease）的敘述，何者錯誤？（原卷照片缺這一題，選項依學長姐檢討整理，選項順序不一定與原卷相同）',
      ['致病原可分泌毒素傷害血管內皮細胞', '常發生於出生 0–3 天的新生仔豬', '常見胃及腸繫膜下層水腫', '致病原若在血液培養基上生長，通常可見溶血'], 'B',
      '〔答案來源：學長姐檢討〕水腫病發生在<strong>離乳後</strong>，不是剛出生（' + L(W6,'ec-pwd','第 6 週') + '）。Stx2e 傷害血管內皮；胃壁與結腸繫膜水腫；溶血性大腸桿菌。合卷 Q19、111 學年 Q13 都考同一組敘述。'),
 21: ('下列圖示為豬黏膜細胞的變化，這是因為細胞內受到一種微生物感染，而刺激腺窩細胞不正常增生及不斷進行有絲分裂所致，使腸黏膜呈現腺瘤樣結構，請問最有可能是受哪一種微生物感染？',
      ['<em>Salmonella</em> Choleraesuis', '<em>Brachyspira hyodysenteriae</em>', '<em>Lawsonia intracellularis</em>', '<em>Brucella suis</em>'], 'C',
      OUT + '〔答案來源：學長姐檢討〕腺窩細胞增生、腸黏膜增厚成腺瘤樣 → 增生性腸病（<em>L. intracellularis</em>）。', 'q106_21', '原卷附圖：增厚的腸黏膜（翻拍投影）'),
 23: ('由 <em>Brachyspira hyodysenteriae</em> 所造成的豬赤痢（swine dysentery），其病變主要位於何處？',
      ['胃', '十二指腸', '空腸', '大腸'], 'D', OUT + '〔答案來源：學長姐檢討〕豬赤痢是大腸（盲腸、結腸）的黏液出血性腸炎。'),
 26: ('若您在豬場看到保育豬有顫抖、運動失調、划水、抽搐、跛足等現象，剖解發現有化膿性腦膜炎以及化膿性關節炎等病灶，以下哪一個選項是較合理且符合上述症狀的致病原？',
      ['<em>Staphylococcus hyicus</em>', '<em>Brucella suis</em>', '<em>Streptococcus suis</em> serotype II', '<em>Brachyspira hyodysenteriae</em>'], 'C',
      OUT + '〔答案來源：學長姐檢討〕保育豬化膿性腦膜炎＋關節炎＝豬鏈球菌第 2 型。合卷 Q14 同一考點。'),
 27: ('誰說了「I like pigs. Dogs look up to us. Cats look down on us. But pigs treat us as equals.」？',
      ['John Major', 'David Cameron', 'Tony Blair', 'Winston Churchill'], 'D', '〔答案來源：學長姐檢討〕送分題（老師課堂提過的名言）。'),
 29: ('台灣目前（106 年 5 月行政院農委會公布資料）毛豬的在養頭數約多少？', ['150 萬', '540 萬', '850 萬', '1000 萬'], 'B',
      '〔答案來源：學長姐檢討〕111 學年 Q18 同題，當年答案是 537 萬（' + L(W1,'industry','第 1 週') + '）。數字會隨年份更新，今年看講義上的最新數字。'),
}

# ---------- 葉光勝 合卷 Part B：新卡片 ----------
HJ = {
 4: ('幼豬若感染 <em>Clostridium perfringens</em>，臨床上可看到出血性下痢（hemorrhagic diarrhea），剖檢可見嚴重小腸黏膜壞死及氣腫，請問最常見的是 <em>C. perfringens</em> 哪一型？',
     ['Type A', 'type B', 'type C', 'type D'], 'C', OUT + '〔答案來源：考卷旁手寫〕新生仔豬出血性壞死性腸炎＝type C（β 毒素，補充）。'),
 6: ('假定我們看到豬隻剖檢，發現肝臟深紅色局部或瀰漫性凹陷，診斷為食因性肝病（hepatosis dietetica），很有可能為飼料的營養成分有以下何種原因？',
     ['vitamin A deficiency', 'vitamin E/Se deficiency', 'biotin deficiency', 'vitamin D deficiency'], 'B',
     OUT + '〔答案來源：考卷旁手寫；融合檔「光勝考古選擇」也是這個答案〕食因性肝病＝維生素 E／硒缺乏（補充）。'),
 7: ('下列何者為豬赤痢（swine dysentery）的病原？', ['螺旋體', '革蘭氏陽性球菌', '革蘭氏陰性桿菌', '立克次體'], 'A',
     OUT + '〔答案來源：考卷旁手寫〕<em>Brachyspira hyodysenteriae</em> 是螺旋體（106 學年 Q23 考病變位置）。'),
 8: ('有一種革蘭氏陰性，形狀類似弧菌的病原，可在腸黏膜的細胞質內增生，造成豬隻增殖性腸病變（proliferative enteropathies），請問是以下哪一種病原？',
     ['<em>Pasteurella multocida</em>', '<em>Actinobacillus pleuropneumoniae</em>', '<em>Lawsonia intracellularis</em>', '<em>Bordetella bronchiseptica</em>'], 'C',
     OUT + '〔答案來源：考卷旁手寫〕106 學年 Q17、Q21 同一病原。'),
 9: ('豬隻長期餵飼含有過多植酸（phytic acid）與鈣離子濃度過高的飼料，可能會造成皮膚角化不全（parakeratosis）症狀，這可能是因為豬隻最後體內缺發何種元素所致？',
     ['Zn', 'Mg', 'Ca', 'Cu'], 'A', OUT + '〔答案來源：考卷旁手寫〕植酸與高鈣妨礙鋅吸收 → 鋅缺乏 → 角化不全（補充）。'),
 13: ('下列何種病原會造成母豬流產或死產？', ['<em>Pasteurella</em>', '<em>Salmonella</em>', '<em>Mycoplasma</em>', '<em>Leptospira</em>'], 'D',
      OUT + '〔答案來源：考卷旁手寫〕鉤端螺旋體症在豬主要表現為繁殖障礙（106 學年 Q18）。'),
 14: ('有一種病原可存在豬隻上呼吸道、生殖道或者消化道中，臨床上感染的豬隻可見到腦膜炎的症狀，例如站立不穩、角弓反張、抽搐或眼球震顫等現象。或者感染關節，造成關節炎。請問可能是下列何種病原？',
      ['<em>Staphylococcus aureus</em>', '<em>Streptococcus suis</em>', '<em>Salmonella</em> Choleraesuis', '<em>Mycoplasma hyopneumoniae</em>'], 'B',
      OUT + '〔答案來源：考卷旁手寫〕腦膜炎＋關節炎＝豬鏈球菌（106 學年 Q26）。'),
 16: ('假設我們在任食的豬隻（例如 garbage-fed pigs）看到豬隻有類似「goose stepping」姿勢，我們可合理懷疑可能是下列何種成分缺乏所致？',
      ['pantothenic acid', 'biotin', 'vitamin K', 'folic acid'], 'A', OUT + '〔答案來源：考卷旁手寫；融合檔「光勝考古選擇」同〕鵝步＝泛酸缺乏（補充）。'),
 18: ('若觀察到豬隻突然死亡，外觀沒有明顯症狀，但身體呈現膨脹腫大情形，我們可合理懷疑是某一種疾病。關於這個疾病，下列敘述何者正確？',
      ['剖檢後主要症狀為出血性腸炎', '致病原為革蘭氏陽性球菌', '致病原可分泌毒素，此毒素作用為當做一種超抗原（superantigen），誘導 T cell 產生大量 cytokine 所導致',
       '剖檢後常看到肝臟有變性及氣腫情形'], 'D',
      OUT + '〔答案來源：考卷旁手寫「<em>C. novyi</em>」〕猝死、屍體迅速膨脹、肝臟氣腫（泡沫肝）＝<em>Clostridium novyi</em>（補充）。(B) 錯：梭菌是革蘭氏陽性<strong>桿菌</strong>。'),
}

# ---------- 葉光勝 111 學年：新卡片 ----------
Y111 = {
 4: ('民國 41 年，由以下哪位學者自菲律賓引進一豬瘟（hog cholera）病毒的弱毒株，加以改良，後來在台灣發展出安全及免疫效果良好的疫苗株，並命名為 LPC-China strain？',
     ['翁仲男', '鍾博', '李崇道', '林再春'], 'C', '〔答案：推得〕李崇道博士（' + L(W1,'history','第 1 週防治史') + '）。106 學年 Q3 同一事件，改問病名。'),
 6: ('假設您觀察到 3 日齡的豬隻有腹瀉，糞便帶血（bloody diarrhea）的情形。組織病理鏡檢下有小腸黏膜壞死及肌纖維層及黏膜下層的氣腫（emphysema），且在小腸黏膜吸附有染成革蘭氏陽性的桿菌，您覺得這豬隻最有可能感染以下何種病原？',
     ['<em>Clostridium novyi</em>', '<em>Clostridium perfringens</em> type A', '<em>Clostridium septicum</em>', '<em>Clostridium perfringens</em> type C'], 'D',
     OUT + '〔答案：推得〕新生仔豬（1 週內）出血性壞死性腸炎＝type C；type A 多為較溫和的下痢（補充）。106 學年 Q5、合卷 Q4。'),
 12: ('下列哪一個豬種，其成熟體重約 70 公斤，適合做為生物醫學研究（biomedicine research）的動物模式？',
      ['Landrace', 'Hampshire', 'Lee-Sung strain pig', 'Duroc'], 'C', '〔答案：推得〕李宋豬是台灣培育的迷你豬，作實驗動物模式（' + L(W1,'breed','第 1 週') + '）。'),
 18: ('臺灣目前（111 年 5 月行政院農委會公布資料）毛豬的在養頭數約接近多少？', ['150 萬', '537 萬', '850 萬', '1000 萬'], 'B',
      '〔答案：推得〕第 1 週講義的在養頭數表為 537.5 萬頭（' + L(W1,'industry','第 1 週') + '）。106 學年同題答 540 萬。'),
 20: ('你從一隻進行過閹割（castration），卻疑似因為傷口感染而死亡的豬隻，進行病原分離。實驗室以厭氧培養環境分離出一種細菌，鏡檢照片如下，Gram stain 呈藍色，細菌可見 terminal endospores。此細菌最有可能是以下何者？',
      ['<em>Clostridium perfringens</em>', '<em>Clostridium chauvoei</em>', '<em>Clostridium septicum</em>', '<em>Clostridium tetani</em>'], 'D',
      OUT + '〔答案：推得〕傷口感染、厭氧、革蘭氏陽性、<strong>末端芽孢</strong>（鼓槌狀）→ 破傷風梭菌（補充）。', 'q111_20', '原卷附圖：革蘭氏染色'),
 21: ('下列有關豬鉤端螺旋體症（leptospirosis）之敘述，何者正確？',
      ['產生的症狀為多發性漿膜炎（polyserositis）', '顯微凝集試驗（microagglutination test, MAT）是常用的診斷方法',
       '在急性期（acute phase）容易有流產、死產（abortion, stillbirth）的胎兒', '常在狗身上發現的 <em>Leptospira canicola</em> 或者在棕鼠身上發現的 <em>L. icterohaemorrhagiae</em> 並不會感染豬隻，豬隻只感染 <em>L. pomona</em>'], 'B',
      OUT + '〔答案：推得；考卷上 (A)(D) 被打叉〕MAT 是標準血清學診斷（補充）。流產多發生在感染後數週的慢性階段；豬也可被其他血清型感染。'),
 22: ('下列哪一種梭菌會引起人類腸炎（human enteritis），在豬隻可感染 1–7 日齡的仔豬，造成腸繫膜水腫（mesocolonic edema）、糊狀至水樣狀的黃色便（pasty to watery yellowish feces）？',
      ['<em>Clostridium difficile</em>', '<em>Clostridium septicum</em>', '<em>Clostridium tetani</em>', '<em>Clostridium perfringens</em>'], 'A',
      OUT + '〔答案：推得〕與 106 學年 Q19 同題。'),
 25: ('Weil syndrome 是一種下列何種病原所造成感染，病人嚴重時會有黃疸（jaundice）現象。', ['<em>Salmonella</em>', '<em>Leptospira</em>', '<em>Brucella</em>', '<em>Clostridium</em>'], 'B',
      OUT + '〔答案：推得〕鉤端螺旋體（106 學年 Q18）。'),
}

# ---------- 共用問答題 ----------
ESSAY_TGE = ('可造成兩週齡內仔豬嚴重下痢、高死亡率的豬傳染性胃腸炎（Transmissible gastroenteritis），現今的危害程度遠低於以往，試述此一現象的可能原因與機制。',
 '<p><strong>答題骨架</strong>（' + L(W5C,'tge-a','第 5 週 TGE') + '）</p><ol>'
 '<li><strong>PRCV 出現</strong>：豬呼吸道冠狀病毒是 TGEV 的自然變異株，S 蛋白 N 端刪除約 227 個胺基酸，嗜性由腸道轉為呼吸道，不造成絨毛萎縮、死亡率低。</li>'
 '<li><strong>PRCV 傳播快、普遍感染</strong>：經呼吸道（空氣）傳播，比糞口傳播的 TGEV 更容易擴散，豬群幾乎都感染過。</li>'
 '<li><strong>交叉保護</strong>：兩者只有一個血清型，S 蛋白主要中和抗原位點保守，感染 PRCV 產生的抗體能中和 TGEV。</li>'
 '<li><strong>共同黏膜免疫（common mucosal immunity）</strong>：PRCV 在支氣管相關淋巴組織（BALT）誘發 IgA、IgG 分泌細胞，這些細胞移到腸道相關淋巴組織（GALT），提供腸道保護；母豬經初乳與乳汁把抗體傳給仔豬（學長姐答案整理，機制細節為補充）。</li>'
 '<li><strong>結論</strong>：豬群對 TGE 有廣泛免疫，TGE 的發生與危害大幅下降。</li></ol>')

ESSAY_INDUSTRY = ('請陳述您覺得目前台灣養豬產業面臨的問題及可能的因應之道（問題及因應之道都要寫）。',
 '<p><strong>學長姐答案（106 學年）</strong>：密集飼養造成疫病防治困難；以業者為主、政府輔助為共識，養豬場應發揮主動改善；疫情通報要迅速確實、不得隱瞞。</p>'
 '<p><strong>可以再補的點</strong>（補充，依第 1 週講義與一般產業現況整理）：</p><ul>'
 '<li>疫病：非洲豬瘟境外威脅（廚餘、走私肉品、野豬）；PRRS、PCV2、PED 等地方流行病 → 生物安全、疫苗計畫、邊境管制、疫情通報（' + L(W1,'history','第 1 週防治史') + '）。</li>'
 '<li>抗生素使用與抗藥性 → 減抗、用藥紀錄、獸醫處方（' + '<a href="week01_細菌抗藥性.html">第 1 週細菌抗藥性</a>' + '）。</li>'
 '<li>環保：廢水與臭味 → 沼氣發電、廢水資源化。</li>'
 '<li>成本與市場：飼料原料仰賴進口、進口豬肉競爭 → 提升效率、品牌與產銷履歷。</li>'
 '<li>人力：缺工與高齡化 → 自動化、規模化。</li></ul>'
 '<p>老師要的是「問題＋因應」成對寫，每個問題後面直接接對策。</p>')

ESSAY_MPS = ('請說明豬黴漿菌肺炎（Mycoplasmal pneumonia of swine, MPS）的特性。（老師說可以提及飼料換肉率）',
 OUT + '<p><strong>學長姐答案要點</strong>：</p><ul><li>病原 <em>Mycoplasma hyopneumoniae</em>，慢性呼吸道疾病（地方性肺炎）。</li><li>空氣傳播；所有年齡都可感染。</li><li>發病率高、死亡率低（學長姐寫 30–90% 感染）。</li><li>破壞纖毛上皮，容易二次感染（例如與 PRRSV、PCV2、<em>P. multocida</em> 混合感染）。</li><li>降低飼料換肉率與生長速度，經濟損失主要在這裡。</li><li>台灣高溫濕熱、飼養密集，容易感染。</li></ul>')

ESSAY_ULCER = ('請說明造成豬隻胃潰瘍（胃食道區潰瘍，ulceration of <em>pars oesophagea</em>）的風險因子。請依 (1) nutrition (2) housing/management (3) others 分項，每一項至少寫出 2 點並說明。（5 分）',
 OUT + '<p><strong>學長姐答案</strong>：</p><ol><li><strong>營養</strong>：穀物種類（玉米、小麥比燕麥、大麥容易造成潰瘍）；飼料粒徑太細（鎚磨比滾壓容易磨得太細）。</li>'
 '<li><strong>居住與管理</strong>：集約飼養太擁擠造成緊迫；混群、運輸造成緊迫（停飼也是常見因子，補充）。</li>'
 '<li><strong>其他</strong>：遺傳傾向；感染引起 histamine 上升刺激胃酸分泌。</li></ol>')

ESSAY_BEHAVIOR = ('請寫出一種豬隻的行為，並說明這個行為可能導致的結果。（5 分）',
 OUT + '<p><strong>學長姐答案：咬尾（tail biting）</strong></p><ul><li>原因：缺鐵、太擁擠、通風不良、不安定、停水停飼、飼料品質差、停電、品種；主因是缺乏口腔刺激、無聊。</li>'
 '<li>尾巴末段不敏感，被咬斷也不自覺，所以常見。</li><li>傷口流血 → 豬亂動、甩尾 → 吸引更多豬來咬。</li><li>結果：化膿、膿瘍、膿血症、上行感染造成癱瘓、死亡。</li></ul>')

ESSAY_CSF_BONUS = ('自由選答「加分題」（20 分）：請申論下表日本 2018 年爆發 CSF，於地方、中央用 FAT、RT-PCR 診斷，得一致的歧異結果之可能原因。'
 '<div class="table-wrap" style="margin-top:8px"><table><thead><tr><th>實驗室</th><th>檢驗</th><th>日期</th><th>結果</th></tr></thead><tbody>'
 '<tr><td>岐阜縣家畜保健衛生所（地方）</td><td>直接螢光抗體（FAT）</td><td>2018/09/08</td><td>陰性</td></tr>'
 '<tr><td>岐阜縣家畜保健衛生所（地方）</td><td>RT-PCR</td><td>2018/09/08</td><td>陽性</td></tr>'
 '<tr><td>國立動物衛生研究所（OIE 參考實驗室）</td><td>FAT</td><td>2018/09/08</td><td>陰性</td></tr>'
 '<tr><td>國立動物衛生研究所（OIE 參考實驗室）</td><td>RT-PCR</td><td>2018/09/08</td><td>陽性</td></tr>'
 '<tr><td>國立動物衛生研究所（OIE 參考實驗室）</td><td>病毒定序</td><td>2018/09/09</td><td>陽性</td></tr></tbody></table></div>',
 '<p><strong>答題方向</strong>（本站整理，非官方答案）：兩個實驗室結果<strong>一致</strong>，所以不是單一實驗室操作失誤，而是兩種方法本身的差異。</p><ol>'
 '<li><strong>原理不同</strong>：FAT 用螢光標記抗體偵測冷凍組織切片中的<strong>病毒抗原</strong>，需要組織內有足量抗原；RT-PCR 先把病毒 RNA 反轉錄再增幅，偵測<strong>核酸</strong>，少量病毒就能陽性。</li>'
 '<li><strong>敏感度差異</strong>：RT-PCR 敏感度遠高於 FAT（' + L(W2,'csf-b','第 2 週 CSF 診斷') + '）。</li>'
 '<li><strong>病毒量低的可能原因</strong>：採樣時在感染早期；病毒株毒力不高、組織內抗原量少（補充：2018 年日本岐阜株屬中等毒力的 genotype 2.1）；採樣部位或組織保存影響抗原。</li>'
 '<li><strong>定序陽性</strong>：確認是 CSFV，並可判斷基因型與來源，排除疫苗株或交叉反應。</li>'
 '<li><strong>結論</strong>：FAT 陰性不能排除 CSF；疑似病例要以 RT-PCR＋定序確診。</li></ol>')
