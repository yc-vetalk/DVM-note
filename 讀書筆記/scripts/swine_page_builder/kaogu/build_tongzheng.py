# -*- coding: utf-8 -*-
# 豬病學「疾病統整表」產生器：python3 build_tongzheng.py
# 內容取自第 1–7 週頁面與疱疹講義（PRV、PCMV 尚無週次頁）；講義以外標「補充」。
import os, re, subprocess
ROOT = '/Users/yuchenchiu/Library/Mobile Documents/com~apple~CloudDocs/Desktop/DVM/上群/DVM-note/大四上/豬病學'
os.chdir(ROOT)
TPL = open('期中總複習.html', encoding='utf-8').read()

W1 = 'week01_課程介紹與養豬產業.html'; W2 = 'week02_豬病毒性疾病I.html'; W3 = 'week03_豬病毒性疾病II.html'
W4 = 'week04_小RNA病毒科疾病.html'; WP = 'week04_豬痘.html'; WC = 'week05_豬冠狀病毒病.html'; WF = 'week05_豬流行性感冒.html'
W6 = 'week06_細菌性疾病I.html'; W7 = 'week07_細菌性疾病II.html'; HV = 'pdf/豬疱疹病毒病.pdf'
SUP = '<span class="lv lv-skim">補充</span>'

def L(p, s, t):
    if p.endswith('.pdf'):
        return f'<a class="pdf-link" href="{p}#page={s}">{t}</a>'
    return f'<a href="{p}#section-{s}">{t}</a>'

# 疾病代號 → (短名, 連結)
D = {
 'ASF': ('非洲豬瘟（ASF）', W2, 'asf-a'), 'CSF': ('豬瘟（CSF）', W2, 'csf-a'), 'JE': ('日本腦炎（JE）', W2, 'jev'), 'HEV': ('E 型肝炎（HEV）', W2, 'hev'),
 'PCV': ('PCVAD（PCV2）', W3, 'pcv-virus'), 'PRRS': ('PRRS（藍耳病）', W3, 'prrs-virus'), 'PPV': ('豬小病毒（PPV）', W3, 'ppv'), 'RV': ('輪狀病毒（RV）', W3, 'rv-a'),
 'FMD': ('口蹄疫（FMD）', W4, 'fmd-a'), 'SVD': ('豬水疱病（SVD）', W4, 'svd'), 'SVV': ('矽尼卡谷病毒（SVV）', W4, 'svv'), 'POX': ('豬痘', WP, 'abstract'),
 'PR': ('假性狂犬病（PR）', HV, 11), 'PCMV': ('豬巨細胞病毒（PCMV）', HV, 68),
 'TGE': ('傳染性胃腸炎（TGE）', WC, 'tge-a'), 'PED': ('豬流行性下痢（PED）', WC, 'ped'), 'PHEV': ('血球凝集腦脊髓炎（PHEV）', WC, 'phev'),
 'PDCOV': ('PDCoV', WC, 'pdcov'), 'SADS': ('SADS-CoV', WC, 'pdcov'), 'FLU': ('豬流感（SI）', WF, 'agent'),
 'APP': ('胸膜肺炎（APP）', W6, 'app-agent'), 'AR': ('萎縮性鼻炎（AR）', W6, 'ar-agent'), 'GP': ('Glässer 病', W6, 'gp-agent'),
 'EC': ('大腸桿菌症', W6, 'ec-neo'), 'ECN': ('新生仔豬下痢（ETEC）', W6, 'ec-neo'), 'ECP': ('離乳後下痢', W6, 'ec-pwd'), 'ED': ('水腫病', W6, 'ec-pwd'),
 'ECM': ('乳房炎', W6, 'ec-other'), 'ECU': ('泌尿道感染', W6, 'ec-other'),
 'SE': ('豬丹毒（SE）', W7, 'se-agent'), 'SAL': ('沙門氏菌症', W7, 'sal-agent'), 'EE': ('滲出性表皮炎（EE）', W7, 'ee'), 'BR': ('布氏桿菌症', W7, 'br'),
}
def n(k): t, p, s = D[k]; return L(p, s, t)

def table(head, rows, small=True, wide=False):
    st = ' style="font-size:.86em' + (';min-width:1180px' if wide else '') + '"' if small else ''
    h = f'<div class="table-wrap"><table{st}><thead><tr>' + ''.join(f'<th>{x}</th>' for x in head) + '</tr></thead><tbody>'
    for r in rows:
        h += '<tr>' + ''.join(f'<td>{x}</td>' for x in r) + '</tr>'
    return h + '</tbody></table></div>'

# ---------- A1 病原與流行病學 ----------
FULL = {
 'ASF': '非洲豬瘟（African swine fever, ASF）', 'CSF': '豬瘟（Classical swine fever, CSF）', 'JE': '日本腦炎（Japanese encephalitis, JE）',
 'HEV': 'E 型肝炎（Hepatitis E, HE）', 'PCV': '豬環狀病毒相關疾病（Porcine circovirus-associated disease, PCVAD）',
 'PRRS': '豬生殖與呼吸綜合症（Porcine reproductive and respiratory syndrome, PRRS）', 'PPV': '豬小病毒感染症（Porcine parvovirus, PPV）',
 'RV': '豬輪狀病毒感染症（Porcine rotavirus, RV）', 'FMD': '口蹄疫（Foot-and-mouth disease, FMD）', 'SVD': '豬水疱病（Swine vesicular disease, SVD）',
 'SVV': '矽尼卡谷病毒感染症（Seneca Valley virus, SVV）', 'POX': '豬痘（Swinepox）', 'PR': '假性狂犬病（Pseudorabies, PR；Aujeszky\'s disease）',
 'PCMV': '豬巨細胞病毒感染症（Porcine cytomegalovirus, PCMV；包涵體鼻炎 IBR）', 'TGE': '傳染性胃腸炎（Transmissible gastroenteritis, TGE）',
 'PED': '豬流行性下痢（Porcine epidemic diarrhea, PED）', 'PHEV': '血球凝集腦脊髓炎（Porcine hemagglutinating encephalomyelitis virus, PHEV；嘔吐衰弱病 VWD）',
 'PDCOV': '豬戴爾他冠狀病毒（Porcine deltacoronavirus, PDCoV）', 'SADS': '豬急性下痢症候群（Swine acute diarrhea syndrome coronavirus, SADS-CoV）',
 'FLU': '豬流行性感冒（Swine influenza, SI）',
 'APP': '豬胸膜肺炎（Porcine pleuropneumonia, APP）', 'AR': '萎縮性鼻炎（Atrophic rhinitis, AR）', 'GP': '格拉氏病（Glässer\'s disease）',
 'EC': '大腸桿菌症（E. coli infection）', 'SE': '豬丹毒（Swine erysipelas, SE）', 'SAL': '豬沙門氏菌症（Swine salmonellosis）',
 'EE': '滲出性表皮炎（Exudative epidermitis, EE；油脂豬病）', 'BR': '布氏桿菌症（Brucellosis）',
}
def fn(k): t, p, s = D[k]; return L(p, s, FULL[k])

