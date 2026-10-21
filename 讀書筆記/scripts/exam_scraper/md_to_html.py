"""把 <動物別>_國考題彙整.md 轉成網站內頁 HTML（用法：python md_to_html.py in.md out.html 標題 科目）"""
import re,sys,html
src,out,title,subj=sys.argv[1:5]
EXPDIR=sys.argv[5] if len(sys.argv)>5 else None
import glob,os
t=open(src,encoding='utf-8').read()
e=html.escape
secs=[]
for s in re.split(r'\n## ',t)[1:]:
    head,body=s.split('\n',1); qs=[]
    for b in body.split('\n---\n'):
        m=re.search(r'\*（([^）]*)）\*\n\n(.*?)\n\n((?:- [A-D]\. [^\n]*\n?)+)(.*)',b,re.S)
        if not m: continue
        opts=re.findall(r'- ([A-D])\. (.*)',m.group(3)); rest=m.group(4)
        a=re.search(r'\*\*官方答案：([^*]*)\*\*(（[^）]*）)?',rest); img=re.search(r'第 (\S+) 頁',rest)
        qs.append((m.group(1),m.group(2).strip(),opts,a.group(1) if a else '',a.group(2) or '' if a else '',img.group(1) if img else None))
    secs.append((head,qs))
EXP={}
if EXPDIR:
    for f in sorted(glob.glob(os.path.join(EXPDIR,'s*.txt'))):
        for ln in open(f,encoding='utf-8').read().split('\n'):
            if ln.strip(): k,_,v=ln.partition('|'); EXP[k]=v
def key_of(label):
    m=re.match(r'(\d+)年第(.)次・第(\d+)題',label); return f"{m.group(1)}-{'1' if m.group(2)=='一' else '2'}#{m.group(3)}"
QS={}
for _,qs in secs:
    for lab,q,opts,a,note,pg in qs: QS[key_of(lab)]=(q,opts)
import unicodedata
def normo(o): return [re.sub(r'[\W_]+','',unicodedata.normalize('NFKC',v)).lower() for _,v in o] if o else o
import difflib
def similar(a,b):
    if not a or not b: return False
    x,y=normo(a),normo(b)
    return all(u==v or (len(u)>3 and difflib.SequenceMatcher(None,u,v).ratio()>=0.6) for u,v in zip(x,y))
def resolve(k,seen=()):
    v=EXP.get(k)
    if v is None: return None
    if v.startswith('='):
        t=v[1:]
        if not similar(QS.get(t,(0,0))[1],QS.get(k,(0,0))[1]): print('ALIAS MISMATCH',k,t,QS.get(k,(0,0))[1],QS.get(t,(0,0))[1]); return None
        return resolve(t)
    return v
missing=[k for k in QS if resolve(k) is None]
bad=[k for k in QS if resolve(k) and len(resolve(k).split('|'))!=5]
extra=[k for k in EXP if k not in QS]
print('explained',len(QS)-len(missing),'missing',len(missing),'bad',bad,'extra',extra)
open('/tmp/missing_keys.txt','w').write('\n'.join(missing))
tpl=open(os.environ.get('TPL','DVM-note/大四上/豬病學/期中總複習.html'),encoding='utf-8').read()  # 模板：任一內頁（深度同 大四上/<科目>/）
top=tpl[:tpl.index('<section class="pagehead">')].replace('豬病學期中總複習',title)
tail=tpl[tpl.index('<script>\nfunction showSection'):]
tail=tail[:tail.index('const SECTION_NAMES')]+"</script>\n"+tpl[tpl.index('<script src="../../assets/nav-data.js">'):]
total=sum(len(q) for _,q in secs)
toc='';main=''
for i,(h,qs) in enumerate(secs):
    sid=f's{i}'; name=re.sub(r'（\d+ 題）$','',h)
    toc+=f'<a onclick="showSection(\'{sid}\')" id="nav-{sid}"><span class="nav-icon">{i+1}</span> {e(name)}（{len(qs)}）</a>\n'
    main+=f'<div class="section" id="section-{sid}"><div class="section-head"><div class="section-num">{i+1}</div><h2>{e(name)}</h2></div>\n<p>{len(qs)} 題。答案預設隱藏，點「顯示答案」展開。</p>\n'
    for src_,q,opts,a,note,pg in qs:
        main+=f'<div class="quiz-item"><span class="quiz-type quiz-type-mcq">{e(src_)}</span><div class="quiz-q">{e(q)}</div><ul class="quiz-options">'
        main+=''.join(f'<li>({k}) {e(v)}</li>' for k,v in opts)+'</ul>'
        if pg: main+=f'<p class="quiz-explain">本題含圖，請對照原卷第 {e(pg)} 頁。</p>'
        ex=resolve(key_of(src_)); expl=''
        if ex:
            f=ex.split('|'); ans=a.replace('或','').replace('、','')
            lis=''.join(f'<li{" style=\"font-weight:600\"" if L in ans else ""}><strong>({L})</strong> {e(f[i+1])}</li>' for i,L in enumerate('ABCD'))
            expl=f'<p class="quiz-explain"><strong>解析</strong>：{e(f[0])}</p><ul style="margin:.4em 0 0;padding-left:1.2em;list-style:none">{lis}</ul>'
        main+=f'<details class="quiz-reveal"><summary></summary><div class="quiz-answer correct">官方答案：{e(a) if a else "尚未取得"}{e(note)}</div>{expl}</details></div>\n'
    main+='</div>\n'
page=top+f'''<section class="pagehead"><div class="pagehead__inner">
<div class="breadcrumb"><a href="../../index.html">網頁筆記首頁</a><span class="sep">›</span><a href="index.html">{subj}</a><span class="sep">›</span><span class="current">{title}</span></div>
<div class="page-head"><h1 class="page-title">{title}</h1><p class="page-subtitle">專技高考獸醫師「獸醫傳染病學」民國 97–115 年，依疾病分組・只有題目與官方答案，含詳解</p></div>
<div class="meta-bar">
<div class="meta-item"><div class="meta-label">科目</div><div class="meta-value">{subj}</div></div>
<div class="meta-item"><div class="meta-label">資料來源</div><div class="meta-value">考選部考畢試題查詢平台</div></div>
<div class="meta-item"><div class="meta-label">題數</div><div class="meta-value">{total}（關鍵字自動篩選，可能漏題或誤收）</div></div>
<div class="meta-item"><div class="meta-label">整理狀態</div><div class="meta-value">原始題庫</div></div></div></div></section>
<div class="pagewrap"><nav class="toc"><div class="section-label">疾病分組</div>
{toc}</nav><main class="pagebody">
{main}<footer class="note-footer">本頁為個人課堂筆記整理，僅供學習與複習使用，不作為正式診斷依據。題目來源：考選部公開試題；100 年第一次與 115 年第二次官方答案尚未取得。</footer>
</main></div>
'''+tail
open(out,'w',encoding='utf-8').write(page)
print(total,len(secs))
