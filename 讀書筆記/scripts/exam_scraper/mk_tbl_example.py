import re
base='國考/獸醫傳染病學/'
t=open(base+'豬病學統整.html',encoding='utf-8').read()
head=t[:t.index('<section class="pagehead">')].replace('豬病學統整（歷屆國考題） - yc._vetalk','統整表格 - yc._vetalk')
tail=t[t.index('<script>\nfunction showSection'):]
W6='../../大四上/豬病學/week06_細菌性疾病I.html'; W7='../../大四上/豬病學/week07_細菌性疾病II.html'; EX='豬病學統整.html'
def src(label,url): return f'<a href="{url}">{label}</a>'
MUST='<span class="tag tag-exam">必考</span>'; TRAP='<span class="tag tag-exam">國考陷阱</span>'; SUP='<span class="tag">補充</span>'
rows=[
 ('APP 胸膜肺炎',  '<strong>Apx（I～IV）</strong>', '在細胞膜打洞（RTX 家族）：溶血、殺肺泡巨噬細胞與嗜中性球', MUST+TRAP, src('第6週・APP 致病',W6+'#section-app-path')),
 ('萎縮性鼻炎（Bordetella）', '<strong>DNT</strong>、<strong>TCT</strong>；黏附因子 FHA、pertactin、線毛', 'DNT 損害骨形成；TCT 抑制纖毛、殺纖毛細胞', MUST+TRAP, src('第6週・AR 致病',W6+'#section-ar-path')),
 ('萎縮性鼻炎（產毒型 P. multocida）', '<strong>PMT</strong>（146 kDa，噬菌體編碼）', '骨形成減少、骨吸收增加 → 鼻甲骨永久萎縮', MUST, src('第6週・AR 致病',W6+'#section-ar-path')),
 ('新生仔豬下痢（ETEC）', '<strong>LT、STa、STb</strong>', 'LT→cAMP↑；STa→cGMP↑；腸道過度分泌（分泌性下痢），絨毛不萎縮', MUST, src('第6週・新生仔豬下痢',W6+'#section-ec-neo')),
 ('水腫病（STEC／EDEC）', '<strong>Stx2e</strong>（志賀毒素 2e）', '傷害血管內皮 → 水腫、出血（胃黏膜下層、結腸繫膜）', MUST+TRAP, src('第6週・離乳後下痢與水腫病',W6+'#section-ec-pwd')),
 ('離乳後下痢（AEEC／EPEC）', '沒有典型毒素；黏附因子 Eae', '緊密附著、抹除微絨毛（A/E 病灶）', SUP, src('第6週・離乳後下痢與水腫病',W6+'#section-ec-pwd')),
 ('滲出性表皮炎（S. hyicus）', '<strong>ExhA、ExhB</strong>（另有 ExhC、D；日本命名 ShetA／B）', '表皮剝落毒素：使表皮細胞分離，過量皮脂與漿液滲出', MUST+TRAP, src('第7週・滲出性表皮炎',W7+'#section-ee')),
 ('豬丹毒', '沒有外毒素；neuraminidase、莢膜、SpaA', '血管傷害、血栓；侵入與抗吞噬', MUST, src('第7週・豬丹毒致病',W7+'#section-se-clin')),
 ('沙門氏菌症', '沒有典型外毒素；SPI-1／SPI-2（第三型分泌系統）、spv 質體', 'SPI-1 侵入細胞（膜起皺）；SPI-2 細胞內存活與全身散播；spv 使感染變全身性敗血症', MUST, src('第7週・沙門氏菌致病',W7+'#section-sal-clin')),
 ('布氏桿菌症', '沒有外毒素；urease、低內毒性 LPS、VirB（第四型分泌系統）、erythritol', '緩衝胃酸、逃避免疫、細胞內複製、偏好生殖組織', MUST, src('第7週・布氏桿菌症',W7+'#section-br')),
 ('Glässer 病', '講義沒列特定毒素；莢膜、LOS、生物膜', '躲避吞噬、侵入內皮細胞 → 漿膜發炎', SUP, src('第6週・Glässer 病',W6+'#section-gp-agent')),
]
def table(head_cols,body):
    h=''.join(f'<th>{c}</th>' for c in head_cols)
    b=''.join('<tr>'+''.join(f'<td>{c}</td>' for c in r)+'</tr>' for r in body)
    return f'<div class="table-wrap"><table><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table></div>'