A1V = [
 ('ASF', 'ASFV；Asfarviridae；dsDNA 170–193 kb；<strong>有封套</strong>；24 基因型；唯一經節肢動物傳播的 DNA 病毒', '家豬、野豬；疣豬、叢林豬為儲存宿主；<strong>非</strong>人畜共通', '所有年齡', '直接接觸（口鼻、血液）、餿水豬肉、污染物、軟蜱 <em>Ornithodoros</em>、螫蠅（機械）', '扁桃腺與下頜淋巴結的單核球、巨噬細胞；病毒血症 4–8 天，缺乏完全中和抗體'),
 ('CSF', 'CSFV；Pestiviridae（Orthopestivirus）；(+)ssRNA；<strong>有封套</strong>；單一血清型、3 基因型', '家豬、野豬；非人畜共通', '各年齡，越年輕死亡率越高', '口、直接接觸、短距離飛沫、精液、胎盤', '扁桃腺 → 淋巴 → 血液 → 脾、骨髓；血管內皮壞死、淋巴球與血小板減少、免疫抑制；胎兒免疫耐受'),
 ('JE', 'JEV；Flaviviridae；(+)ssRNA 約 11 kb；有封套 ' + SUP, '豬與鷺科鳥＝<strong>增幅宿主</strong>；人、馬＝終端宿主；<strong>人畜共通</strong>', '懷孕母豬（妊娠 60–70 天前）', '<em>Culex</em> 蚊', '高效價病毒血症 2–4 天；經胎盤感染胎兒；感染神經元'),
 ('HEV', 'HEV；Hepeviridae；(+)ssRNA 約 7.2 kb；無封套 ' + SUP, '豬是保毒庫；基因型 3、4 <strong>人畜共通</strong>', '約 2–3 月齡（母源抗體下降）感染', '豬之間糞口；人經職業接觸、吃未煮熟豬肉或豬肝', '消化道 → 肝；糞便排毒 7 週；豬無症狀'),
 ('PCV', 'PCV2；Circoviridae；<strong>環狀</strong> ssDNA 1.7 kb；無封套；極耐環境', '豬（PCV3 可能跨物種）', '離乳後豬；PDNS 8–18 週齡', '口鼻為主；胎盤、乳汁、精液', '淋巴器官與肺的巨噬細胞、單核球；淋巴耗竭；多因子（共同感染、免疫刺激）'),
 ('PRRS', 'PRRSV；Arteriviridae；(+)ssRNA；<strong>有封套</strong>；PRRSV-1 歐洲、PRRSV-2 美洲亞洲（台灣）', '豬', '母豬（生殖）、仔豬（呼吸道）', '移動感染豬；精液與人工授精；非經口（打針、咬傷）最有效率', '巨噬細胞（PAMs、PIMs）；持續感染、準種；非中和抗體先出現'),
 ('PPV', 'PPV1；Parvoviridae；<strong>線狀</strong> ssDNA；無封套；極耐環境', '豬', '懷孕女豬、年輕母豬', '糞便分泌物、污染物、齧齒類（機械）、公豬精液', '快速分裂細胞；胎兒結果依感染日齡（35、70 天）'),
 ('RV', 'RV；Sedoreoviridae；<strong>分段 dsRNA</strong>（11 段）；無封套', '豬；RVA 人畜共通潛力最大', '新生與哺乳仔豬', '糞口；污染設施器具長期存在', '空腸迴腸成熟腸細胞 → 絨毛萎縮'),
 ('FMD', 'FMDV；Picornaviridae（Aphthovirus）；(+)ssRNA 8.3 kb；無封套；7 血清型無交叉保護', '偶蹄類；豬＝<strong>增幅者</strong>、牛＝指示者、羊＝維持者；非人畜共通', '所有年齡；仔豬心肌炎', '直接接觸最常見、餿水、氣膠（&lt;20 km，豬傳牛）、污染物', '豬經口咽 → 淋巴結 → 病毒血症 → 上皮；潛伏期短於臨床潛伏期（沒症狀就排毒）'),
 ('SVD', 'SVDV；Picornaviridae（Enterovirus）；(+)ssRNA；無封套；單一血清型', '只有豬；非人畜共通', '—', '接觸、污染環境（pen disease）、餿水；症狀前 48 h 就排毒', '上皮細胞；環境極穩定，只有 1% NaOH 有效'),
 ('SVV', 'Senecavirus A；Picornaviridae；(+)ssRNA；無封套；單一血清型', '只有豬；非人畜共通', '台灣案例只見成豬；&lt;1 週齡仔豬死亡率高', '未證實；可能直接接觸、糞口；老鼠、蒼蠅', '受體 ANTXR1'),
 ('POX', 'SwPV；Suipoxvirus；dsDNA 146 kb；<strong>有封套</strong>；細胞質內複製', '豬是唯一自然宿主；非人畜共通', '&lt;3–4 月齡', '<strong>豬蝨</strong>（最常見）、螫蠅與蚊（機械）、直接接觸、垂直', '皮膚棘層角質細胞'),
 ('PR', 'PRV（SuHV-1）；Alphaherpesvirinae（Varicellovirus）；dsDNA 約 143 kb；有封套；單一血清型', '豬唯一自然宿主；牛羊犬貓兔鼠為終端宿主；鳥、馬、高等靈長類抵抗；人畜共通尚無定論', '新生至 3 週齡最嚴重；&gt;10 週以呼吸道為主', '直接接觸（口鼻結膜）、污染物、氣膠、配種（野豬為主）、胎盤（懷孕後期）、初乳', '上呼吸道 → 扁桃腺 → 感覺神經逆行運輸（嗅、三叉、舌咽）→ CNS；潛伏於三叉、薦神經節與扁桃腺'),
 ('PCMV', 'PCMV（SuHV-2）；Betaherpesvirinae（Roseolovirus）；dsDNA 約 130 kb；有封套', '只有豬；豬群盛行率 &gt;90%', '1–5 週齡（鼻炎 3–5 週）；先天感染', '鼻眼分泌物、尿、噴嚏氣膠；口鼻；胎盤', '鼻黏膜腺、哈氏腺、淚腺、腎小管；胎兒為血管內皮；潛伏於單核球、CD8⁺ 淋巴球'),
 ('TGE', 'TGEV；Alphacoronavirus；(+)ssRNA 約 30 kb；有封套；單一血清型。PRCV＝S 蛋白 N 端刪除 227 aa 的變異株', '豬；狗、貓、狐狸、椋鳥可帶毒', '&lt;2 週齡嚴重；冬季', '糞便為主（耐過豬排毒 2–8 週）、乳汁；PRCV 經呼吸道', '空腸迴腸腸細胞壞死 → 吸收不良；受體 pAPN'),
 ('PED', 'PEDV；Alphacoronavirus；G1（傳統）／G2（高致病）', '豬', '各年齡；1 週內仔豬死亡率高', '糞口 ' + SUP, '小腸腸細胞；新生仔豬腸細胞更新慢（5–7 天）'),
 ('PHEV', 'PHEV；<strong>Betacoronavirus</strong>；會凝集紅血球', '豬；強烈嗜神經', '3–4 週齡前感染、母豬無抗體才發病', '口鼻、鼻對鼻、氣膠；沒有帶原者', '呼吸道 → 神經途徑'),
 ('PDCOV', 'PDCoV；<strong>Deltacoronavirus</strong>', '宿主範圍廣（禽、豬、哺乳類）', '仔豬', '推測糞口', '小腸；與 TGE、PED 類似但較輕'),
 ('SADS', 'SADS-CoV；Alphacoronavirus；與蝙蝠 HKU2 &gt;95% 相似', '豬', '仔豬', '—', '小腸；2017 年中國南方'),
 ('FLU', 'IAV；Orthomyxoviridae；8 段 (−)ssRNA；有封套；豬三大型 H1N1、H1N2、H3N2', '豬是<strong>混合容器</strong>；人畜共通（人傳豬比豬傳人頻繁）', '各年齡', '直接接觸分泌物、吸入氣膠', '呼吸道上皮；唾液酸受體 α2,3（禽）／α2,6（人、豬）'),
]
A1B = [
 ('APP', '<em>A. pleuropneumoniae</em>；G− 有莢膜球桿菌；19 血清型；Biotype I 需 NAD', '豬；不感染人', '生長肥育豬', '鼻對鼻短距離；引進帶菌豬（扁桃腺、慢性肺病灶）', '定殖 → 營養（鐵、鎳）→ 逃避清除（莢膜、LPS）→ 破壞（Apx、LPS）'),
 ('AR', 'NPAR：<em>B. bronchiseptica</em>；PAR：產毒型 <em>P. multocida</em>', '<em>Bb</em> 偶見於免疫低下的人', 'NPAR 3–4 週齡；PAR 4–12 週齡', '母豬傳給第一週仔豬；飛沫；混群', '<em>Bb</em>（DNT、TCT、FHA）幫 <em>Pm</em> 定殖；PMT 造成鼻甲骨萎縮'),
 ('GP', '<em>Glaesserella parasuis</em>（舊名 <em>H. parasuis</em>）；G− 多形性短桿菌；15 血清群', '只有家豬、野豬；呼吸道常在菌', '4–8 週齡保育豬', '帶菌豬或病豬接觸', '黏附、生物膜、抗吞噬、侵入內皮'),
 ('EC', 'ETEC、AEEC（EPEC）、EDEC（STEC）、UPEC', '豬', '0–4 日齡；離乳後；母豬', '—', '線毛黏附＋毒素（LT、ST、Stx2e）'),
 ('SE', '<em>E. rhusiopathiae</em>；G+ 細長不運動無芽孢桿菌，易脫色', '<strong>人畜共通</strong>（類丹毒、fish handler\'s disease）；豬與火雞帶菌', '接近上市的生長肥育豬', '帶菌豬（扁桃腺）糞便口鼻排菌；土壤、地下水、魚粉', 'neuraminidase、莢膜、SpaA'),
 ('SAL', '<em>S.</em> Choleraesuis（豬適應）／<em>S.</em> Typhimurium（宿主廣）；G− 不發酵乳糖桿菌；兼性細胞內', '<strong>人畜共通</strong>（食因性）', '離乳保育豬；Choleraesuis 約 12–14 週', '糞口；帶菌豬是最重要感染源', 'SPI-1 T3SS（侵入）、SPI-2 T3SS（細胞內存活）、spv 質體'),
 ('EE', '<em>Staphylococcus hyicus</em>；G+ 球菌；成豬皮膚常在菌', '<strong>非</strong>人畜共通', '7 日齡–10 週齡', '皮膚外傷為前置因子', '剝落毒素 ExhA–D、ShetA/B'),
 ('BR', '<em>Brucella suis</em>（biovar 1、3）；G− 球桿菌，長得慢', '<strong>人畜共通</strong>（職業、實驗室）；也感染馬、牛、犬', '種豬', '消化道、配種', 'urease、低內毒性 LPS、VirB T4SS、erythritol（偏好生殖組織）'),
]

