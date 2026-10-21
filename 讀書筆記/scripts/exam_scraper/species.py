# 動物別篩選設定：strong 比對題幹；weak 只比對選項；diseases 為依題幹分組（先符合先歸類）
SPECIES={
'禽病學':{
 'strong':r'雞|鴨|鵝|火雞|禽|鳥|鸚鵡|鴿|鵪鶉|產蛋|種蛋|蛋殼|chicken|poultry|avian|\bducks?\b|\bgeese\b|goose|turkey|fowl|broiler|layer hen|psittac|budgerigar|parrot|pigeon|quail|新城病|Newcastle|馬立克|Marek|華氏囊|法氏囊|[Bb]ursal|Gumboro|喉頭氣管炎|laryngotracheitis|網狀內皮|[Rr]eticuloendotheliosis|雛白痢|pullorum|gallinarum|傳染性鼻炎|coryza|paragallinarum|組織滴蟲|Histomonas|住白血球|Leucocytozoon|Riemerella|anatipestifer',
 'weak':r'雞|鴨|鵝|禽|avian|chicken|poultry',
 'answer_group':True,
 'diseases':[
  ('禽流感（Avian Influenza, AI）',r'禽流感|家禽流行性感冒|雞瘟|avian influenza|\bAI\b|\bHPAI|\bLPAI|H5N|H7N|H9N|流行性感冒|influenza|IVPI'),
  ('禽痘與禽間質肺炎病毒（Pox／aMPV）',r'腫頭症|肺病毒|pneumovirus|鼻氣管炎|禽痘|雞痘|fowl ?pox|avipox|痘|間質肺炎|metapneumo|腫頭症|swollen head'),
  ('新城病（Newcastle Disease, ND）',r'新城|Newcastle|\bNDV?\b|APMV|副黏液|paramyxo|ICPI|MDT|La ?Sota|B1株'),
  ('傳染性支氣管炎（Infectious Bronchitis, IB）',r'傳染性支氣管炎|infectious bronchitis|\bIBV?\b|冠狀|coronavirus'),
  ('傳染性喉頭氣管炎（Infectious Laryngotracheitis, ILT）',r'喉頭氣管炎|laryngotracheitis|\bILTV?\b'),
  ('馬立克病（Marek\'s Disease, MD）',r'馬立克|Marek|\bMDV?\b|HVT|火雞疱疹'),
  ('禽白血病與網狀內皮增生症（ALV／REV）',r'白血病|leukosis|\bALV|網狀內皮|reticuloendotheliosis|\bREV\b|骨髓細胞瘤|淋巴性白血'),
  ('傳染性華氏囊病（IBD）與雞傳染性貧血（CIA）',r'華氏囊|法氏囊|[Bb]ursal|Gumboro|\bIBDV?\b|傳染性貧血|chicken (infectious )?anemia|\bCIAV?\b|\bCAV\b|圓環|環狀病毒|[Cc]ircovir|Gyrovirus'),
  ('呼腸孤病毒、腺病毒、禽腦脊髓炎（Reo／Adeno／AE）',r'呼腸孤|里奧|直升機病|helicopter|蒼白鳥|reovirus|病毒性關節炎|腱鞘炎|tenosynovitis|吸收不良|腺病毒|adenovirus|產蛋下降症|EDS|包涵體肝炎|inclusion body hepatitis|心包積水|hydropericardium|腦脊髓炎|encephalomyelitis|震顫'),
  ('水禽病毒病（鴨病毒性肝炎、鴨瘟、鵝／番鴨小病毒等）',r'鴨病毒性肝炎|duck (viral )?hepatitis|鴨瘟|duck plague|duck virus enteritis|小病毒|parvovirus|Derzsy|鵝|番鴨|鴨'),
  ('寵物鳥疾病（PBFD、多瘤病毒、PDD、鸚鵡熱等）',r'鸚鵡|psittac|喙羽|PBFD|多瘤|polyoma|腺胃擴張|PDD|bornavirus|玻那|鳥疫|披衣菌|Chlamydi|budgerigar|parrot|鴿'),
  ('其他禽病毒（星狀病毒、輪狀病毒、火雞腸炎等）',r'星狀|astrovirus|輪狀|rotavirus|藍冠病|火雞.{0,6}腸炎|poult enteritis|stunting|東方馬腦炎|torovirus'),
  ('細菌性疾病（沙門氏、大腸桿菌、黴漿菌、家禽霍亂、傳染性鼻炎、梭菌、葡萄球菌、結核、漿膜炎）',r'雷氏|new duck|慢性呼吸器|可利查|副嗜血|肉毒|軟頸|botulism|彎曲桿菌|Campylobacter|滑膜炎|synoviae|gallinarum|潰瘍性腸炎|ulcerative enteritis|壞疽性皮|Hjarre|bumble|沙門|Salmonella|雛白痢|pullorum|gallinarum|雞傷寒|大腸桿菌|E\. ?coli|Escherichia|黴漿菌|Mycoplasma|霍亂|cholera|Pasteurella|multocida|傳染性鼻炎|coryza|Avibacterium|paragallinarum|Haemophilus|梭菌|Clostridi|壞死性腸炎|葡萄球菌|Staphylococc|結核|tuberculosis|Mycobacter|漿膜炎|Riemerella|anatipestifer|丹毒|Erysipelothrix|鏈球菌|Streptococc|螺旋體|Borrelia|Ornithobacterium|Bordetella'),
  ('黴菌與寄生蟲（麴菌、球蟲、組織滴蟲、住白血球蟲等）',r'黑頭|histomon|cryptospor|白冠病|住血原蟲|開嘴蟲|吸蟲|鞭毛蟲|盲腸蟲|糞桿線蟲|Eimeria|黴菌毒素|黃麴|[Aa]flatoxin|Citrinin|Dactylaria|Microspor|麴菌|Aspergill|念珠|Candida|黴菌|真菌|fung|球蟲|Eimeria|組織滴蟲|Histomonas|黑頭病|住白血球|Leucocytozoon|瘧|Plasmodium|毛滴蟲|Trichomon|寄生蟲|線蟲|蛔蟲|絛蟲|蟎|蝨|隱孢子'),
 ]},
'豬病學':{
 'strong':r'豬|仔豬|母豬|猪|swine|porcine|\bpigs?\b|hog|PRRS|PEDV?|TGE|PCV|\bASF|\bCSF|Suid|pseudorabies|Aujeszky|Sus scrofa|Brachyspira|Lawsonia|Actinobacillus pleuropneumoniae|Mycoplasma hyo|Glässer|Glasser|Streptococcus suis|Erysipelothrix|Haemophilus parasuis|Bordetella|Taenia solium|有鉤絛蟲|旋毛蟲|Trichinella|Nipah|立百|日本腦炎|Japanese encephalitis|Menangle|Teschen|血球凝集腦脊髓炎|hemagglutinating encephalomyelitis|Seneca',
 'weak':r'豬|swine|porcine',
 'diseases':[
  ('豬瘟（Classical Swine Fever, CSF）與非洲豬瘟（ASF）',r'豬瘟|非洲豬瘟|classical swine fever|African swine fever|CSF|ASF|hog cholera|Pestivirus|pestivirus|瘟病毒'),
  ('豬生殖與呼吸綜合症（PRRS）',r'生殖與呼吸|PRRS|藍耳|blue ear|Arteri|動脈炎'),
  ('假性狂犬病（Pseudorabies）',r'假性狂犬|偽狂犬|pseudorabies|Aujeszky|Suid herpes'),
  ('豬流行性下痢（PED）／傳染性胃腸炎（TGE）／豬冠狀病毒',r'流行性下痢|PED|傳染性胃腸炎|TGE|冠狀病毒|coronavirus|血球凝集腦脊髓炎|hemagglutinating encephalomyelitis|嘔吐衰弱'),
  ('豬圓環病毒（PCV）／豬細小病毒／其他豬病毒',r'圓環|circovirus|PCV|細小|parvovirus|小DNA|DNA ?病毒|豬痘|swinepox|豬水疱|水疱病|Seneca|vesicular|口蹄疫|FMD|腸病毒|Teschen|Talfan|立百|Nipah|Menangle|日本腦炎|Japanese encephalitis|輪狀|rotavirus|巨細胞|cytomegalovirus|內源性反轉錄|pestivirus|流感|influenza|豬瘟'),
  ('豬細菌性呼吸道疾病（胸膜肺炎、氣喘病、萎縮性鼻炎、格拉瑟氏病）',r'胸膜肺炎|pleuropneumoniae|萎縮性鼻炎|atrophic rhinitis|Bordetella|toxigenic|氣喘病|hyopneumoniae|黴漿菌|Mycoplasma|Glässer|Glasser|parasuis|格拉瑟|多發性漿膜炎|Pasteurella'),
  ('豬細菌性消化道／全身性疾病（大腸桿菌、沙門氏菌、增生性腸病、豬痢疾、丹毒、鏈球菌）',r'水腫病|大腸桿菌|E\. ?coli|Escherichia|沙門|Salmonella|增生性腸病|Lawsonia|Brachyspira|豬痢疾|螺旋體|豬丹毒|丹毒|Erysipelothrix|鏈球菌|Streptococcus|豬赤痢|赤痢|梭菌|Clostridi|Listeria|李斯特|腸毒血|布氏桿菌|Brucella|鉤端螺旋|Leptospira'),
  ('豬寄生蟲與人畜共通（旋毛蟲、有鉤絛蟲等）',r'旋毛蟲|Trichinella|有鉤絛蟲|Taenia|囊蟲|Cysticercus|蛔蟲|Ascaris|Toxoplasma|弓[漿蟲]|球蟲|Isospora|Balantidium|寄生蟲|蟲體|蟲卵'),
 ]},
}