t1=table(['疾病（病原）','招牌毒素／因子','作用','標記','回到筆記'],rows)
mode=[
 ('在細胞膜打洞（RTX 家族）','Apx、<em>E. coli</em> HlyA','溶血、殺細胞；103 年國考「Apx 機制接近 HlyA」',src('第6週',W6+'#section-app-path')),
 ('讓腸道過度分泌','LT（cAMP）、STa（cGMP）、STb','分泌性下痢，絨毛不萎縮；LT 機制接近霍亂毒素',src('第6週',W6+'#section-ec-neo')),
 ('傷血管內皮','Stx2e','水腫病；不是讓 cAMP 上升的毒素（那是 LT）',src('第6週',W6+'#section-ec-pwd')),
 ('傷骨頭','DNT、PMT、osteotoxin','萎縮性鼻炎；PMT 才是永久進行性（PAR）的主因',src('第6週',W6+'#section-ar-path')),
 ('殺纖毛、干擾吞噬細胞','TCT、腺苷酸環化酶－溶血素','清不掉細菌',src('第6週',W6+'#section-ar-path')),
 ('剝皮（表皮剝落）','ExhA／B、ShetA／B','滲出性表皮炎；類似人類 SSSS',src('第7週',W7+'#section-ee')),
 ('沒有毒素，靠侵入或躲避','沙門氏菌（T3SS）、布氏桿菌（VirB T4SS）、豬丹毒（neuraminidase）','不要硬想成毒素',src('第7週',W7+'#section-compare')),
]
t2=table(['作用方式','毒素','重點','回到筆記'],mode)
trap=[
 ('114 年','問「不是 B. bronchiseptica 的致病因子」','EFT（表皮剝落毒素）','EFT 是 S. hyicus 的毒素，放在 Bb 選項裡混淆',src('國考題 #114-2#15',EX+'#section-s5')),
 ('105 年','問滲出性表皮炎的毒素','ExhA／ExhB','ShetC／D、PmtA／B、Stx2e／Stx2d 都不是',src('國考題 #105-1#6',EX+'#section-s8')),
 ('103 年','Apx 作用機制接近哪個毒素','E. coli HlyA','LT、exotoxin A、破傷風毒素作用方式不同',src('國考題 #103-2#3',EX+'#section-s5')),
 ('105 年','ApxIII 的特性','不溶血、細胞毒性強','「ApxIII 具有較強溶血性」是錯的',src('國考題 #105-1#5',EX+'#section-s5')),
 ('106 年（考古）','水腫病的致病機制','Stx2e 傷血管內皮','「造成 cAMP 上升的毒素」是 LT，不是水腫病',src('國考題 #106-1#2',EX+'#section-s6')),
 ('115 年','萎縮性鼻炎最主要的致病毒素','P. multocida 的 PMT','Bordetella 的 DNT 也傷骨，但只造成輕微可逆的 NPAR',src('國考題 #115-2#14',EX+'#section-s5')),
]
t3=table(['年份','題目問什麼','答案','陷阱','回到題目'],trap)
body=f'''
<div class="section" id="section-tox"><div class="section-head"><div class="section-num">1</div><h2>毒素與細菌病總表（按疾病）</h2></div>
<p>每個病只有一兩個招牌毒素。<strong>怎麼用：</strong>看到毒素名稱，先問「這是哪個病的？」再問「作用在哪？」兩個都對才選。標記：{MUST}＝講義畫底線或國考出過；{TRAP}＝國考常拿來混淆；{SUP}＝講義沒寫、我補的。</p>
{t1}
<p>「沒有外毒素」是依講義列出的毒力因子判斷：講義沒有明說沒有毒素，但也沒列任何毒素。</p></div>
<div class="section" id="section-mode"><div class="section-head"><div class="section-num">2</div><h2>按作用方式整理</h2></div>
<p>換個角度記：不背名字，先記毒素在做什麼。</p>
{t2}</div>
<div class="section" id="section-trap"><div class="section-head"><div class="section-num">3</div><h2>國考陷阱對照：把毒素放錯病</h2></div>
<p>出題慣用手法是把 A 病的毒素放進 B 病的選項。下面是曾經出過的例子。</p>
{t3}
<footer class="note-footer">本頁為個人課堂筆記整理，僅供學習與複習使用，不作為正式診斷依據。統整為依講義與歷屆國考整理，「必考」「陷阱」標記是依考古題方向判斷，實際以老師上課為準。</footer></div>
'''
toc='''<nav class="toc"><div class="section-label">統整表格</div>
<a class="active" onclick="showSection('tox')" id="nav-tox"><span class="nav-icon">1</span> 毒素與細菌病（按疾病）</a>
<a onclick="showSection('mode')" id="nav-mode"><span class="nav-icon">2</span> 按作用方式</a>
<a onclick="showSection('trap')" id="nav-trap"><span class="nav-icon">3</span> 國考陷阱對照</a></nav>'''
ph='''<section class="pagehead"><div class="pagehead__inner">
<div class="breadcrumb"><a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="../index.html">國考</a><span class="sep">›</span><a href="index.html">獸醫傳染病學</a><span class="sep">›</span><span class="current">統整表格</span></div>
<div class="page-head"><h1 class="page-title">統整表格</h1><p class="page-subtitle">把分散在各週講義的內容整理成跨章節對照表；每列都連回原筆記</p></div>
<div class="meta-bar"><div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">國考・獸醫傳染病學</div></div>
<div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">豬病學第 6、7 週講義與歷屆國考</div></div>
<div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">持續新增表格</div></div></div></div></section>
'''
page=head+ph+'<div class="pagewrap">'+toc+'<main class="pagebody">'+body+'</main></div>\n'+tail
tail2=page
open(base+'統整表格.html','w',encoding='utf-8').write(page)
print(len(page))