# ---------- A2 臨床與病變 ----------
A2 = [
 ('ASF', '最急性 &gt;41°C、1–4 天死；急性 40–42°C、耳腹皮膚出血發紫、血樣下痢、流產，死亡率 90–100%；亞急性 30–70%；慢性關節腫、皮膚潰瘍', '<strong>脾腫大、質脆、暗黑</strong>；淋巴結腫脹出血；腎皮質點狀出血、腎周水腫；胃肝韌帶出血', '—'),
 ('CSF', '急性高燒 &gt;41°C、沉鬱、結膜炎、發紺、便秘後下痢、神經症狀、流產；慢性消瘦 2–3 個月死；先天持續感染：外觀健康、驗不到抗體、終生排毒', '淋巴結周邊出血、<strong>脾邊緣梗塞</strong>、腎膀胱睪丸點狀出血、扁桃腺壞死、迴盲瓣潰瘍、<strong>鈕扣狀潰瘍</strong>（慢性）', '—'),
 ('JE', '母豬流產、死產、木乃伊、虛弱仔豬；公豬睪丸炎（暫時）；仔豬偶有神經症狀', '母豬無特徵；仔豬腦水腫、皮下水腫、小腦發育不全', '非化膿性腦炎：神經元壞死、血管周圍袖套'),
 ('HEV', '無症狀', '輕至中度肝與腸繫膜淋巴結腫大', '多灶性淋巴漿細胞性肝炎、局部肝細胞壞死'),
 ('PCV', 'PCV2-SD：消瘦、呼吸困難、鼠蹊淋巴結腫大、黃疸；PCV2-RD：晚期流產死產；PDNS：後肢會陰紅紫色斑', '淋巴結腫大、不塌陷的肺、腎白斑；PDNS 腎腫大蒼白、皮質點狀出血', '淋巴耗竭、濾泡被巨噬細胞取代、細胞質內包涵體；PDNS 壞死性血管炎＋纖維素性腎絲球腎炎'),
 ('PRRS', '母豬流產、死產、木乃伊混雜，耳發紺；仔豬呼吸困難（不咳嗽）', '肺斑駁、黃褐與紅色、不塌陷；HP-PRRS 多器官出血', '間質性肺炎'),
 ('PPV', '母豬無症狀；SMEDI：&lt;35 天吸收（返情）、35–70 天木乃伊、&gt;70 天存活帶抗體', '<strong>同窩大小不一的木乃伊胎</strong>', '胎兒大腦血管周圍單核細胞浸潤、肝局部壞死'),
 ('RV', '黃色水樣下痢、脫水；新生仔豬最重', '小腸擴張壁薄、黃灰色內容物、胃有未消化乳', '空腸迴腸絨毛萎縮（頂端）'),
 ('FMD', '發燒、口鼻蹄冠乳頭水疱、流涎、咂嘴、跛行；發病率高、死亡率低；仔豬心肌炎猝死', '水疱、糜爛；仔豬<strong>虎斑心</strong>', '棘層角質細胞氣球樣變性；心肌壞死、間質水腫'),
 ('SVD', '突然跛行、短暫發燒、蹄冠與趾間水疱，比 FMD 輕；沒有仔豬猝死、沒有流產', '水疱', '—'),
 ('SVV', '跛行、昏睡、發燒、鼻與蹄冠水疱糜爛；新生仔豬下痢、死亡率增加', '水疱、糜爛', '台灣案例：鼻鏡角化過度與不全；蹄冠棘細胞空泡化成水疱'),
 ('POX', '斑疹 → 丘疹 → 水疱 → 臍窩狀膿疱 → 結痂；幼豬嚴重；發病率高、死亡率低', '痘疹（側腹、腹下、四肢、鼠蹊、耳）；先天感染全身都有', '棘層角質細胞水腫變性＋<strong>嗜酸性細胞質內包涵體</strong>'),
 ('PR', '新生仔豬猝死；2–3 週齡神經症狀（顫抖、運動失調、<strong>犬坐</strong>、划水）；&gt;10 週呼吸道；母豬呼吸道＋發燒＋依懷孕期的生殖障礙；其他動物劇癢自殘、48 h 內死', '無特徵性病變；肝、脾、肺、腸、腎上腺 1–3 mm 出血壞死灶；壞死性扁桃腺炎；壞死性胎盤炎', '非化膿性腦脊髓炎、三叉神經節炎；<strong>兩染性核內包涵體</strong>（神經系統外較多）'),
 ('PCMV', '3–5 週齡包涵體鼻炎（膿性鼻炎、劇烈噴嚏）；先天感染生殖障礙、新生仔豬虛弱；喉與跗關節周圍水腫', '&lt;3 週齡全身型：卡他性鼻炎、胸水、心包積水、肺與皮下水腫、腎點狀出血', '<strong>嗜鹼性核內包涵體</strong> 8–12 μm＋巨細胞＋巨核（三者合併具診斷性）'),
 ('TGE', '嘔吐、黃色水樣下痢、脫水；&lt;7 日齡 2–7 天死；母豬無乳。PRCV 多為亞臨床', '病變限消化道：腸壁薄透明、胃有凝乳、腸繫膜淋巴管少乳糜；PRCV 肺實質化', '空腸迴腸絨毛萎縮、十二指腸常無；腺窩延長'),
 ('PED', '嘔吐、<strong>水樣</strong>下痢（不是血樣）；1 週內仔豬死亡率高', '小腸充滿水樣黃色液體而擴張', '絨毛變鈍融合、頂端腸細胞空泡'),
 ('PHEV', '嘔吐衰弱病（嘔吐、消瘦）或腦脊髓炎；多亞臨床；初期打噴嚏、咳嗽、發燒', '—', '非化膿性腦脊髓炎；胃壁神經節退化與血管周圍袖套'),
 ('PDCOV', '與 TGE、PED 類似但較輕', '同左', '同左'),
 ('SADS', '仔豬急性下痢', '—', '—'),
 ('FLU', '突然發病、發燒、咳嗽、呼吸費力、快速恢復；高發病率低死亡率', '肺<strong>界線清楚</strong>的紫色實質化', '支氣管上皮壞死脫落、氣道被壞死細胞與嗜中性球堵塞'),
 ('APP', '甚急性 41.5°C、發紺、張口呼吸坐姿、<strong>口鼻泡沫血</strong>、24–36 h 死', '<strong>雙側、界線清楚</strong>的纖維素出血壞死性胸膜肺炎；肺沾黏胸壁；胸腔帶血液體', '—'),
 ('AR', '打噴嚏、聳鼻、流鼻血、鼻吻歪曲、生長遲緩', '鼻甲骨萎縮、鼻中膈偏移', '—'),
 ('GP', '發燒、跛行、關節腫（腳尖小步）、神經症狀（划水）', '<strong>纖維素性多發性漿膜炎</strong>（胸、心包、腹、關節、腦膜）', '—'),
 ('ECN', '0–4 日齡水樣下痢、嚴重脫水、眼窩下陷', '腸壁薄透明、積液、<strong>不發炎</strong>、胃有凝乳', '絨毛<strong>不</strong>萎縮'),
 ('ECP', '離乳後下痢，不帶血', '小腸鬱血、可發炎', 'AEEC：附著抹除（A/E）病灶'),
 ('ED', '<strong>眼瞼、額頭水腫</strong>；不發燒；預後差', '胃黏膜下層與結腸繫膜水腫', 'Stx2e 傷害血管內皮'),
 ('ECM', '看仔豬行為判斷（吃不飽）', '—', '—'),
 ('ECU', '母豬犬坐姿勢', '腎盂腎炎、膀胱炎', '—'),
 ('SE', '急性 40–42°C、<strong>菱形疹</strong>（指壓褪色）、關節痛、糞便乾硬；慢性跛行', '腎皮質點狀出血；慢性增殖性非化膿性關節炎、<strong>疣狀心內膜炎</strong>（→ 腎脾梗塞）', '—'),
 ('SAL', '敗血型：<strong>紅耳朵</strong>（耳翼四肢發紺）、發燒；腸炎型：黃色水樣下痢（初期不帶血）', '敗血型：脾腫、<strong>肝副傷寒小節</strong>、肺水腫出血；腸炎型：壞死性結腸盲腸炎、<strong>鈕扣狀潰瘍</strong>', '—'),
 ('EE', '腋下鼠蹊開始 → 全身油脂樣滲出、結痂、<strong>不癢</strong>', '皮毛糾結如蠟膜', '表皮內水泡膿泡、棘層肥厚'),
 ('BR', '流產、不孕、睪丸炎、後軀麻痺跛行；<strong>公豬難恢復</strong>、母豬多會恢復', '睪丸炎、化膿性壞死性胎盤炎、肝肉芽腫、脊椎炎', '—'),
]

# ---------- A3 診斷與防治 ----------
A3 = [
 ('ASF', '病毒分離＋<strong>血球吸附（玫瑰花環）</strong>確認、PCR；抗體 ELISA 篩檢，IBT／IFAT／IPT 確認', '無', '基因刪除減毒活疫苗（越南 2022 起），無全球公認；撲殺、新豬隔離 30 天'),
 ('CSF', 'RT-PCR、qRT-PCR（分基因型、區分疫苗株）；<strong>FAVNT 金標準</strong>；ELISA；樣本扁桃腺、脾、淋巴結、腎、迴盲瓣', '無', 'LPC 減毒活疫苗；<strong>E2 次單位＋Erns ELISA（DIVA）</strong>、CP7_E2alf；台灣 2023 年停打'),
 ('JE', '病毒分離、RT-PCR、IHC；ELISA、IFA、VN；配對血清', '無', '不活化或減毒活疫苗（活毒較好）；蚊子控制'),
 ('HEV', 'RT-PCR、ELISA（重組衣殼抗原）；糞便、血清、肝、膽汁', '—', '豬無疫苗（人用疫苗僅中國）；衛生、煮熟'),
 ('PCV', 'PCV2-SD：臨床＋淋巴病變＋<strong>病灶內大量 PCV2</strong>（IHC／ISH、qPCR）；PCR 陽性 ≠ PCVAD；PDNS 不需驗 PCV2', '無', 'PCV2 疫苗（2006，多為 PCV2a）；不保護 PCV3／4'),
 ('PRRS', 'RT-PCR × ELISA 合併判讀（14 天界線）；病毒分離（MARC-145）', '無', 'MLV 與不活化疫苗，同源好、異源差；四大支柱'),
 ('PPV', '<strong>PCR 最實用</strong>；IF 驗胎兒抗原；HI 驗抗體；樣本為木乃伊胎', '無', '不活化疫苗，配種前接種'),
 ('RV', 'RT-PCR（最常用、可分型）；糞便或直腸拭子、空腸迴腸', '支持療法：保溫、補液、電解質', 'RVA 疫苗（母豬分娩前）；乳汁 IgA 保護'),
 ('FMD', '臨床不具診斷性；水疱材料病毒分離（BSL-3、BHK-21）、抗原 ELISA（分血清型）、RT-PCR；<strong>NSP（3A3B）抗體</strong>區分感染', '無', '不活化疫苗（不阻止初次感染、保護 4–6 個月）；撲殺、移動管制'),
 ('SVD', '水疱材料電顯、分離、抗原 ELISA、RT-PCR（亞臨床可驗糞便）；VN、ELISA', '無', '無疫苗；禁餿水、撲殺'),
 ('SVV', '電顯、分離、抗原 ELISA、IHC、RT-PCR、ISH；VN、ELISA', '無', '無疫苗；生物安全'),
 ('POX', '典型痘疹推定；電顯與組織病理確認', '無特效；抗生素控制續發感染', '無疫苗；衛生、外寄生蟲控制'),
 ('PR', '病毒：電顯、組織、分離、PCR（gB、gC、gD、gE）；潛伏驗三叉神經節與扁桃腺；抗體 VN、ELISA、LAT；<strong>gE ELISA＝DIVA</strong>', '無特效', '減毒、不活化、gE 缺失疫苗（不阻止感染與潛伏）；DIVA 疫苗＋檢測 → 根除'),
 ('PCMV', '組織病理（包涵體＋巨細胞＋巨核）、分離、PCR；鼻甲黏膜、肺、肺巨噬細胞、腎', '無', '無疫苗；減少緊迫、注意引種'),
 ('TGE', '免疫電顯、分離、IF（<strong>採空腸</strong>）、RT-PCR；<strong>阻斷 ELISA</strong> 區分 TGEV 與 PRCV', '無特效', '減毒與不活化疫苗；產前反飼；生物安全'),
 ('PED', 'IF、電顯、RT-PCR（與 TGE 區分）', '照護、飲水', '疫苗（傳統疫苗對高毒新株無效）；反飼；母源抗體'),
 ('PHEV', '免疫電顯、分離（扁桃腺、腦幹、肺）、抗原檢測、RT-PCR；ELISA、VN', '—', '無疫苗；讓病毒在場內循環，使母豬分娩時有免疫'),
 ('PDCOV', '與 TGEV、PEDV 類似', '—', '與 TGEV、PEDV 類似'),
 ('SADS', '—', '—', '—'),
 ('FLU', '發燒期鼻咽拭子；MDCK 或雞胚蛋分離；RT-PCR；<strong>HI</strong> 是最常用血清學', '—', '不活化全病毒苗＋佐劑，IM 兩劑間隔 2–4 週，母豬每年兩次追加'),
 ('APP', '新鮮死亡豬；NAD 血液培養基或 chocolate agar；CAMP、urease', '<strong>早期注射</strong>抗菌藥、依藥敏', '死菌苗、Apx 毒素次單位、活菌苗；減少混群、統進統出'),
 ('AR', '臨床診斷；培養驗產毒型 <em>P. multocida</em> 確診 PAR', '有正當理由才用抗菌藥', '母豬分娩前 6 週與 2 週疫苗 → 初乳免疫'),
 ('GP', '培養（chocolate agar，需 V 因子）', '早期抗菌藥、依藥敏', '商業或自家疫苗（依血清型）'),
 ('ECN', '講義未特別列', '補液 ' + SUP, '母豬免疫、初乳'),
 ('ECP', '—', '必要時目標性抗菌、輸液電解質', '疫苗、離乳管理、衛生、遺傳抗性'),
 ('ED', '血液培養基上溶血性 <em>E. coli</em>', '預防比治療重要', 'Stx2e／F18 疫苗'),
 ('SE', '—', '<strong>penicillin 首選</strong>，越早越好；慢性反應差', '死菌苗或減毒疫苗'),
 ('SAL', '分離：HE agar（黑心）、SMID、MacConkey（無色）', '—', '活菌苗效果較好；減少暴露與壓力'),
 ('EE', '—', '早期抗菌藥（依藥敏）、局部消毒；ivermectin 無效', '反覆發生可用自家疫苗'),
 ('BR', '血清學篩檢豬群；培養有生物安全風險', '<strong>不建議治療</strong>', '無可靠疫苗；檢測淘汰'),
]

# ---------- B 年齡層 ----------
B = [
 ('哺乳仔豬<br>（新生–約 3 週）', f"{n('TGE')}（&lt;2 週嚴重）、{n('PED')}（1 週內高死亡）、{n('RV')}、{n('PDCOV')}、{n('SADS')}、{n('PR')}（新生猝死；2–3 週神經）、{n('PHEV')}（3–4 週前感染）、{n('PCMV')}（1–5 週）、{n('FMD')} 仔豬心肌炎、{n('SVV')}（&lt;1 週）、{n('CSF')} 產後持續感染",
  f"{n('ECN')}（0–4 日齡）、{n('AR')}（母豬傳第一週仔豬；NPAR 3–4 週）、{n('EE')}（7 日齡起）"),
 ('保育豬<br>（離乳後–約 10 週）', f"{n('PCV')}（離乳後）、{n('PRRS')} 仔豬呼吸道、{n('PR')}（3–9 週神經）、{n('POX')}（&lt;3–4 月齡）、{n('HEV')}（2–3 月齡感染、無症狀）",
  f"{n('GP')}（4–8 週）、{n('ECP')}、{n('ED')}（快速生長的保育豬）、{n('AR')}（PAR 4–12 週）、{n('SAL')}（離乳保育豬；Typhimurium 約 6 週起）、{n('EE')}（到 10 週）"),
 ('生長肥育豬', f"{n('PR')}（&gt;10 週呼吸道）、PDNS（8–18 週）、{n('FLU')}",
  f"{n('APP')}、{n('SE')}（接近上市）、{n('SAL')}（Choleraesuis 約 12–14 週）"),
 ('母豬（生殖）', f"{n('PPV')}（女豬、年輕母豬）、{n('PRRS')}、{n('JE')}（妊娠 60–70 天前）、{n('PR')}（依懷孕期）、PCV2-RD、{n('CSF')}（懷孕 50–70 天 → 先天持續感染）、{n('PCMV')}（先天）、{n('ASF')} 流產、{n('TGE')} 母豬無乳",
  f"{n('BR')}、{n('ECM')}、{n('ECU')}"),
 ('公豬', f"{n('JE')} 睪丸炎、{n('PR')} 睪丸壞死與精子異常、{n('PPV')} 精液排毒、{n('PRRS')} 精液傳播、{n('CSF')} 精液", f"{n('BR')} 睪丸炎（公豬難恢復）"),
 ('各年齡', f"{n('ASF')}、{n('CSF')}、{n('FMD')}、{n('SVD')}、{n('FLU')}、{n('PED')}", '—'),
]

# ---------- C 關鍵字反查 ----------
C = [
 ('皮膚', [
  ('紫紅色菱形突起疹（diamond skin），指壓褪色', 'SE', '急性豬丹毒；菱形疹不是慢性'),
  ('耳翼、四肢末端發紺（紅耳朵）', 'SAL', '敗血型（Choleraesuis）；ASF、CSF、PRRS 也有耳發紺'),
  ('全身油脂樣滲出、結痂、<strong>不癢</strong>', 'EE', '<em>S. hyicus</em> 剝落毒素'),
  ('後肢、會陰紅紫色斑塊（8–18 週齡）', 'PCV', 'PDNS'),
  ('痘疹 → 臍窩狀膿疱 → 結痂；有豬蝨', 'POX', '嗜酸性細胞質內包涵體'),
  ('口鼻、蹄冠水疱', 'FMD', '確診前一律當 FMD；鑑別 SVD、SVV（只有豬）、VES、VS'),
  ('其他動物（犬、貓、牛）劇癢自殘、48 h 內死；場內死老鼠', 'PR', '終端宿主'),
 ]),
 ('腸道', [
  ('0–4 日齡水樣下痢、腸<strong>不發炎</strong>、絨毛不萎縮、胃有凝乳', 'ECN', '分泌性下痢'),
  ('&lt;2 週仔豬嘔吐＋水樣下痢＋高死亡、冬季', 'TGE', 'PED 同，要靠 RT-PCR 或 IF 區分'),
  ('新生哺乳仔豬黃色水樣下痢、絨毛萎縮', 'RV', '保護靠乳汁 IgA'),
  ('結腸、盲腸鈕扣狀潰瘍、壞死性結腸盲腸炎', 'SAL', '腸炎型（Typhimurium）'),
  ('迴盲瓣、腸黏膜鈕扣狀潰瘍', 'CSF', '慢性型'),
  ('嘔吐、消瘦（嘔吐衰弱病）', 'PHEV', 'Betacoronavirus'),
  ('眼瞼額頭水腫、胃黏膜下層與結腸繫膜水腫、不發燒', 'ED', 'F18＋Stx2e'),
 ]),
 ('呼吸道', [
  ('肥育豬猝死、口鼻泡沫血、雙側界線清楚的纖維素出血壞死性胸膜肺炎', 'APP', 'G−、CAMP 陽性、chocolate agar'),
  ('打噴嚏、聳鼻、鼻吻歪、鼻甲骨萎縮', 'AR', 'Bb＋產毒型 Pm'),
  ('肺斑駁、不塌陷、間質性肺炎；仔豬呼吸困難不咳嗽', 'PRRS', '常與 PCVAD 病變相似'),
  ('突然發病快速恢復；肺界線清楚紫色實質化', 'FLU', '高發病率低死亡率'),
  ('3–5 週齡劇烈噴嚏、膿性鼻炎', 'PCMV', '包涵體鼻炎'),
  ('離乳後消瘦、鼠蹊淋巴結腫大、淋巴耗竭', 'PCV', 'PCV2-SD（PMWS）'),
 ]),
 ('神經、關節、漿膜', [
  ('犬坐姿勢、顫抖、划水；2–3 週齡仔豬神經症狀', 'PR', '三叉神經節潛伏'),
  ('4–8 週保育豬纖維素性多發性漿膜炎＋關節炎＋腦膜炎', 'GP', '需 V 不需 X'),
  ('慢性增殖性非化膿性關節炎、疣狀心內膜炎', 'SE', '慢性型'),
  ('後軀麻痺跛行＋脊椎炎', 'BR', '也有睪丸炎、流產'),
  ('非化膿性腦（脊髓）炎', 'JE', 'PR、PHEV 也是'),
 ]),
 ('生殖', [
  ('同窩大小不一的木乃伊胎、母豬無症狀', 'PPV', 'SMEDI'),
  ('流產＋同場仔豬呼吸道病', 'PRRS', '母豬耳發紺'),
  ('蚊子季節、妊娠 60–70 天前、仔豬腦水腫、公豬睪丸炎', 'JE', '豬是增幅宿主'),
  ('晚期流產、胎兒心臟肥大、纖維化壞死性心肌炎', 'PCV', 'PCV2-RD'),
  ('外觀健康、驗不到抗體、終生排毒的仔豬', 'CSF', '先天持續感染（免疫耐受）'),
  ('流產＋公豬睪丸炎＋erythritol', 'BR', '公豬難恢復'),
  ('壞死性胎盤炎＋依懷孕期吸收、木乃伊、流產', 'PR', '核內包涵體在滋養層'),
 ]),
 ('剖檢', [
  ('脾腫大、質脆、暗黑', 'ASF', ''),
  ('脾邊緣梗塞、淋巴結周邊出血', 'CSF', ''),
  ('仔豬虎斑心、猝死', 'FMD', '心肌炎'),
  ('脾腫、肝副傷寒小節', 'SAL', '敗血型'),
  ('肝、脾、肺 1–3 mm 出血壞死灶', 'PR', 'alphaherpesvirus 特徵'),
  ('腎皮質點狀出血', 'CSF', 'ASF、豬丹毒、PDNS、PCMV 也有，要配合其他線索'),
 ]),
 ('實驗室與流行病學', [
  ('血球吸附玫瑰花環', 'ASF', '只有 ASFV 會'),
  ('驗 NSP（3A3B）抗體區分感染與疫苗', 'FMD', 'PR 驗 gE；CSF 用 E2 疫苗＋Erns ELISA'),
  ('chocolate agar、需 V 不需 X', 'GP', 'APP biotype I 也需 V'),
  ('MacConkey 無色菌落、HE agar 黑心', 'SAL', '不發酵乳糖'),
  ('羊血瓊脂瓷白色不溶血菌落', 'EE', '<em>S. hyicus</em>'),
  ('唯一蜱傳 DNA 病毒（軟蜱）', 'ASF', ''),
  ('豬蝨傳播', 'POX', ''),
  ('增幅宿主（蚊媒）', 'JE', 'FMD 的豬是增幅者；流感的豬是混合容器'),
  ('fish handler\'s disease、類丹毒', 'SE', '人畜共通'),
  ('pen disease；只有 1% NaOH 能不活化', 'SVD', ''),
  ('阻斷 ELISA 區分 TGEV 與 PRCV', 'TGE', ''),
 ]),
]

# ---------- D 細菌實驗室特徵 ----------
DL = [
 ('APP', 'G− 有莢膜球桿菌，不運動', 'Biotype I 需 NAD（V 因子）：NAD 血液培養基、chocolate agar', 'Apx 溶血（ApxIII 不溶血）', '<strong>CAMP 陽性</strong>、urease'),
 ('GP', 'G− 多形性短桿菌', '需 V 不需 X；chocolate agar', '—', '—'),
 ('AR', '<em>B. bronchiseptica</em>、<em>P. multocida</em>', '講義未列', '—', '確診 PAR 要驗產毒株或毒素基因'),
 ('ED', '<em>E. coli</em>（G−）' + SUP, '血液培養基', '<strong>溶血</strong>', 'F18 線毛＋Stx2e'),
 ('SE', 'G+ 細長略彎桿菌，易脫色、長絲狀', '羊血瓊脂', '24 h 不溶血小菌落，48 h 出現溶血', '可能被誤判為 G−'),
 ('SAL', 'G− 桿菌，兼性細胞內', 'HE agar、SMID、MacConkey', 'HE 黑心菌落；MacConkey <strong>無色</strong>（不發酵乳糖）', '—'),
 ('EE', 'G+ 球菌', '羊血瓊脂', '3–4 mm <strong>瓷白色、不溶血</strong>', '成豬皮膚常在菌'),
 ('BR', 'G− 小桿菌／球桿菌，不運動', '長得慢，營養豐富也只長針尖大小', '半透明、表面光滑', '培養有生物安全風險，豬群以血清學篩檢'),
]

# ---------- E 包涵體與特徵鏡檢 ----------
E1 = [
 ('POX', '<strong>嗜酸性細胞質內</strong>', '棘層角質細胞（伴水腫變性）'),
 ('PR', '<strong>兩染性核內</strong>（amphophilic）', '神經系統外較多：上皮壞死灶、胎盤滋養層'),
 ('PCMV', '<strong>嗜鹼性核內</strong>，8–12 μm，伴巨細胞與巨核', '鼻黏膜腺、哈氏腺、淚腺、腎小管上皮；三者合併具診斷性'),
 ('PCV', '細胞質內', '淋巴組織（伴淋巴耗竭、濾泡被巨噬細胞取代）'),
]
E2 = [
 ('非化膿性腦（脊髓）炎', f"{n('JE')}、{n('PR')}（含三叉神經節炎）、{n('PHEV')}"),
 ('絨毛萎縮', f"{n('TGE')}（空腸迴腸）、{n('PED')}、{n('RV')}；{n('ECN')} <strong>不</strong>萎縮"),
 ('間質性肺炎', f"{n('PRRS')}、{n('PCV')}"),
 ('支氣管上皮壞死脫落、氣道被嗜中性球堵塞', n('FLU')),
 ('棘層角質細胞氣球樣變性 → 水疱', f"{n('FMD')}"),
 ('淋巴漿細胞性肝炎、局部肝細胞壞死', n('HEV')),
 ('壞死性血管炎＋纖維素性腎絲球腎炎', 'PDNS（' + n('PCV') + '）'),
 ('表皮內水泡膿泡、棘層肥厚', n('EE')),
 ('Stx2e 血管內皮傷害', n('ED')),
]

# ---------- F 數字速查 ----------
F = [
 ('ASF', '24 基因型；潛伏期接觸 4–19 天、蜱咬 &lt;5 天；病毒血症 4–8 天；急性死亡率 90–100%、亞急性 30–70%；4°C 血液 18 個月、火腿 &gt;140 天；70°C 30 分鐘；pH &lt;3.9 或 &gt;11.5；新豬隔離 30 天'),
 ('CSF', '3 基因型；潛伏期 2–15 天；先天持續感染＝懷孕 50–70 天感染；慢性 2–3 個月死；4°C 6 週；65.5°C 30 分鐘或 71°C 1 分鐘；pH &lt;3 或 &gt;11；FAVNT 3 天；台灣 2006 後田間無病毒、2023 停打'),
 ('JE', '5 基因型（台灣 I、III）；病毒血症 2–4 天；妊娠 60–70 天前；感染後 3 天可到 CNS'),
 ('HEV', '8 基因型（3、4 人畜共通）；2–3 月齡感染；糞便排毒 7 週；豬肝 24%；豬農抗體 29.5% vs 一般 11.5%（3.5 倍）；母源抗體 7–9 週'),
 ('PCV', 'PCV2 1.7 kb；2a → 2b（2003）→ 2d（2012）；PDNS 8–18 週；疫苗 2006；IFA 抗體 7–14 天、中和 21–35 天'),
 ('PRRS', '非中和抗體 7–14 天、中和 3–4 週；演化 10⁻² substitutions/site/year；PCR／ELISA 以 14 天為界；非經口 10–10²·² vs 經口 10⁵·³ TCID₅₀'),
 ('PPV', '&lt;35 天吸收、35–70 天木乃伊、&gt;70 天有免疫；抗體 6 天出現、14–21 天高峰；母源抗體 14–26 週'),
 ('RV', '11 段 dsRNA；潛伏期 1–4 天；約 90 顆病毒即可致病'),
 ('FMD', '7 血清型；感染所需 豬 10³、牛 10、羊 15 TCID₅₀；豬每天排出 10⁶–10⁸·⁶；帶毒 豬 &lt;28 天、牛最長 3.5 年；氣膠 &lt;20 km；疫苗保護 4–6 個月、母源干擾到 8–12 週齡；1997 年撲殺近 400 萬頭、約 1,700 億元；107 年 7 月停打、2020 年 6 月非疫區'),
 ('SVD', '症狀前 48 h 排毒；1% NaOH；1966 年義大利首報'),
 ('SVV', '2002 年發現；台灣 2012 年花蓮首例、2018 年台南第二例'),
 ('POX', '&lt;3–4 月齡較重；146 kb'),
 ('PR', '143 kb、11 種醣蛋白；潛伏期 1–8 天（最長 3 週）；感染需 10⁴–10⁵ TCID₅₀（仔豬 10²）；pH 4–12 穩定；肉品 −18°C 40 天或 80°C 不活化；其他動物 48 h 內死'),
 ('PCMV', '130 kb；豬群盛行率 &gt;90%；1–5 週齡、鼻炎 3–5 週；包涵體 8–12 μm'),
 ('TGE', '約 30 kb；PRCV 刪 227 aa；潛伏期 18 h–3 天；&lt;7 日齡 2–7 天死；地方性死亡率 &lt;10–20%；耐過豬排毒 2–8 週（最長 18 個月）'),
 ('PED', '腸細胞更新：新生仔豬 5–7 天、3 週齡 2–3 天；台灣 2013–2014 年爆發'),
 ('PHEV', '3–4 週齡前感染才發病'),
 ('FLU', '8 段；18 HA × 11 NA；疫苗兩劑間隔 2–4 週、母豬每年兩次'),
 ('APP', '19 血清型、台灣以 15 型為主；41.5°C；24–36 h 死；Apx I–IV'),
 ('AR', 'NPAR 3–4 週、PAR 4–12 週；PMT 146 kDa；疫苗分娩前 6 週與 2 週；<em>Bb</em> 土壤存活 45 天'),
 ('GP', '15 血清群；4–8 週齡'),
 ('EC', '新生 0–4 日齡；線毛 F4（K88）、F5（K99）、F6（987P）、F41；離乳後 F4 或 F18；水腫病 F18'),
 ('SE', '40–42°C；發病 2–3 天出現菱形疹'),
 ('SAL', 'Choleraesuis 約 12–14 週；Typhimurium 約 6 週起'),
 ('EE', '7 日齡–10 週齡；菌落 3–4 mm'),
 ('BR', '<em>B. suis</em> biovar 1、3'),
 ('產業', '懷孕期 114–115 天（3 個月 3 週 3 天）；在養頭數 537.5 萬頭（第 1 週講義）'),
]

def k2(k):  # F 表第一欄
    return '養豬產業（' + L(W1, 'life', '第 1 週') + '）' if k == '產業' else n(k)


# ---------- G 腸道中英對照 ----------
G1 = [
 ('消化道（腸胃道）', 'gastrointestinal tract, GI tract', ''),
 ('小腸', 'small intestine', ''),
 ('十二指腸', 'duodenum', 'TGE 病變常無（' + L('pdf/豬冠狀病毒病.pdf', 19, '講義 p.19') + '）'),
 ('空腸', 'jejunum', 'TGE 病變最明顯處；TGE 免疫螢光採這段最適當'),
 ('迴腸', 'ileum', '增生性腸病（區域性迴腸炎）；TGE 病變明顯處'),
 ('大腸', 'large intestine', ''),
 ('盲腸', 'cecum（英式 caecum）', '慢性豬瘟的鈕扣狀潰瘍'),
 ('結腸', 'colon', '豬赤痢、沙門氏菌腸炎的病變主要在這裡'),
 ('直腸', 'rectum', ''),
 ('迴盲瓣', 'ileocecal valve', '豬瘟潰瘍好發處'),
 ('肛門', 'anus', ''),
]
G2 = [
 ('絨毛', 'villus（複數 villi）'), ('絨毛萎縮', 'villous atrophy'), ('腺窩（隱窩）', 'crypt（Lieberkühn 腺窩，crypt of Lieberkühn）'),
 ('腺窩延長（增生）', 'crypt elongation（crypt hyperplasia）'), ('腸細胞', 'enterocyte'), ('黏膜', 'mucosa'), ('黏膜下層', 'submucosa'),
 ('肌肉層', 'muscularis'), ('漿膜', 'serosa'), ('腸繫膜', 'mesentery'), ('結腸繫膜', 'mesocolon'),
 ('乳糜管（絨毛中央的淋巴管）', 'lacteal'), ('淋巴濾泡集結（派亞氏斑）', "Peyer's patches"),
]
G3 = [
 ('腸炎', 'enteritis'), ('腸結腸炎', 'enterocolitis'), ('結腸盲腸炎', 'typhlocolitis'), ('迴腸炎', 'ileitis'), ('鈕扣狀潰瘍', 'button ulcer'),
 ('腸繫膜水腫', 'mesenteric edema'), ('增生性腸病', 'proliferative enteropathy'), ('吸收不良性下痢', 'malabsorptive diarrhea'),
 ('分泌性下痢', 'secretory diarrhea'), ('滲透性下痢', 'osmotic diarrhea'),
]

# ---------- 組各節 ----------
SECTIONS = []
def sec(sid, name, title, desc, body, src):
    SECTIONS.append((sid, name, title, desc, body, src))

ov = ('<div class="alert alert-info"><div class="alert-label">怎麼用</div><p>這頁把期中範圍（第 1–7 週）的 28 個疾病整理成總表與反查表。每個疾病名稱都可以點回原本的週次頁；'
      '假性狂犬病與豬巨細胞病毒還沒有週次頁，會直接開疱疹講義。表格內容取自各週頁與講義，講義以外的內容標 ' + SUP + '。</p></div>'
      '<h3>本頁各表</h3><ol>'
      '<li><a href="#section-a0">A0 人畜共通病原</a></li><li><a href="#section-a1v">A1 病原與流行病學</a>（病毒、細菌分兩張）</li><li><a href="#section-a2">A2 臨床與病變</a></li><li><a href="#section-a3">A3 診斷與防治</a></li>'
      '<li><a href="#section-age">B 年齡層 × 疾病</a></li><li><a href="#section-key">C 關鍵字反查</a></li><li><a href="#section-lab">D 細菌實驗室特徵</a></li>'
      '<li><a href="#section-path">E 包涵體與特徵鏡檢</a></li><li><a href="#section-num">F 數字速查</a></li><li><a href="#section-gut">G 腸道中英對照</a></li></ol>'
      '<h3>28 個疾病</h3>' + table(['週次', '疾病'], [
        ['第 2 週', '、'.join(n(k) for k in ['ASF', 'CSF', 'JE', 'HEV'])], ['第 3 週', '、'.join(n(k) for k in ['PCV', 'PRRS', 'PPV', 'RV'])],
        ['第 4 週', '、'.join(n(k) for k in ['FMD', 'SVD', 'SVV', 'POX', 'PR', 'PCMV'])], ['第 5 週', '、'.join(n(k) for k in ['TGE', 'PED', 'PHEV', 'PDCOV', 'SADS', 'FLU'])],
        ['第 6 週', '、'.join(n(k) for k in ['APP', 'AR', 'GP', 'ECN', 'ECP', 'ED', 'ECM', 'ECU'])], ['第 7 週', '、'.join(n(k) for k in ['SE', 'SAL', 'EE', 'BR'])]], small=False)
      + '<p style="font-size:.9em;color:var(--fg-muted)">其他整理：<a href="期中總複習.html">期中總複習</a>（依症狀的鑑別表、DIVA、人畜共通）、<a href="期中考古.html">期中考古</a>、<a href="../../國考/獸醫傳染病學/統整表格.html">國考統整表格</a>。</p>')
ov = ov.replace('</p></div><h3>本頁各表', '病原、臨床、診斷這三張大表比較寬，在表格上左右滑動可以看到右邊的欄位。</p></div><h3>本頁各表', 1)
sec('abstract', '怎麼用這一頁', '怎麼用這一頁', '期中範圍 28 個疾病的總表與反查表。', ov, '整理自本站第 1–7 週筆記與課程講義。')

def lk(k, text):
    t, pp, ss = D[k]; return L(pp, ss, text)
A0V = [
 (lk('JE', '日本腦炎病毒（Japanese encephalitis virus）'), '蚊子（<em>Culex</em>）叮咬', '豬是<strong>增幅宿主</strong>，人與馬是<strong>終端宿主</strong>；人與豬之間不是直接傳播'),
 (lk('HEV', 'E 型肝炎病毒（Hepatitis E virus）'), '吃未煮熟的豬肉、豬肝；職業接觸感染豬', '基因型 <strong>3、4</strong> 是人畜共通的重要型；豬無症狀，是保毒庫'),
 (lk('FLU', '豬流行性感冒病毒（Swine influenza virus）'), '接觸感染豬的氣膠、分泌物', '<strong>豬傳人較少，人傳豬（反向人畜共通）更頻繁</strong>；台灣有人類感染 H1N2v 的病例'),
 (lk('RV', '輪狀病毒 A 型（Rotavirus A）'), '零星的跨物種傳播與基因重組', '是豬輪狀病毒中人畜共通潛力最大的；豬可能是新的輪狀病毒 A 型基因的保毒庫'),
 (lk('PR', '假性狂犬病病毒（Pseudorabies virus）'), '人類感染<strong>尚無定論</strong>', '有疑似病例報告（腦炎、眼內炎伴病毒 DNA 陽性），但證據不足'),
]
A0B = [
 (lk('SE', '豬丹毒菌（<em>Erysipelothrix rhusiopathiae</em>）'), '皮膚刮傷或刺傷，屬職業感染', '人的病叫<strong>類丹毒</strong>（erysipeloid），也稱 fish handler\'s disease'),
 (lk('SAL', '沙門氏菌（<em>Salmonella</em>）'), '食因性（吃受污染的豬肉）；接觸', '非傷寒型沙門氏菌症是許多國家食因性疾病的主要原因'),
 (lk('BR', '豬布氏桿菌（<em>Brucella suis</em>）'), '職業暴露（農民、獸醫、屠宰、獵人）；實驗室', '<strong>實驗室感染風險很大</strong>；也感染馬、牛、犬'),
 (lk('AR', '支氣管敗血性波氏桿菌（<em>Bordetella bronchiseptica</em>，萎縮性鼻炎的病原之一）'), '免疫低下者偶見', '次要，第 6 週比較表有列'),
]
A0N = [
 ('病毒', '、'.join([lk('ASF', '非洲豬瘟病毒'), lk('CSF', '豬瘟病毒'), lk('FMD', '口蹄疫病毒'), lk('SVD', '豬水疱病病毒'), lk('SVV', '矽尼卡谷病毒'), lk('POX', '豬痘病毒'),
        lk('PCV', '豬環狀病毒第 2 型'), lk('PPV', '豬小病毒'), lk('PRRS', '豬生殖與呼吸綜合症病毒（藍耳病病毒）'), lk('TGE', '傳染性胃腸炎病毒'), lk('PED', '豬流行性下痢病毒')])),
 ('細菌', '、'.join([lk('APP', '胸膜肺炎放線桿菌（<em>Actinobacillus pleuropneumoniae</em>）'), lk('GP', '副豬格拉氏菌（<em>Glaesserella parasuis</em>，格拉氏病）'),
        lk('EE', '豬葡萄球菌（<em>Staphylococcus hyicus</em>，滲出性表皮炎）')])),
]
A0C = [
 '<strong>豬傳人 vs 人傳豬</strong>：豬流行性感冒是人傳豬（反向人畜共通）更頻繁，不是豬傳人。',
 '<strong>日本腦炎的豬不是傳染源</strong>：豬是增幅宿主，傳給人的是蚊子；人與馬是終端宿主，不會再傳給蚊子。',
 '<strong>E 型肝炎的豬沒有症狀</strong>：風險在吃未煮熟的豬肉或豬肝，以及職業接觸；基因型 3、4 才是人畜共通的重要型。',
 '<strong>沙門氏菌</strong>：任何血清型對人都可能是病原；豬霍亂沙門氏菌（<em>Salmonella</em> Choleraesuis）在亞洲是侵襲性感染的原因。',
 '<strong>假性狂犬病病毒不能寫成人畜共通</strong>：講義寫人類感染尚無定論。',
 '<strong>傳染性胃腸炎病毒、豬流行性下痢病毒不是人畜共通</strong>：<a href="期中考古.html#section-z2019">2019 期中考古</a> Q12 選項「豬流行性下痢病毒為人畜共通」是錯的。',
 '<strong>水疱性疾病</strong>：口蹄疫、豬水疱病、矽尼卡谷病毒感染症都不是人畜共通；四種水疱病中只有<strong>水疱性口炎</strong>是（但台灣沒有，也不在期中的主要疾病裡）。',
]
A0X = [
 '豬環狀病毒第 3 型：在多種動物中驗到，可能跨物種傳播，但人類感染未確認。',
 '豬戴爾他冠狀病毒：講義圖中推定宿主範圍包括人，但沒有確定的人畜共通結論。',
]
sec('a0', 'A0 人畜共通病原', 'A0 人畜共通病原', '期中範圍（第 1–7 週）的人畜共通病原，以及不是人畜共通、容易被考混的點。',
    '<h3>病毒</h3>' + table(['病毒', '怎麼傳給人', '要注意的點'], [list(r) for r in A0V], small=False)
    + '<h3>細菌</h3>' + table(['細菌', '怎麼傳給人', '要注意的點'], [list(r) for r in A0B], small=False)
    + '<h3>不是人畜共通</h3><ul>' + ''.join(f'<li><strong>{a}</strong>：{b}</li>' for a, b in A0N) + '</ul>'
    + '<h3>容易被考混的點</h3><ol>' + ''.join(f'<li>{x}</li>' for x in A0C) + '</ol>'
    + '<h3>講義有提到，但尚未確認</h3><ul>' + ''.join(f'<li>{x}</li>' for x in A0X) + '</ul>',
    '第 2–7 週筆記、' + L('期中總複習.html', 'zoo', '期中總複習第 5 節') + '與疱疹講義 ' + L(HV, 19, 'p.19') + '。')
H1 = ['疾病', '病原（科屬、核酸、封套）', '宿主與人畜共通', '好發', '傳播', '標的與致病關鍵']
sec('a1v', 'A1 病原與流行病學（病毒）', 'A1 病原與流行病學：病毒', '20 個病毒病。封套與核酸類型常和環境抵抗力、消毒一起考。',
    table(H1, [[fn(k)] + list(r) for k, *r in A1V], wide=True), '第 2–5 週筆記；假性狂犬病與豬巨細胞病毒取自疱疹講義 ' + L(HV, 11, 'p.11–31') + '、' + L(HV, 68, 'p.68–80') + '。')
H1b = ['疾病', '病原（革蘭氏、形態）', '宿主與人畜共通', '好發', '傳播', '致病關鍵與毒力因子']
sec('a1b', 'A1 病原與流行病學（細菌）', 'A1 病原與流行病學：細菌', '8 個細菌病；大腸桿菌各型的差異在 A2、A3 分列。',
    table(H1b, [[fn(k)] + list(r) for k, *r in A1B], wide=True), '第 6–7 週筆記。')
sec('a2', 'A2 臨床與病變', 'A2 臨床與病變', '招牌症狀、肉眼病變、鏡檢病變。粗體是最常被拿來出題的特徵。',
    table(['疾病', '招牌症狀', '肉眼病變', '鏡檢病變'], [[n(k)] + list(r) for k, *r in A2], wide=True), '第 2–7 週筆記；PRV、PCMV 取自疱疹講義 ' + L(HV, 32, 'p.32–46') + '、' + L(HV, 75, 'p.75–78') + '。')
sec('a3', 'A3 診斷與防治', 'A3 診斷與防治', '確診方法、治療、疫苗與 DIVA。「—」表示講義沒有寫。',
    table(['疾病', '診斷（方法與樣本）', '治療', '疫苗、DIVA 與防治'], [[n(k)] + list(r) for k, *r in A3], wide=True), '第 2–7 週筆記；PRV、PCMV 取自疱疹講義 ' + L(HV, 50, 'p.50–55') + '、' + L(HV, 79, 'p.79–80') + '。')
sec('age', 'B 年齡層 × 疾病', 'B 年齡層 × 疾病', '看到題目寫的日齡或生產階段，先用這張縮小範圍。括號是講義寫的好發年齡。',
    table(['階段', '病毒', '細菌'], [list(r) for r in B], small=False), '第 2–7 週筆記；年齡分段為本站整理。')
key = ''
for grp, items in C:
    key += f'<h3>{grp}</h3>' + table(['題目線索', '想到', '補一句'], [[a, n(k), c] for a, k, c in items], small=False)
sec('key', 'C 關鍵字反查', 'C 關鍵字反查', '從題幹線索反查疾病。葉光勝老師常用「臨床情境＋剖檢＋培養」出單選題，這張就是對這種題型。', key, '第 2–7 週筆記與期中考古。')
sec('lab', 'D 細菌實驗室特徵', 'D 細菌實驗室特徵', '革蘭氏染色、培養需求、菌落與溶血。考題常給培養結果要你判斷病原。',
    table(['病原', '革蘭氏與形態', '培養基與生長需求', '菌落與溶血', '其他鑑別'], [[n(k)] + list(r) for k, *r in DL], small=False)
    + '<div class="alert alert-warn"><div class="alert-label">注意</div><p>V 因子（NAD）與 X 因子（hemin）：<em>G. parasuis</em> 需 V 不需 X；APP biotype I 需 V。考題常拿「需要 X 因子」當錯誤選項。</p></div>', '第 6–7 週筆記。')
sec('path', 'E 包涵體與特徵鏡檢', 'E 包涵體與特徵鏡檢', '包涵體位置（核內或細胞質）與染色是病毒鑑別的經典考點。',
    '<h3>有包涵體的疾病</h3>' + table(['疾病', '包涵體', '在哪裡'], [[n(k), a, b] for k, a, b in E1], small=False)
    + '<h3>特徵鏡檢病變</h3>' + table(['鏡檢病變', '疾病'], [list(r) for r in E2], small=False), '第 2–7 週筆記；疱疹講義 ' + L(HV, 45, 'p.45') + '、' + L(HV, 78, 'p.78') + '。')
sec('num', 'F 數字速查', 'F 數字速查', '潛伏期、日齡界線、死亡率、年份。只列講義寫到的數字。',
    table(['疾病', '數字'], [[k2(k), v] for k, v in F], small=False), '第 1–7 週筆記與疱疹講義。')
sec('gut', 'G 腸道中英對照', 'G 腸道中英對照', '腸道各段、小腸壁構造與常見病變詞的中英文。' + SUP + ' 名詞對照為補充；右欄只標講義有寫到的線索。',
    '<h3>腸道各段</h3>' + table(['中文', '英文', '豬病學裡的線索'], [list(r) for r in G1], small=False)
    + '<h3>小腸壁的構造</h3>' + table(['中文', '英文'], [list(r) for r in G2], small=False)
    + '<h3>常見病變詞</h3>' + table(['中文', '英文'], [list(r) for r in G3], small=False), '解剖與病理名詞（補充）；豬病學線索取自第 2、5、6、7 週筆記。')

# ---------- 組頁面 ----------
head_end = TPL.index('<section class="pagehead">'); script_start = TPL.index('<script>\nfunction showSection')
page_head = TPL[:head_end].replace('<title>豬病學期中總複習 - yc._vetalk</title>', '<title>豬病學：疾病統整表 - yc._vetalk</title>')
date = subprocess.run(['date', '+%Y-%m-%d'], capture_output=True, text=True).stdout.strip()
pagehead = f'''<section class="pagehead">
  <div class="pagehead__inner">
    <div class="breadcrumb">
      <a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="index.html">豬病學</a><span class="sep">›</span><span class="current">疾病統整表</span>
    </div>
    <div class="page-head">
      <h1 class="page-title">豬病學疾病統整表</h1>
      <p class="page-subtitle">Disease Summary Tables · 期中範圍 28 個疾病：病原、臨床、病變、診斷、防治、年齡、關鍵字反查</p>
    </div>
    <div class="meta-bar">
      <div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">豬病學（大四上・期中範圍第 1–7 週）</div></div>
      <div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">本站第 1–7 週筆記；假性狂犬病、豬巨細胞病毒取自疱疹講義</div></div>
      <div class="meta-item"><div class="meta-label">最後更新</div><div class="meta-value">{date}</div></div>
      <div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">10 張表完成</div></div>
    </div>
  </div>
</section>
'''
ICON = {'abstract': '⭐', 'a0': '🧍', 'a1v': '🧬', 'a1b': '🦠', 'a2': '🩺', 'a3': '🧪', 'age': '🐖', 'key': '🔎', 'lab': '🧫', 'path': '🔬', 'num': '🔢', 'gut': '🫧'}
GRP = {'abstract': '總覽', 'a0': '疾病總表', 'age': '反查與對照', 'num': '速查', 'gut': '名詞'}
toc = ['<div class="pagewrap">', '  <nav class="toc">']
for i, (sid, name, *_r) in enumerate(SECTIONS):
    if sid in GRP:
        mt = ' style="margin-top:8px;"' if i else ''
        toc.append(f'    <div class="section-label"{mt}>{GRP[sid]}</div>')
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
FLU = open('week05_豬流行性感冒.html', encoding='utf-8').read()
_css = re.search(r'<style>.*?</style>', FLU, re.S).group(0)
_panel = FLU[FLU.index('<div id="pdfPanel"'):]
_panel = _panel[:_panel.index('</script>') + len('</script>')]
page_head = page_head.replace('</head>', _css + '\n</head>', 1)
html = page_head + pagehead + '\n' + '\n'.join(toc) + '\n'.join(body) + script.replace('<script src="../../assets/nav-data.js">', _panel + '\n<script src="../../assets/nav-data.js">', 1)
open('疾病統整表.html', 'w', encoding='utf-8').write(html)
print('ok', len(html), 'rows A1', len(A1V) + len(A1B), 'A2', len(A2), 'A3', len(A3))
